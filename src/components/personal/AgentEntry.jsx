import { useState } from "react";
import { Link } from "react-router-dom";
import { hasMeaningfulActivity } from "./HomeRouter";

/*
 * shouldNudge -- returns true when the agent should surface a re-engagement nudge.
 *
 * Conditions: onboarding completed, last nudge was more than 7 days ago,
 * and the user has meaningful formation activity.
 */
function shouldNudge(profile) {
  if (!profile?.agent?.onboardingCompletedAt) return false;
  if (!hasMeaningfulActivity(profile)) return false;
  const lastNudge = profile.agent.lastNudgeAt;
  if (!lastNudge) return false;
  const daysSince = (Date.now() - new Date(lastNudge).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > 7;
}

function cap30(arr) {
  const copy = [...arr];
  while (copy.length > 30) copy.shift();
  return copy;
}

/*
 * AgentEntry -- one-line formation companion surface on the dashboard.
 *
 * Sits below DashboardBanner, above DashboardWorkspace. Three states:
 *
 * 1. Onboarding CTA: user has activity but has not completed onboarding.
 * 2. Nudge state: onboarding done, >7 days since last engagement.
 *    Clicking fires /api/agent-reflect and shows the result inline.
 * 3. History state: onboarding done, not nudging. Shows last summary + link to /agent.
 *
 * Does not render if none of the above conditions are met.
 *
 * Props:
 *   profile        -- FormationProfile snapshot
 *   updateProfile  -- from useFormationProfile
 */
export default function AgentEntry({ profile, updateProfile }) {
  const [nudgePhase, setNudgePhase] = useState("idle"); // idle | loading | done
  const [nudgeText, setNudgeText]   = useState("");
  const [nudgeError, setNudgeError] = useState(null);

  if (!profile) return null;

  const agentHistory   = profile.agent?.history ?? [];
  const onboardingDone = !!profile.agent?.onboardingCompletedAt;
  const hasActivity    = hasMeaningfulActivity(profile);

  const showOnboardingCTA = !onboardingDone && hasActivity;
  const showNudge         = onboardingDone && shouldNudge(profile);
  const showHistory       = onboardingDone && !showNudge && agentHistory.length > 0;

  if (!showOnboardingCTA && !showNudge && !showHistory) return null;

  async function handleNudge() {
    if (nudgePhase !== "idle") return;
    setNudgePhase("loading");
    setNudgeError(null);
    try {
      const res = await fetch("/api/agent-reflect", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ kind: "nudge", profile }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Reflection failed.");

      const text = data.text || "";
      const now  = new Date().toISOString();
      const entry = {
        at:      now,
        kind:    "nudge",
        inputs:  {},
        summary: text.slice(0, 200).trim(),
      };

      updateProfile({
        agent: {
          lastNudgeAt: now,
          history:     cap30([entry, ...agentHistory]),
        },
      });

      setNudgeText(text);
      setNudgePhase("done");
    } catch (err) {
      setNudgeError(err.message || "Something went wrong.");
      setNudgePhase("idle");
    }
  }

  const lastSummary = showHistory ? (agentHistory[0]?.summary ?? "") : "";
  const truncated   = lastSummary.length > 120
    ? lastSummary.slice(0, 117).trimEnd() + "…"
    : lastSummary;

  // Nudge result -- expanded display with the returned text
  if (showNudge && nudgePhase === "done") {
    return (
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding:      "18px clamp(16px, 4vw, 48px)",
        display:      "flex",
        flexDirection: "column",
        gap:          "0.75rem",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle:  "italic",
          fontSize:   "clamp(15px, 2.2vw, 17px)",
          color:      "rgba(250,248,245,0.75)",
          lineHeight: 1.65,
          margin:     0,
        }}>
          {nudgeText}
        </p>
        <Link
          to="/agent"
          style={{
            alignSelf:      "flex-start",
            display:        "inline-flex",
            alignItems:     "center",
            gap:            5,
            color:          "#C9A84C",
            fontFamily:     "'Barlow Condensed', sans-serif",
            fontSize:       9,
            fontWeight:     700,
            letterSpacing:  "0.28em",
            textTransform:  "uppercase",
            textDecoration: "none",
          }}
        >
          View Formation Record
          <svg width="8" height="8" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1 4.5h7M4.5 1.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </Link>
      </div>
    );
  }

  const copy = showOnboardingCTA
    ? "You have formation history. Ground it with a short assessment."
    : showNudge
    ? "Your formation record has been quiet. Ready to check in?"
    : truncated;

  const ctaLabel = showOnboardingCTA
    ? "Begin"
    : showNudge
    ? (nudgePhase === "loading" ? "Forming…" : "Check In")
    : "Continue";

  return (
    <div style={{
      borderBottom:   "1px solid rgba(255,255,255,0.06)",
      padding:        "14px clamp(16px, 4vw, 48px)",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "space-between",
      gap:            "1rem",
      flexWrap:       "wrap",
    }}>
      <p style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle:  "italic",
        fontSize:   "clamp(14px, 2vw, 16px)",
        color:      "rgba(250,248,245,0.62)",
        lineHeight: 1.5,
        margin:     0,
        flex:       1,
        minWidth:   0,
      }}>
        {copy}
      </p>

      {nudgeError && (
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: "rgba(255,100,100,0.8)", letterSpacing: "0.1em", margin: 0 }}>
          {nudgeError}
        </p>
      )}

      {showNudge ? (
        <button
          onClick={handleNudge}
          disabled={nudgePhase === "loading"}
          style={{
            flexShrink:    0,
            display:       "inline-flex",
            alignItems:    "center",
            gap:           6,
            padding:       "8px 18px",
            borderRadius:  999,
            border:        "1px solid rgba(201,168,76,0.30)",
            background:    "transparent",
            color:         "#C9A84C",
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      10,
            fontWeight:    700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            cursor:        nudgePhase === "loading" ? "wait" : "pointer",
            whiteSpace:    "nowrap",
          }}
        >
          {ctaLabel}
          {nudgePhase !== "loading" && (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1 4.5h7M4.5 1.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      ) : (
        <Link
          to={showOnboardingCTA ? "/agent/onboarding" : "/agent"}
          style={{
            flexShrink:     0,
            display:        "inline-flex",
            alignItems:     "center",
            gap:            6,
            padding:        "8px 18px",
            borderRadius:   999,
            border:         "1px solid rgba(201,168,76,0.30)",
            background:     "transparent",
            color:          "#C9A84C",
            fontFamily:     "'Barlow Condensed', sans-serif",
            fontSize:       10,
            fontWeight:     700,
            letterSpacing:  "0.26em",
            textTransform:  "uppercase",
            textDecoration: "none",
            whiteSpace:     "nowrap",
          }}
        >
          {ctaLabel}
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
            <path d="M1 4.5h7M4.5 1.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </Link>
      )}
    </div>
  );
}
