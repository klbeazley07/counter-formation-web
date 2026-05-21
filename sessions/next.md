# Counter Formation Build -- Next Session

**Last completed:** Session 23 -- Phase 16 (Cormorant Garamond → Spectral font swap, Phases 1 & 2) on 2026-05-20
**Up next:** Phase 16 Phase 3 tuning IF visual QA reveals sizing/line-height issues, otherwise move to a Phase 17 strategic direction.

The Cormorant → Spectral swap shipped to main. Two commits: a mechanical token sweep (zero visual change) followed by the actual font swap (site-wide). The deployed Cloudflare Pages site will now render every devotional-font surface in Spectral instead of Cormorant Garamond.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md. First do a visual QA pass on the Spectral swap. Then either run Phase 16 Phase 3 (tuning) if needed, or pick a Phase 17 direction from the candidate list.
```

---

## Phase 16 Phase 3 -- conditional tuning pass

**Trigger:** Run this only if visual QA on the deployed site reveals that Spectral's metrics need adjustment. Spectral has a higher x-height than Cormorant, so the same point size will read larger; long prose blocks may feel dense.

**Likely tuning candidates if needed:**
- [src/Identity.jsx](src/Identity.jsx) `.ap-body` class (currently `font-size: clamp(20px, 3.8vw, 22px); line-height: 1.88`). Drop line-height to ~1.7, possibly drop size to `clamp(18px, 3.5vw, 20px)`.
- Field Guide office prose -- similar pattern in [src/FieldGuide.jsx](src/FieldGuide.jsx).
- DevotionGuide markdown output -- check `.dg-markdown` rules in [src/styles/devotion-guide.css](src/styles/devotion-guide.css).
- Rule of Life rhythm pages -- the long teaching paragraphs in [src/RuleOfLife.jsx](src/RuleOfLife.jsx).
- `.cf-prose` mobile Inter override in [src/index.css:629-642](src/index.css#L629-L642) -- can probably be removed entirely now that Spectral reads well at 16px on mobile. Test before removing.
- Italic scripture pull quotes -- Spectral italic is more open than Cormorant italic; smaller sizes may work better.

**Methodology if running tuning:** Open the dev server (`npm run dev`), screenshot each section in current state, adjust line-height/size, screenshot again, compare. Commit per section if multiple sections need attention.

---

## Phase 17 -- if Phase 16 is fully done

The five-theme enhancement spec (May 2026) is complete. The next strategic phase isn't yet scoped. Three candidates from the Session 22 retrospective:

### Option A -- Surface `full` devotion text on dashboard + DevotionGuide returning view

Now that v6 stores full devotional text (Phase 15), the only place it's visible is `/agent`. Promote it to higher-traffic surfaces:
1. `DevotionListPanel` (dashboard) -- expand inline or open a lightweight modal when a card is tapped.
2. `DevotionHistory` (DevotionGuide returning user view) -- same treatment.
3. Extract a shared `<DevotionCard expandable />` primitive used by AgentHistory, DevotionListPanel, and DevotionHistory to avoid drift.

Immediate compound on Phase 15 work. Two commits.

### Option B -- Identity.jsx structural refactor

Identity.jsx is the only section file that meaningfully violates the design system size targets at 2173 lines. Decompose into:
- `src/Identity.jsx` -- top-level route, ~200 lines
- `src/components/identity/HeroSection.jsx`
- `src/components/identity/ArmorIntroSection.jsx`
- `src/components/identity/GodsArmorSection.jsx`
- `src/components/identity/ArmorRingSection.jsx`
- `src/components/identity/WhyItMattersSection.jsx`
- `src/components/identity/PiecePage.jsx` (per-day view, ~500 lines)
- `src/components/identity/BackNav.jsx`
- `src/styles/identity.css` (ArmorStyles CSS-in-JS extraction)

Risk: GSAP scroll triggers cross section boundaries -- verify ScrollTrigger context still works after the split. Three or four commits.

### Option C -- The Community pillar

The brand has been four-pillar-with-a-shadow since launch. Identity / Rhythm / Practice / Devotion all have surfaces; Community has none. This isn't a coding task; it's a product decision masquerading as one. Is community a content section, a directory, a small-group toolkit, a Discord hand-off? Worth a brainstorm session before any implementation.

---

## Carry-overs (still open, manual)

- **iOS Safari device test.** Manual. Test (a) magic-link end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Add a Spectral mobile readability check to this pass.
- **GEMINI_API_KEY removal from Cloudflare Pages env.** Manual dashboard step.
- **Arrow Log 502 follow-up.** If the robust-JSON fix from Session 19 doesn't hold, migrate arrow-log.js to Claude's tool use API.

---

## Session methodology (unchanged)

1. **Read state.** `sessions/next.md`, active plan file, top of `sessions/log.md`, `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list. Mark item 1 `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass after each item (prebuild runs `lint:tokens` -- the const-C contract test).
5. **Commit + push + handoff.** Per-task commits preferred. Update log.md + next.md before push.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID`. `GEMINI_API_KEY` unused and should be removed.
- `cf:profile` schema currently **v6** (Phase 15). Additive only.
- **Devotional font is now Spectral** (Phase 16, Session 23). Token `--cf-font-devotional` in `src/styles/tokens.css` resolves to `'Spectral', Georgia, serif`. All devotional font references go through the token; no hardcoded font names should remain in src/ JSX/JS (only the Arrow Log Tool standalone sub-project still references Cormorant -- intentional, not part of main build).
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`, `challenge.css`.
- All `const C` palette constants removed from src/. `npm run lint:tokens` enforces this.
- Content layer: `src/content/` contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json, fruits.json, loader.js, `challenge/days.json`, `assessment/fruit-questions.json`. Armor day content is fully in armor.json.
- Primitives in `src/components/primitives/`: Button (with tab variant), EyebrowLabel (forwardRef), SectionHeader, Card, ProgressBar, Input.
- Agent foundation surfaces: `/agent` (AgentHistory = Formation Record), `/agent/onboarding` (AgentOnboarding), `AgentEntry` on PersonalizedHome dashboard.
