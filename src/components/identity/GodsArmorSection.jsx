import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GodsArmorSection() {
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
        if (leftColRef.current) {
          gsap.fromTo(leftColRef.current,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
              scrollTrigger: { trigger: leftColRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
        }
        if (rightColRef.current) {
          gsap.fromTo(rightColRef.current,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power2.out", delay: 0.3,
              scrollTrigger: { trigger: leftColRef.current, start: "top 80%", toggleActions: "play none none reverse" } });
        }
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
        gsap.fromTo(sectionRef.current,
          { backgroundColor: "var(--cf-hero-bg)" },
          { backgroundColor: "var(--cf-rule-bg)", ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
      }, sectionRef);
    });
    return () => { cancelAnimationFrame(raf); ctx?.revert(); };
  }, []);

  return (
    <section
      id="revelation"
      ref={sectionRef}
      className="py-24 md:py-40 px-5"
      style={{ backgroundColor: "var(--cf-hero-bg)" }}
    >
      <div className="max-w-[1100px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-start">

          <div ref={leftColRef}>
            <span
              className="block text-[10px] tracking-[0.5em] uppercase font-bold mb-8"
              style={{ color: "var(--cf-gold)" }}
            >
              The Revelation
            </span>
            <p className="text-sm md:text-base leading-relaxed font-light mb-6" style={{ color: `#FAF8F577` }}>
              The armor Paul describes is not a metaphor invented for the church. It is drawn from Isaiah's descriptions of God Himself. Isaiah 59:17 describes God putting on righteousness as a breastplate, salvation as a helmet. Isaiah 11:5 pictures the belt of faithfulness. Isaiah 52:7 speaks of feet bringing good news of peace.
            </p>
            <p className="text-sm md:text-base leading-relaxed font-light mb-12" style={{ color: `#FAF8F577` }}>
              When you put on the armor of God, you are not assembling your own defenses. You are stepping into God's own character — the same righteousness, the same salvation, the same peace that belong to Him. The armor is His before it is yours.
            </p>
            <p
              ref={brandLineRef}
              className="text-lg md:text-2xl tracking-[0.12em] uppercase font-bold leading-tight"
              style={{ fontFamily: "'Michroma', sans-serif", color: "var(--cf-gold)" }}
            >
              "You are not inventing identity. You are receiving it."
            </p>
          </div>

          <div ref={rightColRef}>
            <div className="border-l-2 pl-8" style={{ borderColor: `#C9A84C33` }}>
              <span
                className="block text-[9px] tracking-[0.4em] uppercase mb-6"
                style={{ color: `#C9A84C77` }}
              >
                Isaiah 59:17
              </span>
              <p
                style={{
                  fontFamily: "var(--cf-font-devotional)",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 3.5vw, 48px)",
                  lineHeight: 1.3,
                  color: `#FAF8F5bb`,
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
