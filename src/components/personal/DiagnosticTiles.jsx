import { Link } from "react-router-dom";

/*
 * DiagnosticTiles -- three compact stat tiles for the dashboard sidebar.
 *
 * Tiles render in this order: Gifts, Challenge, Armor. Each shows an eyebrow,
 * one-line summary, optional thin progress bar, and routes to the relevant
 * section on tap.
 */

const ARMOR_LABELS = {
  "belt-of-truth": "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate",
  "gospel-of-peace": "Gospel of Peace",
  "shield-of-faith": "Shield of Faith",
  "helmet-of-salvation": "Helmet",
  "sword-of-the-spirit": "Sword",
};

const STYLES = `
  .cf-dt {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .cf-dt__tile {
    display: block;
    text-decoration: none;
    color: inherit;
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 14px 18px;
    transition: transform 200ms ease, border-color 200ms ease;
    position: relative;
    overflow: hidden;
  }
  .cf-dt__tile:hover {
    transform: translateY(-1px);
    border-color: var(--cf-gold-mid);
  }
  .cf-dt__tile::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
  }
  .cf-dt__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 6px;
  }
  .cf-dt__summary {
    font-family: var(--cf-font-body);
    font-size: 13px;
    line-height: 1.5;
    color: var(--cf-ivory-82);
    margin: 0 0 8px;
  }
  .cf-dt__summary--muted {
    color: var(--cf-ivory-42);
    font-style: italic;
    font-family: var(--cf-font-devotional);
    font-size: 14px;
  }
  .cf-dt__track {
    height: 2px;
    width: 100%;
    background: var(--cf-gold-hairline);
    border-radius: var(--cf-radius-pill);
    overflow: hidden;
    margin-top: 6px;
  }
  .cf-dt__fill {
    height: 100%;
    background: var(--cf-gold);
    border-radius: var(--cf-radius-pill);
  }
`;

function GiftsTile({ profile }) {
  const completedAt = profile?.gifts?.completedAt;
  const topGifts = profile?.gifts?.topGifts || [];
  const topGiftScores = profile?.gifts?.topGiftScores || {};
  const invited = profile?.gifts?.trustedPersonsInvited || 0;
  const confirmed = profile?.gifts?.trustedPersonsConfirmed || 0;

  if (!completedAt) {
    return (
      <Link to="/field-guide/gifts" className="cf-dt__tile">
        <p className="cf-dt__eyebrow">Gifts</p>
        <p className="cf-dt__summary cf-dt__summary--muted">Not yet taken</p>
      </Link>
    );
  }

  // Compute tiers from topGiftScores (active >= 65, emerging 45-64, else quiet)
  let active = 0, emerging = 0, quiet = 0;
  Object.values(topGiftScores).forEach((s) => {
    if (typeof s !== "number") return;
    if (s >= 65) active++;
    else if (s >= 45) emerging++;
    else quiet++;
  });

  const summary = topGifts.length > 0
    ? `${active} active · ${emerging} emerging · ${quiet} quiet`
    : "Results saved";
  const confirmLine = invited > 0
    ? `${confirmed} of ${invited} trusted confirmed`
    : "Invite trusted people to complete";

  return (
    <Link to="/field-guide/gifts/results" className="cf-dt__tile">
      <p className="cf-dt__eyebrow">Gifts</p>
      <p className="cf-dt__summary">{summary}</p>
      <p className="cf-dt__summary" style={{ marginBottom: 0, fontSize: 12, color: "var(--cf-ivory-55)" }}>{confirmLine}</p>
    </Link>
  );
}

function ChallengeTile({ profile }) {
  const days = profile?.challenge?.completedDays || [];
  const completedAt = profile?.challenge?.completedAt;
  const startedAt = profile?.challenge?.startedAt;

  if (completedAt) {
    return (
      <Link to="/7-day-challenge" className="cf-dt__tile">
        <p className="cf-dt__eyebrow">7-Day Challenge</p>
        <p className="cf-dt__summary">All 7 days complete</p>
      </Link>
    );
  }

  if (startedAt && days.length > 0) {
    const lastDay = Math.max(...days);
    const pct = Math.round((days.length / 7) * 100);
    return (
      <Link to={`/7-day-challenge/day/${Math.min(lastDay + 1, 7)}`} className="cf-dt__tile">
        <p className="cf-dt__eyebrow">7-Day Challenge</p>
        <p className="cf-dt__summary">Day {lastDay} of 7</p>
        <div className="cf-dt__track" aria-hidden="true">
          <div className="cf-dt__fill" style={{ width: `${pct}%` }} />
        </div>
      </Link>
    );
  }

  return (
    <Link to="/7-day-challenge" className="cf-dt__tile">
      <p className="cf-dt__eyebrow">7-Day Challenge</p>
      <p className="cf-dt__summary cf-dt__summary--muted">Not started</p>
    </Link>
  );
}

function ArmorTile({ profile }) {
  const progress = profile?.armor?.progress || {};
  const completedPieces = profile?.armor?.completedPieces || [];
  const inProgressPiece = Object.keys(progress).find((slug) => {
    if (completedPieces.includes(slug)) return false;
    const days = progress[slug];
    return Array.isArray(days) ? days.length > 0 : false;
  });

  if (inProgressPiece) {
    const days = progress[inProgressPiece];
    const count = Array.isArray(days) ? days.length : 0;
    const pct = Math.round((count / 6) * 100);
    return (
      <Link to={`/identity/${inProgressPiece}`} className="cf-dt__tile">
        <p className="cf-dt__eyebrow">Armor of God</p>
        <p className="cf-dt__summary">{ARMOR_LABELS[inProgressPiece]} · Day {count} of 6</p>
        <div className="cf-dt__track" aria-hidden="true">
          <div className="cf-dt__fill" style={{ width: `${pct}%` }} />
        </div>
      </Link>
    );
  }

  if (completedPieces.length > 0) {
    return (
      <Link to="/identity" className="cf-dt__tile">
        <p className="cf-dt__eyebrow">Armor of God</p>
        <p className="cf-dt__summary">{completedPieces.length} of 6 pieces walked</p>
      </Link>
    );
  }

  return (
    <Link to="/identity" className="cf-dt__tile">
      <p className="cf-dt__eyebrow">Armor of God</p>
      <p className="cf-dt__summary cf-dt__summary--muted">Not yet begun</p>
    </Link>
  );
}

export default function DiagnosticTiles({ profile }) {
  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-dt">
        <GiftsTile profile={profile} />
        <ChallengeTile profile={profile} />
        <ArmorTile profile={profile} />
      </div>
    </>
  );
}
