import React from "react";

const C = {
  trackBg: "rgba(201,168,76,0.14)",
  fill: "#C9A84C",
};

// Thin Champagne Gold progress bar. Fills as the user advances.
// No percentage shown -- the bar itself is the indicator.
// Props:
//   current -- 1-indexed position of the current question
//   total   -- total question count
export default function AssessmentProgress({ current, total }) {
  const pct = Math.max(0, Math.min(100, (current / total) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={`Question ${current} of ${total}`}
      style={{
        width: "100%",
        height: 2,
        background: C.trackBg,
        position: "relative",
        borderRadius: 1,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: `${pct}%`,
          background: C.fill,
          borderRadius: 1,
          transition: "width 540ms cubic-bezier(0.2, 0.7, 0.2, 1)",
          boxShadow: "0 0 6px rgba(201,168,76,0.35)",
        }}
      />
    </div>
  );
}
