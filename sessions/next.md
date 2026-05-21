# Counter Formation Build -- Next Session

**Last completed:** Session 22 -- Phase 15 (Profile v6 + AgentHistory as Formation Record) on 2026-05-20
**Up next:** Phase 16 -- open. Suggested target: Identity.jsx structural refactor OR dashboard / DevotionGuide upgrades that ride on the new v6 `full` devotion field.

Phase 15 shipped a revised scope after a pre-flight audit caught that the original spec items (armor content extraction, /agent route, AgentEntry surface) were already done from prior phases. The work actually shipped was profile schema v6 with a `full` field on devotions, and an AgentHistory rewrite that turns `/agent` into a unified Formation Record (profile summary + merged assessment + devotion timeline with expandable markdown).

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 16. Confirm the phase scope before writing the plan file. Follow methodology -- plan file first, todo list, build/commit/push per item. Update sessions/log.md and sessions/next.md.
```

---

## Phase 16 -- options to consider

No spec is locked in yet. Three candidates, pick (or hybridize) before writing the plan:

### Option A -- Identity.jsx structural refactor (big move)

**Goal:** Break Identity.jsx (2173 lines) into a directory of component files. Currently the file mixes the Identity landing page (Hero, ArmorIntro, GodsArmor, ArmorRing, WhyItMatters) with PiecePage (the per-armor-day view). Each landing section is independently animated and could live on its own.

**Suggested decomposition:**
- `src/Identity.jsx` -- top-level route component (~200 lines), composes sections
- `src/components/identity/HeroSection.jsx`
- `src/components/identity/ArmorIntroSection.jsx`
- `src/components/identity/GodsArmorSection.jsx`
- `src/components/identity/ArmorRingSection.jsx`
- `src/components/identity/WhyItMattersSection.jsx`
- `src/components/identity/PiecePage.jsx` (the per-day view, ~500 lines)
- `src/components/identity/BackNav.jsx`
- `src/styles/identity.css` (extracted from ArmorStyles)

**Acceptance:** Each section file under 400 lines; Identity.jsx top-level under 250; all GSAP animations behave identically before and after; build passes.

**Risk:** GSAP scroll triggers cross section boundaries in places -- need to verify ScrollTrigger context still works after the split. Three or four commits.

### Option B -- Surface `full` devotion text on dashboard + DevotionGuide returning view

**Goal:** Now that v6 stores full devotional text, expose it where it matters. Currently `DevotionHistory` (in DevotionGuide) and `DevotionListPanel` (on the dashboard) both render only `summary`. The Formation Record on /agent is the only place that shows full text.

**Items:**
1. `DevotionListPanel` -- on the dashboard, when a card is tapped/clicked, expand inline (or open a lightweight modal) showing the full markdown. Falls back to summary for v5 entries.
2. `DevotionHistory` -- in the DevotionGuide returning-user view, same treatment.
3. Consider a single shared `<DevotionCard expandable />` primitive used by all three places (AgentHistory, DevotionListPanel, DevotionHistory) to avoid drift.

**Acceptance:** Tapping a devotion entry on dashboard or returning DevotionGuide view shows full markdown; v5 entries unchanged; no triple-implementation drift.

### Option C -- Open spec items / housekeeping

**Items still on the open list:**
- ArmorStyles -> identity.css extraction (low impact, ~160 lines off Identity.jsx, matches Phase 13 challenge.css pattern)
- iOS Safari device test (manual: magic-link, ApparelLane scroll-snap, bottom-sheet email capture)
- GEMINI_API_KEY removal from Cloudflare Pages env (manual dashboard step)
- Arrow Log 502 follow-up: if the Session 19 `extractJson()` fix isn't holding in production, consider migrating arrow-log.js to Claude's tool use API for structured output

These are smaller, lower-risk wins -- good for a session where the goal is closing out residuals.

---

## Recommendation

If you have an appetite for one focused, larger move: Option A (Identity.jsx refactor). It's the only remaining file that meaningfully violates design system size targets, and the structural split would also make future content edits (adding a Why / scripture / theology pass) far easier.

If you want to immediately compound the value of Phase 15: Option B (surface `full` text on dashboard + DevotionGuide). The new schema field is currently only visible inside `/agent`, which is a low-traffic surface.

Option C is good for a maintenance session.

---

## Carry-overs (still open, manual)

- **iOS Safari device test.** Manual. Test (a) magic-link end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Log pass/fail.
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
- `cf:profile` schema currently **v6** (bumped in Session 22, Phase 15 Item 1). v5 -> v6 is purely additive: devotion entries gain an optional `full` field (capped at 4000 chars). No data transform on migration.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`, `challenge.css`. All section CSS is static files. Identity.jsx still has inline CSS-in-JS (`ArmorStyles`); extraction to `identity.css` is deferred.
- All `const C` palette constants removed from src/. `npm run lint:tokens` enforces this. New code should reference tokens via `var(--cf-*)` or use the primitives.
- Content layer: `src/content/` contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json, fruits.json, loader.js, `challenge/days.json`, `assessment/fruit-questions.json`. Armor day content (stillness, scriptures, teaching, practice, reflection, prayer) is fully in armor.json -- not inline in Identity.jsx.
- Primitives in `src/components/primitives/`: Button (with tab variant), EyebrowLabel (forwardRef), SectionHeader, Card, ProgressBar, Input. All adopted across section files as of Phase 13.
- `DevotionOnboarding.jsx` retained in `src/components/` but no longer imported by DevotionGuide.jsx (removed in Phase 14 item 6). Available for reuse if a guided setup path is re-introduced.
- Agent foundation surfaces: `/agent` (AgentHistory = Formation Record), `/agent/onboarding` (AgentOnboarding = 3-question short assessment), `AgentEntry` (dashboard surface on PersonalizedHome). All live as of Session 21-22.
