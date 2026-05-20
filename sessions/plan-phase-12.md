# Phase 12 -- Spec Close-Out (Mechanical Pass)

**Session 19. Plan written 2026-05-20.**

Goal: close every small/surgical spec item from `specs/spec-site-enhancement-2026.md` so Phase 13 can focus entirely on primitives + accessibility. Per-task commits in the Phase 10/11 cadence. Build after each item.

---

## Item 1 -- Migrate `cf-challenge-progress` legacy read

**File:** `src/FruitAssessment.jsx` line 744.

**Current:** `try { return !!localStorage.getItem("cf-challenge-progress"); } catch { return false; }`

**Change:** Replace with a profile-driven check. `ResultsScreen` does not yet read `useFormationProfile`; the cleanest fix is to compute `has7Day` in the parent (where the profile is already loaded) and pass it as a prop, or to call `useFormationProfile()` inside `ResultsScreen` itself and derive `has7Day = profile?.challenge?.completedDays?.length > 0`. Choose whichever is fewer lines.

**Acceptance:** `grep -n "cf-challenge-progress" src/FruitAssessment.jsx` returns zero matches.

---

## Item 2 -- Migrate `cf_books` legacy storage to profile

**File:** `src/RuleOfLife.jsx`. `getBookProgress()` at line 40-43 reads `cf_books` from localStorage. Set sites need to be located via grep.

**Changes:**
1. Add `bookmarks: {}` (per-author map of book progress) to `DEFAULT_PROFILE.ruleOfLife` in `useFormationProfile.jsx`.
2. Bump `_version` to 5. Add a v4→v5 migration block in the provider's `useEffect` that, if `_version < 5` and `cf_books` exists in localStorage, parses it into `profile.ruleOfLife.bookmarks` and removes the legacy key.
3. Replace `getBookProgress()` reads in `RuleOfLife.jsx` with reads from `profile.ruleOfLife.bookmarks`. Replace any setter with `updateProfile({ ruleOfLife: { bookmarks: ... } })`.

**Note:** Plan file says "schema v5" but `useFormationProfile.jsx` currently has `_version: 4` baked in. The deepMerge + version bump in the provider needs the same logic the v3→v4 step uses today.

**Acceptance:** `grep -n "cf_books" src/RuleOfLife.jsx` returns zero matches. Profile in localStorage after first load has `_version: 5` and `ruleOfLife.bookmarks`.

---

## Item 3 -- Wire `context="qr-arrival"` in NextStep

**Changes:**
1. Open `src/utils/formationRecommendation.js`. Add a `case "qr-arrival"` returning a brief intro recommendation (description, destination, label) per spec line 151. The destination is the armor piece page itself (passing through `pieceSlug`).
2. Inspect `Identity.jsx` for the existing QR welcome modal infrastructure -- this already exists, per the spec. The integration is: when `?qr=true` is present on URL, render `<NextStep context="qr-arrival" pieceSlug={...} />` in the armor piece page, before or beneath the existing modal.

**Acceptance:** Visiting `/identity/<piece>?qr=true` shows the QR intro state from NextStep. Visiting without `?qr=true` does not.

---

## Item 4 -- Connected Armor on rhythm pages

**Changes:**
1. Open `src/Identity.jsx` and locate `CROSS_LINKS` -- the armor-to-rhythm map. Build the reverse map (rhythm → armor pieces).
2. Add a `connectedArmor` field to each rhythm in `src/content/rule-of-life.json`. Shape: `{ slug: "shield-of-faith", title: "Shield of Faith", verseTagline: "..." }` or similar minimal shape. Mirror the reverse of `CROSS_LINKS`. Five rhythms total.
3. Render a "Connected Armor" section on the rhythm detail page in `RuleOfLife.jsx`. Link to `/identity/{slug}`. Style consistent with the existing Identity cross-link card.

**Acceptance:** Each rhythm page shows a Connected Armor link.

---

## Item 5 -- Extract SevenDayChallenge DAYS + DAY_META to JSON

**File:** `src/SevenDayChallenge.jsx` lines 13-250 (DAYS + DAY_META blocks).

**Changes:**
1. Create `src/content/challenge/days.json` with shape `{ "days": [...], "dayMeta": {...} }` -- two top-level keys, mirroring the existing constants.
2. Add `getChallengeDays()` and `getChallengeDayMeta()` to `src/content/loader.js`. Import from the new JSON file. Add an `assertCount(value, 7, 'challenge/days.json')` for days.
3. Replace inline `const DAYS = [...]` and `const DAY_META = {...}` in `SevenDayChallenge.jsx` with named imports from the loader.

**Acceptance:** `grep -n "const DAYS\|const DAY_META" src/SevenDayChallenge.jsx` returns zero matches. Build passes. File line count drops noticeably (spec target: under 400 lines; currently 1088).

---

## Item 6 -- Convert fruitAssessmentData.js to JSON

**Changes:**
1. Create `src/content/assessment/fruit-questions.json` with five top-level keys: `scaleOptions`, `clusterThreshold`, `fruitOrder`, `questions`, `fruits` -- mirroring the existing `.js` exports.
2. Add to `src/content/loader.js`: `getFruitQuestions()` returning everything, plus convenience accessors `getScaleOptions()`, `getClusterThreshold()`, `getFruitOrder()`, `getQuestions()`, `getFruits()`, `getFruit(key)`. (Note: a `getFruit(slug)` already exists for `fruits.json` -- distinct content. Use a different name to avoid collision -- `getAssessmentFruit(key)` or fold into the existing one if the data overlaps. Inspect to decide.)
3. Update all import sites:
   - `src/FruitAssessment.jsx` (5 named imports)
   - `src/components/DevotionOnboarding.jsx` (`FRUIT_ORDER`, `FRUITS`)
   - `src/components/field-guide/gifts/FormationPictureView.jsx` (`FRUITS`)
   - `src/components/visualizations/FruitStrata.jsx` (`FRUITS`)
   - `src/DevotionGuide.jsx` (`FRUITS`)
4. Delete `src/fruitAssessmentData.js`.

**Acceptance:** `src/fruitAssessmentData.js` removed. All five import sites updated. Build passes.

---

## Item 7 -- Const-C contract test

**Changes:**
1. Add `scripts/check-no-const-c.mjs` (Node script, since `.sh` is awkward on Windows): walks `src/`, greps for `const C = {`, exits 1 if any matches.
2. Wire into `package.json`: add `"lint:tokens": "node scripts/check-no-const-c.mjs"` and `"prebuild": "npm run lint:tokens"`.

**Acceptance:** `npm run lint:tokens` exits 0 now. Re-adding `const C = {` to a test file fails the script.

---

## Item 8 -- Unused token sweep

**Changes:**
1. Read `src/styles/tokens.css`. List every `--cf-*` var.
2. For each, `grep -rn "var(--cf-NAME)" src/` (also check `${ }` template-literal usage in case any remain).
3. Remove any with zero references. Likely candidates per next.md: `--cf-gold-glow`, `--cf-ivory-90`, `--cf-ivory-82`, `--cf-ivory-42`.

**Acceptance:** Removed vars have zero remaining references in `src/`. Build passes.

---

## Methodology

- One item at a time. Mark in_progress in TodoWrite before starting; mark completed immediately after.
- Build after each item (or after the small ones, batch 2-3 if logically related).
- Per-task commits with `feat:` or `chore:` prefix.
- After Item 8: final build, push to main, log entry, next.md for Phase 13.
