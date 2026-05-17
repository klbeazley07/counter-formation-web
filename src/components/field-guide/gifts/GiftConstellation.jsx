import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { gifts, giftsByKey, giftsByCategory } from "../../../data/gifts";
import { ScriptureRef } from "../../../ScriptureRef";

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  bgCardSoft: "#100E0C",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.32)",
  goldFaint: "rgba(201,168,76,0.14)",
  goldGhost: "rgba(201,168,76,0.06)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.08)",
};

const CATEGORY_LABEL = {
  manifestation: "Manifestation",
  ministry: "Ministry",
  equipping: "Equipping",
  charismatic: "Charismatic",
};

/* ─── HOOKS (mirror AssessmentIntro patterns) ─────────────────────── */

function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [locked]);
}

function useEscape(handler, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const fn = (e) => {
      if (e.key === "Escape") handler?.();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handler, enabled]);
}

function useIsMobile(query = "(max-width: 768px)") {
  const [is, setIs] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setIs(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return is;
}

/* ─── POSITION MAP (viewBox 1000 x 620) ───────────────────────────── */

const VB_W = 1000;
const VB_H = 620;

const POS = {
  // Manifestation arc (top, 7 gifts)
  wisdom:        { x: 80,  y: 108 },
  knowledge:     { x: 180, y: 86  },
  faith:         { x: 290, y: 118 },
  healing:       { x: 380, y: 90  },
  miracles:      { x: 480, y: 122 },
  prophecy:      { x: 580, y: 86  },
  discernment:   { x: 680, y: 108 },
  // Ministry block (middle, 8 gifts in 2 rows)
  teaching:      { x: 130, y: 256 },
  exhortation:   { x: 270, y: 240 },
  serving:       { x: 400, y: 260 },
  giving:        { x: 530, y: 244 },
  leadership:    { x: 130, y: 358 },
  mercy:         { x: 270, y: 372 },
  hospitality:   { x: 400, y: 350 },
  administration:{ x: 530, y: 366 },
  // Equipping pair (bottom)
  evangelism:    { x: 260, y: 478 },
  shepherding:   { x: 440, y: 478 },
  // Charismatic cluster (right)
  tongues:       { x: 860, y: 270 },
  interpretation:{ x: 860, y: 372 },
};

// Category eyebrow positions (SVG units)
const CAT_LABEL_POS = {
  manifestation: { x: 380, y: 40 },
  ministry:      { x: 330, y: 190 },
  equipping:     { x: 350, y: 440 },
  charismatic:   { x: 860, y: 202 },
};

/* ─── PAIRING EDGES (deduplicated, undirected) ────────────────────── */

function buildEdges() {
  const seen = new Set();
  const edges = [];
  for (const gift of gifts) {
    for (const partnerKey of gift.pairsWith || []) {
      const a = gift.key;
      const b = partnerKey;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a, b });
    }
  }
  return edges;
}

/* ─── CONSTELLATION POINT (SVG) ───────────────────────────────────── */

function ConstellationPoint({ giftKey, pos, isHovered, isPairedToHover, onEnter, onLeave, onSelect }) {
  const radius = isHovered ? 7 : isPairedToHover ? 5.5 : 4.5;
  const glowR = isHovered ? 18 : isPairedToHover ? 13 : 10;
  const opacity = isHovered ? 1 : isPairedToHover ? 0.95 : 0.82;

  return (
    <g
      style={{ cursor: "pointer", transition: "opacity 220ms ease" }}
      onMouseEnter={() => onEnter(giftKey)}
      onMouseLeave={() => onLeave(giftKey)}
      onClick={() => onSelect(giftKey)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${giftsByKey[giftKey].name} profile`}
    >
      {/* glow halo */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={glowR}
        fill={C.gold}
        opacity={isHovered ? 0.22 : 0.10}
        style={{ transition: "r 280ms ease, opacity 280ms ease" }}
      />
      {/* core */}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={radius}
        fill={C.gold}
        opacity={opacity}
        style={{ transition: "r 240ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 240ms ease" }}
      />
      {/* generous hit target */}
      <circle cx={pos.x} cy={pos.y} r={22} fill="transparent" pointerEvents="all" />
    </g>
  );
}

/* ─── GIFT PROFILE MODAL ──────────────────────────────────────────── */

export function GiftProfileModal({ giftKey, onClose, onSwitchGift }) {
  useBodyScrollLock(!!giftKey);
  useEscape(onClose, !!giftKey);
  const scrollRef = useRef(null);

  // Reset scroll to top when the gift switches
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [giftKey]);

  if (!giftKey) return null;
  const gift = giftsByKey[giftKey];
  if (!gift) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(6,5,10,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "cf-fade-in 240ms ease-out both",
      }}
    >
      <div
        ref={scrollRef}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${gift.name} profile`}
        style={{
          background: C.bgCard,
          border: `1px solid ${C.goldDim}`,
          maxWidth: 760,
          width: "100%",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "56px 56px 48px",
          position: "relative",
          animation: "cf-rise-in 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
        }}
        className="cf-gift-modal"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "sticky",
            top: -32,
            left: "100%",
            marginRight: -36,
            background: "transparent",
            border: "none",
            color: C.muted,
            fontSize: 28,
            lineHeight: 1,
            cursor: "pointer",
            padding: 8,
            zIndex: 2,
          }}
        >
          ×
        </button>

        {/* Category eyebrow */}
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 12,
            marginTop: -32,
          }}
        >
          {CATEGORY_LABEL[gift.category]} Gift
        </div>

        {/* Gift name */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(38px, 5vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            marginBottom: 18,
            color: C.ivory,
            letterSpacing: "-0.005em",
          }}
        >
          {gift.name}
        </h2>

        {/* Essence statement */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 20,
            lineHeight: 1.55,
            color: C.ivory,
            margin: 0,
            marginBottom: 28,
            opacity: 0.92,
          }}
        >
          {gift.essenceStatement}
        </p>

        {/* Gold rule */}
        <div
          style={{
            width: 60,
            height: 1,
            background: `linear-gradient(90deg, ${C.gold}, transparent)`,
            marginBottom: 28,
          }}
        />

        {/* Working Definition */}
        <SectionLabel>Working Definition</SectionLabel>
        <BodyProse>{gift.workingDefinition}</BodyProse>

        {/* Definition Anchor */}
        <SectionLabel>Definition Anchor</SectionLabel>
        <BlockQuote
          reference={gift.scriptureAnchor}
          text={gift.scriptureAnchorText}
        />

        {/* Manifestation Witnesses */}
        {gift.manifestationWitnesses?.length > 0 && (
          <>
            <SectionLabel>Manifestation Witnesses</SectionLabel>
            {gift.manifestationWitnesses.map((w, i) => (
              <div key={i} style={{ marginBottom: 22 }}>
                <BlockQuote reference={w.reference} text={w.text} />
                {w.note && (
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontStyle: "italic",
                      fontSize: 15.5,
                      lineHeight: 1.7,
                      color: C.muted,
                      margin: "10px 0 0 18px",
                    }}
                  >
                    {w.note}
                  </p>
                )}
              </div>
            ))}
          </>
        )}

        {/* Stewardship Charge */}
        {gift.stewardshipCharge && (
          <>
            <SectionLabel>Stewardship Charge</SectionLabel>
            <BlockQuote
              reference={gift.stewardshipCharge.reference}
              text={gift.stewardshipCharge.text}
            />
            {gift.stewardshipCharge.note && (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  color: C.muted,
                  margin: "10px 0 26px 18px",
                }}
              >
                {gift.stewardshipCharge.note}
              </p>
            )}
          </>
        )}

        {/* Body Application */}
        {gift.bodyApplication && (
          <>
            <SectionLabel>How This Gift Serves the Body</SectionLabel>
            <SubLabel>Where it shows up</SubLabel>
            <BodyProse>{gift.bodyApplication.where}</BodyProse>

            <SubLabel>What it looks like functioning well</SubLabel>
            <BodyProse>{gift.bodyApplication.whatItLooksLike}</BodyProse>

            <SubLabel>Common distortions</SubLabel>
            <BodyProse>{gift.bodyApplication.distortions}</BodyProse>

            <SubLabel>Gifts it pairs with</SubLabel>
            <BodyProse>{gift.bodyApplication.pairings}</BodyProse>
          </>
        )}

        {/* See related gifts */}
        {gift.pairsWith?.length > 0 && (
          <div
            style={{
              marginTop: 32,
              paddingTop: 28,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <SectionLabel>See Related Gifts</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {gift.pairsWith.map((pk) => {
                const partner = giftsByKey[pk];
                if (!partner) return null;
                return (
                  <button
                    key={pk}
                    onClick={() => onSwitchGift(pk)}
                    className="cf-related-pill"
                    style={{
                      background: "transparent",
                      border: `1px solid ${C.goldDim}`,
                      color: C.gold,
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 12,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      padding: "9px 16px",
                      cursor: "pointer",
                      transition: "background 200ms ease, color 200ms ease",
                    }}
                  >
                    {partner.name} →
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Persistent footer CTA */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 28,
            borderTop: `1px solid ${C.border}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 17,
              lineHeight: 1.55,
              color: C.muted,
              margin: "0 0 18px 0",
            }}
          >
            Ready to discover where the Spirit is at work in you?
          </p>
          <Link
            to="/field-guide/gifts/take"
            onClick={onClose}
            className="cf-primary-cta"
            style={{
              display: "inline-block",
              background: "transparent",
              color: C.gold,
              border: `1px solid ${C.gold}`,
              padding: "14px 28px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 200ms ease, color 200ms ease",
            }}
          >
            Begin the Assessment →
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─── MODAL HELPERS ───────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 11,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color: C.gold,
        margin: "26px 0 12px 0",
      }}
    >
      {children}
    </div>
  );
}

function SubLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: 17,
        color: C.ivory,
        margin: "18px 0 8px 0",
        opacity: 0.92,
      }}
    >
      {children}
    </div>
  );
}

function BodyProse({ children }) {
  return (
    <p
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 17,
        lineHeight: 1.75,
        color: C.ivory,
        margin: "0 0 18px 0",
        opacity: 0.88,
      }}
    >
      {children}
    </p>
  );
}

function BlockQuote({ reference, text }) {
  return (
    <div
      style={{
        borderLeft: `2px solid ${C.goldDim}`,
        paddingLeft: 18,
        margin: "0 0 16px 0",
      }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: 17,
          lineHeight: 1.65,
          color: C.ivory,
          margin: 0,
          marginBottom: 8,
          opacity: 0.94,
        }}
      >
        "{text}"
      </p>
      <div style={{ fontSize: 13, color: C.muted }}>
        — <ScriptureRef reference={reference} text={text} />
      </div>
    </div>
  );
}

/* ─── PREVIEW PANEL (hover/focus state) ───────────────────────────── */

function PreviewPanel({ gift, anchor, viewportSize }) {
  if (!gift || !anchor) return null;

  // Map SVG coords to percent of container
  const leftPct = (anchor.x / VB_W) * 100;
  const topPct = (anchor.y / VB_H) * 100;

  // Decide side: if point is in the right third, panel goes left; otherwise right
  const placeRight = leftPct < 65;

  return (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: placeRight
          ? "translate(20px, -50%)"
          : "translate(calc(-100% - 20px), -50%)",
        zIndex: 20,
        pointerEvents: "none",
        animation: "cf-fade-in 200ms ease-out both",
        width: viewportSize.width > 900 ? 280 : 240,
      }}
    >
      <div
        style={{
          background: "rgba(14,12,10,0.95)",
          border: `1px solid ${C.goldDim}`,
          padding: "16px 18px 18px",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 8,
          }}
        >
          {CATEGORY_LABEL[gift.category]}
        </div>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 18,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.ivory,
            marginBottom: 12,
          }}
        >
          {gift.name}
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 15,
            lineHeight: 1.55,
            color: C.ivory,
            margin: 0,
            marginBottom: 12,
            opacity: 0.9,
          }}
        >
          {gift.essenceStatement}
        </p>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          {gift.scriptureAnchor}
        </div>
      </div>
    </div>
  );
}

/* ─── MOBILE LIST (no SVG) ────────────────────────────────────────── */

function MobileCategoryList({ onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      {["manifestation", "ministry", "equipping", "charismatic"].map((cat) => (
        <div key={cat}>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {CATEGORY_LABEL[cat]}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {(giftsByCategory[cat] || []).map((g) => (
              <button
                key={g.key}
                onClick={() => onSelect(g.key)}
                style={{
                  background: C.bgCardSoft,
                  border: `1px solid ${C.goldFaint}`,
                  padding: "16px 14px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: C.ivory,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 6,
                  minHeight: 76,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: C.gold,
                    boxShadow: `0 0 10px ${C.goldDim}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.ivory,
                  }}
                >
                  {g.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── MAIN: GIFT CONSTELLATION ────────────────────────────────────── */

export default function GiftConstellation({ onReturn }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const [hoveredKey, setHoveredKey] = useState(null);
  const isMobile = useIsMobile();
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const linesRef = useRef([]);
  const pointsRef = useRef(null);
  const [viewportSize, setViewportSize] = useState({ width: 1200, height: 800 });

  const edges = useMemo(() => buildEdges(), []);

  // Track container size for the preview panel sizing
  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setViewportSize({ width: rect.width, height: rect.height });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [isMobile]);

  // GSAP staggered reveal of lines + points
  useEffect(() => {
    if (isMobile) return;
    const lines = linesRef.current.filter(Boolean);
    const points = pointsRef.current;
    if (!lines.length || !points) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { opacity: 0 },
        {
          opacity: 0.32,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.15,
        },
      );
      gsap.fromTo(
        points.children,
        { opacity: 0, scale: 0.6, transformOrigin: "center" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.025,
          ease: "power2.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  const handleEnter = useCallback((key) => setHoveredKey(key), []);
  const handleLeave = useCallback(() => setHoveredKey(null), []);
  const handleSelect = useCallback((key) => setSelectedKey(key), []);

  const hoveredGift = hoveredKey ? giftsByKey[hoveredKey] : null;
  const hoveredPos = hoveredKey ? POS[hoveredKey] : null;
  const hoverPairSet = useMemo(() => {
    if (!hoveredKey) return new Set();
    return new Set(giftsByKey[hoveredKey]?.pairsWith || []);
  }, [hoveredKey]);

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: 1240, margin: "0 auto" }}>
      <style>{`
        @keyframes cf-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes cf-rise-in {
          from { opacity: 0; transform: translateY(12px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .cf-primary-cta:hover { background: ${C.gold}; color: ${C.bg}; }
        .cf-related-pill:hover { background: ${C.goldGhost}; color: ${C.ivory}; }
        .cf-return-link:hover { color: ${C.gold}; }
        .cf-gift-modal::-webkit-scrollbar { width: 8px; }
        .cf-gift-modal::-webkit-scrollbar-track { background: transparent; }
        .cf-gift-modal::-webkit-scrollbar-thumb { background: ${C.goldFaint}; border-radius: 4px; }
        .cf-gift-modal::-webkit-scrollbar-thumb:hover { background: ${C.goldDim}; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: isMobile ? 40 : 28 }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 18,
          }}
        >
          The Gift Constellation
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(34px, 5vw, 48px)",
            lineHeight: 1.12,
            color: C.ivory,
            margin: 0,
            marginBottom: 18,
            letterSpacing: "-0.005em",
          }}
        >
          Nineteen ways the Spirit moves through the body
        </h1>
        <div
          style={{
            width: 80,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            margin: "0 auto 22px",
          }}
        />
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 15,
            lineHeight: 1.7,
            color: C.muted,
            maxWidth: 580,
            margin: "0 auto",
          }}
        >
          {isMobile
            ? "Tap any gift to read its definition, scripture witnesses, and the gifts it pairs with."
            : "Hover any point of light to see the gift's essence. Click to read its full profile. The gold lines mark the gifts that function together in the body."}
        </p>
      </div>

      {/* Constellation field */}
      {isMobile ? (
        <MobileCategoryList onSelect={handleSelect} />
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: `${VB_W} / ${VB_H}`,
            margin: "0 auto",
          }}
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid meet"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
            aria-label="Gift constellation"
          >
            {/* Connection lines */}
            <g>
              {edges.map(({ a, b }, i) => {
                const pa = POS[a];
                const pb = POS[b];
                if (!pa || !pb) return null;
                const isHighlighted =
                  hoveredKey &&
                  (hoveredKey === a || hoveredKey === b);
                return (
                  <line
                    key={`${a}-${b}`}
                    ref={(el) => (linesRef.current[i] = el)}
                    x1={pa.x}
                    y1={pa.y}
                    x2={pb.x}
                    y2={pb.y}
                    stroke={C.gold}
                    strokeWidth={isHighlighted ? 1.2 : 0.6}
                    opacity={isHighlighted ? 0.85 : 0.32}
                    style={{
                      transition: "opacity 300ms ease, stroke-width 300ms ease",
                    }}
                  />
                );
              })}
            </g>

            {/* Category labels */}
            <g>
              {Object.entries(CAT_LABEL_POS).map(([cat, p]) => (
                <text
                  key={cat}
                  x={p.x}
                  y={p.y}
                  textAnchor="middle"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    fill: C.gold,
                    opacity: 0.7,
                  }}
                >
                  {CATEGORY_LABEL[cat].toUpperCase()}
                </text>
              ))}
            </g>

            {/* Points */}
            <g ref={pointsRef}>
              {gifts.map((gift) => {
                const pos = POS[gift.key];
                if (!pos) return null;
                return (
                  <ConstellationPoint
                    key={gift.key}
                    giftKey={gift.key}
                    pos={pos}
                    isHovered={hoveredKey === gift.key}
                    isPairedToHover={hoverPairSet.has(gift.key)}
                    onEnter={handleEnter}
                    onLeave={handleLeave}
                    onSelect={handleSelect}
                  />
                );
              })}
            </g>

            {/* Gift name labels */}
            <g>
              {gifts.map((gift) => {
                const pos = POS[gift.key];
                if (!pos) return null;
                const isActive = hoveredKey === gift.key;
                return (
                  <text
                    key={`${gift.key}-label`}
                    x={pos.x}
                    y={pos.y + 24}
                    textAnchor="middle"
                    style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11,
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fill: isActive ? C.ivory : C.gold,
                      opacity: isActive ? 1 : 0.78,
                      transition: "fill 220ms ease, opacity 220ms ease",
                      pointerEvents: "none",
                    }}
                  >
                    {gift.name}
                  </text>
                );
              })}
            </g>
          </svg>

          {/* Preview panel overlay */}
          {hoveredGift && hoveredPos && (
            <PreviewPanel
              gift={hoveredGift}
              anchor={hoveredPos}
              viewportSize={viewportSize}
            />
          )}
        </div>
      )}

      {/* Persistent CTA */}
      <div
        style={{
          marginTop: isMobile ? 48 : 56,
          paddingTop: 36,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 11,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.gold,
            marginBottom: 14,
          }}
        >
          Ready to discover your gifts?
        </div>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.55,
            color: C.muted,
            maxWidth: 520,
            margin: "0 auto 24px",
          }}
        >
          The constellation is the on-ramp. The assessment is where the Spirit's pattern in you comes into view.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: 24,
          }}
        >
          <Link
            to="/field-guide/gifts/take"
            className="cf-primary-cta"
            style={{
              background: "transparent",
              color: C.gold,
              border: `1px solid ${C.gold}`,
              padding: "16px 32px",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 200ms ease, color 200ms ease",
              minWidth: 240,
              textAlign: "center",
            }}
          >
            Begin the Assessment →
          </Link>
          <button
            onClick={onReturn}
            className="cf-return-link"
            style={{
              background: "transparent",
              border: "none",
              color: C.dim,
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: "0.04em",
              cursor: "pointer",
              padding: "8px 4px",
              transition: "color 200ms ease",
            }}
          >
            ← Return to the assessment intro
          </button>
        </div>
      </div>

      {/* Gift Profile Modal */}
      <GiftProfileModal
        giftKey={selectedKey}
        onClose={() => setSelectedKey(null)}
        onSwitchGift={(k) => setSelectedKey(k)}
      />
    </div>
  );
}
