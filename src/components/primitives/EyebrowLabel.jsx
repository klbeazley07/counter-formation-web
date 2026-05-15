/*
 * EyebrowLabel — gold uppercase tracking label used as eyebrow above titles.
 *
 * Contract: sessions/contracts.md "Primitive Component APIs > EyebrowLabel".
 */

const EYEBROW_CSS = `
  .cf-eyebrow {
    font-family: var(--cf-font-brand);
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
  }
  .cf-eyebrow--xs { font-size: 9px;  letter-spacing: .32em; }
  .cf-eyebrow--sm { font-size: 9px;  letter-spacing: .44em; }
  .cf-eyebrow--md { font-size: 12px; letter-spacing: .28em; }
  .cf-eyebrow--gold  { color: var(--cf-gold); }
  .cf-eyebrow--muted { color: var(--cf-ivory-42); }
`;

export default function EyebrowLabel({
  size      = "sm",
  color     = "gold",
  className = "",
  children,
  ...rest
}) {
  const cls = [
    "cf-eyebrow",
    `cf-eyebrow--${size}`,
    `cf-eyebrow--${color}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{EYEBROW_CSS}</style>
      <p className={cls} {...rest}>{children}</p>
    </>
  );
}
