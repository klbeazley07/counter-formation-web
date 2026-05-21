import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import html2canvas from "html2canvas";
import { useFormationProfile } from "./hooks/useFormationProfile";
import { buildDevotionContext } from "./utils/devotionContext";
import DevotionHistory from "./components/DevotionHistory";
import EmailCapture from "./components/auth/EmailCapture";
import NextStep from "./components/NextStep";
import { FRUITS } from "./content/loader";
import { withScriptureRefs } from "./utils/parseScriptureRefs";
import "./styles/devotion-guide.css";

/* ─── MARKDOWN RENDERERS ───────────────────────────────────────────
 * Override block-level markdown elements so any scripture reference in
 * AI-generated devotional text becomes an interactive ScriptureRef
 * (hover popover + Bible.com chapter link).
 */
const MARKDOWN_COMPONENTS = {
  p:          ({ node, children, ...props }) => <p {...props}>{withScriptureRefs(children)}</p>,
  li:         ({ node, children, ...props }) => <li {...props}>{withScriptureRefs(children)}</li>,
  blockquote: ({ node, children, ...props }) => <blockquote {...props}>{withScriptureRefs(children)}</blockquote>,
  h1:         ({ node, children, ...props }) => <h1 {...props}>{withScriptureRefs(children)}</h1>,
  h2:         ({ node, children, ...props }) => <h2 {...props}>{withScriptureRefs(children)}</h2>,
  h3:         ({ node, children, ...props }) => <h3 {...props}>{withScriptureRefs(children)}</h3>,
  h4:         ({ node, children, ...props }) => <h4 {...props}>{withScriptureRefs(children)}</h4>,
  h5:         ({ node, children, ...props }) => <h5 {...props}>{withScriptureRefs(children)}</h5>,
  h6:         ({ node, children, ...props }) => <h6 {...props}>{withScriptureRefs(children)}</h6>,
  em:         ({ node, children, ...props }) => <em {...props}>{withScriptureRefs(children)}</em>,
  strong:     ({ node, children, ...props }) => <strong {...props}>{withScriptureRefs(children)}</strong>,
};

/* ─── FIELD INPUT ─────────────────────────────────────────────────── */

function FieldInput({ label, hint, value, onChange, placeholder, multiline }) {
  const sharedStyle = {
    width: "100%",
    background: "#EEE7DA",
    border: `1px solid rgba(201,168,76,0.16)`,
    borderRadius: 16,
    padding: multiline ? "18px 20px" : "16px 20px",
    color: "#17140F",
    fontFamily: "'Barlow Condensed',sans-serif",
    fontSize: 14,
    letterSpacing: multiline ? "0.08em" : "0.14em",
    textTransform: multiline ? "none" : "uppercase",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
    transition: "border-color 0.2s, box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <p className="fg-section-kicker" style={{ marginBottom: 6 }}>{label}</p>
        {hint && (
          <p style={{
            margin: 0,
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: 16,
            lineHeight: 1.5,
            color: "var(--cf-ivory-58)",
          }}>
            {hint}
          </p>
        )}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className="dg-input"
          style={{ ...sharedStyle, resize: "vertical", minHeight: 136 }}
          onFocus={e => {
            e.target.style.borderColor = "var(--cf-gold)";
            e.target.style.background = "#F3EDE1";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(201,168,76,0.16)";
            e.target.style.background = "#EEE7DA";
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="dg-input"
          style={sharedStyle}
          onFocus={e => {
            e.target.style.borderColor = "var(--cf-gold)";
            e.target.style.background = "#F3EDE1";
          }}
          onBlur={e => {
            e.target.style.borderColor = "rgba(201,168,76,0.16)";
            e.target.style.background = "#EEE7DA";
          }}
        />
      )}
    </div>
  );
}

/* ─── MODE SELECTION ─────────────────────────────────────────────── */

function selectMode(profile) {
  if (!profile) return null;
  const devotions = profile.widgets?.devotions ?? [];
  if (devotions.length > 0) return "returning";
  const hasAssessment = !!profile.assessment?.completedAt;
  const hasOnboarding = !!profile.onboarding?.completedAt;
  if (!hasAssessment && !hasOnboarding) return "onboarding";
  return "first-devotion";
}

/* ─── CONTEXT INDICATOR ──────────────────────────────────────────── */

function ContextIndicator({ slugs }) {
  if (!Array.isArray(slugs) || slugs.length === 0) return null;
  const labels = slugs
    .map(s => FRUITS[s]?.label?.toLowerCase() ?? null)
    .filter(Boolean);
  if (labels.length === 0) return null;
  return (
    <div style={{
      marginTop: 6,
      marginBottom: 18,
      display: "flex",
      flexWrap: "wrap",
      alignItems: "baseline",
      gap: 8,
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed',sans-serif",
        fontSize: 10,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: "rgba(250,248,245,0.45)",
        fontWeight: 700,
      }}>
        Forming around
      </span>
      <span style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: 16,
        fontStyle: "italic",
        color: "var(--cf-gold)",
      }}>
        {labels.join(", ")}
      </span>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */

export default function DevotionGuide() {
  const [passage, setPassage]   = useState("");
  const [theme, setTheme]       = useState("");
  const [bigIdea, setBigIdea]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [devotional, setDevotional] = useState(null);
  const [copied, setCopied]     = useState(false);
  const [error, setError]       = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [firstDevotionDismissed, setFirstDevotionDismissed] = useState(false);
  const [onboardingSkipped, setOnboardingSkipped] = useState(false);
  const resultRef = useRef(null);

  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const mode = selectMode(profile);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      setLoading(true);
      fetch(`/api/share?id=${encodeURIComponent(id)}`)
        .then(res => res.json())
        .then(({ text, error: apiErr }) => {
          if (apiErr) throw new Error(apiErr);
          setDevotional(text);
          setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        })
        .catch(err => setError(err.message || "This devotional link has expired or could not be found."))
        .finally(() => setLoading(false));
      return;
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const canGenerate = passage.trim() || theme.trim() || bigIdea.trim();

  const generate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setDevotional(null);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passage,
          theme,
          bigIdea,
          profile: buildDevotionContext(profile),
        }),
      });

      if (!res.ok) throw new Error("Generation failed");
      const { text, error: apiErr } = await res.json();
      if (apiErr) throw new Error(apiErr);

      setDevotional(text);

      const summary = (text ?? "").slice(0, 200).trim();
      const newEntry = {
        generatedAt: new Date().toISOString(),
        passage,
        theme,
        bigIdea,
        summary,
      };
      const prior = profile?.widgets?.devotions ?? [];
      updateProfile({
        widgets: {
          devotions: [newEntry, ...prior].slice(0, 10),
        },
      });

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const captureImage = async () => {
    if (!resultRef.current) return null;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: "var(--cf-hero-bg)",
      scale: 2,
      useCORS: true,
    });
    return canvas;
  };

  const download = async () => {
    if (!devotional || loading) return;
    setCopied("downloading");
    try {
      const canvas = await captureImage();
      if (!canvas) return;
      const link = document.createElement("a");
      link.download = "counter-formation-devotion.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setCopied("downloaded");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (!devotional || loading) return;
    setCopied("sharing");
    try {
      const res = await fetch("/api/share", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ text: devotional }),
      });
      const { id, error: saveErr } = await res.json();
      if (saveErr || !id) throw new Error(saveErr || "Failed to save");

      const url = `${window.location.origin}/field-guide/devotion-guide?id=${id}`;
      if (navigator.share) {
        await navigator.share({ title: "Counter Formation — Daily Devotion", url });
      } else {
        await navigator.clipboard.writeText(url);
      }
      setCopied("shared");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--cf-hero-bg)", color: "var(--cf-ivory)" }}>
      {/* ── Nav ── */}
      <nav style={{
        position:        "sticky",
        top:             0,
        zIndex:          100,
        backgroundColor: scrolled ? "rgba(6,5,10,0.92)" : "transparent",
        backdropFilter:  scrolled ? "blur(16px)" : "none",
        borderBottom:    scrolled ? `1px solid ${"var(--cf-white-8)"}` : "1px solid transparent",
        padding:         "14px 24px",
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "space-between",
        transition:      "all 0.35s ease",
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/helmet.png" style={{ width: 32, height: 32, objectFit: "contain" }} alt="Counter Formation" />
          <span style={{ fontFamily: "'Michroma',sans-serif", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--cf-ivory)" }}>
            Counter Formation
          </span>
        </Link>
        <Link to="/#field-guide" className="fg-nav-link">
          ← Field Guide
        </Link>
      </nav>

      {/* ── Hero ── */}
      <header style={{ padding: "72px 24px 64px", textAlign: "center", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginBottom: 16 }}>
          <img src="/shield-white.png" style={{ width: "auto", height: "clamp(96px,16vw,180px)", objectFit: "contain", opacity: 0.9, flexShrink: 0 }} alt="Counter Formation" />
          <div style={{ textAlign: "left" }}>
            <h1 style={{
              fontFamily:    "'Michroma',sans-serif",
              fontSize:      "clamp(24px,5vw,58px)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight:    1.0,
              color:         "var(--cf-ivory)",
              margin:        "0 0 10px",
            }}>
              Counter Formation
            </h1>
            <p style={{
              fontFamily:    "'Barlow Condensed',sans-serif",
              fontSize:      "clamp(13px,2vw,18px)",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              color:         "var(--cf-gold)",
              fontWeight:    600,
              margin:        0,
            }}>
              Daily Devotion Guide
            </p>
          </div>
        </div>
        <p style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontStyle:  "italic",
          fontSize:   "clamp(16px,2.5vw,20px)",
          color:      "var(--cf-ivory-58)",
          lineHeight: 1.8,
          maxWidth:   560,
          margin:     "0 auto 32px",
        }}>
          Resist the drift. Intentional spiritual formation for the counter-cultural life in Christ.
        </p>
        <div style={{
          display:         "inline-block",
          background:      "rgba(201,168,76,0.05)",
          borderLeft:      `3px solid ${"var(--cf-gold)"}`,
          borderRadius:    "0 12px 12px 0",
          padding:         "22px 30px",
          textAlign:       "left",
          maxWidth:        560,
        }}>
          <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--cf-gold)", fontWeight: 700, marginBottom: 14 }}>
            How to use
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, color: "var(--cf-ivory-58)", lineHeight: 1.75, margin: 0 }}>
            Input all three — <em>1) Scripture Reference, 2) Devotion Theme, 3) Subject, Topic, or Question</em> — for the most complete guide. Or choose just one and the tool will produce a custom devotion for the day.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 96px" }}>

        {!isLoaded && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--cf-ivory-24)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Loading…
          </div>
        )}

        {isLoaded && mode === "onboarding" && !onboardingSkipped && (
          <div style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%), #1C1813",
            border: "1px solid var(--cf-gold-faint)",
            borderRadius: 24,
            padding: "clamp(30px,5vw,56px)",
            position: "relative",
            overflow: "hidden",
            maxWidth: 640,
            margin: "0 auto 64px",
            boxShadow: "0 18px 44px rgba(0,0,0,0.24)",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,var(--cf-gold-mid),transparent)" }} />
            <p style={{
              fontFamily: "'Barlow Condensed',sans-serif",
              fontSize: 12,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--cf-gold)",
              fontWeight: 700,
              margin: "0 0 12px",
            }}>
              Before you begin
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(22px,3.2vw,30px)",
              lineHeight: 1.35,
              color: "var(--cf-ivory)",
              margin: "0 0 14px",
              fontWeight: 400,
            }}>
              The devotions are more precise when formation context is in place.
            </h2>
            <p style={{
              fontFamily: "'Cormorant Garamond',serif",
              fontSize: "clamp(16px,2vw,18px)",
              lineHeight: 1.7,
              color: "var(--cf-ivory-58)",
              margin: "0 0 32px",
            }}>
              The Fruit Assessment identifies where the Spirit is forming you -- your formation edge. That context shapes every devotion the guide generates. You can take it now (about ten minutes) or jump in and generate today&apos;s devotion without it.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
              <Link
                to="/field-guide/fruit-assessment"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 28px",
                  borderRadius: 18,
                  background: "var(--cf-gold)",
                  color: "#120F08",
                  border: "1px solid rgba(201,168,76,0.30)",
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 10px 24px rgba(201,168,76,0.18)",
                }}
              >
                Start the Fruit Assessment
              </Link>
              <button
                onClick={() => setOnboardingSkipped(true)}
                style={{
                  padding: "12px 22px",
                  borderRadius: 999,
                  background: "transparent",
                  color: "var(--cf-ivory-58)",
                  border: "1px solid var(--cf-white-8)",
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Jump in without assessment
              </button>
            </div>
          </div>
        )}

        {isLoaded && mode === "returning" && <DevotionHistory />}

        {isLoaded && (mode !== "onboarding" || onboardingSkipped) && (
        <>
        {/* ── Input card ── */}
        <div style={{
          background:    "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%), #1C1813",
          border:        `1px solid ${"var(--cf-gold-faint)"}`,
          borderRadius:  24,
          padding:       "clamp(30px,5vw,56px)",
          position:      "relative",
          overflow:      "hidden",
          marginBottom:  64,
          boxShadow:     "0 18px 44px rgba(0,0,0,0.24)",
        }}>
          {/* gold top line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${"var(--cf-gold-mid)"},transparent)` }} />

          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <p style={{
                margin: "0 0 8px",
                fontFamily: "'Barlow Condensed',sans-serif",
                fontSize: 12,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--cf-gold)",
                fontWeight: 700,
              }}>
                Build today&apos;s guide
              </p>
              <p style={{
                margin: 0,
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(18px,2.4vw,24px)",
                lineHeight: 1.55,
                color: "var(--cf-ivory-58)",
                maxWidth: 540,
              }}>
                Use one field for a quick devotion, or combine all three for a more shaped and specific formation prompt.
              </p>
            </div>

            <ContextIndicator slugs={profile?.assessment?.formationEdge ?? []} />

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <FieldInput
                label="1. Scripture Reference"
                hint="Optional, but helpful for grounding the reflection in a specific passage."
                value={passage}
                onChange={e => setPassage(e.target.value)}
                placeholder="e.g., Romans 12:1-2"
              />

              <FieldInput
                label="2. Devotion Theme"
                hint="Name the spiritual emphasis you want the devotion to develop."
                value={theme}
                onChange={e => setTheme(e.target.value)}
                placeholder="e.g., Intentionality"
              />

              <FieldInput
                label="3. Subject, Topic, or Question"
                hint="Use this space for the tension, topic, or question you want today's devotion to speak into."
                value={bigIdea}
                onChange={e => setBigIdea(e.target.value)}
                placeholder="e.g., How do I resist the pull of distraction?"
                multiline
              />
            </div>

            <div style={{ marginTop: 34, paddingTop: 24, borderTop: "1px solid rgba(201,168,76,0.14)" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={generate}
                  disabled={loading || !canGenerate}
                  className={canGenerate && !loading ? "fg-btn-prim" : ""}
                  style={{
                    width: "100%",
                    maxWidth: 460,
                    justifyContent: "center",
                    padding: "15px 32px",
                    borderRadius: 18,
                    background: loading || !canGenerate ? "rgba(201,168,76,0.24)" : "var(--cf-gold)",
                    color: "#120F08",
                    border: "1px solid rgba(201,168,76,0.30)",
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    cursor: loading || !canGenerate ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.2s ease",
                    boxShadow: loading || !canGenerate ? "none" : "0 10px 24px rgba(201,168,76,0.18)",
                  }}
                >
                  {loading ? "Forming..." : "Begin Formation"}
                </button>
              </div>
              <p style={{
                margin: "14px auto 0",
                maxWidth: 460,
                textAlign: "center",
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 16,
                lineHeight: 1.5,
                color: "var(--cf-ivory-58)",
              }}>
                Start with whatever you have. A verse, a theme, or a question is enough.
              </p>
            </div>
          </div>

          {error && (
            <p style={{ textAlign: "center", color: "rgba(255,100,100,0.8)", fontSize: 13, marginTop: 20, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.1em" }}>
              {error}
            </p>
          )}
        </div>

        {/* ── Feature cards (shown before first generation) ── */}
        {!devotional && !loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 24 }}>
            {[
              { label: "The Objective",    text: "Clear, mission-oriented focus for your daily walk." },
              { label: "Life Steps",  text: "Concrete actions to resist the drift of the world." },
              { label: "Deep Formation",   text: "Structured methods for profound spiritual growth." },
            ].map(item => (
              <div key={item.label} style={{ background: "var(--cf-card-warm)", border: `1px solid ${"var(--cf-gold-faint)"}`, borderRadius: 16, padding: 32 }}>
                <p style={{ fontFamily: "'Michroma',sans-serif", fontSize: 12, textTransform: "uppercase", color: "var(--cf-ivory)", marginBottom: 12 }}>
                  {item.label}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "normal", fontWeight: 300, fontSize: 17, color: "var(--cf-ivory-58)", lineHeight: 1.8 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── Result ── */}
        {devotional && (
          <div ref={resultRef}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
              <p className="fg-section-kicker" style={{ margin: 0 }}>Dispatches from the Field</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={share}
                  disabled={copied === "sharing"}
                  style={{
                    padding:       "10px 20px",
                    borderRadius:  999,
                    background:    copied === "shared" ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                    border:        `1px solid ${copied === "shared" ? "var(--cf-gold-mid)" : "var(--cf-white-8)"}`,
                    color:         copied === "shared" ? "var(--cf-gold)" : "var(--cf-ivory-58)",
                    fontFamily:    "'Barlow Condensed',sans-serif",
                    fontSize:      11,
                    fontWeight:    700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    cursor:        copied === "sharing" ? "wait" : "pointer",
                    transition:    "all 0.2s",
                  }}
                >
                  {copied === "sharing" ? "Saving…" : copied === "shared" ? "Shared ✓" : "Share"}
                </button>
                <button
                  onClick={download}
                  disabled={copied === "downloading"}
                  style={{
                    padding:       "10px 20px",
                    borderRadius:  999,
                    background:    copied === "downloaded" ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.03)",
                    border:        `1px solid ${copied === "downloaded" ? "var(--cf-gold-mid)" : "var(--cf-white-8)"}`,
                    color:         copied === "downloaded" ? "var(--cf-gold)" : "var(--cf-ivory-58)",
                    fontFamily:    "'Barlow Condensed',sans-serif",
                    fontSize:      11,
                    fontWeight:    700,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    cursor:        copied === "downloading" ? "wait" : "pointer",
                    transition:    "all 0.2s",
                  }}
                >
                  {copied === "downloading" ? "Saving…" : copied === "downloaded" ? "Saved ✓" : "Save Image"}
                </button>
              </div>
            </div>

            <div style={{ background: "var(--cf-obsidian)", border: `1px solid ${"var(--cf-white-8)"}`, borderRadius: 24, padding: "clamp(32px,5vw,80px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${"var(--cf-gold-mid)"},transparent)` }} />
              <div className="dg-markdown">
                <ReactMarkdown components={MARKDOWN_COMPONENTS}>{devotional}</ReactMarkdown>
              </div>
              <div style={{ marginTop: 64, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.3em", color: "var(--cf-ivory-24)", textTransform: "uppercase" }}>
                  Go with conviction.
                </p>
              </div>
            </div>

            {/* Email capture: only after the very first generated devotion, only when anonymous. */}
            {!profile?.identity?.userId
              && (profile?.widgets?.devotions?.length ?? 0) === 1
              && !firstDevotionDismissed && (
              <div style={{ marginTop: 48 }}>
                <EmailCapture
                  context="first-devotion"
                  onDismiss={() => setFirstDevotionDismissed(true)}
                />
              </div>
            )}

            <NextStep context="devotion-guide-complete" />
          </div>
        )}
        </>
        )}
      </main>

      {/* ── Footer ── */}
      <div style={{ borderTop: `1px solid ${"var(--cf-white-8)"}`, paddingTop: 40, paddingBottom: 48, textAlign: "center", backgroundColor: "var(--cf-obsidian)" }}>
        <img src="/helmet.png" style={{ width: 20, height: 20, objectFit: "contain", opacity: 0.2, filter: "invert(1)", display: "block", margin: "0 auto 16px" }} alt="" />
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)", marginBottom: 6 }}>
          Counter Formation · Daily Devotion Guide
        </p>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(250,248,245,0.12)" }}>
          Discipline · Presence · Formation
        </p>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(250,248,245,0.12)", marginTop: 6 }}>
          Ephesians 6:10–18 · © 2026
        </p>
      </div>
    </div>
  );
}
