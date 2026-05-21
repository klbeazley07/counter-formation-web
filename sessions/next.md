# Counter Formation Build -- Next Session

**Last completed:** Session 24 -- Phase 17 Option B (Identity.jsx structural refactor) on 2026-05-20
**Up next:** Visual QA of the Spectral swap (deferred from Session 23) + choose a Phase 18 direction.

The Identity.jsx refactor shipped clean. The file went from 2173 lines to ~160 lines. Six new component files live under `src/components/identity/`. Zero functional change -- purely structural.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md. Do a quick visual QA pass on the deployed site for the Spectral font swap. Then pick a Phase 18 direction from the candidate list.
```

---

## Phase 16 Phase 3 -- conditional Spectral tuning (still open)

**Trigger:** Run this only if visual QA on the deployed site reveals that Spectral's higher x-height causes sizing or density issues. Cloudflare Pages is live and should reflect the Session 23 font swap.

**Likely tuning candidates if needed:**
- [src/components/identity/PiecePage.jsx](src/components/identity/PiecePage.jsx) `.ap-body` class is defined in [src/styles/identity.css](src/styles/identity.css) -- currently `font-size: clamp(20px, 3.8vw, 22px); line-height: 1.88`. Drop line-height to ~1.7, possibly drop size to `clamp(18px, 3.5vw, 20px)`.
- Field Guide office prose -- check `.dg-markdown` rules in [src/styles/devotion-guide.css](src/styles/devotion-guide.css).
- Rule of Life rhythm pages -- long teaching paragraphs in [src/RuleOfLife.jsx](src/RuleOfLife.jsx).
- `.cf-prose` mobile Inter override in [src/index.css:629-642](src/index.css#L629-L642) -- can probably be removed if Spectral reads well at 16px on mobile.
- Italic scripture pull quotes -- Spectral italic is more open than Cormorant italic; smaller sizes may work better.

---

## Phase 18 candidates

The five-theme enhancement spec is complete. Phase 17 Option B (Identity refactor) is done. Three forward directions:

### Option A -- Surface `full` devotion text on dashboard + DevotionGuide returning view

Now that v6 stores full devotional text (Phase 15), the only place it's visible is `/agent`. Promote it to higher-traffic surfaces:
1. `DevotionListPanel` (dashboard) -- expand inline or open a lightweight modal when a card is tapped.
2. `DevotionHistory` (DevotionGuide returning user view) -- same treatment.
3. Extract a shared `<DevotionCard expandable />` primitive used by AgentHistory, DevotionListPanel, and DevotionHistory to avoid drift.

### Option B -- Community pillar

The brand has been four-pillar-with-a-shadow since launch. Identity / Rhythm / Practice / Devotion all have surfaces; Community has none. This isn't a coding task; it's a product decision masquerading as one. Is community a content section, a directory, a small-group toolkit, a Discord hand-off? Worth a brainstorm session before any implementation.

### Option C -- Agent onboarding assessment improvements

The AgentOnboarding at `/agent/onboarding` collects identity, intention, and fruit assessment data. The assessment is currently the 9-fruit self-score. Could deepen it: add gifts integration (link to completed Spiritual Gifts Assessment result), add a time-of-day rhythm question, or surface the formation edge concept more explicitly before storing it.

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
- **Devotional font is now Spectral** (Phase 16, Session 23). Token `--cf-font-devotional` in `src/styles/tokens.css` resolves to `'Spectral', Georgia, serif`. All devotional font references go through the token; no hardcoded font names should remain in src/ JSX/JS.
- **Identity section structure** (Phase 17, Session 24). `src/Identity.jsx` is now a thin route file (~160 lines). Sections live in `src/components/identity/`. ArmorPiecePage + BackNav + CrossLinkCard + constants live in `src/components/identity/PiecePage.jsx`. Armor piece CSS (`.ap-*` classes) lives in `src/styles/identity.css`.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`, `challenge.css`, `identity.css`.
- All `const C` palette constants removed from src/. `npm run lint:tokens` enforces this.
- Content layer: `src/content/` contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json, fruits.json, loader.js, `challenge/days.json`, `assessment/fruit-questions.json`.
- Primitives in `src/components/primitives/`: Button (with tab variant), EyebrowLabel (forwardRef), SectionHeader, Card, ProgressBar, Input.
- Agent foundation surfaces: `/agent` (AgentHistory = Formation Record), `/agent/onboarding` (AgentOnboarding), `AgentEntry` on PersonalizedHome dashboard.
