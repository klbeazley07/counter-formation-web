import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GiftConstellation from "./GiftConstellation";
import {
  loadProgress,
  clearProgress,
  hasInProgressAssessment,
  TOTAL_QUESTIONS,
} from "../../../utils/giftsAssessmentStorage";

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.32)",
  goldFaint: "rgba(201,168,76,0.14)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.08)",
};

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [locked]);
}

function useEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const fn = (e) => {
      if (e.key === "Escape") handler?.();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handler, enabled]);
}

/* ─── WHAT THIS IS NOT MODAL ──────────────────────────────────────── */

function WhatThisIsNotModal({ open, onClose }) {
  useBodyScrollLock(open);
  useEscape(onClose, open);
  if (!open) return null;

  const points = [
    {
      lead: "This is not a personality test.",
      body: "The gifts are not categories of who you are. They are evidence of where the Spirit is currently at work through you. They can develop, shift, and change over seasons of your life.",
    },
    {
      lead: "This is not a verdict.",
      body: "Your results are an invitation to test what the Spirit may be doing, not a label to claim. The community-confirmation methodology is built into the instrument specifically to keep self-report from becoming the final word.",
    },
    {
      lead: "This is not the whole picture.",
      body: "The gifts are one dimension of the Spirit's work in you. The Fruit of the Spirit Assessment addresses the other -- who you are becoming in Christ. Both together form the formation picture this Field Guide is designed to surface.",
    },
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,5,10,0.86)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "cf-fade-in 240ms ease-out both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="What this assessment is not"
        style={{
          background: C.bgCard,
          border: `1px solid ${C.goldDim}`,
          maxWidth: 620,
          width: "100%",
          padding: "44px 44px 40px",
          position: "relative",
          animation: "cf-rise-in 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "transparent",
            border: "none",
            color: C.muted,
            fontSize: 24,
            lineHeight: 1,
            cursor: "pointer",
            padding: 8,
          }}
        >
          ×
        </button>

        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 14,
          }}
        >
          Before you begin
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 30,
            lineHeight: 1.2,
            margin: 0,
            marginBottom: 24,
            color: C.ivory,
          }}
        >
          What this assessment is not
        </h2>

        <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {points.map((p, i) => (
            <li
              key={p.lead}
              style={{
                display: "grid",
                gridTemplateColumns: "32px 1fr",
                gap: 14,
                paddingBottom: i === points.length - 1 ? 0 : 20,
                marginBottom: i === points.length - 1 ? 0 : 20,
                borderBottom: i === points.length - 1 ? "none" : `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 14,
                  letterSpacing: "0.18em",
                  color: C.gold,
                  paddingTop: 4,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: 19,
                    color: C.ivory,
                    marginBottom: 6,
                  }}
                >
                  {p.lead}
                </div>
                <p style={{ fontSize: 14.5, lineHeight: 1.75, color: C.muted, margin: 0 }}>
                  {p.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ─── MAIN: ASSESSMENT INTRO ──────────────────────────────────────── */

export default function AssessmentIntro() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);

  useEffect(() => {
    const sp = loadProgress();
    if (sp && hasInProgressAssessment(sp)) setSavedProgress(sp);
  }, []);

  function handleStartOver() {
    clearProgress();
    setSavedProgress(null);
  }

  const resumeAt = savedProgress ? Math.min(savedProgress.qIdx + 1, TOTAL_QUESTIONS) : 0;

  const paragraphs = [
    "A spiritual gift is not a personality trait. It is the Holy Spirit at work through a believer, manifesting his presence and power in ways that build up the body of Christ. This assessment does not tell you who you are. It surfaces where the Spirit is currently moving through you, a picture of this season rather than a permanent label.",
    "Most spiritual gift instruments measure self-perception. This one measures three streams. The first is inclination: where you sense the Spirit working through you. The second is fruitfulness: where you have actually seen God move when you have stepped into that gifting. The third is community confirmation: where the people closest to you have observed the Spirit in operation through you.",
    "After you complete the self-assessment, you invite two or three trusted people in your life to take a brief companion assessment about you. Their responses integrate into your results. This is the New Testament's order: the body of Christ confirms the gifts that the Spirit gives, and the picture is only complete when their witness joins yours.",
  ];

  return (
    <main
      style={{
        background: C.bg,
        color: C.ivory,
        minHeight: "100vh",
        padding: "110px 24px 100px",
      }}
    >
      {/* Inline keyframes for the modal transitions */}
      <style>{`
        @keyframes cf-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cf-rise-in {
          from { opacity: 0; transform: translateY(12px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .cf-primary-cta:hover { background: ${C.gold}; color: ${C.bg}; }
        .cf-secondary-cta:hover { color: ${C.ivory}; }
        .cf-secondary-cta:hover .cf-arrow { transform: translateX(4px); }
      `}</style>

      <div style={{ maxWidth: showConstellation ? 1240 : 760, margin: "0 auto" }}>
        {showConstellation ? (
          <GiftConstellation onReturn={() => setShowConstellation(false)} />
        ) : (
          <>
            {/* Eyebrow */}
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 11,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: C.gold,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              Field Guide &middot; Assessment 02
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(40px, 6.5vw, 60px)",
                lineHeight: 1.08,
                color: C.ivory,
                textAlign: "center",
                margin: 0,
                marginBottom: 20,
                letterSpacing: "-0.005em",
              }}
            >
              The Spiritual Gifts Assessment
            </h1>

            {/* Gold rule under hero */}
            <div
              style={{
                width: 80,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
                margin: "0 auto 28px",
              }}
            />

            {/* Subhead */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                lineHeight: 1.6,
                color: C.muted,
                textAlign: "center",
                margin: "0 auto 56px",
                maxWidth: 560,
                fontWeight: 400,
              }}
            >
              Where the Spirit is at work through you to build up the body of Christ.
            </p>

            {/* Three prose paragraphs */}
            <div style={{ maxWidth: 640, margin: "0 auto 44px" }}>
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="cf-prose"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18.5,
                    lineHeight: 1.75,
                    color: C.ivory,
                    textAlign: "left",
                    margin: 0,
                    marginBottom: i === paragraphs.length - 1 ? 0 : 22,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Time note */}
            <div
              style={{
                maxWidth: 600,
                margin: "0 auto 48px",
                padding: "20px 28px",
                border: `1px solid ${C.goldFaint}`,
                background: "rgba(201,168,76,0.04)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: C.gold,
                  marginBottom: 8,
                }}
              >
                Time required
              </div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 16,
                  lineHeight: 1.6,
                  color: C.muted,
                  margin: 0,
                }}
              >
                Allow 12 to 15 minutes for the self-assessment. The full picture comes when two or three trusted people in your life have also completed the brief companion assessment about you, which takes them 5 to 7 minutes.
              </p>
            </div>

            {/* Resume banner */}
            {savedProgress && (
              <div
                style={{
                  maxWidth: 600,
                  margin: "0 auto 36px",
                  padding: "18px 24px",
                  border: `1px solid ${C.goldDim}`,
                  background: "rgba(201,168,76,0.06)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      color: C.gold,
                      marginBottom: 4,
                    }}
                  >
                    Saved progress
                  </div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 17,
                      color: C.ivory,
                    }}
                  >
                    You're on question {resumeAt} of {TOTAL_QUESTIONS}.
                  </div>
                </div>
                <button
                  onClick={handleStartOver}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: C.muted,
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    borderBottom: `1px solid ${C.border}`,
                    paddingBottom: 2,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = C.ivory;
                    e.currentTarget.style.borderBottomColor = C.goldDim;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = C.muted;
                    e.currentTarget.style.borderBottomColor = C.border;
                  }}
                >
                  Start over
                </button>
              </div>
            )}

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: 28,
                marginBottom: 28,
              }}
            >
              <Link
                className="cf-primary-cta"
                to="/field-guide/gifts/take"
                style={{
                  background: "transparent",
                  color: C.gold,
                  border: `1px solid ${C.gold}`,
                  padding: "16px 32px",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "background 200ms ease, color 200ms ease",
                  minWidth: 240,
                  textAlign: "center",
                }}
              >
                {savedProgress ? "Resume Assessment" : "Begin Assessment"}
              </Link>
              <button
                onClick={() => setShowConstellation(true)}
                className="cf-secondary-cta"
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.muted,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 17,
                  cursor: "pointer",
                  padding: "8px 4px",
                  transition: "color 200ms ease",
                }}
              >
                Explore the gifts first{" "}
                <span
                  className="cf-arrow"
                  style={{ display: "inline-block", transition: "transform 220ms ease" }}
                >
                  &rarr;
                </span>
              </button>
            </div>

            {/* Modal trigger */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <button
                onClick={() => setModalOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: C.dim,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  borderBottom: `1px solid ${C.border}`,
                  paddingBottom: 2,
                  transition: "color 200ms ease, border-color 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = C.muted;
                  e.currentTarget.style.borderBottomColor = C.goldDim;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = C.dim;
                  e.currentTarget.style.borderBottomColor = C.border;
                }}
              >
                Before you begin -- what this assessment is not
              </button>
            </div>

            {/* Return to Field Guide */}
            <div style={{ textAlign: "center" }}>
              <Link
                to="/field-guide/scripture-before-scroll"
                style={{
                  color: C.dim,
                  textDecoration: "none",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  letterSpacing: "0.04em",
                }}
              >
                ← Back to the Field Guide
              </Link>
            </div>
          </>
        )}
      </div>

      <WhatThisIsNotModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  );
}
