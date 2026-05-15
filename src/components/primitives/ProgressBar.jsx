import EyebrowLabel from "./EyebrowLabel";

/*
 * ProgressBar — thin gold progress indicator.
 *
 * Used on Identity piece pages, Rule of Life pacing, future content. Track is
 * gold-faint, fill is solid gold. Contract: sessions/contracts.md "Primitive
 * Component APIs > ProgressBar".
 */

const PROGRESS_CSS = `
  .cf-progress {
    width: 100%;
    box-sizing: border-box;
  }
  .cf-progress__track {
    width: 100%;
    height: 3px;
    background: var(--cf-gold-hairline);
    border-radius: var(--cf-radius-pill);
    overflow: hidden;
  }
  .cf-progress__fill {
    height: 100%;
    background: var(--cf-gold);
    border-radius: var(--cf-radius-pill);
    transition: width .4s ease;
  }
  .cf-progress__label {
    margin-bottom: 8px;
  }
`;

function clamp(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export default function ProgressBar({
  value,
  label,
  ariaLabel,
  className = "",
  ...rest
}) {
  const pct = clamp(value);
  const cls = ["cf-progress", className].filter(Boolean).join(" ");

  return (
    <>
      <style>{PROGRESS_CSS}</style>
      <div className={cls} {...rest}>
        {label && <EyebrowLabel size="xs" color="muted" className="cf-progress__label">{label}</EyebrowLabel>}
        <div
          className="cf-progress__track"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel ?? label ?? undefined}
        >
          <div className="cf-progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </>
  );
}
