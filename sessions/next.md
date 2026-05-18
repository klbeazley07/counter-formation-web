# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md`
**Last completed:** Session 8 -- Phase 2 (identity layer, magic link, RLS, ConvertKit) on 2026-05-18
**Up next:** Phase 3 -- AI synthesis endpoint + apparel surface + polish

---

## How to kick off the next session

Open Claude Code in this repo and paste:

```
Read sessions/next.md and execute Phase 3. Follow the methodology there -- read the plan, do the work, build, commit, push, then update sessions/log.md and sessions/next.md before ending the session.
```

That's it. The session will read this file, pick up where Session 8 left off, and follow the workflow below.

---

## Before Phase 3 ships -- two manual config items left over from Phase 2

Phase 2 is in code and pushed. Two production-environment touches need to happen for the magic-link flow to actually work end-to-end. These don't block Phase 3 starting, but the user should do them when convenient:

1. **Supabase Auth → Authentication → URL Configuration:** add `https://counterformed.com/auth/callback` (and `http://localhost:5173/auth/callback` for dev) to the redirect allow-list.
2. **Cloudflare Pages → Settings → Environment variables (Production):** add `KIT_API_KEY` (Kit / ConvertKit v3 API key) and `KIT_FORMATION_TAG_ID` (numeric tag id for formation-edge subscribers). Optional: `KIT_FORM_ID` for double-opt-in.

If neither is set, the app still functions -- the opt-in just no-ops silently. Anonymous flow continues to work regardless.

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

## Phase 3 goal (read the plan for full detail)

Phase 3 finishes the dashboard: it makes the SynthesisCard live with an AI-generated reflection, adds the apparel surface below the workspace fold, and polishes the experience (greeting, micro-interactions, mobile review, voice-guard).

**AI synthesis (`functions/api/synthesize.js`):**

Cloudflare Pages Function that takes a profile payload and returns a 2-4 sentence formation reflection. Mirrors the pattern of `functions/api/generate.js`. Uses the Counter Formation voice system prompt -- earnest, direct, theologically grounded, no AI tells, no em dashes, no "It's not X, it's Y."

System prompt sketch (from the plan):
> You write in the voice of Counter Formation: earnest, direct, theologically grounded, no AI tells. Read the formation profile and write 2 to 4 sentences that name where the person is right now. Do not list their data back to them. Speak to them. Reference one or two specific things from their profile -- a formation edge, a current armor piece, a recent declaration, a top gift. Never use em dashes. Never use "It's not X, it's Y." Never open with "In this season." End with a sentence that gestures toward what is next without commanding it.

**Caching:** Key the synthesis to `${profileSignature}-${date}` so it regenerates daily or on profile update, not on every render. Simple JSON.stringify hash of completion timestamps + most recent devotion timestamp.

**SynthesisCard wiring:** the existing card currently shows placeholder Phase 1 copy. Replace the body with a fetch to `/api/synthesize`. Fall back gracefully to the rule-based copy on error.

**ApparelLane (deferred from Phase 1.5):**

Lives BELOW the workspace dashboard, not inside the single-view fold. On desktop this is the section visible after scrolling past the dashboard; on mobile it's the final stacked section before the MobileTabBar's padding.

Three curated products tagged to formation areas. Hardcoded curated set for v1 with a TODO to wire to the Shopify Storefront API later. Horizontal scroll on mobile with `scroll-snap-type: x mandatory` so cards align centered as the user swipes. Cards are 78vw wide so the next one peeks at the right edge.

**Polish pass:**
- DashboardBanner greeting: time-of-day plus name if `profile.identity.displayName` is set (otherwise unaddressed).
- Sign-out link in PersonalizedHome footer when authenticated.
- Voice-guard fixture: small Node script at `scripts/check-synthesis-voice.js` that feeds sample profiles to the synthesis endpoint and asserts no banned phrases (em dashes, "It's not X, it's Y", "leverage", "journey" as a noun, etc.). Aligns with the global voice rules in CLAUDE.md.

---

## Files Phase 3 creates (per the plan)

- `functions/api/synthesize.js` -- Cloudflare Pages function for AI synthesis (Gemini, mirror of generate.js)
- `src/components/personal/ApparelLane.jsx` -- horizontal-scroll apparel band
- `src/utils/profileSignature.js` -- compact hash for cache keying
- `scripts/check-synthesis-voice.js` -- voice-guard fixture
- `src/components/personal/SignOutLink.jsx` -- small sign-out affordance in the footer when authenticated

## Files Phase 3 modifies

- `src/components/personal/SynthesisCard.jsx` -- swap placeholder copy for `/api/synthesize` fetch, with daily cache + graceful fallback
- `src/components/personal/DashboardBanner.jsx` -- name-aware greeting if `profile.identity.displayName` is set
- `src/components/personal/PersonalizedHome.jsx` -- mount `<ApparelLane />` below the workspace; mount `<SignOutLink />` when authenticated
- `wrangler.toml` / Cloudflare Pages env -- ensure `GEMINI_API_KEY` is already set (it is, generate.js uses it)

---

## Verification checklist for Phase 3

- **Synthesis API:** curl `/api/synthesize` with a mock profile, confirm 2-4 sentence output with no em dashes, no banned phrases.
- **Voice-guard:** `node scripts/check-synthesis-voice.js` passes on a fixture set of 3-5 representative profiles.
- **SynthesisCard daily caching:** mount the card, refresh, confirm only one fetch fires. Update a profile field and confirm a new fetch.
- **Apparel lane on mobile:** real iOS Safari device test -- horizontal scroll has momentum, scroll-snap aligns each card, tap opens the Shopify product URL with UTM tags preserved.
- **Apparel lane on desktop:** sits cleanly below the workspace fold; doesn't break the single-view discipline of the dashboard above.
- **Sign-out:** authenticated user clicks sign-out, returns to anonymous state, `cf:profile.identity.userId` cleared, dashboard still renders (using the local data that's now identity-less).

---

## Environment notes

- Cloudflare Pages env vars `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` are already set in production. Phase 3's synthesis function reuses `GEMINI_API_KEY`.
- Phase 2 ConvertKit env still pending (see top of file). Not a blocker for Phase 3.

---

## Deferred items still available (from earlier work)

These predate the dashboard plan and remain ready to pick up between phases if Luke wants a shorter session:

- Phase 4 newsletter capture form refactors (4 locations).
- Phase 4 section page token migration (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, App, About).
- Phase 4 visual smoke tests for widget UX.
- Phase 5 `ARMOR_PIECES` overview array migration to armor.json.
- Phase 5 `DevotionOnboarding.jsx` local RHYTHMS constant migration.

---

## After Phase 3

The dashboard plan ships. Phase 4+ work returns to the broader 5-theme enhancement spec at `specs/spec-site-enhancement-2026.md`: Connection Tissue, Design System polish, Content Layer. The Discipleship Agent thread (DevotionGuide → memory, continuity, onboarding assessment) becomes a candidate next direction once Phase 3 closes.
