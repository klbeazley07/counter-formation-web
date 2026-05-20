# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\phase-10-const-c-continuation-css-extraction.md` (Phase 10 -- const C continuation + FG_CSS/FA_CSS extraction, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Theme 5 continuation)
**Last completed:** Session 17 -- Phase 10 (const C cleanup: DevotionGuide + 12 gifts components; FG_CSS/FA_CSS extracted to static .css files; DashboardBanner nav overlap fix) on 2026-05-20
**Up next:** Phase 11 -- const C final batch (10 remaining files) + DG_CSS extraction

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 11. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 10 left things

All high-priority const C files are clean. FG_CSS and FA_CSS are now static .css files imported via Vite. DashboardBanner nav overlap is fixed.

**Key gotcha for const C sessions (updated):** Replace longer key names before shorter prefix subsets. E.g., replace `C.goldFaint`, `C.goldDim`, `C.goldMid` BEFORE `C.gold`; replace `C.bgCardSoft`, `C.bgCard` BEFORE `C.bg`. A two-pass approach: (1) replace longer keys first, (2) then shorter ones. CSS vars in JSX style object values must be JS strings (`"var(--cf-gold)"`). CSS vars in template literal CSS strings use bare CSS syntax.

Three items still open from prior phases:

**Cloudflare 502 on `/api/synthesize`.** Synthesis voice check passes. If 502s resurface: check the Cloudflare Pages dashboard for `counter-formation-web`, Functions tab. `GEMINI_API_KEY` is unused and can be removed from CF environment variables.

**iOS Safari device test.** Still deferred. Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

**`CROSS_LINKS` in Identity.jsx.** In use by `CrossLinkCard`. Mixes UI routing URLs with content taglines. Leave unless a future phase decides to embed routing data in armor.json.

---

## Todo list for Phase 11

### High priority -- carried over

1. **iOS Safari test.** Manual step. Log results: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture.

### Medium priority

2. **const C final batch (10 files).** Remaining files with `const C` definitions:
   - `src/App.jsx` -- check usage count
   - `src/components/agent/AgentHistory.jsx` -- check usage count
   - `src/components/agent/AgentOnboarding.jsx` -- check usage count
   - `src/components/agent/ShortFormationAssessment.jsx` -- check usage count
   - `src/components/DevotionHistory.jsx` -- check usage count
   - `src/components/DevotionOnboarding.jsx` -- check usage count
   - `src/components/MobileTabBar.jsx` -- 2 keys, likely small
   - `src/components/visualizations/FruitStrata.jsx` -- check usage count
   - `src/components/visualizations/GiftConstellationCompact.jsx` -- check usage count
   - `src/widgets/ArrowLogWidget.jsx` -- check usage count
   
   Recommended approach: check usage counts first, then handle in batches by size. Use the same key-replacement ordering rule (longer before shorter).

3. **DG_CSS extraction.** `DevotionGuide.jsx` still has `const DG_CSS` (inline CSS string, ~50 lines). Same pattern as FG_CSS/FA_CSS -- extract to `src/styles/devotion-guide.css` and replace `<style>{DG_CSS}</style>` with a Vite CSS import.

### Lower priority

4. **GEMINI_API_KEY removal from Cloudflare.** Manual step: remove the unused env var from the CF Pages dashboard.

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
- `cf:profile` is at schema v4. Phase 11 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- tokens.css now includes: `--cf-surface-raised` (#110F0D), `--cf-gold-10` (rgba 0.10), `--cf-gold-45` (rgba 0.45), `--cf-ivory-58` (rgba 0.58), `--cf-ivory-24` (rgba 0.24) in addition to all prior vars.
- CSS files added this phase: `src/styles/field-guide.css`, `src/styles/fruit-assessment.css`. Both are imported via Vite in their respective components.
