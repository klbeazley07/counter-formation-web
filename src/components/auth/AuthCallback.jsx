import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { runAuthBackfill } from "../../utils/authBackfill";
import ConvertKitOptIn from "./ConvertKitOptIn";

/*
 * AuthCallback -- the /auth/callback landing.
 *
 * Supabase's magic link can arrive in two URL shapes depending on the project's
 * Auth template configuration:
 *
 *   1. PKCE code-grant:  ?code=XXX
 *      The Supabase client's detectSessionInUrl flag completes the handshake
 *      automatically; we just need to poll getSession() until it lands.
 *
 *   2. OTP verify:       ?token_hash=XXX&type=magiclink|signup|recovery
 *      detectSessionInUrl does NOT handle this -- we must call verifyOtp
 *      explicitly. This is the format Supabase generates for the default
 *      "Confirm signup" and "Magic Link" templates when PKCE is on but the
 *      template still uses the {{ .ConfirmationURL }} short form.
 *
 * The component tries OTP verify first if the URL looks like flavor 2, then
 * falls through to the PKCE polling path. A 12-second safety timeout makes
 * sure the user is never trapped on this screen: if the session has not
 * landed by then, we navigate home so the user can re-request a link.
 */

const STYLES = `
  .cf-authcb {
    min-height: 100dvh;
    background: var(--cf-hero-bg, #06050A);
    color: #FAF8F5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    font-family: 'Inter', sans-serif;
  }
  .cf-authcb__inner {
    width: 100%;
    max-width: 560px;
    text-align: center;
  }
  .cf-authcb__eyebrow {
    font-family: 'Michroma', sans-serif;
    font-size: 10px;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: #C9A84C;
    margin: 0 0 12px;
  }
  .cf-authcb__head {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-weight: 400;
    font-size: clamp(24px, 4vw, 32px);
    line-height: 1.2;
    margin: 0 0 14px;
  }
  .cf-authcb__body {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(250,248,245,0.74);
    margin: 0;
  }
  .cf-authcb__error {
    color: rgba(255, 138, 138, 0.92);
    font-size: 14px;
  }
  .cf-authcb__retry {
    display: inline-block;
    margin-top: 20px;
    background: transparent;
    border: 1px solid rgba(201,168,76,0.42);
    color: #C9A84C;
    font-family: 'Michroma', sans-serif;
    font-size: 11px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 10px 18px;
    border-radius: 999px;
  }
`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading | optin | error
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!supabase) {
      setStatus("error");
      setError("Auth is not configured for this deployment.");
      return;
    }

    let cancelled = false;

    // Safety timeout -- if nothing resolves in 12 seconds, navigate home so
    // the user is never stranded on this screen. The auth state listener
    // installed at app boot may still complete the backfill in the background
    // if the session lands after we navigate away.
    const escapeHatch = setTimeout(() => {
      if (cancelled) return;
      console.warn("AuthCallback: 12s safety timeout fired; navigating home.");
      navigate("/", { replace: true });
    }, 12000);

    async function handle() {
      // Flavor 2 -- OTP verify URL. Detect, then explicitly verify.
      const tokenHash = searchParams.get("token_hash");
      const otpType   = searchParams.get("type");
      if (tokenHash && otpType) {
        try {
          await supabase.auth.verifyOtp({ token_hash: tokenHash, type: otpType });
        } catch (err) {
          console.error("verifyOtp failed:", err);
        }
      }

      // Flavor 1 + post-verifyOtp -- poll getSession until the session lands.
      // 40 iterations x 150ms = 6 seconds, plenty of room even on a cold start.
      let session = null;
      for (let i = 0; i < 40; i++) {
        if (cancelled) return;
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          session = data.session;
          break;
        }
        await new Promise((r) => setTimeout(r, 150));
      }

      if (cancelled) return;

      if (!session?.user) {
        setStatus("error");
        setError("Your link has expired or is invalid. Try requesting a new one.");
        clearTimeout(escapeHatch);
        return;
      }

      // First-time auth gate: if cf:profile.identity.authedAt is null, this
      // is the first time we have seen them sign in -- show the ConvertKit
      // opt-in screen before sending them to the dashboard.
      let firstTime = false;
      try {
        const raw = localStorage.getItem("cf:profile");
        const profile = raw ? JSON.parse(raw) : null;
        firstTime = !profile?.identity?.authedAt;
      } catch { /* ignore */ }

      // Backfill is wrapped in its own timeout so a hung Supabase query does
      // not strand the user. The auth state listener will retry it.
      try {
        await Promise.race([
          runAuthBackfill(session.user),
          new Promise((_, reject) => setTimeout(() => reject(new Error("backfill timeout")), 6000)),
        ]);
      } catch (err) {
        console.warn("Backfill error on callback:", err);
      }

      if (cancelled) return;
      clearTimeout(escapeHatch);

      if (firstTime) {
        setStatus("optin");
      } else {
        navigate("/", { replace: true });
      }
    }

    handle();
    return () => { cancelled = true; clearTimeout(escapeHatch); };
  }, [navigate, searchParams]);

  if (status === "optin") {
    return <ConvertKitOptIn onDone={() => navigate("/", { replace: true })} />;
  }

  if (status === "error") {
    return (
      <>
        <style>{STYLES}</style>
        <main className="cf-authcb">
          <div className="cf-authcb__inner">
            <p className="cf-authcb__eyebrow">Counter Formation</p>
            <h1 className="cf-authcb__head">We could not complete the sign-in.</h1>
            <p className="cf-authcb__body cf-authcb__error">{error}</p>
            <a href="/" className="cf-authcb__retry">Return home</a>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>
      <main className="cf-authcb">
        <div className="cf-authcb__inner">
          <p className="cf-authcb__eyebrow">Counter Formation</p>
          <h1 className="cf-authcb__head">Welcome back.</h1>
          <p className="cf-authcb__body">Restoring your formation profile&hellip;</p>
        </div>
      </main>
    </>
  );
}
