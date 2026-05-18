# Counter Formation Build -- Next Session

**Active plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md` (dashboard plan -- Phases 1, 1.5, 2, 3 all shipped)
**Last completed:** Session 9 -- Phase 3 (AI synthesis + apparel lane + dashboard polish) on 2026-05-18
**Up next:** Verification pass on Phase 3 in production, then return to the broader 5-theme enhancement spec at `specs/spec-site-enhancement-2026.md`.

---

## The dashboard plan is done. What's next is a choice.

All four phases of the dashboard plan are now in production:
- **Phase 1** -- conditional homepage, profile schema v3, Fruit Supabase persistence, trusted-person name fix
- **Phase 1.5** -- single-view workspace, FruitStrata + GiftConstellation extracted, /welcome toggle
- **Phase 2** -- identity layer (magic link, RLS, ConvertKit opt-in)
- **Phase 3** -- AI synthesis, apparel lane, sign-out, name-aware greeting, voice-guard

The dashboard plan has nothing left in it. The next session is a fork.

---

## How to kick off the next session

Paste one of these depending on what you want to do:

**A. Verify Phase 3 in production (recommended first).**
```
Read sessions/next.md and run the Phase 3 verification pass: spot-check /api/synthesize live, run scripts/check-synthesis-voice.js against counterformed.com, real iOS Safari test of the magic-link flow + ApparelLane scroll-snap. Report what passes and what needs fixing.
```

**B. Move to the 5-theme enhancement spec (Theme 4: Design System polish, or Theme 5: Content Layer).**
```
Read sessions/next.md, then read specs/spec-site-enhancement-2026.md and propose which of Themes 4 or 5 is the right next session. Outline the work as a phase 1 plan before touching code.
```

**C. Pick up a Discipleship Agent thread (DevotionGuide → memory + continuity).**
```
Read sessions/next.md, then read DevotionGuide.jsx and propose the first session of a Discipleship Agent build: assessment onboarding + persistent memory across devotions. Plan before code.
```

---

## Outstanding verification items from Phase 3

These are NOT blockers for new work but should be cleared before the dashboard is declared finished:

1. **Voice-guard against production.** Run `node scripts/check-synthesis-voice.js --url=https://counterformed.com` and confirm all 5 fixtures pass. If any fail, refine the system prompt in `functions/api/synthesize.js` and re-run until clean.
2. **Real iOS Safari mobile test (carried from Phase 2 + 3).**
   - Magic-link flow end-to-end on a real iPhone -- request, open in Mail, tap, confirm Safari handoff lands at `/auth/callback`, confirm dashboard hydrates.
   - ApparelLane scroll-snap on a real device -- momentum scroll, each card centers, the next one peeks at the right edge, tap opens the Shopify product URL with UTM tags preserved.
3. **Cross-device cache miss.** Sign in on a fresh browser with empty localStorage, confirm the SynthesisCard fires a fresh `/api/synthesize` call and the new reflection persists.
4. **SynthesisCard daily regeneration.** Mount the card, refresh -- confirm only one fetch fires. Update a profile field (e.g. add a declaration), refresh -- confirm a NEW fetch fires because the signature changed.

---

## Session methodology (unchanged across all phases)

Every session follows the same five steps. Don't skip any.

1. **Read state.**
   - Read `sessions/next.md` (this file) for the goal.
   - Read the active plan file referenced above for the design (if a plan exists for this session).
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
   - Append a new entry at the TOP of `sessions/log.md`.
   - Rewrite the "Up next" section of `sessions/next.md` so the following session starts cleanly.

If a session runs out of context mid-work, end with a log entry that flags `Status: in progress` and write a next.md that names exactly where to resume.

---

## Deferred items still available (from earlier work)

These predate Phase 3 and remain ready to pick up between phases:

- Phase 4 newsletter capture form refactors (4 locations).
- Phase 4 section page token migration (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, App, About).
- Phase 4 visual smoke tests for widget UX.
- Phase 5 `ARMOR_PIECES` overview array migration to armor.json.
- Phase 5 `DevotionOnboarding.jsx` local RHYTHMS constant migration.
- ApparelLane: wire selection to the profile (formation edge / active armor / top gift) instead of hardcoded curation.
- ApparelLane: Shopify Storefront API integration for live inventory and pricing.

---

## Environment notes

- Cloudflare Pages env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `KIT_API_KEY`, `KIT_FORMATION_TAG_ID` all set in production.
- Supabase Auth: `https://counterformed.com/auth/callback` (and `www` + `localhost:5173`) are in the redirect allow-list. Custom SMTP via Resend with branded Counter Formation email templates.
- RLS: enabled on `public.users`, `fruit_assessments`, `gifts_sessions`. Intentionally OFF on `gifts_trusted_tokens` and `gifts_trusted_responses` (cross-party flow, token is the access secret).
