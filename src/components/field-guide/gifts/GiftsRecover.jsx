// Data recovery tool for the Spiritual Gifts Assessment.
// Handles two modes:
//   Export -- reads localStorage on this device and generates a shareable URL
//   Import -- decodes the URL payload and merges data into localStorage
//
// Route: /field-guide/gifts/recover
// Route: /field-guide/gifts/recover?import=<base64payload>

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  loadProgress,
  STORAGE_KEY,
  TOTAL_QUESTIONS,
} from "../../../utils/giftsAssessmentStorage";

const TRUSTED_RESPONSES_KEY = "cf-gifts-trusted-responses";

const C = {
  bg: "#06050A",
  bgCard: "#0E0C0A",
  bgCardSoft: "#110F0D",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.30)",
  goldFaint: "rgba(201,168,76,0.10)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.62)",
  dim: "rgba(250,248,245,0.34)",
  border: "rgba(255,255,255,0.07)",
  green: "rgba(100,200,120,0.85)",
  greenFaint: "rgba(100,200,120,0.10)",
  red: "rgba(220,80,80,0.85)",
};

/* ─── ENCODE / DECODE ─────────────────────────────────────────────── */

function encode(obj) {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  } catch {
    return null;
  }
}

function decode(str) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(str))));
  } catch {
    return null;
  }
}

/* ─── COPY TO CLIPBOARD ───────────────────────────────────────────── */

function useCopy() {
  const [copied, setCopied] = useState(false);
  function copy(text) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }
  return { copied, copy };
}

/* ─── SHARED PRIMITIVES ───────────────────────────────────────────── */

function Eyebrow({ children }) {
  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 11,
      letterSpacing: "0.36em",
      textTransform: "uppercase",
      color: C.gold,
      marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function StatusBadge({ ok, children }) {
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 14px",
      background: ok ? C.greenFaint : "rgba(220,80,80,0.08)",
      border: `1px solid ${ok ? "rgba(100,200,120,0.25)" : "rgba(220,80,80,0.25)"}`,
      marginBottom: 16,
    }}>
      <span style={{ fontSize: 14 }}>{ok ? "✓" : "✗"}</span>
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 12,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: ok ? C.green : C.red,
      }}>
        {children}
      </span>
    </div>
  );
}

function CopyButton({ url, label }) {
  const { copied, copy } = useCopy();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        background: C.bgCardSoft,
        border: `1px solid ${C.border}`,
        padding: "12px 16px",
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        color: C.dim,
        wordBreak: "break-all",
        lineHeight: 1.5,
        maxHeight: 80,
        overflow: "hidden",
      }}>
        {url}
      </div>
      <button
        onClick={() => copy(url)}
        style={{
          background: copied ? "rgba(100,200,120,0.12)" : "transparent",
          border: `1px solid ${copied ? "rgba(100,200,120,0.4)" : C.goldDim}`,
          color: copied ? C.green : C.gold,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          padding: "11px 20px",
          cursor: "pointer",
          transition: "all 220ms ease",
          alignSelf: "flex-start",
        }}
      >
        {copied ? "Copied" : label || "Copy link"}
      </button>
    </div>
  );
}

/* ─── EXPORT MODE ─────────────────────────────────────────────────── */

function ExportMode() {
  const [selfProgress, setSelfProgress] = useState(undefined); // undefined = loading
  const [trustedData, setTrustedData] = useState(undefined);
  const [selfUrl, setSelfUrl] = useState(null);
  const [trustedUrl, setTrustedUrl] = useState(null);

  useEffect(() => {
    const p = loadProgress();
    setSelfProgress(p);

    try {
      const raw = localStorage.getItem(TRUSTED_RESPONSES_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      setTrustedData(parsed && Object.keys(parsed).length > 0 ? parsed : null);
    } catch {
      setTrustedData(null);
    }
  }, []);

  const selfComplete = selfProgress?.completedAt || selfProgress?.qIdx >= TOTAL_QUESTIONS;
  const selfPartial = selfProgress && !selfComplete && selfProgress.qIdx > 0;
  const selfFound = selfComplete || selfPartial;
  const trustedFound = !!trustedData;

  function buildSelfUrl() {
    const payload = encode({
      type: "self-assessment",
      data: selfProgress,
      exportedAt: new Date().toISOString(),
      v: 1,
    });
    setSelfUrl(`${window.location.origin}/field-guide/gifts/recover?import=${payload}`);
  }

  function buildTrustedUrl() {
    const payload = encode({
      type: "trusted-responses",
      data: trustedData,
      exportedAt: new Date().toISOString(),
      v: 1,
    });
    setTrustedUrl(`${window.location.origin}/field-guide/gifts/recover?import=${payload}`);
  }

  const [showDiag, setShowDiag] = useState(false);
  const [diagKeys, setDiagKeys] = useState([]);

  function runDiag() {
    const entries = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        entries.push({ key: k, size: v ? v.length : 0 });
      }
    } catch { /* ignore */ }
    setDiagKeys(entries);
    setShowDiag(true);
  }

  if (selfProgress === undefined) return null;

  return (
    <div style={{ maxWidth: 680, width: "100%" }}>
      <Eyebrow>Data Recovery</Eyebrow>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "clamp(32px, 5vw, 50px)",
        lineHeight: 1.1,
        margin: "0 0 16px",
        color: C.ivory,
        fontWeight: 400,
      }}>
        Recover your assessment data
      </h1>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15,
        lineHeight: 1.8,
        color: C.muted,
        margin: "0 0 48px",
      }}>
        This page reads what is stored on this device and generates a recovery
        link you can send to yourself or to Luke. Opening the recovery link on
        another device imports the data there.
      </p>

      {/* Self-assessment section */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        padding: "32px 36px",
        marginBottom: 20,
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: 14,
        }}>
          Full Assessment (72 questions)
        </div>

        {selfFound ? (
          <>
            <StatusBadge ok>
              {selfComplete
                ? "Completed assessment found"
                : `In-progress assessment found (question ${selfProgress.qIdx} of ${TOTAL_QUESTIONS})`}
            </StatusBadge>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.75,
              color: C.muted,
              margin: "0 0 20px",
            }}>
              {selfComplete
                ? "Your completed assessment is on this device. Generate a recovery link to import it elsewhere, or go to your results now."
                : "An in-progress assessment was found. Generate a recovery link to continue on another device."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: selfUrl ? 20 : 0 }}>
              {selfComplete && (
                <Link
                  to="/field-guide/gifts/results"
                  style={{
                    display: "inline-block",
                    background: C.gold,
                    color: C.bg,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    padding: "11px 20px",
                  }}
                >
                  View my results →
                </Link>
              )}
              <button
                onClick={buildSelfUrl}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.goldDim}`,
                  color: C.gold,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "11px 20px",
                  cursor: "pointer",
                }}
              >
                Generate recovery link
              </button>
            </div>
            {selfUrl && <CopyButton url={selfUrl} label="Copy recovery link" />}
          </>
        ) : (
          <>
            <StatusBadge ok={false}>No assessment data on this device</StatusBadge>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.75,
              color: C.muted,
              margin: 0,
            }}>
              This device does not have a saved assessment. Check the device and
              browser where you originally took the assessment, open this page
              there, and generate a recovery link to import here.
            </p>
          </>
        )}
      </div>

      {/* Trusted-person responses section */}
      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.border}`,
        padding: "32px 36px",
        marginBottom: 40,
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: 14,
        }}>
          Observer Responses (17 questions)
        </div>

        {trustedFound ? (
          <>
            <StatusBadge ok>
              {Object.keys(trustedData).length} observer response
              {Object.keys(trustedData).length !== 1 ? "s" : ""} found on this device
            </StatusBadge>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.75,
              color: C.muted,
              margin: "0 0 20px",
            }}>
              Your observer responses are saved here. Generate a recovery link
              and send it to Luke so he can import your responses into his results.
            </p>
            <div style={{ marginBottom: trustedUrl ? 20 : 0 }}>
              <button
                onClick={buildTrustedUrl}
                style={{
                  background: "transparent",
                  border: `1px solid ${C.goldDim}`,
                  color: C.gold,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  padding: "11px 20px",
                  cursor: "pointer",
                }}
              >
                Generate recovery link
              </button>
            </div>
            {trustedUrl && <CopyButton url={trustedUrl} label="Copy recovery link" />}
          </>
        ) : (
          <>
            <StatusBadge ok={false}>No observer responses on this device</StatusBadge>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              lineHeight: 1.75,
              color: C.muted,
              margin: 0,
            }}>
              This device did not complete an observer assessment, or the data
              was cleared. If you completed an observer assessment, open this
              page on the device and browser where you took it.
            </p>
          </>
        )}
      </div>

      {/* Diagnostic panel */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={runDiag}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.dim,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            letterSpacing: "0.08em",
            padding: "9px 16px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Diagnose: show all data stored on this device
        </button>
        {showDiag && (
          <div style={{
            background: C.bgCardSoft,
            border: `1px solid ${C.border}`,
            padding: "20px 24px",
            marginTop: 8,
          }}>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 12,
            }}>
              All localStorage keys on this device ({diagKeys.length} total)
            </div>
            {diagKeys.length === 0 ? (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.dim, margin: 0 }}>
                localStorage is empty -- no data at all on this device.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {diagKeys.map(({ key, size }) => (
                  <div key={key} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 12,
                      color: key.startsWith("cf-") ? C.ivory : C.dim,
                      fontWeight: key.startsWith("cf-") ? 600 : 400,
                      wordBreak: "break-all",
                      flex: 1,
                    }}>
                      {key}
                    </span>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 11,
                      color: C.dim,
                      flexShrink: 0,
                    }}>
                      {size.toLocaleString()} chars
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              color: C.dim,
              margin: "16px 0 0",
              lineHeight: 1.6,
            }}>
              If you see no "cf-" keys, the data is not on this device or browser.
              Try opening this page in the same browser (and profile) where you
              originally took the assessment.
            </p>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          to="/field-guide/gifts"
          style={{
            color: C.dim,
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            letterSpacing: "0.04em",
            textDecoration: "none",
          }}
        >
          ← Back to the assessment
        </Link>
      </div>
    </div>
  );
}

/* ─── IMPORT MODE ─────────────────────────────────────────────────── */

function ImportMode({ rawParam }) {
  const [status, setStatus] = useState("preview"); // preview | done | error
  const [payload, setPayload] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const decoded = decode(rawParam);
    if (!decoded || !decoded.type || !decoded.data) {
      setStatus("error");
    } else {
      setPayload(decoded);
    }
  }, [rawParam]);

  function doImport() {
    try {
      const { type, data } = payload;

      if (type === "self-assessment") {
        // Repair missing completedAt if all questions were answered
        const repaired = { ...data };
        if (!repaired.completedAt && repaired.qIdx >= TOTAL_QUESTIONS) {
          repaired.completedAt = repaired.lastUpdatedAt || new Date().toISOString();
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(repaired));
        setSummary({
          type: "self",
          complete: !!repaired.completedAt,
          qIdx: repaired.qIdx,
        });
      } else if (type === "trusted-responses") {
        // Merge with whatever is already on this device
        let existing = {};
        try {
          existing = JSON.parse(localStorage.getItem(TRUSTED_RESPONSES_KEY) || "{}");
        } catch { /* ignore */ }
        const merged = { ...existing, ...data };
        localStorage.setItem(TRUSTED_RESPONSES_KEY, JSON.stringify(merged));
        setSummary({
          type: "trusted",
          imported: Object.keys(data).length,
          total: Object.keys(merged).length,
        });
      } else {
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "error") {
    return (
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <Eyebrow>Recovery</Eyebrow>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "clamp(28px, 4vw, 42px)",
          color: C.ivory,
          margin: "0 0 20px",
          fontWeight: 400,
        }}>
          This recovery link is not valid
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: C.muted,
          margin: "0 0 32px",
        }}>
          The link may have been truncated or corrupted. Ask the person who sent
          it to generate a new recovery link from the recovery page.
        </p>
        <Link
          to="/field-guide/gifts/recover"
          style={{
            display: "inline-block",
            background: "transparent",
            border: `1px solid ${C.goldDim}`,
            color: C.gold,
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            textDecoration: "none",
            padding: "11px 20px",
          }}
        >
          Go to the recovery page
        </Link>
      </div>
    );
  }

  if (status === "done") {
    const isSelf = summary?.type === "self";
    return (
      <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
        <Eyebrow>Recovery</Eyebrow>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: "clamp(28px, 4vw, 42px)",
          color: C.ivory,
          margin: "0 0 20px",
          fontWeight: 400,
        }}>
          {isSelf ? "Assessment restored" : "Observer responses imported"}
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15,
          lineHeight: 1.8,
          color: C.muted,
          margin: "0 0 32px",
        }}>
          {isSelf
            ? summary.complete
              ? "Your completed assessment has been restored to this device. You can now view your results."
              : `Your in-progress assessment (question ${summary.qIdx} of ${TOTAL_QUESTIONS}) has been restored. You can resume from where you left off.`
            : `${summary.imported} observer response${summary.imported !== 1 ? "s" : ""} imported successfully. Your results now include this input.`}
        </p>
        {isSelf ? (
          <Link
            to={summary.complete ? "/field-guide/gifts/results" : "/field-guide/gifts/take"}
            style={{
              display: "inline-block",
              background: C.gold,
              color: C.bg,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "13px 28px",
            }}
          >
            {summary.complete ? "View my results →" : "Resume the assessment →"}
          </Link>
        ) : (
          <Link
            to="/field-guide/gifts/results"
            style={{
              display: "inline-block",
              background: C.gold,
              color: C.bg,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
              padding: "13px 28px",
            }}
          >
            View updated results →
          </Link>
        )}
      </div>
    );
  }

  // Preview mode -- show what will be imported, ask for confirmation
  if (!payload) return null;

  const isSelf = payload.type === "self-assessment";
  const selfData = isSelf ? payload.data : null;
  const trustedData = !isSelf ? payload.data : null;
  const exportedAt = payload.exportedAt
    ? new Date(payload.exportedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div style={{ maxWidth: 600, width: "100%" }}>
      <Eyebrow>Recovery Import</Eyebrow>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: "italic",
        fontSize: "clamp(28px, 4vw, 42px)",
        color: C.ivory,
        margin: "0 0 20px",
        fontWeight: 400,
        lineHeight: 1.15,
      }}>
        {isSelf ? "Import your assessment data" : "Import observer responses"}
      </h1>

      <div style={{
        background: C.bgCard,
        border: `1px solid ${C.goldDim}`,
        padding: "28px 32px",
        marginBottom: 28,
      }}>
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 11,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: C.gold,
          marginBottom: 16,
        }}>
          What will be imported
        </div>

        {isSelf && selfData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DataRow
              label="Type"
              value={selfData.completedAt || selfData.qIdx >= TOTAL_QUESTIONS
                ? "Completed self-assessment"
                : `In-progress self-assessment (question ${selfData.qIdx} of ${TOTAL_QUESTIONS})`}
            />
            {exportedAt && <DataRow label="Exported from" value={exportedAt} />}
          </div>
        )}

        {!isSelf && trustedData && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DataRow
              label="Type"
              value={`Observer responses (${Object.keys(trustedData).length} person${Object.keys(trustedData).length !== 1 ? "s" : ""})`}
            />
            {exportedAt && <DataRow label="Exported from" value={exportedAt} />}
          </div>
        )}
      </div>

      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        lineHeight: 1.75,
        color: C.muted,
        margin: "0 0 24px",
      }}>
        {isSelf
          ? "This will restore the assessment data to this device. Any existing assessment data on this device will be replaced."
          : "Observer responses will be merged with any responses already on this device. Nothing will be overwritten."}
      </p>

      <button
        onClick={doImport}
        style={{
          background: C.gold,
          color: C.bg,
          border: "none",
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 12,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          padding: "13px 28px",
          cursor: "pointer",
        }}
      >
        {isSelf ? "Restore assessment" : "Import responses"}
      </button>
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
      <span style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 11,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: C.dim,
        flexShrink: 0,
        minWidth: 100,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        color: C.muted,
      }}>
        {value}
      </span>
    </div>
  );
}

/* ─── ROOT COMPONENT ──────────────────────────────────────────────── */

export default function GiftsRecover() {
  const [searchParams] = useSearchParams();
  const importParam = searchParams.get("import");

  return (
    <main style={{
      background: C.bg,
      color: C.ivory,
      minHeight: "100vh",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "100px 24px 80px",
    }}>
      <style>{`
        @keyframes cf-recover-fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ width: "100%", maxWidth: 680, animation: "cf-recover-fade 500ms ease-out both" }}>
        {importParam
          ? <ImportMode rawParam={importParam} />
          : <ExportMode />}
      </div>
    </main>
  );
}
