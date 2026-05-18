import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

/*
 * EmailCapture -- the single shared email-capture surface for Phase 2.
 *
 * Used at four moments in the app:
 *   - context="fruit-complete"   (after the Fruit Assessment completes)
 *   - context="gifts-complete"   (after the Gifts Results render)
 *   - context="first-devotion"   (after the first AI devotion generates)
 *   - context="save-journey"     (dashboard SaveJourneyStrip bottom-sheet)
 *
 * Submits via supabase.auth.signInWithOtp; on success the user receives a
 * magic link that lands at /auth/callback to complete the handshake.
 *
 * Anonymous flow is preserved -- a user can dismiss this surface at any time
 * and continue working without authentication.
 */

const COPY = {
  "fruit-complete": {
    eyebrow: "Save your formation profile",
    headline: "Keep your fruit results across devices.",
    body: "Enter your email and we will send a one-tap link. No password. No account to manage. Your formation follows you.",
    cta: "Save my profile",
    successHead: "Check your inbox.",
    successBody: "We just sent you a link to save your formation profile.",
  },
  "gifts-complete": {
    eyebrow: "Save your gifts profile",
    headline: "Carry these gifts with you.",
    body: "Trusted-person responses can take days to arrive. Enter your email so they reach you wherever you are, and your gifts profile is here when you return.",
    cta: "Save my gifts",
    successHead: "Check your inbox.",
    successBody: "We just sent you a link to save your gifts profile.",
  },
  "first-devotion": {
    eyebrow: "Save this devotion",
    headline: "Keep your devotions in one place.",
    body: "Enter your email to save this devotion to your library and access every one you generate from any device.",
    cta: "Save my devotion",
    successHead: "Check your inbox.",
    successBody: "We just sent you a link to save your devotion library.",
  },
  "save-journey": {
    eyebrow: "Save your journey",
    headline: "Continue your formation anywhere.",
    body: "Enter your email and we will send you a one-tap link. Your assessments, devotions, and progress travel with you.",
    cta: "Continue",
    successHead: "Check your inbox.",
    successBody: "We just sent you a link to continue your formation.",
  },
};

const STYLES = `
  .cf-ecap {
    background: rgba(20, 17, 12, 0.94);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 14px;
    padding: clamp(20px, 4vw, 32px);
    color: #FAF8F5;
    max-width: 560px;
    margin: 0 auto;
    font-family: 'Inter', sans-serif;
  }
  .cf-ecap__eyebrow {
    font-family: 'Michroma', sans-serif;
    font-size: 10px;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: #C9A84C;
    margin: 0 0 12px;
  }
  .cf-ecap__head {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(22px, 3.4vw, 28px);
    line-height: 1.2;
    margin: 0 0 12px;
    color: #FAF8F5;
  }
  .cf-ecap__body {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(250,248,245,0.74);
    margin: 0 0 18px;
  }
  .cf-ecap__form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .cf-ecap__input {
    flex: 1 1 240px;
    min-width: 0;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(201,168,76,0.22);
    color: #FAF8F5;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 16px; /* >=16px prevents iOS auto-zoom on focus */
    font-family: 'Inter', sans-serif;
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }
  .cf-ecap__input:focus {
    outline: none;
    border-color: #C9A84C;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.18);
  }
  .cf-ecap__submit {
    background: #C9A84C;
    color: #0E0C0A;
    font-family: 'Michroma', sans-serif;
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-weight: 700;
    border: none;
    padding: 12px 22px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
  }
  .cf-ecap__submit:hover { transform: translateY(-1px); box-shadow: 0 8px 16px rgba(201,168,76,0.16); }
  .cf-ecap__submit[disabled] { opacity: 0.55; cursor: wait; transform: none; box-shadow: none; }
  .cf-ecap__error {
    margin: 12px 0 0;
    font-size: 13px;
    color: rgba(255, 138, 138, 0.92);
  }
  .cf-ecap__dismiss {
    background: none;
    border: none;
    color: rgba(250,248,245,0.48);
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    padding: 12px 4px 0;
  }
  .cf-ecap__success {
    text-align: left;
  }
  .cf-ecap__success-head {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(20px, 3vw, 26px);
    color: #C9A84C;
    margin: 0 0 8px;
  }
  .cf-ecap__success-body {
    font-size: 14px;
    line-height: 1.6;
    color: rgba(250,248,245,0.78);
    margin: 0;
  }
`;

function buildRedirectUrl(context) {
  if (typeof window === "undefined") return undefined;
  const base = `${window.location.origin}/auth/callback`;
  const params = new URLSearchParams({ context });
  return `${base}?${params.toString()}`;
}

export default function EmailCapture({ context = "save-journey", onDismiss, onSubmitted }) {
  const copy = COPY[context] || COPY["save-journey"];
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    const trimmed = email.trim();
    if (!trimmed || !/.+@.+\..+/.test(trimmed)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!supabase) {
      setError("Email save is temporarily unavailable. Please try again later.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          emailRedirectTo: buildRedirectUrl(context),
          shouldCreateUser: true,
        },
      });
      if (otpError) throw otpError;
      setSuccess(true);
      onSubmitted?.(trimmed);
    } catch (err) {
      setError(err?.message || "Something went wrong sending the link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="cf-ecap">
          <div className="cf-ecap__success">
            <p className="cf-ecap__eyebrow">{copy.eyebrow}</p>
            <h3 className="cf-ecap__success-head">{copy.successHead}</h3>
            <p className="cf-ecap__success-body">{copy.successBody}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-ecap">
        <p className="cf-ecap__eyebrow">{copy.eyebrow}</p>
        <h3 className="cf-ecap__head">{copy.headline}</h3>
        <p className="cf-ecap__body">{copy.body}</p>

        <form className="cf-ecap__form" onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            className="cf-ecap__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="off"
            spellCheck="false"
            required
            disabled={loading}
            aria-label="Email address"
          />
          <button type="submit" className="cf-ecap__submit" disabled={loading}>
            {loading ? "Sending..." : copy.cta}
          </button>
        </form>

        {error && <p className="cf-ecap__error">{error}</p>}

        {onDismiss && (
          <button type="button" className="cf-ecap__dismiss" onClick={onDismiss}>
            Not right now
          </button>
        )}
      </div>
    </>
  );
}
