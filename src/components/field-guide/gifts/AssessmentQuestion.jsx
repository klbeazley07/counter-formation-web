import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { giftsByKey } from "../../../data/gifts";
import {
  QUESTION_MANIFEST,
  TOTAL_QUESTIONS,
  INCLINATION_SCALE,
  FREQUENCY_SCALE,
  loadProgress,
  saveProgress,
  emptyProgress,
  recordResponse,
  getStoredResponseValue,
} from "../../../utils/giftsAssessmentStorage";
import AssessmentProgress from "./AssessmentProgress";
import { GiftTransition, CharismaticIntro } from "./AssessmentTransition";

/* ─── TOKENS ──────────────────────────────────────────────────────────── */


const F = {
  display: "'Cormorant Garamond', serif",
  caps: "'Barlow Condensed', sans-serif",
  body: "'Inter', sans-serif",
};

const CATEGORY_LABEL = {
  manifestation: "Manifestation",
  ministry: "Ministry",
  equipping: "Equipping",
  charismatic: "Charismatic",
};

function eyebrowFor(gift, item) {
  const name = gift.name.toUpperCase();
  if (item.type === "inclination") {
    return `${name} -- ${item.subIdx + 1} OF 3`;
  }
  if (item.type === "directExperience") {
    return `${name} -- DIRECT EXPERIENCE`;
  }
  return `${name} -- FRUITFULNESS`;
}

const TRANSITION_DURATION_MS = 2200;

/* ─── HELPERS ─────────────────────────────────────────────────────────── */

function questionTextFor(gift, item) {
  if (item.type === "inclination") return gift.inclinationQuestions[item.subIdx];
  if (item.type === "directExperience") return gift.directExperienceQuestion;
  if (item.type === "fruitfulness") return gift.fruitfulnessQuestion;
  return "";
}

// True when `nextItem` belongs to a different gift than `prevItem`.
function crossesGiftBoundary(prevItem, nextItem) {
  if (!prevItem || !nextItem) return false;
  return prevItem.giftKey !== nextItem.giftKey;
}

// True when `nextItem` is the very first question of a charismatic gift, and
// the user has not yet seen the charismatic intro on this run.
function shouldShowCharismaticIntro(nextItem, charismaticIntroSeen) {
  if (charismaticIntroSeen) return false;
  if (!nextItem) return false;
  const gift = giftsByKey[nextItem.giftKey];
  if (!gift || gift.category !== "charismatic") return false;
  return nextItem.type === "directExperience";
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */

export default function AssessmentQuestion() {
  const navigate = useNavigate();

  // Hydrate from localStorage on first render.
  // If a completed assessment is found, set null to trigger a redirect to results
  // rather than clobbering the completed data with a fresh empty state.
  const [progress, setProgress] = useState(() => {
    const saved = loadProgress();
    if (!saved) return emptyProgress();
    if (saved.completedAt || saved.qIdx >= TOTAL_QUESTIONS) return null;
    return saved;
  });

  // Screen state machine:
  //   "question"          -- the question screen
  //   "gift-transition"   -- 2-3s pause between gifts
  //   "charismatic-intro" -- the framing screen before the charismatic gifts
  const [screen, setScreen] = useState("question");
  const [pendingNextIdx, setPendingNextIdx] = useState(null);
  const [exitDir, setExitDir] = useState(null); // "left" | "right" | null
  const [enterDir, setEnterDir] = useState(null);
  const transitioningRef = useRef(false);

  // Completed assessment landed here -- redirect to results without touching data.
  useEffect(() => {
    if (progress === null) {
      navigate("/field-guide/gifts/results", { replace: true });
    }
  }, [progress, navigate]);

  useEffect(() => {
    document.title = "Spiritual Gifts Assessment · Counter Formation";
  }, []);

  useEffect(() => {
    if (progress === null) return;
    window.scrollTo(0, 0);
  }, [screen, progress?.qIdx]);

  // Persist on every progress change.
  useEffect(() => {
    if (progress === null) return;
    saveProgress(progress);
  }, [progress]);

  const currentItem = progress ? QUESTION_MANIFEST[progress.qIdx] : null;
  const currentGift = currentItem ? giftsByKey[currentItem.giftKey] : null;
  const currentValue = currentItem ? getStoredResponseValue(progress, currentItem) : null;

  /* ── Navigation ──────────────────────────────────────────────────── */

  const advanceToIndex = useCallback(
    (nextIdx, fromItem) => {
      const nextItem = QUESTION_MANIFEST[nextIdx];

      // Charismatic intro takes precedence over the gift-transition pause.
      if (shouldShowCharismaticIntro(nextItem, progress.charismaticIntroSeen)) {
        setPendingNextIdx(nextIdx);
        setScreen("charismatic-intro");
        return;
      }

      if (crossesGiftBoundary(fromItem, nextItem)) {
        setPendingNextIdx(nextIdx);
        setScreen("gift-transition");
        return;
      }

      // In-gift advance: simple slide.
      setProgress((p) => ({ ...p, qIdx: nextIdx }));
      setExitDir(null);
      setEnterDir("right");
      window.setTimeout(() => setEnterDir(null), 240);
    },
    [progress.charismaticIntroSeen],
  );

  const handleAdvance = useCallback(
    (valueOverride, opts = {}) => {
      if (transitioningRef.current) return;
      const item = currentItem;
      if (!item) return;

      const value = valueOverride ?? currentValue;
      if (value == null && !opts.skipped) return; // need an answer

      transitioningRef.current = true;

      // Persist response.
      const recordedValue = value ?? 2; // neutral when skipping
      const nextProgress = recordResponse(progress, item, recordedValue, {
        skipped: !!opts.skipped,
      });

      const isLast = progress.qIdx >= TOTAL_QUESTIONS - 1;
      if (isLast) {
        const completed = {
          ...nextProgress,
          qIdx: TOTAL_QUESTIONS,
          completedAt: new Date().toISOString(),
        };
        setProgress(completed);
        saveProgress(completed);
        navigate("/field-guide/gifts/processing", { replace: true });
        return;
      }

      const nextIdx = progress.qIdx + 1;
      const advancedProgress = { ...nextProgress, qIdx: nextIdx };

      setExitDir("left");
      window.setTimeout(() => {
        setProgress(advancedProgress);
        advanceToIndex(nextIdx, item);
        transitioningRef.current = false;
      }, 220);
    },
    [advanceToIndex, currentItem, currentValue, navigate, progress],
  );

  const handleBack = useCallback(() => {
    if (transitioningRef.current) return;
    if (progress.qIdx <= 0) return;
    transitioningRef.current = true;
    const prevIdx = progress.qIdx - 1;
    setExitDir("right");
    window.setTimeout(() => {
      setProgress((p) => ({ ...p, qIdx: prevIdx }));
      setExitDir(null);
      setEnterDir("left");
      window.setTimeout(() => setEnterDir(null), 240);
      transitioningRef.current = false;
    }, 220);
  }, [progress.qIdx]);

  const handleSkip = useCallback(() => {
    handleAdvance(2, { skipped: true });
  }, [handleAdvance]);

  const handleSaveAndExit = useCallback(() => {
    saveProgress(progress);
    navigate("/field-guide/gifts");
  }, [navigate, progress]);

  /* ── Keyboard ────────────────────────────────────────────────────── */

  useEffect(() => {
    if (screen !== "question") return;
    function onKey(e) {
      if (e.key >= "1" && e.key <= "5") {
        const v = parseInt(e.key, 10) - 1;
        setProgress((p) => recordResponse(p, currentItem, v));
        return;
      }
      if ((e.key === "Enter" || e.key === "ArrowRight") && currentValue != null) {
        handleAdvance();
        return;
      }
      if (e.key === "ArrowLeft" && progress.qIdx > 0) {
        handleBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, currentItem, currentValue, progress.qIdx, handleAdvance, handleBack]);

  /* ── Transition handlers ────────────────────────────────────────── */

  const finishGiftTransition = useCallback(() => {
    setScreen("question");
    setExitDir(null);
    setEnterDir("right");
    window.setTimeout(() => setEnterDir(null), 240);
    setPendingNextIdx(null);
  }, []);

  const finishCharismaticIntro = useCallback(() => {
    setProgress((p) => ({ ...p, charismaticIntroSeen: true }));
    // The very next gift is charismatic -- show its transition too.
    setScreen("gift-transition");
  }, []);

  /* ── Render ──────────────────────────────────────────────────────── */

  // Redirect in progress (completed assessment found) -- render nothing.
  if (progress === null) return null;

  if (screen === "charismatic-intro") {
    return <CharismaticIntro onContinue={finishCharismaticIntro} />;
  }

  if (screen === "gift-transition" && pendingNextIdx != null) {
    const nextGift = giftsByKey[QUESTION_MANIFEST[pendingNextIdx].giftKey];
    return (
      <GiftTransition
        gift={nextGift}
        durationMs={TRANSITION_DURATION_MS}
        onComplete={finishGiftTransition}
      />
    );
  }

  // Question screen.
  if (!currentItem || !currentGift) return null;

  const questionText = questionTextFor(currentGift, currentItem);
  const scale = currentItem.type === "inclination" ? INCLINATION_SCALE : FREQUENCY_SCALE;
  const eyebrow = eyebrowFor(currentGift, currentItem);
  const isFirstQuestion = progress.qIdx === 0;

  const exitClass = exitDir === "left" ? "cf-q-exit-left" : exitDir === "right" ? "cf-q-exit-right" : "";
  const enterClass = enterDir === "right" ? "cf-q-enter-right" : enterDir === "left" ? "cf-q-enter-left" : "";

  return (
    <main
      style={{
        background: "var(--cf-hero-bg)",
        color: "var(--cf-ivory)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "40px 24px 32px",
      }}
    >
      <style>{`
        @keyframes cfQEnterRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes cfQEnterLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .cf-q-exit-left  { opacity: 0 !important; transform: translateX(-20px) !important; }
        .cf-q-exit-right { opacity: 0 !important; transform: translateX(20px) !important; }
        .cf-q-enter-right { animation: cfQEnterRight 220ms ease both; }
        .cf-q-enter-left  { animation: cfQEnterLeft 220ms ease both; }
        @media (max-width: 640px) {
          .cf-q-scale-grid { gap: 8px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cf-q-exit-left, .cf-q-exit-right, .cf-q-enter-right, .cf-q-enter-left {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Progress + small category eyebrow */}
      <div style={{ maxWidth: 720, width: "100%", margin: "0 auto 40px" }}>
        <AssessmentProgress current={progress.qIdx + 1} total={TOTAL_QUESTIONS} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 14,
            fontFamily: F.caps,
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--cf-ivory-62)",
          }}
        >
          <span>{CATEGORY_LABEL[currentGift.category] || ""}</span>
          <span style={{ color: "var(--cf-ivory-35)" }}>
            {progress.qIdx + 1} / {TOTAL_QUESTIONS}
          </span>
        </div>
      </div>

      {/* Question body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: 720,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div
          className={[exitClass, enterClass].filter(Boolean).join(" ")}
          style={{ transition: "opacity 220ms ease, transform 220ms ease" }}
        >
          {/* Gift eyebrow */}
          <div
            style={{
              fontFamily: F.caps,
              fontSize: 11,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "var(--cf-gold)",
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            {eyebrow}
          </div>

          {/* Question */}
          <p
            style={{
              fontFamily: F.display,
              fontStyle: "italic",
              fontSize: "clamp(22px, 3.2vw, 28px)",
              lineHeight: 1.45,
              color: "var(--cf-ivory)",
              maxWidth: 580,
              margin: "0 auto 44px",
              textAlign: "center",
            }}
          >
            {questionText}
          </p>

          {/* Scale */}
          <div
            className="cf-q-scale-grid"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            {scale.map((opt) => (
              <ScaleButton
                key={opt.value}
                label={opt.label}
                index={opt.value}
                isSelected={currentValue === opt.value}
                onClick={() => {
                  setProgress((p) => recordResponse(p, currentItem, opt.value));
                  // Auto-advance for snappy feel.
                  window.setTimeout(() => handleAdvance(opt.value), 180);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          maxWidth: 720,
          width: "100%",
          margin: "36px auto 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <button
          onClick={handleBack}
          disabled={isFirstQuestion}
          style={{
            background: "none",
            border: "none",
            color: isFirstQuestion ? "var(--cf-ivory-35)" : "var(--cf-ivory-62)",
            fontFamily: F.body,
            fontSize: 13,
            letterSpacing: "0.04em",
            cursor: isFirstQuestion ? "default" : "pointer",
            padding: "8px 4px",
            opacity: isFirstQuestion ? 0.4 : 1,
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (!isFirstQuestion) e.currentTarget.style.color = "var(--cf-ivory)";
          }}
          onMouseLeave={(e) => {
            if (!isFirstQuestion) e.currentTarget.style.color = "var(--cf-ivory-62)";
          }}
        >
          &larr; Previous
        </button>

        <button
          onClick={handleSkip}
          style={{
            background: "none",
            border: "none",
            color: "var(--cf-ivory-62)",
            fontFamily: F.body,
            fontSize: 13,
            letterSpacing: "0.04em",
            cursor: "pointer",
            padding: "8px 4px",
            transition: "color 200ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cf-ivory)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--cf-ivory-62)")}
          title="Records a neutral response and flags the question. Skipping reduces the accuracy of your results."
        >
          Skip this question &rarr;
        </button>
      </div>

      {/* Save and return later */}
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <button
          onClick={handleSaveAndExit}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--cf-ivory-35)",
            fontFamily: F.body,
            fontSize: 12,
            letterSpacing: "0.06em",
            cursor: "pointer",
            borderBottom: `1px solid ${"var(--cf-white-8)"}`,
            paddingBottom: 2,
            transition: "color 200ms ease, border-color 200ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--cf-ivory-62)";
            e.currentTarget.style.borderBottomColor = "var(--cf-gold-soft)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--cf-ivory-35)";
            e.currentTarget.style.borderBottomColor = "var(--cf-white-8)";
          }}
        >
          Save and return later
        </button>
      </div>
    </main>
  );
}

/* ─── SCALE BUTTON ────────────────────────────────────────────────────── */

function ScaleButton({ label, index, isSelected, onClick }) {
  const [hov, setHov] = useState(false);

  const border = isSelected ? "var(--cf-gold)" : hov ? "var(--cf-gold-45)" : "var(--cf-gold-soft)";
  const bg = isSelected ? "var(--cf-gold-bg)" : hov ? "rgba(201,168,76,0.04)" : "transparent";
  const color = isSelected ? "var(--cf-ivory)" : "var(--cf-ivory)";
  const numColor = isSelected ? "var(--cf-gold)" : "var(--cf-ivory-35)";

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr 24px",
        alignItems: "center",
        gap: 14,
        width: "100%",
        padding: "16px 20px",
        textAlign: "left",
        border: `1px solid ${border}`,
        background: bg,
        color,
        fontFamily: F.body,
        fontSize: 15.5,
        cursor: "pointer",
        transition: "border-color 200ms ease, background 200ms ease, color 200ms ease",
      }}
    >
      <span
        style={{
          fontFamily: F.caps,
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: numColor,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ letterSpacing: "0.01em" }}>{label}</span>
      <span
        aria-hidden
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          border: `1px solid ${isSelected ? "var(--cf-gold)" : "var(--cf-gold-soft)"}`,
          background: isSelected ? "var(--cf-gold)" : "transparent",
          justifySelf: "end",
          transition: "background 180ms ease, border-color 180ms ease",
        }}
      />
    </button>
  );
}
