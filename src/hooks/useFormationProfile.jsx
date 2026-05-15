import { useState, useEffect, useContext, createContext } from "react";
import { migrateFormationProfile } from "../utils/migrateFormationProfile";

const PROFILE_KEY = "cf:profile";

const DEFAULT_PROFILE = {
  _version: 1,
  _created: null,
  _updated: null,
  identity: {
    email: null,
  },
  assessment: {
    fruits:         null,
    completedAt:    null,
    formationEdge:  [],
    previousResult: null,
  },
  challenge: {
    completedDays: [],
    startedAt:     null,
    completedAt:   null,
  },
  armor: {
    progress:        {},
    completedPieces: [],
  },
  fieldGuide: {
    completedDays: [],
    currentDay:    null,
    lastVisit:     null,
  },
  ruleOfLife: {
    completedRhythms: [],
  },
  onboarding: {
    completedAt:      null,
    formationFocus:   null,
    rhythmPreference: null,
    intention:        "",
  },
  widgets: {
    declarations: ["", "", ""],
    examenLog:    [],
    peaceTracker: {},
    peaceStatements: {
      morning: "The outcome of my story is already secured. I stand in peace.",
      midday:  "The Lord is near. I return to the ground beneath me.",
      evening: "I release what I carried today. God held the world together. I can rest.",
    },
    firstFifteen: null,
    verseTracker: {
      current: null,
      library: [],
    },
    arrowLog:  [],
    devotions: [],
  },
  dismissed: {
    slidebar: false,
  },
};

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

function deepMerge(target, source) {
  const result = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = result[key];
    if (
      sourceVal !== null &&
      typeof sourceVal === "object" &&
      !Array.isArray(sourceVal) &&
      targetVal !== null &&
      typeof targetVal === "object" &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      result[key] = sourceVal;
    }
  }
  return result;
}

function hasAnyLegacyKey() {
  return LEGACY_KEYS.some((key) => localStorage.getItem(key) !== null);
}

// Context shared across the component tree. Populated by FormationProfileProvider.
const FormationProfileContext = createContext(null);

/**
 * Wrap the root of the app with this provider. It owns the single copy of
 * the formation profile state and exposes it to all consumers.
 */
export function FormationProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let initialProfile;

    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try {
        initialProfile = JSON.parse(raw);
      } catch {
        initialProfile = null;
      }
    }

    if (!initialProfile) {
      if (hasAnyLegacyKey()) {
        const migrated = migrateFormationProfile();
        if (migrated) {
          localStorage.setItem(PROFILE_KEY, JSON.stringify(migrated));
          initialProfile = migrated;
        }
      }
    }

    if (!initialProfile) {
      const now = new Date().toISOString();
      initialProfile = Object.assign({}, DEFAULT_PROFILE, {
        _created: now,
        _updated: now,
      });
      localStorage.setItem(PROFILE_KEY, JSON.stringify(initialProfile));
    }

    setProfile(initialProfile);
    setIsLoaded(true);
  }, []);

  function updateProfile(patch) {
    setProfile((current) => {
      const merged = deepMerge(current, patch);
      merged._updated = new Date().toISOString();
      localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
      return merged;
    });
  }

  function resetProfile() {
    const now = new Date().toISOString();
    const fresh = Object.assign({}, DEFAULT_PROFILE, {
      _created: now,
      _updated: now,
    });
    localStorage.setItem(PROFILE_KEY, JSON.stringify(fresh));
    setProfile(fresh);
  }

  return (
    <FormationProfileContext.Provider value={{ profile, updateProfile, resetProfile, isLoaded }}>
      {children}
    </FormationProfileContext.Provider>
  );
}

/**
 * Access the formation profile from any component inside FormationProfileProvider.
 * Returns { profile, updateProfile, resetProfile, isLoaded }.
 */
export function useFormationProfile() {
  const ctx = useContext(FormationProfileContext);
  if (!ctx) {
    throw new Error("useFormationProfile must be used within FormationProfileProvider");
  }
  return ctx;
}
