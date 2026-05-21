import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
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
      gsap.set([eyebrowRef.current, sublineRef.current, chevronRef.current], { opacity: 0, y: 20 });
      gsap.set(headlineRef.current, { opacity: 0, y: 20, scale: 0.97 });
      gsap.set(watermarkRef.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(watermarkRef.current,  { opacity: 0.10, duration: 1.0 })
        .to(eyebrowRef.current,    { opacity: 1,    y: 0, duration: 0.5 }, "-=0.7")
        .fromTo(headlineRef.current,
          { opacity: 0, y: 20, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1.0, duration: 0.7, ease: "power3.out" }, "-=0.3")
        .to(sublineRef.current,    { opacity: 0.55, y: 0, duration: 0.6 }, "+=0.1")
        .to(chevronRef.current,    { opacity: 0.6,  y: 0, duration: 0.5 }, "-=0.3");

      gsap.fromTo(chevronRef.current,
        { opacity: 0.4 },
        { opacity: 1.0, duration: 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 1.8 }
      );
      gsap.to(chevronRef.current, {
        y: 8, duration: 1.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.8,
      });

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
      style={{ backgroundColor: "var(--cf-hero-bg)" }}
    >
      {/* Clipping wrapper for background layers */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/Identity_wide.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            opacity: 0.18,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, #06050A 0%, #06050Aee 30%, #06050A88 60%, #06050A22 100%)`,
          }}
        />

        {/* Shield watermark */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex items-center opacity-0"
          style={{ justifyContent: "flex-end", paddingRight: "8%" }}
        >
          <img
            src="/shield-white.png"
            alt="" role="presentation" style={{
              height: "clamp(28vw, 45vh, 45vh)",
              width: "auto",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Particle field */}
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
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        <span
          ref={eyebrowRef}
          className="text-[10px] md:text-[11px] tracking-[0.5em] uppercase font-bold mb-8 opacity-0"
          style={{ color: "var(--cf-gold)" }}
        >
          The Identity Pillar · Ephesians 6:10–18
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
            fontFamily: "var(--cf-font-devotional)",
            fontStyle: "italic",
            color: `#FAF8F588`,
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
          style={{ background: `linear-gradient(to bottom, transparent, #C9A84C66)` }}
        />
        <ChevronDown size={16} color={"var(--cf-gold)"} strokeWidth={1.5} />
      </div>
    </section>
  );
}
