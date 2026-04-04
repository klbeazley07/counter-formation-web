import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const C = {
  bg: "rgba(6,5,10,0.88)",
  gold: "#C9A84C",
  ivory: "#FAF8F5",
};

function getNavConfig(pathname) {
  if (pathname.startsWith("/identity")) {
    return {
      context: "identity",
      links: [
        { label: "Identity", href: "/identity" },
        { label: "Formation", href: "/#architecture" },
        { label: "Rule of Life", href: "/#rule" },
      ],
    };
  }
  if (pathname.startsWith("/rule-of-life")) {
    return {
      context: "rule",
      links: [
        { label: "Rule of Life", href: "/#rule" },
        { label: "Formation", href: "/#architecture" },
      ],
    };
  }
  if (pathname.startsWith("/7-day-challenge")) {
    return {
      context: "challenge",
      links: [
        { label: "7-Day Challenge", href: "/7-day-challenge" },
        { label: "Formation", href: "/#architecture" },
      ],
    };
  }
  if (pathname.startsWith("/field-guide")) {
    return {
      context: "field-guide",
      links: [
        { label: "Field Guide", href: "/field-guide/scripture-before-scroll" },
        { label: "Formation", href: "/#architecture" },
      ],
    };
  }
  if (pathname.startsWith("/practice") || pathname.startsWith("/community")) {
    return {
      context: "pillar",
      links: [
        { label: "Formation", href: "/#architecture" },
        { label: "Rule of Life", href: "/#rule" },
      ],
    };
  }
  return {
    context: "home",
    links: [
      { label: "Formation", href: "/#architecture" },
      { label: "Rule of Life", href: "/#rule" },
    ],
  };
}

export function SiteNav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const config = getNavConfig(location.pathname);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Piece pages: BackNav inside Identity.jsx handles top nav
  const isPiecePage = /^\/identity\/[a-z]/.test(location.pathname) && location.pathname !== "/identity";
  if (isPiecePage) return null;

  return (
    <>
      {/* Floating pill nav */}
      <nav
        className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-4 py-3 md:px-5 md:py-4 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center justify-between"
        style={{ backgroundColor: C.bg }}
      >
        <Link to="/" className="flex items-center gap-2 md:gap-3" style={{ textDecoration: "none" }}>
          <img
            src="/helmet.png"
            alt="Counter Formation"
            className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
            onError={e => { e.target.style.display = "none"; }}
          />
          <span
            className="text-[11px] md:text-sm tracking-[0.2em] md:tracking-[0.28em] uppercase whitespace-nowrap"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: C.ivory }}
          >
            Counter Formation
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop links */}
          <div className="hidden md:flex gap-8 mr-4 text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
            {config.links.map(l => {
              const isHash = l.href.includes("#");
              const isActive = !isHash && location.pathname === l.href;
              const El = isHash ? "a" : Link;
              const props = isHash ? { href: l.href } : { to: l.href };
              return (
                <El
                  key={l.label}
                  {...props}
                  className="transition-colors py-2"
                  style={{
                    color: isActive ? C.gold : C.ivory,
                    textDecoration: "none",
                    minHeight: "44px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  {l.label}
                </El>
              );
            })}
          </div>

          {/* Shop CTA — desktop only */}
          <a
            href="/#shop"
            className="px-5 py-2 rounded-full border transition-all text-[9px] md:text-[10px] hidden md:block uppercase tracking-widest font-bold"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              borderColor: `${C.gold}66`,
              color: C.gold,
              textDecoration: "none",
            }}
          >
            Shop the Gear
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden p-1"
            style={{ color: C.ivory }}
            aria-label="Toggle menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-[120] flex flex-col items-center justify-center overflow-y-auto transition-transform duration-500 md:hidden ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}
        style={{ backgroundColor: "#06050A" }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6"
          style={{ color: C.ivory }}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center gap-8 py-16">
          <Link to="/" onClick={() => setMenuOpen(false)}
            className="font-brand text-2xl uppercase tracking-widest transition-colors"
            style={{ color: location.pathname === "/" ? C.gold : C.ivory, textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/identity" onClick={() => setMenuOpen(false)}
            className="font-brand text-2xl uppercase tracking-widest transition-colors"
            style={{ color: location.pathname.startsWith("/identity") ? C.gold : C.ivory, textDecoration: "none" }}>
            Identity
          </Link>
          <a href="/#rule" onClick={() => setMenuOpen(false)}
            className="font-brand text-2xl uppercase tracking-widest"
            style={{ color: C.ivory, textDecoration: "none" }}>
            Rule of Life
          </a>
          <a href="/#architecture" onClick={() => setMenuOpen(false)}
            className="font-brand text-2xl uppercase tracking-widest"
            style={{ color: C.ivory, textDecoration: "none" }}>
            Formation
          </a>

          <div className="h-[1px] w-16 mx-auto" style={{ background: "rgba(255,255,255,0.08)" }} />

          <Link to="/7-day-challenge" onClick={() => setMenuOpen(false)}
            className="font-brand text-lg uppercase tracking-widest transition-colors"
            style={{ color: location.pathname.startsWith("/7-day-challenge") ? C.gold : "rgba(250,248,245,0.5)", textDecoration: "none" }}>
            7-Day Challenge
          </Link>
          <Link to="/field-guide/scripture-before-scroll" onClick={() => setMenuOpen(false)}
            className="font-brand text-lg uppercase tracking-widest transition-colors"
            style={{ color: location.pathname.startsWith("/field-guide") ? C.gold : "rgba(250,248,245,0.5)", textDecoration: "none" }}>
            Field Guide
          </Link>

          <div className="h-[1px] w-16 mx-auto" style={{ background: "rgba(255,255,255,0.08)" }} />

          <a href="/#shop" onClick={() => setMenuOpen(false)}
            className="px-8 py-3 rounded-full border uppercase tracking-widest font-bold text-sm"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", borderColor: `${C.gold}66`, color: C.gold, textDecoration: "none" }}>
            Shop the Gear
          </a>

          {/* Armor pieces — shown on identity routes */}
          {location.pathname.startsWith("/identity") && (
            <div className="flex flex-col items-center gap-3 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: `${C.gold}55` }}>
                The Six Pieces
              </span>
              {["belt-of-truth", "breastplate-of-righteousness", "gospel-of-peace", "shield-of-faith", "helmet-of-salvation", "sword-of-the-spirit"].map(slug => {
                const titles = {
                  "belt-of-truth": "Belt of Truth",
                  "breastplate-of-righteousness": "Breastplate",
                  "gospel-of-peace": "Gospel of Peace",
                  "shield-of-faith": "Shield of Faith",
                  "helmet-of-salvation": "Helmet of Salvation",
                  "sword-of-the-spirit": "Sword of the Spirit",
                };
                return (
                  <Link key={slug} to={`/identity/${slug}`} onClick={() => setMenuOpen(false)}
                    className="text-sm uppercase tracking-widest"
                    style={{ color: location.pathname === `/identity/${slug}` ? C.gold : "rgba(250,248,245,0.35)", textDecoration: "none" }}>
                    {titles[slug]}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
