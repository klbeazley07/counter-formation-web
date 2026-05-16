# Counter Formation -- Spiritual Gifts Assessment
## Claude Code Session Prompts

All session prompts for building the Spiritual Gifts Assessment, Gift Constellation, and integrated Formation Picture view inside the Counter Formation site repository.

Reference this file when opening each new Claude Code session. Run sessions in order -- each builds on the previous.

**Source of truth for content:** `/specs/CF_SpiritualGifts_Spec.md` (the master spec). Drop this file into the repo before starting any session.

**Existing patterns to reference:** `FruitAssessment.jsx` (the prior assessment, including its results, sharing, and persistence patterns), `RuleOfLife.jsx` (two-column layout, sidebar widgets), `Identity.jsx` (long-scroll cinematic layout, hero treatments), `ScriptureRef.jsx` (reusable scripture popover component).

---

## SESSION 1 -- Data Layer + Routes  **[STATUS: COMPLETE -- 2026-05-16]**

**What was built:**
- 19 per-gift JSON files at `src/data/gifts/<key>.json` (one file per gift, not a single `gifts.json`)
- `src/data/gifts/index.js` exports `gifts` (ordered array, biblical sequence), `giftsByKey`, `giftsByCategory`, and `CATEGORIES`. Runs symmetry + schema validation at import time and throws on any failure.
- All 7 routes wired in `App.jsx`, pointing to placeholders in `src/components/field-guide/gifts/Placeholders.jsx`
- Spiritual Gifts Assessment card added to `FGLanding` in `FieldGuide.jsx`, directly beneath the existing Fruit Assessment card

**Structural deviation from original plan:** The spec originally proposed a single `gifts.json` file. We split it into per-gift JSON files to stay under output token caps during generation and to give cleaner git diffs when individual gifts are edited later. Spec Sections 5.6, 13.1, 13.2, 13.3 have been updated to match. All downstream consumers should `import { gifts, giftsByKey, giftsByCategory } from '../data/gifts'` (folder index), not `'../data/gifts.json'`.

---

**Original prompt (kept for context):**

```
I am building the Spiritual Gifts Assessment for Counter Formation, the second anchor of the Field Guide alongside the existing Fruit of the Spirit Assessment. The full spec is at /specs/CF_SpiritualGifts_Spec.md. Read it before starting -- it is long but it is the source of truth for content, methodology, scoring, and UX flow.

This session has two tasks: (1) build the gifts data layer from the spec, and (2) wire up the routes.

TASK 1: Build the gifts data layer

Parse the spec markdown and emit one JSON file per gift at src/data/gifts/<key>.json -- 19 files total -- plus an index module at src/data/gifts/index.js that imports them in biblical order (manifestation, ministry, equipping, charismatic) and exports `gifts`, `giftsByKey`, `giftsByCategory`, and `CATEGORIES`. The per-gift data structure is specified in Section 13.2 of the spec.

The 17 core gifts are in spec sections 7.1 through 7.17. The 2 charismatic gifts are in sections 7.18 and 7.19 with the modified format (directExperienceQuestion in place of inclinationQuestions, no communityConfirmationQuestion, edgeCases = {emerging, notPresent}).

CRITICAL: The index.js validator must run at import time and throw on:
- Wrong count, duplicate keys, invalid category, missing required fields
- Core gifts missing 3 inclinationQuestions or communityConfirmationQuestion or any of the 4 core edge cases
- Charismatic gifts missing directExperienceQuestion or either charismatic edge case
- Asymmetric pairsWith (if A pairs with B, B must pair with A)

TASK 2: Routes

Add the following routes to App.jsx:
- /field-guide/gifts (assessment intro screen + Constellation state)
- /field-guide/gifts/take (the assessment proper)
- /field-guide/gifts/processing (brief processing screen)
- /field-guide/gifts/results (results display)
- /field-guide/gifts/invite (trusted-person invitation flow)
- /field-guide/gifts/observe/:token (trusted-person assessment, token-based)
- /field-guide/formation (integrated Formation Picture view)

Create placeholder components for each (just a header and the route name) -- the actual components are built in later sessions. The goal of this session is the data layer plus the route scaffolding so subsequent sessions can build into a working app.

Add the assessment as a card on the Field Guide landing (FGLanding at /field-guide/scripture-before-scroll), positioned alongside the existing Fruit of the Spirit Assessment card. Use the same card pattern -- gold eyebrow, Cormorant title, brief description, CTA.

Use the same color tokens, fonts, and animation patterns as the existing site. Hero Black #06050A dominant. Champagne Gold #C9A84C for accents. Michroma for display. Cormorant Garamond for editorial. Inter for body.

End by giving me: (1) confirmation that the index.js validator passed (build success), (2) list of new routes wired up, (3) screenshot of the Field Guide landing showing both assessment cards.
```

**Key files to reference:** `/specs/CF_SpiritualGifts_Spec.md` Sections 4, 7.1-7.19, 13.1-13.4, 14.1-14.2

---

## SESSION 2 -- Assessment Intro Screen + Modal

```
Read /specs/CF_SpiritualGifts_Spec.md Section 8.1 and Section 5 (Constellation overview).

Build the AssessmentIntro component at src/components/field-guide/gifts/AssessmentIntro.jsx. This is the screen the user lands on at /field-guide/gifts.

LAYOUT (desktop):
- Hero Black background, CF wordmark upper left, thin gold rule beneath
- Centered eyebrow: "FIELD GUIDE -- ASSESSMENT 02" in Michroma small caps
- Page title in Cormorant Garamond italic: "The Spiritual Gifts Assessment"
- Subhead: "Where the Spirit is at work through you to build up the body of Christ"
- Three prose paragraphs explaining purpose, methodology (three streams), and the trusted-person flow -- pull from spec Section 8.1
- Time note: "Allow 12 to 15 minutes for the self-assessment. The full picture comes when two or three trusted people in your life have also completed the brief companion assessment about you, which takes them 5 to 7 minutes."
- Two CTAs side by side (desktop) or stacked (mobile):
  - Primary: "BEGIN ASSESSMENT" (gold filled button, Michroma caps) -- routes to /field-guide/gifts/take
  - Secondary: "Explore the gifts first →" -- triggers Constellation state (we'll build the Constellation in Session 3; for now wire this to a placeholder)
- Small text link below CTAs: "Before you begin -- what this assessment is not" -- opens a modal

MODAL CONTENT: "What this assessment is not"

Three numbered points pulled from spec Section 8.1. Modal closes on click outside, escape key, or close button. Use Framer Motion for the modal transition.

USE the existing site patterns for hero treatment and animation. GSAP ScrollTrigger for any scroll-triggered fades. The intro screen does not need much animation -- it is a contemplative landing, not a dynamic page.

Hook the route -- /field-guide/gifts should render AssessmentIntro.

End with: (1) live URL of the intro screen, (2) confirmation that the modal opens and closes correctly, (3) confirmation that both CTAs route correctly (primary to /take, secondary to a placeholder).
```

**Key files to reference:** Spec Sections 8.1, 5.5, 12 (copy rules)

---

## SESSION 3 -- Gift Constellation

```
Read /specs/CF_SpiritualGifts_Spec.md Section 5 in full, especially 5.7 (the pairing map). Also read Section 7 to understand the gift profile content.

Build GiftConstellation.jsx at src/components/field-guide/gifts/GiftConstellation.jsx. This is the exploration experience accessed from the assessment intro screen via the "Explore the gifts first" link.

ARCHITECTURE: Lives as a state within /field-guide/gifts (NOT a separate route). When user clicks "Explore the gifts first" on AssessmentIntro, swap state to show the Constellation. A persistent CTA at the bottom of the Constellation: "READY TO DISCOVER YOUR GIFTS? BEGIN THE ASSESSMENT →" returns them to assessment start.

DESKTOP LAYOUT:
- Hero Black background
- 19 gifts rendered as points of light (small luminous circles with subtle glow)
- Each point labeled in Michroma small caps Champagne Gold, beneath the point
- Arrangement: Manifestation gifts at top (7 gifts), Ministry gifts in middle (8 gifts), Equipping gifts at bottom (2 gifts), Charismatic gifts (2 gifts) set apart as their own small cluster to the right
- Faint Champagne Gold lines connecting paired gifts (use the pairsWith data from the gifts module at src/data/gifts -- pairings rendered as straight lines between gift centers)
- Lines fade in on initial load (GSAP staggered animation, 80ms apart)
- Category eyebrow labels above each cluster: MANIFESTATION, MINISTRY, EQUIPPING, CHARISMATIC

INTERACTION:
- Hover (desktop) / tap (mobile): point expands slightly with glow animation, preview panel appears beside the point showing gift name, essence statement, primary scripture reference. The gifts paired with this one highlight their connecting lines.
- Click: opens full GiftProfileModal (build this as a separate sub-component)

GIFT PROFILE MODAL CONTENTS:
- Category eyebrow
- Gift name (Cormorant Garamond)
- Essence statement (italic)
- Working definition
- Definition anchor scripture (using ScriptureRef component)
- Manifestation witnesses with notes
- Stewardship charge with note
- Body application (all four subsections: where, what it looks like functioning well, common distortions, gifts it pairs with)
- "See related gifts" footer with clickable links to paired gifts (clicking switches the modal content to the linked gift)
- Persistent footer CTA: "Ready to discover where the Spirit is at work in you? Begin the assessment →"
- Does NOT show inclination questions, fruitfulness question, or community-confirmation question -- those belong to the assessment, not exploration

MOBILE LAYOUT:
- Constellation reflows to vertical layout grouped by category
- Connection lines simplified or omitted on mobile
- Same hover/tap interactions but adjusted positioning
- Horizontal scroll between categories with the labels as anchor points

TECH:
- Use Framer Motion for the modal transitions and gift expand/collapse
- Use GSAP for the connection-line reveal animations
- ScriptureRef component for all scripture references inside the modal
- Pull all content from the gifts module (`import { gifts, giftsByKey, giftsByCategory } from '../data/gifts'`)

End with: (1) live URL of the Constellation, (2) confirmation that hover/tap previews work, (3) confirmation that modal opens with full gift profile, (4) confirmation that the pairsWith lines render correctly, (5) confirmation that mobile reflow works.
```

**Key files to reference:** Spec Sections 5, 7 (all gift entries), 13.2

---

## SESSION 4 -- Assessment Question Flow

```
Read /specs/CF_SpiritualGifts_Spec.md Sections 8.3, 8.4, 10.1-10.2.

Build the assessment question delivery flow at src/components/field-guide/gifts/AssessmentQuestion.jsx and src/components/field-guide/gifts/AssessmentProgress.jsx and src/components/field-guide/gifts/AssessmentTransition.jsx.

QUESTION FLOW:
- One question per screen, never multiple stacked
- 72 questions total (17 core gifts × 4 questions + 2 charismatic gifts × 2 questions)
- Order: gift by gift, with all four questions for a single gift (3 inclination + 1 fruitfulness) appearing consecutively. Then the next gift. Charismatic gifts come last.
- Between gifts: brief transition screen (AssessmentTransition.jsx) -- 2-3 seconds, next gift's name and category eyebrow on Hero Black, no copy needed

QUESTION SCREEN LAYOUT:
- Top: thin Champagne Gold progress bar (AssessmentProgress.jsx) -- horizontal bar that fills as user advances, no percentage shown
- Above the question: small eyebrow in Michroma small caps indicating the gift being assessed (e.g., "TEACHING -- 1 OF 3")
- The question in Cormorant Garamond italic, generous line height, max-width 580px desktop
- Below the question: 5-point response scale as five large tappable cards (mobile) or buttons (desktop)
  - Inclination questions: "Strongly disagree / Disagree / Neither agree nor disagree / Agree / Strongly agree"
  - Fruitfulness questions: "Never / Rarely / Sometimes / Often / Consistently"
  - Charismatic direct-experience questions use the frequency scale
- Beneath scale: two nav links "← Previous" and "Skip this question →" (skipping records neutral but flagged)
- Small persistent link at the bottom: "Save and return later" (saves state to localStorage; returns to intro screen with a "resume assessment" CTA on next visit)

CHARISMATIC GIFTS TRANSITION:
After the 17 core gifts complete, before the charismatic gifts begin, show a transition screen with the framing copy from Spec Section 8.3 ("The final two gifts in this assessment are handled differently...") and a CONTINUE button.

STATE MANAGEMENT:
- Store user responses in React state during the session
- Persist to localStorage on every response (so "save and return later" works)
- After the final question is submitted, route to /field-guide/gifts/processing

SCORING (preview only -- full scoring logic in Session 6):
- Pre-compute inclination scores per gift as the user advances (so processing screen is fast)
- Don't compute composite or tier yet -- that happens in Session 6 along with trusted-person integration

End with: (1) screenshot of one inclination question screen, (2) screenshot of one fruitfulness question screen, (3) confirmation that the gift-to-gift transition works, (4) confirmation that "save and return later" works, (5) confirmation that the final question routes to /processing.
```

**Key files to reference:** Spec Sections 8.3, 8.4, 10.1-10.2

---

## SESSION 5 -- Processing Screen + Results Screen (Initial Version)

```
Read /specs/CF_SpiritualGifts_Spec.md Sections 8.4, 8.5, 10.3 (tier classification).

TASK 1: Build the Processing Screen at /field-guide/gifts/processing

- Hero Black background
- Center: small slowly-rotating Champagne Gold mark (use a stylized version of the CF wordmark's geometric anchor, or a simple constellation pattern)
- Beneath: copy fades in over 3 seconds: "Weighing your responses. Looking at the patterns. The Spirit's work in you is the substance of this picture; what follows is a glimpse, not a verdict."
- Total duration: 4-5 seconds, then auto-transition to /field-guide/gifts/results

TASK 2: Build the Results Screen at /field-guide/gifts/results

Read Section 8.5 for full layout. The results screen has these sections in order:

1. HERO
- Eyebrow: "YOUR FORMATION GIFTS"
- Title: "Where the Spirit is at work through you"
- Subhead: "Based on your responses. The full picture will come when two or three trusted people in your life have weighed in on what they have observed."
- Note: "Results are draft until at least two trusted-person responses are received. Send invitations now to complete the picture."

2. ACTIVE GIFTS SECTION
- Header: "ACTIVE -- THE SPIRIT IS CURRENTLY AT WORK IN YOU IN THESE WAYS"
- For this initial version (no trusted-person responses yet): show gifts where inclination + fruitfulness composite >= 70
- Each gift rendered as a card: category eyebrow, gift name in Cormorant Garamond, essence statement italic, first paragraph of formationOutput.active, "Read more →" link that opens the GiftProfileModal (reuse from Session 3)
- Each card carries a small "pending confirmation" badge in Champagne Gold

3. EMERGING GIFTS SECTION
- Header: "EMERGING -- THE SPIRIT MAY BE DEVELOPING THESE IN YOU"
- Gifts with composite 50-69 (without confirmation, since none yet)
- Card structure same as Active, but emergence edge-case copy substituted

4. QUIET GIFTS SECTION
- Header: "QUIET -- NOT WHERE THE SPIRIT IS MOST VISIBLY WORKING IN YOU RIGHT NOW"
- Single explanatory paragraph (pull from Spec Section 8.5 -- the version with seasonal framing)
- Collapsed list of quiet gifts -- clickable to expand and see Quiet edge-case copy

5. CHARISMATIC GIFTS SECTION
- Separate from the three tiers, since they use the modified format
- Render based on direct-experience + fruitfulness combination (see Spec Section 10.5)

6. TRUSTED-PERSON INVITATION CTA
- Prominently placed at bottom + as persistent footer that follows user while scrolling
- Eyebrow: "COMPLETE THE PICTURE"
- Copy from Spec Section 8.5
- CTA: "SEND TRUSTED-PERSON INVITATIONS →" -- routes to /field-guide/gifts/invite

NOTE: For this session, we're using the no-confirmation scoring (inclination 50% + fruitfulness 50%). The trusted-person integration and gap detection comes in Session 7.

PERSISTENCE:
- Pull responses from localStorage
- Save results to localStorage as well (so user can return to /results later without retaking)

End with: (1) screenshot of processing screen, (2) screenshot of the full results page after taking a test assessment with varied responses, (3) confirmation that quiet section expand/collapse works, (4) confirmation that GiftProfileModal opens correctly from cards.
```

**Key files to reference:** Spec Sections 8.4, 8.5, 10.1-10.3, 10.5

---

## SESSION 6 -- Trusted-Person Flow

```
Read /specs/CF_SpiritualGifts_Spec.md Section 9 in full.

This session builds both sides of the trusted-person flow: (1) the user-side invitation flow at /field-guide/gifts/invite, and (2) the trusted-person assessment experience at /field-guide/gifts/observe/:token.

TASK 1: User-Side Invitation Flow

Build TrustedPersonInvitationFlow.jsx at src/components/field-guide/gifts/TrustedPersonInvitationFlow.jsx. Multi-step flow:

STEP 1: Who to invite
- Screen header: "Who knows you well?"
- Copy from spec
- Guidance copy from spec
- Input fields for up to 4 trusted persons: name, email (or phone with SMS toggle), optional relationship dropdown
- CTA: "CONTINUE"

STEP 2: Personalize the message
- Pre-filled editable textarea with the default invitation from Spec Section 9.2
- CTA: "REVIEW AND SEND"

STEP 3: Review and send
- Displays recipients and personalized message
- User can edit or remove individual recipients before sending
- CTA: "SEND INVITATIONS"

TOKEN GENERATION:
For each trusted person, generate a unique token tying them to the user. For v1 (no backend), use a simple deterministic token: hash of (user_id + recipient_email + timestamp). Store the trusted-person pairings in localStorage under "cf-gifts-trusted-persons".

For v1, the actual email/SMS sending is mocked -- generate the shareable URLs and display them to the user for manual sending (we'll wire up real email in a later session). The URL format is /field-guide/gifts/observe/{token}.

After send, return user to /field-guide/gifts/results with a status banner: "Invitations sent. We will notify you when responses come in."

TASK 2: Trusted-Person Assessment Experience

Build TrustedPersonAssessment.jsx at src/components/field-guide/gifts/TrustedPersonAssessment.jsx. Lives at /field-guide/gifts/observe/:token.

LANDING SCREEN:
- Top eyebrow: "COUNTER FORMATION -- SPIRITUAL GIFTS ASSESSMENT"
- Headline: "You have been invited to weigh in on [User's first name]"
- Copy explaining the framing (pull from Spec Section 9.3)
- CTA: "BEGIN"

QUESTION DELIVERY:
- Same single-question-per-screen architecture as the user-side assessment
- 17 questions total (one community-confirmation question per core gift -- NO questions for charismatic gifts)
- 5-point frequency scale PLUS "I haven't been in a position to see this" option (this records as null, not as a neutral response)
- Use the communityConfirmationQuestion field from the gifts module (`giftsByKey[key].communityConfirmationQuestion`), replacing [Name] with the user's first name (pulled from the token-stored pairing)

COMPLETION SCREEN:
- Headline: "Thank you for weighing in"
- Copy from Spec Section 9.4
- CTA: "LEARN MORE ABOUT COUNTER FORMATION →" (links to /)

PERSISTENCE:
Save trusted-person responses to localStorage under "cf-gifts-trusted-responses" with the token as the key. The user-side results screen will read these in Session 7.

PRIVACY: Individual trusted-person responses are never displayed back to the user. Only the aggregated confirmation score is integrated into the results.

End with: (1) walkthrough of the invitation flow with a test entry, (2) the generated trusted-person URL, (3) walkthrough of the trusted-person assessment at that URL, (4) confirmation that responses are saved to localStorage correctly.
```

**Key files to reference:** Spec Section 9 in full

---

## SESSION 7 -- Full Scoring + Gap Detection + Results Update

```
Read /specs/CF_SpiritualGifts_Spec.md Section 10 in full.

This session completes the scoring logic and updates the Results screen to integrate trusted-person responses, surface gaps, and apply the full tier classification.

TASK 1: Build src/utils/scoreCompute.js

Implement the scoring per Section 10:

PER GIFT, THREE SUB-SCORES (0-100):

Inclination = mean of 3 inclination question responses
- Mapping: Strongly disagree=0, Disagree=25, Neither=50, Agree=75, Strongly agree=100
- Skipped responses recorded as 50 but flagged
- If 2+ inclination questions skipped for a gift, mark inclination as low-confidence

Fruitfulness = single fruitfulness question response
- Mapping: Never=0, Rarely=25, Sometimes=50, Often=75, Consistently=100
- Skipped marked as 50 and flagged

Confirmation = mean of all non-null trusted-person responses for that gift
- Skip "I haven't been in a position to see this" responses (these are null)
- If all trusted persons selected "haven't been in a position" OR no responses received, confirmation = null

COMPOSITE SCORE:

With confirmation data: composite = (Inclination × 0.30) + (Fruitfulness × 0.30) + (Confirmation × 0.40)
Without confirmation data: composite = (Inclination × 0.50) + (Fruitfulness × 0.50), flagged as "pending confirmation"

TIER CLASSIFICATION:
- Active: composite ≥ 70 AND at least 2 trusted persons provided non-null responses
- Active Pending Confirmation: composite ≥ 70 AND fewer than 2 trusted persons responded for this gift
- Emerging: composite 50-69 (any confirmation state)
- Quiet: composite < 50 (any confirmation state)

CHARISMATIC GIFT SCORING:
- Active: direct-experience ≥ Often AND fruitfulness ≥ Often
- Emerging/Uncertain: direct-experience = Sometimes, OR responses don't meet Active threshold but aren't entirely Never/Rarely
- Not present: direct-experience = Never or Rarely

TASK 2: Build src/utils/gapDetection.js

After trusted-person responses are integrated, check for gaps:

Inclination-Confirmation Gap: inclination ≥ 70 AND confirmation ≤ 40 (with at least 2 confirmation responses)
Confirmation-Inclination Gap: confirmation ≥ 70 (with at least 2 responses) AND inclination ≤ 50

TASK 3: Update Results Screen

Update src/components/field-guide/gifts/Results.jsx (from Session 5) to:

1. Run scoreCompute on every load (pulling user responses + trusted-person responses from localStorage)
2. Run gapDetection after composite scores are computed
3. Add a "WORTH PAYING ATTENTION TO" section between Active and Emerging when gaps exist -- show the relevant inclinationConfirmationGap or confirmationInclinationGap edge-case copy from each gift's edgeCases
4. Add an "UPDATED" banner at top of results when trusted-person responses have been integrated: "Updated with input from [N] trusted person[s]. The full picture is now in view."
5. Remove "pending confirmation" badges from gifts that now have confirmation
6. Update the Quiet section explanatory paragraph to use the seasonal-framing version from Spec Section 8.5

End with: (1) test with a user assessment + 2 trusted-person responses, showing the full integrated results with gaps surfaced, (2) confirmation that "pending confirmation" badges remove correctly, (3) walkthrough of one detected gap with the correct edge-case copy displayed.
```

**Key files to reference:** Spec Section 10 in full, Section 8.5 (results structure)

---

## SESSION 8 -- Formation Picture Integration + Final Polish

```
Read /specs/CF_SpiritualGifts_Spec.md Sections 11, 15.

TASK 1: Build the Formation Picture View at /field-guide/formation

Build FormationPictureView.jsx at src/components/field-guide/gifts/FormationPictureView.jsx.

PREREQUISITE CHECK: If the user has not completed both the Fruit assessment AND the Gifts assessment, redirect to the Field Guide index with a banner: "The Formation Picture requires both assessments complete. Take [missing assessment] to see your full picture."

LAYOUT:
- Top eyebrow: "YOUR FORMATION PICTURE"
- Title: "How the Spirit is at work in you right now"
- Subhead: "Your formation fruit and your active gifts together, the two dimensions of one Spirit's work"

SECTION 1 -- FORMATION FRUIT:
- Subhead: "WHERE THE SPIRIT IS SHAPING YOUR CHARACTER"
- Pull from the Fruit assessment's results module (existing FruitAssessment.jsx). Display top 3 fruit results in same format.

SECTION 2 -- ACTIVE GIFTS:
- Subhead: "HOW THE SPIRIT IS MOVING THROUGH YOU"
- Pull active gifts from the Gifts assessment results

SECTION 3 -- THE INTEGRATION:
- Subhead: "THE TWO TOGETHER"
- Static prose (3-4 paragraphs) from Spec Section 11.1
- Custom-generated reflection paragraph at the bottom (see Task 2 below)

SECTION 4 -- THE NEXT STEP:
- Specific call to action: "Your results suggest the Spirit is forming [Top Fruit] in you while moving through you in [Top Gift]. The next step is to find the place where both can be exercised together -- where you can serve in your gift while your character is being shaped further."
- CTA: "EXPLORE THE FORMATION PATHWAYS →" -- routes to newsletter signup with a note that formation pathways are coming

TASK 2: Build the Integrated Reflection Generator

Build src/utils/integratedReflection.js. This generates a custom 100-150 word reflection paragraph based on the user's top fruit and top active gift.

For v1, use the Claude API in artifacts pattern -- fetch from the Anthropic API with model claude-sonnet-4-20250514, max_tokens 1000. The prompt:

"You are writing for Counter Formation, a Christian spiritual formation brand. Write a 100-150 word reflection paragraph on how the gift of [TOP_GIFT] and the fruit of [TOP_FRUIT] function together in a believer's life.

VOICE RULES (strictly follow):
- No em dashes (use double hyphens -- in casual writing)
- Oxford comma always
- Earnest, convicted, warm tone -- never sarcastic
- No words: leverage, utilize, harness, unlock, delve, journey (as metaphor), foster, optimize, seamless, transformative, tapestry, landscape, ecosystem, paradigm
- No 'It's not X, it's Y' sentence pattern
- No self-posed rhetorical questions answered immediately
- First person, second person for direct address
- Avoid 'at the end of the day', 'in conclusion', 'let's dive in'
- ESV scripture if quoted
- Christian language used naturally and unapologetically

Write the reflection. Do not include preamble or signature -- just the paragraph itself."

Cache the result in localStorage so it doesn't regenerate on every visit. Regenerate only if the user retakes either assessment.

TASK 3: Cross-link from each assessment

After Gifts assessment completion, if Fruit not done: show small invitation on results page with CTA to take it.
After Fruit assessment completion, if Gifts not done: same.

TASK 4: Final polish pass

- Verify all routes work end-to-end
- Verify mobile reflow on every screen
- Verify ScriptureRef component works on all scripture references
- Verify GiftProfileModal opens consistently from both Constellation and Results
- Verify localStorage persistence survives page reloads
- Verify the trusted-person flow generates valid tokens and the trusted-person URLs work
- Verify scoring logic with several test cases (high inclination/no confirmation, gap scenarios, charismatic edge cases)

End with: (1) screenshot of the full Formation Picture view with both assessments complete, (2) a working integrated reflection from the API call, (3) confirmation that all cross-links route correctly, (4) a summary of any v2 items deferred (real email sending, account-based persistence, the formation pathways feature).
```

**Key files to reference:** Spec Sections 11, 15, 13.5 (the integrated reflection technical spec)

---

## SESSION 9 (OPTIONAL) -- ScriptureRef Retrofit

```
This is a small cleanup session. Apply the existing ScriptureRef component to any scripture references in the new gifts assessment files that are not already wrapped.

Files to check:
- AssessmentIntro.jsx
- GiftConstellation.jsx (especially GiftProfileModal)
- Results.jsx (all gift card content)
- FormationPictureView.jsx

For each scripture reference in JSX, wrap it with <ScriptureRef reference="..." text="..." />. The reference and text values are already in the per-gift JSON files (src/data/gifts/<key>.json) for the structured fields, but inline references in prose may need conversion.

Do not change any content, layout, or animations. Just swap plain scripture text for ScriptureRef components.

End with a count of how many ScriptureRef instances were added per file.
```

---

## SESSION DEPENDENCIES MAP

```
Session 1 (data + routes) ──┬─→ Session 2 (intro screen)
                            ├─→ Session 3 (Constellation)
                            ├─→ Session 4 (question flow)
                            │
Session 4 ──→ Session 5 (processing + initial results)
                            │
Session 3 (Modal) ──┐       │
                    └──→ Session 5
                            │
Session 5 ──→ Session 6 (trusted-person flow)
                            │
Session 6 ──→ Session 7 (full scoring + gap detection)
                            │
Session 7 ──→ Session 8 (Formation Picture + polish)
                            │
Session 8 ──→ Session 9 (ScriptureRef retrofit) [optional]
```

Run in order. Sessions 2 and 3 can be swapped if needed. Session 9 can be deferred or skipped if the retrofit was handled inline during earlier sessions.

---

## VOICE RULES FOR ALL SESSIONS

Every session must produce code and copy that follows these rules without exception:

- No em dashes anywhere. Use double hyphens ( -- ) in casual prose; restructure with commas, colons, or sentence breaks otherwise.
- Oxford comma always
- Semicolons permitted in formal sections (methodology, theological framing) to connect related clauses
- No banned words: leverage, utilize, harness, unlock, delve, journey (as metaphor), foster, optimize, seamless, transformative, tapestry, landscape, ecosystem, paradigm, groundbreaking, at the end of the day, in conclusion, let's dive in, let's unpack, now more than ever, in today's digital age
- No "It's not X, it's Y" sentence pattern
- No self-posed rhetorical questions answered immediately
- No exclamation points in formation content (rare exceptions for direct declarations)
- Tone: earnest, convicted, warm -- never sarcastic, never detached, never performatively enthusiastic
- ESV scripture throughout
- Christian language used naturally and unapologetically -- the audience is believers

All copy is in /specs/CF_SpiritualGifts_Spec.md. Pull from the spec rather than rewriting where possible. The spec has been voice-audited.

---

## ENVIRONMENT NOTES

- Stack: Vite + React + GSAP + Framer Motion (existing CF stack)
- Animation library: GSAP ScrollTrigger for scroll-triggered, Framer Motion for transitions and micro-interactions
- Persistence: localStorage for v1 (no backend required for assessment functionality)
- The Anthropic API integration in Session 8 uses the existing artifacts-style fetch pattern
- All existing CF design tokens, color palette, typography, and component patterns apply
- The existing ScriptureRef.jsx component is used throughout

---

*Counter Formation*
*Spiritual Gifts Assessment Build*
*Session prompts version: May 2026*
