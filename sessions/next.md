# Counter Formation Build -- Next Session

**Last completed:** Session 21 -- Phase 14 (Connection Tissue + Agent Foundation) on 2026-05-20
**Up next:** Phase 15 -- Identity.jsx content extraction + Agent history page.

Phase 14 closed the remaining Phase 2 spec items and the Agent Foundation targets. The DevotionGuide orientation card is live; returning user history is in place; formation context envelope is complete. The two remaining open items from the broader spec are Identity.jsx content extraction (stretch from Phase 14) and the agent history page (flagged in project_agent_foundation memory as a known gap).

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 15. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push after each item. Update sessions/log.md and sessions/next.md.
```

---

## Phase 15 -- Identity.jsx content extraction + Agent history page

**Goal:** Push Identity.jsx below 1500 lines by extracting armor day content to `src/content/armor.json`, and build the `/agent` history page noted as a gap in the agent foundation.

**Why this ordering:** Both items were deferred from prior phases. Identity.jsx at 2173 lines is the only section file significantly above the design system targets. The agent history page is the only flagged architectural gap in the agent foundation layer.

**Pre-flight audit needed before writing the plan file:**
- Read `src/content/armor.json` to check its current schema and how much content is already there
- Check Identity.jsx lines 1-100 for imports and state shape; lines 1900-2200 for armor day content structure
- Check `src/App.jsx` for whether `/agent` route exists and what it currently renders
- Check `src/components/agent/` directory for existing agent components

**Items in scope:**

### Identity.jsx content extraction

1. **Audit armor.json vs. Identity.jsx content.** Determine what's already in `armor.json` and what day-level content (devotional text, scripture, reflection questions) is still inline in Identity.jsx. Map the gap before writing code.

2. **Extract armor day content to armor.json.** Move the per-piece, per-day devotional text, scripture references, and reflection questions from Identity.jsx into `armor.json`. Update Identity.jsx to read from the JSON. Target: Identity.jsx < 1500 lines.

3. **Verify Identity.jsx renders correctly.** Each armor piece's 6-day track should display identically before and after extraction. Build must pass.

### Agent history page

4. **Build `/agent` route.** Check if the route exists in App.jsx. If not, add it. The page should show: a header ("Formation Agent"), the user's formation profile summary (formationEdge, completedPieces, completedDays, onboarding intention), and a scrollable list of past devotion entries from `profile.widgets.devotions` with full content (not just summaries -- this requires storing full text, or linking back to the shared devotion URL if available).

5. **Surface agent entry point.** The spec notes an `AgentEntry` surface. Check if it's wired anywhere in the nav or Field Guide. If the `/agent` route exists but has no nav entry, add a link from the Field Guide hub or the DevotionGuide footer.

### Stretch

6. **DevotionGuide: store full devotional text in profile.** Currently only the first 200 chars are stored as `summary`. The history page needs full text to be useful. Add a `full` field to the devotion entry object (capped at 4000 chars) so the history page can render complete devotions. Schema change: profile v6 bump + migration.

**Acceptance for Phase 15:**
- Identity.jsx < 1500 lines
- armor.json contains all day-level content
- Identity.jsx renders correctly after extraction
- `/agent` route exists and shows formation profile + devotion history
- Build passes

---

## Carry-overs (still open, manual)

- **iOS Safari device test.** Manual. Test (a) magic-link end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Log pass/fail.
- **GEMINI_API_KEY removal from Cloudflare Pages env.** Manual dashboard step.
- **Arrow Log 502 follow-up.** The robust-JSON fix went out in Session 19. If the 502 persists despite the new `extractJson()`, consider migrating arrow-log.js to Claude's tool use API for true structured output.

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
- `cf:profile` schema currently v5 (bumped in Session 19, Phase 12 Item 2). Phase 15 stretch item 6 would require a v6 bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`, `challenge.css`. All section CSS is static files.
- All `const C` palette constants removed from src/. `npm run lint:tokens` enforces this. New code should reference tokens via `var(--cf-*)` or use the primitives.
- Content layer: `src/content/` contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json, fruits.json, loader.js, `challenge/days.json`, `assessment/fruit-questions.json`.
- Primitives in `src/components/primitives/`: Button (with tab variant), EyebrowLabel (forwardRef), SectionHeader, Card, ProgressBar, Input. All adopted across section files as of Phase 13.
- `DevotionOnboarding.jsx` component retained in `src/components/` but is no longer imported by DevotionGuide.jsx (removed in Phase 14 item 6). Available for reuse if a guided setup path is re-introduced.
