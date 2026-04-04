import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SHOPIFY_URL = "https://shop.counterformed.com/collections/armor-of-god-collection";

const C = { darkBg: "#0E0C0A", ivory: "#FAF8F5" };

const CONTEXT_MAP = {
  "/identity":        "Armor of God",
  "/rule-of-life":    "Rule of Life",
  "/7-day-challenge": "7-Day Challenge",
  "/field-guide":     "Scripture Before Scroll",
  "/practice":        "Architecture of the Soul",
  "/community":       "Architecture of the Soul",
};

function FullFooter() {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "join_formation" }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer style={{ backgroundColor: C.darkBg }} className="border-t border-white/[0.06]">
      <div className="footer-reveal max-w-5xl mx-auto pt-24 md:pt-40 pb-16 md:pb-24 px-6 text-center border-b border-white/[0.05]">
        <p className="text-[11px] md:text-[10px] uppercase tracking-[0.5em] text-[#C9A84C]/60 mb-8 font-bold">The Mission</p>
        <h3 className="font-brand text-4xl md:text-6xl lg:text-7xl uppercase tracking-[0.12em] md:tracking-[0.16em] leading-none text-white mb-3">
          Formed in Christ.
        </h3>
        <h3 className="font-brand text-xl md:text-3xl lg:text-4xl uppercase tracking-[0.12em] leading-none text-white/20 mb-10">
          Not drifting.
        </h3>
        <p className="text-[11px] md:text-xs opacity-35 tracking-[0.25em] uppercase max-w-sm mx-auto leading-loose">
          Intentional formation in a world designed for drift.
        </p>
      </div>

      <div className="footer-reveal max-w-2xl mx-auto py-16 px-6 text-center border-b border-white/[0.05]">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-[#C9A84C]/60 font-bold mb-3 block">Stay in the Formation</span>
        <h4 className="font-brand text-xl md:text-2xl uppercase tracking-[0.15em] text-white mb-8">Connect with the Community</h4>
        {!submitted ? (
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                disabled={loading}
                className="flex-1 px-5 py-4 rounded-full text-[11px] text-white placeholder-white/25 focus:outline-none tracking-widest uppercase disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.40)"}
                onBlur={e  => e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)"}
              />
              <button onClick={handleSubmit} disabled={loading}
                className="px-8 py-4 rounded-full text-[12px] uppercase tracking-widest font-bold transition-all whitespace-nowrap border hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] disabled:opacity-50"
                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: C.ivory }}>
                {loading ? "..." : "Join"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-[12px] uppercase tracking-[0.2em] text-red-400">{error}</p>
            )}
          </div>
        ) : (
          <p className="text-[12px] uppercase tracking-[0.35em] text-[#C9A84C]">You're in. Weekly field notes incoming.</p>
        )}
        <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/20">Weekly field notes. No noise.</p>
      </div>

      <div className="footer-reveal max-w-7xl mx-auto py-14 px-6 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-20">
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">The Gear</span>
          <a href="#shop" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Shop All</a>
          <a href={SHOPIFY_URL} className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Men's</a>
          <a href={SHOPIFY_URL} className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Women's</a>
        </div>
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">The Formation</span>
          <a href="#architecture" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Architecture</a>
          <a href="#rule" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Rule of Life</a>
          <Link to="/7-day-challenge" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">7-Day Challenge</Link>
        </div>
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">Field Guide</span>
          <Link to="/field-guide/scripture-before-scroll" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Scripture Before Scroll</Link>
          <Link to="/field-guide/devotion-guide" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Devotion Guide</Link>
        </div>
        <div>
          <span className="text-[11px] tracking-[0.4em] text-[#C9A84C]/50 uppercase font-bold mb-4 block">Connect</span>
          <a href="https://instagram.com/counterformed" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Instagram</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">Contact</a>
          <a href="#" className="text-[12px] text-white/40 hover:text-white/70 transition-colors block py-1">About</a>
        </div>
      </div>

      <div className="footer-reveal border-t border-white/[0.04] pt-6 pb-16 md:pb-8 px-6 flex flex-col items-center gap-3 max-w-7xl mx-auto">
        <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 text-center">Premium men&apos;s and women&apos;s athletic lifestyle apparel for those committed to being formed by Christ, not by the world.</p>
        <div className="flex flex-col md:flex-row items-center justify-between w-full gap-3 mt-2">
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-20">&copy; 2026 Counter Formation</p>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-15">Discipline · Presence · Formation</p>
          <p className="text-[8px] uppercase tracking-[0.3em] opacity-15">Ephesians 6:10–18</p>
        </div>
      </div>
    </footer>
  );
}

function CompactFooter({ context }) {
  return (
    <footer style={{ background: "#06050A", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "28px 1.5rem", textAlign: "center" }}>
      <img
        src="/helmet.png"
        alt=""
        style={{ width: 24, height: 24, opacity: 0.2, filter: "invert(1)", display: "block", margin: "0 auto 0.75rem" }}
        onError={e => { e.target.style.display = "none"; }}
      />
      <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "8px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>
        Counter Formation{context ? ` · ${context}` : ""} · Ephesians 6:10–18 · © 2026
      </p>
    </footer>
  );
}

export function SiteFooter() {
  const location = useLocation();

  if (location.pathname === "/") return <FullFooter />;

  const context = Object.entries(CONTEXT_MAP).find(
    ([prefix]) => location.pathname.startsWith(prefix)
  )?.[1] || "";

  return <CompactFooter context={context} />;
}
