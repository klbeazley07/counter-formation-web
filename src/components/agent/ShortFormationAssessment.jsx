import { useState } from "react";

/*
 * ShortFormationAssessment
 *
 * Three free-text questions that capture the user's formation state right now.
 * Used by AgentOnboarding and any surface where the user hasn't yet completed
 * the full Fruit Assessment.
 *
 * Props:
 *   onSubmit(answers) -- called with { formingRight, resistance, next30 } on submit
 *   loading           -- disables the submit button when the parent is awaiting the API
 */

const QUESTIONS = [
  {
    key:         "formingRight",
    label:       "1. What is forming you right now?",
    hint:        "A season, a scripture, a discipline, a person. What is God using?",
    placeholder: "e.g., A season of transition. The book of Job. Silence.",
  },
  {
    key:         "resistance",
    label:       "2. Where do you feel resistance?",
    hint:        "Not what you should feel, but what is actually true right now.",
    placeholder: "e.g., I resist stillness. I avoid honest prayer. I drift toward distraction.",
  },
  {
    key:         "next30",
    label:       "3. What do you want the next 30 days to look like?",
    hint:        "One sentence is enough. Name the direction, not a full plan.",
    placeholder: "e.g., I want to be less reactive and more rooted. I want to pray with intention.",
  },
];

export default function ShortFormationAssessment({ onSubmit, loading }) {
  const [answers, setAnswers] = useState({ formingRight: "", resistance: "", next30: "" });

  const allFilled = QUESTIONS.every((q) => answers[q.key].trim().length > 0);

  function handleChange(key, value) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!allFilled || loading) return;
    onSubmit(answers);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {QUESTIONS.map((q) => (
        <div key={q.key}>
          <p style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         "var(--cf-gold)",
            fontWeight:    700,
            margin:        "0 0 6px",
          }}>
            {q.label}
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle:  "italic",
            fontSize:   16,
            color:      "var(--cf-ivory-28)",
            margin:     "0 0 12px",
            lineHeight: 1.5,
          }}>
            {q.hint}
          </p>
          <textarea
            value={answers[q.key]}
            onChange={(e) => handleChange(q.key, e.target.value)}
            placeholder={q.placeholder}
            rows={3}
            style={{
              width:         "100%",
              boxSizing:     "border-box",
              background:    "var(--cf-rule-bg)",
              border:        `1px solid ${answers[q.key].trim() ? "rgba(201,168,76,0.30)" : "var(--cf-white-8)"}`,
              borderRadius:  12,
              padding:       "14px 16px",
              fontFamily:    "'Cormorant Garamond', serif",
              fontSize:      17,
              lineHeight:    1.6,
              color:         "var(--cf-ivory)",
              resize:        "vertical",
              outline:       "none",
              transition:    "border-color 0.2s",
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={!allFilled || loading}
        style={{
          alignSelf:     "flex-start",
          padding:       "14px 32px",
          borderRadius:  999,
          background:    allFilled && !loading ? "var(--cf-gold)" : "var(--cf-gold-faint)",
          color:         allFilled && !loading ? "#0A0A0A" : "var(--cf-ivory-28)",
          border:        "none",
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          cursor:        allFilled && !loading ? "pointer" : "not-allowed",
          transition:    "background 0.2s, color 0.2s",
        }}
      >
        {loading ? "Forming…" : "Begin Formation"}
      </button>
    </form>
  );
}
