# Identity Pillar Landing Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/identity` landing page (IdentityLanding) and six armor-piece placeholder sub-routes per the spec-landing-page.md spec, following existing site patterns.

**Architecture:** Create a new `src/Identity.jsx` file containing all Identity pillar components (IdentityLanding + ArmorPiecePlaceholder). Update `src/App.jsx` to import from Identity.jsx and wire six sub-routes. The Architecture slider already links to `/identity` via `p.route` — no changes needed to `Architecture.jsx`.

**Tech Stack:** React 18, React Router v6, GSAP + ScrollTrigger, Tailwind CSS, Lucide React icons. Fonts: Michroma (brand), Cormorant Garamond (devotional), Inter (body).

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| **Create** | `src/Identity.jsx` | All Identity pillar components: constants, armor data, 7 sections, IdentityLanding export, ArmorPiecePlaceholder export |
| **Modify** | `src/App.jsx` lines 18–24 (imports) + lines 1540–1543 (routes) | Import IdentityLanding + ArmorPiecePlaceholder; swap `/identity` route; add 6 sub-routes |

No changes to `Architecture.jsx` — the Identity panel CTA already uses `p.route = "/identity"` with `<Link to={p.route}>`. The `CampaignPage` template and `PILLARS` data in Architecture.jsx are left completely untouched; `PracticePage` and `CommunityPage` continue to use them.

---

## Task 1: File skeleton — constants, armor data, shared utilities

**Files:**
- Create: `src/Identity.jsx`

- [ ] **Step 1: Create Identity.jsx with imports, constants, and ARMOR_PIECES data**

```jsx
import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

const C = {
  heroBg: "#06050A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

const ARMOR_PIECES = [
  {
    num: "01", slug: "belt-of-truth", title: "Belt of Truth",
    scripture: "Ephesians 6:14a",
    theology: "The belt was the first piece — everything else attached to it. Truth is foundational. Not abstract doctrine but lived reality.",
    tension: "Curated identity. Social media trains you to perform a self rather than know one.",
    practice: "Five-minute evening examination rooted in Ignatian Examen.",
    hook: "What would change if you stopped managing your image and started telling the truth?",
    product: null,
  },
  {
    num: "02", slug: "breastplate-of-righteousness", title: "Breastplate of Righteousness",
    scripture: "Ephesians 6:14b",
    theology: "Protects the heart. Positional righteousness, not moral performance. Christ's righteousness credited to you.",
    tension: "Performance engine. Worth = output.",
    practice: "Morning declaration spoken aloud.",
    hook: "What metric are you using to determine your worth today?",
    product: null,
  },
  {
    num: "03", slug: "gospel-of-peace", title: "Gospel of Peace",
    scripture: "Ephesians 6:15",
    theology: "Roman sandals had cleats for standing firm. Peace is grounding, not absence of conflict.",
    tension: "Anxiety as ambient condition. Systems engineered for reactivity.",
    practice: "\"Peace pause\" three times daily, sixty seconds of stillness.",
    hook: "What are you anxious about right now? What would it feel like to set it down?",
    product: null,
  },
  {
    num: "04", slug: "shield-of-faith", title: "Shield of Faith",
    scripture: "Ephesians 6:16",
    theology: "Full-body thureos soaked in water to quench fire arrows. Faith is positioning, not feeling.",
    tension: "Flaming arrows are lies about identity, God's character, whether obedience is worth it.",
    practice: "\"Arrow log\" to catch lies and answer with Scripture.",
    hook: "What lie keeps recurring? What would it take to simply refuse it?",
    product: "Drop 002 · Premium Everyday Tee",
  },
  {
    num: "05", slug: "helmet-of-salvation", title: "Helmet of Salvation",
    scripture: "Ephesians 6:17a",
    theology: "Protects the mind. Salvation as present reality and settled identity, not just future promise.",
    tension: "Mind is most contested territory. Anxiety, doom-scrolling, information overload.",
    practice: "\"Helmet check\" — morning identity declaration before digital input.",
    hook: "What is the first thing your mind reaches for in the morning?",
    product: "Drop 002 · Technical Hoodie",
  },
  {
    num: "06", slug: "sword-of-the-spirit", title: "Sword of the Spirit",
    scripture: "Ephesians 6:17b",
    theology: "Only offensive weapon. Scripture as living, active, spoken weapon. Rhema = specific utterance.",
    tension: "Biblical illiteracy at historic highs.",
    practice: "Scripture memorization, one verse per week.",
    hook: "Could you answer with Scripture — not the gist of it, but the words themselves?",
    product: "Drop 002 · Technical Tee",
  },
];
```

- [ ] **Step 2: Add the shared BackNav component at the bottom of the constants block**

```jsx
function BackNav() {
  return (
    <Link
      to="/identity"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold transition-all"
      style={{
        backgroundColor: `${C.heroBg}cc`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${C.ivory}10`,
        color: `${C.ivory}60`,
        textDecoration: "none",
      }}
    >
      ← Identity
    </Link>
  );
}
```

- [ ] **Step 3: Verify the file loads without error — add a temporary export at the bottom**

```jsx
export function IdentityLanding() {
  return <div style={{ backgroundColor: C.heroBg, minHeight: "100vh", color: C.ivory }}>Identity coming</div>;
}

export function ArmorPiecePlaceholder() {
  return <div style={{ backgroundColor: C.heroBg, minHeight: "100vh", color: C.ivory }}>Piece coming</div>;
}
```

- [ ] **Step 4: Wire App.jsx imports and routes so the page is reachable before building sections**

In `src/App.jsx`, find the existing import block at the top (lines 18–24):
```jsx
import {
  ArchitectureStyles,
  ArchitectureSlider,
  IdentityPage,
  PracticePage,
  CommunityPage,
} from "./Architecture";
```
Replace with:
```jsx
import {
  ArchitectureStyles,
  ArchitectureSlider,
  PracticePage,
  CommunityPage,
} from "./Architecture";
import { IdentityLanding, ArmorPiecePlaceholder } from "./Identity";
```

- [ ] **Step 5: Update the `/identity` route and add six sub-routes in App.jsx**

Find (around line 1540):
```jsx
        {/* Architecture routes */}
        <Route path="/identity"  element={<IdentityPage />} />
        <Route path="/practice"  element={<PracticePage />} />
        <Route path="/community" element={<CommunityPage />} />
```
Replace with:
```jsx
        {/* Architecture routes */}
        <Route path="/identity"  element={<IdentityLanding />} />
        <Route path="/identity/belt-of-truth"               element={<ArmorPiecePlaceholder />} />
        <Route path="/identity/breastplate-of-righteousness" element={<ArmorPiecePlaceholder />} />
        <Route path="/identity/gospel-of-peace"             element={<ArmorPiecePlaceholder />} />
        <Route path="/identity/shield-of-faith"             element={<ArmorPiecePlaceholder />} />
        <Route path="/identity/helmet-of-salvation"         element={<ArmorPiecePlaceholder />} />
        <Route path="/identity/sword-of-the-spirit"         element={<ArmorPiecePlaceholder />} />
        <Route path="/practice"   element={<PracticePage />} />
        <Route path="/community"  element={<CommunityPage />} />
```

- [ ] **Step 6: Open `http://localhost:5173/identity` in browser — verify placeholder renders with dark background, no console errors**

- [ ] **Step 7: Commit**

```bash
git add src/Identity.jsx src/App.jsx
git commit -m "feat: scaffold Identity.jsx with data, BackNav, placeholder routes wired"
```

---

## Task 2: Section A — Hero

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add the HeroSection component above the temporary IdentityLanding export**

```jsx
function HeroSection() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef  = useRef(null);
  const chevronRef  = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, headlineRef.current, sublineRef.current, chevronRef.current], { opacity: 0, y: 20 });
      gsap.set(watermarkRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(watermarkRef.current,  { opacity: 0.10, duration: 2.0 })
        .to(eyebrowRef.current,    { opacity: 1,    y: 0, duration: 0.8 }, "-=1.5")
        .to(headlineRef.current,   { opacity: 1,    y: 0, duration: 0.9 }, "-=0.55")
        .to(sublineRef.current,    { opacity: 0.55, y: 0, duration: 0.8 }, "-=0.5")
        .to(chevronRef.current,    { opacity: 0.6,  y: 0, duration: 0.7 }, "-=0.4");

      // Chevron pulse
      gsap.to(chevronRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.5,
      });

      // Watermark parallax on scroll
      gsap.to(watermarkRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.heroBg }}
    >
      {/* Hero image — very low opacity atmospheric */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/identity_wide.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.18,
        }}
      />
      {/* Bottom-heavy gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(to top, ${C.heroBg} 0%, ${C.heroBg}ee 30%, ${C.heroBg}88 60%, ${C.heroBg}22 100%)`,
        }}
      />

      {/* Shield watermark — off-center atmospheric, parallax */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 z-0 flex items-center pointer-events-none opacity-0"
        style={{ justifyContent: "flex-end", paddingRight: "8%" }}
      >
        <img
          src="/shield-white.png"
          alt=""
          style={{ height: "45vh", width: "auto", filter: "brightness(0) invert(1)", opacity: 0.09 }}
        />
      </div>

      {/* Particle field — CSS radial-gradient dots */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 22% 40%, rgba(255,255,255,0.12) 0.7px, transparent 1px)",
            "radial-gradient(circle at 65% 55%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px)",
            "radial-gradient(circle at 42% 70%, rgba(255,255,255,0.08) 0.8px, transparent 1.2px)",
            "radial-gradient(circle at 55% 25%, rgba(255,255,255,0.10) 0.7px, transparent 1px)",
            "radial-gradient(circle at 78% 42%, rgba(255,255,255,0.07) 0.8px, transparent 1.2px)",
          ].join(","),
          backgroundSize: "340px 340px, 430px 430px, 370px 370px, 510px 510px, 390px 390px",
          filter: "blur(0.2px)",
          opacity: 0.6,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <span
          ref={eyebrowRef}
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-8 opacity-0"
          style={{ color: C.gold }}
        >
          The Identity Pillar · Ephesians 6:10–18
        </span>
        <h1
          ref={headlineRef}
          className="font-brand text-4xl md:text-8xl uppercase tracking-[0.1em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
        >
          You Are Being Formed
        </h1>
        <p
          ref={sublineRef}
          className="text-base md:text-xl leading-relaxed max-w-2xl opacity-0"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: `${C.ivory}88`,
          }}
        >
          Every satisfying explanation for your identity that doesn't start with God will eventually collapse under its own weight.
        </p>
      </div>

      {/* Chevron */}
      <div
        ref={chevronRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-0"
      >
        <div
          className="w-[1px] h-8"
          style={{ background: `linear-gradient(to bottom, transparent, ${C.gold}66)` }}
        />
        <ChevronDown size={16} color={C.gold} strokeWidth={1.5} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace the temporary IdentityLanding export with one that renders HeroSection**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
    </div>
  );
}
```

- [ ] **Step 3: Visual check — navigate to `/identity`**
  - Headline "YOU ARE BEING FORMED" appears and animates in
  - Hero image shows faintly in background
  - Shield watermark visible at ~10% opacity, off-center right
  - Chevron pulses at bottom
  - No console errors

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity hero section with GSAP entrance and parallax watermark"
```

---

## Task 3: Section B — Scripture & Teaching

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add ArmorIntroSection component**

```jsx
function ArmorIntroSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".armor-reveal").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4" style={{ backgroundColor: C.heroBg }}>
      <div className="max-w-[740px] mx-auto">
        <span
          className="armor-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: C.gold }}
        >
          Ephesians 6:10–18
        </span>

        {/* Scripture block */}
        <blockquote
          className="armor-reveal mb-12"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(16px, 2vw, 22px)",
            lineHeight: 1.85,
            color: `${C.ivory}cc`,
          }}
        >
          <p className="mb-5">
            Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil's schemes. For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms.
          </p>
          <p className="mb-5">
            Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand. Stand firm then, with the belt of truth buckled around your waist, with the breastplate of righteousness in place, and with your feet fitted with the readiness that comes from the gospel of peace.
          </p>
          <p>
            In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one. Take the helmet of salvation and the sword of the Spirit, which is the word of God.
          </p>
        </blockquote>

        {/* Gold rule */}
        <div
          className="armor-reveal h-[1px] mb-12"
          style={{ background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)` }}
        />

        {/* Teaching — three paragraphs, no bullets */}
        <div className="space-y-8">
          <p className="armor-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            Paul is writing to people under real pressure — not offering a metaphor for self-improvement but a survival framework for people living inside a hostile formation system. Rome's empire was total: emperor worship, cultural assimilation, a comprehensive narrative about power, identity, and worth. The parallel to the modern formation environment is not metaphorical. It is structural.
          </p>
          <p className="armor-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The armor is not something you build. It is something you receive and put on. Identity in Christ is given, not constructed. The belt, the breastplate, the shield — each piece represents a dimension of God's own character that He extends to those who are in Christ. You are not assembling virtue through effort. You are stepping into what has already been provided.
          </p>
          <p className="armor-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            "Putting on" is a daily, deliberate act. You drift without it by default. The armor does not go on automatically — it requires intentional return, morning by morning, to the reality of who you are in Christ before the world has a chance to tell you otherwise. That is why this collection pairs every piece with a formation pathway.
          </p>
        </div>

        {/* Faded helmet watermark */}
        <div className="mt-20 flex justify-center pointer-events-none">
          <img
            src="/helmet.png"
            alt=""
            style={{ height: "100px", filter: "brightness(0) invert(1)", opacity: 0.06 }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add ArmorIntroSection to IdentityLanding**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
      <ArmorIntroSection />
    </div>
  );
}
```

- [ ] **Step 3: Visual check — scroll past hero**
  - Scripture passage renders in Cormorant Garamond italic at readable size
  - Gold rule separates scripture from teaching
  - Three teaching paragraphs fade in on scroll
  - Faint helmet watermark at section base

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity section B — Ephesians 6 scripture and teaching content"
```

---

## Task 4: Section C — This Is God's Armor

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add GodsArmorSection component**

```jsx
function GodsArmorSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".godsarmor-reveal").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-40 px-4"
      style={{ background: `linear-gradient(to bottom, ${C.heroBg}, ${C.ruleBg})` }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          {/* Left: teaching + brand line */}
          <div>
            <span
              className="godsarmor-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: C.gold }}
            >
              The Revelation
            </span>
            <p className="godsarmor-reveal text-sm md:text-base leading-relaxed font-light mb-6" style={{ color: `${C.ivory}77` }}>
              The armor Paul describes is not a metaphor invented for the church. It is drawn from Isaiah's descriptions of God Himself. Isaiah 59:17 describes God putting on righteousness as a breastplate, salvation as a helmet. Isaiah 11:5 pictures the belt of faithfulness. Isaiah 52:7 speaks of feet bringing good news of peace.
            </p>
            <p className="godsarmor-reveal text-sm md:text-base leading-relaxed font-light mb-12" style={{ color: `${C.ivory}77` }}>
              When you put on the armor of God, you are not assembling your own defenses. You are stepping into God's own character — the same righteousness, the same salvation, the same peace that belong to Him. The armor is His before it is yours.
            </p>
            <p
              className="godsarmor-reveal text-lg md:text-2xl tracking-[0.12em] uppercase font-bold leading-tight"
              style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
            >
              "You are not inventing identity.<br className="hidden md:block" /> You are receiving it."
            </p>
          </div>

          {/* Right: Isaiah 59:17 as large vertical typographic treatment */}
          <div className="godsarmor-reveal">
            <div className="border-l-2 pl-8" style={{ borderColor: `${C.gold}33` }}>
              <span
                className="block text-[9px] tracking-[0.4em] uppercase mb-6"
                style={{ color: `${C.gold}77` }}
              >
                Isaiah 59:17
              </span>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 3.5vw, 48px)",
                  lineHeight: 1.3,
                  color: `${C.ivory}bb`,
                }}
              >
                He put on righteousness as his breastplate, and the helmet of salvation on his head.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add GodsArmorSection to IdentityLanding**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
    </div>
  );
}
```

- [ ] **Step 3: Visual check**
  - Background transitions from Hero Black → Rule Brown via gradient
  - Two-column layout on desktop (single column on mobile)
  - Isaiah quote in large Cormorant Garamond italic on right, gold left-border
  - Brand line "You are not inventing identity…" in Michroma gold

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity section C — God's own armor, Isaiah 59:17 typography"
```

---

## Task 5: Section D — The Six Pieces

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add SixPiecesSection component**

```jsx
function SixPiecesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".piece-block").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 40,
          duration: 1.0, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4" style={{ backgroundColor: C.ruleBg }}>
      <div className="max-w-[1100px] mx-auto">

        {/* Section header */}
        <div className="mb-16 md:mb-24">
          <span className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-4" style={{ color: C.gold }}>
            The Six Pieces
          </span>
          <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.1em] text-white leading-none">
            The Armor of God
          </h2>
        </div>

        <div className="space-y-28 md:space-y-44">
          {ARMOR_PIECES.map((piece, i) => (
            <div
              key={piece.slug}
              className={`piece-block relative grid md:grid-cols-2 gap-12 md:gap-20 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
            >
              {/* Background numeral watermark */}
              <div
                className="absolute inset-0 flex items-center pointer-events-none overflow-hidden"
                style={{ justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}
              >
                <span
                  style={{
                    fontFamily: "'Michroma', sans-serif",
                    fontSize: "clamp(140px, 20vw, 260px)",
                    fontWeight: 700,
                    color: `${C.ivory}07`,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {piece.num}
                </span>
              </div>

              {/* Content column */}
              <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${C.gold}77` }}>
                    {piece.num}
                  </span>
                  <div className="h-[1px] flex-1" style={{ background: `${C.gold}22` }} />
                </div>
                <h3 className="font-brand text-2xl md:text-4xl uppercase tracking-[0.1em] text-white mb-3">
                  {piece.title}
                </h3>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-8" style={{ color: `${C.gold}99` }}>
                  {piece.scripture}
                </p>

                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: `${C.ivory}44` }}>
                      Theology
                    </span>
                    <p className="text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
                      {piece.theology}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: `${C.ivory}44` }}>
                      Modern Tension
                    </span>
                    <p className="text-sm leading-relaxed font-light" style={{ color: `${C.ivory}55` }}>
                      {piece.tension}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: `${C.ivory}44` }}>
                      Daily Practice
                    </span>
                    <p className="text-sm leading-relaxed font-light" style={{ color: `${C.ivory}66` }}>
                      {piece.practice}
                    </p>
                  </div>
                </div>

                <blockquote
                  className="mt-8 pl-4 border-l"
                  style={{
                    borderColor: `${C.gold}33`,
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "16px",
                    color: `${C.ivory}88`,
                  }}
                >
                  "{piece.hook}"
                </blockquote>

                <div className="mt-8 flex items-center gap-5">
                  <Link
                    to={`/identity/${piece.slug}`}
                    className="text-[10px] tracking-[0.3em] uppercase font-bold flex items-center gap-2 transition-opacity hover:opacity-100"
                    style={{ color: C.gold, opacity: 0.8, textDecoration: "none" }}
                  >
                    Explore this piece
                    <ArrowRight size={12} />
                  </Link>
                  {piece.product && (
                    <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: `${C.ivory}33` }}>
                      {piece.product}
                    </span>
                  )}
                </div>
              </div>

              {/* Decorative right column — tonal card */}
              <div className={`hidden md:flex items-center justify-center ${i % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <div
                  className="w-full rounded-2xl relative overflow-hidden"
                  style={{
                    aspectRatio: "3/4",
                    background: `linear-gradient(135deg, ${C.heroBg} 0%, ${C.ruleBg} 100%)`,
                    border: `1px solid ${C.ivory}0A`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      style={{
                        fontFamily: "'Michroma', sans-serif",
                        fontSize: "clamp(60px, 8vw, 100px)",
                        fontWeight: 700,
                        color: `${C.gold}12`,
                      }}
                    >
                      {piece.num}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${C.gold}44` }}>
                      {piece.product || "Formation content · Coming soon"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add SixPiecesSection to IdentityLanding**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <SixPiecesSection />
    </div>
  );
}
```

- [ ] **Step 3: Visual check**
  - All six pieces render with correct data from ARMOR_PIECES
  - Odd-indexed pieces (02, 04, 06) are right-heavy on desktop
  - Large muted numerals visible as background watermarks
  - "Explore this piece" links to correct `/identity/[slug]` routes
  - Decorative tonal cards appear on right column desktop

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity section D — six armor pieces with alternating layout"
```

---

## Task 6: Section E — Brand Integration

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add BrandSection component**

```jsx
function BrandSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".brand-reveal").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 24,
          duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4" style={{ backgroundColor: C.ruleBg }}>
      <div className="max-w-[740px] mx-auto">
        <span
          className="brand-reveal block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: C.gold }}
        >
          Why the Armor
        </span>
        <div className="space-y-8">
          <p className="brand-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The armor is not a costume. It is what God has provided for people who are being formed in a system that is actively working against them. Every culture in history has had a comprehensive formation project — a set of values, narratives, and practices designed to shape people into its image. The digital age is no different, except that its reach is total and its pace is unprecedented.
          </p>
          <p className="brand-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is not the armor. It is a marker — a daily reminder that you belong to a different formation project. The QR code connects to the formation content: the theology, the practice, the community. The garment anchors the identity. The content forms it.
          </p>
          <p className="brand-reveal text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is the entry point. The content is the formation. The practice is the armor. These three move together, or they don't move at all.
          </p>
        </div>
        <div className="brand-reveal mt-16">
          <p
            className="text-lg md:text-2xl tracking-[0.14em] uppercase font-bold leading-tight"
            style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
          >
            "The gear is not the mission.<br className="hidden md:block" /> It's a marker of it."
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add BrandSection to IdentityLanding**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <SixPiecesSection />
      <BrandSection />
    </div>
  );
}
```

- [ ] **Step 3: Visual check — three prose paragraphs render, Michroma brand line in gold**

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity section E — brand integration prose and closing brand line"
```

---

## Task 7: Section F — Collection Drop

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add DROP_PRODUCTS constant immediately after ARMOR_PIECES (before the component functions)**

```jsx
const DROP_PRODUCTS = [
  {
    slug: "helmet-of-salvation", num: "05", name: "Helmet of Salvation",
    product: "Technical Hoodie",
    hook: "What is the first thing your mind reaches for in the morning?",
    available: true,
  },
  {
    slug: "shield-of-faith", num: "04", name: "Shield of Faith",
    product: "Premium Everyday Tee",
    hook: "What lie keeps recurring? What would it take to simply refuse it?",
    available: true,
  },
  {
    slug: "sword-of-the-spirit", num: "06", name: "Sword of the Spirit",
    product: "Technical Tee",
    hook: "Could you answer with Scripture — not the gist of it, but the words themselves?",
    available: true,
  },
  {
    slug: "belt-of-truth", num: "01", name: "Belt of Truth",
    product: "Formation content · Product coming",
    hook: null, available: false,
  },
  {
    slug: "breastplate-of-righteousness", num: "02", name: "Breastplate of Righteousness",
    product: "Formation content · Product coming",
    hook: null, available: false,
  },
  {
    slug: "gospel-of-peace", num: "03", name: "Gospel of Peace",
    product: "Formation content · Product coming",
    hook: null, available: false,
  },
];
```

- [ ] **Step 2: Add CollectionSection component**

```jsx
function CollectionSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".drop-card").forEach(el => {
        gsap.from(el, {
          opacity: 0, y: 30,
          duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-40 px-4"
      style={{ background: `linear-gradient(to bottom, ${C.ruleBg}, #1A1510)` }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <span
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-4"
              style={{ color: C.gold }}
            >
              Drop 002 · The Armor of God
            </span>
            <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.1em] text-white leading-none">
              The Collection
            </h2>
          </div>
          <p
            className="max-w-sm text-xs md:text-sm leading-relaxed font-light md:text-right"
            style={{ color: `${C.ivory}44` }}
          >
            Three hero pieces. Six formation pathways. One armor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {DROP_PRODUCTS.map(p => (
            <Link
              key={p.slug}
              to={`/identity/${p.slug}`}
              className="drop-card group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:border-opacity-30"
              style={{
                textDecoration: "none",
                minHeight: "320px",
                background: `${C.ivory}05`,
                border: `1px solid ${C.ivory}${p.available ? "0F" : "07"}`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: `linear-gradient(to right, transparent, ${C.gold}${p.available ? "55" : "22"}, transparent)`,
                }}
              />
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[9px] tracking-[0.4em] uppercase"
                    style={{ color: `${C.gold}${p.available ? "99" : "44"}` }}
                  >
                    {p.num}
                  </span>
                  {p.available && (
                    <span
                      className="text-[8px] tracking-[0.3em] uppercase px-2 py-1 rounded-full"
                      style={{ color: C.gold, border: `1px solid ${C.gold}33` }}
                    >
                      Drop 002
                    </span>
                  )}
                </div>
                <h3
                  className="font-brand text-base uppercase tracking-[0.1em] mb-2"
                  style={{ color: p.available ? C.ivory : `${C.ivory}44` }}
                >
                  {p.name}
                </h3>
                <p
                  className="text-[11px] tracking-[0.2em] uppercase mb-6"
                  style={{ color: p.available ? `${C.ivory}55` : `${C.ivory}22` }}
                >
                  {p.product}
                </p>
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add CollectionSection to IdentityLanding**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <SixPiecesSection />
      <BrandSection />
      <CollectionSection />
    </div>
  );
}
```

- [ ] **Step 4: Visual check**
  - Three available hero pieces show full brightness, "Drop 002" badge, hook quote
  - Three coming-soon pieces render at reduced opacity, no badge, no hook
  - All six cards are clickable links to their respective `/identity/[slug]` routes
  - Background gradient fades from Rule Brown toward slightly warmer dark

- [ ] **Step 5: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity section F — Drop 002 collection grid, available/coming-soon states"
```

---

## Task 8: Section G — CTA

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Add CTASection component**

```jsx
function CTASection() {
  return (
    <section
      className="py-24 md:py-48 px-4 text-center"
      style={{ backgroundColor: C.heroBg }}
    >
      <div className="max-w-2xl mx-auto">

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4 mb-20">
          <Link
            to="/identity/belt-of-truth"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:scale-105"
            style={{
              backgroundColor: C.gold,
              color: "#0A0A0A",
              boxShadow: `0 4px 32px ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Begin Formation
            <ArrowRight size={14} />
          </Link>
          <a
            href={SHOPIFY_URL}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.28em] uppercase transition-all hover:bg-white/5"
            style={{ color: C.gold, border: `1px solid ${C.gold}44`, textDecoration: "none" }}
          >
            Explore the Collection
          </a>
        </div>

        {/* Closing scripture */}
        <div>
          <p
            className="text-base md:text-xl leading-relaxed mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: `${C.ivory}55`,
            }}
          >
            "Be strong in the Lord and in his mighty power. Put on the full armor of God."
          </p>
          <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: `${C.ivory}33` }}>
            Ephesians 6:10–11
          </p>
        </div>

        {/* Brand footer mark */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <img
            src="/helmet.png"
            alt=""
            style={{ height: "44px", filter: "brightness(0) invert(1)", opacity: 0.08 }}
          />
          <p className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${C.ivory}22` }}>
            Discipline · Presence · Formation
          </p>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace the temporary IdentityLanding with the final complete export**

```jsx
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
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

- [ ] **Step 3: Visual check — full page scroll**
  - Gold "Begin Formation" button links to `/identity/belt-of-truth`
  - "Explore the Collection" links to Shopify URL
  - Closing scripture in Cormorant Garamond italic, muted
  - Tiny helmet mark at ~8% opacity, "Discipline · Presence · Formation" beneath

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: Identity section G — CTA, closing scripture, brand footer mark"
```

---

## Task 9: ArmorPiecePlaceholder — six sub-routes

**Files:**
- Modify: `src/Identity.jsx`

- [ ] **Step 1: Replace the temporary ArmorPiecePlaceholder export with the real implementation**

```jsx
export function ArmorPiecePlaceholder() {
  const { piece } = useParams();
  const armorPiece = ARMOR_PIECES.find(p => p.slug === piece);

  if (!armorPiece) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ backgroundColor: C.heroBg }}
      >
        <Link
          to="/identity"
          style={{ color: C.gold, textDecoration: "none", fontSize: "12px", letterSpacing: "0.3em" }}
        >
          ← Back to Identity
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#FAF8F5]" style={{ backgroundColor: C.heroBg }}>
      <BackNav />

      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center max-w-2xl mx-auto">
        <span
          className="text-[10px] tracking-[0.5em] uppercase font-bold mb-6"
          style={{ color: C.gold }}
        >
          {armorPiece.num} · The Armor of God
        </span>
        <h1 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] text-white mb-6 leading-none">
          {armorPiece.title}
        </h1>
        <p
          className="text-[11px] tracking-[0.3em] uppercase mb-10"
          style={{ color: `${C.ivory}44` }}
        >
          {armorPiece.scripture}
        </p>
        <p
          className="text-sm md:text-base leading-relaxed max-w-md mb-6 font-light"
          style={{ color: `${C.ivory}55` }}
        >
          {armorPiece.theology}
        </p>
        <blockquote
          className="mb-12 text-base leading-relaxed max-w-sm"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: `${C.ivory}66`,
          }}
        >
          "{armorPiece.hook}"
        </blockquote>
        <span
          className="text-[10px] tracking-[0.4em] uppercase px-6 py-3 rounded-full"
          style={{ color: `${C.ivory}33`, border: `1px solid ${C.ivory}10` }}
        >
          Full formation page coming soon
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify all six sub-routes work**

Navigate to each in the browser:
- `/identity/belt-of-truth` → "Belt of Truth" with Ephesians 6:14a, theology, hook
- `/identity/breastplate-of-righteousness` → "Breastplate of Righteousness"
- `/identity/gospel-of-peace` → "Gospel of Peace"
- `/identity/shield-of-faith` → "Shield of Faith"
- `/identity/helmet-of-salvation` → "Helmet of Salvation"
- `/identity/sword-of-the-spirit` → "Sword of the Spirit"

Each should show: piece number eyebrow, title in Michroma, scripture ref, theology paragraph, hook quote, "coming soon" badge. BackNav link returns to `/identity`.

- [ ] **Step 3: Verify an unknown slug (`/identity/unknown`) renders the fallback with back link (not a crash)**

- [ ] **Step 4: Commit**

```bash
git add src/Identity.jsx
git commit -m "feat: ArmorPiecePlaceholder — six sub-routes with piece data, fallback for unknown slugs"
```

---

## Task 10: Verify full integration

**Files:**
- Read-only verification pass

- [ ] **Step 1: Verify Architecture slider links work**

Navigate to homepage → scroll to Architecture of the Soul slider → click "Enter Identity" on panel I. Should navigate to `/identity`. The slider already uses `p.route` and `<Link to={p.route}>` — this is a verification step, not a code change.

- [ ] **Step 2: Verify BackNav does not appear on the main `/identity` landing page (it's only useful on sub-routes)**

The BackNav links back to `/identity`, which on the landing page itself creates a circular link. It is rendered there for visual consistency but is acceptable — verify it does not cause any layout issues. If it is distracting, remove it from `IdentityLanding` (keep it only in `ArmorPiecePlaceholder`):

```jsx
// In IdentityLanding — remove BackNav if it feels circular:
export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      {/* BackNav omitted on landing — user arrived here from Architecture slider */}
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

- [ ] **Step 3: Check mobile layout**
  - Hero: headline readable, chevron visible
  - Section B: scripture readable at mobile size
  - Section C: two-column collapses to single column, Isaiah quote readable
  - Section D: alternating layout resets to single column (RTL direction resets on mobile)
  - Section F: 3-col grid collapses to single column

- [ ] **Step 4: Check browser console for errors across all routes**

- [ ] **Step 5: Final commit**

```bash
git add src/Identity.jsx src/App.jsx
git commit -m "feat: Identity pillar complete — landing + 6 sub-routes, Architecture slider verified"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|---|---|
| Route `/identity` | Task 1 (App.jsx routes) |
| Six sub-routes `/identity/[piece]` | Task 1 (App.jsx) + Task 9 |
| Architecture slider links to `/identity` | Task 10 (verify only — already wired) |
| Section A: Hero — headline, subline, eyebrow, watermark, particle, chevron | Task 2 |
| Section B: Scripture Eph 6:10–18, teaching paragraphs, gold rule, watermark | Task 3 |
| Section C: Two-column, Isaiah 59:17, brand line Michroma gold, background gradient | Task 4 |
| Section D: Six pieces, alternating layout, large numeral watermarks, links, product note | Task 5 |
| Section E: Brand integration prose, closing Michroma gold line | Task 6 |
| Section F: Drop 002 cards, available/coming-soon states, links to piece pages | Task 7 |
| Section G: Primary/secondary CTAs, closing scripture, helmet mark, footer text | Task 8 |
| GSAP ScrollTrigger animations throughout | Tasks 2–7 |
| Color tokens: Hero Black, Champagne Gold, Rule Brown gradient | All tasks |
| Michroma for headings, Cormorant Garamond for devotional/scripture | All tasks |
