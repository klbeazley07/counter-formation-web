# Counter Formation Build — Post-Phase 5: Next Directions
**All five enhancement phases are complete as of 2026-05-15.**

---

## What was built (all five phases, all complete)

- **Phase 1:** `useFormationProfile` hook + provider + 13-key migration. All section and widget files write through the profile.
- **Phase 2:** `NextStep.jsx` + `formationRecommendation.js`. Live at four transition moments (challenge complete, assessment complete, armor piece complete, field guide complete).
- **Phase 3:** `DevotionOnboarding.jsx`, `DevotionHistory.jsx`, `devotionContext.js`. `DevotionGuide.jsx` is stateful with onboarding gate, mode selection, context threading, and history write.
- **Phase 4:** `tokens.css` + 7 primitives + `WidgetFrame`. All six widgets refactored. Tailwind extends to CSS variables.
- **Phase 5:** `src/content/*.json` + `loader.js`. All formation content extracted from JSX into typed JSON files. Identity.jsx, RuleOfLife.jsx, and FieldGuide.jsx read from the loader.

---

## Deferred items from prior phases (available to pick up)

These were explicitly deferred and documented. They are ready to be addressed whenever Luke wants.

**Phase 4 deferred:**
- Newsletter capture form refactors (4 locations: App.jsx ×2, SiteFooter.jsx, SevenDayChallenge.jsx). Waiting on a `MarketingInput`/`MarketingButton` primitive design decision.
- Section page token migration (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, App, About). Their per-file `C` constants have not been migrated to `var(--cf-*)` tokens.
- Visual smoke tests for widget UX (PeacePauseWidget edit panel, ArrowLogWidget expanded portal, FirstFifteenWidget keyboard nav).

**Phase 5 deferred:**
- `ARMOR_PIECES` overview array in Identity.jsx (gallery ring data) stays inline — not in scope for Phase 5 but could be migrated to armor.json.
- `DevotionOnboarding.jsx` local RHYTHMS constant — if all rhythm content should live solely in `rule-of-life.json`, this local copy needs to be replaced with a loader call.

---

## Recommended next direction: net-new content and features

All five phases were infrastructure and architecture. The site now has a formation profile, connection tissue, an agent foundation, a design system, and a content layer. The next logical work is content expansion and new features built on top of that infrastructure.

**Option A: Drop 002.5 content sections**
Add the next content drop that was planned post-Phase 5. This would introduce new armor tracks, rhythm expansions, or devotional series built entirely on the new JSON/loader system. No JSX surgery needed — just JSON additions and loader count updates.

**Option B: CMS integration**
Replace `src/content/*.json` with a lightweight CMS (Sanity, Contentful, or similar). The loader already provides the abstraction boundary — swapping JSON imports for fetch calls is a contained change. This would enable Luke to update formation content without touching code.

**Option C: Community pillar**
Build the community dimension that has been deferred since the audit — shared formation tracking, peer accountability, or a group devotion mode built on top of the existing formation profile shape.

**Option D: Supabase / cloud sync**
The formation profile is currently localStorage-only. Adding a Supabase backend would enable multi-device sync and persistent history. Phase 1 was explicitly designed to make this a bounded swap — the profile hook is the only boundary that would need to change.

---

## How to start the next session

Open this file and type: `review next.md and execute`

Or specify a direction: `review next.md — let's do Option A` (or B, C, D).

If picking up a deferred item instead, say: `pick up the newsletter form refactor` or `migrate section pages to tokens`.
