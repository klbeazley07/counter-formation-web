import React, { useState, useEffect, useRef } from "react";
import { useFormationProfile } from "../hooks/useFormationProfile";
import WidgetFrame from "../components/WidgetFrame";
import Button from "../components/primitives/Button";

const PLACEHOLDERS = [
  "My standing before God is not based on my performance.",
  "There is no condemnation for me.",
  "I have nothing that I did not receive.",
  "I am God’s child. That is what I am.",
  "I live from love, not for love.",
];

const MAX_STATEMENTS = 5;
const MIN_STATEMENTS = 3;

const DECL_CSS = `
  .decl-input-row { position: relative; display: flex; align-items: center; }
  .decl-input {
    width: 100%;
    box-sizing: border-box;
    background: var(--cf-rule-bg);
    border: 1px solid var(--cf-gold-faint);
    border-radius: var(--cf-radius-input);
    padding: 10px 14px;
    color: var(--cf-ivory);
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 16px;
    line-height: 1.5;
    outline: none;
    transition: border-color .2s ease;
  }
  .decl-input:focus { border-color: var(--cf-gold-mid); }
  .decl-input--has-remove { padding-right: 36px; }
  .decl-input::placeholder { color: var(--cf-ivory-35); font-style: italic; }

  .decl-remove-btn {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    background: none; border: none; padding: 2px 4px; cursor: pointer;
    color: var(--cf-ivory-35); font-size: 18px; line-height: 1;
    display: flex; align-items: center;
    transition: color .15s ease, opacity .15s ease;
    opacity: 0;
  }
  .decl-input-row:hover .decl-remove-btn,
  .decl-remove-btn:focus { opacity: 1; }
  .decl-remove-btn:hover { color: var(--cf-ivory); }

  .decl-card-eyebrow {
    font-family: var(--cf-font-brand);
    font-size: 9px;
    letter-spacing: .44em;
    text-transform: uppercase;
    color: var(--cf-gold);
    font-weight: 700;
    margin: 0 0 1.5rem 0;
  }
  .decl-card-stmt {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 20px;
    color: var(--cf-ivory-90);
    line-height: 1.8;
    margin: 0;
  }
  .decl-card-hairline {
    height: 1px;
    background: var(--cf-gold-hairline);
    margin: 0 auto;
    max-width: 80%;
  }
  .decl-card-armorup {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 15px;
    color: var(--cf-gold);
    margin: 1.5rem 0 0;
    line-height: 1.5;
  }
  .decl-add-btn {
    font-family: var(--cf-font-brand);
    background: none; border: none;
    padding: 10px 0 0;
    font-size: 9px; letter-spacing: .44em; text-transform: uppercase;
    color: var(--cf-gold); cursor: pointer;
    display: flex; align-items: center; gap: 6px;
    font-weight: 700;
    transition: opacity .15s ease;
  }
  .decl-add-btn:hover { opacity: 0.7; }
`;

export function DeclarationWidget() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const [statements, setStatements] = useState(["", "", ""]);
  const [card,       setCard]       = useState(null);
  const [copied,     setCopied]     = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!isLoaded) return;
    const saved = profile.widgets.declarations;
    if (Array.isArray(saved) && saved.length > 0) {
      const padded = [...saved];
      while (padded.length < MIN_STATEMENTS) padded.push("");
      setStatements(padded);
    }
  }, [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isLoaded) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateProfile({ widgets: { declarations: statements } });
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [statements]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (i, val) => {
    setStatements(prev => {
      const next = [...prev];
      next[i] = val;
      return next;
    });
    setCard(null);
  };

  const handleAdd = () => {
    if (statements.length >= MAX_STATEMENTS) return;
    setStatements(prev => [...prev, ""]);
  };

  const handleRemove = (i) => {
    if (statements.length <= MIN_STATEMENTS) return;
    setStatements(prev => prev.filter((_, idx) => idx !== i));
    setCard(null);
  };

  const handleGenerate = () => {
    const filled = statements.map(s => s.trim()).filter(Boolean);
    if (filled.length === 0) return;
    setCard(filled);
    updateProfile({ widgets: { declarations: statements } });
  };

  const handleCopy = () => {
    const filled = statements.map(s => s.trim()).filter(Boolean);
    if (filled.length === 0) return;
    const text = filled.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const canAddMore = statements.length < MAX_STATEMENTS;
  const hasContent = statements.some(s => s.trim());
  const showRemove = statements.length > MIN_STATEMENTS;

  return (
    <WidgetFrame
      title="Declaration Builder"
      subtitle="Write the truth you will speak over yourself each morning."
    >
      <style>{DECL_CSS}</style>

      <div style={{ padding: "1.5rem 1.75rem 0" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {statements.map((stmt, i) => (
            <div key={i} className="decl-input-row">
              <input
                type="text"
                className={`decl-input ${showRemove ? "decl-input--has-remove" : ""}`}
                value={stmt}
                placeholder={PLACEHOLDERS[i % PLACEHOLDERS.length]}
                onChange={e => handleChange(i, e.target.value)}
                aria-label={`Declaration statement ${i + 1}`}
              />
              {showRemove && (
                <button
                  className="decl-remove-btn"
                  onClick={() => handleRemove(i)}
                  aria-label={`Remove statement ${i + 1}`}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {canAddMore && (
          <button className="decl-add-btn" onClick={handleAdd} aria-label="Add another statement">
            + Add Statement
          </button>
        )}
      </div>

      <div style={{ padding: "1.25rem 1.75rem 1.5rem", display: "flex", gap: "10px" }}>
        <Button
          variant="primary"
          size="sm"
          disabled={!hasContent}
          onClick={handleGenerate}
          className="cf-btn--flex1"
        >
          Generate Card
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={!hasContent}
          onClick={handleCopy}
          className="cf-btn--flex1"
        >
          {copied ? "Copied" : "Copy Text"}
        </Button>
      </div>

      <style>{`.cf-btn--flex1 { flex: 1; }`}</style>

      {card && (
        <div style={{ padding: "0 1.75rem 1.75rem" }}>
          <div style={{
            background: "var(--cf-hero-bg)",
            border: "1px solid var(--cf-gold-soft)",
            borderRadius: "16px",
            padding: "1.5rem",
            textAlign: "center",
            width: "100%",
            boxSizing: "border-box",
          }}>
            <p className="decl-card-eyebrow">My Morning Declaration</p>
            {card.map((stmt, i) => (
              <div key={i}>
                <p className="decl-card-stmt" style={{ padding: i === 0 ? "0 0 1rem" : "1rem 0" }}>
                  {stmt}
                </p>
                {i < card.length - 1 && <div className="decl-card-hairline" />}
              </div>
            ))}
            <p className="decl-card-armorup">Armor Up.</p>
          </div>
        </div>
      )}
    </WidgetFrame>
  );
}
