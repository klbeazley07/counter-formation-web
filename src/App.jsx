import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { RuleStyles, RhythmPage, BookPage } from "./RuleOfLife";
import {
  ArchitectureStyles,
  ArchitectureSlider,
  IdentityPage,
  PracticePage,
  CommunityPage,
} from "./Architecture";

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
  const scriptureRef       = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([bgGlowRef.current, vBeamRef.current, hBeamRef.current,
        bloomRef.current, logoGroupRef.current, headingRef.current,
        sublineRef.current, microcopyRef.current, ctaRef.current,
        scriptureRef.current, scrollIndicatorRef.current], { opacity: 0 });
      gsap.set(vBeamRef.current,     { height: "0vh", xPercent: -50 });
      gsap.set(hBeamRef.current,     { width: "0vw",  xPercent: -50 });
      gsap.set(bloomRef.current,     { scale: 0.7 });
      gsap.set(logoGroupRef.current, { y: 18, filter: "blur(10px)" });
      gsap.set(headingRef.current,   { y: 28, filter: "blur(12px)" });
      gsap.set(sublineRef.current,   { y: 20, filter: "blur(8px)" });
      gsap.set(microcopyRef.current, { y: 16, filter: "blur(6px)" });
      gsap.set(ctaRef.current,       { y: 18, filter: "blur(8px)" });
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
        .to(ctaRef.current,       { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.85 }, "-=0.4")
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
        style={{ background: "radial-gradient(circle at 20% 12%,rgba(171,122,68,0.14),transparent 26%),radial-gradient(circle at 55% 48%,rgba(32,64,120,0.10),transparent 32%),linear-gradient(to bottom,rgba(3,4,10,0.92),rgba(2,3,8,1))" }} />
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
          <SafeImg src="/full-logo.png"
            className="w-[260px] md:w-[500px] mx-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[42vh] object-contain"
            alt="Counter Formation" />
        </div>
        <h1 ref={headingRef}
          className="font-brand text-xl md:text-5xl uppercase tracking-[0.28em] md:tracking-[0.38em] leading-tight text-white px-2 opacity-0">
          Formed in Christ.
        </h1>
        <p ref={sublineRef}
          className="mt-3 md:mt-4 font-brand italic text-sm md:text-4xl opacity-40 lowercase opacity-0">
          Living Counter to Culture.
        </p>
        <p ref={microcopyRef}
          className="mt-4 md:mt-5 max-w-xs md:max-w-xl mx-auto text-[8px] md:text-xs opacity-0 tracking-[0.16em] md:tracking-[0.22em] uppercase leading-relaxed font-light text-white/60">
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
        <div ref={scriptureRef}
          className="mt-8 md:mt-10 text-[0.62rem] uppercase tracking-[0.35em] text-white/25 opacity-0">
          Ephesians 6:10–18
        </div>
      </div>

      <div ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20">
        <span className="text-[7px] uppercase tracking-[0.35em] text-white/40">Scroll</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="text-white/35">
          <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

/* ─── ARCHITECTURE OF THE SOUL ────────────────────────────────────── */

/* ─── RULE OF LIFE ────────────────────────────────────────────────── */

function RuleOfLifeSection() {
  const rhythms = [
    { title: "Presence",  desc: "Attention before God",    slug: "presence",  bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600" },
    { title: "Scripture", desc: "Truth before noise",       slug: "scripture", bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600" },
    { title: "Prayer",    desc: "Dependence before action", slug: "prayer",    bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600" },
    { title: "Sabbath",   desc: "Rest before production",   slug: "sabbath",   bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600" },
    { title: "Community", desc: "Formation together",       slug: "community", bg: "/Community_8k.png" },
  ];

  return (
    <section id="rule" className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden"
      style={{ backgroundColor: C.ruleBg }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 60%,rgba(201,168,76,0.04) 0%,transparent 65%)" }} />
      <div className="max-w-7xl mx-auto relative z-10 lg:px-4 xl:px-8">
        <div className="mb-16 md:mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <span className="text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">The Pattern</span>
            <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.12em] text-white leading-none">
              Rule of Life
            </h2>
          </div>
          <p className="max-w-md text-xs md:text-base opacity-50 leading-relaxed font-light text-left md:text-right">
            A set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
          {rhythms.map((r, i) => (
            <Link key={r.title}
              to={`/rule-of-life/${r.slug}`}
              className="manifesto-item group relative overflow-hidden rounded-2xl md:rounded-none transition-all duration-500 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", minHeight: "320px", textDecoration: "none", display: "block" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.30)";
                e.currentTarget.style.background   = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform    = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                e.currentTarget.style.background   = "rgba(255,255,255,0.05)";
                e.currentTarget.style.transform    = "translateY(0)";
              }}>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent z-10" />
              <div className="rhythm-img-wrap absolute inset-0 z-0 opacity-35 group-hover:opacity-60 transition-opacity duration-700">
                <SafeImg src={r.bg} alt=""
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute inset-0 z-0"
                style={{ background: `linear-gradient(to top,${C.ruleBg},${C.ruleBg}88 55%,${C.ruleBg}26)` }} />
              <div className="relative z-10 p-6 md:p-8 flex flex-col justify-between" style={{ minHeight: "320px" }}>
                <div className="space-y-3">
                  <span className="block font-mono text-[8px] text-[#C9A84C]/70 tracking-[0.3em] group-hover:text-[#C9A84C] transition-colors">
                    RHYTHM 0{i + 1}
                  </span>
                  <h3 className="font-brand text-base md:text-xl uppercase tracking-[0.1em] text-white">{r.title}</h3>
                </div>
                <p className="text-[10px] md:text-xs opacity-60 tracking-wide leading-relaxed font-light mt-6">{r.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── LIGHT TRANSITION ────────────────────────────────────────────── */

function LightTransition() {
  const sectionRef = useRef(null);
  const beamRef    = useRef(null);
  const textRef    = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([beamRef.current, textRef.current], { opacity: 0, y: 10 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 72%",
        onEnter: () => {
          gsap.to(beamRef.current, { opacity: 1, y: 0, duration: 1.8, ease: "power2.out" });
          gsap.to(textRef.current, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 md:py-44"
      style={{ background: `linear-gradient(to bottom,${C.ruleBg} 0%,${C.lightMid} 40%,${C.lightMid} 60%,${C.fieldBg} 100%)` }}>
      <div ref={beamRef} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[1px] h-full"
          style={{ background: "linear-gradient(to bottom,transparent 0%,rgba(201,168,76,0.25) 22%,rgba(201,168,76,0.55) 50%,rgba(201,168,76,0.25) 78%,transparent 100%)" }} />
        <div className="absolute h-[1px] w-4/5 md:w-3/5"
          style={{ background: "linear-gradient(to right,transparent 0%,rgba(201,168,76,0.18) 12%,rgba(201,168,76,0.48) 50%,rgba(201,168,76,0.18) 88%,transparent 100%)" }} />
        <div className="absolute w-56 h-56 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(201,168,76,0.20) 0%,rgba(201,168,76,0.06) 40%,transparent 70%)", filter: "blur(18px)" }} />
      </div>
      <div ref={textRef} className="relative z-10 text-center px-6">
        <p className="font-brand text-sm md:text-xl uppercase tracking-[0.38em]" style={{ color: "#2A2018" }}>
          Formation begins in the light.
        </p>
        <div className="mt-4 text-[9px] uppercase tracking-[0.38em] opacity-40" style={{ color: "#2A2018" }}>
          Romans 12:2
        </div>
      </div>
    </section>
  );
}

/* ─── FIELD GUIDE SECTION ─────────────────────────────────────────── */
// ↓ "Open Guide" cards now link to the Field Guide via React Router

function FieldGuideSection() {
  const articles = [
    {
      type: "Devotion", rhythm: "Scripture", date: "March 2026",
      title: "Scripture Before Scroll",
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200",
      desc: "Reclaim the architecture of your first hour through scripture before the algorithm.",
      href: FG_BASE,
      featured: true,
    },
    {
      type: "Practice", rhythm: "Sabbath", date: "February 2026",
      title: "Practicing Rest",
      img: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200",
      desc: "A weekly rhythm of trust, delight, and resistance to production without end.",
      href: "#field-guide",
    },
    {
      type: "Video", rhythm: "Community", date: "January 2026",
      title: "Formation Together",
      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200",
      desc: "Why apprenticeship to Jesus requires shared life, mutual love, and practiced presence.",
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
            <span className="text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">
              Dispatches from the Field
            </span>
            <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.12em] text-white leading-none">
              Field Guide
            </h2>
            <p className="text-xs md:text-sm opacity-50 leading-relaxed font-light max-w-xl">
              Devotions, practices, and media designed to carry the life of Counter Formation beyond the garment. Each release opens a deeper layer of formation.
            </p>
          </div>
          <Link to={FG_BASE} className="self-start md:self-auto text-[9px] md:text-[10px] text-[#C9A84C] border border-white/10 px-6 md:px-8 py-3 hover:bg-white/5 transition-all whitespace-nowrap rounded-full uppercase tracking-[0.22em] font-bold">
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
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-45 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111009] via-[#111009cc] to-transparent" />
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/60 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-10">
              <div className="flex items-center gap-3 text-[8px] md:text-[9px] uppercase tracking-[0.28em] mb-4">
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
              <div className="mt-8 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] font-bold text-[#C9A84C]">
                Enter the Rhythm <ArrowRight size={14} />
              </div>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-6">
            {secondary.map((art, i) => (
              <a key={art.title} href={art.href} className="journal-card group rounded-[1.5rem] border border-white/10 bg-white/[0.03] overflow-hidden min-h-[248px]" style={{ textDecoration: "none" }}>
                <div className="grid grid-cols-[0.95fr_1.05fr] h-full">
                  <div className="relative h-full">
                    <SafeImg src={art.img} alt={art.title}
                      className="w-full h-full object-cover grayscale opacity-45 group-hover:opacity-85 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111009]" />
                  </div>
                  <div className="p-6 md:p-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.28em] mb-3">
                        <span className="text-[#C9A84C]">{art.type}</span>
                        <span className="text-white/20">·</span>
                        <span className="text-white/25">{art.date}</span>
                      </div>
                      <h3 className="font-brand text-xl md:text-2xl uppercase tracking-[0.08em] text-white leading-snug">
                        {art.title}
                      </h3>
                      <p className="mt-3 text-[10px] md:text-[11px] leading-relaxed text-white/45">
                        {art.desc}
                      </p>
                    </div>
                    <div className="pt-5 flex items-center gap-2 text-[9px] text-[#C9A84C] uppercase tracking-[0.22em] font-bold">
                      Coming Next <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>
    </section>
  );
}

/* ─── 7-DAY CHALLENGE ─────────────────────────────────────────────── */

/* ─── 7-DAY CHALLENGE ─────────────────────────────────────────────── */

function ChallengeSection() {
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
        body: JSON.stringify({ email, source: "7day_challenge" }),
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
    <section id="challenge" className="relative py-28 md:py-44 px-6 overflow-hidden"
      style={{ backgroundColor: C.darkBg }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.07) 0%,transparent 55%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center bridge-reveal">
        <span className="text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.5em] uppercase font-bold mb-6 block">
          The Entry Point
        </span>
        <h2 className="font-brand text-4xl md:text-6xl uppercase tracking-[0.12em] md:tracking-[0.16em] leading-none text-white mb-5">
          7-Day Formation<br />Challenge
        </h2>
        <p className="font-brand italic text-lg md:text-2xl opacity-30 lowercase mb-8">
          7 days. a new pattern.
        </p>
        <p className="text-[10px] md:text-xs opacity-45 tracking-[0.18em] uppercase leading-loose font-light max-w-sm mx-auto mb-12">
          A structured initiation into intentional living. One practice per day. No noise.
        </p>

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
                className="px-8 py-4 bg-[#C9A84C] text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#FAF8F5] transition-all whitespace-nowrap flex items-center gap-2 justify-center disabled:opacity-50">
                {loading ? "..." : <><span>Begin</span> <ArrowRight size={13} /></>}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-red-400">{error}</p>
            )}
          </div>
        ) : (
          <div className="py-4">
            <p className="text-[11px] uppercase tracking-[0.38em] text-[#C9A84C] font-bold mb-2">You're in.</p>
            <p className="text-[10px] opacity-40 tracking-[0.2em] uppercase">Check your inbox. Day 1 begins now.</p>
            <Link to="/7-day-challenge"
              className="mt-4 inline-flex items-center gap-2 px-8 py-4 bg-[#C9A84C] text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#FAF8F5] transition-all">
              Begin Now <ArrowRight size={13} />
            </Link>
          </div>
        )}
        <p className="mt-8 text-[8px] uppercase tracking-[0.35em] text-white/20">Ephesians 6:10–18</p>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
    </section>
  );
}

/* ─── GEAR BRIDGE ─────────────────────────────────────────────────── */

function GearBridgeSection() {
  return (
    <section className="relative py-24 md:py-40 px-6 overflow-hidden"
      style={{ backgroundColor: C.darkBg }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%,rgba(201,168,76,0.05) 0%,transparent 58%)" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent to-white/10 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20 bridge-reveal">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/70 font-bold mb-8">
            On the Gear
          </p>
          <h2 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase leading-none tracking-[0.15em] md:tracking-[0.18em] text-white mb-5">
            The Gear Is Not<br /><span className="text-[#C9A84C]">The Mission.</span>
          </h2>
          <p className="font-brand text-base md:text-xl uppercase tracking-[0.22em] opacity-25 mb-8">
            It's a marker of it.
          </p>
          <div className="w-12 h-[1px] bg-[#C9A84C]/40 mx-auto" />
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-16 bridge-reveal">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-[9px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase font-bold">
              Linked to the Gear
            </span>
            <p className="text-xs md:text-sm text-white/45 leading-relaxed">
              Every release unlocks a hub of formation content — devotion, practice, reflection, video, and community challenge — accessed through QR touchpoints built into the gear itself.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 md:gap-2 text-[10px] uppercase tracking-[0.26em] text-white/30 font-bold pt-2">
              <span>Gear</span>
              <span className="text-[#C9A84C]">→</span>
              <span>QR</span>
              <span className="text-[#C9A84C]">→</span>
              <span>Guide</span>
              <span className="text-[#C9A84C]">→</span>
              <span>Practice</span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              {/* QR routes directly to the Field Guide landing page */}
              <img
                src="/qr-field-guide.png"
                alt="Field Guide QR code"
                className="w-24 h-24 md:w-28 md:h-28 opacity-70"
                loading="lazy"
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fcounterformed.com${FG_BASE}`;
                }}
              />
            </div>
            <span className="text-[7px] uppercase tracking-[0.3em] text-white/20">Scan to access</span>
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
      { name: "Technical Tee", img: "/DriFit_Black.png",  copy: "Performance tech for training." },
      { name: "Everyday Tee",  img: "/Tshirt_Studio.png", copy: "Premium soft-wash cotton." },
      { name: "Hoodies",       img: "/shield-black.png",  copy: "Heavyweight anchors.", comingSoon: true },
    ],
  },
  women: {
    label: "The Collective", sublabel: "Women", accent: "#8FAF8A",
    accentMuted: "rgba(143,175,138,0.18)", phrase: "Rooted. Rising. Set Apart.", sub: "Wear the formation.",
    shopUrl: SHOPIFY_URL,
    products: [
      { name: "Rooted Hoodie",    img: "/placeholder.png", copy: "Heavyweight. Oversized. Anchored.", phrase: "Psalm 1" },
      { name: "Set Apart Tee",    img: "/placeholder.png", copy: "Premium soft-wash cotton.", phrase: "Romans 12:2", comingSoon: true },
      { name: "Rise Athletic Set",img: "/placeholder.png", copy: "Cropped hoodie + shorts.", comingSoon: true },
    ],
  },
};

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

  return (
    <>
      <div className="h-24 md:h-32 w-full pointer-events-none"
        style={{ background: `linear-gradient(to bottom,${C.darkBg},${C.gearBg})` }} />

      <section id="shop" className="pb-24 md:pb-48 px-4 md:px-6 relative overflow-hidden"
        style={{
          backgroundColor: C.gearBg,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}>
        <div className="max-w-7xl mx-auto relative z-10 text-[#0D0D12]">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12 mb-10 md:mb-14 pt-4">
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.08em]">The Gear</h2>
            <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(0,0,0,0.08)" }}>
              {Object.entries(GEAR_TABS).map(([key, t]) => {
                const isActive = active === key;
                return (
                  <button key={key} onClick={() => switchTab(key)}
                    className="relative px-5 py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.22em] font-bold transition-all duration-300"
                    style={{ background: isActive ? "#0D0D12" : "transparent", color: isActive ? t.accent : "rgba(13,13,18,0.45)", boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.18)" : "none" }}>
                    {t.sublabel}
                    {isActive && <span className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: t.accent }} />}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={panelRef}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-10 md:mb-14">
              <div className="flex items-center gap-3">
                {active === "women" && (
                  <span className="text-[8px] uppercase tracking-[0.38em] font-bold px-3 py-1 rounded-full"
                    style={{ background: "rgba(143,175,138,0.15)", color: "#8FAF8A", border: "1px solid rgba(143,175,138,0.25)" }}>
                    Collective
                  </span>
                )}
                <p className="font-brand text-sm md:text-base uppercase tracking-[0.18em] opacity-60"
                  style={{ color: active === "women" ? "#3A4A38" : "#0D0D12" }}>
                  {tab.phrase}
                </p>
              </div>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.22em] opacity-40 font-bold">{tab.sub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {tab.products.map(cat => (
                <TiltCard key={cat.name} disabled={cat.comingSoon}
                  className="product-card group relative overflow-hidden bg-black aspect-[3/4] rounded-[2rem] md:rounded-[3rem] transition-transform duration-700 hover:-translate-y-2 md:hover:-translate-y-4 shadow-2xl shadow-black/25">
                  <a href={cat.comingSoon ? undefined : tab.shopUrl}
                    target="_blank" rel="noopener noreferrer"
                    className={cx("block h-full relative", cat.comingSoon && "pointer-events-none")}>
                    <div className="absolute inset-0 opacity-60 group-hover:opacity-90 grayscale group-hover:grayscale-0 transition-all duration-1000">
                      <SafeImg src={cat.img} className="w-full h-full object-cover" alt={cat.name} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    {active === "women" && cat.phrase && (
                      <div className="absolute top-5 left-5 text-[7px] uppercase tracking-[0.32em] font-bold"
                        style={{ color: "rgba(143,175,138,0.55)" }}>{cat.phrase}</div>
                    )}
                    <div className="relative z-10 h-full p-8 md:p-12 flex flex-col justify-end text-white">
                      <h3 className="font-brand text-2xl md:text-4xl uppercase italic">{cat.name}</h3>
                      <p className="text-[9px] md:text-[10px] opacity-60 uppercase mt-2 tracking-widest">{cat.copy}</p>
                      {cat.comingSoon ? (
                        <p className="text-[8px] tracking-widest uppercase mt-3 font-bold" style={{ color: `${tab.accent}99` }}>Coming Soon</p>
                      ) : (
                        <div className="flex items-center gap-3 text-[9px] pt-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: tab.accent }}>
                          Shop <ArrowRight size={14} />
                        </div>
                      )}
                    </div>
                  </a>
                </TiltCard>
              ))}
            </div>

            {active === "women" && (
              <div className="mt-12 md:mt-16 text-center">
                <p className="text-[9px] uppercase tracking-[0.32em] font-bold mb-2" style={{ color: "rgba(143,175,138,0.65)" }}>The Collective</p>
                <p className="text-[10px] md:text-xs opacity-40 tracking-[0.14em] max-w-sm mx-auto leading-relaxed" style={{ color: "#2A3A28" }}>
                  Same Rule. Different expression. Strength, rooted in light.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────────── */

function Footer() {
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
        <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/60 mb-8 font-bold">The Mission</p>
        <h3 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.12em] md:tracking-[0.16em] leading-none text-white mb-3">
          Formed in Christ.
        </h3>
        <h3 className="font-brand text-xl md:text-3xl lg:text-4xl uppercase tracking-[0.12em] leading-none text-white/20 mb-10">
          Not drifting.
        </h3>
        <p className="text-[9px] md:text-xs opacity-35 tracking-[0.25em] uppercase max-w-sm mx-auto leading-loose">
          Intentional formation in a world designed for drift.
        </p>
      </div>

      <div className="footer-reveal max-w-2xl mx-auto py-16 px-6 text-center border-b border-white/[0.05]">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-[#C9A84C]/60 font-bold mb-3 block">Stay in the Formation</span>
        <h4 className="font-brand text-xl md:text-2xl uppercase tracking-[0.15em] text-white mb-8">Join the Formation</h4>
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
                className="px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap border hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: C.ivory }}>
                {loading ? "..." : "Join"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-red-400">{error}</p>
            )}
          </div>
        ) : (
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#C9A84C]">You're in. Weekly field notes incoming.</p>
        )}
        <p className="mt-4 text-[8px] uppercase tracking-[0.3em] text-white/20">Weekly field notes. No noise.</p>
      </div>

      <div className="footer-reveal max-w-7xl mx-auto py-14 px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
        <div className="col-span-2 md:col-span-1 space-y-5">
          <div className="flex items-center gap-3">
            <SafeImg src="/helmet.png" className="w-10 h-10 md:w-12 md:h-12 object-contain flex-shrink-0" alt="" />
            <span className="font-brand text-base md:text-lg text-[#C9A84C]">Counter Formation</span>
          </div>
          <p className="text-[9px] uppercase tracking-widest opacity-30 leading-relaxed max-w-[180px]">
            Formed in Christ.<br />Living counter to culture.
          </p>
        </div>
        <div className="space-y-4 text-[9px] tracking-widest">
          <span className="text-[#C9A84C] opacity-60 uppercase block mb-5">Navigate</span>
          {[["Mission","#architecture"],["Rule of Life","#rule"],["Field Guide","#field-guide"],["The Gear","#shop"]].map(([l,h]) => (
            <a key={l} href={h} className="block opacity-35 hover:opacity-70 hover:text-white transition-all">{l}</a>
          ))}
          <Link to="/7-day-challenge" className="block opacity-35 hover:opacity-70 hover:text-[#C9A84C] transition-all">7-Day Challenge</Link>
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
  );
}

/* ─── FLOATING CHALLENGE TRIGGER ─────────────────────────────────── */

function FloatingChallengeTrigger() {
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
        onClick={() => document.getElementById("challenge")?.scrollIntoView({ behavior: "smooth" })}
        className="flex items-center gap-3 px-5 py-3 rounded-full text-black text-[10px] uppercase tracking-[0.22em] font-bold transition-all hover:scale-105"
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

/* ─── MAIN SITE ───────────────────────────────────────────────────── */

function MainSite() {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useBodyScrollLock(isMenuOpen);
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  const navLinks = [
    { label: "Mission",     href: "#architecture" },
    { label: "Rule",        href: "#rule" },
    { label: "Field Guide", href: "#field-guide" },
    { label: "Gear",        href: "#shop", gold: true },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-fade", { opacity: 0, y: -10, duration: 0.9, ease: "power2.out", delay: 0.3 });
      gsap.utils.toArray(".pillar-reveal").forEach(el => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });
      const batchReveal = (sel, y = 20) => {
        ScrollTrigger.batch(sel, {
          start: "top 92%",
          onEnter: batch => gsap.fromTo(batch,
            { opacity: 0, y },
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.09, ease: "power2.out", overwrite: "auto" }),
        });
      };
      batchReveal(".manifesto-item");
      batchReveal(".product-card", 24);
      batchReveal(".footer-reveal", 16);
      batchReveal(".bridge-reveal", 30);
      batchReveal(".journal-card", 20);

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

  return (
    <div ref={mainRef}
      className="text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
      style={{ backgroundColor: C.darkBg }}>

      <nav className="nav-fade fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: `${C.darkBg}cc` }}>
        <a href="#top" className="flex items-center gap-2 md:gap-3">
          <SafeImg src="/helmet.png" className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0" alt="Counter Formation" />
          <span className="font-brand text-[9px] md:text-sm tracking-[0.2em] md:tracking-[0.28em] uppercase whitespace-nowrap">
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
          <a href={SHOPIFY_URL}
            className="px-4 py-2 md:px-6 md:py-2 bg-white text-black rounded-full text-[9px] md:text-[10px] hidden md:block hover:bg-[#C9A84C] transition-all uppercase tracking-widest font-bold">
            Shop the Gear
          </a>
          <button onClick={() => setIsMenuOpen(v => !v)} className="md:hidden p-1" aria-label="Toggle menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      <div className={cx("fixed inset-0 z-[120] flex flex-col items-center justify-center space-y-8 transition-transform duration-500",
        isMenuOpen ? "translate-y-0" : "-translate-y-full")}
        style={{ backgroundColor: C.darkBg }}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8">
          <X size={28} />
        </button>
        {navLinks.map(l => (
          <a key={l.label} href={l.href} onClick={() => setIsMenuOpen(false)}
            className={cx("font-brand text-xl tracking-[0.3em] uppercase", l.gold && "text-[#C9A84C]")}>
            {l.label}
          </a>
        ))}
        <a href={SHOPIFY_URL}
          className="text-[10px] text-[#C9A84C] tracking-widest uppercase border border-[#C9A84C]/20 px-8 py-3 rounded-full">
          Enter Store
        </a>
      </div>

      <CinematicHero />
      <SectionDivider />
      <ArchitectureSlider />
      <SectionDivider />
      <RuleOfLifeSection />
      <LightTransition />
      <FieldGuideSection />
      <SectionDivider />
      <ChallengeSection />
      <SectionDivider />
      <GearBridgeSection />
      <GearSection />
      <Footer />
      <FloatingChallengeTrigger />
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

        {/* 7-Day Challenge routes */}
        <Route path="/7-day-challenge" element={<CFLanding />} />
        <Route path="/7-day-challenge/day/:day" element={<CFDevotion />} />

        {/* Rule of Life routes */}
        <Route path="/rule-of-life/:rhythm" element={<RhythmPage />} />
        <Route path="/rule-of-life/:rhythm/book/:bookIndex" element={<BookPage />} />

        {/* Architecture routes */}
        <Route path="/identity"  element={<IdentityPage />} />
        <Route path="/practice"  element={<PracticePage />} />
        <Route path="/community" element={<CommunityPage />} />

        {/* Fallback */}
        <Route path="*" element={<MainSite />} />
      </Routes>
    </BrowserRouter>
  );
}