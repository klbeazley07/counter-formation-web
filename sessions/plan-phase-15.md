# Plan: Phase 15 -- Profile v6 + AgentHistory as Formation Record

**Session:** 22
**Date:** 2026-05-20
**Spec ref:** sessions/next.md "Phase 15" (revised after pre-flight audit)

---

## Pre-flight findings

The original Phase 15 spec assumed armor day content was still inline in Identity.jsx and that `/agent` did not exist. Both assumptions are false.

**armor.json** already holds every day's `stillness`, `scriptures`, `teaching`, `practice`, `reflection`, and `prayer`. Identity.jsx reads them via `curDay.*` at lines 1948-1993. No content extraction needed.

**`/agent` route** already exists at App.jsx:1865. `AgentHistory.jsx` (132 lines) renders `profile.agent.history` -- a sparse list of assessment events. `AgentEntry.jsx` is wired into PersonalizedHome.jsx (the dashboard) and already links to `/agent` and `/agent/onboarding`. The route + surface are live.

**Real gap:** AgentHistory's content doesn't match the spec's intent. The spec wanted a Formation Record that surfaces the user's actual devotional life. The current page reads only `profile.agent.history` (rare events) and ignores `profile.widgets.devotions` (frequent entries). Devotions store only `summary` (first 200 chars), so even if AgentHistory pulled them, full text would not be available.

**Identity.jsx line count** is large because of prose-and-GSAP landing sections (Hero, ArmorIntro, GodsArmor, ArmorRing, WhyItMatters), not inline data. ArmorStyles CSS-in-JS could extract to identity.css but the file would still be ~2000 lines. Deferred -- it's a follow-on that doesn't unblock anything.

---

## Items in scope

### Item 1 -- Profile v6 schema bump + full devotion text

Bump `cf:profile` to `_version: 6`. The schema change is purely additive: devotion entries gain a `full` field (capped at 4000 chars) alongside the existing `summary`. The migration is mechanical -- existing entries do not get backfilled (we don't have the source text), but they keep working since `full` is optional.

In `src/hooks/useFormationProfile.jsx`:
- `DEFAULT_PROFILE._version: 5` -> `6`
- Add v5 -> v6 migration: set `_version = 6`. No data transformation required.
- Persist if `_version !== 6`.

In `src/DevotionGuide.jsx` `generate()`:
- Compute `full = (text ?? "").slice(0, 4000).trim()` alongside `summary`.
- Include `full` on `newEntry` before pushing to `widgets.devotions`.

### Item 2 -- AgentHistory rebuild as Formation Record

Rewrite `src/components/agent/AgentHistory.jsx` to render three sections:

1. **Header.** Eyebrow "Formation Agent" + h1 "Your Formation Record" + tagline.

2. **Profile summary block.** Reads `profile.assessment.formationEdge`, `profile.armor.completedPieces`, `profile.challenge.completedDays`, `profile.onboarding.intention`. Displays:
   - "Formation edge: {edge}" -- top fruit/gap, or "Take the assessment" if absent
   - "Armor pieces complete: {n} / 6"
   - "Challenge days complete: {n} / 7"
   - "Intention: {text}" -- italic, only if non-empty

3. **Timeline.** Merged list of:
   - Assessment events from `profile.agent.history`: `{kind, summary, at}` -- renders the existing chip + summary card.
   - Devotion entries from `profile.widgets.devotions`: `{generatedAt, passage, theme, bigIdea, summary, full}` -- renders a new card type with a "Devotion" chip, the passage / theme as a header, and the `full` text below (or `summary` if `full` is absent on older entries). Expandable -- click to toggle full vs. truncated.

   Merge by date (newest first). Empty state if both are empty.

   Footer link "Take a new assessment" -> `/agent/onboarding` is retained.

---

## Acceptance

- `cf:profile` schema is v6; existing v5 profiles migrate silently on next load.
- New devotion entries store full markdown (up to 4000 chars) in `full`.
- `/agent` renders a Formation Record: header + profile summary + merged timeline.
- Devotion entries created after this change show full text in the timeline.
- Old devotion entries (`full` absent) gracefully fall back to `summary`.
- Build passes (lint:tokens + vite build).
- No regression in AgentEntry, AgentOnboarding, DevotionHistory (other consumers of the same data).

---

## Commits

1. `feat: Phase 15 Item 1 -- profile v6 + full devotion text storage`
2. `feat: Phase 15 Item 2 -- AgentHistory as unified Formation Record`

---

## Deferred to a future phase

- ArmorStyles -> identity.css extraction (~160 lines off Identity.jsx, low impact).
- Identity.jsx structural refactor (extracting Hero / ArmorIntro / GodsArmor / ArmorRing into their own files -- larger move, would bring Identity.jsx under 1000 lines but is several sessions of work).
- DevotionListPanel and DevotionHistory could later read from `full` to render expandable previews on the dashboard / DevotionGuide returning-user view, but that's outside this phase.
