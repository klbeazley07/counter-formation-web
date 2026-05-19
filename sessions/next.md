# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\faithful-anchor-still.md` (Phase 4 -- agent foundation, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Theme 5 continuation)
**Last completed:** Session 14 -- Phase 7 (ARMOR_PIECES migration + synthesis voice check) on 2026-05-19
**Up next:** Phase 8 -- Identity content cleanup + Theme 5 lower-priority items.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 8. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 7 left things

The ARMOR_PIECES migration is complete:

- `armor.json` now carries all 7 overview fields per piece (`scripture`, `scriptureText`, `theology`, `tension`, `practice`, `hook`, `product`). Encoding artifacts fixed.
- `Identity.jsx` imports `getAllArmorPieces()` from the content loader. The 62-line inline `const ARMOR_PIECES` array is gone.
- Synthesis voice check: 5/5 pass against production. Anthropic API migration confirmed working.

Two items still open from prior phases:

**Cloudflare 502 on `/api/synthesize`.** Synthesis voice check passes, so this may be resolved. If 502s resurface: open the Cloudflare Pages dashboard for `counter-formation-web`, check the Functions tab for recent `/api/synthesize` errors. `GEMINI_API_KEY` is no longer used and can be removed from CF environment variables at any time.

**iOS Safari device test.** Still deferred. Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

---

## Todo list for Phase 8

### High priority -- carried over

1. **iOS Safari test.** Manual step. Log results: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture.

### Medium priority -- Identity content cleanup

2. **Identity content extraction (spec items 8-9).** Review `Identity.jsx` for remaining inline data constants that should move to JSON. Candidates: any arrays or objects defining content (not UI state or layout constants). The `C` palette constant and `PIECE_ORDER` are intentionally kept -- `C` is UI-only, `PIECE_ORDER` is used by sub-page components at module scope. Look for anything else that mirrors armor/formation content.

3. **Field Guide office content (spec item 9).** Review `FieldGuide.jsx` for any inline content arrays that should move to `field-guide.json`. Read the spec for what "office content" refers to before touching anything.

### Lower priority -- Theme 5 continuation

4. **ApparelLane v2.** Wire product selection to the user's formation edge / active armor / top gift instead of hardcoded curation. Requires Shopify Storefront API integration. This is a full sub-feature -- assess scope before starting.

5. **Remaining `const C` cleanup.** 31 files still define per-file C palette constants (pure code hygiene, visually correct). Most impactful: `FruitAssessment.jsx` (88 usages), `FieldGuide.jsx` (40 usages), `About.jsx` (33 usages). A dedicated cleanup session with find-and-replace by file is the right approach.

---

## Session methodology (unchanged)

1. **Read state.** Read `sessions/next.md`, active plan file, top of `sessions/log.md`, and `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list into TodoWrite. Mark item 1 as `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass. For things that can't be agent-tested, say so explicitly.
5. **Commit + push + handoff.** Per the standard wrap-up protocol.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID` -- all should be set. `GEMINI_API_KEY` is no longer used and can be removed.
- `cf:profile` is at schema v4. Phase 8 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- Content loader: `src/content/loader.js` exports `getAllArmorPieces`, `getArmorPiece`, `getAllRhythms`, `getRhythm`, `getFieldGuidePath`, `getFieldGuideDay`, `getAllFruits`, `getFruit`. `armor.json` has 6 entries (now with full overview fields), `rule-of-life.json` has 5, `field-guide.json` has 7, `fruits.json` has 9.
