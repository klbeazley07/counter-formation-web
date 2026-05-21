import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ArmorIntroSection() {
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
        if (rightColRef.current) {
          gsap.fromTo(rightColRef.current,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.3,
              scrollTrigger: { trigger: eyebrowBRef.current, start: "top 85%", toggleActions: "play none none reverse" } });
        }
        if (goldRuleRef.current) {
          gsap.set(goldRuleRef.current, { scaleX: 0, transformOrigin: "left center" });
          gsap.to(goldRuleRef.current, {
            scaleX: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: goldRuleRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          });
        }
        gsap.set(".armor-para", { opacity: 0 });
        ScrollTrigger.batch(".armor-para", {
          start: "top 88%",
          onEnter: batch => gsap.fromTo(batch,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power2.out", overwrite: "auto" }),
          onLeaveBack: batch => gsap.to(batch, { opacity: 0, y: 15, duration: 0.4, overwrite: "auto" }),
        });
      }, sectionRef);
    });
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section id="scripture" ref={sectionRef} className="py-24 md:py-40 px-5" style={{ backgroundColor: "var(--cf-hero-bg)" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-[55fr_45fr] gap-16 md:gap-24 items-start">

          {/* LEFT: Scripture */}
          <div>
            <span
              ref={eyebrowBRef}
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: "var(--cf-gold)" }}
            >
              Ephesians 6:10–18
            </span>
            <blockquote
              ref={scriptureBRef}
              style={{
                fontFamily: "var(--cf-font-devotional)",
                fontStyle: "italic",
                fontSize: "clamp(17px, 1.9vw, 24px)",
                lineHeight: 1.85,
                color: `#FAF8F5cc`,
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
              style={{ background: `linear-gradient(to right, #C9A84C55, transparent)` }}
            />
            <p
              className="armor-para mb-10"
              style={{
                fontFamily: "var(--cf-font-devotional)",
                fontStyle: "italic",
                fontSize: "clamp(20px, 2.2vw, 28px)",
                lineHeight: 1.55,
                color: `#FAF8F5bb`,
              }}
            >
              The armor is not something you build. It is something you receive and put on.
            </p>
            <div className="space-y-8">
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `#FAF8F599` }}>
                Paul is writing to people under real pressure — not offering a metaphor for self-improvement but a survival framework for people living inside a hostile formation system. Rome's empire was total: emperor worship, cultural assimilation, a comprehensive narrative about power, identity, and worth. The parallel to the modern formation environment is not metaphorical. It is structural.
              </p>
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `#FAF8F599` }}>
                Identity in Christ is given, not constructed. The belt, the breastplate, the shield — each piece represents a dimension of God's own character that He extends to those who are in Christ. You are not assembling virtue through effort. You are stepping into what has already been provided.
              </p>
              <p className="armor-para text-sm md:text-base leading-relaxed font-light" style={{ color: `#FAF8F599` }}>
                "Putting on" is a daily, deliberate act. You drift without it by default. The armor does not go on automatically — it requires intentional return, morning by morning, to the reality of who you are in Christ before the world has a chance to tell you otherwise. That is why this collection pairs every piece with a formation pathway.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-20 flex justify-center pointer-events-none">
          <img
            src="/helmet.png"
            alt="" role="presentation" style={{ height: "200px", filter: "brightness(0) invert(1)", opacity: 0.06 }}
          />
        </div>
      </div>
    </section>
  );
}
