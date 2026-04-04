import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const C = { gold: "#C9A84C", ivory: "#FAF8F5" };

const TABS = [
  { key: "home",      label: "Home",       path: "/",          icon: "home" },
  { key: "formation", label: "Formation",   path: "https://counterformed.com/#architecture", icon: "formation" },
  { key: "identity",  label: "Rule of Life", path: "/#rule",    icon: "identity" },
  { key: "gear",      label: "Gear",        path: "/#shop",     icon: "gear" },
  { key: "more",      label: "More",        path: null,         icon: "more" },
];

// Simple inline SVG icons — 20x20, stroke-based, matching the brand
function TabIcon({ name, active }) {
  const color = active ? C.gold : "rgba(250,248,245,0.35)";
  const sw = 1.5;
  switch (name) {
    case "home":
      return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
    case "formation":
      return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88"/></svg>);
    case "identity":
      return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
    case "gear":
      return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);
    case "more":
      return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
    default: return null;
  }
}

function getActiveTab(pathname, hash) {
  if (pathname === "/" && hash === "#shop") return "gear";
  if (pathname === "/" && hash === "#rule") return "identity";
  if (pathname === "/") return "home";
  if (pathname.startsWith("/identity")) return "identity";
  if (pathname.startsWith("/rule-of-life")) return "identity";
  if (pathname.startsWith("/7-day-challenge")) return "more";
  if (pathname.startsWith("/field-guide")) return "more";
  return "home";
}

export function MobileTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const activeTab = getActiveTab(location.pathname, location.hash);

  // Drag-to-close state
  const touchStartY = useRef(0);
  const [dragY, setDragY] = useState(0);

  // Show tab bar after initial scroll
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.3);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close "More" sheet on route change
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

  // Always show on sub-pages (not homepage)
  useEffect(() => {
    if (location.pathname !== "/") setVisible(true);
  }, [location.pathname]);

  // Lock body scroll when sheet is open
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

  const handleTabTap = (tab) => {
    if (tab.key === "more") {
      setMoreOpen(v => !v);
      return;
    }
    setMoreOpen(false);

    // Home always scrolls to top
    if (tab.key === "home") {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Absolute external URL
    if (tab.path.startsWith("http")) {
      window.location.href = tab.path;
      return;
    }

    if (tab.path.includes("#")) {
      const id = tab.path.split("#")[1];
      // Navigate to update the URL hash (so active state works)
      navigate(tab.path);
      // Then scroll to the element
      const doScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      };
      if (location.pathname !== "/") {
        setTimeout(doScroll, 150);
      } else {
        doScroll();
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

  return (
    <>
      {/* Tab Bar */}
      <nav
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
          height: "56px",
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
                  gap: "3px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px 12px",
                  minWidth: "56px",
                  transition: "all 0.2s",
                }}
                aria-label={tab.label}
              >
                <TabIcon name={tab.icon} active={isActive} />
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: isActive ? C.gold : "rgba(250,248,245,0.3)",
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
              bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
              left: 0,
              right: 0,
              zIndex: 89,
              background: "#111",
              borderTop: `1px solid ${C.gold}22`,
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
                  background: location.pathname.startsWith("/7-day-challenge") ? `${C.gold}12` : "transparent",
                  border: `1px solid ${location.pathname.startsWith("/7-day-challenge") ? C.gold + "33" : "rgba(255,255,255,0.05)"}`,
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={location.pathname.startsWith("/7-day-challenge") ? C.gold : "rgba(250,248,245,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: location.pathname.startsWith("/7-day-challenge") ? C.ivory : "rgba(250,248,245,0.5)", margin: 0 }}>
                    7-Day Challenge
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "12px", color: "rgba(250,248,245,0.25)", margin: "2px 0 0" }}>
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
                  background: location.pathname.startsWith("/field-guide") ? `${C.gold}12` : "transparent",
                  border: `1px solid ${location.pathname.startsWith("/field-guide") ? C.gold + "33" : "rgba(255,255,255,0.05)"}`,
                  textDecoration: "none",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={location.pathname.startsWith("/field-guide") ? C.gold : "rgba(250,248,245,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                <div>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: location.pathname.startsWith("/field-guide") ? C.ivory : "rgba(250,248,245,0.5)", margin: 0 }}>
                    Field Guide
                  </p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "12px", color: "rgba(250,248,245,0.25)", margin: "2px 0 0" }}>
                    Scripture before scroll
                  </p>
                </div>
              </Link>
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
