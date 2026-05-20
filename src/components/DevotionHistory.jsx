import { useState } from "react";
import { useFormationProfile } from "../hooks/useFormationProfile";

/*
 * DevotionHistory — collapsible panel showing the user's three most recent
 * devotions. Reads profile.widgets.devotions. Renders null if empty.
 *
 * Each entry shows passage, theme, summary. No CTAs — this is a presence
 * indicator, not a re-entry point. Re-entry can be added later.
 */

const DH_CSS = `
  .dh-wrap {
    margin-bottom: 28px;
    border: 1px solid rgba(201,168,76,0.14);
    border-radius: 18px;
    background: rgba(28,24,19,0.55);
    overflow: hidden;
  }
  .dh-toggle {
    width: 100%;
    background: transparent;
    border: none;
    padding: 18px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    color: #FAF8F5;
    text-align: left;
    transition: background 0.18s ease;
  }
  .dh-toggle:hover { background: rgba(201,168,76,0.05); }
  .dh-toggle-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: #C9A84C;
    font-weight: 700;
  }
  .dh-toggle-count {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-size: 15px;
    color: rgba(250,248,245,0.62);
  }
  .dh-toggle-chev {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    color: #C9A84C;
    letter-spacing: 0.2em;
  }
  .dh-list {
    padding: 6px 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .dh-entry {
    background: #1A1612;
    border: 1px solid rgba(201,168,76,0.10);
    border-radius: 14px;
    padding: 16px 18px;
  }
  .dh-entry-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: baseline;
    margin-bottom: 8px;
  }
  .dh-entry-date {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(250,248,245,0.42);
  }
  .dh-entry-theme {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #C9A84C;
    font-weight: 700;
  }
  .dh-entry-passage {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    line-height: 1.4;
    color: #FAF8F5;
    margin: 0 0 6px;
    font-style: italic;
  }
  .dh-entry-summary {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    line-height: 1.7;
    color: rgba(250,248,245,0.62);
    margin: 0;
  }
  .dh-empty-passage {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: rgba(250,248,245,0.42);
    font-style: italic;
    margin: 0 0 6px;
  }
`;

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default function DevotionHistory() {
  const { profile, isLoaded } = useFormationProfile();
  const [open, setOpen] = useState(false);

  if (!isLoaded) return null;
  const devotions = profile?.widgets?.devotions ?? [];
  if (devotions.length === 0) return null;

  const entries = devotions.slice(0, 3);

  return (
    <div className="dh-wrap">
      <style>{DH_CSS}</style>
      <button
        className="dh-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="dh-list"
      >
        <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span className="dh-toggle-label">Your Formation History</span>
          <span className="dh-toggle-count">
            {devotions.length === 1
              ? "1 devotion"
              : `${devotions.length} devotions · showing ${entries.length}`}
          </span>
        </span>
        <span className="dh-toggle-chev">{open ? "Hide ▲" : "View ▼"}</span>
      </button>

      {open && (
        <div className="dh-list" id="dh-list">
          {entries.map((e, i) => {
            const passageLine = e.passage?.trim() || e.bigIdea?.trim() || e.theme?.trim();
            return (
              <div key={e.generatedAt || i} className="dh-entry">
                <div className="dh-entry-meta">
                  <span className="dh-entry-date">{formatDate(e.generatedAt)}</span>
                  {e.theme?.trim() && (
                    <span className="dh-entry-theme">{e.theme.trim()}</span>
                  )}
                </div>
                {passageLine ? (
                  <p className="dh-entry-passage">{passageLine}</p>
                ) : (
                  <p className="dh-empty-passage">Untitled devotion</p>
                )}
                {e.summary?.trim() && (
                  <p className="dh-entry-summary">{e.summary.trim()}…</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
