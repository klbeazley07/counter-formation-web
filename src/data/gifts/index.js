// Spiritual Gifts data loader and validator.
// Source of truth: per-gift JSON files in this directory.
// Order matters: biblical sequence (Manifestation -> Ministry -> Equipping -> Charismatic)
// drives the Constellation layout and the assessment question flow.

import wisdom from "./wisdom.json";
import knowledge from "./knowledge.json";
import faith from "./faith.json";
import healing from "./healing.json";
import miracles from "./miracles.json";
import prophecy from "./prophecy.json";
import discernment from "./discernment.json";
import teaching from "./teaching.json";
import exhortation from "./exhortation.json";
import serving from "./serving.json";
import giving from "./giving.json";
import leadership from "./leadership.json";
import mercy from "./mercy.json";
import hospitality from "./hospitality.json";
import administration from "./administration.json";
import evangelism from "./evangelism.json";
import shepherding from "./shepherding.json";
import tongues from "./tongues.json";
import interpretation from "./interpretation.json";

export const gifts = [
  wisdom,
  knowledge,
  faith,
  healing,
  miracles,
  prophecy,
  discernment,
  teaching,
  exhortation,
  serving,
  giving,
  leadership,
  mercy,
  hospitality,
  administration,
  evangelism,
  shepherding,
  tongues,
  interpretation,
];

export const giftsByKey = gifts.reduce((acc, gift) => {
  acc[gift.key] = gift;
  return acc;
}, {});

export const giftsByCategory = gifts.reduce((acc, gift) => {
  (acc[gift.category] ||= []).push(gift);
  return acc;
}, {});

export const CATEGORIES = ["manifestation", "ministry", "equipping", "charismatic"];

const CORE_EDGE_CASES = [
  "emerging",
  "inclinationConfirmationGap",
  "confirmationInclinationGap",
  "quiet",
];
const CHARISMATIC_EDGE_CASES = ["emerging", "notPresent"];

function validate() {
  const errors = [];

  if (gifts.length !== 19) {
    errors.push(`Expected 19 gifts, found ${gifts.length}`);
  }

  const keys = new Set();
  for (const gift of gifts) {
    if (keys.has(gift.key)) errors.push(`Duplicate gift key: ${gift.key}`);
    keys.add(gift.key);

    if (!CATEGORIES.includes(gift.category)) {
      errors.push(`${gift.key}: invalid category "${gift.category}"`);
    }

    const required = [
      "name",
      "essenceStatement",
      "workingDefinition",
      "scriptureAnchor",
      "scriptureAnchorText",
      "manifestationWitnesses",
      "stewardshipCharge",
      "fruitfulnessQuestion",
      "bodyApplication",
      "pairsWith",
      "formationOutput",
      "edgeCases",
    ];
    for (const field of required) {
      if (gift[field] === undefined || gift[field] === null) {
        errors.push(`${gift.key}: missing required field "${field}"`);
      }
    }

    if (gift.category === "charismatic") {
      if (!gift.directExperienceQuestion) {
        errors.push(`${gift.key}: charismatic gift missing directExperienceQuestion`);
      }
      for (const ec of CHARISMATIC_EDGE_CASES) {
        if (!gift.edgeCases?.[ec]) {
          errors.push(`${gift.key}: charismatic edgeCases missing "${ec}"`);
        }
      }
    } else {
      if (!Array.isArray(gift.inclinationQuestions) || gift.inclinationQuestions.length !== 3) {
        errors.push(`${gift.key}: core gift must have exactly 3 inclinationQuestions`);
      }
      if (!gift.communityConfirmationQuestion) {
        errors.push(`${gift.key}: core gift missing communityConfirmationQuestion`);
      }
      for (const ec of CORE_EDGE_CASES) {
        if (!gift.edgeCases?.[ec]) {
          errors.push(`${gift.key}: core edgeCases missing "${ec}"`);
        }
      }
    }
  }

  // pairsWith symmetry: if A includes B, B must include A.
  for (const gift of gifts) {
    if (!Array.isArray(gift.pairsWith)) {
      errors.push(`${gift.key}: pairsWith must be an array`);
      continue;
    }
    for (const partnerKey of gift.pairsWith) {
      const partner = giftsByKey[partnerKey];
      if (!partner) {
        errors.push(`${gift.key} pairsWith unknown gift "${partnerKey}"`);
        continue;
      }
      if (!partner.pairsWith?.includes(gift.key)) {
        errors.push(
          `Asymmetric pairing: ${gift.key} -> ${partnerKey} but ${partnerKey} does not pair back`,
        );
      }
    }
  }

  if (errors.length) {
    throw new Error("Gifts data validation failed:\n  - " + errors.join("\n  - "));
  }
}

validate();

export default gifts;
