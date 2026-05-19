import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { useFormationProfile } from "./hooks/useFormationProfile";
import NextStep from "./components/NextStep";
import { getFieldGuidePath, getFieldGuideDay, getFieldGuideLanding } from "./content/loader";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const BASE = "/field-guide/scripture-before-scroll";

const C = {
  bg: "#06050A",
  bgSurf: "#0E0C0A",
  bgCard: "#17140F",
  bgCard2: "#1C1914",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.12)",
  goldMid: "rgba(201,168,76,0.30)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.58)",
  dim: "rgba(250,248,245,0.24)",
  border: "rgba(255,255,255,0.08)",
  shadow: "0 24px 80px rgba(0,0,0,0.34)",
};


const { why: WHY, newSections: NEW_SECTIONS } = getFieldGuideLanding();

/* ─── INJECTED STYLES ─────────────────────────────────────────────── */

const FG_CSS = `
  .fg-shell {
    position: relative;
    min-height: 100vh;
    background:
      radial-gradient(circle at 50% 12%, rgba(201,168,76,0.12) 0%, transparent 28%),
      radial-gradient(circle at 20% 22%, rgba(80,72,52,0.10) 0%, transparent 26%),
      linear-gradient(to bottom, #06050A 0%, #0A090C 46%, #06050A 100%);
    color: #FAF8F5;
    overflow: hidden;
  }
  .fg-shell::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 12%, transparent 88%, rgba(255,255,255,0.02)),
      radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 24%);
    pointer-events: none;
  }
  .fg-gridlines {
    position: absolute;
    inset: 0;
    opacity: 0.045;
    pointer-events: none;
    background-image:
      linear-gradient(to right, transparent 0%, transparent 15%, rgba(255,255,255,0.65) 15.1%, transparent 15.2%, transparent 84.8%, rgba(255,255,255,0.65) 84.9%, transparent 85%, transparent 100%);
  }

  .fg-wrap {
    position: relative;
    z-index: 2;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px 92px;
  }

  .fg-narrow { max-width: 610px; }
  .fg-fade-up { animation: fgFadeUp .72s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-1 { animation: fgFadeUp .72s .08s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-2 { animation: fgFadeUp .72s .16s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-3 { animation: fgFadeUp .72s .24s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-4 { animation: fgFadeUp .72s .32s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-5 { animation: fgFadeUp .72s .40s cubic-bezier(.16,1,.3,1) both; }

  @keyframes fgFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fg-reveal { opacity: 0; transform: translateY(20px); transition: opacity .65s ease, transform .65s cubic-bezier(.16,1,.3,1); }
  .fg-reveal.fg-visible { opacity: 1; transform: translateY(0); }

  .fg-hero-panel,
  .fg-panel,
  .fg-card,
  .fg-day-card,
  .fg-return-panel {
    background: linear-gradient(to bottom, rgba(28,25,20,0.92), rgba(18,16,12,0.95));
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 24px 80px rgba(0,0,0,0.30);
    position: relative;
    overflow: hidden;
  }
  .fg-hero-panel::before,
  .fg-panel::before,
  .fg-card::before,
  .fg-return-panel::before {
    content: "";
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.48), transparent);
  }

  .fg-hero-panel {
    border-radius: 32px;
    padding: 42px 28px;
  }

  .fg-btn-prim,
  .fg-btn-sec,
  .fg-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    border-radius: 999px;
    text-decoration: none;
    cursor: pointer;
    transition: all .24s ease;
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .fg-btn-prim {
    padding: 16px 28px;
    background: #C9A84C;
    color: #000;
    border: none;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: .22em;
  }
  .fg-btn-prim:hover { background: #FAF8F5; transform: translateY(-1px); }

  .fg-btn-sec {
    padding: 15px 28px;
    background: rgba(255,255,255,0.02);
    color: rgba(250,248,245,0.82);
    border: 1px solid rgba(255,255,255,0.10);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .22em;
  }
  .fg-btn-sec:hover { border-color: rgba(201,168,76,0.42); color: #C9A84C; transform: translateY(-1px); }

  .fg-btn-ghost {
    padding: 13px 22px;
    background: transparent;
    color: rgba(250,248,245,0.42);
    border: none;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .22em;
  }
  .fg-btn-ghost:hover { color: rgba(250,248,245,0.72); }


  .fg-brand-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px;
    text-decoration: none;
    transition: all .25s ease;
    background: rgba(255,255,255,0.02);
    cursor: pointer;
  }
  .fg-brand-btn:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.08); }

  .fg-gold-line {
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  }

  .fg-section-kicker {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: .45em;
    text-transform: uppercase;
    color: rgba(201,168,76,.95);
    font-weight: 700;
  }

  .fg-scripture-card {
    border-left: 2px solid #C9A84C;
    border-radius: 0 20px 20px 0;
    background: linear-gradient(to bottom, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
  }
  .fg-scripture-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(201,168,76,0.9), transparent);
  }

  .fg-card { border-radius: 24px; padding: 26px 24px; }
  .fg-panel { border-radius: 28px; padding: 28px 26px; }
  .fg-return-panel { border-radius: 28px; padding: 28px 24px; text-align: center; }

  .fg-day-card {
    width: 100%;
    border-radius: 18px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all .3s cubic-bezier(.16,1,.3,1);
    text-align: left;
  }
  .fg-day-card:hover { border-color: rgba(201,168,76,0.32); transform: translateX(4px); background: linear-gradient(to bottom, rgba(33,29,22,0.96), rgba(22,19,15,0.98)); }

  .fg-ritual-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .fg-progress {
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.04);
  }
  .fg-progress > span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, rgba(201,168,76,0.55), rgba(201,168,76,0.95));
    border-radius: 999px;
  }

  .fg-meta-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 900px) {
    .fg-wrap { padding: 0 48px 112px; }
    .fg-hero-panel { padding: 56px 48px; }
    .fg-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
      gap: 32px;
      align-items: end;
    }
    .fg-ritual-grid {
      grid-template-columns: 1.05fr .95fr;
      gap: 22px;
    }
    .fg-meta-grid { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 699px) {
    .fg-wrap { padding: 0 20px 80px; }
    .fg-hero-panel { border-radius: 24px; padding: 30px 20px; }
  }

  @media (min-width: 1280px) {
    .fg-wrap { padding: 0 64px 140px; }
    .fg-hero-panel { padding: 72px 64px; }
    .fg-meta-grid  { grid-template-columns: 1fr 1fr; gap: 20px; }
  }
`;

/* ─── HOOKS ───────────────────────────────────────────────────────── */

function useScrollReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fg-reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("fg-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

function useProgress(day) {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const completedDays = profile.fieldGuide.completedDays;

  useEffect(() => {
    if (!isLoaded) return;
    if (!completedDays.includes(day)) {
      const updatedDays = [...completedDays, day].sort((a, b) => a - b);
      const newDay = Math.min(Math.max(...updatedDays) + 1, 7);
      updateProfile({ fieldGuide: { completedDays: updatedDays, currentDay: newDay, lastVisit: new Date().toISOString() } });
    }
  }, [day, isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return completedDays;
}

/* ─── SHARED COMPONENTS ───────────────────────────────────────────── */

function FGLabel({ children, color = C.gold }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", color, fontWeight: 700, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function FGHeading({ children, style = {} }) {
  return (
    <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 56, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 0.92, color: C.ivory, margin: 0, ...style }}>
      {children}
    </h1>
  );
}

function GoldDivider({ mt = 32, mb = 32 }) {
  return <div className="fg-gold-line" style={{ margin: `${mt}px 0 ${mb}px` }} />;
}


function PageShell({ children }) {
  return (
    <div className="fg-shell">
      <div className="fg-gridlines" />
      {children}
    </div>
  );
}


function SectionIntro({ label, title, body, children }) {
  return (
    <div style={{ paddingTop: 52, paddingBottom: 36 }}>
      <div className="fg-fade-up"><FGLabel>{label}</FGLabel></div>
      <FGHeading style={{ marginBottom: 16 }}>
        <span className="fg-fade-up-1">{title}</span>
      </FGHeading>
      {body && (
        <p className="fg-fade-up-2 fg-narrow" style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
          {body}
        </p>
      )}
      {children}
    </div>
  );
}

/* ─── PAGE: LANDING ───────────────────────────────────────────────── */

export function FGLanding() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageShell>
      <div className="fg-wrap">
        <div className="fg-hero-panel" style={{ marginTop: 36 }}>
          <div className="fg-hero-grid">
            <div className="fg-narrow">
              <div className="fg-fade-up"><FGLabel>Field Guide · Scripture Before Scroll</FGLabel></div>
              <FGHeading style={{ marginBottom: 22 }}>
                <span className="fg-fade-up-1">Scripture<br /></span>
                <span className="fg-fade-up-2" style={{ color: C.gold }}>Before<br /></span>
                <span className="fg-fade-up-3">Scroll</span>
              </FGHeading>
              <p className="fg-fade-up-4" style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, maxWidth: 420, marginBottom: 28 }}>
                Before anything else. Begin here. This is not content to consume. It is a discipline to re-enter.
              </p>
              <div className="fg-fade-up-5" style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
                <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today&apos;s Office →</Link>
                <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
              </div>
            </div>

            <div className="fg-panel fg-fade-up-4" style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="fg-section-kicker" style={{ marginBottom: 14 }}>The Rhythm</div>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: C.ivory, margin: 0 }}>
                  Begin the day with stillness, scripture, reflection, and one concrete act of resistance against drift.
                </p>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.dim, marginBottom: 12 }}>
                  Also available
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
                  <Link className="fg-btn-sec" to={`${BASE}/new`}>New Here?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GoldDivider mt={34} mb={34} />

        {/* Fruit of the Spirit Assessment tile — visible on landing */}
        <div className="fg-reveal" style={{ marginBottom: 28 }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.goldDim}`, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 0, position: "relative", overflow: "hidden" }}>
            {/* Subtle top gold line (matching fg-panel::before) */}
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.48), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold }}>
                Also in the Field Guide
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ivory, lineHeight: 1.15, marginBottom: 12 }}>
                    Fruit of the Spirit<br />Assessment
                  </div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
                    A 27-question diagnostic that reveals where the Spirit has the most room to work in you right now. Built for honest self-report, not self-idealization.
                  </p>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.dim, marginTop: 14 }}>
                    9 Fruits &middot; 27 Questions &middot; ~6 Min
                  </div>
                </div>
                <Link className="fg-btn-sec" to="/field-guide/fruit-assessment" style={{ flexShrink: 0, minWidth: 200 }}>
                  Begin Assessment &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Spiritual Gifts Assessment tile — visible on landing */}
        <div className="fg-reveal" style={{ marginBottom: 28 }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.goldDim}`, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 0, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.48), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold }}>
                The Second Anchor
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ivory, lineHeight: 1.15, marginBottom: 12 }}>
                    Spiritual Gifts<br />Assessment
                  </div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
                    Where the Spirit is at work through you to build up the body. Self-report, fruitfulness, and the witness of those who know you well, woven into a single picture.
                  </p>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.dim, marginTop: 14 }}>
                    19 Gifts &middot; 72 Questions &middot; ~12-15 Min
                  </div>
                </div>
                <Link className="fg-btn-sec" to="/field-guide/gifts" style={{ flexShrink: 0, minWidth: 200 }}>
                  Begin Assessment &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        <GoldDivider mt={28} mb={28} />

        <div className="fg-meta-grid">
          <div className="fg-card fg-reveal">
            <div className="fg-section-kicker" style={{ marginBottom: 12 }}>How it works</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>
              Scan. Enter the office. Return tomorrow. Let repetition do what inspiration never can.
            </p>
          </div>
          <div className="fg-card fg-reveal">
            <div className="fg-section-kicker" style={{ marginBottom: 12 }}>Built for return</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>
              Save this page to your home screen, rescan from the garment, or carry the rhythm forward through the 7-day path.
            </p>
          </div>
        </div>

      </div>
    </PageShell>
  );
}

/* ─── PAGE: OFFICE ────────────────────────────────────────────────── */

export function FGOffice() {
  const { day: dayParam } = useParams();
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, [dayParam]);

  const dayNum = dayParam === "today" || !dayParam ? 1 : parseInt(dayParam, 10);
  const office = getFieldGuideDay(dayNum) || getFieldGuideDay(1);
  const next = getFieldGuideDay(dayNum + 1);
  const progress = useProgress(dayNum);
  const percent = Math.max((dayNum / getFieldGuidePath().length) * 100, 14);

  return (
    <PageShell>
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label={`Scripture Before Scroll · Day ${office.day}`}
          title={office.title}
          body="A short office for ordering your first attention before the day orders you."
        >
          <div className="fg-fade-up-3 fg-narrow" style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.dim }}>
              <span>Progress</span>
              <span>{office.day} / {getFieldGuidePath().length}</span>
            </div>
            <div className="fg-progress"><span style={{ width: `${percent}%` }} /></div>
          </div>
        </SectionIntro>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-ritual-grid">
            <div className="fg-card">
              <FGLabel>Stillness</FGLabel>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{office.stillness}</p>
            </div>

            <div className="fg-card">
              <FGLabel>Reflection</FGLabel>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{office.reflection}</p>
            </div>
          </div>
        </div>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-scripture-card">
            <FGLabel>Scripture</FGLabel>
            <p style={{ fontSize: 18, color: C.ivory, fontStyle: "italic", lineHeight: 1.9, marginBottom: 16 }}>
              &ldquo;{office.scripture}&rdquo;
            </p>
            <ScriptureRef reference={office.ref} text={office.scripture} />
          </div>
        </div>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-ritual-grid">
            <div className="fg-card">
              <FGLabel>Action</FGLabel>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Today</div>
              <p style={{ fontSize: 16, color: C.ivory, lineHeight: 1.82, margin: 0 }}>{office.action}</p>
            </div>

            <div className="fg-card">
              <FGLabel>Closing</FGLabel>
              <p style={{ fontSize: 18, color: C.ivory, fontStyle: "italic", lineHeight: 1.82, margin: 0 }}>{office.closing}</p>
            </div>
          </div>
        </div>

        <div className="fg-return-panel fg-reveal" style={{ marginTop: 30 }}>
          <div className="fg-section-kicker" style={{ marginBottom: 10 }}>Daily Rhythm</div>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 18px" }}>
            Return here tomorrow. This is how formation happens — not by intensity, but by repetition.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto 14px" }}>
            {next ? (
              <Link className="fg-btn-prim" to={`${BASE}/day/${next.day}`}>Day {next.day}: {next.title} →</Link>
            ) : (
              <Link className="fg-btn-prim" to={`${BASE}/path`}>Complete — View Full Path →</Link>
            )}
            <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
            <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 420, margin: "0 auto" }}>
            <button className="fg-btn-ghost" onClick={() => alert("Add the Field Guide to your home screen from your browser menu.")}>⊕ Save to Home Screen</button>
            <button className="fg-btn-ghost" onClick={() => navigator.share ? navigator.share({ title: "Scripture Before Scroll", text: "Discipline before distraction.", url: window.location.href }) : navigator.clipboard?.writeText(window.location.href)}>↗ Share This Rhythm</button>
          </div>

          <div style={{ marginTop: 16, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.30em", textTransform: "uppercase", color: C.dim }}>
            Completed days: {progress.length ? progress.join(" · ") : "1"}
          </div>
        </div>

        {!next && <NextStep context="field-guide-complete" />}

      </div>
    </PageShell>
  );
}

/* ─── PAGE: 7-DAY PATH ────────────────────────────────────────────── */

export function FGPath() {
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const progress = useProgress(1);

  return (
    <PageShell>
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label="Scripture Before Scroll"
          title={<>7-Day<br />Path</>}
          body="One practice per day. Flexible to enter. Structured enough to progress."
        />

        <div className="fg-panel fg-reveal" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="fg-section-kicker">Your progression</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.dim }}>
              {progress.length} complete
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>
            Start anywhere, but don’t stay random. Let the path teach your mornings how to return.
          </p>
        </div>

        <div className="fg-reveal" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {getFieldGuidePath().map(o => {
            const complete = progress.includes(o.day);
            return (
              <Link key={o.day} className="fg-day-card" to={`${BASE}/day/${o.day}`}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: complete ? "rgba(201,168,76,0.16)" : "rgba(201,168,76,0.08)", border: `1px solid ${complete ? "rgba(201,168,76,0.46)" : "rgba(201,168,76,0.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 800, color: C.gold }}>{o.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ivory, marginBottom: 4 }}>{o.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.dim }}>
                      <ScriptureRef reference={o.ref} text={o.scripture} />
                    </div>
                    {o.day === 1 && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold }}>Start here</span>}
                    {complete && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)" }}>Complete</span>}
                  </div>
                </div>
                <span style={{ color: C.gold, fontSize: 16, opacity: 0.65 }}>→</span>
              </Link>
            );
          })}
        </div>

        <div className="fg-reveal" style={{ maxWidth: 420 }}>
          <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today&apos;s Office →</Link>
        </div>

      </div>
    </PageShell>
  );
}

/* ─── PAGE: WHY ───────────────────────────────────────────────────── */

export function FGWhy() {
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageShell>
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label="The Foundation"
          title={<>Why This<br />Matters</>}
          body="Formation is not accidental. It is inevitable. The only question is what is doing the forming."
        />

        <div className="fg-meta-grid">
          {WHY.map((sec, i) => (
            <div key={i} className="fg-card fg-reveal">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 22, height: 1, backgroundColor: C.gold }} />
                <FGLabel>{sec.title}</FGLabel>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{sec.body}</p>
            </div>
          ))}
        </div>

        <GoldDivider mt={30} mb={30} />

        <div className="fg-reveal" style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today&apos;s Office →</Link>
          <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
        </div>

      </div>
    </PageShell>
  );
}

/* ─── PAGE: NEW HERE ──────────────────────────────────────────────── */

export function FGNewHere() {
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageShell>
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label="Orientation"
          title={<>New<br />Here?</>}
          body="Start here. This will take three minutes. Then the rest of the system makes sense."
        />

        <div className="fg-meta-grid">
          {NEW_SECTIONS.map((sec, i) => (
            <div key={i} className="fg-card fg-reveal">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
                <FGLabel>{sec.title}</FGLabel>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{sec.body}</p>
            </div>
          ))}
        </div>

        <GoldDivider mt={30} mb={28} />

        <div className="fg-panel fg-reveal" style={{ maxWidth: 520 }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "'Barlow Condensed',sans-serif", backgroundColor: C.goldDim, color: C.gold, marginBottom: 18 }}>
            Your Next Steps
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link className="fg-btn-prim" to={`${BASE}/today`}>Start Today&apos;s Office →</Link>
            <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
            <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
          </div>
        </div>

      </div>
    </PageShell>
  );
}

/* ─── STYLE INJECTOR ──────────────────────────────────────────────── */

export function FieldGuideStyles() {
  return <style>{FG_CSS}</style>;
}
