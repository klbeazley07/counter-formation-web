import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { QUESTIONS, FRUITS, FRUIT_ORDER, CLUSTER_THRESHOLD, SCALE_OPTIONS } from "./fruitAssessmentData";

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */

const C = {
  bg:         "#06050A",
  bgSurf:     "#0E0C0A",
  bgCard:     "#17140F",
  gold:       "#C9A84C",
  goldSoft:   "rgba(201,168,76,0.45)",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldMid:    "rgba(201,168,76,0.08)",
  ivory:      "#FAF8F5",
  ivoryDim:   "rgba(250,248,245,0.62)",
  ivoryFaint: "rgba(250,248,245,0.28)",
};

const F = {
  brand: "'Michroma', sans-serif",
  body:  "'Inter', sans-serif",
  serif: "'Cormorant Garamond', serif",
};

const LS_KEY       = "cf-fruit-assessment";
const LS_DRAFT_KEY = "cf-fruit-assessment-draft";

/* ─── INJECTED STYLES ─────────────────────────────────────────────────── */

const FA_CSS = `
  .fa-shell {
    min-height: 100vh;
    background: #06050A;
    color: #FAF8F5;
    position: relative;
    overflow-x: hidden;
  }
  .fa-up-0 { animation: faUp .65s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-1 { animation: faUp .65s .10s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-2 { animation: faUp .65s .20s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-3 { animation: faUp .65s .30s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-4 { animation: faUp .65s .40s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-5 { animation: faUp .65s .50s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-6 { animation: faUp .65s .60s cubic-bezier(.16,1,.3,1) both; }
  @keyframes faUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fa-q-exit-left  { opacity: 0 !important; transform: translateX(-20px) !important; }
  .fa-q-exit-right { opacity: 0 !important; transform: translateX(20px) !important; }
  .fa-q-enter-from-right { animation: faEnterRight .20s ease forwards; }
  .fa-q-enter-from-left  { animation: faEnterLeft .20s ease forwards; }
  @keyframes faEnterRight {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes faEnterLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .fa-progress-track {
    height: 2px;
    background: rgba(201,168,76,0.15);
    width: 100%;
    position: relative;
    border-radius: 1px;
  }
  .fa-progress-fill {
    position: absolute;
    top: 0; left: 0;
    height: 100%;
    background: #C9A84C;
    border-radius: 1px;
    transition: width 600ms ease-in-out;
  }
  @keyframes faPulse {
    0%, 100% { transform: scale(1);    opacity: 0.4; }
    50%       { transform: scale(1.08); opacity: 0.7; }
  }
  .fa-helmet-pulse { animation: faPulse 2.4s ease-in-out infinite; }

  /* Ambient fruit drift animations */
  @keyframes faAmbientDriftV {
    from { transform: translateY(calc(-50% - 6px)); }
    to   { transform: translateY(calc(-50% + 6px)); }
  }
  @keyframes faAmbientDriftH {
    from { transform: translateX(calc(-50% - 8px)); }
    to   { transform: translateX(calc(-50% + 8px)); }
  }
  .fa-ambient-wrap-desktop {
    animation: faAmbientDriftV 14s ease-in-out infinite alternate;
  }
  .fa-ambient-wrap-mobile {
    animation: faAmbientDriftH 14s ease-in-out infinite alternate;
  }

  @media (max-width: 640px) {
    .fa-fruit-bg { display: none; }
    .fa-cta-row { flex-direction: column !important; }
    .fa-ambient-desktop { display: none !important; }
  }
  @media (min-width: 641px) {
    .fa-ambient-mobile { display: none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fa-up-0, .fa-up-1, .fa-up-2, .fa-up-3,
    .fa-up-4, .fa-up-5, .fa-up-6 {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .fa-ambient-wrap-desktop,
    .fa-ambient-wrap-mobile {
      animation: none !important;
    }
    .fa-helmet-pulse {
      animation: none !important;
      opacity: 0.4 !important;
    }
  }
`;

export function FAStyles() {
  return <style dangerouslySetInnerHTML={{ __html: FA_CSS }} />;
}

/* ─── SCORING ─────────────────────────────────────────────────────────── */

export function calculateScores(answers) {
  const totals = {};
  FRUIT_ORDER.forEach(k => { totals[k] = 0; });
  QUESTIONS.forEach((q, i) => {
    const raw = answers[i] ?? 3;
    const effective = q.reverse ? (7 - raw) : raw;
    totals[q.fruitKey] += effective;
  });
  const normalized = {};
  FRUIT_ORDER.forEach(k => {
    normalized[k] = Math.round(((totals[k] - 3) / 15) * 100);
  });
  return normalized;
}

export function identifyFormationArea(scores) {
  const entries = Object.entries(scores);
  const lowest = Math.min(...entries.map(([, s]) => s));
  const primary = entries
    .filter(([, s]) => s === lowest)
    .sort(([a], [b]) => a.localeCompare(b))[0][0];
  const cluster = entries
    .filter(([k, s]) => s <= lowest + CLUSTER_THRESHOLD && k !== primary)
    .map(([k]) => k);
  return { primaryFruit: primary, cluster };
}

function computeTwoPoleResults(scores) {
  const entries = Object.entries(scores);
  const sortedDesc = [...entries].sort(([, a], [, b]) => b - a);
  const sortedAsc  = [...entries].sort(([, a], [, b]) => a - b);

  const evidenceFruits   = sortedDesc.slice(0, 3).map(([key]) => key);
  const primaryEvidence  = evidenceFruits[0];
  const formationFruits  = sortedAsc.slice(0, 3).map(([key]) => key);
  const primaryFormation = formationFruits[0];
  const middleFruits     = sortedDesc.slice(3, 6).map(([key]) => key);
  const highestScore     = sortedDesc[0][1];
  const lowestScore      = sortedAsc[0][1];
  const scoreSpread      = highestScore - lowestScore;

  return { evidenceFruits, primaryEvidence, middleFruits, formationFruits, primaryFormation, scoreSpread };
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).format(new Date(isoString));
}

function daysAgo(isoString) {
  return Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */

export default function FruitAssessment() {
  const [screen, setScreen]                   = useState("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers]                 = useState(Array(27).fill(null));
  const [scores, setScores]                   = useState(null);
  const [primaryFruit, setPrimaryFruit]       = useState(null);
  const [cluster, setCluster]                 = useState([]);
  const [previousResult, setPreviousResult]   = useState(null);
  const [isDeltaMode, setIsDeltaMode]         = useState(false);
  const [shareOpen, setShareOpen]             = useState(false);
  const [shareFormat, setShareFormat]         = useState("square");
  const [shareVariant, setShareVariant]       = useState("formation");
  const [qExitClass, setQExitClass]           = useState("");
  const [qEnterClass, setQEnterClass]         = useState("");
  const [qTransitioning, setQTransitioning]   = useState(false);

  // Two-pole results state
  const [evidenceFruits, setEvidenceFruits]     = useState([]);
  const [primaryEvidence, setPrimaryEvidence]   = useState(null);
  const [formationFruits, setFormationFruits]   = useState([]);
  const [primaryFormation, setPrimaryFormation] = useState(null);
  const [scoreSpread, setScoreSpread]           = useState(0);

  // Blackout overlay state
  const blackoutRef        = useRef(null);
  const blackoutActiveRef  = useRef(false);

  useEffect(() => {
    document.title = "Fruit of the Spirit Assessment \u00B7 Counter Formation";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.current) {
          setPreviousResult(parsed.current);
          setScreen("pre-intro");
        }
      }
      localStorage.removeItem(LS_DRAFT_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    if (screen !== "questions") return;
    if (!answers.some(a => a !== null)) return;
    try {
      localStorage.setItem(LS_DRAFT_KEY, JSON.stringify({ answers, currentQuestion }));
    } catch {}
  }, [answers, currentQuestion, screen]);

  function completeAssessment(finalAnswers) {
    const sc = calculateScores(finalAnswers);
    const { primaryFruit: pf, cluster: cl } = identifyFormationArea(sc);
    const poles = computeTwoPoleResults(sc);
    const newResult = {
      completedAt: new Date().toISOString(),
      answers: finalAnswers,
      scores: sc,
      primaryFruit: pf,
      primaryEvidence: poles.primaryEvidence,
      evidenceFruits: poles.evidenceFruits,
      formationFruits: poles.formationFruits,
      cluster: cl,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      localStorage.setItem(LS_KEY, JSON.stringify({
        current: newResult,
        previous: existing.current || null,
      }));
      localStorage.removeItem(LS_DRAFT_KEY);
    } catch {}
    setScores(sc);
    setPrimaryFruit(pf);
    setCluster(cl);
    setEvidenceFruits(poles.evidenceFruits);
    setPrimaryEvidence(poles.primaryEvidence);
    setFormationFruits(poles.formationFruits);
    setPrimaryFormation(poles.primaryFormation);
    setScoreSpread(poles.scoreSpread);
    setScreen("processing");
  }

  function triggerBlackout(finalAnswers) {
    if (blackoutActiveRef.current) return;
    blackoutActiveRef.current = true;
    const el = blackoutRef.current;
    if (!el) { completeAssessment(finalAnswers); return; }

    if (prefersReducedMotion()) {
      gsap.to(el, { opacity: 1, duration: 0.4, onComplete: () => {
        completeAssessment(finalAnswers);
        setTimeout(() => {
          gsap.to(el, { opacity: 0, duration: 0.4, onComplete: () => {
            el.style.pointerEvents = "none";
            blackoutActiveRef.current = false;
          }});
        }, 200);
      }});
      el.style.pointerEvents = "all";
      return;
    }

    el.style.pointerEvents = "all";
    // Phase 1: dim over 1.8s (slow inexorable curve)
    gsap.to(el, {
      opacity: 1, duration: 1.8,
      ease: "power1.inOut",
      onComplete: () => {
        // Phase 2: hold 600ms of pure black
        setTimeout(() => {
          // Switch to processing screen (invisible under overlay)
          completeAssessment(finalAnswers);
          // Phase 3: overlay fades out over 1.4s
          gsap.to(el, {
            opacity: 0, duration: 1.4,
            ease: "power2.out",
            onComplete: () => {
              el.style.pointerEvents = "none";
              blackoutActiveRef.current = false;
            },
          });
        }, 600);
      },
    });
  }

  function goNext() {
    if (qTransitioning) return;
    const q = currentQuestion;
    setQExitClass("fa-q-exit-left");
    setQTransitioning(true);
    setTimeout(() => {
      if (q < 26) {
        setCurrentQuestion(q + 1);
        setQExitClass("");
        setQEnterClass("fa-q-enter-from-right");
        setQTransitioning(false);
        setTimeout(() => setQEnterClass(""), 220);
      } else {
        // Q27: trigger blackout instead of immediate transition
        triggerBlackout(answers);
        setQExitClass("");
        setQTransitioning(false);
      }
    }, 210);
  }

  function goBack() {
    if (qTransitioning || currentQuestion === 0) return;
    setQExitClass("fa-q-exit-right");
    setQTransitioning(true);
    setTimeout(() => {
      setCurrentQuestion(q => q - 1);
      setQExitClass("");
      setQEnterClass("fa-q-enter-from-left");
      setQTransitioning(false);
      setTimeout(() => setQEnterClass(""), 220);
    }, 210);
  }

  function selectAnswer(value) {
    setAnswers(prev => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
  }

  useEffect(() => {
    if (screen !== "questions") return;
    function onKey(e) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 6) { selectAnswer(n); return; }
      if ((e.key === "Enter" || e.key === "ArrowRight") && answers[currentQuestion] !== null) goNext();
      if (e.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, currentQuestion, answers, qTransitioning]);

  // When viewing previous results, compute two-pole from stored scores
  function loadPreviousResults(stored) {
    const sc = stored.scores;
    const poles = computeTwoPoleResults(sc);
    setScores(sc);
    setPrimaryFruit(stored.primaryFruit);
    setCluster(stored.cluster || []);
    setEvidenceFruits(stored.evidenceFruits || poles.evidenceFruits);
    setPrimaryEvidence(stored.primaryEvidence || poles.primaryEvidence);
    setFormationFruits(stored.formationFruits || poles.formationFruits);
    setPrimaryFormation(stored.primaryFormation || poles.primaryFormation);
    setScoreSpread(poles.scoreSpread);
    setScreen("results");
  }

  const qProps = { qExitClass, qEnterClass, answers, currentQuestion, selectAnswer, goNext, goBack, qTransitioning };
  const rProps = {
    scores, primaryFruit, cluster, previousResult, isDeltaMode, setShareOpen,
    evidenceFruits, primaryEvidence, formationFruits, primaryFormation, scoreSpread,
  };

  return (
    <div className="fa-shell">
      {/* Blackout overlay -- fixed, covers everything, z-50 */}
      <div
        ref={blackoutRef}
        style={{
          position: "fixed", inset: 0,
          background: "#06050A",
          opacity: 0, pointerEvents: "none",
          zIndex: 50,
        }}
      />

      {screen === "pre-intro" && (
        <PreIntroScreen
          previous={previousResult}
          onView={() => loadPreviousResults(previousResult)}
          onRetake={() => {
            setAnswers(Array(27).fill(null));
            setCurrentQuestion(0);
            setIsDeltaMode(false);
            setScreen("intro");
          }}
          onDelta={() => {
            setAnswers(Array(27).fill(null));
            setCurrentQuestion(0);
            setIsDeltaMode(true);
            setScreen("intro");
          }}
        />
      )}
      {screen === "intro"      && <IntroScreen onBegin={() => setScreen("questions")} />}
      {screen === "questions"  && <QuestionScreen {...qProps} />}
      {screen === "processing" && <ProcessingScreen onDone={() => setScreen("results")} />}
      {screen === "results"    && <ResultsScreen {...rProps} />}
      {shareOpen && (
        <ShareModal
          fruitKey={primaryFruit}
          evidenceFruitKey={primaryEvidence}
          scores={scores}
          format={shareFormat}
          setFormat={setShareFormat}
          variant={shareVariant}
          setVariant={setShareVariant}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}

/* ─── SCREEN 0: PRE-INTRO ─────────────────────────────────────────────── */

function PreIntroScreen({ previous, onView, onRetake, onDelta }) {
  const isPast14Days = daysAgo(previous.completedAt) >= 14;
  const fruit = FRUITS[previous.primaryFruit];

  function Btn({ onClick, soft, children }) {
    const [hov, setHov] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: "block", width: "100%", padding: "14px 24px",
          border: `1px solid ${soft ? C.goldSoft : C.gold}`,
          background: hov ? C.goldMid : "transparent",
          color: soft ? C.ivoryDim : C.gold,
          fontFamily: F.brand, fontSize: 12, letterSpacing: "0.28em",
          textTransform: "uppercase", cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div className="fa-up-0" style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>
          Welcome Back
        </div>
        <h1 className="fa-up-1" style={{ fontFamily: F.brand, fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginBottom: 32, lineHeight: 1.3 }}>
          Your Formation Continues
        </h1>
        <p className="fa-up-2" style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: C.ivoryDim, lineHeight: 1.7, marginBottom: 40 }}>
          You completed this assessment on {formatDate(previous.completedAt)}. Your current area of formation was {fruit ? fruit.label : previous.primaryFruit}. The Spirit is still at work. You can revisit your last results, retake the assessment fresh, or see how you have moved.
        </p>
        <div className="fa-up-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Btn onClick={onView}>View Previous Results</Btn>
          <Btn onClick={onRetake} soft>Retake the Assessment</Btn>
          {isPast14Days && <Btn onClick={onDelta} soft>See How I Have Moved</Btn>}
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 1: INTRODUCTION ──────────────────────────────────────────── */

function IntroScreen({ onBegin }) {
  const FRUIT_NAMES = ["LOVE","JOY","PEACE","PATIENCE","KINDNESS","GOODNESS","FAITHFULNESS","GENTLENESS","SELF-CONTROL"];
  const [btnHov, setBtnHov] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px", position: "relative", overflow: "hidden" }}>
      <div className="fa-fruit-bg" style={{
        position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 20, opacity: 0.05,
        pointerEvents: "none", userSelect: "none",
      }}>
        {FRUIT_NAMES.map(n => (
          <span key={n} style={{ fontFamily: F.brand, fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", color: C.ivory, whiteSpace: "nowrap" }}>{n}</span>
        ))}
      </div>

      <div style={{ maxWidth: 640, width: "100%", position: "relative", zIndex: 1 }}>
        <div className="fa-up-0" style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>
          Field Guide &middot; Fruit of the Spirit
        </div>
        <h1 className="fa-up-1" style={{ fontFamily: F.brand, fontSize: "clamp(28px,5vw,36px)", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, lineHeight: 1.3, marginBottom: 32 }}>
          Where Is the Spirit Working in You?
        </h1>
        <div className="fa-up-2" style={{ width: 48, height: 1, background: C.goldFaint, marginBottom: 32 }} />
        <p className="fa-up-2" style={{ fontFamily: F.body, fontWeight: 300, fontSize: 17, color: C.ivory, lineHeight: 1.8, marginBottom: 24 }}>
          Paul wrote about the fruit of the Spirit in the singular. Not fruits. One fruit, with nine qualities, growing in proportion to abiding in Christ. Where you find deficiency in any of them, you are not discovering a fixed trait. You are finding an area where the Spirit has more room to work right now.
        </p>
        <p className="fa-up-3" style={{ fontFamily: F.body, fontWeight: 300, fontSize: 17, color: C.ivory, lineHeight: 1.8, marginBottom: 40 }}>
          This is not a personality quiz. It is 27 behavioral questions designed for honest self-report, not self-idealization. The goal is not to categorize you. The goal is to show you where formation is most needed -- and to give you one concrete practice for the week ahead.
        </p>
        <div className="fa-up-4" style={{ maxWidth: 520, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: C.ivory, lineHeight: 1.6, margin: "0 0 16px" }}>
            &ldquo;But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.&rdquo;
          </p>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase" }}>
            Galatians 5:22&ndash;23
          </div>
        </div>
        <div className="fa-up-5" style={{ textAlign: "center" }}>
          <button
            onClick={onBegin}
            onMouseEnter={() => setBtnHov(true)}
            onMouseLeave={() => setBtnHov(false)}
            style={{
              padding: "18px 40px", border: `1px solid ${C.gold}`, background: btnHov ? C.goldMid : "transparent",
              color: C.gold, fontFamily: F.brand, fontSize: 13, letterSpacing: "0.28em",
              textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease",
            }}
          >
            Begin Assessment
          </button>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, marginTop: 16 }}>
            27 questions &middot; approximately 6 minutes
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 2: QUESTION FLOW ─────────────────────────────────────────── */

function QuestionScreen({ qExitClass, qEnterClass, answers, currentQuestion, selectAnswer, goNext, goBack, qTransitioning }) {
  const q = QUESTIONS[currentQuestion];
  const selected = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / 27) * 100;
  const isLast = currentQuestion === 26;
  const canAdvance = selected !== null && !qTransitioning;

  // Ambient fruit state
  const currentFruitKey   = q.fruitKey;
  const currentFruitLabel = FRUITS[currentFruitKey].label.toUpperCase();
  const [ambientLabel, setAmbientLabel]   = useState(currentFruitLabel);
  const [ambientOpacity, setAmbientOpacity] = useState(0);
  const [ambientTransDuration, setAmbientTransDuration] = useState("2s");
  const prevFruitKeyRef = useRef(null);
  const ambientTimers   = useRef([]);

  // Reduced motion: static ambient, no drift, no transitions
  const reduced = prefersReducedMotion();

  useEffect(() => {
    // Initial mount: fade in over 2s
    if (prevFruitKeyRef.current === null) {
      prevFruitKeyRef.current = currentFruitKey;
      setAmbientLabel(currentFruitLabel);
      if (reduced) {
        setAmbientOpacity(1);
        return;
      }
      setAmbientTransDuration("2s");
      const t = setTimeout(() => setAmbientOpacity(1), 120);
      ambientTimers.current.push(t);
      return;
    }

    // Same fruit -- no transition needed
    if (currentFruitKey === prevFruitKeyRef.current) return;
    prevFruitKeyRef.current = currentFruitKey;

    if (reduced) {
      setAmbientLabel(currentFruitLabel);
      return;
    }

    // Crossfade: outgoing fades to 0 over 1.6s; after 1.2s (1.6 - 0.4 overlap) switch label and fade in
    setAmbientTransDuration("1.6s");
    setAmbientOpacity(0);
    const t1 = setTimeout(() => {
      setAmbientLabel(currentFruitLabel);
      setAmbientTransDuration("1.6s");
      const t2 = setTimeout(() => setAmbientOpacity(1), 50);
      ambientTimers.current.push(t2);
    }, 1200);
    ambientTimers.current.push(t1);

    return () => {
      ambientTimers.current.forEach(clearTimeout);
      ambientTimers.current = [];
    };
  }, [currentFruitKey]);

  useEffect(() => {
    return () => {
      ambientTimers.current.forEach(clearTimeout);
    };
  }, []);

  // Target opacity (4% desktop, 6% mobile via the component -- desktop uses inline style)
  const desktopTargetOpacity = ambientOpacity ? 0.04 : 0;
  const mobileTargetOpacity  = ambientOpacity ? 0.06 : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", padding: "32px 24px", position: "relative", overflow: "hidden" }}>

      {/* Ambient Fruit -- Desktop: right edge, rotated -90deg */}
      <div
        className="fa-ambient-desktop fa-ambient-wrap-desktop"
        style={{
          position: "absolute",
          right: 0,
          top: "50%",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div style={{
          transform: "rotate(-90deg)",
          transformOrigin: "center center",
          fontFamily: F.brand,
          fontSize: 140,
          letterSpacing: "0.44em",
          textTransform: "uppercase",
          color: C.ivory,
          opacity: desktopTargetOpacity,
          transition: reduced ? "none" : `opacity ${ambientTransDuration} ease`,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}>
          {ambientLabel}
        </div>
      </div>

      {/* Ambient Fruit -- Mobile: bottom center, horizontal */}
      <div
        className="fa-ambient-mobile fa-ambient-wrap-mobile"
        style={{
          position: "absolute",
          bottom: 24,
          left: "50%",
          zIndex: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div style={{
          fontFamily: F.brand,
          fontSize: 80,
          letterSpacing: "0.44em",
          textTransform: "uppercase",
          color: C.ivory,
          opacity: mobileTargetOpacity,
          transition: reduced ? "none" : `opacity ${ambientTransDuration} ease`,
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}>
          {ambientLabel}
        </div>
      </div>

      {/* Progress -- z-index 2 so it sits above ambient */}
      <div style={{ maxWidth: 640, width: "100%", margin: "0 auto 48px", position: "relative", zIndex: 2 }}>
        <div className="fa-progress-track">
          <div className="fa-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivoryDim, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 12 }}>
          Question {currentQuestion + 1} of 27
        </div>
      </div>

      {/* Question + answers -- z-index 2 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 640, width: "100%", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div
          className={[qExitClass, qEnterClass].filter(Boolean).join(" ")}
          style={{ transition: "opacity 0.21s ease, transform 0.21s ease" }}
        >
          <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: "clamp(19px,2.5vw,22px)", color: C.ivory, lineHeight: 1.55, marginBottom: 48 }}>
            {q.text}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SCALE_OPTIONS.map(opt => (
              <AnswerOption
                key={opt.value}
                label={opt.label}
                isSelected={selected === opt.value}
                onClick={() => selectAnswer(opt.value)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation -- z-index 2 */}
      <div style={{ maxWidth: 640, width: "100%", margin: "32px auto 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2 }}>
        {currentQuestion > 0 ? (
          <button
            onClick={goBack}
            style={{ background: "none", border: "none", color: C.ivoryDim, fontFamily: F.body, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", padding: "8px 0" }}
          >
            &larr; Back
          </button>
        ) : <span />}
        <NextButton canAdvance={canAdvance} isLast={isLast} onClick={goNext} />
      </div>
    </div>
  );
}

function AnswerOption({ label, isSelected, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", maxWidth: 640,
        padding: "20px 24px", textAlign: "left",
        border: `1px solid ${isSelected ? C.gold : hov ? C.goldSoft : C.goldFaint}`,
        background: isSelected ? C.goldMid : hov ? "rgba(201,168,76,0.04)" : "transparent",
        color: C.ivory, fontFamily: F.body, fontWeight: 400, fontSize: 15,
        cursor: "pointer", transition: "border-color 0.2s ease, background 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function NextButton({ canAdvance, isLast, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={!canAdvance}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 36px", border: `1px solid ${C.gold}`, background: hov && canAdvance ? C.goldMid : "transparent",
        color: C.gold, fontFamily: F.brand, fontSize: 13, letterSpacing: "0.28em",
        textTransform: "uppercase", cursor: canAdvance ? "pointer" : "not-allowed",
        opacity: canAdvance ? 1 : 0.4, transition: "background 0.2s ease, opacity 0.2s ease",
      }}
    >
      {isLast ? "Complete Assessment \u2192" : "Next \u2192"}
    </button>
  );
}

/* ─── SCREEN 3: PROCESSING ────────────────────────────────────────────── */

function ProcessingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px",
    }}>
      <img
        src="/helmet.png"
        alt=""
        className="fa-helmet-pulse"
        style={{ width: 48, height: 48, filter: "invert(1) grayscale(1)", marginBottom: 40 }}
      />
      <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: C.ivory, textAlign: "center", maxWidth: 440, lineHeight: 1.6, margin: "0 0 16px" }}>
        &ldquo;Be still, and know that I am God.&rdquo;
      </p>
      <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase" }}>
        Psalm 46:10
      </div>
    </div>
  );
}

/* ─── SCREEN 4: RESULTS ───────────────────────────────────────────────── */

function ResultsScreen({ scores, primaryFruit, cluster, previousResult, isDeltaMode, setShareOpen,
  evidenceFruits, primaryEvidence, formationFruits, primaryFormation, scoreSpread }) {

  if (!scores || !primaryFruit) return null;

  const fruit = FRUITS[primaryFruit];
  const has7Day = (() => {
    try { return !!localStorage.getItem("cf-challenge-progress"); } catch { return false; }
  })();

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingBottom: 96 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px 0" }}>

        {/* Section 1: Header */}
        <div className="fa-up-0" style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
            Your Formation Profile
          </div>
          <h1 style={{ fontFamily: F.brand, fontSize: "clamp(26px,4vw,32px)", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginTop: 16, marginBottom: 20 }}>
            Where the Spirit Is at Work
          </h1>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: C.ivoryDim, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            This is where the Spirit is at work in you -- and where He has the most room.
          </p>
        </div>

        {/* Section 2: Formation Strata */}
        <FormationStrata scores={scores} evidenceFruits={evidenceFruits} formationFruits={formationFruits} />

        {/* Section 3: Evidence of Abiding */}
        <EvidenceSection scores={scores} evidenceFruits={evidenceFruits} primaryEvidence={primaryEvidence} />

        {/* Section 4: Transition */}
        <TransitionElement scoreSpread={scoreSpread} />

        {/* Section 5: Formation Edge */}
        <FormationEdgeSection scores={scores} formationFruits={formationFruits} primaryFormation={primaryFormation} />

        {/* Section F: Delta block (conditional) */}
        {isDeltaMode && previousResult && (
          <DeltaBlock scores={scores} primaryFruit={primaryFruit} fruit={fruit} previous={previousResult} />
        )}

        {/* Section 6: CTAs */}
        <div className="fa-cta-row" style={{ marginTop: 96, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <GoldButton onClick={() => setShareOpen(true)}>Share This</GoldButton>
          {!has7Day && (
            <Link
              to="/7-day-challenge"
              style={{ padding: "16px 28px", border: "none", background: "transparent", color: C.ivoryDim, fontFamily: F.body, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "underline", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
            >
              Begin the 7-Day Challenge &rarr;
            </Link>
          )}
        </div>

        {/* Rule of Life crosslink */}
        <div style={{ marginTop: 48, textAlign: "center" }}>
          <RuleOfLifeLink fruit={fruit} />
        </div>

      </div>
    </div>
  );
}

/* ─── FORMATION STRATA ────────────────────────────────────────────────── */

function FormationStrata({ scores, evidenceFruits, formationFruits }) {
  const containerRef = useRef(null);
  const rowRefs      = useRef([]);
  const fillRefs     = useRef([]);
  const accentRefs   = useRef([]);
  const topLabelRef  = useRef(null);
  const botLabelRef  = useRef(null);
  const ruleRef      = useRef(null);

  // Sort fruits highest score at top
  const sorted = [...Object.entries(scores)].sort(([, a], [, b]) => b - a);

  function getGroupForRank(rank) {
    if (rank < 3) return "evidence";
    if (rank < 6) return "middle";
    return "formation";
  }

  function getAccentColor(rank) {
    if (rank === 0)  return "rgba(250,248,245,0.62)";
    if (rank <= 2)   return "rgba(250,248,245,0.45)";
    if (rank <= 5)   return "transparent";
    if (rank === 6)  return "rgba(201,168,76,0.45)";
    if (rank === 7)  return "rgba(201,168,76,0.45)";
    return "#C9A84C"; // rank 8 = primaryFormation
  }

  function getFillColor(rank) {
    if (rank === 0) return ["rgba(250,248,245,0.12)", "rgba(250,248,245,0.10)"];
    if (rank === 1) return ["rgba(250,248,245,0.10)", "rgba(250,248,245,0.08)"];
    if (rank === 2) return ["rgba(250,248,245,0.08)", "rgba(250,248,245,0.07)"];
    if (rank <= 5)  return ["rgba(250,248,245,0.04)", "rgba(250,248,245,0.03)"];
    if (rank === 6) return ["rgba(201,168,76,0.06)",  "rgba(201,168,76,0.05)"];
    if (rank === 7) return ["rgba(201,168,76,0.08)",  "rgba(201,168,76,0.07)"];
    return ["rgba(201,168,76,0.12)", "rgba(201,168,76,0.10)"];
  }

  function getLabelColor(rank) {
    if (rank === 0) return "#FAF8F5";
    if (rank <= 2)  return "rgba(250,248,245,0.92)";
    if (rank <= 5)  return "rgba(250,248,245,0.62)";
    if (rank === 6) return "rgba(250,248,245,0.80)";
    if (rank === 7) return "rgba(250,248,245,0.92)";
    return "#FAF8F5";
  }

  function getScoreColor(rank) {
    if (rank <= 2)  return "rgba(250,248,245,0.62)";
    if (rank <= 5)  return "rgba(250,248,245,0.44)";
    if (rank === 6) return "rgba(201,168,76,0.62)";
    if (rank === 7) return "rgba(201,168,76,0.75)";
    return "#C9A84C";
  }

  const ROW_H_DESKTOP = 40;
  const SPACER_H      = 8;
  const TOTAL_ROWS    = 9;
  const CONTAINER_H   = TOTAL_ROWS * ROW_H_DESKTOP + 2 * SPACER_H;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = prefersReducedMotion();

    if (reduced) {
      gsap.set([containerRef.current, ...rowRefs.current, topLabelRef.current, botLabelRef.current], { opacity: 1 });
      fillRefs.current.forEach((f, i) => { if (f) { const score = sorted[i]?.[1] ?? 0; f.style.width = `${score}%`; } });
      accentRefs.current.forEach(a => { if (a) a.style.opacity = "1"; });
      return;
    }

    // Initial hidden state
    gsap.set(el, { opacity: 0 });
    gsap.set(rowRefs.current, { opacity: 0 });
    gsap.set(fillRefs.current.filter(Boolean), { width: "0%" });
    gsap.set(accentRefs.current.filter(Boolean), { opacity: 0 });
    gsap.set([topLabelRef.current, botLabelRef.current], { opacity: 0 });
    if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 0, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Step 1 (0.0-0.6s): container fades in
    tl.to(el, { opacity: 1, duration: 0.6 });

    // Step 2 (0.6-0.8s): center rule draws
    if (ruleRef.current) {
      tl.to(ruleRef.current, { scaleX: 1, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.6);
    }

    // Step 3 (0.8-2.0s): rows unfold from center
    // Center is between row 4 (index 4) and row 5 (index 5)
    // Rows 4,3,2,1,0 unfold upward; rows 5,6,7,8 unfold downward
    const centerIndex = 4;
    rowRefs.current.forEach((r, i) => {
      if (!r) return;
      const distFromCenter = Math.abs(i - centerIndex);
      const delay = 0.8 + distFromCenter * 0.12;
      tl.to(r, { opacity: 1, duration: 0.3, ease: "cubic-bezier(0.25,0.1,0.25,1)" }, delay);
    });

    // Step 4 (1.4-2.2s): fill washes animate in, bottom to top (rank 8 first, rank 0 last)
    fillRefs.current.forEach((f, i) => {
      if (!f) return;
      const reverseRank = TOTAL_ROWS - 1 - i; // 0=rank8, 8=rank0
      const score = sorted[i]?.[1] ?? 0;
      const delay = 1.4 + reverseRank * 0.08;
      tl.to(f, { width: `${score}%`, duration: 0.5, ease: "power1.out" }, delay);
    });

    // Step 5 (2.0-2.4s): accent bars fade in
    const accentedIndices = [0, 1, 2, 6, 7, 8];
    accentedIndices.forEach((rank, j) => {
      const a = accentRefs.current[rank];
      if (!a) return;
      tl.to(a, { opacity: 1, duration: 0.15 }, 2.0 + j * 0.08);
    });

    // Step 6 (2.4-2.9s): group labels
    tl.to(topLabelRef.current, { opacity: 1, duration: 0.2 }, 2.4);
    tl.to(botLabelRef.current, { opacity: 1, duration: 0.2 }, 2.6);

    return () => tl.kill();
  }, []);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto 0", position: "relative" }}>
      {/* Above label */}
      <div ref={topLabelRef} style={{ marginBottom: 12, paddingLeft: 8, opacity: 0 }}>
        <span style={{ fontFamily: F.brand, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: C.gold }}>
          Evidence of Abiding
        </span>
      </div>

      {/* Strata container */}
      <div
        ref={containerRef}
        style={{
          background: C.bgSurf,
          height: CONTAINER_H,
          position: "relative",
          opacity: 0,
        }}
      >
        {/* Center rule (for animation reference, sits at midpoint) */}
        <div
          ref={ruleRef}
          style={{
            position: "absolute",
            left: 0, right: 0,
            top: Math.floor(CONTAINER_H / 2),
            height: 1,
            background: C.goldFaint,
            transformOrigin: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {sorted.map(([key, score], rank) => {
          const [fillFrom, fillTo] = getFillColor(rank);
          const showSeparator = rank === 2 || rank === 5; // spacer after rank 2 and rank 5
          const accentColor = getAccentColor(rank);

          // Calculate top position including spacers
          let topPx = rank * ROW_H_DESKTOP;
          if (rank > 2) topPx += SPACER_H;
          if (rank > 5) topPx += SPACER_H;

          return (
            <React.Fragment key={key}>
              {showSeparator && (
                <div style={{
                  position: "absolute",
                  left: 0, right: 0,
                  top: rank * ROW_H_DESKTOP + (rank > 2 ? SPACER_H : 0),
                  height: SPACER_H,
                  background: "transparent",
                }} />
              )}
              <div
                ref={el => rowRefs.current[rank] = el}
                style={{
                  position: "absolute",
                  left: 0, right: 0,
                  top: topPx,
                  height: ROW_H_DESKTOP,
                  borderBottom: rank < 8 ? `1px solid ${C.goldFaint}` : "none",
                  opacity: 0,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {/* Accent bar */}
                <div
                  ref={el => accentRefs.current[rank] = el}
                  style={{
                    width: 3,
                    height: "100%",
                    background: accentColor === "transparent" ? "transparent" : accentColor,
                    flexShrink: 0,
                    opacity: accentColor === "transparent" ? 1 : 0,
                  }}
                />

                {/* Fill wash */}
                <div
                  ref={el => fillRefs.current[rank] = el}
                  style={{
                    position: "absolute",
                    left: 3, top: 0, bottom: 0,
                    width: "0%",
                    background: `linear-gradient(to right, ${fillFrom}, ${fillTo})`,
                    pointerEvents: "none",
                  }}
                />

                {/* Fruit label */}
                <div style={{
                  position: "relative",
                  zIndex: 1,
                  marginLeft: 21, // 3px accent + 18px padding
                  fontFamily: F.brand,
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: getLabelColor(rank),
                }}>
                  {FRUITS[key].label}
                </div>

                {/* Score percentage */}
                <div style={{
                  position: "absolute",
                  right: 24,
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: 11,
                  color: getScoreColor(rank),
                  zIndex: 1,
                }}>
                  {score}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Below label */}
      <div ref={botLabelRef} style={{ marginTop: 12, paddingLeft: 8, opacity: 0 }}>
        <span style={{ fontFamily: F.brand, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: C.gold }}>
          Formation Edge
        </span>
      </div>
    </div>
  );
}

/* ─── EVIDENCE OF ABIDING SECTION ────────────────────────────────────── */

function EvidenceSection({ scores, evidenceFruits, primaryEvidence }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.style.opacity = "1";
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    gsap.set(el, { opacity: 0, y: 24 });
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ marginTop: 128 }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
          Evidence of Abiding
        </div>
        <div style={{ width: 320, height: 1, background: C.gold, margin: "32px auto 0" }} />
        <h2 style={{ fontFamily: F.brand, fontSize: "clamp(28px,4vw,36px)", letterSpacing: "0.1em", textTransform: "uppercase", color: C.ivory, lineHeight: 1.1, marginTop: 32, marginBottom: 0 }}>
          What the Spirit<br />Is Producing
        </h2>
        <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: C.ivoryDim, lineHeight: 1.75, maxWidth: 520, margin: "24px auto 0" }}>
          These three fruits are most visible in your life right now. Not because of your effort. Because you have been abiding, and this is what abiding produces.
        </p>
      </div>

      {/* Fruit cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        {evidenceFruits.map((key, i) => {
          const fruit = FRUITS[key];
          const isPrimary = i === 0;
          return (
            <EvidenceFruitCard
              key={key}
              fruit={fruit}
              isPrimary={isPrimary}
              rank={i}
            />
          );
        })}
      </div>
    </div>
  );
}

function EvidenceFruitCard({ fruit, isPrimary }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.style.opacity = "1";
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    gsap.set(el, { opacity: 0, y: 16 });
    return () => obs.disconnect();
  }, []);

  const borderColor = isPrimary ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.15)";
  const eyebrowColor = isPrimary ? "rgba(201,168,76,0.62)" : "rgba(201,168,76,0.45)";
  const fruitSize = isPrimary ? 28 : 22;
  const greekSize = isPrimary ? 16 : 15;
  const stmtSize  = isPrimary ? 16 : 15;
  const stmtColor = isPrimary ? C.ivory : "rgba(250,248,245,0.88)";
  const eyebrowText = isPrimary ? "Most Evident" : "Also Visible";

  return (
    <div ref={cardRef} style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: 24 }}>
      <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: eyebrowColor }}>
        {eyebrowText}
      </div>
      <div style={{ fontFamily: F.brand, fontSize: fruitSize, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ivory, marginTop: 12 }}>
        {fruit.label}
      </div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: greekSize, color: C.ivoryDim, marginTop: 6 }}>
        {fruit.greek}
      </div>
      <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: stmtSize, color: stmtColor, lineHeight: 1.85, marginTop: 24 }}>
        {fruit.recognitionStatement}
      </p>
    </div>
  );
}

/* ─── TRANSITION ELEMENT ─────────────────────────────────────────────── */

function TransitionElement({ scoreSpread }) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.style.opacity = "1";
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, { opacity: 1, duration: 0.8, ease: "power2.out" });
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    gsap.set(el, { opacity: 0 });
    return () => obs.disconnect();
  }, []);

  const narrowSpread = scoreSpread < 15;
  const text = narrowSpread
    ? "Your fruits are maturing evenly in this season. There are still places where the Spirit has more room to work, and they are worth naming."
    : "And yet the Spirit is not finished. There is ground still being prepared.";

  return (
    <div ref={elRef} style={{ maxWidth: 720, margin: "128px auto", textAlign: "center" }}>
      <div style={{ width: 48, height: 1, background: "rgba(201,168,76,0.3)", margin: "0 auto" }} />
      <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 20, color: C.ivoryDim, lineHeight: 1.5, maxWidth: 480, margin: "32px auto 0" }}>
        {text}
      </p>
      <div style={{ width: 48, height: 1, background: "rgba(201,168,76,0.3)", margin: "32px auto 0" }} />
    </div>
  );
}

/* ─── FORMATION EDGE SECTION ─────────────────────────────────────────── */

function FormationEdgeSection({ scores, formationFruits, primaryFormation }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) {
      if (el) el.style.opacity = "1";
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    gsap.set(el, { opacity: 0, y: 24 });
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef} style={{ marginTop: 128 }}>
      {/* Section header */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
          Your Formation Edge
        </div>
        <div style={{ width: 320, height: 1, background: C.gold, margin: "32px auto 0" }} />
        <h2 style={{ fontFamily: F.brand, fontSize: "clamp(28px,4vw,36px)", letterSpacing: "0.1em", textTransform: "uppercase", color: C.ivory, lineHeight: 1.1, marginTop: 32, marginBottom: 0 }}>
          Where the Spirit<br />Has Room to Work
        </h2>
        <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: C.ivoryDim, lineHeight: 1.75, maxWidth: 520, margin: "24px auto 0" }}>
          These three fruits are where the work continues. This is not a verdict on your character. It is a map of where the Spirit is actively moving right now, and where your surrender is being asked for.
        </p>
      </div>

      {/* Fruit cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 64 }}>
        {formationFruits.map((key, i) => {
          const isPrimary = i === 0;
          return (
            <FormationFruitCard
              key={key}
              fruitKey={key}
              isPrimary={isPrimary}
            />
          );
        })}
      </div>
    </div>
  );
}

function FormationFruitCard({ fruitKey, isPrimary }) {
  const cardRef    = useRef(null);
  const ruleRef    = useRef(null);
  const eyebrowRef = useRef(null);
  const nameRef    = useRef(null);
  const greekRef   = useRef(null);
  const stmtRef    = useRef(null);
  const scriptRef  = useRef(null);
  const practRef   = useRef(null);
  const revealed   = useRef(false);

  const fruit = FRUITS[fruitKey];

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reduced = prefersReducedMotion();

    if (!isPrimary || reduced) {
      // Secondary cards: standard fade-in on scroll, or immediate for reduced motion
      if (reduced) {
        card.style.opacity = "1";
        return;
      }
      gsap.set(card, { opacity: 0, y: 16 });
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(card, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
          obs.disconnect();
        }
      }, { threshold: 0.2 });
      obs.observe(card);
      return () => obs.disconnect();
    }

    // Primary Formation card: Liturgical Reveal
    // Hide all elements initially
    gsap.set([eyebrowRef.current, nameRef.current, greekRef.current,
      stmtRef.current, scriptRef.current, practRef.current], { opacity: 0 });
    if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 0, opacity: 0 });
    if (nameRef.current) nameRef.current.style.clipPath = "inset(100% 0 0 0)";

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !revealed.current) {
        revealed.current = true;
        runLiturgicalReveal();
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(card);
    return () => obs.disconnect();
  }, [isPrimary]);

  function runLiturgicalReveal() {
    const rule    = ruleRef.current;
    const eyebrow = eyebrowRef.current;
    const name    = nameRef.current;
    const greek   = greekRef.current;
    const stmt    = stmtRef.current;
    const script  = scriptRef.current;
    const pract   = practRef.current;

    const tl = gsap.timeline();

    // Phase 1 (0.0-1.2s): rule draws from center
    tl.to(rule, {
      scaleX: 1, opacity: 1, duration: 1.2,
      ease: "cubic-bezier(0.19,1,0.22,1)",
    }, 0);

    // Phase 2 (1.2-1.6s): hold -- nothing, just gap

    // Phase 3a (1.6-2.2s): eyebrow enters from below, rule slides to final position
    tl.to(eyebrow, {
      opacity: 1, y: 0, duration: 0.6,
      ease: "cubic-bezier(0.25,0.1,0.25,1)",
    }, 1.6);

    // Phase 3b (2.0-2.9s): fruit name reveals via clip-path top-to-bottom
    tl.to(name, {
      opacity: 1, duration: 0.1,
    }, 2.0);
    tl.to(name, {
      clipPath: "inset(0% 0 0 0)", duration: 0.9,
      ease: "cubic-bezier(0.19,1,0.22,1)",
    }, 2.0);

    // Phase 3c (2.6-3.0s): Greek term fades in
    tl.to(greek, {
      opacity: 1, y: 0, duration: 0.4,
      ease: "power2.out",
    }, 2.6);

    // Phase 4 (2.8-3.6s): formation statement, scripture, practice
    tl.to(stmt,   { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 2.8);
    tl.to(script, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 3.0);
    tl.to(pract,  { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 3.2);
  }

  const borderColor = isPrimary ? "rgba(201,168,76,0.45)" : "rgba(201,168,76,0.15)";
  const eyebrowColor = isPrimary ? "rgba(201,168,76,0.62)" : "rgba(201,168,76,0.45)";
  const eyebrowText  = isPrimary ? "Where to Begin" : "Close Behind";
  const fruitSize    = isPrimary ? 28 : 22;
  const greekSize    = isPrimary ? 16 : 15;

  if (isPrimary) {
    return (
      <div ref={cardRef} style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: 24 }}>
        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          style={{
            fontFamily: F.body, fontWeight: 400, fontSize: 11,
            letterSpacing: "0.24em", textTransform: "uppercase",
            color: eyebrowColor, opacity: 0,
            transform: "translateY(20px)",
          }}
        >
          {eyebrowText}
        </div>

        {/* Gold rule (liturgical reveal seam) */}
        <div style={{ marginTop: 16, marginBottom: 4, position: "relative", height: 1 }}>
          <div
            ref={ruleRef}
            style={{
              position: "absolute", left: 0,
              width: 240, height: 1,
              background: C.gold,
              transformOrigin: "left center",
              opacity: 0,
            }}
          />
        </div>

        {/* Fruit name -- clip-path reveal */}
        <div
          ref={nameRef}
          style={{
            fontFamily: F.brand, fontSize: fruitSize,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: C.ivory, marginTop: 12,
            clipPath: "inset(100% 0 0 0)",
            opacity: 0,
          }}
        >
          {fruit.label}
        </div>

        {/* Greek term */}
        <div
          ref={greekRef}
          style={{
            fontFamily: F.serif, fontStyle: "italic", fontSize: greekSize,
            color: C.ivoryDim, marginTop: 6,
            opacity: 0, transform: "translateY(10px)",
          }}
        >
          {fruit.greek}
        </div>

        {/* Formation statement */}
        <p
          ref={stmtRef}
          style={{
            fontFamily: F.body, fontWeight: 300, fontSize: 16,
            color: C.ivory, lineHeight: 1.85, marginTop: 24,
            opacity: 0, transform: "translateY(16px)",
          }}
        >
          {fruit.formationStatement}
        </p>

        {/* Scripture block */}
        <div
          ref={scriptRef}
          style={{
            marginTop: 32, paddingTop: 24, paddingBottom: 24,
            borderTop: `1px solid ${C.goldFaint}`, borderBottom: `1px solid ${C.goldFaint}`,
            opacity: 0, transform: "translateY(16px)",
          }}
        >
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontWeight: 300, fontSize: 19, color: C.ivory, lineHeight: 1.55 }}>
            &ldquo;{fruit.scripture.text}&rdquo;
          </p>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase", marginTop: 14 }}>
            {fruit.scripture.reference}
          </div>
        </div>

        {/* Weekly practice */}
        <div ref={practRef} style={{ marginTop: 24, opacity: 0, transform: "translateY(16px)" }}>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
            This Week
          </div>
          <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: C.ivory, lineHeight: 1.7, marginTop: 12 }}>
            {fruit.practice}
          </p>
        </div>
      </div>
    );
  }

  // Secondary formation card
  return (
    <div ref={cardRef} style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: 24 }}>
      <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", color: eyebrowColor }}>
        {eyebrowText}
      </div>
      <div style={{ fontFamily: F.brand, fontSize: fruitSize, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ivory, marginTop: 12 }}>
        {fruit.label}
      </div>
      <div style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: greekSize, color: C.ivoryDim, marginTop: 6 }}>
        {fruit.greek}
      </div>
      <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 15, color: "rgba(250,248,245,0.88)", lineHeight: 1.8, marginTop: 20 }}>
        {fruit.secondaryFormationStatement}
      </p>
    </div>
  );
}

/* ─── SHARED HELPER COMPONENTS ───────────────────────────────────────── */

function GoldButton({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 28px", border: `1px solid ${C.gold}`, background: hov ? C.goldMid : "transparent",
        color: C.gold, fontFamily: F.brand, fontSize: 12, letterSpacing: "0.28em",
        textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease",
      }}
    >
      {children}
    </button>
  );
}

function RuleOfLifeLink({ fruit }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
      to={fruit.ruleOfLife.path}
      style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: hov ? C.gold : C.ivoryDim, textDecoration: "none", transition: "color 0.2s ease" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      This connects to the <span style={{ color: C.gold }}>{fruit.ruleOfLife.rhythm}</span> rhythm in your Rule of Life &rarr;
    </Link>
  );
}

function DeltaBlock({ scores, primaryFruit, fruit, previous }) {
  const prev = previous.scores || {};
  const dayCount = daysAgo(previous.completedAt);
  const primaryChanged = previous.primaryFruit !== primaryFruit;

  return (
    <div style={{ marginTop: 56, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
        <div style={{ width: 48, height: 1, background: C.goldFaint }} />
      </div>
      <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.goldSoft, textTransform: "uppercase" }}>
        Since Your Last Assessment
      </div>
      <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, marginTop: 8 }}>
        {dayCount} days ago
      </div>
      <div style={{ marginTop: 32 }}>
        {FRUIT_ORDER.map(k => {
          const diff = scores[k] - (prev[k] || 0);
          const arrow = diff >= 5 ? "\u2197" : diff <= -5 ? "\u2198" : "\u2192";
          const arrowColor = diff >= 5 ? C.gold : C.ivoryFaint;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <div style={{ width: 120, textAlign: "right", fontFamily: F.body, fontWeight: 400, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: C.ivoryDim }}>{FRUITS[k].label}</div>
              <div style={{ width: 40, textAlign: "right", fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivoryFaint }}>{prev[k] ?? "--"}</div>
              <div style={{ width: 20, textAlign: "center", fontSize: 14, color: arrowColor }}>{arrow}</div>
              <div style={{ width: 40, fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivory }}>{scores[k]}</div>
            </div>
          );
        })}
      </div>
      <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: primaryChanged ? C.ivory : C.ivoryDim, maxWidth: 480, margin: "32px auto 0", lineHeight: 1.7 }}>
        {primaryChanged
          ? `Your area of formation has shifted from ${FRUITS[previous.primaryFruit]?.label || previous.primaryFruit} to ${fruit.label}.`
          : `Your area of formation is still ${fruit.label}.`}
      </p>
      <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, marginTop: 8 }}>
        {primaryChanged ? "This is what abiding looks like over time. Keep going." : "Formation is slow work. The Spirit is not in a hurry."}
      </p>
    </div>
  );
}

/* ─── SCREEN 5: SHAREABLE CARD ────────────────────────────────────────── */

function ShareModal({ fruitKey, evidenceFruitKey, scores, format, setFormat, variant, setVariant, onClose }) {
  const canvasRef  = useRef(null);
  const [shareError, setShareError] = useState("");

  const fruit = fruitKey ? FRUITS[fruitKey] : null;
  const evidenceFruit = evidenceFruitKey ? FRUITS[evidenceFruitKey] : null;

  useEffect(() => {
    if (fruit) renderCard();
  }, [fruit, evidenceFruit, format, variant]);

  async function loadFonts() {
    try {
      await Promise.all([
        document.fonts.load("italic 700 72px 'Cormorant Garamond'"),
        document.fonts.load("italic 400 48px 'Cormorant Garamond'"),
        document.fonts.load("400 20px 'Michroma'"),
        document.fonts.load("300 18px 'Inter'"),
      ]);
    } catch {}
  }

  function wrapCanvasText(ctx, text, x, startY, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let y = startY;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, y);
    return y;
  }

  async function drawFormationEdgeCard(canvas, fruitData, fmt) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const dims = fmt === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1920 };
    canvas.width  = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width  = `${dims.w / 2}px`;
    canvas.style.height = `${dims.h / 2}px`;
    ctx.scale(dpr, dpr);

    const W = dims.w, H = dims.h;
    const isStory   = fmt === "story";
    const padTop    = isStory ? 200 : 88;
    const padBot    = isStory ? 160 : 64;
    const fruitSize = isStory ? 88 : 72;

    // Background
    ctx.fillStyle = "#06050A";
    ctx.fillRect(0, 0, W, H);

    // Eyebrow
    ctx.fillStyle = "#C9A84C";
    ctx.font = "400 20px 'Michroma', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COUNTER FORMATION  \u00B7  FRUIT OF THE SPIRIT", W / 2, padTop);

    // Gold rule
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 40, padTop + 40);
    ctx.lineTo(W / 2 + 40, padTop + 40);
    ctx.stroke();

    // Middle content
    const midY = isStory ? H / 2 - 120 : H / 2 - 80;

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "italic 400 48px 'Cormorant Garamond', serif";
    ctx.fillText("I am cultivating", W / 2, midY);

    ctx.fillStyle = "#C9A84C";
    ctx.font = `italic 700 ${fruitSize}px 'Cormorant Garamond', serif`;
    ctx.fillText(fruitData.label, W / 2, midY + fruitSize + 12);

    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "300 18px 'Inter', sans-serif";
    ctx.fillText("Not as a personality type. As an act of surrender.", W / 2, midY + fruitSize + 76);

    // Scripture
    const scriptY = midY + fruitSize + 140;
    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "italic 400 22px 'Cormorant Garamond', serif";
    const scriptText = `\u201C${fruitData.scripture.text}\u201D`;
    const lineY = wrapCanvasText(ctx, scriptText, W / 2, scriptY, 720, 34);

    ctx.fillStyle = "#C9A84C";
    ctx.font = "400 14px 'Michroma', sans-serif";
    ctx.fillText(fruitData.scripture.reference.toUpperCase(), W / 2, lineY + 20);

    // Bottom
    await drawBottomHelmet(ctx, W, H, padBot);
  }

  async function drawBothFruitsCard(canvas, evidenceData, formationData, fmt) {
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const dims = fmt === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1920 };
    canvas.width  = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width  = `${dims.w / 2}px`;
    canvas.style.height = `${dims.h / 2}px`;
    ctx.scale(dpr, dpr);

    const W = dims.w, H = dims.h;
    const isStory = fmt === "story";
    const padTop  = isStory ? 180 : 88;
    const padBot  = isStory ? 140 : 64;
    const mult    = isStory ? 1.4 : 1.0;
    const decLineSize = isStory ? 42 : 38;
    const fruitSize   = isStory ? 64 : 52;

    // Background
    ctx.fillStyle = "#06050A";
    ctx.fillRect(0, 0, W, H);

    // Top eyebrow
    ctx.fillStyle = "#C9A84C";
    ctx.font = "400 20px 'Michroma', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COUNTER FORMATION  \u00B7  FRUIT OF THE SPIRIT", W / 2, padTop);

    // Top gold rule
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 40, padTop + 40 * mult);
    ctx.lineTo(W / 2 + 40, padTop + 40 * mult);
    ctx.stroke();

    // Upper middle zone
    const upperY = padTop + 40 * mult + 48 * mult;
    ctx.fillStyle = "#C9A84C";
    ctx.font = "400 14px 'Michroma', sans-serif";
    ctx.fillText("EVIDENCE", W / 2, upperY);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = `italic 400 ${decLineSize}px 'Cormorant Garamond', serif`;
    ctx.fillText("The Spirit is producing", W / 2, upperY + 12 * mult + decLineSize);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = `400 ${fruitSize}px 'Michroma', sans-serif`;
    ctx.fillText(evidenceData.label.toUpperCase(), W / 2, upperY + 12 * mult + decLineSize + 8 * mult + fruitSize);

    // Center divider
    const centerDividerY = upperY + 12 * mult + decLineSize + 8 * mult + fruitSize + 64 * mult;
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, centerDividerY);
    ctx.lineTo(W / 2 + 80, centerDividerY);
    ctx.stroke();

    // Lower middle zone
    const lowerY = centerDividerY + 64 * mult;
    ctx.fillStyle = "#C9A84C";
    ctx.font = "400 14px 'Michroma', sans-serif";
    ctx.fillText("FORMATION EDGE", W / 2, lowerY);

    ctx.fillStyle = "#FAF8F5";
    ctx.font = `italic 400 ${decLineSize}px 'Cormorant Garamond', serif`;
    ctx.fillText("I am cultivating", W / 2, lowerY + 12 * mult + decLineSize);

    ctx.fillStyle = "#C9A84C";
    ctx.font = `400 ${fruitSize}px 'Michroma', sans-serif`;
    ctx.fillText(formationData.label.toUpperCase(), W / 2, lowerY + 12 * mult + decLineSize + 8 * mult + fruitSize);

    // Sub-copy
    const subY = lowerY + 12 * mult + decLineSize + 8 * mult + fruitSize + 64 * mult;
    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "300 16px 'Inter', sans-serif";
    ctx.fillText("Not as a personality type. As an act of surrender.", W / 2, subY);

    // Bottom
    await drawBottomHelmet(ctx, W, H, padBot);
  }

  async function drawBottomHelmet(ctx, W, H, padBot) {
    try {
      const helmetImg = new Image();
      helmetImg.src = "/helmet.png";
      await new Promise((res, rej) => {
        helmetImg.onload = res;
        helmetImg.onerror = rej;
        setTimeout(rej, 3000);
      });
      const hSize = 40;
      const hX = W / 2 - hSize / 2;
      const hY = H - padBot - hSize - 24;
      const off = document.createElement("canvas");
      off.width  = helmetImg.naturalWidth  || 40;
      off.height = helmetImg.naturalHeight || 40;
      const offCtx = off.getContext("2d");
      offCtx.filter = "invert(1)";
      offCtx.drawImage(helmetImg, 0, 0);
      ctx.drawImage(off, hX, hY, hSize, hSize);
    } catch {}

    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "300 14px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COUNTERFORMED.COM", W / 2, H - padBot);
  }

  async function renderCard() {
    if (!canvasRef.current || !fruit) return;
    await loadFonts();
    if (variant === "both" && evidenceFruit) {
      await drawBothFruitsCard(canvasRef.current, evidenceFruit, fruit, format);
    } else {
      await drawFormationEdgeCard(canvasRef.current, fruit, format);
    }
  }

  async function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cf-fruit-${fruitKey || "formation"}.png`;
    a.click();
  }

  async function handleShare() {
    if (!canvasRef.current) return;
    setShareError("");
    try {
      const url  = canvasRef.current.toDataURL("image/png");
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `cf-fruit-${fruitKey || "formation"}.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Counter Formation" });
      } else {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setShareError("Image copied to clipboard.");
      }
    } catch {
      setShareError("Right-click the image above to save it.");
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(6,5,10,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: 24,
    }}>
      <div style={{
        maxWidth: 560, width: "100%", background: C.bgCard,
        border: `1px solid ${C.goldFaint}`, padding: "32px 24px",
        position: "relative", maxHeight: "90vh", overflowY: "auto",
      }}>
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: C.ivoryDim, fontSize: 24, cursor: "pointer", padding: 8, lineHeight: 1 }}
        >
          &times;
        </button>

        <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>
          Share Your Formation
        </div>
        <h2 style={{ fontFamily: F.brand, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginBottom: 24 }}>
          Generate Your Card
        </h2>

        <div style={{ textAlign: "center", marginBottom: 24, overflowX: "auto" }}>
          <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto", maxWidth: "100%", height: "auto" }} />
        </div>

        {/* Format toggle */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: F.brand, fontSize: 10, letterSpacing: "0.24em", color: C.ivoryFaint, textTransform: "uppercase", marginBottom: 8 }}>Format</div>
          <div style={{ display: "flex", gap: 8 }}>
            <FormatPill label="Square" active={format === "square"} onClick={() => setFormat("square")} />
            <FormatPill label="Story"  active={format === "story"}  onClick={() => setFormat("story")}  />
          </div>
        </div>

        {/* Variant toggle */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: F.brand, fontSize: 10, letterSpacing: "0.24em", color: C.ivoryFaint, textTransform: "uppercase", marginBottom: 8 }}>Variant</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <FormatPill label="Formation Edge" active={variant === "formation"} onClick={() => setVariant("formation")} />
            <FormatPill label="Both Fruits"    active={variant === "both"}      onClick={() => setVariant("both")}      />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <GoldButton onClick={handleDownload}>Download PNG</GoldButton>
          <button
            onClick={handleShare}
            style={{ padding: "14px 24px", border: "none", background: "transparent", color: C.ivory, fontFamily: F.body, fontSize: 13, cursor: "pointer" }}
          >
            Share
          </button>
        </div>

        {shareError && (
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ivoryDim, textAlign: "center", marginTop: 12 }}>
            {shareError}
          </p>
        )}
      </div>
    </div>
  );
}

function FormatPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 16px",
        border: `1px solid ${active ? C.gold : C.goldFaint}`,
        background: "transparent",
        color: active ? C.gold : C.ivoryDim,
        fontFamily: F.brand, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
        cursor: "pointer", borderRadius: 999, transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}
