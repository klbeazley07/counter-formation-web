import EyebrowLabel from "./EyebrowLabel";

/*
 * SectionHeader — eyebrow + display title + optional subtitle.
 *
 * Used at the start of section blocks across the site. Title uses Michroma
 * display font. Subtitle uses Cormorant Garamond italic. Contract:
 * sessions/contracts.md "Primitive Component APIs > SectionHeader".
 */

const SECTION_HEADER_CSS = `
  .cf-section-header { margin-bottom: 1.25rem; }
  .cf-section-header--center { text-align: center; }
  .cf-section-header__title {
    font-family: var(--cf-font-display);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    line-height: 1.1;
    color: var(--cf-ivory);
    font-size: clamp(22px, 4vw, 38px);
    margin: 8px 0 0;
  }
  .cf-section-header__subtitle {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: clamp(15px, 2vw, 19px);
    color: var(--cf-ivory-62);
    line-height: 1.6;
    margin: 10px 0 0;
  }
`;

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align     = "left",
  className = "",
  ...rest
}) {
  const cls = [
    "cf-section-header",
    align === "center" ? "cf-section-header--center" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{SECTION_HEADER_CSS}</style>
      <div className={cls} {...rest}>
        {eyebrow && <EyebrowLabel size="sm" color="gold">{eyebrow}</EyebrowLabel>}
        <h2 className="cf-section-header__title">{title}</h2>
        {subtitle && <p className="cf-section-header__subtitle">{subtitle}</p>}
      </div>
    </>
  );
}
