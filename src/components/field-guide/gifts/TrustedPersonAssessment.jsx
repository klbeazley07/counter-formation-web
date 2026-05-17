// Session 6 -- Trusted-person assessment experience.
// Route: /field-guide/gifts/observe/:token
// 17 questions (one per core gift), frequency scale + "I haven't been in a position to see this".

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { gifts } from "../../../data/gifts";
import AssessmentProgress from "./AssessmentProgress";
import { GiftTransition } from "./AssessmentTransition";
import {
  TRUSTED_PERSONS_KEY,
  TRUSTED_RESPONSES_KEY,
  loadTrustedPersons,
} from "./TrustedPersonInvitationFlow";
import { supabase } from "../../../utils/supabaseClient";

/* ─── TOKENS ────────────────────────────────────────────────────────────── */

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.45)",
  goldFaint: "rgba(201,168,76,0.18)",
  goldMid: "rgba(201,168,76,0.08)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.08)",
};

const F = {
  display: "'Cormorant Garamond', serif",
  caps: "'Barlow Condensed', sans-serif",
  body: "'Inter', sans-serif",
};

const CATEGORY_LABEL = {
  manifestation: "Manifestation",
  ministry: "Ministry",
  equipping: "Equipping",
};

/* ─── QUESTION MANIFEST ─────────────────────────────────────────────────── */

// 17 core gifts only -- no charismatic gifts in the trusted-person flow.
const CORE_GIFTS = gifts.filter((g) => g.category !== "charismatic");
const TOTAL_TP_QUESTIONS = CORE_GIFTS.length; // 17

/* ─── STORAGE ───────────────────────────────────────────────────────────── */

function storageKey(token) {
  return `${TRUSTED_RESPONSES_KEY}-${token}`;
}

function loadSavedResponses(token) {
  try {
    const raw = localStorage.getItem(storageKey(token));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveResponses(token, state) {
  try {
    localStorage.setItem(storageKey(token), JSON.stringify({
      ...state,
      lastUpdatedAt: new Date().toISOString(),
    }));
  } catch { /* ignore */ }
}

function markCompleted(token, responses) {
  const completedAt = new Date().toISOString();
  try {
    // Save final responses.
    localStorage.setItem(storageKey(token), JSON.stringify({ responses, qIdx: TOTAL_TP_QUESTIONS, completedAt }));

    // Update status in the trusted-persons list.
    const persons = loadTrustedPersons();
    const updated = persons.map((p) => p.token === token ? { ...p, status: "completed", completedAt } : p);
    localStorage.setItem(TRUSTED_PERSONS_KEY, JSON.stringify(updated));

    // Save to the aggregated trusted responses key.
    const allResponses = JSON.parse(localStorage.getItem(TRUSTED_RESPONSES_KEY) || "{}");
    allResponses[token] = { responses, completedAt };
    localStorage.setItem(TRUSTED_RESPONSES_KEY, JSON.stringify(allResponses));
  } catch { /* ignore */ }

  // Background write to Supabase. Look up the inviter's session_id from gifts_trusted_tokens
  // so the response can be read cross-device from GiftsResults.
  if (supabase) {
    supabase
      .from("gifts_trusted_tokens")
      .select("session_id")
      .eq("token", token)
      .maybeSingle()
      .then(({ data }) => {
        if (!data?.session_id) return; // token predates Supabase integration -- skip
        supabase.from("gifts_trusted_responses").upsert({
          token,
          session_id: data.session_id,
          responses,
          completed_at: completedAt,
        }, { onConflict: "token" }).then(() => {});
      });
  }
}

/* ─── HELPERS ───────────────────────────────────────────────────────────── */

function firstNameOf(fullName) {
  const t = (fullName || "").trim();
  return t.split(/\s+/)[0] || t;
}

function questionText(gift, userName) {
  const q = gift.communityConfirmationQuestion || "";
  return q.replace(/\[Name\]/g, firstNameOf(userName));
}

// True when consecutive questions cross a category boundary.
function crossesCategory(prevIdx, nextIdx) {
  if (prevIdx < 0 || nextIdx < 0) return false;
  if (prevIdx >= TOTAL_TP_QUESTIONS || nextIdx >= TOTAL_TP_QUESTIONS) return false;
  return CORE_GIFTS[prevIdx].category !== CORE_GIFTS[nextIdx].category;
}

/* ─── SCALE ─────────────────────────────────────────────────────────────── */

// Frequency scale (0-4 maps to 0-100 in scoring) + "I haven't been in a position to see this" (null).
const TP_SCALE = [
  { value: 0, label: "Never" },
  { value: 1, label: "Rarely" },
  { value: 2, label: "Sometimes" },
  { value: 3, label: "Often" },
  { value: 4, label: "Consistently" },
];

/* ─── LANDING SCREEN ────────────────────────────────────────────────────── */

function LandingScreen({ userName, onBegin }) {
  const [hov, setHov] = useState(false);
  const displayFirstName = firstNameOf(userName);

  return (
    <main
      style={{ background: C.bg, color: C.ivory, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px" }}
    >
      <style>{`
        @keyframes cf-tp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cf-tp-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: 640, width: "100%" }}>
        <div style={{ fontFamily: F.caps, fontSize: 11, letterSpacing: "0.40em", textTransform: "uppercase", color: C.gold, marginBottom: 20, animation: "cf-tp-fade 400ms ease-out both" }}>
          Counter Formation -- Spiritual Gifts Assessment
        </div>

        <div style={{ height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginBottom: 28, maxWidth: 72, animation: "cf-tp-fade 500ms ease-out 80ms both" }} />

        <h1 style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(30px, 5vw, 52px)", lineHeight: 1.12, margin: "0 0 28px", color: C.ivory, animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 120ms both" }}>
          {displayFirstName
            ? <>You have been invited to weigh in on {displayFirstName}</>
            : <>You have been invited to weigh in</>}
        </h1>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 18, lineHeight: 1.75, color: C.ivory, margin: "0 0 16px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both" }}>
          {displayFirstName ? `${displayFirstName} has invited` : "Someone has invited"} you to take a brief assessment about how God seems to be at work through them. Your honest observations will integrate into their results. This will take about 5 to 7 minutes.
        </p>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.75, color: C.muted, margin: "0 0 14px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 280ms both" }}>
          The New Testament's logic is that spiritual gifts are confirmed in the body of Christ, not just discovered by the individual believer.{displayFirstName ? ` ${displayFirstName} is asking` : " They are asking"} you to participate in that confirmation.
        </p>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.75, color: C.muted, margin: "0 0 14px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 340ms both" }}>
          You will be asked one question per gift, with a five-point scale. There is also an "I haven't been in a position to see this" option for any question where you genuinely have not observed what is being asked about. Please use that option freely -- it is more helpful than guessing.
        </p>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.75, color: C.muted, margin: "0 0 44px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 400ms both" }}>
          You will not see {displayFirstName ? `${displayFirstName}'s` : "their"} own responses or their results. Your role is to weigh in on what you have seen, not to compare or evaluate.
        </p>

        <div style={{ animation: "cf-tp-fade 540ms ease-out 500ms both" }}>
          <button
            onClick={onBegin}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              background: hov ? C.gold : "transparent",
              color: hov ? C.bg : C.gold,
              border: `1px solid ${C.gold}`,
              padding: "16px 44px",
              fontFamily: F.caps,
              fontSize: 13,
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 200ms ease, color 200ms ease",
            }}
          >
            Begin
          </button>
        </div>
      </div>
    </main>
  );
}

/* ─── COMPLETION SCREEN ─────────────────────────────────────────────────── */

function CompletionScreen({ userName }) {
  const [hov, setHov] = useState(false);
  const displayFirstName = firstNameOf(userName);

  return (
    <main style={{ background: C.bg, color: C.ivory, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px" }}>
      <style>{`
        @keyframes cf-tp-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cf-tp-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <div style={{ fontFamily: F.caps, fontSize: 11, letterSpacing: "0.40em", textTransform: "uppercase", color: C.gold, marginBottom: 20, animation: "cf-tp-fade 400ms ease-out both" }}>
          Counter Formation
        </div>

        <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, margin: "0 auto 28px", animation: "cf-tp-fade 500ms ease-out 80ms both" }} />

        <h1 style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(30px, 5vw, 50px)", lineHeight: 1.15, margin: "0 0 24px", color: C.ivory, animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 120ms both" }}>
          Thank you for weighing in
        </h1>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 18, lineHeight: 1.75, color: C.ivory, margin: "0 0 14px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both" }}>
          Your responses have been recorded.{" "}
          {displayFirstName ? `${displayFirstName} will` : "They will"} receive an updated picture of where the Spirit is at work through them, now informed by what you have observed.
        </p>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.75, color: C.muted, margin: "0 0 40px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 280ms both" }}>
          They will not see your individual answers -- only the aggregated result combined with the responses of the others they invited.
        </p>

        <p className="cf-prose" style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.75, color: C.muted, margin: "0 0 36px", animation: "cf-tp-rise 560ms cubic-bezier(0.2, 0.7, 0.2, 1) 340ms both" }}>
          If you are curious about the assessment yourself, you are welcome to take it. Counter Formation is a free Field Guide for Christian formation.
        </p>

        <div style={{ animation: "cf-tp-fade 540ms ease-out 460ms both" }}>
          <Link
            to="/"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              display: "inline-block",
              background: hov ? C.gold : "transparent",
              color: hov ? C.bg : C.gold,
              border: `1px solid ${C.gold}`,
              padding: "15px 40px",
              fontFamily: F.caps,
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 200ms ease, color 200ms ease",
            }}
          >
            Learn more about Counter Formation →
          </Link>
        </div>
      </div>
    </main>
  );
}

/* ─── QUESTION SCREEN ───────────────────────────────────────────────────── */

function QuestionScreen({ qIdx, responses, userName, onAnswer, onBack, onSkip, onSaveAndExit, exitDir, enterDir }) {
  const gift = CORE_GIFTS[qIdx];
  const currentValue = responses[gift.key] !== undefined ? responses[gift.key] : undefined;
  const category = CATEGORY_LABEL[gift.category] || "";

  const slideStyle = {
    opacity: exitDir ? 0 : 1,
    transform: exitDir === "left" ? "translateX(-32px)" : exitDir === "right" ? "translateX(32px)" : enterDir === "left" ? "translateX(-24px)" : enterDir === "right" ? "translateX(24px)" : "translateX(0)",
    transition: exitDir ? "opacity 180ms ease, transform 180ms ease" : "opacity 240ms ease, transform 240ms ease",
  };

  return (
    <main style={{ background: C.bg, color: C.ivory, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes cf-tp-btn-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .cf-tp-scale-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px 20px;
          cursor: pointer;
          text-align: left;
          transition: border-color 140ms ease, background 140ms ease;
          margin-bottom: 8px;
          color: ${C.ivory};
        }
        .cf-tp-scale-btn:hover {
          border-color: ${C.goldDim};
          background: ${C.goldMid};
        }
        .cf-tp-scale-btn.selected {
          border-color: ${C.gold};
          background: ${C.goldFaint};
        }
        .cf-tp-no-data-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          background: transparent;
          border: none;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 14px 20px 14px 0;
          cursor: pointer;
          text-align: left;
          color: ${C.dim};
          transition: color 140ms ease;
          margin-top: 4px;
        }
        .cf-tp-no-data-btn:hover {
          color: ${C.muted};
        }
        .cf-tp-no-data-btn.selected {
          color: ${C.gold};
        }
        @media (max-width: 640px) {
          .cf-tp-scale-btn { padding: 14px 16px; }
        }
      `}</style>

      {/* Progress bar */}
      <div style={{ padding: "0" }}>
        <AssessmentProgress current={qIdx + 1} total={TOTAL_TP_QUESTIONS} />
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 600, width: "100%", ...slideStyle }}>
          {/* Category eyebrow */}
          <div style={{ fontFamily: F.caps, fontSize: 10, letterSpacing: "0.44em", textTransform: "uppercase", color: C.dim, marginBottom: 10 }}>
            {category}
          </div>

          {/* Gift eyebrow */}
          <div style={{ fontFamily: F.caps, fontSize: 13, letterSpacing: "0.30em", textTransform: "uppercase", color: C.gold, marginBottom: 24 }}>
            {gift.name.toUpperCase()} -- {qIdx + 1} OF {TOTAL_TP_QUESTIONS}
          </div>

          {/* Question */}
          <p style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(20px, 3.2vw, 26px)", lineHeight: 1.65, color: C.ivory, margin: "0 0 36px" }}>
            {questionText(gift, userName)}
          </p>

          {/* Frequency scale */}
          <div>
            {TP_SCALE.map((opt, i) => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  className={`cf-tp-scale-btn${isSelected ? " selected" : ""}`}
                  onClick={() => onAnswer(opt.value)}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span style={{ fontFamily: F.caps, fontSize: 13, color: isSelected ? C.gold : C.dim, letterSpacing: "0.12em", minWidth: 20 }}>
                    {String(opt.value + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontFamily: F.body, fontSize: 15, lineHeight: 1.4 }}>{opt.label}</span>
                  <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: isSelected ? C.gold : "transparent", border: `1px solid ${isSelected ? C.gold : C.border}`, flexShrink: 0, transition: "background 120ms ease, border-color 120ms ease" }} />
                </button>
              );
            })}

            {/* "I haven't been in a position to see this" */}
            <button
              className={`cf-tp-no-data-btn${currentValue === null && responses[gift.key] !== undefined ? " selected" : ""}`}
              onClick={() => onAnswer(null)}
            >
              <span style={{ fontFamily: F.body, fontSize: 14, lineHeight: 1.5 }}>
                I haven't been in a position to see this
              </span>
            </button>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: 24, marginTop: 32, alignItems: "center" }}>
            {qIdx > 0 && (
              <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontFamily: F.body, fontSize: 13, cursor: "pointer", padding: 0 }}>
                ← Previous
              </button>
            )}
            <button onClick={onSkip} style={{ background: "none", border: "none", color: C.dim, fontFamily: F.body, fontSize: 13, cursor: "pointer", padding: 0 }}>
              Skip this question →
            </button>
          </div>

          {/* Save and return */}
          <div style={{ marginTop: 48 }}>
            <button onClick={onSaveAndExit} style={{ background: "none", border: "none", color: C.dim, fontFamily: F.body, fontSize: 12, cursor: "pointer", padding: 0, textDecoration: "underline", textDecorationColor: "rgba(250,248,245,0.18)" }}>
              Save and return later
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */

export default function TrustedPersonAssessment() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Look up the pairing to get the subject's name.
  const pairing = React.useMemo(() => {
    const persons = loadTrustedPersons();
    return persons.find((p) => p.token === token) || null;
  }, [token]);

  const userName = pairing?.userName || pairing?.name || "";

  // Load saved progress for this token.
  const [screen, setScreen] = useState(() => {
    if (!token) return "landing";
    const saved = loadSavedResponses(token);
    if (saved?.completedAt) return "complete";
    if (saved?.qIdx > 0) return "landing"; // resume from landing
    return "landing";
  });

  const [qIdx, setQIdx] = useState(() => {
    const saved = loadSavedResponses(token);
    return saved?.qIdx && saved.qIdx < TOTAL_TP_QUESTIONS ? saved.qIdx : 0;
  });

  const [responses, setResponses] = useState(() => {
    const saved = loadSavedResponses(token);
    return saved?.responses || {};
  });

  const [pendingNextIdx, setPendingNextIdx] = useState(null);
  const [exitDir, setExitDir] = useState(null);
  const [enterDir, setEnterDir] = useState(null);
  const transitioningRef = useRef(false);

  const hasSaved = Boolean(loadSavedResponses(token)?.qIdx > 0);

  useEffect(() => {
    document.title = "Spiritual Gifts -- Trusted Assessment · Counter Formation";
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, qIdx]);

  function persist(nextResponses, nextQIdx) {
    saveResponses(token, { responses: nextResponses, qIdx: nextQIdx });
  }

  /* ── Begin ─────────────────────────────────────────────────────────── */

  function handleBegin() {
    setScreen("question");
  }

  /* ── Answer / advance ──────────────────────────────────────────────── */

  function handleAnswer(value) {
    // value is 0-4 (scale) or null ("no data")
    const gift = CORE_GIFTS[qIdx];
    const nextResponses = { ...responses, [gift.key]: value };
    setResponses(nextResponses);

    // Auto-advance after brief beat.
    setTimeout(() => advance(nextResponses, qIdx, value), value !== null ? 240 : 0);
  }

  function advance(currentResponses, currentIdx, value) {
    if (transitioningRef.current) return;
    if (value === undefined) return; // nothing selected and no skip
    transitioningRef.current = true;

    const nextIdx = currentIdx + 1;

    if (nextIdx >= TOTAL_TP_QUESTIONS) {
      // Completed.
      markCompleted(token, currentResponses);
      setResponses(currentResponses);
      setExitDir("left");
      setTimeout(() => {
        setScreen("complete");
        transitioningRef.current = false;
      }, 220);
      return;
    }

    // Category transition?
    if (crossesCategory(currentIdx, nextIdx)) {
      persist(currentResponses, nextIdx);
      setPendingNextIdx(nextIdx);
      setResponses(currentResponses);
      setExitDir("left");
      setTimeout(() => {
        setScreen("category-transition");
        setExitDir(null);
        transitioningRef.current = false;
      }, 220);
      return;
    }

    // In-category advance.
    persist(currentResponses, nextIdx);
    setResponses(currentResponses);
    setExitDir("left");
    setTimeout(() => {
      setQIdx(nextIdx);
      setExitDir(null);
      setEnterDir("right");
      setTimeout(() => setEnterDir(null), 240);
      transitioningRef.current = false;
    }, 220);
  }

  /* ── Skip ──────────────────────────────────────────────────────────── */

  function handleSkip() {
    const gift = CORE_GIFTS[qIdx];
    const nextResponses = { ...responses, [gift.key]: undefined };
    // Record nothing (skip -- not even null, which means "no data intentional")
    advance(nextResponses, qIdx, 2); // treat skip as neutral for scoring
  }

  /* ── Back ──────────────────────────────────────────────────────────── */

  function handleBack() {
    if (transitioningRef.current || qIdx <= 0) return;
    transitioningRef.current = true;
    const prevIdx = qIdx - 1;
    setExitDir("right");
    setTimeout(() => {
      setQIdx(prevIdx);
      setExitDir(null);
      setEnterDir("left");
      setTimeout(() => setEnterDir(null), 240);
      transitioningRef.current = false;
    }, 220);
  }

  /* ── Save and exit ─────────────────────────────────────────────────── */

  function handleSaveAndExit() {
    persist(responses, qIdx);
    navigate("/");
  }

  /* ── Category transition complete ──────────────────────────────────── */

  function finishCategoryTransition() {
    const nextIdx = pendingNextIdx;
    setPendingNextIdx(null);
    setQIdx(nextIdx);
    setScreen("question");
    setEnterDir("right");
    setTimeout(() => setEnterDir(null), 240);
  }

  /* ── Keyboard ──────────────────────────────────────────────────────── */

  useEffect(() => {
    if (screen !== "question") return;
    function onKey(e) {
      const gift = CORE_GIFTS[qIdx];
      if (e.key >= "1" && e.key <= "5") {
        const v = parseInt(e.key, 10) - 1;
        const nextResponses = { ...responses, [gift.key]: v };
        setResponses(nextResponses);
        return;
      }
      const currentValue = responses[gift.key];
      if ((e.key === "Enter" || e.key === "ArrowRight") && currentValue !== undefined) {
        advance(responses, qIdx, currentValue);
      }
      if (e.key === "ArrowLeft" && qIdx > 0) {
        handleBack();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, qIdx, responses]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Render ────────────────────────────────────────────────────────── */

  if (!token) {
    return (
      <main style={{ background: C.bg, color: C.ivory, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ fontFamily: F.display, fontStyle: "italic", fontSize: 22, color: C.muted }}>
            This link does not appear to be valid.
          </p>
          <Link to="/" style={{ fontFamily: F.caps, fontSize: 12, letterSpacing: "0.30em", color: C.gold, textDecoration: "none", textTransform: "uppercase" }}>
            Visit Counter Formation →
          </Link>
        </div>
      </main>
    );
  }

  if (screen === "complete") {
    return <CompletionScreen userName={userName} />;
  }

  if (screen === "category-transition" && pendingNextIdx != null) {
    const nextGift = CORE_GIFTS[pendingNextIdx];
    return (
      <GiftTransition
        gift={nextGift}
        durationMs={1800}
        onComplete={finishCategoryTransition}
      />
    );
  }

  if (screen === "landing") {
    return (
      <div>
        <LandingScreen userName={userName} onBegin={handleBegin} />
        {hasSaved && (
          <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: C.bgCard, border: `1px solid ${C.goldDim}`, padding: "10px 20px", display: "flex", gap: 16, alignItems: "center", zIndex: 90 }}>
            <span style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>Saved progress found.</span>
            <button onClick={() => { setScreen("question"); }} style={{ background: "none", border: "none", color: C.gold, fontFamily: F.caps, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", cursor: "pointer" }}>
              Resume →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <QuestionScreen
      qIdx={qIdx}
      responses={responses}
      userName={userName}
      onAnswer={handleAnswer}
      onBack={handleBack}
      onSkip={handleSkip}
      onSaveAndExit={handleSaveAndExit}
      exitDir={exitDir}
      enterDir={enterDir}
    />
  );
}
