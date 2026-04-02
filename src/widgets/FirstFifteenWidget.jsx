import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "cf-first-fifteen";

const C = {
  gold:       "#C9A84C",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldGlow:   "rgba(201,168,76,0.06)",
  goldBorder: "rgba(201,168,76,0.2)",
  goldDiv:    "rgba(201,168,76,0.1)",
  inputBg:    "#17140F",
  cardBg:     "#06050A",
  ivory:      "#FAF8F5",
  ivoryMuted: "rgba(250,248,245,0.55)",
  ivoryDim:   "rgba(250,248,245,0.35)",
  ivoryFaint: "rgba(250,248,245,0.18)",
};

const barlow   = { fontFamily: "'Barlow Condensed', sans-serif" };
const garamond = { fontFamily: "'Cormorant Garamond', serif" };

const SLOT_LABELS = ["Minutes 1–5", "Minutes 6–10", "Minutes 11–15"];

const PRACTICE_OPTIONS = [
  "Silence",
  "Scripture Reading",
  "Prayer",
  "Declaration",
  "Journaling",
  "Examen",
];

const DEFAULT_SLOTS = ["Silence", "Scripture Reading", "Prayer"];

/* ── Custom Select ── */

function PracticeSelect({ value, onChange, focusId, onFocus, onBlur }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <style>{`
        .ff-select-option:hover { background: rgba(201,168,76,0.1) !important; color: #C9A84C !important; }
      `}</style>
      <button
        onClick={() => setOpen(o => !o)}
        onFocus={onFocus}
        onBlur={e => { onBlur(e); if (!e.currentTarget.parentNode.contains(e.relatedTarget)) setOpen(false); }}
        style={{
          ...garamond,
          width: "100%",
          minHeight: "44px",
          background: C.inputBg,
          border: `1px solid ${open ? "rgba(201,168,76,0.4)" : C.goldFaint}`,
          borderRadius: "8px",
          padding: "9px 36px 9px 14px",
          color: C.ivory,
          fontSize: "16px",
          fontStyle: "italic",
          textAlign: "left",
          cursor: "pointer",
          outline: "none",
          transition: "border-color .2s",
          position: "relative",
        }}
      >
        {value}
        <span style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: `translateY(-50%) rotate(${open ? "180deg" : "0deg"})`,
          color: "rgba(201,168,76,0.5)",
          fontSize: "10px",
          transition: "transform .2s",
          pointerEvents: "none",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          left: 0,
          right: 0,
          background: "#17140F",
          border: `1px solid rgba(201,168,76,0.25)`,
          borderRadius: "8px",
          overflow: "hidden",
          zIndex: 10,
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        }}>
          {PRACTICE_OPTIONS.map(opt => (
            <button
              key={opt}
              className="ff-select-option"
              onMouseDown={e => { e.preventDefault(); handleSelect(opt); }}
              style={{
                ...garamond,
                display: "block",
                width: "100%",
                textAlign: "left",
                background: opt === value ? "rgba(201,168,76,0.08)" : "none",
                border: "none",
                padding: "9px 14px",
                minHeight: "44px",
                color: opt === value ? C.gold : C.ivory,
                fontSize: "16px",
                fontStyle: "italic",
                cursor: "pointer",
                transition: "background .15s, color .15s",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Output Card ── */

function OutputCard({ slots, notes }) {
  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.goldBorder}`,
      borderRadius: "16px",
      padding: "2rem",
      marginTop: "1.5rem",
    }}>
      <p style={{
        ...barlow,
        fontSize: "9px",
        letterSpacing: ".44em",
        textTransform: "uppercase",
        color: C.gold,
        marginBottom: "1.25rem",
      }}>
        My First Fifteen
      </p>

      {slots.map((practice, i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "14px", padding: "10px 0" }}>
            <span style={{
              ...barlow,
              fontSize: "9px",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: C.gold,
              flexShrink: 0,
              minWidth: "90px",
            }}>
              {SLOT_LABELS[i]}
            </span>
            <span style={{
              ...garamond,
              fontSize: "17px",
              color: C.ivory,
              fontStyle: "italic",
            }}>
              {practice}
            </span>
          </div>
          {i < slots.length - 1 && (
            <div style={{ height: "1px", background: "rgba(201,168,76,0.1)" }} />
          )}
        </div>
      ))}

      {notes && (
        <>
          <div style={{ height: "1px", background: "rgba(201,168,76,0.1)", marginTop: "4px" }} />
          <p style={{
            ...garamond,
            fontStyle: "italic",
            fontSize: "14px",
            color: C.ivoryDim,
            lineHeight: 1.6,
            marginTop: "14px",
            marginBottom: "1rem",
          }}>
            {notes}
          </p>
        </>
      )}

      <p style={{
        ...garamond,
        fontStyle: "italic",
        fontSize: "16px",
        color: C.gold,
        marginTop: notes ? 0 : "1.25rem",
        marginBottom: 0,
      }}>
        Helmet on.
      </p>
    </div>
  );
}

/* ── FIRST FIFTEEN WIDGET ── */

export function FirstFifteenWidget() {
  const [slots, setSlots]     = useState([...DEFAULT_SLOTS]);
  const [notes, setNotes]     = useState("");
  const [saved, setSaved]     = useState(null);  // { slots, notes } | null
  const [notesFocus, setNotesFocus] = useState(false);
  const [focusedSlot, setFocusedSlot] = useState(null);

  /* Load from localStorage */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.slots) setSlots(data.slots);
        if (data.notes !== undefined) setNotes(data.notes);
        setSaved(data);
      }
    } catch {}
  }, []);

  const handleSave = () => {
    const data = { slots, notes };
    setSaved(data);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  };

  const updateSlot = (i, val) => {
    setSlots(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  return (
    <div style={{
      background: C.goldGlow,
      border: `1px solid ${C.goldBorder}`,
      borderRadius: "20px",
      overflow: "hidden",
    }}>
      <style>{`
        .ff-save-btn:hover { background: #FAF8F5 !important; }
        .ff-textarea::-webkit-scrollbar { width: 4px; }
        .ff-textarea::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "1.75rem 1.75rem 1.25rem" }}>
        <p style={{
          ...barlow,
          fontSize: "9px",
          letterSpacing: ".44em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: "6px",
        }}>
          First Fifteen
        </p>
        <p style={{
          ...garamond,
          fontStyle: "italic",
          fontSize: "15px",
          color: C.ivoryMuted,
          lineHeight: 1.5,
        }}>
          Design your morning before the world designs it for you.
        </p>
      </div>

      {/* Slots */}
      <div style={{ padding: "0 1.75rem" }}>
        {SLOT_LABELS.map((label, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              paddingBottom: "12px",
              marginBottom: i < SLOT_LABELS.length - 1 ? "4px" : "0",
            }}
          >
            <span style={{
              ...barlow,
              fontSize: "10px",
              letterSpacing: ".28em",
              textTransform: "uppercase",
              color: C.gold,
              flexShrink: 0,
              minWidth: "90px",
            }}>
              {label}
            </span>
            <PracticeSelect
              value={slots[i]}
              onChange={val => updateSlot(i, val)}
              focusId={i}
              onFocus={() => setFocusedSlot(i)}
              onBlur={() => setFocusedSlot(null)}
            />
          </div>
        ))}
      </div>

      {/* Notes */}
      <div style={{ padding: "0 1.75rem 1.25rem" }}>
        <textarea
          className="ff-textarea"
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onFocus={() => setNotesFocus(true)}
          onBlur={() => setNotesFocus(false)}
          placeholder="Any notes for your morning..."
          style={{
            ...garamond,
            width: "100%",
            boxSizing: "border-box",
            background: C.inputBg,
            border: `1px solid ${notesFocus ? "rgba(201,168,76,0.4)" : C.goldFaint}`,
            borderRadius: "10px",
            padding: "10px 14px",
            color: C.ivory,
            fontSize: "16px",
            lineHeight: 1.55,
            fontStyle: "italic",
            outline: "none",
            resize: "vertical",
            transition: "border-color .2s",
          }}
        />
      </div>

      {/* Rule of Life Cross-Link */}
      <div style={{ padding: "0 1.75rem 0.5rem", textAlign: "center" }}>
        <Link
          to="/rule-of-life/scripture"
          style={{
            fontFamily:    "'Barlow Condensed', sans-serif",
            fontSize:      "9px",
            letterSpacing: ".32em",
            textTransform: "uppercase",
            color:         "#C9A84C",
            opacity:       0.6,
            textDecoration:"none",
            display:       "inline-block",
          }}
        >
          Part of the Scripture rhythm →
        </Link>
      </div>

      {/* Save Button */}
      <div style={{ padding: "0 1.75rem 1.75rem" }}>
        <button
          className="ff-save-btn"
          onClick={handleSave}
          style={{
            ...barlow,
            width: "100%",
            padding: "11px 0",
            minHeight: "44px",
            background: C.gold,
            color: "#0A0A0A",
            border: "none",
            borderRadius: "999px",
            fontSize: "9px",
            letterSpacing: ".28em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontWeight: 700,
            transition: "background .2s",
          }}
        >
          Save My First Fifteen
        </button>
      </div>

      {/* Output Card */}
      {saved && (
        <div style={{ padding: "0 1.75rem 1.75rem" }}>
          <OutputCard slots={saved.slots} notes={saved.notes} />
        </div>
      )}
    </div>
  );
}
