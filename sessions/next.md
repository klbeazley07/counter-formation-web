# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\phase-11-const-c-final-batch-dg-css.md` (Phase 11 -- const C final batch + DG_CSS extraction, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md`
**Last completed:** Session 18 -- Phase 11 (const C cleanup: 12 files + DG_CSS extraction) on 2026-05-20
**Up next:** Phase 12 -- design system contract hardening + carry-over items, OR pick the next theme from the 2026 enhancement spec.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 12. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 11 left things

Zero `const C` palette definitions remain in src/. All colors flow through `src/styles/tokens.css` via `var(--cf-*)` references or are inlined as literal hex/rgba where no token applies. Three CSS extractions are done (FG_CSS, FA_CSS, DG_CSS); inline `<style>{...}</style>` for app-section CSS is no longer used in those three sections.

**Carry-over from prior phases (still open):**

1. **iOS Safari device test.** Manual step. Test on a real iOS device: (a) magic-link end-to-end, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

2. **Cloudflare 502 on `/api/synthesize`.** Synthesis voice check passes. If 502s resurface: check the CF Pages dashboard for `counter-formation-web`, Functions tab.

3. **`GEMINI_API_KEY` removal from Cloudflare.** Manual: remove the unused env var from the CF Pages dashboard.

4. **`CROSS_LINKS` in Identity.jsx.** In use by `CrossLinkCard`. Mixes UI routing URLs with content taglines. Leave unless a future phase decides to embed routing data in armor.json.

---

## Suggestions for Phase 12

The const C / inline-CSS refactor stream is finished. The next phase should either harden the design-system contract or pick up a theme from the enhancement spec. Three candidate directions:

### Option A -- Design system contract hardening (small, focused)

- **Audit residual hex literals.** With const C gone, what hex/rgba literals remain in src/? `grep -rn '#[0-9A-Fa-f]\{3,6\}\|rgba(' src/ --include="*.jsx"` will reveal them. Categorize: (a) hex-alpha concats inlined this phase (acceptable), (b) one-off color-state literals (acceptable), (c) drift that should become tokens. Add tokens only where a value appears 3+ times across files.
- **Add a contract test.** `sessions/contracts.md` documents the design-system contract. Consider a build-time grep test that fails CI if a file reintroduces `const C = {`. Cheap insurance.
- **`tokens.css` cleanup.** Are any tokens now unused? `grep -rln "var(--cf-gold-glow)" src/` etc. Sweep and remove dead tokens.

### Option B -- Continue with enhancement spec themes

Reference `specs/spec-site-enhancement-2026.md`. After Phase 9's ApparelLane v2 lite, the remaining themes are queued. Check the spec for the next sequenced item -- likely Connection Tissue or Agent Foundation work.

### Option C -- Agent surface continuity

From the auto-memory: `/agent history page not yet built` is a known gap in the discipleship-agent foundation. The schema, onboarding, and AgentEntry surface exist; history is the missing piece. Could be a self-contained phase.

---

## Session methodology (unchanged)

1. **Read state.** Read `sessions/next.md`, active plan file, top of `sessions/log.md`, and `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list into TodoWrite. Mark item 1 as `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass. For things that can't be agent-tested, say so explicitly.
5. **Commit + push + handoff.** Per the standard wrap-up protocol.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID`. `GEMINI_API_KEY` is unused and should be removed.
- `cf:profile` is at schema v4.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
- CSS files in `src/styles/`: `tokens.css`, `field-guide.css`, `fruit-assessment.css`, `devotion-guide.css`.
- All section CSS now lives in static `.css` files (no more `<style>{TEMPLATE_LITERAL}</style>` in section components).
