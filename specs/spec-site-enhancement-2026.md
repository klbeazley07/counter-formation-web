# Counter Formation Site Enhancement Spec
### Based on Full Design / Function / Flow Audit — May 2026

---

## Premise

The site is built. The rooms are furnished, some of them beautifully. What is missing is the hallway.

Every major section of the site was designed and shipped as a discrete experience: the 7-Day Challenge, Identity and the Armor of God, Rule of Life, Field Guide, Fruit Assessment, DevotionGuide, Shop. Each works on its own terms. None of them know the others exist in a meaningful way. There is no shared sense of who the user is, where they have been, or what they should do next.

This spec defines the work required to turn the Counter Formation site from a catalog of formation tools into a coherent formation arc. The five themes below are ordered as a dependency graph. Each one enables the ones that follow it. The implementation roadmap at the end sequences them into shippable phases.

---

## Theme 1: The Formation Profile

### The Problem

Eleven independent localStorage keys are spread across the codebase with no shared namespace, no versioning, and no awareness of each other. The keys are:

- `cf-declaration` (DeclarationWidget)
- `cf-examen-log` (ExamenWidget)
- `cf-peace-tracker` (PeacePauseWidget)
- `cf-first-fifteen` (FirstFifteenWidget)
- `cf-sword-current`, `cf-sword-library` (VerseTrackerWidget)
- `cf-arrow-log` (ArrowLogWidget)
- `cf-sbs-progress` (Field Guide)
- `cf-armor-progress-{piece}` (Identity)
- `cf7` (7-Day Challenge)
- `LS_KEY`, `LS_DRAFT_KEY` (Fruit Assessment)
- `cf_slidebar_dismissed` (App.jsx slide-up bar)

No part of the site can read another part's data. The Fruit Assessment knows your three weakest fruits; the 7-Day Challenge knows which days you completed; Identity knows which armor pieces you have walked; the Field Guide knows which offices you have prayed. These systems cannot speak to each other. A visitor who completes the Fruit Assessment and then opens the DevotionGuide receives a blank form with three empty fields. The site has no memory of them.

This is the foundational constraint on every other enhancement in this spec.

### The Solution: A Namespaced, Versioned Formation Profile

Create a central `useFormationProfile()` hook backed by a versioned localStorage schema. Every section of the site reads from and writes to this single object rather than maintaining its own key. The profile is anonymous by default; it acquires an email anchor only when the user opts into the newsletter, signs up for the 7-Day Challenge, or connects via the future Discipleship Agent.

**Schema (v1):**

```json
{
  "_version": 1,
  "_created": "2026-05-15T00:00:00Z",
  "_updated": "2026-05-15T00:00:00Z",
  "identity": {
    "email": null
  },
  "assessment": {
    "fruits": null,
    "completedAt": null,
    "formationEdge": []
  },
  "challenge": {
    "completedDays": [],
    "startedAt": null,
    "completedAt": null
  },
  "armor": {
    "progress": {},
    "completedPieces": []
  },
  "fieldGuide": {
    "completedDays": [],
    "currentDay": null,
    "lastVisit": null
  },
  "ruleOfLife": {
    "completedRhythms": []
  },
  "widgets": {
    "declarations": [],
    "examenLog": [],
    "peaceTracker": {},
    "firstFifteen": null,
    "verseTracker": { "current": null, "library": [] },
    "arrowLog": []
  },
  "dismissed": {
    "slidebar": false
  }
}
```

**The `useFormationProfile()` hook:**

```js
// src/hooks/useFormationProfile.js
const PROFILE_KEY = "cf:profile";
const SCHEMA_VERSION = 1;

export function useFormationProfile() {
  // reads, migrates if needed, and returns {profile, updateProfile}
  // updateProfile(patch) deep-merges and writes back atomically
  // migration fn transforms v0 (all existing legacy keys) to v1 on first load
}
```

Migration runs on first use. It reads all eleven legacy keys, maps them into the v1 schema, writes the new profile, and deletes the old keys. After migration, legacy keys are not used.

**Why this order matters:** Every other enhancement in this spec either reads or writes the profile. If the profile does not exist first, the connection tissue (Theme 2) cannot know where the user is; the agent (Theme 3) cannot personalize; the NextStep component cannot route.

**What this does not require:** Authentication, accounts, or a backend. The profile is local-first. Email becomes an anchor only when explicitly provided. Multi-device sync is a future concern; local correctness is the v1 goal. If the user clears storage, the profile resets. That is an acceptable tradeoff at this stage.

---

## Theme 2: The Connection Tissue

### The Problem

Every section ends in silence. Users who complete the 7-Day Challenge are loosely pointed at Identity via a `<Link>` inside a devotion paragraph. Users who complete the Fruit Assessment are shown a share button and nothing more. Users who finish an Identity armor piece watch a progress bar hit 100% and sit there. Users who reach Field Guide Day 7 loop back to the path view.

The Product → Content → Practice → Identity loop described in `spec-strategy-roadmap.md` is the right mental model. It is not currently implemented. The gear links into the content; the content almost never links back to the gear or forward to the next content tier.

### The Solution: A `<NextStep>` Component

A single `<NextStep>` component reads the formation profile and renders the contextually correct forward action at every completion moment. It accepts a `context` prop that tells it where the user currently is, and it uses the profile to determine where they should go.

```jsx
<NextStep context="challenge-complete" />
// Reads: profile.challenge.completedAt, profile.assessment.fruits
// Renders: "You've completed the 7-Day Challenge.
//           Your next step is Identity — start with [recommended piece]."
//           CTA: /identity/[recommended-piece]
```

The recommendation logic at v1 can be simple rules. If the Fruit Assessment was completed, recommend the armor piece most closely paired to the user's lowest-scoring fruit. If the Assessment was not completed, recommend the Belt of Truth as the canonical starting point.

**Completion moments that need a NextStep:**

| Section | Trigger | NextStep destination |
|---|---|---|
| 7-Day Challenge Day 7 | Read 80% + read | Identity (piece recommended by fruit profile) |
| Fruit Assessment Results | All questions answered | Rule of Life (rhythm matched to lowest fruit) |
| Identity Armor Piece (Day 6) | Day 6 marked complete | Next armor piece OR connected Rule of Life rhythm |
| Rule of Life Rhythm (end) | Rhythm page bottom reached | Next rhythm in sequence |
| Field Guide Day 7 | Day 7 marked complete | 7-Day Challenge OR DevotionGuide onboarding |
| DevotionGuide generation | Devotion generated | Save to log; prompt to open Rule of Life |

The existing Day 7 hardcoded link in SevenDayChallenge.jsx (L#1071) should be replaced by `<NextStep context="challenge-complete" />`. The Fruit Assessment's "This connects to your Rule of Life rhythm" copy near L#1594 should become a `<NextStep context="assessment-complete" />` with a live router link.

**Cross-link completeness audit:**

Two gaps in existing cross-links must be closed alongside this work. The Breastplate of Righteousness is missing from `CROSS_LINKS` in Identity.jsx (the sidebar is blank for that piece). The Prayer rhythm in Rule of Life has no Connected Armor entry. Both need to be added before the NextStep connections are meaningful for the full arc.

**The Apparel connection:**

The strategy roadmap describes QR codes on gear pointing into specific formation tracks. The gear bridge section on the homepage articulates this as a promise. The implementation should make it literal: when a visitor arrives at `/identity/:piece?qr=true`, the existing QR welcome modal fires. The NextStep component should, when `context="qr-arrival"`, skip the general Identity overview and push directly into the piece's Day 1 with a brief "You're wearing this armor" intro screen. This is already partially wired; it needs the formation profile write to complete it.

---

## Theme 3: The Discipleship Agent Foundation

### The Problem

DevotionGuide is a stateless form. It takes three inputs (passage, theme, big idea), POSTs to `/api/generate`, and displays the returned Markdown. There is no memory of past devotions. There is no concept of the user. The generated content is exactly as personalized as the inputs -- which means it is as thin or rich as the user makes it, with no formation context from anywhere else on the site.

The long-term vision is an agent that knows you: your formation history, your three weakest fruits, your current armor piece, your arrow log entries, your declarations. It meets you where you are and pushes you where you need to go.

### The Solution: Stateful DevotionGuide with Context Threading

This is a three-part change.

**Part 1: History and continuity.** DevotionGuide writes each generated devotion to the profile (`cf:profile` → `widgets.devotions[]`) with a timestamp, the inputs used, and the generated content summary. On subsequent visits, the component shows a "Continue where you left off" option and the three most recent devotions in a collapsible history panel. This alone makes it a different product. The user returns and sees their formation history. The blank form becomes less daunting because they see themselves in it.

**Part 2: Context threading.** The `/api/generate` request body expands from three fields to a context envelope:

```json
{
  "passage": "...",
  "theme": "...",
  "bigIdea": "...",
  "profile": {
    "formationEdge": ["patience", "gentleness", "self-control"],
    "currentArmorPiece": "breastplate-of-righteousness",
    "currentArmorDay": 3,
    "challengeComplete": true,
    "recentArrowLog": ["lie1", "lie2"],
    "recentDeclaration": "I am..."
  }
}
```

The backend uses this context to shape the devotion: grounding it in the current armor piece, pressing on the formation edge, referencing the arrow log where relevant. This requires backend coordination but the frontend data is all available via the profile once Theme 1 is complete.

**Part 3: Onboarding mode.** A first-time user arriving at DevotionGuide should not see three blank fields. They should see an invitation: "Before we begin, tell us a little about where you are." The Fruit Assessment is the canonical front door here. If the user has not completed the Fruit Assessment, the DevotionGuide onboarding flow walks them through a shortened three-question formation profile builder (not the full 27-question assessment, but enough to establish a starting point). If they have completed the Fruit Assessment, DevotionGuide reads that data and skips onboarding entirely.

The interface change is: check `profile.assessment.completedAt` on mount. If null, render onboarding. If set, render the devotion form with a visible context indicator ("Forming around: patience, gentleness, self-control").

---

## Theme 4: The Design System

### The Problem

The brand palette and type pairing are consistent across the site because every developer on this project has been the same person with the same eye. That discipline lives in your head, not in the code. There is no shared token layer. Each of the six widgets, plus About, Architecture, App, Identity, RuleOfLife, FieldGuide, SevenDayChallenge, and FruitAssessment, defines its own `gold`, `ivory`, `barlow`, and `garamond` constants. Color change requires twelve files. Type change requires the same.

There is also no shared component library. Every widget reinvents the same container pattern (dark background, gold border hairline, Barlow Condensed header, Cormorant italic subtitle, action row at bottom). The visual result looks like one system. The code is eleven separate systems that happen to agree.

### The Solution: Tokens, Primitives, and a Widget Frame

**Step 1: CSS custom properties at the root.**

Extract all brand constants into `src/styles/tokens.css`:

```css
:root {
  --cf-obsidian: #0E0C0A;
  --cf-hero-bg: #06050A;
  --cf-rule-bg: #17140F;
  --cf-field-bg: #111009;
  --cf-ivory: #FAF8F5;
  --cf-gold: #C9A84C;
  --cf-gold-faint: rgba(201, 168, 76, 0.12);
  --cf-gold-glow: rgba(201, 168, 76, 0.22);
  --cf-white-5: rgba(255, 255, 255, 0.05);
  --cf-white-10: rgba(255, 255, 255, 0.10);
  --cf-radius-card: 20px;
  --cf-radius-pill: 999px;
  --cf-font-brand: 'Barlow Condensed', sans-serif;
  --cf-font-devotional: 'Cormorant Garamond', serif;
}
```

The Tailwind config should extend theme to reference these custom properties so Tailwind classes and inline styles share the same source of truth.

**Step 2: Primitive components.**

Create `src/components/primitives/`:

- `Button.jsx` -- primary (gold fill), secondary (outlined), ghost (transparent). Accepts `size`, `variant`, `loading`, `icon` props. Handles disabled state. One implementation, used everywhere.
- `Input.jsx` -- standard text and email inputs. Focus/blur border color transitions centralized. Used in all newsletter captures (currently three separate implementations).
- `Card.jsx` -- the dark container with optional gold top border hairline. Accepts `children`, `className`, `padded`. This is the repeated pattern across widgets and section cards.
- `EyebrowLabel.jsx` -- the gold uppercase tracking label. Text prop only. Currently copy-pasted in every section header.
- `ProgressBar.jsx` -- the thin gold progress indicator used on Identity piece pages, Rule of Life, and 7-Day Challenge. Currently three separate implementations.
- `SectionHeader.jsx` -- eyebrow + display title + optional subtitle. Used in every section of the homepage and in section pages. Currently inlined everywhere.

**Step 3: The WidgetFrame.**

The six formation widgets (Declaration, Examen, Peace Pause, First Fifteen, Verse Tracker, Arrow Log) share the same container structure and differ only in their content. Extract the frame:

```jsx
// src/components/WidgetFrame.jsx
export function WidgetFrame({ icon, title, subtitle, children, className }) {
  return (
    <div className={`cf-widget-frame ${className}`}>
      <div className="cf-widget-header">
        {icon && <div className="cf-widget-icon">{icon}</div>}
        <div>
          <h3 className="cf-widget-title">{title}</h3>
          {subtitle && <p className="cf-widget-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="cf-widget-body">{children}</div>
    </div>
  );
}
```

Each widget wraps in WidgetFrame and concentrates entirely on its own logic. The 300-950 line widget files shrink materially when the container boilerplate is extracted.

**Accessibility pass (bundled with design system work):**

Accessibility improvements should be made during the same pass as the design system extraction, not as a separate initiative, since they touch the same components.

- Add `role`, `aria-label`, and `aria-expanded` to all interactive widget elements during extraction into primitives.
- The custom dropdown in FirstFifteenWidget needs keyboard navigation: `ArrowUp`, `ArrowDown`, `Enter`, `Escape`.
- The Peace Pause circular progress SVG needs an `aria-label` that reads the current week status.
- All decorative images that are currently `alt=""` should be audited; images that carry meaning for formation context need descriptive alt text.
- All images that are purely decorative (backgrounds, section glows) should remain `alt=""` or have `role="presentation"`.

The ChallengeModal already has a correct focus trap. That pattern should be documented and used as the reference implementation for any future modal.

---

## Theme 5: The Content Layer

### The Problem

All formation content lives in JSX files as JavaScript literals. The Armor of God tracks are 6 pieces times 6 days of teaching, scripture, practice, and reflection blocks, all embedded in Identity.jsx as nested arrays. The seven Field Guide offices are in FieldGuide.jsx. Rule of Life rhythms embed their books, authors, media, scripture sidebars, and theology blocks. The 27 Fruit Assessment questions and their metadata live in fruitAssessmentData.js. The 7-Day Challenge devotion days are hardcoded in SevenDayChallenge.jsx.

This is a practical problem on two fronts. First, authoring: adding a new armor track day, correcting a scripture reference, adjusting a devotion, or writing a seasonal variant requires a code change and a deploy. Second, the Discipleship Agent: an agent that grounds its responses against a formation content corpus cannot use content that is locked inside a React component.

### The Solution: A Structured Content Directory

Create `src/content/` as a structured JSON or Markdown directory. Content is still static (no CMS yet), but it is separated from rendering logic.

**Proposed structure:**

```
src/content/
  armor/
    belt-of-truth.json         (6 days × full content)
    breastplate-of-righteousness.json
    shoes-of-peace.json
    shield-of-faith.json
    helmet-of-salvation.json
    sword-of-the-spirit.json
  rule-of-life/
    presence.json
    scripture.json
    prayer.json
    sabbath.json
    community.json
  field-guide/
    offices/
      day-1.json
      ...
      day-7.json
  challenge/
    days.json                  (7-day content array)
  assessment/
    fruit-questions.json       (27 questions + scoring metadata)
    fruit-rhythms.json         (fruit → Rule of Life → armor mapping)
```

**What the content files contain:**

Each file is the typed source of truth for that section's content. Components import and render; they do not define. `Identity.jsx` no longer contains 2,400 lines of teaching content; it contains layout and interaction logic, plus `import armorContent from '../content/armor/belt-of-truth.json'`.

**Why JSON over MDX for v1:**

MDX has better authoring ergonomics for rich formatted text but requires a build step and adds complexity. JSON is immediately importable, statically typed with a schema, and transformable by the Discipleship Agent backend without a parser. The teaching blocks that are currently long strings in JSX become `{ "body": "...", "format": "prose" }` entries. Scripture references become `{ "ref": "Ephesians 6:14", "text": "..." }` objects rather than inline string interpolation.

The migration is mechanical: extract each content constant from its current file, add it to the appropriate JSON file, update the import. No visual or behavioral changes accompany this work.

---

## Implementation Roadmap

The order of phases is determined by the dependency graph. Phase 1 must ship before Phase 2 can be written. Phase 2 enables Phase 3. Phases 4 and 5 are largely independent of the formation arc work and can begin earlier, but they should not be rushed past the core work.

---

### Phase 1 — Formation Profile (Foundational)

**Goal:** One source of truth for all user state. Eleven legacy keys migrated cleanly.

**Deliverables:**
- `src/hooks/useFormationProfile.js` -- the profile hook with migration logic
- Updated App.jsx to initialize the profile on mount
- All eleven legacy keys replaced with profile writes in their respective components
- No behavioral changes visible to the user; this is infrastructure

**Acceptance criteria:** A user who clears localStorage starts fresh. A user with existing data loses nothing. The browser console shows no writes to legacy keys after the migration runs.

---

### Phase 2 — Connection Tissue

**Goal:** Every section completion drives the user forward.

**Deliverables:**
- `src/components/NextStep.jsx` -- the recommendation component
- `src/utils/formationRecommendation.js` -- the rules engine (v1: rule-based; v2: model-backed)
- Replace SevenDayChallenge.jsx L#1071 hardcoded link with `<NextStep context="challenge-complete" />`
- Replace FruitAssessment.jsx L#1594 static copy with `<NextStep context="assessment-complete" />`
- Add `<NextStep context="armor-piece-complete" />` to Identity armor piece end-of-track
- Add `<NextStep context="field-guide-complete" />` to Field Guide Day 7
- Add Breastplate of Righteousness to `CROSS_LINKS` in Identity.jsx
- Add Connected Armor entry to Prayer rhythm in RuleOfLife.jsx

**Acceptance criteria:** A user who completes the 7-Day Challenge lands on a forward-directed screen naming their recommended armor piece. A user who completes the Fruit Assessment is linked to the Rule of Life rhythm that addresses their formation edge. Identity armor piece Day 6 completion shows a "what's next" moment, not silence.

---

### Phase 3 — Discipleship Agent Foundation

**Goal:** DevotionGuide becomes stateful and context-aware.

**Deliverables:**
- DevotionGuide updated to read `profile.assessment` and `profile.widgets.devotions`
- Onboarding mode for first-time users (profile.assessment.completedAt === null)
- History panel (last 3 devotions, collapsible)
- Updated `/api/generate` request shape including context envelope
- "Continue" mode for returning users
- Backend coordination required for context-threaded responses (external to this spec)

**Acceptance criteria:** A returning DevotionGuide user sees their history. A first-time user is walked through a short orientation before being handed the devotion form. The generation request includes the formation profile context.

---

### Phase 4 — Design System

**Goal:** One token source. Shared primitives. Accessible widgets.

**Deliverables:**
- `src/styles/tokens.css` with all brand constants
- Tailwind config updated to reference tokens
- `src/components/primitives/` with Button, Input, Card, EyebrowLabel, ProgressBar, SectionHeader
- `src/components/WidgetFrame.jsx`
- All six widgets refactored to use WidgetFrame and shared primitives
- All three newsletter capture forms refactored to use shared Input and Button components
- Accessibility pass: ARIA attributes on all interactive elements in primitives and widgets
- FirstFifteenWidget custom dropdown with keyboard navigation

**Acceptance criteria:** Changing `--cf-gold` in tokens.css changes gold across the entire site. Each widget file is under 400 lines. All interactive elements are keyboard-reachable.

---

### Phase 5 — Content Layer

**Goal:** Formation content separated from rendering logic.

**Deliverables:**
- `src/content/` directory with JSON files for all five content sections
- Identity.jsx refactored to import from content files (target: under 1,000 lines)
- SevenDayChallenge.jsx content extracted (target: under 400 lines)
- FieldGuide.jsx offices extracted (target: under 400 lines)
- RuleOfLife.jsx rhythm data extracted
- fruitAssessmentData.js converted to `src/content/assessment/fruit-questions.json`
- No visual or behavioral changes accompany this phase

**Acceptance criteria:** A new armor track day can be added by editing a JSON file without touching any JSX.

---

## What This Spec Does Not Include

A few things observed in the audit that are not addressed here:

**Authentication and multi-device sync.** The Formation Profile is local-first in v1. Multi-device sync requires a backend identity system and is a distinct initiative. The profile schema is designed to be serializable and uploadable when that work begins.

**A CMS.** The content layer in Phase 5 is a precondition for a CMS, not a CMS. Once content is in structured files, adding Contentful, Sanity, or a homegrown Supabase-backed admin becomes a routing change rather than a data architecture change.

**E-commerce improvements.** The Shop section and Shopify integration are outside scope here. The gear-to-content QR connection is addressed in Theme 2 (the `?qr=true` arrival state), but Shopify-side changes belong in a separate spec.

**New content sections.** Drop 002.5 (Belt, Breastplate, Shoes products), the Community pillar, and seasonal tracks are all signaled in the strategy roadmap. None of them should be built before the content layer in Phase 5 exists, or they will require the same extraction work retroactively.

---

## Decision Log

**Why rule-based recommendation over model-based (v1):** A model-backed NextStep requires a backend call on every completion moment. A rule-based recommendation is instant, works offline, and covers 80% of the variation with ten lines of logic. The rules engine in `formationRecommendation.js` can be replaced with a model call in v2 without changing the `<NextStep>` interface.

**Why localStorage over Supabase (v1):** The site has no authentication. Binding the formation profile to a Supabase row before the user has an account creates either an anonymous session that may never convert or a forced signup gate that will suppress engagement. localStorage-first preserves the frictionless experience while making the data available for every local enhancement. When the user provides an email, the profile can be upserted to Supabase at that point.

**Why JSON over MDX (content layer):** Described in Theme 5. Revisit when a content team or editorial workflow justifies the build complexity.

**Why these five themes and not a polish-first pass:** The accessibility gaps, mobile widget edge cases, and inconsistent spacing are real. But they are local fixes that do not change the product's strategic position. The formation arc work in Themes 1 and 2 is what makes Counter Formation different from a devotional app with apparel. Fixing mobile widget overflow before the user ever has a reason to return to the site is the wrong order of operations.
