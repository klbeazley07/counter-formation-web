# Devotional System — Structure & Component Specs

## System Architecture

- **Format:** 6-day formation track per armor piece (36 days total)
- **Full content:** See `ArmorOfGod_AllTracks.md`
- **Route pattern:** `/identity/[piece]` (e.g., `/identity/belt-of-truth`)

## Daily Structure (Six Movements)

Every day follows the same cadence:

### Movement 1 — Stillness
2–3 sentences. Centering moment. Not a prayer. An invitation to arrive.

### Movement 2 — Scripture
Day's anchor text in Cormorant Garamond italic. Each day uses a different passage (not just Ephesians 6). Rendered as `ScriptureRef` components with ESV popover + Bible.com link.

### Movement 3 — Teaching
3–5 paragraphs of theological reflection. Inter 300–400 weight. Applied to modern formation pressures.

### Movement 4 — Practice
One concrete action. 15 minutes or less. Practices build across 6 days toward cumulative artifact.

### Movement 5 — Prayer
Written first-person prayer. Cormorant Garamond italic. Honest and specific to day's content.

### Movement 6 — Declare
Formation Shareable component (see below). Prompt: "What is the one thing God showed you today?"

---

## Track Overview

| # | Armor Piece | Slug | Track Title | Cumulative Artifact |
|---|---|---|---|---|
| 01 | Belt of Truth | `belt-of-truth` | "Living in the Light" | Written personal examination (5 weekly questions) |
| 02 | Breastplate of Righteousness | `breastplate-of-righteousness` | "Already Clothed" | Morning declaration (3–5 identity sentences) |
| 03 | Gospel of Peace | `gospel-of-peace` | "Ground Beneath You" | Peace Pause rhythm (3 daily anchoring statements) |
| 04 | Shield of Faith | `shield-of-faith` | "Behind What God Has Said" | Arrow log (lies vs. truth document) |
| 05 | Helmet of Salvation | `helmet-of-salvation` | "A Protected Mind" | First Fifteen morning practice design |
| 06 | Sword of the Spirit | `sword-of-the-spirit` | "The Word as Weapon" | Verse memorization system + first 5 verses |

---

## Interactive Widgets (One Per Track, Sidebar)

Each widget lives in the sticky sidebar on desktop, consistent with Rule of Life pattern.

### 1. Belt of Truth — Daily Examen
- 5 guided examination questions
- Journaling text field per question
- Can share component pattern with Presence rhythm's Ignatian Examen widget
- localStorage persistence

### 2. Breastplate — Declaration Builder
- User inputs identity statements
- Widget formats into printable/saveable morning declaration card
- Dark card with Cormorant Garamond, gold accents
- Export as image or copy text

### 3. Gospel of Peace — Peace Pause Timer
- Three-checkpoint timer: morning, midday, evening
- Daily tracking calendar
- Minimal, monastic design
- localStorage persistence

### 4. Shield of Faith — Arrow Log
- Two-column interactive journal
- Left: "The lie" / Right: "What God has said"
- Add/remove entries
- localStorage persistence
- Patterns emerge over time

### 5. Helmet of Salvation — First Fifteen Designer
- Select from practice options: Scripture reading, silence, prayer, declaration
- Build morning sequence
- Outputs visual schedule (screenshot/print friendly)

### 6. Sword of the Spirit — Verse Memorization Tracker
- Input weekly verse
- Mark daily review completions
- Growing library of memorized verses
- Progress visualization

---

## ScriptureRef Component (System-Level)

**Purpose:** Every scripture reference across the entire site becomes an interactive element.

**Behavior:**
- Desktop: hover reveals popover
- Mobile: tap expands inline panel or modal

**Popover contents:**
- Full verse text in Cormorant Garamond italic
- Dark background (`#0E0C0A`) with subtle border
- Reference in Champagne Gold at top
- "Read full chapter" link to Bible.com at bottom

**Bible.com URL pattern:**
```
https://www.bible.com/bible/59/{BOOK}.{CHAPTER}.{VERSE}.ESV
```
Version ID 59 = ESV.

**Book abbreviations for URL:**
- GEN, EXO, LEV, NUM, DEU, JOS, JDG, RUT, 1SA, 2SA, 1KI, 2KI
- 1CH, 2CH, EZR, NEH, EST, JOB, PSA, PRO, ECC, SNG, ISA, JER
- LAM, EZK, DAN, HOS, JOL, AMO, OBA, JON, MIC, NAM, HAB, ZEP
- HAG, ZEC, MAL, MAT, MRK, LUK, JHN, ACT, ROM, 1CO, 2CO, GAL
- EPH, PHP, COL, 1TH, 2TH, 1TI, 2TI, TIT, PHM, HEB, JAS, 1PE
- 2PE, 1JN, 2JN, 3JN, JUD, REV

**Design:** Should feel like opening a page in a leather-bound Bible, not hovering over a hyperlink.

**Scope:** Retrofit across Rule of Life, 7-Day Challenge, Field Guide, Devotion Guide, and all Identity pages.

---

## Formation Shareable Component

**Position:** End of each day's devotional, after Prayer, before navigation.

**Prompt text:** "What is the one thing God showed you today?"
(Day 6 variant: "What is the one thing God showed you this week?")

**Input:** Single text field, dark background, Cormorant Garamond placeholder. ~140 character limit.

**Generated card contents:**
- User's reflection: Cormorant Garamond italic, centered, on dark branded background
- Gold eyebrow: `HELMET OF SALVATION · DAY 4` (track + day)
- Scripture reference below text (muted ivory, reference only)
- Bottom: helmet icon (reduced scale) + `counterformed.com` in Barlow Condensed, muted

**Card sizes:**
- Instagram Stories: 1080 × 1920 (9:16)
- Feed post: 1080 × 1080 (1:1)

**Day 6 completion card variant:**
- `ARMOR UP.` at top
- `SHIELD OF FAITH · COMPLETE`
- User's single-sentence summary

**Technical:**
- Canvas element or SVG rendered client-side
- PNG export for download
- Web Share API for direct sharing (fallback: download button)
- Component name: `FormationShareable` or `ArmorCard`
- Props: `trackName`, `dayNumber`, `scriptureRef`, `userInput`

**Design constraint:** Text input should never feel like a social media composer. No character count, no hashtags, no "Share with your community!" language. Prompt is "Declare it." Action is "Generate."

---

## Cross-Links to Rule of Life

| Identity Track | Links to Rule of Life Rhythm |
|---|---|
| Belt of Truth | Presence (Examen) |
| Gospel of Peace | Sabbath (trust and rest) |
| Sword of the Spirit | Scripture (Lectio Divina) |
| Helmet of Salvation | Scripture (morning practice) |
| Breastplate of Righteousness | — |
| Shield of Faith | Community (shared faith) |
