# Counter Formation Build — Phase 4: Design System
**Session type:** Build
**Depends on:** Phase 1 only. Independent of Phases 2 and 3.

---

## Context (read this first)

The brand palette and type pairing are consistent across the site because every developer on this project has been the same person with the same eye. That discipline lives in your head, not in the code. There is no shared token layer. Each section file (App, Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, About, Architecture) and each of the six widgets (Declaration, Examen, PeacePause, FirstFifteen, VerseTracker, ArrowLog) defines its own `gold`, `ivory`, `barlow`, `garamond` constants. Color change requires twelve files. Type change requires the same.

Phase 4 extracts those constants into a token layer, builds a primitive component library, and refactors the six widgets onto a shared `WidgetFrame`. The output should be: one source of truth for color and type, one button implementation, one input implementation, one card implementation, and twelve widget files that are noticeably shorter and easier to read.

The spec is at `specs/spec-site-enhancement-2026.md` (Theme 4). The build methodology is at `specs/spec-build-architecture.md`. Follow the same Contract → Parallel Build → Integration → Review → Wrap structure.

---

## Read these files before doing anything else

1. `sessions/state.md` — phase checklist and deferred items
2. `sessions/contracts.md` — Phase 1, 2, and 3 contracts (FINALIZED), plus PENDING Phase 4 sections at the bottom
3. `specs/spec-site-enhancement-2026.md` — Theme 4 section
4. `specs/spec-build-architecture.md` — Phase 4 agent map and session structure

---

## What was built in earlier phases (do not re-derive)

- **Phase 1:** `useFormationProfile` hook + provider + migration. All section/widget files write through the profile.
- **Phase 2:** `NextStep.jsx` + `formationRecommendation.js`. Live at four transition moments.
- **Phase 3:** `DevotionOnboarding.jsx`, `DevotionHistory.jsx`, `devotionContext.js`. `DevotionGuide.jsx` is now stateful with mode selection, context threading, history write, and onboarding gate.

These are all in service. Phase 4 should not change their behavior. It may refactor their internal styling to use tokens and primitives, but only if it can be done without behavioral change.

---

## What this session builds

**Files to create:**
- `src/styles/tokens.css` — CSS custom properties at `:root` for all brand colors, surface colors, gold variants, radii, and font families
- `src/components/primitives/Button.jsx` — primary, secondary, ghost variants; size and loading props
- `src/components/primitives/Input.jsx` — text and email; controlled component; focus/blur transitions centralized
- `src/components/primitives/Card.jsx` — dark container with optional gold top hairline; `padded` and `children` props
- `src/components/primitives/EyebrowLabel.jsx` — gold uppercase tracking label; text prop only
- `src/components/primitives/ProgressBar.jsx` — thin gold progress indicator; `value` (0–100) and `label` props
- `src/components/primitives/SectionHeader.jsx` — eyebrow + display title + optional subtitle
- `src/components/WidgetFrame.jsx` — shared container for all six formation widgets

**Files to modify (Wave 2 — after primitives ship):**
- `src/widgets/DeclarationWidget.jsx` — wrap in `WidgetFrame`; replace local color/font constants with tokens
- `src/widgets/ExamenWidget.jsx` — same
- `src/widgets/PeacePauseWidget.jsx` — same; preserve the SVG circular progress logic
- `src/widgets/FirstFifteenWidget.jsx` — same; preserve the custom dropdown logic; add keyboard nav (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`)
- `src/widgets/VerseTrackerWidget.jsx` — same
- `src/widgets/ArrowLogWidget.jsx` — same
- `tailwind.config.*` — extend theme to reference the CSS custom properties so Tailwind utilities share the same source of truth
- Newsletter capture forms (find all instances) — refactor to use `<Input>` + `<Button>` primitives

**Files that do not change this session:**
- All Phase 1, 2, 3 files (hook, migration, NextStep, formationRecommendation, DevotionOnboarding, DevotionHistory, devotionContext, DevotionGuide)
- Routing, navigation, layout files (App.jsx routing, SiteNav, SiteFooter, MobileTabBar)
- Section pages outside the widget refactor (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, About, Architecture) — these stay on their current inline constants until Phase 5 or later

---

## Stage 1: Architect (run first, before any builders)

Spawn an Architect agent with this task:

> Read the following files in full: `src/widgets/DeclarationWidget.jsx`, `src/widgets/ExamenWidget.jsx`, `src/widgets/PeacePauseWidget.jsx`, `src/widgets/FirstFifteenWidget.jsx`, `src/widgets/VerseTrackerWidget.jsx`, `src/widgets/ArrowLogWidget.jsx`, `src/App.jsx` (the `C` constants block only), `src/Identity.jsx` (constants block only), `src/RuleOfLife.jsx` (constants block only), `src/FieldGuide.jsx` (constants block only), `src/SevenDayChallenge.jsx` (constants block only), `src/FruitAssessment.jsx` (constants block only), `src/DevotionGuide.jsx` (the `C` constants block). Audit every color, radius, and font family declared at the top of each file.
>
> Define and write to `sessions/contracts.md` under the existing PENDING sections:
>
> 1. **CSS Token Names** — the full list of `:root` custom properties for `tokens.css`. Minimum required: `--cf-obsidian`, `--cf-hero-bg`, `--cf-rule-bg`, `--cf-field-bg`, `--cf-ivory`, `--cf-gold`, `--cf-gold-faint`, `--cf-gold-glow`, `--cf-white-5`, `--cf-white-10`, `--cf-radius-card`, `--cf-radius-pill`, `--cf-font-brand`, `--cf-font-devotional`. Add any additional tokens you find missing from the audit (e.g., card body backgrounds, border colors, muted text rgba values). For each token, document the source file(s) it was extracted from. State whether the existing per-file constant should be deleted, aliased, or kept as a local override.
>
> 2. **Primitive Component APIs** — full JSDoc and prop types for each primitive: `Button`, `Input`, `Card`, `EyebrowLabel`, `ProgressBar`, `SectionHeader`. Include every variant, every default, every accessibility attribute (`role`, `aria-*`). For `Button`, define which existing button patterns (the gold-fill CTA in SevenDayChallenge, the ghost button in DevotionGuide, the pill download button, etc.) each variant replaces.
>
> 3. **WidgetFrame API** — the props and slots (`icon`, `title`, `subtitle`, `actions`, `children`). Define the rendered DOM structure and the class names. Define accessibility expectations: `role="region"`, `aria-labelledby`, focus management. Document which existing per-widget container patterns it replaces.
>
> 4. **Tailwind config extension** — exactly which `theme.extend.colors`, `theme.extend.fontFamily`, and `theme.extend.borderRadius` entries should be added so Tailwind utility classes pull from the same CSS variables. State whether any Tailwind class is currently in use that would break if remapped.
>
> 5. **Widget refactor checklist** — for each of the six widgets, the exact constants to replace (local `gold`, `ivory`, etc. → token), the existing outer container JSX block to remove, and the exact `<WidgetFrame icon={...} title={...} subtitle={...}>` invocation to use. State any widget-specific logic that must remain intact (e.g., PeacePause SVG, FirstFifteen dropdown).
>
> 6. **Newsletter capture locations** — find every `<input type="email">` or newsletter capture form in the codebase (run `grep`). List file + line numbers. State which should be refactored to `<Input>` + `<Button>` and which (if any) are intentionally bespoke.
>
> 7. **Accessibility pass** — per the spec: `role`, `aria-label`, `aria-expanded` on all interactive widget elements; keyboard nav for FirstFifteen dropdown; `aria-label` on PeacePause SVG progress; audit of all decorative `alt=""` images. List each fix with file and line numbers.
>
> Do not write implementation code. State any assumptions.

Do not proceed to Stage 2 until the Architect has written the finalized contracts.

---

## Stage 2: Parallel Builders — Wave 1 (primitives + frame + tokens)

After contracts are finalized, spawn these builders in parallel:

**Builder A — Tokens + Tailwind config:**
> Read `sessions/contracts.md` (CSS Token Names + Tailwind config extension sections). Create `src/styles/tokens.css` exactly per the contract. Update `tailwind.config.*` to extend theme to reference the variables. Import `tokens.css` once at the top of `src/main.jsx` (or wherever the app root entry imports global CSS). Return a summary and a list of files touched.

**Builder B — Button + Input + EyebrowLabel:**
> Read `sessions/contracts.md`. Implement `src/components/primitives/Button.jsx`, `src/components/primitives/Input.jsx`, `src/components/primitives/EyebrowLabel.jsx` per the contracts. Components are functional and use only CSS custom properties (no hex colors). Each component is one file. Match the existing visual language (gold fills, dark surfaces, Barlow/Cormorant fonts). Return a summary of what you built and any deviations from contract.

**Builder C — Card + ProgressBar + SectionHeader:**
> Read `sessions/contracts.md`. Implement `src/components/primitives/Card.jsx`, `src/components/primitives/ProgressBar.jsx`, `src/components/primitives/SectionHeader.jsx` per the contracts. Same constraints as Builder B. Return a summary.

**Builder D — WidgetFrame:**
> Read `sessions/contracts.md`. Implement `src/components/WidgetFrame.jsx` per the contract, including accessibility wiring (`role="region"`, `aria-labelledby` on the heading). Use only tokens, no hex colors. Return a summary.

---

## Stage 2 Wave 1 — Review checkpoint

Before Wave 2 begins, spawn a Reviewer agent:

> Read every file produced by Wave 1: `src/styles/tokens.css`, `tailwind.config.*`, the six primitives, `WidgetFrame.jsx`. Compare against `sessions/contracts.md`.
>
> 1. Verify no raw hex colors anywhere in the new files (all colors must reference CSS variables).
> 2. Verify the variable list in `tokens.css` matches the contract exactly.
> 3. Verify each primitive's prop API matches the contract.
> 4. Verify accessibility wiring in `WidgetFrame` matches the contract.
> 5. Verify Tailwind config extensions resolve to the variables (run a `tailwindcss` build if available).
>
> Do not fix issues. Report them with file and line numbers. Return a clean/issues list.

Fix any issues before proceeding to Wave 2.

---

## Stage 2: Parallel Builders — Wave 2 (widget refactors)

Six parallel refactor agents, one per widget:

> Read `sessions/contracts.md` (Widget refactor checklist). Read `src/widgets/{WIDGET}.jsx`. Refactor:
> 1. Delete the local color/font constants block that maps to tokens (replace with token references).
> 2. Wrap the widget's main rendered output in `<WidgetFrame>` per the contract.
> 3. Replace any newsletter capture forms inside the widget with `<Input>` + `<Button>`.
> 4. Preserve all widget-specific logic (PeacePause SVG, FirstFifteen dropdown, VerseTracker library merge, ArrowLog API enrichment, etc.).
> 5. Add the accessibility fixes from the contract.
>
> Do not change the localStorage / profile read or write behavior. Do not change the widget's rendered features. Return a diff summary.

---

## Stage 3: Integrator — newsletter capture refactor

> Read `sessions/contracts.md` (Newsletter capture locations). For each capture form identified, refactor to use `<Input>` + `<Button>`. Preserve existing submit behavior, validation, and analytics calls. Return a diff summary.

---

## Stage 4: Review

Spawn a Reviewer agent:

> The following files were created or modified this session: [list every file from Waves 1 and 2 and the integrator pass]. Read each file. Compare against `sessions/contracts.md`.
>
> 1. Verify zero raw hex colors in any widget file (all must reference CSS variables or token-derived classes).
> 2. Verify every widget renders inside `<WidgetFrame>`.
> 3. Verify accessibility: `role`, `aria-label`, `aria-expanded` on all interactive elements; keyboard nav on FirstFifteen dropdown; `aria-label` on PeacePause SVG.
> 4. Verify newsletter capture forms all use `<Input>` + `<Button>`.
> 5. Verify Phase 1/2/3 files are untouched (or changed only in non-behavioral ways).
>
> Do not fix issues. Report them with file and line numbers. Return a clean/issues list.

Fix any issues flagged before proceeding.

---

## Stage 5: Build verification and session wrap

Run:
```bash
npm run build
```

If the build fails, fix the errors before closing the session. Also run a manual smoke test (start dev server, visually verify the homepage, one widget, one section page, the DevotionGuide). The reviewer cannot test rendering — that is a manual step.

When the build passes:

**Update sessions/state.md:**
- Mark Phase 4 as COMPLETE with today's date
- Mark Phase 5 as READY (independent of all prior phases)
- List any items deferred with reasons

**Append to sessions/log.md:**
```
## Session 4 — Phase 4: Design System (2026-[date])
**Status:** Complete
**Files created:** [list]
**Files modified:** [list]
**Key decisions:** [any deviations from contracts, new decisions]
**Deferred:** [anything not completed]
```

**Write sessions/next.md** with the Phase 5 session prompt. The Phase 5 prompt must follow the same format and cover:
- Context: Phase 5 builds the content layer (JSON-backed content for armor pieces, rule-of-life rhythms, field guide days, devotion practices)
- State at session start
- What Phase 4 built: tokens, primitives, WidgetFrame, widget refactors
- What this session builds: `src/content/` JSON files, content loader utility, schema validation, refactor of hardcoded content blocks in section pages
- Stages 1-5 in the same shape

---

## Acceptance criteria (all must be true to close this session)

- [ ] `src/styles/tokens.css` exists with the full contracted variable set
- [ ] All six primitive components exist and are exported from `src/components/primitives/`
- [ ] `src/components/WidgetFrame.jsx` exists and is used by all six widgets
- [ ] `npm run build` passes with no errors
- [ ] No raw hex colors in any widget file
- [ ] All newsletter capture forms use `<Input>` + `<Button>` primitives
- [ ] Accessibility pass items from contract are all addressed
- [ ] Phase 1/2/3 files are unchanged in behavior
- [ ] `sessions/state.md` is updated
- [ ] `sessions/log.md` has a new entry
- [ ] `sessions/next.md` contains the Phase 5 prompt
