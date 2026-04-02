import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const KEY_CURRENT = "cf-sword-current";
const KEY_LIBRARY = "cf-sword-library";

const C = {
  gold:       "#C9A84C",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldGlow:   "rgba(201,168,76,0.06)",
  goldBorder: "rgba(201,168,76,0.2)",
  goldDiv:    "rgba(201,168,76,0.1)",
  goldMuted:  "rgba(201,168,76,0.5)",
  inputBg:    "#17140F",
  ivory:      "#FAF8F5",
  ivoryMuted: "rgba(250,248,245,0.55)",
  ivoryDim:   "rgba(250,248,245,0.35)",
  ivoryFaint: "rgba(250,248,245,0.18)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

/* ── ISO week key: "YYYY-WNN" ── */
function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7; // Mon=1 … Sun=7
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function todayDayIndex() {
  // Mon=0 … Sun=6
  const day = new Date().getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── Library Entry ── */

function LibraryEntry({ entry, last }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      padding: "14px 0",
      borderBottom: last ? "none" : `1px solid rgba(201,168,76,0.1)`,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{
          ...barlow,
          fontSize: "11px",
          letterSpacing: ".28em",
          textTransform: "uppercase",
          color: C.gold,
        }}>
          {entry.ref}
        </span>
        <span style={{
          ...barlow,
          fontSize: "8px",
          letterSpacing: ".12em",
          color: C.ivoryFaint,
        }}>
          {formatDate(entry.dateAdded)}
        </span>
      </div>

      <p style={{
        ...garamond,
        fontStyle: "italic",
        fontSize: "14px",
        color: C.ivoryDim,
        lineHeight: 1.6,
        margin: 0,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: expanded ? "unset" : 2,
      }}>
        {entry.text}
      </p>

      {entry.text && entry.text.length > 100 && (
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            ...barlow,
            background: "none",
            border: "none",
            padding: "4px 0 0",
            color: C.goldMuted,
            fontSize: "8px",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {expanded ? "show less" : "show more"}
        </button>
      )}
    </div>
  );
}

/* ── VERSE TRACKER WIDGET ── */

export function VerseTrackerWidget() {
  const [current, setCurrent]         = useState(null);   // { ref, text, days, weekKey }
  const [library, setLibrary]         = useState([]);
  const [refInput, setRefInput]       = useState("");
  const [textInput, setTextInput]     = useState("");
  const [refFocus, setRefFocus]       = useState(false);
  const [textFocus, setTextFocus]     = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  /* Load & check week rollover on mount */
  useEffect(() => {
    try {
      const rawLib = localStorage.getItem(KEY_LIBRARY);
      if (rawLib) setLibrary(JSON.parse(rawLib));
    } catch {}

    try {
      const rawCur = localStorage.getItem(KEY_CURRENT);
      if (rawCur) {
        const cur = JSON.parse(rawCur);
        const currentWeek = isoWeekKey();
        if (cur.weekKey && cur.weekKey !== currentWeek) {
          // New week — archive and clear
          archiveAndClear(cur);
        } else {
          setCurrent(cur);
        }
      }
    } catch {}
  }, []);

  /* Persist current */
  useEffect(() => {
    try {
      if (current) localStorage.setItem(KEY_CURRENT, JSON.stringify(current));
      else localStorage.removeItem(KEY_CURRENT);
    } catch {}
  }, [current]);

  /* Persist library */
  useEffect(() => {
    try { localStorage.setItem(KEY_LIBRARY, JSON.stringify(library)); } catch {}
  }, [library]);

  const archiveAndClear = (entry) => {
    if (!entry || !entry.ref) return;
    setLibrary(prev => {
      const updated = [{ ref: entry.ref, text: entry.text, dateAdded: new Date().toISOString() }, ...prev];
      try { localStorage.setItem(KEY_LIBRARY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    setCurrent(null);
    try { localStorage.removeItem(KEY_CURRENT); } catch {}
  };

  const handleSetVerse = () => {
    const r = refInput.trim();
    const t = textInput.trim();
    if (!r && !t) return;

    // Archive existing
    if (current && current.ref) {
      setLibrary(prev => {
        const updated = [{ ref: current.ref, text: current.text, dateAdded: new Date().toISOString() }, ...prev];
        try { localStorage.setItem(KEY_LIBRARY, JSON.stringify(updated)); } catch {}
        return updated;
      });
    }

    const newEntry = {
      ref:     r,
      text:    t,
      days:    [false, false, false, false, false, false, false],
      weekKey: isoWeekKey(),
    };
    setCurrent(newEntry);
    setRefInput("");
    setTextInput("");
  };

  const toggleDay = (i) => {
    if (!current) return;
    setCurrent(prev => {
      const days = [...prev.days];
      days[i] = !days[i];
      return { ...prev, days };
    });
  };

  const reviewedCount = current ? current.days.filter(Boolean).length : 0;

  const inputStyle = (focused) => ({
    ...garamond,
    width: "100%",
    boxSizing: "border-box",
    background: C.inputBg,
    border: `1px solid ${focused ? "rgba(201,168,76,0.4)" : C.goldFaint}`,
    borderRadius: "10px",
    padding: "10px 14px",
    color: C.ivory,
    fontSize: "16px",
    lineHeight: 1.55,
    fontStyle: "italic",
    outline: "none",
    transition: "border-color .2s",
  });

  return (
    <div style={{
      background: C.goldGlow,
      border: `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow: "hidden",
    }}>
      <style>{`
        .vt-set-btn:hover:not(:disabled) { background: #FAF8F5 !important; }
        .vt-day-btn:hover { border-color: rgba(201,168,76,0.6) !important; }
        .vt-show-more:hover { color: #C9A84C !important; }
        .vt-textarea::-webkit-scrollbar { width: 4px; }
        .vt-textarea::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "1.75rem 1.75rem 1.25rem" }}>
        <p style={{
          ...barlow,
          fontSize: "9px",
          letterSpacing: ".44em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: "6px",
        }}>
          Verse Tracker
        </p>
        <p style={{
          ...garamond,
          fontStyle: "italic",
          fontSize: "15px",
          color: C.ivoryMuted,
          lineHeight: 1.5,
        }}>
          One verse per week. Fifty-two per year.
        </p>
      </div>

      {/* Input Form */}
      <div style={{ padding: "0 1.75rem 1.25rem", display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          value={refInput}
          onChange={e => setRefInput(e.target.value)}
          onFocus={() => setRefFocus(true)}
          onBlur={() => setRefFocus(false)}
          placeholder="Romans 8:1"
          style={{ ...inputStyle(refFocus), fontStyle: "normal", ...barlow, fontSize: "16px", letterSpacing: ".06em" }}
        />
        <textarea
          className="vt-textarea"
          rows={3}
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          onFocus={() => setTextFocus(true)}
          onBlur={() => setTextFocus(false)}
          placeholder="The verse text..."
          style={{ ...inputStyle(textFocus), resize: "vertical" }}
        />
        <button
          className="vt-set-btn"
          onClick={handleSetVerse}
          disabled={!refInput.trim() && !textInput.trim()}
          style={{
            ...barlow,
            padding: "11px 0",
            minHeight: "44px",
            background: (!refInput.trim() && !textInput.trim()) ? "rgba(201,168,76,0.25)" : C.gold,
            color: (!refInput.trim() && !textInput.trim()) ? "rgba(10,10,10,0.4)" : "#0A0A0A",
            border: "none",
            borderRadius: "999px",
            fontSize: "9px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            cursor: (!refInput.trim() && !textInput.trim()) ? "not-allowed" : "pointer",
            fontWeight: 700,
            transition: "background .2s, color .2s",
          }}
        >
          Set This Week&rsquo;s Verse
        </button>
      </div>

      {/* Current Verse Display */}
      {current ? (
        <div style={{ padding: "0 1.75rem 1.5rem" }}>
          <div style={{
            background: "rgba(201,168,76,0.04)",
            border: `1px solid rgba(201,168,76,0.15)`,
            borderRadius: "14px",
            padding: "1.25rem",
          }}>
            {current.ref && (
              <p style={{
                ...barlow,
                fontSize: "14px",
                letterSpacing: ".18em",
                textTransform: "uppercase",
                color: C.gold,
                marginBottom: "10px",
              }}>
                {current.ref}
              </p>
            )}
            {current.text && (
              <p style={{
                ...garamond,
                fontStyle: "italic",
                fontSize: "20px",
                color: C.ivory,
                lineHeight: 1.7,
                margin: 0,
                marginBottom: "1.25rem",
              }}>
                {current.text}
              </p>
            )}

            {/* 7-day circles */}
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", marginBottom: "10px" }}>
              {DAY_LABELS.map((label, i) => {
                const checked = current.days[i];
                const isToday = i === todayDayIndex();
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <button
                      className="vt-day-btn"
                      onClick={() => toggleDay(i)}
                      aria-label={`Toggle ${label}`}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: checked ? C.gold : "transparent",
                        border: `1px solid ${checked ? C.gold : isToday ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)"}`,
                        cursor: "pointer",
                        transition: "background .2s, border-color .2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        outline: "none",
                      }}
                    >
                      {checked && (
                        <span style={{ color: "#0A0A0A", fontSize: "12px", lineHeight: 1 }}>✓</span>
                      )}
                    </button>
                    <span style={{
                      ...barlow,
                      fontSize: "8px",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: isToday ? C.gold : C.ivoryFaint,
                    }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p style={{
              ...barlow,
              fontSize: "9px",
              letterSpacing: ".2em",
              color: C.goldMuted,
              margin: 0,
            }}>
              {reviewedCount} of 7 days reviewed
            </p>
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 1.75rem 1.5rem" }}>
          <p style={{
            ...garamond,
            fontStyle: "italic",
            fontSize: "15px",
            color: C.ivoryFaint,
            lineHeight: 1.7,
            textAlign: "center",
            margin: 0,
          }}>
            Your arsenal is empty. Set your first verse above.
          </p>
        </div>
      )}

      {/* Rule of Life Cross-Link */}
      <div style={{ padding: "0 1.75rem 1rem", textAlign: "center" }}>
        <Link
          to="/rule-of-life/scripture"
          style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      "9px",
            letterSpacing: ".32em",
            textTransform: "uppercase",
            color:         C.gold,
            opacity:       0.6,
            textDecoration:"none",
            display:       "inline-block",
          }}
        >
          Part of the Scripture rhythm →
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.75rem" }} />

      {/* Library Section */}
      <div style={{ padding: "1.25rem 1.75rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showLibrary ? "1rem" : 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{
              ...barlow,
              fontSize: "9px",
              letterSpacing: ".44em",
              textTransform: "uppercase",
              color: C.gold,
            }}>
              My Verses
            </span>
            {library.length > 0 && (
              <span style={{
                ...barlow,
                fontSize: "9px",
                letterSpacing: ".1em",
                color: C.ivoryFaint,
              }}>
                ({library.length} {library.length === 1 ? "verse" : "verses"})
              </span>
            )}
          </div>
          <button
            onClick={() => setShowLibrary(s => !s)}
            style={{
              ...barlow,
              background: "none",
              border: "none",
              color: C.goldMuted,
              fontSize: "9px",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {showLibrary ? "Hide Library ▴" : "Show Library ▾"}
          </button>
        </div>

        {showLibrary && (
          library.length === 0 ? (
            <p style={{
              ...garamond,
              fontStyle: "italic",
              fontSize: "14px",
              color: C.ivoryFaint,
              lineHeight: 1.6,
              textAlign: "center",
              margin: "1rem 0 0",
            }}>
              No archived verses yet.
            </p>
          ) : (
            <div>
              {library.map((entry, i) => (
                <LibraryEntry key={i} entry={entry} last={i === library.length - 1} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
