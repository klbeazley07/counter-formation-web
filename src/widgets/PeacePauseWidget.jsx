import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import WidgetFrame from "../components/WidgetFrame";
import Button from "../components/primitives/Button";

const DEFAULT_STATEMENTS = {
  morning: "The outcome of my story is already secured. I stand in peace.",
  midday:  "The Lord is near. I return to the ground beneath me.",
  evening: "I release what I carried today. God held the world together. I can rest.",
};

const PAUSE_KEYS = ["morning", "midday", "evening"];
const PAUSE_LABELS = { morning: "Morning", midday: "Midday", evening: "Evening" };
const DAY_FULL = { M: "Monday", T: "Tuesday", W: "Wednesday", F: "Friday", S: "Saturday" };
// Workaround for duplicate keys (T appears twice for Tuesday/Thursday, S for Saturday/Sunday) — see WEEKDAY_NAMES below.
const WEEKDAY_NAMES = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getISOWeekDates() {
  const today = new Date();
  const dayOfWeek = today.getDay();
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

const PEACE_CSS = `
  .pp-pause-btn {
    font-family: var(--cf-font-brand);
    flex: 1;
    min-width: 80px;
    min-height: 44px;
    padding: 9px 6px;
    background: transparent;
    border: 1px solid var(--cf-gold-mid);
    border-radius: var(--cf-radius-pill);
    color: var(--cf-ivory-42);
    font-size: 9px;
    letter-spacing: .28em;
    text-transform: uppercase;
    cursor: pointer;
    font-weight: 700;
    transition: background .2s ease, color .2s ease, border-color .2s ease;
  }
  .pp-pause-btn:hover { opacity: 0.85; }
  .pp-pause-btn--done {
    background: var(--cf-gold);
    color: #0A0A0A;
    border-color: var(--cf-gold);
  }
  .pp-pause-btn--active:not(.pp-pause-btn--done) {
    outline: 2px solid var(--cf-gold-mid);
    outline-offset: 2px;
  }

  .pp-statement-panel {
    margin: 0 var(--cf-space-card-pad) 1.5rem;
    background: rgba(201,168,76,0.04);
    border: 1px solid var(--cf-gold-faint);
    border-radius: 14px;
    padding: 1.25rem 1.25rem 1rem;
  }
  .pp-statement {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 18px;
    color: var(--cf-ivory);
    line-height: 1.7;
    margin: 0;
    flex: 1;
  }
  .pp-edit-btn {
    background: none; border: none; cursor: pointer;
    color: var(--cf-gold-muted);
    font-size: 16px; line-height: 1;
    padding: 2px 0 0;
    flex-shrink: 0;
    transition: color .2s ease;
  }
  .pp-edit-btn:hover { color: var(--cf-gold); }
  .pp-edit-textarea {
    width: 100%;
    box-sizing: border-box;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-mid);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-size: 16px;
    line-height: 1.6;
    font-style: italic;
    outline: none;
    resize: vertical;
    margin-bottom: 10px;
  }

  .pp-rule-link {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: var(--cf-gold);
    opacity: 0.6;
    text-decoration: none;
    display: inline-block;
  }
  .pp-rule-link:hover { opacity: 0.85; }

  .pp-week-eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 8px;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: var(--cf-gold-muted);
    margin: 0 0 12px;
  }

  .pp-day-label {
    font-family: var(--cf-font-brand);
    font-size: 8px;
    letter-spacing: .18em;
    text-transform: uppercase;
  }
  .pp-day-label--today { color: var(--cf-gold); }
  .pp-day-label--default { color: var(--cf-ivory-18); }

  .pp-countdown {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    letter-spacing: .06em;
    transition: color .3s ease;
  }
  .pp-countdown--ready { color: var(--cf-gold); }
  .pp-countdown--counting { color: var(--cf-ivory-35); }

  .pp-dismiss-btn {
    font-family: var(--cf-font-brand);
    background: none; border: none;
    color: var(--cf-ivory-18);
    font-size: 9px;
    letter-spacing: .2em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0;
    transition: color .15s ease;
  }
  .pp-dismiss-btn:hover { color: var(--cf-ivory-62); }
`;

function Countdown({ onDismiss }) {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
      <span className={`pp-countdown ${seconds === 0 ? "pp-countdown--ready" : "pp-countdown--counting"}`}>
        {seconds > 0 ? `${String(seconds).padStart(2, "0")}s` : "Peace."}
      </span>
      <button onClick={onDismiss} className="pp-dismiss-btn">dismiss</button>
    </div>
  );
}

function DayCell({ label, dayName, count, isToday }) {
  const pct = count / 3;
  const radius = 10;
  const circ = 2 * Math.PI * radius;
  const dash = pct * circ;
  const ariaLabel = `${dayName}: ${count} of 3 pauses complete`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <svg width="24" height="24" viewBox="0 0 24 24" role="img" aria-label={ariaLabel}>
        <circle
          cx="12" cy="12" r={radius}
          fill="none"
          stroke={isToday ? "var(--cf-gold-mid)" : "var(--cf-gold-hairline)"}
          strokeWidth="2"
        />
        {pct > 0 && (
          <circle
            cx="12" cy="12" r={radius}
            fill="none"
            stroke="var(--cf-gold)"
            strokeWidth="2"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
            style={{ transition: "stroke-dasharray .4s ease" }}
          />
        )}
        {isToday && (
          <circle cx="12" cy="12" r="2" fill={count === 3 ? "#0A0A0A" : "var(--cf-gold)"} opacity="0.7" />
        )}
      </svg>
      <span className={`pp-day-label ${isToday ? "pp-day-label--today" : "pp-day-label--default"}`}>
        {label}
      </span>
    </div>
  );
}

export function PeacePauseWidget() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();

  const [tracker, setTracker]       = useState({});
  const [statements, setStatements] = useState(DEFAULT_STATEMENTS);
  const [active, setActive]         = useState(null);
  const [editing, setEditing]       = useState(null);
  const [editValue, setEditValue]   = useState("");
  const [showTimer, setShowTimer]   = useState(false);
  const [timerKey, setTimerKey]     = useState(0);
  const editRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;
    const t = profile.widgets.peaceTracker;
    if (t && Object.keys(t).length > 0) setTracker(t);
    const s = profile.widgets.peaceStatements;
    if (s) setStatements({ ...DEFAULT_STATEMENTS, ...s });
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoaded) return;
    updateProfile({ widgets: { peaceTracker: tracker } });
  }, [tracker]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoaded) return;
    updateProfile({ widgets: { peaceStatements: statements } });
  }, [statements]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editing && editRef.current) editRef.current.focus();
  }, [editing]);

  const today = todayKey();
  const todayData = tracker[today] || { morning: false, midday: false, evening: false };

  const handlePauseClick = (key) => {
    setTracker(prev => ({
      ...prev,
      [today]: { ...(prev[today] || { morning: false, midday: false, evening: false }), [key]: true },
    }));
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
    <WidgetFrame
      title="Peace Pause"
      subtitle="Three returns. Every day."
    >
      <style>{PEACE_CSS}</style>

      <div style={{ padding: "1.5rem 1.75rem 1.5rem", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {PAUSE_KEYS.map(key => {
          const done = todayData[key];
          const isActive = active === key;
          const cls = [
            "pp-pause-btn",
            done ? "pp-pause-btn--done" : "",
            isActive ? "pp-pause-btn--active" : "",
          ].filter(Boolean).join(" ");
          return (
            <button
              key={key}
              className={cls}
              onClick={() => handlePauseClick(key)}
              aria-pressed={done}
            >
              {PAUSE_LABELS[key]}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="pp-statement-panel">
          {editing === active ? (
            <>
              <textarea
                ref={editRef}
                className="pp-edit-textarea"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                rows={3}
                aria-label="Edit pause statement"
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <p className="pp-statement">{statements[active]}</p>
              <button
                className="pp-edit-btn"
                onClick={() => handleEdit(active)}
                aria-label={`Edit ${PAUSE_LABELS[active]} statement`}
              >
                ✎
              </button>
            </div>
          )}

          {showTimer && editing !== active && (
            <Countdown key={timerKey} onDismiss={() => setShowTimer(false)} />
          )}
        </div>
      )}

      <div style={{ padding: "0 1.75rem 0.5rem", textAlign: "center" }}>
        <Link to="/rule-of-life/sabbath" className="pp-rule-link">
          Part of the Sabbath rhythm →
        </Link>
      </div>

      <div style={{ height: "1px", background: "var(--cf-gold-hairline)", margin: "0 1.75rem" }} />

      <div style={{ padding: "1.25rem 1.75rem 1.5rem" }}>
        <p className="pp-week-eyebrow">This Week</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDates.map((date, i) => {
            const key = dateToKey(date);
            const count = completionCount(tracker[key]);
            const isToday = key === todayDateStr;
            return (
              <DayCell
                key={key}
                label={DAY_LABELS[i]}
                dayName={WEEKDAY_NAMES[i]}
                count={count}
                isToday={isToday}
              />
            );
          })}
        </div>
      </div>
    </WidgetFrame>
  );
}
