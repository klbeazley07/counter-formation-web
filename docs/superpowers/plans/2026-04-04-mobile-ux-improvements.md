# Mobile UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all four mobile UX improvements from CF_Mobile_UX_Spec_v1: MobileTabBar scale, global text audit, full-screen Rule of Life tiles, and CampaignBanner replacing FloatingChallengeTrigger.

**Architecture:** Tasks 1-2 are pure style/size tweaks with no structural risk. Task 3 converts the horizontal rhythm carousel to a vertical full-viewport snap scroller on mobile via CSS and JSX changes to `RuleOfLifeSection`. Task 4 removes `FloatingChallengeTrigger` from `RuleOfLife.jsx` and introduces a new `CampaignBanner` component + `campaign.js` config.

**Tech Stack:** React 18, Tailwind CSS, GSAP / ScrollTrigger, Lucide React, CSS custom properties, `localStorage`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/MobileTabBar.jsx` | Modify | Increase icon size 20→28px, label 9→11px, bar 56→64px, expand tap targets |
| `src/App.jsx` | Modify | Fix hero microcopy/CTA/scripture sizes; update spacer div; add `<CampaignBanner />`; convert RuleOfLifeSection to snap; remove CarouselDots |
| `src/index.css` | Modify | Add `.rhythm-carousel` + `.rhythm-card` mobile snap overrides |
| `src/RuleOfLife.jsx` | Modify | Remove FloatingChallengeTrigger function, JSX usage, and 3 CSS classes; add mobile text size overrides |
| `src/components/CampaignBanner.jsx` | Create | Dismissible campaign announcement banner |
| `src/config/campaign.js` | Create | Campaign data config (active flag, message, CTA, expiry, storageKey) |

---

## Task 1: MobileTabBar — Scale Up Icons, Labels, Bar Height

**Files:**
- Modify: `src/components/MobileTabBar.jsx`
- Modify: `src/App.jsx` (spacer div only)

**Current state (from code):**
- Icons: `width="20" height="20"` SVGs
- Labels: `fontSize: "9px"`, `letterSpacing: "0.12em"`
- Bar container height: `"56px"`
- Tap target: `padding: "6px 12px"`, `minWidth: "56px"` (too small)
- More sheet bottom: `calc(56px + env(safe-area-inset-bottom, 0px))`
- Spacer in App.jsx line 1653: `height: "calc(56px + env(safe-area-inset-bottom, 0px))"`

- [ ] **Step 1: Update TabIcon SVG sizes — MobileTabBar.jsx:20-31**

  In every `<svg>` in `TabIcon`, change `width="20" height="20"` → `width="28" height="28"`:

  ```jsx
  // MobileTabBar.jsx — TabIcon function, all 5 cases
  case "home":
    return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
  case "formation":
    return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>);
  case "identity":
    return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
  case "gear":
    return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
  case "more":
    return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
  ```

- [ ] **Step 2: Update tab bar container height 56→64 — MobileTabBar.jsx:171-176**

  ```jsx
  // The inner div that holds the tabs (currently height: "56px")
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    height: "64px",
  }}>
  ```

- [ ] **Step 3: Update each tab button tap target and label — MobileTabBar.jsx:179-209**

  Replace the button style and label style:

  ```jsx
  <button
    key={tab.key}
    onClick={() => handleTabTap(tab)}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "0",
      flex: "1",
      height: "64px",
      transition: "all 0.2s",
    }}
    aria-label={tab.label}
  >
    <TabIcon name={tab.icon} active={isActive} />
    <span style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: "11px",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: isActive ? C.gold : "rgba(250,248,245,0.38)",
      fontWeight: isActive ? 700 : 400,
      transition: "color 0.2s",
    }}>
      {tab.label}
    </span>
  </button>
  ```

- [ ] **Step 4: Update More sheet bottom offset — MobileTabBar.jsx:238**

  ```jsx
  // Change 56px → 64px
  bottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
  ```

- [ ] **Step 5: Update spacer div in App.jsx — App.jsx:1653**

  ```jsx
  // Change 56px → 64px
  <div className="md:hidden" style={{ height: "calc(64px + env(safe-area-inset-bottom, 0px))" }} />
  ```

- [ ] **Step 6: Also update the gear section height reference in App.jsx (line 995) that bakes in 56px**

  Find this line:
  ```
  .gear-slide { ... height: calc(100vh - 60px - 56px); height: calc(100svh - 60px - 56px); }
  ```
  Change to:
  ```
  .gear-slide { ... height: calc(100vh - 60px - 64px); height: calc(100svh - 60px - 64px); }
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/MobileTabBar.jsx src/App.jsx
  git commit -m "feat: scale up MobileTabBar icons (20→28px), labels (9→11px), bar height (56→64px)"
  ```

---

## Task 2: Global Mobile Text Audit

**Files:**
- Modify: `src/App.jsx` (hero section microcopy, CTA buttons, scriptureRef)
- Modify: `src/App.jsx` (RuleOfLifeSection description opacity + rhythm card line-height)
- Modify: `src/RuleOfLife.jsx` (RuleStyles CSS block — media query overrides)
- Modify: `src/FormationShareable.jsx` (Declare eyebrow size)

### 2A — App.jsx Hero Fixes

- [ ] **Step 1: Fix microcopy font size — App.jsx:275**

  Current: `"text-[11px] md:text-[9px] tracking-[0.28em] uppercase leading-loose font-light text-white/36"`

  Change `text-[11px]` → `text-[12px]`:
  ```jsx
  <p className="text-[12px] md:text-[9px] tracking-[0.28em] uppercase leading-loose font-light text-white/36">
    Limited drops. Purposeful design. Disciplined faith.
  </p>
  ```

- [ ] **Step 2: Fix mobile CTA button font sizes — App.jsx:282-288**

  Current: `text-[10px] uppercase tracking-[0.18em]` on both `<a>` elements.

  Change to `text-[12px]`:
  ```jsx
  <a ref={pathCard1Ref} href="#architecture"
    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-[12px] uppercase tracking-[0.18em] text-white font-bold transition-all duration-300 hover:border-[#C9A84C]/40">
    Enter the Formation <ArrowRight size={12} className="opacity-50 shrink-0" />
  </a>
  <a ref={pathCard2Ref} href="#shop"
    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-[12px] uppercase tracking-[0.18em] text-white font-bold transition-all duration-300 hover:border-[#C9A84C]/40">
    Shop the Gear <ArrowRight size={12} className="opacity-50 shrink-0" />
  </a>
  ```

- [ ] **Step 3: Fix scriptureRef font size — App.jsx:315-317**

  Current: `text-[0.62rem]` (≈9.9px)

  Change to `text-[10px]`:
  ```jsx
  <div ref={scriptureRef}
    className="mt-8 md:mt-10 text-[10px] uppercase tracking-[0.35em] text-white/25 opacity-0">
    Ephesians 6:10–18
  </div>
  ```

### 2B — RuleOfLifeSection Description Opacity

- [ ] **Step 4: Fix section description opacity — App.jsx:390**

  Current: `"max-w-md text-xs md:text-base opacity-50 leading-relaxed font-light text-left md:text-right"`

  Change to lift mobile opacity to 70 while keeping desktop at 50:
  ```jsx
  <p className="max-w-md text-xs md:text-base opacity-70 md:opacity-50 leading-relaxed font-light text-left md:text-right">
  ```

### 2C — Rhythm Card Line Heights in RuleOfLifeSection

- [ ] **Step 5: Add leading-[1.65] to desc and summary paragraphs — App.jsx:416-424**

  Current desc `<p>`:
  ```jsx
  <p className="text-[12px] md:text-xs opacity-60 tracking-wide leading-relaxed font-light">{r.desc}</p>
  ```
  Updated:
  ```jsx
  <p className="text-[12px] md:text-xs opacity-60 tracking-wide leading-[1.65] font-light">{r.desc}</p>
  ```

  Current summary `<p>` (multi-line class):
  ```jsx
  <p className="text-[12px] md:text-[13px] leading-relaxed px-0 mt-2
    font-['Cormorant_Garamond'] italic text-[#FAF8F5]
    md:absolute md:top-full md:left-0 md:right-0
    md:opacity-0 md:translate-y-2 md:group-hover:opacity-85 md:group-hover:translate-y-0
    opacity-45 translate-y-0
    transition-all duration-300 ease-out">
  ```
  Updated (change `leading-relaxed` → `leading-[1.65]`):
  ```jsx
  <p className="text-[12px] md:text-[13px] leading-[1.65] px-0 mt-2
    font-['Cormorant_Garamond'] italic text-[#FAF8F5]
    md:absolute md:top-full md:left-0 md:right-0
    md:opacity-0 md:translate-y-2 md:group-hover:opacity-85 md:group-hover:translate-y-0
    opacity-45 translate-y-0
    transition-all duration-300 ease-out">
  ```

### 2D — RuleOfLife.jsx Mobile CSS Overrides

- [ ] **Step 6: Add mobile text overrides to RuleStyles in RuleOfLife.jsx**

  The `RuleStyles` component renders a `<style>` block. Find the closing backtick of the style block (after line 822) and insert these overrides before the closing `</style>` tag.

  Add this block at the end of the CSS string inside `RuleStyles` (just before the closing backtick):

  ```css
  @media (max-width: 767px) {
    .rl-sec-label { font-size: 10px; letter-spacing: .3em; }
    .rl-book-title { font-size: 15px; }
    .rl-book-author { font-size: 11px; }
    .rl-book-cta { font-size: 10px; }
    .rl-nav-btn-dir { font-size: 10px; }
  }
  ```

### 2E — ExamenWalkthrough step tab font size

- [ ] **Step 7: Update step tab button fontSize in ExamenWalkthrough — RuleOfLife.jsx:388**

  The step tab buttons are rendered with inline `fontSize: "8px"`. Since this is an inline style, the cleanest approach is to add a CSS class override in the `RuleStyles` media query block and apply it.

  Add to the `@media (max-width: 767px)` block added in Step 6:
  ```css
  .rl-examen-tab { font-size: 10px !important; }
  ```

  Then on line 388, add `className="rl-examen-tab"` to the step tab button:
  ```jsx
  <button key={i} onClick={() => setStep(i)} className="rl-examen-tab" style={{ flex: 1, padding: "12px 4px", border: "none", background: step === i ? "rgba(201,168,76,0.1)" : "transparent", borderBottom: step === i ? "2px solid #C9A84C" : "2px solid transparent", cursor: "pointer", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".18em", textTransform: "uppercase", color: i <= step ? (step === i ? "#C9A84C" : "rgba(201,168,76,0.5)") : "rgba(250,248,245,0.2)", transition: "all .2s" }}>
  ```

### 2F — FormationShareable Declare eyebrow

- [ ] **Step 8: Fix "Declare" eyebrow font size — FormationShareable.jsx:242**

  Current: `fontSize: "9px", letterSpacing: ".44em"`

  Change to `11px` using a window width conditional:
  ```jsx
  <p style={{
    fontFamily: "'Barlow Condensed',sans-serif",
    fontSize: window.innerWidth < 768 ? "11px" : "9px",
    letterSpacing: ".44em",
    textTransform: "uppercase",
    color: "rgba(201,168,76,0.55)",
    marginBottom: "1.1rem"
  }}>
    Declare
  </p>
  ```

- [ ] **Step 9: Commit**

  ```bash
  git add src/App.jsx src/RuleOfLife.jsx src/FormationShareable.jsx
  git commit -m "feat: global mobile text audit — floor sizes across hero, rhythm cards, RuleOfLife, Examen, FormationShareable"
  ```

---

## Task 3: Rule of Life — Full-Screen Snap Carousel on Mobile

**Files:**
- Modify: `src/index.css` (`.rhythm-carousel` and `.rhythm-card` mobile overrides)
- Modify: `src/App.jsx` (`RuleOfLifeSection` — section overflow, card content layout, title scale, summary visibility, chevron indicator, remove CarouselDots)

> **Risk note:** The existing `IntersectionObserver` that drives `CarouselDots` will be removed. The GSAP `ScrollTrigger` animations targeting `.rhythm-img-wrap` in `MainSite` use `window` as the scroller — with a `scroll-snap` container that is NOT `window`, these triggers **won't fire correctly on mobile**. The fix is to disable those triggers for the snap container on mobile, or accept that the grayscale-to-color animation won't play inside the snap scroll (since `window` scroll events don't fire for inner-container scrolling). The spec acknowledges this — implement the layout change first, note the GSAP caveat in a comment.

### 3A — CSS: Convert carousel to vertical snap on mobile

- [ ] **Step 1: Update `.rhythm-carousel` mobile styles in index.css:461-490**

  Replace the entire current `.rhythm-carousel` and `@media (min-width: 768px)` block with:

  ```css
  /* Rhythm cards — mobile: full-viewport vertical snap */
  .rhythm-carousel {
    display: flex;
    flex-direction: column;
    height: 100svh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scrollbar-width: none;
  }
  .rhythm-carousel::-webkit-scrollbar { display: none; }

  @media (min-width: 768px) {
    .rhythm-carousel {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 20px;
      overflow: visible;
      height: auto;
      scroll-snap-type: none;
      padding: 0;
    }
    .rhythm-carousel > * {
      flex: unset;
      min-height: 320px;
      width: auto;
      height: auto;
      scroll-snap-align: none;
      border-radius: 0;
    }
  }
  ```

- [ ] **Step 2: Add `.rhythm-card` mobile snap styles in index.css**

  After the `.rhythm-carousel > *` desktop block, add:

  ```css
  /* Mobile: each card is full-viewport */
  @media (max-width: 767px) {
    .rhythm-card {
      flex: none;
      width: 100vw;
      height: 100svh;
      scroll-snap-align: start;
      border-radius: 0 !important;
      min-height: unset;
    }
  }
  ```

  Also add the `.rhythm-img-wrap` opacity increase for mobile:
  ```css
  @media (max-width: 767px) {
    .rhythm-img-wrap {
      opacity: 0.55 !important;
    }
  }
  ```

### 3B — JSX: Section overflow, content layout, title scale, remove CarouselDots

- [ ] **Step 3: Add `overflow: hidden` to the section on mobile — App.jsx:379**

  Current:
  ```jsx
  <section id="rule" className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden"
    style={{ backgroundColor: C.ruleBg }}>
  ```

  The section already has `overflow-hidden` which handles desktop. On mobile we need the snap container to be fully contained. Remove `px-4 md:px-6` from the section (padding breaks full-bleed snap cards on mobile) and move horizontal padding to desktop only:
  ```jsx
  <section id="rule" className="py-24 md:py-48 md:px-6 relative overflow-hidden"
    style={{ backgroundColor: C.ruleBg }}>
  ```

  Wait — the `py-24 md:py-48` top/bottom padding also conflicts with the snap container taking `100svh`. We need to remove the top padding on mobile too. Use:
  ```jsx
  <section id="rule" className="md:py-48 md:px-6 relative overflow-hidden"
    style={{ backgroundColor: C.ruleBg }}>
  ```

  And ensure the section header only shows on desktop, or is positioned above the snap container. See Step 4.

- [ ] **Step 4: Make section header mobile-hidden or minimal — App.jsx:383-393**

  The section header (title + description) sits above the carousel. With `100svh` snap cards, this header pushes content down. The recommended approach from the spec is to hide the header on mobile (it's implicit in the full-screen card design). Add `hidden md:block` wrapper:

  ```jsx
  <div className="hidden md:block max-w-7xl mx-auto relative z-10 lg:px-4 xl:px-8 mb-32">
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
      <div className="space-y-6">
        <span className="text-[10px] text-[#C9A84C] tracking-[0.5em] uppercase font-bold">The Pattern</span>
        <h2 className="font-brand text-7xl uppercase tracking-[0.12em] text-white leading-none">
          Rule of Life
        </h2>
      </div>
      <p className="max-w-md text-base opacity-50 leading-relaxed font-light text-right">
        A set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
      </p>
    </div>
  </div>
  ```

  Then wrap the carousel and CarouselDots separately:
  ```jsx
  <div ref={carouselRef} className="rhythm-carousel">
    {/* cards here */}
  </div>
  {/* CarouselDots removed — see Step 6 */}
  ```

- [ ] **Step 5: Update card inner content layout — App.jsx:408-426**

  The inner content div currently uses `p-6 md:p-8 flex flex-col`. On mobile, content should sit at the bottom third. Add a CSS class `rhythm-card-content` and override in `index.css`.

  In `App.jsx`, change the inner content div class:
  ```jsx
  <div className="rhythm-card-content relative z-10 p-6 md:p-8 flex flex-col" style={{ flex: 1 }}>
  ```

  In `index.css`, add to the `@media (max-width: 767px)` block:
  ```css
  @media (max-width: 767px) {
    .rhythm-card-content {
      justify-content: flex-end !important;
      padding: 0 28px 56px !important;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  ```

- [ ] **Step 6: Scale up card title on mobile and make summary fully visible — App.jsx:413-424**

  Current title:
  ```jsx
  <h3 className="font-brand text-base md:text-xl uppercase tracking-[0.1em] text-white">{r.title}</h3>
  ```
  Updated (clamp for mobile):
  ```jsx
  <h3 className="font-brand md:text-xl uppercase tracking-[0.1em] text-white"
    style={{ fontSize: "clamp(36px, 10vw, 52px)" }}
    >{r.title}</h3>
  ```

  Wait — we can't mix Tailwind `md:text-xl` with an always-on inline style `fontSize`. Use a responsive inline style approach:
  ```jsx
  <h3
    className="font-brand uppercase tracking-[0.1em] text-white"
    style={{ fontSize: "clamp(36px, 10vw, 52px)" }}
  >{r.title}</h3>
  ```
  On desktop the clamp will be near `52px` (larger than `text-xl` = 20px) — that's bigger than desired on desktop. Use a media query class override instead. Add to `index.css`:
  ```css
  @media (min-width: 768px) {
    .rhythm-card h3 { font-size: 1.25rem; } /* md:text-xl */
  }
  @media (max-width: 767px) {
    .rhythm-card h3 { font-size: clamp(36px, 10vw, 52px); }
  }
  ```
  And in JSX, just keep:
  ```jsx
  <h3 className="font-brand uppercase tracking-[0.1em] text-white">{r.title}</h3>
  ```

  Summary visibility on mobile — change `opacity-45` to `md:opacity-0` (visible on mobile, hidden on desktop until hover):
  ```jsx
  <p className="text-[12px] md:text-[13px] leading-[1.65] px-0 mt-2
    font-['Cormorant_Garamond'] italic text-[#FAF8F5]
    md:absolute md:top-full md:left-0 md:right-0
    md:opacity-0 md:translate-y-2 md:group-hover:opacity-85 md:group-hover:translate-y-0
    opacity-75 translate-y-0
    transition-all duration-300 ease-out">
    {r.summary}
  </p>
  ```

  The `desc` line should be hidden on mobile (redundant with summary at full-screen scale):
  ```jsx
  <p className="hidden md:block text-[12px] md:text-xs opacity-60 tracking-wide leading-[1.65] font-light">{r.desc}</p>
  ```

- [ ] **Step 7: Add chevron-down swipe indicator to each card except the last — App.jsx inside the map**

  Add inside the `<Link>` card, after the content div, before closing `</Link>`:
  ```jsx
  {i < rhythms.length - 1 && (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden opacity-40 animate-bounce z-20">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M1 1L10 10L19 1" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )}
  ```

- [ ] **Step 8: Remove CarouselDots from RuleOfLifeSection — App.jsx:430 and :336-345**

  Delete line 430:
  ```jsx
  // DELETE this line:
  <CarouselDots count={5} activeIndex={activeRhythm} />
  ```

  Delete the `CarouselDots` function declaration (lines 336-345):
  ```jsx
  // DELETE the entire function:
  function CarouselDots({ count, activeIndex }) { ... }
  ```

  Also delete the `activeRhythm` state and the `IntersectionObserver` useEffect that drove it from `RuleOfLifeSection` (lines 356-376):
  ```jsx
  // DELETE:
  const [activeRhythm, setActiveRhythm] = useState(0);
  // And the useEffect that sets activeRhythm
  ```

- [ ] **Step 9: Commit**

  ```bash
  git add src/index.css src/App.jsx
  git commit -m "feat: Rule of Life full-screen vertical snap carousel on mobile"
  ```

---

## Task 4: Remove FloatingChallengeTrigger + Introduce CampaignBanner

**Files:**
- Modify: `src/RuleOfLife.jsx` (delete FloatingChallengeTrigger function, JSX usage, 3 CSS classes)
- Create: `src/config/campaign.js`
- Create: `src/components/CampaignBanner.jsx`
- Modify: `src/App.jsx` (add `<CampaignBanner />` above `<SiteNav />`)
- Modify: `src/components/SiteNav.jsx` (add `top: "calc(6px + var(--banner-height, 0px))"` — currently `top-6`)

### 4A — Remove FloatingChallengeTrigger

- [ ] **Step 1: Delete FloatingChallengeTrigger function — RuleOfLife.jsx:841-857**

  Delete these lines entirely:
  ```jsx
  /* ─── FLOATING CHALLENGE TRIGGER ─────────────────────────────────── */

  function FloatingChallengeTrigger() {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;
    return (
      <div className="rl-float-trigger">
        <Link to="/7-day-challenge" className="rl-float-btn">
          Begin the 7-Day Challenge
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </Link>
        <button className="rl-float-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>
    );
  }
  ```

- [ ] **Step 2: Delete `<FloatingChallengeTrigger />` JSX usage — RuleOfLife.jsx:1074**

  Delete this line:
  ```jsx
  <FloatingChallengeTrigger />
  ```

- [ ] **Step 3: Delete the 3 float CSS classes from RuleStyles — RuleOfLife.jsx:770-774**

  Delete these 5 lines from the `<style>` block:
  ```css
  .rl-float-trigger { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 190; display: flex; align-items: center; gap: 8px; }
  .rl-float-btn { display: flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; background: #C9A84C; color: #0A0A0A; font-family: 'Barlow Condensed',sans-serif; font-size: 10px; letter-spacing: .22em; text-transform: uppercase; font-weight: 700; text-decoration: none; white-space: nowrap; box-shadow: 0 4px 32px rgba(201,168,76,0.35); transition: background .25s, transform .25s; }
  .rl-float-btn:hover { background: #FAF8F5; transform: scale(1.03); }
  .rl-float-dismiss { width: 28px; height: 28px; border-radius: 50%; border: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background .2s; }
  .rl-float-dismiss:hover { background: rgba(255,255,255,0.18); }
  ```

- [ ] **Step 4: Commit the removal**

  ```bash
  git add src/RuleOfLife.jsx
  git commit -m "refactor: remove FloatingChallengeTrigger component and styles"
  ```

### 4B — Create campaign.js config

- [ ] **Step 5: Create `src/config/campaign.js`**

  ```js
  // campaign.js
  // Set active: false to disable the banner entirely.
  // Set expiresAt to null for no expiry.
  // storageKey must be unique per campaign so dismissal resets between campaigns.

  export const CAMPAIGN = {
    active: true,
    storageKey: "cf-campaign-7day-v1",
    expiresAt: "2026-06-01T00:00:00Z",
    label: "New",
    message: "The 7-Day Formation Challenge is now open.",
    cta: "Begin",
    href: "/7-day-challenge",
    isExternal: false,
  };
  ```

### 4C — Create CampaignBanner.jsx

- [ ] **Step 6: Create `src/components/CampaignBanner.jsx`**

  ```jsx
  import React, { useState, useEffect } from "react";
  import { Link } from "react-router-dom";
  import { X } from "lucide-react";
  import { CAMPAIGN } from "../config/campaign";

  export function CampaignBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (!CAMPAIGN.active) return;
      if (CAMPAIGN.expiresAt && new Date() > new Date(CAMPAIGN.expiresAt)) return;
      const dismissed = localStorage.getItem(CAMPAIGN.storageKey);
      if (!dismissed) setVisible(true);
    }, []);

    useEffect(() => {
      document.documentElement.style.setProperty(
        "--banner-height",
        visible ? "40px" : "0px"
      );
      return () => document.documentElement.style.setProperty("--banner-height", "0px");
    }, [visible]);

    const dismiss = () => {
      localStorage.setItem(CAMPAIGN.storageKey, "1");
      setVisible(false);
    };

    if (!visible) return null;

    const Inner = (
      <>
        {CAMPAIGN.label && (
          <span className="cf-banner-label">{CAMPAIGN.label}</span>
        )}
        <span className="cf-banner-message">{CAMPAIGN.message}</span>
        <span className="cf-banner-cta">
          {CAMPAIGN.cta}
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>
      </>
    );

    return (
      <div className="cf-banner" role="banner" aria-label="Campaign announcement">
        <div className="cf-banner-inner">
          {CAMPAIGN.isExternal ? (
            <a href={CAMPAIGN.href} target="_blank" rel="noopener noreferrer" className="cf-banner-link">
              {Inner}
            </a>
          ) : (
            <Link to={CAMPAIGN.href} className="cf-banner-link" onClick={dismiss}>
              {Inner}
            </Link>
          )}
          <button className="cf-banner-dismiss" onClick={dismiss} aria-label="Dismiss announcement">
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }
  ```

### 4D — Add CampaignBanner styles to App.jsx

- [ ] **Step 7: Add CampaignBannerStyles component to App.jsx**

  Add a new `function CampaignBannerStyles()` component near the other global style injectors in `App.jsx` (after the imports, near the top of the component section):

  ```jsx
  function CampaignBannerStyles() {
    return (
      <style>{`
        .cf-banner {
          width: 100%;
          background: #0E0C0A;
          border-bottom: 1px solid rgba(201,168,76,0.18);
          position: relative;
          z-index: 300;
          animation: cf-banner-slide 0.4s ease both;
        }
        @keyframes cf-banner-slide {
          from { opacity: 0; transform: translateY(-100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cf-banner-inner {
          max-width: 1320px;
          margin: 0 auto;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
        }
        .cf-banner-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex: 1;
          justify-content: center;
        }
        .cf-banner-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #0A0A0A;
          background: #C9A84C;
          padding: 2px 8px;
          border-radius: 999px;
          flex-shrink: 0;
        }
        .cf-banner-message {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(250,248,245,0.70);
        }
        .cf-banner-cta {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C9A84C;
          flex-shrink: 0;
          transition: color 0.2s;
        }
        .cf-banner-link:hover .cf-banner-cta {
          color: #FAF8F5;
        }
        .cf-banner-dismiss {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(250,248,245,0.28);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          border-radius: 4px;
        }
        .cf-banner-dismiss:hover {
          color: rgba(250,248,245,0.65);
        }
        @media (max-width: 767px) {
          .cf-banner-inner {
            padding: 9px 44px 9px 16px;
            gap: 8px;
          }
          .cf-banner-message {
            font-size: 11px;
            letter-spacing: 0.12em;
          }
          .cf-banner-cta {
            display: none;
          }
          .cf-banner-link {
            justify-content: flex-start;
          }
        }
      `}</style>
    );
  }
  ```

### 4E — Wire CampaignBanner into App.jsx

- [ ] **Step 8: Import CampaignBanner and add to App.jsx**

  Add import near other component imports:
  ```jsx
  import { CampaignBanner } from "./components/CampaignBanner";
  ```

  Add `<CampaignBannerStyles />` alongside other style components in the `App()` return:
  ```jsx
  <BrowserRouter>
    <ScrollToTop />
    <FieldGuideStyles />
    <ChallengeStyles />
    <RuleStyles />
    <ArchitectureStyles />
    <ArmorStyles />
    <CampaignBannerStyles />
    <CampaignBanner />
    <SiteNav />
    ...
  ```

### 4F — Update SiteNav top offset for banner

- [ ] **Step 9: Update SiteNav fixed top position — SiteNav.jsx:76**

  Current: `fixed top-6` (Tailwind = `top: 1.5rem = 24px`)

  The `CampaignBanner` sets `--banner-height` on `:root`. Update `SiteNav` to read this:

  ```jsx
  <nav
    className="hidden md:flex fixed left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-5 py-4 backdrop-blur-2xl border border-white/10 rounded-2xl items-center justify-between"
    style={{ backgroundColor: C.bg, top: "calc(1.5rem + var(--banner-height, 0px))" }}
  >
  ```

  (Remove `top-6` from className since we're controlling it via inline style now.)

- [ ] **Step 10: Commit**

  ```bash
  git add src/config/campaign.js src/components/CampaignBanner.jsx src/App.jsx src/components/SiteNav.jsx
  git commit -m "feat: add CampaignBanner component with localStorage dismissal and --banner-height CSS var"
  ```

---

## Self-Review Against Spec

### Issue 1 — MobileTabBar ✓
- Icons 28×28: Task 1 Step 1 ✓
- Labels 11px, Barlow Condensed, 0.18em: Task 1 Step 3 ✓
- Bar height 64px: Task 1 Step 2 ✓
- Spacer 64px: Task 1 Step 5 ✓
- Full-column tap targets: Task 1 Step 3 (flex:1, height:64px, padding:0) ✓
- Active gold / inactive rgba(250,248,245,0.38): Task 1 Step 3 ✓

### Issue 2 — Global Text ✓
- Microcopy 12px: Task 2 Step 1 ✓
- CTA buttons 12px: Task 2 Step 2 ✓
- scriptureRef 10px: Task 2 Step 3 ✓
- RuleOfLife description opacity 70: Task 2 Step 4 ✓
- Rhythm card desc/summary line-height 1.65: Task 2 Step 5 ✓
- `.rl-sec-label` 10px mobile: Task 2 Step 6 ✓
- `.rl-book-title` 15px mobile: Task 2 Step 6 ✓
- `.rl-book-author` 11px mobile: Task 2 Step 6 ✓
- `.rl-book-cta` 10px mobile: Task 2 Step 6 ✓
- `.rl-nav-btn-dir` 10px mobile: Task 2 Step 6 ✓
- Examen step tabs 10px mobile: Task 2 Step 7 ✓
- FormationShareable "Declare" 11px mobile: Task 2 Step 8 ✓
- SevenDayChallenge / FieldGuide: spec says "without full component code visible" — these require a separate visual audit pass after the above changes land; **not blocking**

### Issue 3 — Full-Screen Snap ✓
- Vertical snap CSS: Task 3 Step 1 ✓
- Card 100vw × 100svh: Task 3 Step 1-2 ✓
- Section overflow: Task 3 Step 3 ✓
- Section header hidden on mobile: Task 3 Step 4 ✓
- Content bottom-third layout: Task 3 Step 5 ✓
- Title clamp(36px,10vw,52px): Task 3 Step 6 ✓
- Summary opacity 0.75 visible: Task 3 Step 6 ✓
- Desc hidden on mobile: Task 3 Step 6 ✓
- Chevron indicator: Task 3 Step 7 ✓
- CarouselDots removed: Task 3 Step 8 ✓
- `.rhythm-img-wrap` opacity 0.55 on mobile: Task 3 Step 2 ✓

### Issue 4 — CampaignBanner ✓
- FloatingChallengeTrigger removed (function + JSX + CSS): Task 4 Steps 1-3 ✓
- `src/config/campaign.js` config file: Task 4 Step 5 ✓
- CampaignBanner component: Task 4 Step 6 ✓
- Dismissal via localStorage: Task 4 Step 6 ✓
- Expiry check: Task 4 Step 6 ✓
- `--banner-height` CSS var: Task 4 Step 6 ✓
- Styles injected via CampaignBannerStyles: Task 4 Step 7 ✓
- Wired into App.jsx above SiteNav: Task 4 Step 8 ✓
- SiteNav top offset: Task 4 Step 9 ✓
