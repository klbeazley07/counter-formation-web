import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import WidgetFrame from "../components/WidgetFrame";
import Button from "../components/primitives/Button";

const QUESTIONS = [
  "Where did I perform this week instead of live honestly?",
  "What story am I telling myself that might not be true?",
  "Did I bring my real self to God in prayer, or a managed version?",
  "Is there a conversation I avoided because honesty would cost something?",
  "What shaped my thinking more this week: Scripture or my feed?",
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day:   "numeric",
    year:  "numeric",
  });
}

const EXAMEN_CSS = `
  .examen-question {
    font-family: var(--cf-font-devotional);
    font-size: 17px;
    color: var(--cf-ivory-82);
    line-height: 1.55;
    margin: 0 0 10px 0;
    border-left: 2px solid var(--cf-gold-mid);
    padding-left: 1rem;
  }
  .examen-textarea {
    width: 100%;
    box-sizing: border-box;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-faint);
    border-radius: var(--cf-radius-input);
    padding: 10px 14px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-size: 16px;
    line-height: 1.55;
    outline: none;
    resize: vertical;
    font-style: italic;
    display: block;
    min-height: 72px;
    transition: border-color .2s ease;
  }
  .examen-textarea:focus { border-color: var(--cf-gold-mid); }

  .examen-rule-link {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: var(--cf-gold);
    opacity: 0.6;
    text-decoration: none;
    display: inline-block;
  }
  .examen-rule-link:hover { opacity: 0.85; }

  .examen-prev-card {
    background: var(--cf-white-5);
    border: 1px solid var(--cf-gold-hairline);
    border-radius: 12px;
    padding: 1.25rem;
  }
  .examen-prev-date {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 1rem 0;
    font-weight: 700;
  }
  .examen-prev-q {
    font-family: var(--cf-font-devotional);
    font-size: 12px;
    color: var(--cf-ivory-35);
    margin: 0 0 3px 0;
    line-height: 1.4;
  }
  .examen-prev-a {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    line-height: 1.55;
    margin: 0;
  }
  .examen-prev-a--filled { color: var(--cf-ivory-82); }
  .examen-prev-a--empty  { color: var(--cf-ivory-18); }

  .examen-scrollable::-webkit-scrollbar { width: 4px; }
  .examen-scrollable::-webkit-scrollbar-track { background: transparent; }
  .examen-scrollable::-webkit-scrollbar-thumb { background: var(--cf-gold-soft); border-radius: 2px; }
  .examen-scrollable { scrollbar-width: thin; scrollbar-color: var(--cf-gold-soft) transparent; }

  .examen-saved-msg {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 13px;
    color: var(--cf-ivory-55);
    text-align: center;
    margin: 10px 0 0;
  }
`;

export function ExamenWidget() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const [responses, setResponses] = useState(["", "", "", "", ""]);
  const [entries,   setEntries]   = useState([]);
  const [savedMsg,  setSavedMsg]  = useState("");
  const [showPrev,  setShowPrev]  = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    const log = profile.widgets.examenLog;
    if (log && log.length > 0) setEntries(log);
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResponseChange = (i, val) => {
    setResponses(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  const handleSave = () => {
    const entry = {
      responses: [...responses],
      timestamp: new Date().toISOString(),
    };
    const next = [entry, ...entries];
    setEntries(next);
    updateProfile({ widgets: { examenLog: next } });
    setResponses(["", "", "", "", ""]);
    setSavedMsg(`Saved — ${formatDate(entry.timestamp)}`);
    setTimeout(() => setSavedMsg(""), 5000);
  };

  const last3 = entries.slice(0, 3);

  return (
    <WidgetFrame
      title="Daily Examen"
      subtitle="Five questions for honest self-reflection."
    >
      <style>{EXAMEN_CSS}</style>

      <div style={{ padding: "1.5rem 1.75rem 0" }}>
        {QUESTIONS.map((q, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <p className="examen-question">{q}</p>
            <textarea
              className="examen-textarea"
              rows={3}
              value={responses[i]}
              onChange={e => handleResponseChange(i, e.target.value)}
              aria-label={`Response to question ${i + 1}`}
            />
          </div>
        ))}
      </div>

      <div style={{ padding: "0 1.75rem 0.5rem" }}>
        <Button variant="primary" size="sm" onClick={handleSave} className="cf-btn--full">
          Save Examen
        </Button>
        {savedMsg && <p className="examen-saved-msg">{savedMsg}</p>}
      </div>
      <style>{`.cf-btn--full { width: 100%; }`}</style>

      <div style={{ padding: "0 1.75rem 0.5rem", textAlign: "center" }}>
        <Link to="/rule-of-life/presence" className="examen-rule-link">
          Part of the Presence rhythm →
        </Link>
      </div>

      <div style={{ padding: "0.75rem 1.75rem 1.5rem" }}>
        {entries.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrev(p => !p)}
                aria-expanded={showPrev}
                aria-controls="examen-prev-list"
              >
                {showPrev ? "Hide Previous" : "View Previous"}
              </Button>
            </div>

            {showPrev && (
              <div
                id="examen-prev-list"
                className="examen-scrollable"
                style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                {last3.map((entry, ei) => (
                  <div key={ei} className="examen-prev-card">
                    <p className="examen-prev-date">{formatDate(entry.timestamp)}</p>
                    {entry.responses.map((resp, qi) => (
                      <div key={qi} style={{ marginBottom: qi < 4 ? "1rem" : 0 }}>
                        <p className="examen-prev-q">{QUESTIONS[qi]}</p>
                        <p className={`examen-prev-a ${resp ? "examen-prev-a--filled" : "examen-prev-a--empty"}`}>
                          {resp || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </WidgetFrame>
  );
}
