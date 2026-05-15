import { useId } from "react";

/*
 * WidgetFrame — shared outer chrome for the six formation widgets.
 *
 * Replaces the per-widget outer container (gold-glow bg, gold border, 20px
 * radius) plus the header eyebrow + subtitle + first hairline divider. Each
 * widget now wraps its body in <WidgetFrame title="..." subtitle="...">.
 * Sub-component internals (DayCell SVG, PracticeSelect dropdown, etc.) remain
 * inside the widget file.
 *
 * Contract: sessions/contracts.md "WidgetFrame API".
 */

const FRAME_CSS = `
  .cf-widget-frame {
    background: var(--cf-gold-glow);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    overflow: hidden;
    position: relative;
  }
  .cf-widget-header {
    padding: var(--cf-space-card-pad) var(--cf-space-card-pad) 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }
  .cf-widget-header-text { flex: 1; min-width: 0; }
  .cf-widget-eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: var(--cf-gold);
    font-weight: 700;
    margin: 0 0 6px 0;
  }
  .cf-widget-subtitle {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 15px;
    color: var(--cf-ivory-55);
    line-height: 1.5;
    margin: 0;
  }
  .cf-widget-hairline {
    height: 1px;
    background: var(--cf-gold-hairline);
    margin: 0 var(--cf-space-card-pad);
  }
`;

export default function WidgetFrame({
  title,
  subtitle,
  headerAction,
  ariaLabel,
  className = "",
  children,
  ...rest
}) {
  const titleId = useId();
  const cls = ["cf-widget-frame", className].filter(Boolean).join(" ");

  return (
    <>
      <style>{FRAME_CSS}</style>
      <section
        className={cls}
        role="region"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        {...rest}
      >
        <header className="cf-widget-header">
          <div className="cf-widget-header-text">
            <p id={titleId} className="cf-widget-eyebrow">{title}</p>
            {subtitle && <p className="cf-widget-subtitle">{subtitle}</p>}
          </div>
          {headerAction}
        </header>
        <div className="cf-widget-hairline" />
        <div className="cf-widget-body">{children}</div>
      </section>
    </>
  );
}
