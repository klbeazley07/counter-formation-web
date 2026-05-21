import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ChevronDown } from "lucide-react";
import { ScriptureRef } from "../../ScriptureRef";
import { ExamenWidget }       from "../../widgets/ExamenWidget";
import { DeclarationWidget }  from "../../widgets/DeclarationWidget";
import { PeacePauseWidget }   from "../../widgets/PeacePauseWidget";
import { ArrowLogWidget }     from "../../widgets/ArrowLogWidget";
import { FirstFifteenWidget } from "../../widgets/FirstFifteenWidget";
import { VerseTrackerWidget } from "../../widgets/VerseTrackerWidget";
import { FormationShareable } from "../../FormationShareable";
import { parseScriptureRefs } from "../../utils/parseScriptureRefs";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import NextStep from "../NextStep";
import { getArmorPiece } from "../../content/loader";
import Button from "../primitives/Button";

export const PIECE_ORDER = [
  "belt-of-truth",
  "breastplate-of-righteousness",
  "gospel-of-peace",
  "shield-of-faith",
  "helmet-of-salvation",
  "sword-of-the-spirit",
];

const WIDGET_COMPONENTS = {
  "belt-of-truth":               ExamenWidget,
  "breastplate-of-righteousness": DeclarationWidget,
  "gospel-of-peace":             PeacePauseWidget,
  "shield-of-faith":             ArrowLogWidget,
  "helmet-of-salvation":         FirstFifteenWidget,
  "sword-of-the-spirit":         VerseTrackerWidget,
};

const CROSS_LINKS = {
  "belt-of-truth":               { to: "/rule-of-life/presence",  rhythm: "PRESENCE",  tagline: "Attention before God" },
  "breastplate-of-righteousness":{ to: "/rule-of-life/prayer",    rhythm: "PRAYER",    tagline: "Dependence before action" },
  "gospel-of-peace":             { to: "/rule-of-life/sabbath",   rhythm: "SABBATH",   tagline: "Rest before production" },
  "shield-of-faith":             { to: "/rule-of-life/community", rhythm: "COMMUNITY", tagline: "Formation together" },
  "helmet-of-salvation":         { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
  "sword-of-the-spirit":         { to: "/rule-of-life/scripture", rhythm: "SCRIPTURE", tagline: "Truth before noise" },
};

function BackNav({ progRef }) {
  const { piece } = useParams();
  const [open, setOpen] = useState(false);
  const current = getArmorPiece(piece);

  return (
    <div className="ap-back-nav">
      <Link to="/identity" className="ap-back-link">
        ← Identity
      </Link>

      <button
        className="ap-piece-switcher"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="ap-piece-switcher-num">{current?.num}</span>
        <span className="ap-piece-switcher-title">{current?.title}</span>
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s", opacity: 0.4 }} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 199,
              background: "rgba(0,0,0,0.3)",
            }}
          />
          <div className="ap-piece-dropdown" style={{ zIndex: 200 }}>
            {PIECE_ORDER.map(slug => {
              const p = getArmorPiece(slug);
              const isActive = slug === piece;
              return (
                <Link
                  key={slug}
                  to={`/identity/${slug}`}
                  className={`ap-piece-dropdown-item${isActive ? " active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  <span className="ap-piece-dropdown-num">{p.num}</span>
                  <span>{p.title}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "rgba(255,255,255,0.05)" }}>
        <div ref={progRef} style={{ height: "100%", width: "0%", background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35))", transition: "width .12s linear" }} />
      </div>
    </div>
  );
}

function CrossLinkCard({ piece }) {
  const link = CROSS_LINKS[piece];
  if (!link) return null;
  return (
    <Link
      to={link.to}
      style={{
        display: "block",
        textDecoration: "none",
        background: "rgba(201,168,76,0.04)",
        border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        transition: "border-color .2s, background .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.08)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.28)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.04)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.14)";
      }}
    >
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".36em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "6px" }}>
        Connected Rhythm
      </p>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "13px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--cf-gold)", fontWeight: 700, marginBottom: "4px" }}>
        {link.rhythm}
      </p>
      <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "14px", color: "rgba(250,248,245,0.45)", lineHeight: 1.4 }}>
        {link.tagline}
      </p>
    </Link>
  );
}

export function ArmorPiecePage() {
  const { piece }     = useParams();
  const navigate      = useNavigate();
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const [day, setDay] = useState(1);
  const [completedDays, setCompletedDays] = useState([]);
  const [showQRWelcome, setShowQRWelcome] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('qr') === 'true';
  });
  const [arrivedViaQR] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('qr') === 'true';
  });
  const [qrFadingOut, setQRFadingOut] = useState(false);
  const progRef       = useRef(null);
  const wrapRef       = useRef(null);
  const heroBgRef     = useRef(null);
  const heroEyeRef    = useRef(null);
  const heroH1Ref     = useRef(null);
  const heroSubRef    = useRef(null);
  const sidebarRef    = useRef(null);
  const pieceNavRef   = useRef(null);

  const data = getArmorPiece(piece);

  useEffect(() => {
    if (!data) navigate("/identity", { replace: true });
  }, [data, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setDay(1);
    if (isLoaded) {
      setCompletedDays(profile.armor.progress[piece] ?? []);
    }
  }, [piece, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const patch = { armor: { progress: { [piece]: completedDays } } };
    if (completedDays.includes(6)) {
      const current = profile.armor.completedPieces ?? [];
      if (!current.includes(piece)) {
        patch.armor.completedPieces = [...current, piece];
      }
    }
    updateProfile(patch);
  }, [completedDays, piece]);

  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (progRef.current) progRef.current.style.width = (pct * 100) + "%";
      if (pct > 0.8 && !completedDays.includes(day)) {
        setCompletedDays(prev => [...new Set([...prev, day])]);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data, day, completedDays]);

  /* GSAP Piece Page Animations */
  useEffect(() => {
    if (!data) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      if (heroBgRef.current) {
        gsap.set(heroBgRef.current, { scale: 1.02 });
        gsap.fromTo(heroBgRef.current,
          { scale: 1.02 },
          { scale: 1.0, duration: 1.5, ease: "power2.out" }
        );
      }
      if (heroEyeRef.current) {
        gsap.set(heroEyeRef.current, { opacity: 0, y: 15 });
        gsap.fromTo(heroEyeRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.1 }
        );
      }
      if (heroH1Ref.current) {
        gsap.set(heroH1Ref.current, { opacity: 0, y: 20 });
        gsap.fromTo(heroH1Ref.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.3 }
        );
      }
      if (heroSubRef.current) {
        gsap.set(heroSubRef.current, { opacity: 0, y: 15 });
        gsap.fromTo(heroSubRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.6 }
        );
      }

      const daySections = [".ap-stillness", ".ap-scriptures", ".ap-teaching", ".ap-practice", ".ap-reflection"];
      daySections.forEach(sel => {
        const el = wrapRef.current?.querySelector(sel);
        if (el) {
          gsap.set(el, { opacity: 0, y: 25 });
          gsap.fromTo(el,
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none reverse" } }
          );
        }
      });

      const prayerEl = wrapRef.current?.querySelector(".ap-prayer");
      if (prayerEl) {
        gsap.set(prayerEl, { opacity: 0, y: 15 });
        gsap.fromTo(prayerEl,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: prayerEl, start: "top 82%", toggleActions: "play none none reverse" } }
        );
      }

      const secLabels = wrapRef.current?.querySelectorAll(".ap-sec-label");
      if (secLabels) {
        secLabels.forEach(el => {
          gsap.set(el, { opacity: 0, y: 15 });
          gsap.fromTo(el,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        });
      }

      const scriptureBlocks = wrapRef.current?.querySelectorAll(".ap-scripture");
      if (scriptureBlocks) {
        scriptureBlocks.forEach(el => {
          gsap.set(el, { opacity: 0, y: 15 });
          gsap.fromTo(el,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }
          );
        });
      }

      if (sidebarRef.current) {
        gsap.set(sidebarRef.current, { opacity: 0, y: 20 });
        gsap.fromTo(sidebarRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: sidebarRef.current, start: "top 80%", once: true } }
        );
      }

      if (pieceNavRef.current) {
        const navBtns = pieceNavRef.current.querySelectorAll(".ap-nav-btn");
        if (navBtns.length) {
          gsap.set(navBtns, { opacity: 0, y: 15 });
          gsap.fromTo(navBtns,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
              scrollTrigger: { trigger: pieceNavRef.current, start: "top 90%", toggleActions: "play none none reverse" } }
          );
        }
      }
    }, wrapRef);
    return () => ctx.revert();
  }, [data, piece, day]);

  if (!data) return null;

  const idx      = PIECE_ORDER.indexOf(piece);
  const prevSlug = PIECE_ORDER[idx - 1] ?? null;
  const nextSlug = PIECE_ORDER[idx + 1] ?? null;
  const prevData = prevSlug ? getArmorPiece(prevSlug) : null;
  const nextData = nextSlug ? getArmorPiece(nextSlug) : null;
  const curDay   = data.days[day - 1];
  const isLastDay = day === 6;

  return (
    <>
    {showQRWelcome && (
      <div
        className="fixed inset-0 z-[500] flex flex-col items-center justify-center text-center px-8"
        style={{
          backgroundColor: "#06050A",
          opacity: qrFadingOut ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: qrFadingOut ? "none" : "auto",
        }}
      >
        {data.icon && (
          <img src={data.icon} alt="" role="presentation" style={{ width: 40, mixBlendMode: "screen", opacity: 0.12, marginBottom: "2rem" }} />
        )}
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "10px", letterSpacing: "0.5em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: "1.5rem", fontWeight: 700 }}>
          You're Wearing the Armor
        </p>
        <h2 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(28px, 6vw, 52px)", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--cf-ivory)", lineHeight: 0.9, marginBottom: "1rem" }}>
          {data.title}
        </h2>
        <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "clamp(15px, 3vw, 20px)", color: "rgba(250,248,245,0.4)", marginBottom: "3rem" }}>
          {data.trackTitle}
        </p>
        <Button variant="primary" size="lg" onClick={() => {
            setQRFadingOut(true);
            window.history.replaceState({}, '', window.location.pathname);
            setTimeout(() => setShowQRWelcome(false), 400);
          }}>
          Begin Formation →
        </Button>
      </div>
    )}
    <div className="ap-wrap" ref={wrapRef}>
      <BackNav progRef={progRef} />

      {/* Hero */}
      <div className="ap-hero">
        <div className="ap-hero-bg" ref={heroBgRef} style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="ap-hero-ov" />
        <div className="ap-hero-icon">
          {data.icon && (
            <img
              src={data.icon}
              alt="" role="presentation" style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "screen" }}
            />
          )}
        </div>
        <div className="ap-hero-in">
          <p className="ap-hero-eye" ref={heroEyeRef}>Piece {data.num} · Armor of God</p>
          <h1 className="ap-hero-h1" ref={heroH1Ref}>{data.title}</h1>
          <p className="ap-hero-sub" ref={heroSubRef}>{data.trackTitle}</p>
        </div>
      </div>

      {/* Two-column content */}
      <div className="ap-content">

        {arrivedViaQR && (
          <NextStep
            context="qr-arrival"
            pieceSlug={piece}
            className="ap-qr-arrival"
          />
        )}

        {/* Day selector */}
        <div className="ap-day-nav">
          {data.icon && (
            <img
              src={data.icon}
              alt="" role="presentation" className="ap-day-nav-icon"
              style={{
                width: "28px",
                height: "28px",
                objectFit: "contain",
                opacity: 0.35,
                flexShrink: 0,
                marginRight: "4px",
              }}
            />
          )}
          {data.days.map(d => (
            <button
              key={d.num}
              className={`ap-day-btn${day === d.num ? " active" : ""}${completedDays.includes(d.num) ? " completed" : ""}`}
              onClick={() => {
                setDay(d.num);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}
            >
              Day {d.num}
            </button>
          ))}
        </div>

        {/* Main column */}
        <div className="ap-main">
          <p className="ap-sec-label">Day {curDay.num} · {curDay.title}</p>

          {/* Stillness */}
          <p className="ap-stillness">{curDay.stillness}</p>

          {/* Scripture */}
          <div className="ap-scriptures">
            {curDay.scriptures.map((s, i) => (
              <div key={i} className="ap-scripture">
                <p>"{s.text}"</p>
                <cite><ScriptureRef reference={s.ref} text={s.text} /></cite>
              </div>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Teaching */}
          <div className="ap-teaching">
            <p className="ap-sec-label">Teaching</p>
            {curDay.teaching.map((para, i) => (
              <p key={i} className="ap-body">{parseScriptureRefs(para)}</p>
            ))}
          </div>

          <div className="ap-rule" />

          {/* Practice */}
          <div className="ap-practice">
            <div className="ap-practice-head">
              <p className="ap-sec-label" style={{ margin: 0, border: "none", paddingBottom: 0 }}>Practice</p>
              <span className="ap-practice-badge">{curDay.practice.duration}</span>
            </div>
            <p className="ap-practice-body">{curDay.practice.body}</p>
          </div>

          {/* Reflection */}
          <div className="ap-reflection">
            <p className="ap-sec-label" style={{ marginBottom: ".75rem" }}>Reflection</p>
            {curDay.reflection}
          </div>

          {/* Prayer */}
          <div>
            <p className="ap-sec-label">Prayer</p>
            <div className="ap-prayer">{curDay.prayer}</div>
          </div>

          {/* Declare */}
          <FormationShareable
            trackName={data.title}
            dayNumber={curDay.num}
            scriptureRef={curDay.scriptures[0]?.ref ?? ""}
            isLastDay={isLastDay}
          />

          {isLastDay && (
            <NextStep context="armor-piece-complete" pieceSlug={piece} />
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="ap-sidebar" ref={sidebarRef}>
          <div>
            <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".4em", textTransform: "uppercase", color: "rgba(201,168,76,0.5)", marginBottom: "1rem" }}>
              Formation Tool
            </p>
            {React.createElement(WIDGET_COMPONENTS[piece])}
          </div>

          <CrossLinkCard piece={piece} />

          <div>
            <p className="ap-armor-nav-label">The Six Pieces</p>
            <div className="ap-armor-nav">
              {PIECE_ORDER.map(slug => {
                const p = getArmorPiece(slug);
                return (
                  <Link
                    key={slug}
                    to={`/identity/${slug}`}
                    className={`ap-armor-link${slug === piece ? " active" : ""}`}
                  >
                    {p.icon && (
                      <img
                        src={p.icon}
                        alt="" role="presentation" style={{
                          width: "20px",
                          height: "20px",
                          objectFit: "contain",
                          opacity: slug === piece ? 0.7 : 0.15,
                          flexShrink: 0,
                          transition: "opacity 0.2s",
                        }}
                      />
                    )}
                    <span className="ap-armor-link-num">{p.num}</span>
                    <span className="ap-armor-link-title">{p.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className="ap-piece-nav" ref={pieceNavRef}>
          {prevData ? (
            <Link to={`/identity/${prevSlug}`} className="ap-nav-btn">
              {prevData.icon && <img src={prevData.icon} alt="" role="presentation" style={{ width: "64px", height: "64px", objectFit: "contain", mixBlendMode: "screen", opacity: 0.7, flexShrink: 0 }} />}
              <span className="ap-nav-btn-text">
                <span className="ap-nav-btn-dir">← Piece {prevData.num}</span>
                <span className="ap-nav-btn-title">{prevData.title}</span>
              </span>
            </Link>
          ) : <div />}
          {nextData ? (
            <Link to={`/identity/${nextSlug}`} className="ap-nav-btn next">
              <span className="ap-nav-btn-text">
                <span className="ap-nav-btn-dir">Piece {nextData.num} →</span>
                <span className="ap-nav-btn-title">{nextData.title}</span>
              </span>
              {nextData.icon && <img src={nextData.icon} alt="" role="presentation" style={{ width: "64px", height: "64px", objectFit: "contain", mixBlendMode: "screen", opacity: 0.7, flexShrink: 0 }} />}
            </Link>
          ) : <div />}
        </div>

        {/* Mobile floating progress bar */}
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 80,
            background: "rgba(6,5,10,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Progress dots */}
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            {data.days.map(d => (
              <div
                key={d.num}
                style={{
                  width: d.num === day ? 16 : 6,
                  height: 4,
                  borderRadius: 2,
                  background: completedDays.includes(d.num)
                    ? "#C9A84C"
                    : d.num === day
                      ? "rgba(201,168,76,0.5)"
                      : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>

          {/* Day label */}
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "10px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(250,248,245,0.4)",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            Day {day} · {curDay.title}
          </span>

          {/* Next day / complete action */}
          {day < 6 ? (
            <Button variant="primary" size="sm" style={{ flexShrink: 0, whiteSpace: "nowrap" }}
              onClick={() => {
                setDay(day + 1);
                const contentEl = document.querySelector('.ap-main');
                if (contentEl) {
                  const navHeight = document.querySelector('.ap-day-nav')?.offsetHeight || 60;
                  const top = contentEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }
              }}>
              Day {day + 1} →
            </Button>
          ) : (
            <Link
              to={nextSlug ? `/identity/${nextSlug}` : "/identity"}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(201,168,76,0.4)",
                background: "transparent",
                color: "#C9A84C",
                textDecoration: "none",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {nextSlug ? "Next Piece →" : "← Identity"}
            </Link>
          )}
        </div>

      </div>

    </div>
    </>
  );
}
