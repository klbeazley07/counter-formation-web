import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Menu, X, ChevronRight } from "lucide-react";

import {
  FieldGuideStyles,
  FGLanding,
  FGOffice,
  FGPath,
  FGWhy,
  FGNewHere,
} from "./FieldGuide";

import { ChallengeStyles, CFLanding, CFDevotion } from "./SevenDayChallenge";
import DevotionGuide from "./DevotionGuide";
import { RuleStyles, RhythmPage, BookPage } from "./RuleOfLife";
import {
  ArchitectureStyles,
  ArchitectureSlider,
  PracticePage,
  CommunityPage,
} from "./Architecture";
import { IdentityLanding, ArmorPiecePlaceholder, ArmorStyles } from "./Identity";

gsap.registerPlugin(ScrollTrigger);

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";
const FG_BASE     = "/field-guide/scripture-before-scroll";

const C = {
  heroBg:   "#06050A",
  darkBg:   "#0E0C0A",
  ruleBg:   "#17140F",
  fieldBg:  "#111009",
  lightMid: "#F0EDE6",
  gearBg:   "#F5F2EC",
  gold:     "#C9A84C",
  ivory:    "#FAF8F5",
};

/* ─── UTILITIES ───────────────────────────────────────────────────── */

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
    const fn = (e) => { if (e.key === "Escape") handler?.(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handler, enabled]);
}

function cx(...cls) { return cls.filter(Boolean).join(" "); }

/* ─── SHARED COMPONENTS ───────────────────────────────────────────── */

function SafeImg({ src, alt, className, fallback = "/placeholder.png", ...rest }) {
  const [s, setS] = useState(src);
  useEffect(() => setS(src), [src]);
  return (
    <img src={s} alt={alt} className={className}
      onError={() => setS(fallback)} loading="lazy" {...rest} />
  );
}

function TiltCard({ children, className, disabled }) {
  const ref = useRef(null);
  const onMove = useCallback((e) => {
    if (disabled || window.innerWidth < 768 || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale3d(1.01,1.01,1.01)`;
  }, [disabled]);
  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform =
      "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2 }) {
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!ref.current || triggered.current) return;
    const el = ref.current;

    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        triggered.current = true;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          },
        });
      },
    });
  }, [target, suffix, prefix, duration]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-6 px-4"
      style={{ backgroundColor: C.darkBg }}>
      <div className="flex-1 h-[1px] bg-white/5" />
      <div className="mx-4 md:mx-8 opacity-[0.12]">
        <SafeImg src="/helmet.png" className="w-6 h-6 md:w-8 md:h-8 grayscale invert" alt="" />
      </div>
      <div className="flex-1 h-[1px] bg-white/5" />
    </div>
  );
}

/* ─── CINEMATIC HERO ──────────────────────────────────────────────── */

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
  const pathCard1Ref       = useRef(null);
  const pathCard2Ref       = useRef(null);
  const scriptureRef       = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([bgGlowRef.current, vBeamRef.current, hBeamRef.current,
        bloomRef.current, logoGroupRef.current, headingRef.current,
        sublineRef.current, microcopyRef.current, pathCard1Ref.current,
        pathCard2Ref.current, scriptureRef.current, scrollIndicatorRef.current], { opacity: 0 });
      gsap.set(vBeamRef.current,     { height: "0vh", xPercent: -50 });
      gsap.set(hBeamRef.current,     { width: "0vw",  xPercent: -50 });
      gsap.set(bloomRef.current,     { scale: 0.7 });
      gsap.set(logoGroupRef.current, { y: 18, filter: "blur(10px)" });
      gsap.set(headingRef.current,   { y: 28, filter: "blur(12px)" });
      gsap.set(sublineRef.current,   { y: 20, filter: "blur(8px)" });
      gsap.set(microcopyRef.current, { y: 16, filter: "blur(6px)" });
      gsap.set([pathCard1Ref.current, pathCard2Ref.current], { y: 18, filter: "blur(8px)" });
      gsap.set(scriptureRef.current, { y: 10, filter: "blur(4px)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(bgGlowRef.current,  { opacity: 1, duration: 1.4 })
        .to(vBeamRef.current,   { opacity: 0.82, height: window.innerWidth < 768 ? "52vh" : "84vh", duration: 1.6 }, "-=0.6")
        .to(hBeamRef.current,   { opacity: 0.52, width: "28vw", duration: 1.1 }, "-=0.6")
        .to(bloomRef.current,   { opacity: 0.7,  scale: 1,      duration: 1.6 }, "-=0.8")
        .to(particlesRef.current, { opacity: 0.55, duration: 1.2 }, "-=0.9")
        .to(logoGroupRef.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1 }, "-=0.7")
        .to(headingRef.current,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0 }, "-=0.5")
        .to(sublineRef.current,   { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, "-=0.55")
        .to(microcopyRef.current, { opacity: 0.8, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.45")
        .to(pathCard1Ref.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.4")
        .to(pathCard2Ref.current, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.7")
        .to(scriptureRef.current, { opacity: 0.25, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.35")
        .to(scrollIndicatorRef.current, { opacity: 1, duration: 0.7 }, "-=0.3")
        .to([vBeamRef.current, hBeamRef.current, bloomRef.current],
          { opacity: 0, duration: 2.5, ease: "power2.inOut" }, "+=2.5");

      gsap.to(bgGlowRef.current,    { x: 12, y: -10, duration: 9,  repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });
      gsap.to(particlesRef.current, { y: -14,         duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });
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
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center"
      style={{ backgroundColor: C.heroBg }}>
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 20% 12%,rgba(171,122,68,0.10),transparent 26%),radial-gradient(circle at 55% 48%,rgba(32,64,120,0.06),transparent 32%)" }} />
      <div ref={bgGlowRef} className="absolute inset-0 opacity-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center,rgba(255,255,255,0.06) 0%,rgba(171,122,68,0.04) 18%,transparent 44%)", filter: "blur(56px)" }} />
      <div ref={bloomRef} className="absolute left-1/2 pointer-events-none opacity-0"
        style={{ top: "28%", transform: "translate(-50%,-50%)", width: "44rem", height: "44rem", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,255,255,0.14) 0%,rgba(145,172,255,0.07) 20%,rgba(171,122,68,0.05) 36%,transparent 60%)",
          filter: "blur(48px)" }} />
      <div ref={vBeamRef} className="absolute w-[2px] pointer-events-none opacity-0"
        style={{ top: "8%", left: "50%", height: "0vh", transformOrigin: "top center",
          background: "linear-gradient(to bottom,transparent 0%,rgba(255,255,255,0.55) 8%,rgba(255,255,255,0.88) 28%,rgba(255,255,255,0.92) 42%,rgba(255,255,255,0.70) 72%,rgba(255,255,255,0.40) 88%,transparent 100%)",
          boxShadow: "0 0 20px rgba(255,255,255,0.48),0 0 40px rgba(180,210,255,0.20)", filter: "blur(0.4px)" }} />
      <div ref={hBeamRef} className="absolute h-[2px] pointer-events-none opacity-0"
        style={{ top: "28%", left: "50%", width: "0vw",
          background: "linear-gradient(to right,transparent 0%,rgba(255,255,255,0.14) 8%,rgba(255,255,255,0.68) 50%,rgba(255,255,255,0.14) 92%,transparent 100%)",
          boxShadow: "0 0 14px rgba(255,255,255,0.24),0 0 28px rgba(180,210,255,0.14)" }} />
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          backgroundImage: `radial-gradient(circle at 28% 38%,rgba(255,255,255,0.16) 0.7px,transparent 1px),radial-gradient(circle at 62% 54%,rgba(255,255,255,0.11) 0.8px,transparent 1.2px),radial-gradient(circle at 44% 68%,rgba(255,255,255,0.09) 0.8px,transparent 1.2px),radial-gradient(circle at 54% 28%,rgba(255,255,255,0.11) 0.7px,transparent 1px),radial-gradient(circle at 72% 44%,rgba(255,255,255,0.09) 0.8px,transparent 1.2px),radial-gradient(circle at 18% 60%,rgba(255,255,255,0.07) 0.8px,transparent 1.2px),radial-gradient(circle at 80% 30%,rgba(255,255,255,0.08) 0.7px,transparent 1px)`,
          backgroundSize: "320px 320px,420px 420px,360px 360px,500px 500px,380px 380px,440px 440px,350px 350px",
          filter: "blur(0.2px)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at center,transparent 36%,rgba(0,0,0,0.40) 70%,rgba(0,0,0,0.70) 100%)" }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 pb-10 text-center">
        <div ref={logoGroupRef} className="mb-6 md:mb-8 opacity-0">
          <SafeImg src="/shield-white.png"
            className="w-[260px] md:w-[500px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[42vh] object-contain"
            alt="Counter Formation" />
        </div>
        <h1 ref={headingRef}
          className="font-brand text-xl md:text-5xl uppercase tracking-[0.28em] md:tracking-[0.38em] leading-tight text-white px-2 opacity-0">
          Formed in Christ.
        </h1>
        <p ref={sublineRef}
          className="mt-3 md:mt-4 font-brand italic text-sm md:text-4xl opacity-35 lowercase opacity-0">
          Living Counter to Culture.
        </p>
        <div ref={microcopyRef} className="mt-5 md:mt-6 max-w-sm md:max-w-2xl mx-auto px-1 opacity-0">
          <p className="text-[11px] md:text-[9px] tracking-[0.28em] uppercase leading-loose font-light text-white/36">
            Limited drops. Purposeful design. Disciplined faith.
          </p>
        </div>
        {/* Mobile: two compact buttons */}
        <div ref={ctaRef} className="mt-10 md:hidden flex gap-3 justify-center px-6 opacity-0">
          <a ref={pathCard1Ref} href="#architecture"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-[10px] uppercase tracking-[0.18em] text-white font-bold transition-all duration-300 hover:border-[#C9A84C]/40">
            Enter the Formation <ArrowRight size={12} className="opacity-50 shrink-0" />
          </a>
          <a ref={pathCard2Ref} href="#shop"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white/[0.06] border border-white/[0.12] rounded-xl text-[10px] uppercase tracking-[0.18em] text-white font-bold transition-all duration-300 hover:border-[#C9A84C]/40">
            Shop the Gear <ArrowRight size={12} className="opacity-50 shrink-0" />
          </a>
        </div>
        {/* Desktop: full cards */}
        <div className="hidden md:flex mt-12 gap-6 justify-center items-stretch">
          <a href="#architecture"
            className="relative md:w-[280px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm rounded-2xl p-8 flex flex-col items-start text-left transition-all duration-300 hover:border-[#C9A84C]/30 hover:bg-white/[0.07] group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
            <h3 className="font-brand text-[13px] uppercase tracking-[0.22em] text-white mb-4">Enter the Formation</h3>
            <p className="text-[11px] tracking-[0.14em] uppercase leading-relaxed text-white/50 font-light">
              Architecture.<br />Practice.<br />Community.
            </p>
            <div className="mt-auto pt-6">
              <ArrowRight size={16} className="text-white/30 group-hover:text-[#C9A84C]/70 transition-colors duration-300" />
            </div>
          </a>
          <a href="#shop"
            className="relative md:w-[280px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm rounded-2xl p-8 flex flex-col items-start text-left transition-all duration-300 hover:border-[#C9A84C]/30 hover:bg-white/[0.07] group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
            <h3 className="font-brand text-[13px] uppercase tracking-[0.22em] text-white mb-4">Shop the Gear</h3>
            <p className="text-[11px] tracking-[0.14em] uppercase leading-relaxed text-white/50 font-light">
              Apparel as anchor.<br />Limited drops.
            </p>
            <div className="mt-auto pt-6">
              <ArrowRight size={16} className="text-white/30 group-hover:text-[#C9A84C]/70 transition-colors duration-300" />
            </div>
          </a>
        </div>
        <div ref={scriptureRef}
          className="mt-8 md:mt-10 text-[0.62rem] uppercase tracking-[0.35em] text-white/25 opacity-0">
          Ephesians 6:10–18
        </div>
      </div>

      <div ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20">
        <span className="text-[10px] uppercase tracking-[0.35em] text-white/40">Scroll</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="text-white/35">
          <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

/* ─── ARCHITECTURE OF THE SOUL ────────────────────────────────────── */

/* ─── RULE OF LIFE ────────────────────────────────────────────────── */

function CarouselDots({ count, activeIndex }) {
  return (
    <div className="flex justify-center gap-2 mt-6 md:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{ backgroundColor: i === activeIndex ? '#C9A84C' : 'rgba(255,255,255,0.2)' }} />
      ))}
    </div>
  );
}

function RuleOfLifeSection() {
  const rhythms = [
    { title: "Presence",  desc: "Attention before God",    slug: "presence",  bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600", summary: "Learning to abide in Christ so deeply that His presence overflows from your life into everything you touch." },
    { title: "Scripture", desc: "Truth before noise",       slug: "scripture", bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",    summary: "The world has a script for your day. So does God. Only one of them is true." },
    { title: "Prayer",    desc: "Dependence before action", slug: "prayer",    bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600",  summary: "You were never meant to figure this out alone. Prayer is the admission that you can't." },
    { title: "Sabbath",   desc: "Rest before production",   slug: "sabbath",   bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600",  summary: "A life that cannot stop is a life that does not trust. Sabbath is how you prove you believe God is in control." },
    { title: "Community", desc: "Formation together",       slug: "community", bg: "/Community_8k.png",                                                         summary: "You cannot be formed alone. The practices that change your life require people who will hold you to them." },
  ];

  const [activeRhythm, setActiveRhythm] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth >= 768) return;
    const cards = carouselRef.current?.children;
    if (!cards) return;
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

  return (
    <section id="rule" className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden"
      style={{ backgroundColor: C.ruleBg }}>
      <div className="section-bg-parallax section-glow absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10 lg:px-4 xl:px-8">
        <div className="mb-16 md:mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <span className="text-[11px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">The Pattern</span>
            <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.12em] text-white leading-none">
              Rule of Life
            </h2>
          </div>
          <p className="max-w-md text-xs md:text-base opacity-50 leading-relaxed font-light text-left md:text-right">
            A set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
          </p>
        </div>

        <div ref={carouselRef} className="rhythm-carousel">
          {rhythms.map((r, i) => (
            <Link key={r.title}
              to={`/rule-of-life/${r.slug}`}
              className="manifesto-item rhythm-card group relative overflow-hidden rounded-2xl md:rounded-none cursor-pointer"
              style={{ minHeight: "320px", textDecoration: "none", display: "flex", flexDirection: "column" }}>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent z-10" />
              <div className="rhythm-img-wrap absolute inset-0 z-0 opacity-35 group-hover:opacity-60 transition-opacity duration-700">
                <SafeImg src={r.bg} alt=""
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute inset-0 z-0"
                style={{ background: `linear-gradient(to top,${C.ruleBg},${C.ruleBg}88 55%,${C.ruleBg}26)` }} />
              <div className="relative z-10 p-6 md:p-8 flex flex-col" style={{ flex: 1 }}>
                <div className="space-y-3">
                  <span className="block font-mono text-[11px] text-[#C9A84C]/70 tracking-[0.3em] group-hover:text-[#C9A84C] transition-colors">
                    RHYTHM 0{i + 1}
                  </span>
                  <h3 className="font-brand text-base md:text-xl uppercase tracking-[0.1em] text-white">{r.title}</h3>
                </div>
                <div className="mt-auto relative">
                  <p className="text-[12px] md:text-xs opacity-60 tracking-wide leading-relaxed font-light">{r.desc}</p>
                  <p className="text-[12px] md:text-[13px] leading-relaxed px-0 mt-2
                    font-['Cormorant_Garamond'] italic text-[#FAF8F5]
                    md:absolute md:top-full md:left-0 md:right-0
                    md:opacity-0 md:translate-y-2 md:group-hover:opacity-85 md:group-hover:translate-y-0
                    opacity-45 translate-y-0
                    transition-all duration-300 ease-out">
                    {r.summary}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <CarouselDots count={5} activeIndex={activeRhythm} />
      </div>
    </section>
  );
}

/* ─── DARK TRANSITION ─────────────────────────────────────────────── */

function DarkTransition() {
  return (
    <section className="py-16 md:py-24 text-center" style={{ backgroundColor: C.darkBg }}>
      <div className="w-[1px] h-12 mx-auto bg-gradient-to-b from-transparent via-[#C9A84C]/40 to-transparent mb-6" />
      <p className="text-[11px] md:text-[12px] tracking-[0.35em] uppercase text-white/20 font-light">
        Formation begins in the gear
      </p>
    </section>
  );
}

/* ─── FIELD GUIDE SECTION ─────────────────────────────────────────── */
// ↓ "Open Guide" cards now link to the Field Guide via React Router

function FieldGuideSection() {
  const articles = [
    {
      type: "Tool", rhythm: "Formation", date: "March 2026",
      title: "Daily Devotion Guide",
      img: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200",
      desc: "Generate a customized daily devotion for any passage, theme, question, or challenge — AI-powered formation on demand.",
      href: "/field-guide/devotion-guide",
      isLink: true,
    },
    {
      type: "Devotion", rhythm: "Scripture", date: "March 2026",
      title: "Scripture Before Scroll",
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200",
      desc: "Reclaim the architecture of your first hour through scripture before the algorithm.",
      href: FG_BASE,
    },
    {
      type: "Practice", rhythm: "Sabbath", date: "February 2026",
      title: "Practicing Rest",
      img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200",
      desc: "A weekly rhythm of trust, delight, and resistance to production without end.",
      href: "#field-guide",
    },
  ];

  const featured = articles[0];
  const secondary = articles.slice(1);

  return (
    <section id="field-guide" className="py-24 md:py-40 px-4 md:px-6 relative overflow-hidden"
      style={{ backgroundColor: C.fieldBg }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 18%,rgba(201,168,76,0.07) 0%,transparent 35%), radial-gradient(ellipse at 50% 82%,rgba(201,168,76,0.04) 0%,transparent 60%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="max-w-7xl mx-auto h-full grid grid-cols-3 gap-10">
          {[0,1,2].map(i => <div key={i} className="border-x border-white/20 h-full" />)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 lg:px-4 xl:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
          <div className="space-y-4 md:space-y-6">
            <span className="text-[11px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">
              Inspiration for the Field
            </span>
            <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.12em] text-white leading-none">
              Field Guide
            </h2>
            <p className="font-brand text-sm md:text-xl uppercase tracking-[0.16em] md:tracking-[0.18em] text-white/74 max-w-2xl leading-[1.4]">
              This is where formation becomes practice.
            </p>
            <p className="text-xs md:text-sm opacity-50 leading-relaxed font-light max-w-xl">
              Each release opens a deeper layer of scripture, discipline, and daily rhythm designed to shape a different kind of life.
            </p>
          </div>
          <Link to={FG_BASE} className="self-start md:self-auto text-[11px] md:text-[10px] text-[#C9A84C] border border-white/10 px-6 md:px-8 py-3 hover:bg-white/5 transition-all whitespace-nowrap rounded-full uppercase tracking-[0.22em] font-bold">
            Explore Archive
          </Link>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-10 md:mb-14" />

        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_.85fr] gap-8 md:gap-10 mb-12 md:mb-16">
          <Link
            to={featured.href}
            className="group relative min-h-[520px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/[0.03] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
            style={{ textDecoration: "none" }}
          >
            <SafeImg src={featured.img} alt={featured.title}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111009] via-[#11100966] to-transparent" />
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
              <div className="flex items-center gap-3 text-[11px] md:text-[9px] uppercase tracking-[0.28em] mb-4">
                <span className="text-[#C9A84C]">{featured.type}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/35">{featured.rhythm}</span>
                <span className="text-white/20">·</span>
                <span className="text-white/25">{featured.date}</span>
              </div>
              <h3 className="font-brand text-3xl md:text-5xl uppercase tracking-[0.08em] text-white leading-[0.94] max-w-md">
                {featured.title}
              </h3>
              <p className="mt-5 text-[11px] md:text-[12px] leading-relaxed text-white/50 max-w-md">
                {featured.desc}
              </p>
              <div className="mt-8 inline-flex items-center gap-3 text-[12px] uppercase tracking-[0.22em] font-bold text-[#C9A84C]">
                {featured.isLink ? "Open Guide" : "Enter the Rhythm"} <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          <div className="fg-card-scroll">
            {secondary.map((art, i) => {
              const CardTag = art.isLink ? Link : "a";
              const cardProps = art.isLink ? { to: art.href } : { href: art.href };
              return (
                <CardTag key={art.title} {...cardProps} className="journal-card group rounded-[1.5rem] border border-white/10 bg-white/[0.03] overflow-hidden min-h-[248px]" style={{ textDecoration: "none" }}>
                  <div className="grid grid-cols-[0.95fr_1.05fr] h-full">
                    <div className="relative h-full overflow-hidden">
                      <SafeImg src={art.img} alt={art.title}
                        className="w-full h-full object-cover grayscale opacity-45 group-hover:opacity-85 group-hover:scale-105 transition-all duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111009]" />
                    </div>
                    <div className="p-6 md:p-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] mb-3">
                          <span className="text-[#C9A84C]">{art.type}</span>
                          <span className="text-white/20">·</span>
                          <span className="text-white/25">{art.date}</span>
                        </div>
                        <h3 className="font-brand text-xl md:text-2xl uppercase tracking-[0.08em] text-white leading-snug">
                          {art.title}
                        </h3>
                        <p className="mt-3 text-[12px] md:text-[11px] leading-relaxed text-white/45">
                          {art.desc}
                        </p>
                      </div>
                      <div className="pt-5 flex items-center gap-2 text-[11px] text-[#C9A84C] uppercase tracking-[0.22em] font-bold">
                        {art.isLink ? "Open Guide" : "Coming Next"} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>
    </section>
  );
}

/* ─── 7-DAY CHALLENGE ─────────────────────────────────────────────── */

/* ─── 7-DAY CHALLENGE ─────────────────────────────────────────────── */

function QRAnimation() {
  const stageRef = useRef(null);
  const goRef    = useRef(false);

  const runAnim = async () => {
    if (goRef.current) return;
    goRef.current = true;
    const s = stageRef.current;
    if (!s) return;

    const shirt = s.querySelector('.qra-shirt');
    const ring  = s.querySelector('.qra-ring');
    const conn  = s.querySelector('.qra-conn');
    const phone = s.querySelector('.qra-phone');
    const scan  = s.querySelector('.qra-scan');
    const ipc   = s.querySelector('.qra-content');

    // reset
    shirt.className = 'qra-shirt';
    ring.classList.remove('pop');
    conn.classList.remove('ext');
    phone.classList.remove('in');
    scan.classList.remove('go');
    ipc.classList.remove('rev');

    const w = ms => new Promise(r => setTimeout(r, ms));
    await w(300);
    shirt.classList.add('vis');
    await w(1200);
    shirt.classList.add('zoom');
    await w(1600);
    ring.classList.add('pop');
    await w(1200);
    conn.classList.add('ext'); phone.classList.add('in');
    await w(600);
    scan.classList.add('go');
    await w(1600);
    ipc.classList.add('rev');
    await w(3000);
    // hold final state — no loop
  };

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect();
        runAnim();
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={stageRef} className="qra-stage">
      {/* Shirt */}
      <div className="qra-shirt">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src="/DriFit_White_no background.png" alt="Technical Tee" />
          <div className="qra-ring" />
        </div>
      </div>
      {/* Connector */}
      <div className="qra-conn">
        <div className="qra-conn-line" />
        <div className="qra-conn-dots"><i></i><i></i><i></i></div>
      </div>
      {/* Phone */}
      <div className="qra-phone">
        <div className="qra-ip">
          <div className="qra-notch" />
          <div className="qra-scan" />
          <div className="qra-content">
            <div className="qra-eye">Daily formation</div>
            <div className="qra-head">Scripture<br />Before Scroll</div>
            <div className="qra-rows">
              <div className="qra-row"><div className="qra-dot" style={{ background: '#c9a84c' }} /><div className="qra-rl">Devotion</div></div>
              <div className="qra-row"><div className="qra-dot" style={{ background: '#8a7a5a' }} /><div className="qra-rl">Practice</div></div>
              <div className="qra-row"><div className="qra-dot" style={{ background: '#5a5548' }} /><div className="qra-rl">Reflection</div></div>
              <div className="qra-row"><div className="qra-dot" style={{ background: '#3a3830' }} /><div className="qra-rl">Community</div></div>
            </div>
            <div className="qra-cta">Begin today's practice</div>
          </div>
          <div className="qra-home" />
        </div>
      </div>
    </div>
  );
}

function GearBridgeSection() {
  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden"
      style={{ backgroundColor: C.darkBg }}>
      <div className="section-bg-parallax absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.05) 0%,transparent 58%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20 bridge-reveal">
          <p className="text-[11px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/70 font-bold mb-8">
            On the Gear
          </p>
          <h2 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase leading-none tracking-[0.15em] md:tracking-[0.18em] text-white mb-5">
            More Than<br /><span className="text-[#C9A84C]">Apparel.</span>
          </h2>
          <p className="font-brand text-base md:text-xl uppercase tracking-[0.22em] opacity-25 mb-8">
            A daily reminder of what is forming you.
          </p>
          <div className="w-12 h-[1px] bg-[#C9A84C]/40 mx-auto" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-16 bridge-reveal">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-[11px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase font-bold">
              Linked to the Gear
            </span>
            <p className="text-xs md:text-sm text-white/45 leading-relaxed">
              Every release unlocks a hub of formation content — devotion, practice, reflection, video, and challenge — accessed through QR touchpoints built into the gear itself.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 md:gap-2 text-[12px] uppercase tracking-[0.26em] text-white/30 font-bold pt-2">
              <span>Gear</span>
              <span className="text-[#C9A84C]">→</span>
              <span>QR</span>
              <span className="text-[#C9A84C]">→</span>
              <span>Guide</span>
              <span className="text-[#C9A84C]">→</span>
              <span>Practice</span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-[420px]">
            <QRAnimation />
          </div>
        </div>

        <div className="mt-14 text-center text-[0.6rem] uppercase tracking-[0.4em] text-white/15">
          Ephesians 6:10–18
        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
    </section>
  );
}

/* ─── THE GEAR ────────────────────────────────────────────────────── */

const GEAR_TABS = {
  men: {
    label: "Counter Formation", sublabel: "Men", accent: "#C9A84C",
    accentMuted: "rgba(201,168,76,0.18)", phrase: "Apparel as a visual anchor.", sub: "Wear the pattern.",
    shopUrl: SHOPIFY_URL,
    products: [
      { name: "Technical Tee", img: "/DriFit_Black.png", copy: "Performance tech for training.", tier: "available", slug: "technical-tee", shopUrl: "https://shop.counterformed.com/products/counter-formation-spartan-logo-polyester-t-shirt" },
      { name: "Everyday Tee", img: "/Tshirt_Studio.png", copy: "Premium soft-wash cotton.", tier: "available", slug: "everyday-tee", shopUrl: "https://shop.counterformed.com/products/everyday-tee" },
      { name: "Technical Hoodie", img: "/Hoodie_white.png", copy: "Heavyweight Performance Tech.", tier: "teaser", slug: "technical-hoodie" },
    ],
  },
  women: {
    label: "The Collective", sublabel: "Women", accent: "#8FAF8A",
    accentMuted: "rgba(143,175,138,0.18)", phrase: "Rooted. Rising. Set Apart.", sub: "Wear the formation.",
    shopUrl: SHOPIFY_URL,
    products: [
      { name: "Rooted Hoodie",    img: "/placeholder.png", copy: "Heavyweight. Oversized. Anchored.", phrase: "Psalm 1", tier: "teaser", slug: "rooted-hoodie" },
      { name: "Set Apart Tee",    img: "/placeholder.png", copy: "Premium soft-wash cotton.", phrase: "Romans 12:2", tier: "teaser", slug: "set-apart-tee" },
      { name: "Rise Athletic Set",img: "/placeholder.png", copy: "Cropped hoodie + shorts.", tier: "teaser", slug: "rise-athletic-set" },
    ],
  },
};

function DroppingSoonStrip({ products, accent, accentMuted }) {
  const [notifyOpen, setNotifyOpen] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState({});
  const [notifyDone, setNotifyDone] = useState({});
  const [notifyLoading, setNotifyLoading] = useState({});

  const handleNotify = async (slug) => {
    const em = notifyEmail[slug];
    if (!em) return;
    setNotifyLoading(prev => ({ ...prev, [slug]: true }));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, source: `notify_${slug}` }),
      });
      if (!res.ok) throw new Error();
      setNotifyDone(prev => ({ ...prev, [slug]: true }));
      setNotifyOpen(null);
    } catch {
      // silently fail — user can retry
    } finally {
      setNotifyLoading(prev => ({ ...prev, [slug]: false }));
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2" style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
      {products.map(product => (
        <div key={product.slug}
          className="flex-shrink-0 w-[200px] md:w-[220px] rounded-2xl border border-white/[0.06] flex flex-col overflow-hidden"
          style={{ aspectRatio: "3/4", scrollSnapAlign: "center", animation: "breathe 4s ease-in-out infinite" }}>
          {/* Image or silhouette area */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {product.img && product.img !== "/placeholder.png" ? (
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover opacity-60"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-20 rounded-lg"
                style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }} />
            )}
            {/* Dropping soon flag */}
            <span className="absolute top-3 right-3 text-[9px] tracking-[0.25em] uppercase px-2 py-1 rounded-full"
              style={{ background: "rgba(201,168,76,0.12)", color: "rgba(201,168,76,0.7)", border: "1px solid rgba(201,168,76,0.2)" }}>
              Soon
            </span>
          </div>

          {/* Product name */}
          <div className="p-4 pb-3">
          <p className="text-[11px] font-brand uppercase tracking-wider text-white/70 mb-3">
            {product.name}
          </p>

          {/* Notify Me / Email input / Done */}
          {notifyDone[product.slug] ? (
            <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase" style={{ color: accent }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              You're in
            </div>
          ) : notifyOpen === product.slug ? (
            <div className="flex items-center gap-1">
              <input
                type="email"
                value={notifyEmail[product.slug] || ""}
                onChange={e => setNotifyEmail(prev => ({ ...prev, [product.slug]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleNotify(product.slug)}
                placeholder="email"
                className="flex-1 min-w-0 px-3 py-2 rounded-full text-[10px] text-white placeholder-white/25 focus:outline-none tracking-wider uppercase"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${accentMuted}` }}
                autoFocus
                disabled={notifyLoading[product.slug]}
              />
              <button
                onClick={() => handleNotify(product.slug)}
                disabled={notifyLoading[product.slug]}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ border: `1px solid ${accent}40`, color: accent }}>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setNotifyOpen(product.slug)}
              className="text-[10px] tracking-widest uppercase rounded-full px-4 py-2 transition-all hover:bg-white/[0.05]"
              style={{ border: `1px solid ${accent}4D`, color: `${accent}B3` }}>
              Notify Me
            </button>
          )}
          </div>
        </div>
      ))}
    </div>
  );
}

function GearSection() {
  const [active, setActive] = useState("men");
  const panelRef = useRef(null);
  const tab = GEAR_TABS[active];

  const switchTab = (key) => {
    if (key === active) return;
    gsap.to(panelRef.current, {
      opacity: 0, y: 8, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        setActive(key);
        gsap.fromTo(panelRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" });
      },
    });
  };

  const available = tab.products.filter(p => p.tier === "available");
  const teaser = tab.products.filter(p => p.tier === "teaser");

  return (
    <section id="shop" className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden"
      style={{ backgroundColor: C.darkBg }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.03) 0%, transparent 60%)" }} />
      <div className="max-w-7xl mx-auto relative z-10 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12 mb-10 md:mb-14 pt-4">
          <div className="max-w-3xl">
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.38em] text-white/45 font-bold mb-4">
              Built with purpose. Worn as a reminder.
            </p>
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.08em] text-white">The Gear</h2>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            {Object.entries(GEAR_TABS).map(([key, t]) => {
              const isActive = active === key;
              return (
                <button key={key} onClick={() => switchTab(key)}
                  className="relative px-5 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-bold transition-all duration-300"
                  style={{ background: isActive ? "rgba(255,255,255,0.10)" : "transparent", color: isActive ? t.accent : "rgba(255,255,255,0.35)", boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.18)" : "none" }}>
                  {t.sublabel}
                  {isActive && <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: t.accent }} />}
                </button>
              );
            })}
          </div>
        </div>

        <div ref={panelRef}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-8 md:mb-10">
            <div className="flex items-center gap-3 flex-wrap">
              {active === "women" && (
                <span className="text-[8px] uppercase tracking-[0.38em] font-bold px-3 py-1 rounded-full"
                  style={{ background: "rgba(143,175,138,0.15)", color: "#8FAF8A", border: "1px solid rgba(143,175,138,0.25)" }}>
                  Collective
                </span>
              )}
              <p className="font-brand text-sm md:text-base uppercase tracking-[0.18em] opacity-60"
                style={{ color: active === "women" ? "rgba(143,175,138,0.65)" : "white" }}>
                {tab.phrase}
              </p>
            </div>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.22em] text-white opacity-40 font-bold">{tab.sub}</p>
          </div>

          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-[0.22em] text-white opacity-42 leading-loose max-w-xl mb-10 md:mb-12">
            Designed as a reminder: you are being formed every day.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {available.map(cat => (
              <TiltCard key={cat.name}
                className="product-card group relative overflow-hidden bg-black aspect-square rounded-[2rem] md:rounded-[3rem] transition-transform duration-700 hover:-translate-y-2 md:hover:-translate-y-4 shadow-2xl shadow-black/25">
                <a href={cat.shopUrl || tab.shopUrl}
                  target="_blank" rel="noopener noreferrer"
                  className="block h-full relative">
                  <div className="absolute inset-0 opacity-100 transition-all duration-1000">
                    <SafeImg src={cat.img} className="w-full h-full object-contain" alt={cat.name} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  {active === "women" && cat.phrase && (
                    <div className="absolute top-5 left-5 text-[7px] uppercase tracking-[0.32em] font-bold"
                      style={{ color: "rgba(143,175,138,0.55)" }}>{cat.phrase}</div>
                  )}
                  <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-end text-white">
                    <h3 className="font-brand text-2xl md:text-4xl uppercase italic">{cat.name}</h3>
                    <p className="text-[9px] md:text-[10px] opacity-60 uppercase mt-2 tracking-widest">{cat.copy}</p>
                    <div className="flex items-center gap-3 text-[9px] pt-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: tab.accent }}>
                      Shop <ArrowRight size={14} />
                    </div>
                  </div>
                </a>
              </TiltCard>
            ))}
          </div>

          {teaser.length > 0 && (
            <>
              <p className="text-[11px] tracking-[0.5em] uppercase font-bold mt-14 mb-6"
                style={{ color: `${tab.accent}80` }}>
                Dropping Soon
              </p>
              <DroppingSoonStrip products={teaser} accent={tab.accent} accentMuted={tab.accentMuted} />
            </>
          )}

          {active === "women" && (
            <div className="mt-12 md:mt-16 text-center">
              <p className="text-[9px] uppercase tracking-[0.32em] font-bold mb-2" style={{ color: "rgba(143,175,138,0.65)" }}>The Collective</p>
              <p className="text-[10px] md:text-xs opacity-40 tracking-[0.14em] max-w-sm mx-auto leading-relaxed" style={{ color: "rgba(143,175,138,0.45)" }}>
                Same Rule. Different expression. Strength, rooted in light.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────── */

function Footer({ onOpenChallenge }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "join_formation" }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: C.darkBg }} className="border-t border-white/[0.06]">
      <div className="footer-reveal max-w-5xl mx-auto pt-24 md:pt-40 pb-16 md:pb-24 px-6 text-center border-b border-white/[0.05]">
        <p className="text-[11px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/60 mb-8 font-bold">The Mission</p>
        <h3 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.12em] md:tracking-[0.16em] leading-none text-white mb-3">
          Formed in Christ.
        </h3>
        <h3 className="font-brand text-xl md:text-3xl lg:text-4xl uppercase tracking-[0.12em] leading-none text-white/20 mb-10">
          Not drifting.
        </h3>
        <p className="text-[11px] md:text-xs opacity-35 tracking-[0.25em] uppercase max-w-sm mx-auto leading-loose">
          Intentional formation in a world designed for drift.
        </p>
      </div>

      <div className="footer-reveal max-w-2xl mx-auto py-16 px-6 text-center border-b border-white/[0.05]">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-[#C9A84C]/60 font-bold mb-3 block">Stay in the Formation</span>
        <h4 className="font-brand text-xl md:text-2xl uppercase tracking-[0.15em] text-white mb-8">Connect with the Community</h4>
        {!submitted ? (
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                disabled={loading}
                className="flex-1 px-5 py-4 rounded-full text-[11px] text-white placeholder-white/25 focus:outline-none tracking-widest uppercase disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.40)"}
                onBlur={e  => e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"}
              />
              <button onClick={handleSubmit} disabled={loading}
                className="px-8 py-4 rounded-full text-[12px] uppercase tracking-widest font-bold transition-all whitespace-nowrap border hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: C.ivory }}>
                {loading ? "..." : "Join"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-red-400">{error}</p>
            )}
          </div>
        ) : (
          <p className="text-[12px] uppercase tracking-[0.35em] text-[#C9A84C]">You're in. Weekly field notes incoming.</p>
        )}
        <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/20">Weekly field notes. No noise.</p>
      </div>

      <div className="footer-reveal max-w-7xl mx-auto py-14 px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">The Gear</span>
          <a href="#shop" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Shop All</a>
          <a href={SHOPIFY_URL} className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Men's</a>
          <a href={SHOPIFY_URL} className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Women's</a>
        </div>
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">The Formation</span>
          <a href="#architecture" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Architecture</a>
          <a href="#rule" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Rule of Life</a>
          <button type="button" onClick={onOpenChallenge}
            className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1 border-0 bg-transparent p-0 text-left cursor-pointer">
            7-Day Challenge
          </button>
        </div>
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">Field Guide</span>
          <Link to="/field-guide/scripture-before-scroll" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Scripture Before Scroll</Link>
          <Link to="/field-guide/devotion-guide" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Devotion Guide</Link>
        </div>
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">Connect</span>
          <a href="https://instagram.com/counterformed" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Instagram</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Contact</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">About</a>
        </div>
      </div>

      <div className="footer-reveal border-t border-white/[0.04] pt-6 pb-16 md:pb-8 px-6 flex flex-col items-center gap-3 max-w-7xl mx-auto">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 text-center">Premium men&apos;s and women&apos;s athletic lifestyle apparel for those committed to being formed by Christ, not by the world.</p>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3 mt-2">
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-20">&copy; 2026 Counter Formation</p>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-15">Discipline · Presence · Formation</p>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-15">Ephesians 6:10–18</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── FLOATING CHALLENGE TRIGGER ─────────────────────────────────── */

function ChallengeModal({ open, onClose }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const dialogRef = useRef(null);
  const emailRef = useRef(null);
  const returnFocusRef = useRef(null);

  useEscape(onClose, open);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement;

    const focusTimer = window.setTimeout(() => {
      emailRef.current?.focus();
    }, 80);

    const handleTab = (e) => {
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleTab);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleTab);
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    setEmail("");
    setSubmitted(false);
    setLoading(false);
    setError(null);
  }, [open]);

  const handleSubmit = async () => {
    if (!email || loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "7day_challenge_modal" }),
      });

      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[140] px-4 py-6 md:px-6 md:py-10"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ background: "rgba(6,5,10,0.82)", backdropFilter: "blur(18px)" }}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="challenge-modal-title"
          className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#12100D] shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
          style={{ backgroundImage: "radial-gradient(ellipse at 50% 18%, rgba(201,168,76,0.08) 0%, transparent 52%)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 transition-colors hover:text-white"
            aria-label="Close 7-Day Challenge"
          >
            <X size={16} />
          </button>

          <div className="px-6 py-16 text-center md:px-12 md:py-20">
            <span className="mb-6 block text-[11px] md:text-[10px] font-bold uppercase tracking-[0.5em] text-[#C9A84C]">
              The Entry Point
            </span>
            <h2
              id="challenge-modal-title"
              className="font-brand text-4xl leading-[0.92] tracking-[0.12em] text-white uppercase md:text-6xl md:tracking-[0.16em]"
            >
              7-Day Formation
              <br />
              Challenge
            </h2>
            <p className="mt-6 font-brand text-lg italic lowercase text-white/28 md:text-2xl">
              7 days. a new pattern.
            </p>
            <p className="mx-auto mt-8 max-w-lg text-[12px] md:text-xs font-light uppercase tracking-[0.18em] leading-loose text-white/42">
              A structured initiation into intentional living. One practice per day. No noise.
            </p>

            {!submitted ? (
              <div className="mx-auto mt-10 max-w-xl">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    placeholder="your@email.com"
                    disabled={loading}
                    className="flex-1 rounded-full px-5 py-4 text-[11px] uppercase tracking-[0.18em] text-white placeholder-white/22 focus:outline-none disabled:opacity-50"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.40)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"}
                  />
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#FAF8F5] disabled:opacity-50"
                  >
                    {loading ? "..." : <><span>Begin</span> <ArrowRight size={13} /></>}
                  </button>
                </div>
                {error && (
                  <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-red-400">{error}</p>
)}
              </div>
            ) : (
              <div className="mt-10">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.38em] text-[#C9A84C]">You're in.</p>
                <p className="text-[12px] uppercase tracking-[0.2em] text-white/40">Check your inbox. Day 1 begins now.</p>
                <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to="/7-day-challenge"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C9A84C] px-8 py-4 text-[12px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#FAF8F5]"
                  >
                    Begin Now <ArrowRight size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-7 py-4 text-[12px] font-bold uppercase tracking-widest text-white/70 transition-all hover:border-[#C9A84C]/40 hover:text-[#C9A84C]"
                  >
                    Keep Exploring
                  </button>
                </div>
              </div>
            )}

            <p className="mt-10 text-[11px] uppercase tracking-[0.35em] text-white/18">Ephesians 6:10-18</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingChallengeTrigger({ onOpenChallenge }) {
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (pct > 0.35 && !dismissed) setVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-2"
      style={{ animation: "fadeUp 0.4s ease forwards" }}>
      <button
        type="button"
        onClick={onOpenChallenge}
        className="flex items-center gap-3 rounded-full border-0 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.22em] text-black transition-all hover:scale-105"
        style={{ backgroundColor: C.gold, boxShadow: "0 4px 32px rgba(201,168,76,0.35)" }}>
        Begin the 7-Day Challenge <ChevronRight size={13} />
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 transition-colors"
        style={{ background: "rgba(255,255,255,0.10)" }}
        aria-label="Dismiss">
        <X size={12} />
      </button>
    </div>
  );
}

/* ─── MOBILE BOTTOM NAV ──────────────────────────────────────────── */

function MobileBottomNav({ onOpenChallenge }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-[90] md:hidden transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ backgroundColor: 'rgba(14,12,10,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-around h-14 px-2">
        <a href="#shop" className="flex flex-col items-center gap-1 text-white/50 hover:text-[#C9A84C] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span className="text-[11px] tracking-wider uppercase">Shop</span>
        </a>
        <a href="#architecture" className="flex flex-col items-center gap-1 text-white/50 hover:text-[#C9A84C] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
          <span className="text-[11px] tracking-wider uppercase">Formation</span>
        </a>
        <button onClick={onOpenChallenge} className="flex flex-col items-center gap-1 text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          <span className="text-[11px] tracking-wider uppercase">Challenge</span>
        </button>
      </div>
    </nav>
  );
}

/* ─── MAIN SITE ───────────────────────────────────────────────────── */

function MainSite() {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  useBodyScrollLock(isMenuOpen || isChallengeOpen);
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  const openChallenge = useCallback(() => {
    setIsMenuOpen(false);
    setIsChallengeOpen(true);
  }, []);

  const closeChallenge = useCallback(() => {
    setIsChallengeOpen(false);
  }, []);

  const navLinks = [
    { label: "Formation",    href: "#architecture" },
    { label: "Rule of Life", href: "#rule" },
  ];

  const scrollToShop = (e) => {
    e.preventDefault();
    const el = document.getElementById("shop");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + 160;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-fade", { opacity: 0, y: -10, duration: 0.9, ease: "power2.out", delay: 0.3 });
      gsap.utils.toArray(".pillar-reveal").forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });
      const batchReveal = (sel, y = 20, stagger = 0.09) => {
        ScrollTrigger.batch(sel, {
          start: "top 92%",
          onEnter: batch => gsap.fromTo(batch,
            { opacity: 0, y },
            { opacity: 1, y: 0, duration: 0.75, stagger, ease: "power2.out", overwrite: "auto" }),
        });
      };
      batchReveal(".manifesto-item", 20, 0.07);
      batchReveal(".product-card", 24, 0.12);
      batchReveal(".footer-reveal", 16, 0.15);
      batchReveal(".bridge-reveal", 30);
      batchReveal(".journal-card", 20);

      // Parallax for section backgrounds
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

      gsap.matchMedia().add("(max-width: 767px)", () => {
        gsap.utils.toArray(".pillar-img").forEach(img => {
          gsap.set(img, { filter: "grayscale(1)", opacity: 0.5 });
          gsap.to(img, { filter: "grayscale(0)", opacity: 1, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: img, start: "top 80%" } });
        });
        gsap.utils.toArray(".rhythm-img-wrap").forEach(wrap => {
          gsap.set(wrap, { filter: "grayscale(1)" });
          gsap.to(wrap, { filter: "grayscale(0)", opacity: 0.6, duration: 1.2, ease: "power2.out",
            scrollTrigger: { trigger: wrap, start: "top 80%" } });
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  // Handle hash links from external pages (e.g. /identity nav or Shopify back-links)
  // useLayoutEffect fires before paint so the user never sees the hero flash
  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + 160;
      window.scrollTo({ top, behavior: "instant" });
    }
  }, []);

  return (
    <div ref={mainRef}
      className="text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
      style={{ backgroundColor: C.darkBg }}>
      <ChallengeModal open={isChallengeOpen} onClose={closeChallenge} />

      <nav className="nav-fade fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: `${C.darkBg}cc` }}>
        <a href="#top" className="flex items-center gap-2 md:gap-3">
          <SafeImg src="/helmet.png" className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0" alt="Counter Formation" />
          <span className="font-brand text-[11px] md:text-sm tracking-[0.2em] md:tracking-[0.28em] uppercase whitespace-nowrap">
            Counter Formation
          </span>
        </a>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 mr-4 text-[10px] uppercase tracking-widest font-brand font-bold">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className={cx("hover:text-[#C9A84C] transition-colors", l.gold && "text-[#C9A84C]")}>
                {l.label}
              </a>
            ))}
          </div>
          <a href="#shop" onClick={scrollToShop}
            className="px-5 py-2 rounded-full border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all text-[9px] md:text-[10px] hidden md:block uppercase tracking-widest font-bold">
            Shop the Gear
          </a>
          <button onClick={() => setIsMenuOpen(v => !v)} className="md:hidden p-1" aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <div className={cx("fixed inset-0 z-[120] flex flex-col items-center justify-center transition-transform duration-500",
        isMenuOpen ? "translate-y-0" : "-translate-y-full")}
        style={{ backgroundColor: C.darkBg }}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8">
          <X size={28} />
        </button>

        {/* THE GEAR */}
        <p className="text-[11px] tracking-[0.5em] text-[#C9A84C]/60 uppercase font-bold mb-6">The Gear</p>
        <a href="#shop" onClick={(e) => { setIsMenuOpen(false); scrollToShop(e); }}
          className="text-xl font-brand uppercase tracking-wider text-white mb-2">Shop All</a>

        <div className="h-[1px] w-16 bg-white/10 mx-auto my-6" />

        {/* THE FORMATION */}
        <p className="text-[11px] tracking-[0.5em] text-[#C9A84C]/60 uppercase font-bold mb-6">The Formation</p>
        <a href="#architecture" onClick={() => setIsMenuOpen(false)}
          className="text-xl font-brand uppercase tracking-wider text-white mb-2">Architecture</a>
        <a href="#rule" onClick={() => setIsMenuOpen(false)}
          className="text-xl font-brand uppercase tracking-wider text-white mb-2">Rule of Life</a>
        <Link to="/field-guide/scripture-before-scroll" onClick={() => setIsMenuOpen(false)}
          className="text-xl font-brand uppercase tracking-wider text-white mb-2">Field Guide</Link>
        <button onClick={openChallenge}
          className="text-xl font-brand uppercase tracking-wider text-white mt-2">7-Day Challenge</button>
      </div>

      <CinematicHero />
      <SectionDivider />
      <ArchitectureSlider />
      <SectionDivider />
      <RuleOfLifeSection />
      <FieldGuideSection />
      <DarkTransition />
      <SectionDivider />
      <GearBridgeSection />
      <GearSection />
      <Footer onOpenChallenge={openChallenge} />
      <FloatingChallengeTrigger onOpenChallenge={openChallenge} />
      <MobileBottomNav onOpenChallenge={openChallenge} />
    </div>
  );
}

/* ─── ROOT — ROUTER ───────────────────────────────────────────────── */

export default function App() {
  return (
    <BrowserRouter>
      <FieldGuideStyles />
      <ChallengeStyles />
      <RuleStyles />
      <ArchitectureStyles />
      <ArmorStyles />
      <Routes>
        {/* Main site */}
        <Route path="/" element={<MainSite />} />

        {/* Field Guide routes */}
        <Route path={`${FG_BASE}`}          element={<FGLanding />} />
        <Route path={`${FG_BASE}/today`}    element={<FGOffice />} />
        <Route path={`${FG_BASE}/day/:day`} element={<FGOffice />} />
        <Route path={`${FG_BASE}/path`}     element={<FGPath />} />
        <Route path={`${FG_BASE}/why`}      element={<FGWhy />} />
        <Route path={`${FG_BASE}/new`}      element={<FGNewHere />} />
        <Route path="/field-guide/devotion-guide" element={<DevotionGuide />} />

        {/* 7-Day Challenge routes */}
        <Route path="/7-day-challenge" element={<CFLanding />} />
        <Route path="/7-day-challenge/day/:day" element={<CFDevotion />} />

        {/* Rule of Life routes */}
        <Route path="/rule-of-life/:rhythm" element={<RhythmPage />} />
        <Route path="/rule-of-life/:rhythm/book/:bookIndex" element={<BookPage />} />

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

        {/* Fallback */}
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}
