# Counter Formation Build -- Next Session

**Last completed:** Session 20 -- Phase 13 (Primitives adoption + accessibility sweep) on 2026-05-20
**Up next:** Phase 14 -- Connection Tissue completion + Agent Foundation.

Phase 13 closed the design system work. Primitives are adopted across section files; accessibility pass done for nav + modals. The remaining stretch target (Identity.jsx < 1000 lines) depends on content extraction that belongs with Phase 14's scope, not a standalone cleanup session.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 14. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push after each item. Update sessions/log.md and sessions/next.md.
```

---

## Phase 14 -- Connection Tissue completion + Agent Foundation

**Goal:** Close the remaining Phase 2 spec items (connection tissue between sections) and begin Phase 3 (agent foundation -- DevotionGuide becomes stateful).

**Why this ordering:** The primitives system is now clean. Connection tissue (NextStep placements, formation path) is the next highest-leverage work per the original spec dependency graph. Agent Foundation (Phase 3) depends on profile data that is already in place.

**Pre-flight audit needed before writing the plan file:**
- Read `src/utils/formationRecommendation.js` and `src/components/NextStep.jsx` to check current state
- Check Identity.jsx for whether `<NextStep context="armor-piece-complete">` is already placed at Day 6 end-of-track
- Check FieldGuide.jsx for whether a `<NextStep context="field-guide-complete">` exists at the Day 7 screen
- Check Identity.jsx CROSS_LINKS for whether Breastplate of Righteousness is mapped
- Check RuleOfLife.jsx rule-of-life.json for whether Prayer rhythm has a `connectedArmor` entry

**Items in scope:**

### Connection Tissue (Phase 2 spec items not yet confirmed complete)

1. **Field Guide Day 7 completion card.** After the user completes the last office (Field Guide day 7), show a `<NextStep context="field-guide-complete" />` card. Check if this is already in FieldGuide.jsx; if not, add it. The formationRecommendation.js rules engine already has the logic for challenge-complete and assessment-complete -- extend it for field-guide-complete.

2. **Identity armor piece end-of-track NextStep.** Day 6 of each armor piece track should surface a "what's next" moment rather than silence. Add `<NextStep context="armor-piece-complete" pieceSlug={piece} />` at the end of the final day's content in Identity.jsx. The qr-arrival context (added in Phase 12) already demonstrates the pattern.

3. **CROSS_LINKS + Prayer rhythm audit.** Confirm Breastplate of Righteousness is in the `ARMOR_PIECE_CROSS_LINKS` reverse map in Identity.jsx. Confirm Prayer rhythm in rule-of-life.json has a `connectedArmor` entry. Add if missing.

### Agent Foundation (Phase 3 spec items)

4. **DevotionGuide profile reading.** DevotionGuide.jsx currently receives `profile` but may not be using `profile.assessment` or `profile.widgets.devotions` to contextualize the generation request. Update the `/api/generate` call to include the formation context envelope: `{ fruits: profile.assessment?.fruits, formationEdge: profile.assessment?.formationEdge, completedDays: profile.challenge?.completedDays }`. Backend function may need updating.

5. **DevotionGuide returning user "Continue" mode.** If `profile.widgets.devotions` has entries, show the last entry's prompt/response before the new-prompt form with a "Continue from yesterday" collapsed view. This is the minimum history panel from the Phase 3 spec.

6. **DevotionGuide first-time onboarding.** If `profile.assessment.completedAt === null`, show a short orientation card before the devotion form. Two options to offer: (a) "Start the Fruit Assessment first" → links to FruitAssessment, (b) "Jump in without assessment" → shows the form. This removes the blank-form cold-start experience for new users.

### Optional: Identity.jsx content extraction (stretch)

7. **Identity.jsx armor content to JSON (stretch).** Identity.jsx is at 2173 lines. The armor piece day content (devotional text, scripture, reflection questions per day per piece) is the main bulk. Extracting to `src/content/armor.json` (which already exists) would push toward the Phase 5 spec target of < 1000 lines. Only worth doing if the other items are complete -- this is the most time-intensive item.

**Acceptance for Phase 14:**
- NextStep shows at Field Guide Day 7 completion
- NextStep shows at armor piece Day 6 completion
- DevotionGuide generation request includes formation profile context
- DevotionGuide returning users see their last entry
- DevotionGuide first-time users see an orientation card
- Build passes

---

## Carry-overs (still open, manual)

- **iOS Safari device test.** Manual. Test (a) magic-link end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Log pass/fail.
- **GEMINI_API_KEY removal from Cloudflare Pages env.** Manual dashboard step.
- **Arrow Log 502 follow-up.** The robust-JSON fix went out in Session 19. If the 502 persists despite the new `extractJson()`, the most likely remaining cause is upstream Anthropic 5xx (overloaded). Consider migrating arrow-log.js to Claude's tool use API for true structured output -- much more reliable than prompt-based JSON.

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
- `cf:profile` schema currently v5 (bumped in Session 19, Phase 12 Item 2). Phase 14 does not require a schema bump unless DevotionGuide adds a new `devotions` array to the profile.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`, `challenge.css` (new, added Phase 13). All section CSS is now static files -- no `<style>{TEMPLATE}</style>` in component files.
- All `const C` palette constants removed from src/. `npm run lint:tokens` enforces this. New code should reference tokens via `var(--cf-*)` or use the primitives.
- Content layer: `src/content/` contains armor.json, field-guide.json, field-guide-landing.json, rule-of-life.json (with `connectedArmor` per rhythm), fruits.json, loader.js, `challenge/days.json`, `assessment/fruit-questions.json`.
- Primitives in `src/components/primitives/`: Button (with tab variant), EyebrowLabel (forwardRef), SectionHeader, Card, ProgressBar, Input. All adopted across section files as of Phase 13.
