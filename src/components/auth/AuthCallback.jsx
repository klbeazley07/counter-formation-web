import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../utils/supabaseClient";
import { runAuthBackfill } from "../../utils/authBackfill";
import ConvertKitOptIn from "./ConvertKitOptIn";

/*
 * AuthCallback -- the /auth/callback landing.
 *
 * The magic link redirects here with PKCE tokens in the URL. The Supabase
 * client's detectSessionInUrl flag completes the handshake automatically;
 * we wait for the session to land, run the backfill, and then either:
 *   - show the ConvertKit opt-in (first-time auth), or
 *   - navigate straight back to / (returning auth).
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
    font-family: 'Cormorant Garamond', serif;
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

    async function handle() {
      // Wait for detectSessionInUrl to finalize. Poll briefly because the
      // initial getSession() can fire before the URL tokens are exchanged.
      let session = null;
      for (let i = 0; i < 20; i++) {
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
        return;
      }

      // First-time auth gate: if cf:profile.identity.authedAt is null, we
      // know this is the first time we have seen them sign in -- show the
      // ConvertKit opt-in screen before sending them to the dashboard.
      let firstTime = false;
      try {
        const raw = localStorage.getItem("cf:profile");
        const profile = raw ? JSON.parse(raw) : null;
        firstTime = !profile?.identity?.authedAt;
      } catch { /* ignore */ }

      try {
        await runAuthBackfill(session.user);
      } catch (err) {
        console.warn("Backfill error on callback:", err);
      }

      if (cancelled) return;

      if (firstTime) {
        setStatus("optin");
      } else {
        navigate("/", { replace: true });
      }
    }

    handle();
    return () => { cancelled = true; };
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
