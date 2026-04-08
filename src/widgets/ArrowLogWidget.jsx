import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Sparkles, History, Trash2, Quote, Loader2, Plus, ExternalLink, X, ChevronDown, ChevronUp } from "lucide-react";

/* ─── BRAND CONSTANTS ─────────────────────────────────────────────── */

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
  white06:     "rgba(255,255,255,0.06)",
  white10:     "rgba(255,255,255,0.1)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const STORAGE_KEY = "cf-arrow-log";

/* ─── SCRIPTURE POPOUT ────────────────────────────────────────────── */

function ScripturePopout({ verse, onClose }) {
  return (
    <div
      className="al-popout"
      style={{
        position:     "absolute",
        zIndex:       100,
        bottom:       "calc(100% + 8px)",
        left:         0,
        width:        "min(300px, calc(100vw - 48px))",
        background:   "#1A1612",
        border:       `1px solid ${C.goldBorder}`,
        borderRadius: "16px",
        padding:      "20px",
        boxShadow:    "0 16px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <span style={{ ...barlow, fontSize: "10px", letterSpacing: ".2em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>
            {verse.reference}
          </span>
          <span style={{ ...barlow, fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", color: C.ivoryDim, marginLeft: "10px" }}>
            {verse.translation}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.ivoryFaint, lineHeight: 1, marginLeft: "8px" }}
        >
          <X size={14} />
        </button>
      </div>

      <p style={{ ...garamond, fontStyle: "italic", fontSize: "15px", color: C.ivory, lineHeight: 1.7, margin: "0 0 16px" }}>
        "{verse.text}"
      </p>

      <div style={{ borderTop: `1px solid ${C.white06}`, paddingTop: "12px" }}>
        <a
          href={verse.bibleUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: "6px", ...barlow, fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: C.gold, fontWeight: 700, textDecoration: "none" }}
        >
          Read full chapter <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

/* ─── VERSE PILL ──────────────────────────────────────────────────── */

function VersePill({ verse, popoutKey, activePopout, setActivePopout }) {
  const isOpen = activePopout === popoutKey;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setActivePopout(isOpen ? null : popoutKey)}
        style={{
          ...barlow,
          display:       "flex",
          alignItems:    "center",
          gap:           "5px",
          padding:       "4px 10px",
          borderRadius:  "999px",
          background:    isOpen ? C.goldFaint : "rgba(201,168,76,0.05)",
          border:        `1px solid ${isOpen ? C.goldBorder : "rgba(201,168,76,0.15)"}`,
          color:         isOpen ? C.gold : C.goldMuted,
          fontSize:      "9px",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          fontWeight:    700,
          cursor:        "pointer",
          transition:    "background .15s, border-color .15s, color .15s",
        }}
      >
        {verse.reference}
        <ExternalLink size={9} style={{ opacity: 0.6 }} />
      </button>

      {isOpen && <ScripturePopout verse={verse} onClose={() => setActivePopout(null)} />}
    </div>
  );
}

/* ─── ENTRY ROW ───────────────────────────────────────────────────── */

function EntryRow({ entry, onDelete, last }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding:      "12px 0",
        borderBottom: last ? "none" : `1px solid ${C.goldDiv}`,
        position:     "relative",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 20px", gap: "8px", alignItems: "start" }}>
        <div>
          {/* Lie */}
          <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.35)", marginBottom: "3px" }}>
            The Lie
          </p>
          <p style={{ ...garamond, fontSize: "14px", color: C.ivoryDim, lineHeight: 1.55, fontStyle: "italic", margin: "0 0 10px" }}>
            {entry.lie}
          </p>

          {/* Truth */}
          <p style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.35)", marginBottom: "3px" }}>
            What God Has Said
          </p>
          <p style={{ ...garamond, fontSize: "14px", color: "rgba(250,248,245,0.85)", lineHeight: 1.55, margin: "0 0 8px" }}>
            {entry.truth}
          </p>

          {/* Verse references — plain links to avoid absolute positioning inside scroll container */}
          {entry.verses && entry.verses.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {entry.verses.map((v, i) => (
                <a
                  key={i}
                  href={v.bibleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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

        {/* Delete */}
        <button
          onClick={() => onDelete(entry.id)}
          aria-label="Remove entry"
          style={{
            background: "none",
            border:     "none",
            padding:    0,
            cursor:     "pointer",
            color:      C.ivoryFaint,
            opacity:    hovered ? 1 : 0,
            transition: "opacity .15s, color .15s",
            lineHeight: 1,
            marginTop:  "2px",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(220,80,80,0.8)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = C.ivoryFaint; }}
        >
          <Trash2 size={14} />
        </button>
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
  const textareaRef                     = useRef(null);

  /* Load from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = parsed.map(log => ({
          ...log,
          verses:    log.verses    ?? [],
          timestamp: log.timestamp ?? log.id,
        }));
        setLogs(migrated);
      }
    } catch {}
  }, []);

  /* Persist on every change */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {}
  }, [logs]);

  const handleGenerate = async () => {
    if (!lie.trim() || isGenerating) return;
    setIsGenerating(true);
    setCurrentTruth(null);
    setActivePopout(null);
    setError(null);

    try {
      const res = await fetch("/api/arrow-log", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lie: lie.trim() }),
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
    const newLog = {
      id:        crypto.randomUUID(),
      lie:       lie.trim(),
      truth:     currentTruth.truth,
      verses:    currentTruth.verses ?? [],
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev]);
    setLie("");
    setCurrentTruth(null);
    setActivePopout(null);
    setError(null);
    textareaRef.current?.focus();
  };

  const deleteLog = (id) => {
    setLogs(prev => prev.filter(e => e.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
  };

  return (
    <div style={{
      background:   C.goldGlow,
      border:       `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow:     "visible",
      position:     "relative",
    }}>
      <style>{`
        @keyframes al-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes al-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes al-pulse {
          0%, 100% { opacity: 0.3; }
          50%      { opacity: 0.8; }
        }
        .al-spin    { animation: al-spin 1.2s linear infinite; }
        .al-fade-in { animation: al-fade-in .3s ease forwards; }
        .al-pulse   { animation: al-pulse 1.8s ease infinite; }
        .al-scrollable::-webkit-scrollbar { width: 3px; }
        .al-scrollable::-webkit-scrollbar-track { background: transparent; }
        .al-scrollable::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
        .al-scrollable { scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.2) transparent; }
        .al-btn-seek:hover:not(:disabled) { background: rgba(201,168,76,0.22) !important; }
        .al-btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(201,168,76,0.2) !important; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "1.5rem 1.5rem 1rem" }}>
        <p style={{ ...barlow, fontSize: "9px", letterSpacing: ".44em", textTransform: "uppercase", color: C.gold, marginBottom: "4px" }}>
          Arrow Log
        </p>
        <p style={{ ...garamond, fontStyle: "italic", fontSize: "14px", color: C.ivoryMuted, lineHeight: 1.5, margin: 0 }}>
          Catch the lie. Answer with truth.
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.5rem" }} />

      {/* ── Input area ── */}
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
            width:        "100%",
            background:   C.inputBg,
            border:       `1px solid ${C.goldFaint}`,
            borderRadius: "10px",
            padding:      "10px 12px",
            color:        C.ivory,
            fontSize:     "15px",
            lineHeight:   1.6,
            fontStyle:    "italic",
            outline:      "none",
            resize:       "vertical",
            minHeight:    "70px",
            boxSizing:    "border-box",
            transition:   "border-color .2s",
          }}
          onFocus={e  => { e.target.style.borderColor = "rgba(201,168,76,0.45)"; }}
          onBlur={e   => { e.target.style.borderColor = C.goldFaint; }}
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
              display:       "flex",
              alignItems:    "center",
              gap:           "7px",
              padding:       "8px 16px",
              borderRadius:  "999px",
              background:    "rgba(201,168,76,0.1)",
              border:        `1px solid ${C.goldBorder}`,
              color:         C.gold,
              fontSize:      "9px",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              fontWeight:    700,
              cursor:        (isGenerating || !lie.trim()) ? "not-allowed" : "pointer",
              opacity:       (isGenerating || !lie.trim()) ? 0.5 : 1,
              transition:    "background .2s, opacity .2s",
            }}
          >
            {isGenerating
              ? <Loader2 size={12} className="al-spin" />
              : <Sparkles size={12} />
            }
            {isGenerating ? "Reflecting" : "Seek Truth"}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ padding: "0 1.5rem 1rem" }}>
          <p style={{ ...barlow, fontSize: "10px", letterSpacing: ".12em", color: "rgba(220,80,80,0.75)", margin: 0 }}>
            {error}
          </p>
        </div>
      )}

      {/* ── Truth output ── */}
      {(isGenerating || currentTruth) && (
        <div style={{ padding: "0 1.5rem 1.25rem" }}>
          <div style={{ height: "1px", background: C.goldDiv, marginBottom: "1.25rem" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgba(100,200,120,0.45)", flexShrink: 0 }} />
            <label style={{ ...barlow, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.45)" }}>
              What God Has Said
            </label>
          </div>

          {isGenerating ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px 0" }}>
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Loader2 size={28} style={{ color: "rgba(201,168,76,0.2)" }} className="al-spin" />
                <Sparkles size={12} style={{ position: "absolute", color: C.gold }} />
              </div>
              <p style={{ ...barlow, fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: C.goldMuted, margin: 0 }} className="al-pulse">
                Consulting Scripture
              </p>
            </div>
          ) : currentTruth ? (
            <div className="al-fade-in">
              <p style={{ ...garamond, fontSize: "16px", color: C.ivory, lineHeight: 1.7, fontStyle: "italic", marginBottom: "14px" }}>
                {currentTruth.truth}
              </p>

              {/* Verse pills */}
              {currentTruth.verses && currentTruth.verses.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
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

              {/* Actions */}
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
                    display:       "flex",
                    alignItems:    "center",
                    gap:           "6px",
                    padding:       "7px 14px",
                    borderRadius:  "999px",
                    background:    C.gold,
                    color:         "#0A0A0A",
                    border:        "none",
                    fontSize:      "9px",
                    letterSpacing: ".2em",
                    textTransform: "uppercase",
                    fontWeight:    700,
                    cursor:        "pointer",
                    transition:    "transform .15s, box-shadow .15s",
                  }}
                >
                  <Plus size={11} /> Add to Log
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Empty state (first load) ── */}
      {!isGenerating && !currentTruth && !error && (
        <div style={{ padding: "0 1.5rem 1.25rem", display: "flex", alignItems: "center", gap: "10px" }}>
          <Quote size={16} style={{ color: "rgba(201,168,76,0.15)", flexShrink: 0 }} />
          <p style={{ ...garamond, fontStyle: "italic", fontSize: "14px", color: C.ivoryFaint, lineHeight: 1.5, margin: 0 }}>
            The truth will be revealed here...
          </p>
        </div>
      )}

      {/* ── Cross-link ── */}
      <div style={{ padding: "0 1.5rem 1rem", textAlign: "center" }}>
        <Link
          to="/rule-of-life/community"
          style={{ ...barlow, fontSize: "9px", letterSpacing: ".32em", textTransform: "uppercase", color: C.gold, opacity: 0.5, textDecoration: "none" }}
        >
          Part of the Community rhythm →
        </Link>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.5rem" }} />

      {/* ── History toggle ── */}
      <button
        onClick={() => setShowHistory(h => !h)}
        style={{
          ...barlow,
          display:        "flex",
          alignItems:     "center",
          gap:            "7px",
          width:          "100%",
          padding:        "12px 1.5rem",
          background:     "none",
          border:         "none",
          cursor:         "pointer",
          fontSize:       "9px",
          letterSpacing:  ".3em",
          textTransform:  "uppercase",
          color:          C.goldMuted,
          transition:     "color .15s",
          justifyContent: "center",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = C.gold; }}
        onMouseLeave={e => { e.currentTarget.style.color = C.goldMuted; }}
      >
        <History size={13} />
        {showHistory ? "Hide Arrow Log" : `View Arrow Log${logs.length > 0 ? ` (${logs.length})` : ""}`}
        {showHistory ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
      </button>

      {/* ── History list ── */}
      {showHistory && (
        <div>
          <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.5rem" }} />
          <div
            className="al-scrollable"
            style={{
              maxHeight:  "380px",
              overflowY:  "auto",
              padding:    logs.length === 0 ? "2rem 1.5rem" : "0 1.5rem 1.5rem",
            }}
          >
            {logs.length === 0 ? (
              <p style={{ ...garamond, fontStyle: "italic", fontSize: "14px", color: C.ivoryFaint, lineHeight: 1.7, textAlign: "center", margin: 0 }}>
                No arrows logged yet. Start by identifying a lie you have been believing.
              </p>
            ) : (
              logs.map((entry, i) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onDelete={deleteLog}
                  last={i === logs.length - 1}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
