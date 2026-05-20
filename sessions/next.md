# Counter Formation Build -- Next Session

**Last completed:** Session 19 -- Phase 12 (all 8 items) + two production fixes (Devotion Guide scripture links, Arrow Log 502 diagnostic) on 2026-05-20
**Up next:** Phase 13 -- Primitives adoption + accessibility sweep.

Phase 12 closed every mechanical/surgical spec item. The const-C contract test is wired into `prebuild` so the pattern can't sneak back in. All section content is now in `src/content/` JSON. The site is ready for the larger primitives refactor.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 13. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push after each file. Update sessions/log.md and sessions/next.md.
```

---

## Phase 13 -- Primitives + Accessibility sweep

**Goal:** Replace hand-rolled UI patterns across section files with the existing primitives. Bundle the accessibility audit per spec Theme 4.

**Why this is its own phase:** The work touches Identity.jsx (2205 lines, now with a small qr-arrival addition), FruitAssessment.jsx (1670), RuleOfLife.jsx (~700 after Item 4 cleanup), FieldGuide.jsx (475), SevenDayChallenge.jsx (854 after Phase 12 Item 5), and App.jsx. It's a refactor with real risk of breaking visual behavior. Worth doing carefully, file by file, with a build + spot-check after each.

**Recommended pre-flight:** Read `src/components/primitives/` to confirm current Button / EyebrowLabel / SectionHeader / Card / ProgressBar / Input shapes before writing the plan file. Spec Theme 4 may call for new variants that don't exist yet.

**Items in scope:**

1. **Primitive adoption -- Button.** Audit each section file for `<button>` and `<Link>`-styled-as-button. Replace with `<Button variant=...>` from `src/components/primitives/Button.jsx`. Variants needed: primary (gold fill), secondary (outlined), ghost (transparent). Add any missing variants to the primitive first.

2. **Primitive adoption -- EyebrowLabel.** Many section files have inline `<span className="...uppercase tracking-...">EYEBROW</span>`. Replace with `<EyebrowLabel>EYEBROW</EyebrowLabel>`. This is the highest-frequency primitive; biggest line-count reduction.

3. **Primitive adoption -- SectionHeader.** Each section opens with eyebrow + display title + optional subtitle. Replace with `<SectionHeader eyebrow=... title=... subtitle=... />`.

4. **Primitive adoption -- Card.** The dark container with optional gold top border hairline appears repeatedly. Replace with `<Card padded>...`.

5. **Primitive adoption -- ProgressBar.** Identity piece pages, Rule of Life, 7-Day Challenge all have a thin gold progress bar. Use the primitive.

6. **Primitive adoption -- Input.** All three newsletter capture forms (homepage hero, footer, EmailCapture component) should use the Input primitive. Email focus/blur behavior centralized.

7. **Decorative image audit.** 25 files have `alt=""`. For each: keep `alt=""` if purely decorative AND add `role="presentation"`. If meaningful for formation context, write a descriptive alt.

8. **Section-level ARIA pass.** Nav, modals, accordions in Field Guide, scroll-arc toggles in Identity, the slidebar in App.jsx, the QR welcome modal in Identity. Each interactive element gets `role`, `aria-label`, `aria-expanded` as appropriate.

**Methodology:** One section file at a time. Visual diff via dev server after each file (or manual spot-check). Avoid bundle-everything commits -- per-file commits keep regressions traceable.

**Acceptance for Phase 13:**
- Identity.jsx under 1500 lines (stretch: under 1000).
- SevenDayChallenge.jsx under 350 lines (also requires the ChallengeStyles template-literal CSS to be extracted -- see "Possible Phase 13 add-on" below).
- All `<button>` elements in section files routed through the Button primitive.
- All eyebrow labels through EyebrowLabel.
- Zero `alt=""` without an accompanying `role="presentation"`.
- Build passes; no visual regressions on the golden path (home → 7DC → Identity → FruitAssessment → RuleOfLife → FieldGuide → DevotionGuide).

---

## Possible Phase 13 add-on -- SevenDayChallenge styles extraction

Phase 12 extracted DAYS + DAY_META to JSON but left the `ChallengeStyles` template-literal CSS block (~600 lines, exported and rendered via `<ChallengeStyles />` inside App.jsx). That extraction mirrors the FG_CSS/FA_CSS/DG_CSS work from Phases 10-11: move the string content to `src/styles/challenge.css` and add a Vite CSS import at the top of SevenDayChallenge.jsx. Removes the `<ChallengeStyles />` JSX usage and the named export.

If you want SevenDayChallenge.jsx to actually hit the spec's <350-line target, this extraction is the path to it. If you don't, skip it -- it's not technically in the Phase 13 spec.

---

## Carry-overs (still open, manual)

- **iOS Safari device test.** Manual. Test (a) magic-link end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Log pass/fail.
- **GEMINI_API_KEY removal from Cloudflare Pages env.** Manual dashboard step.
- **Arrow Log 502 follow-up.** The robust-JSON fix went out in Session 19. If the 502 persists despite the new `extractJson()`, the most likely remaining cause is upstream Anthropic 5xx (overloaded). Consider migrating arrow-log.js to Claude's tool use API for true structured output -- much more reliable than prompt-based JSON. The function already retries once on non-400/401; longer backoff might help on bursty days.

---

## Session methodology (unchanged)

1. **Read state.** `sessions/next.md`, active plan file, top of `sessions/log.md`, `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list. Mark item 1 `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass after each item (prebuild now runs `lint:tokens` -- the const-C contract test).
5. **Commit + push + handoff.** Per-task commits preferred. Update log.md + next.md before push.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID`. `GEMINI_API_KEY` unused and should be removed.
- `cf:profile` schema currently v5 (bumped in Session 19, Phase 12 Item 2). Phase 13 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`. All section CSS except SevenDayChallenge is now static (no `<style>{TEMPLATE}</style>` in components).
- All `const C` palette constants have been removed from src/. `npm run lint:tokens` enforces this. New code should reference tokens via `var(--cf-*)` or use the primitives.
- Content layer: `src/content/` now contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json (with new `connectedArmor` per rhythm), fruits.json, loader.js, `challenge/days.json` (new -- 7DC content + dayMeta), `assessment/fruit-questions.json` (new -- scaleOptions, clusterThreshold, questions). `src/fruitAssessmentData.js` is deleted; all consumers import from `src/content/loader.js`.
