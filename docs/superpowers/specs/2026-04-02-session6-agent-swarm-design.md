# Session 6 Polish Pass — Agent Swarm Design
**Date:** 2026-04-02  
**Scope:** Identity pillar final polish — animations, transitions, mobile, cross-links  
**Source Spec:** Session 6 prompt (5 Parts: Landing Animations, Piece Page Animations, Mobile Audit, Cross-Links, Transition Consistency)

---

## Overview

An orchestrated 14-agent swarm executes the Session 6 polish pass across the Identity pillar. Agents are organized into 7 sequential phases. Within each phase, agents touching independent files run in parallel. Agents touching shared files (`Identity.jsx`) run sequentially to avoid merge conflicts.

**Total agents:** 14  
**Critical path phases:** 7  
**Primary constraint:** `Identity.jsx` is 236KB and monolithic — sequential access required for safe editing

---

## Execution Graph

```
Phase 0 (parallel):    0-A, 0-B, 0-C        [read-only intelligence gathering]
                              ↓
Phase 1 (sequential):  1-A                   [Identity.jsx landing animations]
                              ↓
Phase 2 (parallel):    2-A, 2-B, 2-C         [piece animations + cross-links]
                              ↓
Phase 3 (mixed):       3-A→3-B (seq, Identity.jsx), 3-C∥3-D (parallel, independent files)
                              ↓
Phase 4 (parallel):    4-A, 4-B              [verification & transition audit]
                              ↓
Phase 5 (sequential):  5-A                   [UX & design enhancement review]
                              ↓
Phase 6 (sequential):  6-A                   [final code review & completion report]
```

---

## Phase 0 — Intelligence Gathering (Parallel, Read-Only)

All three agents run simultaneously. They produce no code changes — only reference documents consumed by every downstream agent. Phase 1 does not start until all three complete.

### Agent 0-A: Pattern Extractor
**Task:** Deep-read `App.jsx`, `RuleOfLife.jsx`, `SevenDayChallenge.jsx`. Extract exact GSAP patterns: ease functions, durations, stagger values, ScrollTrigger configuration options, timeline structure, and GSAP context cleanup patterns.  
**Output:** `ANIMATION_REFERENCE.md` — a precise reference sheet of every animation pattern in use across the existing site, with code examples.  
**Files read:** `src/App.jsx`, `src/RuleOfLife.jsx`, `src/SevenDayChallenge.jsx`

### Agent 0-B: Identity State Mapper
**Task:** Deep-read `Identity.jsx` in full. Map the complete current state: which animations are already implemented, which sections are stubs, all CSS class names, data structure shape for armor pieces, widget integration points, existing responsive styles, and any GSAP code already present.  
**Output:** `IDENTITY_STATE.md` — section-by-section map of what exists vs. what is missing relative to the Session 6 spec.  
**Files read:** `src/Identity.jsx`, `specs/spec-landing-page.md`, `specs/spec-visual-identity.md`

### Agent 0-C: Cross-Link Auditor
**Task:** Read `RuleOfLife.jsx`, `SevenDayChallenge.jsx`, `Architecture.jsx`, and all 6 widget files. Map current cross-link state — what links are already wired, what card component patterns exist, what the existing "further reading" / sidebar card design looks like in RuleOfLife.  
**Output:** `CROSSLINK_STATE.md` — current state of all cross-links with file + line references, and the exact JSX pattern to replicate for new Connected Armor cards.  
**Files read:** `src/RuleOfLife.jsx`, `src/SevenDayChallenge.jsx`, `src/Architecture.jsx`, `src/widgets/*.jsx`

---

## Phase 1 — Landing Page Animations (Sequential)

Exclusive write access to `Identity.jsx`. Phase 2 does not start until Phase 1 completes.

### Agent 1-A: Landing Page Animator
**Task:** Implement all Session 6 Part 1 animations on the `/identity` landing page — Sections A through G.

Specific deliverables:
- **Section A (Hero):** Shield watermark parallax (0.3x scroll speed, GSAP ScrollTrigger), particle field matching homepage CinematicHero, headline scale+fade on page load (0.97→1.0, 1.2s, power3.out), subline +400ms, eyebrow +200ms after subline, scroll indicator pulse (opacity 0.4→1.0, 1.4s, sine.inOut, infinite yoyo), hero exit parallax on scroll past
- **Section B:** Eyebrow fade-up (translateY 20px→0, 0.8s), scripture block staggered +200ms (1.0s), teaching paragraphs sequential stagger 150ms, gold rule width 0%→100% (0.8s, power2.out)
- **Section C:** Two-column fade-up with 300ms offset, brand line gold glow dissipation (text-shadow rgba(201,168,76,0.4)→0 over 2s), background gradient transition Hero Black→Rule Brown over 200vh
- **Section D:** Per-piece fade-up, alternating translateX (odd: -30px, even: +30px), gold eyebrow shimmer (single left-to-right gradient sweep), "Explore this piece →" fade-in +300ms after content
- **Section E:** Fade-up prose, brand line gold glow (same as Section C)
- **Section F:** Background gradient bridge to Gear Warm (#F5F2EC), product cards stagger 150ms, hover lift (translateY -4px, box-shadow, 300ms)
- **Section G:** Button stagger fade-up, scripture fade-in last

**Animation constraints:**
- All durations ≤ 1.2s (most 0.7–0.9s)
- Ease: `power2.out` standard, `power3.out` for hero elements
- `ScrollTrigger.batch()` for efficiency on grouped elements
- `toggleActions: "play none none reverse"` on all scroll triggers
- Use `gsap.context()` with cleanup return

**Consumes:** `ANIMATION_REFERENCE.md`, `IDENTITY_STATE.md`  
**Files modified:** `src/Identity.jsx`

---

## Phase 2 — Piece Pages + Independent Cross-Links (Parallel)

Three agents run simultaneously. Agents 2-A and 2-C both touch `Identity.jsx` but in non-overlapping sections. If a conflict risk is detected at execution time, run 2-A first, then 2-C on the result.

### Agent 2-A: Piece Page Animator
**Task:** Implement Session 6 Part 2 animations on all `/identity/[piece]` pages.

Specific deliverables:
- Hero image Ken Burns settle (scale 1.02→1.0, 1.5s)
- Gold eyebrow + piece title fade-up stagger on page load
- Anchor scripture fade-up +300ms after title
- Each day section fade-up on scroll into view
- Section labels (STILLNESS, SCRIPTURE, TEACHING, etc.) individual fade-ups as sections scroll in
- Scripture blocks within days: +200ms delay after their section label
- Practice and Prayer sections: standard fade-up
- Sidebar widget fade-in on first visibility, `once: true`
- Day navigation (prev/next) fade-up on scroll to bottom
- Armor piece prev/next navigation at bottom: fade-up matching RuleOfLife rhythm nav pattern, includes piece number + name + directional indicator

**Consumes:** `ANIMATION_REFERENCE.md`, `IDENTITY_STATE.md` (Phase 1 output as base)  
**Files modified:** `src/Identity.jsx` (piece page template sections)

### Agent 2-B: RuleOfLife Cross-Linker
**Task:** Add "Connected Armor" cards to relevant Rule of Life rhythm pages per Session 6 Part 4.

Mapping:
- Presence → `/identity/belt-of-truth` — "The foundation everything else attaches to"
- Scripture → `/identity/sword-of-the-spirit` — "The Word is a weapon" AND `/identity/helmet-of-salvation` — "A protected mind" (two cards stacked)
- Sabbath → `/identity/gospel-of-peace` — "Ground beneath you"
- Community → `/identity/shield-of-faith` — "Behind what God has said"
- Prayer → no card

Card format (match existing card pattern from `CROSSLINK_STATE.md`):
- "Connected Armor" label, gold, small caps
- Armor piece name in Barlow Condensed
- Tagline in Cormorant Garamond italic, muted
- Entire card is a link to the Identity piece page
- Placement: same location as existing further reading section / sidebar bottom

**Consumes:** `CROSSLINK_STATE.md`  
**Files modified:** `src/RuleOfLife.jsx`

### Agent 2-C: Challenge + Architecture Linker
**Task:** Wire remaining cross-links per Session 6 Part 4.

Specific deliverables:
1. **7-Day Challenge Day 7 completion state** (`SevenDayChallenge.jsx`): Add subtle CTA — "You've completed the 7-Day Challenge. Ready to go deeper? The Armor of God formation tracks take the disciplines you've started and build them into a daily practice." with "Begin the Armor of God →" link to `/identity`. Styled as gold text + arrow, not a primary button.
2. **Architecture.jsx**: Verify Identity panel links to `/identity` (not CampaignPage). Confirm "Enter Identity" CTA works. Confirm Practice and Community still link to their CampaignPage templates.
3. **Identity.jsx Section G**: Verify/add tertiary link — "New to Counter Formation? Start with the 7-Day Challenge →" linking to `/7-day-challenge`.

**Consumes:** `CROSSLINK_STATE.md`, Phase 1 output for Identity.jsx Section G  
**Files modified:** `src/SevenDayChallenge.jsx`, `src/Architecture.jsx`, `src/Identity.jsx` (Section G only)

---

## Phase 3 — Mobile Audit & Widget Fixes (Parallel)

Agents 3-C and 3-D run in parallel immediately. Agents 3-A and 3-B both touch `Identity.jsx` and run sequentially (3-A then 3-B), but in parallel with 3-C and 3-D. All four complete before Phase 4 begins.

**Target breakpoints:** 375px (iPhone SE), 390px (iPhone 14), 428px (iPhone 14 Pro Max), 768px (iPad), 1024px (iPad landscape)

### Agent 3-A: Landing Page Mobile
**Task:** Audit and fix `Identity.jsx` landing page mobile layout.

Checklist:
- Hero text readable and unclipped at 375px
- Hero headline uses `clamp()` for fluid sizing
- Shield watermark scales down or hides on mobile (≤768px)
- Section B reading column: min 20px side padding
- Section C two-column stacks to single column below 768px
- Section D armor piece sections: no horizontal overflow at any breakpoint
- Section F product cards: single column on mobile, two-column on tablet (768px+)
- Section G CTA buttons: full-width on mobile, min 48px height
- No horizontal scroll at any breakpoint
- All text uses `clamp()` or responsive breakpoint sizing

**Files modified:** `src/Identity.jsx` (landing page CSS/inline styles)

### Agent 3-B: Piece Page Mobile
**Task:** Audit and fix `/identity/[piece]` page templates for mobile.

Checklist:
- Two-column layout collapses to single column below 1024px
- Sidebar widget moves below main content on mobile (<768px) or above on tablet (768–1023px)
- Day content sections: max ~90vw, min 20px padding
- Scripture blocks wrap properly (no overflow on long verses)
- Day navigation buttons: full-width stacked on mobile
- Bottom armor piece navigation: tappable, not cramped
- Hero image maintains aspect ratio, no stretching
- Large watermark numeral (01–06): scales down or hides on mobile to prevent overwhelming

**Files modified:** `src/Identity.jsx` (piece page template CSS/styles)

### Agent 3-C: Widget Mobile Fixer
**Task:** Fix all 6 widgets for mobile breakpoints per Session 6 Part 3 Widget Mobile checklist.

Per-widget fixes:
- **ArrowLogWidget:** Two-column layout stacks at <380px
- **PeacePauseWidget:** Three-button row (morning/midday/evening) wraps or scales — no overflow
- **FirstFifteenWidget:** Selectors are tappable at mobile size (min 44px touch targets)
- **VerseTrackerWidget:** Day checkboxes (M T W T F S S) fit in single row at 375px
- **DeclarationWidget:** Generated card is visible and not clipped on mobile
- **ExamenWidget:** Any layout issues at 375px

**Global widget rule:** All `<input>` and `<textarea>` elements must have `font-size: 16px` minimum to prevent iOS auto-zoom.

**Files modified:** `src/widgets/ArrowLogWidget.jsx`, `src/widgets/PeacePauseWidget.jsx`, `src/widgets/FirstFifteenWidget.jsx`, `src/widgets/VerseTrackerWidget.jsx`, `src/widgets/DeclarationWidget.jsx`, `src/widgets/ExamenWidget.jsx`

### Agent 3-D: Global Mobile + ScriptureRef
**Task:** Fix global mobile issues not covered by the page-specific agents.

Checklist:
- Touch targets: minimum 44×44px everywhere (audit nav, buttons, links)
- z-index audit: no conflicts between sidebar, navigation, and floating elements
- `ScriptureRef.jsx`: popover works on tap (not just hover), viewport clipping fixed on mobile (popover boundary detection already exists but verify at 375px)
- Page transitions: no scroll position artifacts between routes
- Navigation back to homepage works from all Identity pages

**Files modified:** `src/ScriptureRef.jsx`, `src/App.jsx` (nav touch targets if needed), `src/index.css` (global touch target rules if needed)

---

## Phase 4 — Verification (Parallel)

### Agent 4-A: Cross-Link Verifier
**Task:** Verify every cross-link from the Session 6 Part 4 checklist by reading the current state of all modified files.

Verify:
- Belt of Truth widget → `/rule-of-life/presence` ✓
- Gospel of Peace widget → `/rule-of-life/sabbath` ✓
- Shield of Faith widget → `/rule-of-life/community` ✓
- Helmet of Salvation widget → `/rule-of-life/scripture` ✓
- Sword of the Spirit widget → `/rule-of-life/scripture` ✓
- Breastplate widget → no cross-link ✓
- All Connected Armor cards in RuleOfLife.jsx wired correctly
- 7-Day Challenge Day 7 completion CTA present and links to `/identity`
- Identity Section G has tertiary 7-Day Challenge link
- Architecture.jsx Identity panel links to `/identity`

**Output:** Verification report — confirmed items, any missing wiring with file + line references, any corrections applied directly.

### Agent 4-B: Transition Consistency Auditor
**Task:** Audit all Part 5 transition consistency items by reading the routing and animation code.

Check:
- `ScrollRestoration` or scroll-to-top behavior on route change (React Router v7)
- GSAP ScrollTrigger cleanup on component unmount (check `gsap.context()` returns in all new animation code from Phases 1–2)
- No FOUC: initial opacity states set correctly via `gsap.set()` before animation
- Back button behavior: no double-trigger of animations
- `_redirects` and `404.html` in `public/` for SPA routing (Cloudflare)
- Armor piece prev/next navigation scrolls to top on route change

**Output:** Audit report + targeted fixes for any transition issues found.

---

## Phase 5 — UX & Design Enhancement Review

### Agent 5-A: Enhancement Reviewer
**Task:** Review the complete Session 6 output holistically for quality, consistency, and missed opportunities.

Evaluate:
- Animation timing consistency across all new GSAP code (durations, eases match spec)
- Mobile layout coherence across landing page, piece pages, and widgets
- Any micro-interactions that would elevate quality without violating brand tone (e.g., ScriptureRef hover state polish, armor piece card hover states on landing)
- Any Session 6 checklist items that were missed or only partially addressed
- No regressions: existing animations on homepage, 7-Day Challenge, Rule of Life pages still intact

Apply highest-confidence fixes directly. Flag lower-confidence observations for future sessions.

---

## Phase 6 — Final Code Review

### Agent 6-A: Code Reviewer
**Task:** Full review of all files modified during Session 6.

Review criteria:
- GSAP cleanup: every `useEffect` with GSAP returns a cleanup function using `gsap.context().revert()`
- No animation durations > 1.2s
- Ease functions match spec (`power2.out` standard, `power3.out` hero)
- `toggleActions: "play none none reverse"` on all scroll triggers
- Mobile CSS correctness: no `px` values for typography where `clamp()` was specified
- Cross-link URLs are exact and correct
- No `console.log` statements left in modified files
- No introduced TypeScript/lint errors (project uses plain JS)

**Output:** Session 6 Completion Report in the format specified by the prompt:
1. All animation additions (element, page, animation type)
2. All mobile fixes applied
3. Cross-link confirmation (both directions)
4. Unresolved issues with explanation
5. Recommendations for Session 7

---

## File Modification Map

| File | Modified By |
|---|---|
| `src/Identity.jsx` | 1-A, 2-A, 2-C (Section G), 3-A, 3-B |
| `src/RuleOfLife.jsx` | 2-B |
| `src/SevenDayChallenge.jsx` | 2-C |
| `src/Architecture.jsx` | 2-C |
| `src/ScriptureRef.jsx` | 3-D |
| `src/widgets/ArrowLogWidget.jsx` | 3-C |
| `src/widgets/PeacePauseWidget.jsx` | 3-C |
| `src/widgets/FirstFifteenWidget.jsx` | 3-C |
| `src/widgets/VerseTrackerWidget.jsx` | 3-C |
| `src/widgets/DeclarationWidget.jsx` | 3-C |
| `src/widgets/ExamenWidget.jsx` | 3-C |
| `src/App.jsx` | 3-D (if needed) |
| `src/index.css` | 3-D (if needed) |

---

## Key Constraints & Guardrails

- **Animation brand tone:** Weighted, intentional, cinematic. Never bouncy. The brand is a monastery, not a startup.
- **Duration ceiling:** No single animation exceeds 1.2s. Most 0.7–0.9s.
- **GSAP version:** 3.14.2 — use registered `ScrollTrigger` (already global in `App.jsx`)
- **No new dependencies** — all animation work uses existing GSAP + CSS
- **iOS zoom prevention** — all input/textarea elements must be font-size ≥ 16px
- **Touch targets** — minimum 44×44px everywhere
- **GSAP cleanup** — every animation useEffect must return `ctx.revert()` to prevent memory leaks on route change
- **`prefers-reduced-motion`** — wrap GSAP animations in a check; skip or simplify for users who have requested reduced motion
