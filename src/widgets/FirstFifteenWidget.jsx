import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import WidgetFrame from "../components/WidgetFrame";
import Button from "../components/primitives/Button";

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

const FF_CSS = `
  .ff-slot-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-bottom: 12px;
  }
  .ff-slot-label {
    font-family: var(--cf-font-brand);
    font-size: 10px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--cf-gold);
    flex-shrink: 0;
    min-width: 90px;
  }
  .ff-select-trigger {
    width: 100%;
    min-height: 44px;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-faint);
    border-radius: 8px;
    padding: 9px 36px 9px 14px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-size: 16px;
    font-style: italic;
    text-align: left;
    cursor: pointer;
    outline: none;
    transition: border-color .2s ease;
    position: relative;
  }
  .ff-select-trigger:focus { border-color: var(--cf-gold-mid); box-shadow: 0 0 0 3px var(--cf-gold-glow); }
  .ff-select-trigger--open { border-color: var(--cf-gold-mid); }
  .ff-select-caret {
    position: absolute;
    right: 12px;
    top: 50%;
    color: var(--cf-gold-muted);
    font-size: 10px;
    pointer-events: none;
    transition: transform .2s ease;
  }
  .ff-select-popup {
    position: absolute;
    top: calc(100% + 4px);
    left: 0; right: 0;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-soft);
    border-radius: 8px;
    overflow: hidden;
    z-index: 10;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }
  .ff-select-option {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 9px 14px;
    min-height: 44px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-size: 16px;
    font-style: italic;
    cursor: pointer;
    transition: background .15s ease, color .15s ease;
  }
  .ff-select-option:hover,
  .ff-select-option--highlighted {
    background: var(--cf-gold-bg);
    color: var(--cf-gold);
  }
  .ff-select-option--selected {
    background: var(--cf-gold-bg);
    color: var(--cf-gold);
  }

  .ff-notes {
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
    font-style: italic;
    outline: none;
    resize: vertical;
    transition: border-color .2s ease;
  }
  .ff-notes:focus { border-color: var(--cf-gold-mid); }
  .ff-notes::-webkit-scrollbar { width: 4px; }
  .ff-notes::-webkit-scrollbar-thumb { background: var(--cf-gold-soft); border-radius: 2px; }

  .ff-rule-link {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .32em;
    text-transform: uppercase;
    color: var(--cf-gold);
    opacity: 0.6;
    text-decoration: none;
    display: inline-block;
  }
  .ff-rule-link:hover { opacity: 0.85; }

  .ff-output-card {
    background: var(--cf-hero-bg);
    border: 1px solid var(--cf-gold-soft);
    border-radius: 16px;
    padding: 2rem;
    margin-top: 1.5rem;
  }
  .ff-output-eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: var(--cf-gold);
    margin: 0 0 1.25rem;
    font-weight: 700;
  }
  .ff-output-row {
    display: flex; align-items: baseline; gap: 14px;
    padding: 10px 0;
  }
  .ff-output-slot {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--cf-gold);
    flex-shrink: 0;
    min-width: 90px;
    font-weight: 700;
  }
  .ff-output-practice {
    font-family: var(--cf-font-devotional);
    font-size: 17px;
    color: var(--cf-ivory);
    font-style: italic;
  }
  .ff-output-divider {
    height: 1px;
    background: var(--cf-gold-hairline);
  }
  .ff-output-notes {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 14px;
    color: var(--cf-ivory-35);
    line-height: 1.6;
    margin: 14px 0 1rem;
  }
  .ff-output-helmet {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 16px;
    color: var(--cf-gold);
    margin: 0;
  }
`;

function PracticeSelect({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(() => Math.max(0, PRACTICE_OPTIONS.indexOf(value)));
  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (!triggerRef.current?.contains(e.target) && !popupRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlight(h => (h + 1) % PRACTICE_OPTIONS.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      setHighlight(h => (h - 1 + PRACTICE_OPTIONS.length) % PRACTICE_OPTIONS.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) { setOpen(true); return; }
      onChange(PRACTICE_OPTIONS[highlight]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <button
        ref={triggerRef}
        type="button"
        className={`ff-select-trigger ${open ? "ff-select-trigger--open" : ""}`}
        onClick={() => setOpen(o => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label ? `${label}: ${value}` : value}
      >
        {value}
        <span className="ff-select-caret" style={{ transform: `translateY(-50%) rotate(${open ? "180deg" : "0deg"})` }}>▾</span>
      </button>

      {open && (
        <div
          ref={popupRef}
          className="ff-select-popup"
          role="listbox"
          aria-label="Practice options"
        >
          {PRACTICE_OPTIONS.map((opt, i) => {
            const cls = [
              "ff-select-option",
              opt === value ? "ff-select-option--selected" : "",
              i === highlight ? "ff-select-option--highlighted" : "",
            ].filter(Boolean).join(" ");
            return (
              <button
                key={opt}
                type="button"
                className={cls}
                role="option"
                aria-selected={opt === value}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={e => { e.preventDefault(); handleSelect(opt); }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OutputCard({ slots, notes }) {
  return (
    <div className="ff-output-card">
      <p className="ff-output-eyebrow">My First Fifteen</p>
      {slots.map((practice, i) => (
        <div key={i}>
          <div className="ff-output-row">
            <span className="ff-output-slot">{SLOT_LABELS[i]}</span>
            <span className="ff-output-practice">{practice}</span>
          </div>
          {i < slots.length - 1 && <div className="ff-output-divider" />}
        </div>
      ))}
      {notes && (
        <>
          <div className="ff-output-divider" style={{ marginTop: 4 }} />
          <p className="ff-output-notes">{notes}</p>
        </>
      )}
      <p className="ff-output-helmet" style={{ marginTop: notes ? 0 : "1.25rem" }}>
        Helmet on.
      </p>
    </div>
  );
}

export function FirstFifteenWidget() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();

  const [slots, setSlots] = useState([...DEFAULT_SLOTS]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    const data = profile.widgets.firstFifteen;
    if (data) {
      if (data.slots) setSlots(data.slots);
      if (data.notes !== undefined) setNotes(data.notes);
      setSaved(data);
    }
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    const updatedConfig = { slots, notes };
    setSaved(updatedConfig);
    updateProfile({ widgets: { firstFifteen: updatedConfig } });
  };

  const updateSlot = (i, val) => {
    setSlots(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
  };

  return (
    <WidgetFrame
      title="First Fifteen"
      subtitle="Design your morning before the world designs it for you."
    >
      <style>{FF_CSS}</style>

      <div style={{ padding: "1.5rem 1.75rem 0" }}>
        {SLOT_LABELS.map((label, i) => (
          <div key={i} className="ff-slot-row" style={{ marginBottom: i < SLOT_LABELS.length - 1 ? "4px" : 0 }}>
            <span className="ff-slot-label">{label}</span>
            <PracticeSelect
              value={slots[i]}
              onChange={val => updateSlot(i, val)}
              label={label}
            />
          </div>
        ))}
      </div>

      <div style={{ padding: "0 1.75rem 1.25rem" }}>
        <textarea
          className="ff-notes"
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any notes for your morning..."
          aria-label="Morning notes"
        />
      </div>

      <div style={{ padding: "0 1.75rem 0.5rem", textAlign: "center" }}>
        <Link to="/rule-of-life/scripture" className="ff-rule-link">
          Part of the Scripture rhythm →
        </Link>
      </div>

      <div style={{ padding: "0 1.75rem 1.75rem" }}>
        <Button variant="primary" size="sm" onClick={handleSave} className="cf-btn--full">
          Save My First Fifteen
        </Button>
      </div>
      <style>{`.cf-btn--full { width: 100%; }`}</style>

      {saved && (
        <div style={{ padding: "0 1.75rem 1.75rem" }}>
          <OutputCard slots={saved.slots} notes={saved.notes} />
        </div>
      )}
    </WidgetFrame>
  );
}
