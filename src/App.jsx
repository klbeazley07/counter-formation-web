import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counter Formation — Movement/Brand Site
 * Enhanced with cinematic hero: light-beam cross reveal, GSAP timeline,
 * micro-parallax, blur-sharpen reveal, ambient breathing loop.
 *
 * v2 refinements:
 * — Cross bloom repositioned to sit behind the logo (upper-center), not screen-center
 * — Tighter vertical rhythm: logo/headline/CTAs as one unified stack
 * — Primary CTA gets a bronze border that ties to brand accent color
 * — Scroll indicator (animated chevron) at bottom of viewport
 */

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [locked]);
}

function useEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => { if (e.key === "Escape") handler?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SafeImg({ src, alt, className, fallback = "/placeholder.png", ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => setImgSrc(src), [src]);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
      {...rest}
    />
  );
}

function TiltCard({ children, className, disabled }) {
  const cardRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (disabled || window.innerWidth < 768) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale3d(1.01,1.01,1.01)`;
  }, [disabled]);
  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);
  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-6 px-4">
      <div className="flex-1 h-[1px] bg-white/5" />
      <div className="mx-4 md:mx-8 opacity-[0.06]">
        <SafeImg src="/helmet.png" className="w-6 h-6 md:w-8 md:h-8 grayscale invert" alt="" />
      </div>
      <div className="flex-1 h-[1px] bg-white/5" />
    </div>
  );
}

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

/* ─────────────────────────────────────────────
   CINEMATIC HERO COMPONENT
───────────────────────────────────────────── */
function CinematicHero() {
  const heroRef          = useRef(null);
  const bgGlowRef        = useRef(null);
  const vBeamRef         = useRef(null);
  const hBeamRef         = useRef(null);
  const bloomRef         = useRef(null);
  const particlesRef     = useRef(null);
  const logoGroupRef     = useRef(null);
  const headingRef       = useRef(null);
  const sublineRef       = useRef(null);
  const microcopyRef     = useRef(null);
  const ctaRef           = useRef(null);
  const scriptureRef     = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── SET INITIAL STATES ── */
      gsap.set(
        [bgGlowRef.current, vBeamRef.current, hBeamRef.current,
         bloomRef.current, logoGroupRef.current, headingRef.current,
         sublineRef.current, microcopyRef.current, ctaRef.current,
         scriptureRef.current, scrollIndicatorRef.current],
        { opacity: 0 }
      );
      gsap.set(vBeamRef.current,    { height: "0vh" });
      gsap.set(hBeamRef.current,    { width: "0vw" });
      gsap.set(bloomRef.current,    { scale: 0.7 });
      gsap.set(logoGroupRef.current,  { y: 18, filter: "blur(10px)" });
      gsap.set(headingRef.current,    { y: 28, filter: "blur(12px)" });
      gsap.set(sublineRef.current,    { y: 20, filter: "blur(8px)" });
      gsap.set(microcopyRef.current,  { y: 16, filter: "blur(6px)" });
      gsap.set(ctaRef.current,        { y: 18, filter: "blur(8px)" });
      gsap.set(scriptureRef.current,  { y: 10, filter: "blur(4px)" });

      /* ── REVEAL TIMELINE ── */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0.0 – 1.4s  Background glow breathes in
      tl.to(bgGlowRef.current, { opacity: 1, duration: 1.4 })

        // 0.8 – 2.2s  Vertical beam descends — long, full height (Latin cross proportion)
        .to(vBeamRef.current,
          { opacity: 0.82, height: "84vh", duration: 1.6 },
          "-=0.6"
        )

        // 1.6 – 2.7s  Horizontal bar cuts across — shorter than half-width (crossbar, not crosshair)
        .to(hBeamRef.current,
          { opacity: 0.52, width: "28vw", duration: 1.1 },
          "-=0.6"
        )

        // 1.8 – 3.2s  Cross bloom haze
        .to(bloomRef.current,
          { opacity: 0.7, scale: 1, duration: 1.6 },
          "-=0.8"
        )

        // 2.2 – 3.4s  Particles drift in
        .to(particlesRef.current,
          { opacity: 0.55, duration: 1.2 },
          "-=0.9"
        )

        // 2.6 – 3.6s  Logo sharpens up
        .to(logoGroupRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 },
          "-=0.7"
        )

        // 3.0 – 3.9s  Headline
        .to(headingRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 },
          "-=0.5"
        )

        // 3.3 – 4.1s  Subline
        .to(sublineRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          "-=0.55"
        )

        // 3.6 – 4.3s  Microcopy
        .to(microcopyRef.current,
          { opacity: 0.8, y: 0, filter: "blur(0px)", duration: 0.8 },
          "-=0.45"
        )

        // 3.8 – 4.5s  CTAs
        .to(ctaRef.current,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 },
          "-=0.4"
        )

        // 4.1 – 4.7s  Scripture reference last
        .to(scriptureRef.current,
          { opacity: 0.25, y: 0, filter: "blur(0px)", duration: 0.8 },
          "-=0.35"
        )

        // 4.4 – 5.0s  Scroll indicator breathes in
        .to(scrollIndicatorRef.current,
          { opacity: 1, duration: 0.7 },
          "-=0.3"
        );

      /* ── AMBIENT BREATHING (after reveal settles) ── */
      gsap.to(bgGlowRef.current, {
        x: 12, y: -10, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5
      });
      gsap.to(bloomRef.current, {
        scale: 1.07, opacity: 0.78, duration: 6.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5
      });
      gsap.to(vBeamRef.current, {
        opacity: 0.74, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5
      });
      gsap.to(hBeamRef.current, {
        opacity: 0.45, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 5
      });
      gsap.to(particlesRef.current, {
        y: -14, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5
      });

      // ── CROSS FADE OUT at ~20s — graceful departure, very slow ──
      gsap.to(
        [vBeamRef.current, hBeamRef.current, bloomRef.current],
        { opacity: 0, duration: 3.5, ease: "power2.inOut", delay: 20 }
      );

      // Scroll indicator — gentle bounce loop
      gsap.to(scrollIndicatorRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 5.2
      });

      // ── MOUSE MICRO-PARALLAX ──
      const hero = heroRef.current;
      const onMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const dur = { duration: 1.8, overwrite: "auto", ease: "power3.out" };

        gsap.to(bgGlowRef.current,    { x: x * 16, y: y * 14, ...dur });
        gsap.to(bloomRef.current,     { x: x * 10, y: y * 10, ...{ ...dur, duration: 1.5 } });
        gsap.to(vBeamRef.current,     { x: x * 4,  ...{ ...dur, duration: 1.4 } });
        gsap.to(hBeamRef.current,     { y: y * 4,  ...{ ...dur, duration: 1.4 } });
        gsap.to(particlesRef.current, { x: x * 8,  y: y * 6,  ...{ ...dur, duration: 2.2 } });
        gsap.to(logoGroupRef.current, { x: x * 5,  y: y * 4,  ...{ ...dur, duration: 1.3 } });
      };

      // Hide scroll indicator once user scrolls
      const onScroll = () => {
        if (window.scrollY > 60) {
          gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.4 });
        }
      };

      hero.addEventListener("mousemove", onMouseMove);
      window.addEventListener("scroll", onScroll, { passive: true });

      return () => {
        hero.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("scroll", onScroll);
      };

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center bg-[#04070d]"
    >
      {/* ── STATIC BASE GRADIENT ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(171,122,68,0.14),transparent_26%),radial-gradient(circle_at_55%_48%,rgba(32,64,120,0.10),transparent_32%),linear-gradient(to_bottom,rgba(2,6,16,0.92),rgba(1,4,10,1))]" />

      {/* ── AMBIENT GLOW (parallax layer 1 — deepest) ── */}
      <div
        ref={bgGlowRef}
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(171,122,68,0.04) 18%, transparent 44%)",
          filter: "blur(56px)",
        }}
      />

      {/* ── CROSS BLOOM HAZE — sits at the crossbar intersection ── */}
      <div
        ref={bloomRef}
        className="absolute left-1/2 pointer-events-none opacity-0"
        style={{
          top: "28%",
          transform: "translate(-50%, -50%)",
          width: "44rem", height: "44rem",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(145,172,255,0.07) 20%, rgba(171,122,68,0.05) 36%, transparent 60%)",
          filter: "blur(48px)",
        }}
      />

      {/* ── CHRISTIAN CROSS LIGHT BEAMS ──
           The cross is built as a single positioned unit.
           Vertical beam: full height, centered.
           Horizontal bar: sits 28% down from top of vertical — upper third,
           which is the correct proportion of a Latin cross (not a plus/crosshair).
           Both fade out together at ~20s.
      ── */}

      {/* Vertical beam — full height of hero */}
      <div
        ref={vBeamRef}
        className="absolute left-1/2 -translate-x-1/2 w-[2px] pointer-events-none opacity-0"
        style={{
          top: "8%",
          height: "0vh",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 8%, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.70) 72%, rgba(255,255,255,0.40) 88%, transparent 100%)",
          boxShadow: "0 0 20px rgba(255,255,255,0.48), 0 0 40px rgba(180,210,255,0.20)",
          filter: "blur(0.4px)",
          transformOrigin: "top center",
        }}
      />

      {/* Horizontal bar — positioned at 28% down from viewport top,
          which places it in the upper third of the vertical beam */}
      <div
        ref={hBeamRef}
        className="absolute left-1/2 -translate-x-1/2 h-[2px] pointer-events-none opacity-0"
        style={{
          top: "28%",
          width: "0vw",
          background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.14) 8%, rgba(255,255,255,0.68) 50%, rgba(255,255,255,0.14) 92%, transparent 100%)",
          boxShadow: "0 0 14px rgba(255,255,255,0.24), 0 0 28px rgba(180,210,255,0.14)",
        }}
      />

      {/* ── ATMOSPHERE PARTICLES ── */}
      <div
        ref={particlesRef}
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
          backgroundSize: "320px 320px, 420px 420px, 360px 360px, 500px 500px, 380px 380px, 440px 440px, 350px 350px",
          filter: "blur(0.2px)",
        }}
      />

      {/* ── VIGNETTE ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 36%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0.70) 100%)",
        }}
      />

      {/* ── CONTENT — tight unified stack ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10 text-center">

        {/* Logo — sits at upper center where cross beams intersect */}
        <div ref={logoGroupRef} className="mb-6 md:mb-8 opacity-0">
          <SafeImg
            src="/full-logo.png"
            className="w-[200px] md:w-[500px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[38vh] object-contain"
            alt="Counter Formation"
          />
        </div>

        {/* Headline */}
        <h1
          ref={headingRef}
          className="font-brand text-xl md:text-5xl uppercase tracking-[0.28em] md:tracking-[0.4em] leading-tight text-white px-2 opacity-0"
        >
          Formed in Christ.
        </h1>

        {/* Subline */}
        <p
          ref={sublineRef}
          className="mt-3 md:mt-4 font-brand italic text-sm md:text-4xl opacity-40 tracking-normal lowercase opacity-0"
        >
          Living Counter to Culture.
        </p>

        {/* Microcopy */}
        <p
          ref={microcopyRef}
          className="mt-4 md:mt-5 max-w-xs md:max-w-xl mx-auto text-[8px] md:text-xs opacity-0 tracking-[0.18em] md:tracking-[0.26em] uppercase leading-relaxed font-light text-white/60"
        >
          Intentional formation in a world designed for drift.
        </p>

        {/* CTAs — tighter gap, bronze border on primary */}
        <div
          ref={ctaRef}
          className="mt-8 md:mt-10 flex flex-col md:flex-row gap-3 md:gap-5 justify-center items-center w-full max-w-sm md:max-w-none opacity-0"
        >
          <a
            href="#architecture"
            className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-white/5 text-white rounded-full text-[9px] md:text-[10px] border border-white/10 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all uppercase tracking-widest font-bold"
          >
            Explore the Architecture
          </a>
          {/* Primary CTA — bronze border anchors it to brand palette */}
          <a
            href={SHOPIFY_URL}
            className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#FAF8F5] text-black rounded-full text-[9px] md:text-[10px] border-2 border-[#C9A84C] hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-3 uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(201,168,76,0.18)]"
          >
            Shop the Gear <ArrowRight size={14} />
          </a>
        </div>

        {/* Scripture reference — appears last, barely visible */}
        <div
          ref={scriptureRef}
          className="mt-8 md:mt-10 text-[0.62rem] uppercase tracking-[0.38em] text-white/25 opacity-0"
        >
          Ephesians 6:10–18
        </div>
      </div>

      {/* ── SCROLL INDICATOR — fixed to bottom of hero viewport ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20"
      >
        <span className="text-[7px] uppercase tracking-[0.35em] text-white/30">Scroll</span>
        <svg
          width="16" height="10" viewBox="0 0 16 10"
          fill="none" xmlns="http://www.w3.org/2000/svg"
          className="text-white/25"
        >
          <path
            d="M1 1L8 8L15 1"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyScrollLock(isMenuOpen);
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.from(".nav-fade", {
        opacity: 0, y: -10, duration: 0.9, ease: "power2.out", delay: 0.3,
      });

      gsap.utils.toArray(".pillar-reveal").forEach((pillar) => {
        gsap.from(pillar, {
          y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: pillar, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });

      const revealItems = (selector, y = 20) => {
        ScrollTrigger.batch(selector, {
          start: "top 90%",
          onEnter: (batch) =>
            gsap.fromTo(batch,
              { opacity: 0, y },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out", overwrite: "auto" }
            ),
        });
      };

      revealItems(".manifesto-item");
      revealItems(".product-card", 20);
      revealItems(".journal-card", 20);

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      className="bg-[#0D0D12] text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
    >
      {/* NAVBAR */}
      <nav className="nav-fade fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 bg-[#0D0D12]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 md:gap-3">
          <SafeImg src="/helmet.png" className="h-6 w-6 md:h-8 md:w-8 object-contain" alt="Counter Formation" />
          <span className="font-brand text-[9px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase whitespace-nowrap">
            Counter Formation
          </span>
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 mr-4 text-[10px] uppercase tracking-widest font-brand font-bold">
            <a href="#architecture" className="hover:text-[#C9A84C] transition-colors">Mission</a>
            <a href="#rule" className="hover:text-[#C9A84C] transition-colors">Rule</a>
            <a href="#shop" className="hover:text-[#C9A84C] transition-colors text-[#C9A84C]">Gear</a>
          </div>
          <a
            href={SHOPIFY_URL}
            className="px-4 py-2 md:px-6 md:py-2 bg-white text-black rounded-full text-[9px] md:text-[10px] hidden md:block hover:bg-[#C9A84C] transition-all uppercase tracking-widest font-bold"
          >
            Shop the Gear
          </a>
          <button onClick={() => setIsMenuOpen((v) => !v)} className="md:hidden p-1" aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={cx(
          "fixed inset-0 z-[120] bg-[#0D0D12] flex flex-col items-center justify-center space-y-8 transition-transform duration-500",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8">
          <X size={28} />
        </button>
        {["Mission", "Rule", "Shop"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setIsMenuOpen(false)}
            className="font-brand text-xl tracking-[0.3em] uppercase"
          >
            {item}
          </a>
        ))}
        <a
          href={SHOPIFY_URL}
          className="text-[10px] text-[#C9A84C] tracking-widest uppercase border border-[#C9A84C]/20 px-8 py-3 rounded-full"
        >
          Enter Store
        </a>
      </div>

      {/* ── CINEMATIC HERO ── */}
      <CinematicHero />

      <SectionDivider />

      {/* ARCHITECTURE OF THE SOUL */}
      <section id="architecture" className="relative bg-[#0D0D12] py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 text-center md:text-left space-y-4">
            <h2 className="font-brand text-2xl md:text-5xl uppercase tracking-[0.15em] md:tracking-[0.2em] leading-none text-white">
              Architecture <br />
              <span className="opacity-30 italic font-serif lowercase tracking-normal">of the</span> Soul
            </h2>
            <p className="max-w-2xl text-[10px] md:text-sm opacity-55 tracking-[0.1em] md:tracking-[0.18em] uppercase leading-relaxed font-light">
              Identity anchors the heart. Practice builds discipline. Community protects the journey.
            </p>
          </div>

          <div className="space-y-32 md:space-y-64">
            {/* Identity */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">I</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">Identity</h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md tracking-widest">
                  Before action comes being. Counter Formation begins by anchoring your identity in Christ — not performance, not platform, not approval.
                </p>
              </div>
              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg src="/Identity_8k.png" alt="Identity" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
              </div>
            </div>

            {/* Practice */}
            <div className="pillar-reveal flex flex-col-reverse md:flex-row-reverse items-center gap-10 md:gap-24 group text-center md:text-left">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 right-0 md:left-20 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">II</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">Practice</h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md mx-auto md:ml-0 tracking-widest">
                  A life is built on rhythms. Through scripture, prayer, sabbath, and stillness we train our lives to remain rooted in Christ.
                </p>
              </div>
              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg src="/Practice_8k.png" alt="Practice" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
              </div>
            </div>

            {/* Community */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">III</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">Community</h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md tracking-widest">
                  Formation is a team sport. We provide an ethos for people committed to living differently — together.
                </p>
              </div>
              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg src="/Community_8k.png" alt="Community" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RULE OF LIFE */}
      <section id="rule" className="py-24 md:py-48 px-4 md:px-6 bg-[#0D0D12] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <span className="text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">The Pattern</span>
              <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.15em] text-white leading-none">Rule of Life</h2>
            </div>
            <p className="max-w-md text-xs md:text-base opacity-40 leading-relaxed font-light text-left md:text-right">
              A curated set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
            {[
              { title: "Presence",  desc: "Attention before God",       practices: ["Silence","Stillness"],      bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600" },
              { title: "Scripture", desc: "Truth before noise",          practices: ["Meditation","Learning"],    bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600" },
              { title: "Prayer",    desc: "Dependence before action",    practices: ["Daily prayer","Listening"], bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600" },
              { title: "Sabbath",   desc: "Rest before production",      practices: ["Weekly rest","Delight"],    bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600" },
              { title: "Community", desc: "Formation together",          practices: ["Shared rhythms","Service"], bg: "/Community_8k.png" },
            ].map((rhythm, i) => (
              <div
                key={rhythm.title}
                className="manifesto-item group relative bg-white/[0.03] border border-white/[0.06] p-6 md:p-8 flex flex-col justify-between min-h-[280px] md:min-h-[440px] hover:border-[#C9A84C]/20 transition-all duration-500 overflow-hidden rounded-2xl md:rounded-none"
              >
                <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-1000">
                  <SafeImg src={rhythm.bg} alt="" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/60 to-transparent" />
                <div className="space-y-4 relative z-10">
                  <span className="block font-mono text-[8px] text-[#C9A84C]/60 tracking-[0.3em] group-hover:text-[#C9A84C]">
                    RHYTHM 0{i + 1}
                  </span>
                  <h3 className="font-brand text-base md:text-lg uppercase tracking-[0.1em] text-white">{rhythm.title}</h3>
                </div>
                <p className="text-[10px] md:text-[11px] opacity-35 tracking-wide leading-relaxed font-light relative z-10">{rhythm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE GEAR */}
      <section id="shop" className="py-24 md:py-48 px-4 md:px-6 bg-[#FAF8F5] text-[#0D0D12]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12 mb-12 md:mb-20">
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-tighter">The Gear</h2>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] opacity-40 max-w-sm text-left md:text-right font-bold">
              apparel as a visual anchor. wear the pattern.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Technical Tee", img: "/DriFit_Black.png", link: "/collections/the-gear", copy: "Performance tech for training." },
              { name: "Everyday Tee",  img: "/Tshirt_1.jpg",     link: "/collections/the-gear", copy: "Premium soft-wash cotton." },
              { name: "Hoodies",       img: "/shield-black.png", link: "/collections/the-gear", copy: "Heavyweight anchors.", comingSoon: true },
            ].map((cat) => (
              <TiltCard key={cat.name} disabled={cat.comingSoon} className="product-card group relative overflow-hidden bg-black aspect-[3/4] rounded-[2rem] md:rounded-[3rem] transition-transform duration-700 hover:-translate-y-2 md:hover:-translate-y-4 shadow-xl">
                <a
                  href={cat.comingSoon ? undefined : `${SHOPIFY_URL}${cat.link}`}
                  target="_blank" rel="noopener noreferrer"
                  className={cx("block h-full relative", cat.comingSoon && "pointer-events-none")}
                >
                  <div className="absolute inset-0 opacity-60 group-hover:opacity-90 grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <SafeImg src={cat.img} className="w-full h-full object-cover" alt={cat.name} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-end text-white">
                    <h3 className="font-brand text-2xl md:text-4xl uppercase italic">{cat.name}</h3>
                    <p className="text-[9px] md:text-[10px] opacity-60 uppercase mt-2 tracking-widest">{cat.copy}</p>
                    {!cat.comingSoon && (
                      <div className="flex items-center gap-3 text-[9px] text-[#C9A84C] pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        Shop <ArrowRight size={14} />
                      </div>
                    )}
                  </div>
                </a>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D0D12] pt-24 md:pt-48 pb-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 pb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <SafeImg src="/helmet.png" className="w-10 h-10" alt="" />
              <h4 className="font-brand text-2xl text-[#C9A84C]">Counter Formation</h4>
            </div>
            <p className="opacity-30 text-[10px] uppercase tracking-widest">Formed in Christ. Not drifting.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 col-span-1 md:col-span-3">
            <div className="space-y-4 text-[9px] tracking-widest opacity-40">
              <span className="text-[#C9A84C]">Sitemap</span>
              <a href="#architecture" className="block hover:text-white">Mission</a>
              <a href="#rule" className="block hover:text-white">Rule</a>
            </div>
            <div className="space-y-4 text-[9px] tracking-widest opacity-40">
              <span className="text-[#C9A84C]">Social</span>
              <a href="#" className="block hover:text-white">Instagram</a>
              <a href="#" className="block hover:text-white">Email</a>
            </div>
          </div>
        </div>
        <div className="text-center opacity-20 text-[8px] tracking-[0.3em] mt-10">
          © 2026 COUNTER FORMATION • DISCIPLINE • PRESENCE
        </div>
      </footer>
    </div>
  );
};

export default CounterFormation;
