import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
  ivoryBar:   "rgba(250,248,245,0.45)",
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
  .fa-bar-track {
    height: 4px;
    background: rgba(250,248,245,0.08);
    border-radius: 2px;
    overflow: hidden;
    flex: 1;
  }
  .fa-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 800ms ease-out;
  }
  @keyframes faPulse {
    0%, 100% { transform: scale(1);    opacity: 0.4; }
    50%       { transform: scale(1.08); opacity: 0.7; }
  }
  .fa-helmet-pulse { animation: faPulse 2.4s ease-in-out infinite; }
  @media (max-width: 640px) {
    .fa-fruit-bg { display: none; }
    .fa-cta-row { flex-direction: column !important; }
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

function formatDate(isoString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).format(new Date(isoString));
}

function daysAgo(isoString) {
  return Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24));
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
  const [qExitClass, setQExitClass]           = useState("");
  const [qEnterClass, setQEnterClass]         = useState("");
  const [qTransitioning, setQTransitioning]   = useState(false);

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
    const newResult = {
      completedAt: new Date().toISOString(),
      answers: finalAnswers,
      scores: sc,
      primaryFruit: pf,
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
    setScreen("processing");
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
        completeAssessment(answers);
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

  const qProps = { qExitClass, qEnterClass, answers, currentQuestion, selectAnswer, goNext, goBack, qTransitioning };
  const rProps = { scores, primaryFruit, cluster, previousResult, isDeltaMode, setShareOpen };

  return (
    <div className="fa-shell">
      {screen === "pre-intro" && (
        <PreIntroScreen
          previous={previousResult}
          onView={() => {
            setScores(previousResult.scores);
            setPrimaryFruit(previousResult.primaryFruit);
            setCluster(previousResult.cluster || []);
            setScreen("results");
          }}
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
          fruit={primaryFruit ? FRUITS[primaryFruit] : null}
          format={shareFormat}
          setFormat={setShareFormat}
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
      {/* Background fruit name texture */}
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

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", padding: "32px 24px" }}>
      {/* Progress */}
      <div style={{ maxWidth: 640, width: "100%", margin: "0 auto 48px" }}>
        <div className="fa-progress-track">
          <div className="fa-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivoryDim, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 12 }}>
          Question {currentQuestion + 1} of 27
        </div>
      </div>

      {/* Question + answers */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 640, width: "100%", margin: "0 auto" }}>
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

      {/* Navigation */}
      <div style={{ maxWidth: 640, width: "100%", margin: "32px auto 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

function ResultsScreen({ scores, primaryFruit, cluster, previousResult, isDeltaMode, setShareOpen }) {
  const [barsVisible, setBarsVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBarsVisible(true), 100); return () => clearTimeout(t); }, []);

  if (!scores || !primaryFruit) return null;
  const fruit = FRUITS[primaryFruit];
  const sorted = [...Object.entries(scores)].sort(([, a], [, b]) => b - a);

  const has7Day = (() => {
    try { return !!localStorage.getItem("cf-challenge-progress"); } catch { return false; }
  })();

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "96px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Section A: Header */}
        <div className="fa-up-0" style={{ marginBottom: 56, textAlign: "center" }}>
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

        {/* Section B: Profile chart */}
        <div className="fa-up-1" style={{ marginBottom: 80 }}>
          {sorted.map(([key, score], i) => {
            const isPrimary = key === primaryFruit;
            const isCluster = cluster.includes(key);
            const barColor = (isPrimary || isCluster) ? C.gold : C.ivoryBar;
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 16, height: 40, marginBottom: 4 }}>
                <div style={{ width: 120, textAlign: "right", fontFamily: F.body, fontWeight: 400, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: isPrimary ? C.ivory : C.ivoryDim, flexShrink: 0 }}>
                  {FRUITS[key].label}
                </div>
                <div className="fa-bar-track">
                  <div
                    className="fa-bar-fill"
                    style={{
                      width: barsVisible ? `${score}%` : "0%",
                      background: barColor,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
                <div style={{ width: 40, fontFamily: F.body, fontWeight: 300, fontSize: 13, color: isPrimary ? C.ivory : C.ivoryDim, flexShrink: 0 }}>
                  {score}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 80px" }}>
          <div style={{ width: 64, height: 1, background: C.goldFaint }} />
        </div>

        {/* Section D: Primary fruit block */}
        <div className="fa-up-2" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
            Your Current Area of Formation
          </div>
          <h2 style={{ fontFamily: F.brand, fontSize: "clamp(32px,5vw,42px)", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginTop: 20, marginBottom: 8 }}>
            {fruit.label}
          </h2>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 18, color: C.ivoryDim, margin: "0 0 40px" }}>
            {fruit.greek}
          </p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 17, color: C.ivory, lineHeight: 1.85, maxWidth: 560, margin: "0 auto 40px", textAlign: "center" }}>
            {fruit.formationStatement}
          </p>

          {/* Scripture */}
          <div style={{ maxWidth: 520, margin: "0 auto 40px" }}>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: C.ivory, lineHeight: 1.6, margin: "0 0 12px" }}>
              &ldquo;{fruit.scripture.text}&rdquo;
            </p>
            <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase" }}>
              {fruit.scripture.reference}
            </div>
          </div>

          {/* Practice */}
          <div>
            <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 16 }}>
              This Week
            </div>
            <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 16, color: C.ivory, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
              {fruit.practice}
            </p>
          </div>
        </div>

        {/* Section E: Cluster block */}
        {cluster.length > 0 && (
          <div className="fa-up-3" style={{ marginTop: 56, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ width: 48, height: 1, background: C.goldFaint }} />
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.goldSoft, textTransform: "uppercase" }}>
              Close Behind
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivoryDim, marginTop: 12 }}>
              {cluster.map(k => FRUITS[k].label).join(" \u00B7 ")}
            </div>
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 15, color: C.ivoryDim, lineHeight: 1.75, maxWidth: 500, margin: "20px auto 0" }}>
              These fruits scored close to your primary area of formation. They likely share a common root -- working on the primary often moves all of them together.
            </p>
          </div>
        )}

        {/* Section F: Delta block */}
        {isDeltaMode && previousResult && (
          <DeltaBlock scores={scores} primaryFruit={primaryFruit} fruit={fruit} previous={previousResult} />
        )}

        {/* Section G: CTAs */}
        <div className="fa-up-5 fa-cta-row" style={{ marginTop: 64, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <ShareButton onClick={() => setShareOpen(true)} />
          {!has7Day && (
            <Link
              to="/7-day-challenge"
              style={{ padding: "16px 28px", border: "none", background: "transparent", color: C.ivoryDim, fontFamily: F.body, fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", textDecoration: "underline", cursor: "pointer", display: "inline-flex", alignItems: "center" }}
            >
              Begin the 7-Day Challenge &rarr;
            </Link>
          )}
        </div>

        {/* Section H: Rule of Life crosslink */}
        <div className="fa-up-6" style={{ marginTop: 48, textAlign: "center" }}>
          <RuleOfLifeLink fruit={fruit} />
        </div>

      </div>
    </div>
  );
}

function ShareButton({ onClick }) {
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
      Share This
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
    <div className="fa-up-4" style={{ marginTop: 56, textAlign: "center" }}>
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

function ShareModal({ fruit, format, setFormat, onClose }) {
  const canvasRef = useRef(null);
  const [shareError, setShareError] = useState("");

  useEffect(() => {
    if (fruit) renderCard();
  }, [fruit, format]);

  async function renderCard() {
    if (!canvasRef.current || !fruit) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const dims = format === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1920 };

    canvas.width  = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width  = `${dims.w / 2}px`;
    canvas.style.height = `${dims.h / 2}px`;
    ctx.scale(dpr, dpr);

    try {
      await Promise.all([
        document.fonts.load("italic 700 72px 'Cormorant Garamond'"),
        document.fonts.load("400 20px 'Michroma'"),
        document.fonts.load("300 18px 'Inter'"),
      ]);
    } catch {}

    const W = dims.w, H = dims.h;
    const isStory = format === "story";
    const padTop = isStory ? 200 : 88;
    const padBot = isStory ? 160 : 64;
    const fruitFontSize = isStory ? 88 : 72;

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
    ctx.font = `italic 700 ${fruitFontSize}px 'Cormorant Garamond', serif`;
    ctx.fillText(fruit.label, W / 2, midY + fruitFontSize + 12);

    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "300 18px 'Inter', sans-serif";
    ctx.fillText("Not as a personality type. As an act of surrender.", W / 2, midY + fruitFontSize + 76);

    // Scripture
    const scriptY = midY + fruitFontSize + 140;
    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "italic 400 22px 'Cormorant Garamond', serif";
    const scriptText = `\u201C${fruit.scripture.text}\u201D`;
    const lineHeight = 34;
    const lineY = wrapCanvasText(ctx, scriptText, W / 2, scriptY, 720, lineHeight);

    ctx.fillStyle = "#C9A84C";
    ctx.font = "400 14px 'Michroma', sans-serif";
    ctx.fillText(fruit.scripture.reference.toUpperCase(), W / 2, lineY + 20);

    // Bottom: helmet + domain
    try {
      const helmetImg = new Image();
      helmetImg.src = "/helmet.png";
      await new Promise((res, rej) => { helmetImg.onload = res; helmetImg.onerror = rej; setTimeout(rej, 3000); });
      const hSize = 40;
      const hX = W / 2 - hSize / 2;
      const hY = H - padBot - hSize - 24;
      const off = document.createElement("canvas");
      off.width = helmetImg.naturalWidth || 40;
      off.height = helmetImg.naturalHeight || 40;
      const offCtx = off.getContext("2d");
      offCtx.filter = "invert(1)";
      offCtx.drawImage(helmetImg, 0, 0);
      ctx.drawImage(off, hX, hY, hSize, hSize);
    } catch {}

    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = "300 14px 'Inter', sans-serif";
    ctx.fillText("COUNTERFORMED.COM", W / 2, H - padBot);
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

  async function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cf-fruit-${fruit?.key || "formation"}.png`;
    a.click();
  }

  async function handleShare() {
    if (!canvasRef.current) return;
    setShareError("");
    try {
      const url = canvasRef.current.toDataURL("image/png");
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `cf-fruit-${fruit?.key || "formation"}.png`, { type: "image/png" });
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

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          <FormatPill label="Square" active={format === "square"} onClick={() => setFormat("square")} />
          <FormatPill label="Story"  active={format === "story"}  onClick={() => setFormat("story")}  />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <DownloadButton onClick={handleDownload} />
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
        padding: "6px 16px", border: `1px solid ${active ? C.gold : C.goldFaint}`,
        background: "transparent", color: active ? C.gold : C.ivoryDim,
        fontFamily: F.brand, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
        cursor: "pointer", borderRadius: 999, transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function DownloadButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "14px 24px", border: `1px solid ${C.gold}`, background: hov ? C.goldMid : "transparent",
        color: C.gold, fontFamily: F.brand, fontSize: 12, letterSpacing: "0.28em",
        textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease",
      }}
    >
      Download PNG
    </button>
  );
}
