/*
 * SynthesisCard -- short personal note that names where the user is.
 *
 * Phase 1 renders a deterministic synthesis built from profile signals
 * (formation edge, top gift, current armor piece). Phase 3 swaps the body
 * for an AI-generated reflection from functions/api/synthesize.
 */

import EyebrowLabel from "../primitives/EyebrowLabel";

const FRUIT_LABELS = {
  love: "love", joy: "joy", peace: "peace", patience: "patience",
  kindness: "kindness", goodness: "goodness", faithfulness: "faithfulness",
  gentleness: "gentleness", self_control: "self-control",
};

const GIFT_LABELS = {
  prophecy: "prophecy", teaching: "teaching", exhortation: "exhortation",
  giving: "giving", leadership: "leadership", mercy: "mercy", serving: "serving",
  evangelism: "evangelism", shepherding: "shepherding", apostleship: "apostleship",
  wisdom: "wisdom", knowledge: "knowledge", faith: "faith", healing: "healing",
  miracles: "miracles", discernment: "discernment", administration: "administration",
  hospitality: "hospitality",
};

const ARMOR_LABELS = {
  "belt-of-truth": "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace": "Gospel of Peace",
  "shield-of-faith": "Shield of Faith",
  "helmet-of-salvation": "Helmet of Salvation",
  "sword-of-the-spirit": "Sword of the Spirit",
};

function joinFruits(edges) {
  const labels = edges.slice(0, 3).map((f) => FRUIT_LABELS[f]).filter(Boolean);
  if (labels.length === 0) return null;
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels[0]}, ${labels[1]}, and ${labels[2]}`;
}

function buildSynthesis(profile) {
  if (!profile) return null;
  const edge = profile.assessment?.formationEdge || [];
  const topGifts = profile.gifts?.topGifts || [];
  const armorProgress = profile.armor?.progress || {};
  const completedPieces = profile.armor?.completedPieces || [];
  const activeArmor = Object.keys(armorProgress).find((slug) => !completedPieces.includes(slug));

  const fruitsLine = joinFruits(edge);
  const topGiftLabel = topGifts[0] ? GIFT_LABELS[topGifts[0]] : null;
  const armorLabel = activeArmor ? ARMOR_LABELS[activeArmor] : null;

  // No data at all -- gentle invitation
  if (!fruitsLine && !topGiftLabel && !armorLabel) {
    return "Your formation profile is still gathering. The Fruit Assessment is the first step, and the rest of the picture forms from there.";
  }

  const sentences = [];
  if (fruitsLine) {
    sentences.push(`You're forming around ${fruitsLine} right now.`);
  }
  if (topGiftLabel) {
    sentences.push(`${capitalize(topGiftLabel)} is sitting at the top of your gifts. Worth asking who in your circle has named that in you.`);
  }
  if (armorLabel) {
    sentences.push(`The ${armorLabel} is shaping how you walk in this season. Keep returning to it.`);
  }
  if (sentences.length < 2) {
    sentences.push("What's next is the work below.");
  }
  return sentences.join(" ");
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

const STYLES = `
  .cf-synth {
    width: 100%;
  }
  .cf-synth__card {
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 20px 22px 22px;
    position: relative;
    overflow: hidden;
  }
  .cf-synth__card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
  }
  .cf-synth__eyebrow { margin-bottom: 12px !important; }
  .cf-synth__body {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 16px;
    line-height: 1.6;
    color: var(--cf-ivory-82);
    margin: 0;
  }
  @media (max-width: 600px) {
    .cf-synth__body { font-size: 16px; line-height: 1.65; }
  }
`;

export default function SynthesisCard({ profile }) {
  const body = buildSynthesis(profile);
  if (!body) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-synth">
        <div className="cf-synth__card">
          <EyebrowLabel size="sm" color="gold" className="cf-synth__eyebrow">
            Where you are
          </EyebrowLabel>
          <p className="cf-synth__body">{body}</p>
        </div>
      </div>
    </>
  );
}
