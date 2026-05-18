// Mirrors a lightweight summary of the gifts assessment into cf:profile.gifts
// so the dashboard can read everything from one source. Full responses stay
// in cf-gifts-self-assessment and Supabase; this is only the dashboard view.

import { loadProgress } from "./giftsAssessmentStorage";

const TRUSTED_PERSONS_KEY = "cf-gifts-trusted-persons";
const TRUSTED_RESPONSES_KEY = "cf-gifts-trusted-responses";

export function buildGiftsSummary(scores) {
  if (typeof window === "undefined") return null;

  const progress = loadProgress();
  if (!progress || !progress.completedAt) return null;

  let topGifts = [];
  const topGiftScores = {};
  if (scores && typeof scores === "object") {
    const ranked = Object.entries(scores)
      .filter(([, s]) => s && !s.isCharismatic && typeof s.composite === "number")
      .sort((a, b) => b[1].composite - a[1].composite)
      .slice(0, 3);
    topGifts = ranked.map(([k]) => k);
    for (const [k, s] of ranked) topGiftScores[k] = s.composite;
  }

  let invited = 0;
  let confirmed = 0;
  try {
    const persons = JSON.parse(localStorage.getItem(TRUSTED_PERSONS_KEY) || "[]");
    invited = Array.isArray(persons) ? persons.length : 0;
  } catch { /* ignore */ }
  try {
    const responses = JSON.parse(localStorage.getItem(TRUSTED_RESPONSES_KEY) || "{}");
    confirmed = Object.values(responses).filter((r) => r && r.completedAt).length;
  } catch { /* ignore */ }

  return {
    completedAt: progress.completedAt,
    topGifts,
    topGiftScores,
    trustedPersonsInvited: invited,
    trustedPersonsConfirmed: confirmed,
  };
}

export function mirrorGiftsToProfile(updateProfile, scores) {
  const summary = buildGiftsSummary(scores);
  if (!summary) return;
  updateProfile({ gifts: summary });
}
