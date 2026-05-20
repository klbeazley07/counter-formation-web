import { Link } from "react-router-dom";
import { useFormationProfile } from "../../hooks/useFormationProfile";

const KIND_LABELS = {
  onboarding: "Formation Assessment",
  nudge:      "Re-engagement",
  reflection: "Reflection",
};

const KIND_COLORS = {
  onboarding: "#C9A84C",
  nudge:      "rgba(201,168,76,0.65)",
  reflection: "rgba(250,248,245,0.45)",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

export default function AgentHistory() {
  const { profile, isLoaded } = useFormationProfile();

  if (!isLoaded) return null;

  const history = profile?.agent?.history ?? [];
  const sorted  = [...history].sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--cf-hero-bg)", color: "var(--cf-ivory)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px clamp(60px, 8vw, 100px)" }}>

        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: "1.25rem" }}>
          Formation Agent
        </p>
        <h1 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(26px, 5vw, 44px)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cf-ivory)", lineHeight: 0.95, marginBottom: "1.25rem" }}>
          Your Formation Record
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(17px, 3.2vw, 21px)", color: "var(--cf-ivory-62)", lineHeight: 1.65, marginBottom: "3rem", maxWidth: 560 }}>
          A record of every time the agent has spoken into your formation.
        </p>

        <div style={{ borderTop: `1px solid var(--cf-white-8)`, paddingTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {sorted.length === 0 ? (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: "var(--cf-ivory-28)", lineHeight: 1.6 }}>
              No formation records yet. Take the assessment to begin.
            </p>
          ) : (
            sorted.map((entry, i) => (
              <div
                key={i}
                style={{
                  padding:       "20px 24px",
                  borderRadius:  12,
                  border:        `1px solid var(--cf-white-8)`,
                  background:    "var(--cf-rule-bg)",
                  display:       "flex",
                  flexDirection: "column",
                  gap:           "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily:    "'Barlow Condensed', sans-serif",
                    fontSize:      9,
                    fontWeight:    700,
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    color:         KIND_COLORS[entry.kind] ?? "var(--cf-gold)",
                    border:        `1px solid ${KIND_COLORS[entry.kind] ?? "var(--cf-gold)"}`,
                    borderRadius:  999,
                    padding:       "3px 10px",
                  }}>
                    {KIND_LABELS[entry.kind] ?? entry.kind}
                  </span>
                  <span style={{
                    fontFamily:    "'Barlow Condensed', sans-serif",
                    fontSize:      10,
                    letterSpacing: "0.14em",
                    color:         "var(--cf-ivory-28)",
                  }}>
                    {formatDate(entry.at)}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle:  "italic",
                  fontSize:   "clamp(16px, 2.8vw, 19px)",
                  color:      "var(--cf-ivory-62)",
                  lineHeight: 1.7,
                  margin:     0,
                }}>
                  {entry.summary}
                </p>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid var(--cf-white-8)` }}>
          <Link
            to="/agent/onboarding"
            style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            6,
              padding:        "14px 28px",
              borderRadius:   999,
              border:         "1px solid rgba(201,168,76,0.30)",
              background:     "transparent",
              color:          "var(--cf-gold)",
              fontFamily:     "'Barlow Condensed', sans-serif",
              fontSize:       10,
              fontWeight:     700,
              letterSpacing:  "0.26em",
              textTransform:  "uppercase",
              textDecoration: "none",
            }}
          >
            Take a New Assessment
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
              <path d="M1 4.5h7M4.5 1.5l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
