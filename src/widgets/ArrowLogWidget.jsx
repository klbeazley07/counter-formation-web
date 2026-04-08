import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Sparkles, History, Trash2, Quote, Loader2, Plus,
  ExternalLink, X, ChevronDown, ChevronUp, Maximize2, ArrowRight,
} from "lucide-react";

/* ─── SIDEBAR PALETTE ─────────────────────────────────────────────── */

const C = {
  gold:        "#C9A84C",
  goldFaint:   "rgba(201,168,76,0.15)",
  goldGlow:    "rgba(201,168,76,0.06)",
  goldBorder:  "rgba(201,168,76,0.2)",
  goldDiv:     "rgba(201,168,76,0.1)",
  goldMuted:   "rgba(201,168,76,0.5)",
  inputBg:     "#17140F",
  ivory:       "#FAF8F5",
  ivoryMuted:  "rgba(250,248,245,0.55)",
  ivoryDim:    "rgba(250,248,245,0.35)",
  ivoryFaint:  "rgba(250,248,245,0.18)",
  redFaint:    "rgba(220,60,60,0.45)",
  greenFaint:  "rgba(100,200,120,0.45)",
  white06:     "rgba(255,255,255,0.06)",
  white10:     "rgba(255,255,255,0.1)",
};

/* ─── EXPANDED PALETTE ────────────────────────────────────────────── */
/* Warm elevated dark — same world, more light on                       */

const EX = {
  panelBg:       "#1E1A14",        /* warm dark, lifted from obsidian  */
  headerBg:      "#0E0C0A",        /* obsidian bar — frames the space  */
  inputBg:       "#FFFFFF",        /* white journal page               */
  inputText:     "#17140F",        /* espresso text in white box       */
  inputBorder:   "rgba(255,255,255,0.1)",
  inputFocus:    "#C9A84C",
  scriptureCard: "#17140F",        /* slightly deeper — truth from dark */
  scriptureText: "#FAF8F5",        /* bright ivory on dark card        */
  gold:          "#C9A84C",
  goldDark:      "#C9A84C",        /* same gold reads fine on dark     */
  divider:       "rgba(255,255,255,0.07)",
  muted:         "rgba(250,248,245,0.4)",
  dim:           "rgba(250,248,245,0.62)",
  full:          "#FAF8F5",
  logLie:        "rgba(250,248,245,0.32)",
  histScrollbar: "rgba(201,168,76,0.2)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const STORAGE_KEY = "cf-arrow-log";

/* ─── SHARED CSS ──────────────────────────────────────────────────── */

const SHARED_CSS = `
  @keyframes al-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes al-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes al-card-in {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes al-pulse {
    0%, 100% { opacity: 0.3; }
    50%      { opacity: 0.85; }
  }
  @keyframes al-overlay-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes al-panel-in {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .al-spin        { animation: al-spin 1.2s linear infinite; }
  .al-fade-in     { animation: al-fade-in .3s ease forwards; }
  .al-card-in     { animation: al-card-in .35s cubic-bezier(0.22,0.61,0.36,1) forwards; }
  .al-pulse       { animation: al-pulse 1.8s ease infinite; }
  .al-overlay-in  { animation: al-overlay-in .2s ease forwards; }
  .al-panel-in    { animation: al-panel-in .28s cubic-bezier(0.22,0.61,0.36,1) forwards; }

  /* ── Sidebar scrollable ── */
  .al-scrollable::-webkit-scrollbar       { width: 3px; }
  .al-scrollable::-webkit-scrollbar-track { background: transparent; }
  .al-scrollable::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
  .al-scrollable { scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.2) transparent; }

  /* ── Expanded scrollable ── */
  .al-exp-scroll::-webkit-scrollbar       { width: 4px; }
  .al-exp-scroll::-webkit-scrollbar-track { background: transparent; }
  .al-exp-scroll::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
  .al-exp-scroll { scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.2) transparent; }

  /* ── Sidebar buttons ── */
  .al-btn-seek:hover:not(:disabled) { background: rgba(201,168,76,0.22) !important; }
  .al-btn-save:hover  { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,168,76,0.2) !important; }
  .al-max-btn:hover   { background: rgba(201,168,76,0.12) !important; color: #C9A84C !important; }

  /* ── Expanded buttons ── */
  .al-exp-seek:hover:not(:disabled) {
    background: #C9A84C !important;
    color: #0A0A0A !important;
    border-color: #C9A84C !important;
  }
  .al-exp-save:hover   { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,168,76,0.35) !important; }
  .al-exp-close:hover  { background: rgba(255,255,255,0.08) !important; }
  .al-exp-hist:hover   { color: #C9A84C !important; }
  .al-exp-discard:hover { color: rgba(250,248,245,0.75) !important; }

  /* ── Expanded two-column main ── */
  .al-exp-main {
    display: grid;
    grid-template-columns: 1fr;
  }
  @media (min-width: 700px) {
    .al-exp-main { grid-template-columns: 1fr 1fr; }
    .al-exp-col-right {
      border-left: 1px solid rgba(255,255,255,0.07) !important;
      border-top:  none !important;
    }
  }

  /* ── Expanded log rows (side-by-side) ── */
  .al-exp-log-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 22px 0;
  }
  @media (min-width: 700px) {
    .al-exp-log-row {
      grid-template-columns: 1fr 20px 1fr 28px;
      align-items: start;
    }
  }

  /* ── Verse pill (on dark scripture card) ── */
  .al-verse-pill-dark:hover {
    background: rgba(201,168,76,0.2) !important;
    border-color: rgba(201,168,76,0.4) !important;
    color: #C9A84C !important;
  }
`;

/* ─── SCRIPTURE POPOUT (dark — appears in sidebar & on dark card) ─── */

function ScripturePopout({ verse, onClose }) {
  return (
    <div style={{
      position:     "absolute",
      zIndex:       200,
      bottom:       "calc(100% + 8px)",
      left:         0,
      width:        "min(320px, calc(100vw - 48px))",
      background:   "#1A1612",
      border:       `1px solid ${C.goldBorder}`,
      borderRadius: "16px",
      padding:      "20px",
      boxShadow:    "0 20px 48px rgba(0,0,0,0.6)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <span style={{ ...barlow, fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>
            {verse.reference}
          </span>
          <span style={{ ...barlow, fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", color: C.ivoryDim, marginLeft: "10px" }}>
            {verse.translation}
          </span>
        </div>
        <button onClick={onClose} aria-label="Close"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.ivoryFaint, lineHeight: 1, marginLeft: "8px", flexShrink: 0 }}
        >
          <X size={14} />
        </button>
      </div>
      <p style={{ ...garamond, fontStyle: "italic", fontSize: "15px", color: C.ivory, lineHeight: 1.75, margin: "0 0 16px" }}>
        "{verse.text}"
      </p>
      <div style={{ borderTop: `1px solid ${C.white06}`, paddingTop: "12px" }}>
        <a href={verse.bibleUrl} target="_blank" rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "6px", ...barlow, fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: C.gold, fontWeight: 700, textDecoration: "none" }}
        >
          Read full chapter <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

/* ─── VERSE PILL (dark bg) ────────────────────────────────────────── */

function VersePill({ verse, popoutKey, activePopout, setActivePopout }) {
  const isOpen = activePopout === popoutKey;
  return (
    <div style={{ position: "relative" }}>
      <button
        className="al-verse-pill-dark"
        onClick={() => setActivePopout(isOpen ? null : popoutKey)}
        style={{
          ...barlow,
          display: "flex", alignItems: "center", gap: "5px",
          padding: "4px 10px", borderRadius: "999px",
          background: isOpen ? C.goldFaint : "rgba(201,168,76,0.07)",
          border: `1px solid ${isOpen ? C.goldBorder : "rgba(201,168,76,0.18)"}`,
          color: isOpen ? C.gold : C.goldMuted,
          fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase",
          fontWeight: 700, cursor: "pointer",
          transition: "background .15s, border-color .15s, color .15s",
        }}
      >
        {verse.reference}
        <ExternalLink size={9} style={{ opacity: 0.6 }} />
      </button>
      {isOpen && <ScripturePopout verse={verse} onClose={() => setActivePopout(null)} />}
    </div>
  );
}

/* ─── COMPACT ENTRY ROW (sidebar) ─────────────────────────────────── */

function CompactEntryRow({ entry, onDelete, last }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: "12px 0", borderBottom: last ? "none" : `1px solid ${C.goldDiv}` }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 20px", gap: "8px", alignItems: "start" }}>
        <div>
          <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.35)", marginBottom: "3px" }}>The Lie</p>
          <p style={{ ...garamond, fontSize: "14px", color: C.ivoryDim, lineHeight: 1.55, fontStyle: "italic", margin: "0 0 10px" }}>{entry.lie}</p>
          <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.35)", marginBottom: "3px" }}>What God Has Said</p>
          <p style={{ ...garamond, fontSize: "14px", color: "rgba(250,248,245,0.85)", lineHeight: 1.55, margin: "0 0 8px" }}>{entry.truth}</p>
          {entry.verses && entry.verses.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {entry.verses.map((v, i) => (
                <a key={i} href={v.bibleUrl} target="_blank" rel="noopener noreferrer"
                  style={{ ...barlow, fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: C.goldMuted, textDecoration: "none", borderBottom: `1px solid ${C.goldDiv}`, paddingBottom: "1px" }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.goldMuted; }}
                >
                  {v.reference}
                </a>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => onDelete(entry.id)} aria-label="Remove entry"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.ivoryFaint, opacity: hovered ? 1 : 0, transition: "opacity .15s, color .15s", lineHeight: 1, marginTop: "2px" }}
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(220,80,80,0.8)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.ivoryFaint; }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── EXPANDED ENTRY ROW (side-by-side, light palette) ───────────── */

function ExpandedEntryRow({ entry, onDelete, last }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="al-exp-log-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ borderBottom: last ? "none" : `1px solid ${EX.divider}` }}
    >
      {/* Lie */}
      <div>
        <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: EX.muted, marginBottom: "6px" }}>The Lie</p>
        <p style={{ ...garamond, fontSize: "17px", color: EX.logLie, lineHeight: 1.65, fontStyle: "italic", margin: 0 }}>{entry.lie}</p>
      </div>

      {/* Arrow */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "28px" }}>
        <ArrowRight size={15} style={{ color: "rgba(250,248,245,0.15)" }} />
      </div>

      {/* Truth + verses */}
      <div>
        <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: EX.muted, marginBottom: "6px" }}>What God Has Said</p>
        <p style={{ ...garamond, fontSize: "17px", color: EX.full, lineHeight: 1.65, margin: "0 0 10px" }}>{entry.truth}</p>
        {entry.verses && entry.verses.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {entry.verses.map((v, i) => (
              <a key={i} href={v.bibleUrl} target="_blank" rel="noopener noreferrer"
                style={{ ...barlow, fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: EX.goldDark, textDecoration: "none", borderBottom: `1px solid rgba(160,129,62,0.3)`, paddingBottom: "1px" }}
                onMouseEnter={e => { e.currentTarget.style.color = EX.gold; }}
                onMouseLeave={e => { e.currentTarget.style.color = EX.goldDark; }}
              >
                {v.reference}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Delete */}
      <div style={{ display: "flex", alignItems: "flex-start", paddingTop: "26px" }}>
        <button onClick={() => onDelete(entry.id)} aria-label="Remove entry"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: EX.muted, opacity: hovered ? 1 : 0, transition: "opacity .15s, color .15s", lineHeight: 1 }}
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(200,60,60,0.8)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = EX.muted; }}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

/* ─── EXPANDED OVERLAY ────────────────────────────────────────────── */

function ExpandedView({ lie, setLie, isGenerating, currentTruth, logs, activePopout, setActivePopout, error, showHistory, setShowHistory, handleGenerate, saveLog, deleteLog, onClose }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 120);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
  };

  const hasTruthContent = isGenerating || currentTruth;

  return (
    <div
      className="al-overlay-in"
      onClick={onClose}
      style={{
        position:       "fixed",
        inset:          0,
        zIndex:         1000,
        background:     "rgba(6,5,10,0.92)",
        backdropFilter: "blur(14px)",
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "center",
        padding:        "clamp(16px,3vw,40px)",
        overflowY:      "auto",
      }}
    >
      <div
        className="al-panel-in"
        onClick={e => e.stopPropagation()}
        style={{
          width:        "100%",
          maxWidth:     "1100px",
          borderRadius: "24px",
          overflow:     "hidden",
          boxShadow:    "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.18)",
          flexShrink:   0,
        }}
      >

        {/* ── Obsidian header bar ── */}
        <div style={{
          background:     EX.headerBg,
          padding:        "1.25rem 2rem",
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          borderBottom:   "1px solid rgba(201,168,76,0.15)",
        }}>
          <div>
            <p style={{ ...barlow, fontSize: "9px", letterSpacing: ".5em", textTransform: "uppercase", color: C.gold, marginBottom: "3px" }}>
              Arrow Log
            </p>
            <p style={{ ...garamond, fontStyle: "italic", fontSize: "18px", color: "rgba(250,248,245,0.65)", lineHeight: 1.3, margin: 0 }}>
              Catch the lie. Answer with truth.
            </p>
          </div>
          <button
            className="al-exp-close"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "999px", padding: "7px 16px",
              cursor: "pointer", color: "rgba(250,248,245,0.45)",
              transition: "background .15s",
            }}
          >
            <X size={14} />
            <span style={{ ...barlow, fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase" }}>Close</span>
          </button>
        </div>

        {/* ── Cream body ── */}
        <div style={{ background: EX.panelBg }}>

          {/* Two-column main */}
          <div className="al-exp-main">

            {/* Left — lie input (journal feel) */}
            <div style={{ padding: "2.5rem 2.5rem 2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(200,70,70,0.5)", flexShrink: 0 }} />
                <label style={{ ...barlow, fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase", color: EX.muted }}>
                  The Lie I'm Believing
                </label>
              </div>

              <textarea
                ref={textareaRef}
                value={lie}
                onChange={e => setLie(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="I am not enough..."
                style={{
                  ...garamond,
                  width: "100%", background: EX.inputBg,
                  border: `1.5px solid ${EX.inputBorder}`,
                  borderRadius: "14px",
                  padding: "18px 20px",
                  color: EX.inputText,
                  fontSize: "24px", lineHeight: 1.65, fontStyle: "italic",
                  outline: "none", resize: "vertical",
                  minHeight: "180px", boxSizing: "border-box",
                  boxShadow: "0 2px 12px rgba(23,20,15,0.06)",
                  transition: "border-color .2s, box-shadow .2s",
                }}
                onFocus={e => {
                  e.target.style.borderColor = EX.inputFocus;
                  e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.15)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = EX.inputBorder;
                  e.target.style.boxShadow = "0 2px 12px rgba(23,20,15,0.06)";
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                <p style={{ ...barlow, fontSize: "9px", color: EX.muted, letterSpacing: ".1em", margin: 0 }}>
                  {lie.length > 0 ? `${lie.length} characters` : "Ctrl+Enter to seek"}
                </p>
                <button
                  className="al-exp-seek"
                  onClick={handleGenerate}
                  disabled={isGenerating || !lie.trim()}
                  style={{
                    ...barlow,
                    display: "flex", alignItems: "center", gap: "8px",
                    padding: "11px 24px", borderRadius: "999px",
                    background: "rgba(201,168,76,0.12)",
                    border: `1.5px solid ${EX.gold}`,
                    color: EX.goldDark,
                    fontSize: "10px", letterSpacing: ".26em",
                    textTransform: "uppercase", fontWeight: 700,
                    cursor: (isGenerating || !lie.trim()) ? "not-allowed" : "pointer",
                    opacity: (isGenerating || !lie.trim()) ? 0.45 : 1,
                    transition: "background .2s, color .2s, border-color .2s, opacity .2s",
                  }}
                >
                  {isGenerating ? <Loader2 size={14} className="al-spin" /> : <Sparkles size={14} />}
                  {isGenerating ? "Reflecting" : "Seek Truth"}
                </button>
              </div>

              {error && (
                <p style={{ ...barlow, fontSize: "10px", letterSpacing: ".1em", color: "rgba(180,50,50,0.8)", marginTop: "12px", marginBottom: 0 }}>
                  {error}
                </p>
              )}
            </div>

            {/* Right — truth output */}
            <div
              className="al-exp-col-right"
              style={{ padding: "2.5rem 2.5rem 2rem", borderTop: `1px solid ${EX.divider}` }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(80,180,100,0.6)", flexShrink: 0 }} />
                <label style={{ ...barlow, fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase", color: EX.muted }}>
                  What God Has Said
                </label>
              </div>

              {/* Empty */}
              {!hasTruthContent && (
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px 0" }}>
                  <Quote size={32} style={{ color: "rgba(250,248,245,0.07)", flexShrink: 0 }} />
                  <p style={{ ...garamond, fontStyle: "italic", fontSize: "19px", color: EX.muted, lineHeight: 1.6, margin: 0 }}>
                    The truth will be revealed here...
                  </p>
                </div>
              )}

              {/* Loading */}
              {isGenerating && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "40px 0" }}>
                  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader2 size={40} style={{ color: "rgba(250,248,245,0.1)" }} className="al-spin" />
                    <Sparkles size={18} style={{ position: "absolute", color: EX.gold }} />
                  </div>
                  <p className="al-pulse" style={{ ...barlow, fontSize: "10px", letterSpacing: ".36em", textTransform: "uppercase", color: EX.muted, margin: 0 }}>
                    Consulting Scripture
                  </p>
                </div>
              )}

              {/* Scripture card — dark on cream */}
              {!isGenerating && currentTruth && (
                <div
                  className="al-card-in"
                  style={{
                    background:   EX.scriptureCard,
                    borderRadius: "18px",
                    padding:      "28px 28px 22px",
                    boxShadow:    "0 8px 32px rgba(23,20,15,0.18)",
                    backgroundImage: "linear-gradient(to bottom, rgba(201,168,76,0.06) 0%, transparent 40%)",
                  }}
                >
                  {/* Gold accent line */}
                  <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)", marginBottom: "22px" }} />

                  <p style={{ ...garamond, fontSize: "22px", color: EX.scriptureText, lineHeight: 1.75, fontStyle: "italic", marginBottom: "20px" }}>
                    {currentTruth.truth}
                  </p>

                  {currentTruth.verses && currentTruth.verses.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
                      {currentTruth.verses.map((v, i) => (
                        <VersePill
                          key={i}
                          verse={v}
                          popoutKey={`current-${i}`}
                          activePopout={activePopout}
                          setActivePopout={setActivePopout}
                        />
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "14px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <button
                      className="al-exp-discard"
                      onClick={() => { setLie(""); setActivePopout(null); }}
                      style={{ ...barlow, background: "none", border: "none", cursor: "pointer", fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: C.ivoryDim, padding: 0, transition: "color .15s" }}
                    >
                      Discard
                    </button>
                    <button
                      className="al-exp-save"
                      onClick={saveLog}
                      style={{
                        ...barlow,
                        display: "flex", alignItems: "center", gap: "7px",
                        padding: "9px 20px", borderRadius: "999px",
                        background: C.gold, color: "#0A0A0A", border: "none",
                        fontSize: "10px", letterSpacing: ".22em",
                        textTransform: "uppercase", fontWeight: 700,
                        cursor: "pointer",
                        transition: "transform .15s, box-shadow .15s",
                      }}
                    >
                      <Plus size={13} /> Add to Log
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── History section ── */}
          <div style={{ borderTop: `1px solid ${EX.divider}` }}>

            <button
              className="al-exp-hist"
              onClick={() => setShowHistory(h => !h)}
              style={{
                ...barlow,
                display: "flex", alignItems: "center", gap: "8px",
                width: "100%", padding: "18px 2.5rem",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase",
                color: EX.muted, transition: "color .15s",
              }}
            >
              <History size={14} />
              {showHistory ? "Hide Arrow Log" : `View Arrow Log${logs.length > 0 ? ` (${logs.length})` : ""}`}
              {showHistory ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showHistory && (
              <div>
                <div style={{ height: "1px", background: EX.divider, margin: "0 2.5rem" }} />

                {/* Column headers */}
                {logs.length > 0 && (
                  <div className="al-exp-log-row" style={{ padding: "10px 2.5rem 6px", borderBottom: `1px solid ${EX.divider}` }}>
                    <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: EX.muted, margin: 0 }}>The Lie</p>
                    <div />
                    <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: EX.muted, margin: 0 }}>What God Has Said</p>
                    <div />
                  </div>
                )}

                <div
                  className="al-exp-scroll"
                  style={{ maxHeight: "420px", overflowY: "auto", padding: logs.length === 0 ? "3rem 2.5rem" : "0 2.5rem 2rem" }}
                >
                  {logs.length === 0 ? (
                    <p style={{ ...garamond, fontStyle: "italic", fontSize: "17px", color: EX.muted, lineHeight: 1.7, textAlign: "center", margin: 0 }}>
                      No arrows logged yet. Start by identifying a lie you have been believing.
                    </p>
                  ) : (
                    logs.map((entry, i) => (
                      <ExpandedEntryRow key={entry.id} entry={entry} onDelete={deleteLog} last={i === logs.length - 1} />
                    ))
                  )}
                </div>

                <div style={{ padding: "14px 2.5rem 1.75rem", borderTop: `1px solid ${EX.divider}`, textAlign: "center" }}>
                  <Link
                    to="/rule-of-life/community"
                    onClick={onClose}
                    style={{ ...barlow, fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase", color: EX.goldDark, opacity: 0.7, textDecoration: "none" }}
                  >
                    Part of the Community rhythm →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ARROW LOG WIDGET ────────────────────────────────────────────── */

export function ArrowLogWidget() {
  const [lie, setLie]                   = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTruth, setCurrentTruth] = useState(null);
  const [logs, setLogs]                 = useState([]);
  const [showHistory, setShowHistory]   = useState(false);
  const [activePopout, setActivePopout] = useState(null);
  const [error, setError]               = useState(null);
  const [isMaximized, setIsMaximized]   = useState(false);
  const textareaRef                     = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setLogs(parsed.map(log => ({ ...log, verses: log.verses ?? [], timestamp: log.timestamp ?? log.id })));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(logs)); } catch {}
  }, [logs]);

  const handleGenerate = async () => {
    if (!lie.trim() || isGenerating) return;
    setIsGenerating(true);
    setCurrentTruth(null);
    setActivePopout(null);
    setError(null);
    try {
      const res = await fetch("/api/arrow-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lie: lie.trim() }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCurrentTruth(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveLog = () => {
    if (!currentTruth || !lie.trim()) return;
    setLogs(prev => [{ id: crypto.randomUUID(), lie: lie.trim(), truth: currentTruth.truth, verses: currentTruth.verses ?? [], timestamp: Date.now() }, ...prev]);
    setLie("");
    setCurrentTruth(null);
    setActivePopout(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const deleteLog = (id) => setLogs(prev => prev.filter(e => e.id !== id));

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
  };

  const shared = { lie, setLie, isGenerating, currentTruth, logs, activePopout, setActivePopout, error, showHistory, setShowHistory, handleGenerate, saveLog, deleteLog };

  return (
    <>
      <style>{SHARED_CSS}</style>

      {/* ── Sidebar widget (dark, muted) ── */}
      <div style={{ background: C.goldGlow, border: `1px solid ${C.goldBorder}`, borderRadius: "20px", overflow: "visible", position: "relative" }}>

        {/* Header */}
        <div style={{ padding: "1.5rem 1.5rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ ...barlow, fontSize: "9px", letterSpacing: ".44em", textTransform: "uppercase", color: C.gold, marginBottom: "4px" }}>
              Arrow Log
            </p>
            <p style={{ ...garamond, fontStyle: "italic", fontSize: "14px", color: C.ivoryMuted, lineHeight: 1.5, margin: 0 }}>
              Catch the lie. Answer with truth.
            </p>
          </div>
          <button
            className="al-max-btn"
            onClick={() => setIsMaximized(true)}
            aria-label="Expand"
            title="Expand to full view"
            style={{
              background: "rgba(201,168,76,0.06)", border: `1px solid ${C.goldDiv}`,
              borderRadius: "8px", padding: "6px", cursor: "pointer",
              color: C.goldMuted, lineHeight: 1, flexShrink: 0,
              marginLeft: "12px", marginTop: "2px",
              transition: "background .15s, color .15s",
            }}
          >
            <Maximize2 size={13} />
          </button>
        </div>

        <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.5rem" }} />

        {/* Input */}
        <div style={{ padding: "1.25rem 1.5rem 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.redFaint, flexShrink: 0 }} />
            <label style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)" }}>
              The Lie I'm Believing
            </label>
          </div>
          <textarea
            ref={textareaRef}
            value={lie}
            onChange={e => setLie(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="I am not enough..."
            rows={3}
            style={{
              ...garamond,
              width: "100%", background: C.inputBg,
              border: `1px solid ${C.goldFaint}`, borderRadius: "10px",
              padding: "10px 12px", color: C.ivory,
              fontSize: "15px", lineHeight: 1.6, fontStyle: "italic",
              outline: "none", resize: "vertical", minHeight: "70px",
              boxSizing: "border-box", transition: "border-color .2s",
            }}
            onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.45)"; }}
            onBlur={e  => { e.target.style.borderColor = C.goldFaint; }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <p style={{ ...barlow, fontSize: "9px", color: C.ivoryFaint, letterSpacing: ".1em", margin: 0 }}>
              {lie.length > 0 ? `${lie.length} chars` : "Ctrl+Enter to seek"}
            </p>
            <button
              className="al-btn-seek"
              onClick={handleGenerate}
              disabled={isGenerating || !lie.trim()}
              style={{
                ...barlow,
                display: "flex", alignItems: "center", gap: "7px",
                padding: "8px 16px", borderRadius: "999px",
                background: "rgba(201,168,76,0.1)", border: `1px solid ${C.goldBorder}`,
                color: C.gold, fontSize: "9px", letterSpacing: ".22em",
                textTransform: "uppercase", fontWeight: 700,
                cursor: (isGenerating || !lie.trim()) ? "not-allowed" : "pointer",
                opacity: (isGenerating || !lie.trim()) ? 0.5 : 1,
                transition: "background .2s, opacity .2s",
              }}
            >
              {isGenerating ? <Loader2 size={12} className="al-spin" /> : <Sparkles size={12} />}
              {isGenerating ? "Reflecting" : "Seek Truth"}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: "0 1.5rem 1rem" }}>
            <p style={{ ...barlow, fontSize: "10px", letterSpacing: ".12em", color: "rgba(220,80,80,0.75)", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Truth output */}
        {(isGenerating || currentTruth) && (
          <div style={{ padding: "0 1.5rem 1.25rem" }}>
            <div style={{ height: "1px", background: C.goldDiv, marginBottom: "1.25rem" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.greenFaint, flexShrink: 0 }} />
              <label style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)" }}>
                What God Has Said
              </label>
            </div>
            {isGenerating ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px 0" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={28} style={{ color: "rgba(201,168,76,0.18)" }} className="al-spin" />
                  <Sparkles size={12} style={{ position: "absolute", color: C.gold }} />
                </div>
                <p className="al-pulse" style={{ ...barlow, fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: C.goldMuted, margin: 0 }}>
                  Consulting Scripture
                </p>
              </div>
            ) : currentTruth ? (
              <div className="al-fade-in">
                <p style={{ ...garamond, fontSize: "16px", color: C.ivory, lineHeight: 1.7, fontStyle: "italic", marginBottom: "14px" }}>
                  {currentTruth.truth}
                </p>
                {currentTruth.verses && currentTruth.verses.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {currentTruth.verses.map((v, i) => (
                      <VersePill key={i} verse={v} popoutKey={`current-${i}`} activePopout={activePopout} setActivePopout={setActivePopout} />
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", paddingTop: "12px", borderTop: `1px solid ${C.white06}` }}>
                  <button
                    onClick={() => { setCurrentTruth(null); setActivePopout(null); }}
                    style={{ ...barlow, background: "none", border: "none", cursor: "pointer", fontSize: "9px", letterSpacing: ".18em", textTransform: "uppercase", color: C.ivoryDim, padding: 0 }}
                  >
                    Discard
                  </button>
                  <button
                    className="al-btn-save"
                    onClick={saveLog}
                    style={{
                      ...barlow,
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 14px", borderRadius: "999px",
                      background: C.gold, color: "#0A0A0A", border: "none",
                      fontSize: "9px", letterSpacing: ".2em",
                      textTransform: "uppercase", fontWeight: 700, cursor: "pointer",
                      transition: "transform .15s, box-shadow .15s",
                    }}
                  >
                    <Plus size={11} /> Add to Log
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Empty state */}
        {!isGenerating && !currentTruth && !error && (
          <div style={{ padding: "0 1.5rem 1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <Quote size={16} style={{ color: "rgba(201,168,76,0.12)", flexShrink: 0 }} />
            <p style={{ ...garamond, fontStyle: "italic", fontSize: "14px", color: C.ivoryFaint, lineHeight: 1.5, margin: 0 }}>
              The truth will be revealed here...
            </p>
          </div>
        )}

        {/* Cross-link */}
        <div style={{ padding: "0 1.5rem 1rem", textAlign: "center" }}>
          <Link to="/rule-of-life/community"
            style={{ ...barlow, fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase", color: C.gold, opacity: 0.5, textDecoration: "none" }}
          >
            Part of the Community rhythm →
          </Link>
        </div>

        <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.5rem" }} />

        {/* History toggle */}
        <button
          onClick={() => setShowHistory(h => !h)}
          style={{
            ...barlow,
            display: "flex", alignItems: "center", gap: "7px",
            width: "100%", padding: "12px 1.5rem",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase",
            color: C.goldMuted, transition: "color .15s", justifyContent: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.goldMuted; }}
        >
          <History size={13} />
          {showHistory ? "Hide Arrow Log" : `View Arrow Log${logs.length > 0 ? ` (${logs.length})` : ""}`}
          {showHistory ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>

        {/* History list */}
        {showHistory && (
          <div>
            <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.5rem" }} />
            <div className="al-scrollable"
              style={{ maxHeight: "380px", overflowY: "auto", padding: logs.length === 0 ? "2rem 1.5rem" : "0 1.5rem 1.5rem" }}
            >
              {logs.length === 0 ? (
                <p style={{ ...garamond, fontStyle: "italic", fontSize: "14px", color: C.ivoryFaint, lineHeight: 1.7, textAlign: "center", margin: 0 }}>
                  No arrows logged yet. Start by identifying a lie you have been believing.
                </p>
              ) : (
                logs.map((entry, i) => (
                  <CompactEntryRow key={entry.id} entry={entry} onDelete={deleteLog} last={i === logs.length - 1} />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Portal overlay ── */}
      {isMaximized && createPortal(
        <ExpandedView {...shared} onClose={() => setIsMaximized(false)} />,
        document.body
      )}
    </>
  );
}
