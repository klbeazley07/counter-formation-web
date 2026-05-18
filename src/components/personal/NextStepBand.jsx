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
    max-width: 720px;
    margin: 64px auto 0;
    padding: 0 24px;
    text-align: center;
  }
  .cf-nsb__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.44em;
    text-transform: uppercase;
    color: var(--cf-gold-muted);
    margin: 0 0 18px;
  }
  .cf-nsb__title {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: clamp(24px, 4vw, 34px);
    line-height: 1.25;
    color: var(--cf-ivory);
    margin: 0 0 14px;
  }
  .cf-nsb__desc {
    font-family: var(--cf-font-body);
    font-size: 14px;
    line-height: 1.7;
    color: var(--cf-ivory-55);
    margin: 0 0 28px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
  .cf-nsb__cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    color: var(--cf-gold);
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 13px 22px;
    text-decoration: none;
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-pill);
    transition: background 220ms ease, border-color 220ms ease;
  }
  .cf-nsb__cta:hover {
    background: var(--cf-gold-bg);
    border-color: var(--cf-gold-mid);
  }
`;

export default function NextStepBand({ profile }) {
  const rec = recommendForDashboard(profile);
  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-nsb">
        <p className="cf-nsb__eyebrow">What's next</p>
        <h2 className="cf-nsb__title">{rec.label}</h2>
        <p className="cf-nsb__desc">{rec.description}</p>
        <Link to={rec.destination} className="cf-nsb__cta">
          Take the step
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </>
  );
}
