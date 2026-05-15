# Counter Formation Build State

**Last updated:** 2026-05-15
**Current phase:** Phase 4 — Design System (READY)

---

## Phase Checklist

| Phase | Name | Status | Session |
|---|---|---|---|
| 1 | Formation Profile | COMPLETE | Session 1 (2026-05-15) |
| 2 | Connection Tissue | COMPLETE | Session 2 (2026-05-15) |
| 3 | Discipleship Agent Foundation | COMPLETE | Session 3 (2026-05-15) |
| 4 | Design System | READY (independent) | — |
| 5 | Content Layer | NOT STARTED (independent) | — |

---

## Phase 1 Scope

**To build:**
- [x] `src/hooks/useFormationProfile.jsx` — the profile hook (with FormationProfileProvider context)
- [x] `src/utils/migrateFormationProfile.js` — migration from 13 legacy keys
- [x] App.jsx — FormationProfileProvider wraps app; ChallengeSlideBar updated
- [x] All 13 legacy-key write locations updated to use profile hook

**Legacy keys to migrate (confirmed locations):**

| Key | File | Type |
|---|---|---|
| `cf-declaration` | src/widgets/DeclarationWidget.jsx | widget data |
| `cf-examen-log` | src/widgets/ExamenWidget.jsx | widget data |
| `cf-peace-tracker` | src/widgets/PeacePauseWidget.jsx | widget data |
| `cf-first-fifteen` | src/widgets/FirstFifteenWidget.jsx | widget data |
| `cf-sword-current` | src/widgets/VerseTrackerWidget.jsx | widget data |
| `cf-sword-library` | src/widgets/VerseTrackerWidget.jsx | widget data |
| `cf-arrow-log` | src/widgets/ArrowLogWidget.jsx | widget data |
| `cf-sbs-progress` | src/FieldGuide.jsx | section progress |
| `cf-armor-progress-{piece}` | src/Identity.jsx | section progress |
| `cf7` | src/SevenDayChallenge.jsx | section progress |
| `LS_KEY` | src/FruitAssessment.jsx | section progress |
| `LS_DRAFT_KEY` | src/FruitAssessment.jsx | section draft |
| `cf_slidebar_dismissed` | src/App.jsx | UI dismissed state |

**Deferred (Phase 1):**
- `profile.assessment.previousResult` stores only `scores`, `completedAt`, `formationFruits`. Fields `answers`, `primaryFruit`, `primaryEvidence` are stored as empty/blank since the profile schema doesn't carry the full prior result. Delta display works for score comparison; other fields are stubs. If full prior result is needed, the schema should add a `fullResult: FruitAssessmentResult | null` field.
- `profile.challenge.startedAt` and `completedAt` cannot be recovered from legacy `cf7` key (no timestamps stored). Both remain null after migration.
- `profile.fieldGuide.currentDay` is inferred during migration from `max(completedDays) + 1`; it is an approximation if the user had previously advanced past that point.

---

## Phase 3 Scope

**To build:**
- [x] `src/components/DevotionOnboarding.jsx` — 3-question intake state machine, writes onboarding + formationEdge on completion
- [x] `src/components/DevotionHistory.jsx` — collapsible panel of last 3 devotion entries
- [x] `src/utils/devotionContext.js` — `buildDevotionContext(profile)` pure builder for `/api/generate` body
- [x] `src/DevotionGuide.jsx` — wired all three, added mode selection, history panel placement, context indicator, history write
- [x] `DEFAULT_PROFILE.onboarding` field added to `useFormationProfile.jsx` (non-breaking, deep-merge compatible)

**Deferred (Phase 3):**
- No re-entry from history into a prior devotion's full text. History panel is presence-indicator only; entries store summary, not full content. If "open this devotion again" is desired, schema needs a `content` or `shareId` field on `DevotionEntry`.
- `currentArmorDay` in the context envelope returns the most-recently-completed day, not "next day to do." The backend can decide which framing it wants; if "next day" is preferred, update `deriveCurrentArmor` to return `min(6, max(days) + 1)`.
- Context indicator only displays `formationEdge`. It does not surface current armor piece or rhythm preference. The data is already in the request envelope; if the user-facing indicator should be richer, it can be expanded without changing the contract.

---

## Architecture Decisions (in force)

1. **Profile is anonymous-by-default.** Email is stored only when user explicitly provides it (newsletter, challenge signup). No forced auth gate.
2. **localStorage-first.** No Supabase binding in Phase 1. Profile is local. Multi-device sync is a future phase.
3. **Schema version = 1.** The `_version` field in the profile root enables future migration paths.
4. **Migration runs once on first load.** After migration, legacy keys are deleted. Migration must be idempotent (re-running it does nothing if legacy keys are absent).
5. **Deep-merge for writes.** `updateProfile(patch)` merges the patch into the current profile, does not replace. This prevents partial writes from wiping unrelated fields.

---

## Deferred Items (across all phases)

- Authentication / multi-device sync (post-Phase 1)
- CMS integration (post-Phase 5)
- Drop 002.5 new content sections (post-Phase 5)
- Community pillar (post-Phase 5)
- Shopify-side QR and product improvements (separate spec)
