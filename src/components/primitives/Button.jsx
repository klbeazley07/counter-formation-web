/*
 * Button — shared CTA primitive.
 *
 * Contract: sessions/contracts.md "Primitive Component APIs > Button".
 * Three variants (primary | secondary | ghost), three sizes (sm | md | lg),
 * loading + disabled state. All values reference CSS variables from tokens.css.
 */

const BUTTON_CSS = `
  .cf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: var(--cf-radius-pill);
    font-family: var(--cf-font-brand);
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    border: 1px solid transparent;
    transition: background .2s ease, color .2s ease, border-color .2s ease, transform .15s ease, box-shadow .15s ease, opacity .2s ease;
    text-decoration: none;
    box-sizing: border-box;
    min-height: 44px;
  }
  .cf-btn:disabled,
  .cf-btn[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Variants */
  .cf-btn--primary {
    background: var(--cf-gold);
    color: #0A0A0A;
    border-color: var(--cf-gold);
  }
  .cf-btn--primary:not(:disabled):hover {
    background: var(--cf-ivory);
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(201,168,76,0.18);
  }

  .cf-btn--secondary {
    background: transparent;
    color: var(--cf-gold);
    border-color: var(--cf-gold-soft);
  }
  .cf-btn--secondary:not(:disabled):hover {
    background: var(--cf-gold-bg);
    border-color: var(--cf-gold-mid);
  }

  .cf-btn--ghost {
    background: transparent;
    color: var(--cf-ivory-62);
    border-color: var(--cf-white-8);
  }
  .cf-btn--ghost:not(:disabled):hover {
    color: var(--cf-ivory);
    border-color: var(--cf-gold-mid);
    background: var(--cf-gold-glow);
  }

  /* Sizes */
  .cf-btn--sm {
    font-size: 9px;
    letter-spacing: .22em;
    padding: 8px 14px;
    min-height: 36px;
  }
  .cf-btn--md {
    font-size: 10px;
    letter-spacing: .24em;
    padding: 11px 20px;
  }
  .cf-btn--lg {
    font-size: 12px;
    letter-spacing: .28em;
    padding: 14px 28px;
    min-height: 48px;
  }

  /* Loading spinner */
  .cf-btn__spinner {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid currentColor;
    border-right-color: transparent;
    animation: cf-btn-spin 0.8s linear infinite;
  }
  @keyframes cf-btn-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function Button({
  variant = "primary",
  size    = "md",
  loading = false,
  disabled = false,
  icon,
  type     = "button",
  className = "",
  onClick,
  children,
  ...rest
}) {
  const cls = [
    "cf-btn",
    `cf-btn--${variant}`,
    `cf-btn--${size}`,
    className,
  ].filter(Boolean).join(" ");

  const isDisabled = disabled || loading;

  return (
    <>
      <style>{BUTTON_CSS}</style>
      <button
        type={type}
        className={cls}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        onClick={onClick}
        {...rest}
      >
        {loading ? <span className="cf-btn__spinner" aria-hidden="true" /> : icon}
        <span>{children}</span>
      </button>
    </>
  );
}
