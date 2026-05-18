import { useState } from "react";
import { useFormationProfile } from "../../hooks/useFormationProfile";
import EmailCapture from "../auth/EmailCapture";

/*
 * SaveJourneyStrip -- slim dashboard prompt that invites anonymous users
 * with meaningful formation activity to save their journey by entering an
 * email. Tap opens a bottom-sheet email capture; dismiss persists in
 * profile.dismissed.saveJourneyStrip.
 *
 * Gating logic lives in PersonalizedHome so this component renders only
 * when it should appear.
 */

const STYLES = `
  .cf-sjs {
    position: sticky;
    top: env(safe-area-inset-top);
    z-index: 30;
    background: rgba(14, 12, 10, 0.94);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(201,168,76,0.22);
    padding: 12px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    justify-content: space-between;
    color: #FAF8F5;
    font-family: 'Inter', sans-serif;
  }
  .cf-sjs__copy {
    font-size: 13px;
    line-height: 1.5;
    color: rgba(250,248,245,0.84);
    min-width: 0;
    flex: 1;
  }
  .cf-sjs__copy strong {
    color: #C9A84C;
    font-weight: 600;
    letter-spacing: 0.04em;
  }
  .cf-sjs__cta {
    background: transparent;
    color: #C9A84C;
    border: 1px solid rgba(201,168,76,0.42);
    padding: 8px 14px;
    border-radius: 999px;
    font-family: 'Michroma', sans-serif;
    font-size: 10px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: background 180ms ease, color 180ms ease;
  }
  .cf-sjs__cta:hover {
    background: #C9A84C;
    color: #0E0C0A;
  }
  .cf-sjs__close {
    background: none;
    border: none;
    color: rgba(250,248,245,0.45);
    cursor: pointer;
    padding: 4px 6px;
    font-size: 18px;
    line-height: 1;
  }
  .cf-sjs__close:hover { color: rgba(250,248,245,0.85); }

  .cf-sjs-sheet-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.62);
    z-index: 60;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: cf-sjs-fade 200ms ease both;
  }
  @keyframes cf-sjs-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .cf-sjs-sheet {
    width: 100%;
    max-width: 640px;
    background: #0E0C0A;
    border-top: 1px solid rgba(201,168,76,0.32);
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    padding: 24px 20px calc(env(safe-area-inset-bottom) + 28px);
    animation: cf-sjs-slide 260ms cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes cf-sjs-slide {
    from { transform: translateY(24px); opacity: 0.4; }
    to   { transform: translateY(0); opacity: 1; }
  }
  @media (min-width: 720px) {
    .cf-sjs-sheet-backdrop { align-items: center; }
    .cf-sjs-sheet {
      border-radius: 18px;
      border: 1px solid rgba(201,168,76,0.32);
      max-width: 560px;
      padding: 28px;
    }
  }
  .cf-sjs-sheet__close {
    display: block;
    margin: 0 0 16px auto;
    background: none;
    border: none;
    color: rgba(250,248,245,0.55);
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
  }
`;

export default function SaveJourneyStrip() {
  const { updateProfile } = useFormationProfile();
  const [open, setOpen] = useState(false);

  function dismiss() {
    updateProfile({ dismissed: { saveJourneyStrip: true } });
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-sjs" role="region" aria-label="Save your formation journey">
        <p className="cf-sjs__copy">
          <strong>Save your journey.</strong> Continue on any device with a single tap.
        </p>
        <button type="button" className="cf-sjs__cta" onClick={() => setOpen(true)}>
          Continue
        </button>
        <button
          type="button"
          className="cf-sjs__close"
          aria-label="Dismiss"
          onClick={dismiss}
        >
          ×
        </button>
      </div>

      {open && (
        <div
          className="cf-sjs-sheet-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          role="dialog"
          aria-modal="true"
        >
          <div className="cf-sjs-sheet">
            <button type="button" className="cf-sjs-sheet__close" onClick={close} aria-label="Close">×</button>
            <EmailCapture context="save-journey" onDismiss={close} />
          </div>
        </div>
      )}
    </>
  );
}
