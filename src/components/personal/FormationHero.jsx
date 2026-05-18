import { Link } from "react-router-dom";
import { recommendForDashboard } from "../../utils/formationRecommendation";

/*
 * FormationHero -- the personalized dashboard hero.
 *
 * Full-viewport (100dvh) atmospheric band. Time-of-day italic greeting,
 * single line of formation focus, single gold CTA pointing to the highest
 * priority next step. No metrics here -- this band is curated, not informational.
 */

function greetingFor(hour) {
  if (hour < 5)  return "Welcome back.";
  if (hour < 12) return "Good morning.";
  if (hour < 17) return "Good afternoon.";
  if (hour < 21) return "Good evening.";
  return "Welcome back.";
}

const FRUIT_LABELS = {
  love: "love",
  joy: "joy",
  peace: "peace",
  patience: "patience",
  kindness: "kindness",
  goodness: "goodness",
  faithfulness: "faithfulness",
  gentleness: "gentleness",
  self_control: "self-control",
};

function formatFormationLine(profile) {
  const edge = profile?.assessment?.formationEdge || [];
  const named = edge.slice(0, 3).map((f) => FRUIT_LABELS[f] || f).filter(Boolean);
  if (named.length === 0) {
    return "Your formation profile is still forming.";
  }
  if (named.length === 1) return `Forming around ${named[0]}.`;
  if (named.length === 2) return `Forming around ${named[0]} and ${named[1]}.`;
  return `Forming around ${named[0]}, ${named[1]}, and ${named[2]}.`;
}

const STYLES = `
  .cf-fh {
    position: relative;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: calc(env(safe-area-inset-top) + 24px) 24px calc(env(safe-area-inset-bottom) + 96px);
    background:
      radial-gradient(ellipse at 50% 30%, var(--cf-gold-glow) 0%, transparent 60%),
      var(--cf-hero-bg);
    color: var(--cf-ivory);
    overflow: hidden;
  }
  .cf-fh__inner {
    max-width: 760px;
    text-align: center;
    animation: cf-fh-rise 700ms ease-out both;
  }
  .cf-fh__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 28px;
  }
  .cf-fh__greeting {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(40px, 8vw, 76px);
    line-height: 1.05;
    color: var(--cf-ivory);
    margin: 0 0 18px;
  }
  .cf-fh__focus {
    font-family: var(--cf-font-body);
    font-size: clamp(15px, 2.2vw, 18px);
    line-height: 1.6;
    color: var(--cf-ivory-62);
    margin: 0 0 40px;
    max-width: 540px;
    margin-left: auto;
    margin-right: auto;
  }
  .cf-fh__cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: var(--cf-gold);
    color: var(--cf-hero-bg);
    font-family: var(--cf-font-brand);
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 16px 28px;
    text-decoration: none;
    border-radius: var(--cf-radius-pill);
    transition: transform 220ms ease, box-shadow 220ms ease;
  }
  .cf-fh__cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(201,168,76,0.18);
  }
  .cf-fh__description {
    margin: 28px auto 0;
    max-width: 480px;
    font-family: var(--cf-font-body);
    font-size: 13px;
    line-height: 1.7;
    color: var(--cf-ivory-42);
  }
  @keyframes cf-fh-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function FormationHero({ profile }) {
  const hour = new Date().getHours();
  const greeting = greetingFor(hour);
  const focusLine = formatFormationLine(profile);
  const rec = recommendForDashboard(profile);

  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-fh">
        <div className="cf-fh__inner">
          <p className="cf-fh__eyebrow">Your formation</p>
          <h1 className="cf-fh__greeting">{greeting}</h1>
          <p className="cf-fh__focus">{focusLine}</p>
          <Link to={rec.destination} className="cf-fh__cta">
            {rec.label}
            <span aria-hidden="true">→</span>
          </Link>
          <p className="cf-fh__description">{rec.description}</p>
        </div>
      </section>
    </>
  );
}
