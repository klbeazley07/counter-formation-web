/**
 * devotionContext.js
 *
 * Pure builder for the context envelope POSTed to /api/generate alongside
 * passage/theme/bigIdea. Reads a FormationProfile and returns the fields the
 * backend needs to ground a generated devotion: the user's formation edge,
 * current armor piece + day, challenge state, recent arrow log lies, and most
 * recent declaration.
 *
 * No side effects, no React imports, no localStorage access. Total over all
 * inputs: never throws, always returns a valid envelope object.
 *
 * Contract: sessions/contracts.md "Devotion Context Envelope" section.
 */

import { ARMOR_PIECE_SEQUENCE } from "./formationRecommendation";

const DEFAULT_ENVELOPE = {
  formationEdge:     [],
  currentArmorPiece: null,
  currentArmorDay:   null,
  challengeComplete: false,
  recentArrowLog:    [],
  recentDeclaration: null,
};

function deriveCurrentArmor(armorProgress) {
  if (!armorProgress || typeof armorProgress !== "object") {
    return { piece: null, day: null };
  }
  for (let i = ARMOR_PIECE_SEQUENCE.length - 1; i >= 0; i--) {
    const slug = ARMOR_PIECE_SEQUENCE[i];
    const days = Array.isArray(armorProgress[slug]) ? armorProgress[slug] : [];
    if (days.length > 0) {
      const maxDay = Math.max(...days.filter(d => Number.isFinite(d)));
      if (Number.isFinite(maxDay)) {
        return { piece: slug, day: Math.min(6, Math.max(1, maxDay)) };
      }
    }
  }
  return { piece: null, day: null };
}

function deriveRecentArrowLog(arrowLog) {
  if (!Array.isArray(arrowLog) || arrowLog.length === 0) return [];
  const sorted = arrowLog
    .filter(e => e && typeof e === "object")
    .slice()
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
  const result = [];
  for (const entry of sorted) {
    if (result.length >= 3) break;
    const lie = typeof entry.lie === "string" ? entry.lie.trim() : "";
    if (lie) result.push(lie);
  }
  return result;
}

function deriveRecentDeclaration(declarations) {
  if (!Array.isArray(declarations)) return null;
  for (const d of declarations) {
    if (typeof d === "string") {
      const trimmed = d.trim();
      if (trimmed) return trimmed;
    }
  }
  return null;
}

/**
 * Build the devotion context envelope from a FormationProfile.
 *
 * @param {object|null|undefined} profile  The profile snapshot from useFormationProfile.
 * @returns {object} The context envelope. Always returns a complete object; never throws.
 */
export function buildDevotionContext(profile) {
  if (!profile || typeof profile !== "object") {
    return { ...DEFAULT_ENVELOPE };
  }

  const formationEdge = Array.isArray(profile.assessment?.formationEdge)
    ? profile.assessment.formationEdge.filter(s => typeof s === "string" && s.length > 0)
    : [];

  const { piece: currentArmorPiece, day: currentArmorDay } = deriveCurrentArmor(
    profile.armor?.progress
  );

  const completedDays = Array.isArray(profile.challenge?.completedDays)
    ? profile.challenge.completedDays
    : [];
  const challengeComplete = completedDays.length >= 7;

  const recentArrowLog = deriveRecentArrowLog(profile.widgets?.arrowLog);
  const recentDeclaration = deriveRecentDeclaration(profile.widgets?.declarations);

  return {
    formationEdge,
    currentArmorPiece,
    currentArmorDay,
    challengeComplete,
    recentArrowLog,
    recentDeclaration,
  };
}
