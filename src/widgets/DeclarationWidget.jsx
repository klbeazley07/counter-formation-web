import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "cf-declaration";

const C = {
  gold:       "#C9A84C",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldGlow:   "rgba(201,168,76,0.06)",
  goldBorder: "rgba(201,168,76,0.2)",
  goldDiv:    "rgba(201,168,76,0.1)",
  goldFocus:  "rgba(201,168,76,0.4)",
  goldHair:   "rgba(201,168,76,0.12)",
  darkBg:     "#06050A",
  inputBg:    "#17140F",
  ivory:      "#FAF8F5",
  ivoryCard:  "rgba(250,248,245,0.9)",
  ivoryMuted: "rgba(250,248,245,0.55)",
  ivoryDim:   "rgba(250,248,245,0.35)",
  ivoryFaint: "rgba(250,248,245,0.18)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const PLACEHOLDERS = [
  "My standing before God is not based on my performance.",
  "There is no condemnation for me.",
  "I have nothing that I did not receive.",
  "I am God\u2019s child. That is what I am.",
  "I live from love, not for love.",
];

const MAX_STATEMENTS = 5;
const MIN_STATEMENTS = 3;

/* ─── DECLARATION WIDGET ──────────────────────────────────────────── */

export function DeclarationWidget() {
  const [statements, setStatements] = useState(["", "", ""]);
  const [focusIdx,   setFocusIdx]   = useState(null);
  const [hoverIdx,   setHoverIdx]   = useState(null);
  const [card,       setCard]       = useState(null);
  const [copied,     setCopied]     = useState(false);
  const debounceRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Ensure at least MIN_STATEMENTS slots
          const padded = [...parsed];
          while (padded.length < MIN_STATEMENTS) padded.push("");
          setStatements(padded);
        }
      }
    } catch {}
  }, []);

  // Debounced save on every change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));
      } catch {}
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [statements]);

  const handleChange = (i, val) => {
    setStatements(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
    // Invalidate card on edit
    setCard(null);
  };

  const handleAdd = () => {
    if (statements.length >= MAX_STATEMENTS) return;
    setStatements(prev => [...prev, ""]);
  };

  const handleRemove = (i) => {
    if (statements.length <= MIN_STATEMENTS) return;
    setStatements(prev => prev.filter((_, idx) => idx !== i));
    setCard(null);
  };

  const handleGenerate = () => {
    const filled = statements.map(s => s.trim()).filter(Boolean);
    if (filled.length === 0) return;
    setCard(filled);
    // Save on generate (flush debounce)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(statements));
    } catch {}
  };

  const handleCopy = () => {
    const filled = statements.map(s => s.trim()).filter(Boolean);
    if (filled.length === 0) return;
    const text = filled.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputStyle = (focused) => ({
    ...garamond,
    fontStyle:    "italic",
    width:        "100%",
    boxSizing:    "border-box",
    background:   C.inputBg,
    border:       `1px solid ${focused ? C.goldFocus : C.goldFaint}`,
    borderRadius: "10px",
    padding:      "10px 14px",
    color:        C.ivory,
    fontSize:     "15px",
    lineHeight:   1.5,
    outline:      "none",
    transition:   "border-color .2s",
  });

  const canAddMore = statements.length < MAX_STATEMENTS;
  const hasContent = statements.some(s => s.trim());

  return (
    <div style={{
      background:   C.goldGlow,
      border:       `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow:     "hidden",
    }}>
      <style>{`
        .decl-remove-btn { opacity: 0; transition: opacity .15s; }
        .decl-input-row:hover .decl-remove-btn { opacity: 1; }
        .decl-remove-btn:focus { opacity: 1; }
        .decl-add-btn:hover { opacity: 0.7 !important; }
        .decl-generate-btn:hover { background: #FAF8F5 !important; }
        .decl-copy-btn:hover { background: rgba(201,168,76,0.08) !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "1.75rem 1.75rem 1.25rem" }}>
        <p style={{
          ...barlow,
          fontSize:      "9px",
          letterSpacing: ".44em",
          textTransform: "uppercase",
          color:         C.gold,
          margin:        "0 0 6px 0",
        }}>
          Declaration Builder
        </p>
        <p style={{
          ...garamond,
          fontStyle:  "italic",
          fontSize:   "15px",
          color:      C.ivoryMuted,
          lineHeight: 1.5,
          margin:     0,
        }}>
          Write the truth you will speak over yourself each morning.
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.75rem" }} />

      {/* ── Statement Inputs ── */}
      <div style={{ padding: "1.5rem 1.75rem 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {statements.map((stmt, i) => (
            <div
              key={i}
              className="decl-input-row"
              style={{ position: "relative", display: "flex", alignItems: "center" }}
            >
              <input
                type="text"
                value={stmt}
                placeholder={PLACEHOLDERS[i % PLACEHOLDERS.length]}
                onChange={e => handleChange(i, e.target.value)}
                onFocus={() => setFocusIdx(i)}
                onBlur={() => setFocusIdx(null)}
                style={{
                  ...inputStyle(focusIdx === i),
                  // Leave room for remove button when it can appear
                  paddingRight: statements.length > MIN_STATEMENTS ? "36px" : "14px",
                }}
              />
              {/* Remove button — only available beyond initial 3 */}
              {statements.length > MIN_STATEMENTS && (
                <button
                  className="decl-remove-btn"
                  onClick={() => handleRemove(i)}
                  aria-label="Remove statement"
                  style={{
                    position:   "absolute",
                    right:      "10px",
                    top:        "50%",
                    transform:  "translateY(-50%)",
                    background: "none",
                    border:     "none",
                    padding:    "2px 4px",
                    cursor:     "pointer",
                    color:      C.ivoryDim,
                    fontSize:   "18px",
                    lineHeight: 1,
                    display:    "flex",
                    alignItems: "center",
                    transition: "color .15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.ivory; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.ivoryDim; }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ── Add Statement ── */}
        {canAddMore && (
          <button
            className="decl-add-btn"
            onClick={handleAdd}
            style={{
              ...barlow,
              background:    "none",
              border:        "none",
              padding:       "10px 0 0",
              fontSize:      "9px",
              letterSpacing: ".44em",
              textTransform: "uppercase",
              color:         C.gold,
              cursor:        "pointer",
              display:       "flex",
              alignItems:    "center",
              gap:           "6px",
              transition:    "opacity .15s",
              fontWeight:    700,
            }}
          >
            + Add Statement
          </button>
        )}
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ padding: "1.25rem 1.75rem 1.5rem", display: "flex", gap: "10px" }}>
        {/* Generate Card */}
        <button
          className="decl-generate-btn"
          onClick={handleGenerate}
          disabled={!hasContent}
          style={{
            ...barlow,
            flex:          1,
            padding:       "10px 18px",
            background:    hasContent ? C.gold : "rgba(201,168,76,0.25)",
            color:         hasContent ? "#0A0A0A" : "rgba(10,10,10,0.4)",
            border:        "none",
            borderRadius:  "999px",
            fontSize:      "9px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            cursor:        hasContent ? "pointer" : "not-allowed",
            fontWeight:    700,
            transition:    "background .2s",
          }}
        >
          Generate Card
        </button>

        {/* Copy Text */}
        <button
          className="decl-copy-btn"
          onClick={handleCopy}
          disabled={!hasContent}
          style={{
            ...barlow,
            flex:          1,
            padding:       "10px 18px",
            background:    "transparent",
            color:         hasContent ? C.gold : "rgba(201,168,76,0.35)",
            border:        `1px solid ${hasContent ? C.goldBorder : "rgba(201,168,76,0.1)"}`,
            borderRadius:  "999px",
            fontSize:      "9px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            cursor:        hasContent ? "pointer" : "not-allowed",
            fontWeight:    700,
            transition:    "background .2s",
          }}
        >
          {copied ? "Copied" : "Copy Text"}
        </button>
      </div>

      {/* ── Declaration Card ── */}
      {card && (
        <div style={{ padding: "0 1.75rem 1.75rem" }}>
          <div style={{
            background:   C.darkBg,
            border:       `1px solid ${C.goldBorder}`,
            borderRadius: "16px",
            padding:      "2rem",
            textAlign:    "center",
          }}>
            {/* Card Eyebrow */}
            <p style={{
              ...barlow,
              fontSize:      "9px",
              letterSpacing: ".44em",
              textTransform: "uppercase",
              color:         C.gold,
              margin:        "0 0 1.5rem 0",
            }}>
              My Morning Declaration
            </p>

            {/* Statements */}
            {card.map((stmt, i) => (
              <div key={i}>
                <p style={{
                  ...garamond,
                  fontStyle:  "italic",
                  fontSize:   "20px",
                  color:      C.ivoryCard,
                  lineHeight: 1.8,
                  margin:     0,
                  padding:    i === 0 ? "0 0 1rem" : "1rem 0",
                }}>
                  {stmt}
                </p>
                {/* Hairline divider between statements */}
                {i < card.length - 1 && (
                  <div style={{
                    height:     "1px",
                    background: C.goldHair,
                    margin:     "0 auto",
                    maxWidth:   "80%",
                  }} />
                )}
              </div>
            ))}

            {/* Armor Up */}
            <p style={{
              ...garamond,
              fontStyle:  "italic",
              fontSize:   "15px",
              color:      C.gold,
              margin:     "1.5rem 0 0",
              lineHeight: 1.5,
            }}>
              Armor Up.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
