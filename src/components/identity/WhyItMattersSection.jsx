import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WhyItMattersSection() {
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
        gsap.set(".closing-para", { opacity: 0 });
        ScrollTrigger.batch(".closing-para", {
          start: "top 88%",
          onEnter: batch => gsap.fromTo(batch,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: "auto" }),
          onLeaveBack: batch => gsap.to(batch,
            { opacity: 0, y: 15, duration: 0.4, overwrite: "auto" }),
        });
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
        if (armorUpRef.current) {
          gsap.fromTo(armorUpRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out",
              scrollTrigger: { trigger: armorUpRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
        }
        if (ctaRef.current) {
          const buttons = ctaRef.current.querySelectorAll("a, button");
          gsap.set(buttons, { opacity: 0, y: 12 });
          gsap.to(buttons, {
            opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out",
            scrollTrigger: { trigger: ctaRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          });
        }
        if (scriptureRef.current) {
          gsap.fromTo(scriptureRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
              scrollTrigger: { trigger: scriptureRef.current, start: "top 90%", toggleActions: "play none none reverse" } });
        }
      }, sectionRef);
    });
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="why"
      ref={sectionRef}
      className="px-5"
      style={{ backgroundColor: "var(--cf-rule-bg)" }}
    >
      {/* Part 1: Why the Armor (prose) */}
      <div className="max-w-[740px] mx-auto pt-24 md:pt-40">
        <span
          className="closing-para block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
          style={{ color: "var(--cf-gold)" }}
        >
          Why the Armor
        </span>
        <div className="space-y-8">
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `#FAF8F577` }}>
            The armor is not a costume. It is what God has provided for people who are being formed in a system that is actively working against them. Every culture in history has had a comprehensive formation project — a set of values, narratives, and practices designed to shape people into its image. The digital age is no different, except that its reach is total and its pace is unprecedented.
          </p>
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `#FAF8F577` }}>
            The gear is not the armor. It is a marker — a daily reminder that you belong to a different formation project. The QR code connects to the formation content: the theology, the practice, the community. The garment anchors the identity. The content forms it.
          </p>
          <p className="closing-para text-sm md:text-base leading-relaxed font-light" style={{ color: `#FAF8F577` }}>
            The gear is the entry point. The content is the formation. The practice is the armor. These three move together, or they don't move at all.
          </p>
        </div>

        <p
          ref={pivotRef}
          className="mt-16 text-lg md:text-2xl tracking-[0.14em] uppercase font-bold leading-tight"
          style={{ fontFamily: "'Michroma', sans-serif", color: "var(--cf-gold)" }}
        >
          "The gear is not the mission. It's a marker of it."
        </p>
      </div>

      {/* Part 2: Armor Up declaration + CTAs */}
      <div id="collection" className="max-w-[740px] mx-auto text-center pt-20 md:pt-28">
        <div
          className="mx-auto mb-16 md:mb-20"
          style={{
            width: "48px",
            height: "1px",
            background: `linear-gradient(to right, transparent, #C9A84C55, transparent)`,
          }}
        />

        <p
          ref={armorUpRef}
          style={{
            fontFamily: "var(--cf-font-devotional)",
            fontStyle: "italic",
            fontSize: "clamp(32px, 6vw, 56px)",
            color: "var(--cf-gold)",
            lineHeight: 1.2,
            marginBottom: "1.5rem",
          }}
        >
          Armor Up.
        </p>

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

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <a
            href="/#shop"
            className="inline-flex items-center justify-center gap-3 px-9 py-3 rounded-full font-bold text-[10px] tracking-[0.28em] uppercase transition-all hover:scale-105 w-full sm:w-auto"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              backgroundColor: "var(--cf-gold)",
              color: "#0A0A0A",
              boxShadow: `0 4px 24px #C9A84C44`,
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
              color: "var(--cf-gold)",
              border: `1px solid #C9A84C44`,
              textDecoration: "none",
            }}
          >
            Begin Formation
          </Link>
        </div>

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
          New to Counter Formation? Start with the 7-Day Challenge →
        </Link>
      </div>

      {/* Part 3: Closing scripture + brand mark */}
      <div
        id="begin"
        ref={scriptureRef}
        className="max-w-[740px] mx-auto text-center pb-24 md:pb-40"
      >
        <div
          className="mx-auto mb-12"
          style={{
            width: "32px",
            height: "1px",
            background: `#C9A84C22`,
          }}
        />

        <p
          className="text-base md:text-lg leading-relaxed mb-3"
          style={{
            fontFamily: "var(--cf-font-devotional)",
            fontStyle: "italic",
            color: `#FAF8F544`,
          }}
        >
          "Be strong in the Lord and in his mighty power. Put on the full armor of God."
        </p>
        <p
          className="text-[9px] tracking-[0.4em] uppercase mb-12"
          style={{ color: `#FAF8F525` }}
        >
          Ephesians 6:10–11
        </p>

        <img
          src="/helmet.png"
          alt="" role="presentation" style={{ height: "36px", filter: "brightness(0) invert(1)", opacity: 0.06, margin: "0 auto 12px", display: "block" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <p
          className="text-[8px] tracking-[0.4em] uppercase"
          style={{ color: `#FAF8F518` }}
        >
          Discipline · Presence · Formation
        </p>
      </div>
    </section>
  );
}
