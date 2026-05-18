import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useFormationProfile } from "../../hooks/useFormationProfile";

/*
 * SignOutLink -- small "signed in as <email> · sign out" affordance shown
 * in the PersonalizedHome footer when the user is authenticated.
 *
 * Sign-out behavior:
 *   1. supabase.auth.signOut() clears the Supabase session.
 *   2. profile.identity is reset to the anonymous defaults so the dashboard
 *      keeps rendering on the same device with whatever local data remains.
 *      cf-gifts-* keys are intentionally NOT cleared -- the user's local
 *      formation history stays on the device. They can sign back in to
 *      re-link it.
 */

const STYLES = `
  .cf-signout {
    margin: 0 auto;
    max-width: 1280px;
    padding: 18px 24px calc(env(safe-area-inset-bottom) + 24px);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--cf-ivory-42);
    border-top: 1px solid var(--cf-gold-hairline);
  }
  .cf-signout__email {
    font-family: var(--cf-font-body);
    font-size: 12px;
    letter-spacing: 0;
    text-transform: none;
    color: var(--cf-ivory-62);
  }
  .cf-signout__btn {
    background: none;
    border: none;
    color: var(--cf-gold);
    padding: 4px 8px;
    cursor: pointer;
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    transition: color 180ms ease;
  }
  .cf-signout__btn:hover:not(:disabled) {
    color: var(--cf-ivory);
  }
  .cf-signout__btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .cf-signout__sep {
    color: var(--cf-ivory-22, rgba(250,248,245,0.22));
  }
`;

const ANONYMOUS_IDENTITY = {
  email: null,
  userId: null,
  authedAt: null,
  emailOptIn: false,
  displayName: null,
};

export default function SignOutLink({ profile }) {
  const { updateProfile } = useFormationProfile();
  const [signingOut, setSigningOut] = useState(false);

  const email = profile?.identity?.email;
  const userId = profile?.identity?.userId;
  if (!userId) return null;

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      updateProfile({ identity: ANONYMOUS_IDENTITY });
    } catch (err) {
      console.error("Sign-out failed:", err);
      setSigningOut(false);
    }
    // No need to navigate. The HomeRouter re-renders against the cleared
    // identity and the dashboard continues to function from local data.
  }

  return (
    <>
      <style>{STYLES}</style>
      <footer className="cf-signout">
        <span>Signed in as <span className="cf-signout__email">{email || "your account"}</span></span>
        <span className="cf-signout__sep">·</span>
        <button
          type="button"
          className="cf-signout__btn"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </footer>
    </>
  );
}
