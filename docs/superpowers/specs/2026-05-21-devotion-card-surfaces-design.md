# Phase 18 -- DevotionCard Surfaces Design
**Date:** 2026-05-21
**Status:** Approved for planning

---

## Summary

Phase 15 stored full devotional text (`entry.full`) in profile v6. That text is currently only accessible at `/agent` (AgentHistory). This phase surfaces it across three locations via a shared primitive and a new drawer component.

Two new files. Three modified files. No schema changes. No new routes (except the drawer overlay, which is component-level state).

---

## Architecture

### New: `src/components/primitives/DevotionCard.jsx`

Extracted from `AgentHistory.jsx` lines 197-305 with the following changes:
- Toggle button repositioned to bottom-right (`alignSelf: "flex-end"`)
- Label changes: "View" when collapsed, "Close ▲" when expanded
- `DEVOTION_CHIP_COLOR` constant moves here from AgentHistory

Props: `{ entry }`

Entry shape (profile v6):
```
{
  generatedAt: ISO string,
  passage:     string,
  bigIdea:     string,
  theme:       string,
  summary:     string,
  full:        string   // may be absent on pre-Phase-15 entries
}
```

Collapsed state: Devotion chip + date + theme (if present), passage title (Barlow Condensed uppercase), summary sentence (Spectral italic).

Expanded state: same header, then `entry.full` rendered via ReactMarkdown with MARKDOWN_COMPONENTS (ScriptureRef popovers). If `entry.full` is absent or empty, the toggle button is hidden and the card stays summary-only with no broken state.

Used by: DevotionHistory, AgentHistory.

---

### New: `src/components/primitives/DevotionDrawer.jsx`

A fixed overlay that slides in when a devotion is selected from DevotionListPanel.

Props: `{ entry, onClose }`

**Visibility:** rendered when `entry` is non-null.

**Desktop layout:** fixed, right edge, 480px wide, full viewport height, z-index above all content. Slides in from the right via CSS `transform: translateX(100%)` → `translateX(0)` transition (200ms ease). Obsidian background, gold top rule (1px linear-gradient), inner padding `clamp(32px, 5vw, 48px) 32px`.

**Mobile layout:** bottom sheet. Fixed, bottom edge, 100vw wide, ~85vh height, slides up from `translateY(100%)` → `translateY(0)`. Rounded top corners (18px). Same background and top rule.

**Backdrop:** a fixed full-screen semi-transparent overlay (`rgba(6,5,10,0.72)`) behind the drawer. Click-to-close on both desktop and mobile.

**Content:** always shows the full devotion (no expand toggle needed -- the drawer IS the expanded state). Header: date (Barlow Condensed, ivory-42) + theme chip (if present). Passage title (Barlow Condensed, uppercase, ivory). Body: `entry.full` via ReactMarkdown + MARKDOWN_COMPONENTS. If `entry.full` absent, shows summary text (Spectral italic, ivory-62).

**Close controls:** X button top-right of the drawer panel. Backdrop click. ESC key.

**Accessibility:** when drawer opens, focus moves to the close button. ESC key closes. On mobile, `document.body` scroll is locked (`overflow: hidden`) while drawer is open; restored on close.

**MARKDOWN_COMPONENTS:** same component map as AgentHistory (p, li, blockquote, h1-h3, em, strong all pass children through `withScriptureRefs`). Import `withScriptureRefs` from `../../utils/parseScriptureRefs`.

Used by: DevotionListPanel only.

---

### Modified: `src/components/personal/DevotionListPanel.jsx`

**Row structure change:** `<Link to="/field-guide/devotion-guide">` becomes a `<button>` that calls `setSelectedEntry(d)`. The outer `<li>` and list structure are unchanged.

**Summary blurb:** add a paragraph under `.cf-dlp__row-title` that renders `d.summary` as plain text (strip markdown syntax -- remove `#`, `**`, `_`, `~~` markers before display via a small inline helper). Two-line clamp. New CSS class `.cf-dlp__row-summary`: Spectral italic, 13px, ivory-42, line-height 1.5, `-webkit-line-clamp: 2`.

**View button:** a small button inside each row, bottom-right aligned. Barlow Condensed, 9px, gold, `letter-spacing: 0.28em`, uppercase, transparent background, no border. Label: "View →". Clicking calls `setSelectedEntry(d)` (same as clicking the row). The row itself is also clickable -- the View button is a visual affordance, not the only tap target.

**State:** `const [selectedEntry, setSelectedEntry] = useState(null)` added to the component.

**DevotionDrawer integration:** `<DevotionDrawer entry={selectedEntry} onClose={() => setSelectedEntry(null)} />` rendered at the bottom of the component return, outside the panel container.

**Entry count:** reduce from 5 to 3 most recent devotions shown in the panel. The panel is no longer a scrollable list of small rows; it now shows a short stack of richer rows, and 3 keeps the sidebar footprint manageable.

**"Open Devotion Guide →" CTA:** remains unchanged at the bottom of the panel.

**Markdown strip helper** (inline, not exported):
```js
function stripMarkdown(str) {
  if (!str) return "";
  return str.replace(/^#+\s*/gm, "").replace(/[*_~`]/g, "").trim();
}
```

---

### Modified: `src/components/DevotionHistory.jsx`

Inside `entries.map()`, replace the entire `.dh-entry` div and all its children with:
```jsx
<DevotionCard key={e.generatedAt || i} entry={e} />
```

Import: `import DevotionCard from "./primitives/DevotionCard";`

Remove the now-dead CSS classes from `DH_CSS`: `.dh-entry`, `.dh-entry-meta`, `.dh-entry-date`, `.dh-entry-theme`, `.dh-entry-passage`, `.dh-entry-summary`, `.dh-empty-passage`.

The outer collapsible toggle shell (`.dh-wrap`, `.dh-toggle`, `.dh-toggle-label`, `.dh-toggle-count`, `.dh-toggle-chev`, `.dh-list`) is unchanged.

---

### Modified: `src/components/agent/AgentHistory.jsx`

Delete `DevotionCard` function (lines 197-305). Delete `DEVOTION_CHIP_COLOR` constant (line 32). Add import:
```js
import DevotionCard from "../../components/primitives/DevotionCard";
```

No other changes. The timeline rendering, AssessmentCard, and ProfileSummary are untouched.

---

## Pre-existing bug fixed as a side effect

`DevotionHistory` currently renders `e.summary` as a plain `<p>`. Some entries have `summary` fields that contain raw markdown syntax (e.g., `# The Quiet Transformation...`). Replacing `.dh-entry` with `DevotionCard` -- which uses ReactMarkdown for `entry.full` and renders summary as plain Spectral italic -- resolves this. If `summary` still contains markdown markers in the plain-text slot, `stripMarkdown` handles it in DevotionListPanel; in DevotionCard the summary is also rendered as plain text (not ReactMarkdown), so the same strip helper should be applied there.

**Action:** apply `stripMarkdown` to `entry.summary` in DevotionCard (not to `entry.full` -- that is rendered via ReactMarkdown and should remain as-is).

---

## What this phase does not do

- No new routes
- No changes to the agent onboarding or assessment flows
- No changes to how devotions are generated or stored
- No changes to the DevotionGuide generation flow
- The Arrow Log Tool widget is intentionally not touched

---

## Acceptance criteria

- `DevotionCard` renders correctly in DevotionHistory (inline expand) and AgentHistory (inline expand)
- `DevotionDrawer` opens from DevotionListPanel dashboard rows, shows full devotion, closes via X / backdrop / ESC
- No raw markdown syntax (`#`, `**`) visible in any summary or preview text
- `entry.full` absent on older entries → no toggle button shown, no broken state
- `npm run build` passes (lint:tokens + vite build)
- No hardcoded color values in new files -- all via CSS custom properties or existing CSS variables
