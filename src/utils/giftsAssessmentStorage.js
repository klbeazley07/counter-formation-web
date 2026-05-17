// Spiritual Gifts Assessment -- storage shape, question manifest, and helpers.
// Primary persistence is localStorage; Supabase is a fire-and-forget backup.

import { gifts } from "../data/gifts";
import { supabase } from "./supabaseClient";
import { getSessionId } from "./giftsSessionId";

export const STORAGE_KEY = "cf-gifts-self-assessment";

// Five-point scales. Index 0..4. Mapping to the 0..100 scale used by scoring
// (Session 6) is value * 25.
export const INCLINATION_SCALE = [
  { value: 0, label: "Strongly disagree" },
  { value: 1, label: "Disagree" },
  { value: 2, label: "Neither agree nor disagree" },
  { value: 3, label: "Agree" },
  { value: 4, label: "Strongly agree" },
];

export const FREQUENCY_SCALE = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Consistently" },
];

// Build the ordered question manifest -- 72 entries total.
// Order: gift by gift in biblical sequence. Within each core gift the order is
// 3 inclination questions then 1 fruitfulness question. Charismatic gifts
// (the last two) use 1 directExperience question then 1 fruitfulness question.
export function buildQuestionManifest() {
  const items = [];
  let order = 0;
  for (const gift of gifts) {
    if (gift.category === "charismatic") {
      items.push({
        order: order++,
        giftKey: gift.key,
        type: "directExperience",
        subIdx: 0,
        questionTotal: 2,
        questionIdx: 1, // 1 of 2 within this gift
      });
      items.push({
        order: order++,
        giftKey: gift.key,
        type: "fruitfulness",
        subIdx: 0,
        questionTotal: 2,
        questionIdx: 2,
      });
    } else {
      gift.inclinationQuestions.forEach((_, i) => {
        items.push({
          order: order++,
          giftKey: gift.key,
          type: "inclination",
          subIdx: i,
          questionTotal: 4,
          questionIdx: i + 1, // 1, 2, 3 of 4
        });
      });
      items.push({
        order: order++,
        giftKey: gift.key,
        type: "fruitfulness",
        subIdx: 0,
        questionTotal: 4,
        questionIdx: 4,
      });
    }
  }
  return items;
}

export const QUESTION_MANIFEST = buildQuestionManifest();
export const TOTAL_QUESTIONS = QUESTION_MANIFEST.length;

// Empty response shape for a given gift.
function emptyGiftResponse(gift) {
  if (gift.category === "charismatic") {
    return {
      directExperience: null,
      fruitfulness: null,
      skipped: { directExperience: false, fruitfulness: false },
    };
  }
  return {
    inclination: [null, null, null],
    fruitfulness: null,
    skipped: { inclination: [false, false, false], fruitfulness: false },
  };
}

export function emptyProgress() {
  const responses = {};
  for (const gift of gifts) {
    responses[gift.key] = emptyGiftResponse(gift);
  }
  return {
    responses,
    qIdx: 0,
    charismaticIntroSeen: false,
    startedAt: new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString(),
    completedAt: null,
    // Pre-computed inclination scores per gift, refreshed on every save.
    inclinationPreview: {},
  };
}

export function loadProgress() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    // Guard against schema drift: if responses missing or qIdx out of range, treat as fresh.
    if (!parsed.responses || typeof parsed.qIdx !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveProgress(progress) {
  if (typeof window === "undefined") return;
  const next = {
    ...progress,
    lastUpdatedAt: new Date().toISOString(),
    inclinationPreview: computeInclinationPreview(progress.responses),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota or private mode -- silently fail.
  }
  // Background upsert to Supabase -- never blocks the UI.
  // Skip when qIdx is 0 and completedAt is null (empty init state) so we never
  // clobber a completed session with a blank slate.
  if (supabase && (next.qIdx > 0 || next.completedAt)) {
    const sessionId = getSessionId();
    if (sessionId) {
      supabase.from("gifts_sessions").upsert({
        session_id: sessionId,
        progress: next,
        completed_at: next.completedAt || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "session_id" }).then(() => {});
    }
  }
  return next;
}

export function clearProgress() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// Inclination preview score per core gift (0-100).
// Mean of the three inclination responses, treating null as 50 (neutral),
// the same rule the spec uses for skipped responses. This is a preview only;
// the authoritative scoring runs in Session 6 with low-confidence flagging.
export function computeInclinationPreview(responses) {
  const out = {};
  for (const gift of gifts) {
    if (gift.category === "charismatic") continue;
    const r = responses?.[gift.key];
    if (!r || !Array.isArray(r.inclination)) {
      out[gift.key] = null;
      continue;
    }
    const values = r.inclination.map((v) => (v == null ? 50 : v * 25));
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    out[gift.key] = Math.round(mean);
  }
  return out;
}

// True when there is a partially completed (but not finished) assessment in storage.
export function hasInProgressAssessment(progress = loadProgress()) {
  if (!progress) return false;
  if (progress.completedAt) return false;
  if (progress.qIdx <= 0) {
    // qIdx 0 with no responses recorded -> not really in progress
    return Object.values(progress.responses || {}).some((r) => {
      if (!r) return false;
      if (Array.isArray(r.inclination) && r.inclination.some((v) => v != null)) return true;
      if (r.directExperience != null) return true;
      if (r.fruitfulness != null) return true;
      return false;
    });
  }
  return true;
}

// True when a completed self-assessment exists in storage.
// Also handles the edge case where all questions were answered but
// completedAt was not written (e.g. browser killed before the processing
// screen finished). Repairs the timestamp in-place when detected.
export function hasCompletedAssessment(progress = loadProgress()) {
  if (!progress) return false;
  if (progress.completedAt) return true;
  if (progress.qIdx >= TOTAL_QUESTIONS) {
    try {
      const repaired = {
        ...progress,
        completedAt: progress.lastUpdatedAt || new Date().toISOString(),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
    } catch { /* quota / private mode */ }
    return true;
  }
  return false;
}

// Convenience: write a single response and return the new progress object.
export function recordResponse(progress, manifestItem, value, opts = {}) {
  const { skipped = false } = opts;
  const next = {
    ...progress,
    responses: { ...progress.responses },
  };
  const giftResp = { ...next.responses[manifestItem.giftKey] };
  if (manifestItem.type === "inclination") {
    const incl = [...giftResp.inclination];
    incl[manifestItem.subIdx] = value;
    const sk = [...giftResp.skipped.inclination];
    sk[manifestItem.subIdx] = skipped;
    giftResp.inclination = incl;
    giftResp.skipped = { ...giftResp.skipped, inclination: sk };
  } else if (manifestItem.type === "directExperience") {
    giftResp.directExperience = value;
    giftResp.skipped = { ...giftResp.skipped, directExperience: skipped };
  } else if (manifestItem.type === "fruitfulness") {
    giftResp.fruitfulness = value;
    giftResp.skipped = { ...giftResp.skipped, fruitfulness: skipped };
  }
  next.responses[manifestItem.giftKey] = giftResp;
  return next;
}

export function getStoredResponseValue(progress, manifestItem) {
  const r = progress?.responses?.[manifestItem.giftKey];
  if (!r) return null;
  if (manifestItem.type === "inclination") return r.inclination?.[manifestItem.subIdx] ?? null;
  if (manifestItem.type === "directExperience") return r.directExperience ?? null;
  if (manifestItem.type === "fruitfulness") return r.fruitfulness ?? null;
  return null;
}
