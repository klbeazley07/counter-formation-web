# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\faithful-anchor-still.md` (Phase 4 -- agent foundation, now complete)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Themes 3 continuation, 4, 5)
**Last completed:** Session 10 -- Phase 4 (verification + connection tissue + Discipleship Agent foundation) on 2026-05-18
**Up next:** Phase 5 -- Agent continuation: `/agent` history surface, nudge surfaces, and iOS Safari device verification.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 5. Follow the methodology -- write the plan file first, then work through the todo list. Build, commit, push, then update sessions/log.md and sessions/next.md.
```

---

## Where Phase 4 left things

The Discipleship Agent foundation is live. The three core files are in place:
- `src/components/agent/ShortFormationAssessment.jsx`
- `src/components/agent/AgentOnboarding.jsx` (at `/agent/onboarding`)
- `src/components/personal/AgentEntry.jsx` (mounted on the dashboard)
- `functions/api/agent-reflect.js`

The profile is at v4 with the `agent` block. The `generate.js` endpoint now consumes formation context (topGifts, agentFocus) from `buildDevotionContext`.

One gap logged in the session: `AgentEntry`'s "Continue" CTA for returning users (those who have completed onboarding) routes to `/agent/onboarding` as a fallback because the `/agent` history surface does not yet exist. This creates a loop for returning users -- they complete onboarding, return to the dashboard, see the "Continue" CTA, click it, and land back at the onboarding page they already completed (which immediately redirects to `/` because onboardingCompletedAt is set). Not broken, but wrong UX.

---

## Todo list for Phase 5

### High priority -- complete the agent UX loop

1. **Voice-guard post-deploy check.** Run `node scripts/check-synthesis-voice.js --url=https://counterformed.com`. All 5 fixtures should now pass with the `thinkingBudget:0` fix deployed. Log the results. If any fail, refine the synthesize.js system prompt and redeploy.

2. **`/agent` history page.** Create `src/components/agent/AgentHistory.jsx` and wire it to `/agent` in `App.jsx`. This is a simple read-only page: shows the user's `profile.agent.history` entries in reverse-chronological order (kind badge, date, summary). No interaction required beyond display. A "Take a new assessment" CTA routes to `/agent/onboarding`. Update `AgentEntry.jsx` to route to `/agent` for returning users (those with `onboardingCompletedAt` set) instead of `/agent/onboarding`.

3. **iOS Safari device test.** Manual step (can't be automated). Test: (a) magic-link end-to-end on real iOS Safari, (b) ApparelLane scroll-snap behavior, (c) bottom-sheet email capture. Log pass/fail in the session log.

### Medium priority -- nudge surfaces

4. **Nudge trigger logic.** Add a `shouldNudge(profile)` utility: returns true when `profile.agent.onboardingCompletedAt` is set AND `lastNudgeAt` is more than 7 days ago AND the user has meaningful activity. Place the check in `AgentEntry.jsx` so the entry surface can display a nudge-mode state (distinct copy from the onboarding CTA and the history state).

5. **Nudge generation.** When the user clicks the nudge CTA, POST to `/api/agent-reflect` with `kind: "nudge"`. Write the result back to `profile.agent.history` and update `lastNudgeAt`. Display the nudge text in the AgentEntry surface (inline, no navigation).

### Lower priority -- deferred from Phase 4

6. **Theme 4 (Design System):** Newsletter capture form refactors (4 locations), section page token migration, accessibility pass, FirstFifteen dropdown keyboard nav.

7. **Theme 5 (Content Layer):** `ARMOR_PIECES` array migration to `armor.json`, `DevotionOnboarding.jsx` RHYTHMS constant migration, Identity content extraction, Field Guide office content.

8. **ApparelLane v2:** Wire selection to the profile's formation edge / active armor / top gift instead of hardcoded curation; Shopify Storefront API integration.

---

## Session methodology (unchanged)

1. **Read state.** Read `sessions/next.md`, active plan file, top of `sessions/log.md`, and `git log --oneline -10`.
2. **Plan with TodoWrite.** Mirror the todo list into TodoWrite. Mark item 1 as `in_progress` before starting.
3. **Execute.** Edit only what each item calls for.
4. **Verify.** `npm run build` must pass. For things that can't be agent-tested, say so explicitly.
5. **Commit + push + handoff.** Per the standard wrap-up protocol.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID` -- all set. No new env vars needed for Phase 5.
- `cf:profile` is at schema v4. Phase 5 does not require a schema bump.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses`.
