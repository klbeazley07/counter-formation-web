import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";
import { ScriptureRef } from "../../ScriptureRef";
import SectionHeader from "../primitives/SectionHeader";
import { getAllArmorPieces, getArmorPiece } from "../../content/loader";

const ARMOR_PIECES = getAllArmorPieces();

export default function ArmorRingSection() {
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

  /* Entry observer */
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

  /* Entry animation */
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

  /* Icon scale/opacity on selection */
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

  /* Image crossfade */
  useEffect(() => {
    if (!imageRef.current) return;
    if (activePiece === null) {
      gsap.to(imageRef.current, { opacity: 0, duration: 0.4, ease: "power2.out" });
    } else {
      if (prevPieceRef.current !== null) {
        gsap.fromTo(imageRef.current,
          { opacity: 0 },
          { opacity: 0.72, duration: 0.5, ease: "power2.out" }
        );
      } else {
        gsap.fromTo(imageRef.current,
          { opacity: 0 },
          { opacity: 0.72, duration: 0.8, ease: "power2.out" }
        );
      }
    }
  }, [activePiece]);

  /* Center name crossfade */
  useEffect(() => {
    if (!centerRef.current) return;
    gsap.fromTo(centerRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" }
    );
  }, [activePiece]);

  /* Right column content fade */
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
    <section id="six-pieces" ref={sectionRef} className="py-24 md:py-40 px-5" style={{ backgroundColor: "var(--cf-rule-bg)" }}>
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

        <SectionHeader eyebrow="The Six Pieces" title="The Armor of God" className="mb-12 md:mb-16" />

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
              background: "var(--cf-hero-bg)",
              alignSelf: "flex-start",
              margin: "0 auto",
            }}
          >
            {/* Atmospheric hero image */}
            <img
              ref={imageRef}
              src={piece ? (getArmorPiece(piece.slug)?.img || "") : ""}
              alt="" role="presentation" style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top",
                opacity: 0,
                pointerEvents: "none",
              }}
            />
            {/* Radial overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(ellipse at center, #06050A33 0%, #06050A88 60%, #06050ACC 100%)`,
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
                <g style={{
                  transformOrigin: "50px 50px",
                  animation: prefersReduced ? "none" : "ringRotate 60s linear infinite",
                }}>
                  <circle
                    className="ring-arc"
                    cx="50" cy="50" r={ICON_R}
                    fill="none"
                    stroke={"var(--cf-gold)"}
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
                        <circle cx={p1.x} cy={p1.y} r="0.35" fill={"var(--cf-gold)"} opacity="0.08"
                          style={{ animation: prefersReduced ? "none" : anim }} />
                        <circle cx={p2.x} cy={p2.y} r="0.35" fill={"var(--cf-gold)"} opacity="0.06"
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
                background: `radial-gradient(circle, #C9A84C22 0%, transparent 70%)`,
                animation: prefersReduced ? "none" : "centerGlow 3s ease-in-out infinite",
                pointerEvents: "none",
              }} />

              {/* Center content */}
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
                    color: "var(--cf-gold)",
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
                      alt="" role="presentation" style={{
                        width: "clamp(156px, 15vw, 204px)", height: "auto",
                        objectFit: "contain", opacity: 0.55,
                        display: "block", margin: "0 auto 0.75rem",
                      }}
                    />
                    <span style={{
                      fontFamily: "var(--cf-font-devotional)",
                      fontStyle: "italic",
                      fontSize: "clamp(26px, 2.8vw, 36px)",
                      color: "var(--cf-gold)",
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
                        border: `1px solid #C9A84C`,
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
                        filter: isActive ? `drop-shadow(0 0 8px #C9A84C88)` : "none",
                        transition: "opacity 0.3s ease, filter 0.3s ease",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* "Tap a piece to begin" hint */}
            {!hasEverSelected && (
              <p style={{
                position: "absolute", bottom: "1.5rem", left: 0, right: 0,
                textAlign: "center",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: `#FAF8F533`,
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
                  <span className="text-[11px] tracking-[0.4em] uppercase" style={{ color: `#C9A84C77` }}>
                    {piece.num}
                  </span>
                  <div className="h-[1px] flex-1" style={{ background: `#C9A84C22` }} />
                </div>
                <h3 className="font-brand text-2xl md:text-4xl uppercase tracking-[0.1em] text-white mb-3">
                  {piece.title}
                </h3>
                <p className="text-[12px] tracking-[0.3em] uppercase mb-8" style={{ color: `#C9A84C99` }}>
                  <ScriptureRef reference={piece.scripture} text={piece.scriptureText} />
                </p>

                <div className="space-y-7">
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `#FAF8F555` }}>
                      Theology
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `#FAF8F588` }}>
                      {piece.theology}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `#FAF8F555` }}>
                      Modern Tension
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `#FAF8F566` }}>
                      {piece.tension}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-[0.3em] uppercase block mb-2" style={{ color: `#FAF8F555` }}>
                      Daily Practice
                    </span>
                    <p className="text-base md:text-lg leading-relaxed font-light" style={{ color: `#FAF8F577` }}>
                      {piece.practice}
                    </p>
                  </div>
                </div>

                <blockquote
                  className="mt-8 pl-4 border-l"
                  style={{
                    borderColor: `#C9A84C33`,
                    fontFamily: "var(--cf-font-devotional)",
                    fontStyle: "italic",
                    fontSize: "clamp(17px, 1.6vw, 22px)",
                    color: `#FAF8F599`,
                  }}
                >
                  "{piece.hook}"
                </blockquote>

                <div className="mt-8 flex items-center gap-5">
                  <Link
                    to={`/identity/${piece.slug}`}
                    className="text-[12px] tracking-[0.28em] uppercase font-bold flex items-center gap-2 transition-opacity hover:opacity-100"
                    style={{ color: "var(--cf-gold)", textDecoration: "none" }}
                  >
                    Explore this piece
                    <ArrowRight size={14} />
                  </Link>
                  {piece.product && (
                    <span className="text-[11px] tracking-[0.24em] uppercase" style={{ color: `#FAF8F544` }}>
                      {piece.product}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p style={{
                fontFamily: "var(--cf-font-devotional)",
                fontStyle: "italic",
                fontSize: "clamp(16px, 1.8vw, 22px)",
                color: `#FAF8F522`,
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
