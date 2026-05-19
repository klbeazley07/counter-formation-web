import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { FormationProfileProvider, useFormationProfile } from "./hooks/useFormationProfile";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, X } from "lucide-react";

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
import { IdentityLanding, ArmorPiecePage, ArmorStyles } from "./Identity";
import AboutPage from "./About";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { MobileTabBar } from "./components/MobileTabBar";
import { CampaignBanner } from "./components/CampaignBanner";
import FruitAssessment, { FAStyles } from "./FruitAssessment";
import GiftsProcessing from "./components/field-guide/gifts/GiftsProcessing";
import GiftsResults from "./components/field-guide/gifts/GiftsResults";
import GiftsRecover from "./components/field-guide/gifts/GiftsRecover";
import HomeRouter, { hasMeaningfulActivity } from "./components/personal/HomeRouter";
import FormationPictureView from "./components/field-guide/gifts/FormationPictureView";
import TrustedPersonInvitationFlow from "./components/field-guide/gifts/TrustedPersonInvitationFlow";
import TrustedPersonAssessment from "./components/field-guide/gifts/TrustedPersonAssessment";
import AssessmentIntro from "./components/field-guide/gifts/AssessmentIntro";
import AssessmentQuestion from "./components/field-guide/gifts/AssessmentQuestion";
import AuthCallback from "./components/auth/AuthCallback";
import AgentOnboarding from "./components/agent/AgentOnboarding";
import AgentHistory from "./components/agent/AgentHistory";
import NewsletterCapture from "./components/NewsletterCapture";
import { installAuthStateListener } from "./utils/authBackfill";

// Install the auth listener once at module load so SIGNED_IN events from the
// magic-link callback trigger the backfill regardless of which route is active.
installAuthStateListener();

gsap.registerPlugin(ScrollTrigger);

/* ─── SCROLL RESTORATION ──────────────────────────────────────────── */

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

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
        pathCard2Ref.current, scriptureRef.current,
        ...(scrollIndicatorRef.current ? [scrollIndicatorRef.current] : [])], { opacity: 0 });
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
        .to(scriptureRef.current, { opacity: 0.55, y: 0, filter: "blur(0px)", duration: 0.8 }, "-=0.35")
        .to(scrollIndicatorRef.current ?? {}, { opacity: 1, duration: 0.7 }, "-=0.3")
        .to([vBeamRef.current, hBeamRef.current, bloomRef.current],
          { opacity: 0, duration: 2.5, ease: "power2.inOut" }, "+=2.5");

      gsap.to(bgGlowRef.current,    { x: 12, y: -10, duration: 9,  repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });
      gsap.to(particlesRef.current, { y: -14,         duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 4.5 });
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, { y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 5.2 });
      }

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
      className="relative overflow-hidden flex items-center justify-center text-center"
      style={{ backgroundColor: C.heroBg, minHeight: "100svh" }}>
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

      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-20 pb-10 text-center md:justify-center" style={{ minHeight: "inherit" }}>
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
          <p className="text-[12px] md:text-[9px] tracking-[0.28em] uppercase leading-loose font-light text-white/36">
            Limited drops. Purposeful design. Disciplined faith.
          </p>
        </div>
        {/* Mobile: SAVD-style full-width button pair */}
        <div ref={ctaRef} className="mt-10 md:hidden flex gap-3 justify-center px-6">
          <a ref={pathCard1Ref} href="#shop"
            className="flex items-center justify-center gap-2 py-[9px] px-5 rounded-full text-[11px] uppercase tracking-[0.18em] font-bold transition-all duration-300 active:scale-95 whitespace-nowrap"
            style={{ background: "#FAF8F5", color: "#0A0A0A" }}>
            Shop the Gear
          </a>
          <a ref={pathCard2Ref} href="#architecture"
            className="flex items-center justify-center gap-2 py-[9px] px-5 rounded-full text-[11px] uppercase tracking-[0.18em] font-bold transition-all duration-300 active:scale-95 whitespace-nowrap"
            style={{ background: "transparent", border: "1.5px solid rgba(250,248,245,0.55)", color: "#FAF8F5" }}>
            Explore Formation
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
          className="mt-8 md:mt-10 text-[10px] uppercase tracking-[0.35em] text-white/50 opacity-0">
          Ephesians 6:10–18
        </div>

      </div>

      <div ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 md:flex flex-col items-center gap-2 opacity-0 pointer-events-none z-20 hidden">
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

function RuleOfLifeSection() {
  const rhythms = [
    { title: "Presence",  desc: "Attention before God",    slug: "presence",  bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600", summary: "Learning to abide in Christ so deeply that His presence overflows from your life into everything you touch." },
    { title: "Scripture", desc: "Truth before noise",       slug: "scripture", bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",    summary: "The world has a script for your day. So does God. Only one of them is true." },
    { title: "Prayer",    desc: "Dependence before action", slug: "prayer",    bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600",  summary: "You were never meant to figure this out alone. Prayer is the admission that you can't." },
    { title: "Sabbath",   desc: "Rest before production",   slug: "sabbath",   bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600",  summary: "A life that cannot stop is a life that does not trust. Sabbath is how you prove you believe God is in control." },
    { title: "Community", desc: "Formation together",       slug: "community", bg: "/Community_8k.png",                                                         summary: "You cannot be formed alone. The practices that change your life require people who will hold you to them." },
  ];

  const carouselRef = useRef(null);

  return (
    <section id="rule" className="md:py-48 md:px-6 relative md:overflow-hidden overflow-hidden"
      style={{ backgroundColor: C.ruleBg }}>
      <div className="section-bg-parallax section-glow absolute inset-0 pointer-events-none" />
      <div className="hidden md:block max-w-7xl mx-auto relative z-10 lg:px-4 xl:px-8">
        <div className="mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <span className="text-[11px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em] uppercase font-bold">The Pattern</span>
            <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.12em] text-white leading-none">
              Rule of Life
            </h2>
          </div>
          <p className="max-w-md text-xs md:text-base opacity-70 md:opacity-50 leading-relaxed font-light text-left md:text-right">
            A set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
          </p>
        </div>
      </div>
      {/* NOTE: GSAP ScrollTrigger animations targeting .rhythm-img-wrap and .manifesto-item
    use window scroll and won't fire inside this snap container on mobile.
    The mobile CSS below ensures cards are visible by default (opacity/transform reset). */}
      <div ref={carouselRef} className="rhythm-carousel">

        {/* Mobile-only intro slide — slide 0 */}
        <div className="rhythm-intro-slide md:hidden">
          <div className="absolute inset-0 z-0">
            <img src="/Rule of Life_Hero.png" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top,${C.ruleBg} 30%,${C.ruleBg}88 60%,${C.ruleBg}33)` }} />
          </div>
          <div className="relative z-10">
            <span style={{
              display: "block",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: "16px",
            }}>The Pattern</span>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(52px, 14vw, 80px)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#FAF8F5",
              lineHeight: 1,
              marginBottom: "20px",
            }}>Rule of Life</h2>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "16px",
              lineHeight: 1.65,
              color: "rgba(250,248,245,0.65)",
              marginBottom: "32px",
              maxWidth: "300px",
            }}>
              A set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
            </p>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              border: `1px solid ${C.gold}55`,
              borderRadius: "999px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: C.gold,
            }}>
              Swipe to Explore
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12M8 1l5 4-5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {/* Swipe indicator */}
          <div className="absolute bottom-10 right-8 md:hidden opacity-40 animate-bounce">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M1 1L10 10L1 19" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

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
              style={{ background: `linear-gradient(to top,${C.ruleBg} 35%,${C.ruleBg}77 60%,transparent)` }} />
            <div className="rhythm-card-content relative z-10 p-6 md:p-8 flex flex-col" style={{ flex: 1 }}>
              {/* Desktop: eyebrow + title at top */}
              <div className="space-y-3 md:block hidden">
                <span className="block font-mono text-[11px] text-[#C9A84C]/70 tracking-[0.3em] group-hover:text-[#C9A84C] transition-colors">
                  RHYTHM 0{i + 1}
                </span>
                <h3 className="font-brand uppercase tracking-[0.1em] text-white">{r.title}</h3>
              </div>

              {/* Desktop: desc + summary at bottom */}
              <div className="mt-auto relative hidden md:block">
                <p className="text-[12px] md:text-xs opacity-60 tracking-wide leading-[1.65] font-light">{r.desc}</p>
                <p className="text-[13px] leading-[1.65] px-0 mt-2
                  font-['Cormorant_Garamond'] italic text-[#FAF8F5]
                  md:absolute md:top-full md:left-0 md:right-0
                  md:opacity-0 md:translate-y-2 md:group-hover:opacity-85 md:group-hover:translate-y-0
                  transition-all duration-300 ease-out">
                  {r.summary}
                </p>
              </div>

              {/* Mobile: everything in one bottom-anchored group */}
              <div className="mt-auto md:hidden flex flex-col gap-3">
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(201,168,76,0.8)",
                }}>RHYTHM 0{i + 1}</span>
                <h3 className="font-brand uppercase tracking-[0.1em] text-white">{r.title}</h3>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "clamp(17px, 4.5vw, 22px)",
                  lineHeight: 1.55,
                  color: "rgba(250,248,245,0.80)",
                }}>{r.summary}</p>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 18px",
                  border: `1px solid ${C.gold}44`,
                  borderRadius: "999px",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: C.gold,
                  alignSelf: "flex-start",
                  marginTop: "4px",
                }}>
                  Explore
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5h10M6.5 1l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* Right-pointing swipe indicator */}
            {i < rhythms.length - 1 && (
              <div className="absolute bottom-10 right-8 md:hidden opacity-40 animate-bounce z-20">
                <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                  <path d="M1 1L10 10L1 19" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            )}
          </Link>
        ))}
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
      cta: "Open Guide",
    },
    {
      type: "Assessment", rhythm: "Formation", date: "April 2026",
      title: "Fruit of the Spirit",
      img: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=1200",
      desc: "A 27-question diagnostic that reveals where the Spirit has the most room to work in you right now.",
      href: "/field-guide/fruit-assessment",
      isLink: true,
      cta: "Begin Assessment",
    },
    {
      type: "Devotion", rhythm: "Scripture", date: "March 2026",
      title: "Scripture Before Scroll",
      img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200",
      desc: "Reclaim the architecture of your first hour through scripture before the algorithm.",
      href: FG_BASE,
      isLink: true,
      cta: "Enter the Rhythm",
    },
    {
      type: "Assessment", rhythm: "Formation", date: "May 2026",
      title: "Spiritual Gifts",
      img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200",
      desc: "How the Spirit is moving through you to build up the body. Three streams of evidence, woven into a single picture of where God is at work.",
      href: "/field-guide/gifts",
      isLink: true,
      cta: "Begin Assessment",
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
                {featured.cta || "Open Guide"} <ArrowRight size={14} />
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
                        {art.cta || "Coming Next"} <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent mb-10 md:mb-14" />

        <div className="flex justify-center">
          <Link to={FG_BASE} className="text-[11px] md:text-[10px] text-[#C9A84C] border border-white/10 px-8 py-3 hover:bg-white/5 transition-all whitespace-nowrap rounded-full uppercase tracking-[0.22em] font-bold">
            Explore Archive
          </Link>
        </div>
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
    <section id="gear-bridge" className="relative py-24 md:py-40 px-6 overflow-hidden"
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

const COLLECTIONS = [
  {
    key: "counter-formation",
    drop: "001",
    title: "Counter Formation",
    subtitle: "The Foundation",
    tagline: "Apparel as a visual anchor.",
    description: "Collection of Counter Formation Branded Gear. Designed as a daily reminder that you are being formed — BATTLE THE DRIFT.",
    accent: "#C9A84C",
    accentMuted: "rgba(201,168,76,0.18)",
    pillar: "Practice",
    pillarRoute: "/rule-of-life/presence",
    shopUrl: "https://shop.counterformed.com/collections/the-gear",
    products: [
      { name: "Technical Tee", img: "/DriFit_Black.png", copy: "Performance tech for training.", tier: "available", slug: "technical-tee", shopUrl: "https://shop.counterformed.com/products/counter-formation-spartan-logo-polyester-t-shirt" },
      { name: "Everyday Tee", img: "/Tshirt_Studio.png", copy: "Premium soft-wash cotton.", tier: "available", slug: "everyday-tee", shopUrl: "https://shop.counterformed.com/products/everyday-tee" },
      { name: "Technical Hoodie", img: "/Hoodie_white.png", copy: "Heavyweight Performance Tech.", tier: "available", slug: "technical-hoodie", shopUrl: "https://shop.counterformed.com/products/counter-formation-technical-hoodie" },
      { name: "Trucker Hat", img: "/Trucker Hat_full.png", copy: "Structured front. Mesh back. Built to last.", tier: "available", slug: "trucker-hat", shopUrl: "https://shop.counterformed.com/products/counter-formation-trucker-hat" },
    ],
  },
  {
    key: "armor-of-god",
    drop: "002",
    title: "Armor of God",
    subtitle: "The Identity Collection",
    tagline: "Armor Up.",
    description: "Six pieces of armor. Six formation tracks. Every garment connects to a devotional pathway through the QR code on the back.",
    accent: "#C9A84C",
    accentMuted: "rgba(201,168,76,0.18)",
    pillar: "Identity",
    pillarRoute: "/identity",
    shopUrl: "https://shop.counterformed.com/collections/armor-of-god-collection",
    products: [
      { name: "Helmet of Salvation Hoodie", img: "/Hoodie_white.png", copy: "Technical Hoodie. Protect the mind.", tier: "available", future: true, slug: "helmet-hoodie", shopUrl: "https://shop.counterformed.com/collections/armor-of-god-collection" },
      { name: "Shield of Faith Tee", img: "/DriFit_Black.png", copy: "Premium Everyday Tee. Stand behind what God has said.", tier: "available", future: true, slug: "shield-tee", shopUrl: "https://shop.counterformed.com/collections/armor-of-god-collection" },
      { name: "Sword of the Spirit Tee", img: "/Tshirt_Studio.png", copy: "Technical Tee. The Word is a weapon.", tier: "available", future: true, slug: "sword-tee", shopUrl: "https://shop.counterformed.com/collections/armor-of-god-collection" },
    ],
  },
];

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
                className="flex-1 min-w-0 px-3 py-2 rounded-full text-[10px] text-white placeholder-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 tracking-wider uppercase"
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
  const [activeKey, setActiveKey] = useState(COLLECTIONS[0].key);
  const [activeSlide, setActiveSlide] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sectionInView, setSectionInView] = useState(false);
  const panelRef = useRef(null);
  const carouselRef = useRef(null);
  const sectionRef = useRef(null);
  const hasShownHint = useRef(false);

  const active = COLLECTIONS.find(c => c.key === activeKey) || COLLECTIONS[0];
  const available = active.products.filter(p => p.tier === "available");
  const teaser = active.products.filter(p => p.tier === "teaser");

  const activeIdx = COLLECTIONS.findIndex(c => c.key === activeKey);
  const hasPrev = activeIdx > 0;
  const hasNext = activeIdx < COLLECTIONS.length - 1;
  const goToPrev = () => { if (hasPrev) switchCollection(COLLECTIONS[activeIdx - 1].key); };
  const goToNext = () => { if (hasNext) switchCollection(COLLECTIONS[activeIdx + 1].key); };

  const switchCollection = (key) => {
    if (key === activeKey) return;
    gsap.to(panelRef.current, {
      opacity: 0, y: 8, duration: 0.22, ease: "power2.in",
      onComplete: () => {
        setActiveKey(key);
        setActiveSlide(0);
        if (carouselRef.current) {
          carouselRef.current.scrollTo({ left: 0, behavior: "instant" });
        }
        gsap.fromTo(panelRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power2.out" });
      },
    });
  };

  // Track section visibility for floating pill
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSectionInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close picker when section leaves view
  useEffect(() => {
    if (!sectionInView) setPickerOpen(false);
  }, [sectionInView]);

  // Track active slide via carousel scroll
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || window.innerWidth >= 768) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveSlide(Math.max(0, Math.min(idx, available.length - 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [available.length, activeKey]);

  // Swipe hint — nudge right and snap back on first view of each collection
  useEffect(() => {
    const el = carouselRef.current;
    if (!el || window.innerWidth >= 768) return;
    hasShownHint.current = false;
    const timeout = setTimeout(() => {
      if (hasShownHint.current) return;
      hasShownHint.current = true;
      gsap.to(el, {
        scrollLeft: 50,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(el, { scrollLeft: 0, duration: 0.4, ease: "power2.inOut" });
        },
      });
    }, 800);
    return () => clearTimeout(timeout);
  }, [activeKey]);

  const lockToFullScreen = () => {
    if (window.innerWidth >= 768) return;
    const el = sectionRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <section id="shop" ref={sectionRef} className="py-24 md:py-48 px-4 md:px-6 relative overflow-hidden gear-section-mobile"
      style={{ backgroundColor: C.darkBg }}>
      <style>{`
        .gear-shelf::-webkit-scrollbar { display: none; }
        .gear-lookbook { display: none; }
        .gear-grid-desktop { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: clamp(20px, 2.5vw, 32px); }
        @media (max-width: 767px) {
          .gear-section-mobile { padding-top: 0 !important; padding-bottom: 0 !important; padding-left: 0 !important; padding-right: 0 !important; overflow: visible !important; }
          .gear-section-header { display: none; }
          .gear-capsule-shelf { display: none; }
          .gear-collection-hero { display: none; }
          .gear-desktop-only { display: none !important; }
          .gear-lookbook { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; margin-left: 0; margin-right: 0; }
          .gear-lookbook::-webkit-scrollbar { display: none; }
          .gear-slide { flex: 0 0 100vw; width: 100vw; scroll-snap-align: start; scroll-snap-stop: always; position: relative; overflow: hidden; height: calc(100vh - 60px - 64px); height: calc(100svh - 60px - 64px); }
          .gear-grid-desktop { display: none !important; }
        }
        .gear-pill-enter { animation: gearPillDropIn 0.3s ease forwards; }
        @keyframes gearPillDropIn { from { opacity: 0; transform: translateX(-50%) translateY(-16px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .gear-picker-backdrop { animation: gearFadeIn 0.2s ease forwards; }
        .gear-picker-sheet { animation: gearSheetUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes gearFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes gearSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.03) 0%, transparent 60%)" }} />
      <div className="max-w-7xl mx-auto relative z-10 text-white">

        {/* Section header */}
        <div className="gear-section-header flex flex-col items-start gap-4 mb-10 md:mb-14 pt-4">
          <p className="text-[9px] md:text-[10px] uppercase tracking-[0.38em] text-white/45 font-bold">
            Built with purpose. Worn as a reminder.
          </p>
          <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.08em] text-white">The Gear</h2>
        </div>

        {/* Drop shelf selector */}
        <div className="gear-capsule-shelf">
        <p style={{ fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(250,248,245,0.3)", fontWeight: 700, marginBottom: "12px" }}>
          Apparel Collections
        </p>
        <div
          className="gear-shelf"
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "4px",
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            justifyContent: "flex-start",
          }}
        >
          {COLLECTIONS.map(col => {
            const isActive = col.key === activeKey;
            return (
              <button
                key={col.key}
                onClick={() => switchCollection(col.key)}
                style={{
                  flex: "0 0 auto",
                  width: "clamp(160px, 18vw, 210px)",
                  padding: "1.25rem 1.5rem",
                  background: isActive ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? col.accent + "55" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                  scrollSnapAlign: "start",
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: "20%",
                  right: "20%",
                  height: "2px",
                  background: isActive ? col.accent : `linear-gradient(to right, transparent, ${col.accent}33, transparent)`,
                  transition: "all 0.3s",
                }} />
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: isActive ? col.accent : "rgba(250,248,245,0.25)",
                  transition: "color 0.3s",
                  display: "block",
                }}>
                  Drop {col.drop}
                </span>
                <p style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "clamp(14px, 1.6vw, 17px)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: isActive ? "#FAF8F5" : "rgba(250,248,245,0.3)",
                  margin: "6px 0 0",
                  transition: "color 0.3s",
                  lineHeight: 1.2,
                }}>
                  {col.title}
                </p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "13px",
                  color: isActive ? "rgba(250,248,245,0.45)" : "rgba(250,248,245,0.15)",
                  margin: "4px 0 0",
                  transition: "color 0.3s",
                }}>
                  {col.subtitle}
                </p>
              </button>
            );
          })}
        </div>
        </div>{/* end gear-capsule-shelf */}

        {/* Collection showcase */}
        <div ref={panelRef}>

          {/* Collection hero */}
          <div className="gear-collection-hero" style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
            <h3 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(24px, 4vw, 44px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#FAF8F5", lineHeight: 0.95, marginBottom: "0.75rem" }}>
              {active.title}
            </h3>
            {active.tagline && (
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(16px, 2.5vw, 22px)", color: `${active.accent}88`, marginBottom: "1rem" }}>
                {active.tagline}
              </p>
            )}
            <p style={{ fontSize: "clamp(12px, 1.5vw, 14px)", color: "rgba(250,248,245,0.35)", maxWidth: "600px", lineHeight: 1.7, letterSpacing: "0.02em" }}>
              {active.description}
            </p>
          </div>

          {/* Mobile: full-screen lookbook */}
          <div ref={carouselRef} className="gear-lookbook">
            {available.map((product) => (
              <div key={product.slug || product.name} className="gear-slide" onClick={lockToFullScreen}>
                <SafeImg src={product.img} alt={product.name}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center 40%", ...(product.future ? { filter: "grayscale(1)", opacity: 0.25 } : {}) }} />
                {/* Top gradient — subtle, for nav legibility */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "20%", background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)", pointerEvents: "none" }} />
                {/* Bottom gradient — heavy, for text legibility */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 35%, transparent 100%)", pointerEvents: "none" }} />
                {product.future && (
                  <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 3 }}>
                    <span style={{ fontSize: "10px", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 700, color: "rgba(250,248,245,0.55)", border: "1px solid rgba(250,248,245,0.15)", borderRadius: "999px", padding: "8px 22px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                      Future Drop
                    </span>
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 24px 24px", zIndex: 2 }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: `${active.accent}66`, fontWeight: 700, marginBottom: "8px" }}>
                    Drop {active.drop} · {active.title}
                  </p>
                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(26px, 7vw, 36px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: product.future ? "rgba(250,248,245,0.25)" : "#FAF8F5", lineHeight: 1.0, marginBottom: "6px" }}>
                    {product.name}
                  </h3>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(250,248,245,0.3)", marginBottom: "16px" }}>
                    {product.copy}
                  </p>
                  {!product.future && (
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <a href={product.shopUrl || active.shopUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", borderRadius: "999px", background: active.accent, color: "#0A0A0A", fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", boxShadow: `0 4px 24px ${active.accent}44`, flexShrink: 0 }}>
                        Shop This Piece
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </a>
                      <a href={active.shopUrl} target="_blank" rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "12px 20px", borderRadius: "999px", background: "transparent", border: `1px solid ${active.accent}55`, color: active.accent, fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", letterSpacing: "0.24em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none", flexShrink: 0 }}>
                        Full Collection
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slide indicator dots — mobile only, tappable */}
          {available.length > 1 && (
            <div className="md:hidden" style={{ display: "flex", gap: "6px", justifyContent: "center", padding: "12px 0", background: "#0E0C0A" }}>
              {available.map((_, i) => (
                <button key={i} onClick={() => carouselRef.current?.scrollTo({ left: i * window.innerWidth, behavior: "smooth" })}
                  aria-label={`View product ${i + 1}`}
                  style={{ width: i === activeSlide ? 22 : 8, height: 3, borderRadius: 2, background: i === activeSlide ? active.accent : "rgba(250,248,245,0.12)", transition: "all 0.3s ease", border: "none", padding: 0, cursor: "pointer" }} />
              ))}
            </div>
          )}

          {/* Desktop: unchanged grid */}
          <div className="gear-grid-desktop">
            {available.map(product => (
              <div key={product.name} className="flex flex-col group">
                <TiltCard className="product-card relative overflow-hidden bg-black rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-black/25" style={{ aspectRatio: "3/4" }}>
                  <div className="block h-full relative">
                    <SafeImg src={product.img} className="w-full h-full object-contain" alt={product.name}
                      style={product.future ? { filter: "grayscale(1)", opacity: 0.3 } : {}} />
                    {product.future && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <span style={{ fontSize: "9px", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 700, color: "rgba(250,248,245,0.55)", border: "1px solid rgba(250,248,245,0.15)", borderRadius: "999px", padding: "6px 16px", background: "rgba(0,0,0,0.4)" }}>
                          Future Drop
                        </span>
                      </div>
                    )}
                  </div>
                </TiltCard>
                <div className="pt-4 px-1 flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`font-brand text-base md:text-lg uppercase tracking-[0.06em] ${product.future ? "text-white/30" : "text-white/90"}`}>{product.name}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-white/25 mt-1">{product.copy}</p>
                  </div>
                  {!product.future && (
                    <a href={product.shopUrl || active.shopUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.28em] transition-opacity opacity-50 group-hover:opacity-100 pt-0.5"
                      style={{ color: active.accent }}>
                      Shop <ArrowRight size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dropping soon */}
          {teaser.length > 0 && (
            <>
              <p style={{ fontSize: "11px", letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 700, marginTop: "clamp(2rem, 4vw, 3.5rem)", marginBottom: "1.5rem", color: `${active.accent}80` }}>
                Dropping Soon
              </p>
              <DroppingSoonStrip products={teaser} accent={active.accent} accentMuted={active.accentMuted} />
            </>
          )}

          {/* Shop CTA — desktop only (mobile has per-slide CTAs) */}
          <div className="hidden md:block" style={{ marginTop: "clamp(2rem, 4vw, 3rem)", textAlign: "center" }}>
            <a
              href={active.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 32px", borderRadius: "999px", border: `1px solid ${active.accent}44`, color: active.accent, fontSize: "10px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", textDecoration: "none", transition: "all 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.background = `${active.accent}15`; e.currentTarget.style.borderColor = active.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${active.accent}44`; }}
            >
              Shop Full Collection →
            </a>
          </div>

        </div>
      </div>

      {/* Floating collection pill — mobile only */}
      {sectionInView && (
        <div
          className="md:hidden gear-pill-enter"
          style={{
            position: "fixed",
            top: "68px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 95,
            display: "flex",
            alignItems: "center",
            background: "rgba(6,5,10,0.94)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: `1px solid ${active.accent}33`,
            borderRadius: "999px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <button onClick={goToPrev} disabled={!hasPrev} aria-label="Previous collection"
            style={{ padding: "10px 12px", background: "none", border: "none", color: hasPrev ? "rgba(250,248,245,0.4)" : "rgba(250,248,245,0.1)", fontSize: "16px", cursor: hasPrev ? "pointer" : "default", lineHeight: 1 }}>
            ‹
          </button>
          <button onClick={() => setPickerOpen(v => !v)} aria-label="Open collection picker"
            style={{ padding: "8px 14px", background: "none", border: "none", borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: active.accent, fontWeight: 700 }}>
              {active.drop}
            </span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(250,248,245,0.7)", fontWeight: 600, whiteSpace: "nowrap" }}>
              {active.title}
            </span>
          </button>
          <button onClick={goToNext} disabled={!hasNext} aria-label="Next collection"
            style={{ padding: "10px 12px", background: "none", border: "none", color: hasNext ? `${active.accent}99` : "rgba(250,248,245,0.1)", fontSize: "16px", cursor: hasNext ? "pointer" : "default", lineHeight: 1 }}>
            ›
          </button>
        </div>
      )}

      {/* Bottom sheet collection picker */}
      {pickerOpen && (
        <>
          <div className="md:hidden gear-picker-backdrop" onClick={() => setPickerOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 99, background: "rgba(0,0,0,0.5)" }} />
          <div className="md:hidden gear-picker-sheet" style={{
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
            background: "#111", borderTop: `1px solid ${active.accent}22`,
            borderRadius: "20px 20px 0 0",
            padding: "16px 20px calc(24px + env(safe-area-inset-bottom, 0px))",
          }}>
            <div style={{ width: 32, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 16px" }} />
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "9px", letterSpacing: "0.4em", textTransform: "uppercase", color: `${active.accent}77`, fontWeight: 700, marginBottom: "12px" }}>
              Collections
            </p>
            {COLLECTIONS.map(col => {
              const isCurrent = col.key === activeKey;
              return (
                <button key={col.key} onClick={() => { switchCollection(col.key); setPickerOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px", width: "100%",
                    padding: "14px 16px", borderRadius: "12px",
                    background: isCurrent ? `${col.accent}12` : "transparent",
                    border: `1px solid ${isCurrent ? col.accent + "33" : "rgba(255,255,255,0.05)"}`,
                    marginBottom: "8px", cursor: "pointer", textAlign: "left", transition: "background 0.2s",
                  }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "9px", letterSpacing: "0.28em", color: isCurrent ? col.accent : `${col.accent}55`, fontWeight: 700, flexShrink: 0 }}>
                    {col.drop}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: isCurrent ? "#FAF8F5" : "rgba(250,248,245,0.4)", margin: 0, lineHeight: 1.2 }}>
                      {col.title}
                    </p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "12px", color: isCurrent ? "rgba(250,248,245,0.4)" : "rgba(250,248,245,0.15)", margin: "2px 0 0" }}>
                      {col.subtitle}
                    </p>
                  </div>
                  {isCurrent && <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.accent, flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </>
      )}

    </section>
  );
}

function ChallengeModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);
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
    setSubmitted(false);
  }, [open]);

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
                <NewsletterCapture
                  ref={emailRef}
                  source="7day_challenge_modal"
                  buttonLabel={<><span>Begin</span> <ArrowRight size={13} /></>}
                  buttonStyle="filled"
                  onSuccess={() => setSubmitted(true)}
                />
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

/* ─── MAIN SITE ───────────────────────────────────────────────────── */

function ChallengeSlideBar() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const [visible, setVisible] = useState(false);
  const dismissed = isLoaded && profile?.dismissed?.slidebar === true;

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) setVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const dismiss = () => {
    setVisible(false);
    updateProfile({ dismissed: { slidebar: true } });
  };

  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? "0" : "120px"})`,
        transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
        zIndex: 120,
        width: "min(680px, calc(100vw - 2rem))",
      }}
    >
      <div style={{
        background: "#12100D",
        borderLeft: "3px solid #C9A84C",
        borderRadius: "14px",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeftWidth: "3px",
        borderLeftColor: "#C9A84C",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 700, marginBottom: "3px" }}>
            7-Day Formation Challenge
          </div>
          <div style={{ fontSize: "13px", color: "rgba(250,248,245,0.6)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Seven days. One practice each morning.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <Link
            to="/7-day-challenge"
            onClick={dismiss}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "#C9A84C", color: "#0E0C0A",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "9px 18px", borderRadius: "999px", textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Begin <ArrowRight size={12} />
          </Link>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.3)", padding: "4px", display: "flex",
            }}
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function MainSite() {
  const mainRef = useRef(null);
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const { profile } = useFormationProfile();
  const showReturnLink = hasMeaningfulActivity(profile);
  useBodyScrollLock(isChallengeOpen);

  const closeChallenge = useCallback(() => {
    setIsChallengeOpen(false);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      // For the Rule of Life section, snap flush to the top and reset the carousel
      if (id === "rule") {
        el.scrollIntoView({ behavior: "instant", block: "start" });
        const carousel = el.querySelector(".rhythm-carousel");
        if (carousel) carousel.scrollTo({ left: 0, behavior: "instant" });
        return;
      }
      const navOffset = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--banner-height") || "0") + 80;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
    }
  }, []);

  return (
    <div ref={mainRef}
      className="text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
      style={{ backgroundColor: C.darkBg }}>
      <ChallengeModal open={isChallengeOpen} onClose={closeChallenge} />
      <ChallengeSlideBar />

      {showReturnLink && (
        <Link
          to="/"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top) + 20px)",
            right: 20,
            zIndex: 60,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            background: "rgba(14,12,10,0.92)",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 999,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#C9A84C",
            textDecoration: "none",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          Return to your formation
          <span aria-hidden="true">→</span>
        </Link>
      )}

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
    </div>
  );
}

/* ─── ROOT — ROUTER ───────────────────────────────────────────────── */

export default function App() {
  return (
    <FormationProfileProvider>
    <BrowserRouter>
      <ScrollToTop />
      <FieldGuideStyles />
      <FAStyles />
      <ChallengeStyles />
      <RuleStyles />
      <ArchitectureStyles />
      <ArmorStyles />
      <CampaignBanner />
      <SiteNav />
      <Routes>
        {/* Main site */}
        <Route path="/" element={<HomeRouter marketingSite={<MainSite />} />} />
        <Route path="/welcome" element={<MainSite />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Field Guide routes */}
        <Route path={`${FG_BASE}`}          element={<FGLanding />} />
        <Route path={`${FG_BASE}/today`}    element={<FGOffice />} />
        <Route path={`${FG_BASE}/day/:day`} element={<FGOffice />} />
        <Route path={`${FG_BASE}/path`}     element={<FGPath />} />
        <Route path={`${FG_BASE}/why`}      element={<FGWhy />} />
        <Route path={`${FG_BASE}/new`}      element={<FGNewHere />} />
        <Route path="/field-guide/devotion-guide" element={<DevotionGuide />} />
        <Route path="/field-guide/fruit-assessment" element={<FruitAssessment />} />

        {/* Spiritual Gifts Assessment routes */}
        <Route path="/field-guide/gifts" element={<AssessmentIntro />} />
        <Route path="/field-guide/gifts/take" element={<AssessmentQuestion />} />
        <Route path="/field-guide/gifts/processing" element={<GiftsProcessing />} />
        <Route path="/field-guide/gifts/results" element={<GiftsResults />} />
        <Route path="/field-guide/gifts/invite" element={<TrustedPersonInvitationFlow />} />
        <Route path="/field-guide/gifts/observe/:token" element={<TrustedPersonAssessment />} />
        <Route path="/field-guide/gifts/recover" element={<GiftsRecover />} />
        <Route path="/field-guide/formation" element={<FormationPictureView />} />

        {/* 7-Day Challenge routes */}
        <Route path="/7-day-challenge" element={<CFLanding />} />
        <Route path="/7-day-challenge/day/:day" element={<CFDevotion />} />

        {/* Rule of Life routes */}
        <Route path="/rule-of-life/:rhythm" element={<RhythmPage />} />
        <Route path="/rule-of-life/:rhythm/book/:bookIndex" element={<BookPage />} />

        {/* Architecture routes */}
        <Route path="/about"      element={<AboutPage />} />
        <Route path="/identity"  element={<IdentityLanding />} />
        <Route path="/identity/:piece" element={<ArmorPiecePage />} />
        <Route path="/practice"   element={<PracticePage />} />
        <Route path="/community"  element={<CommunityPage />} />

        {/* Agent routes */}
        <Route path="/agent"            element={<AgentHistory />} />
        <Route path="/agent/onboarding" element={<AgentOnboarding />} />

        {/* Fallback */}
        <Route path="*" element={<MainSite />} />
      </Routes>
      <SiteFooter />
      <MobileTabBar />
      <div className="md:hidden" style={{ height: "calc(64px + env(safe-area-inset-bottom, 0px))" }} />
    </BrowserRouter>
    </FormationProfileProvider>
  );
}
