import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FRUITS } from "../../fruitAssessmentData";

/*
 * FruitStrata -- the 9-fruit horizontal bar chart visualization.
 *
 * Extracted from FruitAssessment.jsx so it can be embedded on the dashboard
 * without duplicating its 250 lines. Pure component: takes scores and an
 * optional max width, renders the visualization. The GSAP entrance animation
 * is honored unless `reduceMotion` is true or the user prefers reduced motion.
 *
 * Props:
 *   scores        {object}   Required. { fruitKey: 0-100 } for all 9 fruits.
 *   maxWidth      {number}   Optional. CSS max-width in px for the chart. Default 560.
 *   reduceMotion  {boolean}  Optional. Skip the entrance animation when true.
 *   showLabels    {boolean}  Optional. Show "Evidence of Abiding" / "Formation Edge"
 *                            eyebrow labels above and below the chart. Default true.
 */

const F = {
  brand: "'Barlow Condensed', sans-serif",
  body:  "'Inter', sans-serif",
};

function userPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch { return false; }
}

function getAccentColor(rank) {
  if (rank === 0)  return "rgba(250,248,245,0.62)";
  if (rank <= 2)   return "rgba(250,248,245,0.45)";
  if (rank <= 5)   return "transparent";
  if (rank === 6)  return "rgba(201,168,76,0.45)";
  if (rank === 7)  return "rgba(201,168,76,0.45)";
  return "#C9A84C";
}

function getFillColor(rank) {
  if (rank === 0) return ["rgba(250,248,245,0.12)", "rgba(250,248,245,0.10)"];
  if (rank === 1) return ["rgba(250,248,245,0.10)", "rgba(250,248,245,0.08)"];
  if (rank === 2) return ["rgba(250,248,245,0.08)", "rgba(250,248,245,0.07)"];
  if (rank <= 5)  return ["rgba(250,248,245,0.04)", "rgba(250,248,245,0.03)"];
  if (rank === 6) return ["rgba(201,168,76,0.06)",  "rgba(201,168,76,0.05)"];
  if (rank === 7) return ["rgba(201,168,76,0.08)",  "rgba(201,168,76,0.07)"];
  return ["rgba(201,168,76,0.12)", "rgba(201,168,76,0.10)"];
}

function getLabelColor(rank) {
  if (rank === 0) return "#FAF8F5";
  if (rank <= 2)  return "rgba(250,248,245,0.92)";
  if (rank <= 5)  return "rgba(250,248,245,0.62)";
  if (rank === 6) return "rgba(250,248,245,0.80)";
  if (rank === 7) return "rgba(250,248,245,0.92)";
  return "#FAF8F5";
}

function getScoreColor(rank) {
  if (rank <= 2)  return "rgba(250,248,245,0.62)";
  if (rank <= 5)  return "rgba(250,248,245,0.44)";
  if (rank === 6) return "rgba(201,168,76,0.62)";
  if (rank === 7) return "rgba(201,168,76,0.75)";
  return "#C9A84C";
}

const ROW_H = 40;
const SPACER_H = 8;
const TOTAL_ROWS = 9;
const CONTAINER_H = TOTAL_ROWS * ROW_H + 2 * SPACER_H;

export default function FruitStrata({ scores, maxWidth = 560, reduceMotion = false, showLabels = true }) {
  const containerRef = useRef(null);
  const rowRefs      = useRef([]);
  const fillRefs     = useRef([]);
  const accentRefs   = useRef([]);
  const topLabelRef  = useRef(null);
  const botLabelRef  = useRef(null);
  const ruleRef      = useRef(null);

  const sorted = [...Object.entries(scores || {})].sort(([, a], [, b]) => b - a);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduced = reduceMotion || userPrefersReducedMotion();

    if (reduced) {
      gsap.set([containerRef.current, ...rowRefs.current.filter(Boolean), topLabelRef.current, botLabelRef.current].filter(Boolean), { opacity: 1 });
      fillRefs.current.forEach((f, i) => { if (f) { const score = sorted[i]?.[1] ?? 0; f.style.width = `${score}%`; } });
      accentRefs.current.forEach(a => { if (a) a.style.opacity = "1"; });
      if (ruleRef.current) { ruleRef.current.style.opacity = "1"; ruleRef.current.style.transform = "scaleX(1)"; }
      return;
    }

    gsap.set(el, { opacity: 0 });
    gsap.set(rowRefs.current.filter(Boolean), { opacity: 0 });
    gsap.set(fillRefs.current.filter(Boolean), { width: "0%" });
    gsap.set(accentRefs.current.filter(Boolean), { opacity: 0 });
    if (topLabelRef.current) gsap.set(topLabelRef.current, { opacity: 0 });
    if (botLabelRef.current) gsap.set(botLabelRef.current, { opacity: 0 });
    if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 0, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(el, { opacity: 1, duration: 0.6 });
    if (ruleRef.current) {
      tl.to(ruleRef.current, { scaleX: 1, opacity: 1, duration: 0.2, ease: "power2.out" }, 0.6);
    }

    const centerIndex = 4;
    rowRefs.current.forEach((r, i) => {
      if (!r) return;
      const distFromCenter = Math.abs(i - centerIndex);
      const delay = 0.8 + distFromCenter * 0.12;
      tl.to(r, { opacity: 1, duration: 0.3, ease: "cubic-bezier(0.25,0.1,0.25,1)" }, delay);
    });

    fillRefs.current.forEach((f, i) => {
      if (!f) return;
      const reverseRank = TOTAL_ROWS - 1 - i;
      const score = sorted[i]?.[1] ?? 0;
      const delay = 1.4 + reverseRank * 0.08;
      tl.to(f, { width: `${score}%`, duration: 0.5, ease: "power1.out" }, delay);
    });

    const accentedIndices = [0, 1, 2, 6, 7, 8];
    accentedIndices.forEach((rank, j) => {
      const a = accentRefs.current[rank];
      if (!a) return;
      tl.to(a, { opacity: 1, duration: 0.15 }, 2.0 + j * 0.08);
    });

    if (topLabelRef.current) tl.to(topLabelRef.current, { opacity: 1, duration: 0.2 }, 2.4);
    if (botLabelRef.current) tl.to(botLabelRef.current, { opacity: 1, duration: 0.2 }, 2.6);

    return () => tl.kill();
  }, [reduceMotion, sorted.length]);

  if (sorted.length === 0) return null;

  return (
    <div style={{ maxWidth, margin: "0 auto", position: "relative", width: "100%" }}>
      {showLabels && (
        <div ref={topLabelRef} style={{ marginBottom: 12, paddingLeft: 8, opacity: 0 }}>
          <span style={{ fontFamily: F.brand, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--cf-gold)" }}>
            Evidence of Abiding
          </span>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          background: "var(--cf-obsidian)",
          height: CONTAINER_H,
          position: "relative",
          opacity: 0,
        }}
      >
        <div
          ref={ruleRef}
          style={{
            position: "absolute",
            left: 0, right: 0,
            top: Math.floor(CONTAINER_H / 2),
            height: 1,
            background: "var(--cf-gold-faint)",
            transformOrigin: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        />

        {sorted.map(([key, score], rank) => {
          const [fillFrom, fillTo] = getFillColor(rank);
          const showSeparator = rank === 2 || rank === 5;
          const accentColor = getAccentColor(rank);

          let topPx = rank * ROW_H;
          if (rank > 2) topPx += SPACER_H;
          if (rank > 5) topPx += SPACER_H;

          return (
            <React.Fragment key={key}>
              {showSeparator && (
                <div style={{
                  position: "absolute",
                  left: 0, right: 0,
                  top: rank * ROW_H + (rank > 2 ? SPACER_H : 0),
                  height: SPACER_H,
                  background: "transparent",
                }} />
              )}
              <div
                ref={el => rowRefs.current[rank] = el}
                style={{
                  position: "absolute",
                  left: 0, right: 0,
                  top: topPx,
                  height: ROW_H,
                  borderBottom: rank < 8 ? `1px solid var(--cf-gold-faint)` : "none",
                  opacity: 0,
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  ref={el => accentRefs.current[rank] = el}
                  style={{
                    width: 3,
                    height: "100%",
                    background: accentColor === "transparent" ? "transparent" : accentColor,
                    flexShrink: 0,
                    opacity: accentColor === "transparent" ? 1 : 0,
                  }}
                />

                <div
                  ref={el => fillRefs.current[rank] = el}
                  style={{
                    position: "absolute",
                    left: 3, top: 0, bottom: 0,
                    width: "0%",
                    background: `linear-gradient(to right, ${fillFrom}, ${fillTo})`,
                    pointerEvents: "none",
                  }}
                />

                <div style={{
                  position: "relative",
                  zIndex: 1,
                  marginLeft: 21,
                  fontFamily: F.brand,
                  fontSize: 10,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: getLabelColor(rank),
                }}>
                  {FRUITS[key]?.label || key}
                </div>

                <div style={{
                  position: "absolute",
                  right: 24,
                  fontFamily: F.body,
                  fontWeight: 300,
                  fontSize: 11,
                  color: getScoreColor(rank),
                  zIndex: 1,
                }}>
                  {score}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {showLabels && (
        <div ref={botLabelRef} style={{ marginTop: 12, paddingLeft: 8, opacity: 0 }}>
          <span style={{ fontFamily: F.brand, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--cf-gold)" }}>
            Formation Edge
          </span>
        </div>
      )}
    </div>
  );
}
