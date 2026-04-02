# Session 6 Agent Swarm — Execution Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dispatch a 14-agent orchestrated swarm that executes the Session 6 polish pass — GSAP animations, mobile responsiveness, cross-links, and transition consistency — across the Counter Formation Identity pillar.

**Architecture:** Seven sequential phases. Phase 0 (parallel) produces reference documents consumed by all downstream agents. Phases 1–3 implement changes, with Identity.jsx touched sequentially to avoid merge conflicts. Phases 4–6 verify, enhance, and review. Each agent commits its own work before signalling completion.

**Tech Stack:** React 19, GSAP 3.14.2 + ScrollTrigger (already registered globally), React Router v7, Tailwind CSS v4, Vite 7. Project root: `c:\Users\luke.beazley\Documents\GitHub\counter-formation-web`

---

## File Structure

**Reference documents (written by Phase 0, read by all downstream agents):**
- `docs/superpowers/session6/ANIMATION_REFERENCE.md` — extracted GSAP patterns from App.jsx, RuleOfLife.jsx, SevenDayChallenge.jsx
- `docs/superpowers/session6/IDENTITY_STATE.md` — section-by-section current state of Identity.jsx vs. spec
- `docs/superpowers/session6/CROSSLINK_STATE.md` — current cross-link wiring and exact card JSX patterns

**Modified source files:**
- `src/Identity.jsx` — touched by 1-A, 2-A, 2-C (Section G only), 3-A, 3-B (sequentially)
- `src/RuleOfLife.jsx` — touched by 2-B only
- `src/SevenDayChallenge.jsx` — touched by 2-C only
- `src/Architecture.jsx` — touched by 2-C only
- `src/ScriptureRef.jsx` — touched by 3-D only
- `src/widgets/*.jsx` (6 files) — touched by 3-C only
- `src/App.jsx`, `src/index.css` — touched by 3-D if needed

---

## Task 1: Setup — Verify Project State

**Files:** None modified

- [ ] **Step 1: Verify the project builds clean before touching anything**

```bash
cd c:/Users/luke.beazley/Documents/GitHub/counter-formation-web
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors. If there are existing errors, note them — they are pre-existing and must not be introduced by the swarm.

- [ ] **Step 2: Verify session6 staging directory exists**

```bash
ls docs/superpowers/session6/
```

Expected: empty directory. If it doesn't exist, create it: `mkdir -p docs/superpowers/session6`

- [ ] **Step 3: Confirm all Identity source files are present**

```bash
ls src/Identity.jsx src/RuleOfLife.jsx src/SevenDayChallenge.jsx src/Architecture.jsx src/ScriptureRef.jsx src/widgets/
```

Expected: all files listed without errors.

---

## Task 2: Phase 0 — Dispatch Intelligence Agents (3 Parallel)

**USE SKILL: superpowers:dispatching-parallel-agents**

Dispatch all three agents simultaneously. Do not proceed to Task 3 until all three have completed and their output files exist.

- [ ] **Step 1: Dispatch 0-A, 0-B, 0-C in parallel**

Use three simultaneous Agent tool calls with the following prompts:

---

**Agent 0-A prompt:**
```
You are Agent 0-A: Pattern Extractor for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR ONLY JOB: Read the following files and produce a precise GSAP animation reference document. Do NOT modify any source files.

Read these files in full:
- src/App.jsx
- src/RuleOfLife.jsx
- src/SevenDayChallenge.jsx

Extract and document EVERY GSAP pattern you find, including:
1. All gsap.to / gsap.from / gsap.fromTo / gsap.set calls — exact properties, values, durations, ease functions
2. All gsap.timeline() configurations — defaults, labels, overlaps
3. All ScrollTrigger configurations — trigger selectors, start/end values, toggleActions, scrub, once, pin, markers
4. All gsap.context() usage — how cleanup is structured
5. All stagger patterns — numeric values and object configurations
6. The CinematicHero particle field animation in App.jsx — extract the exact CSS/animation technique
7. Any prefers-reduced-motion checks
8. The IntersectionObserver usage if present
9. Any ambient/looping animations (repeat: -1, yoyo)
10. How ScrollTrigger.batch() is used if present

For each pattern, include a code snippet showing the actual implementation.

Write your output to: docs/superpowers/session6/ANIMATION_REFERENCE.md

Format it as a reference sheet with sections: Timeline Patterns, ScrollTrigger Patterns, Stagger Patterns, Cleanup Patterns, Ambient Animation Patterns, Particle Field Pattern, Ease Function Reference.

After writing the file, commit it:
git add docs/superpowers/session6/ANIMATION_REFERENCE.md
git commit -m "Session 6 [0-A]: Animation reference extracted"

Report back with: "0-A COMPLETE — ANIMATION_REFERENCE.md written" and the count of distinct patterns documented.
```

---

**Agent 0-B prompt:**
```
You are Agent 0-B: Identity State Mapper for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR ONLY JOB: Read Identity.jsx and the spec files, then produce a state map document. Do NOT modify any source files.

Read these files in full:
- src/Identity.jsx (this is a large file — read it completely)
- specs/spec-landing-page.md
- specs/spec-visual-identity.md

Produce a section-by-section state map comparing what currently exists in Identity.jsx against what the Session 6 spec requires. For each section (A Hero, B What Is the Armor, C This Is God's Armor, D Six Armor Pieces, E Brand Integration, F Collection Drop, G CTA), document:

1. EXISTING: What JSX/CSS/animation code currently exists for this section
   - Current CSS class names and inline styles used
   - Any GSAP code already present
   - Current responsive styles
   - Current data structures used

2. MISSING: What the Session 6 spec requires that is not yet implemented
   - Which animations are absent
   - Which mobile breakpoints are unhandled
   - Which cross-links are missing

3. WIDGET INTEGRATION: For each of the 6 armor piece sections in Section D, note:
   - Which widget component is rendered (ExamenWidget, DeclarationWidget, PeacePauseWidget, ArrowLogWidget, FirstFifteenWidget, VerseTrackerWidget)
   - Where in the JSX it appears
   - Current ref structure for the sidebar/sticky behavior

4. CSS CLASS INVENTORY: List all Tailwind classes and inline style patterns used on elements that will receive new animations (so the animation agent knows exactly what selectors to target)

5. GSAP CONTEXT: Note whether any gsap.context() cleanup is already present and where

Write your output to: docs/superpowers/session6/IDENTITY_STATE.md

After writing, commit it:
git add docs/superpowers/session6/IDENTITY_STATE.md
git commit -m "Session 6 [0-B]: Identity state mapped"

Report back with: "0-B COMPLETE — IDENTITY_STATE.md written" and a one-line summary of the biggest gap found.
```

---

**Agent 0-C prompt:**
```
You are Agent 0-C: Cross-Link Auditor for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR ONLY JOB: Read the files below and produce a cross-link state document. Do NOT modify any source files.

Read these files in full:
- src/RuleOfLife.jsx
- src/SevenDayChallenge.jsx
- src/Architecture.jsx
- src/widgets/ArrowLogWidget.jsx
- src/widgets/DeclarationWidget.jsx
- src/widgets/ExamenWidget.jsx
- src/widgets/FirstFifteenWidget.jsx
- src/widgets/PeacePauseWidget.jsx
- src/widgets/VerseTrackerWidget.jsx

Document the following:

1. WIDGET CROSS-LINKS (Identity → Rule of Life): For each widget, does it currently contain a link to a /rule-of-life/ page? If yes, what is the exact link URL and what JSX renders it? Expected wiring:
   - Belt of Truth widget (ExamenWidget) → /rule-of-life/presence
   - Gospel of Peace widget (PeacePauseWidget) → /rule-of-life/sabbath
   - Shield of Faith widget (ArrowLogWidget) → /rule-of-life/community
   - Helmet of Salvation widget (FirstFifteenWidget) → /rule-of-life/scripture
   - Sword of the Spirit widget (VerseTrackerWidget) → /rule-of-life/scripture
   - Breastplate widget (DeclarationWidget) → none expected

2. RULE OF LIFE → IDENTITY CARDS: Does RuleOfLife.jsx currently have any "Connected Armor" cards or similar cross-links to /identity pages? If yes, show the exact JSX. If no, show the EXACT JSX pattern used for existing "further reading" or sidebar cards in RuleOfLife.jsx so new Connected Armor cards can match it precisely. Include: card container classes, label styling, title styling, tagline styling, link component used (Link vs anchor), and exact className strings.

3. SEVEN-DAY CHALLENGE: Does SevenDayChallenge.jsx have any cross-link to /identity in the Day 7 completion state? Show the exact JSX for the completion state component so the addition can be made correctly.

4. ARCHITECTURE.JSX: What does the Identity panel in Architecture.jsx currently link to? Show the exact CTA button/link JSX. Does it link to /identity or to a CampaignPage component?

5. IDENTITY SECTION G: Does Identity.jsx's CTA section (Section G) currently have a tertiary link to /7-day-challenge? 

Write your output to: docs/superpowers/session6/CROSSLINK_STATE.md

Include the full JSX card pattern from Rule of Life — this is critical for the implementation agents.

After writing, commit it:
git add docs/superpowers/session6/CROSSLINK_STATE.md
git commit -m "Session 6 [0-C]: Cross-link state audited"

Report back with: "0-C COMPLETE — CROSSLINK_STATE.md written" and a bullet list of which cross-links are already wired vs. missing.
```

---

- [ ] **Step 2: Confirm all three output files exist before proceeding**

```bash
ls -la docs/superpowers/session6/
```

Expected: `ANIMATION_REFERENCE.md`, `IDENTITY_STATE.md`, `CROSSLINK_STATE.md` — all present and non-empty (>1KB each).

---

## Task 3: Phase 1 — Landing Page Animations (Sequential)

Single agent. Exclusive write access to `src/Identity.jsx`. Do not proceed to Task 4 until this agent completes and commits.

- [ ] **Step 1: Dispatch Agent 1-A**

**Agent 1-A prompt:**
```
You are Agent 1-A: Landing Page Animator for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

CONTEXT FILES — read these before writing any code:
- docs/superpowers/session6/ANIMATION_REFERENCE.md (exact GSAP patterns used in this codebase)
- docs/superpowers/session6/IDENTITY_STATE.md (current state of Identity.jsx, what exists vs. what's missing)
- specs/spec-visual-identity.md (brand colors, typography)

BRAND TONE: This brand is a monastery, not a startup. All animations must feel weighted, intentional, and cinematic. Never bouncy. Never playful. Slow enough to register, never slow enough to feel sluggish.

YOUR JOB: Add GSAP ScrollTrigger animations to the /identity landing page in src/Identity.jsx. You are implementing all of Session 6 Part 1 — Sections A through G.

ANIMATION CONSTRAINTS (non-negotiable):
- Maximum duration: 1.2s. Most should be 0.7–0.9s.
- Standard ease: power2.out
- Hero elements ease: power3.out
- Ambient/pulse ease: sine.inOut
- All ScrollTrigger instances: toggleActions: "play none none reverse"
- All grouped element entrances: use ScrollTrigger.batch() for efficiency
- All GSAP code must live inside gsap.context() and return ctx.revert() as cleanup
- Wrap all GSAP animations in a prefers-reduced-motion check:
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // skip all animations

SECTION A — HERO:
- Shield watermark element: add parallax drift on scroll using ScrollTrigger scrub. translateY at 0.3x scroll speed. Use scrub: true with a ScrollTrigger on the hero section spanning "top top" to "bottom top".
- Particle field: If a particle field component or CSS animation doesn't exist, add one matching the homepage CinematicHero radial-gradient dot pattern. Use a ::before pseudo-element or a dedicated div with repeating-radial-gradient and a gentle CSS keyframe animation for vertical drift (animation: particleDrift 20s linear infinite).
- Headline (the "YOU ARE BEING FORMED" text): On page load (not scroll), gsap.fromTo with opacity 0→1, scale 0.97→1.0, duration 1.2s, ease power3.out. Set initial state with gsap.set before animating.
- Subline: fade in 400ms after headline starts (delay: 0.4 or timeline offset)
- Eyebrow label (EPHESIANS 6:10-18 or similar): fade in 200ms after subline
- Scroll indicator (chevron or gold line at bottom of hero): gsap.to with opacity cycling 0.4→1.0, duration 1.4s, ease sine.inOut, repeat: -1, yoyo: true
- Hero exit parallax: Add a ScrollTrigger on the hero that, as user scrolls past it, fades the headline and subline out with slight translateY upward (y: -30, opacity: 0, scrub: true)

SECTION B — WHAT IS THE ARMOR OF GOD:
- Eyebrow label: ScrollTrigger, start "top 85%", fromTo y:20→0, opacity:0→1, duration 0.8s, power2.out
- Scripture block (full Ephesians passage): ScrollTrigger, start "top 85%", fromTo y:20→0, opacity:0→1, duration 1.0s, delay after eyebrow visible (use timeline or stagger offset of 0.2s)
- Teaching paragraphs: ScrollTrigger.batch() on all paragraph elements, stagger 0.15s between each, fromTo y:15→0, opacity:0→1, duration 0.8s
- Gold horizontal rule: ScrollTrigger, animate width from 0% to 100%, duration 0.8s, power2.out. Use gsap.fromTo on the element's scaleX (set transformOrigin: "left center") or directly on width if it's an element with explicit width.

SECTION C — THIS IS GOD'S ARMOR:
- Left column: ScrollTrigger start "top 80%", fromTo y:25→0, opacity:0→1, duration 0.9s
- Right column (Isaiah 59:17 typographic block): same ScrollTrigger trigger point, delay 0.3s after left column starts
- Brand line ("You are not inventing identity. You are receiving it."): ScrollTrigger, fromTo opacity:0→1, scale:1.03→1.0, duration 1.0s. After it becomes visible, animate the CSS text-shadow from "0 0 20px rgba(201,168,76,0.4)" to "0 0 0px rgba(201,168,76,0)" over 2.0s using gsap.to on a CSS variable or direct style. This gold glow should dissipate, not persist.
- Background color transition Hero Black (#06050A) to Rule Brown (#17140F): Use a ScrollTrigger with scrub:true spanning the Section C container. Animate the backgroundColor of the section or a full-width overlay. Use scrub: 1.5 for smoothness over approximately 200vh of scroll distance.

SECTION D — THE SIX ARMOR PIECES:
- For each armor piece subsection (01 through 06): ScrollTrigger on the subsection container, start "top 80%", toggleActions "play none none reverse"
- Odd-numbered pieces (01, 03, 05): fromTo x:-30→0, opacity:0→1, duration 0.9s, power2.out
- Even-numbered pieces (02, 04, 06): fromTo x:30→0, opacity:0→1, duration 0.9s, power2.out
- The large watermark numeral (01, 02, etc.): do NOT animate it. It should already be visible (opacity 8-10%) as the section enters. If it's currently hidden, set it to opacity 0.08 as a static style, not an animation.
- Gold eyebrow label for each piece: on ScrollTrigger enter, add a CSS class that triggers a shimmer keyframe — a single left-to-right gradient sweep (background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%) moving from left:-100% to left:100% over 0.8s, once). After the sweep, the element returns to its normal gold color. Implement this as a CSS animation class toggled by JS.
- "Explore this piece →" links: fade in 300ms after the parent section content animation completes. Use timeline with label or delay: 0.3 on the link fade-in.

SECTION E — BRAND INTEGRATION:
- Prose paragraphs: ScrollTrigger.batch(), stagger 0.15s, fromTo y:15→0, opacity:0→1, duration 0.8s
- Closing brand line ("The gear is not the mission. It's a marker of it."): same gold glow dissipation treatment as Section C brand line.

SECTION F — COLLECTION DROP:
- Background transition: ScrollTrigger scrub on the section container, animate backgroundColor from the current dark value toward Gear Warm (#F5F2EC). Use scrub: 1 over the full section height.
- Product cards: ScrollTrigger.batch() on card elements, stagger 0.15s, fromTo y:20→0, opacity:0→1, duration 0.8s
- Hover lift (desktop only — skip if touch device): Add CSS to card elements: transition: transform 300ms ease, box-shadow 300ms ease. On hover: transform: translateY(-4px), box-shadow increase. Use inline style or add a class. Do NOT use GSAP for this — pure CSS hover is correct here.

SECTION G — CTA:
- Primary button: ScrollTrigger, fromTo y:15→0, opacity:0→1, duration 0.8s
- Secondary button: same ScrollTrigger trigger, delay 0.15s after primary
- Closing scripture: delay 0.3s after secondary button, same fade-in
- Helmet watermark at bottom: do NOT animate it. It should be static at low opacity.

IMPLEMENTATION APPROACH:
1. Read src/Identity.jsx carefully first using the IDENTITY_STATE.md map to understand current structure
2. Add all animations inside a single useEffect with gsap.context() — do not scatter animations across multiple useEffects
3. Use refs or document.querySelector within the context for element selection
4. Return ctx.revert() from the useEffect cleanup
5. If GSAP and ScrollTrigger imports don't exist in Identity.jsx, add them (they're already in package.json)
6. Do not break any existing functionality

After implementing, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

The build must succeed before committing. If it fails, fix the errors.

Then commit:
git add src/Identity.jsx
git commit -m "Session 6 [1-A]: Landing page animations — Sections A-G"

Report back with: "1-A COMPLETE" and a list of every ScrollTrigger and timeline added, with the section it belongs to.
```

- [ ] **Step 2: Verify commit exists**

```bash
git log --oneline -5
```

Expected: most recent commit is "Session 6 [1-A]: Landing page animations — Sections A-G"

---

## Task 4: Phase 2 — Piece Animations + Cross-Links (Parallel)

**USE SKILL: superpowers:dispatching-parallel-agents**

2-B and 2-C touch independent files and run fully in parallel. 2-A touches Identity.jsx in the piece page sections. Since 2-A and 2-C both touch Identity.jsx, dispatch 2-A and 2-B in parallel first, then dispatch 2-C after 2-A completes (2-C can overlap with 2-B completing).

- [ ] **Step 1: Dispatch 2-A and 2-B in parallel**

---

**Agent 2-A prompt:**
```
You are Agent 2-A: Piece Page Animator for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

CONTEXT FILES — read these before writing any code:
- docs/superpowers/session6/ANIMATION_REFERENCE.md
- docs/superpowers/session6/IDENTITY_STATE.md

BRAND TONE: Weighted, intentional, cinematic. Never bouncy. The brand is a monastery.

YOUR JOB: Add GSAP animations to the individual /identity/[piece] pages in src/Identity.jsx. These are the detail pages for each of the 6 armor pieces (belt-of-truth, breastplate-of-righteousness, gospel-of-peace, shield-of-faith, helmet-of-salvation, sword-of-the-spirit).

IMPORTANT: The main landing page animations were added in a previous pass. You are only adding animations to the PIECE PAGE template — the component that renders when a slug like /identity/belt-of-truth is active. Read IDENTITY_STATE.md to understand how the piece page component is structured in Identity.jsx.

ANIMATION CONSTRAINTS:
- Maximum duration: 1.2s. Most 0.7–0.9s. Exception: Ken Burns hero settle is 1.5s (allowed — it's a settle, not an entrance).
- Standard ease: power2.out
- Hero elements: power3.out
- All ScrollTrigger: toggleActions "play none none reverse"
- Sidebar widget animation: once: true (does NOT replay on scroll back)
- All GSAP inside gsap.context() with ctx.revert() cleanup
- prefers-reduced-motion check at top of useEffect: if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

PAGE LOAD ANIMATIONS (trigger immediately on mount, not on scroll):
- Hero image: gsap.fromTo on the hero image element, scale: 1.02 → 1.0, duration: 1.5s, ease: power2.out. Set initial state with gsap.set first.
- Gold eyebrow label (armor piece category/number): gsap.fromTo, y: 15→0, opacity: 0→1, duration: 0.8s, ease: power2.out. Start at page load after a 0.1s delay.
- Piece title (e.g., "BELT OF TRUTH"): gsap.fromTo, y: 20→0, opacity: 0→1, duration: 0.9s, ease: power3.out. Start 0.2s after eyebrow.
- Anchor scripture (the primary scripture verse below the title): gsap.fromTo, y: 15→0, opacity: 0→1, duration: 0.8s, delay: 0.3s after title animation starts.

SCROLL-TRIGGERED ANIMATIONS:
- Each day section container (Day 1 through Day 5, or however many days exist per piece): ScrollTrigger on each container, start "top 82%", fromTo y:25→0, opacity:0→1, duration:0.9s, ease:power2.out, toggleActions:"play none none reverse"
- Section labels within each day (STILLNESS, SCRIPTURE, TEACHING, REFLECTION, PRACTICE, PRAYER): These are gold eyebrow-style labels. ScrollTrigger individually as they scroll into view, fromTo y:15→0, opacity:0→1, duration:0.7s
- Scripture blocks within each day section: ScrollTrigger, start "top 85%", fromTo y:15→0, opacity:0→1, duration:0.8s, delay:0.2s (after their section label becomes visible)
- Practice section: standard ScrollTrigger fade-up, y:15→0, opacity:0→1, duration:0.8s
- Prayer section: standard ScrollTrigger fade-up, same as practice

SIDEBAR WIDGET:
- The widget in the sidebar should fade in when its container first becomes visible on scroll.
- Use ScrollTrigger with once: true — it MUST NOT re-animate if the user scrolls up and back down.
- gsap.fromTo on the widget container: opacity:0→1, y:20→0, duration:0.9s, ease:power2.out
- ScrollTrigger: { trigger: widgetRef.current, start: "top 80%", once: true }
- Sticky sidebar behavior: if the sidebar is currently not sticky, add position:sticky, top: 2rem, height:fit-content to the sidebar container. Do not break existing layout.

DAY NAVIGATION (PREV/NEXT DAY):
- The bottom day navigation buttons (if they exist): ScrollTrigger, start "top 90%", fromTo y:15→0, opacity:0→1, duration:0.8s, stagger:0.1s between prev and next

ARMOR PIECE NAVIGATION (PREV/NEXT PIECE):
- Add prev/next navigation at the bottom of each piece page linking to adjacent armor pieces. Match the pattern used in RuleOfLife.jsx for rhythm-to-rhythm navigation (read src/RuleOfLife.jsx to see this pattern).
- The ARMOR_PIECES array in Identity.jsx defines the 6 pieces in order. Use the current piece's index to determine prev/next slugs.
- Each nav item should show: piece number (01, 02...), piece name, and a ← or → directional indicator.
- Style to match RuleOfLife rhythm nav (look at RuleOfLife.jsx for exact classes).
- Add ScrollTrigger fade-up on this nav section: start "top 90%", fromTo y:15→0, opacity:0→1, duration:0.8s.

After implementing, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed before committing. Fix any errors.

Then commit:
git add src/Identity.jsx
git commit -m "Session 6 [2-A]: Piece page animations + armor piece navigation"

Report back with: "2-A COMPLETE" and a list of animations added.
```

---

**Agent 2-B prompt:**
```
You are Agent 2-B: RuleOfLife Cross-Linker for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

CONTEXT FILES — read these before writing any code:
- docs/superpowers/session6/CROSSLINK_STATE.md (contains the exact existing card JSX pattern to match)

YOUR JOB: Add "Connected Armor" cross-link cards to the relevant Rule of Life rhythm pages in src/RuleOfLife.jsx.

CARDS TO ADD (exact mapping):
1. Presence rhythm page → Card linking to /identity/belt-of-truth
   - Label: "CONNECTED ARMOR"
   - Title: "BELT OF TRUTH"
   - Tagline: "The foundation everything else attaches to"

2. Scripture rhythm page → TWO cards stacked:
   Card A: → /identity/sword-of-the-spirit
   - Label: "CONNECTED ARMOR"
   - Title: "SWORD OF THE SPIRIT"
   - Tagline: "The Word is a weapon"
   
   Card B: → /identity/helmet-of-salvation
   - Label: "CONNECTED ARMOR"
   - Title: "HELMET OF SALVATION"
   - Tagline: "A protected mind"

3. Sabbath rhythm page → Card linking to /identity/gospel-of-peace
   - Label: "CONNECTED ARMOR"
   - Title: "GOSPEL OF PEACE"
   - Tagline: "Ground beneath you"

4. Community rhythm page → Card linking to /identity/shield-of-faith
   - Label: "CONNECTED ARMOR"
   - Title: "SHIELD OF FAITH"
   - Tagline: "Behind what God has said"

5. Prayer rhythm page → NO card (correct, skip)

CARD DESIGN REQUIREMENTS:
- Match the EXACT existing card/further-reading pattern from CROSSLINK_STATE.md. Do not introduce a new card design.
- Label ("CONNECTED ARMOR"): gold color, small, uppercase tracking — same as existing labels
- Title (armor piece name): Barlow Condensed font, same weight as existing card titles
- Tagline: Cormorant Garamond italic, muted/reduced opacity color
- The entire card is a clickable link (use React Router <Link> to={"/identity/..."})
- Placement: same location as the existing "further reading" or sidebar bottom section in each rhythm page

IMPLEMENTATION:
1. Read CROSSLINK_STATE.md first — it contains the exact JSX to replicate
2. Read src/RuleOfLife.jsx to understand how each rhythm's JSX is structured and where further reading/cards are placed
3. Add the cards in the appropriate location for each rhythm
4. Use <Link> from react-router-dom (it should already be imported)
5. Do not remove or alter any existing content

After implementing, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix errors if any.

Commit:
git add src/RuleOfLife.jsx
git commit -m "Session 6 [2-B]: Connected Armor cross-link cards added to Rule of Life rhythm pages"

Report back with: "2-B COMPLETE" and confirmation of which rhythm pages received cards.
```

---

- [ ] **Step 2: After 2-A completes (2-B may still be running), dispatch 2-C**

**Agent 2-C prompt:**
```
You are Agent 2-C: Challenge + Architecture Linker for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

CONTEXT FILES — read these before writing any code:
- docs/superpowers/session6/CROSSLINK_STATE.md

YOUR JOB: Wire three remaining cross-links. You will modify three files.

TASK 1 — SevenDayChallenge.jsx: Add Identity cross-link to Day 7 completion state

Read src/SevenDayChallenge.jsx. Find the Day 7 completion state — the JSX that renders after the user has completed all 7 days (CROSSLINK_STATE.md will show you where this is and what JSX is present).

Add the following content in the Day 7 completion state, styled as a subtle CTA (NOT a primary button — gold text + arrow, same visual register as existing in-content cross-links):

Text block: "You've completed the 7-Day Challenge. Ready to go deeper? The Armor of God formation tracks take the disciplines you've started and build them into a daily practice."

Link: "Begin the Armor of God →" linking to /identity

Styling: match the existing subtle text link / cross-link style in SevenDayChallenge.jsx. Gold (#C9A84C) text color, small arrow →, no button background, understated. Use <Link to="/identity"> from react-router-dom.

TASK 2 — Architecture.jsx: Verify and fix Identity panel link

Read src/Architecture.jsx. Find the Identity panel (the one with the Identity pillar content in the 3-panel carousel). Verify the CTA/button links to /identity. If it currently links to a CampaignPage component or any other path, change it to <Link to="/identity"> or navigate("/identity").

Confirm that the Practice and Community panels still link to their own CampaignPage-style destinations — do NOT change those.

TASK 3 — Identity.jsx Section G: Add 7-Day Challenge on-ramp link

Read src/Identity.jsx. Find Section G (the CTA section at the bottom of the landing page). Look for the tertiary link "New to Counter Formation? Start with the 7-Day Challenge →". 

If this link already exists: verify it links to /7-day-challenge and report it as confirmed.
If this link is missing: add it below the primary and secondary CTA buttons. Style as a subtle tertiary link — smaller text, muted color, no button background. "New to Counter Formation? Start with the 7-Day Challenge →" linking to /7-day-challenge.

After all three tasks, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix errors.

Commit:
git add src/SevenDayChallenge.jsx src/Architecture.jsx src/Identity.jsx
git commit -m "Session 6 [2-C]: Cross-links — Challenge completion CTA, Architecture panel, Identity Section G"

Report back with: "2-C COMPLETE" and confirmation of each of the three tasks (found/added/verified).
```

---

- [ ] **Step 3: Wait for all three agents (2-A, 2-B, 2-C) to complete, then verify build**

```bash
cd c:/Users/luke.beazley/Documents/GitHub/counter-formation-web && npm run build 2>&1 | tail -10
```

Expected: clean build. If errors, the next phase agents will catch them.

---

## Task 5: Phase 3 — Mobile Audit (Mixed Parallel)

**USE SKILL: superpowers:dispatching-parallel-agents**

Dispatch 3-C and 3-D immediately in parallel. Then dispatch 3-A. After 3-A completes, dispatch 3-B. All four must complete before Task 6.

- [ ] **Step 1: Dispatch 3-C and 3-D in parallel**

---

**Agent 3-C prompt:**
```
You are Agent 3-C: Widget Mobile Fixer for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Fix mobile responsiveness for all 6 widget files. Read each file carefully before modifying it.

TARGET BREAKPOINTS: 375px (iPhone SE), 390px (iPhone 14), 428px (iPhone 14 Pro Max)

FILES TO MODIFY:
- src/widgets/ArrowLogWidget.jsx
- src/widgets/PeacePauseWidget.jsx
- src/widgets/FirstFifteenWidget.jsx
- src/widgets/VerseTrackerWidget.jsx
- src/widgets/DeclarationWidget.jsx
- src/widgets/ExamenWidget.jsx

GLOBAL RULE (apply to ALL widgets without exception):
Every <input>, <textarea>, and <select> element must have font-size of at least 16px. This prevents iOS Safari from auto-zooming the page when the user focuses an input. If Tailwind classes set font-size smaller than 16px on inputs, override with explicit style or a Tailwind class that ensures 16px minimum (text-base = 1rem = 16px).

PER-WIDGET FIXES:

ArrowLogWidget (the "Arrow Log" for Shield of Faith):
- Read the current layout. If it uses a two-column layout (e.g., flex with two columns for lie/truth), add a media query or Tailwind responsive class so it stacks to a single column at widths < 380px. Use flex-col on very narrow screens.
- Ensure all buttons/inputs meet 44px minimum height touch target.

PeacePauseWidget (the 3x daily peace pause):
- The three buttons (morning, midday, evening) must not overflow their container on 375px screens. Options: flex-wrap so they wrap to next line, or reduce button padding on mobile. Pick whichever keeps them readable. Add min-height: 44px to all buttons.

FirstFifteenWidget (the 15-minute devotional timer):
- Ensure all selector buttons / day selectors have min-height: 44px and min-width: 44px for adequate tap targets.
- Check for any element that might overflow at 375px width.

VerseTrackerWidget (scripture memorization with M T W T F S S checkboxes):
- The seven day-of-week checkboxes must fit in a single row at 375px. Calculate: 375px - padding. If they don't fit, reduce the checkbox size slightly (keeping min 36px touch target) or reduce spacing between them. Use flex with justify-between or a grid-cols-7 approach.
- Checkbox tap targets must be at least 36x36px (min allowed for checkboxes).

DeclarationWidget (the identity declaration builder):
- The generated declaration card must be fully visible at 375px — no horizontal clipping, no overflow: hidden cutting it off. If the card has a fixed width wider than 375px, change to width: 100% or max-width: 100%.
- Any share/copy buttons must have min-height: 44px.

ExamenWidget (the daily examen practice — 5 questions):
- Read and audit for any layout that might overflow at 375px.
- Ensure navigation buttons (previous question, next question) are full-width stacked on mobile if they're currently side-by-side and cramped.
- All interactive elements min 44px height.

After all six widgets are fixed, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix errors.

Commit:
git add src/widgets/
git commit -m "Session 6 [3-C]: Widget mobile fixes — touch targets, layout, iOS zoom prevention"

Report back with: "3-C COMPLETE" and a summary of what was changed in each widget.
```

---

**Agent 3-D prompt:**
```
You are Agent 3-D: Global Mobile + ScriptureRef for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Fix global mobile issues and ScriptureRef mobile behavior.

FILES TO AUDIT AND POTENTIALLY MODIFY:
- src/ScriptureRef.jsx (primary target)
- src/App.jsx (nav touch targets only — do not touch animations)
- src/index.css (global rules only if needed)

TASK 1 — ScriptureRef.jsx mobile behavior:
Read src/ScriptureRef.jsx in full.

The component currently has hover behavior for desktop. On mobile (touch devices), popovers must appear on tap, not hover. Verify:
- The component checks for touch capability (window.matchMedia("(hover: none)") or similar) and uses click/tap instead of mouseenter/mouseleave on touch devices.
- If this is already implemented, confirm it works at 375px width by reading the boundary detection logic.
- The popover must not be clipped by viewport edges at 375px. The component has boundary detection — verify the logic handles the case where the trigger element is near the right or bottom edge of a 375px screen. The popover max-width is 420px — on a 375px screen this must not cause overflow. If the popover is wider than the viewport, cap it at min(420px, calc(100vw - 32px)).
- Dismiss behavior: tap outside or press Escape must close the popover. Verify this works.

TASK 2 — Touch target audit across global navigation:
Read src/App.jsx. Find all navigation elements (header links, menu items, back-to-home links). Verify they have minimum 44px height and 44px width. If any nav link is only text with no padding creating a touch target, add py-3 (12px top/bottom = 24px total, get to 44px with line-height) or explicit min-height: 44px.

Only modify App.jsx if touch targets are genuinely inadequate. Do not refactor navigation structure.

TASK 3 — Z-index audit:
In App.jsx and index.css, check for z-index values on: the main navigation/header, any sticky sidebar containers in Identity pages, ScriptureRef popovers, any overlay/modal elements. Verify there are no conflicts where the header might appear below a sticky sidebar, or where ScriptureRef popovers might appear behind navigation.

Document what you find. Fix any genuine conflicts. The ScriptureRef popover should have the highest z-index among content elements (higher than sticky sidebar, lower than modal overlays if any exist).

TASK 4 — Scroll restoration:
Check src/App.jsx. Verify that React Router's <ScrollRestoration> component is used, or that a useEffect in the router scrolls to top on route change. Common pattern: 
  import { ScrollRestoration } from "react-router-dom";
  // placed inside the router outlet
If scroll restoration is missing entirely, add it. If it exists, confirm it's working.

After all tasks, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix errors.

Only commit files you actually changed:
git add src/ScriptureRef.jsx  # always
git add src/App.jsx  # only if modified
git add src/index.css  # only if modified
git commit -m "Session 6 [3-D]: ScriptureRef mobile tap, touch targets, z-index audit, scroll restoration"

Report back with: "3-D COMPLETE" and a summary of each task (what was found and what was changed).
```

---

- [ ] **Step 2: After 3-C and 3-D are dispatched, dispatch 3-A immediately (don't wait for them)**

**Agent 3-A prompt:**
```
You are Agent 3-A: Landing Page Mobile for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Audit and fix mobile layout for the /identity landing page in src/Identity.jsx.

TARGET BREAKPOINTS: 375px (iPhone SE), 390px (iPhone 14), 428px (iPhone 14 Pro Max), 768px (iPad), 1024px (iPad landscape)

Read src/Identity.jsx carefully. You are only working on the landing page sections (Section A through G), NOT the individual piece page template.

CHECKLIST — fix every item that is currently broken:

SECTION A — HERO:
- Hero headline ("YOU ARE BEING FORMED" or similar): Must use clamp() for fluid font sizing. Example: font-size: clamp(2rem, 8vw, 5rem). If currently using a fixed px size, replace with clamp. Ensure text is readable and not clipped at 375px.
- Hero subline: Also clamp() if currently fixed. clamp(1rem, 3vw, 1.5rem) range.
- Shield watermark (the large semi-transparent shield background image): On mobile (max-width: 768px), it should either scale down significantly (max-width: 60vw, centered) or be hidden entirely (display: none below 480px) so it doesn't dominate small screens. Use a Tailwind responsive class or a CSS media query.

SECTION B — WHAT IS THE ARMOR:
- Reading column: Must have minimum 20px (1.25rem) padding on left and right sides on all mobile breakpoints. If currently using px-4 (16px), change to px-5 (20px) minimum. Check that text doesn't touch screen edges.

SECTION C — THIS IS GOD'S ARMOR:
- Two-column layout (prose left, Isaiah typographic treatment right): Must stack to a single column below 768px. If currently flex-row, add flex-col md:flex-row. The columns should stack with the right column below the left on mobile.

SECTION D — SIX ARMOR PIECES:
- Each armor piece subsection: Must not cause horizontal overflow on any breakpoint. If any element has a fixed width wider than its container, constrain it. Check for any translateX values in inline styles that might push content off-screen (though these are added by animations — make sure the initial CSS doesn't cause overflow before animations run).
- Large watermark numerals (01–06): These are large decorative numbers at 8-10% opacity. On mobile (below 768px), either reduce to opacity: 0.05 and scale down with font-size: clamp(4rem, 20vw, 8rem), or hide below 480px with display: none. They must not push layout or overwhelm small screens.

SECTION F — COLLECTION DROP:
- Product cards grid: Must be single column on mobile (< 768px) and two columns on tablet (768px+). If currently using a CSS grid with fixed columns, add responsive grid-cols-1 md:grid-cols-2 or equivalent. Three cards on desktop is fine.

SECTION G — CTA:
- Primary button: Must be full-width on mobile (width: 100% or w-full below 640px). Min-height: 48px.
- Secondary button: Same — full-width on mobile, min-height: 48px.
- Both buttons must be comfortable tap targets (44px minimum, 48px preferred).

GLOBAL:
- Verify no horizontal scroll exists at 375px by checking for any element with overflow: visible and content wider than 375px. Common culprits: fixed-width containers, wide images without max-width: 100%, negative margins wider than viewport.
- Any font sizes that are still fixed px (not clamp or responsive) on text elements larger than body text should be converted to clamp().

After fixing, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix errors.

Commit:
git add src/Identity.jsx
git commit -m "Session 6 [3-A]: Identity landing page mobile layout fixes"

Report back with: "3-A COMPLETE" and a checklist showing which items were already correct vs. which were fixed.
```

---

- [ ] **Step 3: After 3-A completes, dispatch 3-B (3-C and 3-D may still be running — that's fine)**

**Agent 3-B prompt:**
```
You are Agent 3-B: Piece Page Mobile for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Audit and fix mobile layout for the /identity/[piece] individual page template in src/Identity.jsx.

IMPORTANT: Another agent already fixed the landing page sections (Section A-G). You are only working on the individual PIECE PAGE template — the component/section that renders for routes like /identity/belt-of-truth.

Read src/Identity.jsx. Identify the piece page component (it will use the piece slug/data and render devotional content with a sidebar widget). You will be working on this section only.

TARGET BREAKPOINTS: 375px, 390px, 428px, 768px, 1024px

CHECKLIST:

LAYOUT COLLAPSE:
- Two-column layout (main content left, sidebar widget right): Must collapse to single column below 1024px. Add lg:flex-row flex-col or the equivalent grid/flex responsive classes.
- Below 768px (mobile): Sidebar widget should appear BELOW the main content.
- Between 768px and 1023px (tablet): Sidebar widget should appear ABOVE the main content (before the day sections). This makes it accessible on tablet without scrolling past all devotional content.
- Above 1024px (desktop): Side-by-side layout as designed.

DAY CONTENT SECTIONS:
- Each day's content must have comfortable reading width on mobile: max-width approximately 90vw, with minimum 20px padding on each side (px-5 minimum).
- Section labels (STILLNESS, SCRIPTURE, TEACHING, etc.): must remain readable at 375px. If using uppercase tracking classes that spread letters too wide, verify they don't overflow.

SCRIPTURE BLOCKS:
- Scripture verse text must wrap properly inside its container. If any scripture block uses overflow: hidden with fixed height, the long verses might be cut off. Ensure word-wrap: break-word or overflow-wrap: break-word is applied. Check for any max-width constraints on scripture blocks.

DAY NAVIGATION (PREV/NEXT DAY):
- The previous/next day navigation buttons at the bottom of each day view: Must be full-width and stacked vertically on mobile (< 640px). If currently displayed as flex-row side by side, add flex-col sm:flex-row. Each button should be w-full sm:w-auto on mobile.

ARMOR PIECE NAVIGATION (PREV/NEXT PIECE):
- The bottom armor piece navigation (added by a previous agent — Agent 2-A): Must be tappable and not cramped at 375px. If displayed side-by-side, verify both fit within 375px. If they don't, stack them vertically on mobile.

HERO IMAGE:
- The piece hero image must maintain its aspect ratio and not stretch. Verify it uses object-fit: cover or object-cover (Tailwind) with a defined height container. The container height on mobile should be reasonable (e.g., 40vh minimum, not taller than 50vh on 375px to leave room for content).

WATERMARK NUMERAL (01–06):
- The large decorative piece number displayed as a watermark: On mobile (< 768px), reduce font-size significantly with clamp() or a responsive class, or hide it below a certain breakpoint. It must not overwhelm the screen or cause layout issues on small devices.

After fixing, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix errors.

Commit:
git add src/Identity.jsx
git commit -m "Session 6 [3-B]: Identity piece page mobile layout fixes"

Report back with: "3-B COMPLETE" and a checklist showing which items were already correct vs. which were fixed.
```

---

- [ ] **Step 4: Wait for all four Phase 3 agents to complete, then verify build**

```bash
cd c:/Users/luke.beazley/Documents/GitHub/counter-formation-web && npm run build 2>&1 | tail -10
git log --oneline -10
```

Expected: all 4 Phase 3 commits present, clean build.

---

## Task 6: Phase 4 — Verification (2 Parallel Agents)

**USE SKILL: superpowers:dispatching-parallel-agents**

- [ ] **Step 1: Dispatch 4-A and 4-B simultaneously**

---

**Agent 4-A prompt:**
```
You are Agent 4-A: Cross-Link Verifier for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Verify every cross-link wired during Session 6 by reading the current state of the modified source files. Apply corrections directly for any missing or broken links.

Read these files:
- src/widgets/ExamenWidget.jsx (Belt of Truth — should link to /rule-of-life/presence)
- src/widgets/PeacePauseWidget.jsx (Gospel of Peace — should link to /rule-of-life/sabbath)
- src/widgets/ArrowLogWidget.jsx (Shield of Faith — should link to /rule-of-life/community)
- src/widgets/FirstFifteenWidget.jsx (Helmet of Salvation — should link to /rule-of-life/scripture)
- src/widgets/VerseTrackerWidget.jsx (Sword of the Spirit — should link to /rule-of-life/scripture)
- src/widgets/DeclarationWidget.jsx (Breastplate — should have NO cross-link)
- src/RuleOfLife.jsx (should contain Connected Armor cards for Presence, Scripture×2, Sabbath, Community)
- src/SevenDayChallenge.jsx (Day 7 completion state should have /identity link)
- src/Architecture.jsx (Identity panel should link to /identity)
- src/Identity.jsx Section G (should have /7-day-challenge tertiary link)

For each item, report: PASS (link exists and is correct) or FAIL (missing or incorrect URL).

For any FAIL items: fix them directly in the source file.

After any fixes, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

If fixes were made, commit:
git add [files changed]
git commit -m "Session 6 [4-A]: Cross-link verification fixes"

If no fixes were needed, commit a verification log only:
git add docs/superpowers/session6/CROSSLINK_VERIFICATION.md
git commit -m "Session 6 [4-A]: Cross-link verification — all links confirmed"

Report back with a pass/fail table for every cross-link checked.
```

---

**Agent 4-B prompt:**
```
You are Agent 4-B: Transition Consistency Auditor for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Audit all transition and routing consistency issues, then apply targeted fixes.

Read:
- src/App.jsx (router setup, ScrollRestoration, navigation)
- src/Identity.jsx (GSAP useEffect cleanup, animation code added in Session 6)
- public/_redirects (Cloudflare SPA routing)
- public/404.html (SPA fallback)

AUDIT CHECKLIST:

1. SCROLL RESTORATION:
   Verify that <ScrollRestoration> from react-router-dom is present in the router, OR that a useEffect scrolls to window.scrollTo(0,0) on route change. If neither exists, add <ScrollRestoration /> inside the router outlet in App.jsx.

2. GSAP CLEANUP — No Memory Leaks:
   Read all useEffect blocks in Identity.jsx that contain gsap code (added in Session 6 by agents 1-A and 2-A). Every such useEffect MUST:
   - Create a context: const ctx = gsap.context(() => { ... }, containerRef)
   - Return cleanup: return () => ctx.revert()
   If any GSAP useEffect is missing the cleanup return, add it.

3. FOUC PREVENTION:
   For elements that are animated from opacity:0 to opacity:1 on page load, verify they are initialized with gsap.set({ opacity: 0 }) BEFORE the animation runs. If any element flashes visible before fading in, it means gsap.set is missing or called after a render cycle. Identify and fix.

4. SCROLLTRIGGER REFRESH ON ROUTE CHANGE:
   When navigating between routes in a SPA, ScrollTrigger instances from the previous page can persist. Verify that ScrollTrigger.getAll().forEach(t => t.kill()) is called on component unmount, OR that the gsap.context().revert() pattern kills all ScrollTrigger instances associated with the context. The gsap.context revert should handle this automatically if contexts are properly scoped.

5. CLOUDFLARE SPA ROUTING:
   Check that public/_redirects contains:
   /* /index.html 200
   If the file doesn't exist or doesn't have this rule, create/add it. This ensures direct URL access to /identity/belt-of-truth works without 404.
   
   Check that public/404.html exists and redirects to the SPA. If it doesn't exist:
   Create public/404.html with content that redirects to index.html:
   <!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/"></head><body></body></html>

6. ARMOR PIECE NAVIGATION SCROLL TO TOP:
   When the user clicks prev/next armor piece navigation links (added in 2-A), the new page should scroll to top. Verify the <Link> components used navigate properly and that scroll restoration handles this. If scroll restoration is in place, this should be automatic.

After auditing and fixing, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Commit any fixes:
git add [files changed]
git commit -m "Session 6 [4-B]: Transition consistency — GSAP cleanup, scroll restoration, SPA routing"

If no fixes needed:
git add docs/superpowers/session6/TRANSITION_AUDIT.md
git commit -m "Session 6 [4-B]: Transition audit — all checks passed"

Report back with a pass/fail result for each of the 6 audit items.
```

---

- [ ] **Step 2: Wait for both agents, verify build**

```bash
cd c:/Users/luke.beazley/Documents/GitHub/counter-formation-web && npm run build 2>&1 | tail -10
```

---

## Task 7: Phase 5 — UX & Design Enhancement Review

Single agent. Reviews the full output of the swarm and applies targeted improvements.

- [ ] **Step 1: Dispatch Agent 5-A**

**Agent 5-A prompt:**
```
You are Agent 5-A: Enhancement Reviewer for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

CONTEXT: The Session 6 polish pass has been implemented by 11 previous agents. You are the quality reviewer. Your job is to evaluate the complete output holistically and apply targeted improvements.

BRAND TONE REMINDER: Counter Formation is premium Christian athletic lifestyle apparel. The Identity pillar is the Armor of God formation track. All design decisions should feel like a well-appointed monastery, not a startup. Weighted. Intentional. Cinematic.

Read these files before evaluating:
- src/Identity.jsx (all sections — landing and piece pages)
- src/RuleOfLife.jsx
- src/SevenDayChallenge.jsx
- src/widgets/ArrowLogWidget.jsx
- src/widgets/PeacePauseWidget.jsx
- src/widgets/ExamenWidget.jsx
- src/ScriptureRef.jsx

EVALUATE AND FIX THE FOLLOWING:

1. ANIMATION TIMING CONSISTENCY:
   Scan all new GSAP code added in Session 6. Verify:
   - No duration exceeds 1.2s (except Ken Burns 1.5s which is allowed)
   - Ease functions are correct: power2.out standard, power3.out hero, sine.inOut ambient
   - All ScrollTrigger instances have toggleActions: "play none none reverse"
   - No bouncy eases (elastic, bounce, back) anywhere
   Fix any violations.

2. MOBILE LAYOUT COHERENCE:
   Read the mobile CSS/responsive classes added in Phase 3. Check for:
   - Any inconsistency between landing page mobile treatment and piece page mobile treatment (e.g., different padding values that don't match)
   - Any mobile fix that works at 375px but might break at 768px (tablet) or 1024px (laptop)
   - Consistent typography scale across all mobile breakpoints
   Fix any inconsistencies.

3. MICRO-INTERACTION OPPORTUNITIES:
   Identify 2-3 specific places where a small, tasteful interaction would elevate quality without violating brand tone. Apply the highest-confidence one directly. Examples (implement whichever fits best based on what you see):
   - ScriptureRef trigger text: add a subtle gold underline that appears on hover (CSS transition, 200ms)
   - Armor piece cards on the landing page: if hover lift CSS was added in Section F for product cards but NOT for the armor piece cards in Section D, add the same subtle hover lift (translateY -3px, box-shadow 300ms) to the armor piece cards
   - "Explore this piece →" links: add a CSS transition on the arrow → that moves 3px right on hover (200ms)
   Apply only the one you're most confident about. Flag the others in your report.

4. SESSION 6 CHECKLIST AUDIT:
   Cross-reference the Session 6 spec requirements against what you can see in the code. Identify any checklist items from Parts 1-5 that appear to be missing or incomplete. Apply quick fixes for anything clearly missing (single-line additions, missing CSS properties). Flag anything complex for Session 7.

5. REGRESSION CHECK:
   Verify that the GSAP animations on the homepage (in App.jsx — CinematicHero, AnimatedCounter, Architecture section) are not impacted by any Identity.jsx changes. Read App.jsx briefly to confirm. If there are any ScrollTrigger global refresh issues that might affect the homepage, note them.

After applying improvements, run:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build

Build must succeed. Fix any errors introduced.

Commit:
git add [all changed files]
git commit -m "Session 6 [5-A]: UX enhancement review — timing fixes, micro-interactions, checklist gaps"

Report back with: "5-A COMPLETE" and:
- List of each animation violation found and fixed
- Which micro-interaction was applied and where
- List of checklist gaps found (fixed vs. flagged for Session 7)
- Regression check result
```

---

## Task 8: Phase 6 — Final Code Review and Completion Report

- [ ] **Step 1: Dispatch Agent 6-A**

**Agent 6-A prompt:**
```
You are Agent 6-A: Final Code Reviewer for the Counter Formation web project.

Project root: c:\Users\luke.beazley\Documents\GitHub\counter-formation-web

YOUR JOB: Perform a comprehensive code review of all Session 6 changes and produce the final completion report.

Read ALL of these files:
- src/Identity.jsx
- src/RuleOfLife.jsx
- src/SevenDayChallenge.jsx
- src/Architecture.jsx
- src/ScriptureRef.jsx
- src/widgets/ArrowLogWidget.jsx
- src/widgets/PeacePauseWidget.jsx
- src/widgets/FirstFifteenWidget.jsx
- src/widgets/VerseTrackerWidget.jsx
- src/widgets/DeclarationWidget.jsx
- src/widgets/ExamenWidget.jsx
- public/_redirects
- public/404.html

REVIEW CRITERIA — flag and fix any violation:

CODE QUALITY:
- [ ] No console.log statements in any modified file
- [ ] No commented-out code blocks left behind
- [ ] No TODO/FIXME comments left in code
- [ ] No unused imports added

GSAP CORRECTNESS:
- [ ] Every useEffect with GSAP code returns a cleanup: return () => ctx.revert()
- [ ] gsap.context() used for all animation blocks (not raw gsap.to outside context)
- [ ] No animation duration > 1.2s (except Ken Burns 1.5s)
- [ ] All ScrollTrigger toggleActions set to "play none none reverse"
- [ ] prefers-reduced-motion check present in all new GSAP useEffects
- [ ] No elastic/bounce/back ease functions used anywhere

MOBILE CORRECTNESS:
- [ ] No input/textarea without font-size ≥ 16px
- [ ] No fixed px font sizes on heading elements (should be clamp() or responsive)
- [ ] Touch targets ≥ 44px height on all interactive elements

CROSS-LINK CORRECTNESS:
- [ ] All /identity/[piece] URLs use valid slugs: belt-of-truth, breastplate-of-righteousness, gospel-of-peace, shield-of-faith, helmet-of-salvation, sword-of-the-spirit
- [ ] All /rule-of-life/[rhythm] URLs use valid slugs: presence, scripture, prayer, sabbath, community
- [ ] /7-day-challenge and /identity are correct route paths

For each violation found: fix it directly. Do not just flag it.

After all fixes, run the final build:
cd c:\Users\luke.beazley\Documents\GitHub\counter-formation-web && npm run build 2>&1

The build MUST be clean. Do not proceed with the report until the build succeeds.

If there are build errors, fix them.

FINAL COMMIT (only if fixes were made):
git add [all changed files]
git commit -m "Session 6 [6-A]: Final code review fixes"

Then write the SESSION 6 COMPLETION REPORT to docs/superpowers/session6/COMPLETION_REPORT.md:

---
# Session 6 Completion Report

## 1. Animation Additions
[List every animation added, organized by page. Format: element description | animation type | duration | trigger]

## 2. Mobile Fixes Applied
[Checklist format showing every mobile item from the Session 6 spec — FIXED, VERIFIED (was already correct), or SKIPPED (with reason)]

## 3. Cross-Links Confirmed
[Table showing every cross-link, direction, from/to, status]

## 4. Unresolved Issues
[Any issues that could not be resolved, with explanation of why and what the next step would be]

## 5. Recommendations for Session 7
[Prioritized list of follow-up polish items identified during Session 6 execution]
---

Commit the report:
git add docs/superpowers/session6/COMPLETION_REPORT.md
git commit -m "Session 6 [6-A]: Completion report"

Report back with: "6-A COMPLETE — SESSION 6 DONE" and paste the full completion report.
```

---

- [ ] **Step 2: Verify final build is clean**

```bash
cd c:/Users/luke.beazley/Documents/GitHub/counter-formation-web && npm run build 2>&1 | tail -20
```

Expected: zero errors, zero warnings related to Session 6 changes.

- [ ] **Step 3: Review the completion report**

```bash
cat docs/superpowers/session6/COMPLETION_REPORT.md
```

- [ ] **Step 4: Review the full git log for Session 6**

```bash
git log --oneline | grep "Session 6"
```

Expected output (14 commits minimum):
```
Session 6 [6-A]: Completion report
Session 6 [6-A]: Final code review fixes (if any)
Session 6 [5-A]: UX enhancement review
Session 6 [4-B]: Transition consistency audit
Session 6 [4-A]: Cross-link verification
Session 6 [3-D]: ScriptureRef mobile tap, touch targets
Session 6 [3-C]: Widget mobile fixes
Session 6 [3-B]: Identity piece page mobile layout fixes
Session 6 [3-A]: Identity landing page mobile layout fixes
Session 6 [2-C]: Cross-links — Challenge, Architecture, Section G
Session 6 [2-B]: Connected Armor cross-link cards
Session 6 [2-A]: Piece page animations + armor piece navigation
Session 6 [1-A]: Landing page animations — Sections A-G
Session 6 [0-C]: Cross-link state audited
Session 6 [0-B]: Identity state mapped
Session 6 [0-A]: Animation reference extracted
```

---

## Self-Review Notes

**Spec coverage check:**
- Part 1 (Landing Page Animations, Sections A-G): Agent 1-A ✓
- Part 2 (Piece Page Animations): Agent 2-A ✓ (includes armor piece prev/next nav)
- Part 3 (Mobile — Landing): Agent 3-A ✓
- Part 3 (Mobile — Piece Pages): Agent 3-B ✓
- Part 3 (Mobile — Widgets): Agent 3-C ✓
- Part 3 (Mobile — Global + ScriptureRef): Agent 3-D ✓
- Part 4 (Cross-links Identity→RuleOfLife verification): Agent 4-A ✓
- Part 4 (Cross-links RuleOfLife→Identity new cards): Agent 2-B ✓
- Part 4 (Cross-links 7-Day Challenge): Agent 2-C ✓
- Part 4 (Architecture.jsx panel): Agent 2-C ✓
- Part 4 (Identity Section G tertiary link): Agent 2-C ✓
- Part 5 (Transition consistency): Agent 4-B ✓
- Enhancement review: Agent 5-A ✓
- Final code review + completion report: Agent 6-A ✓

**All Session 6 spec requirements covered.**
