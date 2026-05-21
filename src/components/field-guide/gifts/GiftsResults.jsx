// Results screen -- updated in Session 7 with full trusted-person scoring and gap detection.
// Scoring: compositeScores from scoreCompute.js (inclination 30% + fruitfulness 30% + confirmation 40%).
// Falls back to 50/50 when no trusted data; shows "pending confirmation" badge until confirmed.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gifts, giftsByKey } from "../../../data/gifts";
import {
  loadProgress,
  hasCompletedAssessment,
  STORAGE_KEY,
  TOTAL_QUESTIONS,
} from "../../../utils/giftsAssessmentStorage";
import { computeScores } from "../../../utils/scoreCompute";
import { detectGaps } from "../../../utils/gapDetection";
import { GiftProfileModal } from "./GiftConstellation";
import { ScriptureRef } from "../../../ScriptureRef";
import { useFormationProfile } from "../../../hooks/useFormationProfile";
import { supabase } from "../../../utils/supabaseClient";
import { getSessionId } from "../../../utils/giftsSessionId";
import { mirrorGiftsToProfile } from "../../../utils/giftsProfileMirror";
import EmailCapture from "../../auth/EmailCapture";

const TRUSTED_RESPONSES_KEY = "cf-gifts-trusted-responses";

const RESULTS_STORAGE_KEY = "cf-gifts-results";


const STYLES = `
  @keyframes cf-res-fade {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cf-gift-card {
    background: ${"var(--cf-obsidian)"};
    border: 1px solid ${"var(--cf-white-8)"};
    padding: 36px 40px 32px;
    margin-bottom: 16px;
    transition: border-color 220ms ease;
  }
  .cf-gift-card:hover {
    border-color: ${"var(--cf-gold-mid)"};
  }
  .cf-quiet-item {
    background: transparent;
    border-bottom: 1px solid ${"var(--cf-white-8)"};
    padding: 14px 0;
    cursor: pointer;
  }
  .cf-quiet-item:first-child {
    border-top: 1px solid ${"var(--cf-white-8)"};
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
    border-top: 1px solid ${"var(--cf-gold-mid)"};
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

function saveResultsSnapshot(scores, totalTrustedPersons) {
  try {
    window.localStorage.setItem(
      RESULTS_STORAGE_KEY,
      JSON.stringify({ computedAt: new Date().toISOString(), totalTrustedPersons, scores }),
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
        color: "var(--cf-gold)",
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
        color: "var(--cf-ivory)",
        borderBottom: `1px solid ${"var(--cf-gold-mid)"}`,
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
        border: `1px solid ${"var(--cf-gold-mid)"}`,
        color: "var(--cf-gold)",
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

function GiftCard({ gift, showPending, formationText, onReadMore }) {
  const categoryLabel = {
    manifestation: "Manifestation",
    ministry: "Ministry",
    equipping: "Equipping",
    charismatic: "Charismatic",
  }[gift.category] ?? gift.category;

  return (
    <div className="cf-gift-card">
      {showPending && <PendingBadge />}
      <Eyebrow style={{ marginBottom: 8 }}>{categoryLabel}</Eyebrow>
      <h3
        style={{
          fontFamily: "var(--cf-font-devotional)",
          fontSize: "clamp(26px, 3vw, 34px)",
          lineHeight: 1.15,
          color: "var(--cf-ivory)",
          margin: "0 0 10px",
          fontWeight: 400,
        }}
      >
        {gift.name}
      </h3>
      <p
        style={{
          fontFamily: "var(--cf-font-devotional)",
          fontSize: "clamp(17px, 1.9vw, 20px)",
          fontStyle: "italic",
          color: "var(--cf-ivory-62)",
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
          color: "var(--cf-ivory-62)",
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
          color: "var(--cf-gold)",
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

function GapSection({ gaps, onReadMore }) {
  const gapGifts = Object.entries(gaps)
    .map(([key, flags]) => ({ gift: giftsByKey[key], flags }))
    .filter((e) => e.gift);

  if (gapGifts.length === 0) return null;

  return (
    <section
      style={{
        maxWidth: 760,
        margin: "0 auto 80px",
        animation: "cf-res-fade 700ms ease-out 175ms both",
      }}
    >
      <SectionHeader>Worth paying attention to</SectionHeader>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: "var(--cf-ivory-62)",
          marginBottom: 32,
        }}
      >
        The following gifts show a meaningful gap between what you reported about
        yourself and what the people who know you have observed. These gaps are
        worth taking seriously -- they are not contradictions to resolve, but
        questions to sit with.
      </p>

      {gapGifts.map(({ gift, flags }) => {
        const gapText = flags.inclinationConfirmationGap
          ? gift.edgeCases?.inclinationConfirmationGap
          : gift.edgeCases?.confirmationInclinationGap;

        return (
          <div
            key={gift.key}
            style={{
              background: "var(--cf-surface-raised)",
              border: `1px solid ${"var(--cf-gold-mid)"}`,
              padding: "32px 36px 28px",
              marginBottom: 16,
            }}
          >
            <Eyebrow style={{ marginBottom: 6 }}>
              {flags.inclinationConfirmationGap
                ? "You see it; others don't -- yet"
                : "Others see it; you don't -- yet"}
            </Eyebrow>
            <h3
              style={{
                fontFamily: "var(--cf-font-devotional)",
                fontSize: "clamp(22px, 2.6vw, 28px)",
                lineHeight: 1.2,
                color: "var(--cf-ivory)",
                margin: "0 0 16px",
                fontWeight: 400,
              }}
            >
              {gift.name}
            </h3>
            {gapText && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--cf-ivory-62)",
                  margin: "0 0 20px",
                }}
              >
                {gapText}
              </p>
            )}
            <button
              onClick={() => onReadMore(gift.key)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--cf-gold)",
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
      })}
    </section>
  );
}

function QuietSection({ quietGifts, charismaticNotPresent }) {
  const [openKeys, setOpenKeys] = useState({});

  const toggle = (key) =>
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));

  const allQuiet = [...quietGifts, ...charismaticNotPresent];

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
          color: "var(--cf-ivory-62)",
          marginBottom: 32,
        }}
      >
        These are gifts where your responses do not indicate strong current
        activity. This is information, not deficiency. The body is built by many
        gifts, and the Spirit gives different gifts to different believers
        according to his will (<ScriptureRef reference="1 Corinthians 12:11" text="All these are empowered by one and the same Spirit, who apportions to each one individually as he wills." />). Some of these gifts are
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
          const edgeText =
            gift.category === "charismatic"
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
                    fontFamily: "var(--cf-font-devotional)",
                    fontSize: 18,
                    color: "var(--cf-ivory-35)",
                    fontStyle: "italic",
                  }}
                >
                  {gift.name}
                </span>
                <span
                  style={{
                    color: "var(--cf-ivory-35)",
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
                  style={{ marginTop: 16, paddingBottom: 8 }}
                >
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      lineHeight: 1.75,
                      color: "var(--cf-ivory-62)",
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
          color: "var(--cf-ivory-62)",
          marginBottom: 32,
        }}
      >
        These two gifts are assessed differently from the core gifts -- on the
        basis of direct personal experience rather than inclination and
        community confirmation. They are given to some believers, not all{" "}
        (<ScriptureRef reference="1 Corinthians 12:30" text="Do all possess gifts of healing? Do all speak with tongues? Do all interpret?" />).
        {" "}The continuationist position held by this
        instrument is that both remain active and available; the absence of
        either is no commentary on your faith or the Spirit's presence in you.
      </p>

      {activeCharismatic.map((gift) => (
        <GiftCard
          key={gift.key}
          gift={gift}
          showPending={false}
          formationText={gift.formationOutput.active.split("\n\n")[0]}
          onReadMore={onReadMore}
        />
      ))}

      {emergingCharismatic.map((gift) => (
        <GiftCard
          key={gift.key}
          gift={gift}
          showPending={false}
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
              border: `1px solid ${"var(--cf-gold-mid)"}`,
              background: "var(--cf-surface-raised)",
              animation: "cf-res-fade 700ms ease-out 500ms both",
            }
      }
    >
      {!sticky && (
        <>
          <Eyebrow>Complete the picture</Eyebrow>
          <h2
            style={{
              fontFamily: "var(--cf-font-devotional)",
              fontSize: "clamp(24px, 2.8vw, 30px)",
              color: "var(--cf-ivory)",
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
              color: "var(--cf-ivory-62)",
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
          background: "var(--cf-gold)",
          color: "var(--cf-hero-bg)",
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
  const { profile, updateProfile } = useFormationProfile();
  const fruitComplete = profile?.assessment?.completedAt != null;
  const isAuthenticated = !!profile?.identity?.userId;
  const [emailDismissed, setEmailDismissed] = useState(false);

  // Progress is stateful so Supabase recovery can update it after mount.
  const [progress, setProgress] = useState(() => loadProgress());
  // supabaseChecked: true once we've confirmed whether Supabase has data (or isn't available).
  // Starts true if localStorage already has data so we skip the async check.
  const [supabaseChecked, setSupabaseChecked] = useState(() => !!loadProgress());

  const hasCompleted = useMemo(() => hasCompletedAssessment(progress), [progress]);

  // Supabase-merged trusted responses. Starts null (use localStorage); populated
  // after the async fetch completes and is written back to localStorage.
  const [mergedTrusted, setMergedTrusted] = useState(null);

  // If localStorage is empty, try to recover the self-assessment from Supabase
  // before deciding whether to redirect to /recover.
  useEffect(() => {
    if (progress) return; // already have local data
    if (!supabase) { setSupabaseChecked(true); return; }
    const sessionId = getSessionId();
    if (!sessionId) { setSupabaseChecked(true); return; }
    supabase
      .from("gifts_sessions")
      .select("progress")
      .eq("session_id", sessionId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.progress && (data.progress.completedAt || data.progress.qIdx >= TOTAL_QUESTIONS)) {
          const restored = { ...data.progress };
          if (!restored.completedAt) {
            restored.completedAt = restored.lastUpdatedAt || new Date().toISOString();
          }
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(restored)); } catch { /* ignore */ }
          setProgress(restored);
        }
        setSupabaseChecked(true);
      });
  }, []); // only on mount

  // Only redirect after Supabase check is done.
  useEffect(() => {
    if (!supabaseChecked) return;
    if (!hasCompleted) {
      navigate("/field-guide/gifts/recover", { replace: true });
    }
  }, [supabaseChecked, hasCompleted, navigate]);

  // Fetch observer responses from Supabase and merge with whatever is in localStorage.
  useEffect(() => {
    if (!hasCompleted || !supabase) return;
    const sessionId = getSessionId();
    if (!sessionId) return;
    supabase
      .from("gifts_trusted_responses")
      .select("token, responses, completed_at")
      .eq("session_id", sessionId)
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        // Build merged shape: { [token]: { responses, completedAt } }
        let base = {};
        try {
          base = JSON.parse(localStorage.getItem(TRUSTED_RESPONSES_KEY) || "{}");
        } catch { /* ignore */ }
        const merged = { ...base };
        for (const row of data) {
          if (!merged[row.token]) {
            merged[row.token] = { responses: row.responses, completedAt: row.completed_at };
          }
        }
        // Write back so localStorage is kept in sync.
        try { localStorage.setItem(TRUSTED_RESPONSES_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
        setMergedTrusted(merged);
      });
  }, [hasCompleted]);

  const { scores, totalTrustedPersons, hasTrustedData } = useMemo(() => {
    if (!hasCompleted || !progress)
      return { scores: {}, totalTrustedPersons: 0, hasTrustedData: false };
    return computeScores(progress, mergedTrusted);
  }, [hasCompleted, progress, mergedTrusted]);

  const gaps = useMemo(() => {
    if (!hasTrustedData || Object.keys(scores).length === 0) return {};
    return detectGaps(scores);
  }, [scores, hasTrustedData]);

  useEffect(() => {
    if (hasCompleted && Object.keys(scores).length > 0) {
      saveResultsSnapshot(scores, totalTrustedPersons);
      // Mirror a lightweight summary into cf:profile.gifts so the dashboard reads one source.
      mirrorGiftsToProfile(updateProfile, scores);
    }
  }, [hasCompleted, scores, totalTrustedPersons, updateProfile]);

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
          // "activePendingConfirmation" still renders in the Active section
          if (s.tier === "active" || s.tier === "activePendingConfirmation")
            active.push(gift);
          else if (s.tier === "emerging") emerging.push(gift);
          else quiet.push(gift);
        }
      }
      return { active, emerging, quiet, charActive, charEmerging, charNotPresent };
    }, [scores]);

  const hasGaps = Object.keys(gaps).length > 0;

  if (!supabaseChecked) {
    return (
      <main style={{ background: "#06050A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(250,248,245,0.35)", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: "0.36em", textTransform: "uppercase" }}>
          Restoring your results&hellip;
        </div>
      </main>
    );
  }

  if (!hasCompleted) return null;

  return (
    <>
      <style>{STYLES}</style>

      <main
        style={{
          background: "var(--cf-hero-bg)",
          color: "var(--cf-ivory)",
          minHeight: "100vh",
          paddingBottom: 80,
        }}
      >
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <div
          ref={heroRef}
          style={{
            padding: "120px 24px 80px",
            borderBottom: `1px solid ${"var(--cf-white-8)"}`,
            animation: "cf-res-fade 600ms ease-out both",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Eyebrow>Your formation gifts</Eyebrow>
            <h1
              style={{
                fontFamily: "var(--cf-font-devotional)",
                fontSize: "clamp(36px, 5vw, 60px)",
                lineHeight: 1.1,
                margin: "0 0 20px",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              Where the Spirit is at work through you
            </h1>

            {hasTrustedData ? (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: "0 0 24px",
                  padding: "14px 18px",
                  background: "rgba(201,168,76,0.07)",
                  borderLeft: `2px solid ${"var(--cf-gold)"}`,
                  color: "var(--cf-ivory)",
                }}
              >
                Updated with input from {totalTrustedPersons} trusted person
                {totalTrustedPersons === 1 ? "" : "s"}. The full picture is now in view.
              </p>
            ) : (
              <p
                style={{
                  fontFamily: "var(--cf-font-devotional)",
                  fontSize: "clamp(18px, 2vw, 22px)",
                  color: "var(--cf-ivory-62)",
                  lineHeight: 1.65,
                  margin: "0 0 28px",
                  maxWidth: 620,
                }}
              >
                Based on your responses. The full picture will come when two or
                three trusted people in your life have weighed in on what they
                have observed.
              </p>
            )}

            {!hasTrustedData && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  color: "var(--cf-ivory-35)",
                  lineHeight: 1.7,
                  margin: 0,
                  padding: "14px 18px",
                  borderLeft: `2px solid ${"var(--cf-gold-mid)"}`,
                }}
              >
                Results are draft until at least two trusted-person responses are
                received. Send invitations now to complete the picture.
              </p>
            )}
          </div>
        </div>

        {/* Email capture: offered once per session after gifts results render. */}
        {!isAuthenticated && !emailDismissed && (
          <div style={{ maxWidth: 760, margin: "48px auto 0", padding: "0 24px" }}>
            <EmailCapture context="gifts-complete" onDismiss={() => setEmailDismissed(true)} />
          </div>
        )}

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
              {active.map((gift) => {
                const s = scores[gift.key];
                const showPending = !s || s.confirmationCount < 2;
                return (
                  <GiftCard
                    key={gift.key}
                    gift={gift}
                    showPending={showPending}
                    formationText={gift.formationOutput.active.split("\n\n")[0]}
                    onReadMore={setModalKey}
                  />
                );
              })}
            </section>
          )}

          {/* ── GAPS ─────────────────────────────────────────────── */}
          {hasGaps && (
            <GapSection gaps={gaps} onReadMore={setModalKey} />
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
              {emerging.map((gift) => {
                const s = scores[gift.key];
                const showPending = !s || s.confirmationCount < 2;
                return (
                  <GiftCard
                    key={gift.key}
                    gift={gift}
                    showPending={showPending}
                    formationText={gift.edgeCases.emerging}
                    onReadMore={setModalKey}
                  />
                );
              })}
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
          {!hasTrustedData && <TrustedPersonCTA sticky={false} />}

          {/* ── FRUIT ASSESSMENT CROSS-LINK ──────────────────────── */}
          {!fruitComplete && (
            <div
              style={{
                maxWidth: 760,
                margin: "0 auto 80px",
                padding: "32px 40px",
                border: `1px solid ${"var(--cf-white-8)"}`,
                background: "var(--cf-surface-raised)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: "var(--cf-gold)",
                  marginBottom: 12,
                }}
              >
                Complete the picture
              </div>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "var(--cf-ivory-62)",
                  margin: "0 0 24px",
                }}
              >
                The Formation Picture integrates your gifts with your Fruit of
                the Spirit results. Take the Fruit of the Spirit Assessment to
                see both dimensions of the Spirit's work in and through you.
              </p>
              <Link
                to="/field-guide/scripture-before-scroll"
                style={{
                  display: "inline-block",
                  background: "transparent",
                  color: "var(--cf-gold)",
                  border: `1px solid ${"var(--cf-gold-mid)"}`,
                  fontFamily: "'Michroma', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  padding: "12px 24px",
                }}
              >
                Take the Fruit of the Spirit Assessment →
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* ── PERSISTENT FOOTER CTA ──────────────────────────────────── */}
      {!hasTrustedData && (
        <div className={`cf-results-footer${footerVisible ? " visible" : ""}`}>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "var(--cf-ivory-62)",
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
                color: "var(--cf-gold)",
                marginBottom: 2,
              }}
            >
              Complete the picture
            </span>
            Results are draft until trusted people weigh in.
          </div>
          <TrustedPersonCTA sticky={true} />
        </div>
      )}

      {/* ── GIFT PROFILE MODAL ─────────────────────────────────────── */}
      <GiftProfileModal
        giftKey={modalKey}
        onClose={() => setModalKey(null)}
        onSwitchGift={(k) => setModalKey(k)}
      />
    </>
  );
}
