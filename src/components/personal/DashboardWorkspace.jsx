import { Link } from "react-router-dom";
import SynthesisCard from "./SynthesisCard";
import DevotionListPanel from "./DevotionListPanel";
import DiagnosticTiles from "./DiagnosticTiles";
import NextStepBand from "./NextStepBand";
import FruitStrata from "../visualizations/FruitStrata";
import GiftConstellationCompact from "../visualizations/GiftConstellationCompact";

/*
 * DashboardWorkspace -- the two-column dashboard body.
 *
 * Desktop (>= 1024px): sidebar (35%) + main (65%) side by side.
 * Tablet/Mobile: stacked single column.
 *
 * Sidebar: SynthesisCard, DevotionListPanel, DiagnosticTiles
 * Main: FruitStrata, GiftConstellationCompact, NextStepBand
 *
 * Designed to fit a 1024x720 viewport without scroll (after the banner above).
 */

const STYLES = `
  .cf-dw {
    max-width: 1280px;
    margin: 0 auto;
    padding: 20px 24px 32px;
  }
  .cf-dw__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
  }
  @media (min-width: 1024px) {
    .cf-dw__grid {
      grid-template-columns: minmax(280px, 35%) 1fr;
      gap: 24px;
      align-items: stretch;
    }
  }
  .cf-dw__sidebar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }
  .cf-dw__main {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }
  .cf-dw__viz-card {
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 18px 20px 16px;
    position: relative;
    overflow: hidden;
  }
  .cf-dw__viz-card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
  }
  .cf-dw__viz-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 12px;
  }
  .cf-dw__viz-eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0;
  }
  .cf-dw__viz-link {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cf-ivory-42);
    text-decoration: none;
    transition: color 200ms ease;
  }
  .cf-dw__viz-link:hover { color: var(--cf-gold); }
  .cf-dw__viz-empty {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 15px;
    color: var(--cf-ivory-42);
    margin: 0;
    text-align: center;
    padding: 32px 16px;
  }
`;

function FruitTile({ profile }) {
  const fruits = profile?.assessment?.fruits;
  return (
    <div className="cf-dw__viz-card">
      <div className="cf-dw__viz-head">
        <p className="cf-dw__viz-eyebrow">Fruit of the Spirit</p>
        {fruits && (
          <Link to="/field-guide/fruit-assessment" className="cf-dw__viz-link">
            Full results →
          </Link>
        )}
      </div>
      {fruits ? (
        <FruitStrata scores={fruits} maxWidth={520} showLabels={false} reduceMotion={true} />
      ) : (
        <p className="cf-dw__viz-empty">
          Take the Fruit Assessment to see your formation edge.
          <br />
          <Link to="/field-guide/fruit-assessment" className="cf-dw__viz-link" style={{ marginTop: 12, display: "inline-block" }}>
            Begin →
          </Link>
        </p>
      )}
    </div>
  );
}

function GiftsTile({ profile }) {
  const completedAt = profile?.gifts?.completedAt;
  const topGifts = profile?.gifts?.topGifts || [];
  return (
    <div className="cf-dw__viz-card">
      <div className="cf-dw__viz-head">
        <p className="cf-dw__viz-eyebrow">Spiritual Gifts</p>
        {completedAt && (
          <Link to="/field-guide/gifts/results" className="cf-dw__viz-link">
            Full results →
          </Link>
        )}
      </div>
      {completedAt ? (
        <GiftConstellationCompact topGifts={topGifts} height={280} />
      ) : (
        <p className="cf-dw__viz-empty">
          The 25-minute Gifts Assessment reveals where the Spirit moves through you.
          <br />
          <Link to="/field-guide/gifts" className="cf-dw__viz-link" style={{ marginTop: 12, display: "inline-block" }}>
            Begin →
          </Link>
        </p>
      )}
    </div>
  );
}

export default function DashboardWorkspace({ profile }) {
  return (
    <>
      <style>{STYLES}</style>
      <section className="cf-dw">
        <div className="cf-dw__grid">
          <aside className="cf-dw__sidebar">
            <SynthesisCard profile={profile} />
            <DevotionListPanel profile={profile} />
            <DiagnosticTiles profile={profile} />
          </aside>
          <div className="cf-dw__main">
            <FruitTile profile={profile} />
            <GiftsTile profile={profile} />
            <NextStepBand profile={profile} />
          </div>
        </div>
      </section>
    </>
  );
}
