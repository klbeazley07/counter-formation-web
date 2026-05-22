import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import { hasMeaningfulActivity } from "./personal/HomeRouter";

function getNavConfig(pathname) {
  if (pathname.startsWith("/identity")) {
    return {
      context: "identity",
      links: [
        { label: "Identity", href: "/identity" },
        { label: "Field Guide", href: "/field-guide" },
        { label: "Rule of Life", href: "/rule-of-life" },
      ],
    };
  }
  if (pathname.startsWith("/rule-of-life")) {
    return {
      context: "rule",
      links: [
        { label: "Rule of Life", href: "/rule-of-life" },
        { label: "Field Guide", href: "/field-guide" },
      ],
    };
  }
  if (pathname.startsWith("/7-day-challenge")) {
    return {
      context: "challenge",
      links: [
        { label: "7-Day Challenge", href: "/7-day-challenge" },
        { label: "Field Guide", href: "/field-guide" },
      ],
    };
  }
  if (pathname.startsWith("/field-guide")) {
    return {
      context: "field-guide",
      links: [
        { label: "Field Guide", href: "/field-guide/scripture-before-scroll" },
        { label: "Identity", href: "/identity" },
      ],
    };
  }
  if (pathname.startsWith("/about")) {
    return {
      context: "about",
      links: [
        { label: "About", href: "/about" },
        { label: "Field Guide", href: "/field-guide" },
      ],
    };
  }
  if (pathname.startsWith("/practice") || pathname.startsWith("/community")) {
    return {
      context: "pillar",
      links: [
        { label: "Field Guide", href: "/field-guide" },
        { label: "Rule of Life", href: "/rule-of-life" },
      ],
    };
  }
  return {
    context: "home",
    links: [
      { label: "Formation", href: "/field-guide" },
      { label: "Rule of Life", href: "/rule-of-life" },
    ],
  };
}

export function SiteNav() {
  const location = useLocation();
  const config = getNavConfig(location.pathname);
  const { profile } = useFormationProfile();

  // Piece pages: BackNav inside Identity.jsx handles top nav
  const isPiecePage = /^\/identity\/[a-z]/.test(location.pathname) && location.pathname !== "/identity";
  if (isPiecePage) return null;

  // Show "Welcome" toggle on the dashboard (path /) when the user has activity.
  // On /welcome we instead surface a "Your formation" link back to the dashboard.
  const userHasActivity = hasMeaningfulActivity(profile);
  const isWelcomePath = location.pathname === "/welcome";
  const isDashboardPath = location.pathname === "/" && userHasActivity;
  const toggleLink = isWelcomePath
    ? { label: "Your formation", href: "/" }
    : isDashboardPath
      ? { label: "Welcome", href: "/welcome" }
      : null;

  const navLinks = config.links;

  return (
    <nav
      aria-label="Main navigation"
      className="hidden md:flex fixed left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-5xl px-5 py-4 backdrop-blur-2xl border border-white/10 rounded-2xl items-center justify-between"
      style={{ backgroundColor: "rgba(6,5,10,0.88)", top: "calc(1.5rem + var(--banner-height, 0px))" }}
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
              const isActive = !isHash && location.pathname === l.href;
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
          <a
            href="https://shop.counterformed.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border transition-all text-[9px] md:text-[10px] hidden md:block uppercase tracking-widest font-bold"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              borderColor: `#C9A84C66`,
              color: "var(--cf-gold)",
              textDecoration: "none",
            }}
          >
            Shop the Gear
          </a>

        </div>
    </nav>
  );
}
