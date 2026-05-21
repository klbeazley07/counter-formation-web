// Processing screen -- runs for 4-5 seconds after the final assessment question,
// then auto-transitions to results. Intentional pacing, not actual wait time.

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const STYLES = `
  @keyframes cf-proc-rotate {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes cf-proc-fade {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function GiftsProcessing() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate("/field-guide/gifts/results", { replace: true });
    }, 4800);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <>
      <style>{STYLES}</style>
      <main
        style={{
          background: "var(--cf-hero-bg)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
        }}
      >
        {/* Slowly rotating constellation-anchor mark */}
        <div
          style={{
            animation: "cf-proc-rotate 12s linear infinite",
            marginBottom: 44,
          }}
          aria-hidden="true"
        >
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
            {/* Outer ring */}
            <circle
              cx="34" cy="34" r="30"
              stroke={"var(--cf-gold)"} strokeWidth="0.75" strokeOpacity="0.45"
            />
            {/* Mid ring */}
            <circle
              cx="34" cy="34" r="18"
              stroke={"var(--cf-gold)"} strokeWidth="0.5" strokeOpacity="0.2"
            />
            {/* Cross arms */}
            <line x1="34" y1="4"  x2="34" y2="64" stroke={"var(--cf-gold)"} strokeWidth="0.6" strokeOpacity="0.25" />
            <line x1="4"  y1="34" x2="64" y2="34" stroke={"var(--cf-gold)"} strokeWidth="0.6" strokeOpacity="0.25" />
            {/* Diagonal cross */}
            <line x1="13" y1="13" x2="55" y2="55" stroke={"var(--cf-gold)"} strokeWidth="0.4" strokeOpacity="0.12" />
            <line x1="55" y1="13" x2="13" y2="55" stroke={"var(--cf-gold)"} strokeWidth="0.4" strokeOpacity="0.12" />
            {/* Cardinal points -- the four outer stars */}
            <circle cx="34" cy="4"  r="2.8" fill={"var(--cf-gold)"} fillOpacity="0.85" />
            <circle cx="64" cy="34" r="2.8" fill={"var(--cf-gold)"} fillOpacity="0.85" />
            <circle cx="34" cy="64" r="2.8" fill={"var(--cf-gold)"} fillOpacity="0.85" />
            <circle cx="4"  cy="34" r="2.8" fill={"var(--cf-gold)"} fillOpacity="0.85" />
            {/* Diagonal points -- dimmer */}
            <circle cx="13" cy="13" r="1.8" fill={"var(--cf-gold)"} fillOpacity="0.4" />
            <circle cx="55" cy="13" r="1.8" fill={"var(--cf-gold)"} fillOpacity="0.4" />
            <circle cx="55" cy="55" r="1.8" fill={"var(--cf-gold)"} fillOpacity="0.4" />
            <circle cx="13" cy="55" r="1.8" fill={"var(--cf-gold)"} fillOpacity="0.4" />
            {/* Center */}
            <circle cx="34" cy="34" r="2.2" fill={"var(--cf-gold)"} />
          </svg>
        </div>

        {/* Copy fades in after 1s, over 1.8s */}
        <p
          style={{
            fontFamily: "var(--cf-font-devotional)",
            fontSize: "clamp(17px, 2.2vw, 21px)",
            fontStyle: "italic",
            lineHeight: 1.75,
            color: "var(--cf-ivory)",
            textAlign: "center",
            maxWidth: 500,
            margin: 0,
            animation: "cf-proc-fade 1.8s ease-out 1s both",
          }}
        >
          Weighing your responses. Looking at the patterns. The Spirit's work
          in you is the substance of this picture; what follows is a glimpse,
          not a verdict.
        </p>
      </main>
    </>
  );
}
