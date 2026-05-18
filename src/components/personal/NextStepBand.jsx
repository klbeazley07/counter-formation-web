import { Link } from "react-router-dom";
import { recommendForDashboard } from "../../utils/formationRecommendation";

/*
 * NextStepBand -- a slim "what's next" band below the journey snapshot.
 *
 * Visually quieter than the hero CTA. Shows the same recommendation but
 * with a longer description and a secondary action style.
 */

const STYLES = `
  .cf-nsb {
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 16px 20px;
    background: linear-gradient(to bottom right, var(--cf-gold-glow), transparent);
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: center;
  }
  .cf-nsb__left { min-width: 0; }
  .cf-nsb__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 4px;
  }
  .cf-nsb__desc {
    font-family: var(--cf-font-body);
    font-size: 13px;
    line-height: 1.55;
    color: var(--cf-ivory-82);
    margin: 0;
  }
  .cf-nsb__cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--cf-gold);
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 10px 18px;
    text-decoration: none;
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-pill);
    transition: background 220ms ease;
    white-space: nowrap;
  }
  .cf-nsb__cta:hover { background: var(--cf-gold-bg); }
  @media (max-width: 600px) {
    .cf-nsb {
      grid-template-columns: 1fr;
    }
    .cf-nsb__cta { align-self: flex-start; }
  }
`;

export default function NextStepBand({ profile }) {
  const rec = recommendForDashboard(profile);
  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-nsb">
        <div className="cf-nsb__left">
          <p className="cf-nsb__eyebrow">What's next</p>
          <p className="cf-nsb__desc">{rec.description}</p>
        </div>
        <Link to={rec.destination} className="cf-nsb__cta">
          {rec.label}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
