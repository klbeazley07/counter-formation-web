/*
 * Card — dark container with optional gold top hairline.
 *
 * Used for inner result boxes (DevotionGuide result, Declaration card output,
 * VerseTracker current-verse panel, etc.). Contract: sessions/contracts.md
 * "Primitive Component APIs > Card".
 */

const CARD_CSS = `
  .cf-card {
    position: relative;
    border-radius: var(--cf-radius-card);
    border: 1px solid var(--cf-gold-soft);
    overflow: hidden;
    box-sizing: border-box;
  }
  .cf-card--dark { background: var(--cf-obsidian); }
  .cf-card--warm { background: var(--cf-card-warm); }
  .cf-card--pad-sm { padding: 1rem; }
  .cf-card--pad-md { padding: 1.75rem; }
  .cf-card--pad-lg { padding: clamp(30px, 5vw, 56px); }
  .cf-card__hairline {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
    pointer-events: none;
  }
`;

export default function Card({
  padded      = "md",
  topHairline = false,
  surface     = "dark",
  className   = "",
  children,
  ...rest
}) {
  const padClass = padded === false
    ? ""
    : padded === true
      ? "cf-card--pad-md"
      : `cf-card--pad-${padded}`;

  const cls = [
    "cf-card",
    `cf-card--${surface}`,
    padClass,
    className,
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{CARD_CSS}</style>
      <div className={cls} {...rest}>
        {topHairline && <div className="cf-card__hairline" />}
        {children}
      </div>
    </>
  );
}
