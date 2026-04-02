import React, { useState, useRef, useCallback } from "react";

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

/* ─── CANVAS HELPERS ─────────────────────────────────────────────── */

function measureWrappedLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawTracked(ctx, text, cx, y, tracking) {
  // Simulate letter-spacing by drawing char by char
  const chars = [...text];
  const widths = chars.map(c => ctx.measureText(c).width);
  const totalW = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1);
  let x = cx - totalW / 2;
  const savedAlign = ctx.textAlign;
  ctx.textAlign = "left";
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + tracking;
  });
  ctx.textAlign = savedAlign;
}

async function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function renderToCanvas(canvas, { userText, trackName, dayNumber, scriptureRef, isLastDay, format }) {
  const W = 1080;
  const H = format === "stories" ? 1920 : 1080;
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Wait for fonts the page has already loaded
  await document.fonts.ready;

  // ── Background ──
  ctx.fillStyle = "#0A0907";
  ctx.fillRect(0, 0, W, H);

  // Warm center glow
  const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.72);
  glow.addColorStop(0, "rgba(201,168,76,0.09)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Outer border ──
  const MARGIN = 52;
  ctx.strokeStyle = "rgba(201,168,76,0.22)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);

  const isStory = format === "stories";
  const cx = W / 2;

  // ── Vertical layout regions ──
  const topZone   = isStory ? 0.18 : 0.20;   // eyebrow sits here (fraction of H)
  const midZone   = isStory ? 0.46 : 0.47;   // user text centered here
  const refZone   = isStory ? 0.64 : 0.68;   // scripture ref
  const bottomY   = H - (isStory ? 108 : 80);

  // ── Day 6: "Armor Up." header ──
  if (isLastDay) {
    ctx.fillStyle = "#C9A84C";
    ctx.font = `italic ${isStory ? 88 : 72}px 'Cormorant Garamond', serif`;
    ctx.textAlign = "center";
    ctx.fillText("Armor Up.", cx, H * topZone - (isStory ? 56 : 40));
  }

  // ── Track + day eyebrow ──
  const eyebrowText = isLastDay
    ? `${trackName.toUpperCase()} · COMPLETE`
    : `${trackName.toUpperCase()} · DAY ${dayNumber}`;
  ctx.fillStyle = "#C9A84C";
  ctx.font = `700 ${isStory ? 27 : 23}px 'Barlow Condensed', sans-serif`;
  ctx.textAlign = "center";
  drawTracked(ctx, eyebrowText, cx, H * topZone, 7);

  // ── Rule beneath eyebrow ──
  const ruleY = H * topZone + (isStory ? 22 : 18);
  const ruleW = isStory ? 72 : 56;
  ctx.strokeStyle = "rgba(201,168,76,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - ruleW, ruleY);
  ctx.lineTo(cx + ruleW, ruleY);
  ctx.stroke();

  // ── User text (centered block) ──
  const userSize   = isStory ? 72 : 58;
  const userLineH  = isStory ? 104 : 82;
  const userMaxW   = W - (isStory ? 220 : 180);
  const displayText = userText.trim() || "…";

  ctx.font = `italic ${userSize}px 'Cormorant Garamond', serif`;
  ctx.textAlign = "center";
  const lines = measureWrappedLines(ctx, displayText, userMaxW);
  const blockH = (lines.length - 1) * userLineH;
  const textStartY = H * midZone - blockH / 2;

  // Soft glow behind text block
  const textGlow = ctx.createRadialGradient(cx, H * midZone, 0, cx, H * midZone, isStory ? 380 : 300);
  textGlow.addColorStop(0, "rgba(201,168,76,0.06)");
  textGlow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = textGlow;
  ctx.fillRect(0, H * midZone - (isStory ? 380 : 300), W, (isStory ? 760 : 600));

  ctx.fillStyle = "rgba(250,248,245,0.93)";
  ctx.font = `italic ${userSize}px 'Cormorant Garamond', serif`;
  lines.forEach((line, i) => {
    ctx.fillText(line, cx, textStartY + i * userLineH);
  });

  // ── Scripture reference ──
  if (scriptureRef) {
    ctx.fillStyle = "rgba(250,248,245,0.36)";
    ctx.font = `400 ${isStory ? 23 : 19}px 'Barlow Condensed', sans-serif`;
    ctx.textAlign = "center";
    drawTracked(ctx, "— " + scriptureRef + " —", cx, H * refZone, 3);
  }

  // ── Helmet icon + URL ──
  const helmetImg = await loadImage("/helmet.png");
  const iconSize = isStory ? 30 : 24;
  const iconX = cx - (helmetImg ? iconSize / 2 : 0) - (helmetImg ? 52 : 0);

  if (helmetImg) {
    ctx.globalAlpha = 0.28;
    // Invert: draw white on dark — use composite or just filter with off-screen
    // Draw normally (helmet.png is likely dark; we'll tint by compositing)
    const offscreen = document.createElement("canvas");
    offscreen.width  = iconSize;
    offscreen.height = iconSize;
    const oct = offscreen.getContext("2d");
    oct.drawImage(helmetImg, 0, 0, iconSize, iconSize);
    oct.globalCompositeOperation = "source-atop";
    oct.fillStyle = "#FAF8F5";
    oct.fillRect(0, 0, iconSize, iconSize);
    ctx.drawImage(offscreen, cx - iconSize / 2, bottomY - iconSize * 0.85, iconSize, iconSize);
    ctx.globalAlpha = 1;
  }

  const urlY = helmetImg ? bottomY + (isStory ? 18 : 14) : bottomY;
  ctx.fillStyle = "rgba(201,168,76,0.32)";
  ctx.font = `400 ${isStory ? 18 : 15}px 'Barlow Condensed', sans-serif`;
  ctx.textAlign = "center";
  drawTracked(ctx, "COUNTERFORMED.COM", cx, urlY, 4);
}

/* ─── COMPONENT ──────────────────────────────────────────────────── */

export function FormationShareable({ trackName, dayNumber, scriptureRef, isLastDay }) {
  const [input,      setInput]     = useState("");
  const [format,     setFormat]    = useState("stories");
  const [preview,    setPreview]   = useState(null);
  const [generating, setGenerating] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const canvasRef = useRef(null);

  const prompt = isLastDay
    ? "What is the one thing God showed you this week?"
    : "What is the one thing God showed you today?";

  const generate = useCallback(async () => {
    if (!input.trim() || generating) return;
    setGenerating(true);
    try {
      await renderToCanvas(canvasRef.current, {
        userText: input.trim(),
        trackName,
        dayNumber,
        scriptureRef,
        isLastDay,
        format,
      });
      setPreview(canvasRef.current.toDataURL("image/png"));
    } finally {
      setGenerating(false);
    }
  }, [input, trackName, dayNumber, scriptureRef, isLastDay, format, generating]);

  const download = useCallback(() => {
    if (!preview) return;
    const slug = trackName.toLowerCase().replace(/\s+/g, "-");
    const a = document.createElement("a");
    a.href = preview;
    a.download = `cf-${slug}-day${dayNumber}-${format}.png`;
    a.click();
  }, [preview, trackName, dayNumber, format]);

  const share = useCallback(async () => {
    if (!preview) return;
    try {
      const blob = await (await fetch(preview)).blob();
      const file = new File([blob], `counter-formation-day${dayNumber}.png`, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Counter Formation" });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "Counter Formation", url: window.location.href });
        return;
      }
    } catch {
      // intentional fall-through to download
    }
    download();
  }, [preview, dayNumber, download]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
  };

  return (
    <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "2.5rem" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* ── Label ── */}
      <p style={{ ...barlow, fontSize: "9px", letterSpacing: ".44em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "1.1rem" }}>
        Declare
      </p>

      {/* ── Prompt ── */}
      <p style={{ ...garamond, fontStyle: "italic", fontSize: "22px", color: "rgba(250,248,245,0.72)", lineHeight: 1.65, marginBottom: "1.5rem" }}>
        {prompt}
      </p>

      {/* ── Input ── */}
      <textarea
        value={input}
        onChange={e => { setInput(e.target.value); setPreview(null); }}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onKeyDown={handleKeyDown}
        rows={3}
        maxLength={200}
        placeholder="Write it down. Not for anyone else."
        style={{
          ...garamond,
          fontStyle: "italic",
          width: "100%",
          background: "#17140F",
          border: `1px solid ${inputFocused ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          color: "#FAF8F5",
          fontSize: "18px",
          lineHeight: 1.65,
          resize: "none",
          outline: "none",
          transition: "border-color .2s",
          boxSizing: "border-box",
          marginBottom: "1rem",
          display: "block",
        }}
      />

      {/* ── Controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        {/* Format toggle */}
        <div style={{
          display: "flex",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "999px",
          padding: "3px",
        }}>
          {[{ key: "stories", label: "Stories 9:16" }, { key: "feed", label: "Feed 1:1" }].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setFormat(key); setPreview(null); }}
              style={{
                ...barlow,
                padding: "6px 16px",
                borderRadius: "999px",
                border: "none",
                background: format === key ? "rgba(201,168,76,0.14)" : "transparent",
                color: format === key ? "#C9A84C" : "rgba(250,248,245,0.28)",
                fontSize: "8px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Generate */}
        <button
          onClick={generate}
          disabled={!input.trim() || generating}
          style={{
            ...barlow,
            padding: "10px 28px",
            borderRadius: "999px",
            border: "none",
            background: (!input.trim() || generating) ? "rgba(201,168,76,0.22)" : "#C9A84C",
            color: (!input.trim() || generating) ? "rgba(10,10,10,0.4)" : "#0A0A0A",
            fontSize: "9px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            fontWeight: 700,
            cursor: (!input.trim() || generating) ? "not-allowed" : "pointer",
            transition: "background .2s, color .2s",
          }}
          onMouseEnter={e => { if (input.trim() && !generating) e.currentTarget.style.background = "#FAF8F5"; }}
          onMouseLeave={e => { if (input.trim() && !generating) e.currentTarget.style.background = "#C9A84C"; }}
        >
          {generating ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* ── Preview + actions ── */}
      {preview && (
        <div style={{ marginTop: "2rem" }}>
          <div style={{
            display: "inline-block",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid rgba(201,168,76,0.18)",
            maxWidth: format === "stories" ? "200px" : "300px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}>
            <img
              src={preview}
              alt="Formation card preview"
              style={{ display: "block", width: "100%", height: "auto" }}
            />
          </div>

          <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.18)", margin: "10px 0 14px" }}>
            1080 × {format === "stories" ? "1920" : "1080"} · PNG
          </p>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={download}
              style={{
                ...barlow,
                padding: "10px 24px",
                borderRadius: "999px",
                border: "none",
                background: "#C9A84C",
                color: "#0A0A0A",
                fontSize: "9px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                fontWeight: 700,
                cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FAF8F5"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#C9A84C"; }}
            >
              Save PNG
            </button>

            <button
              onClick={share}
              style={{
                ...barlow,
                padding: "10px 24px",
                borderRadius: "999px",
                border: "1px solid rgba(201,168,76,0.4)",
                background: "transparent",
                color: "#C9A84C",
                fontSize: "9px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "border-color .2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)"; }}
            >
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
