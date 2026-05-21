import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { useFormationProfile } from "./hooks/useFormationProfile";
import NextStep from "./components/NextStep";
import { getChallengeDays, getChallengeDayMeta } from "./content/loader";
import Button from "./components/primitives/Button";
import "./styles/challenge.css";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

export const CHALLENGE_BASE = "/7-day-challenge";

/* ─── DATA ────────────────────────────────────────────────────────── */

const CHALLENGE_DAYS = getChallengeDays();
const CHALLENGE_DAY_META = getChallengeDayMeta();



/* ─── STORAGE HELPERS ─────────────────────────────────────────────── */

// Converts the profile's completedDays number[] into the legacy Record<string,1>
// shape that the pure-logic helpers below expect. No localStorage reads occur here.
function daysToProgressMap(completedDays) {
  const map = {};
  completedDays.forEach((n) => { map[n] = 1; });
  return map;
}

function getCompletionCount(progress) {
  return CHALLENGE_DAYS.reduce((acc, day) => acc + (progress[day.n] ? 1 : 0), 0);
}
function isUnlocked(n, progress) {
  if (n === 1) return true;
  return !!progress[n - 1];
}
function getCurrentDay(progress) {
  return CHALLENGE_DAYS.find((day) => !progress[day.n])?.n || CHALLENGE_DAYS[CHALLENGE_DAYS.length - 1].n;
}
function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, "");
}
function renderRichText(text, key) {
  return <p key={key} dangerouslySetInnerHTML={{ __html: text }} />;
}
function getCardState(n, progress) {
  const done = !!progress[n];
  const unlocked = isUnlocked(n, progress);
  const current = !done && unlocked && getCurrentDay(progress) === n;
  return { done, unlocked, current };
}

/* ─── CORNER NAV (shared across all challenge pages) ─────────────── */

function CornerNav() {
  return (
    <>
      <img
        src="/shield-white.png"
        className="cf7-shield-mark"
        onError={e => { e.target.style.display = "none"; }}
        alt=""
        role="presentation"
      />
    </>
  );
}

/* ─── TRACKER (shared) ───────────────────────────────────────────── */

function Tracker({ activeDayN, progress }) {
  const p = progress || {};
  const currentDay = getCurrentDay(p);

  return (
    <div className="cf7-tracker">
      {CHALLENGE_DAYS.map((d) => {
        const done = !!p[d.n];
        const unlocked = isUnlocked(d.n, p);
        const cur = (activeDayN ? d.n === activeDayN : d.n === currentDay) && !done;
        return (
          <Link
            key={d.n}
            to={unlocked ? `${CHALLENGE_BASE}/day/${d.n}` : CHALLENGE_BASE}
            className={`cf7-tdot${done ? " done" : cur ? " cur" : ""}${!unlocked ? " locked" : ""}`}
            style={{ textDecoration: "none" }}
            aria-disabled={!unlocked}
          >
            <div className="cf7-dot-circle">
              {done ? "✓" : !unlocked ? "•" : d.n}
            </div>
            <span className="cf7-dot-label">{done ? "Done" : !unlocked ? "Locked" : `D${d.n}`}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── LANDING PAGE ────────────────────────────────────────────────── */

export function CFLanding() {
  const { profile, isLoaded } = useFormationProfile();
  const vbRef = useRef(null);
  const blRef = useRef(null);
  const markRef = useRef(null);
  const contRef = useRef(null);
  const shRef = useRef(null);
  const progRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(
    () => daysToProgressMap(isLoaded ? profile.challenge.completedDays : []),
    [profile.challenge.completedDays, isLoaded]
  );

  const currentDay = useMemo(() => getCurrentDay(progress), [progress]);
  const completionCount = useMemo(() => getCompletionCount(progress), [progress]);

  useEffect(() => {
    const vb = vbRef.current, bl = blRef.current,
      mk = markRef.current, co = contRef.current, sh = shRef.current;
    setTimeout(() => { if (vb) { vb.style.opacity = "1"; vb.style.height = "78svh"; } }, 300);
    setTimeout(() => { if (bl) bl.style.opacity = "1"; }, 500);
    setTimeout(() => { if (mk) { mk.style.opacity = "1"; mk.style.transform = "none"; } }, 950);
    setTimeout(() => { if (co) { co.style.opacity = "1"; co.style.transform = "none"; } }, 1350);
    setTimeout(() => { if (sh) sh.style.opacity = "1"; }, 2700);
    setTimeout(() => {
      if (vb) {
        vb.style.transition = "opacity 2.5s ease";
        vb.style.opacity = "0";
      }
    }, 4300);

    const pc = document.getElementById("cf7-particles");
    if (pc && !pc.childElementCount) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "cf7-particle";
        const s = Math.random() * 1.6 + 0.4;
        p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:${Math.random()*45}%;animation-duration:${10+Math.random()*12}s;animation-delay:${Math.random()*14}s;`;
        pc.appendChild(p);
      }
    }

    const onScroll = () => {
      const d = document.documentElement;
      if (progRef.current) {
        progRef.current.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + "%";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "7day_challenge" }),
    }).catch(() => {});
  };

  return (
    <div className="cf7-wrap">
      <CornerNav />
      <div className="cf7-prog-bar"><div className="cf7-prog-fill" ref={progRef} /></div>

      <section className="cf7-hero">
        <div className="cf7-hero-bg" />
        <div className="cf7-vbeam" ref={vbRef} />
        <div className="cf7-bloom" ref={blRef} />
        <div id="cf7-particles" />
        <div className="cf7-hero-content" ref={contRef}>
          <span className="cf7-entry-label">Counter Formation · The Entry Point</span>
          <h1 className="cf7-h1">7-Day<br />Formation<br />Challenge</h1>
          <p className="cf7-italic">You are already being formed.</p>
          <p className="cf7-sub">Interrupt the drift. Reorder your attention. Build a different pattern of life — one deliberate practice at a time.</p>
          <a
            className="cf7-cta"
            href="#challenge"
            onClick={e => { e.preventDefault(); document.getElementById("cf7-challenge").scrollIntoView({ behavior: "smooth" }); }}
          >
            {completionCount ? "Continue the Challenge" : "Begin the Challenge"}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
          <p className="cf7-scripture"><ScriptureRef reference="Ephesians 6:10–18" /></p>
        </div>
        <div className="cf7-scroll-hint" ref={shRef}>
          <span>Scroll</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section id="cf7-challenge" className="cf7-challenge">
        <div className="cf7-challenge-shell">
          <div className="cf7-challenge-header">
            <p className="cf7-eyebrow">Counter Formation</p>
            <h2 className="cf7-section-h2">The Seven Days</h2>
            <p className="cf7-section-italic">Formation is not optional. It is already happening.</p>
            <p className="cf7-section-copy">
              This is not a content library. It is a path. Seven days to interrupt drift, recover attention,
              and begin practicing a more deliberate life under Christ.
            </p>
          </div>
          <div className="cf7-challenge-sidebar">
            <Tracker activeDayN={null} progress={progress} />
            <p className="cf7-intensity-line">
              {completionCount === 0
                ? "Start with Day 1. Stay in order. Let the week build on itself."
                : completionCount === CHALLENGE_DAYS.length
                  ? "All seven complete. Go back through them slowly and keep the rhythm."
                  : `You are ${completionCount} day${completionCount === 1 ? "" : "s"} in. Continue with Day ${currentDay}.`}
            </p>
          </div>
        </div>

        <div className="cf7-cards-shell">
        <div className="cf7-grid-wrap">
          <div className="cf7-grid">
            {CHALLENGE_DAYS.map((d) => {
              const { done, unlocked, current } = getCardState(d.n, progress);
              const stateLabel = done ? "Completed" : current ? "Start Here" : unlocked ? "Continue" : "Locked";
              return (
                <Link
                  key={d.n}
                  to={unlocked ? `${CHALLENGE_BASE}/day/${d.n}` : CHALLENGE_BASE}
                  className={`cf7-card${done ? " done" : ""}${current ? " current" : ""}${!unlocked ? " locked" : ""}`}
                  aria-disabled={!unlocked}
                >
                  <div className="cf7-done-badge">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.5 7.5L8.5 2.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="cf7-card-state">{stateLabel}</span>
                  <div className="cf7-card-bg" style={{ backgroundImage: `url('${d.imgThumb}')` }} />
                  <div className="cf7-card-ov" />
                  {!unlocked && (
                    <div className="cf7-card-lock">
                      Complete Day {d.n - 1}
                      <br />
                      to continue
                    </div>
                  )}
                  <div className="cf7-card-body">
                    <p className="cf7-card-num">Day {d.n}</p>
                    <p className="cf7-card-title">{d.title}</p>
                    <p className="cf7-card-theme">{d.theme}</p>
                    <span className="cf7-card-cta">
                      {done ? "Read Again" : current ? "Begin Day" : "Read Devotion"}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        </div>

        <div className="cf7-form-wrap">
          {!submitted ? (
            <>
              <p className="cf7-form-eyebrow">The Entry Point</p>
              <h3 className="cf7-form-h">
                {completionCount ? <>Stay in the<br />Pattern</> : <>Begin the<br />Challenge</>}
              </h3>
              <div className="cf7-form-row">
                <input
                  className="cf7-email-inp"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <Button variant="primary" size="sm" onClick={handleSubmit}
                  icon={<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}>
                  {completionCount ? "Continue" : "Begin"}
                </Button>
              </div>
              <p className="cf7-form-note">One practice per day. No noise. No drift.</p>
            </>
          ) : (
            <div className="cf7-suc-msg" style={{ display: "block" }}>
              You're in. Day {currentDay} begins now.
              <span className="cf7-suc-sub">Check your inbox. The formation has started.</span>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

/* ─── DEVOTION PAGE ───────────────────────────────────────────────── */

export function CFDevotion() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const { day } = useParams();
  const navigate = useNavigate();
  const rfillRef = useRef(null);
  const contentRef = useRef(null);
  const [showComplete, setShowComplete] = useState(false);

  const n = parseInt(day, 10);
  const d = CHALLENGE_DAYS.find(x => x.n === n);
  const meta = d ? CHALLENGE_DAY_META[d.n] : null;

  const completedDays = isLoaded ? profile.challenge.completedDays : [];
  const progress = useMemo(() => daysToProgressMap(completedDays), [completedDays]);

  useEffect(() => {
    if (!d) navigate(CHALLENGE_BASE, { replace: true });
  }, [d, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [n]);

  useEffect(() => {
    if (!d || !isLoaded) return;

    let hasMarked = completedDays.includes(d.n);
    const el = contentRef.current?.closest(".cf7-dev-scroll") || window;

    const onScroll = () => {
      const scrollTop = el === window ? document.documentElement.scrollTop : el.scrollTop;
      const scrollHeight = el === window ? document.documentElement.scrollHeight : el.scrollHeight;
      const clientHeight = el === window ? window.innerHeight : el.clientHeight;
      const pct = scrollTop / (scrollHeight - clientHeight) || 0;
      if (rfillRef.current) rfillRef.current.style.width = (pct * 100) + "%";

      if (pct > 0.8 && !hasMarked) {
        const updatedDays = [...completedDays, d.n];
        updateProfile({ challenge: { completedDays: updatedDays } });
        hasMarked = true;
        setShowComplete(true);
        window.setTimeout(() => setShowComplete(false), 2600);
      }
    };

    if (el === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      el.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (el === window) {
        window.removeEventListener("scroll", onScroll);
      } else {
        el.removeEventListener("scroll", onScroll);
      }
    };
  }, [d, isLoaded]);

  if (!d) return null;

  const prev = CHALLENGE_DAYS.find(x => x.n === n - 1);
  const next = CHALLENGE_DAYS.find(x => x.n === n + 1);
  const practiceLines = d.practice.split("\n").map((l, i) => l ? <p key={i}>{l}</p> : <br key={i} />);
  const prayerLines = d.prayer.split("\n").map((l, i) => l ? <p key={i}>{l}</p> : <br key={i} />);
  const pullQuote = meta?.line || stripTags(d.teaching[0]);

  return (
    <div className="cf7-dev-wrap">
      <CornerNav />

      <div className="cf7-rbar"><div className="cf7-rfill" ref={rfillRef} /></div>

      <div className="cf7-dev-img-band">
        <div className="cf7-dev-img-bg" style={{ backgroundImage: `url('${d.img}')` }} />
        <div className="cf7-dev-img-ov" />
        <div className="cf7-dev-img-inner">
          <img
            className="cf7-dev-img-logo"
            src="/helmet.png"
            onError={e => { e.target.style.display = "none"; }}
            alt=""
            role="presentation"
          />
          <p className="cf7-dev-img-eye">Day {d.n} of 7 · {d.theme}</p>
          <h1 className="cf7-dev-img-h1">{d.title}</h1>
        </div>
      </div>

      <div className={`cf7-complete-toast${showComplete ? " show" : ""}`}>
        <strong>Day Complete</strong>
        <span>{next ? `Day ${d.n} is complete. Continue to Day ${next.n}.` : "All seven days complete. Keep the rhythm."}</span>
      </div>

      <div className="cf7-dev-content" ref={contentRef}>

        {/* Full-width — tracker + rule + pull quote */}
        <div className="cf7-tracker-row">
          <Tracker activeDayN={d.n} progress={progress} />
        </div>
        <div className="cf7-dev-rule" />
        <div className="cf7-pull-quote">
          <p>{pullQuote}</p>
          <span>Formation Line</span>
        </div>

        {/* Two-column zone — left content + sticky sidebar */}
        <div className="cf7-dev-two-col">
          <div className="cf7-dev-left">
            <Section label="Opening" className="cf7-dev-opening">
              <div className="cf7-dev-body">
                <p><em>{d.opening}</em></p>
                {d.body.map((p, i) => renderRichText(p, i))}
              </div>
            </Section>
            <Section label="Scripture" className="cf7-dev-scripture">
              {d.scriptures.map((s, i) => (
                <div className="cf7-scripture-block" key={i}>
                  <p>"{s.t}"</p>
                  <cite>— <ScriptureRef reference={s.r} text={s.t} /></cite>
                </div>
              ))}
            </Section>
            <Section label="Teaching" className="cf7-dev-teaching">
              <div className="cf7-dev-body">
                {d.teaching.map((p, i) => renderRichText(p, i))}
              </div>
            </Section>
          </div>

          <aside className="cf7-dev-sidebar">
            <div className="cf7-dev-sec">
              <p className="cf7-dev-sec-lbl">Reflection</p>
              <div style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.14)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px,3.5vw,18px)",
                color: "rgba(250,248,245,0.65)",
                lineHeight: 1.7,
              }}>
                {d.reflection}
              </div>
            </div>
            <div className="cf7-dev-sec" style={{ marginTop: "2rem" }}>
              <p className="cf7-dev-sec-lbl">Day {d.n} of 7</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "16px",
                color: "rgba(250,248,245,0.38)",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}>
                {d.theme}
              </p>
              <Tracker activeDayN={d.n} progress={progress} />
            </div>
          </aside>
        </div>

        {/* Full-width sections — below the two-col zone, no overlap */}
        <Section label="Why This Matters" className="cf7-dev-why">
          <div className="cf7-impact-block why">
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.6vw,18px)" }}>
              <p>{meta?.why}</p>
            </div>
          </div>
        </Section>

        <Section className="cf7-dev-practice">
          <div className="cf7-practice-block">
            <span className="cf7-practice-tag">Practice · 15 Minutes</span>
            <p className="cf7-practice-pre">Do not rush this. This is where formation begins.</p>
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.5vw,17px)" }}>
              {practiceLines}
            </div>
          </div>
        </Section>

        <Section label="What This Changes" className="cf7-dev-change">
          <div className="cf7-impact-block change">
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.6vw,18px)" }}>
              <p>{meta?.change}</p>
            </div>
          </div>
        </Section>

        <Section label="Prayer" className="cf7-dev-prayer">
          <div className="cf7-prayer">
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.5vw,17px)", color: "rgba(250,248,245,0.52)" }}>
              {prayerLines}
            </div>
          </div>
        </Section>

        {d.n === 7 && (
          <NextStep context="challenge-complete" className="cf7-next-step" />
        )}

        <div className="cf7-brand-foot">
          <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" role="presentation" />
          <p>Counter Formation · Formed in Christ · Ephesians 6:10–18</p>
        </div>

        <div className="cf7-day-nav">
          {prev ? (
            <Link to={`${CHALLENGE_BASE}/day/${prev.n}`} className="cf7-nav-btn">
              <span>← Day {prev.n}</span>{prev.title}
            </Link>
          ) : (
            <Link to={CHALLENGE_BASE} className="cf7-nav-btn">
              <span>←</span>All Seven Days
            </Link>
          )}
          {next ? (
            <Link to={`${CHALLENGE_BASE}/day/${next.n}`} className="cf7-nav-btn">
              <span>Day {next.n} →</span>{next.title}
            </Link>
          ) : (
            <Link to={CHALLENGE_BASE} className="cf7-nav-btn">
              <span>Complete</span>Return to Challenge
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}

function Section({ label, children, className = "" }) {
  return (
    <div className={`cf7-dev-sec${className ? ` ${className}` : ""}`}>
      {label ? <p className="cf7-dev-sec-lbl">{label}</p> : null}
      {children}
    </div>
  );
}
