import React, { useState, useEffect } from "react";

const STORAGE_KEY = "cf-examen-log";

const C = {
  gold:        "#C9A84C",
  goldFaint:   "rgba(201,168,76,0.15)",
  goldGlow:    "rgba(201,168,76,0.06)",
  goldBorder:  "rgba(201,168,76,0.2)",
  goldDiv:     "rgba(201,168,76,0.1)",
  goldFocus:   "rgba(201,168,76,0.4)",
  goldLeftBar: "rgba(201,168,76,0.3)",
  inputBg:     "#17140F",
  ivory:       "#FAF8F5",
  ivoryMuted:  "rgba(250,248,245,0.55)",
  ivoryDim:    "rgba(250,248,245,0.35)",
  ivoryFaint:  "rgba(250,248,245,0.18)",
  ivoryBody:   "rgba(250,248,245,0.82)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

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

/* ─── EXAMEN WIDGET ──────────────────────────────────────────────── */

export function ExamenWidget() {
  const [responses, setResponses]     = useState(["", "", "", "", ""]);
  const [focusIdx,  setFocusIdx]      = useState(null);
  const [entries,   setEntries]       = useState([]);
  const [savedMsg,  setSavedMsg]      = useState("");
  const [showPrev,  setShowPrev]      = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setEntries(JSON.parse(saved));
    } catch {}
  }, []);

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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setResponses(["", "", "", "", ""]);
    setSavedMsg(`Saved — ${formatDate(entry.timestamp)}`);
    setTimeout(() => setSavedMsg(""), 5000);
  };

  const textareaStyle = (focused) => ({
    ...garamond,
    width:        "100%",
    boxSizing:    "border-box",
    background:   C.inputBg,
    border:       `1px solid ${focused ? C.goldFocus : C.goldFaint}`,
    borderRadius: "10px",
    padding:      "10px 14px",
    color:        C.ivory,
    fontSize:     "16px",
    lineHeight:   1.55,
    outline:      "none",
    transition:   "border-color .2s",
    resize:       "vertical",
    fontStyle:    "italic",
    display:      "block",
    minHeight:    "72px",
  });

  const last3 = entries.slice(0, 3);

  return (
    <div style={{
      background:   C.goldGlow,
      border:       `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow:     "hidden",
    }}>
      <style>{`
        .examen-save-btn:hover { background: #FAF8F5 !important; }
        .examen-toggle-link:hover { opacity: 0.75; }
        .examen-scrollable::-webkit-scrollbar { width: 4px; }
        .examen-scrollable::-webkit-scrollbar-track { background: transparent; }
        .examen-scrollable::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
        .examen-scrollable { scrollbar-width: thin; scrollbar-color: rgba(201,168,76,0.2) transparent; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ padding: "1.75rem 1.75rem 1.25rem" }}>
        <p style={{
          ...barlow,
          fontSize:      "9px",
          letterSpacing: ".44em",
          textTransform: "uppercase",
          color:         C.gold,
          marginBottom:  "6px",
          margin:        "0 0 6px 0",
        }}>
          Daily Examen
        </p>
        <p style={{
          ...garamond,
          fontStyle:   "italic",
          fontSize:    "15px",
          color:       C.ivoryMuted,
          lineHeight:  1.5,
          margin:      0,
        }}>
          Five questions for honest self-reflection.
        </p>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: "1px", background: C.goldDiv, margin: "0 1.75rem" }} />

      {/* ── Questions ── */}
      <div style={{ padding: "1.5rem 1.75rem 0" }}>
        {QUESTIONS.map((q, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <p style={{
              ...garamond,
              fontSize:     "17px",
              color:        C.ivoryBody,
              lineHeight:   1.55,
              margin:       "0 0 10px 0",
              borderLeft:   `2px solid ${C.goldLeftBar}`,
              paddingLeft:  "1rem",
            }}>
              {q}
            </p>
            <textarea
              rows={3}
              value={responses[i]}
              onChange={e => handleResponseChange(i, e.target.value)}
              onFocus={() => setFocusIdx(i)}
              onBlur={() => setFocusIdx(null)}
              style={textareaStyle(focusIdx === i)}
            />
          </div>
        ))}
      </div>

      {/* ── Save Button ── */}
      <div style={{ padding: "0 1.75rem 0.5rem" }}>
        <button
          className="examen-save-btn"
          onClick={handleSave}
          style={{
            ...barlow,
            width:         "100%",
            padding:       "11px 22px",
            minHeight:     "44px",
            background:    C.gold,
            color:         "#0A0A0A",
            border:        "none",
            borderRadius:  "999px",
            fontSize:      "9px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            cursor:        "pointer",
            fontWeight:    700,
            transition:    "background .2s",
            display:       "block",
          }}
        >
          Save Examen
        </button>

        {savedMsg && (
          <p style={{
            ...garamond,
            fontStyle:   "italic",
            fontSize:    "13px",
            color:       C.ivoryMuted,
            textAlign:   "center",
            margin:      "10px 0 0",
          }}>
            {savedMsg}
          </p>
        )}
      </div>

      {/* ── View Previous Toggle ── */}
      <div style={{ padding: "0.75rem 1.75rem 1.5rem" }}>
        {entries.length > 0 && (
          <>
            <button
              className="examen-toggle-link"
              onClick={() => setShowPrev(p => !p)}
              style={{
                ...barlow,
                background:    "none",
                border:        "none",
                padding:       0,
                fontSize:      "9px",
                letterSpacing: ".44em",
                textTransform: "uppercase",
                color:         C.gold,
                cursor:        "pointer",
                display:       "block",
                margin:        "0 auto",
                transition:    "opacity .15s",
              }}
            >
              {showPrev ? "Hide Previous" : "View Previous"}
            </button>

            {showPrev && (
              <div
                className="examen-scrollable"
                style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}
              >
                {last3.map((entry, ei) => (
                  <div
                    key={ei}
                    style={{
                      background:   "rgba(255,255,255,0.03)",
                      border:       `1px solid ${C.goldDiv}`,
                      borderRadius: "12px",
                      padding:      "1.25rem",
                    }}
                  >
                    {/* Date eyebrow */}
                    <p style={{
                      ...barlow,
                      fontSize:      "9px",
                      letterSpacing: ".44em",
                      textTransform: "uppercase",
                      color:         C.gold,
                      margin:        "0 0 1rem 0",
                    }}>
                      {formatDate(entry.timestamp)}
                    </p>

                    {entry.responses.map((resp, qi) => (
                      <div key={qi} style={{ marginBottom: qi < 4 ? "1rem" : 0 }}>
                        <p style={{
                          ...garamond,
                          fontSize:   "12px",
                          color:      C.ivoryDim,
                          margin:     "0 0 3px 0",
                          lineHeight: 1.4,
                        }}>
                          {QUESTIONS[qi]}
                        </p>
                        <p style={{
                          ...garamond,
                          fontStyle:  "italic",
                          fontSize:   "14px",
                          color:      resp ? C.ivoryBody : C.ivoryFaint,
                          margin:     0,
                          lineHeight: 1.55,
                        }}>
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
    </div>
  );
}
