# Identity Pillar Pages — Design Spec
**Date:** 2026-04-01  
**Status:** Approved  
**Scope:** Six individual armor-piece devotional pages at `/identity/[piece]`

---

## Overview

Six pages, one component. A single `ArmorPiecePage` component in `Identity.jsx` handles all six armor pieces by reading the slug from `useParams()`. The component follows the Rule of Life two-column desktop layout pattern exactly — prose content left, sticky sidebar right — adapted for the devotional format with a day-selector tab strip.

---

## Architecture

### Component

**File:** `src/Identity.jsx`  
**New export:** `ArmorPiecePage` (replaces `ArmorPiecePlaceholder`)  
**No new files created.**

### Data

A new `ARMOR_TRACKS` data object in Identity.jsx, keyed by slug:

```js
const ARMOR_TRACKS = {
  "belt-of-truth": {
    num: "01", title: "Belt of Truth", trackTitle: "Living in the Light",
    img: "/Belt_wide.png",
    anchorScripture: { text: "...", ref: "Ephesians 6:14a" },
    cumulative: "Written personal examination (5 weekly questions)",
    days: [
      {
        num: 1, title: "The First Piece",
        stillness: "...",
        scriptures: [{ text: "...", ref: "..." }],
        teaching: ["paragraph 1", "paragraph 2", ...],
        practice: { duration: "15 Minutes", body: "..." },
        reflection: "...",
        prayer: "...",
      },
      // days 2–6
    ]
  },
  // 5 more pieces
}
```

All 36 days of content from `Content/ArmorOfGod_AllTracks.md` transcribed into this structure.

### Routes

App.jsx routes unchanged. The import line swaps from:
```js
import { IdentityLanding, ArmorPiecePlaceholder } from "./Identity";
```
to:
```js
import { IdentityLanding, ArmorPiecePage } from "./Identity";
```
All six route elements change from `<ArmorPiecePlaceholder />` to `<ArmorPiecePage />`.

---

## Layout

### CSS Pattern

New `.armor-` prefixed CSS block in a `<style>` tag inside `ArmorPiecePage`, mirroring the `rl-` pattern from RuleOfLife.jsx.

**Mobile:** Single column, stacked. Sidebar renders below main content.  
**Desktop (≥900px):** CSS Grid, `1fr 340px`, column-gap 64px.

Named grid areas:
```
"hero       hero"
"day-nav    day-nav"
"content    sidebar"
"piece-nav  piece-nav"
```

### Hero Band

- Full-width, 16:9 crop via `background-image` + `background-size: cover`
- Image path: `/{PieceSlugPascalCase}_wide.png` (e.g. `/Belt_wide.png`)
- Overlay: dark gradient from bottom
- Background numeral: piece number (01–06) in Michroma, 160px desktop, 8% opacity, positioned right-center as watermark
- Gold eyebrow: `PIECE {num} · {TITLE}` in Barlow Condensed, tracked 0.5em
- Piece title: Michroma, all-caps, `clamp(48px, 8vw, 96px)`
- Track subtitle: Cormorant Garamond italic, `clamp(16px, 2vw, 20px)`

### Day Selector Tab Strip

- Horizontal row: `DAY 1` through `DAY 6` in Barlow Condensed, 9px, tracked 0.3em, uppercase
- Active day: gold underline + gold text
- Inactive: ivory at 30% opacity
- Mobile: scrollable overflow-x

### Left Column — Day Content

Each selected day renders these movements in sequence:

1. **Stillness** — italic Cormorant Garamond, muted ivory, no label
2. **Scripture** — each verse in a `<blockquote>` styled card: Cormorant italic, dark bg, gold reference
3. **Teaching** — Inter 300–400 weight, body paragraphs, `rl-body` equivalent class
4. **Practice** — boxed section with gold rule, duration badge, Barlow Condensed label
5. **Reflection** — Cormorant italic question, indented with gold left-border
6. **Prayer** — pre-formatted text, Cormorant italic, dark bg card, subtle gold border
7. **Declare** — prompt text + empty state (interactive component replaces this in future session)

### Right Column — Sticky Sidebar

Position: `sticky; top: 72px`  
Left border: `1px solid rgba(255,255,255,0.07)`, padding-left 40px (matches `rl-sidebar`)

Contents:
1. **Widget Placeholder** — gold-bordered box, `[Interactive Widget]` label in Barlow Condensed, brief description of what the widget will do for this piece, "Coming in next session" note in muted text
2. **Armor Piece Navigation** — compact list of all 6 pieces, active piece highlighted in gold, others as links at 40% opacity. Allows quick cross-piece navigation from the sidebar.
3. **Track Overview** — small card: cumulative artifact label, track title

### Bottom Navigation

Mirrors `rl-rhythm-nav` pattern: two `<Link>` buttons, left = previous piece, right = next piece.  
Shows piece number + title.  
Belt of Truth has no previous; Sword of the Spirit has no next.

---

## Scroll Progress Bar

1px gold progress bar pinned to top of viewport, same implementation as `rl-prog-bar` / `rl-prog-fill` in RuleOfLife.jsx.

---

## Typography

| Element | Font | Size | Weight |
|---|---|---|---|
| Piece title | Michroma | clamp(48px, 8vw, 96px) | 400 |
| Background numeral | Michroma | 160px | 400 |
| Gold eyebrow | Barlow Condensed | 9–11px | 700 |
| Section labels | Barlow Condensed | 9px | 700 |
| Teaching paragraphs | Inter | 16–18px | 300–400 |
| Scripture / Prayer / Stillness | Cormorant Garamond italic | 17–20px | 400 |
| Day tabs | Barlow Condensed | 9px | 700 |

---

## Colors

No new colors. Using existing palette:
- `#06050A` — hero/page background
- `#0E0C0A` — dark cards (scripture, prayer)
- `#C9A84C` — gold (eyebrow, active tab, borders, accents)
- `#FAF8F5` — ivory (body text)

---

## Not In Scope (This Session)

- Interactive sidebar widgets (Daily Examen, Declaration Builder, etc.)
- `ScriptureRef` hover/popover component
- `FormationShareable` / `ArmorCard` shareable image component
- The "Declare" input field (placeholder text only)
- Further reading grid
- Cross-links to Rule of Life rhythms

These are deferred to subsequent sessions per the spec.

---

## File Impact

| File | Change |
|---|---|
| `src/Identity.jsx` | Add `ARMOR_TRACKS` data + `ArmorPiecePage` component + CSS block |
| `src/App.jsx` | Swap import and 6 route elements |
