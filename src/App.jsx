import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
  ExternalLink,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Counter Formation — Movement/Brand Site
 * Optimized for iPhone SE + Responsive Viewports
 */

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}

function useEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => {
      if (e.key === "Escape") handler?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, enabled]);
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SafeImg({
  src,
  alt,
  className,
  fallback = "/placeholder.png",
  ...rest
}) {
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
    if (disabled || window.innerWidth < 768) return; // Disable tilt on mobile for performance
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

const SHOPIFY_URL = "https://shop.counterformed.com";

const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useBodyScrollLock(isMenuOpen);
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        y: 30,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });

      gsap.from(".nav-fade", {
        opacity: 0,
        y: -10,
        duration: 0.9,
        ease: "power2.out",
      });

      gsap.utils.toArray(".pillar-reveal").forEach((pillar) => {
        gsap.from(pillar, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pillar,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const revealItems = (selector, y = 20) => {
        ScrollTrigger.batch(selector, {
          start: "top 90%",
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { opacity: 0, y: y },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: "power2.out",
                overwrite: "auto",
              }
            ),
        });
      };

      revealItems(".manifesto-item");
      revealItems(".product-card", 20);
      revealItems(".journal-card", 20);

      gsap.to(".hero-bg-img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: "#top",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const heroBg = "/hero-bg.png";

  return (
    <div
      ref={mainRef}
      className="bg-[#0D0D12] text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
    >
      {/* NAVBAR */}
      <nav className="nav-fade fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 bg-[#0D0D12]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 md:gap-3">
          <SafeImg
            src="/helmet.png"
            className="h-6 w-6 md:h-8 md:w-8 object-contain"
            alt="Counter Formation"
          />
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
            className="px-4 py-2 md:px-6 md:py-2 bg-white text-black rounded-full athletic text-[9px] md:text-[10px] hidden md:block hover:bg-[#C9A84C] transition-all"
          >
            Shop the Gear
          </a>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden p-1"
            aria-label="Toggle menu"
          >
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
        {['Mission', 'Rule', 'Shop'].map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setIsMenuOpen(false)}
            className="font-brand text-xl tracking-[0.3em] uppercase"
          >
            {item}
          </a>
        ))}
        <a href={SHOPIFY_URL} className="athletic text-[10px] text-[#C9A84C] tracking-widest uppercase border border-[#C9A84C]/20 px-8 py-3 rounded-full">
          Enter Store
        </a>
      </div>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SafeImg
            src={heroBg}
            alt=""
            className="hero-bg-img w-full h-full object-cover scale-[1.1] opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#0D0D12]" />
        </div>

        <div className="hero-content relative z-10 space-y-8 md:space-y-12 max-w-4xl">
          <SafeImg
            src="/full-logo.png"
            className="w-[200px] md:w-[520px] mx-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] max-h-[40vh] object-contain"
            alt="Counter Formation"
          />

          <div className="space-y-4 md:space-y-6">
            <h1 className="font-brand text-xl md:text-5xl uppercase tracking-[0.25em] md:tracking-[0.4em] leading-tight text-white px-2">
              Formed in Christ.<br />
              <span className="opacity-40 italic text-sm md:text-4xl lowercase tracking-normal block md:inline mt-2 md:mt-0">Living Counter to Culture.</span>
            </h1>

            <p className="max-w-xs md:max-w-xl mx-auto text-[8px] md:text-xs opacity-60 tracking-[0.15em] md:tracking-[0.25em] uppercase leading-relaxed font-light">
              intentional formation in a world designed for drift.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
            <a
              href="#architecture"
              className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-white/5 text-white rounded-full athletic text-[9px] md:text-[10px] border border-white/10 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all"
            >
              Explore the Architecture
            </a>

            <a
              href={SHOPIFY_URL}
              className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#FAF8F5] text-black rounded-full athletic text-[9px] md:text-[10px] hover:bg-[#C9A84C] transition-all flex items-center justify-center gap-3"
            >
              Shop the Gear <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

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
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                  I
                </span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">
                  Identity
                </h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md athletic tracking-widest">
                  Before action comes being. Counter Formation begins by anchoring your identity in Christ —
                  not performance, not platform, not approval.
                </p>
              </div>

              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg
                  src="/Identity_8k.png"
                  alt="Identity"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
              </div>
            </div>

            {/* Practice */}
            <div className="pillar-reveal flex flex-col-reverse md:flex-row-reverse items-center gap-10 md:gap-24 group text-center md:text-left">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 right-0 md:left-20 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                  II
                </span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">
                  Practice
                </h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md mx-auto md:ml-0 athletic tracking-widest">
                  A life is built on rhythms. Through scripture, prayer, sabbath, and stillness we train our lives to remain rooted in Christ.
                </p>
              </div>

              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg
                  src="/Practice_8k.png"
                  alt="Practice"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
              </div>
            </div>

            {/* Community */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-10 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-10 md:-top-16 -left-6 md:-left-10 text-[6rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                  III
                </span>
                <h3 className="font-brand text-3xl md:text-6xl uppercase tracking-widest mb-4 md:mb-8 relative z-10 text-white">
                  Community
                </h3>
                <p className="text-xs md:text-base opacity-60 leading-relaxed font-light max-w-md athletic tracking-widest">
                  Formation is a team sport. We provide an ethos for people committed to living differently — together.
                </p>
              </div>

              <div className="relative w-full md:w-2/5 aspect-square bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg
                  src="/Community_8k.png"
                  alt="Community"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
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
              <span className="athletic text-[8px] md:text-[10px] text-[#C9A84C] tracking-[0.4em] md:tracking-[0.5em]">The Pattern</span>
              <h2 className="font-brand text-3xl md:text-7xl uppercase tracking-[0.1em] md:tracking-[0.15em] text-white leading-none">
                Rule of Life
              </h2>
            </div>
            <p className="max-w-md text-xs md:text-base opacity-40 leading-relaxed font-light text-left md:text-right">
              A curated set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5">
            {[
              { title: "Presence", desc: "Attention before God", practices: ["Silence", "Stillness"], bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600" },
              { title: "Scripture", desc: "Truth before noise", practices: ["Meditation", "Learning"], bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600" },
              { title: "Prayer", desc: "Dependence before action", practices: ["Daily prayer", "Listening"], bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600" },
              { title: "Sabbath", desc: "Rest before production", practices: ["Weekly rest", "Delight"], bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600" },
              { title: "Community", desc: "Formation together", practices: ["Shared rhythms", "Service"], bg: "/Community_8k.png" },
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
                  <h3 className="font-brand text-base md:text-lg uppercase tracking-[0.1em] text-white">
                    {rhythm.title}
                  </h3>
                </div>
                <p className="text-[10px] md:text-[11px] opacity-35 tracking-wide leading-relaxed font-light relative z-10">
                  {rhythm.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE GEAR (Shop Handoff) */}
      <section id="shop" className="py-24 md:py-48 px-4 md:px-6 bg-[#FAF8F5] text-[#0D0D12]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-12 mb-12 md:mb-20">
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-tighter">
              The Gear
            </h2>
            <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] opacity-40 max-w-sm text-left md:text-right font-bold">
              apparel as a visual anchor. wear the pattern.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Technical Tee", img: "/DriFit_Black.png", link: "/collections/tees", copy: "Performance tech for training." },
              { name: "Everyday Tee", img: "/Tshirt_1.jpg", link: "/collections/tees", copy: "Premium soft-wash cotton." },
              { name: "Hoodies", img: "/shield-black.png", link: "/collections/hoodies", copy: "Heavyweight anchors.", comingSoon: true }
            ].map(cat => (
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
                    <p className="text-[9px] md:text-[10px] athletic opacity-60 uppercase mt-2 tracking-widest">{cat.copy}</p>
                    {!cat.comingSoon && (
                      <div className="flex items-center gap-3 text-[9px] athletic text-[#C9A84C] pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
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

      {/* FOOTER - COMPACT FOR MOBILE */}
      <footer className="bg-[#0D0D12] pt-24 md:pt-48 pb-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 pb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <SafeImg src="/helmet.png" className="w-10 h-10" alt="" />
              <h4 className="font-brand text-2xl text-[#C9A84C]">Counter Formation</h4>
            </div>
            <p className="opacity-30 text-[10px] uppercase tracking-widest">Formed in Christ. Not drifting.</p>
          </div>
          {/* Quick Links for mobile stack */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 col-span-1 md:col-span-3">
            <div className="space-y-4 athletic text-[9px] tracking-widest opacity-40">
              <span className="text-[#C9A84C]">Sitemap</span>
              <a href="#architecture" className="block hover:text-white">Mission</a>
              <a href="#rule" className="block hover:text-white">Rule</a>
            </div>
            <div className="space-y-4 athletic text-[9px] tracking-widest opacity-40">
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