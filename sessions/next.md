# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\phase-9-apparel-v2-const-c-cleanup.md` (Phase 9 -- ApparelLane v2 lite + const C cleanup, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Theme 5 continuation)
**Last completed:** Session 16 -- Phase 9 (ApparelLane v2 lite + const C cleanup: FruitAssessment, About, FieldGuide) on 2026-05-19
**Up next:** Phase 10 -- const C continuation + FG_CSS/FA_CSS extraction + iOS Safari test

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 10. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 9 left things

ApparelLane, FruitAssessment, About, and FieldGuide are now cleaner:

- `ApparelLane.jsx` now profile-driven: `getProfileSignal()` extracts armor + fruit edge once; `profileScore()` scores each product; `resolvedEyebrow()` generates a formation-aware eyebrow for the matched card. Fallback to original order when no profile signal.
- `const C` removed from FruitAssessment.jsx (88 usages), About.jsx (35 usages), FieldGuide.jsx (40 usages). `const F` (fonts) also removed from FruitAssessment.jsx (68 usages).
- Three new tokens added to `tokens.css`: `--cf-gold-45`, `--cf-ivory-58`, `--cf-ivory-24`.
- Build: 2066 modules (unchanged), 2057 kB (~3 kB up).

**Key gotcha for future const C cleanup sessions:** CSS vars in JSX style *object* values must be JavaScript strings (`"var(--cf-gold)"`). CSS vars in template literal CSS strings use bare CSS syntax without `${}` wrapping. The bulk regex replacement must handle both contexts; a two-pass approach works (replace C.* → bare var, then quote bare vars in JS object context, then fix default params).

Three items still open from prior phases:

**Cloudflare 502 on `/api/synthesize`.** Synthesis voice check passes. If 502s resurface: open the Cloudflare Pages dashboard for `counter-formation-web`, check Functions tab. `GEMINI_API_KEY` is no longer used and can be removed from CF environment variables.

**iOS Safari device test.** Still deferred. Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

**`CROSS_LINKS` in Identity.jsx.** In use by `CrossLinkCard`. Mixes UI routing URLs with content taglines. Leave unless a future phase decides to embed routing data in armor.json.

---

## Todo list for Phase 10

### High priority -- carried over

1. **iOS Safari test.** Manual step. Log results: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture.

### Medium priority

2. **const C continuation.** 26 files still define per-file C palette constants. Next largest by usage count:
   - `SevenDayChallenge.jsx` -- check usage count
   - `DevotionGuide.jsx` -- check usage count
   - Gifts assessment component tree (`src/components/field-guide/gifts/`) -- 10+ files, each with smaller counts
   
   Recommended approach: tackle `SevenDayChallenge.jsx` and `DevotionGuide.jsx` individually (same pattern as Phase 9), then batch the gifts tree files if their counts are small enough to do safely in one pass.
   
   **Important:** Follow the Phase 9 gotcha -- after bulk replacement, run a targeted pass to quote bare `var(--cf-*)` in JSX style object context (any `var(--cf-*)` NOT inside a template literal string or already quoted). Also check for default parameters that need string form.

3. **FG_CSS extraction.** `FieldGuide.jsx` still has `const FG_CSS` (inline CSS string, ~270 lines). Extracting to `src/styles/field-guide.css` and replacing `<style>{FG_CSS}</style>` with a Vite CSS import would be the cleanest outcome. This is a distinct refactor from the const C work.

4. **FA_CSS extraction.** Same pattern in `FruitAssessment.jsx` (`const FA_CSS`, ~100 lines). Same approach.

### Lower priority

5. **GEMINI_API_KEY removal from Cloudflare.** Manual step: remove the unused env var from the CF Pages dashboard.

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
- `cf:profile` is at schema v4. Phase 10 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- Content loader: `src/content/loader.js` exports `getAllArmorPieces`, `getArmorPiece`, `getAllRhythms`, `getRhythm`, `getFieldGuidePath`, `getFieldGuideDay`, `getFieldGuideLanding`, `getAllFruits`, `getFruit`. `armor.json` has 6 entries, `rule-of-life.json` has 5, `field-guide.json` has 7, `field-guide-landing.json` has 6 why + 4 newSections, `fruits.json` has 9.
- tokens.css now includes: `--cf-gold-45` (0.45 opacity gold), `--cf-ivory-58` (0.58 opacity ivory), `--cf-ivory-24` (0.24 opacity ivory) in addition to all prior vars.
