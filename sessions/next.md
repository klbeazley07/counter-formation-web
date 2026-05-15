# Counter Formation Build — Phase 5: Content Layer
**Session type:** Build
**Depends on:** Phase 1 only. Independent of Phases 2, 3, 4.

---

## Context (read this first)

Right now, every piece of formation content on the site (armor piece copy, rule-of-life rhythm copy, field guide day text, devotion guide examples) lives inline in JSX files. Editing one line of copy requires opening a 2000-line component file. Adding a new day to the Field Guide path requires JSX surgery. There is no separation between content and presentation.

Phase 5 extracts content into JSON files under `src/content/`, builds a typed loader, and refactors the section pages to read from the loader instead of hard-coded strings. This unblocks (a) future content updates by non-developers (or by Claude in single-file edits), (b) eventual CMS integration if desired, (c) content-driven new-piece additions without code changes.

The spec is at `specs/spec-site-enhancement-2026.md` (Theme 5). The build methodology is at `specs/spec-build-architecture.md`. Follow the same Contract → Build → Refactor → Review → Wrap structure.

---

## Read these files before doing anything else

1. `sessions/state.md` — phase checklist; Phase 4 deferred items
2. `sessions/contracts.md` — finalized contracts from Phases 1–4
3. `specs/spec-site-enhancement-2026.md` — Theme 5 section
4. `specs/spec-build-architecture.md` — Phase 5 agent map

---

## What was built in earlier phases (do not re-derive)

- **Phase 1:** `useFormationProfile` hook + provider + migration. All section/widget files write through the profile.
- **Phase 2:** `NextStep.jsx` + `formationRecommendation.js`. Live at four transition moments.
- **Phase 3:** `DevotionOnboarding.jsx`, `DevotionHistory.jsx`, `devotionContext.js`. `DevotionGuide.jsx` is now stateful with mode selection, context threading, history write, and onboarding gate.
- **Phase 4:** `tokens.css` + 6 primitives + `WidgetFrame`. All six widget files refactored. Tailwind config extends to CSS variables.

These are all in service. Phase 5 should not change their behavior.

---

## What this session builds

**Files to create:**
- `src/content/armor.json` — full content for all six armor pieces (label, slug, days array with title/scripture/reflection/practice/declaration for each of 6 days)
- `src/content/rule-of-life.json` — all five rhythms (presence, prayer, sabbath, community, scripture) with rationale, daily expression, weekly expression, and seasonal expression
- `src/content/field-guide.json` — Scripture Before Scroll 7-day path with day title, prompt, scripture, reflection, practice
- `src/content/fruits.json` (optional refactor) — extract `FRUITS` data from `fruitAssessmentData.js` so all FRUIT content lives in one JSON file
- `src/content/loader.js` — typed loader utility: `getArmorPiece(slug)`, `getAllArmorPieces()`, `getRhythm(slug)`, `getFieldGuideDay(n)`, etc.
- `src/content/schema.js` (optional) — runtime schema validation using a tiny hand-rolled validator (avoid adding zod as a dep)

**Files to modify:**
- `src/Identity.jsx` — replace inline `PIECES` data with `getAllArmorPieces()` loader call
- `src/RuleOfLife.jsx` — replace inline rhythm data with `getRhythm(slug)`
- `src/FieldGuide.jsx` — replace inline `DAYS` data with `getFieldGuideDay(n)` / `getFieldGuidePath()`
- `src/fruitAssessmentData.js` — if fruits.json refactor is done, this file imports FRUITS from JSON; otherwise unchanged

**Files that do not change this session:**
- All Phase 1, 2, 3, 4 files (hook, migration, NextStep, recommendation engine, DevotionGuide + onboarding/history/context, tokens.css, primitives, WidgetFrame, refactored widgets)
- Routing, navigation, layout files
- All widget files
- Newsletter capture forms (still deferred from Phase 4)

---

## Stage 1: Architect (run first, before any builders)

Spawn an Architect agent (or do inline if scope is manageable) with this task:

> Audit the inline content data structures in `src/Identity.jsx` (the `PIECES` array around line 2700+), `src/RuleOfLife.jsx` (the rhythm definitions), `src/FieldGuide.jsx` (the `DAYS` array), and `src/fruitAssessmentData.js` (`FRUITS` object). Map each shape and document it.
>
> Define and write to `sessions/contracts.md` under the existing PENDING "Content JSON Schemas" section:
>
> 1. **ArmorPiece schema** — slug, label, scripture (book/chapter/verse), opening narrative, six day objects each with title/scripture/reflection/practice/declaration. State whether the `CROSS_LINKS` mapping (Phase 2 contract) is included in the piece JSON or stays as a separate `armor-cross-links.json`.
>
> 2. **Rhythm schema** — slug, label, rationale paragraph, daily/weekly/seasonal expressions, connected armor pieces. Mirror the existing `RULE_OF_LIFE` / armor cross-link data shape.
>
> 3. **FieldGuideDay schema** — day number, title, scripture reference + text, reflection prose, practice instruction. Day 7 special handling (it triggers the `NextStep` block from Phase 2).
>
> 4. **Fruit schema** — match the existing `FRUITS[slug]` object shape from fruitAssessmentData.js: key, label, greek, formationStatement, recognitionStatement, secondaryFormationStatement, scripture {text, reference}, practice, ruleOfLife {rhythm, path}.
>
> 5. **Loader API** — function signatures for `getArmorPiece(slug)`, `getAllArmorPieces()`, `getRhythm(slug)`, `getAllRhythms()`, `getFieldGuideDay(n)`, `getFieldGuidePath()`, `getFruit(slug)`, `getAllFruits()`. Return types for each. Behavior when slug/day is unknown.
>
> 6. **Validation strategy** — runtime check on load (dev-only, fails loudly if schema mismatch) vs build-time check vs none. Recommend the simplest workable approach. No new dependencies unless absolutely required.
>
> Do not write implementation code. State any assumptions.

---

## Stage 2: Content extraction + loader

Two parallel builders:

**Builder A — Content JSON files:**
> Read sessions/contracts.md (Phase 5 content schemas). Extract the inline data from `src/Identity.jsx`, `src/RuleOfLife.jsx`, `src/FieldGuide.jsx`, and (optionally) `src/fruitAssessmentData.js` into `src/content/*.json` files exactly per the schemas. Preserve every word of copy verbatim. Do not summarize. Return a summary including the number of armor pieces, rhythms, and days extracted.

**Builder B — Loader utility:**
> Read sessions/contracts.md. Implement `src/content/loader.js` per the contracted API. Use ES module imports of the JSON files. Throw a clear error (in dev only — silent fallback in prod) if a requested slug/day is not found. Return a summary.

---

## Stage 3: Section page refactors

Three parallel refactor agents (Identity, RuleOfLife, FieldGuide). For each:

> Read sessions/contracts.md (Loader API section). Read the corresponding section file (`src/Identity.jsx` / `src/RuleOfLife.jsx` / `src/FieldGuide.jsx`). Replace the inline data array/object with a call to the loader. Preserve all rendering behavior. Do not touch widget integrations, NextStep wiring, formation profile reads, or anything else. Return a diff summary.

---

## Stage 4: Review

Spawn a Reviewer agent:

> The following files were created or modified this session: [list]. Read each file. Compare against sessions/contracts.md.
>
> 1. Verify every armor piece, rhythm, and field guide day from the inline source is present in the JSON files (no content lost).
> 2. Verify the loader returns the same shape that the inline data had (so component code can be a near-1:1 replacement).
> 3. Verify section pages no longer carry inline content arrays (only loader calls).
> 4. Verify NextStep / recommendation engine / profile hooks are untouched.
>
> Do not fix issues. Report them with file and line numbers. Return a clean/issues list.

Fix any issues flagged before proceeding.

---

## Stage 5: Build verification and session wrap

Run:
```bash
npm run build
```

If the build fails, fix the errors before closing the session. Recommend Luke do a visual click-through of armor pages, rhythm pages, and the Field Guide 7-day path before considering Phase 5 fully landed.

When the build passes:

**Update sessions/state.md:**
- Mark Phase 5 as COMPLETE with today's date
- Note any deferred items

**Append to sessions/log.md:**
```
## Session 5 — Phase 5: Content Layer (2026-[date])
**Status:** Complete (visual smoke-test pending)
**Files created:** [list]
**Files modified:** [list]
**Key decisions:** [any deviations from contracts]
**Deferred:** [anything not completed]
```

**Write sessions/next.md** — at this point all five enhancement phases are complete. The next prompt can either (a) cover the deferred items from prior phases (newsletter form refactor, section-page token migration, etc.) or (b) move on to net-new work (CMS integration, Drop 002.5 content sections, community pillar). Recommend option (b) with a prompt sketch for whichever direction Luke wants.

**Commit + push to origin/main** (per the workflow rule established in Session 4).

---

## Acceptance criteria (all must be true to close this session)

- [ ] `src/content/armor.json`, `rule-of-life.json`, `field-guide.json` exist with all source content extracted
- [ ] `src/content/loader.js` exists and exports all contracted functions
- [ ] `src/Identity.jsx`, `src/RuleOfLife.jsx`, `src/FieldGuide.jsx` no longer contain inline content data arrays
- [ ] `npm run build` passes with no errors
- [ ] No content was lost or paraphrased during extraction
- [ ] Phase 1–4 files are untouched in behavior
- [ ] `sessions/state.md`, `sessions/log.md`, `sessions/next.md` are updated
- [ ] Commit pushed to origin/main
