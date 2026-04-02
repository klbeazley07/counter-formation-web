import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "cf-arrow-log";

const C = {
  gold:       "#C9A84C",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldGlow:   "rgba(201,168,76,0.06)",
  goldBorder: "rgba(201,168,76,0.2)",
  goldDiv:    "rgba(201,168,76,0.1)",
  darkBg:     "#0E0C0A",
  inputBg:    "#17140F",
  ivory:      "#FAF8F5",
  ivoryMuted: "rgba(250,248,245,0.55)",
  ivoryDim:   "rgba(250,248,245,0.35)",
  ivoryFaint: "rgba(250,248,245,0.18)",
  white06:    "rgba(255,255,255,0.06)",
  white10:    "rgba(255,255,255,0.1)",
};

const barlow = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

/* ─── ARROW LOG WIDGET ───────────────────────────────────────────── */

export function ArrowLogWidget() {
  const [entries, setEntries] = useState([]);
  const [lie, setLie]   = useState("");
  const [truth, setTruth] = useState("");
  const [lieHover, setLieHover]     = useState(false);
  const [truthHover, setTruthHover] = useState(false);
  const [lieFocus, setLieFocus]     = useState(false);
  const [truthFocus, setTruthFocus] = useState(false);
  const lieRef   = useRef(null);
  const truthRef = useRef(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const handleAdd = () => {
    const trimLie   = lie.trim();
    const trimTruth = truth.trim();
    if (!trimLie || !trimTruth) return;
    setEntries(prev => [{ id: Date.now(), lie: trimLie, truth: trimTruth }, ...prev]);
    setLie("");
    setTruth("");
    lieRef.current?.focus();
  };

  const handleDelete = (id) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
  };

  const inputStyle = (focused) => ({
    ...garamond,
    flex: 1,
    minWidth: 0,
    background: C.inputBg,
    border: `1px solid ${focused ? "rgba(201,168,76,0.4)" : C.goldFaint}`,
    borderRadius: "10px",
    padding: "10px 14px",
    color: C.ivory,
    fontSize: "16px",
    lineHeight: 1.5,
    outline: "none",
    transition: "border-color .2s",
    fontStyle: "italic",
  });

  return (
    <div style={{
      background: C.goldGlow,
      border: `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow: "hidden",
    }}>

      {/* ── Header ── */}
      <div style={{ padding: "1.75rem 1.75rem 1.25rem" }}>
        <p style={{
          ...barlow,
          fontSize: "9px",
          letterSpacing: ".44em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: "6px",
        }}>
          Arrow Log
        </p>
        <p style={{
          ...garamond,
          fontStyle: "italic",
          fontSize: "15px",
          color: C.ivoryMuted,
          lineHeight: 1.5,
        }}>
          Catch the lie. Answer with truth.
        </p>
      </div>

      {/* ── Entry Form ── */}
      <div style={{ padding: "0 1.75rem 1.5rem" }}>
        {/* Inputs — two columns, stack below 380px */}
        <style>{`
          @media (max-width: 379px) {
            .arrow-log-inputs { flex-direction: column !important; }
          }
          .arrow-log-entry-row:hover .arrow-log-delete { opacity: 1 !important; }
          .arrow-log-delete:focus { opacity: 1 !important; }
          .arrow-log-scrollable::-webkit-scrollbar { width: 4px; }
          .arrow-log-scrollable::-webkit-scrollbar-track { background: transparent; }
          .arrow-log-scrollable::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
          .arrow-log-scrollable { scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.2) transparent; }
        `}</style>

        <div className="arrow-log-inputs" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            ref={lieRef}
            value={lie}
            onChange={e => setLie(e.target.value)}
            onFocus={() => setLieFocus(true)}
            onBlur={() => setLieFocus(false)}
            onKeyDown={handleKeyDown}
            placeholder="The lie..."
            style={inputStyle(lieFocus)}
          />
          <input
            ref={truthRef}
            value={truth}
            onChange={e => setTruth(e.target.value)}
            onFocus={() => setTruthFocus(true)}
            onBlur={() => setTruthFocus(false)}
            onKeyDown={handleKeyDown}
            placeholder="What God has said..."
            style={inputStyle(truthFocus)}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleAdd}
            disabled={!lie.trim() || !truth.trim()}
            style={{
              ...barlow,
              padding: "8px 22px",
              minHeight: "44px",
              background: (!lie.trim() || !truth.trim()) ? "rgba(201,168,76,0.25)" : C.gold,
              color: (!lie.trim() || !truth.trim()) ? "rgba(10,10,10,0.4)" : "#0A0A0A",
              border: "none",
              borderRadius: "999px",
              fontSize: "9px",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              cursor: (!lie.trim() || !truth.trim()) ? "not-allowed" : "pointer",
              fontWeight: 700,
              transition: "background .2s, color .2s",
            }}
            onMouseEnter={e => { if (lie.trim() && truth.trim()) e.currentTarget.style.background = C.ivory; }}
            onMouseLeave={e => { if (lie.trim() && truth.trim()) e.currentTarget.style.background = C.gold; }}
          >
            Add
          </button>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.75rem" }} />

      {/* ── Column Headers ── */}
      {entries.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 24px",
          gap: "12px",
          padding: "10px 1.75rem 6px",
          alignItems: "center",
        }}>
          <span style={{ ...barlow, fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(201,168,76,0.4)" }}>The Lie</span>
          <span style={{ ...barlow, fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(201,168,76,0.4)" }}>What God Has Said</span>
          <span />
        </div>
      )}

      {/* ── Entry List ── */}
      <div
        className="arrow-log-scrollable"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          padding: entries.length === 0 ? "2.5rem 1.75rem" : "0 1.75rem 1.5rem",
        }}
      >
        {entries.length === 0 ? (
          <p style={{
            ...garamond,
            fontStyle: "italic",
            fontSize: "15px",
            color: C.ivoryFaint,
            lineHeight: 1.7,
            textAlign: "center",
            maxWidth: "320px",
            margin: "0 auto",
          }}>
            No arrows logged yet. Start by identifying a lie you have been believing.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {entries.map((entry, i) => (
              <EntryRow
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                last={i === entries.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── ENTRY ROW ───────────────────────────────────────────────────── */

function EntryRow({ entry, onDelete, last }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="arrow-log-entry-row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 24px",
        gap: "12px",
        padding: "12px 0",
        borderBottom: last ? "none" : `1px solid rgba(201,168,76,0.1)`,
        alignItems: "start",
        transition: "background .15s",
      }}
    >
      {/* Lie — muted, being diminished */}
      <p style={{
        ...garamond,
        fontSize: "15px",
        color: "rgba(250,248,245,0.5)",
        lineHeight: 1.55,
        margin: 0,
        fontStyle: "italic",
      }}>
        {entry.lie}
      </p>

      {/* Truth — elevated, full ivory */}
      <p style={{
        ...garamond,
        fontSize: "15px",
        color: "rgba(250,248,245,0.88)",
        lineHeight: 1.55,
        margin: 0,
      }}>
        {entry.truth}
      </p>

      {/* Delete */}
      <button
        className="arrow-log-delete"
        onClick={() => onDelete(entry.id)}
        aria-label="Remove entry"
        style={{
          width: "24px",
          height: "24px",
          flexShrink: 0,
          alignSelf: "center",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity .15s",
          color: "rgba(250,248,245,0.3)",
          fontSize: "16px",
          lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "rgba(250,248,245,0.7)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(250,248,245,0.3)"; }}
      >
        ×
      </button>
    </div>
  );
}
