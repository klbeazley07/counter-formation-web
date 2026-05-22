import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import { hasMeaningfulActivity } from "./personal/HomeRouter";

const SECTION_LINKS = [
  { label: "Formation",    href: "/identity",                            activeWhen: "/identity" },
  { label: "Rule of Life", href: "/rule-of-life/presence",               activeWhen: "/rule-of-life" },
  { label: "Field Guide",  href: "/welcome#field-guide", activeWhen: "/field-guide" },
];

function getNavConfig(pathname) {
  if (pathname.startsWith("/identity")) {
    return {
      context: "identity",
      links: [
        { label: "Identity",      href: "/identity",            activeWhen: "/identity" },
        { label: "Rule of Life",  href: "/rule-of-life/presence", activeWhen: "/rule-of-life" },
        { label: "Field Guide",   href: "/welcome#field-guide", activeWhen: "/field-guide" },
      ],
    };
  }
  if (pathname === "/") {
    return {
      context: "home",
      links: [
        { label: "Welcome", href: "/welcome", activeWhen: "/welcome" },
        ...SECTION_LINKS,
      ],
    };
  }
  if (pathname === "/welcome") {
    return { context: "welcome", links: SECTION_LINKS };
  }
  return { context: "sub", links: SECTION_LINKS };
}

export function SiteNav() {
  const location = useLocation();
  const config = getNavConfig(location.pathname);
  const { profile } = useFormationProfile();

  // Piece pages: BackNav inside Identity.jsx handles top nav
  const isPiecePage = /^\/identity\/[a-z]/.test(location.pathname) && location.pathname !== "/identity";
  if (isPiecePage) return null;

  const userHasActivity = hasMeaningfulActivity(profile);
  const isSubPage = location.pathname !== "/" && location.pathname !== "/welcome";
  const toggleLink = isSubPage && userHasActivity
    ? { label: "Return to Your Formation", href: "/" }
    : null;

  const navLinks = config.links;

  return (
    <nav
      aria-label="Main navigation"
      className="hidden md:flex fixed left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-5 py-4 backdrop-blur-2xl border border-white/10 rounded-2xl items-center justify-between"
      style={{ backgroundColor: "rgba(6,5,10,0.88)", top: "calc(1.5rem + var(--banner-height, 0px))" }}
    >
        <Link to="/welcome" className="flex items-center gap-2 md:gap-3" style={{ textDecoration: "none" }}>
          <img
            src="/helmet.png"
            alt="Counter Formation"
            className="w-8 h-8 md:w-10 md:h-10 object-contain flex-shrink-0"
            onError={e => { e.target.style.display = "none"; }}
          />
          <span
            className="text-[11px] md:text-sm tracking-[0.2em] md:tracking-[0.28em] uppercase whitespace-nowrap"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: "var(--cf-ivory)" }}
          >
            Counter Formation
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop links */}
          <div className="hidden md:flex gap-8 mr-4 text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}>
            {toggleLink && (
              <Link
                to={toggleLink.href}
                className="transition-colors py-2"
                style={{
                  color: "var(--cf-gold)",
                  textDecoration: "none",
                  minHeight: "44px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {toggleLink.label}
              </Link>
            )}
            {navLinks.map(l => {
              const isHash = l.href.includes("#");
              const isActive = !isHash && location.pathname.startsWith(l.activeWhen || l.href);
              const El = isHash ? "a" : Link;
              const props = isHash ? { href: l.href } : { to: l.href };
              return (
                <El
                  key={l.label}
                  {...props}
                  aria-current={isActive ? "page" : undefined}
                  className="transition-colors py-2"
                  style={{
                    color: isActive ? "var(--cf-gold)" : "var(--cf-ivory)",
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
          <Link
            to="/welcome#shop"
            className="px-5 py-2 rounded-full border transition-all text-[9px] md:text-[10px] hidden md:block uppercase tracking-widest font-bold"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              borderColor: `#C9A84C66`,
              color: "var(--cf-gold)",
              textDecoration: "none",
            }}
          >
            Shop the Gear
          </Link>

        </div>
    </nav>
  );
}
