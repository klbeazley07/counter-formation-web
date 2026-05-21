# Phase 18 -- DevotionCard Surfaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface full devotional text across three app locations via a shared `DevotionCard` primitive and a new `DevotionDrawer` slide-in panel.

**Architecture:** Extract the existing working `DevotionCard` from `AgentHistory.jsx` into a shared primitive; use it in `DevotionHistory` (inline expand) and `AgentHistory` (inline expand). Add a `DevotionDrawer` slide-in panel triggered from `DevotionListPanel` rows on the dashboard.

**Tech Stack:** React 18, JSX, inline CSS-in-JS (`<style>` tags), ReactMarkdown, CSS custom properties (no Tailwind in these components), GSAP not needed here.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/components/primitives/DevotionCard.jsx` | Expandable inline card -- collapsed summary / expanded full text |
| Create | `src/components/primitives/DevotionDrawer.jsx` | Fixed slide-in overlay showing full devotion text |
| Modify | `src/components/agent/AgentHistory.jsx` | Delete local `DevotionCard`, import from primitives |
| Modify | `src/components/DevotionHistory.jsx` | Replace `.dh-entry` map with `<DevotionCard>`, remove dead CSS |
| Modify | `src/components/personal/DevotionListPanel.jsx` | Add summary blurb, View button, DevotionDrawer integration |

---

## Task 1: Create `DevotionCard` primitive

**Files:**
- Create: `src/components/primitives/DevotionCard.jsx`

This is extracted directly from `AgentHistory.jsx` lines 197-305 with three changes:
1. Toggle button moves to bottom-right (`alignSelf: "flex-end"`)
2. Labels change: "View →" (collapsed) / "Close ▲" (expanded)
3. `entry.summary` is stripped of markdown syntax before display

- [ ] **Step 1: Create the file**

Create `src/components/primitives/DevotionCard.jsx` with this exact content:

```jsx
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { withScriptureRefs } from "../../utils/parseScriptureRefs";

const MARKDOWN_COMPONENTS = {
  p:          ({ node, children, ...props }) => <p {...props}>{withScriptureRefs(children)}</p>,
  li:         ({ node, children, ...props }) => <li {...props}>{withScriptureRefs(children)}</li>,
  blockquote: ({ node, children, ...props }) => <blockquote {...props}>{withScriptureRefs(children)}</blockquote>,
  h1:         ({ node, children, ...props }) => <h1 {...props}>{withScriptureRefs(children)}</h1>,
  h2:         ({ node, children, ...props }) => <h2 {...props}>{withScriptureRefs(children)}</h2>,
  h3:         ({ node, children, ...props }) => <h3 {...props}>{withScriptureRefs(children)}</h3>,
  em:         ({ node, children, ...props }) => <em {...props}>{withScriptureRefs(children)}</em>,
  strong:     ({ node, children, ...props }) => <strong {...props}>{withScriptureRefs(children)}</strong>,
};

const CHIP_COLOR = "rgba(201,168,76,0.85)";

function stripMarkdown(str) {
  if (!str) return "";
  return str.replace(/^#+\s*/gm, "").replace(/[*_~`]/g, "").trim();
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default function DevotionCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const passageLine = entry.passage?.trim() || entry.bigIdea?.trim() || entry.theme?.trim() || "Untitled devotion";
  const hasFull     = !!entry.full?.trim();
  const summary     = stripMarkdown(entry.summary);

  return (
    <div style={{
      padding:       "20px 24px",
      borderRadius:  12,
      border:        "1px solid var(--cf-white-8)",
      background:    "var(--cf-rule-bg)",
      display:       "flex",
      flexDirection: "column",
      gap:           "0.75rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:      9,
          fontWeight:    700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color:         CHIP_COLOR,
          border:        `1px solid ${CHIP_COLOR}`,
          borderRadius:  999,
          padding:       "3px 10px",
        }}>
          Devotion
        </span>
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:      10,
          letterSpacing: "0.14em",
          color:         "var(--cf-ivory-28)",
        }}>
          {formatDate(entry.generatedAt)}
        </span>
        {entry.theme?.trim() && (
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color:         "var(--cf-ivory-28)",
          }}>
            · {entry.theme.trim()}
          </span>
        )}
      </div>

      <p style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontSize:      13,
        fontWeight:    700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         "var(--cf-ivory)",
        margin:        0,
      }}>
        {passageLine}
      </p>

      {expanded && hasFull ? (
        <div style={{
          fontFamily: "var(--cf-font-devotional)",
          fontSize:   "clamp(16px, 2.8vw, 19px)",
          color:      "var(--cf-ivory-72)",
          lineHeight: 1.75,
        }}>
          <ReactMarkdown components={MARKDOWN_COMPONENTS}>{entry.full}</ReactMarkdown>
        </div>
      ) : summary ? (
        <p style={{
          fontFamily: "var(--cf-font-devotional)",
          fontStyle:  "italic",
          fontSize:   "clamp(16px, 2.8vw, 19px)",
          color:      "var(--cf-ivory-62)",
          lineHeight: 1.7,
          margin:     0,
        }}>
          {summary}
        </p>
      ) : null}

      {hasFull && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          style={{
            alignSelf:     "flex-end",
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      9,
            fontWeight:    700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         "var(--cf-gold)",
            background:    "transparent",
            border:        "none",
            padding:       "4px 0 0",
            cursor:        "pointer",
          }}
        >
          {expanded ? "Close ▲" : "View →"}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: `✓ built in` with no errors. The file is new and not yet imported anywhere -- the build should pass unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/DevotionCard.jsx
git commit -m "feat: add DevotionCard shared primitive (extracted from AgentHistory)"
```

---

## Task 2: Update `AgentHistory` to use the primitive

**Files:**
- Modify: `src/components/agent/AgentHistory.jsx`

Delete the local `DevotionCard` function (lines 197-305), the `DEVOTION_CHIP_COLOR` constant (line 32), and the now-unused imports (`React`, `useState`, `ReactMarkdown`, `withScriptureRefs`, `MARKDOWN_COMPONENTS`). Import from primitives.

- [ ] **Step 1: Replace the imports block**

Current top of `AgentHistory.jsx` (lines 1-18):
```jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import { withScriptureRefs } from "../../utils/parseScriptureRefs";

/* Markdown overrides — inject ScriptureRef popovers into devotional text,
 * matching the DevotionGuide rendering. */
const MARKDOWN_COMPONENTS = {
  p:          ({ node, children, ...props }) => <p {...props}>{withScriptureRefs(children)}</p>,
  li:         ({ node, children, ...props }) => <li {...props}>{withScriptureRefs(children)}</li>,
  blockquote: ({ node, children, ...props }) => <blockquote {...props}>{withScriptureRefs(children)}</blockquote>,
  h1:         ({ node, children, ...props }) => <h1 {...props}>{withScriptureRefs(children)}</h1>,
  h2:         ({ node, children, ...props }) => <h2 {...props}>{withScriptureRefs(children)}</h2>,
  h3:         ({ node, children, ...props }) => <h3 {...props}>{withScriptureRefs(children)}</h3>,
  em:         ({ node, children, ...props }) => <em {...props}>{withScriptureRefs(children)}</em>,
  strong:     ({ node, children, ...props }) => <strong {...props}>{withScriptureRefs(children)}</strong>,
};
```

Replace with:
```jsx
import { Link } from "react-router-dom";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import DevotionCard from "../../components/primitives/DevotionCard";
```

- [ ] **Step 2: Delete `DEVOTION_CHIP_COLOR` and the local `DevotionCard` function**

Delete line 32:
```jsx
const DEVOTION_CHIP_COLOR = "rgba(201,168,76,0.85)";
```

Delete the entire `DevotionCard` function (lines 197-305). Line 196 is a blank line -- leave it. The "Timeline cards" section comment at lines 145-147 covers both `AssessmentCard` and `DevotionCard`; leave it in place since `AssessmentCard` stays.

```jsx
function DevotionCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  // ... all 109 lines through the closing }
}
```

The `KIND_LABELS`, `KIND_COLORS`, and `formatDate` constants (lines 20-39) remain -- they are used by `AssessmentCard`.

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: `✓ built in` with no errors. The timeline rendering still calls `<DevotionCard entry={t.entry} />` -- now resolved from the primitive import.

- [ ] **Step 4: Commit**

```bash
git add src/components/agent/AgentHistory.jsx
git commit -m "refactor: AgentHistory imports DevotionCard from primitives"
```

---

## Task 3: Update `DevotionHistory` to use `DevotionCard`

**Files:**
- Modify: `src/components/DevotionHistory.jsx`

Replace the entire `.dh-entry` rendering block in the map with `<DevotionCard>`. Remove the now-dead CSS classes and the `formatDate` helper.

- [ ] **Step 1: Add the import**

Current line 1 of `DevotionHistory.jsx`:
```jsx
import { useState } from "react";
import { useFormationProfile } from "../hooks/useFormationProfile";
```

Replace with:
```jsx
import { useState } from "react";
import { useFormationProfile } from "../hooks/useFormationProfile";
import DevotionCard from "./primitives/DevotionCard";
```

- [ ] **Step 2: Delete the `formatDate` helper**

Delete lines 113-122 (the `formatDate` function):
```jsx
function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}
```

DevotionCard has its own `formatDate` internally.

- [ ] **Step 3: Replace the entries map**

Current entries map inside the `{open && (...)}` block:
```jsx
{entries.map((e, i) => {
  const passageLine = e.passage?.trim() || e.bigIdea?.trim() || e.theme?.trim();
  return (
    <div key={e.generatedAt || i} className="dh-entry">
      <div className="dh-entry-meta">
        <span className="dh-entry-date">{formatDate(e.generatedAt)}</span>
        {e.theme?.trim() && (
          <span className="dh-entry-theme">{e.theme.trim()}</span>
        )}
      </div>
      {passageLine ? (
        <p className="dh-entry-passage">{passageLine}</p>
      ) : (
        <p className="dh-empty-passage">Untitled devotion</p>
      )}
      {e.summary?.trim() && (
        <p className="dh-entry-summary">{e.summary.trim()}…</p>
      )}
    </div>
  );
})}
```

Replace with:
```jsx
{entries.map((e, i) => (
  <DevotionCard key={e.generatedAt || i} entry={e} />
))}
```

- [ ] **Step 4: Remove dead CSS classes from `DH_CSS`**

In the `DH_CSS` template string, delete these blocks entirely:
- `.dh-entry { ... }`
- `.dh-entry-meta { ... }`
- `.dh-entry-date { ... }`
- `.dh-entry-theme { ... }`
- `.dh-entry-passage { ... }`
- `.dh-entry-summary { ... }`
- `.dh-empty-passage { ... }`

Keep: `.dh-wrap`, `.dh-toggle`, `.dh-toggle:hover`, `.dh-toggle-label`, `.dh-toggle-count`, `.dh-toggle-chev`, `.dh-list`.

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

Expected: `✓ built in` with no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/DevotionHistory.jsx
git commit -m "feat: DevotionHistory uses shared DevotionCard; fixes raw markdown in summary display"
```

---

## Task 4: Create `DevotionDrawer` primitive

**Files:**
- Create: `src/components/primitives/DevotionDrawer.jsx`

A fixed overlay panel. Desktop: slides in from the right at 480px wide. Mobile (≤640px): slides up from the bottom at 85vh. Always shows the full devotion without a toggle.

- [ ] **Step 1: Create the file**

Create `src/components/primitives/DevotionDrawer.jsx` with this exact content:

```jsx
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { withScriptureRefs } from "../../utils/parseScriptureRefs";

const MARKDOWN_COMPONENTS = {
  p:          ({ node, children, ...props }) => <p {...props}>{withScriptureRefs(children)}</p>,
  li:         ({ node, children, ...props }) => <li {...props}>{withScriptureRefs(children)}</li>,
  blockquote: ({ node, children, ...props }) => <blockquote {...props}>{withScriptureRefs(children)}</blockquote>,
  h1:         ({ node, children, ...props }) => <h1 {...props}>{withScriptureRefs(children)}</h1>,
  h2:         ({ node, children, ...props }) => <h2 {...props}>{withScriptureRefs(children)}</h2>,
  h3:         ({ node, children, ...props }) => <h3 {...props}>{withScriptureRefs(children)}</h3>,
  em:         ({ node, children, ...props }) => <em {...props}>{withScriptureRefs(children)}</em>,
  strong:     ({ node, children, ...props }) => <strong {...props}>{withScriptureRefs(children)}</strong>,
};

const CSS = `
  .cf-dd-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(6,5,10,0.72);
    z-index: 1000;
  }
  .cf-dd-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(480px, 100vw);
    background: var(--cf-hero-bg);
    z-index: 1001;
    overflow-y: auto;
    padding: clamp(32px, 5vw, 48px) 32px clamp(48px, 8vw, 72px);
    box-shadow: -8px 0 40px rgba(0,0,0,0.6);
    border-left: 1px solid rgba(201,168,76,0.18);
    animation: cf-drawer-in 0.22s ease forwards;
  }
  @keyframes cf-drawer-in {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);   opacity: 1; }
  }
  @media (max-width: 640px) {
    .cf-dd-panel {
      top: auto;
      right: 0;
      left: 0;
      bottom: 0;
      width: 100vw;
      height: 85vh;
      border-radius: 18px 18px 0 0;
      border-left: none;
      border-top: 1px solid rgba(201,168,76,0.18);
      animation: cf-drawer-up 0.22s ease forwards;
    }
  }
  @keyframes cf-drawer-up {
    from { transform: translateY(100%); opacity: 0; }
    to   { transform: translateY(0);   opacity: 1; }
  }
  .cf-dd-close {
    position: absolute;
    top: 18px;
    right: 20px;
    background: transparent;
    border: none;
    color: var(--cf-gold);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 8px 4px;
  }
  .cf-dd-close:hover { color: var(--cf-ivory); }
  .cf-dd-date {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cf-ivory-28);
    margin: 0 0 10px;
  }
  .cf-dd-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--cf-ivory);
    margin: 0;
  }
  .cf-dd-rule {
    height: 1px;
    background: linear-gradient(90deg, rgba(201,168,76,0.3), transparent);
    margin: 1.5rem 0 1.75rem;
  }
  .cf-dd-body {
    font-family: var(--cf-font-devotional);
    font-size: clamp(16px, 2.8vw, 19px);
    color: var(--cf-ivory-72);
    line-height: 1.8;
  }
  .cf-dd-body h1,
  .cf-dd-body h2,
  .cf-dd-body h3 {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 1.5rem 0 0.5rem;
    font-weight: 700;
  }
  .cf-dd-body p { margin: 0 0 1rem; }
  .cf-dd-body blockquote {
    border-left: 2px solid rgba(201,168,76,0.4);
    margin: 0 0 1rem;
    padding-left: 1rem;
    color: var(--cf-ivory-62);
    font-style: italic;
  }
  .cf-dd-body ul,
  .cf-dd-body ol { padding-left: 1.5rem; margin: 0 0 1rem; }
  .cf-dd-empty {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: clamp(16px, 2.8vw, 19px);
    color: var(--cf-ivory-62);
    line-height: 1.7;
    margin: 0;
  }
`;

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default function DevotionDrawer({ entry, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (entry) {
      closeRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [entry]);

  useEffect(() => {
    if (!entry) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entry, onClose]);

  if (!entry) return null;

  const passageLine = entry.passage?.trim() || entry.bigIdea?.trim() || entry.theme?.trim() || "Untitled devotion";
  const hasContent  = !!entry.full?.trim();

  return (
    <>
      <style>{CSS}</style>
      <div className="cf-dd-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="cf-dd-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Full devotion"
      >
        <button ref={closeRef} className="cf-dd-close" onClick={onClose} aria-label="Close devotion">
          Close ✕
        </button>

        <div style={{ paddingRight: 48, marginBottom: "1.5rem" }}>
          <p className="cf-dd-date">
            {formatDate(entry.generatedAt)}
            {entry.theme?.trim() && ` · ${entry.theme.trim()}`}
          </p>
          <p className="cf-dd-title">{passageLine}</p>
        </div>

        <div className="cf-dd-rule" />

        {hasContent ? (
          <div className="cf-dd-body">
            <ReactMarkdown components={MARKDOWN_COMPONENTS}>{entry.full}</ReactMarkdown>
          </div>
        ) : (
          <p className="cf-dd-empty">{entry.summary || "No content available."}</p>
        )}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: `✓ built in` with no errors. File is new and not yet imported -- build should pass unchanged.

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives/DevotionDrawer.jsx
git commit -m "feat: add DevotionDrawer slide-in overlay primitive"
```

---

## Task 5: Update `DevotionListPanel` -- summary blurb, View button, drawer integration

**Files:**
- Modify: `src/components/personal/DevotionListPanel.jsx`

This task makes the most visible change: dashboard rows gain a summary blurb and a "View →" button, and open the DevotionDrawer instead of navigating away.

- [ ] **Step 1: Replace the full file content**

The complete updated `DevotionListPanel.jsx`:

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import DevotionDrawer from "../primitives/DevotionDrawer";

function stripMarkdown(str) {
  if (!str) return "";
  return str.replace(/^#+\s*/gm, "").replace(/[*_~`]/g, "").trim();
}

function formatRelative(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  const now  = new Date();
  const days = Math.floor((now - then) / 86400000);
  if (days < 1)   return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)   return `${days}d ago`;
  if (days < 30)  return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return then.toLocaleDateString();
}

function summaryOf(entry) {
  return entry?.passage || entry?.bigIdea || entry?.theme || "Devotion";
}

const STYLES = `
  .cf-dlp {
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 18px 20px 14px;
    position: relative;
    overflow: hidden;
  }
  .cf-dlp::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
  }
  .cf-dlp__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .cf-dlp__eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0;
  }
  .cf-dlp__count {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--cf-ivory-42);
  }
  .cf-dlp__list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .cf-dlp__row {
    display: block;
    cursor: pointer;
    padding: 10px 0;
    border-bottom: 1px solid var(--cf-gold-hairline);
    transition: background 200ms ease;
  }
  .cf-dlp__row:last-child { border-bottom: none; }
  .cf-dlp__row:hover { background: var(--cf-gold-glow); }
  .cf-dlp__row-meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
  }
  .cf-dlp__row-date {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--cf-ivory-42);
  }
  .cf-dlp__row-status {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cf-gold-muted);
  }
  .cf-dlp__row-title {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    line-height: 1.4;
    color: var(--cf-ivory-82);
    margin: 0 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .cf-dlp__row-summary {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 13px;
    line-height: 1.5;
    color: var(--cf-ivory-42);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .cf-dlp__row-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 6px;
  }
  .cf-dlp__view-btn {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cf-gold);
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  .cf-dlp__view-btn:hover { color: var(--cf-ivory); }
  .cf-dlp__empty {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    color: var(--cf-ivory-42);
    margin: 4px 0 12px;
    line-height: 1.5;
  }
  .cf-dlp__cta {
    display: inline-block;
    margin-top: 10px;
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--cf-gold);
    text-decoration: none;
  }
  .cf-dlp__cta:hover { color: var(--cf-ivory); }
`;

export default function DevotionListPanel({ profile }) {
  const [selectedEntry, setSelectedEntry] = useState(null);
  const allDevotions = profile?.widgets?.devotions || [];
  const devotions    = allDevotions.slice(0, 3);
  const hasAny       = allDevotions.length > 0;

  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-dlp">
        <div className="cf-dlp__head">
          <p className="cf-dlp__eyebrow">Devotions</p>
          {hasAny && <span className="cf-dlp__count">{allDevotions.length}</span>}
        </div>

        {hasAny ? (
          <>
            <ul className="cf-dlp__list">
              {devotions.map((d, i) => {
                const blurb = stripMarkdown(d.summary);
                return (
                  <li key={d.generatedAt || i}>
                    <div className="cf-dlp__row" onClick={() => setSelectedEntry(d)}>
                      <div className="cf-dlp__row-meta">
                        <span className="cf-dlp__row-date">{formatRelative(d.generatedAt)}</span>
                        <span className="cf-dlp__row-status">Saved</span>
                      </div>
                      <p className="cf-dlp__row-title">{summaryOf(d)}</p>
                      {blurb && <p className="cf-dlp__row-summary">{blurb}</p>}
                      <div className="cf-dlp__row-footer">
                        <button
                          type="button"
                          className="cf-dlp__view-btn"
                          onClick={(e) => { e.stopPropagation(); setSelectedEntry(d); }}
                        >
                          View →
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Link to="/field-guide/devotion-guide" className="cf-dlp__cta">
              Open Devotion Guide →
            </Link>
          </>
        ) : (
          <>
            <p className="cf-dlp__empty">No devotions saved yet. The Devotion Guide generates a personal reflection grounded in your formation.</p>
            <Link to="/field-guide/devotion-guide" className="cf-dlp__cta">
              Generate one →
            </Link>
          </>
        )}
      </div>
      <DevotionDrawer entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: `✓ built in` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/personal/DevotionListPanel.jsx
git commit -m "feat: DevotionListPanel rows show summary blurb and open DevotionDrawer on View"
```

---

## Task 6: Final verification and push

- [ ] **Step 1: Full clean build**

```bash
npm run build
```

Expected: `✓ built in` with no errors. All five tasks complete.

- [ ] **Step 2: Visual spot-check** (manual, in dev server)

```bash
npm run dev
```

Check each surface:
1. **Dashboard** -- open `/` as a returning user with devotions. Panel shows up to 3 rows. Each row has passage title, summary blurb, "View →" bottom-right. Click a row or View button → DevotionDrawer slides in from the right. Full devotion renders in Spectral with section headings. Close button / ESC / backdrop click all dismiss it. Count in header reflects total devotions (not just 3).
2. **DevotionGuide returning view** -- open `/field-guide/devotion-guide` as a user with saved devotions. Expand "Your Formation History." Each entry is a DevotionCard block. "View →" bottom-right. Clicking expands to full devotion inline. "Close ▲" collapses.
3. **Formation Record** -- open `/agent` as a user with devotions. Devotion cards in the timeline show "View →" bottom-right. Same inline expand behavior.
4. **No `entry.full`** -- for an older entry without the `full` field, verify no "View →" button appears and summary shows correctly.
5. **Mobile** -- resize to <640px. DevotionDrawer should slide up from the bottom as a sheet.

- [ ] **Step 3: Push to main**

```bash
git push origin main
```

---

## Acceptance criteria (from spec)

- `DevotionCard` renders in DevotionHistory (inline expand) and AgentHistory (inline expand) ✓
- `DevotionDrawer` opens from DevotionListPanel, shows full devotion, closes via X / backdrop / ESC ✓
- No raw markdown syntax (`#`, `**`) visible in any summary or preview text ✓
- `entry.full` absent → no toggle button, no broken state ✓
- `npm run build` passes ✓
- No hardcoded color constants (lint:tokens enforces this) ✓
