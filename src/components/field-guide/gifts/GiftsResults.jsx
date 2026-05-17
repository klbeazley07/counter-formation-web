// Results screen -- Session 5 (initial version, no trusted-person integration yet).
// Scoring: composite = (inclination × 0.50) + (fruitfulness × 0.50).
// Trusted-person integration and gap detection come in Session 7.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gifts, giftsByKey } from "../../../data/gifts";
import {
  loadProgress,
  hasCompletedAssessment,
} from "../../../utils/giftsAssessmentStorage";
import { GiftProfileModal } from "./GiftConstellation";

const RESULTS_STORAGE_KEY = "cf-gifts-results";

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  bgCardSoft: "#110F0D",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.30)",
  goldFaint: "rgba(201,168,76,0.12)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.07)",
};

const STYLES = `
  @keyframes cf-res-fade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cf-gift-card {
    background: ${C.bgCard};
    border: 1px solid ${C.border};
    padding: 36px 40px 32px;
    margin-bottom: 16px;
    transition: border-color 220ms ease;
  }
  .cf-gift-card:hover {
    border-color: ${C.goldDim};
  }
  .cf-quiet-item {
    background: transparent;
    border-bottom: 1px solid ${C.border};
    padding: 14px 0;
    cursor: pointer;
  }
  .cf-quiet-item:first-child {
    border-top: 1px solid ${C.border};
  }
  .cf-quiet-detail {
    overflow: hidden;
    transition: max-height 320ms ease, opacity 280ms ease;
  }
  .cf-results-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(6,5,10,0.96);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid ${C.goldDim};
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    z-index: 80;
    transform: translateY(100%);
    transition: transform 340ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
  .cf-results-footer.visible {
    transform: translateY(0);
  }
  @media (max-width: 600px) {
    .cf-gift-card {
      padding: 28px 24px 24px;
    }
    .cf-results-footer {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }
  }
`;

/* ─── SCORING ─────────────────────────────────────────────────────── */

function computeScores(progress) {
  const out = {};
  for (const gift of gifts) {
    const r = progress?.responses?.[gift.key];

    if (gift.category === "charismatic") {
      const de = r?.directExperience ?? null; // 0-4 scale value or null
      const fr = r?.fruitfulness ?? null;
      let tier;
      if (de == null) {
        tier = "notPresent";
      } else if (de >= 3 && fr != null && fr >= 3) {
        tier = "active";
      } else if (de === 0 || de === 1) {
        tier = "notPresent";
      } else {
        tier = "emerging";
      }
      out[gift.key] = { isCharismatic: true, directExperience: de, fruitfulness: fr, tier };
    } else {
      const inclRaw = r?.inclination ?? [null, null, null];
      const inclValues = inclRaw.map((v) => (v == null ? 50 : v * 25));
      const inclScore = inclValues.reduce((a, b) => a + b, 0) / inclValues.length;
      const frRaw = r?.fruitfulness ?? null;
      const frScore = frRaw == null ? 50 : frRaw * 25;
      const composite = inclScore * 0.5 + frScore * 0.5;
      const tier = composite >= 70 ? "active" : composite >= 50 ? "emerging" : "quiet";
      out[gift.key] = { isCharismatic: false, inclination: inclScore, fruitfulness: frScore, composite, tier };
    }
  }
  return out;
}

function saveResultsSnapshot(scores) {
  try {
    window.localStorage.setItem(
      RESULTS_STORAGE_KEY,
      JSON.stringify({ computedAt: new Date().toISOString(), scores }),
    );
  } catch {
    // Quota or private mode -- silently fail.
  }
}

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

function PendingBadge() {
  return (
    <span
      style={{
        display: "inline-block",
        border: `1px solid ${C.goldDim}`,
        color: C.gold,
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        padding: "3px 8px",
        marginBottom: 16,
      }}
    >
      Pending confirmation
    </span>
  );
}

function GiftCard({ gift, tier, formationText, onReadMore }) {
  const categoryLabel = {
    manifestation: "Manifestation",
    ministry: "Ministry",
    equipping: "Equipping",
    charismatic: "Charismatic",
  }[gift.category] ?? gift.category;

  return (
    <div className="cf-gift-card">
      <PendingBadge />
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
          margin: "0 0 20px",
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
          margin: "0 0 24px",
        }}
      >
        {formationText}
      </p>
      <button
        onClick={() => onReadMore(gift.key)}
        style={{
          background: "transparent",
          border: "none",
          color: C.gold,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 13,
          letterSpacing: "0.12em",
          cursor: "pointer",
          padding: 0,
          textTransform: "uppercase",
        }}
      >
        Read more →
      </button>
    </div>
  );
}

function QuietSection({ quietGifts, charismaticNotPresent }) {
  const [openKeys, setOpenKeys] = useState({});

  const toggle = (key) =>
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const allQuiet = [
    ...quietGifts,
    ...charismaticNotPresent,
  ];

  return (
    <section
      style={{
        maxWidth: 760,
        margin: "0 auto 80px",
        animation: "cf-res-fade 700ms ease-out 400ms both",
      }}
    >
      <SectionHeader>Quiet -- Not where the Spirit is most visibly working in you right now</SectionHeader>

      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: C.muted,
          marginBottom: 32,
        }}
      >
        These are gifts where your responses do not indicate strong current
        activity. This is information, not deficiency. The body is built by many
        gifts, and the Spirit gives different gifts to different believers
        according to his will (1 Corinthians 12:11). Some of these gifts are
        also commands that apply to every Christian regardless of giftedness --
        hospitality, mercy, serving, giving, evangelism -- and the call to
        practice them remains. The picture you see is of this season. The
        Spirit's distribution can shift as your context, calling, and the body's
        needs change over time; what is Quiet now may surface as Active in a
        later season. The instrument is designed to be retaken as life moves.
      </p>

      <div>
        {allQuiet.map((gift) => {
          const isOpen = !!openKeys[gift.key];
          const edgeText = gift.category === "charismatic"
            ? gift.edgeCases?.notPresent
            : gift.edgeCases?.quiet;

          return (
            <div
              key={gift.key}
              className="cf-quiet-item"
              onClick={() => toggle(gift.key)}
              role="button"
              aria-expanded={isOpen}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(gift.key);
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 18,
                    color: C.dim,
                    fontStyle: "italic",
                  }}
                >
                  {gift.name}
                </span>
                <span
                  style={{
                    color: C.dim,
                    fontSize: 18,
                    lineHeight: 1,
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 240ms ease",
                    flexShrink: 0,
                  }}
                >
                  ↓
                </span>
              </div>

              {isOpen && edgeText && (
                <div
                  className="cf-quiet-detail"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: 16,
                    paddingBottom: 8,
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: C.muted,
                      margin: 0,
                    }}
                  >
                    {edgeText}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CharismaticSection({ activeCharismatic, emergingCharismatic, onReadMore }) {
  if (activeCharismatic.length === 0 && emergingCharismatic.length === 0) return null;

  return (
    <section
      style={{
        maxWidth: 760,
        margin: "0 auto 80px",
        animation: "cf-res-fade 700ms ease-out 350ms both",
      }}
    >
      <SectionHeader>Charismatic Gifts</SectionHeader>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: C.muted,
          marginBottom: 32,
        }}
      >
        These two gifts are assessed differently from the core gifts -- on the
        basis of direct personal experience rather than inclination and
        community confirmation. They are given to some believers, not all (1
        Corinthians 12:30). The continuationist position held by this
        instrument is that both remain active and available; the absence of
        either is no commentary on your faith or the Spirit's presence in you.
      </p>

      {activeCharismatic.map((gift) => (
        <GiftCard
          key={gift.key}
          gift={gift}
          tier="active"
          formationText={gift.formationOutput.active.split("\n\n")[0]}
          onReadMore={onReadMore}
        />
      ))}

      {emergingCharismatic.map((gift) => (
        <GiftCard
          key={gift.key}
          gift={gift}
          tier="emerging"
          formationText={gift.edgeCases.emerging}
          onReadMore={onReadMore}
        />
      ))}
    </section>
  );
}

function TrustedPersonCTA({ sticky }) {
  return (
    <div
      style={
        sticky
          ? undefined
          : {
              maxWidth: 760,
              margin: "0 auto 120px",
              padding: "48px 48px 44px",
              border: `1px solid ${C.goldDim}`,
              background: C.bgCardSoft,
              animation: "cf-res-fade 700ms ease-out 500ms both",
            }
      }
    >
      {!sticky && (
        <>
          <Eyebrow>Complete the picture</Eyebrow>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(24px, 2.8vw, 30px)",
              color: C.ivory,
              margin: "0 0 16px",
              fontWeight: 400,
            }}
          >
            Your results are a draft until trusted people weigh in.
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15,
              lineHeight: 1.8,
              color: C.muted,
              margin: "0 0 28px",
            }}
          >
            Your results are draft until two or three trusted people in your
            life have completed the brief companion assessment about you. This
            is how the New Testament intends gifts to be confirmed -- in
            community, not in solo self-report. Send invitations now; you can
            always come back when their responses are in.
          </p>
        </>
      )}
      <Link
        to="/field-guide/gifts/invite"
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
          whiteSpace: "nowrap",
        }}
      >
        Send trusted-person invitations →
      </Link>
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────── */

export default function GiftsResults() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [modalKey, setModalKey] = useState(null);
  const [footerVisible, setFooterVisible] = useState(false);

  const progress = useMemo(() => loadProgress(), []);
  const hasCompleted = useMemo(() => hasCompletedAssessment(progress), [progress]);

  // Redirect if no completed assessment
  useEffect(() => {
    if (!hasCompleted) {
      navigate("/field-guide/gifts", { replace: true });
    }
  }, [hasCompleted, navigate]);

  const scores = useMemo(() => {
    if (!hasCompleted || !progress) return {};
    return computeScores(progress);
  }, [hasCompleted, progress]);

  // Save snapshot to localStorage
  useEffect(() => {
    if (hasCompleted && Object.keys(scores).length > 0) {
      saveResultsSnapshot(scores);
    }
  }, [hasCompleted, scores]);

  // Show sticky footer once user scrolls past the hero section
  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Partition gifts by tier
  const { active, emerging, quiet, charActive, charEmerging, charNotPresent } =
    useMemo(() => {
      const active = [];
      const emerging = [];
      const quiet = [];
      const charActive = [];
      const charEmerging = [];
      const charNotPresent = [];

      for (const gift of gifts) {
        const s = scores[gift.key];
        if (!s) continue;
        if (s.isCharismatic) {
          if (s.tier === "active") charActive.push(gift);
          else if (s.tier === "emerging") charEmerging.push(gift);
          else charNotPresent.push(gift);
        } else {
          if (s.tier === "active") active.push(gift);
          else if (s.tier === "emerging") emerging.push(gift);
          else quiet.push(gift);
        }
      }
      return { active, emerging, quiet, charActive, charEmerging, charNotPresent };
    }, [scores]);

  if (!hasCompleted) return null;

  return (
    <>
      <style>{STYLES}</style>

      <main
        style={{
          background: C.bg,
          color: C.ivory,
          minHeight: "100vh",
          paddingBottom: 80,
        }}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          style={{
            padding: "120px 24px 80px",
            borderBottom: `1px solid ${C.border}`,
            animation: "cf-res-fade 600ms ease-out both",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Eyebrow>Your formation gifts</Eyebrow>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 5vw, 60px)",
                lineHeight: 1.1,
                margin: "0 0 20px",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              Where the Spirit is at work through you
            </h1>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(18px, 2vw, 22px)",
                color: C.muted,
                lineHeight: 1.65,
                margin: "0 0 28px",
                maxWidth: 620,
              }}
            >
              Based on your responses. The full picture will come when two or
              three trusted people in your life have weighed in on what they
              have observed.
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: C.dim,
                lineHeight: 1.7,
                margin: 0,
                padding: "14px 18px",
                borderLeft: `2px solid ${C.goldDim}`,
              }}
            >
              Results are draft until at least two trusted-person responses are
              received. Send invitations now to complete the picture.
            </p>
          </div>
        </div>

        <div style={{ padding: "80px 24px 0" }}>
          {/* ── ACTIVE GIFTS ─────────────────────────────────────── */}
          {active.length > 0 && (
            <section
              style={{
                maxWidth: 760,
                margin: "0 auto 80px",
                animation: "cf-res-fade 700ms ease-out 150ms both",
              }}
            >
              <SectionHeader>
                Active -- The Spirit is currently at work in you in these ways
              </SectionHeader>
              {active.map((gift) => (
                <GiftCard
                  key={gift.key}
                  gift={gift}
                  tier="active"
                  formationText={gift.formationOutput.active.split("\n\n")[0]}
                  onReadMore={setModalKey}
                />
              ))}
            </section>
          )}

          {/* ── EMERGING GIFTS ───────────────────────────────────── */}
          {emerging.length > 0 && (
            <section
              style={{
                maxWidth: 760,
                margin: "0 auto 80px",
                animation: "cf-res-fade 700ms ease-out 250ms both",
              }}
            >
              <SectionHeader>
                Emerging -- The Spirit may be developing these in you
              </SectionHeader>
              {emerging.map((gift) => (
                <GiftCard
                  key={gift.key}
                  gift={gift}
                  tier="emerging"
                  formationText={gift.edgeCases.emerging}
                  onReadMore={setModalKey}
                />
              ))}
            </section>
          )}

          {/* ── CHARISMATIC GIFTS ────────────────────────────────── */}
          <CharismaticSection
            activeCharismatic={charActive}
            emergingCharismatic={charEmerging}
            onReadMore={setModalKey}
          />

          {/* ── QUIET GIFTS ──────────────────────────────────────── */}
          {(quiet.length > 0 || charNotPresent.length > 0) && (
            <QuietSection
              quietGifts={quiet}
              charismaticNotPresent={charNotPresent}
            />
          )}

          {/* ── TRUSTED PERSON CTA (bottom) ──────────────────────── */}
          <TrustedPersonCTA sticky={false} />
        </div>
      </main>

      {/* ── PERSISTENT FOOTER CTA ──────────────────────────────────── */}
      <div className={`cf-results-footer${footerVisible ? " visible" : ""}`}>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: C.muted,
            lineHeight: 1.5,
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 2,
            }}
          >
            Complete the picture
          </span>
          Results are draft until trusted people weigh in.
        </div>
        <TrustedPersonCTA sticky={true} />
      </div>

      {/* ── GIFT PROFILE MODAL ─────────────────────────────────────── */}
      <GiftProfileModal
        giftKey={modalKey}
        onClose={() => setModalKey(null)}
        onSwitchGift={(k) => setModalKey(k)}
      />
    </>
  );
}
