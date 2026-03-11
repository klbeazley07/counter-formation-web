import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Menu, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counter Formation — Movement/Brand Site
 * v3 — Full site refinements:
 * 1. Rule of Life cards — lighter bg, warmer, more readable, bronze top accent
 * 2. Architecture pillar spacing tightened (space-y-64 → space-y-40)
 * 3. Gear section — warm #F5F2EC bg, subtle grain texture, fixed tracking
 * 4. Footer — large closing brand statement, more presence, full link set
 * 5. Section dividers added consistently between all sections
 * 6. Scroll animations extended to Gear cards and footer elements
 * 7. Brand statement bridge between Rule and Gear
 */

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = orig; };
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

function SafeImg({ src, alt, className, fallback = "/placeholder.png", ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => setImgSrc(src), [src]);
  return (
    <img src={imgSrc} alt={alt} className={className}
      onError={() => setImgSrc(fallback)} loading="lazy" {...rest} />
  );
}

function TiltCard({ children, className, disabled }) {
  const cardRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (disabled || window.innerWidth < 768) return;
    const card = cardRef.current; if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale3d(1.01,1.01,1.01)`;
  }, [disabled]);
  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);
  return (
    <div ref={cardRef} className={className}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-6 px-4">
      <div className="flex-1 h-[1px] bg-white/5" />
      <div className="mx-4 md:mx-8 opacity-[0.08]">
        <SafeImg src="/helmet.png" className="w-6 h-6 md:w-8 md:h-8 grayscale invert" alt="" />
      </div>
      <div className="flex-1 h-[1px] bg-white/5" />
    </div>
  );
}

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

/* ─── CINEMATIC HERO ─── */
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
      gsap.set([bgGlowRef.current, vBeamRef.current, hBeamRef.current,
        bloomRef.current, logoGroupRef.current, headingRef.current,
        sublineRef.current, microcopyRef.current, ctaRef.current,
        scriptureRef.current, scrollIndicatorRef.current], { opacity: 0 });
      gsap.set(vBeamRef.current,     { height: "0vh" });
      gsap.set(hBeamRef.current,     { width: "0vw" });
      gsap.set(bloomRef.current,     { scale: 0.7 });
      gsap.set(logoGroupRef.current, { y: 18, filter: "blur(10px)" });
      gsap.set(headingRef.current,   { y: 28, filter: "blur(12px)" });
      gsap.set(sublineRef.current,   { y: 20, filter: "blur(8px)" });
      gsap.set(microcopyRef.current, { y: 16, filter: "blur(6px)" });
      gsap.set(ctaRef.current,       { y: 18, filter: "blur(8px)" });
      gsap.set(scriptureRef.current, { y: 10, filter: "blur(4px)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(bgGlowRef.current,          { opacity: 1,    duration: 1.4 })
        .to(vBeamRef.current,           { opacity: 0.82, height: "84vh", duration: 1.6 }, "-=0.6")
        .to(hBeamRef.current,           { opacity: 0.52, width: "28vw",  duration: 1.1 }, "-=0.6")
        .to(bloomRef.current,           { opacity: 0.7,  scale: 1,       duration: 1.6 }, "-=0.8")
        .to(particlesRef.current,       { opacity: 0.55,                 duration: 1.2 }, "-=0.9")
        .to(logoGroupRef.current,       { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 }, "-=0.7")
        .to(headingRef.current,         { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 }, "-=0.5")
        .to(sublineRef.current,         { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, "-=0.55")
        .to(microcopyRef.current,       { opacity: 0.8, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.45")
        .to(ctaRef.current,             { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.4")
        .to(scriptureRef.current,       { opacity: 0.25, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.35")
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.7 }, "-=0.3");

      gsap.to(bgGlowRef.current,    { x: 12, y: -10, duration: 9,  repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });
      gsap.to(particlesRef.current, { y: -14,         duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });

      // Cross fade-out at 5s — added to the timeline so it plays in sequence
      // and can't clobber the reveal tweens that run before it
      tl.to([vBeamRef.current, hBeamRef.current, bloomRef.current],
        { opacity: 0, duration: 2.5, ease: "power2.inOut" }, "+=2.5");

      gsap.to(scrollIndicatorRef.current, { y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 5.2 });

      const hero = heroRef.current;
      const onMouseMove = (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        const d = { overwrite: "auto", ease: "power3.out" };
        gsap.to(bgGlowRef.current,    { x: x * 16, y: y * 14, duration: 1.8, ...d });
        gsap.to(bloomRef.current,     { x: x * 10, y: y * 10, duration: 1.5, ...d });
        gsap.to(vBeamRef.current,     { x: x * 4,             duration: 1.4, ...d });
        gsap.to(hBeamRef.current,     { y: y * 4,             duration: 1.4, ...d });
        gsap.to(particlesRef.current, { x: x * 8, y: y * 6,  duration: 2.2, ...d });
        gsap.to(logoGroupRef.current, { x: x * 5, y: y * 4,  duration: 1.3, ...d });
      };
      const onScroll = () => {
        if (window.scrollY > 60) gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.4 });
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(171,122,68,0.14),transparent_26%),radial-gradient(circle_at_55%_48%,rgba(32,64,120,0.10),transparent_32%),linear-gradient(to_bottom,rgba(2,6,16,0.92),rgba(1,4,10,1))]" />
      <div ref={bgGlowRef} className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(171,122,68,0.04) 18%, transparent 44%)", filter: "blur(56px)" }} />
      <div ref={bloomRef} className="absolute left-1/2 pointer-events-none opacity-0"
        style={{ top: "28%", transform: "translate(-50%, -50%)", width: "44rem", height: "44rem", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(145,172,255,0.07) 20%, rgba(171,122,68,0.05) 36%, transparent 60%)",
          filter: "blur(48px)" }} />
      <div ref={vBeamRef} className="absolute left-1/2 -translate-x-1/2 w-[2px] pointer-events-none opacity-0"
        style={{ top: "8%", height: "0vh", transformOrigin: "top center",
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 8%, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.92) 42%, rgba(255,255,255,0.70) 72%, rgba(255,255,255,0.40) 88%, transparent 100%)",
          boxShadow: "0 0 20px rgba(255,255,255,0.48), 0 0 40px rgba(180,210,255,0.20)", filter: "blur(0.4px)" }} />
      <div ref={hBeamRef} className="absolute left-1/2 -translate-x-1/2 h-[2px] pointer-events-none opacity-0"
        style={{ top: "28%", width: "0vw",
          background: "linear-gradient(to right, transparent 0%, rgba(255,255,255,0.14) 8%, rgba(255,255,255,0.68) 50%, rgba(255,255,255,0.14) 92%, transparent 100%)",
          boxShadow: "0 0 14px rgba(255,255,255,0.24), 0 0 28px rgba(180,210,255,0.14)" }} />
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: `radial-gradient(circle at 28% 38%, rgba(255,255,255,0.16) 0.7px, transparent 1px),radial-gradient(circle at 62% 54%, rgba(255,255,255,0.11) 0.8px, transparent 1.2px),radial-gradient(circle at 44% 68%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px),radial-gradient(circle at 54% 28%, rgba(255,255,255,0.11) 0.7px, transparent 1px),radial-gradient(circle at 72% 44%, rgba(255,255,255,0.09) 0.8px, transparent 1.2px),radial-gradient(circle at 18% 60%, rgba(255,255,255,0.07) 0.8px, transparent 1.2px),radial-gradient(circle at 80% 30%, rgba(255,255,255,0.08) 0.7px, transparent 1px)`,
          backgroundSize: "320px 320px,420px 420px,360px 360px,500px 500px,380px 380px,440px 440px,350px 350px",
          filter: "blur(0.2px)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center, transparent 36%, rgba(0,0,0,0.40) 70%, rgba(0,0,0,0.70) 100%)" }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10 text-center">
        <div ref={logoGroupRef} className="mb-6 md:mb-8 opacity-0">
          <SafeImg src="/full-logo.png"
            className="w-[200px] md:w-[500px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[38vh] object-contain"
            alt="Counter Formation" />
        </div>
        <h1 ref={headingRef} className="font-brand text-xl md:text-5xl uppercase tracking-[0.28em] md:tracking-[0.4em] leading-tight text-white px-2 opacity-0">
          Formed in Christ.
        </h1>
        <p ref={sublineRef} className="mt-3 md:mt-4 font-brand italic text-sm md:text-4xl opacity-40 tracking-normal lowercase opacity-0">
          Living Counter to Culture.
        </p>
        <p ref={microcopyRef} className="mt-4 md:mt-5 max-w-xs md:max-w-xl mx-auto text-[8px] md:text-xs opacity-0 tracking-[0.18em] md:tracking-[0.26em] uppercase leading-relaxed font-light text-white/60">
          Intentional formation in a world designed for drift.
        </p>
        <div ref={ctaRef} className="mt-8 md:mt-10 flex flex-col md:flex-row gap-3 md:gap-5 justify-center items-center w-full max-w-sm md:max-w-none opacity-0">
          <a href="#architecture" className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-white/5 text-white rounded-full text-[9px] md:text-[10px] border border-white/10 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all uppercase tracking-widest font-bold">
            Explore the Architecture
          </a>
          <a href={SHOPIFY_URL} className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#FAF8F5] text-black rounded-full text-[9px] md:text-[10px] border-2 border-[#C9A84C] hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-3 uppercase tracking-widest font-bold shadow-[0_0_24px_rgba(201,168,76,0.18)]">
            Shop the Gear <ArrowRight size={14} />
          </a>
        </div>
        <div ref={scriptureRef} className="mt-8 md:mt-10 text-[0.62rem] uppercase tracking-[0.38em] text-white/25 opacity-0">
          Ephesians 6:10–18
        </div>
      </div>

      <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20">
        <span className="text-[7px] uppercase tracking-[0.35em] text-white/30">Scroll</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="text-white/25">
          <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

/* ─── MAIN APP ─── */
const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useBodyScrollLock(isMenuOpen);
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-fade", { opacity: 0, y: -10, duration: 0.9, ease: "power2.out", delay: 0.3 });
      gsap.utils.toArray(".pillar-reveal").forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });
      const batchReveal = (selector, y = 20) => {
        ScrollTrigger.batch(selector, {
          start: "top 92%",
          onEnter: (batch) => gsap.fromTo(batch,
            { opacity: 0, y },
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: "power2.out", overwrite: "auto" }),
        });
      };
      batchReveal(".manifesto-item");
      batchReveal(".product-card", 24);
      batchReveal(".footer-reveal", 16);
      batchReveal(".bridge-reveal", 30);
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#0D0D12] text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans">

      {/* NAVBAR */}
      <nav className="nav-fade fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 bg-[#0D0D12]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 md:gap-3">
          <SafeImg src="/helmet.png" className="h-6 w-6 md:h-8 md:w-8 object-contain" alt="Counter Formation" />
          <span className="font-brand text-[9px] md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase whitespace-nowrap">Counter Formation</span>
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 mr-4 text-[10px] uppercase tracking-widest font-brand font-bold">
            <a href="#architecture" className="hover:text-[#C9A84C] transition-colors">Mission</a>
            <a href="#rule"         className="hover:text-[#C9A84C] transition-colors">Rule</a>
            <a href="#shop"         className="hover:text-[#C9A84C] transition-colors text-[#C9A84C]">Gear</a>
          </div>
          <a href={SHOPIFY_URL} className="px-4 py-2 md:px-6 md:py-2 bg-white text-black rounded-full text-[9px] md:text-[10px] hidden md:block hover:bg-[#C9A84C] transition-all uppercase tracking-widest font-bold">
            Shop the Gear
          </a>
          <button onClick={() => setIsMenuOpen(v => !v)} className="md:hidden p-1" aria-label="Toggle menu"><Menu size={20} /></button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={cx("fixed inset-0 z-[120] bg-[#0D0D12] flex flex-col items-center justify-center space-y-8 transition-transform duration-500",
        isMenuOpen ? "translate-y-0" : "-translate-y-full")}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8"><X size={28} /></button>
        {["Mission", "Rule", "Shop"].map(item => (
          <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}
            className="font-brand text-xl tracking-[0.3em] uppercase">{item}</a>
        ))}
        <a href={SHOPIFY_URL} className="text-[10px] text-[#C9A84C] tracking-widest uppercase border border-[#C9A84C]/20 px-8 py-3 rounded-full">Enter Store</a>
      </div>

      {/* HERO */}
      <CinematicHero />
      <SectionDivider />

      {/* ARCHITECTURE OF THE SOUL */}
      <section id="architecture" className="relative bg-[#0D0D12] py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-24 text-center md:text-left space-y-4">
            <h2 className="font-brand text-2xl md:text-5xl uppercase tracking-[0.15em] md:tracking-[0.2em] leading-none text-white">
              Architecture <br /><span className="opacity-30 italic font-serif lowercase tracking-normal">of the</span> Soul
            </h2>
            <p className="max-w-2xl text-[10px] md:text-sm opacity-55 tracking-[0.1em] md:tracking-[0.18em] uppercase leading-relaxed font-light">
              Identity anchors the heart. Practice builds discipline. Community protects the journey.
            </p>
          </div>
          {/* Tightened from space-y-64 to space-y-40 */}
          <div className="space-y-32 md:space-y-40">
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

      <SectionDivider />

      {/* RULE OF LIFE — lifted to #16161E, warmer, bronze accents */}
      <section id="rule" className="py-24 md:py-48 px-4 md:px-6 bg-[#16161E] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.04) 0%, transparent 65%)" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 md:mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <span className="text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">The Pattern</span>
              <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.15em] text-white leading-none">Rule of Life</h2>
            </div>
            <p className="max-w-md text-xs md:text-base opacity-50 leading-relaxed font-light text-left md:text-right">
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
                className="manifesto-item group relative overflow-hidden rounded-2xl md:rounded-none transition-all duration-500 cursor-default"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", minHeight: "320px",
                  transition: "border-color 0.4s, background 0.4s, transform 0.4s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.30)"; e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(-5px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Bronze top accent line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent z-10" />
                {/* Image — more visible at rest */}
                <div className="absolute inset-0 z-0 opacity-35 group-hover:opacity-60 transition-opacity duration-700">
                  <SafeImg src={rhythm.bg} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                {/* Lighter overlay — image breathes through */}
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#16161E] via-[#16161E]/55 to-[#16161E]/15" />
                <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between" style={{ minHeight: "320px" }}>
                  <div className="space-y-3">
                    <span className="block font-mono text-[8px] text-[#C9A84C]/70 tracking-[0.3em] group-hover:text-[#C9A84C] transition-colors">RHYTHM 0{i + 1}</span>
                    <h3 className="font-brand text-base md:text-xl uppercase tracking-[0.1em] text-white">{rhythm.title}</h3>
                  </div>
                  {/* Opacity lifted from 0.35 → 0.60 */}
                  <p className="text-[10px] md:text-xs opacity-60 tracking-wide leading-relaxed font-light mt-6">{rhythm.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* BRAND STATEMENT BRIDGE */}
      <section className="relative bg-[#0D0D12] py-28 md:py-44 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 58%)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="bridge-reveal">
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/70 font-bold mb-8">On the Gear</p>
            <h2 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase leading-none tracking-[0.15em] md:tracking-[0.2em] text-white mb-6">
              The Gear Is Not<br /><span className="text-[#C9A84C]">The Mission.</span>
            </h2>
            <p className="font-brand italic text-xl md:text-3xl opacity-35 tracking-normal lowercase mb-10">It's a marker of it.</p>
            <p className="text-[9px] md:text-xs opacity-45 tracking-[0.22em] uppercase leading-loose font-light max-w-md mx-auto">
              What you wear is a declaration. Apparel as a visual anchor — a daily reminder of who you are and what you're formed for.
            </p>
            <div className="mt-10 text-[0.6rem] uppercase tracking-[0.4em] text-white/20">Ephesians 6:10–18</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
      </section>

      {/* THE GEAR — warm #F5F2EC, grain texture, premium */}
      <section id="shop" className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden"
        style={{
          backgroundColor: "#F5F2EC",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}>
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/6 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-[#0D0D12]">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12 mb-12 md:mb-20">
            {/* tracking-tighter → tracking-[0.08em] to match brand rhythm */}
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.08em]">The Gear</h2>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.25em] opacity-40 max-w-sm text-left md:text-right font-bold leading-relaxed">
              Apparel as a visual anchor.<br className="hidden md:block" />Wear the pattern.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Technical Tee", img: "/DriFit_Black.png", link: "/collections/the-gear", copy: "Performance tech for training." },
              { name: "Everyday Tee",  img: "/Tshirt_1.jpg",     link: "/collections/the-gear", copy: "Premium soft-wash cotton." },
              { name: "Hoodies",       img: "/shield-black.png", link: "/collections/the-gear", copy: "Heavyweight anchors.", comingSoon: true },
            ].map(cat => (
              <TiltCard key={cat.name} disabled={cat.comingSoon}
                className="product-card group relative overflow-hidden bg-black aspect-[3/4] rounded-[2rem] md:rounded-[3rem] transition-transform duration-700 hover:-translate-y-2 md:hover:-translate-y-4 shadow-2xl shadow-black/25">
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
                    {cat.comingSoon ? (
                      <p className="text-[8px] tracking-widest text-[#C9A84C]/70 uppercase mt-3">Coming Soon</p>
                    ) : (
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

      {/* FOOTER — commanding closing statement, full links */}
      <footer className="bg-[#0D0D12] border-t border-white/[0.06]">
        <div className="footer-reveal max-w-5xl mx-auto pt-24 md:pt-40 pb-16 md:pb-24 px-6 text-center border-b border-white/[0.05]">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/60 mb-8 font-bold">The Mission</p>
          <h3 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.12em] md:tracking-[0.18em] leading-none text-white mb-8">
            Formed in Christ.<br />
            <span className="opacity-25 italic font-serif lowercase tracking-normal text-3xl md:text-5xl">Not drifting.</span>
          </h3>
          <p className="text-[9px] md:text-xs opacity-35 tracking-[0.28em] uppercase max-w-sm mx-auto leading-loose">
            Intentional formation in a world designed for drift.
          </p>
        </div>
        <div className="footer-reveal max-w-7xl mx-auto py-14 px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
          <div className="col-span-2 md:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <SafeImg src="/helmet.png" className="w-8 h-8 md:w-10 md:h-10" alt="" />
              <span className="font-brand text-lg md:text-xl text-[#C9A84C]">Counter Formation</span>
            </div>
            <p className="text-[9px] uppercase tracking-widest opacity-30 leading-relaxed max-w-[180px]">
              Formed in Christ.<br />Living counter to culture.
            </p>
          </div>
          <div className="space-y-4 text-[9px] tracking-widest">
            <span className="text-[#C9A84C] opacity-60 uppercase block mb-5">Navigate</span>
            <a href="#architecture" className="block opacity-35 hover:opacity-70 hover:text-white transition-all">Mission</a>
            <a href="#rule"         className="block opacity-35 hover:opacity-70 hover:text-white transition-all">Rule of Life</a>
            <a href="#shop"         className="block opacity-35 hover:opacity-70 hover:text-white transition-all">The Gear</a>
          </div>
          <div className="space-y-4 text-[9px] tracking-widest">
            <span className="text-[#C9A84C] opacity-60 uppercase block mb-5">Connect</span>
            <a href="#" className="block opacity-35 hover:opacity-70 hover:text-white transition-all">Instagram</a>
            <a href="#" className="block opacity-35 hover:opacity-70 hover:text-white transition-all">Email</a>
          </div>
          <div className="space-y-4 text-[9px] tracking-widest">
            <span className="text-[#C9A84C] opacity-60 uppercase block mb-5">Shop</span>
            <a href={SHOPIFY_URL} className="block opacity-35 hover:opacity-70 hover:text-white transition-all">All Gear</a>
          </div>
        </div>
        <div className="footer-reveal border-t border-white/[0.04] py-8 px-6 flex flex-col md:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-20">© 2026 Counter Formation</p>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-15">Discipline · Presence · Formation</p>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-15">Ephesians 6:10–18</p>
        </div>
      </footer>

    </div>
  );
};

export default CounterFormation;
