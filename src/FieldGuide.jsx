import React, { useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { useFormationProfile } from "./hooks/useFormationProfile";
import NextStep from "./components/NextStep";
import { getFieldGuidePath, getFieldGuideDay, getFieldGuideLanding } from "./content/loader";
import "./styles/field-guide.css";
import Button from "./components/primitives/Button";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const BASE = "/field-guide/scripture-before-scroll";

const { why: WHY, newSections: NEW_SECTIONS } = getFieldGuideLanding();
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

function FGLabel({ children, color = "var(--cf-gold)" }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", color, fontWeight: 700, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function FGHeading({ children, style = {} }) {
  return (
    <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 56, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 0.92, color: "var(--cf-ivory)", margin: 0, ...style }}>
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
        <p className="fg-fade-up-2 fg-narrow" style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.8 }}>
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
                <span className="fg-fade-up-2" style={{ color: "var(--cf-gold)" }}>Before<br /></span>
                <span className="fg-fade-up-3">Scroll</span>
              </FGHeading>
              <p className="fg-fade-up-4" style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.8, maxWidth: 420, marginBottom: 28 }}>
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
                <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--cf-ivory)", margin: 0 }}>
                  Begin the day with stillness, scripture, reflection, and one concrete act of resistance against drift.
                </p>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--cf-ivory-24)", marginBottom: 12 }}>
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
          <div style={{ background: "var(--cf-rule-bg)", border: `1px solid var(--cf-gold-hairline)`, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 0, position: "relative", overflow: "hidden" }}>
            {/* Subtle top gold line (matching fg-panel::before) */}
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.48), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--cf-gold)" }}>
                Also in the Field Guide
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cf-ivory)", lineHeight: 1.15, marginBottom: 12 }}>
                    Fruit of the Spirit<br />Assessment
                  </div>
                  <p style={{ fontSize: 14, color: "var(--cf-ivory-58)", lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
                    A 27-question diagnostic that reveals where the Spirit has the most room to work in you right now. Built for honest self-report, not self-idealization.
                  </p>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--cf-ivory-24)", marginTop: 14 }}>
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
          <div style={{ background: "var(--cf-rule-bg)", border: `1px solid var(--cf-gold-hairline)`, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 0, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.48), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--cf-gold)" }}>
                The Second Anchor
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--cf-ivory)", lineHeight: 1.15, marginBottom: 12 }}>
                    Spiritual Gifts<br />Assessment
                  </div>
                  <p style={{ fontSize: 14, color: "var(--cf-ivory-58)", lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
                    Where the Spirit is at work through you to build up the body. Self-report, fruitfulness, and the witness of those who know you well, woven into a single picture.
                  </p>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--cf-ivory-24)", marginTop: 14 }}>
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
            <p style={{ fontSize: 14, color: "var(--cf-ivory-58)", lineHeight: 1.8, margin: 0 }}>
              Scan. Enter the office. Return tomorrow. Let repetition do what inspiration never can.
            </p>
          </div>
          <div className="fg-card fg-reveal">
            <div className="fg-section-kicker" style={{ marginBottom: 12 }}>Built for return</div>
            <p style={{ fontSize: 14, color: "var(--cf-ivory-58)", lineHeight: 1.8, margin: 0 }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--cf-ivory-24)" }}>
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
              <p style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.82, margin: 0 }}>{office.stillness}</p>
            </div>

            <div className="fg-card">
              <FGLabel>Reflection</FGLabel>
              <p style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.82, margin: 0 }}>{office.reflection}</p>
            </div>
          </div>
        </div>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-scripture-card">
            <FGLabel>Scripture</FGLabel>
            <p style={{ fontSize: 18, color: "var(--cf-ivory)", fontStyle: "italic", lineHeight: 1.9, marginBottom: 16 }}>
              &ldquo;{office.scripture}&rdquo;
            </p>
            <ScriptureRef reference={office.ref} text={office.scripture} />
          </div>
        </div>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-ritual-grid">
            <div className="fg-card">
              <FGLabel>Action</FGLabel>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: 10 }}>Today</div>
              <p style={{ fontSize: 16, color: "var(--cf-ivory)", lineHeight: 1.82, margin: 0 }}>{office.action}</p>
            </div>

            <div className="fg-card">
              <FGLabel>Closing</FGLabel>
              <p style={{ fontSize: 18, color: "var(--cf-ivory)", fontStyle: "italic", lineHeight: 1.82, margin: 0 }}>{office.closing}</p>
            </div>
          </div>
        </div>

        <div className="fg-return-panel fg-reveal" style={{ marginTop: 30 }}>
          <div className="fg-section-kicker" style={{ marginBottom: 10 }}>Daily Rhythm</div>
          <p style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 18px" }}>
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
            <Button variant="ghost" size="sm" onClick={() => alert("Add the Field Guide to your home screen from your browser menu.")}>⊕ Save to Home Screen</Button>
            <Button variant="ghost" size="sm" onClick={() => navigator.share ? navigator.share({ title: "Scripture Before Scroll", text: "Discipline before distraction.", url: window.location.href }) : navigator.clipboard?.writeText(window.location.href)}>↗ Share This Rhythm</Button>
          </div>

          <div style={{ marginTop: 16, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.30em", textTransform: "uppercase", color: "var(--cf-ivory-24)" }}>
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
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--cf-ivory-24)" }}>
              {progress.length} complete
            </div>
          </div>
          <p style={{ fontSize: 14, color: "var(--cf-ivory-58)", lineHeight: 1.8, margin: 0 }}>
            Start anywhere, but don’t stay random. Let the path teach your mornings how to return.
          </p>
        </div>

        <div className="fg-reveal" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {getFieldGuidePath().map(o => {
            const complete = progress.includes(o.day);
            return (
              <Link key={o.day} className="fg-day-card" to={`${BASE}/day/${o.day}`}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: complete ? "rgba(201,168,76,0.16)" : "rgba(201,168,76,0.08)", border: `1px solid ${complete ? "rgba(201,168,76,0.46)" : "rgba(201,168,76,0.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 800, color: "var(--cf-gold)" }}>{o.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cf-ivory)", marginBottom: 4 }}>{o.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--cf-ivory-24)" }}>
                      <ScriptureRef reference={o.ref} text={o.scripture} />
                    </div>
                    {o.day === 1 && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--cf-gold)" }}>Start here</span>}
                    {complete && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)" }}>Complete</span>}
                  </div>
                </div>
                <span style={{ color: "var(--cf-gold)", fontSize: 16, opacity: 0.65 }}>→</span>
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
                <div style={{ width: 22, height: 1, backgroundColor: "var(--cf-gold)" }} />
                <FGLabel>{sec.title}</FGLabel>
              </div>
              <p style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.82, margin: 0 }}>{sec.body}</p>
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
                <div style={{ width: 20, height: 1, backgroundColor: "var(--cf-gold)" }} />
                <FGLabel>{sec.title}</FGLabel>
              </div>
              <p style={{ fontSize: 15, color: "var(--cf-ivory-58)", lineHeight: 1.82, margin: 0 }}>{sec.body}</p>
            </div>
          ))}
        </div>

        <GoldDivider mt={30} mb={28} />

        <div className="fg-panel fg-reveal" style={{ maxWidth: 520 }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "'Barlow Condensed',sans-serif", backgroundColor: "var(--cf-gold-hairline)", color: "var(--cf-gold)", marginBottom: 18 }}>
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
