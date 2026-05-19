# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\faithful-anchor-still.md` (Phase 4 -- agent foundation, complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Themes 3 continuation, 4, 5)
**Last completed:** Session 11 -- Phase 5 (agent history page + nudge surfaces) on 2026-05-18
**Up next:** Phase 6 -- infrastructure triage + iOS Safari + Theme 4 design system.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 6. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 5 left things

The agent UX loop is now complete:

- `/agent` history page exists (`AgentHistory.jsx`) -- shows all history entries with kind badge, date, summary.
- `AgentEntry.jsx` has three states: onboarding CTA, nudge state (inline API call + result display), and history state (last summary + "Continue" → `/agent`).
- The returning-user loop is fixed. A user who has completed onboarding clicks "Continue" and lands on `/agent`, not `/agent/onboarding`.
- `shouldNudge(profile)` fires when onboarding is done and lastNudgeAt is >7 days ago.

One item remains open from Phase 5:

**Voice-guard 502s in production.** The `thinkingBudget: 0` fix is correctly deployed in the code, but `/api/synthesize` is returning HTTP 502 HTML Cloudflare error pages (not the function's own JSON 502). This means the function is failing at the Cloudflare edge level before the function handler runs. Most likely causes:
- Cloudflare Pages free tier CPU limit being exceeded
- GEMINI_API_KEY environment variable missing or invalid in the production Pages project
- A Pages deployment error that hasn't been caught

Manual investigation needed: open the Cloudflare Pages dashboard for `counter-formation-web`, check the Functions tab for recent error logs on `/api/synthesize`.

---

## Todo list for Phase 6

### High priority -- infrastructure triage

1. **Cloudflare Pages 502 investigation.** Manually check the Cloudflare dashboard. If it's a missing env var, add it. If it's a CPU/timeout issue, look at the function's wall clock usage. After fixing, rerun `node scripts/check-synthesis-voice.js --url=https://counterformed.com` and confirm all 5 pass.

2. **iOS Safari device test.** Manual step (can't be automated). Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail.

### Medium priority -- Theme 4 (Design System)

3. **Newsletter capture form refactors.** The email capture form exists in 4 locations. Audit and consolidate into a single `NewsletterCapture` component. Deduplicates the ConvertKit POST logic.

4. **Accessibility pass.** FirstFifteen dropdown keyboard nav. Tab order on the dashboard. Focus states on all interactive elements.

5. **Section page token migration.** Ensure all page-level backgrounds, borders, and typography reference the brand token constants rather than inline hex values.

### Lower priority -- Theme 5 (Content Layer)

6. `ARMOR_PIECES` array migration to `armor.json`
7. `DevotionOnboarding.jsx` RHYTHMS constant migration
8. Identity content extraction
9. Field Guide office content

### Deferred from earlier phases

10. **ApparelLane v2:** Wire selection to the profile's formation edge / active armor / top gift instead of hardcoded curation; Shopify Storefront API integration.

---

## Session methodology (unchanged)

1. **Read state.** Read `sessions/next.md`, active plan file, top of `sessions/log.md`, and `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list into TodoWrite. Mark item 1 as `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass. For things that can't be agent-tested, say so explicitly.
5. **Commit + push + handoff.** Per the standard wrap-up protocol.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID` -- all should be set. The 502s on `/api/synthesize` suggest `GEMINI_API_KEY` may need verification in the dashboard.
- `cf:profile` is at schema v4. Phase 6 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
