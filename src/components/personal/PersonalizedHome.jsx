import { Link } from "react-router-dom";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import FormationHero from "./FormationHero";
import SynthesisCard from "./SynthesisCard";
import JourneySummary from "./JourneySummary";
import NextStepBand from "./NextStepBand";

/*
 * PersonalizedHome -- the returning-user dashboard at `/`.
 *
 * Top-to-bottom composition. Each component owns its own styles so they can
 * iterate independently. Apparel surfacing arrives in Phase 3.
 */

const STYLES = `
  .cf-ph {
    background: var(--cf-hero-bg);
    color: var(--cf-ivory);
    min-height: 100dvh;
    padding-bottom: calc(env(safe-area-inset-bottom) + 96px);
  }
  .cf-ph__footer {
    max-width: 720px;
    margin: 96px auto 0;
    padding: 0 24px 0;
    text-align: center;
  }
  .cf-ph__footer-rule {
    height: 1px;
    background: var(--cf-gold-hairline);
    margin: 0 auto 40px;
    max-width: 120px;
  }
  .cf-ph__footer-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 22px;
    margin-bottom: 24px;
  }
  .cf-ph__footer-link {
    font-family: var(--cf-font-brand);
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cf-ivory-42);
    text-decoration: none;
    transition: color 220ms ease;
  }
  .cf-ph__footer-link:hover {
    color: var(--cf-gold);
  }
  .cf-ph__footer-note {
    font-family: var(--cf-font-body);
    font-size: 12px;
    color: var(--cf-ivory-28);
    margin: 0;
  }
`;

export default function PersonalizedHome() {
  const { profile, isLoaded } = useFormationProfile();

  if (!isLoaded || !profile) return null;

  return (
    <>
      <style>{STYLES}</style>
      <main className="cf-ph">
        <FormationHero profile={profile} />
        <SynthesisCard profile={profile} />
        <JourneySummary profile={profile} />
        <NextStepBand profile={profile} />
        <footer className="cf-ph__footer">
          <div className="cf-ph__footer-rule" />
          <div className="cf-ph__footer-links">
            <Link to="/about" className="cf-ph__footer-link">About</Link>
            <Link to="/#architecture" className="cf-ph__footer-link">Architecture</Link>
            <Link to="/#rule" className="cf-ph__footer-link">Rule of Life</Link>
            <Link to="/#shop" className="cf-ph__footer-link">Gear</Link>
          </div>
          <p className="cf-ph__footer-note">Counter Formation</p>
        </footer>
      </main>
    </>
  );
}
