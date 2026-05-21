import { forwardRef } from "react";

/*
 * Input — shared text/email/search input primitive.
 *
 * Controlled component. Dark rule-bg fill, gold-faint border, gold focus,
 * ivory text in the devotional font (var(--cf-font-devotional)). Used by
 * newsletter capture forms and widget inline inputs. Contract:
 * sessions/contracts.md "Primitive Component APIs > Input".
 */

const INPUT_CSS = `
  .cf-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-faint);
    border-radius: var(--cf-radius-input);
    padding: 10px 14px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-size: 16px;
    font-style: italic;
    line-height: 1.55;
    outline: none;
    min-height: 44px;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .cf-input::placeholder { color: var(--cf-ivory-35); font-style: italic; }
  .cf-input:focus {
    border-color: var(--cf-gold-mid);
    box-shadow: 0 0 0 3px var(--cf-gold-glow);
  }
  .cf-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .cf-input--reference {
    font-family: var(--cf-font-brand);
    font-style: normal;
    letter-spacing: 0.06em;
  }
`;

const Input = forwardRef(function Input({
  type        = "text",
  value,
  onChange,
  onKeyDown,
  placeholder,
  disabled,
  ariaLabel,
  inputMode,
  className   = "",
  variant,
  ...rest
}, ref) {
  const cls = [
    "cf-input",
    variant === "reference" ? "cf-input--reference" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <>
      <style>{INPUT_CSS}</style>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel}
        inputMode={inputMode ?? (type === "email" ? "email" : undefined)}
        className={cls}
        {...rest}
      />
    </>
  );
});

export default Input;
