import { Link } from "react-router-dom";

/*
 * DevotionListPanel -- compact sidebar list of saved devotions.
 *
 * Reads from profile.widgets.devotions (capped at 10). Renders up to 5
 * visible rows; the rest are scrollable within the panel's bounded height.
 * Each row shows the date, the passage or theme, and a "saved" status badge.
 * Clicking a row navigates to the Devotion Guide.
 */

function formatRelative(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  const now = new Date();
  const days = Math.floor((now - then) / 86400000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return then.toLocaleDateString();
}

function summaryOf(entry) {
  return entry?.passage || entry?.bigIdea || entry?.theme || "Devotion";
}

const STYLES = `
  .cf-dlp {
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 18px 20px 14px;
    position: relative;
    overflow: hidden;
  }
  .cf-dlp::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
  }
  .cf-dlp__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .cf-dlp__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0;
  }
  .cf-dlp__count {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--cf-ivory-42);
  }
  .cf-dlp__list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 220px;
    overflow-y: auto;
  }
  .cf-dlp__list::-webkit-scrollbar { width: 6px; }
  .cf-dlp__list::-webkit-scrollbar-thumb { background: var(--cf-gold-hairline); border-radius: 4px; }
  .cf-dlp__row {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 10px 0;
    border-bottom: 1px solid var(--cf-gold-hairline);
    transition: background 200ms ease;
  }
  .cf-dlp__row:last-child { border-bottom: none; }
  .cf-dlp__row:hover { background: var(--cf-gold-glow); }
  .cf-dlp__row-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
  }
  .cf-dlp__row-date {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cf-ivory-42);
  }
  .cf-dlp__row-status {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cf-gold-muted);
  }
  .cf-dlp__row-title {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    line-height: 1.4;
    color: var(--cf-ivory-82);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .cf-dlp__empty {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    color: var(--cf-ivory-42);
    margin: 4px 0 12px;
    line-height: 1.5;
  }
  .cf-dlp__cta {
    display: inline-block;
    margin-top: 10px;
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cf-gold);
    text-decoration: none;
  }
  .cf-dlp__cta:hover { color: var(--cf-ivory); }
`;

export default function DevotionListPanel({ profile }) {
  const devotions = profile?.widgets?.devotions || [];
  const hasAny = devotions.length > 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-dlp">
        <div className="cf-dlp__head">
          <p className="cf-dlp__eyebrow">Devotions</p>
          {hasAny && <span className="cf-dlp__count">{devotions.length}</span>}
        </div>

        {hasAny ? (
          <>
            <ul className="cf-dlp__list">
              {devotions.map((d, i) => (
                <li key={d.generatedAt || i}>
                  <Link to="/field-guide/devotion-guide" className="cf-dlp__row">
                    <div className="cf-dlp__row-meta">
                      <span className="cf-dlp__row-date">{formatRelative(d.generatedAt)}</span>
                      <span className="cf-dlp__row-status">Saved</span>
                    </div>
                    <p className="cf-dlp__row-title">{summaryOf(d)}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/field-guide/devotion-guide" className="cf-dlp__cta">
              Open Devotion Guide →
            </Link>
          </>
        ) : (
          <>
            <p className="cf-dlp__empty">No devotions saved yet. The Devotion Guide generates a personal reflection grounded in your formation.</p>
            <Link to="/field-guide/devotion-guide" className="cf-dlp__cta">
              Generate one →
            </Link>
          </>
        )}
      </div>
    </>
  );
}
