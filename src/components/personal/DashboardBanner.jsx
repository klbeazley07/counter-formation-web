import { Link } from "react-router-dom";
import { recommendForDashboard } from "../../utils/formationRecommendation";

/*
 * DashboardBanner -- slim greeting band at the top of PersonalizedHome.
 *
 * Replaces the previous full-viewport FormationHero. Bounded to ~200px tall
 * so the workspace below is visible without scrolling on desktop. Time-of-day
 * Cormorant italic greeting, one-line formation focus, single gold CTA.
 */

function greetingFor(hour) {
  if (hour < 5)  return "Welcome back.";
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  if (hour < 21) return "Good evening.";
  return "Welcome back.";
}

const FRUIT_LABELS = {
  love: "love", joy: "joy", peace: "peace", patience: "patience",
  kindness: "kindness", goodness: "goodness", faithfulness: "faithfulness",
  gentleness: "gentleness", self_control: "self-control",
};

function formatFormationLine(profile) {
  const edge = profile?.assessment?.formationEdge || [];
  const named = edge.slice(0, 3).map((f) => FRUIT_LABELS[f] || f).filter(Boolean);
  if (named.length === 0) return "Your formation profile is still forming.";
  if (named.length === 1) return `Forming around ${named[0]}.`;
  if (named.length === 2) return `Forming around ${named[0]} and ${named[1]}.`;
  return `Forming around ${named[0]}, ${named[1]}, and ${named[2]}.`;
}

const STYLES = `
  .cf-banner {
    position: relative;
    padding: 28px 24px 24px;
    background:
      radial-gradient(ellipse at 50% 0%, var(--cf-gold-glow) 0%, transparent 70%),
      var(--cf-hero-bg);
    border-bottom: 1px solid var(--cf-gold-hairline);
    color: var(--cf-ivory);
  }
  .cf-banner__inner {
    max-width: 1280px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 28px;
    align-items: center;
  }
  .cf-banner__left { min-width: 0; }
  .cf-banner__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 8px;
  }
  .cf-banner__greeting {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(26px, 3.4vw, 38px);
    line-height: 1.1;
    color: var(--cf-ivory);
    margin: 0 0 8px;
  }
  .cf-banner__focus {
    font-family: var(--cf-font-body);
    font-size: 14px;
    line-height: 1.5;
    color: var(--cf-ivory-62);
    margin: 0;
  }
  .cf-banner__cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--cf-gold);
    color: var(--cf-hero-bg);
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 12px 22px;
    text-decoration: none;
    border-radius: var(--cf-radius-pill);
    transition: transform 220ms ease, box-shadow 220ms ease;
    white-space: nowrap;
  }
  .cf-banner__cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(201,168,76,0.16);
  }
  @media (max-width: 720px) {
    .cf-banner__inner {
      grid-template-columns: 1fr;
      gap: 18px;
    }
    .cf-banner__cta {
      align-self: flex-start;
    }
  }
`;

export default function DashboardBanner({ profile }) {
  const hour = new Date().getHours();
  const greeting = greetingFor(hour);
  const focusLine = formatFormationLine(profile);
  const rec = recommendForDashboard(profile);

  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-banner">
        <div className="cf-banner__inner">
          <div className="cf-banner__left">
            <p className="cf-banner__eyebrow">Your formation</p>
            <h1 className="cf-banner__greeting">{greeting}</h1>
            <p className="cf-banner__focus">{focusLine}</p>
          </div>
          <Link to={rec.destination} className="cf-banner__cta">
            {rec.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
