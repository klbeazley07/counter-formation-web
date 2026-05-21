import "./styles/identity.css";
import { useEffect, useState } from "react";
import HeroSection          from "./components/identity/HeroSection";
import ArmorIntroSection    from "./components/identity/ArmorIntroSection";
import GodsArmorSection     from "./components/identity/GodsArmorSection";
import ArmorRingSection     from "./components/identity/ArmorRingSection";
import WhyItMattersSection  from "./components/identity/WhyItMattersSection";
export { ArmorPiecePage }   from "./components/identity/PiecePage";

const LANDING_SECTIONS = [
  { id: "hero",       label: "The Identity Pillar" },
  { id: "scripture",  label: "Ephesians 6" },
  { id: "revelation", label: "God's Own Armor" },
  { id: "six-pieces", label: "The Six Pieces" },
  { id: "why",        label: "The Closing" },
];

function SectionProgressNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [visible, setVisible] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    if (!heroEl) return;
    const heroObs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    heroObs.observe(heroEl);

    const ratios = {};
    const sectionObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { ratios[e.target.id] = e.intersectionRatio; });
        let best = null, bestRatio = -1;
        LANDING_SECTIONS.forEach(({ id }) => {
          if ((ratios[id] ?? 0) > bestRatio) {
            bestRatio = ratios[id] ?? 0;
            best = id;
          }
        });
        if (best) setActiveSection(best);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );
    LANDING_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });

    return () => { heroObs.disconnect(); sectionObs.disconnect(); };
  }, []);

  const activeIdx = LANDING_SECTIONS.findIndex(s => s.id === activeSection);

  return (
    <>
      {/* Desktop: vertical dot rail */}
      <div
        style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: visible ? "auto" : "none",
        }}
        className="hidden md:flex"
      >
        {LANDING_SECTIONS.map(({ id, label }) => {
          const isActive = id === activeSection;
          return (
            <div
              key={id}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip */}
              <div style={{
                position: "absolute",
                right: "18px",
                whiteSpace: "nowrap",
                background: "rgba(6,5,10,0.9)",
                border: "1px solid rgba(201,168,76,0.2)",
                borderRadius: "999px",
                padding: "4px 12px",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#FAF8F5",
                opacity: hoveredId === id ? 1 : 0,
                transform: hoveredId === id ? "translateX(0)" : "translateX(4px)",
                transition: "opacity 0.2s ease, transform 0.2s ease",
                pointerEvents: "none",
              }}>
                {label}
              </div>
              {/* Dot */}
              <button
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  width: isActive ? "8px" : "6px",
                  height: isActive ? "8px" : "6px",
                  borderRadius: "50%",
                  background: isActive ? "#C9A84C" : "rgba(250,248,245,0.15)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transform: isActive ? "scale(1.3)" : "scale(1)",
                  boxShadow: isActive ? "0 0 8px rgba(201,168,76,0.5)" : "none",
                  transition: "all 0.3s ease",
                }}
                aria-label={`Scroll to ${label}`}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile: segmented progress bar at bottom */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          height: "3px",
          display: "flex",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s ease",
          pointerEvents: "none",
        }}
      >
        {LANDING_SECTIONS.map(({ id }, i) => (
          <div
            key={id}
            style={{
              flex: 1,
              background: i <= activeIdx ? "#C9A84C" : "rgba(255,255,255,0.08)",
              borderRight: i < LANDING_SECTIONS.length - 1 ? "1px solid rgba(6,5,10,0.5)" : "none",
              transition: "background 0.4s ease",
            }}
          />
        ))}
      </div>
    </>
  );
}

export function IdentityLanding() {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);
  return (
    <div className="text-[#FAF8F5] overflow-x-hidden" style={{ backgroundColor: "var(--cf-hero-bg)" }}>
      <SectionProgressNav />
      <HeroSection />
      <ArmorIntroSection />
      <GodsArmorSection />
      <ArmorRingSection />
      <WhyItMattersSection />
    </div>
  );
}
