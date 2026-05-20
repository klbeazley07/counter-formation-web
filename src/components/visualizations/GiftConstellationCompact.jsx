import React, { useMemo } from "react";
import { gifts } from "../../data/gifts";

/*
 * GiftConstellationCompact -- non-interactive small-format constellation.
 *
 * Mirrors the visual language of the full `GiftConstellation` component but
 * with no hover preview, no click modal, no detail labels. Designed for
 * embedding on the dashboard at ~400-520px wide. The full interactive
 * constellation continues to live at GiftConstellation.jsx for the results page.
 *
 * Props:
 *   topGifts    {string[]}  Optional. Gift keys to highlight as the user's top gifts.
 *                           Highlighted points render brighter and slightly larger.
 *   height      {number}    Optional. CSS height in px. Default 320.
 *   showLabels  {boolean}   Optional. Show category labels (Manifestation, etc.).
 *                           Default true.
 */

const VB_W = 1000;
const VB_H = 620;

// Same positions as src/components/field-guide/gifts/GiftConstellation.jsx
const POS = {
  wisdom:         { x: 80,  y: 108 },
  knowledge:      { x: 180, y: 86  },
  faith:          { x: 290, y: 118 },
  healing:        { x: 380, y: 90  },
  miracles:       { x: 480, y: 122 },
  prophecy:       { x: 580, y: 86  },
  discernment:    { x: 680, y: 108 },
  teaching:       { x: 130, y: 256 },
  exhortation:    { x: 270, y: 240 },
  serving:        { x: 400, y: 260 },
  giving:         { x: 530, y: 244 },
  leadership:     { x: 130, y: 358 },
  mercy:          { x: 270, y: 372 },
  hospitality:    { x: 400, y: 350 },
  administration: { x: 530, y: 366 },
  evangelism:     { x: 260, y: 478 },
  shepherding:    { x: 440, y: 478 },
  tongues:        { x: 860, y: 270 },
  interpretation: { x: 860, y: 372 },
};

const CAT_LABEL_POS = {
  manifestation: { x: 380, y: 40 },
  ministry:      { x: 330, y: 190 },
  equipping:     { x: 350, y: 440 },
  charismatic:   { x: 860, y: 202 },
};

const CATEGORY_LABEL = {
  manifestation: "Manifestation",
  ministry: "Ministry",
  equipping: "Equipping",
  charismatic: "Charismatic",
};

function buildEdges() {
  const seen = new Set();
  const edges = [];
  for (const gift of gifts) {
    for (const partnerKey of gift.pairsWith || []) {
      const a = gift.key, b = partnerKey;
      const key = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ a, b });
    }
  }
  return edges;
}

export default function GiftConstellationCompact({
  topGifts = [],
  height = 320,
  showLabels = true,
}) {
  const edges = useMemo(() => buildEdges(), []);
  const topSet = useMemo(() => new Set(topGifts || []), [topGifts]);

  return (
    <div style={{ width: "100%", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ position: "relative", width: "100%", height, overflow: "visible" }}>
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          aria-label="Gift constellation overview"
        >
          {/* Connection lines */}
          <g>
            {edges.map(({ a, b }, i) => {
              const pa = POS[a];
              const pb = POS[b];
              if (!pa || !pb) return null;
              return (
                <line
                  key={`${a}-${b}-${i}`}
                  x1={pa.x} y1={pa.y}
                  x2={pb.x} y2={pb.y}
                  stroke={"var(--cf-gold)"}
                  strokeWidth={0.6}
                  opacity={0.22}
                />
              );
            })}
          </g>

          {/* Category labels */}
          {showLabels && (
            <g>
              {Object.entries(CAT_LABEL_POS).map(([cat, p]) => (
                <text
                  key={cat}
                  x={p.x} y={p.y}
                  textAnchor="middle"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.42em",
                    textTransform: "uppercase",
                    fill: "var(--cf-gold)",
                    opacity: 0.55,
                  }}
                >
                  {CATEGORY_LABEL[cat].toUpperCase()}
                </text>
              ))}
            </g>
          )}

          {/* Points */}
          <g>
            {gifts.map((gift) => {
              const pos = POS[gift.key];
              if (!pos) return null;
              const isTop = topSet.has(gift.key);
              const r = isTop ? 7 : 4.5;
              const opacity = isTop ? 1 : 0.55;
              return (
                <g key={gift.key}>
                  {isTop && (
                    <circle
                      cx={pos.x} cy={pos.y}
                      r={r + 8}
                      fill={"var(--cf-gold)"}
                      opacity={0.18}
                    />
                  )}
                  <circle
                    cx={pos.x} cy={pos.y}
                    r={r}
                    fill={isTop ? "var(--cf-gold)" : "var(--cf-gold-mid)"}
                    opacity={opacity}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
