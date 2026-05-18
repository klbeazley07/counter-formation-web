# Counter Formation Build -- Next Session

**Active plan:** to be written at the start of the next session (no plan file yet for this work)
**Reference specs:** `specs/spec-site-enhancement-2026.md` (Themes 2 + 3)
**Last completed:** Session 9 -- Phase 3 (AI synthesis + apparel lane + dashboard polish) on 2026-05-18
**Up next:** Phase 4 -- a single combined session: Phase 3 verification + Theme 2 connection-tissue completeness + Theme 3 Discipleship Agent foundation.

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 4 as one big session. Follow the methodology there -- write the plan file first, then work through the expanded todo list. Build, commit, push, then update sessions/log.md and sessions/next.md before ending the session.
```

That single prompt drives the whole session. The expanded todo list below is the actual work surface.

---

## Why this is one session, not three

The previous draft of this file presented three forks (verify Phase 3 / Theme 4 polish / Discipleship Agent). After thinking it through, those forks shouldn't be separate sessions:

1. The Phase 3 verification items are 60-90 minutes of work, not a full session.
2. Theme 2 (connection tissue) and Theme 3 (agent foundation) in the spec depend on each other. The Discipleship Agent's onboarding flow requires the cross-link completeness audit to be honest about where the user can go next. Splitting them costs continuity.
3. CLAUDE.md flags DevotionGuide.jsx as "the architectural seed of the Discipleship Agent" and names memory, continuity, and onboarding assessment as the long-term direction. The dashboard plan was always scaffolding for that. The strategic move now is to build the agent, not to polish the design system before the agent exists.

Theme 4 (Design System) and Theme 5 (Content Layer) remain deferred. They are local cleanups that don't change the product's strategic position. They can wait until the agent foundation is live.

---

## Expanded todo list for Phase 4

Work this list top to bottom. Items 1-4 are verification (quick). Items 5-8 close Theme 2 gaps (medium). Items 9-15 are the Discipleship Agent foundation (the bulk of the session). Items 16-18 are wrap-up.

### Verification pass on Phase 3 (live in production)

1. **Voice-guard against production.** Run `node scripts/check-synthesis-voice.js --url=https://counterformed.com`. All 5 fixtures must pass. If any fail, refine the system prompt in `functions/api/synthesize.js` and re-run until clean. Log the offending phrases in the session log for future tuning.
2. **SynthesisCard daily regeneration.** Open `/` in DevTools. Confirm exactly one `/api/synthesize` request fires on first load. Refresh -- confirm zero requests (cache hit). Update a profile field (add a declaration via DeclarationWidget). Refresh -- confirm one new request fires because the signature changed.
3. **Cross-device cache miss.** Open `/` in an incognito window. Sign in as the same user. Confirm the SynthesisCard fires a fresh `/api/synthesize` because the new browser has no `cf:synth:*` cache entry. Confirm the result persists in the new browser's localStorage.
4. **Manual flag for user:** real iOS Safari pass on (a) magic-link flow end-to-end, (b) ApparelLane scroll-snap, (c) bottom-sheet email capture. Log as a user-manual verification step in the session log -- agent can't do this directly.

### Connection tissue completeness audit (Theme 2)

5. **Audit `CROSS_LINKS` in `src/Identity.jsx`.** Spec calls for Breastplate of Righteousness to be present. Grep confirms 6 occurrences exist, but verify the sidebar actually renders cross-links for Breastplate (not just other content using the slug). If missing, add the entry alongside Belt of Truth's pattern.
6. **Audit Connected Armor for Prayer rhythm in `src/RuleOfLife.jsx`.** Spec calls this out as a gap. If the Prayer rhythm has no Connected Armor entry, add Sword of the Spirit as the canonical pairing (Word + Prayer is the historical pairing).
7. **Audit NextStep coverage at all 6 completion moments** per the spec table (lines 134-141 of `specs/spec-site-enhancement-2026.md`):
   - 7-Day Challenge Day 7 → Identity (recommended armor piece)
   - Fruit Assessment Results → Rule of Life rhythm
   - Identity Armor Piece Day 6 → next armor OR Rule of Life
   - Rule of Life Rhythm end → next rhythm
   - Field Guide Day 7 → Challenge OR DevotionGuide
   - DevotionGuide generation → save + Rule of Life prompt
   For each missing slot, add `<NextStep context="..." />`. Use `recommendForDashboard(profile)` as the reference pattern.
8. **Smoke-test the loop.** Walk a fresh profile through Fruit → Rule of Life → Identity (recommended piece) → Day 6 → Field Guide → Challenge → DevotionGuide. Confirm every transition is a forward-driven NextStep, not a silent termination.

### Discipleship Agent foundation (Theme 3)

The agent is not a chat surface. It is a stateful formation companion that surfaces at three moments: when the user has no formation baseline (onboarding), when they have a profile but no recent activity (re-engagement), and when they complete a meaningful action (continuity nudge). Each surface is a small component that draws on a shared agent context.

9. **Write the plan file first.** Before any code: `C:\Users\luke.beazley\.claude\plans\<random-three-word-slug>.md` with the agent design. Sections: agent state schema (additions to `cf:profile.agent`), the three surfaces, the prompt envelope, the writeback contract (what the agent records after each interaction), and the safety guards. The plan is the gate -- no implementation begins until it is written.
10. **Extend `cf:profile` schema to v4** with an `agent` block:
    ```json
    "agent": {
      "onboardingCompletedAt": null,
      "lastNudgeAt": null,
      "shortAssessment": null,
      "history": []
    }
    ```
    `history[]` entries are `{ at: iso, kind: "onboarding|nudge|reflection", inputs: {...}, summary: "..." }`. Cap at 30 entries (drop oldest). Add to `migrateFormationProfile.js`.
11. **Short formation assessment (3 questions)** at `src/components/agent/ShortFormationAssessment.jsx`. Three questions covering: (a) what is forming you right now, (b) where you feel resistance, (c) what you want the next 30 days to look like. Free-text input. Writes to `profile.agent.shortAssessment` and `profile.onboarding.formationFocus`. Used by the onboarding surface and by any user who has not completed the Fruit Assessment.
12. **Agent onboarding surface at `/agent/onboarding`.** Shown when `profile.agent.onboardingCompletedAt` is null AND the user has signed in OR taken any meaningful action. Renders the short assessment, then runs `/api/agent-reflect` (new endpoint) to generate a 3-4 sentence formation framing. Writes `profile.agent.onboardingCompletedAt` and routes to `/`.
13. **`functions/api/agent-reflect.js`** -- mirrors the synthesize pattern but takes `{ kind, profile, shortAssessment }` and returns `{ text, suggestedNextStep }`. Same Gemini setup, same CF voice guard. Different system prompt per kind (`onboarding` vs `nudge` vs `reflection`). Reuses `GEMINI_API_KEY`.
14. **AgentEntry component on the dashboard** at `src/components/personal/AgentEntry.jsx`. Sits below the DashboardBanner, above the workspace, ONLY when:
    - The user has agent history (returning conversation), OR
    - The user has not yet completed onboarding and has any meaningful activity.
    One-line surface with the last agent summary and a "Continue the conversation" CTA. Not a chat -- a thread anchor. Click routes to `/agent` (a future expanded surface; for v1, route to `/agent/onboarding` if no onboarding yet, otherwise to a placeholder that shows recent history).
15. **DevotionGuide context audit.** Confirm `buildDevotionContext()` (referenced in `src/utils/devotionContext.js`) is reading the full profile and passing it through to `/api/generate`. If anything is stale or missing (top gifts, recent declarations, agent shortAssessment), wire it in. The DevotionGuide should feel like the agent is writing each devotion.

### Wrap-up

16. **`npm run build` must pass.** No warnings ignored. Confirm bundle size delta is reasonable (under +80 kB versus Session 9 baseline of 2040 kB).
17. **Commit + push to main.** Two commits is fine -- one for verification + connection tissue, one for the agent foundation -- if it keeps the diffs readable. Otherwise one big commit.
18. **Log + handoff.** Append a new entry to the TOP of `sessions/log.md` with: status, plan file path, commit SHAs, what was built, schema changes (v4 bump), key decisions, anything deferred. Rewrite the "Up next" section of `sessions/next.md`. If the session runs out of context mid-work, flag `Status: in progress` and name the exact resume point.

---

## Session methodology (unchanged across all phases)

Every session follows the same five steps. Don't skip any.

1. **Read state.**
   - Read `sessions/next.md` (this file) for the goal.
   - Read the active plan file (write it first this session per step 9 above).
   - Read `sessions/log.md` (top entry only) for the most recent context.
   - Skim recent git history (`git log --oneline -10`).

2. **Plan with TodoWrite.** Mirror the expanded todo list above into TodoWrite. Mark item 1 as `in_progress` before starting.

3. **Execute.** Edit only what each item calls for. When edits diverge from the plan, update the plan file before continuing.

4. **Verify.**
   - `npm run build` must pass.
   - For frontend changes that aren't visual smoke-testable by an agent, say so explicitly in the log instead of claiming "verified."
   - Use the Supabase MCP for any DB queries needed to confirm writes/reads.

5. **Commit + push + handoff.** Per item 18 above.

---

## Estimated scope

This is a large session. Honest estimate:

- Items 1-4 (verification): 45-75 minutes.
- Items 5-8 (Theme 2 audit + gaps): 60-90 minutes.
- Items 9-15 (agent foundation): 3-5 hours.
- Items 16-18 (wrap-up): 20-30 minutes.

Total: 5-8 hours of agent work. The agent should expect to either (a) finish item 18 cleanly, or (b) flag `Status: in progress` partway through items 9-15 and write a precise resume point. Items 5-8 must complete inside the same session as items 9-15 because the agent foundation depends on the connection tissue being honest about forward steps.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID` all set in production. The new `/api/agent-reflect` endpoint reuses `GEMINI_API_KEY` -- no new env vars needed.
- Supabase Auth: `https://counterformed.com/auth/callback` (and `www` + `localhost:5173`) in the redirect allow-list. Resend SMTP, branded templates wired.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses` (cross-party flow, token is the access secret).
- `cf:profile` is at schema v3. Phase 4 bumps to v4 with the `agent` block.

---

## Deferred items still available (for sessions after Phase 4)

These remain ready to pick up once the agent foundation is live:

- Theme 4 (Design System): newsletter capture form refactors (4 locations), section page token migration (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, App, About), accessibility pass, FirstFifteen dropdown keyboard nav.
- Theme 5 (Content Layer): `ARMOR_PIECES` overview array migration to `armor.json`, `DevotionOnboarding.jsx` local RHYTHMS constant migration, Identity content extraction to `src/content/armor/*.json`, Field Guide office content, 7-Day Challenge days, Fruit Assessment questions.
- ApparelLane v2: wire selection to the profile (formation edge / active armor / top gift) instead of hardcoded curation; Shopify Storefront API integration.
- Notification emails: trusted-person completion alerts, weekly formation digest (uses the ConvertKit subscription state already on `public.users`).
