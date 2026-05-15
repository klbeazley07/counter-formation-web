import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import WidgetFrame from "../components/WidgetFrame";
import Button from "../components/primitives/Button";
import Input from "../components/primitives/Input";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES  = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function todayDayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const VT_CSS = `
  .vt-textarea {
    width: 100%;
    box-sizing: border-box;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-faint);
    border-radius: var(--cf-radius-input);
    padding: 10px 14px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-size: 16px;
    line-height: 1.55;
    font-style: italic;
    outline: none;
    resize: vertical;
    transition: border-color .2s ease;
  }
  .vt-textarea:focus { border-color: var(--cf-gold-mid); }
  .vt-textarea::-webkit-scrollbar { width: 4px; }
  .vt-textarea::-webkit-scrollbar-thumb { background: var(--cf-gold-soft); border-radius: 2px; }

  .vt-current-card {
    background: rgba(201,168,76,0.04);
    border: 1px solid var(--cf-gold-faint);
    border-radius: 14px;
    padding: 1.25rem;
  }
  .vt-current-ref {
    font-family: var(--cf-font-brand);
    font-size: 14px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 10px;
    font-weight: 700;
  }
  .vt-current-text {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 20px;
    color: var(--cf-ivory);
    line-height: 1.7;
    margin: 0 0 1.25rem;
  }
  .vt-day-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border: 1px solid var(--cf-gold-soft);
    transition: background .2s ease, border-color .2s ease;
  }
  .vt-day-btn:hover { border-color: var(--cf-gold-mid); }
  .vt-day-btn--today { border-color: var(--cf-gold-mid); }
  .vt-day-btn--checked { background: var(--cf-gold); border-color: var(--cf-gold); }
  .vt-day-btn--checked span { color: #0A0A0A; font-size: 12px; line-height: 1; }
  .vt-day-label {
    font-family: var(--cf-font-brand);
    font-size: 8px;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .vt-day-label--today { color: var(--cf-gold); }
  .vt-day-label--default { color: var(--cf-ivory-18); }

  .vt-reviewed-count {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .2em;
    color: var(--cf-gold-muted);
    margin: 0;
  }

  .vt-empty-state {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 15px;
    color: var(--cf-ivory-18);
    line-height: 1.7;
    text-align: center;
    margin: 0;
  }

  .vt-rule-link {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: var(--cf-gold);
    opacity: 0.6;
    text-decoration: none;
    display: inline-block;
  }
  .vt-rule-link:hover { opacity: 0.85; }

  .vt-lib-eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: var(--cf-gold);
    font-weight: 700;
  }
  .vt-lib-count {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .1em;
    color: var(--cf-ivory-18);
  }
  .vt-lib-toggle {
    font-family: var(--cf-font-brand);
    background: none; border: none;
    color: var(--cf-gold-muted);
    font-size: 9px;
    letter-spacing: .2em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0;
    transition: color .15s ease;
  }
  .vt-lib-toggle:hover { color: var(--cf-gold); }

  .vt-lib-entry {
    padding: 14px 0;
  }
  .vt-lib-entry-ref {
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--cf-gold);
    font-weight: 700;
  }
  .vt-lib-entry-date {
    font-family: var(--cf-font-brand);
    font-size: 8px;
    letter-spacing: .12em;
    color: var(--cf-ivory-18);
  }
  .vt-lib-entry-text {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    color: var(--cf-ivory-35);
    line-height: 1.6;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .vt-lib-show-more {
    font-family: var(--cf-font-brand);
    background: none; border: none;
    padding: 4px 0 0;
    color: var(--cf-gold-muted);
    font-size: 8px;
    letter-spacing: .2em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color .15s ease;
  }
  .vt-lib-show-more:hover { color: var(--cf-gold); }
  .vt-lib-empty {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    color: var(--cf-ivory-18);
    line-height: 1.6;
    text-align: center;
    margin: 1rem 0 0;
  }
`;

function LibraryEntry({ entry, last }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="vt-lib-entry" style={{ borderBottom: last ? "none" : "1px solid var(--cf-gold-hairline)" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "6px" }}>
        <span className="vt-lib-entry-ref">{entry.ref}</span>
        <span className="vt-lib-entry-date">{formatDate(entry.dateAdded)}</span>
      </div>
      <p
        className="vt-lib-entry-text"
        style={{ WebkitLineClamp: expanded ? "unset" : 2 }}
      >
        {entry.text}
      </p>
      {entry.text && entry.text.length > 100 && (
        <button className="vt-lib-show-more" onClick={() => setExpanded(e => !e)}>
          {expanded ? "show less" : "show more"}
        </button>
      )}
    </div>
  );
}

export function VerseTrackerWidget() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const [current, setCurrent]     = useState(null);
  const [library, setLibrary]     = useState([]);
  const [refInput, setRefInput]   = useState("");
  const [textInput, setTextInput] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const profileLib = profile?.widgets?.verseTracker?.library ?? [];
    setLibrary(profileLib);
    const profileCur = profile?.widgets?.verseTracker?.current ?? null;
    if (profileCur) {
      const currentWeek = isoWeekKey();
      if (profileCur.weekKey && profileCur.weekKey !== currentWeek) {
        archiveAndClear(profileCur);
      } else {
        setCurrent(profileCur);
      }
    }
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoaded) return;
    updateProfile({ widgets: { verseTracker: { current: current ?? null } } });
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoaded) return;
    updateProfile({ widgets: { verseTracker: { library } } });
  }, [library]); // eslint-disable-line react-hooks/exhaustive-deps

  const archiveAndClear = (entry) => {
    if (!entry || !entry.ref) return;
    setLibrary(prev => {
      const updated = [{ ref: entry.ref, text: entry.text, dateAdded: new Date().toISOString() }, ...prev];
      updateProfile({ widgets: { verseTracker: { library: updated } } });
      return updated;
    });
    setCurrent(null);
    updateProfile({ widgets: { verseTracker: { current: null } } });
  };

  const handleSetVerse = () => {
    const r = refInput.trim();
    const t = textInput.trim();
    if (!r && !t) return;

    if (current && current.ref) {
      setLibrary(prev => {
        const updated = [{ ref: current.ref, text: current.text, dateAdded: new Date().toISOString() }, ...prev];
        updateProfile({ widgets: { verseTracker: { library: updated } } });
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
  const canSet = refInput.trim() || textInput.trim();

  return (
    <WidgetFrame
      title="Verse Tracker"
      subtitle="One verse per week. Fifty-two per year."
    >
      <style>{VT_CSS}</style>

      <div style={{ padding: "1.5rem 1.75rem 1.25rem", display: "flex", flexDirection: "column", gap: "10px" }}>
        <Input
          variant="reference"
          value={refInput}
          onChange={e => setRefInput(e.target.value)}
          placeholder="Romans 8:1"
          ariaLabel="Verse reference"
        />
        <textarea
          className="vt-textarea"
          rows={3}
          value={textInput}
          onChange={e => setTextInput(e.target.value)}
          placeholder="The verse text..."
          aria-label="Verse text"
        />
        <Button
          variant="primary"
          size="sm"
          disabled={!canSet}
          onClick={handleSetVerse}
          className="cf-btn--full"
        >
          Set This Week’s Verse
        </Button>
      </div>
      <style>{`.cf-btn--full { width: 100%; }`}</style>

      {current ? (
        <div style={{ padding: "0 1.75rem 1.5rem" }}>
          <div className="vt-current-card">
            {current.ref && <p className="vt-current-ref">{current.ref}</p>}
            {current.text && <p className="vt-current-text">{current.text}</p>}

            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "nowrap", marginBottom: "10px" }}>
              {DAY_LABELS.map((label, i) => {
                const checked = current.days[i];
                const isToday = i === todayDayIndex();
                const cls = [
                  "vt-day-btn",
                  isToday ? "vt-day-btn--today" : "",
                  checked ? "vt-day-btn--checked" : "",
                ].filter(Boolean).join(" ");
                return (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <button
                      className={cls}
                      onClick={() => toggleDay(i)}
                      aria-label={`Mark ${DAY_NAMES[i]} reviewed`}
                      aria-pressed={checked}
                    >
                      {checked && <span>✓</span>}
                    </button>
                    <span className={`vt-day-label ${isToday ? "vt-day-label--today" : "vt-day-label--default"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="vt-reviewed-count">{reviewedCount} of 7 days reviewed</p>
          </div>
        </div>
      ) : (
        <div style={{ padding: "0 1.75rem 1.5rem" }}>
          <p className="vt-empty-state">Your arsenal is empty. Set your first verse above.</p>
        </div>
      )}

      <div style={{ padding: "0 1.75rem 1rem", textAlign: "center" }}>
        <Link to="/rule-of-life/scripture" className="vt-rule-link">
          Part of the Scripture rhythm →
        </Link>
      </div>

      <div style={{ height: "1px", background: "var(--cf-gold-hairline)", margin: "0 1.75rem" }} />

      <div style={{ padding: "1.25rem 1.75rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showLibrary ? "1rem" : 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span className="vt-lib-eyebrow">My Verses</span>
            {library.length > 0 && (
              <span className="vt-lib-count">
                ({library.length} {library.length === 1 ? "verse" : "verses"})
              </span>
            )}
          </div>
          <button
            className="vt-lib-toggle"
            onClick={() => setShowLibrary(s => !s)}
            aria-expanded={showLibrary}
            aria-controls="vt-lib-list"
          >
            {showLibrary ? "Hide Library ▴" : "Show Library ▾"}
          </button>
        </div>

        {showLibrary && (
          <div id="vt-lib-list">
            {library.length === 0 ? (
              <p className="vt-lib-empty">No archived verses yet.</p>
            ) : (
              library.map((entry, i) => (
                <LibraryEntry key={i} entry={entry} last={i === library.length - 1} />
              ))
            )}
          </div>
        )}
      </div>
    </WidgetFrame>
  );
}
