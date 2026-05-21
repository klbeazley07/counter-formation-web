# Plan: Phase 13 -- Primitives + Accessibility Sweep

**Session:** 20  
**Date:** 2026-05-20  
**Spec ref:** sessions/next.md "Phase 13"

---

## Pre-flight findings

All six primitives exist and are well-formed. No new variants required for Button (primary/secondary/ghost already cover CTA cases), except one gap:

**Gap: Tab navigation buttons in RuleOfLife.jsx.** The three widget tab bars (Examen, Daily Office, Prayer Postures) use `<button>` elements with active-state bottom-border highlights that don't map to primary/secondary/ghost. Add a `tab` variant to Button.jsx with an `active` prop before touching RuleOfLife.

### Line counts (pre-Phase-13)

| File | Lines |
|---|---|
| Identity.jsx | 2220 |
| FruitAssessment.jsx | 1669 |
| App.jsx | 1879 |
| SevenDayChallenge.jsx | 855 |
| RuleOfLife.jsx | 740 |
| FieldGuide.jsx | 476 |

### Primitive opportunities per file

| File | `<button>` | inline eyebrows | alt-empty |
|---|---|---|---|
| Identity.jsx | 5 | 22 | 11 |
| FruitAssessment.jsx | 9 | 0 | 1 |
| RuleOfLife.jsx | 11 | 0 | 3 |
| FieldGuide.jsx | 2 | 0 | 0 |
| SevenDayChallenge.jsx | 1 | 0 | 3 |
| App.jsx | 11 | 49 | 3 |

---

## Execution order (file-by-file per methodology)

### Item 0 -- Button primitive: add `tab` variant

Add `.cf-btn--tab` CSS + `active` prop to Button.jsx. Tab buttons have no border-radius, bottom-border active indicator, and don't use the standard hover transform. Used by RuleOfLife examen/office/postures tab bars.

### Item 1 -- ChallengeStyles extraction (Phase 13 add-on)

Move the `ChallengeStyles` template-literal CSS block (~600 lines) from SevenDayChallenge.jsx to `src/styles/challenge.css`. Import via Vite top-level CSS import in SevenDayChallenge.jsx. Remove `<ChallengeStyles />` and its import from App.jsx. This is the path to getting SevenDayChallenge.jsx under 350 lines.

### Item 2 -- FieldGuide.jsx

2 `<button>` elements. Simple CTA replacements -- no tabs, no GSAP refs. Lowest-risk file, good warmup.

- Both buttons appear to be secondary-style CTAs (outlined gold)
- Build + spot-check after

### Item 3 -- RuleOfLife.jsx

11 `<button>` elements. Mix of tabs (Examen steps, Daily Office rhythms, Prayer Postures/Lectio tabs) and CTA-style buttons (Start Examen, Restart).

- Tab buttons → `<Button variant="tab" active={...}>`
- CTA buttons → `<Button variant="secondary">` or `<Button variant="ghost">`
- 3 alt-empty images → add `role="presentation"`
- Build + spot-check

### Item 4 -- SevenDayChallenge.jsx

1 `<button>`, 1 `<input>`, 3 alt-empty. Post-ChallengeStyles extraction this file should be well under 350 lines already; these are cleanup passes.

- Button → `<Button>` as appropriate
- Input → `<Input>` from primitive
- alt-empty → add `role="presentation"`
- Build + spot-check

### Item 5 -- FruitAssessment.jsx

9 `<button>` elements. These are quiz-answer scale buttons (1-7) and navigation CTAs (Start, ← Back, Next →, See Results).

- Scale answer buttons: each maps to `<Button variant="secondary">` or `<Button variant="ghost">` depending on whether selected
- Navigation CTAs: primary/secondary/ghost as appropriate
- 1 alt-empty → add `role="presentation"`
- Build + spot-check

### Item 6 -- Identity.jsx

Largest file. 5 `<button>`, 22 inline eyebrow patterns, 11 alt-empty.

**Eyebrow/SectionHeader strategy:** Many eyebrows in Identity.jsx have GSAP `ref` props attached (needed for scroll animations). Replacing those requires `forwardRef` on EyebrowLabel, or wrapping the eyebrow in a div with the ref. Decision: add `forwardRef` to EyebrowLabel so refs can be passed cleanly.

- Eyebrows with GSAP refs → add forwardRef to EyebrowLabel, then replace with `<EyebrowLabel ref={...}>`
- Static eyebrow + title + subtitle blocks → replace with `<SectionHeader>`
- 5 `<button>` elements → `<Button>` (CTA-style, at bottom of piece detail)
- 11 alt-empty → audit each; purely decorative images get `role="presentation"`, armor piece images may need descriptive alt
- Build + spot-check; check Identity.jsx line count after

**Target: Identity.jsx under 1500L (stretch: under 1000L).**

### Item 7 -- App.jsx

11 `<button>`, 49 inline eyebrow patterns (many are display titles with tracking, not true eyebrows -- be selective), 1 `<input>`, 3 alt-empty.

**Eyebrow selection rule:** Only `text-[10px]` / `text-[9px]` / `text-[11px]` elements that appear before a title (i.e., true section eyebrows) get replaced with `<EyebrowLabel>`. Large display titles with `tracking-[0.1em]` are headings and stay as-is.

- True eyebrows → `<EyebrowLabel>`
- Eyebrow + title combos → `<SectionHeader>`  
- Newsletter email `<input>` → `<Input type="email" />`
- 11 `<button>` elements → `<Button>` as appropriate
- 3 alt-empty → add `role="presentation"`
- Build + spot-check

### Item 8 -- Alt audit (cross-cutting)

Codebase-wide sweep: every file with `alt=""`. For each:
- Keep `alt=""` + add `role="presentation"` if purely decorative
- Write descriptive alt if the image carries formation meaning

Already handled per-file above; this item is for any remaining files outside the six main section files.

### Item 9 -- ARIA pass (cross-cutting)

Targets per spec:
- **Nav (SiteNav.jsx, MobileTabBar.jsx):** `role="navigation"`, `aria-label`, active link `aria-current="page"`
- **Modals:** `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **QR welcome modal in Identity.jsx:** as above
- **Field Guide accordions:** `aria-expanded`, `aria-controls`, `id` on panel
- **App.jsx scroll-arc toggles:** `aria-pressed` or `aria-expanded` as appropriate
- **App.jsx slidebar:** `role="tablist"` + `role="tab"` on tabs if not already

---

## Acceptance criteria

- [ ] Identity.jsx under 1500 lines
- [ ] SevenDayChallenge.jsx under 350 lines
- [ ] All `<button>` in section files routed through Button primitive
- [ ] All eyebrow labels in section files through EyebrowLabel (excluding GSAP-ref eyebrows pre-forwardRef fix; those count after forwardRef addition)
- [ ] Zero `alt=""` without accompanying `role="presentation"`
- [ ] `npm run build` passes; `npm run lint:tokens` passes
- [ ] No visual regressions on home → 7DC → Identity → FruitAssessment → RuleOfLife → FieldGuide → DevotionGuide path
