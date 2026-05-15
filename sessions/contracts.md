# API Contracts

This file is the single source of truth for all API interfaces, schemas, and component signatures agreed during build sessions. Builders must not deviate from contracts without flagging it explicitly.

**Last updated:** 2026-05-15 (Phase 1 Architect — contracts finalized from source audit)

---

## Formation Profile Schema (v1)

**Status: FINALIZED — Phase 1 Architect**

```ts
// Fruit score map: each key is one of the 9 FRUIT_ORDER slugs.
// Values are normalized 0–100 integers (from calculateScores).
type FruitScores = Record<
  "love" | "joy" | "peace" | "patience" | "kindness" |
  "goodness" | "faithfulness" | "gentleness" | "self_control",
  number
>;

// Declaration widget: stored as a flat string array (3–5 items).
// Empty strings are valid slot placeholders.
type Declaration = string;

// Examen widget: one entry per "Save Examen" action.
type ExamenEntry = {
  responses:  string[];   // always length 5, parallel to QUESTIONS array
  timestamp:  string;     // ISO 8601
};

// Peace Pause widget: keyed by "YYYY-MM-DD" date strings.
// Each day tracks whether morning / midday / evening pause was taken.
type PeaceDay = {
  morning: boolean;
  midday:  boolean;
  evening: boolean;
};

// Peace Pause custom statements (separate legacy key cf-peace-statements,
// not listed in the original spec — see Migration Contract notes).
type PeaceStatements = {
  morning: string;
  midday:  string;
  evening: string;
};

// First Fifteen widget: three 5-minute practice slots + optional notes.
type FirstFifteenConfig = {
  slots: [string, string, string];  // exactly 3 practice labels
  notes: string;
};

// Verse Tracker widget — current active verse (this week).
type Verse = {
  ref:       string;          // e.g. "Romans 8:1"
  text:      string;          // verse body text
  days:      boolean[];       // length 7, Mon–Sun review toggles
  weekKey:   string;          // ISO week key "YYYY-WNN"
};

// Verse Tracker widget — library entry (archived verses).
// weekKey is absent after archiving; dateAdded replaces it.
type LibraryVerse = {
  ref:       string;
  text:      string;
  dateAdded: string;          // ISO 8601
};

// Arrow Log widget: one entry per "Add to Log" action.
type ArrowEntry = {
  id:        string;          // crypto.randomUUID()
  lie:       string;
  truth:     string;
  verses:    ArrowVerse[];    // may be empty array
  timestamp: number;          // Date.now() — milliseconds since epoch (NOT ISO string)
};

type ArrowVerse = {
  reference:   string;
  translation: string;
  text:        string;
  bibleUrl:    string;
};

// Fruit Assessment — a single completed result.
type FruitAssessmentResult = {
  completedAt:     string;     // ISO 8601
  answers:         (number | null)[];  // length 27, values 1–6 or null
  scores:          FruitScores;
  primaryFruit:    string;     // lowest-scoring fruit slug
  primaryEvidence: string;     // highest-scoring fruit slug
  evidenceFruits:  string[];   // top 3 scoring fruit slugs
  formationFruits: string[];   // bottom 3 scoring fruit slugs
  cluster:         string[];   // fruits within CLUSTER_THRESHOLD of primaryFruit
};

// DevotionEntry placeholder — DevotionGuide is currently stateless.
// Defined here as a forward-looking stub.
type DevotionEntry = {
  date:    string;    // ISO 8601
  content: string;
};

interface FormationProfile {
  _version:   1;
  _created:   string;   // ISO 8601
  _updated:   string;   // ISO 8601
  identity: {
    email: string | null;
  };
  assessment: {
    fruits:         FruitScores | null;
    completedAt:    string | null;
    formationEdge:  string[];   // 3 lowest-scoring fruit slugs (formationFruits from result)
    previousResult: FruitAssessmentResult | null;  // one prior result retained for delta display
  };
  challenge: {
    completedDays: number[];
    startedAt:     string | null;
    completedAt:   string | null;
  };
  armor: {
    progress:        Record<string, number[]>;  // piece slug → completed day numbers
    completedPieces: string[];
  };
  fieldGuide: {
    completedDays: number[];
    currentDay:    number | null;
    lastVisit:     string | null;
  };
  ruleOfLife: {
    completedRhythms: string[];
  };
  widgets: {
    declarations:   Declaration[];
    examenLog:      ExamenEntry[];
    peaceTracker:   Record<string, PeaceDay>;
    peaceStatements: PeaceStatements;         // added: was a separate key in legacy
    firstFifteen:   FirstFifteenConfig | null;
    verseTracker:   { current: Verse | null; library: LibraryVerse[] };
    arrowLog:       ArrowEntry[];
    devotions:      DevotionEntry[];
  };
  dismissed: {
    slidebar: boolean;
  };
}
```

---

## useFormationProfile Hook API

**Status: FINALIZED — Phase 1 Architect**

```ts
type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

function useFormationProfile(): {
  profile:       FormationProfile;
  updateProfile: (patch: DeepPartial<FormationProfile>) => void;
  resetProfile:  () => void;
  isLoaded:      boolean;
}
```

- `updateProfile(patch)` performs a deep merge. It does not replace nested objects — it merges them recursively. Arrays at leaf level are replaced, not concatenated.
- `resetProfile()` clears the profile to the default empty state. Used in testing only.
- `isLoaded` is `false` during the initial read and migration, `true` after. Components that depend on profile data should gate their render on `isLoaded`.

---

## Migration Contract

**Status: FINALIZED — Phase 1 Architect**

```ts
function migrateFormationProfile(): FormationProfile | null
// Returns the migrated profile if legacy keys were found, null if nothing to migrate.
// Called once on App mount. After it runs, all legacy keys are deleted.
// Idempotent: if called again when legacy keys are absent, returns null and does nothing.
```

### Migration Map

| Legacy Key | Raw Shape | Profile Path | Notes |
|---|---|---|---|
| `cf-declaration` | `string[]` (3–5 items, may include empty strings) | `profile.widgets.declarations` | Direct assignment. Array of strings, not objects. |
| `cf-examen-log` | `Array<{ responses: string[]; timestamp: string }>` | `profile.widgets.examenLog` | Direct assignment. Each entry has 5 responses + ISO timestamp. |
| `cf-peace-tracker` | `Record<"YYYY-MM-DD", { morning: boolean; midday: boolean; evening: boolean }>` | `profile.widgets.peaceTracker` | Direct assignment. Keys are date strings. |
| `cf-peace-statements` | `{ morning: string; midday: string; evening: string }` | `profile.widgets.peaceStatements` | Not in original spec. Migrate to new peaceStatements sub-key. |
| `cf-first-fifteen` | `{ slots: string[]; notes: string }` | `profile.widgets.firstFifteen` | Direct assignment. |
| `cf-sword-current` | `{ ref: string; text: string; days: boolean[]; weekKey: string } \| null` | `profile.widgets.verseTracker.current` | May be absent (removed on week rollover). |
| `cf-sword-library` | `Array<{ ref: string; text: string; dateAdded: string }>` | `profile.widgets.verseTracker.library` | Direct assignment. Library entries lack `days`/`weekKey`. |
| `cf-arrow-log` | `Array<{ id: string; lie: string; truth: string; verses: ArrowVerse[]; timestamp: number }>` | `profile.widgets.arrowLog` | timestamp is `Date.now()` integer (ms), not ISO string. Normalize `verses` to empty array if absent (legacy logs may lack it). |
| `cf-sbs-progress` | `number[]` (sorted day numbers 1–7) | `profile.fieldGuide.completedDays` | Direct assignment. Set `currentDay` to `max(completedDays) + 1` clamped to 7, or 1 if empty. |
| `cf-armor-progress-{piece}` | `number[]` (completed day numbers for that piece) | `profile.armor.progress[piece]` | One key per armor piece slug. Enumerate all 6 known slugs during migration: `belt-of-truth`, `breastplate-of-righteousness`, `gospel-of-peace`, `shield-of-faith`, `helmet-of-salvation`, `sword-of-the-spirit`. Set `completedPieces` to any piece where all days are complete (requires knowing the day count per piece — use 7 as default). |
| `cf7` | `Record<string, 1>` — day number (as string) → 1 | `profile.challenge.completedDays` | Convert `Object.keys(progress).map(Number).filter(Boolean)` to a `number[]`. |
| `cf-fruit-assessment` | `{ current: FruitAssessmentResult; previous: FruitAssessmentResult \| null }` | `profile.assessment` | Map `current.scores` → `profile.assessment.fruits`; `current.completedAt` → `profile.assessment.completedAt`; `current.formationFruits` → `profile.assessment.formationEdge`; store `previous` → `profile.assessment.previousResult`. |
| `cf-fruit-assessment-draft` | `{ answers: (number \| null)[]; currentQuestion: number }` | Not migrated — discard | Draft is in-progress state only. Delete on migration. |
| `cf_slidebar_dismissed` | `"1"` (string) | `profile.dismissed.slidebar` | Convert `=== "1"` to boolean `true`. |

---

## Default Profile

**Status: FINALIZED — Phase 1 Architect**

The exact object returned by `useFormationProfile` on first load when no legacy data exists and no profile key is found in localStorage:

```js
const DEFAULT_PROFILE = {
  _version:  1,
  _created:  null,   // set to new Date().toISOString() on first write
  _updated:  null,   // set to new Date().toISOString() on first write
  identity: {
    email: null,
  },
  assessment: {
    fruits:          null,
    completedAt:     null,
    formationEdge:   [],
    previousResult:  null,
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
  widgets: {
    declarations: ["", "", ""],   // three empty slots matching MIN_STATEMENTS
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
```

---

## NextStep Component API

**Status: FINALIZED — Phase 2 Architect**

`<NextStep>` is a self-contained card component that reads the FormationProfile internally via `useFormationProfile`, calls `formationRecommendation(context, profile)`, and renders a forward-action block suited to each placement. It does not accept content props -- the recommendation engine drives all copy and routing.

```ts
type NextStepContext =
  | "challenge-complete"
  | "assessment-complete"
  | "armor-piece-complete"
  | "field-guide-complete";

interface NextStepProps {
  /**
   * Which transition moment this component is rendering inside.
   * Drives destination, label, and description copy via formationRecommendation().
   */
  context: NextStepContext;

  /**
   * Required only when context === "armor-piece-complete".
   * The slug of the armor piece currently being completed (e.g. "belt-of-truth").
   * Used to determine next-piece-in-sequence and to detect all-pieces-complete state.
   */
  pieceSlug?: string;

  /**
   * Optional CSS className applied to the outermost wrapper div.
   * Use for margin overrides at specific insertion points only.
   */
  className?: string;
}
```

### Context-to-extra-data requirements

| context | Extra prop required | Why |
|---|---|---|
| `challenge-complete` | none | Destination derived from `profile.assessment.formationEdge[0]` |
| `assessment-complete` | none | Destination derived from `profile.assessment.formationEdge[0]` |
| `armor-piece-complete` | `pieceSlug` (required) | Needed to compute next piece in sequence and detect completion |
| `field-guide-complete` | none | Destination derived from `profile.challenge.completedDays` |

### Rendered output shape

The component renders a styled card block matching the `.cf7-next-step` CSS class pattern already present in SevenDayChallenge.jsx. The card contains:
- A small eyebrow label (e.g. "Formation Path")
- A short description sentence from `recommendation.description`
- A primary CTA button linking to `recommendation.destination` with `recommendation.label` as text

The component must not render at all (return `null`) when `isLoaded` is false.

---

## Recommendation Engine API

**Status: FINALIZED — Phase 2 Architect**

This function lives in `src/utils/formationRecommendation.js`. It is a pure function -- no side effects, no hooks, no localStorage access. It receives the current profile snapshot and returns a recommendation object.

```ts
interface Recommendation {
  destination: string;   // React Router path (e.g. "/identity/belt-of-truth")
  label:       string;   // CTA button text (e.g. "Begin the Belt of Truth")
  description: string;   // One sentence shown above the CTA
}

function formationRecommendation(
  context:   NextStepContext,
  profile:   FormationProfile,
  pieceSlug?: string        // required when context === "armor-piece-complete"
): Recommendation
```

### Rules per context

**`challenge-complete`**

The 7-Day Challenge ends at Day 7. The recommendation is the armor piece that corresponds to the user's primary formation fruit (`profile.assessment.formationEdge[0]`), looked up via `FRUIT_TO_ARMOR`.

Sufficient data condition: `profile.assessment.formationEdge.length > 0`

Insufficient: `formationEdge` is empty (user has not taken the assessment). Fall back to Belt of Truth (`/identity/belt-of-truth`), label "Begin the Armor of God", description "Start with the piece that grounds all the others."

---

**`assessment-complete`**

The Fruit Assessment results page. The recommendation is the Rule of Life rhythm corresponding to `profile.assessment.formationEdge[0]`, looked up via `FRUIT_TO_RULE_OF_LIFE`.

Sufficient data condition: `profile.assessment.formationEdge.length > 0`

Insufficient: `formationEdge` is empty. Fall back to Belt of Truth (`/identity/belt-of-truth`), label "Begin the Armor of God", description "Start with the piece that grounds all the others."

---

**`armor-piece-complete`**

Called when a user completes Day 6 of any armor piece. Requires `pieceSlug`.

Step 1: Check if all 6 pieces are in `profile.armor.completedPieces`. If yes, recommend the Rule of Life rhythm connected to `pieceSlug` via `ARMOR_PIECE_CROSS_LINKS` (the existing CROSS_LINKS data in Identity.jsx, imported or duplicated here).

Step 2: If not all pieces complete, recommend the next armor piece in `ARMOR_PIECE_SEQUENCE` after `pieceSlug`.

Sufficient data condition: `pieceSlug` is a valid armor piece slug and is present in `ARMOR_PIECE_SEQUENCE`.

Insufficient: `pieceSlug` is null, undefined, or not in sequence. Fall back to Belt of Truth.

---

**`field-guide-complete`**

Called at the end of the Field Guide 7-Day Path (Day 7 of the Scripture Before Scroll office). The recommendation branches:

- If `profile.challenge.completedDays.length < 7` (7-Day Challenge not complete): recommend `/7-day-challenge`, label "Begin the 7-Day Challenge", description "Seven days to interrupt drift and begin a different pattern of life."
- If challenge is complete: recommend `/devotion-guide`, label "Enter the Devotion Guide", description "Ongoing formation -- where the pattern you've built continues."

Sufficient data condition: profile is loaded (`isLoaded === true` is checked by the component, not this function; the function assumes profile is valid).

Insufficient: not applicable to this context -- the branch logic handles all states.

---

### Fallback (all contexts)

When profile data is insufficient for the given context, return:
```js
{
  destination: "/identity/belt-of-truth",
  label:       "Begin the Armor of God",
  description: "Start with the piece that grounds all the others.",
}
```

---

## Fruit-to-Armor Mapping

**Status: FINALIZED — Phase 2 Architect**

Constant name: `FRUIT_TO_ARMOR`. Lives in `src/utils/formationRecommendation.js`.

```js
export const FRUIT_TO_ARMOR = {
  love:         "gospel-of-peace",
  joy:          "helmet-of-salvation",
  peace:        "gospel-of-peace",
  patience:     "shield-of-faith",
  kindness:     "breastplate-of-righteousness",
  goodness:     "belt-of-truth",
  faithfulness: "sword-of-the-spirit",
  gentleness:   "breastplate-of-righteousness",
  self_control: "helmet-of-salvation",
};
```

### Pairing rationale

- **love → gospel-of-peace**: Love in action is expressed outward toward others; the Gospel of Peace track centers on readiness to bring good news and extend Christ's shalom to others. Both operate in the relational, outward-facing dimension.
- **joy → helmet-of-salvation**: Joy as the Spirit produces it is a settled conviction that God is good and sovereign regardless of circumstances -- which is precisely what the Helmet of Salvation protects: the mind's settled identity in Christ. Both guard against circumstances-driven identity collapse.
- **peace → gospel-of-peace**: Direct thematic alignment. The peace fruit is interior settledness; the Gospel of Peace armor is the external readiness that settledness enables. They are two sides of the same reality.
- **patience → shield-of-faith**: Patience as active trust is faith expressed over time under pressure. The Shield of Faith is explicitly about quenching the flaming arrows of doubt and accusation. Both are the posture of a person who has decided to trust a God they cannot control.
- **kindness → breastplate-of-righteousness**: Kindness as the Spirit produces it is attentiveness to others free of performance motivation. The Breastplate of Righteousness protects against shame and pride -- both of which crowd out attentiveness. A heart protected from shame can afford to be genuinely kind.
- **goodness → belt-of-truth**: Goodness is integrity between private and public behavior. The Belt of Truth is the foundational commitment to reality over self-deception. Both operate in the domain of honesty and interior alignment.
- **faithfulness → sword-of-the-spirit**: Faithfulness is sustained consistency in practice over time; the Sword of the Spirit (Scripture memorization, word internalized) is what makes that consistency possible -- the truth already in you at the moment of temptation. The sword sustains the faithful over the long arc.
- **gentleness → breastplate-of-righteousness**: Gentleness is strength under submission. The Breastplate addresses pride -- the misuse of strength for self-assertion. Both deal with power rightly ordered. The piece that breaks the pride engine is the natural formation pathway for gentleness.
- **self_control → helmet-of-salvation**: Self-control is a mind and body governed by conviction rather than appetite. The Helmet of Salvation is the settled identity that makes that possible -- when you know who you are in Christ, the appetite loses its command. Both operate at the mind-and-will intersection.

Note: `kindness` and `gentleness` both map to `breastplate-of-righteousness`. This is intentional -- both fruits share the same formation root (the pride/shame engine). The recommendation engine will present the same piece for both, which is theologically coherent.

---

## Fruit-to-Rule-of-Life Mapping

**Status: FINALIZED — Phase 2 Architect**

Constant name: `FRUIT_TO_RULE_OF_LIFE`. Lives in `src/utils/formationRecommendation.js`.

This mapping is already encoded in `src/fruitAssessmentData.js` inside the `FRUITS` object as `ruleOfLife: { rhythm, path }`. The constant below is a derived lookup extracted for use in the recommendation engine without importing all of fruitAssessmentData.js. Both must stay in sync.

```js
export const FRUIT_TO_RULE_OF_LIFE = {
  love:         { slug: "community", path: "/rule-of-life/community", label: "Community" },
  joy:          { slug: "presence",  path: "/rule-of-life/presence",  label: "Presence"  },
  peace:        { slug: "prayer",    path: "/rule-of-life/prayer",    label: "Prayer"    },
  patience:     { slug: "sabbath",   path: "/rule-of-life/sabbath",   label: "Sabbath"   },
  kindness:     { slug: "community", path: "/rule-of-life/community", label: "Community" },
  goodness:     { slug: "scripture", path: "/rule-of-life/scripture", label: "Scripture" },
  faithfulness: { slug: "sabbath",   path: "/rule-of-life/sabbath",   label: "Sabbath"   },
  gentleness:   { slug: "community", path: "/rule-of-life/community", label: "Community" },
  self_control: { slug: "presence",  path: "/rule-of-life/presence",  label: "Presence"  },
};
```

### Pairing source

All pairings are sourced directly from `src/fruitAssessmentData.js` FRUITS object `ruleOfLife` entries. These are not new judgments -- they are the existing application-layer decisions, canonicalized here for the recommendation engine. The rationale lives in the fruit formation statements in fruitAssessmentData.js.

---

## Armor Piece Sequence

**Status: FINALIZED — Phase 2 Architect**

Constant name: `ARMOR_PIECE_SEQUENCE`. Lives in `src/utils/formationRecommendation.js`.

Sourced from `PIECE_ORDER` in Identity.jsx (lines 2647-2652).

```js
export const ARMOR_PIECE_SEQUENCE = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];
```

Each armor piece has 6 days of formation content (`isLastDay = day === 6`). A piece is considered complete when day 6 is reached. The recommendation engine checks `profile.armor.completedPieces` to determine whether all 6 are done.

---

## Armor Piece Cross-Links (for Recommendation Engine)

**Status: FINALIZED — Phase 2 Architect**

When all armor pieces are complete, `armor-piece-complete` context falls through to a Rule of Life rhythm recommendation. The mapping below mirrors `CROSS_LINKS` in Identity.jsx (lines 2677-2683), with the breastplate entry added (see gap note below).

```js
export const ARMOR_PIECE_CROSS_LINKS = {
  "belt-of-truth":               { slug: "presence",  path: "/rule-of-life/presence",  label: "Presence"  },
  "breastplate-of-righteousness":{ slug: "prayer",    path: "/rule-of-life/prayer",    label: "Prayer"    },
  "gospel-of-peace":             { slug: "sabbath",   path: "/rule-of-life/sabbath",   label: "Sabbath"   },
  "shield-of-faith":             { slug: "community", path: "/rule-of-life/community", label: "Community" },
  "helmet-of-salvation":         { slug: "scripture", path: "/rule-of-life/scripture", label: "Scripture" },
  "sword-of-the-spirit":         { slug: "scripture", path: "/rule-of-life/scripture", label: "Scripture" },
};
```

### Breastplate-to-Prayer rationale

`breastplate-of-righteousness` maps to `prayer`. The breastplate track centers on shame, identity, and the received righteousness of Christ. Prayer is the rhythm that most directly enacts that identity -- it is the practice of approaching God as someone who belongs there, not as someone who must earn access. The breastplate protects the heart; prayer is the posture that the protected heart makes possible. This pairing is a new judgment, not pulled from existing application data. See gap note below.

---

## Exact Integration Points

**Status: FINALIZED — Phase 2 Architect**

### SevenDayChallenge.jsx

**File:** `src/SevenDayChallenge.jsx`

**Integration location:** Lines 1048-1068. The `{d.n === 7 && (...)}` block contains all Day 7 forward-action content. The entire inner content of this block -- the `<div className="cf7-next-step">` and everything inside it -- should be replaced with `<NextStep context="challenge-complete" className="cf7-next-step" />`.

The `.cf7-next-step` CSS class and its child styles are already defined in `ChallengeStyles()` (lines 566-572). The component should render inside that existing class wrapper to inherit the border, background gradient, and padding.

Specific copy being replaced:
- The "This Is Not The End" eyebrow label (line 1050)
- The three-paragraph body block (lines 1051-1055)
- The "Return to the Challenge" CTA Link pointing to `CHALLENGE_BASE` (lines 1056-1061)
- The secondary "Begin the Armor of God" paragraph and link (lines 1062-1067)

The `<NextStep>` component replaces all of that. The outer `{d.n === 7 && (...)}` conditional wrapper stays.

---

### FruitAssessment.jsx

**File:** `src/FruitAssessment.jsx`

**Integration location:** Lines 880-883. The `{/* Rule of Life crosslink */}` block currently renders `<RuleOfLifeLink fruit={fruit} />` inside a `div` with `marginTop: 48, textAlign: "center"`.

The `RuleOfLifeLink` component (lines 1591-1602) renders a single text link: "This connects to the [Rhythm] rhythm in your Rule of Life →"

This block should be replaced with `<NextStep context="assessment-complete" />` positioned in the same location. The existing `RuleOfLifeLink` component and its wrapper div are removed entirely.

Note: the existing link is static per-fruit copy driven by `fruit.ruleOfLife.path`. The `<NextStep>` component instead reads `profile.assessment.formationEdge[0]` to derive the recommendation dynamically from the stored profile, which is the correct behavior because the results screen can be revisited after the profile has been updated.

---

### Identity.jsx

**File:** `src/Identity.jsx`

**Integration point A -- armor piece Day 6 completion:**

Lines 3229-3249. At the end of the `ArmorPiecePage`, when `isLastDay` is true (day === 6), the mobile floating bar renders a `<Link to={nextSlug ? '/identity/${nextSlug}' : '/identity'}>` with text `{nextSlug ? "Next Piece →" : "← Identity"}`.

This is a minimal CTA inside the mobile floating bar -- it handles forward navigation but does not present a completion moment or a contextual recommendation. The `<NextStep context="armor-piece-complete" pieceSlug={piece} />` should be inserted in the main content column above the `{/* Bottom navigation */}` section (line 3122), conditional on `isLastDay`. Specifically, insert after the `<FormationShareable>` block (lines 3069-3074) and before the closing of `cf7-dev-left` (or its equivalent in the main content area). The mobile floating bar Link behavior is preserved as-is.

**Integration point B -- CROSS_LINKS gap (Breastplate of Righteousness):**

Lines 2677-2683. The `CROSS_LINKS` object is missing the `"breastplate-of-righteousness"` entry entirely. `CrossLinkCard({ piece })` returns `null` when it receives `piece === "breastplate-of-righteousness"` (line 2686-2687 guard: `if (!link) return null`). This means every user who enters the Breastplate track sees no "Connected Rhythm" card in the sidebar.

Current state:
```js
const CROSS_LINKS = {
  "belt-of-truth":       { to: "/rule-of-life/presence",  rhythm: "PRESENCE",  tagline: "Attention before God" },
  // "breastplate-of-righteousness" IS ABSENT
  "gospel-of-peace":     { to: "/rule-of-life/sabbath",   rhythm: "SABBATH",   tagline: "Rest before production" },
  "shield-of-faith":     { to: "/rule-of-life/community", rhythm: "COMMUNITY", tagline: "Formation together" },
  "helmet-of-salvation": { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
  "sword-of-the-spirit": { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
};
```

What it should be:
```js
const CROSS_LINKS = {
  "belt-of-truth":               { to: "/rule-of-life/presence",  rhythm: "PRESENCE",  tagline: "Attention before God"    },
  "breastplate-of-righteousness":{ to: "/rule-of-life/prayer",    rhythm: "PRAYER",    tagline: "Dependence before action" },
  "gospel-of-peace":             { to: "/rule-of-life/sabbath",   rhythm: "SABBATH",   tagline: "Rest before production"  },
  "shield-of-faith":             { to: "/rule-of-life/community", rhythm: "COMMUNITY", tagline: "Formation together"      },
  "helmet-of-salvation":         { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise"      },
  "sword-of-the-spirit":         { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise"      },
};
```

This is a bug fix, not a new feature. The integrator who adds `<NextStep>` to the armor piece page should fix this in the same pass.

---

### FieldGuide.jsx

**File:** `src/FieldGuide.jsx`

**Integration location:** Lines 611-634. The `FGOffice` component renders a `fg-return-panel` block after each day's content. When `next` is null (i.e., the user has completed Day 7), the primary CTA is `<Link className="fg-btn-prim" to={\`${BASE}/path\`}>Complete — View Full Path →</Link>` (line 621).

There is no dedicated "completion" moment -- Day 7 flows into the same return panel as all other days, just with a different primary button. The `<NextStep context="field-guide-complete" />` should be inserted after the `fg-return-panel` closing div (after line 635) when `!next` is true (Day 7 only). The existing return panel remains intact for all days; the NextStep card appears beneath it on Day 7 only.

The conditional wrapper: `{!next && <NextStep context="field-guide-complete" />}` inserted at line 636.

---

## DevotionGuide Onboarding State Machine

**Status: FINALIZED — Phase 3 Architect**

`DevotionOnboarding` is a controlled multi-step form. No URL routing between steps. The component owns its step state internally and writes to the profile only once, at the `complete` transition.

### States

| State        | What renders                                                                         | Transition trigger                                              |
|--------------|---------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| `idle`       | Intro panel: "Before we begin, tell us a little about where you are." + start button | Click "Begin" → `question-1`                                    |
| `question-1` | Q1: formation focus (9-option fruit grid)                                            | Select a fruit → store local answer → advance to `question-2`   |
| `question-2` | Q2: rhythm preference (5-option rhythm grid)                                         | Select a rhythm → store local answer → advance to `question-3`  |
| `question-3` | Q3: intention (free-text textarea + submit button)                                   | Click "Continue" (textarea may be empty) → write profile → `complete` |
| `complete`   | Brief confirmation panel + auto-dismissal                                             | On entering `complete`: call `onComplete()` (props callback)    |

### Questions and answer mapping

**Q1 — Formation focus**
- Prompt: "Which area of inner formation needs the most attention from you right now?"
- Hint: "Choose the one that feels most exposed. You can change this later."
- Options: 9 fruit slugs from `FRUIT_ORDER` (`love`, `joy`, `peace`, `patience`, `kindness`, `goodness`, `faithfulness`, `gentleness`, `self_control`). Display label uses the canonical `FRUITS[slug].label` ("Self-Control" for `self_control`, etc.). Local source: import `FRUIT_ORDER` and `FRUITS` from `../fruitAssessmentData`.
- Stored to profile at `complete`: `profile.onboarding.formationFocus` (fruit slug) AND `profile.assessment.formationEdge = [chosenFruitSlug]` (single-element array, mirrors a real assessment so the recommendation engine and context envelope work).

**Q2 — Rhythm preference**
- Prompt: "Which rhythm of life feels most missing for you right now?"
- Hint: "The one whose absence you notice most."
- Options: 5 rhythm slugs from the Rule of Life: `presence`, `prayer`, `sabbath`, `community`, `scripture`. Display labels: "Presence", "Prayer", "Sabbath", "Community", "Scripture".
- Stored to profile at `complete`: `profile.onboarding.rhythmPreference` (rhythm slug).

**Q3 — Intention**
- Prompt: "What are you hoping the next season of formation looks like?"
- Hint: "A sentence is enough. This is for you — the agent will reference it as it shapes your devotions."
- Input: a single `<textarea>`, rows=4, optional (empty submit is allowed).
- Stored to profile at `complete`: `profile.onboarding.intention` (string, may be empty).

### New schema field: `profile.onboarding`

A new top-level object is introduced. Because the profile uses deep-merge writes (`updateProfile`), pre-existing profiles without the field will simply gain it on first onboarding write — no migration needed. Default-profile callers that read `profile.onboarding` must use optional chaining; absence is equivalent to "onboarding not done."

```ts
interface OnboardingState {
  completedAt:        string | null;   // ISO 8601, written on `complete` transition
  formationFocus:     string | null;   // fruit slug from Q1
  rhythmPreference:   string | null;   // rhythm slug from Q2
  intention:          string;          // free text from Q3, default ""
}
```

The `DEFAULT_PROFILE` constant in `useFormationProfile.jsx` should be updated to include:

```js
onboarding: {
  completedAt:      null,
  formationFocus:   null,
  rhythmPreference: null,
  intention:        "",
},
```

This is a non-breaking addition. The schema `_version` stays at 1.

---

## DevotionEntry Schema (history)

**Status: FINALIZED — Phase 3 Architect**

Supersedes the stub `{ date, content }` in the Formation Profile Schema section above.

```ts
type DevotionEntry = {
  generatedAt:  string;     // ISO 8601 — when entry was created
  passage:      string;     // form input "Scripture Reference", may be empty
  theme:        string;     // form input "Devotion Theme", may be empty
  bigIdea:      string;     // form input "Subject, Topic, or Question", may be empty
  summary:      string;     // first 200 chars of generated content, trimmed
};
```

All fields are required (always present on every entry). Empty strings are valid for `passage`, `theme`, `bigIdea`, and `summary`. The `summary` is derived from the generated text: `text.slice(0, 200).trim()`; if `text` is empty, `summary` is `""`.

`profile.widgets.devotions` is an array of `DevotionEntry`, most-recent first, capped at 10 entries (oldest dropped when capacity is reached) to keep localStorage bounded.

The `FormationProfile` interface's nested `DevotionEntry` stub (lines 100-103 in this file) is now obsolete and superseded by this section. Any consumer reading entries should use the schema defined here.

---

## Devotion Context Envelope

**Status: FINALIZED — Phase 3 Architect**

The shape of the object the DevotionGuide POSTs to `/api/generate` expands from `{ passage, theme, bigIdea }` to:

```ts
type DevotionContext = {
  formationEdge:       string[];          // fruit slugs (lowest-scoring or onboarded focus); empty array when unset
  currentArmorPiece:   string | null;     // armor piece slug or null
  currentArmorDay:     number | null;     // 1–6 or null
  challengeComplete:   boolean;           // true if 7-day challenge fully complete
  recentArrowLog:      string[];          // up to 3 most-recent `lie` strings, newest first; empty array when none
  recentDeclaration:   string | null;     // first non-empty declaration, or null
};

type GenerateRequest = {
  passage:  string;
  theme:    string;
  bigIdea:  string;
  profile:  DevotionContext;   // always present, even if all fields are empty/null
};
```

### Field derivation from `FormationProfile`

| Field                | Source / derivation                                                                                                                                                                                                                                                                                                                                                                  |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `formationEdge`      | `profile.assessment?.formationEdge ?? []`. Returned as-is (array of fruit slugs). Empty array when unset.                                                                                                                                                                                                                                                                            |
| `currentArmorPiece`  | Scan `ARMOR_PIECE_SEQUENCE` in **reverse** order. Return the first slug `s` where `(profile.armor?.progress?.[s] ?? []).length > 0`. If none, return `null`. This intentionally picks the latest piece the user has touched — a finished piece still "lights up" until they start the next one.                                                                                       |
| `currentArmorDay`    | If `currentArmorPiece` is `null`, return `null`. Otherwise: `Math.min(6, Math.max(...progress[currentArmorPiece]))`. Returns the most-recently-completed day number (1–6). Conceptually: "where the user last stood inside that piece."                                                                                                                                                |
| `challengeComplete`  | `(profile.challenge?.completedDays ?? []).length >= 7`.                                                                                                                                                                                                                                                                                                                              |
| `recentArrowLog`     | Read `profile.widgets?.arrowLog ?? []`. Sort by `timestamp` descending. Take first 3. Map to `entry.lie`. Filter out empty strings. Default `[]`.                                                                                                                                                                                                                                     |
| `recentDeclaration`  | Read `profile.widgets?.declarations ?? []`. Find the first element whose `.trim()` is non-empty. Return that trimmed string. If none, return `null`.                                                                                                                                                                                                                                  |

### Null safety contract

`buildDevotionContext(profile)` must be **total** — it must return a valid `DevotionContext` object for any input, including:
- `null` / `undefined` (returns the all-defaults envelope: empty arrays, null values, `challengeComplete: false`)
- A partial profile missing `widgets`, `armor`, `assessment`, `challenge`, etc.
- A profile where arrays are present but empty.

The function may **not** throw under any condition. All field reads use optional chaining with explicit defaults.

### Default-empty envelope

```js
{
  formationEdge: [],
  currentArmorPiece: null,
  currentArmorDay: null,
  challengeComplete: false,
  recentArrowLog: [],
  recentDeclaration: null,
}
```

This is what `buildDevotionContext(null)` (or `buildDevotionContext(undefined)`) must return.

---

## DevotionGuide Component Modes

**Status: FINALIZED — Phase 3 Architect**

DevotionGuide renders in exactly one of three modes at any time. Mode is computed once, on mount and on profile change, from the loaded profile.

| Mode             | Selection criteria (evaluated in order)                                                                              | What renders                                                                                                                              |
|------------------|----------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `onboarding`     | `assessment.completedAt` is null AND `onboarding.completedAt` is null AND `widgets.devotions.length === 0`           | `<DevotionOnboarding onComplete={...}/>` replaces the input card and feature cards. Nav, hero, footer remain.                              |
| `returning`      | `widgets.devotions.length > 0`                                                                                       | `<DevotionHistory />` rendered above the input card. Context indicator shown. Form + feature cards + result section unchanged.            |
| `first-devotion` | All other cases (has assessment OR has completed onboarding, but no prior devotions)                                  | Input card + context indicator shown. No history panel. Feature cards + result section unchanged.                                          |

### Mode-selection logic

```js
function selectMode(profile) {
  if (!profile) return null;                                          // still loading
  const devotions = profile.widgets?.devotions ?? [];
  if (devotions.length > 0) return "returning";
  const hasAssessment = !!profile.assessment?.completedAt;
  const hasOnboarding = !!profile.onboarding?.completedAt;
  if (!hasAssessment && !hasOnboarding) return "onboarding";
  return "first-devotion";
}
```

Component must gate on `isLoaded` before computing mode. Until `isLoaded === true`, render the nav + hero + a neutral placeholder (or null inside `main`) so the page does not flicker between modes.

### Onboarding completion handoff

When `DevotionOnboarding` calls its `onComplete` prop, the DevotionGuide host recomputes mode. Because the onboarding write sets `profile.onboarding.completedAt` (and `assessment.formationEdge`), the next render naturally drops to `first-devotion` mode (no devotions yet, but onboarding is now complete).

The `onComplete` handler in DevotionGuide is just `() => { /* state.update triggers re-render; mode recomputes */ }`. Optionally, it can also force-scroll back to the top of the form for a clean handoff.

### Context indicator (`first-devotion` and `returning`)

A small text line shown directly under the "Build today's guide" eyebrow inside the input card. Format:

> Forming around: **patience**, **gentleness**, **self-control**

Source: `profile.assessment.formationEdge`. If `formationEdge` is empty, the indicator is omitted entirely (no fallback copy). Fruit slugs are mapped to display labels using the same `FRUITS[slug].label` source as the onboarding component (lowercase: e.g. `self_control` → "self-control" for the indicator copy). The indicator never appears in `onboarding` mode.

---

## DevotionGuide Profile Writes

**Status: FINALIZED — Phase 3 Architect**

Phase 3 adds exactly two new `updateProfile()` call sites:

### Write A — Onboarding completion

Called inside `DevotionOnboarding` when the Q3 textarea is submitted (regardless of whether it is empty).

```js
updateProfile({
  onboarding: {
    completedAt:      new Date().toISOString(),
    formationFocus:   q1Answer,        // fruit slug, validated against FRUIT_ORDER
    rhythmPreference: q2Answer,        // rhythm slug, validated against ["presence","prayer","sabbath","community","scripture"]
    intention:        q3Answer ?? "",  // free text; empty string allowed
  },
  assessment: {
    formationEdge: [q1Answer],         // mirror onboarding focus into the canonical edge field
  },
});
```

Then call `props.onComplete()` synchronously after the write returns. The host re-derives mode on the next render.

### Write B — Devotion history entry

Called inside DevotionGuide.jsx immediately after a successful `/api/generate` response (after `setDevotional(text)` on line 250). Does **not** run for the share-link branch (URL `?id=…` path), which is a load not a generation.

```js
const summary = (text ?? "").slice(0, 200).trim();
const newEntry = {
  generatedAt: new Date().toISOString(),
  passage,
  theme,
  bigIdea,
  summary,
};
const prior = profile.widgets?.devotions ?? [];
updateProfile({
  widgets: {
    devotions: [newEntry, ...prior].slice(0, 10),  // newest first, cap at 10
  },
});
```

Capacity cap of 10 keeps localStorage bounded under continued use. History panel reads only the first 3.

---

## DevotionGuide Integration Points

**Status: FINALIZED — Phase 3 Architect**

All integration touches `src/DevotionGuide.jsx`. Phase 3 does not modify NextStep, formationRecommendation, or any other Phase 1/2 file.

### Imports (top of file, after line 4)

```js
import { useFormationProfile } from "./hooks/useFormationProfile";
import { buildDevotionContext } from "./utils/devotionContext";
import DevotionOnboarding from "./components/DevotionOnboarding";
import DevotionHistory from "./components/DevotionHistory";
```

### Hook + mode state (inside component body, after the existing `useState` calls around line 204)

```js
const { profile, updateProfile, isLoaded } = useFormationProfile();
const mode = selectMode(profile);   // helper defined inline above the component or imported
```

`selectMode` is the helper from the Component Modes section. Define it as a local file-scope `function selectMode(profile) { ... }` above the component, since it has no closure dependencies.

### Fetch body construction (currently line 243)

Replace:
```js
body: JSON.stringify({ passage, theme, bigIdea }),
```
With:
```js
body: JSON.stringify({ passage, theme, bigIdea, profile: buildDevotionContext(profile) }),
```

### History write (after line 250, inside the `try` block)

Insert the Write B block from the Profile Writes section immediately after `setDevotional(text);`. The block reads `profile` from the hook closure and calls `updateProfile`.

### Onboarding gate (around line 398, the start of `<main>`)

Wrap the existing input card + feature cards + result block. Specifically:
- If `!isLoaded` → render `<main>` with a minimal placeholder (a centered "Loading…" or just `null`) and skip the rest of the JSX inside `<main>`.
- If `isLoaded && mode === "onboarding"` → render `<main>` containing `<DevotionOnboarding onComplete={() => { /* re-render triggers via profile change */ }} />` and skip the input card + feature cards + result section.
- Otherwise → render the existing input card + feature cards + result section as today, plus the additions below.

### History panel placement (returning mode only)

Insert `{mode === "returning" && <DevotionHistory />}` inside `<main>` immediately before the existing input card div (currently line 401). The history panel renders its own collapsible wrapper; no extra spacing needed.

### Context indicator placement (`first-devotion` and `returning`)

Inside the input card, directly after the "Build today's guide" header block (currently line 437, before the `<div style={{ display: "flex", flexDirection: "column", gap: 28 }}>`), conditionally insert:

```jsx
{mode !== "onboarding" && profile.assessment?.formationEdge?.length > 0 && (
  <ContextIndicator slugs={profile.assessment.formationEdge} />
)}
```

`ContextIndicator` is a small local sub-component in DevotionGuide.jsx (similar in scope to `FieldInput`) that renders the "Forming around: …" line in the existing visual language (Barlow eyebrow + Cormorant body).

### Assumptions

1. The share-link load path (`?id=…` query param, lines 206-223) does **not** write to history. Only direct generations from the form count.
2. `selectMode` runs on every render but is cheap (pure computation over loaded profile). No memoization required.
3. Adding `profile.onboarding` to `DEFAULT_PROFILE` is in-scope for Phase 3 (a one-line additive change to `useFormationProfile.jsx`), since the onboarding contract requires it.
4. The `DevotionEntry` stub in the `FormationProfile` interface (this file, lines 100-103) is now superseded; the live type is the one defined in the "DevotionEntry Schema (history)" section above. No code change in the interface block is required because the stub is documentation-only.

---

## Primitive Component APIs

**Status: PENDING — Phase 4 Architect will define**

---

## CSS Token Names

**Status: PENDING — Phase 4 Architect will define**

---

## Content JSON Schemas

**Status: PENDING — Phase 5 Architect will define**
