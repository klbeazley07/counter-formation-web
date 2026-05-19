# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\phase-8-content-cleanup.md` (Phase 8 -- Identity cleanup + FieldGuide extraction, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Theme 5 continuation)
**Last completed:** Session 15 -- Phase 8 (Identity dead code removal + FieldGuide content extraction) on 2026-05-19
**Up next:** Phase 9 -- ApparelLane v2 scoping / const C cleanup / iOS Safari test

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 9. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 8 left things

Identity.jsx and FieldGuide.jsx are now cleaner:

- `ARMOR_PIECE_TITLES` and `WIDGET_META` removed from `Identity.jsx` -- both were dead code (defined, never referenced).
- `WHY` and `NEW_SECTIONS` extracted from `FieldGuide.jsx` to `src/content/field-guide-landing.json`. Loader exports `getFieldGuideLanding()`. FieldGuide.jsx destructures from the loader at module scope. No visual change.
- Build: 2066 modules (+1), 2054 kB (unchanged).

Three items still open from prior phases:

**Cloudflare 502 on `/api/synthesize`.** Synthesis voice check passes, so this may be resolved. If 502s resurface: open the Cloudflare Pages dashboard for `counter-formation-web`, check the Functions tab for recent `/api/synthesize` errors. `GEMINI_API_KEY` is no longer used and can be removed from CF environment variables.

**iOS Safari device test.** Still deferred. Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

**`CROSS_LINKS` in Identity.jsx.** This constant is in use by `CrossLinkCard`. It mixes UI routing URLs with content taglines. Leave it unless a future phase decides to embed routing data in armor.json.

---

## Todo list for Phase 9

### High priority -- carried over

1. **iOS Safari test.** Manual step. Log results: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture.

### Medium priority

2. **ApparelLane v2.** Wire product selection to the user's formation edge / active armor / top gift instead of hardcoded curation. Requires Shopify Storefront API integration. Scope from Phase 8 assessment:
   - Read `cf:profile` fields: `fruitScores`, `identity.armorEdge`, `gifts.top`
   - Shopify Storefront API query by product tag (e.g., `armor:belt-of-truth`)
   - Recommendation rule engine (small, ~10-15 lines)
   - Fallback to current hardcoded curation when profile fields are absent
   - This is a full sub-feature -- write a sub-plan before touching ApparelLane.jsx

### Lower priority

3. **Remaining `const C` cleanup.** 31 files still define per-file C palette constants (pure code hygiene, visually correct). Most impactful: `FruitAssessment.jsx` (88 usages), `FieldGuide.jsx` (40 usages), `About.jsx` (33 usages). A dedicated per-file find-and-replace session is the right approach.

4. **Further content extraction.** FieldGuide.jsx is 759 lines (target under 400). The main remaining contributor to line count after WHY/NEW_SECTIONS removal is `FG_CSS` (inline CSS string). Extracting that to a `.css` file would make a larger dent but is a distinct refactor from content extraction.

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
- `cf:profile` is at schema v4. Phase 9 does not require a schema bump unless ApparelLane v2 needs to write back a `products.recommended` field.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- Content loader: `src/content/loader.js` exports `getAllArmorPieces`, `getArmorPiece`, `getAllRhythms`, `getRhythm`, `getFieldGuidePath`, `getFieldGuideDay`, `getFieldGuideLanding`, `getAllFruits`, `getFruit`. `armor.json` has 6 entries, `rule-of-life.json` has 5, `field-guide.json` has 7, `field-guide-landing.json` has 6 why + 4 newSections, `fruits.json` has 9.
