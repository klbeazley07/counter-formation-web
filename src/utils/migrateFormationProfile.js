/**
 * migrateFormationProfile.js
 *
 * One-time migration utility. Reads all known legacy localStorage keys,
 * maps them into the v1 FormationProfile shape, deletes the legacy keys,
 * and returns the populated profile object.
 *
 * Does NOT write to localStorage — the hook (useFormationProfile) handles
 * the write after calling this function.
 *
 * Idempotent: returns null immediately if no legacy keys are present.
 */

// ---------------------------------------------------------------------------
// Legacy keys
// ---------------------------------------------------------------------------

const LEGACY_KEYS = [
  "cf-declaration",
  "cf-examen-log",
  "cf-peace-tracker",
  "cf-peace-statements",
  "cf-first-fifteen",
  "cf-sword-current",
  "cf-sword-library",
  "cf-arrow-log",
  "cf-sbs-progress",
  "cf-armor-progress-belt-of-truth",
  "cf-armor-progress-breastplate-of-righteousness",
  "cf-armor-progress-gospel-of-peace",
  "cf-armor-progress-shield-of-faith",
  "cf-armor-progress-helmet-of-salvation",
  "cf-armor-progress-sword-of-the-spirit",
  "cf7",
  "cf-fruit-assessment",
  "cf-fruit-assessment-draft",
  "cf_slidebar_dismissed",
];

const ARMOR_PIECE_SLUGS = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];

// ---------------------------------------------------------------------------
// Default profile — copied inline to avoid circular dependency with the hook.
// Must stay in sync with contracts.md DEFAULT_PROFILE.
// ---------------------------------------------------------------------------

const DEFAULT_PROFILE = {
  _version:  1,
  _created:  null,
  _updated:  null,
  identity: { email: null },
  assessment: { fruits: null, completedAt: null, formationEdge: [], previousResult: null },
  challenge: { completedDays: [], startedAt: null, completedAt: null },
  armor: { progress: {}, completedPieces: [] },
  fieldGuide: { completedDays: [], currentDay: null, lastVisit: null },
  ruleOfLife: { completedRhythms: [] },
  widgets: {
    declarations: ["", "", ""],
    examenLog: [],
    peaceTracker: {},
    peaceStatements: {
      morning: "The outcome of my story is already secured. I stand in peace.",
      midday:  "The Lord is near. I return to the ground beneath me.",
      evening: "I release what I carried today. God held the world together. I can rest.",
    },
    firstFifteen: null,
    verseTracker: { current: null, library: [] },
    arrowLog: [],
    devotions: [],
  },
  dismissed: { slidebar: false },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely reads and JSON-parses a single localStorage key.
 * Returns the parsed value, or undefined if the key is absent or parse fails.
 */
function readKey(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

/**
 * Deep-clones a plain object/array using JSON round-trip.
 * Safe for the DEFAULT_PROFILE shape which contains only JSON-serialisable values.
 */
function cloneDefault() {
  return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function migrateFormationProfile() {
  // --- Idempotency check: bail out early if no legacy keys exist ---
  const hasLegacyData = LEGACY_KEYS.some(
    (key) => localStorage.getItem(key) !== null
  );
  if (!hasLegacyData) return null;

  // Start from a clean default profile so every field has a safe fallback.
  const profile = cloneDefault();

  // -------------------------------------------------------------------------
  // cf-declaration → widgets.declarations
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-declaration");
    if (Array.isArray(value)) {
      profile.widgets.declarations = value;
    }
  }

  // -------------------------------------------------------------------------
  // cf-examen-log → widgets.examenLog
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-examen-log");
    if (Array.isArray(value)) {
      profile.widgets.examenLog = value;
    }
  }

  // -------------------------------------------------------------------------
  // cf-peace-tracker → widgets.peaceTracker
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-peace-tracker");
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      profile.widgets.peaceTracker = value;
    }
  }

  // -------------------------------------------------------------------------
  // cf-peace-statements → widgets.peaceStatements
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-peace-statements");
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      profile.widgets.peaceStatements = value;
    }
    // If absent or corrupt, the DEFAULT_PROFILE strings remain in place.
  }

  // -------------------------------------------------------------------------
  // cf-first-fifteen → widgets.firstFifteen
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-first-fifteen");
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      profile.widgets.firstFifteen = value;
    }
  }

  // -------------------------------------------------------------------------
  // cf-sword-current → widgets.verseTracker.current
  // May legitimately be absent (removed on week rollover).
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-sword-current");
    // undefined = key absent, null = key present but value was literally null
    if (value !== undefined) {
      profile.widgets.verseTracker.current = value;
    }
  }

  // -------------------------------------------------------------------------
  // cf-sword-library → widgets.verseTracker.library
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-sword-library");
    if (Array.isArray(value)) {
      profile.widgets.verseTracker.library = value;
    }
  }

  // -------------------------------------------------------------------------
  // cf-arrow-log → widgets.arrowLog
  // Normalize: add `verses: []` to any entry that is missing it.
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-arrow-log");
    if (Array.isArray(value)) {
      profile.widgets.arrowLog = value.map((entry) => {
        if (entry === null || typeof entry !== "object") return entry;
        return {
          ...entry,
          verses: Array.isArray(entry.verses) ? entry.verses : [],
        };
      });
    }
  }

  // -------------------------------------------------------------------------
  // cf-sbs-progress → fieldGuide.completedDays + fieldGuide.currentDay
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-sbs-progress");
    if (Array.isArray(value)) {
      profile.fieldGuide.completedDays = value;
      if (value.length > 0) {
        const maxDay = Math.max(...value);
        profile.fieldGuide.currentDay = Math.min(maxDay + 1, 7);
      } else {
        profile.fieldGuide.currentDay = 1;
      }
    }
  }

  // -------------------------------------------------------------------------
  // cf-armor-progress-{piece} → armor.progress[piece]
  // completedPieces: any piece where progress array length >= 7
  // -------------------------------------------------------------------------
  {
    const progress = {};
    const completedPieces = [];

    for (const slug of ARMOR_PIECE_SLUGS) {
      const value = readKey(`cf-armor-progress-${slug}`);
      if (Array.isArray(value)) {
        progress[slug] = value;
        if (value.length >= 7) {
          completedPieces.push(slug);
        }
      }
    }

    // Only overwrite the profile fields if at least one armor key was present.
    if (Object.keys(progress).length > 0) {
      profile.armor.progress = progress;
      profile.armor.completedPieces = completedPieces;
    }
  }

  // -------------------------------------------------------------------------
  // cf7 → challenge.completedDays
  // Shape: Record<string, 1> — convert keys to numbers, filter out 0/NaN.
  // startedAt and completedAt remain null (no timestamp data available).
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf7");
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      profile.challenge.completedDays = Object.keys(value)
        .map(Number)
        .filter(Boolean);
    }
  }

  // -------------------------------------------------------------------------
  // cf-fruit-assessment → assessment
  // Shape: { current: FruitAssessmentResult; previous: FruitAssessmentResult | null }
  // -------------------------------------------------------------------------
  {
    const value = readKey("cf-fruit-assessment");
    if (
      value !== null &&
      typeof value === "object" &&
      value.current &&
      typeof value.current === "object"
    ) {
      const { current, previous } = value;
      profile.assessment.fruits        = current.scores       ?? null;
      profile.assessment.completedAt   = current.completedAt  ?? null;
      profile.assessment.formationEdge = Array.isArray(current.formationFruits)
        ? current.formationFruits
        : [];
      profile.assessment.previousResult = previous ?? null;
    }
  }

  // -------------------------------------------------------------------------
  // cf-fruit-assessment-draft → discard (do not migrate, delete only)
  // Handled below in the cleanup loop — no profile field to set.
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // cf_slidebar_dismissed → dismissed.slidebar
  // Stored as the string "1"; convert to boolean.
  // Note: this key is NOT JSON — it's a raw string. We read it directly.
  // -------------------------------------------------------------------------
  {
    try {
      const raw = localStorage.getItem("cf_slidebar_dismissed");
      if (raw !== null) {
        profile.dismissed.slidebar = raw === "1";
      }
    } catch {
      // Silently skip if localStorage access fails.
    }
  }

  // -------------------------------------------------------------------------
  // Timestamps
  // -------------------------------------------------------------------------
  const now = new Date().toISOString();
  profile._created = now;
  profile._updated = now;

  // -------------------------------------------------------------------------
  // Delete all legacy keys (including the draft — see cf-fruit-assessment-draft)
  // -------------------------------------------------------------------------
  for (const key of LEGACY_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Non-fatal: continue if removal fails for any key.
    }
  }

  return profile;
}
