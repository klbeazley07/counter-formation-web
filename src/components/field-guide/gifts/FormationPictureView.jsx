// Formation Picture -- integrated view of Fruit of the Spirit + Spiritual Gifts assessments.
// Route: /field-guide/formation
// Requires both assessments complete; shows an inline prerequisite screen otherwise.

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormationProfile } from "../../../hooks/useFormationProfile";
import { FRUITS } from "../../../fruitAssessmentData";
import { gifts } from "../../../data/gifts";
import {
  loadProgress,
  hasCompletedAssessment,
} from "../../../utils/giftsAssessmentStorage";
import { computeScores } from "../../../utils/scoreCompute";
import { getIntegratedReflection } from "../../../utils/integratedReflection";
import { ScriptureRef } from "../../../ScriptureRef";

/* ─── TOKENS ──────────────────────────────────────────────────────── */

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  bgCardSoft: "#110F0D",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.30)",
  goldFaint: "rgba(201,168,76,0.10)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.07)",
};

const STYLES = `
  @keyframes cf-fp-fade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cf-fp-card {
    background: ${C.bgCard};
    border: 1px solid ${C.border};
    padding: 36px 40px 32px;
    margin-bottom: 16px;
    transition: border-color 220ms ease;
  }
  .cf-fp-card:hover { border-color: ${C.goldDim}; }
  @media (max-width: 600px) {
    .cf-fp-card { padding: 28px 24px 24px; }
  }
`;

/* ─── STATIC INTEGRATION PROSE ───────────────────────────────────── */

const INTEGRATION_PARAGRAPHS = [
  "The fruit of the Spirit and the gifts of the Spirit are not two separate topics in Paul's letters. They describe two dimensions of the same reality: what the Spirit is producing in your character over time, and what the Spirit is doing through you in the body of Christ. Galatians 5:22-23 describes inward formation. First Corinthians 12 describes outward function. Both are the work of the same Spirit, and both are necessary to a whole picture of how the Spirit moves.",
  "A common mistake is to treat character formation and gifted service as competing concerns -- as though attending to your fruit means you are too inward, or as though functioning in your gifts means you have skipped the harder work of character. The New Testament holds them together without apology. The fruit of the Spirit is not a precondition for the gifts, and the gifts are not a shortcut past formation. They grow together in the same believer, through the same Spirit, toward the same end: the building up of the body and the glory of Christ.",
  "Gifts without character formation are unstable. Paul's corrective to the Corinthian church was not to tell them to stop operating in their gifts; it was to tell them, in chapter 13, that gifts exercised without love are noise. The gift serves the body well when it is carried by a person who is being formed -- whose patience under pressure, whose kindness toward difficult people, whose faithfulness over time, are the soil from which the gift grows. Formation is not separate from gifted service. It is what keeps the gift from becoming a performance.",
  "The formation picture in front of you is a starting point. The Spirit is working in both directions simultaneously -- shaping your character and moving through you in service to others. The best response to this picture is not a program to complete but a posture to hold: attentiveness to where the Spirit is forming you, and availability to where the Spirit is moving through you.",
];

/* ─── SUB-COMPONENTS ──────────────────────────────────────────────── */

function Eyebrow({ children, style }) {
  return (
    <div
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 11,
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color: C.gold,
        marginBottom: 12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Michroma', sans-serif",
        fontSize: "clamp(11px, 1.4vw, 13px)",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: C.ivory,
        borderBottom: `1px solid ${C.goldDim}`,
        paddingBottom: 16,
        marginBottom: 32,
      }}
    >
      {children}
    </div>
  );
}

function FruitCard({ fruitKey }) {
  const fruit = FRUITS[fruitKey];
  if (!fruit) return null;

  return (
    <div className="cf-fp-card">
      <Eyebrow style={{ marginBottom: 8 }}>{fruit.greek}</Eyebrow>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(26px, 3vw, 34px)",
          lineHeight: 1.15,
          color: C.ivory,
          margin: "0 0 14px",
          fontWeight: 400,
        }}
      >
        {fruit.label}
      </h3>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: C.muted,
          margin: "0 0 20px",
        }}
      >
        {fruit.formationStatement.split(". ")[0] + "."}
      </p>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 15,
          fontStyle: "italic",
          color: C.dim,
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {fruit.scripture.text}{" "}
        <span style={{ fontStyle: "normal", fontSize: 13, letterSpacing: "0.06em" }}>
          -- <ScriptureRef reference={fruit.scripture.reference} text={fruit.scripture.text} />
        </span>
      </p>
    </div>
  );
}

function GiftCard({ gift }) {
  const categoryLabel = {
    manifestation: "Manifestation",
    ministry: "Ministry",
    equipping: "Equipping",
  }[gift.category] ?? gift.category;

  return (
    <div className="cf-fp-card">
      <Eyebrow style={{ marginBottom: 8 }}>{categoryLabel}</Eyebrow>
      <h3
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(26px, 3vw, 34px)",
          lineHeight: 1.15,
          color: C.ivory,
          margin: "0 0 10px",
          fontWeight: 400,
        }}
      >
        {gift.name}
      </h3>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(17px, 1.9vw, 20px)",
          fontStyle: "italic",
          color: C.muted,
          lineHeight: 1.6,
          margin: "0 0 16px",
        }}
      >
        {gift.essenceStatement}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.75,
          color: C.muted,
          margin: 0,
        }}
      >
        {gift.formationOutput.active.split("\n\n")[0]}
      </p>
    </div>
  );
}

function PrerequisiteScreen({ fruitDone, giftsDone }) {
  const missing = [];
  if (!fruitDone)
    missing.push({
      label: "Fruit of the Spirit Assessment",
      path: "/field-guide/scripture-before-scroll",
    });
  if (!giftsDone)
    missing.push({
      label: "Spiritual Gifts Assessment",
      path: "/field-guide/gifts",
    });

  return (
    <main
      style={{
        background: C.bg,
        color: C.ivory,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "96px 24px",
      }}
    >
      <div style={{ maxWidth: 580, width: "100%" }}>
        <Eyebrow>Your Formation Picture</Eyebrow>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(30px, 4.5vw, 52px)",
            lineHeight: 1.12,
            margin: "0 0 24px",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          The Formation Picture requires both assessments complete.
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            lineHeight: 1.8,
            color: C.muted,
            margin: "0 0 36px",
          }}
        >
          The Formation Picture integrates your Fruit of the Spirit results and
          your Spiritual Gifts results into a single view. Complete the
          {missing.length === 2 ? " two assessments below" : " assessment below"} to
          see your full picture.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {missing.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                display: "inline-block",
                background: C.gold,
                color: C.bg,
                fontFamily: "'Michroma', sans-serif",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "14px 28px",
                alignSelf: "flex-start",
              }}
            >
              Take the {label} →
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */

export default function FormationPictureView() {
  const { profile, isLoaded } = useFormationProfile();

  const progress = useMemo(() => loadProgress(), []);
  const giftsComplete = useMemo(() => hasCompletedAssessment(progress), [progress]);
  const fruitComplete =
    isLoaded && profile?.assessment?.completedAt != null && profile?.assessment?.fruits != null;

  // Formation fruits: 3 lowest-scoring fruits
  const formationFruitKeys = useMemo(() => {
    const scores = profile?.assessment?.fruits;
    if (!scores) return [];
    return Object.entries(scores)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([k]) => k);
  }, [profile]);

  const topFormationFruitKey = formationFruitKeys[0] ?? null;
  const topFormationFruit = topFormationFruitKey ? FRUITS[topFormationFruitKey] : null;

  // Active gifts from scoring
  const { scores: giftScores } = useMemo(() => {
    if (!giftsComplete || !progress) return { scores: {} };
    return computeScores(progress);
  }, [giftsComplete, progress]);

  const activeGifts = useMemo(() => {
    return gifts.filter((g) => {
      const s = giftScores[g.key];
      return (
        s &&
        !s.isCharismatic &&
        (s.tier === "active" || s.tier === "activePendingConfirmation")
      );
    });
  }, [giftScores]);

  const topActiveGift = activeGifts[0] ?? null;

  // Integrated reflection
  const [reflection, setReflection] = useState(null);
  const [reflectionLoading, setReflectionLoading] = useState(false);

  useEffect(() => {
    if (!topFormationFruit || !topActiveGift) return;
    setReflectionLoading(true);
    getIntegratedReflection(
      topFormationFruitKey,
      topFormationFruit.label,
      topActiveGift.key,
      topActiveGift.name,
    ).then((text) => {
      setReflection(text);
      setReflectionLoading(false);
    });
  }, [topFormationFruitKey, topActiveGift?.key]);

  // Wait for profile to load before checking prerequisites
  if (!isLoaded) return null;

  if (!fruitComplete || !giftsComplete) {
    return (
      <PrerequisiteScreen fruitDone={fruitComplete} giftsDone={giftsComplete} />
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <main style={{ background: C.bg, color: C.ivory, minHeight: "100vh", paddingBottom: 80 }}>

        {/* ── HERO ────────────────────────────────────────────────── */}
        <div
          style={{
            padding: "120px 24px 80px",
            borderBottom: `1px solid ${C.border}`,
            animation: "cf-fp-fade 600ms ease-out both",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Eyebrow>Your Formation Picture</Eyebrow>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 5vw, 62px)",
                lineHeight: 1.1,
                margin: "0 0 20px",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              How the Spirit is at work in you right now
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(18px, 2vw, 22px)",
                color: C.muted,
                lineHeight: 1.65,
                margin: 0,
                maxWidth: 620,
              }}
            >
              Your formation fruit and your active gifts together -- the two
              dimensions of one Spirit's work in and through you.
            </p>
          </div>
        </div>

        <div style={{ padding: "80px 24px 0" }}>

          {/* ── SECTION 1: FORMATION FRUIT ──────────────────────── */}
          <section
            style={{
              maxWidth: 760,
              margin: "0 auto 80px",
              animation: "cf-fp-fade 700ms ease-out 100ms both",
            }}
          >
            <SectionHeader>Where the Spirit is shaping your character</SectionHeader>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 15,
                lineHeight: 1.8,
                color: C.muted,
                marginBottom: 32,
              }}
            >
              These are the fruits of the Spirit where formation is most active
              in you right now -- where the Spirit has the most room to work.
              They are not deficiencies. They are the Spirit's current growing edge in you.
            </p>
            {formationFruitKeys.map((key) => (
              <FruitCard key={key} fruitKey={key} />
            ))}
          </section>

          {/* ── SECTION 2: ACTIVE GIFTS ─────────────────────────── */}
          <section
            style={{
              maxWidth: 760,
              margin: "0 auto 80px",
              animation: "cf-fp-fade 700ms ease-out 200ms both",
            }}
          >
            <SectionHeader>How the Spirit is moving through you</SectionHeader>
            {activeGifts.length > 0 ? (
              <>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: C.muted,
                    marginBottom: 32,
                  }}
                >
                  These are the gifts where the Spirit is most clearly at work
                  through you to build up the body of Christ.
                </p>
                {activeGifts.map((gift) => (
                  <GiftCard key={gift.key} gift={gift} />
                ))}
              </>
            ) : (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(17px, 1.9vw, 20px)",
                  fontStyle: "italic",
                  color: C.muted,
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                Your gifts assessment did not surface clear Active gifts yet. This
                may mean gifts are still emerging, or that trusted-person responses
                would shift the picture.{" "}
                <Link
                  to="/field-guide/gifts/results"
                  style={{ color: C.gold, textDecoration: "none" }}
                >
                  Review your gifts results →
                </Link>
              </p>
            )}
          </section>

          {/* ── SECTION 3: THE INTEGRATION ──────────────────────── */}
          <section
            style={{
              maxWidth: 760,
              margin: "0 auto 80px",
              animation: "cf-fp-fade 700ms ease-out 300ms both",
            }}
          >
            <SectionHeader>The two together</SectionHeader>

            {INTEGRATION_PARAGRAPHS.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.85,
                  color: C.muted,
                  margin: "0 0 24px",
                }}
              >
                {para}
              </p>
            ))}

            {/* Generated reflection */}
            {(reflection || reflectionLoading) && topFormationFruit && topActiveGift && (
              <div
                style={{
                  marginTop: 40,
                  padding: "32px 36px",
                  background: C.bgCardSoft,
                  borderLeft: `3px solid ${C.gold}`,
                  animation: reflection ? "cf-fp-fade 600ms ease-out both" : undefined,
                }}
              >
                <Eyebrow style={{ marginBottom: 16 }}>
                  {topFormationFruit.label} + {topActiveGift.name}
                </Eyebrow>
                {reflectionLoading && !reflection ? (
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 17,
                      fontStyle: "italic",
                      color: C.dim,
                      margin: 0,
                    }}
                  >
                    Composing your reflection...
                  </p>
                ) : (
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(17px, 1.9vw, 20px)",
                      fontStyle: "italic",
                      color: C.ivory,
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    {reflection}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* ── SECTION 4: THE NEXT STEP ────────────────────────── */}
          <section
            style={{
              maxWidth: 760,
              margin: "0 auto 80px",
              padding: "48px 48px 44px",
              border: `1px solid ${C.goldDim}`,
              background: C.bgCardSoft,
              animation: "cf-fp-fade 700ms ease-out 400ms both",
            }}
          >
            <Eyebrow>The next step</Eyebrow>
            {topFormationFruit && topActiveGift ? (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  color: C.ivory,
                  lineHeight: 1.65,
                  margin: "0 0 20px",
                }}
              >
                Your results suggest the Spirit is forming{" "}
                <span style={{ color: C.gold }}>{topFormationFruit.label}</span>{" "}
                in you while moving through you in{" "}
                <span style={{ color: C.gold }}>{topActiveGift.name}</span>. The
                next step is to find the place where both can be exercised
                together -- where you can serve in your gift while your character
                is being shaped further.
              </p>
            ) : (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  color: C.ivory,
                  lineHeight: 1.65,
                  margin: "0 0 20px",
                }}
              >
                The next step is to find the place where your formation and your
                gifting meet -- where you can serve the body while the Spirit
                continues his shaping work in you.
              </p>
            )}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: C.dim,
                lineHeight: 1.7,
                margin: "0 0 28px",
              }}
            >
              Formation pathways -- structured guides for putting this picture
              into practice -- are coming to Counter Formation.
            </p>
            <Link
              to="/field-guide"
              style={{
                display: "inline-block",
                background: C.gold,
                color: C.bg,
                fontFamily: "'Michroma', sans-serif",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "14px 28px",
              }}
            >
              Explore the formation pathways →
            </Link>
          </section>

        </div>
      </main>
    </>
  );
}
