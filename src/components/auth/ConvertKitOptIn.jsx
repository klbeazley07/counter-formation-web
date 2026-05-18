import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

/*
 * ConvertKitOptIn -- single yes/no question shown to a freshly authenticated
 * user before they land on the dashboard.
 *
 * Yes  -> POST to /api/subscribe-convertkit with profile context, persist
 *         email_opt_in=true on public.users + cf:profile.identity.emailOptIn.
 * No   -> persist email_opt_in=false on both sides (no double-prompt).
 * Both states call onDone() to advance to the dashboard.
 */

const STYLES = `
  .cf-ck {
    min-height: 100dvh;
    background: #06050A;
    color: #FAF8F5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 32px);
    font-family: 'Inter', sans-serif;
  }
  .cf-ck__inner {
    width: 100%;
    max-width: 560px;
    text-align: center;
  }
  .cf-ck__eyebrow {
    font-family: 'Michroma', sans-serif;
    font-size: 10px;
    letter-spacing: 0.36em;
    text-transform: uppercase;
    color: #C9A84C;
    margin: 0 0 14px;
  }
  .cf-ck__head {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(24px, 4vw, 34px);
    line-height: 1.2;
    margin: 0 0 16px;
  }
  .cf-ck__body {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(250,248,245,0.74);
    margin: 0 0 32px;
  }
  .cf-ck__buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
  }
  .cf-ck__btn {
    flex: 1;
    width: 100%;
    min-height: 56px;
    padding: 0 22px;
    border-radius: 999px;
    font-family: 'Michroma', sans-serif;
    font-size: 11px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    font-weight: 700;
    white-space: nowrap;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
  }
  .cf-ck__btn--primary {
    background: #C9A84C;
    color: #0E0C0A;
    border: none;
  }
  .cf-ck__btn--primary:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(201,168,76,0.18); }
  .cf-ck__btn--ghost {
    background: transparent;
    color: rgba(250,248,245,0.72);
    border: 1px solid rgba(201,168,76,0.22);
  }
  .cf-ck__btn--ghost:hover {
    color: #FAF8F5;
    border-color: rgba(201,168,76,0.42);
  }
  .cf-ck__btn[disabled] { opacity: 0.55; cursor: wait; transform: none; box-shadow: none; }
  @media (min-width: 640px) {
    .cf-ck__buttons { flex-direction: row; }
  }
`;

function persistOptIn(emailOptIn) {
  try {
    const raw = localStorage.getItem("cf:profile");
    const profile = raw ? JSON.parse(raw) : null;
    if (profile) {
      profile.identity = { ...(profile.identity || {}), emailOptIn };
      profile._updated = new Date().toISOString();
      localStorage.setItem("cf:profile", JSON.stringify(profile));
    }
  } catch { /* ignore */ }
}

async function persistUsersRow(emailOptIn, convertkitSubscriberId = null) {
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  if (!user) return;
  const update = {
    id: user.id,
    email: user.email ?? null,
    email_opt_in: emailOptIn,
    updated_at: new Date().toISOString(),
  };
  if (convertkitSubscriberId) update.convertkit_subscriber_id = convertkitSubscriberId;
  await supabase.from("users").upsert(update, { onConflict: "id" });
}

function buildProfileContext() {
  try {
    const raw = localStorage.getItem("cf:profile");
    const profile = raw ? JSON.parse(raw) : null;
    if (!profile) return {};
    return {
      formationEdge: profile.assessment?.formationEdge ?? [],
      topGifts: profile.gifts?.topGifts ?? [],
      hasFruitAssessment: !!profile.assessment?.completedAt,
      hasGiftsAssessment: !!profile.gifts?.completedAt,
    };
  } catch {
    return {};
  }
}

export default function ConvertKitOptIn({ onDone }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleAccept() {
    if (submitting) return;
    setSubmitting(true);
    let subscriberId = null;
    try {
      const { data } = await supabase.auth.getUser();
      const email = data?.user?.email;
      if (email) {
        const res = await fetch("/api/subscribe-convertkit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            profile: buildProfileContext(),
          }),
        });
        if (res.ok) {
          const body = await res.json().catch(() => ({}));
          subscriberId = body?.subscriberId ?? null;
        }
        // We do not gate the experience on ConvertKit success -- if the
        // subscribe fails we still mark the user as opted in locally so we
        // do not pester them again, and the user proceeds to the dashboard.
      }
    } catch (err) {
      console.warn("ConvertKit subscribe failed:", err);
    }
    persistOptIn(true);
    await persistUsersRow(true, subscriberId).catch(() => {});
    onDone?.();
  }

  async function handleDecline() {
    if (submitting) return;
    setSubmitting(true);
    persistOptIn(false);
    await persistUsersRow(false).catch(() => {});
    onDone?.();
  }

  return (
    <>
      <style>{STYLES}</style>
      <main className="cf-ck">
        <div className="cf-ck__inner">
          <p className="cf-ck__eyebrow">One more thing</p>
          <h1 className="cf-ck__head">Want occasional formation notes?</h1>
          <p className="cf-ck__body">
            Brief reflections, new tools, and content that supports your formation arc. Once or twice a month. No marketing noise. You can stop at any time.
          </p>
          <div className="cf-ck__buttons">
            <button
              type="button"
              className="cf-ck__btn cf-ck__btn--primary"
              onClick={handleAccept}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Count me in"}
            </button>
            <button
              type="button"
              className="cf-ck__btn cf-ck__btn--ghost"
              onClick={handleDecline}
              disabled={submitting}
            >
              Not right now
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
