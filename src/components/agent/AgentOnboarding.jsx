import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import { hasMeaningfulActivity } from "../personal/HomeRouter";
import ShortFormationAssessment from "./ShortFormationAssessment";

/*
 * AgentOnboarding — the page at /agent/onboarding
 *
 * Shown when profile.agent.onboardingCompletedAt is null and the user
 * is authenticated or has any meaningful formation activity. Renders
 * the 3-question short assessment, POSTs to /api/agent-reflect, displays
 * the returned framing, writes the result back to the profile, then
 * redirects to / after a short pause.
 *
 * If the user has no meaningful activity and is not authenticated, shows
 * a short redirect prompt toward the Fruit Assessment instead.
 */

function cap30(arr) {
  const copy = [...arr];
  while (copy.length > 30) copy.shift();
  return copy;
}

export default function AgentOnboarding() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const navigate = useNavigate();

  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);

  if (!isLoaded) return null;

  // If onboarding already done, redirect to home.
  if (profile.agent?.onboardingCompletedAt) {
    navigate("/", { replace: true });
    return null;
  }

  // No activity and not authenticated -- soft redirect.
  const isAuthenticated = !!profile.identity?.userId;
  if (!isAuthenticated && !hasMeaningfulActivity(profile)) {
    return (
      <div style={{ minHeight: "100dvh", backgroundColor: "var(--cf-hero-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: "1rem" }}>
          Formation Assessment
        </p>
        <h1 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(24px, 5vw, 42px)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cf-ivory)", marginBottom: "1rem", lineHeight: 1 }}>
          Start with the Fruit
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(16px, 3vw, 20px)", color: "var(--cf-ivory-62)", maxWidth: 480, marginBottom: "2rem", lineHeight: 1.6 }}>
          The short formation assessment is most useful once you have some formation data. Begin with the Fruit Assessment to name where the Spirit is forming you.
        </p>
        <Link
          to="/field-guide/fruit-assessment"
          style={{ display: "inline-block", padding: "14px 32px", borderRadius: 999, background: "var(--cf-gold)", color: "#0A0A0A", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", textDecoration: "none" }}
        >
          Begin the Fruit Assessment
        </Link>
      </div>
    );
  }

  async function handleAssessmentSubmit(answers) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/agent-reflect", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ kind: "onboarding", profile, shortAssessment: answers }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Reflection failed.");

      const text = data.text || "";
      const suggestedNextStep = data.suggestedNextStep || null;

      setResult({ text, suggestedNextStep });

      const now = new Date().toISOString();
      const historyEntry = {
        at:      now,
        kind:    "onboarding",
        inputs:  answers,
        summary: text.slice(0, 200).trim(),
      };

      updateProfile({
        agent: {
          onboardingCompletedAt: now,
          lastNudgeAt:           now,
          shortAssessment:       { ...answers, capturedAt: now },
          history:               cap30([historyEntry, ...(profile.agent?.history ?? [])]),
        },
        onboarding: {
          formationFocus: answers.formingRight,
        },
      });

      // Redirect to home after the user reads the framing.
      setTimeout(() => navigate("/"), 4500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--cf-hero-bg)", color: "var(--cf-ivory)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px clamp(60px, 8vw, 100px)" }}>

        {/* Header */}
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: "1.25rem" }}>
          Formation Assessment
        </p>
        <h1 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(26px, 5vw, 44px)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cf-ivory)", lineHeight: 0.95, marginBottom: "1.25rem" }}>
          Where Are You Right Now?
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(17px, 3.2vw, 21px)", color: "var(--cf-ivory-62)", lineHeight: 1.65, marginBottom: "3rem", maxWidth: 560 }}>
          Three honest questions. Your answers ground everything that follows.
        </p>

        <div style={{ borderTop: `1px solid var(--cf-white-8)`, paddingTop: "2.5rem" }}>
          {!result && (
            <ShortFormationAssessment onSubmit={handleAssessmentSubmit} loading={loading} />
          )}

          {error && (
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: "rgba(255,100,100,0.8)", marginTop: "1rem", letterSpacing: "0.1em" }}>
              {error}
            </p>
          )}

          {result && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--cf-gold)" }}>
                Formation Framing
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(19px, 3.5vw, 23px)", lineHeight: 1.7, color: "var(--cf-ivory)" }}>
                {result.text}
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "var(--cf-ivory-28)" }}>
                Returning you to your dashboard…
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
