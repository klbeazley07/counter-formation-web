// Session 6 -- User-side trusted-person invitation flow.
// Route: /field-guide/gifts/invite
// Multi-step: collect recipients → personalize message → review/send → confirm

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── TOKENS ────────────────────────────────────────────────────────────── */

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  bgInput: "#130F0C",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.30)",
  goldFaint: "rgba(201,168,76,0.12)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.08)",
  borderGold: "rgba(201,168,76,0.22)",
  error: "#E57373",
};

const F = {
  display: "'Cormorant Garamond', serif",
  caps: "'Barlow Condensed', sans-serif",
  body: "'Inter', sans-serif",
};

/* ─── STORAGE KEYS ──────────────────────────────────────────────────────── */

export const TRUSTED_PERSONS_KEY = "cf-gifts-trusted-persons";
export const TRUSTED_RESPONSES_KEY = "cf-gifts-trusted-responses";
const USER_NAME_KEY = "cf-gifts-user-name";
const INVITE_SENT_KEY = "cf-gifts-invite-sent";

/* ─── HELPERS ───────────────────────────────────────────────────────────── */

function generateToken(email, name) {
  const raw = `${email}|${name}|${Date.now()}|${Math.random().toString(36).slice(2, 9)}`;
  return btoa(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function getOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://counterformed.com";
}

function buildDefaultMessage(senderName, recipientFirstName) {
  return `Hi ${recipientFirstName},

I am working through a spiritual gifts assessment as part of my own formation, and the methodology asks me to invite a few people who know me well to weigh in on what they have observed. You came to mind.

The questions are brief -- just one question per gift, asking what you have seen of how God seems to be working through me. There is no right answer to any of it. Honest is more helpful than flattering, and "I haven't been in a position to see this" is a real option for any question where you genuinely have not.

It should take about 5 to 7 minutes. The link is below.

Thank you for taking the time. I value how you see me.

${senderName}`;
}

function firstNameOf(fullName) {
  const trimmed = (fullName || "").trim();
  return trimmed.split(/\s+/)[0] || trimmed;
}

function loadStoredUserName() {
  try { return localStorage.getItem(USER_NAME_KEY) || ""; } catch { return ""; }
}

function saveUserName(name) {
  try { localStorage.setItem(USER_NAME_KEY, name); } catch { /* ignore */ }
}

function saveInviteSent(pairings) {
  try {
    localStorage.setItem(INVITE_SENT_KEY, JSON.stringify({ count: pairings.length, sentAt: new Date().toISOString() }));
    const existing = JSON.parse(localStorage.getItem(TRUSTED_PERSONS_KEY) || "[]");
    const merged = [...existing];
    for (const p of pairings) {
      const idx = merged.findIndex((e) => e.token === p.token);
      if (idx >= 0) merged[idx] = p; else merged.push(p);
    }
    localStorage.setItem(TRUSTED_PERSONS_KEY, JSON.stringify(merged));
  } catch { /* ignore */ }
}

/* ─── RELATIONSHIP OPTIONS ──────────────────────────────────────────────── */

const RELATIONSHIPS = [
  { value: "", label: "Relationship (optional)" },
  { value: "family", label: "Family" },
  { value: "friend", label: "Friend" },
  { value: "pastor-small-group", label: "Pastor / small group leader" },
  { value: "coworker", label: "Coworker" },
  { value: "mentor", label: "Mentor" },
  { value: "other", label: "Other" },
];

/* ─── INPUT STYLES ──────────────────────────────────────────────────────── */

const inputBase = {
  background: C.bgInput,
  border: `1px solid ${C.border}`,
  color: C.ivory,
  fontFamily: F.body,
  fontSize: 15,
  padding: "12px 14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 180ms ease",
  borderRadius: 0,
};

const inputError = {
  borderColor: C.error,
};

/* ─── SUBCOMPONENTS ─────────────────────────────────────────────────────── */

function Eyebrow({ children }) {
  return (
    <div style={{ fontFamily: F.caps, fontSize: 11, letterSpacing: "0.38em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>
      {children}
    </div>
  );
}

function GoldRule() {
  return (
    <div style={{ height: 1, background: `linear-gradient(90deg, ${C.gold}, transparent)`, marginBottom: 40, maxWidth: 80 }} />
  );
}

function PrimaryButton({ onClick, disabled, children, style }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov && !disabled ? C.gold : "transparent",
        color: hov && !disabled ? C.bg : C.gold,
        border: `1px solid ${disabled ? C.goldDim : C.gold}`,
        padding: "15px 36px",
        fontFamily: F.caps,
        fontSize: 13,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 200ms ease, color 200ms ease",
        opacity: disabled ? 0.45 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function RecipientRow({ person, index, onChange, onRemove, showRemove }) {
  const [focused, setFocused] = useState(null);

  const field = (key, type = "text", placeholder) => ({
    type,
    placeholder,
    value: person[key],
    onChange: (e) => onChange(index, key, e.target.value),
    onFocus: () => setFocused(key),
    onBlur: () => setFocused(null),
    style: {
      ...inputBase,
      borderColor: focused === key ? C.goldDim : (person._errors?.[key] ? C.error : C.border),
    },
  });

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "24px 28px 20px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: F.caps, fontSize: 11, letterSpacing: "0.36em", textTransform: "uppercase", color: C.muted }}>
          Person {index + 1}
        </div>
        {showRemove && (
          <button
            onClick={() => onRemove(index)}
            style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontFamily: F.body, fontSize: 13, padding: "2px 6px" }}
          >
            Remove
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
        <div>
          <input {...field("name", "text", "Full name *")} />
          {person._errors?.name && <div style={{ fontSize: 12, color: C.error, marginTop: 4 }}>{person._errors.name}</div>}
        </div>
        <div>
          <input {...field("email", "email", "Email address *")} />
          {person._errors?.email && <div style={{ fontSize: 12, color: C.error, marginTop: 4 }}>{person._errors.email}</div>}
        </div>
      </div>

      <select
        value={person.relationship}
        onChange={(e) => onChange(index, "relationship", e.target.value)}
        style={{
          ...inputBase,
          color: person.relationship ? C.ivory : C.dim,
          appearance: "none",
          WebkitAppearance: "none",
          cursor: "pointer",
        }}
      >
        {RELATIONSHIPS.map((r) => (
          <option key={r.value} value={r.value} style={{ background: C.bgCard, color: C.ivory }}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── STEP 1: COLLECT RECIPIENTS ────────────────────────────────────────── */

function StepCollect({ userName, setUserName, recipients, setRecipients, onContinue }) {
  const [senderFocused, setSenderFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(idx, key, value) {
    setRecipients((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [key]: value, _errors: undefined } : p))
    );
  }

  function handleRemove(idx) {
    setRecipients((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAddAnother() {
    if (recipients.length >= 4) return;
    setRecipients((prev) => [...prev, { name: "", email: "", relationship: "", _errors: undefined }]);
  }

  function validate() {
    let valid = true;
    const validated = recipients.map((p) => {
      const errors = {};
      if (!p.name.trim()) { errors.name = "Name is required."; valid = false; }
      if (!p.email.trim()) { errors.email = "Email is required."; valid = false; }
      else if (!/\S+@\S+\.\S+/.test(p.email.trim())) { errors.email = "Enter a valid email."; valid = false; }
      return { ...p, _errors: Object.keys(errors).length ? errors : undefined };
    });
    setRecipients(validated);
    return valid;
  }

  function handleContinue() {
    setSubmitted(true);
    if (!userName.trim()) return;
    if (!validate()) return;
    saveUserName(userName.trim());
    onContinue();
  }

  return (
    <div>
      <Eyebrow>Complete the picture</Eyebrow>
      <GoldRule />

      <h1 style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.12, margin: "0 0 18px", color: C.ivory }}>
        Who knows you well?
      </h1>

      <p style={{ fontFamily: F.display, fontSize: 18, lineHeight: 1.72, color: C.muted, margin: "0 0 12px", maxWidth: 620 }}>
        Choose two or three people in your life who know you well enough to have observed how the Spirit is at work through you. They will receive a brief assessment (5 to 7 minutes) about what they have seen. Their responses will integrate into your results to complete the picture.
      </p>

      <p style={{ fontFamily: F.body, fontSize: 14, lineHeight: 1.7, color: C.dim, margin: "0 0 36px", maxWidth: 600 }}>
        The best people to invite are those who have known you for at least a year, have seen you in more than one context (church, work, family, friendship), and will give you honest answers rather than flattering ones. A spouse alone is usually not enough -- include at least one person outside your household.
      </p>

      {/* Sender name */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: "block", fontFamily: F.caps, fontSize: 11, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold, marginBottom: 8 }}>
          Your name
        </label>
        <input
          type="text"
          placeholder="Your first and last name *"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onFocus={() => setSenderFocused(true)}
          onBlur={() => setSenderFocused(false)}
          style={{
            ...inputBase,
            maxWidth: 360,
            borderColor: senderFocused ? C.goldDim : (submitted && !userName.trim() ? C.error : C.border),
          }}
        />
        {submitted && !userName.trim() && (
          <div style={{ fontSize: 12, color: C.error, marginTop: 4 }}>Your name is required for the invitation.</div>
        )}
      </div>

      {/* Recipients */}
      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", fontFamily: F.caps, fontSize: 11, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold, marginBottom: 12 }}>
          Trusted people
        </label>
        {recipients.map((p, i) => (
          <RecipientRow
            key={i}
            person={p}
            index={i}
            onChange={handleChange}
            onRemove={handleRemove}
            showRemove={recipients.length > 1}
          />
        ))}
      </div>

      {recipients.length < 4 && (
        <button
          onClick={handleAddAnother}
          style={{ background: "none", border: "none", color: C.gold, fontFamily: F.caps, fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", cursor: "pointer", padding: "8px 0", marginBottom: 36 }}
        >
          + Add another person
        </button>
      )}
      {recipients.length >= 4 && <div style={{ height: 36 }} />}

      <PrimaryButton onClick={handleContinue}>Continue</PrimaryButton>

      <div style={{ marginTop: 20 }}>
        <Link to="/field-guide/gifts/results" style={{ fontFamily: F.body, fontSize: 13, color: C.dim, textDecoration: "none" }}>
          Return to your results
        </Link>
      </div>
    </div>
  );
}

/* ─── STEP 2: PERSONALIZE MESSAGE ───────────────────────────────────────── */

function StepPersonalize({ userName, recipients, message, setMessage, onBack, onContinue }) {
  const [focused, setFocused] = useState(false);

  // Preview uses the first recipient's name for context.
  const previewFirstName = firstNameOf(recipients[0]?.name || "");
  const defaultMsg = buildDefaultMessage(userName, previewFirstName || "[Recipient name]");

  // Initialize message on first render if empty.
  React.useEffect(() => {
    if (!message) setMessage(defaultMsg);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Eyebrow>Complete the picture</Eyebrow>
      <GoldRule />

      <h1 style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(28px, 4.5vw, 46px)", lineHeight: 1.15, margin: "0 0 14px", color: C.ivory }}>
        Personalize your invitation
      </h1>

      <p style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.7, color: C.muted, margin: "0 0 28px", maxWidth: 580 }}>
        Here is the default message that will be sent. You can edit it to make it more personal -- the more specific you can be about why you are asking this person, the more they will value being asked.
      </p>

      <textarea
        value={message || defaultMsg}
        onChange={(e) => setMessage(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={16}
        style={{
          ...inputBase,
          resize: "vertical",
          lineHeight: 1.75,
          borderColor: focused ? C.goldDim : C.border,
          marginBottom: 16,
        }}
      />

      <p style={{ fontFamily: F.body, fontSize: 13, lineHeight: 1.6, color: C.dim, margin: "0 0 32px" }}>
        Your trusted persons will receive a link to a brief assessment specifically about you. They will not see your results or your responses. Their responses will integrate into your final results.
      </p>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <PrimaryButton onClick={onContinue}>Review and send</PrimaryButton>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: C.muted, fontFamily: F.body, fontSize: 14, cursor: "pointer", padding: 0 }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 3: REVIEW AND SEND ───────────────────────────────────────────── */

function StepReview({ userName, recipients, setRecipients, message, onBack, onSend }) {
  function handleRemove(idx) {
    setRecipients((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <Eyebrow>Complete the picture</Eyebrow>
      <GoldRule />

      <h1 style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(28px, 4.5vw, 46px)", lineHeight: 1.15, margin: "0 0 14px", color: C.ivory }}>
        Review and send
      </h1>

      <p style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.7, color: C.muted, margin: "0 0 28px", maxWidth: 560 }}>
        Check your recipient list. You can remove anyone before sending.
      </p>

      {/* Recipient list */}
      <div style={{ marginBottom: 28 }}>
        {recipients.map((p, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}
          >
            <div>
              <div style={{ fontFamily: F.body, fontSize: 15, color: C.ivory, marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontFamily: F.body, fontSize: 13, color: C.muted }}>{p.email}</div>
              {p.relationship && (
                <div style={{ fontFamily: F.caps, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: C.dim, marginTop: 2 }}>
                  {RELATIONSHIPS.find((r) => r.value === p.relationship)?.label || p.relationship}
                </div>
              )}
            </div>
            {recipients.length > 1 && (
              <button
                onClick={() => handleRemove(i)}
                style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontFamily: F.body, fontSize: 13, padding: "4px 8px" }}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Message preview */}
      <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "24px 28px", marginBottom: 36 }}>
        <div style={{ fontFamily: F.caps, fontSize: 11, letterSpacing: "0.36em", textTransform: "uppercase", color: C.gold, marginBottom: 14 }}>
          Your message
        </div>
        <pre style={{ fontFamily: F.body, fontSize: 14, lineHeight: 1.8, color: C.muted, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {message}
        </pre>
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <PrimaryButton onClick={onSend}>Send invitations</PrimaryButton>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: C.muted, fontFamily: F.body, fontSize: 14, cursor: "pointer", padding: 0 }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 4: SENT CONFIRMATION ─────────────────────────────────────────── */

function StepSent({ pairings, onReturn }) {
  const [copiedToken, setCopiedToken] = useState(null);

  function copyToClipboard(text, token) {
    try {
      navigator.clipboard.writeText(text);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <Eyebrow>Invitations ready</Eyebrow>
      <GoldRule />

      <h1 style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "clamp(28px, 4.5vw, 46px)", lineHeight: 1.15, margin: "0 0 14px", color: C.ivory }}>
        Your invitations are ready to send
      </h1>

      <p style={{ fontFamily: F.display, fontSize: 17, lineHeight: 1.7, color: C.muted, margin: "0 0 10px", maxWidth: 580 }}>
        Copy each link below and share it with the corresponding person by email or message. Each link is unique to that person and will tie their responses to your results.
      </p>

      <p style={{ fontFamily: F.body, fontSize: 14, lineHeight: 1.65, color: C.dim, margin: "0 0 32px", maxWidth: 540 }}>
        Allow your trusted persons several days to complete -- the assessment is brief but the questions require thoughtful answers.
      </p>

      {pairings.map((p) => {
        const url = `${getOrigin()}/field-guide/gifts/observe/${p.token}`;
        const isCopied = copiedToken === p.token;
        return (
          <div
            key={p.token}
            style={{ background: C.bgCard, border: `1px solid ${C.border}`, padding: "20px 24px", marginBottom: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: F.body, fontSize: 15, color: C.ivory, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontFamily: F.body, fontSize: 13, color: C.muted, marginBottom: 8 }}>{p.email}</div>
                <div
                  style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: C.gold, wordBreak: "break-all", lineHeight: 1.5 }}
                >
                  {url}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(url, p.token)}
                style={{
                  background: isCopied ? C.gold : "transparent",
                  color: isCopied ? C.bg : C.gold,
                  border: `1px solid ${isCopied ? C.gold : C.goldDim}`,
                  padding: "9px 18px",
                  fontFamily: F.caps,
                  fontSize: 11,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "background 200ms ease, color 200ms ease",
                  flexShrink: 0,
                }}
              >
                {isCopied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 36 }}>
        <PrimaryButton onClick={onReturn}>Return to your results</PrimaryButton>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────────── */

export default function TrustedPersonInvitationFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState(loadStoredUserName);
  const [recipients, setRecipients] = useState([
    { name: "", email: "", relationship: "", _errors: undefined },
  ]);
  const [message, setMessage] = useState("");
  const [sentPairings, setSentPairings] = useState([]);

  useEffect(() => {
    document.title = "Invite Trusted People · Counter Formation";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  function handleSend() {
    const now = new Date().toISOString();
    const pairings = recipients
      .filter((p) => p.name.trim() && p.email.trim())
      .map((p) => ({
        token: generateToken(p.email.trim(), p.name.trim()),
        name: p.name.trim(),
        email: p.email.trim(),
        relationship: p.relationship,
        sentAt: now,
        status: "sent",
        userName: userName.trim(),
        message,
      }));

    if (pairings.length === 0) return;
    saveInviteSent(pairings);
    setSentPairings(pairings);
    setStep(4);
  }

  function handleReturn() {
    navigate("/field-guide/gifts/results");
  }

  return (
    <main
      style={{
        background: C.bg,
        color: C.ivory,
        minHeight: "100vh",
        padding: "120px 24px 100px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes cf-invite-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{ maxWidth: 720, width: "100%", animation: "cf-invite-fade 420ms ease-out both" }}
      >
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, marginBottom: 52 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: step >= s ? C.gold : C.border,
                transition: "background 300ms ease",
              }}
            />
          ))}
        </div>

        {step === 1 && (
          <StepCollect
            userName={userName}
            setUserName={setUserName}
            recipients={recipients}
            setRecipients={setRecipients}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepPersonalize
            userName={userName}
            recipients={recipients}
            message={message}
            setMessage={setMessage}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepReview
            userName={userName}
            recipients={recipients}
            setRecipients={setRecipients}
            message={message}
            onBack={() => setStep(2)}
            onSend={handleSend}
          />
        )}

        {step === 4 && (
          <StepSent pairings={sentPairings} onReturn={handleReturn} />
        )}
      </div>
    </main>
  );
}

/* ─── EXPORTED HELPERS ──────────────────────────────────────────────────── */
// For use by GiftsResults and TrustedPersonAssessment.

export function loadTrustedPersons() {
  try { return JSON.parse(localStorage.getItem(TRUSTED_PERSONS_KEY) || "[]"); } catch { return []; }
}

export function loadInviteSentStatus() {
  try {
    const raw = localStorage.getItem("cf-gifts-invite-sent");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
