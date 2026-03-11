import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Menu, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counter Formation — Movement/Brand Site
 *
 * v3 — full site refinement:
 * — Rule of Life cards: lifted backgrounds, warmer borders, better image opacity
 * — Architecture pillar spacing tightened
 * — Gear section: light but textured, warm gradient, tracking fixed
 * — Footer: full presence, brand closing statement, scroll animations
 * — Section dividers consistent throughout
 * — Brand statement bridge between Rule and Gear
 * — Scroll animations on Gear cards and footer
 */

// ─── HOOKS ───────────────────────────────────────────────────────────────────

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

function cx(...classes) { return classes.filter(Boolean).join(" "); }

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function SafeImg({ src, alt, className, fallback = "/placeholder.png", ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => setImgSrc(src), [src]);
  return (
    <img
      src={imgSrc} alt={alt} className={className}
      onError={() => setImgSrc(fallback)} loading="lazy" {...rest}
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
    <div ref={cardRef} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

// Consistent section divider used between every major section
function SectionDivider({ light = false }) {
  return (
    <div className={cx("flex items-center justify-center py-6 px-4", light ? "bg-[#F5F2ED]" : "bg-[#0D0D12]")}>
      <div className={cx("flex-1 h-[1px]", light ? "bg-black/8" : "bg-white/5")} />
      <div className="mx-4 md:mx-8 opacity-[0.08]">
        <SafeImg src="/helmet.png"
          className={cx("w-6 h-6 md:w-8 md:h-8", light ? "" : "grayscale invert")}
          alt="" />
      </div>
      <div className={cx("flex-1 h-[1px]", light ? "bg-black/8" : "bg-white/5")} />
    </div>
  );
}

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

// ─── CINEMATIC HERO ───────────────────────────────────────────────────────────

function CinematicHero() {
  const heroRef            = useRef(null);
  const bgGlowRef          = useRef(null);
  const vBeamRef           = useRef(null);
  const hBeamRef           = useRef(null);
  const bloomRef           = useRef(null);
  const particlesRef       = useRef(null);
  const logoGroupRef       = useRef(null);
  const headingRef         = useRef(null);
  const sublineRef         = useRef(null);
  const microcopyRef       = useRef(null);
  const ctaRef             = useRef(null);
  const scriptureRef       = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Initial states
      gsap.set(
        [bgGlowRef.current, vBeamRef.current, hBeamRef.current, bloomRef.current,
         logoGroupRef.current, headingRef.current, sublineRef.current,
         microcopyRef.current, ctaRef.current, scriptureRef.current, scrollIndicatorRef.current],
        { opacity: 0 }
      );
      gsap.set(vBeamRef.current,       { height: "0vh" });
      gsap.set(hBeamRef.current,       { width: "0vw" });
      gsap.set(bloomRef.current,       { scale: 0.7 });
      gsap.set(logoGroupRef.current,   { y: 18, filter: "blur(10px)" });
      gsap.set(headingRef.current,     { y: 28, filter: "blur(12px)" });
      gsap.set(sublineRef.current,     { y: 20, filter: "blur(8px)" });
      gsap.set(microcopyRef.current,   { y: 16, filter: "blur(6px)" });
      gsap.set(ctaRef.current,         { y: 18, filter: "blur(8px)" });
      gsap.set(scriptureRef.current,   { y: 10, filter: "blur(4px)" });

      // Reveal timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(bgGlowRef.current, { opacity: 1, duration: 1.4 })
        .to(vBeamRef.current,       { opacity: 0.82, height: "84vh", duration: 1.6 }, "-=0.6")
        .to(hBeamRef.current,       { opacity: 0.52, width: "28vw",  duration: 1.1 }, "-=0.6")
        .to(bloomRef.current,       { opacity: 0.7,  scale: 1,       duration: 1.6 }, "-=0.8")
        .to(particlesRef.current,   { opacity: 0.55,                 duration: 1.2 }, "-=0.9")
        .to(logoGroupRef.current,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 }, "-=0.7")
        .to(headingRef.current,     { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 }, "-=0.5")
        .to(sublineRef.current,     { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, "-=0.55")
        .to(microcopyRef.current,   { opacity: 0.8, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.45")
        .to(ctaRef.current,         { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.4")
        .to(scriptureRef.current,   { opacity: 0.25, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.35")
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.7 }, "-=0.3");

      // Cross fades out at 5s — overwrite kills any competing tweens
      gsap.to([vBeamRef.current, hBeamRef.current, bloomRef.current],
        { opacity: 0, duration: 2.5, ease: "power2.inOut", delay: 5, overwrite: true });

      // Ambient breathing — bg glow and particles only (cross is gone)
      gsap.to(bgGlowRef.current,  { x: 12, y: -10, duration: 9,  repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });
      gsap.to(particlesRef.current, { y: -14,        duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });

      // Scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, { y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 5.2 });

      // Mouse micro-parallax
      const hero = heroRef.current;
      const onMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const dur = { duration: 1.8, overwrite: "auto", ease: "power3.out" };
        gsap.to(bgGlowRef.current,    { x: x * 16, y: y * 14, ...dur });
        gsap.to(bloomRef.current,     { x: x * 10, y: y * 10, ...{ ...dur, duration: 1.5 } });
        gsap.to(vBeamRef.current,     { x: x * 4,              ...{ ...dur, duration: 1.4 } });
        gsap.to(hBeamRef.current,     { y: y * 4,              ...{ ...dur, duration: 1.4 } });
        gsap.to(particlesRef.current, { x: x * 8,  y: y * 6,  ...{ ...dur, duration: 2.2 } });
        gsap.to(logoGroupRef.current, { x: x * 5,  y: y * 4,  ...{ ...dur, duration: 1.3 } });
      };

      // Hide scroll indicator on scroll
      const onScroll = () => {
        if (window.scrollY > 60)
          gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.4 });
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
    <section ref={heroRef} id="top"
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center bg-[#04070d]">

      {/* Static base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(171,122,68,0.14),transparent_26%),radial-gradient(circle_at_55%_48%,rgba(32,64,120,0.10),transparent_32%),linear-gradient(to_bottom,rgba(2,6,16,0.92),rgba(1,4,10,1))]" />

      {/* Ambient glow */}
      <div ref={bgGlowRef} className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(171,122,68,0.04) 18%, transparent 44%)", filter: "blur(56px)" }} />

      {/* Cross bloom — at crossbar intersection */}
      <div ref={bloomRef} className="absolute left-1/2 pointer-events-none opacity-0"
        style={{ top: "28%", transform: "translate(-50%, -50%)", width: "44rem", height: "44rem", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(145,172,255,0.07) 20%, rgba(171,122,68,0.05) 36%, transparent 60%)",
          filter: "blur(48px)" }} />

      {/* Vertical beam — full Latin cross height */}
      <div ref={vBeamRef} className="absolute left-1/2 -translate-x-1/2 w-[2px] pointer-events-none opacity-0"
        style={{ top: "8%", height: "0vh",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 8%, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.70) 72%, rgba(255,255,255,0.40) 88%, transparent 100%)",
          boxShadow: "0 0 20px rgba(255,255,255,0.48), 0 0 40px rgba(180,210,255,0.20)", filter: "blur(0.4px)", transformOrigin: "top center" }} />

      {/* Horizontal bar — upper third = Latin cross proportion */}
      <div ref={hBeamRef} className="absolute left-1/2 -translate-x-1/2 h-[2px] pointer-events-none opacity-0"
        style={{ top: "28%", width: "0vw",
          background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.14) 8%, rgba(255,255,255,0.68) 50%, rgba(255,255,255,0.14) 92%, transparent 100%)",
          boxShadow: "0 0 14px rgba(255,255,255,0.24), 0 0 28px rgba(180,210,255,0.14)" }} />

      {/* Atmosphere particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: `radial-gradient(circle at 28% 38%, rgba(255,255,255,0.16) 0.7px, transparent 1px),
            radial-gradient(circle at 62% 54%, rgba(255,255,255,0.11) 0.8px, transparent 1.2px),
            radial-gradient(circle at 44% 68%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px),
            radial-gradient(circle at 54% 28%, rgba(255,255,255,0.11) 0.7px, transparent 1px),
            radial-gradient(circle at 72% 44%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px),
            radial-gradient(circle at 18% 60%, rgba(255,255,255,0.07) 0.8px, transparent 1.2px),
            radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08) 0.7px, transparent 1px)`,
          backgroundSize: "320px 320px, 420px 420px, 360px 360px, 500px 500px, 380px 380px, 440px 440px, 350px 350px",
          filter: "blur(0.2px)" }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, transparent 36%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0.70) 100%)" }} />

      {/* Content stack */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10 text-center">

        <div ref={logoGroupRef} className="mb-6 md:mb-8 opacity-0">
          <SafeImg src="/full-logo.png"
            className="w-[200px] md:w-[500px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[38vh] object-contain"
            alt="Counter Formation" />
        </div>

        <h1 ref={headingRef}
          className="font-brand text-xl md:text-5xl uppercase tracking-[0.28em] md:tracking-[0.4em] leading-tight text-white px-2 opacity-0">
          Formed in Christ.
        </h1>

        <p ref={sublineRef}
          className="mt-3 md:mt-4 font-brand italic text-sm md:text-4xl opacity-40 tracking-normal lowercase opacity-0">
          Living Counter to Culture.
        </p>

        <p ref={microcopyRef}
          className="mt-4 md:mt-5 max-w-xs md:max-w-xl mx-auto text-[8px] md:text-xs opacity-0 tracking-[0.18em] md:tracking-[0.26em] uppercase leading-relaxed font-light text-white/60">
          Intentional formation in a world designed for drift.
        </p>

        <div ref={ctaRef}
          className="mt-8 md:mt-10 flex flex-col md:flex-row gap-3 md:gap-5 justify-center items-center w-full max-w-sm md:max-w-none opacity-0">
          <a href="#architecture"
            className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-white/5 text-white rounded-full text-[9px] md:text-[10px] border border-white/10 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all uppercase tracking-widest font-bold">
            Explore the Architecture
          </a>
          <a href={SHOPIFY_URL}
            className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#FAF8F5] text-black rounded-full text-[9px] md:text-[10px] border-2 border-[#C9A84C] hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-3 uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(201,168,76,0.18)]">
            Shop the Gear <ArrowRight size={14} />
          </a>
        </div>

        <div ref={scriptureRef} className="mt-8 md:mt-10 text-[0.62rem] uppercase tracking-[0.38em] text-white/25 opacity-0">
          Ephesians 6:10–18
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20">
        <span className="text-[7px] uppercase tracking-[0.35em] text-white/30">Scroll</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="text-white/25">
          <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyScrollLock(isMenuOpen);
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.from(".nav-fade", { opacity: 0, y: -10, duration: 0.9, ease: "power2.out", delay: 0.3 });

      // Pillar reveals
      gsap.utils.toArray(".pillar-reveal").forEach((pillar) => {
        gsap.from(pillar, {
          y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: pillar, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });

      // Batch scroll reveals — cards, manifesto, footer items
      const batchReveal = (selector, y = 20) => {
        ScrollTrigger.batch(selector, {
          start: "top 90%",
          onEnter: (batch) =>
            gsap.fromTo(batch,
              { opacity: 0, y },
              { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: "power2.out", overwrite: "auto" }
            ),
        });
      };

      batchReveal(".manifesto-item");
      batchReveal(".product-card", 24);
      batchReveal(".footer-reveal", 16);

      // Brand bridge statement
      gsap.from(".bridge-line", {
        opacity: 0, y: 30, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".bridge-line", start: "top 82%", toggleActions: "play none none reverse" },
      });
      gsap.from(".bridge-rule", {
        scaleX: 0, duration: 1.0, ease: "power3.out", transformOrigin: "left center",
        scrollTrigger: { trigger: ".bridge-rule", start: "top 85%", toggleActions: "play none none reverse" },
      });

    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef}
      className="bg-[#0D0D12] text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans">

      {/* ── NAVBAR ── */}
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
          <a href={SHOPIFY_URL}
            className="px-4 py-2 md:px-6 md:py-2 bg-white text-black rounded-full text-[9px] md:text-[10px] hidden md:block hover:bg-[#C9A84C] transition-all uppercase tracking-widest font-bold">
            Shop the Gear
          </a>
          <button onClick={() => setIsMenuOpen((v) => !v)} className="md:hidden p-1" aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={cx(
        "fixed inset-0 z-[120] bg-[#0D0D12] flex flex-col items-center justify-center space-y-8 transition-transform duration-500",
        isMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8"><X size={28} /></button>
        {["Mission", "Rule", "Shop"].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}
            className="font-brand text-xl tracking-[0.3em] uppercase">{item}</a>
        ))}
        <a href={SHOPIFY_URL}
          className="text-[10px] text-[#C9A84C] tracking-widest uppercase border border-[#C9A84C]/20 px-8 py-3 rounded-full">
          Enter Store
        </a>
      </div>

      {/* ── HERO ── */}
      <CinematicHero />

      <SectionDivider />

      {/* ── ARCHITECTURE OF THE SOUL ── */}
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

          {/* Tightened from space-y-64 to space-y-48 — still spacious, less waiting */}
          <div className="space-y-32 md:space-y-48">

            {/* Identity */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">I</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">Identity</h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md tracking-widest">
                  Before action comes being. Counter Formation begins by anchoring your identity in Christ —
                  not performance, not platform, not approval.
                </p>
              </div>
              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg src="/Identity_8k.png" alt="Identity"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
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
                <SafeImg src="/Practice_8k.png" alt="Practice"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
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
                <SafeImg src="/Community_8k.png" alt="Community"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── RULE OF LIFE ── */}
      {/* Slightly lighter bg (#111116) to separate visually from surrounding sections */}
      <section id="rule" className="py-24 md:py-48 px-4 md:px-6 bg-[#111116] relative overflow-hidden">

        {/* Faint warm texture overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(201,168,76,1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(201,168,76,1) 0%, transparent 50%)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <span className="text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">The Pattern</span>
              <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.15em] text-white leading-none">Rule of Life</h2>
            </div>
            <p className="max-w-md text-xs md:text-base opacity-55 leading-relaxed font-light text-left md:text-right">
              A curated set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
            {[
              { title: "Presence",  desc: "Attention before God",    bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600" },
              { title: "Scripture", desc: "Truth before noise",       bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600" },
              { title: "Prayer",    desc: "Dependence before action", bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600" },
              { title: "Sabbath",   desc: "Rest before production",   bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600" },
              { title: "Community", desc: "Formation together",       bg: "/Community_8k.png" },
            ].map((rhythm, i) => (
              <div key={rhythm.title}
                className="manifesto-item group relative border p-6 md:p-8 flex flex-col justify-between min-h-[280px] md:min-h-[440px] transition-all duration-500 overflow-hidden rounded-2xl md:rounded-none hover:-translate-y-1 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.055)",
                  borderColor: "rgba(255,255,255,0.10)",
                  borderTopColor: "rgba(201,168,76,0.25)", // bronze top accent
                }}>

                {/* Background image — brighter at rest, fuller on hover */}
                <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-55 transition-opacity duration-700">
                  <SafeImg src={rhythm.bg} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>

                {/* Gradient — shorter so more image shows at top */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#111116] via-[#111116]/55 to-transparent" />

                <div className="space-y-3 relative z-10">
                  <span className="block font-mono text-[8px] text-[#C9A84C]/70 tracking-[0.3em] group-hover:text-[#C9A84C] transition-colors">
                    RHYTHM 0{i + 1}
                  </span>
                  <h3 className="font-brand text-base md:text-xl uppercase tracking-[0.1em] text-white">{rhythm.title}</h3>
                </div>

                <p className="text-[10px] md:text-[12px] opacity-55 tracking-wide leading-relaxed font-light relative z-10 group-hover:opacity-75 transition-opacity duration-500">
                  {rhythm.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ── BRAND STATEMENT BRIDGE ──
          Closes the formation chapter. Opens the commerce chapter.
          "Armor isn't decoration. It's declaration."
          Echoes Ephesians 6, ties shield/sword identity to the gear below.
      ── */}
      <section className="py-20 md:py-32 px-6 bg-[#0D0D12] relative overflow-hidden">

        {/* Very faint cross watermark in background */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ opacity: 0.025, fontSize: "clamp(12rem, 30vw, 28rem)", lineHeight: 1 }}
          aria-hidden="true">
          <span className="font-brand text-white uppercase tracking-widest">CF</span>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">

          {/* Top bronze rule */}
          <div className="bridge-rule w-16 h-[1px] bg-[#C9A84C]/40 mx-auto mb-10 md:mb-14" />

          {/* The statement */}
          <p className="bridge-line font-brand text-3xl md:text-6xl lg:text-7xl uppercase tracking-[0.12em] md:tracking-[0.18em] text-white leading-tight">
            Armor isn't decoration.
            <br />
            <span className="text-[#C9A84C]">It's declaration.</span>
          </p>

          {/* Scripture anchor */}
          <p className="bridge-line mt-8 md:mt-10 text-[0.65rem] uppercase tracking-[0.42em] text-white/30">
            Ephesians 6:11 — Put on the full armor of God
          </p>

          {/* Bottom bronze rule */}
          <div className="bridge-rule w-16 h-[1px] bg-[#C9A84C]/40 mx-auto mt-10 md:mt-14" />
        </div>
      </section>

      {/* ── THE GEAR ── */}
      {/* Light section but with warmth and texture — not flat white */}
      <section id="shop" className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden text-[#0D0D12]"
        style={{ background: "linear-gradient(160deg, #F5F2ED 0%, #EDE9E2 50%, #F0EDE7 100%)" }}>

        {/* Subtle noise/grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px" }} />

        {/* Warm top gradient fade from dark section */}
        <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, rgba(13,13,18,0.08), transparent)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12 mb-12 md:mb-20">
            <div>
              <span className="block text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase font-bold mb-3">The Gear</span>
              <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.08em]">Wear the Pattern.</h2>
            </div>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] opacity-40 max-w-sm text-left md:text-right font-bold">
              Apparel as a visual anchor.<br />Every piece tied to the formation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Technical Tee", img: "/DriFit_Black.png", link: "/collections/the-gear", copy: "Performance tech for training." },
              { name: "Everyday Tee",  img: "/Tshirt_1.jpg",     link: "/collections/the-gear", copy: "Premium soft-wash cotton." },
              { name: "Hoodies",       img: "/shield-black.png", link: "/collections/the-gear", copy: "Heavyweight anchors.", comingSoon: true },
            ].map((cat) => (
              <TiltCard key={cat.name} disabled={cat.comingSoon}
                className="product-card group relative overflow-hidden bg-black aspect-[3/4] rounded-[2rem] md:rounded-[3rem] transition-transform duration-700 hover:-translate-y-2 md:hover:-translate-y-4 shadow-xl">
                <a href={cat.comingSoon ? undefined : `${SHOPIFY_URL}${cat.link}`}
                  target="_blank" rel="noopener noreferrer"
                  className={cx("block h-full relative", cat.comingSoon && "pointer-events-none")}>
                  <div className="absolute inset-0 opacity-60 group-hover:opacity-90 grayscale group-hover:grayscale-0 transition-all duration-1000">
                    <SafeImg src={cat.img} className="w-full h-full object-cover" alt={cat.name} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-end text-white">
                    <h3 className="font-brand text-2xl md:text-4xl uppercase italic">{cat.name}</h3>
                    <p className="text-[9px] md:text-[10px] opacity-60 uppercase mt-2 tracking-widest">{cat.copy}</p>
                    {cat.comingSoon && (
                      <span className="mt-3 text-[8px] uppercase tracking-[0.3em] text-[#C9A84C]/60">Coming Soon</span>
                    )}
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

      <SectionDivider light />

      {/* ── FOOTER ── */}
      {/* Full presence — closing brand statement, not a whisper */}
      <footer className="bg-[#0D0D12] pt-20 md:pt-32 pb-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">

          {/* Closing brand statement — large, confident */}
          <div className="footer-reveal text-center mb-16 md:mb-24 border-b border-white/[0.06] pb-16 md:pb-24">
            <SafeImg src="/full-logo.png"
              className="w-[160px] md:w-[280px] mx-auto mb-8 opacity-80 object-contain"
              alt="Counter Formation" />
            <p className="font-brand text-2xl md:text-5xl uppercase tracking-[0.15em] md:tracking-[0.22em] text-white/80 leading-tight max-w-3xl mx-auto">
              Formed in Christ.<br />
              <span className="opacity-40 italic font-serif lowercase tracking-normal text-xl md:text-4xl">Not drifting.</span>
            </p>
            <p className="mt-6 text-[0.65rem] uppercase tracking-[0.38em] text-[#C9A84C]/50">
              Ephesians 6:10–18
            </p>
          </div>

          {/* Footer links */}
          <div className="footer-reveal grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 mb-16">
            <div className="space-y-5">
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#C9A84C]">Navigate</span>
              <a href="#architecture" className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all">Mission</a>
              <a href="#rule" className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all">Rule of Life</a>
              <a href="#shop" className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all">The Gear</a>
            </div>
            <div className="space-y-5">
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#C9A84C]">Shop</span>
              <a href={SHOPIFY_URL} className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all" target="_blank" rel="noopener noreferrer">All Gear</a>
              <a href={SHOPIFY_URL} className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all" target="_blank" rel="noopener noreferrer">Technical Tee</a>
              <a href={SHOPIFY_URL} className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all" target="_blank" rel="noopener noreferrer">Everyday Tee</a>
            </div>
            <div className="space-y-5">
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#C9A84C]">Connect</span>
              <a href="#" className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all">Instagram</a>
              <a href="#" className="block text-[10px] tracking-widest opacity-50 hover:opacity-100 hover:text-[#C9A84C] transition-all">Email</a>
            </div>
            <div className="space-y-5">
              <span className="block text-[8px] uppercase tracking-[0.3em] text-[#C9A84C]">Formation</span>
              <p className="text-[10px] tracking-wide opacity-40 leading-relaxed font-light max-w-[160px]">
                Intentional formation in a world designed for drift.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="footer-reveal text-center opacity-25 text-[8px] tracking-[0.3em] border-t border-white/5 pt-8">
            © 2026 COUNTER FORMATION • DISCIPLINE • PRESENCE • FORMATION
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CounterFormation;
