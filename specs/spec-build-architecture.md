# Counter Formation Build Architecture
### Agent Swarm Methodology + Session Protocol

---

## Overview

This document defines how the five enhancement phases from `spec-site-enhancement-2026.md` get built. It governs three things: how work is organized within a session (agent coordination), how state is preserved between sessions (persistent memory), and how one session hands off cleanly to the next (session prompts).

Every build session follows the same structure regardless of phase. The roles are consistent. The memory protocol is consistent. The session prompt format is consistent. This means any session can be started cold from the prompt alone and still have full context.

---

## The Session Structure

Each session has five stages. They always run in this order.

### Stage 0: Boot

The session opens by reading exactly three files:

1. `sessions/state.md` -- current phase, what is done, what is deferred
2. `sessions/contracts.md` -- agreed API interfaces that builders must honor
3. The session prompt that kicked off this session

Nothing else. The session does not read the full codebase from scratch. It reads only what is flagged in state.md as relevant to the current phase. This keeps the main context clean.

### Stage 1: Contract Definition (Architect role)

Before any code is written, the session defines the interfaces. The Architect agent reads the specific files relevant to the current phase, defines the API signatures, component props, schema shapes, and key decisions. It writes these to `sessions/contracts.md`.

No Builder agent begins work until the contract is written and confirmed. This is the sequential gate.

The Architect agent does not write implementation code. It writes signatures, schemas, and decisions only.

### Stage 2: Parallel Build (Builder roles)

Once the contract exists, Builder agents work in parallel on independent deliverables. Each Builder receives the contract plus a specific, bounded file to create or modify. Builders return summaries of what changed, not full file contents. The main session context receives summaries only.

Builder agents are isolated. Each reads only what it needs: the contract, the specific file it is modifying, and any direct dependency. Builder agents do not read the full codebase.

### Stage 3: Integration (Integrator role)

After builders finish, an Integrator agent handles any file that depends on multiple builder outputs. Typically this is App.jsx, a shared index file, or a routing file. The Integrator reads the builder summaries and the target file, wires dependencies, and confirms the build compiles.

### Stage 4: Review (Reviewer role)

A Reviewer agent reads all changed files from the session, checks them against the contracts, and flags any inconsistencies. It does not fix -- it reports. The main session decides whether issues require a fix or a deferral.

After review, the build is verified:

```bash
npm run build
```

If the build fails, the session does not close until it is fixed. No session ends with a broken build.

### Stage 5: Session Wrap

Three things happen at close:

1. `sessions/state.md` is updated with what was completed and what was deferred
2. `sessions/log.md` gets a new entry: date, phase, what changed, key decisions, what was deferred
3. `sessions/next.md` is written with the complete, self-contained prompt for the next session

The session prompt in `sessions/next.md` is the primary handoff artifact. It must be good enough that a cold-start Claude Code session with no prior context can read it and begin work without asking clarifying questions.

---

## Agent Roles

### Architect

Reads existing code. Defines interfaces. Writes to `sessions/contracts.md`. Does not write implementation. Runs once per phase, at the top of Stage 1.

**Prompt structure:**
> Read [specific files]. Define the exact API for [component/hook/schema]. Write it to contracts.md. Do not implement. State any assumptions you made as decisions.

### Builder

Receives a contract and a single bounded scope (one file, one component, one hook). Implements only that scope. Returns a summary of what it built and any deviations from contract.

**Prompt structure:**
> Read contracts.md. Read [specific existing file if modifying]. Implement [bounded scope] per the contract. Do not touch any other file. Return: what you built, any contract deviations, any issues you flagged.

### Integrator

Reads builder summaries and a target integration file. Wires dependencies. Returns what changed.

**Prompt structure:**
> Builder agents produced: [summaries]. Read [integration target file]. Wire [specific connections]. Confirm it compiles. Return what changed.

### Reviewer

Reads all changed files from the session. Checks against contracts. Reports issues without fixing.

**Prompt structure:**
> The session changed these files: [list]. Read them. Compare against contracts.md. Report any deviations, missing cases, or interface mismatches. Do not fix -- report only.

---

## Persistent Memory Protocol

There are two memory layers.

### Layer 1: Session files (in-repo, operational)

Lives in `sessions/`. Contains the current operational state of the build.

| File | Purpose | Written by |
|---|---|---|
| `sessions/state.md` | Phase checklist, current status, deferred items | Session wrap (Stage 5) |
| `sessions/contracts.md` | API contracts, schemas, interfaces | Architect agent (Stage 1) |
| `sessions/log.md` | Rolling session log | Session wrap (Stage 5) |
| `sessions/next.md` | The prompt for the next session | Session wrap (Stage 5) |

These files are committed after each session. Any future session can fully reconstruct context from these four files plus the spec files.

### Layer 2: Claude memory files (cross-session recall)

Lives in `.claude/projects/.../memory/`. Contains strategic context and preferences that should inform every future conversation, not just the build sessions.

The `project_enhancement_plan.md` memory file already captures the five themes and their dependency order. At the end of each build session, the relevant memory file is updated if any strategic decisions were made or assumptions were overturned. Minor implementation details do not go in memory -- those go in `sessions/log.md`.

---

## Per-Phase Agent Maps

### Phase 1 -- Formation Profile

**Goal:** One namespaced, versioned profile object. Eleven legacy keys migrated.

**Sequential gate:** Architect defines the v1 schema and the migration map before any code.

```
Stage 1: Architect
  → Read: all 11 legacy-key locations across the codebase
  → Define: v1 schema shape, migration fn signature, hook API
  → Write: contracts.md

Stage 2: Parallel Builders
  → Builder A: src/hooks/useFormationProfile.js
  → Builder B: src/utils/migrateFormationProfile.js

Stage 3: Integrator
  → Wire: App.jsx initialization (one call on mount)
  → Update: all legacy-key writes in widgets + pages (one per legacy key location)

Stage 4: Reviewer
  → Verify: all 11 legacy keys are eliminated from production code paths
  → Verify: migration runs once and does not re-run on refresh
  → Verify: schema matches contracts.md

Stage 5: Wrap
  → Confirm: npm run build passes
  → Write: state.md, log.md, next.md (Phase 2 prompt)
```

### Phase 2 -- Connection Tissue

**Goal:** NextStep component at every completion moment.

**Sequential gate:** Architect defines the NextStep component API and the recommendation engine interface.

```
Stage 1: Architect
  → Read: SevenDayChallenge.jsx (Day 7 section), FruitAssessment.jsx (results),
           Identity.jsx (CROSS_LINKS, piece-complete moment), FieldGuide.jsx (Day 7)
  → Define: NextStep props, recommendation fn signature, context enum values
  → Write: contracts.md additions

Stage 2: Parallel Builders
  → Builder A: src/components/NextStep.jsx
  → Builder B: src/utils/formationRecommendation.js

Stage 3: Integrators (can run in parallel after Stage 2)
  → Integrator A: Replace SevenDayChallenge.jsx Day 7 link with NextStep
  → Integrator B: Replace FruitAssessment.jsx results copy with NextStep
  → Integrator C: Add NextStep to Identity.jsx armor-piece completion
  → Integrator D: Add NextStep to FieldGuide.jsx Day 7
  → Integrator E: Fill Breastplate CROSS_LINKS gap in Identity.jsx
  → Integrator F: Fill Prayer rhythm Connected Armor gap in RuleOfLife.jsx

Stage 4: Reviewer
  → Verify: every NextStep context value has a corresponding recommendation rule
  → Verify: no hardcoded /identity links remain in SevenDayChallenge.jsx
  → Verify: formation profile is read correctly in recommendation engine

Stage 5: Wrap
  → Write: state.md, log.md, next.md (Phase 3 prompt)
```

### Phase 3 -- Discipleship Agent Foundation

**Goal:** DevotionGuide is stateful, context-aware, and onboards first-time users.

**Sequential gate:** Architect defines the onboarding state machine and the `/api/generate` context envelope schema.

```
Stage 1: Architect
  → Read: DevotionGuide.jsx (full), profile schema from contracts.md
  → Define: onboarding state machine, context envelope, history entry schema
  → Write: contracts.md additions

Stage 2: Parallel Builders
  → Builder A: onboarding flow component (short formation questionnaire)
  → Builder B: history panel component
  → Builder C: updated fetch logic with context envelope

Stage 3: Integrator
  → Wire: DevotionGuide.jsx updated to use all three builders
  → Wire: profile writes for history entries

Stage 4: Reviewer
  → Verify: first-time user (no assessment) sees onboarding
  → Verify: returning user sees history panel + "continue" mode
  → Verify: context envelope includes formation profile data

Stage 5: Wrap
  → Write: state.md, log.md, next.md (Phase 4 prompt)
```

### Phase 4 -- Design System

**Goal:** Token layer, primitive components, WidgetFrame, widget refactors.

**Sequential gate:** Architect defines all token names and all primitive component APIs before any implementation.

This phase benefits most from parallel execution. Tokens and six widget refactors are fully independent once the WidgetFrame contract is set.

```
Stage 1: Architect
  → Define: all CSS custom property names and values
  → Define: Button, Input, Card, EyebrowLabel, ProgressBar, SectionHeader, WidgetFrame APIs
  → Write: contracts.md additions

Stage 2: Parallel Builders (Wave 1 -- primitives)
  → Builder A: src/styles/tokens.css + tailwind.config.js update
  → Builder B: src/components/primitives/Button.jsx
  → Builder C: src/components/primitives/Input.jsx
  → Builder D: src/components/primitives/Card.jsx
  → Builder E: src/components/primitives/EyebrowLabel.jsx
  → Builder F: src/components/primitives/ProgressBar.jsx
  → Builder G: src/components/primitives/SectionHeader.jsx
  → Builder H: src/components/WidgetFrame.jsx

Stage 2: Parallel Builders (Wave 2 -- widget refactors, after Wave 1 is reviewed)
  → Builder I:  refactor DeclarationWidget
  → Builder J:  refactor ExamenWidget
  → Builder K:  refactor PeacePauseWidget
  → Builder L:  refactor FirstFifteenWidget
  → Builder M:  refactor VerseTrackerWidget
  → Builder N:  refactor ArrowLogWidget

Stage 3: Integrator
  → Update three newsletter capture forms to use shared Input + Button
  → Update any section headers that can use SectionHeader primitive

Stage 4: Reviewer
  → Verify: no raw hex color literals remain in widget files
  → Verify: all widgets render inside WidgetFrame
  → Verify: Button, Input accessible (ARIA pass)

Stage 5: Wrap
  → Write: state.md, log.md, next.md (Phase 5 prompt)
```

### Phase 5 -- Content Layer

**Goal:** All hardcoded formation content extracted to src/content/ JSON files.

**Sequential gate:** Architect defines the JSON schema for each content type.

```
Stage 1: Architect
  → Define: JSON schema for armor tracks, field-guide offices, challenge days,
             rule-of-life rhythms, assessment questions
  → Write: contracts.md additions

Stage 2: Parallel Builders (content extraction -- fully independent)
  → Builder A: Extract armor tracks → src/content/armor/ (6 files)
  → Builder B: Extract field-guide offices → src/content/field-guide/offices/ (7 files)
  → Builder C: Extract challenge days → src/content/challenge/days.json
  → Builder D: Extract rule-of-life data → src/content/rule-of-life/ (5 files)
  → Builder E: Extract assessment data → src/content/assessment/

Stage 3: Integrators (update parent files to import from content)
  → Integrator A: Identity.jsx imports from src/content/armor/
  → Integrator B: FieldGuide.jsx imports from src/content/field-guide/
  → Integrator C: SevenDayChallenge.jsx imports from src/content/challenge/
  → Integrator D: RuleOfLife.jsx imports from src/content/rule-of-life/
  → Integrator E: FruitAssessment.jsx imports from src/content/assessment/

Stage 4: Reviewer
  → Verify: no content literals remain in JSX files
  → Verify: all content renders correctly (spot-check per section)

Stage 5: Wrap
  → Write: state.md, log.md, next.md (build-complete summary)
```

---

## Session Prompt Format

Every session prompt written to `sessions/next.md` follows this exact structure. No section is optional.

```markdown
# Counter Formation Build — Phase N: [Phase Name]
**Session type:** [Build / Refactor / Extraction]
**Depends on:** [Phase N-1 complete / no dependencies]

## Context (read this first)
[2-3 sentences explaining what phase this is and why it comes here in the sequence.
No references to previous conversations. Self-contained.]

## State at session start
Read these files before doing anything else:
1. sessions/state.md — current phase status
2. sessions/contracts.md — API contracts in force
3. specs/spec-site-enhancement-2026.md — Theme [N] section

## What was built in the prior session
[Bullet list of completed deliverables. Enough detail that the agent knows what exists
and can be trusted without re-reading those files.]

## What this session builds
[Clear scope. What gets created, what gets modified, what stays untouched.]

## Contracts and constraints
[Any API signatures, schema shapes, or architectural rules that apply.
Builders must not deviate from these without flagging it explicitly.]

## Acceptance criteria
[The specific conditions that must be true for this session to close.
Binary, checkable conditions. Not subjective quality standards.]

## Agent coordination
[Which tasks are sequential (must run before others) and which are parallel.
Name the specific files each builder handles.]

## Session close protocol
When work is complete and npm run build passes:
1. Update sessions/state.md
2. Append entry to sessions/log.md
3. Write sessions/next.md with the Phase [N+1] prompt using this same format
4. List here: all files changed this session
```

---

## Quality Standards

These apply to every session, every phase.

**No session ends with a broken build.** If `npm run build` fails, fix it before wrap.

**No session ends mid-phase.** If scope must be deferred, it goes in state.md as explicitly deferred with a reason. The next session prompt accounts for it.

**Contract deviations are flagged, not hidden.** If a Builder discovers the contract is wrong or incomplete, it reports that before proceeding. The session decides whether to update the contract or adjust the implementation.

**Agents summarize; they do not dump.** Builder agents return summaries of what changed, not the full file. The main session context stays clean.

**The reviewer always runs.** Even when the work feels clean. The reviewer catches integration issues that individual builders cannot see.
