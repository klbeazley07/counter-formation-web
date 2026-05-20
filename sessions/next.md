# Counter Formation Build -- Next Session

**Last completed:** Session 18 -- Phase 11 (const C final batch + DG_CSS extraction) on 2026-05-20
**Up next:** Phase 12 -- spec close-out (mechanical pass), then Phase 13 -- primitives + accessibility sweep.

A full audit was run on 2026-05-20 against `specs/spec-site-enhancement-2026.md`. Themes 1, 2, 3 are substantially complete. Theme 5 has two extractions remaining. Theme 4 has tokens + primitives in place but adoption is widget-only -- section files still hand-roll buttons, eyebrows, headers. Phase 12 closes everything mechanical. Phase 13 takes on the larger primitives + accessibility refactor.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 12. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Phase 12 -- Spec close-out (mechanical pass)

**Goal:** Close every small/surgical spec item in one session so Phase 13 can focus entirely on primitives + accessibility.

**Items in scope:**

1. **Theme 1 -- migrate `cf-challenge-progress` legacy read.** [src/FruitAssessment.jsx:744](src/FruitAssessment.jsx#L744). Replace with a `profile.challenge.completedDays.length > 0` check from `useFormationProfile`.

2. **Theme 1 -- migrate `cf_books` legacy storage.** [src/RuleOfLife.jsx:41](src/RuleOfLife.jsx#L41). Move to `profile.ruleOfLife.bookmarks` (or similar) inside `useFormationProfile`. Bump schema to v5 with migration from `cf_books`. Update any reader/writer sites in RuleOfLife.

3. **Theme 2 -- wire `context="qr-arrival"`.** Add the case to `src/components/NextStep.jsx`. Trigger from Identity when `?qr=true` is present in the URL (the existing QR welcome modal infrastructure is the integration point -- inspect first to see what's already there). Render a brief "You're wearing this armor" intro state per spec line 151.

4. **Theme 2 -- Connected Armor on rhythm pages.** Add a `connectedArmor` field to each rhythm in `src/content/rule-of-life.json` (presence, scripture, prayer, sabbath, community). Mirror the reverse of `CROSS_LINKS` from Identity.jsx. Render a "Connected Armor" section on the rhythm page in RuleOfLife.jsx that links back to the armor piece.

5. **Theme 5 -- extract SevenDayChallenge DAYS + DAY_META.** [src/SevenDayChallenge.jsx:13,214](src/SevenDayChallenge.jsx#L13). Move both into `src/content/challenge/days.json`. Update the loader (`src/content/loader.js`) to export `getChallengeDays()` and `getChallengeDayMeta()`. Replace inline references in SevenDayChallenge.jsx. Spec target: file under 400 lines (currently 1088).

6. **Theme 5 -- convert fruitAssessmentData.js to JSON.** Move to `src/content/assessment/fruit-questions.json`. The current file exports SCALE_OPTIONS, CLUSTER_THRESHOLD, FRUIT_ORDER, QUESTIONS, FRUITS as constants. JSON can't have constants -- either nest under top-level keys or keep the .js file as a thin re-export wrapper. Prefer the former: one JSON file with all five keys, imported and destructured in the loader. Update all 13+ import sites.

7. **Hygiene -- token contract test.** Add a `scripts/check-no-const-c.sh` (or equivalent in package.json) that greps src/ for `const C = {` and exits 1 if any match. Wire into `prebuild` or a dedicated `lint:tokens` script so CI fails if reintroduced.

8. **Hygiene -- unused token sweep in tokens.css.** For each `--cf-*` var, grep src/ for usage. Remove any with zero references. Likely candidates after const C cleanup: `--cf-gold-glow` (rare), `--cf-ivory-90`, `--cf-ivory-82`, `--cf-ivory-42` -- but verify before deleting.

**Methodology:** Each numbered item is a separate task in TodoWrite. Build after each. Per-task commits in the Phase 10/11 cadence.

**Acceptance for Phase 12:**
- `grep -rn "cf-challenge-progress\|cf_books" src/` returns zero matches in section files (loader/migration utility lines OK).
- `?qr=true` arrival on an armor piece page shows the QR intro state.
- A user on a rhythm page sees the connected armor piece with a link.
- `grep -rn "const DAYS\|const DAY_META" src/SevenDayChallenge.jsx` returns zero matches.
- `src/content/assessment/fruit-questions.json` exists; `src/fruitAssessmentData.js` is gone or is a 1-line re-export shim.
- `npm run build` passes; the const-C contract test runs and passes.

---

## Phase 13 -- Primitives + Accessibility sweep

**Goal:** Replace hand-rolled UI patterns across section files with the existing primitives. Bundle the accessibility audit per spec Theme 4.

**Why this is its own phase:** The work touches Identity.jsx (2205 lines), FruitAssessment.jsx (1670), RuleOfLife.jsx (833), FieldGuide.jsx (475), SevenDayChallenge.jsx (~400 after Phase 12), and App.jsx. It's a refactor with real risk of breaking visual behavior. Worth doing carefully, file by file, with a build + spot-check after each.

**Items in scope:**

1. **Primitive adoption -- Button.** Audit each section file for `<button>` and `<Link>`-styled-as-button. Replace with `<Button variant=...>` from `src/components/primitives/Button.jsx`. Variants needed: primary (gold fill), secondary (outlined), ghost (transparent). Add any missing variants to the primitive first.

2. **Primitive adoption -- EyebrowLabel.** Many section files have inline `<span className="...uppercase tracking-...">EYEBROW</span>`. Replace with `<EyebrowLabel>EYEBROW</EyebrowLabel>`. This is the highest-frequency primitive; biggest line-count reduction.

3. **Primitive adoption -- SectionHeader.** Each section opens with eyebrow + display title + optional subtitle. Replace with `<SectionHeader eyebrow=... title=... subtitle=... />`.

4. **Primitive adoption -- Card.** The dark container with optional gold top border hairline appears repeatedly. Replace with `<Card padded>...`.

5. **Primitive adoption -- ProgressBar.** Identity piece pages, Rule of Life, 7-Day Challenge all have a thin gold progress bar. Use the primitive.

6. **Primitive adoption -- Input.** All three newsletter capture forms (homepage hero, footer, EmailCapture component) should use the Input primitive. Email focus/blur behavior centralized.

7. **Decorative image audit.** 25 files have `alt=""`. For each: keep `alt=""` if purely decorative AND add `role="presentation"`. If meaningful for formation context, write a descriptive alt.

8. **Section-level ARIA pass.** Nav, modals, accordions in Field Guide, scroll-arc toggles in Identity, the slidebar in App.jsx. Each interactive element gets `role`, `aria-label`, `aria-expanded` as appropriate.

**Methodology:** One section file at a time. Visual diff via dev server after each file (or manual spot-check). Avoid bundle-everything PRs -- per-file commits keep regressions traceable.

**Acceptance for Phase 13:**
- Identity.jsx under 1500 lines (stretch: under 1000).
- SevenDayChallenge.jsx under 350 lines.
- All `<button>` elements in section files routed through the Button primitive.
- All eyebrow labels through EyebrowLabel.
- Zero `alt=""` without an accompanying `role="presentation"`.
- Build passes; no visual regressions on the golden path (home → 7DC → Identity → FruitAssessment → RuleOfLife → FieldGuide → DevotionGuide).

---

## Carry-overs (still open, manual)

- **iOS Safari device test.** Manual. Test (a) magic-link end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Log pass/fail.
- **GEMINI_API_KEY removal from Cloudflare Pages env.** Manual dashboard step.
- **Cloudflare 502 on `/api/synthesize`.** Currently passing; if it resurfaces, check the CF Functions tab.

---

## Session methodology (unchanged)

1. **Read state.** `sessions/next.md`, active plan file, top of `sessions/log.md`, `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list. Mark item 1 `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass after each item. Things that can't be agent-tested (iOS, CF dashboard) -- say so explicitly.
5. **Commit + push + handoff.** Per-task commits preferred. Update log.md + next.md before push.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID`. `GEMINI_API_KEY` unused and should be removed.
- `cf:profile` schema currently v4. Phase 12 likely bumps to v5 (cf_books migration). Phase 13 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`. All section CSS is now static (no `<style>{TEMPLATE}</style>` in components).
- All `const C` palette constants have been removed from src/. New code should reference tokens via `var(--cf-*)` or use the primitives.
- Content layer: `src/content/` contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json, fruits.json, loader.js. Phase 12 adds challenge/days.json and assessment/fruit-questions.json.
