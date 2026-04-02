# Animation Reference — Counter Formation Web
**Extracted by Agent 0-A | Session 6 | 2026-04-02**

Source files audited: `src/App.jsx`, `src/RuleOfLife.jsx`, `src/SevenDayChallenge.jsx`

---

## 1. Timeline Patterns

### 1-A. CinematicHero entrance sequence (App.jsx)

The master timeline for the home hero. Defaults ease is set once on the timeline object; all child tweens inherit it.

```js
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.to(bgGlowRef.current,  { opacity: 1, duration: 1.4 })
  .to(vBeamRef.current,   { opacity: 0.82, height: "84vh", duration: 1.6 }, "-=0.6")
  .to(hBeamRef.current,   { opacity: 0.52, width: "28vw",  duration: 1.1 }, "-=0.6")
  .to(bloomRef.current,   { opacity: 0.7,  scale: 1,       duration: 1.6 }, "-=0.8")
  .to(particlesRef.current, { opacity: 0.55, duration: 1.2 }, "-=0.9")
  .to(logoGroupRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 }, "-=0.7")
  .to(headingRef.current,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 }, "-=0.5")
  .to(sublineRef.current,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, "-=0.55")
  .to(microcopyRef.current, { opacity: 0.8, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.45")
  .to(pathCard1Ref.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.4")
  .to(pathCard2Ref.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.7")
  .to(scriptureRef.current, { opacity: 0.25, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.35")
  .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.7 }, "-=0.3")
  // Fade light elements out after 2.5s hold
  .to([vBeamRef.current, hBeamRef.current, bloomRef.current],
    { opacity: 0, duration: 2.5, ease: "power2.inOut" }, "+=2.5");
```

Key observations:
- `defaults: { ease: "power3.out" }` — inherited by all `.to()` calls unless overridden.
- Overlap shorthand `"-=0.6"` etc. chains steps with a running overlap (not absolute labels).
- The final fade-out uses a **position offset** `"+=2.5"` (absolute wait after last step) and overrides ease to `"power2.inOut"`.
- Mobile breakpoint embedded inline: `window.innerWidth < 768 ? "52vh" : "84vh"`.

---

## 2. ScrollTrigger Patterns

### 2-A. AnimatedCounter — ScrollTrigger.create with `once: true` (App.jsx)

```js
ScrollTrigger.create({
  trigger: el,
  start: "top 90%",
  once: true,
  onEnter: () => {
    triggered.current = true;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,          // default 2
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
      },
    });
  },
});
```

Pattern: proxy object `{ val: 0 }` animated to `target`; `onUpdate` writes formatted text to the DOM. `once: true` prevents re-triggering.

---

### 2-B. pillar-reveal — inline ScrollTrigger inside `gsap.utils.toArray` (App.jsx)

```js
gsap.utils.toArray(".pillar-reveal").forEach(el => {
  gsap.from(el, {
    y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });
});
```

`toggleActions: "play none none reverse"` — plays forward on enter, reverses on leave-back.

---

### 2-C. ScrollTrigger.batch — multi-element staggered reveal (App.jsx)

```js
const batchReveal = (sel, y = 20, stagger = 0.09) => {
  ScrollTrigger.batch(sel, {
    start: "top 92%",
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y },
      { opacity: 1, y: 0, duration: 0.75, stagger, ease: "power2.out", overwrite: "auto" }),
  });
};

// Call sites:
batchReveal(".manifesto-item",  20, 0.07);
batchReveal(".product-card",    24, 0.12);
batchReveal(".footer-reveal",   16, 0.15);
batchReveal(".bridge-reveal",   30);          // stagger defaults to 0.09
batchReveal(".journal-card",    20);
```

`overwrite: "auto"` prevents mid-scroll conflicts. No `onLeave` / `once` — batch re-triggers on re-enter.

---

### 2-D. Section background parallax — scrub: true (App.jsx)

```js
document.querySelectorAll(".section-bg-parallax").forEach(el => {
  gsap.to(el, {
    yPercent: -8,
    ease: "none",
    scrollTrigger: {
      trigger: el.parentElement,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
});
```

`scrub: true` (not a number) — perfectly synced, no smoothing lag. `ease: "none"` on the tween ensures linear parallax.

---

### 2-E. Mobile-only grayscale reveal — gsap.matchMedia (App.jsx)

```js
gsap.matchMedia().add("(max-width: 767px)", () => {
  gsap.utils.toArray(".pillar-img").forEach(img => {
    gsap.set(img, { filter: "grayscale(1)", opacity: 0.5 });
    gsap.to(img, {
      filter: "grayscale(0)", opacity: 1, duration: 1.2, ease: "power2.out",
      scrollTrigger: { trigger: img, start: "top 80%" },
    });
  });
  gsap.utils.toArray(".rhythm-img-wrap").forEach(wrap => {
    gsap.set(wrap, { filter: "grayscale(1)" });
    gsap.to(wrap, {
      filter: "grayscale(0)", opacity: 0.6, duration: 1.2, ease: "power2.out",
      scrollTrigger: { trigger: wrap, start: "top 80%" },
    });
  });
});
```

`gsap.matchMedia()` scopes animations to a CSS media query; GSAP cleans them up automatically when the breakpoint no longer matches.

---

## 3. Stagger Patterns

### 3-A. Numeric stagger inside ScrollTrigger.batch

```js
// Manifesto items — tight 0.07s stagger
batchReveal(".manifesto-item", 20, 0.07);

// Product cards — medium 0.12s stagger
batchReveal(".product-card",   24, 0.12);

// Footer sections — loose 0.15s stagger
batchReveal(".footer-reveal",  16, 0.15);

// Section bridges and journal cards — default 0.09s
batchReveal(".bridge-reveal", 30);
batchReveal(".journal-card",  20);
```

All staggers are simple numeric values (seconds). No object-form staggers (`{ from, each, grid }`) are used in this codebase.

---

## 4. Cleanup Patterns

### 4-A. gsap.context + ctx.revert() (App.jsx — used in two components)

**CinematicHero:**
```js
useEffect(() => {
  const ctx = gsap.context(() => {
    // all gsap.set / gsap.timeline / gsap.to calls here
    // ...
    // Event listener cleanup returned from INSIDE context:
    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, heroRef);   // <-- scoped to heroRef DOM element
  return () => ctx.revert();
}, []);
```

**MainSite:**
```js
useEffect(() => {
  const ctx = gsap.context(() => {
    // nav-fade, pillar-reveal, batchReveal calls, parallax, matchMedia
  }, mainRef);
  return () => ctx.revert();
}, []);
```

Pattern summary:
- `gsap.context(fn, scopeRef)` — scopes all tweens/ScrollTriggers to a root DOM element.
- Returning a cleanup function from inside the context factory handles non-GSAP event listeners.
- `ctx.revert()` in the React cleanup tears down all tweens and ScrollTriggers registered inside the context.

---

## 5. Ambient / Looping Animation Patterns

### 5-A. Hero element float — repeat: -1, yoyo (App.jsx)

```js
// Background glow drifts in a slow figure
gsap.to(bgGlowRef.current, {
  x: 12, y: -10,
  duration: 9,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 4.5,
});

// Particle field breathes vertically
gsap.to(particlesRef.current, {
  y: -14,
  duration: 11,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 4.5,
});

// Scroll indicator bounces
gsap.to(scrollIndicatorRef.current, {
  y: 8,
  duration: 1.4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 5.2,
});
```

All three start after the entrance sequence resolves (4.5–5.2s delay). `yoyo: true` ping-pongs without needing a second tween.

---

### 5-B. Mouse-parallax on hero elements (App.jsx)

Not a looping animation, but an ambient interactive layer. Fires on every `mousemove` event. Each element has a different parallax depth and duration.

```js
const onMouseMove = (e) => {
  const rect = hero.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 → 0.5
  const y = (e.clientY - rect.top)  / rect.height - 0.5;
  const d = { overwrite: "auto", ease: "power3.out" };

  gsap.to(bgGlowRef.current,    { x: x * 16, y: y * 14, duration: 1.8, ...d });
  gsap.to(bloomRef.current,     { x: x * 10, y: y * 10, duration: 1.5, ...d });
  gsap.to(vBeamRef.current,     { x: x * 4,             duration: 1.4, ...d });
  gsap.to(hBeamRef.current,     { y: y * 4,             duration: 1.4, ...d });
  gsap.to(particlesRef.current, { x: x * 8, y: y * 6,  duration: 2.2, ...d });
  gsap.to(logoGroupRef.current, { x: x * 5, y: y * 4,  duration: 1.3, ...d });
};
```

`overwrite: "auto"` kills only conflicting properties on in-flight tweens, preventing jitter.

---

### 5-C. CSS keyframe ambient animations (App.jsx + SevenDayChallenge.jsx)

**DroppingSoon cards — breathe (App.jsx inline style):**
```js
style={{ animation: "breathe 4s ease-in-out infinite" }}
// Note: @keyframes breathe is defined elsewhere in the global CSS (not in these source files)
```

**FloatingChallengeTrigger — fadeUp (App.jsx inline style):**
```js
style={{ animation: "fadeUp 0.4s ease forwards" }}
// One-shot entrance; not looping. @keyframes defined in global CSS.
```

**SevenDayChallenge — scroll indicator bob:**
```css
@keyframes cf7sb {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(5px); }
}
.cf7-scroll-hint svg { animation: cf7sb 1.6s ease-in-out infinite; }
```

**SevenDayChallenge — particle drift:**
```css
@keyframes cf7pdrift {
  0%   { opacity: 0; transform: translateY(0); }
  15%  { opacity: 0.8; }
  85%  { opacity: 0.4; }
  100% { opacity: 0; transform: translateY(-60px); }
}
.cf7-particle { animation: cf7pdrift linear infinite; opacity: 0; }
```
Particle sizes, horizontal positions, durations (10–22s), and delays (0–14s) are randomised at mount:
```js
const s = Math.random() * 1.6 + 0.4;  // 0.4px – 2px dot
p.style.cssText = `
  width:${s}px; height:${s}px;
  left:${Math.random() * 100}%;
  bottom:${Math.random() * 45}%;
  animation-duration:${10 + Math.random() * 12}s;
  animation-delay:${Math.random() * 14}s;
`;
```

---

## 6. Particle Field Pattern (CinematicHero — App.jsx)

The CinematicHero particle field is **pure CSS**, not canvas or JS-driven particles. It uses a single `<div>` with multiple `radial-gradient` backgrounds tiled at different background-sizes to simulate sparse star-like dots. GSAP only moves the whole layer as a unit.

```jsx
<div ref={particlesRef}
  className="absolute inset-0 pointer-events-none opacity-0"
  style={{
    backgroundImage: `
      radial-gradient(circle at 28% 38%, rgba(255,255,255,0.16) 0.7px, transparent 1px),
      radial-gradient(circle at 62% 54%, rgba(255,255,255,0.11) 0.8px, transparent 1.2px),
      radial-gradient(circle at 44% 68%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px),
      radial-gradient(circle at 54% 28%, rgba(255,255,255,0.11) 0.7px, transparent 1px),
      radial-gradient(circle at 72% 44%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px),
      radial-gradient(circle at 18% 60%, rgba(255,255,255,0.07) 0.8px, transparent 1.2px),
      radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08) 0.7px, transparent 1px)
    `,
    backgroundSize:
      "320px 320px, 420px 420px, 360px 360px, 500px 500px, 380px 380px, 440px 440px, 350px 350px",
    filter: "blur(0.2px)",
  }}
/>
```

Technique breakdown:
- 7 layered radial gradients, each producing one tiny hard-stop dot (0.7–0.8px radius) against transparent.
- Different `backgroundSize` per layer tiles the pattern at varying densities.
- `filter: blur(0.2px)` softens the hard pixel edges without blurring much.
- GSAP animates the whole element: opacity fade-in during entrance; `y: -14` yoyo float; mouse-parallax `x * 8, y * 6`.

The SevenDayChallenge hero uses the **DOM particle** approach instead — individual `<div>` elements appended to `#cf7-particles` with randomized CSS animation durations/delays (see Section 5-C above).

---

## 7. Gear Tab Transition Pattern (App.jsx)

```js
const switchTab = (key) => {
  if (key === active) return;
  gsap.to(panelRef.current, {
    opacity: 0, y: 8, duration: 0.22, ease: "power2.in",
    onComplete: () => {
      setActive(key);                     // update React state mid-tween
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" });
    },
  });
};
```

Pattern: out-ease `power2.in`, in-ease `power2.out`. State change happens inside `onComplete` so React re-render is triggered after the element is invisible.

---

## 8. IntersectionObserver Usage

### 8-A. QRAnimation — trigger on viewport entry (App.jsx)

```js
useEffect(() => {
  const el = stageRef.current;
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      obs.disconnect();    // one-shot
      runAnim();
    }
  }, { threshold: 0.4 });
  obs.observe(el);
  return () => obs.disconnect();
}, []);
```

`runAnim` is a sequential async function using `await w(ms)` (Promise-wrapped setTimeout) to step through CSS class additions — not GSAP.

---

### 8-B. Mobile carousel active-slide tracker (App.jsx — RuleOfLifeSection)

```js
useEffect(() => {
  if (window.innerWidth >= 768) return;   // mobile only
  const cards = carouselRef.current?.children;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          if (idx >= 0) setActiveRhythm(idx);
        }
      });
    },
    { root: carouselRef.current, threshold: 0.6 }
  );
  Array.from(cards).forEach(card => observer.observe(card));
  return () => observer.disconnect();
}, []);
```

Used to drive `<CarouselDots>` active index. `root: carouselRef.current` constrains observation to the carousel scroll container.

---

## 9. gsap.set Patterns (initial state setup)

All `gsap.set` calls in CinematicHero run synchronously before the timeline starts, establishing the hidden starting state:

```js
// Batch-set multiple elements to opacity 0
gsap.set([bgGlowRef.current, vBeamRef.current, hBeamRef.current,
  bloomRef.current, logoGroupRef.current, headingRef.current,
  sublineRef.current, microcopyRef.current, pathCard1Ref.current,
  pathCard2Ref.current, scriptureRef.current, scrollIndicatorRef.current],
  { opacity: 0 });

// Dimensional resets
gsap.set(vBeamRef.current,     { height: "0vh", xPercent: -50 });
gsap.set(hBeamRef.current,     { width: "0vw",  xPercent: -50 });
gsap.set(bloomRef.current,     { scale: 0.7 });

// Blur + offset for staggered text reveal
gsap.set(logoGroupRef.current, { y: 18, filter: "blur(10px)" });
gsap.set(headingRef.current,   { y: 28, filter: "blur(12px)" });
gsap.set(sublineRef.current,   { y: 20, filter: "blur(8px)" });
gsap.set(microcopyRef.current, { y: 16, filter: "blur(6px)" });
gsap.set([pathCard1Ref.current, pathCard2Ref.current], { y: 18, filter: "blur(8px)" });
gsap.set(scriptureRef.current, { y: 10, filter: "blur(4px)" });
```

Mobile-only grayscale set:
```js
gsap.set(img,  { filter: "grayscale(1)", opacity: 0.5 });
gsap.set(wrap, { filter: "grayscale(1)" });
```

---

## 10. CSS Transition Patterns (SevenDayChallenge.jsx)

SevenDayChallenge uses **no GSAP**. All animations are CSS transitions or keyframes, plus raw `setTimeout` style mutations for the hero entrance.

### 10-A. Hero entrance via setTimeout + style mutation

```js
setTimeout(() => { vb.style.opacity = "1"; vb.style.height = "78svh"; },  300);
setTimeout(() => { bl.style.opacity = "1"; },                              500);
setTimeout(() => { mk.style.opacity = "1"; mk.style.transform = "none"; }, 950);
setTimeout(() => { co.style.opacity = "1"; co.style.transform = "none"; }, 1350);
setTimeout(() => { sh.style.opacity = "1"; },                             2700);
// Vbeam fade-out:
setTimeout(() => {
  vb.style.transition = "opacity 2.5s ease";
  vb.style.opacity = "0";
}, 4300);
```

CSS classes pre-define the transitions:
```css
.cf7-vbeam   { transition: height 1.7s cubic-bezier(0.16,1,0.3,1), opacity .5s; }
.cf7-bloom   { transition: opacity 2s .5s; }
.cf7-hero-mark    { transition: opacity 1s .9s, transform 1s .9s cubic-bezier(0.16,1,0.3,1); }
.cf7-hero-content { transition: opacity 1.1s 1.3s, transform 1.1s 1.3s cubic-bezier(0.16,1,0.3,1); }
```

### 10-B. Toast / complete notification — CSS class toggle

```css
.cf7-complete-toast {
  transform: translateY(18px); opacity: 0;
  transition: opacity .35s, transform .35s;
}
.cf7-complete-toast.show { opacity: 1; transform: translateY(0); }
```

---

## 11. Ease Function Reference

| Ease string | Used in | Character |
|---|---|---|
| `"power3.out"` | Hero timeline default, pillar-reveal, mouse-parallax | Fast in, slow decelerate |
| `"power2.out"` | AnimatedCounter, batchReveal, mobile image reveal, gear tab in | Moderate decelerate |
| `"power2.in"` | Gear tab out | Accelerate out |
| `"power2.inOut"` | Light element fade-out at end of hero sequence | Symmetric S-curve |
| `"sine.inOut"` | All ambient looping tweens (bgGlow, particles, scroll indicator) | Gentle sine wave |
| `"none"` | Parallax scrub tween | No easing — linear |
| `cubic-bezier(0.16,1,0.3,1)` | SevenDayChallenge CSS transitions (hero mark, content) | Snappy spring-like |
| `cubic-bezier(0.03,0.98,0.52,0.99)` | TiltCard CSS transform transition | Very springy |
| `ease` (CSS) | SevenDayChallenge vbeam fade-out (setTimeout override), fadeUp CSS animation | Default CSS ease |
| `ease-in-out` (CSS) | cf7sb scroll-hint bounce | Symmetric CSS ease |
| `linear` (CSS) | cf7pdrift particle drift | Constant velocity |

---

## 12. RuleOfLife.jsx — Animation Summary

`RuleOfLife.jsx` contains **zero GSAP calls**. All animation in that file is handled by:
- CSS `transition` on hover states (grayscale, opacity, translateY for text reveal)
- Tailwind utility classes (`transition-all duration-700`, `transition-colors duration-300`, `transition-all duration-300 ease-out`)
- The `IntersectionObserver` for carousel dot tracking (no animation, pure state update)

The GSAP animations for `.rhythm-img-wrap` and `.pillar-img` elements that live inside RuleOfLife are orchestrated from `MainSite` in `App.jsx` via `gsap.matchMedia`.

---

## 13. prefers-reduced-motion

**Not implemented** in any of the three source files. No `matchMedia("(prefers-reduced-motion: reduce)")` checks, no `gsap.matchMedia()` reduced-motion branch, and no CSS `@media (prefers-reduced-motion: reduce)` overrides are present.

This is a gap to address in future sessions.

---

## Pattern Count Summary

| Category | Count |
|---|---|
| gsap.set calls (distinct patterns) | 7 |
| gsap.to calls | 16 |
| gsap.from calls | 2 |
| gsap.fromTo calls | 2 |
| gsap.timeline configurations | 1 |
| ScrollTrigger.create (standalone) | 1 |
| ScrollTrigger inline (inside tween) | 3 |
| ScrollTrigger.batch call sites | 5 |
| gsap.context usage | 2 |
| gsap.matchMedia usage | 1 |
| Ambient looping tweens (repeat: -1) | 3 |
| Mouse-parallax interactive tweens | 6 |
| CSS @keyframes animations | 3 |
| IntersectionObserver instances | 2 |
| CSS setTimeout entrance sequences | 1 |
| **Total distinct patterns** | **55** |
