import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight, Menu } from "lucide-react";
import { ExamenWidget }       from "./widgets/ExamenWidget";
import { DeclarationWidget }  from "./widgets/DeclarationWidget";
import { PeacePauseWidget }   from "./widgets/PeacePauseWidget";
import { ArrowLogWidget }     from "./widgets/ArrowLogWidget";
import { FirstFifteenWidget } from "./widgets/FirstFifteenWidget";
import { VerseTrackerWidget } from "./widgets/VerseTrackerWidget";
import { FormationShareable } from "./FormationShareable";
import { parseScriptureRefs } from "./utils/parseScriptureRefs";
import { useFormationProfile } from "./hooks/useFormationProfile";
import NextStep from "./components/NextStep";
import { getArmorPiece, getAllArmorPieces } from "./content/loader";

const SHOPIFY_URL = "https://shop.counterformed.com/collections/armor-of-god-collection";

const C = {
  heroBg: "#06050A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

const ARMOR_PIECES = getAllArmorPieces();


export function ArmorStyles() {
  return (
    <style>{`
      .ap-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .ap-wrap   { font-family: 'Barlow Condensed', sans-serif; background: #06050A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      /* Progress bar */
      .ap-back-nav { position: sticky; top: 0; z-index: 100; background: rgba(6,5,10,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); padding: 10px 20px; display: flex; align-items: center; gap: 16px; }
      .ap-back-link { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(250,248,245,0.35); text-decoration: none; transition: color 0.2s; flex-shrink: 0; }
      .ap-back-link:hover { color: #C9A84C; }
      .ap-piece-switcher { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 999px; padding: 6px 14px 6px 10px; cursor: pointer; transition: border-color 0.2s; }
      .ap-piece-switcher:hover { border-color: rgba(201,168,76,0.3); }
      .ap-piece-switcher-num { font-size: 8px; letter-spacing: 0.28em; color: rgba(201,168,76,0.5); }
      .ap-piece-switcher-title { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: #FAF8F5; }
      .ap-piece-dropdown { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); background: #0E0C0A; border: 1px solid rgba(201,168,76,0.15); border-radius: 12px; padding: 8px; min-width: 260px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); z-index: 200; }
      .ap-piece-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 8px; text-decoration: none; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: rgba(250,248,245,0.3); transition: background 0.15s, color 0.15s; }
      .ap-piece-dropdown-item:hover { background: rgba(255,255,255,0.04); color: rgba(250,248,245,0.6); }
      .ap-piece-dropdown-item.active { color: #C9A84C; background: rgba(201,168,76,0.08); }
      .ap-piece-dropdown-num { font-size: 8px; letter-spacing: 0.28em; color: rgba(201,168,76,0.45); flex-shrink: 0; }

      /* Hero */
      .ap-hero { position: relative; overflow: hidden; min-height: clamp(35vh, 40vw, 55vh); display: flex; flex-direction: column; justify-content: flex-end; width: 100%; }
      .ap-hero-bg  { position: absolute; inset: 0; background-size: cover; background-position: center center; filter: grayscale(.2); }
      .ap-hero-ov  { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,5,10,0.97) 0%, rgba(6,5,10,0.45) 50%, rgba(6,5,10,0.1) 100%); }
      .ap-hero-icon { position: absolute; right: 4%; top: 50%; transform: translateY(-50%); width: clamp(100px, 20vw, 200px); height: clamp(100px, 20vw, 200px); opacity: 0.07; pointer-events: none; z-index: 1; }
      @media (min-width: 1024px) { .ap-hero-icon { width: clamp(160px, 18vw, 280px); height: clamp(160px, 18vw, 280px); } }
      .ap-hero-in  { position: relative; z-index: 2; padding: 2rem 24px 2.5rem; max-width: 860px; margin: 0 auto; width: 100%; }
      .ap-hero-eye { font-size: 10px; letter-spacing: .5em; text-transform: uppercase; color: #C9A84C; margin-bottom: .75rem; font-weight: 700; }
      .ap-hero-h1  { font-family: 'Michroma', sans-serif; font-size: clamp(36px, 8vw, 88px); text-transform: uppercase; letter-spacing: 0.1em; color: #FAF8F5; line-height: .9; margin-bottom: 1rem; }
      .ap-hero-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px, 3vw, 20px); color: rgba(250,248,245,0.4); }

      /* Content grid */
      .ap-content { max-width: 800px; margin: 0 auto; padding: 44px 20px 100px; }

      /* Day selector */
      .ap-day-nav { display: flex; overflow-x: auto; gap: 4px; padding-bottom: 1px; margin-bottom: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.07); scrollbar-width: none; position: sticky; top: 46px; z-index: 50; background: #06050A; padding-top: 12px; box-shadow: 0 8px 24px rgba(6,5,10,0.95); }
      .ap-day-nav::-webkit-scrollbar { display: none; }
      .ap-day-btn { flex-shrink: 0; padding: 12px 20px; border: none; background: transparent; border-bottom: 2px solid transparent; cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.28); transition: color .2s, border-color .2s; }
      .ap-day-btn.active { color: #C9A84C; border-bottom-color: #C9A84C; }
      .ap-day-btn:hover:not(.active) { color: rgba(250,248,245,0.55); }
      .ap-day-btn.completed::after { content: ''; display: block; width: 4px; height: 4px; border-radius: 50%; background: #C9A84C; margin: 4px auto 0; opacity: 0.6; }
      .ap-day-btn.active.completed::after { opacity: 1; }
      .ap-day-nav-icon { align-self: center; }

      /* Section labels */
      .ap-sec-label { font-size: 9px; letter-spacing: .45em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }

      /* Stillness */
      .ap-stillness { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.8vw, 22px); color: rgba(250,248,245,0.5); line-height: 1.8; margin-bottom: 2.5rem; padding-left: 1.25rem; border-left: 2px solid rgba(201,168,76,0.2); }

      /* Scripture */
      .ap-scriptures { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
      .ap-scripture  { background: rgba(255,255,255,0.025); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.25rem 1.5rem; overflow-wrap: break-word; word-break: break-word; }
      .ap-scripture p    { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.8vw, 22px); color: rgba(250,248,245,0.72); line-height: 1.7; margin-bottom: .5rem; overflow-wrap: break-word; word-break: break-word; }
      .ap-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      /* Teaching */
      .ap-teaching { margin-bottom: 2.5rem; }
      .ap-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3.8vw, 22px); line-height: 1.88; color: rgba(250,248,245,0.74); margin-bottom: 1.25rem; }

      /* Practice */
      .ap-practice { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.15); border-radius: 18px; padding: 1.75rem; margin-bottom: 2.5rem; }
      .ap-practice-head { display: flex; align-items: center; gap: 12px; margin-bottom: 1.25rem; }
      .ap-practice-badge { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.65); border: 1px solid rgba(201,168,76,0.25); border-radius: 999px; padding: 4px 12px; }
      .ap-practice-body { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 3.5vw, 22px); line-height: 1.82; color: rgba(250,248,245,0.65); white-space: pre-line; }

      /* Reflection */
      .ap-reflection { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.12); border-radius: 14px; padding: 1.5rem; margin-bottom: 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.5vw, 22px); color: rgba(250,248,245,0.6); line-height: 1.7; }

      /* Prayer */
      .ap-prayer { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 18px; padding: 2rem; margin-bottom: 2.5rem; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(20px, 3.5vw, 22px); color: rgba(250,248,245,0.62); line-height: 1.9; white-space: pre-line; }

      /* Declare */
      .ap-declare { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2rem; margin-bottom: 2.5rem; text-align: center; }
      .ap-declare-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-bottom: 1rem; }
      .ap-declare-prompt { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(18px, 4vw, 24px); color: rgba(250,248,245,0.55); line-height: 1.6; }

      /* Divider */
      .ap-rule { height: 1px; background: linear-gradient(to right, #C9A84C, transparent); opacity: .2; margin: 2rem 0; }

      /* Sidebar */
      .ap-sidebar { margin-top: 2.5rem; }
      .ap-widget-placeholder { background: rgba(201,168,76,0.05); border: 1px dashed rgba(201,168,76,0.25); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; }
      .ap-widget-label { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: rgba(201,168,76,0.55); margin-bottom: .75rem; }
      .ap-widget-title { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; margin-bottom: .5rem; }
      .ap-widget-desc  { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: rgba(250,248,245,0.4); line-height: 1.65; margin-bottom: 1rem; }
      .ap-widget-soon  { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.2); }

      .ap-armor-nav { display: flex; flex-direction: column; gap: 6px; }
      .ap-armor-nav-label { font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: rgba(201,168,76,0.45); margin-bottom: .75rem; }
      .ap-armor-link { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px; text-decoration: none; transition: background .2s; }
      .ap-armor-link:hover { background: rgba(255,255,255,0.04); }
      .ap-armor-link.active { background: rgba(201,168,76,0.08); }
      .ap-armor-link-num   { font-size: 8px; letter-spacing: .28em; color: rgba(201,168,76,0.45); flex-shrink: 0; }
      .ap-armor-link-title { font-size: 11px; letter-spacing: .12em; text-transform: uppercase; font-weight: 700; }
      .ap-armor-link.active .ap-armor-link-title { color: #C9A84C; }
      .ap-armor-link:not(.active) .ap-armor-link-title { color: rgba(250,248,245,0.3); }

      /* Bottom nav */
      .ap-piece-nav { display: flex; gap: 12px; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.06); }
      .ap-nav-btn { flex: 1; min-height: 80px; padding: 20px 24px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.03); text-decoration: none; display: flex; flex-direction: row; align-items: center; gap: 20px; transition: border-color .25s, background .25s; }
      .ap-nav-btn:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.05); }
      .ap-nav-btn-text  { display: flex; flex-direction: column; gap: 6px; }
      .ap-nav-btn-dir   { display: block; font-size: 12px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.7); }
      .ap-nav-btn-title { display: block; font-family: 'Michroma', sans-serif; font-size: clamp(14px, 1.8vw, 18px); text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; line-height: 1.2; }
      .ap-nav-btn.next  { flex-direction: row-reverse; text-align: right; }
      .ap-nav-btn.next .ap-nav-btn-text { align-items: flex-end; }

      /* Mobile */
      @media (max-width: 639px) {
        .ap-piece-nav { flex-direction: column; }
        .ap-nav-btn { width: 100%; flex: none; }
        .ap-nav-btn.next { text-align: right; flex-direction: row-reverse; }
        .ap-nav-btn.next .ap-nav-btn-text { align-items: flex-end; }
        .ap-content { padding: 32px 20px 120px; display: flex; flex-direction: column; }
        .ap-day-nav   { order: 0; top: 44px; padding-top: 8px; }
        .ap-sidebar   { order: 1; margin-top: 0; margin-bottom: 2rem; }
        .ap-main      { order: 2; max-width: 100%; }
        .ap-piece-nav { order: 3; }
        .ap-scripture { padding: 1rem 1.25rem; }
        .ap-piece-dropdown { left: 10px; right: 10px; transform: none; min-width: auto; }
        .ap-back-nav { padding: 8px 16px; gap: 10px; }
        .ap-piece-switcher-title { max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      }

      /* Tablet: sidebar appears ABOVE main content (between day tabs and devotional body) */
      @media (min-width: 640px) and (max-width: 1023px) {
        .ap-content { display: flex; flex-direction: column; }
        .ap-day-nav { order: 0; }
        .ap-sidebar { order: 1; margin-top: 0; margin-bottom: 2.5rem; }
        .ap-main    { order: 2; }
        .ap-piece-nav { order: 3; }
      }

      /* Desktop two-column layout */
      @media (min-width: 1024px) {
        .ap-hero-in  { max-width: 1100px; padding: 2.5rem 48px 3rem; }
        .ap-hero-h1  { font-size: clamp(60px, 8vw, 100px); }
        .ap-content  {
          max-width: 1100px; padding: 52px 48px 140px;
          display: grid;
          grid-template-columns: 1fr 320px;
          column-gap: 64px;
          align-items: start;
          grid-template-areas:
            "day-nav   day-nav"
            "main      sidebar"
            "piece-nav piece-nav";
        }
        .ap-day-nav   { grid-area: day-nav; }
        .ap-main      { grid-area: main; }
        .ap-sidebar   { grid-area: sidebar; position: sticky; top: 56px; align-self: start; border-left: 1px solid rgba(255,255,255,0.07); padding-left: 36px; margin-top: 0; display: flex; flex-direction: column; gap: 2rem; }
        .ap-piece-nav { grid-area: piece-nav; }
      }

      @media (min-width: 1440px) {
        .ap-hero-in { max-width: 1320px; padding: 3rem 64px 3.5rem; }
        .ap-content { max-width: 1320px; grid-template-columns: 1fr 360px; column-gap: 80px; padding: 60px 64px 160px; }
        .ap-sidebar { padding-left: 48px; }
      }
    `}</style>
  );
}

function BackNav({ progRef }) {
  const { piece } = useParams();
  const [open, setOpen] = useState(false);
  const current = getArmorPiece(piece);

  return (
    <div className="ap-back-nav">
      <Link to="/identity" className="ap-back-link">
        â† Identity
      </Link>
      <button
        className="ap-piece-switcher"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="ap-piece-switcher-num">{current?.num}</span>
        <span className="ap-piece-switcher-title">{current?.title}</span>
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", opacity: 0.4 }} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 199,
              background: "rgba(0,0,0,0.3)",
            }}
          />
          <div className="ap-piece-dropdown" style={{ zIndex: 200 }}>
            {PIECE_ORDER.map(slug => {
              const p = getArmorPiece(slug);
              const isActive = slug === piece;
              return (
                <Link
                  key={slug}
                  to={`/identity/${slug}`}
                  className={`ap-piece-dropdown-item${isActive ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="ap-piece-dropdown-num">{p.num}</span>
                  <span>{p.title}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Progress bar embedded at bottom edge */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.05)" }}>
        <div ref={progRef} style={{ height: "100%", width: "0%", background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35))", transition: "width .12s linear" }} />
      </div>
    </div>
  );
}

function HeroSection() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef  = useRef(null);
  const chevronRef  = useRef(null);
  const watermarkRef = useRef(null);
  const particleRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // --- Initial states ---
      gsap.set([eyebrowRef.current, sublineRef.current, chevronRef.current], { opacity: 0, y: 20 });
      gsap.set(headlineRef.current, { opacity: 0, y: 20, scale: 0.97 });
      gsap.set(watermarkRef.current, { opacity: 0 });

      // --- Hero entrance timeline (page load, not scroll) ---
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(watermarkRef.current,  { opacity: 0.10, duration: 1.0 })
        .to(eyebrowRef.current,    { opacity: 1,    y: 0, duration: 0.5 }, "-=0.7")
        .fromTo(headlineRef.current,
          { opacity: 0, y: 20, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1.0, duration: 0.7, ease: "power3.out" }, "-=0.3")
        .to(sublineRef.current,    { opacity: 0.55, y: 0, duration: 0.6 }, "+=0.1")
        .to(chevronRef.current,    { opacity: 0.6,  y: 0, duration: 0.5 }, "-=0.3");

      // --- Scroll indicator pulse: opacity 0.4 â†’ 1.0 ---
      gsap.fromTo(chevronRef.current,
        { opacity: 0.4 },
        { opacity: 1.0, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.8 }
      );
      gsap.to(chevronRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.8,
      });

      // --- Watermark parallax (scrub) ---
      gsap.to(watermarkRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // --- Particle field drift ---
      if (particleRef.current) {
        gsap.to(particleRef.current, {
          y: -18,
          duration: 14,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }


    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-16 md:pt-0"
      style={{ backgroundColor: C.heroBg }}
    >
      {/* Clipping wrapper for background layers â€” keeps overflow-hidden off the section itself to avoid iOS scroll trap */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Hero image â€” very low opacity atmospheric */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/Identity_wide.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.18,
        }}
      />
      {/* Bottom-heavy gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${C.heroBg} 0%, ${C.heroBg}ee 30%, ${C.heroBg}88 60%, ${C.heroBg}22 100%)`,
        }}
      />

      {/* Shield watermark â€” off-center atmospheric, parallax */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 flex items-center opacity-0"
        style={{ justifyContent: "flex-end", paddingRight: "8%" }}
      >
        <img
          src="/shield-white.png"
          alt=""
          style={{
            height: "clamp(28vw, 45vh, 45vh)",
            width: "auto",
            filter: "brightness(0) invert(1)",
          }}
        />
      </div>

      {/* Particle field â€” CSS radial-gradient dots */}
      <div
        ref={particleRef}
        className="absolute inset-0 pointer-events-none"
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
      </div>{/* end background clipping wrapper */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <span
          ref={eyebrowRef}
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-8 opacity-0"
          style={{ color: C.gold }}
        >
          The Identity Pillar Â· Ephesians 6:10â€“18
        </span>
        <h1
          ref={headlineRef}
          className="font-brand uppercase tracking-[0.06em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
          style={{ fontSize: "clamp(1.8rem, 7vw, 5rem)" }}
        >
          You Are Being Formed
        </h1>
        <p
          ref={sublineRef}
          className="leading-relaxed max-w-2xl opacity-0"
          style={{
            fontSize: "clamp(0.95rem, 2.5vw, 1.3rem)",
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

function ArmorIntroSection() {
  const sectionRef    = useRef(null);
  const eyebrowBRef   = useRef(null);
  const scriptureBRef = useRef(null);
  const rightColRef   = useRef(null);
  const goldRuleRef   = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ctx;
    const raf = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // --- Left column: eyebrow + scripture ---
      if (eyebrowBRef.current) {
        gsap.fromTo(eyebrowBRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }
      if (scriptureBRef.current) {
        gsap.fromTo(scriptureBRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power2.out", delay: 0.2,
            scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }

      // --- Right column entrance: +300ms after left ---
      if (rightColRef.current) {
        gsap.fromTo(rightColRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.3,
            scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }

      // --- Gold rule scaleX ---
      if (goldRuleRef.current) {
        gsap.set(goldRuleRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(goldRuleRef.current, {
          scaleX: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: goldRuleRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }

      // --- Teaching paragraphs: batch stagger ---
      gsap.set(".armor-para", { opacity: 0 });
      ScrollTrigger.batch(".armor-para", {
        start: "top 88%",
        onEnter: batch => gsap.fromTo(batch,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: "auto" }),
        onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 15, duration: 0.4, overwrite: "auto" }),
      });
    }, sectionRef);
    }); // end requestAnimationFrame
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section id="scripture" ref={sectionRef} className="py-24 md:py-40 px-5" style={{ backgroundColor: C.heroBg }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-[55fr_45fr] gap-16 md:gap-24 items-start">

          {/* LEFT: Scripture */}
          <div>
            <span
              ref={eyebrowBRef}
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: C.gold }}
            >
              Ephesians 6:10â€“18
            </span>
            <blockquote
              ref={scriptureBRef}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.9vw, 24px)",
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
          </div>

          {/* RIGHT: Pull quote + teaching */}
          <div ref={rightColRef}>
            <div
              ref={goldRuleRef}
              className="h-[1px] mb-10"
              style={{ background: `linear-gradient(to right, ${C.gold}55, transparent)` }}
            />
            <p
              className="armor-para mb-10"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.55,
                color: `${C.ivory}bb`,
              }}
            >
              The armor is not something you build. It is something you receive and put on.
            </p>
            <div className="space-y-8">
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}99` }}>
                Paul is writing to people under real pressure â€” not offering a metaphor for self-improvement but a survival framework for people living inside a hostile formation system. Rome's empire was total: emperor worship, cultural assimilation, a comprehensive narrative about power, identity, and worth. The parallel to the modern formation environment is not metaphorical. It is structural.
              </p>
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}99` }}>
                Identity in Christ is given, not constructed. The belt, the breastplate, the shield â€” each piece represents a dimension of God's own character that He extends to those who are in Christ. You are not assembling virtue through effort. You are stepping into what has already been provided.
              </p>
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}99` }}>
                "Putting on" is a daily, deliberate act. You drift without it by default. The armor does not go on automatically â€” it requires intentional return, morning by morning, to the reality of who you are in Christ before the world has a chance to tell you otherwise. That is why this collection pairs every piece with a formation pathway.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-20 flex justify-center pointer-events-none">
          <img
            src="/helmet.png"
            alt=""
            style={{ height: "200px", filter: "brightness(0) invert(1)", opacity: 0.06 }}
          />
        </div>
      </div>
    </section>
  );
}

function GodsArmorSection() {
  const sectionRef = useRef(null);
  const leftColRef = useRef(null);
  const rightColRef = useRef(null);
  const brandLineRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let ctx;
    const raf = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // --- Left column entrance ---
      if (leftColRef.current) {
        gsap.fromTo(leftColRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: leftColRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }

      // --- Right column entrance: +300ms delay ---
      if (rightColRef.current) {
        gsap.fromTo(rightColRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.3,
            scrollTrigger: { trigger: leftColRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
      }

      // --- Brand line gold glow dissipation ---
      if (brandLineRef.current) {
        gsap.fromTo(brandLineRef.current,
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out",
            scrollTrigger: { trigger: brandLineRef.current, start: "top 85%", toggleActions: "play none none reverse" },
            onComplete: () => {
              gsap.fromTo(brandLineRef.current,
                { textShadow: "0 0 20px rgba(201,168,76,0.4)" },
                { textShadow: "0 0 0px rgba(201,168,76,0)", duration: 2.0, ease: "power2.out" });
            },
          });
      }

      // --- Background color transition: Hero Black â†’ Rule Brown via scrub ---
      gsap.fromTo(sectionRef.current,
        { backgroundColor: C.heroBg },
        { backgroundColor: C.ruleBg, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
    }, sectionRef);
    }); // end requestAnimationFrame
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="revelation"
      ref={sectionRef}
      className="py-24 md:py-40 px-5"
      style={{ backgroundColor: C.heroBg }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          <div ref={leftColRef}>
            <span
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: C.gold }}
            >
              The Revelation
            </span>
            <p className="text-sm md:text-base leading-relaxed font-light mb-6" style={{ color: `${C.ivory}77` }}>
              The armor Paul describes is not a metaphor invented for the church. It is drawn from Isaiah's descriptions of God Himself. Isaiah 59:17 describes God putting on righteousness as a breastplate, salvation as a helmet. Isaiah 11:5 pictures the belt of faithfulness. Isaiah 52:7 speaks of feet bringing good news of peace.
            </p>
            <p className="text-sm md:text-base leading-relaxed font-light mb-12" style={{ color: `${C.ivory}77` }}>
              When you put on the armor of God, you are not assembling your own defenses. You are stepping into God's own character â€” the same righteousness, the same salvation, the same peace that belong to Him. The armor is His before it is yours.
            </p>
            <p
              ref={brandLineRef}
              className="text-lg md:text-2xl tracking-[0.12em] uppercase font-bold leading-tight"
              style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
            >
              "You are not inventing identity. You are receiving it."
            </p>
          </div>

          <div ref={rightColRef}>
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

function ArmorRingSection() {
  const sectionRef    = useRef(null);
  const ringRef       = useRef(null);
  const centerRef     = useRef(null);
  const imageRef      = useRef(null);
  const contentRef    = useRef(null);
  const [activePiece, setActivePiece]         = useState(null);
  const [hasEntered, setHasEntered]           = useState(false);
  const [hasEverSelected, setHasEverSelected] = useState(false);
  const iconRefs   = useRef([]);
  const prevPieceRef = useRef(null);
  const [prefersReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const RING_ANGLES = [0, 60, 120, 180, 240, 300];
  const toRad  = (deg) => (deg * Math.PI) / 180;
  const ICON_R = 42;
  const getPos = (deg, r) => ({
    x: 50 + r * Math.sin(toRad(deg)),
    y: 50 - r * Math.cos(toRad(deg)),
  });

  /* â”€â”€ Entry observer â”€â”€ */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasEntered) { setHasEntered(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasEntered]);

  /* â”€â”€ Entry animation â”€â”€ */
  useEffect(() => {
    if (!hasEntered || !ringRef.current) return;
    const reduced = prefersReduced;
    const ctx = gsap.context(() => {
      const svgCircle = ringRef.current.querySelector(".ring-arc");
      if (svgCircle && !reduced) {
        const circ = 2 * Math.PI * ICON_R;
        gsap.set(svgCircle, { strokeDasharray: circ, strokeDashoffset: circ });
        gsap.to(svgCircle, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" });
      }
      iconRefs.current.forEach((icon, i) => {
        if (!icon) return;
        if (reduced) { gsap.set(icon, { xPercent: -50, yPercent: -50, opacity: 1, scale: 1 }); return; }
        gsap.set(icon, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.8 });
        gsap.to(icon, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)", delay: 1.0 + i * 0.1 });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [hasEntered, prefersReduced]);

  /* â”€â”€ Icon scale/opacity on selection â”€â”€ */
  useEffect(() => {
    if (!hasEntered) return;
    if (activePiece === null && prevPieceRef.current === null) return;
    iconRefs.current.forEach((icon, i) => {
      if (!icon) return;
      if (activePiece === null) {
        gsap.to(icon, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      } else if (i === activePiece) {
        gsap.to(icon, { scale: 1.2, opacity: 1, duration: 0.4, ease: "power2.out" });
      } else {
        gsap.to(icon, { scale: 0.85, opacity: 0.15, duration: 0.4, ease: "power2.out" });
      }
    });
  }, [activePiece, hasEntered]);

  /* â”€â”€ Image crossfade â”€â”€ */
  useEffect(() => {
    if (!imageRef.current) return;
    if (activePiece === null) {
      gsap.to(imageRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
    } else {
      // If switching pieces: dip out briefly, src already updated, fade in
      if (prevPieceRef.current !== null) {
        gsap.fromTo(imageRef.current,
          { opacity: 0 },
          { opacity: 0.72, duration: 0.5, ease: "power2.out" }
        );
      } else {
        // First selection: bloom in
        gsap.fromTo(imageRef.current,
          { opacity: 0 },
          { opacity: 0.72, duration: 0.8, ease: "power2.out" }
        );
      }
    }
  }, [activePiece]);

  /* â”€â”€ Center name crossfade â”€â”€ */
  useEffect(() => {
    if (!centerRef.current) return;
    gsap.fromTo(centerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [activePiece]);

  /* â”€â”€ Right column content fade â”€â”€ */
  useEffect(() => {
    if (!contentRef.current) return;
    if (activePiece === null) {
      gsap.to(contentRef.current, { opacity: 0, y: 8, duration: 0.25, ease: "power2.in" });
    } else {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.1 }
      );
    }
  }, [activePiece]);

  /* â”€â”€ Selection handler â”€â”€ */
  const handleSelect = (idx) => {
    if (idx === activePiece) {
      prevPieceRef.current = activePiece;
      setActivePiece(null);
    } else {
      const wasNull = activePiece === null;
      if (!hasEverSelected) setHasEverSelected(true);
      prevPieceRef.current = activePiece;
      if (!wasNull && contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0, y: 8, duration: 0.18, ease: "power2.in",
          onComplete: () => setActivePiece(idx),
        });
      } else {
        setActivePiece(idx);
      }
    }
  };

  const piece = activePiece !== null ? ARMOR_PIECES[activePiece] : null;

  return (
    <section id="six-pieces" ref={sectionRef} className="py-24 md:py-40 px-5" style={{ backgroundColor: C.ruleBg }}>
      <style>{`
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes centerGlow {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 1; }
        }
        @keyframes haloPulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.55; transform: scale(1.06); }
        }
        @keyframes particleDriftA {
          from { transform: translate(-0.8px, -0.5px); }
          to   { transform: translate(0.8px, 0.5px); }
        }
        @keyframes particleDriftB {
          from { transform: translate(0.5px, -0.8px); }
          to   { transform: translate(-0.5px, 0.8px); }
        }
        @media (max-width: 767px) {
          .armor-ring-tile {
            width: 100vw !important;
            min-height: 80svh !important;
            border-radius: 0 !important;
            margin-left: -20px !important;
            align-self: stretch !important;
          }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto">

        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <span className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-4" style={{ color: C.gold }}>
            The Six Pieces
          </span>
          <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.1em] text-white leading-none">
            The Armor of God
          </h2>
        </div>

        {/* Side-by-side grid */}
        <div className="flex flex-col md:flex-row gap-0 md:gap-12 items-stretch">

          {/* LEFT: Ring column with atmospheric image */}
          <div
            className="armor-ring-tile relative flex-shrink-0 flex items-center justify-center"
            style={{
              width: "clamp(280px, 42vw, 520px)",
              minHeight: "clamp(280px, 42vw, 520px)",
              borderRadius: "1.5rem",
              overflow: "hidden",
              background: C.heroBg,
              alignSelf: "flex-start",
              margin: "0 auto",
            }}
          >
            {/* Atmospheric hero image â€” blooms in on selection */}
            <img
              ref={imageRef}
              src={piece ? (getArmorPiece(piece.slug)?.img || "") : ""}
              alt=""
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            {/* Radial overlay â€” darkens edges, keeps center readable */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at center, ${C.heroBg}33 0%, ${C.heroBg}88 60%, ${C.heroBg}CC 100%)`,
              pointerEvents: "none",
              zIndex: 1,
            }} />

            {/* Ring SVG */}
            <div
              ref={ringRef}
              style={{
                position: "relative",
                width: "clamp(300px, 70vw, 460px)",
                height: "clamp(300px, 70vw, 460px)",
                zIndex: 2,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
              >
                {/* Rotating group: arc + particles */}
                <g style={{
                  transformOrigin: "50px 50px",
                  animation: prefersReduced ? "none" : "ringRotate 60s linear infinite",
                }}>
                  <circle
                    className="ring-arc"
                    cx="50" cy="50" r={ICON_R}
                    fill="none"
                    stroke={C.gold}
                    strokeOpacity="0.15"
                    strokeWidth="0.4"
                  />
                  {RING_ANGLES.map((angle, segIdx) => {
                    const midAngle = angle + 30;
                    const p1 = getPos(midAngle - 8, ICON_R);
                    const p2 = getPos(midAngle + 8, ICON_R);
                    const anim = segIdx % 2 === 0
                      ? "particleDriftA 4s ease-in-out infinite alternate"
                      : "particleDriftB 5s ease-in-out infinite alternate";
                    return (
                      <g key={segIdx}>
                        <circle cx={p1.x} cy={p1.y} r="0.35" fill={C.gold} opacity="0.08"
                          style={{ animation: prefersReduced ? "none" : anim }} />
                        <circle cx={p2.x} cy={p2.y} r="0.35" fill={C.gold} opacity="0.06"
                          style={{ animation: prefersReduced ? "none" : anim }} />
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Center radial glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "45%", height: "45%",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${C.gold}22 0%, transparent 70%)`,
                animation: prefersReduced ? "none" : "centerGlow 3s ease-in-out infinite",
                pointerEvents: "none",
              }} />

              {/* Center content â€” name only */}
              <div
                ref={centerRef}
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                  width: "52%",
                  pointerEvents: "none",
                }}
              >
                {piece ? (
                  <span style={{
                    fontFamily: "'Michroma', sans-serif",
                    fontSize: "clamp(16px, 1.6vw, 20px)",
                    color: C.gold,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    lineHeight: 1.3,
                  }}>
                    {piece.title}
                  </span>
                ) : (
                  <>
                    <img
                      src="/shield-white.png"
                      alt=""
                      style={{
                        width: "clamp(156px, 15vw, 204px)", height: "auto",
                        objectFit: "contain", opacity: 0.55,
                        display: "block", margin: "0 auto 0.75rem",
                      }}
                    />
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: "clamp(26px, 2.8vw, 36px)",
                      color: C.gold,
                      opacity: 0.9,
                    }}>
                      Armor Up.
                    </span>
                  </>
                )}
              </div>

              {/* Six icon buttons */}
              {ARMOR_PIECES.map((p, i) => {
                const pos = getPos(RING_ANGLES[i], ICON_R);
                const isActive = activePiece === i;
                return (
                  <div
                    key={p.slug}
                    ref={el => { iconRefs.current[i] = el; }}
                    role="button"
                    tabIndex={0}
                    aria-label={p.title}
                    aria-pressed={isActive}
                    onClick={() => handleSelect(i)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelect(i); } }}
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`, top: `${pos.y}%`,
                      display: "flex", flexDirection: "column", alignItems: "center",
                      cursor: "pointer",
                      opacity: 0,
                      zIndex: 3,
                      outline: "none",
                      userSelect: "none",
                    }}
                  >
                    {isActive && (
                      <div style={{
                        position: "absolute", inset: "-8px",
                        borderRadius: "50%",
                        border: `1px solid ${C.gold}`,
                        animation: prefersReduced ? "none" : "haloPulse 1.5s ease-in-out infinite",
                        pointerEvents: "none",
                      }} />
                    )}
                    <img
                      src={p.icon}
                      alt={p.title}
                      style={{
                        width: "clamp(52px, 5.5vw, 76px)", height: "clamp(52px, 5.5vw, 76px)",
                        objectFit: "contain",
                        opacity: isActive ? 1 : 0.65,
                        filter: isActive ? `drop-shadow(0 0 8px ${C.gold}88)` : "none",
                        transition: "opacity 0.3s ease, filter 0.3s ease",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* "Tap a piece to begin" hint â€” over the ring */}
            {!hasEverSelected && (
              <p style={{
                position: "absolute", bottom: "1.5rem", left: 0, right: 0,
                textAlign: "center",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: `${C.ivory}33`,
                fontFamily: "'Michroma', sans-serif",
                zIndex: 4,
                pointerEvents: "none",
              }}>
                Tap a piece to begin
              </p>
            )}
          </div>

          {/* RIGHT: Content panel */}
          <div
            className="flex-1 flex items-center"
            style={{ minHeight: "clamp(280px, 42vw, 520px)" }}
          >
            {piece ? (
              <div ref={contentRef} style={{ width: "100%", opacity: 0 }}>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[11px] tracking-[0.4em] uppercase" style={{ color: `${C.gold}77` }}>
                    {piece.num}
                  </span>
                  <div className="h-[1px] flex-1" style={{ background: `${C.gold}22` }} />
                </div>
                <h3 className="font-brand text-2xl md:text-4xl uppercase tracking-[0.1em] text-white mb-3">
                  {piece.title}
                </h3>
                <p className="text-[12px] tracking-[0.3em] uppercase mb-8" style={{ color: `${C.gold}99` }}>
                  <ScriptureRef reference={piece.scripture} text={piece.scriptureText} />
                </p>

                <div className="space-y-7">
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `${C.ivory}55` }}>
                      Theology
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `${C.ivory}88` }}>
                      {piece.theology}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `${C.ivory}55` }}>
                      Modern Tension
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `${C.ivory}66` }}>
                      {piece.tension}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `${C.ivory}55` }}>
                      Daily Practice
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
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
                    fontSize: "clamp(17px, 1.6vw, 22px)",
                    color: `${C.ivory}99`,
                  }}
                >
                  "{piece.hook}"
                </blockquote>

                <div className="mt-8 flex items-center gap-5">
                  <Link
                    to={`/identity/${piece.slug}`}
                    className="text-[12px] tracking-[0.28em] uppercase font-bold flex items-center gap-2 transition-opacity hover:opacity-100"
                    style={{ color: C.gold, textDecoration: "none" }}
                  >
                    Explore this piece
                    <ArrowRight size={14} />
                  </Link>
                  {piece.product && (
                    <span className="text-[11px] tracking-[0.24em] uppercase" style={{ color: `${C.ivory}44` }}>
                      {piece.product}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(16px, 1.8vw, 22px)",
                color: `${C.ivory}22`,
                lineHeight: 1.6,
              }}>
                Select a piece from the ring to explore its theology, tension, and daily practice.
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  const sectionRef = useRef(null);
  const pivotRef = useRef(null);
  const armorUpRef = useRef(null);
  const ctaRef = useRef(null);
  const scriptureRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx;
    const raf = requestAnimationFrame(() => {
    ctx = gsap.context(() => {
      // Prose paragraphs â€” batch stagger
      gsap.set(".closing-para", { opacity: 0 });
      ScrollTrigger.batch(".closing-para", {
        start: "top 88%",
        onEnter: batch => gsap.fromTo(batch,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: "auto" }),
        onLeaveBack: batch => gsap.to(batch,
          { opacity: 0, y: 15, duration: 0.4, overwrite: "auto" }),
      });

      // Gold pivot line â€” entrance + glow dissipation
      if (pivotRef.current) {
        gsap.fromTo(pivotRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: pivotRef.current, start: "top 88%", toggleActions: "play none none reverse" },
            onComplete: () => {
              gsap.fromTo(pivotRef.current,
                { textShadow: "0 0 20px rgba(201,168,76,0.4)" },
                { textShadow: "0 0 0px rgba(201,168,76,0)", duration: 2.0, ease: "power2.out" });
            },
          });
      }

      // "Armor Up." â€” scale entrance
      if (armorUpRef.current) {
        gsap.fromTo(armorUpRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: armorUpRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
      }

      // CTAs â€” stagger
      if (ctaRef.current) {
        const buttons = ctaRef.current.querySelectorAll("a, button");
        gsap.set(buttons, { opacity: 0, y: 12 });
        gsap.to(buttons, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }

      // Closing scripture + mark
      if (scriptureRef.current) {
        gsap.fromTo(scriptureRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: scriptureRef.current, start: "top 90%", toggleActions: "play none none reverse" } });
      }
    }, sectionRef);
    }); // end requestAnimationFrame
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="why"
      ref={sectionRef}
      className="px-5"
      style={{ backgroundColor: C.ruleBg }}
    >
      {/* â”€â”€ Part 1: Why the Armor (prose) â”€â”€ */}
      <div className="max-w-[740px] mx-auto pt-24 md:pt-40">
        <span
          className="closing-para block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: C.gold }}
        >
          Why the Armor
        </span>
        <div className="space-y-8">
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The armor is not a costume. It is what God has provided for people who are being formed in a system that is actively working against them. Every culture in history has had a comprehensive formation project â€” a set of values, narratives, and practices designed to shape people into its image. The digital age is no different, except that its reach is total and its pace is unprecedented.
          </p>
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is not the armor. It is a marker â€” a daily reminder that you belong to a different formation project. The QR code connects to the formation content: the theology, the practice, the community. The garment anchors the identity. The content forms it.
          </p>
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `${C.ivory}77` }}>
            The gear is the entry point. The content is the formation. The practice is the armor. These three move together, or they don't move at all.
          </p>
        </div>

        {/* Gold pivot line */}
        <p
          ref={pivotRef}
          className="mt-16 text-lg md:text-2xl tracking-[0.14em] uppercase font-bold leading-tight"
          style={{ fontFamily: "'Michroma', sans-serif", color: C.gold }}
        >
          "The gear is not the mission. It's a marker of it."
        </p>
      </div>

      {/* â”€â”€ Part 2: Armor Up declaration + CTAs â”€â”€ */}
      <div id="collection" className="max-w-[740px] mx-auto text-center pt-20 md:pt-28">
        {/* Thin gold rule â€” visual bridge between prose and declaration */}
        <div
          className="mx-auto mb-16 md:mb-20"
          style={{
            width: "48px",
            height: "1px",
            background: `linear-gradient(to right, transparent, ${C.gold}55, transparent)`,
          }}
        />

        {/* "Armor Up." campaign mark */}
        <p
          ref={armorUpRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(32px, 6vw, 56px)",
            color: C.gold,
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}
        >
          Armor Up.
        </p>

        {/* Bridge copy */}
        <p
          className="closing-para"
          style={{
            fontSize: "clamp(13px, 2vw, 16px)",
            color: "rgba(250,248,245,0.35)",
            lineHeight: 1.8,
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
            letterSpacing: "0.02em",
          }}
        >
          Three hero pieces. Six formation tracks. Every garment connects to a devotional pathway through the QR code on the back.
        </p>

        {/* Dual CTAs */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <a
            href="/#shop"
            className="inline-flex items-center justify-center gap-3 px-9 py-3 rounded-full font-bold text-[10px] tracking-[0.28em] uppercase transition-all hover:scale-105 w-full sm:w-auto"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              backgroundColor: C.gold,
              color: "#0A0A0A",
              boxShadow: `0 4px 24px ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Shop the Collection
          </a>
          <Link
            to="/identity/belt-of-truth"
            className="inline-flex items-center justify-center gap-3 px-9 py-3 rounded-full font-bold text-[10px] tracking-[0.28em] uppercase transition-all hover:bg-white/5 w-full sm:w-auto"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: C.gold,
              border: `1px solid ${C.gold}44`,
              textDecoration: "none",
            }}
          >
            Begin Formation
          </Link>
        </div>

        {/* 7-Day Challenge soft link */}
        <Link
          to="/7-day-challenge"
          className="closing-para"
          style={{
            fontSize: "13px",
            color: "rgba(250,248,245,0.3)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "3rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "rgba(250,248,245,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "rgba(250,248,245,0.3)"; }}
        >
          New to Counter Formation? Start with the 7-Day Challenge â†’
        </Link>
      </div>

      {/* â”€â”€ Part 3: Closing scripture + brand mark â”€â”€ */}
      <div
        id="begin"
        ref={scriptureRef}
        className="max-w-[740px] mx-auto text-center pb-24 md:pb-40"
      >
        {/* Thin rule */}
        <div
          className="mx-auto mb-12"
          style={{
            width: "32px",
            height: "1px",
            background: `${C.gold}22`,
          }}
        />

        <p
          className="text-base md:text-lg leading-relaxed mb-3"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            color: `${C.ivory}44`,
          }}
        >
          "Be strong in the Lord and in his mighty power. Put on the full armor of God."
        </p>
        <p
          className="text-[9px] tracking-[0.4em] uppercase mb-12"
          style={{ color: `${C.ivory}25` }}
        >
          Ephesians 6:10â€“11
        </p>

        <img
          src="/helmet.png"
          alt=""
          style={{ height: "36px", filter: "brightness(0) invert(1)", opacity: 0.06, margin: "0 auto 12px", display: "block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <p
          className="text-[8px] tracking-[0.4em] uppercase"
          style={{ color: `${C.ivory}18` }}
        >
          Discipline Â· Presence Â· Formation
        </p>
      </div>
    </section>
  );
}

const LANDING_SECTIONS = [
  { id: "hero",       label: "The Identity Pillar" },
  { id: "scripture",  label: "Ephesians 6" },
  { id: "revelation", label: "God's Own Armor" },
  { id: "six-pieces", label: "The Six Pieces" },
  { id: "why",        label: "The Closing" },
];

function SectionProgressNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    // Fade in after hero scrolled past
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;
    const heroObs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    heroObs.observe(heroEl);

    // Track active section
    const ratios = {};
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { ratios[e.target.id] = e.intersectionRatio; });
        let best = null, bestRatio = -1;
        LANDING_SECTIONS.forEach(({ id }) => {
          if ((ratios[id] ?? 0) > bestRatio) {
            bestRatio = ratios[id] ?? 0;
            best = id;
          }
        });
        if (best) setActiveSection(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );
    LANDING_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });

    return () => { heroObs.disconnect(); sectionObs.disconnect(); };
  }, []);

  const activeIdx = LANDING_SECTIONS.findIndex(s => s.id === activeSection);

  return (
    <>
      {/* Desktop: vertical dot rail */}
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        className="hidden md:flex"
      >
        {LANDING_SECTIONS.map(({ id, label }) => {
          const isActive = id === activeSection;
          return (
            <div
              key={id}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip */}
              <div style={{
                position: "absolute",
                right: "18px",
                whiteSpace: "nowrap",
                background: "rgba(6,5,10,0.9)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "999px",
                padding: "4px 12px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#FAF8F5",
                opacity: hoveredId === id ? 1 : 0,
                transform: hoveredId === id ? "translateX(0)" : "translateX(4px)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                pointerEvents: "none",
              }}>
                {label}
              </div>
              {/* Dot */}
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  width: isActive ? "8px" : "6px",
                  height: isActive ? "8px" : "6px",
                  borderRadius: "50%",
                  background: isActive ? "#C9A84C" : "rgba(250,248,245,0.15)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  boxShadow: isActive ? "0 0 8px rgba(201,168,76,0.5)" : "none",
                  transition: "all 0.3s ease",
                }}
                aria-label={`Scroll to ${label}`}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: segmented progress bar at bottom */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: "3px",
          display: "flex",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        {LANDING_SECTIONS.map(({ id }, i) => (
          <div
            key={id}
            style={{
              flex: 1,
              background: i <= activeIdx ? "#C9A84C" : "rgba(255,255,255,0.08)",
              borderRight: i < LANDING_SECTIONS.length - 1 ? "1px solid rgba(6,5,10,0.5)" : "none",
              transition: "background 0.4s ease",
            }}
          />
        ))}
      </div>
    </>
  );
}

export function IdentityLanding() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <SectionProgressNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <ArmorRingSection />
      <ClosingSection />
    </div>
  );
}

const PIECE_ORDER = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];

/* â”€â”€â”€ WIDGET MAP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const WIDGET_COMPONENTS = {
  "belt-of-truth":               ExamenWidget,
  "breastplate-of-righteousness": DeclarationWidget,
  "gospel-of-peace":             PeacePauseWidget,
  "shield-of-faith":             ArrowLogWidget,
  "helmet-of-salvation":         FirstFifteenWidget,
  "sword-of-the-spirit":         VerseTrackerWidget,
};

/* â”€â”€â”€ CROSS-LINK DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

const CROSS_LINKS = {
  "belt-of-truth":               { to: "/rule-of-life/presence",  rhythm: "PRESENCE",  tagline: "Attention before God" },
  "breastplate-of-righteousness":{ to: "/rule-of-life/prayer",    rhythm: "PRAYER",    tagline: "Dependence before action" },
  "gospel-of-peace":             { to: "/rule-of-life/sabbath",   rhythm: "SABBATH",   tagline: "Rest before production" },
  "shield-of-faith":             { to: "/rule-of-life/community", rhythm: "COMMUNITY", tagline: "Formation together" },
  "helmet-of-salvation":         { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
  "sword-of-the-spirit":         { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
};

function CrossLinkCard({ piece }) {
  const link = CROSS_LINKS[piece];
  if (!link) return null;
  return (
    <Link
      to={link.to}
      style={{
        display: "block",
        textDecoration: "none",
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        transition: "border-color .2s, background .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.08)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.28)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.04)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.14)";
      }}
    >
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".36em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "6px" }}>
        Connected Rhythm
      </p>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "13px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--cf-gold)", fontWeight: 700, marginBottom: "4px" }}>
        {link.rhythm}
      </p>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "14px", color: "rgba(250,248,245,0.45)", lineHeight: 1.4 }}>
        {link.tagline}
      </p>
    </Link>
  );
}

export function ArmorPiecePage() {
  const { piece }     = useParams();
  const navigate      = useNavigate();
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const [day, setDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [showQRWelcome, setShowQRWelcome] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('qr') === 'true';
  });
  const [qrFadingOut, setQRFadingOut] = useState(false);
  const progRef       = useRef(null);
  const wrapRef       = useRef(null);
  const heroBgRef     = useRef(null);
  const heroEyeRef    = useRef(null);
  const heroH1Ref     = useRef(null);
  const heroSubRef    = useRef(null);
  const sidebarRef    = useRef(null);
  const pieceNavRef   = useRef(null);

  const data = getArmorPiece(piece);

  useEffect(() => {
    if (!data) navigate("/identity", { replace: true });
  }, [data, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDay(1);
    if (isLoaded) {
      setCompletedDays(profile.armor.progress[piece] ?? []);
    }
  }, [piece, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const patch = { armor: { progress: { [piece]: completedDays } } };
    if (completedDays.includes(6)) {
      const current = profile.armor.completedPieces ?? [];
      if (!current.includes(piece)) {
        patch.armor.completedPieces = [...current, piece];
      }
    }
    updateProfile(patch);
  }, [completedDays, piece]);

  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (progRef.current) progRef.current.style.width = (pct * 100) + "%";
      if (pct > 0.8 && !completedDays.includes(day)) {
        setCompletedDays(prev => [...new Set([...prev, day])]);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data, day, completedDays]);

  /* â”€â”€â”€ GSAP Piece Page Animations â”€â”€â”€ */
  useEffect(() => {
    if (!data) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      /* === PAGE LOAD ANIMATIONS (immediate, not scroll-triggered) === */

      // Hero image: Ken Burns settle
      if (heroBgRef.current) {
        gsap.set(heroBgRef.current, { scale: 1.02 });
        gsap.fromTo(heroBgRef.current,
          { scale: 1.02 },
          { scale: 1.0, duration: 1.5, ease: "power2.out" }
        );
      }

      // Gold eyebrow label
      if (heroEyeRef.current) {
        gsap.set(heroEyeRef.current, { opacity: 0, y: 15 });
        gsap.fromTo(heroEyeRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
        );
      }

      // Piece title
      if (heroH1Ref.current) {
        gsap.set(heroH1Ref.current, { opacity: 0, y: 20 });
        gsap.fromTo(heroH1Ref.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
        );
      }

      // Anchor scripture / track title subtitle
      if (heroSubRef.current) {
        gsap.set(heroSubRef.current, { opacity: 0, y: 15 });
        gsap.fromTo(heroSubRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 }
        );
      }

      /* === SCROLL-TRIGGERED: Day section containers === */
      const daySections = [".ap-stillness", ".ap-scriptures", ".ap-teaching", ".ap-practice", ".ap-reflection"];
      daySections.forEach(sel => {
        const el = wrapRef.current?.querySelector(sel);
        if (el) {
          gsap.set(el, { opacity: 0, y: 25 });
          gsap.fromTo(el,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" } }
          );
        }
      });

      // Prayer section
      const prayerEl = wrapRef.current?.querySelector(".ap-prayer");
      if (prayerEl) {
        gsap.set(prayerEl, { opacity: 0, y: 15 });
        gsap.fromTo(prayerEl,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: prayerEl, start: "top 82%", toggleActions: "play none none reverse" } }
        );
      }

      /* === SCROLL-TRIGGERED: Section labels (gold eyebrow-style) === */
      const secLabels = wrapRef.current?.querySelectorAll(".ap-sec-label");
      if (secLabels) {
        secLabels.forEach(el => {
          gsap.set(el, { opacity: 0, y: 15 });
          gsap.fromTo(el,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        });
      }

      /* === SCROLL-TRIGGERED: Scripture blocks within day section === */
      const scriptureBlocks = wrapRef.current?.querySelectorAll(".ap-scripture");
      if (scriptureBlocks) {
        scriptureBlocks.forEach(el => {
          gsap.set(el, { opacity: 0, y: 15 });
          gsap.fromTo(el,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        });
      }

      /* === SIDEBAR WIDGET: once: true fade-in === */
      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { opacity: 0, y: 20 });
        gsap.fromTo(sidebarRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: sidebarRef.current, start: "top 80%", once: true } }
        );
      }

      /* === PIECE NAVIGATION: bottom prev/next === */
      if (pieceNavRef.current) {
        const navBtns = pieceNavRef.current.querySelectorAll(".ap-nav-btn");
        if (navBtns.length) {
          gsap.set(navBtns, { opacity: 0, y: 15 });
          gsap.fromTo(navBtns,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
              scrollTrigger: { trigger: pieceNavRef.current, start: "top 90%", toggleActions: "play none none reverse" } }
          );
        }
      }

    }, wrapRef);
    return () => ctx.revert();
  }, [data, piece, day]);

  if (!data) return null;

  const idx      = PIECE_ORDER.indexOf(piece);
  const prevSlug = PIECE_ORDER[idx - 1] ?? null;
  const nextSlug = PIECE_ORDER[idx + 1] ?? null;
  const prevData = prevSlug ? getArmorPiece(prevSlug) : null;
  const nextData = nextSlug ? getArmorPiece(nextSlug) : null;
  const curDay   = data.days[day - 1];
  const isLastDay = day === 6;

  return (
    <>
    {showQRWelcome && (
      <div
        className="fixed inset-0 z-[500] flex flex-col items-center justify-center text-center px-8"
        style={{
          backgroundColor: "#06050A",
          opacity: qrFadingOut ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: qrFadingOut ? "none" : "auto",
        }}
      >
        {data.icon && (
          <img src={data.icon} alt="" style={{ width: 40, mixBlendMode: "screen", opacity: 0.12, marginBottom: "2rem" }} />
        )}
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: "1.5rem", fontWeight: 700 }}>
          You're Wearing the Armor
        </p>
        <h2 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(28px, 6vw, 52px)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cf-ivory)", lineHeight: 0.9, marginBottom: "1rem" }}>
          {data.title}
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(15px, 3vw, 20px)", color: "rgba(250,248,245,0.4)", marginBottom: "3rem" }}>
          {data.trackTitle}
        </p>
        <button
          onClick={() => {
            setQRFadingOut(true);
            window.history.replaceState({}, '', window.location.pathname);
            setTimeout(() => setShowQRWelcome(false), 400);
          }}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "11px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "14px 36px",
            borderRadius: "999px",
            border: "none",
            background: "#C9A84C",
            color: "#0A0A0A",
            cursor: "pointer",
            boxShadow: "0 4px 32px rgba(201,168,76,0.3)",
          }}
        >
          Begin Formation â†’
        </button>
      </div>
    )}
    <div className="ap-wrap" ref={wrapRef}>
      <BackNav progRef={progRef} />

      {/* â”€â”€ Hero â”€â”€ */}
      <div className="ap-hero">
        <div className="ap-hero-bg" ref={heroBgRef} style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-icon">
          {data.icon && (
            <img
              src={data.icon}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }}
            />
          )}
        </div>
        <div className="ap-hero-in">
          <p className="ap-hero-eye" ref={heroEyeRef}>Piece {data.num} Â· Armor of God</p>
          <h1 className="ap-hero-h1" ref={heroH1Ref}>{data.title}</h1>
          <p className="ap-hero-sub" ref={heroSubRef}>{data.trackTitle}</p>
        </div>
      </div>

      {/* â”€â”€ Two-column content â”€â”€ */}
      <div className="ap-content">

        {/* Day selector */}
        <div className="ap-day-nav">
          {data.icon && (
            <img
              src={data.icon}
              alt=""
              className="ap-day-nav-icon"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                                opacity: 0.35,
                flexShrink: 0,
                marginRight: "4px",
              }}
            />
          )}
          {data.days.map(d => (
            <button
              key={d.num}
              className={`ap-day-btn${day === d.num ? " active" : ""}${completedDays.includes(d.num) ? " completed" : ""}`}
              onClick={() => {
                setDay(d.num);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}
            >
              Day {d.num}
            </button>
          ))}
        </div>

        {/* Main column */}
        <div className="ap-main">
          <p className="ap-sec-label">Day {curDay.num} Â· {curDay.title}</p>

          {/* Stillness */}
          <p className="ap-stillness">{curDay.stillness}</p>

          {/* Scripture */}
          <div className="ap-scriptures">
            {curDay.scriptures.map((s, i) => (
              <div key={i} className="ap-scripture">
                <p>"{s.text}"</p>
                <cite><ScriptureRef reference={s.ref} text={s.text} /></cite>
              </div>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Teaching */}
          <div className="ap-teaching">
            <p className="ap-sec-label">Teaching</p>
            {curDay.teaching.map((para, i) => (
              <p key={i} className="ap-body">{parseScriptureRefs(para)}</p>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Practice */}
          <div className="ap-practice">
            <div className="ap-practice-head">
              <p className="ap-sec-label" style={{ margin: 0, border: "none", paddingBottom: 0 }}>Practice</p>
              <span className="ap-practice-badge">{curDay.practice.duration}</span>
            </div>
            <p className="ap-practice-body">{curDay.practice.body}</p>
          </div>

          {/* Reflection */}
          <div className="ap-reflection">
            <p className="ap-sec-label" style={{ marginBottom: ".75rem" }}>Reflection</p>
            {curDay.reflection}
          </div>

          {/* Prayer */}
          <div>
            <p className="ap-sec-label">Prayer</p>
            <div className="ap-prayer">{curDay.prayer}</div>
          </div>

          {/* Declare */}
          <FormationShareable
            trackName={data.title}
            dayNumber={curDay.num}
            scriptureRef={curDay.scriptures[0]?.ref ?? ""}
            isLastDay={isLastDay}
          />

          {isLastDay && (
            <NextStep context="armor-piece-complete" pieceSlug={piece} />
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="ap-sidebar" ref={sidebarRef}>
          <div>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1rem" }}>
              Formation Tool
            </p>
            {React.createElement(WIDGET_COMPONENTS[piece])}
          </div>

          <CrossLinkCard piece={piece} />

          <div>
            <p className="ap-armor-nav-label">The Six Pieces</p>
            <div className="ap-armor-nav">
              {PIECE_ORDER.map(slug => {
                const p = getArmorPiece(slug);
                return (
                  <Link
                    key={slug}
                    to={`/identity/${slug}`}
                    className={`ap-armor-link${slug === piece ? " active" : ""}`}
                  >
                    {p.icon && (
                      <img
                        src={p.icon}
                        alt=""
                        style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "contain",
                                                    opacity: slug === piece ? 0.7 : 0.15,
                          flexShrink: 0,
                          transition: "opacity 0.2s",
                        }}
                      />
                    )}
                    <span className="ap-armor-link-num">{p.num}</span>
                    <span className="ap-armor-link-title">{p.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="ap-piece-nav" ref={pieceNavRef}>
          {prevData ? (
            <Link to={`/identity/${prevSlug}`} className="ap-nav-btn">
              {prevData.icon && <img src={prevData.icon} alt="" style={{ width: "64px", height: "64px", objectFit: "contain", mixBlendMode: "screen", opacity: 0.7, flexShrink: 0 }} />}
              <span className="ap-nav-btn-text">
                <span className="ap-nav-btn-dir">â† Piece {prevData.num}</span>
                <span className="ap-nav-btn-title">{prevData.title}</span>
              </span>
            </Link>
          ) : <div />}
          {nextData ? (
            <Link to={`/identity/${nextSlug}`} className="ap-nav-btn next">
              <span className="ap-nav-btn-text">
                <span className="ap-nav-btn-dir">Piece {nextData.num} â†’</span>
                <span className="ap-nav-btn-title">{nextData.title}</span>
              </span>
              {nextData.icon && <img src={nextData.icon} alt="" style={{ width: "64px", height: "64px", objectFit: "contain", mixBlendMode: "screen", opacity: 0.7, flexShrink: 0 }} />}
            </Link>
          ) : <div />}
        </div>

        {/* Mobile floating progress bar */}
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 80,
            background: "rgba(6,5,10,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {data.days.map(d => (
              <div
                key={d.num}
                style={{
                  width: d.num === day ? 16 : 6,
                  height: 4,
                  borderRadius: 2,
                  background: completedDays.includes(d.num)
                    ? "#C9A84C"
                    : d.num === day
                      ? "rgba(201,168,76,0.5)"
                      : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Day label */}
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(250,248,245,0.4)",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            Day {day} Â· {curDay.title}
          </span>

          {/* Next day / complete action */}
          {day < 6 ? (
            <button
              onClick={() => {
                setDay(day + 1);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "none",
                background: "#C9A84C",
                color: "#0A0A0A",
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Day {day + 1} â†’
            </button>
          ) : (
            <Link
              to={nextSlug ? `/identity/${nextSlug}` : "/identity"}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201,168,76,0.4)",
                background: "transparent",
                color: "#C9A84C",
                textDecoration: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {nextSlug ? "Next Piece â†’" : "â† Identity"}
            </Link>
          )}
        </div>

      </div>

    </div>
    </>
  );
}
