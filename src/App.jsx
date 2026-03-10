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
 * Refactored to hand off commerce to Shopify while elevating the architecture.
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
    if (disabled) return;
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
    <div className="flex items-center justify-center py-6">
      <div className="flex-1 h-[1px] bg-white/5" />
      <div className="mx-8 opacity-[0.06]">
        <SafeImg src="/helmet.png" className="w-8 h-8 grayscale invert" alt="" />
      </div>
      <div className="flex-1 h-[1px] bg-white/5" />
    </div>
  );
}

const SHOPIFY_URL = "https://shop.counterformed.com";

const CounterFormation = () => {
  const mainRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll lock on menu
  useBodyScrollLock(isMenuOpen);

  // ESC closes
  useEscape(() => setIsMenuOpen(false), isMenuOpen);

  // GSAP
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
      });

      gsap.from(".nav-fade", {
        opacity: 0,
        y: -10,
        duration: 0.9,
        delay: 0.1,
        ease: "power2.out",
      });

      // Pillars
      gsap.utils.toArray(".pillar-reveal").forEach((pillar) => {
        gsap.from(pillar, {
          y: 80,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pillar,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Stagger items
      const revealItems = (selector, y = 30) => {
        ScrollTrigger.batch(selector, {
          start: "top 85%",
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
      revealItems(".product-card", 30);
      revealItems(".journal-card", 30);

      // Hero parallax
      gsap.to(".hero-bg-img", {
        yPercent: 20,
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
  const crestWatermark = "/brand/crest-watermark.png";

  return (
    <div
      ref={mainRef}
      className="bg-[#0D0D12] text-[#FAF8F5] selection:bg-[#C9A84C] selection:text-black min-h-screen overflow-x-hidden font-sans"
    >
      {/* NAVBAR */}
      <nav className="nav-fade fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-5xl px-5 py-4 bg-[#0D0D12]/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <SafeImg
            src="/helmet.png"
            className="h-8 w-8 object-contain"
            alt="Counter Formation"
          />
          <span className="font-brand text-[10px] md:text-sm tracking-[0.3em] uppercase whitespace-nowrap">
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
            className="px-6 py-2 bg-white text-black rounded-full athletic text-[10px] hidden md:block hover:bg-[#C9A84C] transition-all"
          >
            Shop the Gear
          </a>

          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={cx(
          "fixed inset-0 z-[120] bg-[#0D0D12] flex flex-col items-center justify-center space-y-10 transition-transform duration-500",
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        )}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-10 right-10"
        >
          <X size={32} />
        </button>
        {['Mission', 'Rule', 'Shop'].map(item => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setIsMenuOpen(false)}
            className="font-brand text-2xl tracking-[0.4em] uppercase"
          >
            {item}
          </a>
        ))}
      </div>

      {/* HERO */}
      <section id="top" className="relative h-screen flex items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SafeImg
            src={heroBg}
            alt=""
            className="hero-bg-img w-full h-full object-cover scale-[1.1] opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#0D0D12]" />
        </div>

        <div className="hero-content relative z-10 space-y-12 max-w-4xl">
          <SafeImg
            src="/full-logo.png"
            className="w-[260px] md:w-[520px] mx-auto drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
            alt="Counter Formation"
          />

          <div className="space-y-6">
            <h1 className="font-brand text-2xl md:text-5xl uppercase tracking-[0.4em] leading-tight text-white mb-4">
              Formed in Christ.<br />
              <span className="opacity-40 italic md:text-4xl lowercase tracking-normal">Living Counter to Culture.</span>
            </h1>

            <p className="max-w-xl mx-auto text-[9px] md:text-xs opacity-60 tracking-[0.25em] uppercase leading-relaxed font-light">
              intentional formation in a world designed for drift.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href="#architecture"
              className="group/btn relative px-12 py-5 bg-white/5 text-white rounded-full athletic text-[10px] border border-white/10 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-all overflow-hidden"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.15)_0%,transparent_70%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Explore the Architecture</span>
            </a>

            <a
              href={SHOPIFY_URL}
              className="group/btn relative px-12 py-5 bg-[#FAF8F5] text-black rounded-full athletic text-[10px] hover:bg-[#C9A84C] transition-all flex items-center gap-3 overflow-hidden"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.25)_0%,transparent_70%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-3">Shop the Gear <ArrowRight size={14} /></span>
            </a>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ARCHITECTURE OF THE SOUL */}
      <section id="architecture" className="relative bg-[#0D0D12] py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center md:text-left space-y-4">
            <h2 className="font-brand text-3xl md:text-5xl uppercase tracking-[0.2em] leading-none text-white">
              Architecture <br />
              <span className="opacity-30 italic font-serif lowercase tracking-normal">of the</span> Soul
            </h2>
            <p className="max-w-2xl text-xs md:text-sm opacity-55 tracking-[0.18em] uppercase leading-relaxed font-light">
              Identity anchors the heart. Practice builds discipline. Community protects the journey.
            </p>
          </div>

          <div className="space-y-48 md:space-y-64">
            {/* Identity */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-16 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-16 -left-10 text-[10rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                  I
                </span>
                <h3 className="font-brand text-4xl md:text-6xl uppercase tracking-widest mb-8 relative z-10 text-white">
                  Identity
                </h3>
                <p className="text-sm md:text-base opacity-60 leading-relaxed font-light max-w-md athletic tracking-widest">
                  Before action comes being. Counter Formation begins by anchoring your identity in Christ —
                  not performance, not platform, not approval.
                </p>
              </div>

              <div className="relative md:w-2/5 aspect-[1/1] bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg
                  src="/Identity_8k.png"
                  alt="Identity"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
              </div>
            </div>

            {/* Practice */}
            <div className="pillar-reveal flex flex-col md:flex-row-reverse items-center gap-16 md:gap-24 group text-right md:text-left">
              <div className="relative md:w-3/5">
                <span className="absolute -top-16 -right-10 md:left-20 text-[10rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                  II
                </span>
                <h3 className="font-brand text-4xl md:text-6xl uppercase tracking-widest mb-8 relative z-10 text-white">
                  Practice
                </h3>
                <p className="text-sm md:text-base opacity-60 leading-relaxed font-light max-w-md ml-auto md:ml-0 athletic tracking-widest">
                  A life is built on rhythms. Through scripture, prayer, sabbath, and stillness we train our lives to remain rooted in Christ.
                </p>
              </div>

              <div className="relative md:w-2/5 aspect-[1/1] bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
                <SafeImg
                  src="/Practice_8k.png"
                  alt="Practice"
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                />
              </div>
            </div>

            {/* Community */}
            <div className="pillar-reveal flex flex-col md:flex-row items-center gap-16 md:gap-24 group">
              <div className="relative md:w-3/5">
                <span className="absolute -top-16 -left-10 text-[10rem] md:text-[18rem] font-brand opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000">
                  III
                </span>
                <h3 className="font-brand text-4xl md:text-6xl uppercase tracking-widest mb-8 relative z-10 text-white">
                  Community
                </h3>
                <p className="text-sm md:text-base opacity-60 leading-relaxed font-light max-w-md athletic tracking-widest">
                  Formation is a team sport. We provide an ethos for people committed to living differently — together.
                </p>
              </div>

              <div className="relative md:w-2/5 aspect-[1/1] bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
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
      <section id="rule" className="py-48 px-6 bg-[#0D0D12] relative overflow-hidden">
        {/* Architectural grid lines behind cards */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
          <div className="max-w-7xl mx-auto h-full grid grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4].map(n => (
              <div key={n} className="border-x border-white h-full" />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-32 flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="space-y-6">
              <span className="athletic text-[10px] text-[#C9A84C] tracking-[0.5em]">The Pattern</span>
              <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-[0.15em] text-white leading-none">
                Rule of Life
              </h2>
            </div>
            <p className="max-w-md text-sm md:text-base opacity-40 leading-relaxed font-light text-right">
              A curated set of practices and relational commitments that help us be with Jesus, become like Jesus, and do what Jesus did.
            </p>
          </div>

          {/* Bronze divider line */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mb-16" />

          {/* Rhythm Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {[
              {
                title: "Presence",
                desc: "Attention before God",
                practices: ["Silence", "Stillness", "Awareness of God"],
                bg: "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7">
                    <path d="M12 2C12 2 8 7 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 7 12 2 12 2Z" />
                    <path d="M12 16V22" />
                    <path d="M9 22H15" />
                  </svg>
                )
              },
              {
                title: "Scripture",
                desc: "Truth before noise",
                practices: ["Scripture before screen", "Meditation", "Learning the words of Jesus"],
                bg: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7">
                    <path d="M4 4H12C12 4 12 8 8 8C4 8 4 4 4 4Z" />
                    <path d="M4 4V20L8 18L12 20V4" />
                    <path d="M15 7H20" />
                    <path d="M15 11H20" />
                    <path d="M15 15H19" />
                  </svg>
                )
              },
              {
                title: "Prayer",
                desc: "Dependence before action",
                practices: ["Daily prayer", "Intercession", "Listening"],
                bg: "https://images.unsplash.com/photo-1473172707857-f9e276582ab6?q=80&w=600",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7">
                    <path d="M12 22C12 22 6 16 6 10C6 6 8 4 12 2C16 4 18 6 18 10C18 16 12 22 12 22Z" />
                    <path d="M12 8V14" />
                    <path d="M9 11H15" />
                  </svg>
                )
              },
              {
                title: "Sabbath",
                desc: "Rest before production",
                practices: ["Weekly rest", "Delight", "Worship"],
                bg: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?q=80&w=600",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7">
                    <circle cx="12" cy="12" r="9" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 3V6" />
                    <path d="M12 18V21" />
                    <path d="M3 12H6" />
                    <path d="M18 12H21" />
                  </svg>
                )
              },
              {
                title: "Community",
                desc: "Formation together",
                practices: ["Shared rhythms", "Accountability", "Service"],
                bg: "/Community_8k.png",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7">
                    <circle cx="9" cy="7" r="3" />
                    <circle cx="17" cy="7" r="3" />
                    <path d="M2 21C2 17 5 14 9 14" />
                    <path d="M22 21C22 17 19 14 15 14" />
                    <path d="M9 14C10.5 14 12 14.5 13 15.5" />
                  </svg>
                )
              },
            ].map((rhythm, i) => (
              <div
                key={rhythm.title}
                className="manifesto-item group relative bg-white/[0.03] border border-white/[0.06] p-7 md:p-8 flex flex-col justify-between min-h-[340px] md:min-h-[440px] hover:bg-white/[0.06] hover:border-[#C9A84C]/20 transition-all duration-500 cursor-default overflow-hidden"
              >
                {/* Background image */}
                <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-50 transition-opacity duration-1000">
                  <SafeImg src={rhythm.bg} alt="" className="w-full h-full object-cover grayscale" />
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0D0D12] via-[#0D0D12]/80 to-transparent" />

                {/* Vertical rhythm marker */}
                <div className="absolute top-0 left-7 w-[1px] h-8 bg-[#C9A84C]/20 group-hover:h-12 group-hover:bg-[#C9A84C]/40 transition-all duration-500 z-10" />

                {/* Top: Icon + Number */}
                <div className="space-y-6 relative z-10">
                  <div className="text-white/10 group-hover:text-[#C9A84C]/40 transition-colors duration-500">
                    {rhythm.icon}
                  </div>
                  <span className="block font-mono text-[9px] text-[#C9A84C]/60 tracking-[0.4em] group-hover:text-[#C9A84C] transition-colors duration-500">
                    RHYTHM 0{i + 1}
                  </span>
                </div>

                {/* Bottom: Title + Descriptor + Micro practices */}
                <div className="space-y-3 mt-auto relative z-10">
                  <h3 className="font-brand text-base md:text-lg uppercase tracking-[0.1em] text-white leading-tight group-hover:translate-y-[-2px] transition-transform duration-500">
                    {rhythm.title}
                  </h3>
                  <p className="text-[11px] opacity-35 tracking-wide leading-relaxed font-light group-hover:opacity-55 transition-opacity duration-500">
                    {rhythm.desc}
                  </p>

                  {/* Micro practices — reveal on hover */}
                  <div className="overflow-hidden">
                    <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 pt-3 border-t border-white/5 space-y-1.5">
                      {rhythm.practices.map(p => (
                        <p key={p} className="text-[10px] text-white/30 tracking-wide font-light flex items-center gap-2">
                          <span className="w-1 h-1 bg-[#C9A84C]/40 rounded-full inline-block flex-shrink-0" />
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bronze divider line */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/20 to-transparent mt-16" />

          {/* Closing manifesto */}
          <div className="mt-24 text-center">
            <div className="inline-block relative">
              <span className="font-brand italic text-xl md:text-3xl text-white/15 tracking-wide">
                "A pattern for the soul. A rhythm for the age."
              </span>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* THE GEAR (Shop Handoff) */}
      <section id="shop" className="py-48 px-6 bg-[#FAF8F5] text-[#0D0D12] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-20">
            <h2 className="font-brand text-4xl md:text-7xl uppercase tracking-tighter">
              The Gear
            </h2>
            <p className="text-[10px] uppercase tracking-[0.25em] opacity-40 max-w-sm text-right leading-relaxed font-bold">
              apparel as a visual anchor. wear the pattern. remember the call.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Technical Tee", img: "/DriFit_Black.png", link: "/collections/tees", copy: "Performance tech for training." },
              { name: "Everyday Tee", img: "/Tshirt_1.jpg", link: "/collections/tees", copy: "Premium soft-wash cotton for daily rhythm." },
              { name: "Hoodies", img: "/shield-black.png", link: "/collections/hoodies", copy: "Heavyweight anchors for morning rhythms.", comingSoon: true }
            ].map(cat => (
              <TiltCard
                key={cat.name}
                disabled={cat.comingSoon}
                className="product-card"
              >
                <a
                  href={cat.comingSoon ? undefined : `${SHOPIFY_URL}${cat.link}`}
                  target={cat.comingSoon ? undefined : "_blank"}
                  rel={cat.comingSoon ? undefined : "noopener noreferrer"}
                  className={cx(
                    "group relative block overflow-hidden bg-black aspect-[3/4] rounded-[3rem]",
                    cat.comingSoon && "pointer-events-none"
                  )}
                >
                  {cat.comingSoon && (
                    <div className="absolute top-8 right-8 z-20 bg-[#C9A84C] text-black px-5 py-2 athletic text-[9px] tracking-[0.3em]">
                      Coming Soon
                    </div>
                  )}
                  <div className={cx(
                    "absolute inset-0 z-0 opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0",
                    cat.comingSoon && "opacity-30"
                  )}>
                    <SafeImg src={cat.img} className="w-full h-full object-cover" alt={cat.name} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                  <div className="relative z-10 h-full p-12 flex flex-col justify-end text-white space-y-4">
                    <h3 className="font-brand text-3xl md:text-4xl uppercase italic tracking-tighter">{cat.name}</h3>
                    <p className="text-[10px] athletic opacity-60 tracking-[0.3em] uppercase">{cat.copy}</p>
                    {!cat.comingSoon && (
                      <div className="flex items-center gap-3 text-[9px] athletic text-[#C9A84C] pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        Shop Collection <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    )}
                  </div>
                </a>
              </TiltCard>
            ))}
          </div>

          <div className="mt-24 text-center">
            <a href={SHOPIFY_URL} className="athletic text-[10px] border-b border-black/10 pb-2 hover:border-[#C9A84C] transition-colors tracking-[0.5em]">Explore Full Catalog</a>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* FIELD GUIDE */}
      <section className="py-40 px-6 bg-[#0D0D12] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
          <div className="max-w-7xl mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="border-x border-white/20 h-full" />
            <div className="border-x border-white/20 h-full" />
            <div className="border-x border-white/20 h-full" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
            <div className="space-y-6 max-w-3xl">
              <h2 className="font-brand text-3xl md:text-7xl uppercase whitespace-nowrap">Field Guide</h2>
              <p className="text-sm md:text-base opacity-55 leading-relaxed font-light max-w-2xl">
                Devotions, practices, and media designed to carry the life of Counter Formation beyond the garment.
                Each release opens a deeper layer of formation — linked through the gear itself.
              </p>
            </div>

            <a
              href="#"
              className="athletic text-[10px] text-[#C9A84C] border border-white/10 px-8 py-3 hover:bg-white/5 transition-all whitespace-nowrap rounded-full"
            >
              Explore Archive
            </a>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            {[
              {
                type: "Devotion",
                rhythm: "Scripture",
                title: "Scripture Before Scroll",
                img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800",
                desc: "Reclaim the architecture of your first hour through scripture before the algorithm.",
              },
              {
                type: "Practice",
                rhythm: "Sabbath",
                title: "Practicing Rest",
                img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
                desc: "A weekly rhythm of trust, delight, and resistance to production without end.",
              },
              {
                type: "Video",
                rhythm: "Community",
                title: "Formation Together",
                img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
                desc: "Why apprenticeship to Jesus requires shared life, mutual love, and practiced presence.",
              }
            ].map((art) => (
              <div key={art.title} className="journal-card group cursor-pointer space-y-8">
                <div className="aspect-video overflow-hidden rounded-[2rem] bg-white/5 border border-white/5 relative">
                  <SafeImg
                    src={art.img}
                    alt={art.title}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D12]/80 via-transparent to-transparent" />
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.35em] athletic">
                    <span className="text-[#C9A84C]">{art.type}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/35">{art.rhythm}</span>
                  </div>
                  <h3 className="font-brand text-2xl md:text-3xl uppercase tracking-tighter text-white leading-none">{art.title}</h3>
                  <p className="text-[11px] leading-relaxed text-white/45 max-w-sm">{art.desc}</p>
                  <div className="flex items-center gap-2 text-[10px] athletic text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity pt-2 uppercase tracking-[0.25em]">
                    Open Guide <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 md:px-10 py-8 md:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
            <div className="space-y-4 max-w-3xl">
              <span className="athletic text-[10px] text-[#C9A84C] tracking-[0.4em] uppercase">Linked to the Gear</span>
              <h3 className="font-brand text-2xl md:text-4xl uppercase tracking-[0.12em] text-white">From Garment to Practice</h3>
              <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl">
                Every new release can unlock a hub of formation content — product story, devotion, practice, reflection,
                video, audio, and community challenge — accessed through QR touchpoints built into the gear.
              </p>
            </div>

            <div className="w-full md:w-auto flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-3 text-[9px] athletic uppercase tracking-[0.3em] text-white/35">
                <span>Gear</span>
                <span className="text-[#C9A84C]">→</span>
                <span>QR</span>
                <span className="text-[#C9A84C]">→</span>
                <span>Guide</span>
                <span className="text-[#C9A84C]">→</span>
                <span>Practice</span>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/10 bg-[#0D0D12] p-3">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https%3A%2F%2Fcounterformed.com%2Ffield-guide"
                  alt="Field Guide QR code"
                  className="w-20 h-20 md:w-24 md:h-24 opacity-80"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* JOIN THE ORDER */}
      <section className="py-48 px-6 bg-[#0D0D12] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <SafeImg src="/helmet.png" alt="" className="w-[500px] h-[500px] grayscale invert" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-12">
          <span className="athletic text-[10px] text-[#C9A84C] tracking-[0.5em]">The Order</span>
          <h2 className="font-brand text-3xl md:text-6xl uppercase tracking-[0.15em] text-white">
            Join the Movement
          </h2>
          <p className="text-sm md:text-lg opacity-50 leading-relaxed font-light max-w-xl mx-auto">
            Counter Formation is a distributed community pursuing intentional faith through shared rhythms. We resist the drift of the modern world — together.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-white/5 border border-white/10 px-8 py-5 athletic text-[10px] text-white w-full md:w-[340px] outline-none focus:border-[#C9A84C] transition-colors rounded-full text-center placeholder:text-white/30"
            />
            <button className="group/btn relative px-10 py-5 bg-[#FAF8F5] text-black rounded-full athletic text-[10px] hover:bg-[#C9A84C] transition-all w-full md:w-auto overflow-hidden">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.25)_0%,transparent_70%)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Join the Order</span>
            </button>
          </div>
          <p className="athletic text-[8px] opacity-20 tracking-[0.4em]">Receive Field Guide + Formation Updates</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0D0D12] pt-48 pb-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 border-b border-white/10 pb-32">
          <div className="col-span-1 md:col-span-1 space-y-10">
            <div className="flex items-center gap-4">
              <SafeImg src="/helmet.png" className="w-12 h-12 object-contain" alt="Counter Formation" />
              <h4 className="font-brand text-3xl italic text-[#C9A84C]">
                Counter Formation
              </h4>
            </div>
            <p className="opacity-40 text-xs uppercase tracking-[0.2em] leading-loose font-light">
              Formed in Christ.<br />
              Living counter to culture.
            </p>
          </div>

          <div className="space-y-8 athletic text-xs tracking-[0.2em] opacity-40 font-bold">
            <span className="text-[#C9A84C] opacity-100">Architecture</span>
            <div className="flex flex-col gap-5 uppercase">
              <a href="#architecture" className="hover:text-white transition-colors">Mission</a>
              <a href="#rule" className="hover:text-white transition-colors">Rule</a>
              <a href="#shop" className="hover:text-white transition-colors">Gear</a>
            </div>
          </div>

          <div className="space-y-8 athletic text-xs tracking-[0.2em] opacity-40 font-bold">
            <span className="text-[#C9A84C] opacity-100">Connect</span>
            <div className="flex flex-col gap-5 uppercase">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Email</a>
              <a href="#" className="hover:text-white transition-colors">Newsletter</a>
            </div>
          </div>

          <div className="space-y-8 athletic text-xs tracking-[0.2em] opacity-40 font-bold">
            <span className="text-[#C9A84C] opacity-100">Details</span>
            <div className="flex flex-col gap-5 uppercase">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 flex flex-col md:flex-row justify-between items-center text-xs opacity-30 tracking-[0.3em] uppercase gap-8 athletic">
          <span>© 2026 COUNTER FORMATION</span>
          <div className="flex gap-8 font-mono">
            <span>DISCIPLINE • PRESENCE • COMMUNITY</span>
          </div>
          <span>FORMED. NOT DRIFTING.</span>
        </div>
      </footer>
    </div>
  );
};

export default CounterFormation;