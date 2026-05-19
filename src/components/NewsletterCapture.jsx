import React, { useState, forwardRef } from "react";

const NewsletterCapture = forwardRef(function NewsletterCapture(
  {
    source,
    buttonLabel = "Join",
    successText = "You're in. Formation begins now.",
    buttonStyle = "outline",
    onSuccess,
  },
  ref
) {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-[12px] uppercase tracking-[0.35em]" style={{ color: "#C9A84C" }}>
        {successText}
      </p>
    );
  }

  const filledCls = [
    "flex items-center justify-center gap-2 rounded-full px-8 py-4",
    "text-[12px] font-bold uppercase tracking-widest transition-all disabled:opacity-50",
    "bg-[#C9A84C] text-black hover:bg-[#FAF8F5]",
  ].join(" ");

  const outlineCls = [
    "px-8 py-4 rounded-full text-[12px] uppercase tracking-widest font-bold",
    "transition-all whitespace-nowrap border disabled:opacity-50",
    "hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C]",
  ].join(" ");

  const outlineStyle = buttonStyle === "outline"
    ? { background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: "#FAF8F5" }
    : {};

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          ref={ref}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="your@email.com"
          disabled={loading}
          className="flex-1 px-5 py-4 rounded-full text-[11px] text-white placeholder-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]/40 tracking-widest uppercase disabled:opacity-50"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
          onFocus={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.40)"; }}
          onBlur={e  => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"; }}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={buttonStyle === "filled" ? filledCls : outlineCls}
          style={outlineStyle}
        >
          {loading ? "..." : buttonLabel}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-red-400">{error}</p>
      )}
    </div>
  );
});

export default NewsletterCapture;
