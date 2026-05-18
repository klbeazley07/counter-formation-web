import { Link } from "react-router-dom";
import { hasMeaningfulActivity } from "./HomeRouter";

/*
 * AgentEntry -- one-line formation companion surface on the dashboard.
 *
 * Sits below DashboardBanner, above DashboardWorkspace. Two states:
 *
 * 1. Onboarding CTA: shown when the user has meaningful activity but has
 *    not yet completed the agent onboarding assessment.
 * 2. History state: shown when the user has at least one agent history entry.
 *    Surfaces the last summary and a "Continue" link.
 *
 * Does not render at all if neither condition is met.
 *
 * Props:
 *   profile  -- FormationProfile snapshot from useFormationProfile
 */

export default function AgentEntry({ profile }) {
  if (!profile) return null;

  const agentHistory  = profile.agent?.history ?? [];
  const onboardingDone = !!profile.agent?.onboardingCompletedAt;
  const hasActivity   = hasMeaningfulActivity(profile);

  const showOnboardingCTA = !onboardingDone && hasActivity;
  const showHistory       = onboardingDone && agentHistory.length > 0;

  if (!showOnboardingCTA && !showHistory) return null;

  const lastSummary = showHistory ? agentHistory[0]?.summary ?? "" : "";
  const truncated   = lastSummary.length > 120
    ? lastSummary.slice(0, 117).trimEnd() + "…"
    : lastSummary;

  const href = !onboardingDone ? "/agent/onboarding" : "/agent/onboarding";

  return (
    <div style={{
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding:      "14px clamp(16px, 4vw, 48px)",
      display:      "flex",
      alignItems:   "center",
      justifyContent: "space-between",
      gap:          "1rem",
      flexWrap:     "wrap",
    }}>
      <p style={{
        fontFamily:    "'Cormorant Garamond', serif",
        fontStyle:     "italic",
        fontSize:      "clamp(14px, 2vw, 16px)",
        color:         "rgba(250,248,245,0.62)",
        lineHeight:    1.5,
        margin:        0,
        flex:          1,
        minWidth:      0,
      }}>
        {showOnboardingCTA
          ? "You have formation history. Ground it with a short assessment."
          : truncated}
      </p>

      <Link
        to={href}
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
          textDecoration: "none",
          whiteSpace:    "nowrap",
        }}
      >
        {showOnboardingCTA ? "Begin" : "Continue"}
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path d="M1 4.5h7M4.5 1.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </Link>
    </div>
  );
}
