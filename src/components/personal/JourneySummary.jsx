import { Link } from "react-router-dom";
import Card from "../primitives/Card";
import EyebrowLabel from "../primitives/EyebrowLabel";
import ProgressBar from "../primitives/ProgressBar";

/*
 * JourneySummary -- three curated dashboard cards reading from cf:profile.
 *
 * Fruits: top formation edges + last completion date
 * Gifts: top three gifts + confirmation status
 * Continuing: whichever of Challenge / Armor / Field Guide is in progress
 */

const FRUIT_LABELS = {
  love: "Love", joy: "Joy", peace: "Peace", patience: "Patience",
  kindness: "Kindness", goodness: "Goodness", faithfulness: "Faithfulness",
  gentleness: "Gentleness", self_control: "Self-control",
};

const GIFT_LABELS = {
  prophecy: "Prophecy", teaching: "Teaching", exhortation: "Exhortation",
  giving: "Giving", leadership: "Leadership", mercy: "Mercy", serving: "Serving",
  evangelism: "Evangelism", shepherding: "Shepherding", apostleship: "Apostleship",
  wisdom: "Wisdom", knowledge: "Knowledge", faith: "Faith", healing: "Healing",
  miracles: "Miracles", discernment: "Discernment", administration: "Administration",
  hospitality: "Hospitality",
};

const ARMOR_LABELS = {
  "belt-of-truth": "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace": "Gospel of Peace",
  "shield-of-faith": "Shield of Faith",
  "helmet-of-salvation": "Helmet of Salvation",
  "sword-of-the-spirit": "Sword of the Spirit",
};

function formatRelativeDate(iso) {
  if (!iso) return null;
  const then = new Date(iso);
  const now = new Date();
  const days = Math.floor((now - then) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} ${Math.floor(days / 7) === 1 ? "week" : "weeks"} ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return then.toLocaleDateString();
}

const STYLES = `
  .cf-js {
    max-width: 960px;
    margin: 80px auto 0;
    padding: 0 24px;
  }
  .cf-js__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 720px) {
    .cf-js__grid {
      grid-template-columns: 1fr 1fr;
    }
    .cf-js__continuing {
      grid-column: 1 / -1;
    }
  }
  .cf-js__card-link {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: transform 220ms ease;
  }
  .cf-js__card-link:hover {
    transform: translateY(-2px);
  }
  .cf-js__card-title {
    font-family: var(--cf-font-display);
    font-size: 14px;
    letter-spacing: 0.02em;
    color: var(--cf-ivory);
    margin: 12px 0 16px;
  }
  .cf-js__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 14px;
  }
  .cf-js__chip {
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cf-gold);
    background: var(--cf-gold-bg);
    border: 1px solid var(--cf-gold-soft);
    padding: 6px 12px;
    border-radius: var(--cf-radius-pill);
  }
  .cf-js__meta {
    font-family: var(--cf-font-body);
    font-size: 13px;
    line-height: 1.6;
    color: var(--cf-ivory-55);
    margin: 0;
  }
  .cf-js__empty {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 15px;
    color: var(--cf-ivory-42);
    margin: 10px 0 0;
  }
  .cf-js__rank {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;
  }
  .cf-js__rank-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .cf-js__rank-num {
    font-family: var(--cf-font-brand);
    font-size: 12px;
    letter-spacing: 0.2em;
    color: var(--cf-gold);
    width: 16px;
  }
  .cf-js__rank-label {
    font-family: var(--cf-font-body);
    font-size: 14px;
    color: var(--cf-ivory-82);
    flex: 1;
  }
  .cf-js__rank-score {
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: 0.18em;
    color: var(--cf-ivory-42);
  }
`;

function FruitsCard({ profile }) {
  const completedAt = profile?.assessment?.completedAt;
  const edge = profile?.assessment?.formationEdge || [];

  if (!completedAt) {
    return (
      <Card surface="dark" padded="lg" topHairline>
        <EyebrowLabel size="sm" color="gold">Fruit of the Spirit</EyebrowLabel>
        <h3 className="cf-js__card-title">Not yet taken</h3>
        <p className="cf-js__empty">Begin with the Fruit Assessment to name where the Spirit is forming you.</p>
      </Card>
    );
  }

  const named = edge.slice(0, 3).map((f) => FRUIT_LABELS[f]).filter(Boolean);

  return (
    <Card surface="dark" padded="lg" topHairline>
      <EyebrowLabel size="sm" color="gold">Formation edge</EyebrowLabel>
      <h3 className="cf-js__card-title">Forming around</h3>
      <div className="cf-js__chips">
        {named.map((n) => <span key={n} className="cf-js__chip">{n}</span>)}
      </div>
      <p className="cf-js__meta">Last assessed {formatRelativeDate(completedAt)}.</p>
    </Card>
  );
}

function GiftsCard({ profile }) {
  const completedAt = profile?.gifts?.completedAt;
  const topGifts = profile?.gifts?.topGifts || [];
  const topScores = profile?.gifts?.topGiftScores || {};
  const invited = profile?.gifts?.trustedPersonsInvited || 0;
  const confirmed = profile?.gifts?.trustedPersonsConfirmed || 0;

  if (!completedAt) {
    return (
      <Card surface="dark" padded="lg" topHairline>
        <EyebrowLabel size="sm" color="gold">Spiritual Gifts</EyebrowLabel>
        <h3 className="cf-js__card-title">Not yet taken</h3>
        <p className="cf-js__empty">Where is the Spirit moving through you? Twenty-five minutes to find out.</p>
      </Card>
    );
  }

  return (
    <Card surface="dark" padded="lg" topHairline>
      <EyebrowLabel size="sm" color="gold">Spiritual Gifts</EyebrowLabel>
      <h3 className="cf-js__card-title">Where the Spirit moves through you</h3>
      <div className="cf-js__rank">
        {topGifts.map((key, i) => (
          <div key={key} className="cf-js__rank-row">
            <span className="cf-js__rank-num">0{i + 1}</span>
            <span className="cf-js__rank-label">{GIFT_LABELS[key] || key}</span>
            {typeof topScores[key] === "number" && (
              <span className="cf-js__rank-score">{Math.round(topScores[key])}</span>
            )}
          </div>
        ))}
      </div>
      <p className="cf-js__meta">
        {invited === 0
          ? "No trusted persons invited yet -- their witness completes the picture."
          : `${confirmed} of ${invited} trusted ${invited === 1 ? "person has" : "people have"} confirmed.`}
      </p>
    </Card>
  );
}

function ContinuingCard({ profile }) {
  // Pick the most pressing in-progress thread.
  const challenge = profile?.challenge;
  const challengeDays = challenge?.completedDays || [];
  const challengeActive = challenge?.startedAt && !challenge?.completedAt;

  const armorProgress = profile?.armor?.progress || {};
  const completedPieces = profile?.armor?.completedPieces || [];
  const inProgressPiece = Object.keys(armorProgress).find((slug) => {
    if (completedPieces.includes(slug)) return false;
    const days = armorProgress[slug];
    return Array.isArray(days) ? days.length > 0 : false;
  });

  if (challengeActive && challengeDays.length > 0) {
    const lastDay = Math.max(...challengeDays);
    const pct = Math.round((challengeDays.length / 7) * 100);
    return (
      <Card surface="dark" padded="lg" topHairline className="cf-js__continuing">
        <EyebrowLabel size="sm" color="gold">Continuing</EyebrowLabel>
        <h3 className="cf-js__card-title">7-Day Challenge -- Day {lastDay} of 7</h3>
        <ProgressBar value={pct} ariaLabel="Challenge progress" />
        <p className="cf-js__meta" style={{ marginTop: 16 }}>
          Return to where you left off. Each day stands on its own.
        </p>
      </Card>
    );
  }

  if (inProgressPiece) {
    const days = armorProgress[inProgressPiece];
    const count = Array.isArray(days) ? days.length : 0;
    const pct = Math.round((count / 6) * 100);
    return (
      <Card surface="dark" padded="lg" topHairline className="cf-js__continuing">
        <EyebrowLabel size="sm" color="gold">Continuing</EyebrowLabel>
        <h3 className="cf-js__card-title">{ARMOR_LABELS[inProgressPiece]} -- Day {count} of 6</h3>
        <ProgressBar value={pct} ariaLabel="Armor piece progress" />
        <p className="cf-js__meta" style={{ marginTop: 16 }}>
          The armor takes six days to walk. You're partway through.
        </p>
      </Card>
    );
  }

  // Nothing in progress -- gentle invitation
  return (
    <Card surface="dark" padded="lg" topHairline className="cf-js__continuing">
      <EyebrowLabel size="sm" color="gold">Continuing</EyebrowLabel>
      <h3 className="cf-js__card-title">Open to what's next</h3>
      <p className="cf-js__empty">
        Nothing is currently in progress. The next step from your hero will pick the most natural opening.
      </p>
    </Card>
  );
}

export default function JourneySummary({ profile }) {
  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-js">
        <div className="cf-js__grid">
          <Link to="/field-guide/fruit-assessment" className="cf-js__card-link">
            <FruitsCard profile={profile} />
          </Link>
          <Link to="/field-guide/gifts/results" className="cf-js__card-link">
            <GiftsCard profile={profile} />
          </Link>
          <ContinuingCard profile={profile} />
        </div>
      </section>
    </>
  );
}
