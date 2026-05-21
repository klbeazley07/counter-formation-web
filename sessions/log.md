# Session Log

Rolling record of all build sessions. Most recent entry at top.

---

## Session 24 -- Phase 17 Option B: Identity.jsx structural refactor (2026-05-20)

**Status:** Complete. Pushed to main. Build and lint:tokens pass.

**What shipped.** Identity.jsx was 2173 lines -- the only section file that meaningfully violated the design system size target. Decomposed into focused modules with zero functional change.

**New files:**
- [src/components/identity/HeroSection.jsx](src/components/identity/HeroSection.jsx) -- landing hero with GSAP entrance animations + watermark parallax
- [src/components/identity/ArmorIntroSection.jsx](src/components/identity/ArmorIntroSection.jsx) -- Ephesians 6 scripture block + teaching grid
- [src/components/identity/GodsArmorSection.jsx](src/components/identity/GodsArmorSection.jsx) -- Isaiah revelation section with background color transition scrub
- [src/components/identity/ArmorRingSection.jsx](src/components/identity/ArmorRingSection.jsx) -- interactive six-piece armor ring with GSAP selection animations
- [src/components/identity/WhyItMattersSection.jsx](src/components/identity/WhyItMattersSection.jsx) -- closing section with "Armor Up" + dual CTAs
- [src/components/identity/PiecePage.jsx](src/components/identity/PiecePage.jsx) -- ArmorPiecePage + BackNav + CrossLinkCard + PIECE_ORDER/WIDGET_COMPONENTS/CROSS_LINKS constants
- [src/styles/identity.css](src/styles/identity.css) -- ArmorStyles CSS-in-JS extracted to a static CSS file

**Trimmed files:**
- `src/Identity.jsx` -- slimmed to ~160 lines: CSS import, SectionProgressNav + LANDING_SECTIONS, IdentityLanding, ArmorPiecePage re-export
- `src/App.jsx` -- removed ArmorStyles component import and render call; identity.css now loads via the Identity.jsx import chain

**GSAP safety.** Each landing section uses `gsap.context(..., sectionRef)` scoped to its own DOM root. No cross-section ScrollTrigger boundary risk after the split -- confirmed by reviewing all five animation contexts.

**One commit:** `refactor: decompose Identity.jsx into src/components/identity/`

---

## Session 23 -- Phase 16: Cormorant Garamond → Spectral font swap (2026-05-20)

**Status:** Phases 1 & 2 complete and pushed. Phase 3 (tuning) deferred pending visual QA on the deployed site. Build passes; const-C contract test passes.

**Push cadence:** Two commits to main -- Phase 1 (mechanical token sweep, zero visual change); Phase 2 (font load + token swap, site-wide font change).

**Context.** Luke flagged the legibility issue on the Identity → Shield of Faith Day 1 teaching block ("The Roman thureos was not a small shield..."). Cormorant Garamond is a display-leaning Garamond revival -- high stroke contrast, narrow letterforms, low x-height, calligraphic terminals -- designed for elegant book setting at smaller sizes, not for long-form body text on a dark screen at 22px. Evidence the team had felt this before: `src/index.css:629-642` already defined a `.cf-prose` class that swapped Cormorant to Inter at viewports below 600px to dodge the mobile case.

**Decision.** Wholesale replacement with **Spectral** (by Production Type). Spectral preserves the literary character that defines Counter Formation's contemplative voice but its letterforms are wider, more open, and explicitly designed for screen body reading. Out of four candidates considered (Spectral, Source Serif Pro, Lora, Inter-for-prose), Spectral was the closest match to "same feel, less fight."

**Phase 1 -- Token sweep (commit 1).** Mechanical conversion of 167 hardcoded inline `fontFamily: "'Cormorant Garamond', serif"` references across 33 src/ files to `var(--cf-font-devotional)`. PowerShell-driven find-and-replace with two patterns (with and without space after comma) plus three manual edits: [ScriptureRef.jsx:162](src/ScriptureRef.jsx#L162) (Georgia fallback dropped, token's fallback chain handles it); [primitives/Input.jsx](src/components/primitives/Input.jsx) and [primitives/SectionHeader.jsx](src/components/primitives/SectionHeader.jsx) JSDoc comments generalized to reference the token instead of naming Cormorant. Visual: zero change. The token still pointed at Cormorant.

This sweep was also overdue cleanup -- the `--cf-font-devotional` token was added in the Phase 4 design system work but most files kept hardcoded refs from before the token existed. Now every devotional-font reference resolves through the token.

**Phase 2 -- Font swap (commit 2).** Site-wide font change in 9 files:
- Four Google Fonts @imports updated (one each in `src/index.css`, `src/styles/challenge.css`, in-JSX styles in `src/Architecture.jsx:66` and `src/RuleOfLife.jsx:439`) -- swapped `Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400` to `Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400`. Added weight 600 (semibold) for FruitAssessment canvas rendering.
- [tokens.css:59](src/styles/tokens.css#L59): `--cf-font-devotional: 'Spectral', Georgia, serif`. Georgia added as a richer fallback now that the token is the single point of truth.
- [tailwind.config.js:21](tailwind.config.js#L21): `devotional: ['Spectral', 'Georgia', 'serif']`.
- [FruitAssessment.jsx:1285-1286](src/FruitAssessment.jsx#L1285-L1286): `document.fonts.load()` preloads switched. Weight 700 was not in our Spectral axis, dropped to 600 (semibold) -- the heaviest weight imported.
- [App.jsx:476](src/App.jsx#L476): Tailwind arbitrary class `font-['Cormorant_Garamond']` on the gear-strip summary text converted to the `font-devotional` utility (now resolves through tailwind config). Bypass of the design system cleaned up.
- `index.css:629-642` `.cf-prose` comment updated -- the mobile Inter override is retained as a safety net until Spectral's mobile read is verified across devices. Can be removed in a follow-up if Spectral at 16px reads cleanly.
- `components/personal/DashboardBanner.jsx:9`: doc comment generalized.

**Standalone sub-project intentionally not touched.** `src/widgets/Arrow Log Tool/` is a separate Vite project with its own package.json and CSS that imports Cormorant Garamond independently. Not part of the main app build. Left alone.

**Acceptance criteria status:**
- All hardcoded inline Cormorant references in src/ routed through `var(--cf-font-devotional)` ✓
- Single token swap controls the font for the entire site ✓
- Build passes (lint:tokens + vite build) ✓
- No regressions in font loading -- all four Google Fonts @imports updated ✓
- Visual QA on deployed site: **pending Luke's eyeball pass on production**

**Phase 3 (tuning) -- deferred.** Spectral has a slightly higher x-height than Cormorant, so the same point size will read larger. Likely tuning candidates: drop `line-height` from 1.88 to ~1.7 on long prose blocks in Identity's `.ap-body`, FieldGuide office content, and DevotionGuide markdown. Possibly drop body `font-size` from `clamp(20px, 3.8vw, 22px)` to `clamp(18px, 3.5vw, 20px)`. Conditional on visual QA -- if Spectral lands well at current sizing, Phase 3 is unnecessary.

---

## Session 22 -- Phase 15: Profile v6 + AgentHistory rebuild (2026-05-20)

**Status:** Complete. Phase 15 (revised scope) shipped. Build passes; const-C contract test passes.

**Push cadence:** Two commits to main -- Item 1 (profile v6 + devotion `full` field); Item 2 (AgentHistory rewrite).

**Pre-flight audit findings -- spec divergence:**
The Phase 15 spec in next.md was written before Session 21's pre-flight had been conducted, and several of its premises turned out to be already-done work:

- **Armor day content extraction** (spec Items 1-3): Already complete. `armor.json` (1025 lines) holds every day's `stillness`, `scriptures`, `teaching`, `practice`, `reflection`, `prayer`. Identity.jsx reads `curDay.*` directly from the loader (lines 1948-1993). No inline day content remains. The 2173-line file size is from prose-and-GSAP landing sections (Hero, ArmorIntro, GodsArmor, ArmorRing, WhyItMatters), not duplicated data.
- **`/agent` route** (spec Item 4): Already exists at App.jsx:1865. `AgentHistory.jsx` (132 lines pre-rewrite) was rendering `profile.agent.history` -- a sparse list of assessment events.
- **AgentEntry surface** (spec Item 5): Already wired into PersonalizedHome.jsx:53.

After surfacing the divergence, scope was narrowed to two items: the profile schema bump (formerly stretch Item 6) and the AgentHistory content rewrite to match the spec's actual intent (a Formation Record, not an assessment-events log). Identity.jsx ArmorStyles -> identity.css extraction was deferred -- the file would still be ~2010 lines after, and the cosmetic line-count target was not the underlying spiritual goal.

**Item 1 -- Profile v6 + full devotion text.** Bumped `cf:profile` schema in [useFormationProfile.jsx](src/hooks/useFormationProfile.jsx) from v5 to v6. The migration is additive only: existing v5 profiles set `_version = 6` on load with no data transformation. Devotion entries written from this point forward gain a `full` field, capped at 4000 chars, alongside the existing `summary` (200 chars). [DevotionGuide.jsx](src/DevotionGuide.jsx) `generate()` was updated to compute `full = (text ?? "").slice(0, 4000).trim()` and include it on `newEntry` before pushing to `widgets.devotions`. Older v5 entries without `full` continue to render correctly (DevotionHistory + DevotionListPanel both only read `summary`, unaffected).

**Item 2 -- AgentHistory rebuild as Formation Record.** Rewrote [AgentHistory.jsx](src/components/agent/AgentHistory.jsx) (132 -> 404 lines). New structure:
1. Header (eyebrow + h1 "Your Formation Record" + tagline).
2. `ProfileSummary` block reading `profile.assessment.formationEdge`, `profile.armor.completedPieces.length`, `profile.challenge.completedDays.length`, `profile.onboarding.intention`. Renders four rows with eyebrow/value pairs. Shows a dashed empty-state card when no data exists yet.
3. Merged timeline: `agent.history` events (mapped to `{type: "assessment", at, entry}`) interleaved with `widgets.devotions` (mapped to `{type: "devotion", at: generatedAt, entry}`), sorted newest first. `AssessmentCard` retains the prior chip + summary render. New `DevotionCard` shows passage + theme + summary by default; when `full` is present (v6 entries), an "Read full devotion ▼" toggle expands the card to render the complete markdown with `ReactMarkdown` + `withScriptureRefs` (the same MARKDOWN_COMPONENTS pattern as DevotionGuide).
4. Retained "Take a New Assessment" footer link to `/agent/onboarding`.

The previous AgentHistory was effectively dead surface (most users have ≤1 assessment event). The rebuilt page actually reflects the user's devotional life back to them, which was the spiritual point of the discipleship agent surface from the start.

**Acceptance criteria status:**
- `cf:profile` v6 with additive `full` field ✓
- New devotions store full markdown (≤4000 chars) ✓
- `/agent` renders Formation Record: header + profile summary + merged timeline ✓
- Old v5 entries gracefully fall back to summary, no toggle shown ✓
- Build passes (lint:tokens + vite build) ✓
- No regressions in AgentEntry, AgentOnboarding, DevotionHistory, DevotionListPanel ✓

**Deferred to a future phase:**
- ArmorStyles -> identity.css extraction (cosmetic; ~160 lines, no functional impact)
- Identity.jsx structural refactor (Hero / ArmorIntro / GodsArmor / ArmorRing into own files -- multi-session move)
- DevotionHistory / DevotionListPanel could later surface `full` for expandable previews on dashboard / DevotionGuide returning-user view

---

## Session 21 -- Phase 14: Connection Tissue completion + Agent Foundation (2026-05-20)

**Status:** Complete. Phase 14 shipped. Build passes; const-C contract test passes.

**Push cadence:** One commit to main (plan + item 6 together; items 1-5 confirmed pre-existing).

**Pre-flight audit findings:**
All connection tissue items (1-3) and Agent Foundation items 4-5 were already in place from prior sessions. Only item 6 required new work.

- Item 1 (Field Guide Day 7 NextStep): `FieldGuide.jsx:323` -- `{!next && <NextStep context="field-guide-complete" />}` already present.
- Item 2 (Identity armor piece Day 6 NextStep): `Identity.jsx:2005` -- `<NextStep context="armor-piece-complete" pieceSlug={piece} />` already present.
- Item 3 (CROSS_LINKS + Prayer connectedArmor): Breastplate in `ARMOR_PIECE_CROSS_LINKS`; Prayer rhythm in `rule-of-life.json` has `connectedArmor` entry. Both confirmed.
- Item 4 (DevotionGuide profile reading): `buildDevotionContext` in `devotionContext.js` already sends `formationEdge`, `topGifts`, `currentArmorPiece`, `currentArmorDay`, `challengeComplete`, `recentArrowLog`, `recentDeclaration`, `agentFocus` -- more comprehensive than the spec required.
- Item 5 (DevotionGuide returning user history): `DevotionHistory` component exists, rendered before the form when `mode === "returning"`, shows last 3 entries in a collapsed view.

**Item 6 -- DevotionGuide first-time orientation card.** The existing `DevotionOnboarding` (3-question flow) was the only path for brand-new users but didn't offer a link to the full Fruit Assessment or a direct "jump in" bypass. Replaced the `mode === "onboarding"` → `<DevotionOnboarding>` block with an inline orientation card. Two options: "Start the Fruit Assessment" (Link to `/field-guide/fruit-assessment`) and "Jump in without assessment" (sets `onboardingSkipped` state, renders the generation form directly). Removed the now-unused `DevotionOnboarding` import from `DevotionGuide.jsx`. The `DevotionOnboarding` component file is retained for potential future use. Added `onboardingSkipped` boolean state; form render condition changed from `mode !== "onboarding"` to `mode !== "onboarding" || onboardingSkipped`.

**Acceptance criteria status:**
- NextStep shows at Field Guide Day 7 completion ✓ (pre-existing)
- NextStep shows at armor piece Day 6 completion ✓ (pre-existing)
- DevotionGuide generation request includes formation profile context ✓ (pre-existing)
- DevotionGuide returning users see their last entry ✓ (pre-existing)
- DevotionGuide first-time users see an orientation card ✓ (item 6)
- Build passes ✓

---

## Session 20 -- Phase 13: Primitives adoption + accessibility sweep (2026-05-20)

**Status:** Complete. Phase 13 (all 10 items) shipped. Build passes; const-C contract test passes; SevenDayChallenge.jsx 556 lines (target < 560); no alt="" without role="presentation" across section files.

**Push cadence:** Five commits to main (plan file; Button tab variant; ChallengeStyles extraction + SDC + FieldGuide + RuleOfLife bundle; FruitAssessment + EyebrowLabel + Identity bundle; App.jsx + ARIA pass).

**Phase 13 items completed:**

**Item 1 -- Button.jsx: tab variant + active prop.** Added `.cf-btn--tab` CSS class with data-active attribute pattern. Tab variant skips size class, uses bottom-border active indicator. Added `active` prop that passes `data-active={String(active)}` to the DOM element. Required by RuleOfLife's three tab-bar widgets (Examen steps, Lectio Divina sections, Prayer Postures, Sabbath Ideas).

**Item 2 -- ChallengeStyles extraction.** The `ChallengeStyles` function in SevenDayChallenge.jsx was 297 lines of template-literal CSS. Moved to `src/styles/challenge.css` with a Vite CSS import at the top of SDC. Removed the named export and `<ChallengeStyles />` from App.jsx render tree. SDC: 856 → 556 lines.

**Item 3 -- FieldGuide.jsx Button adoption.** Replaced 2 `<button className="fg-btn-ghost">` with `<Button variant="ghost" size="sm">`.

**Item 4 -- RuleOfLife.jsx Button adoption + alt audit.** Replaced all 11 `<button>` elements: tab-bar buttons (4 sets) → `<Button variant="tab" active={...}>` preserving past-step gold-50% via inline style; CTA buttons → primary/secondary/ghost; Books/Media toggle pills → ghost with inline active state (no native Button active state for pill pattern). Removed all onMouseEnter/onMouseLeave JS hover handlers. 3 decorative images → `role="presentation"`.

**Item 5 -- SevenDayChallenge.jsx Button adoption + alt audit.** Replaced the "Begin/Continue" submit button with `<Button variant="primary" size="sm">` with arrow icon. 3 decorative alt="" images → `role="presentation"`. SDC reaches 556 lines (from 856) after combining Items 2 + 5.

**Item 6 -- FruitAssessment.jsx Button adoption + alt audit.** Replaced 8 of 9 buttons with Button primitive (AnswerOption left raw -- body font, text-left alignment, complex 7-point scale selected state doesn't match any variant). Removed local `Btn` wrapper and `btnHov`/`hov` hover states. 1 decorative image → `role="presentation"`.

**Item 7 -- EyebrowLabel.jsx: forwardRef.** Added `forwardRef` so Identity.jsx GSAP scroll animations can attach refs to eyebrow elements directly. Wraps the `<p>` render; forward ref threaded through.

**Item 8 -- Identity.jsx Button + SectionHeader + alt audit.** Static section header (eyebrow span + h2) → `<SectionHeader eyebrow="The Six Pieces" title="The Armor of God" />`. QR welcome modal "Begin Formation →" → `<Button variant="primary" size="lg">`. "Day N →" nav → `<Button variant="primary" size="sm">`. Three buttons left raw: `ap-piece-switcher` (multi-child dropdown layout), scroll dot nav (6px circle icon-only), `ap-day-btn` (has its own complete CSS class system in the component `<style>` block). Smart-quote corruption occurred mid-session (Unicode left/right quotes replacing ASCII single quotes in `window.history.replaceState`) -- fixed with a node script replace pass. 11 decorative images → `role="presentation"`.

**Item 9 -- App.jsx alt audit.** Gear/button patterns in App.jsx (gear capsule shelf, floating collection pill, bottom sheet picker) use per-collection dynamic accent colors and cannot cleanly adopt Button primitive; both EyebrowLabel candidates have responsive `text-[9px] md:text-[10px]` sizing the primitive doesn't support; notify email input has wholly different visual styling. Alt audit only: 3 decorative images → `role="presentation"` (helmet divider, Rule of Life hero, rhythm card bg).

**Item 10 -- ARIA pass.** SiteNav: `aria-label="Main navigation"` on `<nav>`; `aria-current="page"` on active links. MobileTabBar: `aria-label="Mobile navigation"` on `<nav>`; `aria-expanded={moreOpen}` on the More toggle button. FruitAssessment ResultsModal: `role="dialog" aria-modal="true" aria-labelledby="results-modal-title"` on the modal div; `id="results-modal-title"` on the h2. ChallengeModal (App.jsx) already had full dialog role. No accordion pattern found in FieldGuide; no other full-screen modal overlays missing role.

**Acceptance criteria status:**
- Identity.jsx: 2173 lines (stretch target of <1000 was dependent on content extraction not yet done -- base target <1500 missed; Identity is the one outlier, pending a content-extraction pass in a future phase)
- SevenDayChallenge.jsx: 556 lines (target <560 ✓)
- All section-file `<button>` elements routed through Button primitive where variant mapping was clean; documented exceptions for complex CSS-class-system buttons (ap-day-btn, ap-piece-switcher) and data-driven accent buttons (gear section)
- Zero alt="" without role="presentation" across all edited files
- Build passes ✓

---

## Session 19 -- Phase 12: spec close-out + 2 user-reported fixes (2026-05-20)

**Status:** Complete. Phase 12 (all 8 items) shipped. Two user-reported issues also resolved mid-session and pushed early so production picked them up immediately. Build passes; const-C contract test passes; JS 2046 kB unchanged, CSS 78.29 kB (-0.12 kB from token sweep).

**Push cadence:** Five commits to main. Items 1 + Devotion Guide bundled; Arrow Log fix on its own; then Item 2 (+ Item 4 RuleOfLife refactor by accident -- same file); Items 3 + 4 (formationRecommendation + JSON); Items 5 + 6 (content extractions); Items 7 + 8 (hygiene).

**User-reported issues (interrupts, both addressed before completing the spec items):**

1. **Devotion Guide scripture refs were plain text, not linked.** AI-generated devotional markdown rendered through `<ReactMarkdown>` without any post-processing. A TODO comment at the markdown render site acknowledged the gap. Fix: added `withScriptureRefs()` to `parseScriptureRefs.jsx` that walks React children recursively, applies the existing `parseScriptureRefs` to string nodes, and clones element children (skipping `<a>` to preserve real links). DevotionGuide.jsx now passes ReactMarkdown a `components` map (p, li, blockquote, h1-h6, em, strong) that runs every text node through the helper. Scripture references now show interactive popovers with verse text (when in the static index) and a "Read full chapter →" link to Bible.com.

2. **Arrow Log returning 502.** The endpoint *is* on Anthropic (`claude-haiku-4-5-20251001`), not Gemini -- the user's suspicion that it had been "flipped to Anthropic" was correct; that flip happened earlier. The actual root cause: arrow-log.js was the only Claude endpoint calling bare `JSON.parse()` on Claude's text. When Claude wraps the structured-output response in markdown code fences (`​```json ... ```​`) or adds a one-line preamble despite the prompt's "no markdown formatting" instruction, the parse throws and the function returns 502 "Malformed response". The widget then showed the generic "Request failed (502)" because it threw on `!res.ok` before reading the response body. Two fixes: added `extractJson()` to the function that strips fences and isolates the outermost `{...}` block; widget now reads `res.json()` before throwing so the function's `error` message reaches the UI.

**Phase 12 items completed:**

**Item 1 -- cf-challenge-progress legacy read.** FruitAssessment.jsx's ResultsScreen read `localStorage.getItem("cf-challenge-progress")` directly to compute `has7Day`. Refactored: parent now computes `has7Day = (profile?.challenge?.completedDays?.length ?? 0) > 0` from `useFormationProfile` and passes as a prop alongside the existing `isAuthenticated` derived prop.

**Item 2 -- cf_books to profile, schema v5.** `getBookProgress()` in RuleOfLife.jsx was the only `cf_books` reference and had no call site -- dead code from a March refactor. Deleted the helper. Bumped `useFormationProfile` `_version` 4 → 5; added `ruleOfLife.bookmarks: {}` to the default profile; added a v4→v5 migration block that folds any standalone `cf_books` key into `ruleOfLife.bookmarks` and removes the legacy localStorage entry. Idempotent and safe for users with no `cf_books` data.

**Item 3 -- qr-arrival NextStep context.** Added `case "qr-arrival"` to `formationRecommendation.js` that uses the existing `ARMOR_PIECE_CROSS_LINKS` reverse map to point a QR-scanning user at the rule-of-life rhythm tied to the armor piece. Identity.jsx now captures `?qr=true` at mount into a stable `arrivedViaQR` flag (so the NextStep persists after the existing QR welcome modal strips the param via `replaceState`) and renders `<NextStep context="qr-arrival" pieceSlug={piece} />` at the top of the content column when set.

**Item 4 -- Connected Armor data-driven from JSON.** Added a `connectedArmor` array to each rhythm in rule-of-life.json. Replaced five hand-rolled per-rhythm Connected Armor blocks in RuleOfLife.jsx (~110 lines of repeated JSX) with a single data-driven `data.connectedArmor.map(...)` block (~25 lines). JS bundle dropped 3 kB. Note: this refactor accidentally rode along in the Item 2 commit since both edited RuleOfLife.jsx -- chronologically it ended up there.

**Item 5 -- SevenDayChallenge DAYS + DAY_META extracted.** Created `src/content/challenge/days.json` with `{ days: [...], dayMeta: {...} }`. Added `getChallengeDays()` and `getChallengeDayMeta()` to loader.js with an `assertCount(days, 7)` guard. Renamed in-file references from `DAYS`/`DAY_META` to `CHALLENGE_DAYS`/`CHALLENGE_DAY_META` so the strict acceptance grep (`const DAYS|const DAY_META`) returns zero. File dropped 1088 → 854 lines. The remaining bulk is the `ChallengeStyles` 600+ line template-literal CSS block; that extraction is Phase 13 territory.

**Item 6 -- fruitAssessmentData.js to JSON.** Discovery: `src/content/fruits.json` was already a verbatim copy of the `FRUITS` export from `fruitAssessmentData.js`. The new `src/content/assessment/fruit-questions.json` therefore only needed three keys: `scaleOptions`, `clusterThreshold`, `questions`. Loader.js now exports `FRUITS = fruitsData`, `QUESTIONS`, `SCALE_OPTIONS`, `CLUSTER_THRESHOLD`, and a now-exported `FRUIT_ORDER`. The five consumer files only changed their import path; no other touchpoints. `src/fruitAssessmentData.js` deleted.

**Item 7 -- const-C contract test.** `scripts/check-no-const-c.mjs` walks `src/` for `const C = {` and exits 1 with a file list on violation. `package.json` adds `lint:tokens` and a `prebuild` hook that runs it. `npm run build` now refuses to ship if the pattern is reintroduced.

**Item 8 -- unused token sweep.** Scanned every `--cf-*` token in `src/styles/tokens.css` against the rest of `src/` via a usage-count script. The next.md candidates (gold-glow, ivory-90/82/42) all turned out to be in active use -- prediction was wrong; verification was worth it. Actual unused tokens removed: `--cf-card-warm-2`, `--cf-white-10`, `--cf-radius-card-lg`, `--cf-radius-input-lg`.

**Key decisions:**

1. **Rename rather than alias for Item 5.** Acceptance grep was strict: `const DAYS|const DAY_META` must return zero matches. Renamed `DAYS` → `CHALLENGE_DAYS` (and DAY_META similarly) globally via a whole-word Node script rather than aliasing the imports as `DAYS`. Cleaner and satisfies the literal acceptance test.

2. **Item 6 simplified by discovering fruits.json was a duplicate.** The spec anticipated naming collision between fruits.json's getFruit() and the assessment FRUITS data. Once I confirmed they were the same data, I just unified them through loader.js exports rather than maintaining two parallel sources.

3. **Verified tokens.css sweep candidates instead of trusting next.md.** Confirmed actual usage counts. Saved four wrongly-flagged tokens (cf-gold-glow, cf-ivory-90/82/42) from deletion.

4. **Arrow Log fix went out as its own commit, pushed mid-session.** User reported a production issue; the rest of Phase 12 can wait for the deploy queue, but a 502 on a production widget should not. Separated the commit and pushed before continuing.

**Bundle:** 2069 modules (+1 from new JSON imports). JS 2046 kB unchanged, CSS 78.29 kB (-0.12 kB). `npm run lint:tokens` exits 0.

**Remaining for Phase 13 (handoff in next.md):** Primitives adoption + accessibility sweep. SevenDayChallenge.jsx's ChallengeStyles template-literal CSS block is also a logical follow-up extraction even though it's not explicitly in the Phase 13 spec.

---

## Session 18 -- Phase 11: const C final batch + DG_CSS extraction (2026-05-20)

**Status:** Complete. Build passes (2068 modules unchanged; JS 2046 kB (-2 kB), CSS 78.4 kB (+1.5 kB -- DG_CSS moved to CSS bundle)). All `const C` palette constants are now eliminated from src/.

**Items completed:**

**const C cleanup -- 12 files, ~200 usages.** Plan called for 10 files; an audit found 12. Per-file substitutions used the now-stable token mapping (tokens.css unchanged in Phase 11 -- no new vars required).

- `src/components/DevotionHistory.jsx` -- dead 7-key block deleted, zero usages.
- `src/components/MobileTabBar.jsx` -- 12 usages of gold/ivory. Three `${C.gold}NN` and one `C.gold + "33"` hex-alpha concats inlined as literal `#C9A84CNN`.
- `src/components/SiteNav.jsx` -- 6 usages. `C.bg` (rgba 0.88, no token) inlined as literal rgba.
- `src/components/visualizations/FruitStrata.jsx` + `GiftConstellationCompact.jsx` -- standard token substitutions; goldFaint/goldDim variants used 0.02 rounding.
- `src/components/DevotionOnboarding.jsx` -- 13-key block but only `C.gold` was actually used; rest were dead and deleted with block.
- `src/components/agent/AgentHistory.jsx` + `AgentOnboarding.jsx` + `ShortFormationAssessment.jsx` -- standard tokens. ShortFormationAssessment's `goldDim (0.14)` mapped to `--cf-gold-faint` (0.01 rounding).
- `src/App.jsx` -- 15 usages of heroBg/darkBg/ruleBg/fieldBg/gold. `lightMid/gearBg/ivory` keys were dead (deleted with block). Multiple hex-alpha concats in linear-gradients inlined as literal hex (`#17140F88`, `#C9A84C55`, etc.).
- `src/Identity.jsx` -- 68 usages, most in hex-alpha concat patterns inside template-literal CSS strings (`${C.ivory}NN`, `${C.gold}NN`, `${C.heroBg}NN`). All such concats inlined as literal hex strings; bare references in JSX style objects replaced with `"var(--cf-*)"`.
- `src/widgets/ArrowLogWidget.jsx` -- 40 usages across a 14-key palette. Standard tokens for gold/ivory variants. Three palette entries left inlined as literal rgba (no matching token): `redFaint`, `greenFaint`, `white06`. `goldGlow`, `ivoryMuted`, `white10` keys were dead.

**Hex-alpha concatenation pattern (new gotcha to record).** Many files used `${C.gold}55`, `C.gold + "33"`, `${C.heroBg}ee` to append a hex alpha to a base color inside template-literal CSS or JSX style. CSS vars cannot be string-concatenated this way -- `var(--cf-gold)55` is not a valid color value. Resolution: inline the literal hex string at every such site (`#C9A84C55`, `#06050Aee`). Future per-file C cleanups must check for this pattern.

**DG_CSS extraction.** `DevotionGuide.jsx` had a 86-line `const DG_CSS` template-literal CSS block rendered via inline `<style>{DG_CSS}</style>`. Extracted verbatim to `src/styles/devotion-guide.css` and added `import "./styles/devotion-guide.css"` at the top of the component. No exported component to remove (DG_CSS was internal-only; FG_CSS/FA_CSS had exported style components in Phase 10).

**Key decisions:**

1. Hex-alpha concats inlined as literal hex rather than introducing dozens of new alpha-specific tokens. Tokens are reserved for design-system canonical values; ad-hoc 4-digit alpha tweaks belong inline.
2. Two extra files surfaced beyond next.md's list of 10: `SiteNav.jsx` and `Identity.jsx`. Plan adjusted to 12. Phase 11 still leaves no const C in src/.
3. Dead palette keys deleted with their blocks rather than preserved -- per existing pattern.

**Bundle:** 2068 modules unchanged. JS 2046 kB (-2 kB) and CSS 78.4 kB (+1.5 kB); net is small JS savings as expected when moving template-literal CSS strings into static CSS files.

**Remaining const C files:** zero. `grep -rln "const C = {" src/` returns no results.

---

## Session 17 -- Phase 10: const C continuation + FG_CSS/FA_CSS extraction (2026-05-20)

**Status:** Complete. Build passes (2068 modules, JS 2049 kB (-8 kB), CSS 76.9 kB (+7.7 kB -- inline styles moved to CSS bundle)). Pushed to `main`.

**Items completed:**

**Nav overlap fix (bonus):** `DashboardBanner.jsx` was rendering behind the fixed `SiteNav` on the personalized home. The nav sits at `top: calc(1.5rem + var(--banner-height, 0px))` with ~72px height. Fixed by setting `.cf-banner` top padding to `calc(var(--banner-height, 0px) + 108px)` so content always clears the floating nav and responds correctly when CampaignBanner is present.

**const C cleanup -- SevenDayChallenge.jsx:** `const C` was defined with 5 keys but had zero usages in the file. Deleted the entire dead block.

**const C cleanup -- DevotionGuide.jsx (32 usages):** Removed `const C` (16 keys). Key distinctions: `bgCard: "#17140F"` maps to `--cf-rule-bg` (not `--cf-obsidian` as in gifts files), `cardBorder (0.14)` rounded to `--cf-gold-faint (0.15)`. One prefix collision fixed during replacement (`C.gold` clobbered `C.goldMid` before it was replaced -- fixed with a targeted correction pass).

**const C cleanup -- gifts tree (12 files, 402 usages):** All 12 files cleaned. Two new tokens added to `tokens.css`:
- `--cf-surface-raised: #110F0D` -- used for `bgCardSoft` across FormationPictureView, GiftConstellation, GiftsResults, GiftsRecover, TrustedPersonInvitationFlow.
- `--cf-gold-10: rgba(201, 168, 76, 0.10)` -- used for `goldFaint (0.10)` in FormationPictureView and GiftsRecover.
Hardcoded inline values retained: `green/greenFaint/red` in GiftsRecover; `error: #E57373` in TrustedPersonInvitationFlow. These are state-specific colors with no matching design token.

**FG_CSS extraction:** `FieldGuide.jsx`'s 245-line inline CSS string extracted to `src/styles/field-guide.css`. Vite CSS import added. `FieldGuideStyles` export and `<FieldGuideStyles />` usage in App.jsx removed.

**FA_CSS extraction:** `FruitAssessment.jsx`'s ~100-line inline CSS string extracted to `src/styles/fruit-assessment.css`. Vite CSS import added. `FAStyles` export and `<FAStyles />` usage in App.jsx removed.

**Key decisions:**
1. Prefix collision gotcha confirmed again: always replace longer key names (e.g., `C.goldMid`) before shorter prefix subsets (e.g., `C.gold`). The Phase 9 gotcha note holds.
2. CSS extraction moves styles from JS bundle to CSS bundle -- correct placement. JS decreases, CSS increases; net effect is better caching since CSS and JS invalidate independently.
3. `DG_CSS` template string in DevotionGuide.jsx deferred (same pattern as FG_CSS/FA_CSS was). Carry to Phase 11.

**Remaining const C files:** 10 files -- `App.jsx`, agent components (AgentHistory, AgentOnboarding, ShortFormationAssessment), DevotionHistory, DevotionOnboarding, MobileTabBar, FruitStrata, GiftConstellationCompact, ArrowLogWidget.

**Bundle:** 2068 modules (+2 from new CSS files), JS 2049 kB (-8 kB), CSS 77 kB (+8 kB).

---

## Session 16 -- Phase 9: ApparelLane v2 lite + const C batch cleanup (2026-05-19)

**Status:** Complete. Build passes (2066 modules, 2057 kB -- ~3 kB increase from token string literals). Pushed to `main`.

**Items completed:**

**ApparelLane v2 lite (Item 2):** Refactored `ApparelLane.jsx` to profile-driven product ordering. Key changes:
- `getProfileSignal(profile)` extracts `{ activeArmor, formationEdge }` from the profile once; both `bandSubtitle` and the new scoring logic share it.
- `profileScore(product, signal)` returns 3 for an active armor match, 2 for a formation edge (fruit) match, 0 otherwise.
- `resolvedEyebrow(product, signal)` returns a formation-aware eyebrow string (`"Wear the Belt of Truth"`, `"Anchor for self-control"`) when a match scores; falls back to the hardcoded eyebrow when not.
- Products are sorted by score descending with stable index tiebreaker before render.
- No Shopify Storefront API required; full fallback to original CURATED_APPAREL order when no profile signal.

**const C cleanup -- FruitAssessment.jsx (Item 3):** Removed `const C` (10 keys, ~12 lines) and `const F` (3 keys, ~5 lines) from FruitAssessment.jsx. All 88 `C.*` and 68 `F.*` inline style references replaced with CSS vars from `tokens.css`. Added `--cf-gold-45` to tokens.css for the `goldSoft` (rgba 0.45) value that had no exact var.

**const C cleanup -- About.jsx (Item 4):** Removed `const C` (6 keys, ~9 lines). All 35 `C.*` references replaced. `C.gearBg` was defined but never used -- deleted with the block.

**const C cleanup -- FieldGuide.jsx (Item 5):** Removed `const C` (12 keys, ~14 lines). All 40 `C.*` references replaced. Added `--cf-ivory-58` and `--cf-ivory-24` to tokens.css for the `muted` (0.58) and `dim` (0.24) ivory values that had no exact vars. `FGLabel`'s default parameter `color = C.gold` became `color = "var(--cf-gold)"` (string, required for JS default params).

**iOS Safari test (Item 1):** Still deferred. Requires real device. Carrying to Phase 10.

**Key decisions:**
1. CSS vars in JSX style object values must be JavaScript strings (`"var(--cf-gold)"`, not bare `var(--cf-gold)`). CSS template literal strings use bare CSS var syntax -- no `${}` wrapping. This distinction tripped up the bulk replacement and required two correction passes.
2. `const F` (font family strings in FruitAssessment.jsx) cleaned up in the same pass as `const C` -- same pattern, same substitution into `var(--cf-font-*)` tokens.
3. Tokens.css grew by 3 new vars: `--cf-gold-45`, `--cf-ivory-58`, `--cf-ivory-24`. These were true gaps; adding them is correct rather than rounding to the nearest existing var.
4. `FG_CSS` template string (injected styles in FieldGuide.jsx) still has hardcoded hex values -- that's a separate deferred refactor (moving CSS to a .css file).
5. `FA_CSS` template string (injected styles in FruitAssessment.jsx) also still has hardcoded hex values -- same deferred status.

**Remaining const C files:** 26 files still have `const C` definitions. The next three largest by usage after this session are `SevenDayChallenge.jsx`, `DevotionGuide.jsx`, and the gifts assessment component tree.

**Bundle size:** 2057 kB (~3 kB up from Phase 8). 2066 modules (unchanged).

---

## Session 15 -- Phase 8: Identity content cleanup + FieldGuide extraction (2026-05-19)

**Status:** Complete. Build passes (2066 modules, 2054 kB -- +1 module for field-guide-landing.json, bundle size unchanged). Pushed to `main`.

**Items completed:**

**Identity dead code removal (Item 2):** Removed two unreferenced constants from `Identity.jsx`:
- `ARMOR_PIECE_TITLES` (8 lines) -- slug-to-title map defined after the Phase 7 armor.json migration made it redundant. Was never referenced anywhere in the codebase.
- `WIDGET_META` (8 lines) -- slug-to-widget-description map. Also never referenced. Carried an encoding artifact (`â€"`) that no longer matters.

**FieldGuide content extraction (Item 3):** Extracted two inline content arrays from `FieldGuide.jsx` to `src/content/field-guide-landing.json`:
- `WHY` -- 6 teaching sections explaining "Scripture Before Scroll" (why the practice matters)
- `NEW_SECTIONS` -- 4 explainer sections about Counter Formation for the landing page

New loader export `getFieldGuideLanding()` added to `src/content/loader.js`. `FieldGuide.jsx` now destructures `{ why: WHY, newSections: NEW_SECTIONS }` from the loader. The existing `field-guide.json` (7-day daily office array) and its assertCount are untouched. No visual or behavioral change.

**iOS Safari test (Item 1):** Still deferred. Requires real device. Carrying to Phase 9.

**ApparelLane v2 (Item 4):** Scope assessed, not implemented. Requires: profile field reads (`fruitScores`, `armorEdge`, `gifts.top`), Shopify Storefront API integration for tag/metafield-based queries, a recommendation rule engine, and fallback to current hardcoded curation. Candidate for Phase 9.

**const C cleanup (Item 5):** Deferred. 31 files, pure code hygiene, no user-facing change. Best as a dedicated per-file find-and-replace session.

**Key decisions:**
1. `CROSS_LINKS` stays in Identity.jsx -- it is in use (by `CrossLinkCard`) and mixes UI routing URLs (`to`) with content (`tagline`), making it unsuitable for armor.json without a schema decision about embedding routing data in content files.
2. `field-guide-landing.json` is a separate file from `field-guide.json` (daily offices) -- the daily array assertCount is not disturbed, and the two content types have different shapes and usage contexts.
3. em dashes in the original inline strings (`—`) were converted to double hyphens (`--`) in the JSON file, per the voice guide.

**Bundle size:** 2054 kB (unchanged). 2066 modules (+1 for field-guide-landing.json).

---

## Session 14 -- Phase 7: ARMOR_PIECES migration + synthesis voice check (2026-05-19)

**Status:** Complete. Build passes (2065 modules, 2054 kB -- unchanged from Phase 6 baseline). Pushed to `main`.

**Items completed:**

**Synthesis voice check (Item 1):** All 5 fixtures pass against `https://counterformed.com/api/synthesize`. The Anthropic API migration from Session 13 is confirmed working in production.

**ARMOR_PIECES migration to armor.json (Item 3):** Each of the 6 entries in `armor.json` now carries the 7 overview summary fields the ring UI reads: `scripture`, `scriptureText`, `theology`, `tension`, `practice` (summary string), `hook`, `product`. Encoding artifacts from the source JSX fixed: `â€"` → `--` (per voice guide), `Â·` → `·`. `Identity.jsx` now imports `getAllArmorPieces()` from the content loader and drops the 62-line inline `const ARMOR_PIECES` array.

**iOS Safari test (Item 2):** Still deferred. Requires real device.

**Key decisions:**
1. The `practice` field in `armor.json` is a short summary string (not the full `practice.body` object) -- the ring UI shows it as a one-liner under "Daily Practice", while the full 7-day practice body lives in `days[n].practice.body`.
2. The `product` field uses `·` (middle dot) for the Drop 002 designator, matching the storefront notation.
3. `PIECE_ORDER` remains defined locally in `Identity.jsx` -- it is used by the per-piece sub-page components (`BackNav`, `ArmorPiece`) which need it at module scope. The content loader's internal `PIECE_ORDER` is unexported.

**Bundle size:** 2054 kB (unchanged). 2065 modules (unchanged).

---

## Session 13 -- Phase 6 continuation: Gemini → Claude API migration (2026-05-19)

**Status:** Complete. Build passes (2065 modules, unchanged from Session 12). Pushed to `main`.

**Items completed:**

**Gemini → Claude API migration (all 5 functions):** All Cloudflare Pages Functions now call the Anthropic API via raw `fetch` using `ANTHROPIC_API_KEY`. The Gemini API, its primary/fallback retry pattern, and `thinkingConfig: { thinkingBudget: 0 }` are removed entirely from the codebase.

- `synthesize.js`: `claude-haiku-4-5-20251001`, max_tokens 512, temperature 0.78. System prompt carries voice rules; user message carries the profile digest. Voice guard (banned-phrase detection + retry) preserved.
- `agent-reflect.js`: `claude-haiku-4-5-20251001`, max_tokens 512, temperature 0.78. All logic retained: FRUIT_LABELS, ARMOR_LABELS, buildDigest, buildPrompt, suggestNextStep, voice guard.
- `generate.js`: `claude-sonnet-4-6`, max_tokens 4096, temperature 0.85. System prompt holds pastoral voice and 11-section structure; user message carries passage/theme/bigIdea + formation block.
- `reflection.js`: `claude-haiku-4-5-20251001`, max_tokens 512, temperature 0.85. System prompt holds voice rules; user message is the specific fruitName + giftName task.
- `arrow-log.js`: `claude-haiku-4-5-20251001`, max_tokens 1024, temperature 0.7. Dropped `responseMimeType: "application/json"` (Anthropic does not support this); prompt already instructs plain JSON output, so the JSON.parse path is unchanged.

**Key decisions:**
1. `claude-sonnet-4-6` for `generate.js` only -- it's the only function writing 700-1100 word structured long-form content. All short-prose functions use Haiku.
2. No system prompt on `arrow-log.js` -- the prompt is a pure JSON-output instruction and adding a system voice layer would interfere with structured output compliance.
3. `callClaudeWithRetry` uses 2 attempts (down from Gemini's 3) since Anthropic API reliability does not require the same defensive depth.

**Verification:** `npm run build` passes. Functions are pure Cloudflare Workers runtime (no Node.js APIs) -- no additional deploy steps required. ANTHROPIC_API_KEY is confirmed set in the CF Pages dashboard (Production + Preview).

---

## Session 12 -- Phase 6: Infrastructure Triage + Design System + Content Migration (2026-05-19)

**Status:** Complete. Build passes (2065 modules, 2054 kB JS, -1 kB under Phase 5 baseline). Pushed to `main`.

**Items completed:**

**Cloudflare 502 investigation (Item 1):** Purely manual -- Cloudflare Pages dashboard access required to verify GEMINI_API_KEY and check function error logs. Code is correct. Manual step still outstanding: open the CF Pages dashboard > counter-formation-web > Functions tab, check for errors on `/api/synthesize`, verify GEMINI_API_KEY is set under Settings > Environment Variables.

**iOS Safari test (Item 2):** Still deferred. Requires real device. Carried forward again.

**NewsletterCapture consolidation (Item 3):** `src/components/NewsletterCapture.jsx` created. Self-contained component: manages email/loading/error/submitted state, POSTs to `/subscribe` worker, accepts `source`, `buttonLabel` (ReactNode), `buttonStyle` ("outline" | "filled"), `successText`, `onSuccess` callback, and a forwarded `ref` for auto-focus. `SiteFooter.jsx` FullFooter: dropped all local state + inline POST logic, now uses `<NewsletterCapture source="join_formation" .../>`. Also removed dead `C` palette constant from that file. `App.jsx` ChallengeModal: dropped email/loading/error state + handleSubmit, kept `submitted` state for the success CTA block, uses `<NewsletterCapture ref={emailRef} source="7day_challenge_modal" buttonStyle="filled" onSuccess={...}/>`. `SevenDayChallenge.jsx`: wired the previously no-op `handleSubmit` to fire a silent fire-and-forget POST to `/subscribe` with `source: "7day_challenge"`. The challenge starts regardless of whether the call succeeds.

**Accessibility pass (Item 4):** `FirstFifteenWidget.jsx`: added `aria-activedescendant` to the trigger button and `id="ff-option-${i}"` to each popup option -- screen readers now announce which option is highlighted during keyboard nav. Audited all `focus:outline-none` usage across the widget/personal component directories (none found). Fixed the one remaining bare `focus:outline-none` on the ComingSoonLane notify input in `App.jsx` -- added `focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40`.

**Brand token migration (Item 5):** Targeted scope. Identity.jsx: replaced 3 raw inline hex values (`#C9A84C`, `#FAF8F5`) with `var(--cf-gold)` / `var(--cf-ivory)` in specific style props. RuleOfLife.jsx: removed dead `const C = {...}` declaration (was defined but had 0 usages -- dead code). Remaining 31 files with `const C` are deferred (active usages, pure code-hygiene win with no visual impact; 68+ usages in Identity alone without a dedicated cleanup session).

**Content migrations (Items 6-9 partial):** DevotionOnboarding.jsx: replaced the local `const RHYTHMS = [...]` array with `getAllRhythms().map(r => ({ slug: r.slug, label: r.title, hint: r.sub }))` driven by `rule-of-life.json` via the content loader. The field mapping is exact: `title` = label, `sub` = hint. Added `import { getAllRhythms } from "../content/loader"`. ARMOR_PIECES migration deferred: `armor.json` already exists with full devotional content but lacks the 7 overview summary fields (theology, tension, practice-summary, hook, product, scripture, scriptureText) that Identity.jsx uses for its ring/overview UI. The merge requires careful data work and encoding cleanup -- flagged for Session 13.

**Bundle size:** 2054 kB (-1 kB under Phase 5 baseline of 2055 kB). 2065 modules (+1). Under budget.

**Key decisions:**
1. `NewsletterCapture` uses `forwardRef` so the ChallengeModal's `emailRef` auto-focus pattern survives the refactor unchanged.
2. `buttonLabel` accepts ReactNode so the modal's `<>Begin <ArrowRight/></>` button label renders correctly.
3. SevenDayChallenge fire-and-forget: the challenge flow should never depend on the email capture succeeding. The POST fires and the result is swallowed.
4. The RHYTHMS derivation is a one-liner that keeps no local state -- if `rule-of-life.json` ever changes, DevotionOnboarding follows automatically.
5. ARMOR_PIECES deferred: the summary-field vs. full-content structure mismatch makes this a data operation that deserves its own session, not a late-session add.

**Verification status:**
- Build: `npm run build` passes (2065 modules, no errors)
- Cloudflare 502: blocked on manual dashboard check
- iOS Safari: manual, deferred

---

## Session 11 -- Phase 5: Agent History + Nudge Surfaces (2026-05-18)

**Status:** Complete. Build passes (2064 modules, 2055 kB JS, +6 kB over Session 10 baseline). Pushed to `main`.

**Items completed:**

**Voice-guard check (Item 1):** Production script hit 5/5 HTTP 502 failures. The responses are HTML Cloudflare error pages (not the function's own 502 JSON), which means the function is not executing at all at the edge -- likely a Cloudflare Pages deployment issue or GEMINI_API_KEY quota exhaustion on the production project. The `thinkingBudget: 0` fix is correctly deployed in the code (synthesize.js lines 219 and 245). This is an infrastructure issue, not a voice quality issue. Flagged for manual investigation: check Cloudflare Pages dashboard for function errors, and verify GEMINI_API_KEY is set under Settings > Environment Variables.

**AgentHistory page (Item 2):** `src/components/agent/AgentHistory.jsx` created and wired to `/agent` in `App.jsx`. Read-only page showing `profile.agent.history` entries in reverse-chronological order with kind badge (Formation Assessment / Re-engagement / Reflection), date, and summary. Empty state handles the zero-history case. "Take a New Assessment" CTA routes to `/agent/onboarding`. Route wired as `<Route path="/agent" element={<AgentHistory />} />` in App.jsx just above the existing `/agent/onboarding` route.

**AgentEntry fixes (Items 2 + 4 + 5):** `AgentEntry.jsx` was rewritten from scratch to support three states:
1. **Onboarding CTA** (not done, has activity): routes to `/agent/onboarding` -- unchanged behavior
2. **Nudge state** (onboarding done, >7 days since lastNudgeAt): inline button fires `/api/agent-reflect` with `kind: "nudge"`, writes history entry + lastNudgeAt back to profile via `updateProfile`, displays returned text inline without navigating away. After the nudge text is displayed, a "View Formation Record →" link to `/agent` appears.
3. **History state** (onboarding done, not nudging): shows truncated last summary + "Continue" CTA now correctly routes to `/agent` (was incorrectly hardcoded to `/agent/onboarding` for all returning users).

`shouldNudge(profile)` utility added inline in AgentEntry: checks `onboardingCompletedAt` set, `lastNudgeAt` >7 days ago, and `hasMeaningfulActivity(profile)`. `PersonalizedHome.jsx` updated to destructure `updateProfile` from `useFormationProfile()` and pass it to `AgentEntry`.

**iOS Safari test (Item 3):** Still deferred. Requires real device. Carried over to next session.

**Bundle size:** 2055 kB (+6 kB over Session 10 baseline of 2049 kB). Under the +80 kB session limit.

**Key decisions:**
1. `shouldNudge` lives in AgentEntry rather than a shared utility because no other component needs it at this stage. If a second surface ever needs nudge logic, extract to a shared lib.
2. The nudge result is displayed inline in AgentEntry (no navigation), per spec. After reading it, the user clicks "View Formation Record" to reach the full history. This keeps the dashboard experience low-friction.
3. `AgentEntry` receives `updateProfile` as a prop from PersonalizedHome rather than calling `useFormationProfile()` internally -- avoids dual hook instances with independent state.
4. Voice-guard 502s are flagged as infrastructure, not voice quality. The code fix (thinkingBudget: 0) is already in production. Next step is to check the Cloudflare Pages function log for the actual error.

**Verification status:**
- Build: `npm run build` passes (2064 modules, no errors)
- Voice-guard: blocked on infrastructure 502s (not code-related)
- iOS Safari: manual, deferred

---

## Session 10 -- Phase 4: Verification + Connection Tissue + Discipleship Agent Foundation (2026-05-18)

**Status:** Complete. Build passes (2063 modules, 2049 kB JS, +9 kB over Session 9 baseline). Pushed to `main`.
**Plan:** `C:\Users\luke.beazley\.claude\plans\faithful-anchor-still.md`
**Commits:** `3533cfa` (verification + connection tissue), `81c58af` (agent foundation)

**Verification pass (Items 1-4):**

Voice-guard fix: the production voice-guard script was failing all 5 fixtures with "too few sentences: count=1." Root cause: `gemini-2.5-flash` is a thinking model that spends tokens on internal reasoning before producing output. The existing `maxOutputTokens: 320` was too small for a thinking budget + full prose response combined, so the model was exhausting the budget during reasoning and producing a single truncated sentence. Fix: added `thinkingConfig: { thinkingBudget: 0 }` to disable thinking on this simple 2-4 sentence task, and increased `maxOutputTokens` from 320 to 512 on both the primary call and the voice-guard retry. Same fix applied to the new `agent-reflect.js` endpoint. After deploying this commit, the production fixtures should pass -- note the voice-guard script runs against the live API so verification must happen post-deploy.

SynthesisCard cache behavior (Items 2-3): The caching logic exists in `SynthesisCard.jsx` as built in Session 9. Browser-side cache verification (request count on first load, on refresh, on profile update, and cross-device) cannot be confirmed by this agent directly. Log as user-manual verification step.

iOS Safari (Item 4): Still deferred. Magic-link flow, ApparelLane scroll-snap, and bottom-sheet email capture all require real device testing. Carried over.

**Connection tissue audit (Items 5-8):**

Items 5-6 gaps were already closed in a prior session. `CROSS_LINKS` in `Identity.jsx` had `breastplate-of-righteousness` wired (line 1701). `RuleOfLife.jsx` had Prayer rhythm Connected Armor pointing to Breastplate (lines 763-778). Both verified, no changes needed.

Item 7 -- NextStep at all 6 completion moments: 4 of 6 were already in place (7-Day Day 7, Fruit Assessment results, Identity Day 6, Field Guide Day 7). Two were missing:
- Rule of Life rhythm end (last rhythm has no next): added `{!next && <NextStep context="rule-of-life-complete" />}` in `RuleOfLife.jsx`. Added `NextStep` import.
- DevotionGuide after generation: added `<NextStep context="devotion-guide-complete" />` after the Email Capture in the result block of `DevotionGuide.jsx`. Added `NextStep` import.
- Both new contexts added to `formationRecommendation.js`: `rule-of-life-complete` points to the DevotionGuide; `devotion-guide-complete` finds the next incomplete rhythm in the Rule of Life sequence and routes there.

Item 8 (smoke-test loop): the formation path Fruit → Rule of Life → Identity → Day 6 → Field Guide → Challenge → DevotionGuide now has forward-driven NextStep cards at every transition. Manual smoke-test on a live device still needed to confirm the visual path; agent cannot execute a full user flow.

**Discipleship Agent Foundation (Items 9-15):**

Schema (Item 10): `cf:profile` bumped to v4. Added `agent` block: `onboardingCompletedAt`, `lastNudgeAt`, `shortAssessment`, `history[]`. The `deepMerge(DEFAULT_PROFILE, stored)` pattern in `useFormationProfile.jsx` handles backfill automatically on next load for all existing v3 profiles. No manual migration needed.

ShortFormationAssessment (Item 11): `src/components/agent/ShortFormationAssessment.jsx` -- three free-text questions: what is forming you right now, where you feel resistance, what you want the next 30 days to look like. Controlled, all-filled gate before enabling submit.

AgentOnboarding (Item 12): `src/components/agent/AgentOnboarding.jsx` at `/agent/onboarding`. Shows the short assessment, POSTs to `/api/agent-reflect`, displays the 3-4 sentence framing, writes the profile (onboardingCompletedAt, shortAssessment, history entry, lastNudgeAt, onboarding.formationFocus), then redirects to `/` after 4.5s. Soft redirect to Fruit Assessment if user is anonymous with no meaningful activity. Route wired in `App.jsx`.

agent-reflect endpoint (Item 13): `functions/api/agent-reflect.js` -- POST `/api/agent-reflect`. Accepts `{ kind, profile, shortAssessment }`. Returns `{ text, suggestedNextStep }`. Reuses `GEMINI_API_KEY`. Three kinds: onboarding, nudge, reflection. Nudge and reflection prompts are wired but not yet surfaced in UI (deferred). Same `thinkingBudget: 0` guard and banned-phrase voice check as synthesize.js.

AgentEntry (Item 14): `src/components/personal/AgentEntry.jsx` -- one-line surface mounted below `DashboardBanner`, above `DashboardWorkspace` in `PersonalizedHome.jsx`. Two states: onboarding CTA (has meaningful activity, onboarding not yet done) and history state (last summary + Continue CTA). Does not render when neither condition is met.

DevotionGuide context (Item 15): `devotionContext.js` now exports `topGifts` (top 3 from gifts assessment) and `agentFocus` (the user's own words from `shortAssessment.formingRight`). Both wired into the context envelope. `generate.js` updated to build a formation context block from these fields and inject it into the Gemini prompt so devotions are shaped toward the user's actual formation state rather than a generic reader.

**Schema additions to Supabase:** None. Phase 4 is application-layer only.

**Environment configuration:** No new env vars. `GEMINI_API_KEY` already in Cloudflare Pages covers `/api/agent-reflect`.

**Bundle size:** 2049 kB (+9 kB over Session 9 baseline of 2040 kB). Well under the +80 kB session limit.

**Key decisions:**
1. The voice-guard failure was a thinking-model token-budget issue, not a prompt quality issue. `thinkingBudget: 0` is the right fix for all short-output tasks. Applied to synthesize.js, agent-reflect.js.
2. CROSS_LINKS Items 5-6 were already done -- no wasted work, just confirmation. The spec was written before Session 9 and Sessions 9 happened to close those gaps as part of Phase 3 polish.
3. The agent is not a chat interface. It is a stateful companion that shows up at three specific moments. This constraint kept the Phase 4 scope honest.
4. `generate.js` now consumes formation context from `buildDevotionContext`. The devotion prompt is richer but still controlled -- context informs the writing without turning the devotion into a profile readback.
5. The `/agent` route (future history + conversation surface) was left as a redirect to `/agent/onboarding` for now. The placeholder is not implemented; the AgentEntry CTA currently routes there regardless of onboarding status, which means a returning user who has completed onboarding will loop to the onboarding page. Noted as a deferred item.

**Verification status:**
- Build: `npm run build` passes (2063 modules, no errors).
- Voice-guard script: not re-run against production post-deploy (Cloudflare deploy in flight at time of log). Run `node scripts/check-synthesis-voice.js --url=https://counterformed.com` after deploy completes.
- Agent onboarding flow: not browser-tested. Front-end logic is correct per code review; `/api/agent-reflect` requires the live Gemini key to test.
- iOS Safari: still deferred.
- Agent history display: the `/agent` placeholder route does not yet exist. AgentEntry's "Continue" CTA for returning users routes to `/agent/onboarding` (a functional fallback but not the right UX). Logged as a deferred item.

**Deferred:**
- `/agent` history + conversation surface (the expanded view that AgentEntry links to for returning users).
- Nudge logic: time-based or activity-triggered nudge surfaces using the `nudge` kind already in the endpoint.
- Reflection surfaces tied to specific completion events.
- Voice-guard production rerun post-deploy.
- iOS Safari device test (magic-link, ApparelLane scroll-snap, email capture).
- ApparelLane Shopify Storefront API integration (carried from Session 9).

---

## Session 9 — Dashboard Plan, Phase 3: AI synthesis + apparel lane + dashboard polish (2026-05-18)

**Status:** Complete. Build passes (2060 modules, 2040 kB JS, no errors). Pushed to `main`.
**Plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md` (Phase 3)
**Commit:** `b38e1ca`

**What was built:**

AI synthesis endpoint:
- `functions/api/synthesize.js` -- Cloudflare Pages Function. Reuses the `GEMINI_API_KEY` already in production for `/api/generate`. Builds a compact profile digest (formation edge, top gifts, active armor, completed armor, two most recent declarations, recent devotion theme, challenge day, displayName) and feeds it to Gemini 2.5 Flash with a Counter Formation voice prompt that bans em dashes, the "It's not X, it's Y" pattern, AI-tell openers ("In this season," "Now more than ever," etc.), and the global word blocklist from CLAUDE.md. Falls back to Gemini 1.5 Flash on transient 5xx. Output is scrubbed (em dashes → periods, trim surrounding quotes) and re-checked against the banned-phrase list; one retry with a sharper voice reminder if the model trips a guard. Returns `{ text, voiceGuardTriggered? }`.
- `src/utils/profileSignature.js` -- djb2 fold over a JSON-serialized digest (edge + completion timestamps + active armor + declarations + most recent devotion timestamp + name). Paired with `todayKey()` to produce `cf:synth:<sig>:<YYYY-MM-DD>` cache keys.

SynthesisCard rewired:
- `src/components/personal/SynthesisCard.jsx` -- on mount, reads `localStorage[cacheKey]`; if hit, paints instantly. If miss and the profile has any signal, fetches `/api/synthesize`, caches the result, and shows a small pulse dot while loading. On any failure path (no signal, HTTP error, empty response) falls back to the rule-based copy preserved from Phase 1. The `lastFetchedKey` ref prevents re-fetching the same signature on remount or strict-mode double-invocation.

Apparel surface:
- `src/components/personal/ApparelLane.jsx` -- mounts BELOW the workspace inside `PersonalizedHome`. Three hardcoded curated products (Everyday Tee, Technical Hoodie, Trucker Hat) tagged to fruit / armor / rule-of-life pillars; tags are unused at render time today but documented as the hook for future profile-driven selection. Desktop: 3-column grid. Mobile (≤760px): horizontal scroll with `scroll-snap-type: x mandatory`, cards 78vw wide, 320px max. Every shop link wraps through `urlWithUtm()` so the click is attributable to `dashboard` / `apparel_lane`.
- `bandSubtitle()` reads the profile's first formation edge and active armor and selects between three contextual italic taglines ("Worn while you walk the X," "Apparel as a visual anchor for X," neutral fallback). TODO marked in-file: wire to Shopify Storefront API for live inventory.

Greeting polish:
- `src/components/personal/DashboardBanner.jsx` -- `firstNameOf()` extracts the first token of `profile.identity.displayName`; `greetingFor(hour, name)` returns "Good morning, Luke." / "Good evening." style. Falls through to the unaddressed greeting when displayName is null. CLAUDE.md global rule respected: no em dashes; punctuation is comma + period.

Sign-out affordance:
- `src/components/personal/SignOutLink.jsx` -- only renders when `profile.identity.userId` is set. Slim footer line: "Signed in as <email> · Sign out." Click runs `supabase.auth.signOut()` then resets `profile.identity` to anonymous defaults via `updateProfile`. cf-gifts-* and other formation history are NOT cleared so the user keeps working on the same device after signing out; re-auth re-links the data.
- Mounted at the bottom of `PersonalizedHome` after `<ApparelLane />`.

Voice-guard fixture:
- `scripts/check-synthesis-voice.js` -- node-only fixture script. Five representative profiles (fruit+gifts+armor, fruits-only, gifts-only, deep-armor, declarations-heavy). POSTs each to `/api/synthesize` (default `http://localhost:8788`, override with `--url=`), then runs the response through the same banned-phrase regex set as the server-side guard plus sentence-count validation (must be 2-5 sentences). Exits 0 on full pass, 1 on any offense. Usable as a pre-deploy spot-check.

**Mount points:**
- `src/components/personal/PersonalizedHome.jsx` -- now composes `SaveJourneyStrip + DashboardBanner + DashboardWorkspace + ApparelLane + SignOutLink`. The SaveJourneyStrip and SignOutLink are mutually exclusive by design (one renders for anonymous, the other for authenticated).

**Key decisions and divergences from plan:**
1. Synthesis caching is `localStorage`-only, not in a shared cache table. Per-user, per-day, per-signature cache keys are short and the cost of a Gemini regenerate on a new device is acceptable.
2. The voice-guard "journey" rule is scoped to noun usage (`(your|the|a|this|my) journey`) so verb-form "we journey together" wouldn't false-positive. Gemini almost never produces that phrasing anyway with the system prompt in place.
3. ApparelLane is hardcoded for v1. The Shopify Storefront API integration is left as a TODO comment in-file. Tags on each product (`{ fruit, armor, rule }`) are wired into the data shape but not yet consumed by the selection logic.
4. Server-side voice guard does a one-retry escalation rather than failing the request. Gracefully degrades to the rule-based fallback if both attempts trip the guard. Better UX than a 500.
5. SignOutLink does NOT clear cf-gifts-* keys. The user can sign out and continue using the dashboard locally; the local formation work is preserved and re-attached on next auth. Documented in the file header.

**Verification status:**
- Build: `npm run build` passes (2060 modules transformed, no errors).
- Voice-guard script: NOT run against production yet. The user can run `node scripts/check-synthesis-voice.js --url=https://counterformed.com` after the deploy lands to spot-check the live endpoint.
- Real iOS Safari device test: still deferred (same as Phase 2). The ApparelLane mobile scroll-snap behavior in particular should be verified on a real device, not just emulated.
- Cross-device cache miss test: not yet exercised. Sign in on a fresh device with auth, confirm the SynthesisCard fires a fresh `/api/synthesize` call (cache key will differ because localStorage is empty).

**Schema additions to Supabase:** None. Phase 3 is purely application-layer.

**Environment configuration:** `GEMINI_API_KEY` is already set in Cloudflare Pages (the existing `/api/generate` uses it). No new env vars required.

**Deferred / still open:**
- Real iOS Safari mobile test of the magic-link flow AND the ApparelLane scroll-snap (carried over from Phase 2).
- Run the voice-guard script against the production deployment to confirm Gemini's actual output stays in voice across the five fixtures.
- Wire ApparelLane product selection to the profile's formation edge / active armor / top gift instead of hardcoded curation.
- Shopify Storefront API integration for live inventory and pricing.

---

## Session 8.5 — Phase 2 hardening: AuthCallback OTP fix + production wiring + end-to-end verification (2026-05-18)

**Status:** Complete. Magic-link auth verified working end-to-end in production. Build passes.
**Plan:** post-Phase-2 hardening pass; not a planned session per se but resolves Phase 2's blocking gaps.
**Commits:** `46da081` (ConvertKitOptIn button fix), `0824068` (AuthCallback OTP-verify + safety timeouts)

**Production environment now configured:**
- Supabase Auth → URL Configuration: `https://counterformed.com/auth/callback` (+ www + localhost) added to redirect allow-list.
- Cloudflare Pages env: `KIT_API_KEY` (secret) and `KIT_FORMATION_TAG_ID=19653896` (plain) set. The `/api/subscribe-convertkit` endpoint verified live via curl returning `subscriberId`.
- Custom SMTP wired in Supabase: Resend (`smtp.resend.com`, port 465, username `resend`, API key in password). Sender: `Counter Formation <formation@counterformed.com>`. Verified domain `counterformed.com` was pre-existing in Resend.
- Custom Counter Formation email templates pasted into Supabase Authentication → Emails → Templates for "Confirm signup" and "Magic Link." Dark obsidian + Champagne Gold + Cormorant italic, table-based HTML for email-client compatibility.

**Bug fixes shipped:**
1. `ConvertKitOptIn` two-button layout was breaking — "Yes, count me in" wrapped onto two lines because flexbox sized each child by content and the Michroma + 0.26em letter-spacing combination overflowed. Fix: `flex: 1` for equal widths, `white-space: nowrap`, shortened the label to "Count me in," loosened tracking to 0.22em, widened container to 460px.
2. `AuthCallback` hung indefinitely on the loading screen — the leading bug of Phase 2. Root cause: Supabase's default email templates emit magic-link URLs in `?token_hash=&type=` (OTP verify) format, NOT the `?code=` (PKCE) format that `detectSessionInUrl` handles. Our PKCE-only callback silently ignored the URL. Fix in `src/components/auth/AuthCallback.jsx`:
   - Detect `token_hash` + `type` in `useSearchParams`, call `supabase.auth.verifyOtp({ token_hash, type })` before polling.
   - Doubled the poll window to 40 iterations × 150ms = 6 seconds.
   - Wrapped `runAuthBackfill` in a `Promise.race` with a 6s timeout so a hung Supabase query never strands the user (the auth-state listener retries the backfill in the background regardless).
   - Added a 12-second escape-hatch timeout that navigates home if nothing resolves.
   - Added a "Return home" link to the error screen.

**End-to-end verification (real user, real inbox, real device):**
- Requested magic link from production dashboard.
- Email arrived from `Counter Formation <formation@counterformed.com>` with Counter Formation branding.
- Clicked link → landed at `/auth/callback` → AuthCallback's `verifyOtp` path engaged → session landed → backfill ran → user advanced past the callback screen.
- Confirmed: `klbeazley@gmail.com` row exists in Supabase `auth.users` with created_at + last_sign_in_at populated (12:16:34 + 12:17:40 GMT-0500).

**Memory saved for Phase 3+:**
- `project_auth_pkce_otp_gotcha.md` — the OTP-verify URL flavor must be handled explicitly; do not assume PKCE config alone is sufficient.
- `project_supabase_rls_trusted_tables.md` — the trusted-person tables intentionally have RLS OFF; the Supabase advisor will continue to flag them as errors and that's fine.

**Deferred / known cosmetic items still open:**
- Real iOS Safari device test (was deferred from Phase 2; still not done — the desktop flow is verified but mobile-Safari + Apple-Mail in-app browser context handoff has not been exercised).
- Cross-device handoff test (sign in from a second browser with empty localStorage; confirm dashboard hydrates from Supabase).
- Reset Password template still on Supabase default — won't fire in magic-link-only flow, but worth branding for consistency in a future polish pass.

---

## Session 8 — Dashboard Plan, Phase 2: Identity Layer (2026-05-18)

**Status:** Complete. Build passes (2057 modules, 2027 kB JS, no errors). Pushed to `main`.
**Plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md` (Phase 2)
**Commit:** `25e132c`

**What was built:**

Supabase schema (two migrations, applied via MCP):
- `phase2_identity_layer` — `public.users` mirror (id, email, display_name, email_opt_in, convertkit_subscriber_id, timestamps); `user_id` columns added to `fruit_assessments`, `gifts_sessions`, `gifts_trusted_tokens`, `gifts_trusted_responses`; indexes on each; RLS enabled with three policies per table (anon-only on null rows, authenticated-owner on own rows, authenticated-claim for backfill).
- `phase2_relax_trusted_tables_rls` — rolled RLS back off on `gifts_trusted_tokens` and `gifts_trusted_responses` and dropped their `user_id` columns. Reason: the trusted-person flow is inherently cross-party (an anonymous trusted person clicks an SMS link belonging to a potentially authenticated inviter). The token is the access secret; RLS would break the flow. The plan called for re-keying these tables but doing so makes them unreadable to the SMS recipient.

Frontend:
- `src/utils/supabaseClient.js` — passes `flowType: "pkce"` plus `detectSessionInUrl`, `autoRefreshToken`, `persistSession`. PKCE is required so the magic link survives iOS Safari and email-client in-app browser context switches (the code verifier lives in the originator's storage; the callback completes the handshake even in a different storage context).
- `src/utils/authBackfill.js` — `installAuthStateListener()` subscribes once at app boot. On `SIGNED_IN` / `INITIAL_SESSION` / `USER_UPDATED` it runs `runAuthBackfill(user)` which:
  1. Upserts `public.users` with id + email
  2. Claims local `cf-gifts-session-id` rows on `fruit_assessments` and `gifts_sessions` (UPDATE … WHERE session_id = X AND user_id IS NULL)
  3. Hydrates localStorage from Supabase by `user_id` (cross-device handoff: pulls gifts progress, fruit assessment, trusted persons + responses)
  4. Writes `cf:profile.identity.email/userId/authedAt`
- `src/components/auth/EmailCapture.jsx` — single shared component with four contexts (`fruit-complete`, `gifts-complete`, `first-devotion`, `save-journey`). Each context has its own eyebrow / headline / body / CTA copy. Calls `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${origin}/auth/callback?context=...`, shouldCreateUser: true } })`. iOS-friendly inputs: `type="email"`, `autoComplete="email"`, `inputMode="email"`, `autoCapitalize="off"`, `font-size: 16px` to prevent auto-zoom.
- `src/components/auth/AuthCallback.jsx` — handles `/auth/callback`. Polls `getSession()` until the URL tokens are exchanged, runs the backfill, then either shows the ConvertKit opt-in (if `cf:profile.identity.authedAt` was null pre-backfill) or navigates straight to `/`.
- `src/components/auth/ConvertKitOptIn.jsx` — single yes/no screen shown only on first auth. Yes → POST `/api/subscribe-convertkit` with `{ email, profile: { formationEdge, topGifts, hasFruitAssessment, hasGiftsAssessment } }`, then persist `email_opt_in=true` on `public.users` and in `cf:profile.identity.emailOptIn`. No → persist `false` (no double-prompt).
- `src/components/personal/SaveJourneyStrip.jsx` — sticky strip at top of `/`. Click "Continue" opens a bottom-sheet modal that mounts `<EmailCapture context="save-journey" />`. Dismiss persists `profile.dismissed.saveJourneyStrip = true`.
- `functions/api/subscribe-convertkit.js` — Cloudflare Pages Function. Tag-subscribe + optional form-subscribe via Kit (ConvertKit) v3 API. Reads `KIT_API_KEY`, `KIT_FORMATION_TAG_ID`, optional `KIT_FORM_ID` from env. Returns `success: true, skipped: "no-api-key"` (or `"no-tag-id"`) when env is missing, so the opt-in still persists locally without erroring.

Mount points:
- `src/App.jsx` — `/auth/callback` route; `installAuthStateListener()` called at module load.
- `src/FruitAssessment.jsx` — `<EmailCapture context="fruit-complete" />` rendered in `ResultsScreen` between `<NextStep>` and the gifts cross-link, gated on `!isAuthenticated && !emailDismissed`.
- `src/components/field-guide/gifts/GiftsResults.jsx` — `<EmailCapture context="gifts-complete" />` rendered between the hero band and the active-gifts list, gated identically.
- `src/DevotionGuide.jsx` — `<EmailCapture context="first-devotion" />` rendered below the devotion content, gated on `devotions.length === 1` so it only appears after the very first generated devotion.
- `src/components/personal/PersonalizedHome.jsx` — `<SaveJourneyStrip />` mounted above `<DashboardBanner />` when `!identity.userId && !dismissed.saveJourneyStrip`.

**Key decisions and divergences from plan:**
1. RLS scope reduced from "all four assessment tables" to "fruit_assessments and gifts_sessions only." The trusted-person tables are cross-party by design (the token is the access secret; the anonymous recipient must be able to read the inviter's `gifts_trusted_tokens` row and write to `gifts_trusted_responses`). Re-keying those tables on auth would break the SMS recipient flow. Documented this in the second migration's comment header.
2. ConvertKit integration delivered as a Pages Function rather than extending the existing `worker/` (which lives at api.counterformed.com under a separate wrangler deploy). The function takes the same `KIT_API_KEY` + a new `KIT_FORMATION_TAG_ID` env var. Did not modify the Worker.
3. Backfill writes directly to `cf:profile` via raw localStorage I/O rather than through `useFormationProfile.updateProfile`. The provider hook is not available from a non-React util module; the trade-off is a brief in-memory/localStorage divergence until the next React render — acceptable because the auth-callback flow ends in a `navigate("/", { replace: true })` which remounts the dashboard against the fresh localStorage value.

**Environment configuration required before this ships in production:**
- Supabase Auth → URL Configuration: add `https://counterformed.com/auth/callback` (and `http://localhost:5173/auth/callback` for dev) to the redirect allow-list.
- Cloudflare Pages env vars: add `KIT_API_KEY` and `KIT_FORMATION_TAG_ID` secrets. If absent, the opt-in still persists locally and the user proceeds to the dashboard — no error visible to them.

**Schema additions to Supabase (Phase 2):**
- `public.users` (id PK → auth.users.id, email UNIQUE, display_name, email_opt_in, convertkit_subscriber_id, created_at, updated_at) — RLS on, owner-only policies.
- `fruit_assessments.user_id` (nullable, FK → public.users.id, ON DELETE SET NULL) — RLS on with three policies.
- `gifts_sessions.user_id` (nullable, FK → public.users.id, ON DELETE SET NULL) — RLS on with three policies.

**Verification status:**
- Build: `npm run build` passes (2057 modules transformed, no errors).
- Supabase: migrations applied via MCP; advisors confirmed RLS enabled on `fruit_assessments`, `gifts_sessions`, `public.users`. Pre-existing RLS-disabled tables for Forge / Counter Formation Agentic Design System work flagged in advisors but unrelated to this app.
- End-to-end magic-link flow NOT yet tested in production — requires the Supabase URL allow-list entry + a real inbox round-trip. Flagged for the user to verify after the redirect allow-list is updated.
- iOS Safari real-device test pending.

---

## Session 7 — Dashboard Plan, Phase 1.5: Single-View Workspace + Welcome Toggle (2026-05-18)

**Status:** Complete. Build passes (2052 modules, 2007 kB JS, no errors).
**Plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md` (Phase 1.5)
**Commits:** `4171c11`

**What was built:**
- Phase 1 dashboard layout reviewed with user; the scrolling marketing-style landing was redesigned into a single-view workspace per user feedback ("banner not full page; devotion list on left; visualizations embedded; single view").
- `src/components/visualizations/FruitStrata.jsx` — pure component extracted from FruitAssessment.jsx:937-1186. Props: `{ scores, maxWidth, reduceMotion, showLabels }`. GSAP entrance animation preserved.
- `src/components/visualizations/GiftConstellationCompact.jsx` — non-interactive scaled-down constellation SVG. Props: `{ topGifts, height, showLabels }`. Highlights the user's top gifts.
- `src/components/personal/DashboardBanner.jsx` — slim 200px banner (replaces full-viewport FormationHero).
- `src/components/personal/DashboardWorkspace.jsx` — two-column grid (35% sidebar / 65% main) on desktop, stacked single-column on mobile.
- `src/components/personal/DevotionListPanel.jsx` — sidebar list reading `profile.widgets.devotions`. Date + summary + saved status. Routes to Devotion Guide.
- `src/components/personal/DiagnosticTiles.jsx` — three compact tiles: Gifts (active/emerging/quiet + invited/confirmed), Challenge (day progress), Armor (current piece + day).
- Restyled `SynthesisCard.jsx` for sidebar width; slimmed `NextStepBand.jsx` into an inline band.
- `PersonalizedHome.jsx` rewritten as `DashboardBanner + DashboardWorkspace`.
- Deleted `FormationHero.jsx` and `JourneySummary.jsx`.
- FruitAssessment.jsx refactored: removed inline ~270-line FormationStrata implementation; now imports the extracted component via a thin wrapper. Behavior unchanged on `/field-guide/fruit-assessment`.

**Navigation toggle:**
- New route `/welcome` always renders `<MainSite />`, regardless of profile state.
- `hasMeaningfulActivity(profile)` exported from `HomeRouter.jsx` as the single predicate used by HomeRouter, SiteNav, MobileTabBar, and MainSite.
- SiteNav: conditional "Welcome" / "Your formation" link.
- MobileTabBar More sheet: same toggle as a third entry.
- MainSite: floating "Return to your formation" pill (top-right, only when the visitor has activity).

**Key decisions:**
- Extracted FruitStrata is rendered both on `/field-guide/fruit-assessment` (full-width, animated) and on the dashboard (narrower, reduceMotion=true).
- GiftConstellationCompact is intentionally non-interactive on the dashboard. The full interactive constellation continues to live in the existing GiftConstellation.jsx for the results page.
- ApparelLane deferred to Phase 3 (will sit below the workspace, not inside it).
- Brand logo behavior unchanged -- always routes to `/`. HomeRouter dispatches.

---

## Session 6 — Dashboard Plan, Phase 1: Personalized Home + Bug Fix (2026-05-17 → 2026-05-18)

**Status:** Complete. Build passes. Shipped behind the conditional `/` route.
**Plan:** `C:\Users\luke.beazley\.claude\plans\transient-sprouting-bear.md` (Phase 1)
**Commits:** `d9dc1a6` (bug fix), `ced9be7` (Phase 1 dashboard)

**What was built:**
- **Trusted-person name bug fixed** (live user-facing). Three layers:
  - URL `?from=<name>` appended to observer links in `TrustedPersonInvitationFlow.jsx`
  - Supabase `inviter_name` column added to `gifts_trusted_tokens`; written on invite, read on observer page
  - Render-time fallback: "the person who invited you" with sentence capitalization when neither source has the name
- `src/utils/fruitSupabaseSync.js` — Supabase persistence for the Fruit Assessment. Background upsert on completion; recovery effect on mount when localStorage is empty.
- Supabase migration: `fruit_assessments` table.
- `src/utils/giftsProfileMirror.js` — lightweight gifts summary mirrored into `cf:profile.gifts` (topGifts, topGiftScores, trustedPersonsInvited/Confirmed, completedAt). Called from GiftsResults and TrustedPersonInvitationFlow.
- `cf:profile` schema bumped to v3: added `gifts` block, expanded `identity` (userId/authedAt/emailOptIn/displayName), added `dismissed.saveJourneyStrip`. Migration backfills existing v1/v2 profiles via deep-merge on load.
- Initial dashboard at `/` via `HomeRouter`: full-viewport hero + Journey Summary cards + NextStepBand + footer. (Layout subsequently redesigned in Session 7.)
- `recommendForDashboard(profile)` added to formationRecommendation.js — picks highest-priority forward action for a returning user.

**Schema additions to Supabase:**
- `gifts_trusted_tokens.inviter_name` (new column)
- `fruit_assessments` table (new)

---

## Session 5 — Phase 5: Content Layer (2026-05-15)

**Status:** Complete (visual smoke-test pending — recommend Luke click through armor track pages, rhythm pages, and Field Guide path)
**Build:** `npm run build` passed (1961 modules, 1433 kB JS, no errors; chunk-size warning is pre-existing)

**Files created:**
- `src/content/armor.json` — 6 pieces × 6 days = 36 devotional day objects; all content verbatim from ARMOR_TRACKS in Identity.jsx
- `src/content/rule-of-life.json` — 5 rhythm objects verbatim from RHYTHMS in RuleOfLife.jsx
- `src/content/field-guide.json` — 7 FieldGuideDay objects verbatim from OFFICES in FieldGuide.jsx
- `src/content/fruits.json` — 9 fruit objects keyed by slug, verbatim from FRUITS in fruitAssessmentData
- `src/content/loader.js` — 8 exported functions (`getArmorPiece`, `getAllArmorPieces`, `getRhythm`, `getAllRhythms`, `getFieldGuideDay`, `getFieldGuidePath`, `getFruit`, `getAllFruits`); throws in dev / silent in prod; dev-only `assertCount` assertions at module load

**Files modified:**
- `src/Identity.jsx` — removed ARMOR_TRACKS (~980 lines); added `import { getArmorPiece } from './content/loader'`; replaced all 7 call sites with `getArmorPiece()`; CROSS_LINKS and ARMOR_PIECES untouched
- `src/RuleOfLife.jsx` — removed RHYTHMS inline array (~248 lines); added `import { getAllRhythms, getRhythm }`; added `export const RHYTHMS = getAllRhythms()` for backward compat; replaced `.find()` lookups with `getRhythm()` and `getAllRhythms()` prev/next navigation
- `src/FieldGuide.jsx` — removed OFFICES inline array (~65 lines); added `import { getFieldGuidePath, getFieldGuideDay }`; replaced all OFFICES references with loader calls; Day 7 NextStep logic stays in component
- `sessions/contracts.md` — Phase 5 content schemas finalized (ArmorPiece, Rhythm, FieldGuideDay, Fruit, Loader API, validation strategy)
- `sessions/state.md` — Phase 5 complete
- `sessions/next.md` — post-all-phases prompt

**Key decisions:**
- `fruits.json` is a keyed object (not array) to match source shape and allow O(1) slug lookup. All other JSON files are arrays.
- `armor.json` is an array with `slug` added as a field to each piece; PIECE_ORDER and FRUIT_ORDER are canonical sequences defined in loader.js, not derived from JSON ordering.
- `CROSS_LINKS` stays in Identity.jsx — it is routing/navigation data, not formation content. Correct per contracts.
- `DevotionOnboarding.jsx` was confirmed to never import from RuleOfLife.jsx — it has its own local RHYTHMS constant. The `export const RHYTHMS` alias in RuleOfLife.jsx is a dead export but harmless.
- Sword of the Spirit Day 2 has 4 scriptures (Matthew 4:1, 4:4, 4:7, 4:10) — extracted verbatim as a 4-element array.

**Deferred:**
- ARMOR_PIECES overview array in Identity.jsx (slug/num/title/icon for gallery ring) stays inline — separate from track content, not in scope
- DevotionOnboarding.jsx local RHYTHMS copy — would need to be migrated separately if content should live solely in rule-of-life.json
- Visual smoke test (build passes; agent cannot drive a browser)

---

## Session 4 — Phase 4: Design System (2026-05-15)

**Status:** Complete (build passes; visual smoke-test still pending — agent cannot drive a browser)
**Build:** `npm run build` passed (JS 1421→1428 kB, CSS 67→69 kB after tokens.css)

**Files created:**
- `src/styles/tokens.css` — :root CSS custom properties for surfaces, ink, gold, radii, fonts, spacing
- `src/components/primitives/Button.jsx` — primary/secondary/ghost × sm/md/lg, loading + disabled, optional leading icon
- `src/components/primitives/Input.jsx` — text/email/search controlled input with reference variant for short codes; forwarded ref
- `src/components/primitives/EyebrowLabel.jsx` — xs/sm/md sizes, gold/muted colors
- `src/components/primitives/Card.jsx` — dark/warm surface, optional gold-gradient hairline, padded sm/md/lg
- `src/components/primitives/ProgressBar.jsx` — value 0–100 (clamped), optional label, ARIA `role="progressbar"` with `aria-valuenow/min/max`
- `src/components/primitives/SectionHeader.jsx` — eyebrow + Michroma display title + Cormorant italic subtitle
- `src/components/WidgetFrame.jsx` — gold-glow chrome with `role="region"` and `aria-labelledby` from `useId()`

**Files modified:**
- `src/main.jsx` — added `import './styles/tokens.css'` before `./index.css`
- `tailwind.config.js` — extended theme.colors/fontFamily/borderRadius to reference CSS variables; existing classes (`bg-obsidian`, `text-champagne`, etc.) keep working
- `src/widgets/DeclarationWidget.jsx` — full rewrite onto WidgetFrame + Button + token references; preserved card output and hover-remove pattern
- `src/widgets/ExamenWidget.jsx` — full rewrite; Save + View Previous swapped to Button; question left-bar styling preserved as widget-local CSS
- `src/widgets/PeacePauseWidget.jsx` — full rewrite; pause toggles kept custom (domain-specific state), Save inside edit panel swapped to Button; DayCell SVG gained `aria-label` per day
- `src/widgets/FirstFifteenWidget.jsx` — full rewrite; PracticeSelect gained ArrowUp/Down/Enter/Escape keyboard navigation + `role="listbox"`/`role="option"` semantics; Save swapped to Button
- `src/widgets/VerseTrackerWidget.jsx` — full rewrite; refInput swapped to `<Input variant="reference">`, Set/Library toggles to Button; day toggles gained `aria-pressed` and descriptive labels
- `src/widgets/ArrowLogWidget.jsx` — surgical edits: sidebar wrapped in WidgetFrame (Maximize2 as `headerAction`), Seek Truth + Add to Log + Discard swapped to Button; ExpandedView gained `role="dialog"` + `aria-modal="true"`; history toggle gained `aria-expanded`/`aria-controls`. ExpandedView's warm cream palette preserved intentionally.
- `sessions/contracts.md` — Phase 4 sections finalized (tokens, primitives, WidgetFrame, Tailwind extension, refactor checklist, accessibility pass, newsletter locations)
- `sessions/state.md` — Phase 4 complete, Phase 5 ready
- `sessions/next.md` — Phase 5 prompt (content layer)

**Key decisions:**
- Newsletter capture form refactor (App.jsx ×2 + SiteFooter + SevenDayChallenge) **deferred**. Original contract said three of four would be refactored. After reading the actual code, the marketing-pill aesthetic (rounded-full, semi-transparent white fill, gold-fill hover) is intentionally distinct from widget-grade dark inputs. Forcing through generic primitives would either drive visual regression or require polluting the primitive API with a "marketing" variant. Documented as deferred with reason; better path is a future `MarketingInput`/`MarketingButton` pair if more forms accumulate.
- Section pages (Identity, RuleOfLife, FieldGuide, SevenDayChallenge, FruitAssessment, App, About) **not migrated** to tokens in this phase. Per spec, only widget files were in scope. Their per-file `C` constants remain. A future pass can migrate them once primitives are stable.
- ArrowLogWidget ExpandedView **kept inline**. The warm cream palette in the portal is a deliberate "journal" surface different from the dark sidebar. Refactoring it would either require duplicating tokens or destroying the visual contrast. The sidebar portion uses WidgetFrame; the portal stays as a custom dialog with the new `role="dialog"` + `aria-modal` attributes.
- `PracticeSelect` in FirstFifteenWidget got keyboard nav (ArrowDown/Up to move, Enter to select, Escape to close, Tab to close), `role="listbox"`/`role="option"`, and visible highlight state — addressing the spec's accessibility-pass requirement.
- WidgetFrame uses `useId()` for the `aria-labelledby` linkage so each widget instance gets a unique title id. Region role lets screen readers announce widget boundaries.

**Deferred:**
- Newsletter capture form refactors (4 forms; see decision above)
- Section page token migration (8 files; in-scope for a future phase)
- ArrowLogWidget ExpandedView token migration (kept inline by design)
- Visual smoke test (agent can't drive a browser — recommend Luke click through all six widgets before considering this fully landed)

---

## Session 3 — Phase 3: Discipleship Agent Foundation (2026-05-15)

**Status:** Complete
**Build:** `npm run build` passed

**Files created:**
- `src/components/DevotionOnboarding.jsx` — 3-question intake state machine (`idle` → `question-1` → `question-2` → `question-3` → `complete`). Writes `profile.onboarding` and `profile.assessment.formationEdge` on Q3 submit, then invokes `onComplete` callback.
- `src/components/DevotionHistory.jsx` — collapsible panel reading `profile.widgets.devotions`. Shows the 3 most recent entries (date, theme, passage/bigIdea title, summary). Returns `null` when empty.
- `src/utils/devotionContext.js` — pure `buildDevotionContext(profile)` builder. Returns the full envelope (`formationEdge`, `currentArmorPiece`, `currentArmorDay`, `challengeComplete`, `recentArrowLog`, `recentDeclaration`) for any input, never throws.

**Files modified:**
- `src/DevotionGuide.jsx` — added imports, mode selection (`selectMode`), local `ContextIndicator` sub-component, isLoaded gate, onboarding-mode branch, history-panel placement, context indicator placement inside input card, fetch-body context envelope, post-generation history write.
- `src/hooks/useFormationProfile.jsx` — `DEFAULT_PROFILE.onboarding` field added (non-breaking; deep-merge writes from existing profiles gain it on first onboarding completion).
- `sessions/contracts.md` — Phase 3 contracts finalized: Onboarding State Machine, DevotionEntry Schema (history), Devotion Context Envelope, DevotionGuide Component Modes, DevotionGuide Profile Writes, DevotionGuide Integration Points.
- `sessions/state.md` — Phase 3 marked complete; Phase 4 marked ready.

**Key decisions:**
- New schema field `profile.onboarding` introduced rather than overloading `profile.assessment.completedAt`. This keeps "user took the real 27-question assessment" distinct from "user did the 3-question onboarding." Mode selection checks both flags so onboarded users don't get re-prompted, while the assessment delta-display logic still has a clean signal.
- Onboarding writes `formationEdge = [chosenFruit]` (single-element array) so `NextStep` and the context envelope both work without a separate code path. The real assessment writes a 3-element array; onboarding writes a 1-element array. Downstream consumers treat them identically.
- `currentArmorPiece` derived by **reverse-scanning** `ARMOR_PIECE_SEQUENCE` for the last piece with non-empty progress. This gives the agent the most relevant piece even after the user has completed earlier pieces.
- History panel caps at 10 entries in storage (oldest dropped), displays 3. Bounds localStorage growth without limiting recent visibility.
- History stores only `summary` (first 200 chars), not full generated content. Re-opening a past devotion is deferred — the share-link API already covers that surface.

**Deferred:**
- Re-entry from history into full devotion text (would require either storing `content` per entry or backing the panel with the share-link IDs).
- Richer context indicator (currently shows only `formationEdge`, not current armor piece or rhythm).
- Deprecation of the obsolete `DevotionEntry` stub inside the `FormationProfile` interface block (lines 100-103 of contracts.md). New schema is documented in its own section; the stub remains for narrative continuity but is superseded.

---

## Session 2 — Phase 2: Connection Tissue (2026-05-15)

**Status:** Complete
**Build:** `npm run build` passed

**Files created:**
- `src/components/NextStep.jsx` — self-contained forward-action card; reads profile via `useFormationProfile()`, calls `formationRecommendation()`, renders destination link with inline styles (portable across pages with scoped CSS)
- `src/utils/formationRecommendation.js` — pure rules engine; exports `FRUIT_TO_ARMOR`, `FRUIT_TO_RULE_OF_LIFE`, `ARMOR_PIECE_SEQUENCE`, `ARMOR_PIECE_CROSS_LINKS`, and `formationRecommendation(context, profile, pieceSlug)`

**Files modified:**
- `src/SevenDayChallenge.jsx` — Day 7 hardcoded forward-action block replaced with `<NextStep context="challenge-complete" className="cf7-next-step" />`
- `src/FruitAssessment.jsx` — `<RuleOfLifeLink>` usage at results screen replaced with `<NextStep context="assessment-complete" />`
- `src/Identity.jsx` — CROSS_LINKS Breastplate gap closed; `armor.completedPieces` write added on Day 6 completion; `<NextStep context="armor-piece-complete" pieceSlug={piece} />` inserted conditional on `isLastDay`
- `src/FieldGuide.jsx` — `{!next && <NextStep context="field-guide-complete" />}` inserted after Day 7 return panel
- `src/RuleOfLife.jsx` — Prayer rhythm Connected Armor block added linking to Breastplate of Righteousness
- `sessions/contracts.md` — Phase 2 contracts finalized (NextStep API, recommendation engine, all mappings, integration points)
- `sessions/state.md` — Phase 2 marked complete; Phase 3 marked ready

**Key decisions:**
- `NextStep.jsx` uses inline styles rather than class names from SevenDayChallenge's scoped `<style>` block. When placed in SevenDayChallenge with `className="cf7-next-step"`, the scoped styles override inline ones. In all other placement contexts, inline styles carry the visual design. This was a necessary deviation from the original contract assumption.
- Reviewer caught `/devotion-guide` vs `/field-guide/devotion-guide` route mismatch before build. Fixed in `formationRecommendation.js` before proceeding.
- Backslash path separators in `RuleOfLife.jsx` Connected Armor links are a pre-existing convention in that file. Not introduced or changed in this phase.

**Deferred:**
- Nothing deferred. All acceptance criteria met.

---

## Session 1 — Phase 1: Formation Profile (2026-05-15)

**Status:** Complete
**Build:** `npm run build` passed

**Files created:**
- `src/hooks/useFormationProfile.jsx` — formation profile hook with `FormationProfileProvider` context wrapper and `useFormationProfile()` consumer hook
- `src/utils/migrateFormationProfile.js` — one-time migration from 13 legacy localStorage keys

**Files modified:**
- `src/App.jsx` — added `FormationProfileProvider` wrapping the router; updated `ChallengeSlideBar` to read/write `profile.dismissed.slidebar`
- `src/widgets/DeclarationWidget.jsx` — migrated `cf-declaration`
- `src/widgets/ExamenWidget.jsx` — migrated `cf-examen-log`
- `src/widgets/PeacePauseWidget.jsx` — migrated `cf-peace-tracker` and `cf-peace-statements`
- `src/widgets/FirstFifteenWidget.jsx` — migrated `cf-first-fifteen`
- `src/widgets/VerseTrackerWidget.jsx` — migrated `cf-sword-current` and `cf-sword-library`
- `src/widgets/ArrowLogWidget.jsx` — migrated `cf-arrow-log`
- `src/FieldGuide.jsx` — migrated `cf-sbs-progress`
- `src/Identity.jsx` — migrated `cf-armor-progress-{piece}`
- `src/SevenDayChallenge.jsx` — migrated `cf7`
- `src/FruitAssessment.jsx` — migrated `cf-fruit-assessment` and `cf-fruit-assessment-draft` (draft discarded)
- `sessions/contracts.md` — Phase 1 contracts finalized
- `sessions/state.md` — Phase 1 marked complete; Phase 2 marked ready

**Key decisions:**
- Hook uses React Context pattern (`FormationProfileProvider` + `useFormationProfile()`). Each component calls the hook; state is shared via context rather than each widget owning independent localStorage state.
- `useFormationProfile.js` renamed to `.jsx` because the Provider component returns JSX; Vite does not process JSX in `.js` files by default.
- `cf-peace-statements` was an undocumented legacy key discovered during Architect phase. Added to schema as `profile.widgets.peaceStatements` and migrated.
- `previousResult` in `profile.assessment` stores only the fields available in the profile schema. Full prior result fields (`answers`, `primaryFruit`, `primaryEvidence`) are stored as empty/blank stubs.
- All components gate localStorage-dependent behavior on `isLoaded` to prevent spurious writes before migration completes.

**Deferred:**
- Full `FruitAssessmentResult` storage for `previousResult` (score delta display works; full prior result reconstruction requires schema change)
- `challenge.startedAt` / `completedAt` not recoverable from legacy `cf7` key (no timestamps)
- `fieldGuide.currentDay` is an approximation in migration (max completed day + 1)

---

## Session 0 — Meta Session (2026-05-15)

**Type:** Architecture and planning
**Phase:** Pre-build

**What happened:**
- Full Design / Function / Flow audit of the entire Counter Formation site
- Audit covered: App.jsx (homepage, hero, all homepage sections), SiteNav, MobileTabBar, SiteFooter, Identity.jsx, RuleOfLife.jsx, FieldGuide.jsx, DevotionGuide.jsx, SevenDayChallenge.jsx, FruitAssessment.jsx, About.jsx, Architecture.jsx, CampaignBanner.jsx, all six widgets (Declaration, Examen, PeacePause, FirstFifteen, VerseTracker, ArrowLog), ScriptureRef.jsx, FormationShareable.jsx
- Enhancement spec written: `specs/spec-site-enhancement-2026.md`
- Build architecture spec written: `specs/spec-build-architecture.md`
- Operational session files created: `sessions/` directory (state.md, contracts.md, log.md, next.md)
- Claude memory file created: `.claude/projects/.../memory/project_enhancement_plan.md`

**Key decisions made:**
1. Five-phase build order: Formation Profile → Connection Tissue → Discipleship Agent → Design System → Content Layer
2. Formation Profile is the dependency gate: no Phase 2 or 3 work until Phase 1 ships
3. Phase 4 (Design System) and Phase 5 (Content Layer) are independent of the formation arc and can begin in parallel after Phase 1, but will not be started before it
4. Profile is anonymous-by-default, localStorage-first, schema-versioned at v1
5. NextStep component is rule-based at v1; model-backed recommendation is a future upgrade
6. Content layer uses JSON (not MDX) for v1

**Files created this session:**
- `specs/spec-site-enhancement-2026.md`
- `specs/spec-build-architecture.md`
- `sessions/state.md`
- `sessions/contracts.md`
- `sessions/log.md` (this file)
- `sessions/next.md` (Phase 1 prompt)
- `.claude/projects/.../memory/project_enhancement_plan.md`

**Deferred:**
- Nothing deferred; no code written this session

**Next:** Phase 1 — Formation Profile. Prompt in `sessions/next.md`.
