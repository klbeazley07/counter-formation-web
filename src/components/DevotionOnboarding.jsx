import { useState } from "react";
import { useFormationProfile } from "../hooks/useFormationProfile";
import { FRUIT_ORDER, FRUITS } from "../fruitAssessmentData";
import { getAllRhythms } from "../content/loader";

/*
 * DevotionOnboarding — short orientation flow for first-time users.
 *
 * Three-question intake that establishes a minimal formation starting point
 * for users who have not completed the full 27-question Fruit Assessment.
 *
 * The component manages its own step state. It writes once, at the end of Q3,
 * to profile.onboarding and profile.assessment.formationEdge. After the write
 * it invokes the onComplete callback so the host (DevotionGuide) can re-derive
 * its render mode.
 *
 * Props:
 *   onComplete  {function}  Called with no arguments after the profile write
 *                           completes. Required.
 */

const RHYTHMS = getAllRhythms().map(r => ({ slug: r.slug, label: r.title, hint: r.sub }));

const RHYTHM_SLUGS = RHYTHMS.map(r => r.slug);

const ONBOARDING_CSS = `
  .dgo-card {
    background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%), #1C1813;
    border: 1px solid rgba(201,168,76,0.14);
    border-radius: 24px;
    padding: clamp(30px, 5vw, 56px);
    position: relative;
    overflow: hidden;
    margin-bottom: 64px;
    box-shadow: 0 18px 44px rgba(0,0,0,0.24);
  }
  .dgo-top-line {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.30), transparent);
  }
  .dgo-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #C9A84C;
    font-weight: 700;
    margin: 0 0 8px;
  }
  .dgo-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 3.2vw, 32px);
    line-height: 1.35;
    color: #FAF8F5;
    margin: 0 0 14px;
    font-weight: 400;
  }
  .dgo-hint {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px, 2vw, 18px);
    line-height: 1.7;
    color: rgba(250,248,245,0.62);
    margin: 0 0 28px;
  }
  .dgo-progress {
    display: flex;
    gap: 6px;
    margin-bottom: 28px;
  }
  .dgo-pip {
    flex: 1;
    height: 3px;
    border-radius: 999px;
    background: rgba(201,168,76,0.12);
    transition: background 0.25s ease;
  }
  .dgo-pip-active {
    background: #C9A84C;
  }
  .dgo-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  .dgo-option {
    text-align: left;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 16px;
    padding: 16px 18px;
    color: #FAF8F5;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.18s ease;
  }
  .dgo-option:hover {
    background: rgba(201,168,76,0.08);
    border-color: rgba(201,168,76,0.45);
    transform: translateY(-1px);
  }
  .dgo-option-hint {
    display: block;
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    letter-spacing: 0;
    text-transform: none;
    color: rgba(250,248,245,0.55);
    margin-top: 6px;
    font-weight: 400;
  }
  .dgo-textarea {
    width: 100%;
    background: #EEE7DA;
    border: 1px solid rgba(201,168,76,0.16);
    border-radius: 16px;
    padding: 18px 20px;
    color: #17140F;
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    line-height: 1.6;
    outline: none;
    box-sizing: border-box;
    resize: vertical;
    min-height: 136px;
    transition: border-color 0.2s, box-shadow 0.2s ease, background 0.2s ease;
  }
  .dgo-textarea:focus {
    border-color: #C9A84C;
    background: #F3EDE1;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.18);
  }
  .dgo-textarea::placeholder {
    color: rgba(23,20,15,0.42);
    font-style: italic;
  }
  .dgo-actions {
    margin-top: 28px;
    padding-top: 22px;
    border-top: 1px solid rgba(201,168,76,0.14);
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
  }
  .dgo-btn-prim {
    padding: 14px 28px;
    border-radius: 18px;
    background: #C9A84C;
    color: #120F08;
    border: 1px solid rgba(201,168,76,0.30);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 10px 24px rgba(201,168,76,0.18);
  }
  .dgo-btn-prim:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(201,168,76,0.22); }
  .dgo-btn-ghost {
    padding: 12px 22px;
    border-radius: 999px;
    background: transparent;
    color: rgba(250,248,245,0.62);
    border: 1px solid rgba(255,255,255,0.08);
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .dgo-btn-ghost:hover { color: #FAF8F5; border-color: rgba(201,168,76,0.30); }
  .dgo-complete {
    text-align: center;
    padding: 32px 12px 8px;
  }
  .dgo-complete-eyebrow {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 10px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #C9A84C;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .dgo-complete-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 3vw, 28px);
    color: #FAF8F5;
    margin: 0;
    font-weight: 400;
  }
`;

const STEPS = ["idle", "question-1", "question-2", "question-3", "complete"];

function ProgressPips({ step }) {
  const activeIndex = Math.max(0, STEPS.indexOf(step) - 1);
  const total = 3;
  return (
    <div className="dgo-progress" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`dgo-pip ${i < activeIndex ? "dgo-pip-active" : ""}`} />
      ))}
    </div>
  );
}

export default function DevotionOnboarding({ onComplete }) {
  const { updateProfile } = useFormationProfile();
  const [step, setStep] = useState("idle");
  const [formationFocus, setFormationFocus] = useState(null);
  const [rhythmPreference, setRhythmPreference] = useState(null);
  const [intention, setIntention] = useState("");

  const submit = () => {
    const focus = FRUIT_ORDER.includes(formationFocus) ? formationFocus : null;
    const rhythm = RHYTHM_SLUGS.includes(rhythmPreference) ? rhythmPreference : null;
    if (!focus || !rhythm) return;

    updateProfile({
      onboarding: {
        completedAt:      new Date().toISOString(),
        formationFocus:   focus,
        rhythmPreference: rhythm,
        intention:        intention.trim(),
      },
      assessment: {
        formationEdge: [focus],
      },
    });

    setStep("complete");
    if (typeof onComplete === "function") {
      setTimeout(() => onComplete(), 600);
    }
  };

  return (
    <div className="dgo-card">
      <style>{ONBOARDING_CSS}</style>
      <div className="dgo-top-line" />

      {step !== "idle" && step !== "complete" && <ProgressPips step={step} />}

      {step === "idle" && (
        <>
          <p className="dgo-eyebrow">Before we begin</p>
          <h2 className="dgo-title">
            Tell us a little about where you are, and the devotions will be shaped to meet you there.
          </h2>
          <p className="dgo-hint">
            Three questions. Less than a minute. You can change any of this later.
          </p>
          <div className="dgo-actions" style={{ justifyContent: "flex-start" }}>
            <button className="dgo-btn-prim" onClick={() => setStep("question-1")}>
              Begin
            </button>
          </div>
        </>
      )}

      {step === "question-1" && (
        <>
          <p className="dgo-eyebrow">Question 1 of 3 · Formation focus</p>
          <h2 className="dgo-title">
            Which area of inner formation needs the most attention from you right now?
          </h2>
          <p className="dgo-hint">
            Choose the one that feels most exposed. You can change this later.
          </p>
          <div className="dgo-grid" role="radiogroup" aria-label="Formation focus">
            {FRUIT_ORDER.map(slug => (
              <button
                key={slug}
                className="dgo-option"
                role="radio"
                aria-checked={formationFocus === slug}
                onClick={() => {
                  setFormationFocus(slug);
                  setStep("question-2");
                }}
                style={formationFocus === slug ? { background: "rgba(201,168,76,0.12)", borderColor: "var(--cf-gold)" } : null}
              >
                {FRUITS[slug].label}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "question-2" && (
        <>
          <p className="dgo-eyebrow">Question 2 of 3 · Rhythm</p>
          <h2 className="dgo-title">
            Which rhythm of life feels most missing for you right now?
          </h2>
          <p className="dgo-hint">
            The one whose absence you notice most.
          </p>
          <div className="dgo-grid" role="radiogroup" aria-label="Rhythm preference">
            {RHYTHMS.map(r => (
              <button
                key={r.slug}
                className="dgo-option"
                role="radio"
                aria-checked={rhythmPreference === r.slug}
                onClick={() => {
                  setRhythmPreference(r.slug);
                  setStep("question-3");
                }}
                style={rhythmPreference === r.slug ? { background: "rgba(201,168,76,0.12)", borderColor: "var(--cf-gold)" } : null}
              >
                {r.label}
                <span className="dgo-option-hint">{r.hint}</span>
              </button>
            ))}
          </div>
          <div className="dgo-actions">
            <button className="dgo-btn-ghost" onClick={() => setStep("question-1")}>
              ← Back
            </button>
          </div>
        </>
      )}

      {step === "question-3" && (
        <>
          <p className="dgo-eyebrow">Question 3 of 3 · Intention</p>
          <h2 className="dgo-title">
            What are you hoping the next season of formation looks like?
          </h2>
          <p className="dgo-hint">
            A sentence is enough. This is for you. The agent will reference it as it shapes your devotions.
          </p>
          <textarea
            className="dgo-textarea"
            rows={4}
            value={intention}
            onChange={e => setIntention(e.target.value)}
            placeholder="e.g., I want to be slower, less reactive, and more present with my family."
            aria-label="Formation intention"
          />
          <div className="dgo-actions">
            <button className="dgo-btn-ghost" onClick={() => setStep("question-2")}>
              ← Back
            </button>
            <button className="dgo-btn-prim" onClick={submit}>
              Begin Formation
            </button>
          </div>
        </>
      )}

      {step === "complete" && (
        <div className="dgo-complete">
          <p className="dgo-complete-eyebrow">Saved</p>
          <p className="dgo-complete-title">
            Opening your devotion guide…
          </p>
        </div>
      )}
    </div>
  );
}
