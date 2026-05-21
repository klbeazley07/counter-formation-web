import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import { withScriptureRefs } from "../../utils/parseScriptureRefs";

/* Markdown overrides — inject ScriptureRef popovers into devotional text,
 * matching the DevotionGuide rendering. */
const MARKDOWN_COMPONENTS = {
  p:          ({ node, children, ...props }) => <p {...props}>{withScriptureRefs(children)}</p>,
  li:         ({ node, children, ...props }) => <li {...props}>{withScriptureRefs(children)}</li>,
  blockquote: ({ node, children, ...props }) => <blockquote {...props}>{withScriptureRefs(children)}</blockquote>,
  h1:         ({ node, children, ...props }) => <h1 {...props}>{withScriptureRefs(children)}</h1>,
  h2:         ({ node, children, ...props }) => <h2 {...props}>{withScriptureRefs(children)}</h2>,
  h3:         ({ node, children, ...props }) => <h3 {...props}>{withScriptureRefs(children)}</h3>,
  em:         ({ node, children, ...props }) => <em {...props}>{withScriptureRefs(children)}</em>,
  strong:     ({ node, children, ...props }) => <strong {...props}>{withScriptureRefs(children)}</strong>,
};

const KIND_LABELS = {
  onboarding: "Formation Assessment",
  nudge:      "Re-engagement",
  reflection: "Reflection",
};

const KIND_COLORS = {
  onboarding: "var(--cf-gold)",
  nudge:      "rgba(201,168,76,0.65)",
  reflection: "rgba(250,248,245,0.45)",
};

const DEVOTION_CHIP_COLOR = "rgba(201,168,76,0.85)";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

/* ──────────────────────────────────────────────────────────────────────
 *  Profile summary block
 *  ───────────────────────────────────────────────────────────────────── */
function ProfileSummary({ profile }) {
  const edges      = profile?.assessment?.formationEdge ?? [];
  const armorN     = profile?.armor?.completedPieces?.length ?? 0;
  const challengeN = profile?.challenge?.completedDays?.length ?? 0;
  const intention  = profile?.onboarding?.intention?.trim() || null;

  const hasAnything = edges.length > 0 || armorN > 0 || challengeN > 0 || intention;
  if (!hasAnything) {
    return (
      <div style={{
        padding:       "20px 24px",
        borderRadius:  12,
        border:        "1px dashed rgba(201,168,76,0.25)",
        background:    "rgba(201,168,76,0.04)",
        marginBottom:  "2.5rem",
      }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle:  "italic",
          fontSize:   "clamp(16px, 2.8vw, 18px)",
          color:      "var(--cf-ivory-62)",
          lineHeight: 1.6,
          margin:     0,
        }}>
          Your formation profile will appear here as you take the assessment, work through the armor pieces, and complete devotional rhythms.
        </p>
      </div>
    );
  }

  const rows = [];
  if (edges.length > 0) {
    rows.push({
      label: "Formation edge",
      value: edges.join(" · "),
    });
  }
  rows.push({
    label: "Armor pieces complete",
    value: `${armorN} / 6`,
  });
  rows.push({
    label: "Challenge days complete",
    value: `${challengeN} / 7`,
  });
  if (intention) {
    rows.push({
      label: "Intention",
      value: intention,
      italic: true,
    });
  }

  return (
    <div style={{
      padding:       "24px 28px",
      borderRadius:  14,
      border:        "1px solid rgba(201,168,76,0.18)",
      background:    "rgba(201,168,76,0.04)",
      marginBottom:  "2.5rem",
      display:       "flex",
      flexDirection: "column",
      gap:           "1rem",
    }}>
      <p style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontSize:      9,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color:         "var(--cf-gold)",
        margin:        0,
      }}>
        Your Formation Profile
      </p>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color:         "var(--cf-ivory-28)",
          }}>
            {r.label}
          </span>
          <span style={{
            fontFamily: r.italic ? "'Cormorant Garamond', serif" : "'Barlow Condensed', sans-serif",
            fontStyle:  r.italic ? "italic" : "normal",
            fontSize:   r.italic ? "clamp(16px, 2.8vw, 19px)" : 14,
            lineHeight: 1.55,
            color:      "var(--cf-ivory)",
            letterSpacing: r.italic ? "normal" : "0.06em",
          }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 *  Timeline cards
 *  ───────────────────────────────────────────────────────────────────── */

function AssessmentCard({ entry }) {
  return (
    <div style={{
      padding:       "20px 24px",
      borderRadius:  12,
      border:        "1px solid var(--cf-white-8)",
      background:    "var(--cf-rule-bg)",
      display:       "flex",
      flexDirection: "column",
      gap:           "0.75rem",
    }}>
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
  );
}

function DevotionCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const passageLine = entry.passage?.trim() || entry.bigIdea?.trim() || entry.theme?.trim() || "Untitled devotion";
  const hasFull     = !!entry.full?.trim();
  const summary     = entry.summary?.trim();

  return (
    <div style={{
      padding:       "20px 24px",
      borderRadius:  12,
      border:        "1px solid var(--cf-white-8)",
      background:    "var(--cf-rule-bg)",
      display:       "flex",
      flexDirection: "column",
      gap:           "0.75rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:      9,
          fontWeight:    700,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color:         DEVOTION_CHIP_COLOR,
          border:        `1px solid ${DEVOTION_CHIP_COLOR}`,
          borderRadius:  999,
          padding:       "3px 10px",
        }}>
          Devotion
        </span>
        <span style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:      10,
          letterSpacing: "0.14em",
          color:         "var(--cf-ivory-28)",
        }}>
          {formatDate(entry.generatedAt)}
        </span>
        {entry.theme?.trim() && (
          <span style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color:         "var(--cf-ivory-28)",
          }}>
            · {entry.theme.trim()}
          </span>
        )}
      </div>

      <p style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontSize:      13,
        fontWeight:    700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         "var(--cf-ivory)",
        margin:        0,
      }}>
        {passageLine}
      </p>

      {expanded && hasFull ? (
        <div className="dh-devotion-body" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize:   "clamp(16px, 2.8vw, 19px)",
          color:      "var(--cf-ivory-72)",
          lineHeight: 1.75,
        }}>
          <ReactMarkdown components={MARKDOWN_COMPONENTS}>{entry.full}</ReactMarkdown>
        </div>
      ) : summary ? (
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle:  "italic",
          fontSize:   "clamp(16px, 2.8vw, 19px)",
          color:      "var(--cf-ivory-62)",
          lineHeight: 1.7,
          margin:     0,
        }}>
          {summary}…
        </p>
      ) : null}

      {hasFull && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          style={{
            alignSelf:      "flex-start",
            fontFamily:     "'Barlow Condensed', sans-serif",
            fontSize:       9,
            fontWeight:     700,
            letterSpacing:  "0.28em",
            textTransform:  "uppercase",
            color:          "var(--cf-gold)",
            background:     "transparent",
            border:         "none",
            padding:        "4px 0 0",
            cursor:         "pointer",
          }}
        >
          {expanded ? "Hide full devotion ▲" : "Read full devotion ▼"}
        </button>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 *  AgentHistory page
 *  ───────────────────────────────────────────────────────────────────── */
export default function AgentHistory() {
  const { profile, isLoaded } = useFormationProfile();

  if (!isLoaded) return null;

  const agentEvents = profile?.agent?.history ?? [];
  const devotions   = profile?.widgets?.devotions ?? [];

  const timeline = [
    ...agentEvents.map(e => ({
      type:  "assessment",
      at:    e.at,
      entry: e,
    })),
    ...devotions.map(e => ({
      type:  "devotion",
      at:    e.generatedAt,
      entry: e,
    })),
  ]
    .filter(t => !!t.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at));

  return (
    <div style={{ minHeight: "100dvh", backgroundColor: "var(--cf-hero-bg)", color: "var(--cf-ivory)" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(40px, 6vw, 80px) 24px clamp(60px, 8vw, 100px)" }}>

        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.42em", textTransform: "uppercase", color: "var(--cf-gold)", marginBottom: "1.25rem" }}>
          Formation Agent
        </p>
        <h1 style={{ fontFamily: "'Michroma', sans-serif", fontSize: "clamp(26px, 5vw, 44px)", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--cf-ivory)", lineHeight: 0.95, marginBottom: "1.25rem" }}>
          Your Formation Record
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(17px, 3.2vw, 21px)", color: "var(--cf-ivory-62)", lineHeight: 1.65, marginBottom: "2.5rem", maxWidth: 560 }}>
          A record of where you are and what the agent has spoken into your formation.
        </p>

        <ProfileSummary profile={profile} />

        <div style={{ borderTop: "1px solid var(--cf-white-8)", paddingTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <p style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      9,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color:         "var(--cf-ivory-28)",
            margin:        0,
          }}>
            Timeline
          </p>

          {timeline.length === 0 ? (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 18, color: "var(--cf-ivory-28)", lineHeight: 1.6 }}>
              No formation entries yet. Take the assessment or generate your first devotion to begin.
            </p>
          ) : (
            timeline.map((t, i) =>
              t.type === "assessment"
                ? <AssessmentCard key={`a-${t.at}-${i}`} entry={t.entry} />
                : <DevotionCard   key={`d-${t.at}-${i}`} entry={t.entry} />
            )
          )}
        </div>

        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--cf-white-8)" }}>
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
