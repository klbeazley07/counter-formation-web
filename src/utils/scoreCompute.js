// Full scoring logic for the Spiritual Gifts Assessment.
// Three sub-scores per core gift: inclination, fruitfulness, confirmation.
// Composite weights: 30/30/40 with confirmation; 50/50 without (pending).

import { gifts } from "../data/gifts";

const TRUSTED_RESPONSES_KEY = "cf-gifts-trusted-responses";

function loadTrustedResponsesRaw() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(TRUSTED_RESPONSES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

// Returns { [giftKey]: number[] } of non-null frequency values (0-4) per core gift.
// Null values mean "I haven't been in a position to see this" and are excluded.
function aggregateTrustedByGift(raw) {
  const out = {};
  for (const gift of gifts) {
    if (gift.category !== "charismatic") out[gift.key] = [];
  }
  for (const tokenData of Object.values(raw)) {
    if (!tokenData?.completedAt || !tokenData?.responses) continue;
    for (const [giftKey, val] of Object.entries(tokenData.responses)) {
      if (!Object.prototype.hasOwnProperty.call(out, giftKey)) continue;
      if (val !== null && val !== undefined) {
        out[giftKey].push(val);
      }
    }
  }
  return out;
}

/**
 * Compute scores for all 19 gifts.
 *
 * @param {Object} progress - result of loadProgress() from giftsAssessmentStorage
 * @param {Object|null} trustedResponsesRaw - optional override (for testing); null = read from localStorage
 * @returns {{
 *   scores: Object,
 *   totalTrustedPersons: number,
 *   hasTrustedData: boolean
 * }}
 *
 * Per core gift, scores[key] shape:
 * {
 *   isCharismatic: false,
 *   inclination: number (0-100),
 *   fruitfulness: number (0-100),
 *   confirmation: number|null,
 *   confirmationCount: number,
 *   composite: number (0-100),
 *   pendingConfirmation: boolean,
 *   inclinationLowConfidence: boolean,
 *   fruitfulnessSkipped: boolean,
 *   tier: "active" | "activePendingConfirmation" | "emerging" | "quiet",
 * }
 *
 * Per charismatic gift, scores[key] shape:
 * {
 *   isCharismatic: true,
 *   directExperience: number|null (0-100),
 *   fruitfulness: number|null (0-100),
 *   tier: "active" | "emerging" | "notPresent",
 * }
 */
export function computeScores(progress, trustedResponsesRaw = null) {
  const raw =
    trustedResponsesRaw !== null ? trustedResponsesRaw : loadTrustedResponsesRaw();

  const completedTrusted = Object.values(raw).filter((t) => t?.completedAt);
  const totalTrustedPersons = completedTrusted.length;
  const hasTrustedData = totalTrustedPersons > 0;
  const trustedByGift = aggregateTrustedByGift(raw);

  const scores = {};

  for (const gift of gifts) {
    const r = progress?.responses?.[gift.key];

    if (gift.category === "charismatic") {
      const de = r?.directExperience ?? null;
      const fr = r?.fruitfulness ?? null;

      let tier;
      if (de === null || de === 0 || de === 1) {
        tier = "notPresent";
      } else if (de >= 3 && fr !== null && fr >= 3) {
        tier = "active";
      } else {
        tier = "emerging";
      }

      scores[gift.key] = {
        isCharismatic: true,
        directExperience: de !== null ? de * 25 : null,
        fruitfulness: fr !== null ? fr * 25 : null,
        tier,
      };
    } else {
      // Inclination: 3 questions, 0-4 scale -> 0-100
      const inclRaw = r?.inclination ?? [null, null, null];
      const inclNullCount = inclRaw.filter((v) => v == null).length;
      const inclinationLowConfidence = inclNullCount >= 2;
      const inclValues = inclRaw.map((v) => (v == null ? 50 : v * 25));
      const inclScore = inclValues.reduce((a, b) => a + b, 0) / inclValues.length;

      // Fruitfulness: 1 question, 0-4 scale -> 0-100
      const frRaw = r?.fruitfulness ?? null;
      const fruitfulnessSkipped = frRaw == null;
      const frScore = frRaw == null ? 50 : frRaw * 25;

      // Confirmation: mean of non-null trusted-person responses (0-4 -> 0-100)
      const confirmedValues = trustedByGift[gift.key] ?? [];
      const confirmationCount = confirmedValues.length;
      const confirmation =
        confirmationCount > 0
          ? confirmedValues.reduce((sum, v) => sum + v * 25, 0) / confirmationCount
          : null;

      // Composite
      let composite, pendingConfirmation;
      if (confirmation !== null) {
        composite = inclScore * 0.3 + frScore * 0.3 + confirmation * 0.4;
        pendingConfirmation = false;
      } else {
        composite = inclScore * 0.5 + frScore * 0.5;
        pendingConfirmation = true;
      }

      // Tier
      let tier;
      if (composite >= 70) {
        tier = confirmationCount >= 2 ? "active" : "activePendingConfirmation";
      } else if (composite >= 50) {
        tier = "emerging";
      } else {
        tier = "quiet";
      }

      scores[gift.key] = {
        isCharismatic: false,
        inclination: inclScore,
        fruitfulness: frScore,
        confirmation,
        confirmationCount,
        composite,
        pendingConfirmation,
        inclinationLowConfidence,
        fruitfulnessSkipped,
        tier,
      };
    }
  }

  return { scores, totalTrustedPersons, hasTrustedData };
}
