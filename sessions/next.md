# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\faithful-anchor-still.md` (Phase 4 -- agent foundation, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Themes 4 continuation, 5)
**Last completed:** Session 13 -- Phase 6 continuation (Gemini → Claude API migration across all 5 functions) on 2026-05-19
**Up next:** Phase 7 -- ARMOR_PIECES migration + remaining Theme 5 content.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 7. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 6 left things

The design system and content migration phase is largely done:

- `NewsletterCapture` component consolidates the ConvertKit subscribe logic from SiteFooter and ChallengeModal; SevenDayChallenge now fires the POST silently on submit.
- FirstFifteenWidget has proper `aria-activedescendant` + option IDs for keyboard accessibility.
- All bare `focus:outline-none` inputs now have `focus-visible:ring` companions.
- DevotionOnboarding RHYTHMS derive from `getAllRhythms()` via the content loader.
- RuleOfLife dead `const C` removed.
- Identity.jsx three raw hex instances replaced with CSS vars.

Two items still open from Phase 6:

**Cloudflare 502 on `/api/synthesize`.** Still hitting HTTP 502 HTML Cloudflare error pages (not the function's own JSON). Manual investigation required: open the Cloudflare Pages dashboard for `counter-formation-web`, check the Functions tab for recent `/api/synthesize` errors, and verify `GEMINI_API_KEY` is set under Settings > Environment Variables. After resolving, rerun `node scripts/check-synthesis-voice.js --url=https://counterformed.com` and confirm 5/5 pass.

**iOS Safari device test.** Still deferred. Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

---

## Todo list for Phase 7

### High priority -- carried over

1. **Synthesis voice check.** Now that all 5 functions use `ANTHROPIC_API_KEY`, run `node scripts/check-synthesis-voice.js --url=https://counterformed.com` and confirm 5/5 pass.

2. **iOS Safari test.** Manual step. Log results: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture.

### Medium priority -- content migration

3. **ARMOR_PIECES migration to armor.json.** `armor.json` already has full devotional content but lacks the 7 overview summary fields Identity.jsx uses for the ring UI: `scripture`, `scriptureText`, `theology`, `tension`, `practice` (summary string), `hook`, `product`. The data lives in Identity.jsx's `const ARMOR_PIECES`. Note encoding artifacts in the source: `â€"` → `--` (per voice guide) and `Â·` → `·`. Steps: (a) extend each of the 6 entries in `armor.json` with the overview fields, fixing encoding; (b) update Identity.jsx to import `getAllArmorPieces()` from the content loader; (c) replace `const ARMOR_PIECES` with the imported array.

4. **Identity content extraction (items 8-9 from original spec).** Review what remains of the "Identity content" and "Field Guide office content" items from the original spec. These may be additional inline data constants that should move to JSON.

### Lower priority -- Theme 5 continuation

5. **ApparelLane v2.** Wire product selection to the user's formation edge / active armor / top gift instead of hardcoded curation. Shopify Storefront API integration.

6. **Remaining `const C` cleanup.** 31 files still define per-file C palette constants. This is code hygiene only -- visually correct but not referencing tokens. Most impactful files: `FruitAssessment.jsx` (88 usages), `FieldGuide.jsx` (40 usages), `About.jsx` (33 usages). A dedicated cleanup session with find-and-replace by file would be the right approach.

---

## Session methodology (unchanged)

1. **Read state.** Read `sessions/next.md`, active plan file, top of `sessions/log.md`, and `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list into TodoWrite. Mark item 1 as `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass. For things that can't be agent-tested, say so explicitly.
5. **Commit + push + handoff.** Per the standard wrap-up protocol.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID` -- all should be set. `GEMINI_API_KEY` is no longer used by any function and can be removed from the CF dashboard at any time.
- `cf:profile` is at schema v4. Phase 7 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- Content loader: `src/content/loader.js` exports `getAllArmorPieces`, `getArmorPiece`, `getAllRhythms`, `getRhythm`, `getFieldGuidePath`, `getFieldGuideDay`, `getAllFruits`, `getFruit`. `armor.json` has 6 entries, `rule-of-life.json` has 5, `field-guide.json` has 7, `fruits.json` has 9.
