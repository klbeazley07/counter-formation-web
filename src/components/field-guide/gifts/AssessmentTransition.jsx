import React, { useEffect, useState } from "react";


const F = {
  display: "var(--cf-font-devotional)",
  caps: "'Barlow Condensed', sans-serif",
  body: "'Inter', sans-serif",
};

const CATEGORY_LABEL = {
  manifestation: "Manifestation Gift",
  ministry: "Ministry Gift",
  equipping: "Equipping Gift",
  charismatic: "Charismatic Gift",
};

/* ─── BETWEEN-GIFT TRANSITION ─────────────────────────────────────────── */
// A brief 2-3 second screen between gifts. Next gift's name and category
// eyebrow on Hero Black. No copy. Auto-advances via onComplete.

export function GiftTransition({ gift, durationMs = 2200, onComplete }) {
  useEffect(() => {
    if (!onComplete) return;
    const t = setTimeout(onComplete, durationMs);
    return () => clearTimeout(t);
  }, [onComplete, durationMs]);

  // Allow user to skip the pause by clicking or pressing Enter / Space.
  useEffect(() => {
    if (!onComplete) return;
    function onKey(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onComplete();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onComplete]);

  return (
    <main
      onClick={onComplete}
      style={{
        background: "var(--cf-hero-bg)",
        color: "var(--cf-ivory)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        cursor: "pointer",
      }}
    >
      <style>{`
        @keyframes cf-trans-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cf-trans-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 640 }}>
        <div
          style={{
            fontFamily: F.caps,
            fontSize: 11,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--cf-gold)",
            marginBottom: 22,
            animation: "cf-trans-fade 420ms ease-out 80ms both",
          }}
        >
          {CATEGORY_LABEL[gift.category] || "Spiritual Gift"}
        </div>

        <div
          style={{
            width: 40,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${"var(--cf-gold)"}, transparent)`,
            margin: "0 auto 26px",
            animation: "cf-trans-fade 540ms ease-out 200ms both",
          }}
        />

        <h2
          style={{
            fontFamily: F.display,
            fontStyle: "italic",
            fontSize: "clamp(36px, 5.4vw, 54px)",
            lineHeight: 1.1,
            margin: 0,
            color: "var(--cf-ivory)",
            animation: "cf-trans-rise 640ms cubic-bezier(0.2, 0.7, 0.2, 1) 240ms both",
          }}
        >
          {gift.name}
        </h2>
      </div>
    </main>
  );
}

/* ─── CHARISMATIC INTRO TRANSITION ────────────────────────────────────── */
// Shown once before the first charismatic gift. Framing copy from spec
// Section 8.3, with a CONTINUE button. Not auto-advanced.

export function CharismaticIntro({ onContinue }) {
  const [hov, setHov] = useState(false);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        onContinue?.();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  return (
    <main
      style={{
        background: "var(--cf-hero-bg)",
        color: "var(--cf-ivory)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "96px 24px",
      }}
    >
      <style>{`
        @keyframes cf-trans-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes cf-trans-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 640, textAlign: "left" }}>
        <div
          style={{
            fontFamily: F.caps,
            fontSize: 11,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--cf-gold)",
            marginBottom: 22,
            textAlign: "center",
            animation: "cf-trans-fade 420ms ease-out both",
          }}
        >
          The Final Two Gifts
        </div>

        <h2
          style={{
            fontFamily: F.display,
            fontStyle: "italic",
            fontSize: "clamp(32px, 4.8vw, 44px)",
            lineHeight: 1.18,
            margin: "0 0 30px",
            color: "var(--cf-ivory)",
            textAlign: "center",
            animation: "cf-trans-rise 520ms cubic-bezier(0.2, 0.7, 0.2, 1) 120ms both",
          }}
        >
          A different methodology
        </h2>

        <div
          style={{
            width: 60,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${"var(--cf-gold)"}, transparent)`,
            margin: "0 auto 36px",
          }}
        />

        <p
          style={{
            fontFamily: F.display,
            fontSize: 19,
            lineHeight: 1.75,
            color: "var(--cf-ivory)",
            margin: "0 0 18px",
            animation: "cf-trans-rise 580ms cubic-bezier(0.2, 0.7, 0.2, 1) 220ms both",
          }}
        >
          The final two gifts in this assessment are handled differently. Tongues and Interpretation of Tongues are real and active in the church today, but they typically manifest in private prayer rather than in public ministry. Because of this, the methodology used for the other gifts does not fit.
        </p>
        <p
          style={{
            fontFamily: F.display,
            fontSize: 19,
            lineHeight: 1.75,
            color: "var(--cf-ivory-62)",
            margin: "0 0 18px",
            animation: "cf-trans-rise 580ms cubic-bezier(0.2, 0.7, 0.2, 1) 320ms both",
          }}
        >
          For each of these two gifts, you will be asked two questions: whether you have personally received and exercise the gift, and whether your exercise of it has produced the fruit scripture describes. There will be no trusted-person questions for these two gifts.
        </p>
        <p
          style={{
            fontFamily: F.display,
            fontSize: 19,
            lineHeight: 1.75,
            color: "var(--cf-ivory-62)",
            margin: "0 0 44px",
            animation: "cf-trans-rise 580ms cubic-bezier(0.2, 0.7, 0.2, 1) 420ms both",
          }}
        >
          If you have not received these gifts, that is no commentary on your faithfulness. Paul is explicit that they are given to some and not all.
        </p>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={onContinue}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              background: hov ? "var(--cf-gold)" : "transparent",
              color: hov ? "var(--cf-hero-bg)" : "var(--cf-gold)",
              border: `1px solid ${"var(--cf-gold)"}`,
              padding: "16px 36px",
              fontFamily: F.caps,
              fontSize: 13,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background 200ms ease, color 200ms ease",
              minWidth: 220,
              animation: "cf-trans-fade 540ms ease-out 540ms both",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
