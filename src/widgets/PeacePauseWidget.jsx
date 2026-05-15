import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";

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
  ivoryPause: "rgba(250,248,245,0.4)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const DEFAULT_STATEMENTS = {
  morning: "The outcome of my story is already secured. I stand in peace.",
  midday:  "The Lord is near. I return to the ground beneath me.",
  evening: "I release what I carried today. God held the world together. I can rest.",
};

const PAUSE_KEYS = ["morning", "midday", "evening"];
const PAUSE_LABELS = { morning: "Morning", midday: "Midday", evening: "Evening" };

/* ── Helpers ── */

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getISOWeekDates() {
  // Returns array of 7 Date objects for Mon–Sun of the current ISO week
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(today.getDate() + offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function dateToKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function completionCount(dayData) {
  if (!dayData) return 0;
  return PAUSE_KEYS.filter(k => dayData[k]).length;
}

/* ── Countdown ── */

function Countdown({ onDismiss }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: "12px",
        color: seconds === 0 ? C.gold : C.ivoryDim,
        letterSpacing: ".06em",
        transition: "color .3s",
      }}>
        {seconds > 0 ? `${String(seconds).padStart(2, "0")}s` : "Peace."}
      </span>
      <button
        onClick={onDismiss}
        style={{
          ...barlow,
          background: "none",
          border: "none",
          color: C.ivoryFaint,
          fontSize: "9px",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: 0,
        }}
      >
        dismiss
      </button>
    </div>
  );
}

/* ── DayCell ── */

function DayCell({ label, count, isToday }) {
  const pct = count / 3;
  const radius = 10;
  const circ = 2 * Math.PI * radius;
  const dash = pct * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        {/* Track */}
        <circle
          cx="12" cy="12" r={radius}
          fill="none"
          stroke={isToday ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.12)"}
          strokeWidth="2"
        />
        {/* Fill */}
        {pct > 0 && (
          <circle
            cx="12" cy="12" r={radius}
            fill="none"
            stroke={C.gold}
            strokeWidth="2"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
            style={{ transition: "stroke-dasharray .4s ease" }}
          />
        )}
        {/* Today highlight dot */}
        {isToday && (
          <circle cx="12" cy="12" r="2" fill={count === 3 ? "#0A0A0A" : C.gold} opacity="0.7" />
        )}
      </svg>
      <span style={{
        ...barlow,
        fontSize: "8px",
        letterSpacing: ".18em",
        textTransform: "uppercase",
        color: isToday ? C.gold : C.ivoryFaint,
      }}>
        {label}
      </span>
    </div>
  );
}

/* ── PEACE PAUSE WIDGET ── */

export function PeacePauseWidget() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();

  const [tracker, setTracker]       = useState({});       // { "YYYY-MM-DD": { morning, midday, evening } }
  const [statements, setStatements] = useState(DEFAULT_STATEMENTS);
  const [active, setActive]         = useState(null);     // "morning" | "midday" | "evening" | null
  const [editing, setEditing]       = useState(null);     // same shape, which one is in edit mode
  const [editValue, setEditValue]   = useState("");
  const [showTimer, setShowTimer]   = useState(false);
  const [timerKey, setTimerKey]     = useState(0);        // remount countdown on new tap
  const editRef = useRef(null);

  /* Seed local state from profile once loaded */
  useEffect(() => {
    if (!isLoaded) return;
    const t = profile.widgets.peaceTracker;
    if (t && Object.keys(t).length > 0) setTracker(t);
    const s = profile.widgets.peaceStatements;
    if (s) setStatements({ ...DEFAULT_STATEMENTS, ...s });
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Persist tracker */
  useEffect(() => {
    if (!isLoaded) return;
    updateProfile({ widgets: { peaceTracker: tracker } });
  }, [tracker]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Persist statements */
  useEffect(() => {
    if (!isLoaded) return;
    updateProfile({ widgets: { peaceStatements: statements } });
  }, [statements]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Focus edit textarea */
  useEffect(() => {
    if (editing && editRef.current) editRef.current.focus();
  }, [editing]);

  const today = todayKey();
  const todayData = tracker[today] || { morning: false, midday: false, evening: false };

  const handlePauseClick = (key) => {
    // Mark complete
    setTracker(prev => ({
      ...prev,
      [today]: { ...(prev[today] || { morning: false, midday: false, evening: false }), [key]: true },
    }));
    // Toggle active panel
    if (active === key) {
      setActive(null);
      setShowTimer(false);
    } else {
      setActive(key);
      setEditing(null);
      setShowTimer(true);
      setTimerKey(k => k + 1);
    }
  };

  const handleEdit = (key) => {
    setEditing(key);
    setEditValue(statements[key]);
  };

  const handleSave = () => {
    if (!editing) return;
    setStatements(prev => ({ ...prev, [editing]: editValue.trim() || prev[editing] }));
    setEditing(null);
  };

  const weekDates  = getISOWeekDates();
  const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
  const todayDateStr = dateToKey(new Date());

  return (
    <div style={{
      background: C.goldGlow,
      border: `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow: "hidden",
    }}>
      <style>{`
        .pp-pause-btn:hover { opacity: 0.85; }
        .pp-edit-btn:hover { color: #C9A84C !important; }
        .pp-save-btn:hover { background: #FAF8F5 !important; }
        .pp-dismiss-btn:hover { color: rgba(250,248,245,0.6) !important; }
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
          Peace Pause
        </p>
        <p style={{
          ...garamond,
          fontStyle: "italic",
          fontSize: "15px",
          color: C.ivoryMuted,
          lineHeight: 1.5,
        }}>
          Three returns. Every day.
        </p>
      </div>

      {/* Pause Buttons */}
      <div style={{ padding: "0 1.75rem 1.5rem", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {PAUSE_KEYS.map(key => {
          const done = todayData[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              className="pp-pause-btn"
              onClick={() => handlePauseClick(key)}
              style={{
                ...barlow,
                flex: 1,
                minWidth: "80px",
                minHeight: "44px",
                padding: "9px 6px",
                background: done ? C.gold : "transparent",
                border: `1px solid ${done ? C.gold : "rgba(201,168,76,0.3)"}`,
                borderRadius: "999px",
                color: done ? "#0A0A0A" : C.ivoryPause,
                fontSize: "9px",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontWeight: 700,
                outline: isActive && !done ? `2px solid rgba(201,168,76,0.4)` : "none",
                outlineOffset: "2px",
                transition: "background .2s, color .2s, border-color .2s",
              }}
            >
              {PAUSE_LABELS[key]}
            </button>
          );
        })}
      </div>

      {/* Active Statement Panel */}
      {active && (
        <div style={{
          margin: "0 1.75rem 1.5rem",
          background: "rgba(201,168,76,0.04)",
          border: `1px solid rgba(201,168,76,0.15)`,
          borderRadius: "14px",
          padding: "1.25rem 1.25rem 1rem",
        }}>
          {editing === active ? (
            <>
              <textarea
                ref={editRef}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                rows={3}
                style={{
                  ...garamond,
                  width: "100%",
                  boxSizing: "border-box",
                  background: C.inputBg,
                  border: `1px solid rgba(201,168,76,0.4)`,
                  borderRadius: "8px",
                  padding: "10px 12px",
                  color: C.ivory,
                  fontSize: "16px",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  outline: "none",
                  resize: "vertical",
                  marginBottom: "10px",
                }}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  className="pp-save-btn"
                  onClick={handleSave}
                  style={{
                    ...barlow,
                    padding: "7px 18px",
                    minHeight: "44px",
                    background: C.gold,
                    color: "#0A0A0A",
                    border: "none",
                    borderRadius: "999px",
                    fontSize: "9px",
                    letterSpacing: ".28em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontWeight: 700,
                    transition: "background .2s",
                  }}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <p style={{
                ...garamond,
                fontStyle: "italic",
                fontSize: "18px",
                color: C.ivory,
                lineHeight: 1.7,
                margin: 0,
                flex: 1,
              }}>
                {statements[active]}
              </p>
              <button
                className="pp-edit-btn"
                onClick={() => handleEdit(active)}
                aria-label="Edit statement"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: C.goldMuted,
                  fontSize: "16px",
                  lineHeight: 1,
                  padding: "2px 0 0 0",
                  flexShrink: 0,
                  transition: "color .2s",
                }}
              >
                ✎
              </button>
            </div>
          )}

          {/* Countdown */}
          {showTimer && editing !== active && (
            <Countdown key={timerKey} onDismiss={() => setShowTimer(false)} />
          )}
        </div>
      )}

      {/* Rule of Life Cross-Link */}
      <div style={{ padding: "0 1.75rem 0.5rem", textAlign: "center" }}>
        <Link
          to="/rule-of-life/sabbath"
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
          Part of the Sabbath rhythm →
        </Link>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.75rem" }} />

      {/* 7-Day Week Tracker */}
      <div style={{ padding: "1.25rem 1.75rem 1.5rem" }}>
        <p style={{
          ...barlow,
          fontSize: "8px",
          letterSpacing: ".32em",
          textTransform: "uppercase",
          color: "rgba(201,168,76,0.4)",
          marginBottom: "12px",
        }}>
          This Week
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDates.map((date, i) => {
            const key = dateToKey(date);
            const count = completionCount(tracker[key]);
            const isToday = key === todayDateStr;
            return (
              <DayCell
                key={key}
                label={DAY_LABELS[i]}
                count={count}
                isToday={isToday}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
