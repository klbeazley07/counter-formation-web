# IDENTITY_STATE.md — Session 6 Agent 0-B
**Date:** 2026-04-02  
**Agent:** 0-B — Identity State Mapper  
**Source file:** `src/Identity.jsx` (2276 lines)  
**Spec sources:** `specs/spec-landing-page.md`, `specs/spec-visual-identity.md`

---

## Summary

`Identity.jsx` is a monolithic file (~236KB) containing two exported page components:
1. `IdentityLanding` — the `/identity` landing page (Sections A–G)
2. `ArmorPiecePage` — the `/identity/[piece]` detail page template

The landing page sections are implemented as discrete named functions: `HeroSection`, `ArmorIntroSection`, `GodsArmorSection`, `SixPiecesSection`, `BrandSection`, `CollectionSection`, `CTASection`.

All six armor piece detail pages are driven by `ARMOR_TRACKS` data and a shared `ArmorPiecePage` template — there are no separate per-piece files.

---

## Section A — Hero

### EXISTING

**JSX structure (lines 1246–1381, function `HeroSection`):**
- `<section>` with `ref={sectionRef}`, Tailwind class `relative min-h-screen flex flex-col items-center justify-center overflow-hidden`, inline `backgroundColor: C.heroBg` (`#06050A`)
- Hero image div: `absolute inset-0 z-0`, `backgroundImage: url('/identity_wide.png')`, `backgroundSize: cover`, `backgroundPosition: center 20%`, `opacity: 0.18`
- Gradient overlay div: `absolute inset-0 z-0`, `background: linear-gradient(to top, ...C.heroBg gradient)`
- Shield watermark div: `ref={watermarkRef}`, `absolute inset-0 z-0 flex items-center pointer-events-none opacity-0`, `justifyContent: flex-end`, `paddingRight: 8%` — contains `<img src="/shield-white.png">` at `height: 45vh`
- Particle field div: `absolute inset-0 pointer-events-none z-0`, CSS radial-gradient dots (5 layers), static — NO animation
- Content wrapper: `relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto`
- Eyebrow: `ref={eyebrowRef}`, Tailwind `text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-8 opacity-0`, inline `color: C.gold`
- Headline `<h1>`: `ref={headlineRef}`, `font-brand text-4xl md:text-8xl uppercase tracking-[0.1em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0`
- Subline `<p>`: `ref={sublineRef}`, `text-base md:text-xl leading-relaxed max-w-2xl opacity-0`, inline Cormorant Garamond italic, `color: ${C.ivory}88`
- Chevron: `ref={chevronRef}`, `absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0` — contains a `w-[1px] h-8` gold gradient line + `<ChevronDown>` icon

**GSAP already present:**
- `gsap.context()` with `return () => ctx.revert()` — cleanup is present ✓
- `gsap.set()` — sets opacity 0 / y 20 on eyebrow, headline, subline, chevron; opacity 0 on watermark
- Entrance timeline (`tl`): watermark → opacity 0.10 (2.0s), eyebrow → opacity 1 y 0 (0.8s), headline → opacity 1 y 0 (0.9s), subline → opacity 0.55 y 0 (0.8s), chevron → opacity 0.6 y 0 (0.7s). Ease: `power3.out`.
- Chevron pulse loop: `y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: sine.inOut, delay: 2.5`
- Watermark parallax ScrollTrigger: `yPercent: -15`, scrub true, start `top top`, end `bottom top`

**Responsive styles (Tailwind):**
- Eyebrow: `text-[10px] md:text-[11px]`
- Headline: `text-4xl md:text-8xl`, tracking changes at md
- Subline: `text-base md:text-xl`
- No mobile-specific overrides for shield watermark (always visible)

### MISSING (per spec and Session 6 agent plan)

1. **Particle field animation** — CSS static dots are present but have no GSAP slow downward drift animation (spec requires "slow downward drift")
2. **Headline scale animation** — spec requires `scale 0.97 → 1.0` on load (not just opacity/y); current entrance uses only opacity + y
3. **Scroll indicator** — spec says "bottom of hero: single downward chevron or thin gold line, animated to pulse gently" — chevron pulse exists but the gold line above it does not pulse (only static gradient line); spec implies a more explicit pulse animation (opacity 0.4→1.0, 1.4s, sine.inOut, infinite yoyo — per agent 1-A brief)
4. **Hero exit parallax** — spec mentions hero image should have parallax on scroll past; the watermark has parallax but the background hero image itself does not
5. **`prefers-reduced-motion` guard** — no reduced-motion check wrapping any GSAP code anywhere in `HeroSection`
6. **Mobile: shield watermark** — no breakpoint logic to hide or scale it at ≤768px; always renders at 45vh

---

## Section B — What Is the Armor of God? (`ArmorIntroSection`, lines 1383–1471)

### EXISTING

**JSX structure:**
- `<section ref={sectionRef}>`, Tailwind `py-24 md:py-40 px-4`, inline `backgroundColor: C.heroBg`
- Inner `div.max-w-[740px].mx-auto` — centered reading column (matches spec `--cf-width-reading: 740px`)
- Eyebrow: `armor-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8`, inline `color: C.gold` — text: "Ephesians 6:10–18"
- Scripture `<blockquote>`: class `armor-reveal mb-12`, inline Cormorant Garamond italic `clamp(16px, 2vw, 22px)`, lineHeight 1.85, color `${C.ivory}cc`
- Gold horizontal rule: `armor-reveal h-[1px] mb-12`, inline `background: linear-gradient(to right, transparent, ${C.gold}55, transparent)`
- Pull quote `<p>`: `armor-reveal mb-12`, Cormorant Garamond `clamp(20px, 2.8vw, 30px)`, color `${C.ivory}bb`
- Three teaching paragraphs: `armor-reveal text-sm md:text-base leading-relaxed font-light`, color `${C.ivory}99`
- Faded helmet watermark at bottom: `<img src="/helmet.png">`, opacity 0.06

**GSAP already present:**
- `gsap.context()` with `return () => ctx.revert()` ✓
- `gsap.utils.toArray(".armor-reveal")` forEach: `gsap.from(el, { opacity: 0, y: 30, duration: 0.9, ease: power2.out, scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" } })`
- All `.armor-reveal` elements animate uniformly — NO individual stagger delays between eyebrow, scripture, rule, and paragraphs

**Responsive styles:**
- Reading column: `max-w-[740px] mx-auto` — works on mobile (auto shrinks with padding)
- Section padding: `py-24 md:py-40 px-4` — only 4px (16px) horizontal padding on mobile — BELOW the 20px spec minimum
- Scripture font: `clamp(16px, 2vw, 22px)` — fluid

### MISSING

1. **Staggered sequential timing** — spec says eyebrow fade-up first, then scripture block +200ms stagger, then teaching paragraphs at 150ms intervals, gold rule width 0%→100%; current code fires all `.armor-reveal` elements with identical animation settings simultaneously via forEach
2. **Gold rule animation** — spec requires `width: 0% → 100%` animated at 0.8s power2.out; current rule only fades in (opacity/y) — no width animation
3. **Section padding** — `px-4` = 16px; spec requires min 20px side padding on mobile
4. **`prefers-reduced-motion` guard** — absent

---

## Section C — This Is God's Armor (`GodsArmorSection`, lines 1473–1545)

### EXISTING

**JSX structure:**
- `<section ref={sectionRef}>`, Tailwind `py-24 md:py-40 px-4`, inline `background: linear-gradient(to bottom, ${C.heroBg}, ${C.ruleBg})`
- Inner `div.max-w-[1100px].mx-auto`
- Two-column grid: `grid md:grid-cols-2 gap-16 md:gap-24 items-start`
- Left column: eyebrow "The Revelation" (godsarmor-reveal), two teaching paragraphs (godsarmor-reveal), brand line "You are not inventing identity. You are receiving it." in Michroma `text-lg md:text-2xl tracking-[0.12em] uppercase`, color `C.gold`
- Right column: `div.godsarmor-reveal`, `border-l-2 pl-8`, Isaiah 59:17 citation label, scripture text `clamp(22px, 3.5vw, 48px)` Cormorant Garamond italic

**GSAP already present:**
- `gsap.context()` with `return () => ctx.revert()` ✓
- `gsap.utils.toArray(".godsarmor-reveal")` forEach: same pattern as Section B — uniform `{ opacity: 0, y: 30, duration: 0.9, ease: power2.out, scrollTrigger: { start: "top 88%", toggleActions: "play none none reverse" } }`
- No 300ms offset between columns

**Responsive styles:**
- `grid md:grid-cols-2` — stacks to single column below `md:` (768px) ✓ (matches spec)
- Inline gradient on the section is a CSS background — not animated; spec requires this to be a scroll-driven transition over 200vh

### MISSING

1. **Two-column stagger offset** — spec requires left column first, right column +300ms; all godsarmor-reveal elements fire simultaneously
2. **Brand line gold glow** — spec requires `text-shadow rgba(201,168,76,0.4) → 0` over 2s (glow dissipation); no text-shadow animation present
3. **Background gradient scroll drive** — spec says background warms from Hero Black to Rule Brown over 200vh scroll distance; current gradient is static CSS `linear-gradient(to bottom, ...)` applied once — not driven by scroll position
4. **`prefers-reduced-motion` guard** — absent

---

## Section D — The Six Pieces (`SixPiecesSection`, lines 1547–1705)

### EXISTING

**JSX structure:**
- `<section ref={sectionRef}>`, Tailwind `py-24 md:py-40 px-4`, inline `backgroundColor: C.ruleBg`
- Inner `div.max-w-[1100px].mx-auto`
- Section header: eyebrow "The Six Pieces", h2 "The Armor of God"
- `div.space-y-28.md:space-y-44` containing `ARMOR_PIECES.map((piece, i) => ...)`
- Each piece `<div>`: `piece-block relative grid md:grid-cols-2 gap-12 md:gap-20 items-start`, alternate direction: `i % 2 === 1 ? "md:[direction:rtl]" : ""`
- Background numeral: `absolute inset-0`, Michroma `clamp(140px, 20vw, 260px)`, opacity `${C.ivory}07`
- Left content col:
  - Piece number + gold line: `flex items-baseline gap-4 mb-6`
  - Title `<h3>`: `font-brand text-2xl md:text-4xl uppercase tracking-[0.1em]`
  - Scripture ref: `text-[10px] tracking-[0.35em] uppercase mb-8`, `<ScriptureRef>` component
  - Theology/tension/practice labels + text in `space-y-6`
  - Hook blockquote: `mt-8 pl-4 border-l`, Cormorant Garamond italic 16px
  - "Explore this piece →" `<Link>`: `text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2`, color `C.gold`, opacity 0.8
  - Product label (if present)
- Right visual col (desktop only, `hidden md:flex`): placeholder card with numeral in gold at 12% opacity, product label at bottom

**NO widget components rendered in SixPiecesSection.** Widgets are only in `ArmorPiecePage`.

**GSAP already present:**
- `gsap.context()` with `return () => ctx.revert()` ✓
- `gsap.utils.toArray(".piece-block")` forEach: `gsap.from(el, { opacity: 0, y: 40, duration: 1.0, ease: power2.out, scrollTrigger: { start: "top 85%", toggleActions: "play none none reverse" } })`
- Entire piece block fades as a unit — NO per-element stagger within each block

**Responsive styles:**
- `md:grid-cols-2` — stacks at 768px ✓
- Background numeral: always rendered (no mobile hide)
- Right column: `hidden md:flex` — correctly hidden on mobile ✓
- `space-y-28 md:space-y-44` — 112px / 176px vertical gap

### MISSING

1. **Alternating translateX entrance** — spec requires odd pieces translate from `-30px`, even from `+30px` (lateral slide); current code only does y:40 for all
2. **Per-element stagger within each piece block** — spec: content appears first, "Explore this piece →" fades in +300ms after content; currently entire block animates as one
3. **Gold eyebrow shimmer** — spec requires single left-to-right gradient sweep on each piece's gold eyebrow element; no shimmer animation present
4. **Background numeral on mobile** — no CSS to reduce opacity or hide the `clamp(140px...)` numeral on small screens; could overwhelm layout at 375px
5. **`prefers-reduced-motion` guard** — absent
6. **Cross-links to individual piece pages** — "Explore this piece →" links are wired (`/identity/${piece.slug}`); this is correct ✓. No `/identity/[piece]` pages link back to the landing — but that is handled by `BackNav` in `ArmorPiecePage` ✓

---

## Section E — Brand Integration (`BrandSection`, lines 1707–1754)

### EXISTING

**JSX structure:**
- `<section ref={sectionRef}>`, Tailwind `py-24 md:py-40 px-4`, inline `backgroundColor: C.ruleBg`
- Inner `div.max-w-[740px].mx-auto` — centered reading column ✓
- Eyebrow: `brand-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8`, "Why the Armor"
- Three teaching paragraphs: `brand-reveal text-sm md:text-base leading-relaxed font-light`, color `${C.ivory}77`
- Closing line: `brand-reveal mt-16` wrapper, inner `<p>` `text-lg md:text-2xl tracking-[0.14em] uppercase font-bold`, Michroma, gold — "The gear is not the mission. It's a marker of it."

**GSAP already present:**
- `gsap.context()` with `return () => ctx.revert()` ✓
- `gsap.utils.toArray(".brand-reveal")` forEach: same pattern — `{ opacity: 0, y: 24, duration: 0.9, ease: power2.out, scrollTrigger: { start: "top 88%" ... } }`

### MISSING

1. **Brand line gold glow** — same as Section C: spec requires text-shadow gold glow dissipation on the Michroma closing line; absent
2. **Sequential stagger** — all brand-reveal elements fire simultaneously; spec implies prose first then closing line
3. **`prefers-reduced-motion` guard** — absent

---

## Section F — Collection Drop (`CollectionSection`, lines 1756–1866)

### EXISTING

**JSX structure:**
- `<section ref={sectionRef}>`, Tailwind `py-24 md:py-40 px-4`, inline `background: linear-gradient(to bottom, ${C.ruleBg}, #1A1510)`
- Gradient does NOT bridge to `#F5F2EC` (spec requires bridge from dark to Gear Warm `#F5F2EC`)
- Section header: eyebrow "Drop 002 · The Armor of God", h2 "The Collection", descriptive text
- Product grid: `div.grid.md:grid-cols-3.gap-6`
- Each card (`DROP_PRODUCTS.map`): `<Link>` with class `drop-card group relative rounded-2xl overflow-hidden flex flex-col`, inline `background: ${C.ivory}05`, `border: 1px solid ${C.ivory}${p.available ? "0F" : "07"}`, `minHeight: 320px`
- Card hover: controlled by Tailwind `group` + `transition-all duration-500` (CSS transition only, no GSAP hover)
- Available cards show: num, Drop 002 badge, piece name, product type, hook quote in Cormorant italic

**GSAP already present:**
- `gsap.context()` with `return () => ctx.revert()` ✓
- `gsap.utils.toArray(".drop-card")` forEach: `{ opacity: 0, y: 30, duration: 0.85, ease: power2.out, scrollTrigger: { start: "top 88%", toggleActions: "play none none reverse" } }`
- No stagger delay between cards; no hover GSAP

**Responsive styles:**
- `grid md:grid-cols-3 gap-6` — collapses to 1-column below 768px ✓
- No explicit 2-column at tablet (768px+) per spec — stays 3-col at md, 1-col below

### MISSING

1. **Background gradient to `#F5F2EC`** — spec: "Warm background shift (gradient bridge from dark to #F5F2EC)"; current gradient ends at `#1A1510` (still dark), not warm Gear Warm
2. **Card stagger delay** — spec: 150ms stagger between cards; current forEach fires simultaneously
3. **Card hover lift** — spec: `translateY -4px`, box-shadow, 300ms; current: only CSS Tailwind `transition-all duration-500` with no transform/shadow effect (Tailwind `group` class present but no `group-hover:` transforms defined)
4. **Two-column tablet breakpoint** — spec says product cards should be 2-column at tablet (768px+), 3-col at desktop; current is 3-col at md (768px+)
5. **`prefers-reduced-motion` guard** — absent
6. **Each card links to `/identity/[slug]`** — already correctly wired with `<Link to={/identity/${p.slug}}>` ✓

---

## Section G — CTA (`CTASection`, lines 1868–1929)

### EXISTING

**JSX structure:**
- `<section>` (no ref, no GSAP), Tailwind `py-24 md:py-48 px-4 text-center`, inline `backgroundColor: C.heroBg`
- Button group: `flex flex-col items-center gap-4 mb-20`
- Primary CTA: `<Link to="/identity/belt-of-truth">`, class `inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:scale-105`, inline `backgroundColor: C.gold`, text "Begin Formation"
- Secondary CTA: `<a href={SHOPIFY_URL}>`, class `inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:bg-white/5`, inline `border: 1px solid ${C.gold}44`, text "Explore the Collection"
- Closing scripture: `text-base md:text-xl`, Cormorant Garamond italic, color `${C.ivory}55`, Ephesians 6:10–11
- Brand footer: helmet mark 44px, "Discipline · Presence · Formation"

**GSAP:** None. CTASection has no `useRef`, no `useEffect`, no gsap code.

**Responsive styles:**
- Buttons: `px-10 py-4` on both breakpoints — no full-width on mobile, no min 48px height guarantee

### MISSING

1. **GSAP entrance animations** — spec: button stagger fade-up, scripture fade-in last; no animations at all in CTASection
2. **No `useRef`/`useEffect`/`gsap.context()`** present — entire section needs animation infrastructure added
3. **Mobile button sizing** — spec: full-width on mobile, min 48px height; current buttons are `inline-flex` (shrink to content), no `w-full sm:w-auto` or `min-h-[48px]`
4. **Tertiary cross-link** — Session 6 agent 2-C spec: add "New to Counter Formation? Start with the 7-Day Challenge →" linking to `/7-day-challenge`; absent
5. **"Armor Up." campaign mark** — spec-visual-identity.md: "Placement: landing page CTA area"; not present in CTASection

---

## Widget Integration (ArmorPiecePage — `/identity/[piece]`)

The six widgets are rendered exclusively within `ArmorPiecePage` (lines 2091–2276), not on the landing page.

**Widget component map (lines 2035–2041):**
```javascript
const WIDGET_COMPONENTS = {
  "belt-of-truth":               ExamenWidget,
  "breastplate-of-righteousness": DeclarationWidget,
  "gospel-of-peace":             PeacePauseWidget,
  "shield-of-faith":             ArrowLogWidget,
  "helmet-of-salvation":         FirstFifteenWidget,
  "sword-of-the-spirit":         VerseTrackerWidget,
};
```

**Widget render location (lines 2222–2228):**
```jsx
<div className="ap-sidebar">
  <div>
    <p style={{ /* "Formation Tool" label */ }}>Formation Tool</p>
    {React.createElement(WIDGET_COMPONENTS[piece])}
  </div>
  <CrossLinkCard piece={piece} />
  <div>/* The Six Pieces nav list */</div>
</div>
```

**Sidebar ref structure:**
- `div.ap-sidebar` — no `useRef` on the sidebar div itself
- Widget receives no refs from the parent; internal refs are managed within each widget
- Sticky behavior is pure CSS: `.ap-sidebar` at desktop gets `position: sticky; top: 56px; align-self: start;` (line 1215 in ArmorStyles)
- No GSAP animation on sidebar or widget fade-in (spec requires `once: true` fade-in on first visibility)

**Widget cross-link data (lines 2046–2051):**
```javascript
const CROSS_LINKS = {
  "belt-of-truth":       { to: "/rule-of-life/presence",  rhythm: "PRESENCE",  tagline: "Attention before God" },
  "gospel-of-peace":     { to: "/rule-of-life/sabbath",   rhythm: "SABBATH",   tagline: "Rest before production" },
  "shield-of-faith":     { to: "/rule-of-life/community", rhythm: "COMMUNITY", tagline: "Formation together" },
  "helmet-of-salvation": { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
  "sword-of-the-spirit": { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
};
```
Note: `breastplate-of-righteousness` is intentionally absent from `CROSS_LINKS` (no cross-link per spec ✓).

**CrossLinkCard (`CrossLinkCard` component, lines 2054–2089):**
- Renders a `<Link>` card with "Connected Rhythm" label, rhythm name in Barlow Condensed gold, tagline in Cormorant italic
- Already implemented; card hovers via `onMouseEnter/onMouseLeave` inline style manipulation

**Missing widget integrations:**
1. **Sidebar widget entrance animation** — no `gsap.from()` on first visibility with `once: true`; widget just mounts without animation
2. **`breastplate-of-righteousness` cross-link** — correctly absent per spec (no Rule of Life rhythm assigned)

---

## CSS Class Inventory — Elements Receiving New Animations

These are the selectors/classes animation agents must target:

### Landing Page (IdentityLanding / landing section functions)

| Class / Selector | Element | Current animation | Needed animation |
|---|---|---|---
| `ref={eyebrowRef}` | Hero eyebrow | opacity 0→1, y 20→0 | Add scale 0.97→1.0 (headline only); eyebrow timing OK |
| `ref={headlineRef}` | Hero h1 | opacity 0→1, y 20→0 | Add scale 0.97→1.0, delay after eyebrow |
| `ref={sublineRef}` | Hero subline | opacity 0→0.55, y 20→0 | +400ms after headline |
| `ref={chevronRef}` | Hero chevron | opacity 0→0.6, y 20→0 + yoyo pulse | Add explicit opacity 0.4→1.0 pulse (separate from position yoyo) |
| `ref={watermarkRef}` | Shield watermark | opacity 0→0.10, yPercent parallax | Add mobile hide (≤768px) |
| CSS radial-gradient particle div | Particle field | Static (no animation) | Add GSAP slow downward drift |
| `.armor-reveal` | Section B elements | All fire simultaneously | Add sequential stagger: eyebrow, scripture +200ms, rule width anim, paragraphs +150ms each |
| `.godsarmor-reveal` | Section C elements | All fire simultaneously | Left column first, right column +300ms |
| `p[style*="Michroma"]` in GodsArmorSection | "You are not inventing…" brand line | None (part of godsarmor-reveal) | Add text-shadow gold glow dissipation |
| Section C background | section[style*="linear-gradient"] | Static CSS gradient | Drive scroll-based gradient transition over 200vh |
| `.piece-block` | Section D armor pieces | opacity 0→1, y 40→0 as unit | Add alternating translateX (-30px odd / +30px even), per-element stagger, "Explore" link +300ms |
| Gold eyebrow in each `.piece-block` | `span[style*="${C.gold}77"]` inside piece | Part of piece-block | Add shimmer sweep animation |
| `.brand-reveal` | Section E elements | All fire simultaneously | Add sequential stagger, Michroma line last |
| `p[style*="Michroma"]` in BrandSection | "The gear is not the mission…" | Part of brand-reveal | Add text-shadow gold glow (same as Section C) |
| `.drop-card` | Section F product cards | All fire simultaneously | Add 150ms stagger, GSAP hover lift (translateY -4px + box-shadow) |
| Section F background | section gradient | linear-gradient to #1A1510 | Change to bridge to #F5F2EC |
| CTASection `<section>` | Section G | No animations | Add useRef + gsap.context, button fade-up stagger, scripture last |
| `inline-flex` primary/secondary buttons | CTA buttons | CSS hover:scale-105 only | Add stagger fade-up entrance, full-width on mobile |

### ArmorPiecePage

| Class / Selector | Element | Current animation | Needed animation |
|---|---|---|---|
| `.ap-hero-bg` | Piece page hero image | None | Ken Burns settle: scale 1.02→1.0, 1.5s |
| `.ap-hero-eye` | Gold eyebrow on piece page | None | Fade-up on page load, stagger |
| `.ap-hero-h1` | Piece title h1 | None | Fade-up +stagger after eyebrow |
| `.ap-hero-sub` | Track title subtitle | None | Fade-up after title |
| Day content sections | `.ap-stillness`, `.ap-scriptures`, `.ap-teaching`, etc. | None | Fade-up on scroll |
| `.ap-section-label` / `.ap-sec-label` | "STILLNESS", "SCRIPTURE" etc. | None | Individual fade-up as section scrolls |
| `.ap-scripture` | Scripture blocks | None | +200ms delay after section label |
| `.ap-sidebar` | Widget sidebar | None (CSS sticky only) | Widget fade-in on first visibility, once: true |
| `.ap-piece-nav` | Prev/next bottom nav | None | Fade-up on scroll to bottom |

---

## GSAP Context Cleanup — Current Status

| Function | gsap.context() present | ctx.revert() cleanup returned |
|---|---|---|
| `HeroSection` | ✓ (line 1255) | ✓ (line 1283) |
| `ArmorIntroSection` | ✓ (line 1387) | ✓ (line 1396) |
| `GodsArmorSection` | ✓ (line 1477) | ✓ (line 1486) |
| `SixPiecesSection` | ✓ (line 1551) | ✓ (line 1560) |
| `BrandSection` | ✓ (line 1711) | ✓ (line 1720) |
| `CollectionSection` | ✓ (line 1760) | ✓ (line 1769) |
| `CTASection` | ✗ ABSENT | ✗ ABSENT |
| `ArmorPiecePage` | ✗ ABSENT (only a scroll progress listener) | ✗ ABSENT |

**Key finding:** `CTASection` has zero GSAP infrastructure. `ArmorPiecePage` has no GSAP at all — all piece page animations (Ken Burns, fade-ups, sidebar entrance) need to be added from scratch.

---

## Additional Structural Notes

### `IdentityLanding` composition (lines 1989–2013)
```jsx
export function IdentityLanding() {
  // scroll restoration useEffect only
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <SiteNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <SixPiecesSection />
      <BrandSection />
      <CollectionSection />
      <CTASection />
    </div>
  );
}
```
No GSAP context at the `IdentityLanding` level — all context is per-section. This is the correct pattern, matching how other pages handle animations.

### `ArmorPiecePage` GSAP surface
- Three `useEffect` hooks: navigation redirect, scroll-to-top on piece change, scroll progress bar listener
- No animation useEffects — blank slate for all piece page animations

### `ScrollTrigger` registration
- `gsap` and `ScrollTrigger` are imported at the top of `Identity.jsx` (line 4)
- `gsap.registerPlugin(ScrollTrigger)` is NOT in this file — assumed to be registered globally in `App.jsx`
- Animation agents should verify registration before adding ScrollTrigger calls

### `prefers-reduced-motion`
- Not checked anywhere in `Identity.jsx`
- Session 6 spec requires wrapping all GSAP in a `prefers-reduced-motion` check
- No helper utility exists in the file for this — agents will need to add it

---

## Biggest Gap Summary

**The ArmorPiecePage (`/identity/[piece]`) has zero GSAP animations** — no hero Ken Burns, no fade-ups, no sidebar widget entrance, no piece navigation entrance. All six piece detail pages are a complete animation blank slate, requiring the most net-new code of any single target in Session 6.
