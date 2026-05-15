# Counter Formation Build State

**Last updated:** 2026-05-15
**Current phase:** Phase 5 — Content Layer (READY)

---

## Phase Checklist

| Phase | Name | Status | Session |
|---|---|---|---|
| 1 | Formation Profile | COMPLETE | Session 1 (2026-05-15) |
| 2 | Connection Tissue | COMPLETE | Session 2 (2026-05-15) |
| 3 | Discipleship Agent Foundation | COMPLETE | Session 3 (2026-05-15) |
| 4 | Design System | COMPLETE | Session 4 (2026-05-15) |
| 5 | Content Layer | COMPLETE | Session 5 (2026-05-15) |

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

## Phase 4 Scope

**To build:**
- [x] `src/styles/tokens.css` — full CSS custom property layer (surfaces, ink, gold, radii, fonts)
- [x] `src/components/primitives/Button.jsx` — primary/secondary/ghost; sm/md/lg; loading; disabled
- [x] `src/components/primitives/Input.jsx` — text/email/search; reference variant for short refs
- [x] `src/components/primitives/EyebrowLabel.jsx` — xs/sm/md sizes, gold/muted colors
- [x] `src/components/primitives/Card.jsx` — dark/warm surface, optional gold hairline
- [x] `src/components/primitives/ProgressBar.jsx` — 0–100, optional label, ARIA progressbar role
- [x] `src/components/primitives/SectionHeader.jsx` — eyebrow + display title + subtitle
- [x] `src/components/WidgetFrame.jsx` — region role, aria-labelledby, gold-glow chrome
- [x] `tailwind.config.js` extended to reference token variables
- [x] All 6 widgets refactored: outer container + header replaced with `<WidgetFrame>`, CTAs swapped to `<Button>`, inline inputs swapped to `<Input>` where applicable, all `C` palette references replaced with `var(--cf-*)` tokens

**Accessibility additions:**
- [x] `WidgetFrame` — `role="region"`, `aria-labelledby` from auto-generated `useId()`
- [x] `PeacePauseWidget` — `aria-pressed` on pause toggles; `aria-label` on day-cell SVGs ("Monday: 2 of 3 pauses complete")
- [x] `VerseTrackerWidget` — `aria-pressed` on day-review toggles; descriptive `aria-label` per day
- [x] `FirstFifteenWidget` — keyboard nav on `PracticeSelect` (Arrow keys, Enter, Escape, Tab); `role="listbox"`, `role="option"`, `aria-selected`
- [x] `ArrowLogWidget` — `role="dialog"` and `aria-modal="true"` on expanded portal; `aria-expanded`/`aria-controls` on history toggle
- [x] `DeclarationWidget` — per-input `aria-label`, descriptive remove button labels
- [x] `ExamenWidget` — per-textarea `aria-label`, `aria-expanded`/`aria-controls` on "View Previous" toggle

**Deferred (Phase 4):**
- Newsletter capture form refactors (`App.jsx:967-972`, `App.jsx:1573-1582`, `SiteFooter.jsx:63-79`, `SevenDayChallenge.jsx:818-826`). These forms have a distinct "marketing pill" visual (rounded-full, semi-transparent white fill, gold-fill hover button) intentionally different from widget-grade dark inputs. Forcing them through generic `Input`/`Button` primitives would require special variants that pollute the API, or drive visual regression. Better path: build a future `MarketingInput`/`MarketingButton` (or a single `Input variant="marketing"`) if/when there are more than these four forms to consolidate.
- ArrowLogWidget `ExpandedView` internals — kept the warm cream journal palette, swapped only sidebar buttons + outer chrome. The ExpandedView is a deliberately distinct visual surface and its inline `EX.*` palette stays in place.
- Section pages (App.jsx, Identity.jsx, RuleOfLife.jsx, etc.) — per scope, only widget files were token-migrated. Section pages still declare their own `C` constants. A subsequent pass can migrate them once the new primitives are stable.
- Visual smoke test in browser. Build is green but the agent cannot drive a browser. Recommend manual click-through across all six widgets (especially PeacePauseWidget edit panel and ArrowLogWidget expanded portal) before considering Phase 4 fully landed.

---

## Phase 5 Scope

**To build:**
- [x] `src/content/armor.json` — 6 pieces × 6 days = 36 days of devotional content verbatim
- [x] `src/content/rule-of-life.json` — 5 rhythms verbatim
- [x] `src/content/field-guide.json` — 7 days verbatim
- [x] `src/content/fruits.json` — 9 fruits verbatim
- [x] `src/content/loader.js` — 8 exported functions with dev-error / prod-silent behavior + count assertions
- [x] `src/Identity.jsx` — ARMOR_TRACKS (980 lines) removed; replaced with `getArmorPiece()` calls
- [x] `src/RuleOfLife.jsx` — RHYTHMS inline array (248 lines) removed; replaced with loader; `export const RHYTHMS` alias preserved
- [x] `src/FieldGuide.jsx` — OFFICES inline array (65 lines) removed; replaced with `getFieldGuidePath()` / `getFieldGuideDay()`

**Deferred (Phase 5):**
- `ARMOR_PIECES` overview array in Identity.jsx stays inline. It is a separate data structure from ARMOR_TRACKS (slug/num/title/icon for the gallery ring) — not part of the track devotional content. A future pass can migrate it if needed.
- `DevotionOnboarding.jsx` has its own local `RHYTHMS` constant. The `export const RHYTHMS = getAllRhythms()` in RuleOfLife.jsx is a dead export. Harmless; no behavior change.
- Visual smoke test — build passes but browser click-through is recommended: armor track pages, rhythm pages, Field Guide 7-day path.

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
