# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md`
**Last completed:** Session 7 -- Phase 1.5 (single-view dashboard + welcome toggle) on 2026-05-18
**Up next:** Phase 2 -- Identity layer (Supabase Auth magic links + email capture + ConvertKit opt-in + RLS)

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 2. Follow the methodology there -- read the plan, do the work, build, commit, push, then update sessions/log.md and sessions/next.md before ending the session.
```

That's it. The session will read this file, pick up where Session 7 left off, and follow the workflow below.

---

## Session methodology (the discipline that keeps this build coherent)

Every session follows the same five steps. Don't skip any.

1. **Read state.**
   - Read `sessions/next.md` (this file) for the goal.
   - Read the active plan file referenced above for the design.
   - Read `sessions/log.md` (top entry only) for the most recent context.
   - Skim recent git history (`git log --oneline -10`) so the current state is grounded in commits, not just memory.

2. **Plan with TodoWrite.** Break the session's work into 4-10 todos. Mark the first as `in_progress` before starting.

3. **Execute.** Edit only what the plan calls for. When edits diverge from the plan, update the plan file before continuing (don't let the plan drift silently).

4. **Verify.**
   - `npm run build` must pass.
   - For frontend changes that aren't visual smoke-testable by an agent, say so explicitly in the log instead of claiming "verified."
   - Use the Supabase MCP for any DB queries needed to confirm writes/reads.

5. **Commit + push + handoff.**
   - Commit with a descriptive message (the user has a strong commit-message preference -- see CLAUDE.md global rules).
   - Push to `main`.
   - Append a new entry at the TOP of `sessions/log.md` with: status, plan reference, commit SHA, what was built, schema changes, key decisions, anything deferred.
   - Rewrite the "Up next" section of `sessions/next.md` so the following session starts cleanly.

If a session runs out of context mid-work, end with a log entry that flags `Status: in progress` and write a next.md that names exactly where to resume.

---

## Phase 2 goal (read the plan for full detail)

Add a durable identity layer on top of the working anonymous flow. Anonymous keeps functioning exactly as it does today; email becomes an offered anchor, never demanded. Once a user authenticates, their existing Supabase rows re-key to their user_id and their data follows them across devices.

**Auth mechanism:** Supabase Auth magic link only (`supabase.auth.signInWithOtp({ email })`). No passwords, no OAuth in v1. PKCE flow to survive iOS in-app browser context switches.

**Four email-capture insertion points (all ship together):**
- After Fruit Assessment completion (modal)
- After Gifts Assessment completion (modal)
- Dashboard persistent strip (dismissable, reappears on new activity)
- After first devotion generated (slide-in card)

All four route through one shared `<EmailCapture context="..." />` component.

**ConvertKit opt-in:** After magic link is clicked and the user is authenticated for the first time, ask a single yes/no question for ongoing formation emails. Yes → call `functions/api/subscribe-convertkit.js` with profile context. Decline persists.

---

## Files Phase 2 creates (per the plan)

- `src/components/auth/EmailCapture.jsx` -- shared email-capture component, context-driven copy
- `src/components/auth/AuthCallback.jsx` -- handles `/auth/callback` post-magic-link
- `src/components/auth/ConvertKitOptIn.jsx` -- single yes/no opt-in
- `src/components/personal/SaveJourneyStrip.jsx` -- dismissable dashboard strip
- `src/utils/authBackfill.js` -- on first SIGNED_IN, re-key session_id rows to user_id; hydrate localStorage from Supabase on new devices
- `functions/api/subscribe-convertkit.js` -- ConvertKit subscriber API wrapper (check `functions/api/` first for existing ConvertKit integration to extend)
- Supabase migration: `public.users` table + `user_id` columns on all assessment tables + RLS policies

## Files Phase 2 modifies

- `src/utils/supabaseClient.js` -- pass `flowType: 'pkce'`; subscribe to `auth.onAuthStateChange` and trigger `runAuthBackfill()` on first SIGNED_IN
- `src/App.jsx` -- add `/auth/callback` route
- `src/FruitAssessment.jsx` -- render `<EmailCapture context="fruit-complete" />` on completion
- `src/components/field-guide/gifts/GiftsResults.jsx` -- render `<EmailCapture context="gifts-complete" />` once per session
- `src/components/field-guide/DevotionGuide.jsx` -- render `<EmailCapture context="first-devotion" />` after first devotion
- `src/components/personal/PersonalizedHome.jsx` -- mount `<SaveJourneyStrip />` at top when `profile.identity.userId` is null AND user has activity AND `profile.dismissed.saveJourneyStrip` is false

---

## Verification checklist for Phase 2

The plan has the full list. The non-obvious ones to make sure don't get skipped:

- **Magic link end-to-end:** request link, click from inbox, land at `/auth/callback`, confirm `cf:profile.identity.userId` populates and Supabase `public.users` has a new row.
- **Backfill:** confirm all rows in `gifts_sessions`, `gifts_trusted_tokens`, `gifts_trusted_responses`, `fruit_assessments` that match the local session_id now have `user_id` populated.
- **Cross-device:** in a second browser with empty localStorage, sign in with the same email; confirm dashboard hydrates from Supabase.
- **RLS:** with one user authenticated, attempt to read another user's row via DevTools using the anon Supabase client. Confirm denied.
- **ConvertKit:** decline persists (no double-subscription); accept lands the subscriber in ConvertKit with formation-edge tags.
- **iOS Safari real-device test:** request magic link from Safari, open the email in Apple Mail, tap link, confirm auth completes via PKCE even when opened in the Mail in-app browser.

---

## Environment notes

- Cloudflare Pages env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are already set in production.
- For Phase 2 ConvertKit: check `functions/api/` for existing ConvertKit integration. The wrangler config likely already has a `CONVERTKIT_API_KEY` secret. If not, the secret will need to be added to Cloudflare Pages.
- Supabase Auth uses the project's existing site URL for email redirect. Verify under Supabase Dashboard → Authentication → URL Configuration that `https://counterformed.com/auth/callback` is in the allow-list before testing the magic link in production.

---

## Deferred items still available (from earlier work)

These predate the dashboard plan and remain ready to pick up between phases if Luke wants a shorter session:

- Phase 4 newsletter capture form refactors (4 locations).
- Phase 4 section page token migration (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, App, About).
- Phase 4 visual smoke tests for widget UX.
- Phase 5 `ARMOR_PIECES` overview array migration to armor.json.
- Phase 5 `DevotionOnboarding.jsx` local RHYTHMS constant migration.

---

## After Phase 2

Phase 3 of the dashboard plan: AI synthesis endpoint (`functions/api/synthesize.js`) + apparel surface + polish. The plan has full detail.
