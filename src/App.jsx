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
  Users,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counter Formation — Master Build (Fully Restored)
 * Includes: Hero, Architecture, Rule of Life, The Gear, and Footer.
 */

// --- UTILITIES ---
function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [locked]);
}

function cx(...classes) { return classes.filter(Boolean).join(" "); }

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
    card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale3d(1.01, 1.01, 1.01)`;
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

const SHOPIFY_URL = "https://shop.counterformed.com";
const GEAR_COLLECTION = "/collections/the-gear";

const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyScrollLock(isMenuOpen);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from(".hero-content", { y: 30, opacity: 0, duration: 1.1, ease: "power3.out" });
      
      // Architecture Pillars
      gsap.utils.toArray(".pillar-reveal").forEach((pillar) => {
        gsap.from(pillar, {
          y: 40, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: pillar, start: "top 90%", toggleActions: "play none none reverse" },
        });
      });

      // Rule of Life Items
      gsap.from(".rhythm-card", {
        opacity: 0, y: 20, stagger: 0.1, duration: 0.8,
        scrollTrigger: { trigger: "#rule", start: "top 80%" }
      });

      // Gear Cards
      gsap.utils.toArray(".gear-card").forEach((card) => {
        gsap.from(card, {
          opacity: 0, x: -20, duration: 1,
          scrollTrigger: { trigger: card, start: "top 90%" }
        });
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#0D0D12] text-[#FAF8F5] min-h-screen overflow-x-hidden font-sans">
      
      {/* NOISE LAYER */}
      <div className="fixed inset-0 pointer-events-none z-[110] opacity-[0.03] contrast-150 brightness-100">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-6 md:py-4 bg-[#0D0D12]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <SafeImg src="/helmet.png" className="h-6 w-6 md:h-8 md:w-8 grayscale invert" alt="CF" />
          <span className="font-brand text-[9px] md:text-sm tracking-[0.3em] uppercase">Counter Formation</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-widest font-brand font-bold mr-4">
            <a href="#architecture" className="hover:text-[#C9A84C] transition-colors">Mission</a>
            <a href="#rule" className="hover:text-[#C9A84C] transition-colors">Rule</a>
            <a href="#shop" className="hover:text-[#C9A84C] transition-colors text-[#C9A84C]">Gear</a>
          </div>
          <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} className="px-4 py-2 bg-white text-black rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] transition-all">
            Enter Store
          </a>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-1"><Menu size={20} /></button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={cx("fixed inset-0 z-[120] bg-[#0D0D12] flex flex-col items-center justify-center space-y-8 transition-transform duration-500", isMenuOpen ? "translate-y-0" : "-translate-y-full")}>
        <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8"><X size={28} /></button>
        {['Mission', 'Rule', 'Shop'].map(item => (
          <a key={item} href={`#${item.toLowerCase() === 'mission' ? 'architecture' : item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="font-brand text-2xl tracking-[0.4em] uppercase">{item}</a>
        ))}
      </div>

      {/* HERO SECTION */}
      <section id="top" className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 bg-[url('/hero-bg.png')] bg-cover bg-center opacity-40 scale-105" />
        <div className="hero-content relative z-10 space-y-12 max-w-4xl">
          <SafeImg src="/full-logo.png" className="w-[200px] md:w-[520px] mx-auto drop-shadow-2xl" alt="Counter Formation" />
          <div className="space-y-6">
            <h1 className="font-brand text-xl md:text-5xl uppercase tracking-[0.25em] md:tracking-[0.4em] leading-tight text-white">
              Formed in Christ.<br />
              <span className="opacity-40 italic text-sm md:text-4xl lowercase tracking-normal block mt-2 md:mt-0">Living Counter to Culture.</span>
            </h1>
            <p className="max-w-xs md:max-w-xl mx-auto text-[8px] md:text-xs opacity-60 tracking-[0.15em] uppercase leading-relaxed font-light font-brand">intentional formation in a world designed for drift.</p>
          </div>
          <div className="flex justify-center pt-4">
            <a href="#shop" className="px-12 py-5 bg-[#FAF8F5] text-black rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-[#C9A84C] transition-all font-brand">
              Explore The Gear <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* 1. ARCHITECTURE SECTION (RESTORED) */}
      <section id="architecture" className="relative bg-[#0D0D12] py-24 md:py-40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center md:text-left">
            <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.2em] text-white leading-none">Architecture <br/><span className="opacity-30 italic font-serif lowercase tracking-normal">of the</span> Soul</h2>
          </div>

          <div className="space-y-40 md:space-y-64">
            {/* Identity */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">I</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-8 relative z-10 text-white">Identity</h3>
                <p className="text-xs md:text-lg opacity-60 leading-relaxed font-light max-w-md athletic tracking-widest">Before action comes being. Anchor your identity in Christ, resisting the shallow labels of a performance-driven culture.</p>
              </div>
              <div className="w-full md:w-2/5 aspect-[4/5] bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <SafeImg src="http://googleusercontent.com/image_collection/image_retrieval/17277045960401764834_0" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" alt="Identity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] to-transparent opacity-60" />
              </div>
            </div>

            {/* Practice */}
            <div className="pillar-reveal flex flex-col md:flex-row-reverse items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5 text-right md:text-left">
                <span className="absolute -top-10 md:-top-16 right-0 md:left-20 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">II</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-8 relative z-10 text-white">Practice</h3>
                <p className="text-xs md:text-lg opacity-60 leading-relaxed font-light max-w-md mx-auto md:ml-0 athletic tracking-widest">A life is built on rhythms. Curate disciplines of stillness, study, and physical rigor that act as spiritual anchors.</p>
              </div>
              <div className="w-full md:w-2/5 aspect-[4/5] bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <SafeImg src="http://googleusercontent.com/image_collection/image_retrieval/8470921294581653927_1" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" alt="Practice" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] to-transparent opacity-60" />
              </div>
            </div>
            
            {/* Community */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">III</span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-8 relative z-10 text-white">Community</h3>
                <p className="text-xs md:text-lg opacity-60 leading-relaxed font-light max-w-md athletic tracking-widest">Formation is a team sport. We provide the ethos for a movement of people committed to living differently—together.</p>
              </div>
              <div className="w-full md:w-2/5 aspect-[4/5] bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden relative">
                <SafeImg src="http://googleusercontent.com/image_collection/image_retrieval/17888597553747731182_1" className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 transition-all duration-700" alt="Community" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12] to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RULE OF LIFE (RESTORED) */}
      <section id="rule" className="py-24 md:py-48 px-4 md:px-6 bg-[#0D0D12] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="athletic text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase font-bold">The Pattern</span>
              <h2 className="font-brand text-3xl md:text-7xl uppercase text-white leading-none">Rule of Life</h2>
            </div>
            <p className="max-w-md text-xs md:text-base opacity-40 leading-relaxed font-light font-brand uppercase tracking-widest">A curated set of practices that help us be with Jesus, become like Jesus, and do what Jesus did.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { title: "Presence", desc: "Attention before God", bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600" },
              { title: "Scripture", desc: "Truth before noise", bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600" },
              { title: "Prayer", desc: "Dependence before action", bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600" },
              { title: "Sabbath", desc: "Rest before production", bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600" },
              { title: "Community", desc: "Formation together", bg: "/Community_8k.png" },
            ].map((rhythm, i) => (
              <div key={rhythm.title} className="rhythm-card group relative bg-white/[0.03] border border-white/[0.06] p-8 flex flex-col justify-between min-h-[300px] md:min-h-[440px] hover:border-[#C9A84C]/20 transition-all duration-500 overflow-hidden rounded-2xl md:rounded-none">
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
                  <SafeImg src={rhythm.bg} className="w-full h-full object-cover grayscale" alt="" />
                </div>
                <div className="relative z-10 space-y-4">
                  <span className="block font-mono text-[8px] text-[#C9A84C] tracking-[0.3em]">RHYTHM 0{i + 1}</span>
                  <h3 className="font-brand text-lg uppercase text-white tracking-widest">{rhythm.title}</h3>
                </div>
                <p className="text-[10px] md:text-[11px] opacity-35 tracking-widest uppercase leading-relaxed font-light relative z-10">{rhythm.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE GEAR (UNIFIED WIDE CARDS) */}
      <section id="shop" className="py-24 md:py-40 px-4 md:px-6 bg-[#FAF8F5] text-[#0D0D12]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8">
            <h2 className="font-brand text-5xl md:text-8xl uppercase tracking-tighter leading-none">The Gear</h2>
            <p className="max-w-xs text-[10px] uppercase tracking-[0.2em] opacity-40 font-bold text-right font-brand">apparel as a visual anchor. wear the pattern.</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            {[
              { id: 1, name: "Discipline Tech Tee", category: "Performance Artifact", img: "/DriFit_Black.png", price: "$48", copy: "Engineered for physical discipline. Moisture-wicking obsidian tech." },
              { id: 2, name: "Formation Essential Tee", category: "Daily Artifact", img: "/Tshirt_1.jpg", price: "$38", copy: "A daily visual anchor. Premium soft-wash organic cotton." }
            ].map(item => (
              <div key={item.id} className="gear-card bg-[#0D0D12] text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center border border-transparent hover:border-[#C9A84C]/30 transition-all duration-500 shadow-2xl group">
                <div className="md:w-1/2 aspect-video overflow-hidden rounded-2xl bg-black/40">
                  <SafeImg src={item.img} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-1000" alt={item.name} />
                </div>
                <div className="md:w-1/2 space-y-6 font-brand">
                  <p className="text-[#C9A84C] text-[10px] tracking-widest uppercase font-bold">{item.category}</p>
                  <h3 className="text-4xl uppercase tracking-tighter text-white">{item.name}</h3>
                  <p className="text-xs opacity-50 font-light leading-relaxed font-sans">{item.copy}</p>
                  <div className="flex justify-between items-center pt-8 border-t border-white/10">
                    <span className="text-2xl font-mono text-[#C9A84C]">{item.price}</span>
                    <a href={`${SHOPIFY_URL}${GEAR_COLLECTION}`} className="px-10 py-4 bg-white text-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#C9A84C] transition-all flex items-center gap-2">Secure Artifact <Plus size={14}/></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D0D12] pt-40 pb-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 pb-20 font-brand">
          <div className="max-w-md">
            <h4 className="text-5xl font-serif italic text-[#C9A84C] mb-8">Counter Formation</h4>
            <p className="opacity-40 text-lg leading-relaxed font-light text-white font-sans">We are building a rule of life for the modern age.</p>
          </div>
          <div className="flex gap-24 uppercase tracking-[0.2em] text-[10px] font-bold text-white">
            <div className="flex flex-col gap-6">
              <span className="text-[#C9A84C]">Sitemap</span>
              <a href="#architecture" className="opacity-50 hover:opacity-100">Mission</a>
              <a href="#rule" className="opacity-50 hover:opacity-100">Rule</a>
            </div>
            <div className="flex flex-col gap-6">
              <span className="text-[#C9A84C]">Follow</span>
              <a href="#" className="opacity-50 hover:opacity-100">Instagram</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 opacity-30 text-[9px] uppercase tracking-widest font-mono flex justify-between text-white">
          <span>©2026 COUNTER FORMATION</span>
          <span>DISCIPLINE_OPERATIONAL</span>
        </div>
      </footer>
    </div>
  );
};

export default CounterFormation;