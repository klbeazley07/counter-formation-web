import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormationProfile } from "../hooks/useFormationProfile";
import { hasMeaningfulActivity } from "./personal/HomeRouter";

const TABS = [
  { key: "home",      label: "Home",        path: "/welcome",                             icon: "home" },
  { key: "formation", label: "Formation",   path: "/welcome#architecture",                 icon: "formation" },
  { key: "identity",  label: "Rule of Life", path: "/welcome#rule",                         icon: "identity" },
  { key: "gear",      label: "Gear",        path: "/welcome#shop",                         icon: "gear" },
  { key: "more",      label: "More",        path: null,                                   icon: "more" },
];

// Homepage section ID → tab key mapping (for scroll detection)
const HOME_SECTION_TABS = {
  "top":          "home",
  "architecture": "formation",
  "rule":         "identity",
  "field-guide":  "identity",
  "gear-bridge":  "gear",
  "shop":         "gear",
};

// Sub-page route prefix → tab key mapping
function getRouteTab(pathname) {
  if (pathname === "/" || pathname === "/welcome") return "home";
  if (pathname.startsWith("/identity"))        return "formation";
  if (pathname.startsWith("/practice"))        return "formation";
  if (pathname.startsWith("/community"))       return "formation";
  if (pathname.startsWith("/rule-of-life"))    return "identity";
  if (pathname.startsWith("/field-guide"))     return "more";
  if (pathname.startsWith("/7-day-challenge")) return "more";
  if (pathname.startsWith("/about"))           return "more";
  return null;
}

function TabIcon({ name, active }) {
  const color = active ? "var(--cf-gold)" : "rgba(250,248,245,0.35)";
  const sw = 1.5;
  switch (name) {
    case "home":
      return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
    case "formation":
      return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>);
    case "identity":
      return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
    case "gear":
      return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
    case "more":
      return (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
    default: return null;
  }
}

export function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useFormationProfile();
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [forcedActive, setForcedActive] = useState(null);
  const [scrollTab, setScrollTab] = useState("home");

  const isHomepage = location.pathname === "/";
  const userHasActivity = hasMeaningfulActivity(profile);
  const isWelcomePath = location.pathname === "/welcome";

  // Drag-to-close state
  const touchStartY = useRef(0);
  const [dragY, setDragY] = useState(0);

  // Active tab resolution:
  // 1. forcedActive (set briefly when tapping external links)
  // 2. sub-page route mapping
  // 3. homepage scroll detection
  const routeTab = getRouteTab(location.pathname);
  const activeTab = forcedActive ?? routeTab ?? (isHomepage ? scrollTab : "home");

  // Tab bar visibility — hidden on homepage until past the hero
  useEffect(() => {
    if (!isHomepage) {
      setVisible(true);
      return;
    }
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomepage]);

  // Close "More" sheet and clear forced state on route change
  useEffect(() => { setMoreOpen(false); setForcedActive(null); }, [location.pathname]);

  // Homepage scroll detection — watch all main sections and highlight the most-visible tab
  useEffect(() => {
    if (!isHomepage) return;

    const ratios = {};
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { ratios[e.target.id] = e.intersectionRatio; });
        let bestTab = "home", bestRatio = -1;
        Object.entries(HOME_SECTION_TABS).forEach(([id, tab]) => {
          if ((ratios[id] ?? 0) > bestRatio) {
            bestRatio = ratios[id] ?? 0;
            bestTab = tab;
          }
        });
        setScrollTab(bestTab);
      },
      { threshold: [0, 0.05, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );

    Object.keys(HOME_SECTION_TABS).forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => obs.disconnect();
  }, [isHomepage]);

  const handleTabTap = (tab) => {
    if (tab.key === "more") {
      setMoreOpen(v => !v);
      return;
    }
    setMoreOpen(false);

    // Home navigates to the welcome/hero page
    if (tab.key === "home") {
      navigate("/welcome");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // External URL — open in new tab
    if (tab.path.startsWith("http")) {
      setForcedActive(tab.key);
      window.location.href = tab.path;
      return;
    }

    if (tab.path.includes("#")) {
      const id = tab.path.split("#")[1];
      navigate(tab.path);
      const doScroll = () => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === "rule") {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          const carousel = el.querySelector(".rhythm-carousel");
          if (carousel) carousel.scrollTo({ left: 0, behavior: "instant" });
          return;
        }
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      };
      const targetPath = tab.path.split("#")[0];
      if (location.pathname === targetPath) {
        doScroll();
      } else {
        setTimeout(doScroll, 300);
      }
    } else {
      navigate(tab.path);
    }
  };

  // Swipe-to-close handlers
  const handleSheetTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    setDragY(0);
  };

  const handleSheetTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      e.stopPropagation();
      setDragY(delta);
    }
  };

  const handleSheetTouchEnd = () => {
    if (dragY > 72) {
      setMoreOpen(false);
    }
    setDragY(0);
  };

  // Lock body scroll when More sheet is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [moreOpen]);

  return (
    <>
      {/* Tab Bar */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 90,
          backgroundColor: "rgba(6,5,10,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          height: "64px",
        }}>
          {TABS.map(tab => {
            const isActive = tab.key === activeTab || (tab.key === "more" && moreOpen);
            return (
              <button
                key={tab.key}
                onClick={() => handleTabTap(tab)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0",
                  flex: "1",
                  height: "64px",
                  transition: "all 0.2s",
                }}
                aria-label={tab.label}
                aria-expanded={tab.key === "more" ? moreOpen : undefined}
              >
                <TabIcon name={tab.icon} active={isActive} />
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isActive ? "var(--cf-gold)" : "rgba(250,248,245,0.38)",
                  fontWeight: isActive ? 700 : 400,
                  transition: "color 0.2s",
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* "More" Bottom Sheet */}
      {moreOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden"
            onClick={() => setMoreOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 88,
              background: "rgba(0,0,0,0.5)",
              animation: "moreBackdropIn 0.2s ease forwards",
            }}
          />
          {/* Sheet */}
          <div
            className="md:hidden"
            onTouchStart={handleSheetTouchStart}
            onTouchMove={handleSheetTouchMove}
            onTouchEnd={handleSheetTouchEnd}
            style={{
              position: "fixed",
              bottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
              left: 0,
              right: 0,
              zIndex: 89,
              background: "#111",
              borderTop: `1px solid #C9A84C22`,
              borderRadius: "20px 20px 0 0",
              padding: "16px 20px 20px",
              animation: dragY === 0 ? "moreSheetUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards" : "none",
              transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
              transition: dragY === 0 ? "transform 0.3s ease" : "none",
            }}
          >
            {/* Drag handle */}
            <div style={{ width: 32, height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 2, margin: "0 auto 20px" }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Link
                to="/7-day-challenge"
                onClick={() => setMoreOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 16px", borderRadius: "12px",
                  background: location.pathname.startsWith("/7-day-challenge") ? `#C9A84C12` : "transparent",
                  border: `1px solid ${location.pathname.startsWith("/7-day-challenge") ? "#C9A84C33" : "rgba(255,255,255,0.05)"}`,
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={location.pathname.startsWith("/7-day-challenge") ? "var(--cf-gold)" : "rgba(250,248,245,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: location.pathname.startsWith("/7-day-challenge") ? "var(--cf-ivory)" : "rgba(250,248,245,0.5)", margin: 0 }}>
                    7-Day Challenge
                  </p>
                  <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "12px", color: "rgba(250,248,245,0.25)", margin: "2px 0 0" }}>
                    Start your formation journey
                  </p>
                </div>
              </Link>

              <Link
                to="/field-guide/scripture-before-scroll"
                onClick={() => setMoreOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 16px", borderRadius: "12px",
                  background: location.pathname.startsWith("/field-guide") ? `#C9A84C12` : "transparent",
                  border: `1px solid ${location.pathname.startsWith("/field-guide") ? "#C9A84C33" : "rgba(255,255,255,0.05)"}`,
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={location.pathname.startsWith("/field-guide") ? "var(--cf-gold)" : "rgba(250,248,245,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: location.pathname.startsWith("/field-guide") ? "var(--cf-ivory)" : "rgba(250,248,245,0.5)", margin: 0 }}>
                    Field Guide
                  </p>
                  <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "12px", color: "rgba(250,248,245,0.25)", margin: "2px 0 0" }}>
                    Scripture before scroll
                  </p>
                </div>
              </Link>

              {userHasActivity && (
                <Link
                  to={isWelcomePath ? "/" : "/welcome"}
                  onClick={() => setMoreOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "14px 16px", borderRadius: "12px",
                    background: "transparent",
                    border: `1px solid rgba(255,255,255,0.05)`,
                    textDecoration: "none",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={"var(--cf-gold)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {isWelcomePath ? (
                      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    ) : (
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7v6 M9 10h6"/>
                    )}
                  </svg>
                  <div>
                    <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(250,248,245,0.5)", margin: 0 }}>
                      {isWelcomePath ? "Your Formation" : "Welcome"}
                    </p>
                    <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "12px", color: "rgba(250,248,245,0.25)", margin: "2px 0 0" }}>
                      {isWelcomePath ? "Return to your dashboard" : "View the Counter Formation home"}
                    </p>
                  </div>
                </Link>
              )}

            </div>
          </div>
        </>
      )}

      {/* Animations */}
      <style>{`
        @keyframes moreBackdropIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes moreSheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </>
  );
}
