import React, { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Menu,
  X,
  ShoppingBag,
  Plus,
  Trash2,
  Minus,
  Shield,
  Sword,
  Users
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- HELPER COMPONENTS ---

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [locked]);
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

// --- MAIN APPLICATION ---

const SHOPIFY_URL = "https://shop.counterformed.com";
const GEAR_COLLECTION = "/collections/the-gear";

const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-content", {
        y: 40,
        opacity: 0,
        duration: 1.4,
        ease: "power4.out",
      });

      // Pillar Reveal (Architecture Section)
      gsap.utils.toArray(".pillar-reveal").forEach((pillar) => {
        gsap.from(pillar, {
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pillar,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Gear Cards Reveal
      gsap.utils.toArray(".gear-card").forEach((card) => {
        gsap.from(card, {
          x: -30,
          opacity: 0,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
          }
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={mainRef}
      className="bg-[#0D0D12] text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
    >
      {/* ATMOSPHERIC NOISE */}
      <div className="fixed inset-0 pointer-events-none z-[110] opacity-[0.03] contrast-150 brightness-100">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-6 md:py-4 bg-[#0D0D12]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <SafeImg src="/helmet.png" className="h-6 w-6 md:h-8 md:w-8 object-contain" alt="CF" />
          <span className="font-brand text-[9px] md:text-sm tracking-[0.3em] uppercase whitespace-nowrap">Counter Formation</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-widest font-brand font-bold">
            <a href="#architecture" className="hover:text-[#C9A84C] transition-colors">Mission</a>
            <a href="#shop" className="hover:text-[#C9A84C] transition-colors">The Gear</a>
          </div>
          <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} className="hidden md:block px-6 py-2 bg-[#FAF8F5] text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] transition-all">
            Enter Store
          </a>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden"><Menu size={20} /></button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={cx("fixed inset-0 z-[150] bg-[#0D0D12] flex flex-col items-center justify-center space-y-12 transition-transform duration-500", isMenuOpen ? "translate-y-0" : "-translate-y-full")}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8"><X size={32} /></button>
        <a href="#architecture" onClick={() => setIsMenuOpen(false)} className="font-brand text-2xl tracking-[0.4em] uppercase">Mission</a>
        <a href="#shop" onClick={() => setIsMenuOpen(false)} className="font-brand text-2xl tracking-[0.4em] uppercase">The Gear</a>
        <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} className="px-10 py-4 bg-[#C9A84C] text-black rounded-full font-bold uppercase text-xs tracking-widest">Enter Store</a>
      </div>

      {/* HERO SECTION */}
      <section id="top" className="relative min-h-screen flex items-center justify-center text-center px-6 pt-20 overflow-hidden">
        <div className="hero-content relative z-10 space-y-12 max-w-5xl">
          <SafeImg src="/full-logo.png" className="w-[220px] md:w-[480px] mx-auto drop-shadow-2xl" alt="CF Logo" />
          <div className="space-y-6">
            <h1 className="font-brand text-2xl md:text-5xl uppercase tracking-[0.4em] leading-tight">
              Formed in Christ. <br />
              <span className="opacity-40 italic text-sm md:text-4xl lowercase tracking-normal block mt-2 md:mt-0">Living Counter to Culture.</span>
            </h1>
            <p className="max-w-xl mx-auto text-[9px] md:text-xs opacity-50 tracking-[0.2em] uppercase leading-relaxed font-light">
              intentional formation in a world designed for drift.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-4">
            <a href="#shop" className="px-12 py-5 bg-[#FAF8F5] text-black rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#C9A84C] transition-all font-brand">
              Explore The Gear <ArrowRight size={14}/>
            </a>
          </div>
        </div>
      </section>

      {/* ARCHITECTURE (MISSION) */}
      <section id="architecture" className="py-40 bg-[#0D0D12] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-32 text-center md:text-left">
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.2em] leading-none">
              Architecture <br />
              <span className="opacity-30 italic font-serif lowercase tracking-normal">of the</span> Soul
            </h2>
          </div>

          <div className="space-y-60 md:space-y-80">
            {/* Identity */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-12 md:gap-24 group">
              <div className="relative md:w-1/2">
                <span className="absolute -top-20 -left-10 text-[12rem] md:text-[20rem] font-brand opacity-[0.03] select-none group-hover:opacity-[0.06] transition-opacity duration-1000">I</span>
                <h3 className="font-brand text-5xl md:text-8xl uppercase tracking-tighter mb-8 relative z-10">Identity</h3>
                <p className="text-sm md:text-lg opacity-60 leading-relaxed font-light max-w-md">
                  Before action comes being. Anchor your identity in Christ, resisting the shallow labels of a performance-driven culture.
                </p>
              </div>
              <div className="md:w-1/2 aspect-[4/5] bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden relative">
                 <SafeImg src="/Identity_8k.png" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" alt="Identity" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] to-transparent opacity-60" />
              </div>
            </div>

            {/* Practice */}
            <div className="pillar-reveal flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24 group">
              <div className="relative md:w-1/2 text-right md:text-left">
                <span className="absolute -top-20 -right-10 md:left-20 text-[12rem] md:text-[20rem] font-brand opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000">II</span>
                <h3 className="font-brand text-5xl md:text-8xl uppercase tracking-tighter mb-8 relative z-10">Practice</h3>
                <p className="text-sm md:text-lg opacity-60 leading-relaxed font-light max-w-md ml-auto md:ml-0">
                  A life is built on rhythms. Curate disciplines of stillness, study, and physical rigor that act as spiritual anchors.
                </p>
              </div>
              <div className="md:w-1/2 aspect-[4/5] bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden relative">
                 <SafeImg src="/Practice_8k.png" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" alt="Practice" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE GEAR (Unified Collection Flow) */}
      <section id="shop" className="py-40 px-6 bg-[#FAF8F5] text-[#0D0D12]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
            <h2 className="font-brand text-5xl md:text-8xl uppercase tracking-tighter leading-none">The Gear</h2>
            <p className="max-w-xs text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold text-right">apparel as a visual anchor. wear the pattern.</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Unified Gear Card 01 */}
            <div className="gear-card bg-[#0D0D12] text-white rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center border border-transparent hover:border-[#C9A84C]/30 transition-all duration-500 shadow-2xl">
              <div className="md:w-1/2 aspect-video overflow-hidden rounded-2xl bg-black/40">
                <SafeImg src="/DriFit_Black.png" className="w-full h-full object-contain hover:scale-105 transition-transform duration-1000" alt="Tech Tee" />
              </div>
              <div className="md:w-1/2 space-y-6 font-brand">
                <p className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-bold">Formation Artifact • Performance</p>
                <h3 className="text-4xl uppercase tracking-tighter">The Discipline Tech Tee</h3>
                <p className="text-xs opacity-50 font-light leading-relaxed">Engineered for physical discipline. Moisture-wicking obsidian tech.</p>
                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                  <span className="text-2xl font-mono text-[#C9A84C]">$48</span>
                  <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} target="_blank" rel="noreferrer" className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] transition-all flex items-center gap-2">
                    Secure Gear <Plus size={14}/>
                  </a>
                </div>
              </div>
            </div>

            {/* Unified Gear Card 02 */}
            <div className="gear-card bg-[#0D0D12] text-white rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center border border-transparent hover:border-[#C9A84C]/30 transition-all duration-500 shadow-2xl">
              <div className="md:w-1/2 aspect-video overflow-hidden rounded-2xl bg-black/40">
                <SafeImg src="/Tshirt_1.jpg" className="w-full h-full object-contain hover:scale-105 transition-transform duration-1000" alt="Essential Tee" />
              </div>
              <div className="md:w-1/2 space-y-6 font-brand">
                <p className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-bold">Daily Artifact • Community</p>
                <h3 className="text-4xl uppercase tracking-tighter">Formation Essential Tee</h3>
                <p className="text-xs opacity-50 font-light leading-relaxed">A daily visual anchor. Premium soft-wash organic cotton.</p>
                <div className="flex justify-between items-center pt-8 border-t border-white/10">
                  <span className="text-2xl font-mono text-[#C9A84C]">$38</span>
                  <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} target="_blank" rel="noreferrer" className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] transition-all flex items-center gap-2">
                    Secure Gear <Plus size={14}/>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D0D12] pt-40 pb-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 pb-20 font-brand">
          <div className="max-w-md">
            <h4 className="text-5xl font-serif italic text-[#C9A84C] mb-8">Counter Formation</h4>
            <p className="opacity-40 text-lg leading-relaxed font-light">We are building a rule of life for the modern age.</p>
          </div>
          <div className="flex gap-24 uppercase tracking-[0.2em] text-[10px] font-bold">
            <div className="flex flex-col gap-6">
              <span className="text-[#C9A84C]">Shop</span>
              <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} className="opacity-50 hover:opacity-100 transition-opacity">The Gear</a>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[#C9A84C]">Brand</span>
              <a href="#architecture" className="opacity-50 hover:opacity-100 transition-opacity">Mission</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 opacity-30 text-[9px] uppercase tracking-widest font-mono flex justify-between">
          <span>©2026 COUNTER FORMATION</span>
          <span>DISCIPLINE_OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
};

export default CounterFormation;