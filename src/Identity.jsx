import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

const C = {
  heroBg: "#06050A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

const ARMOR_PIECES = [
  {
    num: "01", slug: "belt-of-truth", title: "Belt of Truth",
    scripture: "Ephesians 6:14a",
    theology: "The belt was the first piece — everything else attached to it. Truth is foundational. Not abstract doctrine but lived reality.",
    tension: "Curated identity. Social media trains you to perform a self rather than know one.",
    practice: "Five-minute evening examination rooted in Ignatian Examen.",
    hook: "What would change if you stopped managing your image and started telling the truth?",
    product: null,
  },
  {
    num: "02", slug: "breastplate-of-righteousness", title: "Breastplate of Righteousness",
    scripture: "Ephesians 6:14b",
    theology: "Protects the heart. Positional righteousness, not moral performance. Christ's righteousness credited to you.",
    tension: "Performance engine. Worth = output.",
    practice: "Morning declaration spoken aloud.",
    hook: "What metric are you using to determine your worth today?",
    product: null,
  },
  {
    num: "03", slug: "gospel-of-peace", title: "Gospel of Peace",
    scripture: "Ephesians 6:15",
    theology: "Roman sandals had cleats for standing firm. Peace is grounding, not absence of conflict.",
    tension: "Anxiety as ambient condition. Systems engineered for reactivity.",
    practice: "\"Peace pause\" three times daily, sixty seconds of stillness.",
    hook: "What are you anxious about right now? What would it feel like to set it down?",
    product: null,
  },
  {
    num: "04", slug: "shield-of-faith", title: "Shield of Faith",
    scripture: "Ephesians 6:16",
    theology: "Full-body thureos soaked in water to quench fire arrows. Faith is positioning, not feeling.",
    tension: "Flaming arrows are lies about identity, God's character, whether obedience is worth it.",
    practice: "\"Arrow log\" to catch lies and answer with Scripture.",
    hook: "What lie keeps recurring? What would it take to simply refuse it?",
    product: "Drop 002 · Premium Everyday Tee",
  },
  {
    num: "05", slug: "helmet-of-salvation", title: "Helmet of Salvation",
    scripture: "Ephesians 6:17a",
    theology: "Protects the mind. Salvation as present reality and settled identity, not just future promise.",
    tension: "Mind is most contested territory. Anxiety, doom-scrolling, information overload.",
    practice: "\"Helmet check\" — morning identity declaration before digital input.",
    hook: "What is the first thing your mind reaches for in the morning?",
    product: "Drop 002 · Technical Hoodie",
  },
  {
    num: "06", slug: "sword-of-the-spirit", title: "Sword of the Spirit",
    scripture: "Ephesians 6:17b",
    theology: "Only offensive weapon. Scripture as living, active, spoken weapon. Rhema = specific utterance.",
    tension: "Biblical illiteracy at historic highs.",
    practice: "Scripture memorization, one verse per week.",
    hook: "Could you answer with Scripture — not the gist of it, but the words themselves?",
    product: "Drop 002 · Technical Tee",
  },
];

function BackNav() {
  return (
    <Link
      to="/identity"
      className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.25em] uppercase font-bold transition-all"
      style={{
        backgroundColor: `${C.heroBg}cc`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${C.ivory}10`,
        color: `${C.ivory}60`,
        textDecoration: "none",
      }}
    >
      ← Identity
    </Link>
  );
}

function HeroSection() {
  const sectionRef  = useRef(null);
  const eyebrowRef  = useRef(null);
  const headlineRef = useRef(null);
  const sublineRef  = useRef(null);
  const chevronRef  = useRef(null);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([eyebrowRef.current, headlineRef.current, sublineRef.current, chevronRef.current], { opacity: 0, y: 20 });
      gsap.set(watermarkRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(watermarkRef.current,  { opacity: 0.10, duration: 2.0 })
        .to(eyebrowRef.current,    { opacity: 1,    y: 0, duration: 0.8 }, "-=1.5")
        .to(headlineRef.current,   { opacity: 1,    y: 0, duration: 0.9 }, "-=0.55")
        .to(sublineRef.current,    { opacity: 0.55, y: 0, duration: 0.8 }, "-=0.5")
        .to(chevronRef.current,    { opacity: 0.6,  y: 0, duration: 0.7 }, "-=0.4");

      // Chevron pulse
      gsap.to(chevronRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2.5,
      });

      // Watermark parallax on scroll
      gsap.to(watermarkRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: C.heroBg }}
    >
      {/* Hero image — very low opacity atmospheric */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/identity_wide.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.18,
        }}
      />
      {/* Bottom-heavy gradient overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(to top, ${C.heroBg} 0%, ${C.heroBg}ee 30%, ${C.heroBg}88 60%, ${C.heroBg}22 100%)`,
        }}
      />

      {/* Shield watermark — off-center atmospheric, parallax */}
      <div
        ref={watermarkRef}
        className="absolute inset-0 z-0 flex items-center pointer-events-none opacity-0"
        style={{ justifyContent: "flex-end", paddingRight: "8%" }}
      >
        <img
          src="/shield-white.png"
          alt=""
          style={{ height: "45vh", width: "auto", filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Particle field — CSS radial-gradient dots */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <span
          ref={eyebrowRef}
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-8 opacity-0"
          style={{ color: C.gold }}
        >
          The Identity Pillar · Ephesians 6:10–18
        </span>
        <h1
          ref={headlineRef}
          className="font-brand text-4xl md:text-8xl uppercase tracking-[0.1em] md:tracking-[0.14em] text-white leading-none mb-8 opacity-0"
        >
          You Are Being Formed
        </h1>
        <p
          ref={sublineRef}
          className="text-base md:text-xl leading-relaxed max-w-2xl opacity-0"
          style={{
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

export function IdentityLanding() {
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: C.heroBg }}>
      <BackNav />
      <HeroSection />
    </div>
  );
}

export function ArmorPiecePlaceholder() {
  return <div style={{ backgroundColor: C.heroBg, minHeight: "100vh", color: C.ivory }}>Piece coming</div>;
}
