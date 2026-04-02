# Identity Pages — Mobile UX Audit & Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 10 mobile-specific UX issues across `Identity.jsx` — landing page and piece pages — without touching any desktop behavior.

**Architecture:** All changes are in `src/Identity.jsx`. Landing fixes touch `HeroSection`, `SixPiecesSection`, `CollectionSection`, and `IdentityLanding`'s `<style>` tag. Piece-page fixes touch `ArmorStyles` (CSS) and `BackNav`/`ArmorPiecePage` (JSX).

**Tech Stack:** React, GSAP, Tailwind CSS (utility classes mixed with inline `<style>` blocks), React Router

---

## Key File References

- **File:** `src/Identity.jsx` (single file, ~3138 lines)
- `HeroSection` — line 1317
- `SixPiecesSection` — line 1741
- `CollectionSection` — line 2051
- `IdentityLanding` style tag — line 2593
- `ArmorStyles` CSS block — line 1107
- `BackNav` component — line 1269
- `ArmorPiecePage` component — line 2700

---

## Task 1: Hero padding for nav clearance (Fix 1)

**Files:**
- Modify: `src/Identity.jsx:1395-1398`

The hero `<section>` has no top padding on mobile, so eyebrow text sits behind the fixed nav. Add `pt-16 md:pt-0`.

- [ ] **Step 1: Apply the change**

At line 1398, change:
```
className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
```
To:
```
className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 md:pt-0"
```

- [ ] **Step 2: Verify at 375px** — Hero eyebrow text "THE IDENTITY PILLAR · EPHESIANS 6:10–18" should be fully visible above the viewport, not hidden behind the nav on page load.

- [ ] **Step 3: Verify at 1280px** — No extra top space; hero looks identical to before.

- [ ] **Step 4: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): add hero top padding to clear fixed nav on mobile"
```

---

## Task 2: Tighten hero headline on small screens (Fix 2)

**Files:**
- Modify: `src/Identity.jsx:1463-1468`

The `<h1>` at line 1463 has `clamp(2.2rem, 7vw, 5rem)` and `tracking-[0.1em] md:tracking-[0.14em]`. At 320px screens the floor is too large and tracking is too wide.

- [ ] **Step 1: Apply the change**

At line 1465–1467, change the `<h1>`:
```jsx
// BEFORE:
className="font-brand uppercase tracking-[0.1em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
style={{ fontSize: "clamp(2.2rem, 7vw, 5rem)" }}

// AFTER:
className="font-brand uppercase tracking-[0.06em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
style={{ fontSize: "clamp(1.8rem, 7vw, 5rem)" }}
```

- [ ] **Step 2: Verify at 320px** — "YOU ARE BEING FORMED" (it renders as "You Are Being Formed") fits without overflow or awkward wrapping. No letters clipped.

- [ ] **Step 3: Verify at 1280px** — Headline tracking at desktop unchanged (still `0.14em`).

- [ ] **Step 4: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): reduce hero headline clamp floor and tracking on mobile"
```

---

## Task 3: Six Pieces — add compact mobile image card per piece (Fix 3)

**Files:**
- Modify: `src/Identity.jsx:1822-1905` (the text content column inside each piece block)

Each piece block's text column starts at line 1822. The desktop image panel is `hidden md:flex` (line 1907). We need a `md:hidden` 16:9 image card BEFORE the piece icon image on mobile.

- [ ] **Step 1: Locate exact insertion point**

In `SixPiecesSection`, the text column div at line 1822 opens with:
```jsx
<div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
  {piece.icon && (
    <img
      src={piece.icon}
      alt=""
      className="piece-icon-anchor"
      ...
    />
  )}
```

Insert the mobile image card BETWEEN the opening `<div>` and the `{piece.icon && ...}` block.

- [ ] **Step 2: Apply the change**

Replace:
```jsx
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                {piece.icon && (
                  <img
                    src={piece.icon}
                    alt=""
                    className="piece-icon-anchor"
```

With:
```jsx
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                {/* Mobile image card — visible below 768px only */}
                <div
                  className="md:hidden rounded-xl overflow-hidden relative mb-6"
                  style={{
                    aspectRatio: "16/9",
                    background: `linear-gradient(135deg, ${C.heroBg} 0%, ${C.ruleBg} 100%)`,
                  }}
                >
                  <img
                    src={ARMOR_TRACKS[piece.slug]?.img || ""}
                    alt={piece.title}
                    style={{
                      position: "absolute", inset: 0,
                      width: "100%", height: "100%",
                      objectFit: "cover", objectPosition: "center top",
                    }}
                  />
                  <div style={{
                    position: "absolute", inset: 0,
                    background: `linear-gradient(to top, ${C.heroBg}DD 0%, transparent 60%)`,
                  }} />
                  {piece.icon && (
                    <img
                      src={piece.icon}
                      alt=""
                      style={{
                        position: "absolute",
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60px", height: "auto",
                        objectFit: "contain",
                        opacity: 0.15,
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
                {piece.icon && (
                  <img
                    src={piece.icon}
                    alt=""
                    className="piece-icon-anchor"
```

- [ ] **Step 3: Verify at 375px** — Each of the 6 armor pieces shows a 16:9 image card before its text block. The desktop 3:4 image card is still absent on mobile (hidden by `hidden md:flex`).

- [ ] **Step 4: Verify at 1280px** — No mobile card visible. Only the tall 3:4 desktop card is shown.

- [ ] **Step 5: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): add 16:9 image card to Six Pieces section on mobile"
```

---

## Task 4: Make "Explore this piece →" always visible on mobile (Fix 4)

**Files:**
- Modify: `src/Identity.jsx:2593` (the `<style>` tag inside `IdentityLanding`)

GSAP sets `.piece-explore-link` to `opacity: 0` initially. On mobile, scroll-trigger may not fire reliably, leaving links permanently invisible. Override with CSS.

- [ ] **Step 1: Apply the change**

In the `<style>` block at line 2593 (inside `IdentityLanding`), add the override after the existing `.shimmer-sweep` block. The closing backtick is at ~line 2611. Insert before the closing `` `} ``:

```css
@media (max-width: 767px) {
  .piece-explore-link {
    opacity: 0.85 !important;
  }
}
```

So the full style block ends:
```jsx
      `}</style>
```
becomes the CSS inserted just before the `\`` close.

- [ ] **Step 2: Verify at 375px** — All 6 "Explore this piece →" links are immediately visible (gold color) on page load without scrolling. Tappable.

- [ ] **Step 3: Verify at 1280px** — Links still animate in via GSAP scroll trigger (opacity starts at 0, fades to 0.8 on scroll). `!important` only applies below 768px.

- [ ] **Step 4: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): force-show explore links on mobile overriding GSAP opacity"
```

---

## Task 5: Compact "coming soon" collection cards on mobile (Fix 5)

**Files:**
- Modify: `src/Identity.jsx:2119-2203` (CollectionSection card render)

Three cards with `available: false` each render at 320px min-height. On mobile collapse them to `clamp(160px, 40vw, 320px)` and hide their hook quotes.

- [ ] **Step 1: Fix card minHeight**

At line 2125–2129, the card `Link` has:
```jsx
style={{
  textDecoration: "none",
  minHeight: "320px",
  background: `${C.ivory}05`,
  border: `1px solid ${C.ivory}${p.available ? "0F" : "07"}`,
}}
```

Change to:
```jsx
style={{
  textDecoration: "none",
  minHeight: p.available ? "320px" : "clamp(160px, 40vw, 320px)",
  background: `${C.ivory}05`,
  border: `1px solid ${C.ivory}${p.available ? "0F" : "07"}`,
}}
```

- [ ] **Step 2: Hide hook quote on unavailable cards on mobile**

At line 2178–2189, the hook paragraph:
```jsx
{p.hook && (
  <p
    className="text-[13px] leading-relaxed mt-auto"
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: "italic",
      color: `${C.ivory}66`,
    }}
  >
    "{p.hook}"
  </p>
)}
```

Change to:
```jsx
{p.hook && (
  <p
    className={`text-[13px] leading-relaxed mt-auto ${!p.available ? "hidden md:block" : ""}`}
    style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontStyle: "italic",
      color: `${C.ivory}66`,
    }}
  >
    "{p.hook}"
  </p>
)}
```

- [ ] **Step 3: Verify at 375px** — Three available cards (Helmet, Shield, Sword) remain at 320px. Three unavailable cards (Belt, Breastplate, Gospel of Peace) are shorter, no hook quote text. Total scroll distance for this section should be noticeably reduced.

- [ ] **Step 4: Verify at 1280px** — All 6 cards appear identical to before (full height, hook quotes visible on unavailable cards since `hidden md:block` shows at md+).

- [ ] **Step 5: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): compact coming-soon collection cards on mobile"
```

---

## Task 6: Prevent piece switcher dropdown overflow + add backdrop (Fix 6)

**Files:**
- Modify: `src/Identity.jsx:1107` (ArmorStyles CSS block)
- Modify: `src/Identity.jsx:1289-1307` (BackNav dropdown JSX)

The `.ap-piece-dropdown` uses `left: 50%; transform: translateX(-50%)` which overflows 375px screens. Also needs a backdrop overlay.

- [ ] **Step 1: Add mobile CSS to ArmorStyles**

In `ArmorStyles` at line 1221, the existing `@media (max-width: 639px)` block is:
```css
@media (max-width: 639px) {
  .ap-piece-nav { flex-direction: column; }
  .ap-nav-btn { width: 100%; flex: none; }
  .ap-nav-btn.next { text-align: left; align-items: flex-start; }
  .ap-content { padding: 32px 20px 80px; }
  .ap-main { max-width: 100%; }
  .ap-scripture { padding: 1rem 1.25rem; }
}
```

Add dropdown rules to this block:
```css
@media (max-width: 639px) {
  .ap-piece-nav { flex-direction: column; }
  .ap-nav-btn { width: 100%; flex: none; }
  .ap-nav-btn.next { text-align: left; align-items: flex-start; }
  .ap-content { padding: 32px 20px 80px; }
  .ap-main { max-width: 100%; }
  .ap-scripture { padding: 1rem 1.25rem; }
  .ap-piece-dropdown {
    left: 10px;
    right: 10px;
    transform: none;
    min-width: auto;
  }
  .ap-back-nav {
    padding: 8px 16px;
    gap: 10px;
  }
  .ap-piece-switcher-title {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ap-day-nav {
    top: 44px;
    padding-top: 8px;
  }
}
```

- [ ] **Step 2: Add backdrop to BackNav JSX**

At line 1289, the existing dropdown render is:
```jsx
{open && (
  <div className="ap-piece-dropdown">
    {PIECE_ORDER.map(slug => {
```

Replace with:
```jsx
{open && (
  <>
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 199,
        background: "rgba(0,0,0,0.3)",
      }}
    />
    <div className="ap-piece-dropdown" style={{ zIndex: 200 }}>
      {PIECE_ORDER.map(slug => {
```

And close the fragment after the dropdown's closing `</div>`:
```jsx
    </div>
  </>
)}
```

The full updated block should be:
```jsx
{open && (
  <>
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 199,
        background: "rgba(0,0,0,0.3)",
      }}
    />
    <div className="ap-piece-dropdown" style={{ zIndex: 200 }}>
      {PIECE_ORDER.map(slug => {
        const p = ARMOR_TRACKS[slug];
        const isActive = slug === piece;
        return (
          <Link
            key={slug}
            to={`/identity/${slug}`}
            className={`ap-piece-dropdown-item${isActive ? " active" : ""}`}
            onClick={() => setOpen(false)}
          >
            <span className="ap-piece-dropdown-num">{p.num}</span>
            <span>{p.title}</span>
          </Link>
        );
      })}
    </div>
  </>
)}
```

- [ ] **Step 3: Verify at 375px** — Open piece switcher dropdown. It stays within screen edges with 10px margin. A dark overlay appears behind it. Tapping outside the dropdown closes it.

- [ ] **Step 4: Verify that "Breastplate of Righteousness" title truncates in the switcher pill** — long piece name shows ellipsis, not overflow.

- [ ] **Step 5: Verify at 1280px** — Dropdown positioning unchanged (still center-anchored). No backdrop changes at desktop.

- [ ] **Step 6: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): prevent dropdown overflow and add backdrop on mobile"
```

---

## Task 7: Coordinate sticky BackNav + day-nav heights (Fix 7)

This is already covered in Task 6's CSS changes — the `@media (max-width: 639px)` block sets `.ap-day-nav { top: 44px; padding-top: 8px; }` and tightens `.ap-back-nav` padding to `8px 16px`.

- [ ] **Step 1: Verify the sticky stacking**

On a 375px viewport, scroll down on any piece page. The BackNav bar (`.ap-back-nav`) and day-nav (`.ap-day-nav`) should both be sticky and visually aligned — day-nav sits directly below BackNav without overlapping.

- [ ] **Step 2: If BackNav is taller than 44px** — measure in DevTools. Adjust the `top: 44px` in the CSS to match `BackNav`'s rendered height. It should be ≤44px with the reduced padding from Task 6.

---

## Task 8: Surface formation widget on mobile (Fix 8)

**Files:**
- Modify: `src/Identity.jsx:1221-1228` (existing `@media (max-width: 639px)` block in ArmorStyles)

The tablet breakpoint (640–1023px) already reorders sidebar above main (lines 1232–1237). Mobile below 639px currently has NO order rules so sidebar falls after all content in DOM order. Extend the tablet ordering rules to mobile.

- [ ] **Step 1: Apply the change**

In `ArmorStyles`, the `@media (max-width: 639px)` block (being updated in Task 6) — add the flex ordering rules to it:

```css
@media (max-width: 639px) {
  .ap-piece-nav { flex-direction: column; }
  .ap-nav-btn { width: 100%; flex: none; }
  .ap-nav-btn.next { text-align: left; align-items: flex-start; }
  .ap-content { padding: 32px 20px 120px; display: flex; flex-direction: column; }
  .ap-day-nav   { order: 0; }
  .ap-sidebar   { order: 1; margin-top: 0; margin-bottom: 2rem; }
  .ap-main      { order: 2; }
  .ap-piece-nav { order: 3; }
  .ap-main { max-width: 100%; }
  .ap-scripture { padding: 1rem 1.25rem; }
  /* (dropdown/back-nav rules from Task 6 also here) */
}
```

Note: `padding: 32px 20px 120px` (bottom padding increased to 120px to clear the floating progress bar added in Task 10).

- [ ] **Step 2: Verify at 375px** — On any piece page, the formation widget (e.g. Daily Examen for Belt of Truth) appears ABOVE the devotional text, right after the day selector tabs.

- [ ] **Step 3: Verify at 640px+** — Widget remains above main content (tablet behavior, unchanged).

- [ ] **Step 4: Verify at 1280px** — Sidebar stays in the right column, sticky. No reordering visible.

- [ ] **Step 5: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): surface formation widget above devotional content on mobile"
```

---

## Task 9: Fix prev/next nav directional alignment on mobile (Fix 9)

**Files:**
- Modify: `src/Identity.jsx:1221-1228` (existing `@media (max-width: 639px)` block in ArmorStyles)

Currently `.ap-nav-btn.next` gets `text-align: left; align-items: flex-start` on mobile — both buttons look left-aligned, losing directional clarity.

- [ ] **Step 1: Apply the change**

In the `@media (max-width: 639px)` block, replace the existing nav-btn rules:
```css
/* BEFORE */
.ap-nav-btn { width: 100%; flex: none; }
.ap-nav-btn.next { text-align: left; align-items: flex-start; }
```
With:
```css
/* AFTER */
.ap-nav-btn { width: 100%; flex: none; }
.ap-nav-btn.next {
  text-align: right;
  flex-direction: row-reverse;
}
.ap-nav-btn.next .ap-nav-btn-text {
  align-items: flex-end;
}
```

- [ ] **Step 2: Verify at 375px** — "← Piece 01" (prev) is left-aligned with left arrow. "Piece 03 →" (next) is right-aligned with right arrow. When stacked vertically, directional intent is clear.

- [ ] **Step 3: Verify at 1280px** — Both buttons display as before in the horizontal layout. `.ap-nav-btn.next` has `flex-direction: row-reverse` and `text-align: right` already set at the base level (line 1212–1213), so no regression.

- [ ] **Step 4: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): restore directional alignment for prev/next nav on mobile"
```

---

## Task 10: Add floating formation progress bar on mobile (Fix 10)

**Files:**
- Modify: `src/Identity.jsx:3107-3128` (ArmorPiecePage, inside `.ap-content`, before the closing `</div>` of `.ap-content`)

Add a fixed bottom bar showing progress dots, current day label, and a "Day X →" / "Next Piece →" action.

- [ ] **Step 1: Locate insertion point**

In `ArmorPiecePage`, the `.ap-piece-nav` div ends at line 3126 with `</div>`, and then the `.ap-content` closes at line 3128 with `</div>`. Insert the floating bar AFTER the piece-nav closing `</div>` and BEFORE the `.ap-content` closing `</div>`.

- [ ] **Step 2: Apply the JSX addition**

After line 3126 (`</div>` that closes `.ap-piece-nav`), insert:

```jsx
        {/* Mobile floating progress bar */}
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 80,
            background: "rgba(6,5,10,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {data.days.map(d => (
              <div
                key={d.num}
                style={{
                  width: d.num === day ? 16 : 6,
                  height: 4,
                  borderRadius: 2,
                  background: completedDays.includes(d.num)
                    ? "#C9A84C"
                    : d.num === day
                      ? "rgba(201,168,76,0.5)"
                      : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Day label */}
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(250,248,245,0.4)",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            Day {day} · {curDay.title}
          </span>

          {/* Next day / complete action */}
          {day < 6 ? (
            <button
              onClick={() => {
                setDay(day + 1);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "#C9A84C",
                color: "#0A0A0A",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Day {day + 1} →
            </button>
          ) : (
            <Link
              to={nextSlug ? `/identity/${nextSlug}` : "/identity"}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201,168,76,0.4)",
                background: "transparent",
                color: "#C9A84C",
                textDecoration: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {nextSlug ? "Next Piece →" : "← Identity"}
            </Link>
          )}
        </div>
```

- [ ] **Step 3: Verify bottom padding is set**

The `ap-content` padding on mobile (set in Task 8) must be `padding: 32px 20px 120px`. Confirm this is in the CSS — the 120px bottom prevents the fixed bar from overlapping the footer content.

- [ ] **Step 4: Verify at 375px on Day 1–5** — Floating bar at bottom shows 6 dots (current day gold, completed gold, others dim), "Day 1 · [title]" label, and "Day 2 →" gold pill button. Tapping the button advances to the next day and scrolls to the top of `.ap-main`.

- [ ] **Step 5: Verify at 375px on Day 6** — Button changes to a link: "Next Piece →" (if there is a next piece) or "← Identity" (for Sword of the Spirit, the last piece). The link navigates correctly.

- [ ] **Step 6: Verify at 1280px** — No floating bar visible (hidden by `md:hidden`). Sidebar remains visible in right column.

- [ ] **Step 7: Commit**
```bash
git add src/Identity.jsx
git commit -m "fix(mobile): add floating formation progress bar to piece pages on mobile"
```

---

## Implementation Notes

- All changes are in `src/Identity.jsx`. No new files needed.
- Tasks 6, 7, 8, 9 all modify the same `@media (max-width: 639px)` CSS block in `ArmorStyles`. If executing sequentially, consolidate all these CSS changes into that single block to avoid conflicting edits. The final merged block should be:

```css
@media (max-width: 639px) {
  .ap-piece-nav { flex-direction: column; }
  .ap-nav-btn { width: 100%; flex: none; }
  .ap-nav-btn.next { text-align: right; flex-direction: row-reverse; }
  .ap-nav-btn.next .ap-nav-btn-text { align-items: flex-end; }
  .ap-content { padding: 32px 20px 120px; display: flex; flex-direction: column; }
  .ap-day-nav   { order: 0; top: 44px; padding-top: 8px; }
  .ap-sidebar   { order: 1; margin-top: 0; margin-bottom: 2rem; }
  .ap-main      { order: 2; max-width: 100%; }
  .ap-piece-nav { order: 3; }
  .ap-scripture { padding: 1rem 1.25rem; }
  .ap-piece-dropdown { left: 10px; right: 10px; transform: none; min-width: auto; }
  .ap-back-nav { padding: 8px 16px; gap: 10px; }
  .ap-piece-switcher-title { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
```

- The `IdentityLanding` `<style>` tag (line 2593) gets the `.piece-explore-link` mobile override in Task 4 — add to that existing tag, not a new one.
