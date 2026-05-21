import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── SEO META (export for parent to apply via react-helmet or head) */

export const aboutMeta = {
  title: "About Counter Formation — Formed in Christ. Living Counter to Culture.",
  description:
    "Counter Formation equips Christians with theology, practices, and community to live intentionally formed lives in a world designed for drift. Content that teaches. Gear that identifies. Community that sustains.",
  canonical: "https://www.counterformed.com/about",
  og: {
    title: "About Counter Formation",
    description:
      "We exist to equip Christians with the theology, practices, and community structures needed to live intentionally formed lives in a world designed for drift.",
    type: "website",
    image: "/og-about.jpg",
  },
};

/* ─── STYLES ──────────────────────────────────────────────────────── */

export function AboutStyles() {
  return (
    <style>{`
      /* ── Width system (matches site-wide custom properties) ── */
      .about-stage   { max-width: 100%; margin: 0 auto; padding: 0 1.5rem; }
      .about-content { max-width: 100%; margin: 0 auto; padding: 0 1.5rem; }
      .about-reading { max-width: 100%; margin: 0 auto; padding: 0 1.5rem; }
      @media (min-width: 1024px) {
        .about-stage   { max-width: var(--cf-width-stage, 1320px); }
        .about-content { max-width: var(--cf-width-content, 1100px); }
        .about-reading { max-width: var(--cf-width-reading, 740px); }
      }

      /* ── Hero ── */
      .about-hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 6rem 1.5rem 4rem;
        background: var(--cf-hero-bg);
        overflow: hidden;
      }
      .about-hero::after {
        content: "";
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 30%;
        background: linear-gradient(to top, "var(--cf-obsidian)", transparent);
        pointer-events: none;
      }
      .about-hero-glow {
        position: absolute;
        top: 50%; left: 50%;
        width: 600px; height: 600px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
        pointer-events: none;
      }

      /* ── Eyebrow ── */
      .about-eyebrow {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.38em;
        text-transform: uppercase;
        color: var(--cf-gold);
        margin-bottom: 1.5rem;
      }

      /* ── Hero headline ── */
      .about-hero-headline {
        font-family: var(--cf-font-devotional);
        font-style: italic;
        font-weight: 400;
        font-size: clamp(1.6rem, 4.2vw, 3.2rem);
        line-height: 1.35;
        color: var(--cf-ivory);
        max-width: 780px;
        margin: 0 auto 2rem;
      }

      /* ── Scripture block ── */
      .about-scripture {
        font-family: var(--cf-font-devotional);
        font-style: italic;
        font-size: clamp(0.9rem, 1.8vw, 1.1rem);
        color: rgba(250,248,245,0.45);
        max-width: 520px;
        margin: 0 auto;
        line-height: 1.6;
      }
      .about-scripture-ref {
        display: block;
        margin-top: 0.5rem;
        font-family: 'Barlow Condensed', sans-serif;
        font-style: normal;
        font-size: 9px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: var(--cf-gold);
        opacity: 0.6;
      }

      /* ── Section spacing ── */
      .about-section {
        padding: 5rem 0;
      }
      @media (min-width: 768px) {
        .about-section { padding: 7rem 0; }
      }

      /* ── Section headlines ── */
      .about-section-eyebrow {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.38em;
        text-transform: uppercase;
        color: var(--cf-gold);
        margin-bottom: 1.25rem;
      }
      .about-section-headline {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: clamp(1.5rem, 3.5vw, 2.4rem);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--cf-ivory);
        line-height: 1.15;
        margin-bottom: 2rem;
      }

      /* ── Prose ── */
      .about-prose {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 400;
        font-size: clamp(1rem, 1.6vw, 1.125rem);
        line-height: 1.75;
        color: rgba(250,248,245,0.78);
      }
      .about-prose p { margin-bottom: 1.5rem; }
      .about-prose p:last-child { margin-bottom: 0; }
      .about-prose strong {
        color: var(--cf-ivory);
        font-weight: 700;
      }

      /* ── Pullquote ── */
      .about-pullquote {
        font-family: var(--cf-font-devotional);
        font-style: italic;
        font-size: clamp(1.25rem, 2.8vw, 1.75rem);
        line-height: 1.5;
        color: var(--cf-ivory);
        border-left: 2px solid var(--cf-gold);
        padding-left: 1.5rem;
        margin: 3rem 0;
        max-width: 640px;
      }

      /* ── Gold rule ── */
      .about-gold-rule {
        width: 60px;
        height: 1px;
        background: var(--cf-gold);
        opacity: 0.4;
        margin: 3rem 0;
      }

      /* ── Pillar cards ── */
      .about-pillars {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        margin-top: 3rem;
      }
      @media (min-width: 768px) {
        .about-pillars { grid-template-columns: repeat(3, 1fr); gap: 2.5rem; }
      }
      .about-pillar-card {
        border: 1px solid rgba(255,255,255,0.06);
        border-radius: 12px;
        padding: 2rem 1.75rem;
        background: rgba(255,255,255,0.02);
        transition: border-color 0.4s, background 0.4s;
      }
      .about-pillar-card:hover {
        border-color: rgba(201,168,76,0.25);
        background: rgba(201,168,76,0.03);
      }
      .about-pillar-num {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.38em;
        text-transform: uppercase;
        color: var(--cf-gold);
        margin-bottom: 0.75rem;
      }
      .about-pillar-title {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 1.25rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--cf-ivory);
        margin-bottom: 1rem;
      }
      .about-pillar-body {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 400;
        font-size: 0.95rem;
        line-height: 1.7;
        color: rgba(250,248,245,0.65);
      }
      .about-pillar-scripture {
        font-family: var(--cf-font-devotional);
        font-style: italic;
        font-size: 0.85rem;
        color: rgba(201,168,76,0.5);
        margin-top: 1.25rem;
      }

      /* ── Pipeline / How It Works ── */
      .about-pipeline {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0;
        margin-top: 2.5rem;
        counter-reset: pipeline;
      }
      @media (min-width: 768px) {
        .about-pipeline { grid-template-columns: repeat(3, 1fr); gap: 0; }
      }
      .about-pipeline-step {
        position: relative;
        padding: 2rem 1.5rem;
        border: 1px solid rgba(255,255,255,0.04);
        counter-increment: pipeline;
      }
      @media (min-width: 768px) {
        .about-pipeline-step { border-right: none; }
        .about-pipeline-step:last-child { border-right: 1px solid rgba(255,255,255,0.04); }
      }
      .about-pipeline-step::before {
        content: "0" counter(pipeline);
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.32em;
        color: var(--cf-gold);
        opacity: 0.6;
        display: block;
        margin-bottom: 0.75rem;
      }
      .about-pipeline-title {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--cf-ivory);
        margin-bottom: 0.75rem;
      }
      .about-pipeline-body {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 400;
        font-size: 0.9rem;
        line-height: 1.65;
        color: rgba(250,248,245,0.55);
      }

      /* ── Founder section ── */
      .about-founder-bg {
        background: var(--cf-rule-bg);
        border-top: 1px solid rgba(255,255,255,0.04);
        border-bottom: 1px solid rgba(255,255,255,0.04);
      }

      /* ── CTA section ── */
      .about-cta-section {
        text-align: center;
        padding: 6rem 1.5rem;
        background: var(--cf-hero-bg);
      }
      .about-cta-headline {
        font-family: var(--cf-font-devotional);
        font-style: italic;
        font-size: clamp(1.3rem, 3vw, 2rem);
        color: var(--cf-ivory);
        max-width: 600px;
        margin: 0 auto 2.5rem;
        line-height: 1.45;
      }
      .about-cta-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }
      @media (min-width: 480px) {
        .about-cta-buttons { flex-direction: row; justify-content: center; }
      }

      /* ── Buttons ── */
      .about-btn-gold {
        display: inline-flex; align-items: center; gap: 0.5rem;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700; font-size: 11px;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--cf-hero-bg);
        background: var(--cf-gold);
        padding: 14px 32px;
        border-radius: 6px;
        text-decoration: none;
        transition: background 0.3s, transform 0.3s;
      }
      .about-btn-gold:hover { background: #d4b35a; transform: translateY(-1px); }
      .about-btn-outline {
        display: inline-flex; align-items: center; gap: 0.5rem;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700; font-size: 11px;
        letter-spacing: 0.18em; text-transform: uppercase;
        color: var(--cf-ivory);
        background: transparent;
        border: 1px solid rgba(250,248,245,0.2);
        padding: 14px 32px;
        border-radius: 6px;
        text-decoration: none;
        transition: border-color 0.3s, transform 0.3s;
      }
      .about-btn-outline:hover { border-color: var(--cf-gold); transform: translateY(-1px); }

      /* ── Footer mark ── */
      .about-footer-mark {
        text-align: center;
        padding: 2rem 0 0;
      }
      .about-footer-mark img {
        width: 24px; height: 24px;
        opacity: 0.12;
        filter: invert(1);
        display: block;
        margin: 0 auto 0.75rem;
      }
      .about-footer-tagline {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 8px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.18);
      }

      /* ── Expand / collapse ── */
      .about-full-story {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.6s ease;
        opacity: 0;
      }
      .about-full-story.is-open {
        max-height: 4000px;
        opacity: 1;
      }
      .about-expand-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: var(--cf-gold);
        background: none;
        border: 1px solid rgba(201,168,76,0.25);
        padding: 12px 24px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 2rem;
        transition: border-color 0.3s, background 0.3s;
      }
      .about-expand-btn:hover {
        border-color: var(--cf-gold);
        background: rgba(201,168,76,0.06);
      }
      .about-expand-arrow {
        display: inline-block;
        transition: transform 0.4s ease;
        font-size: 14px;
        line-height: 1;
      }
      .about-expand-arrow.is-open {
        transform: rotate(180deg);
      }

      /* ── Reveal animations ── */
      .about-reveal {
        opacity: 0;
        transform: translateY(20px);
      }
    `}</style>
  );
}

/* ─── DIVIDER (matches site-wide SectionDivider) ──────────────────── */

function Divider() {
  return (
    <div className="flex items-center justify-center py-6 px-4" style={{ background: "var(--cf-obsidian)" }}>
      <div className="flex-1 h-[1px] bg-white/5" />
      <div className="mx-4 md:mx-8 opacity-[0.12]">
        <img src="/helmet.png" className="w-6 h-6 md:w-8 md:h-8 grayscale invert" alt="" loading="lazy" />
      </div>
      <div className="flex-1 h-[1px] bg-white/5" />
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  const pageRef = useRef(null);
  const [storyOpen, setStoryOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  /* GSAP scroll reveals */
  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".about-reveal").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <article ref={pageRef} style={{ backgroundColor: "var(--cf-obsidian)", color: "var(--cf-ivory)", minHeight: "100vh" }}>
      <AboutStyles />

      {/* ─── SECTION 1 — CINEMATIC HERO ─────────────────────────── */}
      <header className="about-hero" aria-label="About Counter Formation">
        <div className="about-hero-glow" />
        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="about-eyebrow about-reveal">About Counter Formation</p>
          <h1 className="about-hero-headline about-reveal">
            The world is an extraordinarily effective formation system.
            It does not need your permission. It just needs your attention.
          </h1>
          <div className="about-scripture about-reveal">
            <span>
              "Do not be conformed to this world, but be transformed
              by the renewal of your mind."
            </span>
            <span className="about-scripture-ref">Romans 12:2</span>
          </div>
        </div>
      </header>


      {/* ─── SECTION 2 — THE PROBLEM ────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--cf-obsidian)" }} aria-labelledby="about-problem">
        <div className="about-reading">
          <p className="about-section-eyebrow about-reveal">The Problem</p>
          <h2 id="about-problem" className="about-section-headline about-reveal">
            You are being formed whether you chose it or not.
          </h2>
          <div className="about-prose about-reveal">
            <p>
              Every scroll shapes desire. Every notification trains attention.
              Every curated feed is forming your imagination,
              your values, and your sense of what a good life looks like.
              None of this requires your consent. The modern world does not
              announce itself as a formation system; it just runs on you
              like software you never installed.
            </p>
            <p>
              The result is a generation of people who feel perpetually tired,
              perpetually distracted, and vaguely disoriented in their own
              lives. Productivity is the metric. Visibility is the currency.
              Identity is whatever the last performance review, comment
              section, or follower count says it is.
            </p>
            <p>
              The church has largely failed to offer an equally compelling
              counter-formation. Sunday services provide information, but
              rarely transformation. Small groups provide connection, but
              rarely accountability. Discipleship programs provide curriculum,
              but rarely rhythms that restructure daily life. The result is
              a generation of Christians who believe the right things but
              live indistinguishably from the culture around them.
            </p>
          </div>
          <div className="about-pullquote about-reveal">
            Most people do not realize they are being formed.
            They simply feel tired, distracted, and vaguely
            disoriented in their own lives.
          </div>
        </div>
      </section>

      <Divider />


      {/* ─── SECTION 3 — THE MISSION ────────────────────────────── */}
      <section className="about-section" style={{ background: "var(--cf-obsidian)" }} aria-labelledby="about-mission">
        <div className="about-content">
          <div className="about-reading" style={{ padding: 0 }}>
            <p className="about-section-eyebrow about-reveal">The Mission</p>
            <h2 id="about-mission" className="about-section-headline about-reveal">
              Intentional formation in a world designed for drift.
            </h2>
            <div className="about-prose about-reveal">
              <p>
                Counter Formation exists to equip Christians with the
                theology, practices, and community structures needed to
                live intentionally formed lives. We do this through three
                integrated channels: content that teaches, gear that
                identifies, and community rhythms that sustain.
              </p>
              <p>
                This is not a withdrawal from the world. It is a deliberate
                reordering of life around the presence and authority of
                Christ in a world designed to form people otherwise. To be
                present. To be grounded. To be light.
              </p>
            </div>
          </div>

          {/* Three Pillars */}
          <div className="about-pillars">
            <div className="about-pillar-card about-reveal">
              <p className="about-pillar-num">Pillar I</p>
              <h3 className="about-pillar-title">Identity</h3>
              <p className="about-pillar-body">
                The modern world measures you by what you produce, how you
                appear, and how many people are watching. Counter Formation
                begins by refusing that metric entirely and anchoring
                identity in Christ before anything else gets to name you.
              </p>
              <p className="about-pillar-scripture">1 John 3:1</p>
            </div>
            <div className="about-pillar-card about-reveal">
              <p className="about-pillar-num">Pillar II</p>
              <h3 className="about-pillar-title">Practice</h3>
              <p className="about-pillar-body">
                Intention without rhythm is wishful thinking. You do not
                drift into a formed life; you build one. Scripture before
                screen. Silence before noise. Sabbath before production.
                The practices are the conditions under which formation
                becomes possible.
              </p>
              <p className="about-pillar-scripture">1 Timothy 4:7-8</p>
            </div>
            <div className="about-pillar-card about-reveal">
              <p className="about-pillar-num">Pillar III</p>
              <h3 className="about-pillar-title">Community</h3>
              <p className="about-pillar-body">
                You cannot become like Christ alone. Jesus did not form his
                disciples through content; he lived with them. Proximity
                over time, through honesty and failure and shared rhythm,
                is the environment in which transformation actually happens.
              </p>
              <p className="about-pillar-scripture">Acts 2:42</p>
            </div>
          </div>
        </div>
      </section>


      {/* ─── SECTION 4 — THE ECOSYSTEM ──────────────────────────── */}
      <section className="about-section" style={{ background: "var(--cf-rule-bg)" }} aria-labelledby="about-ecosystem">
        <div className="about-content">
          <div className="about-reading" style={{ padding: 0 }}>
            <p className="about-section-eyebrow about-reveal">The Ecosystem</p>
            <h2 id="about-ecosystem" className="about-section-headline about-reveal">
              The gear is not the mission. It's a marker of it.
            </h2>
            <div className="about-prose about-reveal">
              <p>
                Most faith-based apparel brands start with a shirt and try
                to add meaning later. Counter Formation started with the
                meaning, and the shirt is the most visible layer of
                something much deeper.
              </p>
              <p>
                Every piece of gear includes a QR touchpoint that connects
                to a structured formation experience: scripture, teaching,
                daily practices, and reflection. The garment is a physical
                reminder in a world of invisible forces. When you put it on,
                you are making a choice. The QR code connects that physical
                moment to a digital practice, turning a piece of clothing
                into a daily ritual entry point.
              </p>
            </div>
          </div>

          {/* Pipeline steps */}
          <div className="about-pipeline about-reveal">
            <div className="about-pipeline-step">
              <h3 className="about-pipeline-title">The Gear</h3>
              <p className="about-pipeline-body">
                Premium apparel designed with intention. Each piece carries
                a formation marker and a QR touchpoint that connects to
                the content ecosystem.
              </p>
            </div>
            <div className="about-pipeline-step">
              <h3 className="about-pipeline-title">The Content</h3>
              <p className="about-pipeline-body">
                Scripture-grounded formation tracks, daily practices, the
                Rule of Life, and the Field Guide. Theology with depth,
                delivered with clarity, built for daily rhythm.
              </p>
            </div>
            <div className="about-pipeline-step">
              <h3 className="about-pipeline-title">The Community</h3>
              <p className="about-pipeline-body">
                Shared rhythms. Honest accountability. A distributed
                network of believers building a formed life together,
                not in isolation.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* ─── SECTION 5 — THE FIVE RHYTHMS ───────────────────────── */}
      <section className="about-section" style={{ background: "var(--cf-obsidian)" }} aria-labelledby="about-rhythms">
        <div className="about-reading">
          <p className="about-section-eyebrow about-reveal">The Rule of Life</p>
          <h2 id="about-rhythms" className="about-section-headline about-reveal">
            Five rhythms for a formed life.
          </h2>
          <div className="about-prose about-reveal">
            <p>
              Beneath the three pillars, Counter Formation organizes its
              practical formation content around five rhythms drawn from
              the historic Christian tradition of a Rule of Life. These
              are not aspirational ideals; they are daily, weekly, and
              seasonal structures designed to reorder attention and desire
              around Christ.
            </p>
          </div>
          <div style={{ marginTop: "2rem" }} className="about-reveal">
            {[
              { name: "Presence",   line: "Attention before God",     ref: "Psalm 46:10",           slug: "presence" },
              { name: "Scripture",  line: "Truth before noise",       ref: "Psalm 119:105",         slug: "scripture" },
              { name: "Prayer",     line: "Dependence before action", ref: "1 Thessalonians 5:17",  slug: "prayer" },
              { name: "Sabbath",    line: "Rest before production",   ref: "Exodus 20:8-11",        slug: "sabbath" },
              { name: "Community",  line: "Formation together",       ref: "Hebrews 10:24-25",      slug: "community" },
            ].map((r, i) => (
              <Link
                key={r.slug}
                to={`/rule-of-life/${r.slug}`}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  textDecoration: "none",
                  transition: "opacity 0.3s",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "9px", fontWeight: 700,
                  letterSpacing: "0.32em",
                  color: "var(--cf-gold)", opacity: 0.5,
                  minWidth: "28px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: "1.05rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--cf-ivory)", flex: 1,
                }}>
                  {r.name}
                </span>
                <span className="hidden md:inline" style={{
                  fontFamily: "var(--cf-font-devotional)",
                  fontStyle: "italic", fontSize: "0.9rem",
                  color: "rgba(250,248,245,0.4)",
                }}>
                  {r.line}
                </span>
                <span style={{
                  fontFamily: "var(--cf-font-devotional)",
                  fontStyle: "italic", fontSize: "0.8rem",
                  color: "rgba(201,168,76,0.35)",
                  whiteSpace: "nowrap",
                }}>
                  {r.ref}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Divider />


      {/* ─── SECTION 6 — THE FOUNDER ────────────────────────────── */}
      <section className="about-section about-founder-bg" aria-labelledby="about-founder">
        <div className="about-reading">
          <p className="about-section-eyebrow about-reveal">The Founder</p>
          <h2 id="about-founder" className="about-section-headline about-reveal">
            Why we built this.
          </h2>

          {/* ── Lead: the conviction (always visible) ── */}
          <div className="about-prose about-reveal">
            <p>
              So we built Counter Formation. Not as a Christian apparel
              company, but as a family discipline. The gear is real and we
              are proud of it, but it was never the point. The point is the
              life you build around it: scripture before the screen,
              discipline around sabbath to help claim your identity,
              community to combat isolation. The freedom that comes from
              intentional formation is something my wife and I had to fight
              to find, and once we found it, we could not keep it to
              ourselves.
            </p>
            <p>
              I am building this for the person who is tired of shallow
              faith content and knows they are being formed by something
              they did not choose. For the parent trying to give their kids
              a foundation deeper than what the culture offers. For the
              couple in survival mode who senses there has to be more than
              this. For anyone who wants to go deeper than a Sunday service
              but does not know where to start.
            </p>
            <p>
              That person is who I was. Counter Formation is what I wish
              someone had handed me.
            </p>
          </div>

          {/* ── Expand trigger ── */}
          <div className="about-reveal">
            <button
              className="about-expand-btn"
              onClick={() => setStoryOpen(prev => !prev)}
              aria-expanded={storyOpen}
              aria-controls="founder-full-story"
            >
              {storyOpen ? "Close the story" : "Read the full story"}
              <span className={`about-expand-arrow${storyOpen ? " is-open" : ""}`}>&#9662;</span>
            </button>
          </div>

          {/* ── Full backstory (expandable) ── */}
          <div
            id="founder-full-story"
            className={`about-full-story${storyOpen ? " is-open" : ""}`}
          >
            <div className="about-prose" style={{ paddingTop: "2.5rem" }}>
              <p>
                I spent over fifteen years as a management consultant in the
                first part of my career, traveling to client sites every week,
                rising through the promotion cycles, and building what I told
                myself was the ideal life for my wife and our kids. The metrics
                I chased at work became the metrics I used to measure my own
                worth. The pace I maintained professionally began to dwarf the
                focus and emphasis I put on my own spiritual growth. I was
                producing, performing, and drifting -- while calling it
                faithfulness because I still showed up on Sundays.
              </p>
              <p>
                I grew up in a family with deep roots in faith. My
                great-grandfather planted a church in San Antonio in the early
                1900s. My father went to seminary and was a pastor for the
                first eight years of my life. I accepted Christ at seven. I
                knew the theology. What I did not have was a structure for
                becoming the kind of person that theology described. I had
                information without formation. I had the conviction and
                re-orientation that can come from staying somewhat plugged
                into a church body, but I was not acting as an apprentice to
                him. And for over a decade, I did not realize the gap existed
                because the world's formation system was running on me so
                effectively that I mistook its output for my own choices.
              </p>
              <p>
                The cost of that gap showed up in the places that mattered
                most. My wife was home raising three kids while I was on the
                road. I barely made it home for our youngest daughter's birth,
                catching a delayed flight out of LA that got me to the
                hospital thirty minutes before she arrived. When our son had
                a breathing emergency from asthma, my wife rushed him to the
                ER alone because I was in another state working. My mother's
                years-long fight with cancer and her passing sent me into a
                numbness I carried for years. We were a weekend family running
                on fumes, and we both knew it was not what God had called us to.
              </p>
              <p>
                The breaking point came quietly, not dramatically. My wife and
                I were near the end of our relationship and were struggling to
                find a path forward. We began praying fiercely for direction,
                and then God moved in a way we could not ignore. A new remote
                role opened up through a colleague that I almost dismissed.
                The offer came back as a simple lateral move in my career,
                removing every excuse I had constructed to stay on the path I
                was on. At the same time, my wife had received a promise in
                prayer that God would make the coming season a year of
                restoration -- in our marriage, in our family, in our lives
                -- if we would walk through the chaos in faith. In obedience,
                I chose to walk away from the path to partnership I had spent
                my entire career building toward. Unknown to me ... within
                months, the practice I left was gutted and reorganized beyond
                recognition. God's hand was not subtle.
              </p>
              <p>
                That restoration changed everything. We started reading
                everything we could get our hands on around restoration and
                formation (Dallas Willard, John Mark Comer, NT Wright, Tyler
                Staton, and others), and we began to understand that the
                Christian life we had been living was almost entirely
                informational. Over the years that followed, I was invited and
                called to be an elder in my church, my wife was invited into
                leadership at Bible Study Fellowship, we became adult small
                group leaders, and college and young adult ministry leaders at
                our church. Through all of this we saw the same gap
                everywhere: people who believed the right things, had most of
                the right head knowledge, but lacked "heart knowledge" and had
                little to no daily rhythms to form them into the people those
                beliefs described. We watched college students and young adults
                drifting, not because they lacked faith, but because nobody
                had given them a structure to live it out or challenged them
                to change their heart posture.
              </p>
              <p>
                Those same conversations started happening around our own
                dinner table. Our son and two daughters were growing up inside
                the same formation pressure we were learning to name: screens
                competing for first attention, content shaping desire, a
                culture that measures worth by visibility and output. I wanted
                to build something with them, not just for them. They are not
                just the reason Counter Formation exists; they are helping to
                build it. They are learning the tools: design, marketing,
                social media, product development, the mechanics of running a
                business with purpose. The work itself is formative. When your
                kids learn to create content grounded in Scripture, or think
                through how a product should represent something true, or
                wrestle with how to communicate conviction without performing
                it, that process shapes them. Counter Formation is as much an
                apprenticeship for our family as it is a brand for the world.
                The intent from the beginning has been that this experience
                molds them, teaches them, and gives them ownership of
                something that reflects the kind of parallel life God has
                called us to live -- present in the world, but formed by
                something other than the world and culture.
              </p>
              <p>
                When we looked across the market of Christian resources and
                apparel, we noticed that the content and resource brands had
                no real apparel or physical expression. The apparel brands had
                no theological depth. We saw an opportunity in connecting the
                two in a way that was meaningful and inspired a movement and
                community centered on formation.
              </p>
            </div>
          </div>

          <div className="about-gold-rule about-reveal" />

          <p className="about-reveal" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700, fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(250,248,245,0.4)",
          }}>
            — The Counter Formation Family
          </p>
        </div>
      </section>


      {/* ─── SECTION 7 — CTA ────────────────────────────────────── */}
      <section className="about-cta-section" aria-label="Call to action">
        <div className="about-reveal">
          <p className="about-section-eyebrow" style={{ textAlign: "center" }}>
            The Invitation
          </p>
          <p className="about-cta-headline">
            Formation is not accidental. It requires structure,
            discipline, and a community willing to build it together.
          </p>
          <div className="about-cta-buttons">
            <Link to="/7-day-challenge" className="about-btn-gold">
              Begin the 7-Day Challenge
              <ArrowRight size={14} />
            </Link>
            <a
              href="https://shop.counterformed.com/collections/the-gear"
              target="_blank"
              rel="noopener noreferrer"
              className="about-btn-outline"
            >
              Explore the Gear
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Scripture close */}
        <div className="about-reveal" style={{ marginTop: "4rem" }}>
          <p style={{
            fontFamily: "var(--cf-font-devotional)",
            fontStyle: "italic",
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
            color: "rgba(250,248,245,0.3)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            "Be strong in the Lord and in his mighty power. Put on the
            full armor of God, so that you can take your stand."
          </p>
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "var(--cf-gold)", opacity: 0.4,
            marginTop: "0.5rem",
          }}>
            Ephesians 6:10-11
          </p>
        </div>

        {/* Footer mark */}
        <div className="about-footer-mark about-reveal">
          <img src="/helmet.png" alt="" loading="lazy" style={{ filter: "invert(1) grayscale(1)" }} />
          <p className="about-footer-tagline">Discipline · Presence · Formation</p>
        </div>
      </section>
    </article>
  );
}
