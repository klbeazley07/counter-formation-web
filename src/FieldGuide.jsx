import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, ChevronLeft, ExternalLink, Home, Share2 } from "lucide-react";

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";
const MAIN_URL = "https://counterformed.com";
const BASE = "/field-guide/scripture-before-scroll";
const STORAGE_KEY = "cf-scripture-before-scroll-progress";

const C = {
  bg: "#06050A",
  bgSoft: "#0B0910",
  bgSurf: "#100D12",
  bgCard: "#15120E",
  bgCard2: "#1B1712",
  gold: "#C9A84C",
  goldBright: "#E4C978",
  goldDim: "rgba(201,168,76,0.12)",
  goldMid: "rgba(201,168,76,0.32)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.64)",
  dim: "rgba(250,248,245,0.32)",
  line: "rgba(255,255,255,0.07)",
  lineStrong: "rgba(255,255,255,0.11)",
};

export const OFFICES = [
  {
    day: 1,
    title: "Awareness",
    micro: "Notice what has been shaping you first.",
    stillness: "Before you read, pause. Notice the pull. Your hand already wants your phone. That impulse is the data. Sit with it for thirty seconds.",
    ref: "Psalm 5:3",
    scripture: "In the morning, Lord, you hear my voice; in the morning I lay my requests before you and wait expectantly.",
    reflection: "What was the first thing you reached for this morning — and what were you hoping it would give you?",
    action: "Before you open any app today, read one chapter of scripture. Set a physical Bible beside your bed tonight so it is the first object you see tomorrow.",
    closing: "Lord, train my first attention toward you.",
  },
  {
    day: 2,
    title: "Resistance",
    micro: "Expect friction. Return anyway.",
    stillness: "You will feel resistance to this practice. That is not a sign it is failing. It is a sign it is working. The soul fights formation before it welcomes it.",
    ref: "Romans 7:18–19",
    scripture: "For I know that good itself does not dwell in me, that is, in my sinful nature. For I have the desire to do what is good, but I cannot carry it out.",
    reflection: "Where do you feel the most resistance to this practice — and what does that resistance tell you about what has been forming you?",
    action: "When you feel the pull to scroll today, name it out loud: 'That is a craving.' Do not shame it. Just name it. Do this every time.",
    closing: "I acknowledge the war inside me. I choose, again, to yield to you.",
  },
  {
    day: 3,
    title: "Attention",
    micro: "Give your attention deliberately.",
    stillness: "Attention is not neutral. It is a resource. Every system around you is designed to extract it. Today you practice giving it deliberately.",
    ref: "Proverbs 4:23",
    scripture: "Above all else, guard your heart, for everything you do flows from it.",
    reflection: "What has been receiving most of your attention this week — and is that what you actually want to be formed by?",
    action: "For the next 24 hours, track every time you pick up your phone unconsciously. No judgment. Just count. Write the number down tonight.",
    closing: "What I behold, I become. Let me behold you.",
  },
  {
    day: 4,
    title: "Discipline",
    micro: "Structure makes freedom possible.",
    stillness: "Discipline is not punishment. It is the structure that makes freedom possible. An undisciplined musician cannot play freely. An undisciplined soul cannot love freely.",
    ref: "1 Corinthians 9:27",
    scripture: "No, I strike a blow to my body and make it my slave so that after I have preached to others, I myself will not be disqualified for the prize.",
    reflection: "What does a disciplined morning look like for you — and what would have to be true for you to build it this week?",
    action: "Design your morning sequence in writing. Three steps. Scripture first. Post it somewhere visible.",
    closing: "Make me a disciplined person — not for performance, but for presence.",
  },
  {
    day: 5,
    title: "Surrender",
    micro: "Release what is shaping you away from Christ.",
    stillness: "You cannot control your formation. You can only choose your inputs. Today is not about trying harder. It is about letting go of the inputs that are forming you away from Christ.",
    ref: "Matthew 16:24",
    scripture: "Whoever wants to be my disciple must deny themselves and take up their cross and follow me.",
    reflection: "What would you have to surrender to make this practice consistent — and are you willing?",
    action: "Delete one app from your phone today. Not permanently if that feels too large. For 48 hours. Notice what you feel.",
    closing: "I release what I have been holding onto. Take what you want of me.",
  },
  {
    day: 6,
    title: "Consistency",
    micro: "The goal is return, not intensity.",
    stillness: "One day of practice changes nothing. One thousand days of practice changes everything. The goal is not intensity. The goal is return.",
    ref: "Luke 9:23",
    scripture: "Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.",
    reflection: "What makes consistency hard for you — and what one environmental change could make it easier?",
    action: "Tell one person what you are practicing and why. Accountability is not weakness. It is wisdom.",
    closing: "Not a moment of fire. A life of faithfulness. Make me that.",
  },
  {
    day: 7,
    title: "Identity",
    micro: "This is not self-improvement. This is homecoming.",
    stillness: "You are not trying to become someone new. You are returning to who you already are — made in the image of Christ, formed for obedience, built for presence. This is not self-improvement. This is homecoming.",
    ref: "2 Corinthians 3:18",
    scripture: "And we all, who with unveiled faces contemplate the Lord's glory, are being transformed into his image with ever-increasing glory, which comes from the Lord, who is the Spirit.",
    reflection: "Who are you becoming through what you have been practicing — and who do you want to be in one year if you kept going?",
    action: "Write a one-sentence identity statement. Begin with: 'I am a person who...' Post it where you will see it every morning.",
    closing: "I am not who the algorithm says I am. I am who you say I am. Form me.",
  },
];

const WHY = [
  {
    title: "The Problem",
    body: "You are being formed right now. Every notification, every feed, every optimized scroll is shaping your desires, shortening your attention, and training you to reach for stimulation before silence. This is not merely a technology problem. It is a formation problem.",
  },
  {
    title: "Formation & Attention",
    body: "Attention is the currency of the soul. What receives your first attention begins to frame what you love, fear, and pursue. A rule of life exists because unstructured attention is never really unclaimed; something else will always take it.",
  },
  {
    title: "Scripture First",
    body: "Scripture before scroll is not a productivity hack. It is a reordering of desire. When truth enters first, it establishes a center. When noise enters first, you spend the rest of the day trying to recover one.",
  },
  {
    title: "Habit & Environment",
    body: "Habits are built through triggers, routines, and rewards. The phone is already built to win this battle. Counter Formation answers with a better loop: a physical reminder, a structured office, and a return path that can slowly become a way of life.",
  },
  {
    title: "Rule of Life",
    body: "This rhythm is one practice inside a larger framework of presence, prayer, sabbath, discipline, and community. The goal is not one good morning. The goal is a different kind of person.",
  },
];

const NEW_SECTIONS = [
  {
    title: "What is Counter Formation?",
    body: "Counter Formation is a movement for people who want to be formed by Christ in a world designed to form them otherwise. It begins with garments and symbols, but it is not primarily about apparel. The real product is a way of life.",
  },
  {
    title: "What is Formation?",
    body: "Formation is the slow process by which your habits, attention, desires, and loves are trained over time. The question is never whether you are being formed. You are. The question is by what.",
  },
  {
    title: "Why Apparel Connects",
    body: "The garment is a physical reminder in a world of invisible pressures. The QR code turns that reminder into a practice. Instead of sending you deeper into distraction, it redirects you into discipline.",
  },
  {
    title: "What is the Field Guide?",
    body: "The Field Guide is a growing archive of rhythm-based practices, offices, teaching, and formation experiences linked to apparel themes. Scripture Before Scroll is the first rhythm now live.",
  },
];

const FG_CSS = `
  .fg-shell {
    min-height: 100vh;
    position: relative;
    background:
      radial-gradient(ellipse at top, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 28%, transparent 60%),
      linear-gradient(180deg, #06050A 0%, #08070C 34%, #06050A 100%);
    color: ${C.ivory};
    overflow: hidden;
  }
  .fg-shell::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
    background-size: 220px 220px;
  }
  .fg-shell::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, transparent calc(50% - 0.5px), rgba(201,168,76,0.07) 50%, transparent calc(50% + 0.5px));
    mask-image: linear-gradient(to bottom, transparent, black 10%, black 88%, transparent);
    opacity: 0.45;
  }
  .fg-page {
    position: relative;
    z-index: 2;
    width: min(1120px, calc(100% - 32px));
    margin: 0 auto;
    padding: 0 0 88px;
  }
  .fg-read {
    width: min(640px, 100%);
  }
  .fg-hero-block {
    padding-top: 72px;
    padding-bottom: 44px;
  }
  .fg-fade-up { animation: fgFadeUp 0.72s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-1 { animation: fgFadeUp 0.72s 0.08s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-2 { animation: fgFadeUp 0.72s 0.16s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-3 { animation: fgFadeUp 0.72s 0.24s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-4 { animation: fgFadeUp 0.72s 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-5 { animation: fgFadeUp 0.72s 0.40s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes fgFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fg-reveal {
    opacity: 0;
    transform: translateY(22px);
    transition: opacity 0.7s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  .fg-reveal.fg-visible {
    opacity: 1;
    transform: translateY(0);
  }
  .fg-btn-prim,
  .fg-btn-sec,
  .fg-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 999px;
    text-decoration: none;
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    transition: all 0.24s ease;
    cursor: pointer;
  }
  .fg-btn-prim {
    width: 100%;
    border: none;
    background: linear-gradient(180deg, ${C.goldBright} 0%, ${C.gold} 100%);
    color: #070707;
    padding: 16px 28px;
    font-size: 13px;
    font-weight: 800;
    box-shadow: 0 18px 45px rgba(201,168,76,0.18);
  }
  .fg-btn-prim:hover { transform: translateY(-1px); filter: brightness(1.06); }
  .fg-btn-sec {
    width: 100%;
    border: 1px solid rgba(255,255,255,0.10);
    background: rgba(255,255,255,0.02);
    color: rgba(250,248,245,0.76);
    padding: 15px 26px;
    font-size: 12px;
    font-weight: 700;
  }
  .fg-btn-sec:hover {
    border-color: rgba(201,168,76,0.36);
    color: ${C.gold};
    background: rgba(201,168,76,0.06);
    transform: translateY(-1px);
  }
  .fg-btn-ghost {
    width: 100%;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: rgba(250,248,245,0.55);
    padding: 13px 20px;
    font-size: 11px;
    font-weight: 700;
  }
  .fg-btn-ghost:hover {
    color: ${C.ivory};
    border-color: rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.03);
  }
  .fg-panel {
    position: relative;
    overflow: hidden;
    border: 1px solid ${C.line};
    background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
    border-radius: 28px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .fg-panel::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.42), transparent);
  }
  .fg-hero-panel {
    padding: 36px 28px 28px;
    background:
      radial-gradient(circle at 50% 0%, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.03) 24%, transparent 60%),
      linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015));
  }
  .fg-hero-mark {
    position: absolute;
    right: -24px;
    top: -16px;
    width: 220px;
    height: 220px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(201,168,76,0.20) 0%, rgba(201,168,76,0.04) 38%, transparent 70%);
    filter: blur(18px);
    pointer-events: none;
  }
  .fg-grid-2 {
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.72fr);
  }
  .fg-stack { display: flex; flex-direction: column; gap: 18px; }
  .fg-mini-card {
    border: 1px solid ${C.line};
    background: rgba(255,255,255,0.02);
    border-radius: 20px;
    padding: 18px;
  }
  .fg-gold-line {
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.9), transparent);
  }
  .fg-kicker {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: ${C.gold};
  }
  .fg-heading {
    margin: 0;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    line-height: 0.92;
    color: ${C.ivory};
  }
  .fg-section-card {
    padding: 24px 22px;
  }
  .fg-scripture-card {
    position: relative;
    overflow: hidden;
    padding: 26px 24px 24px;
    border-left: 2px solid ${C.gold};
    border-radius: 0 24px 24px 0;
    background: linear-gradient(180deg, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
  }
  .fg-scripture-card::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at top right, rgba(201,168,76,0.10), transparent 35%);
  }
  .fg-action-card {
    padding: 24px 22px;
    background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  }
  .fg-return-card {
    padding: 22px;
  }
  .fg-path-card {
    width: 100%;
    text-align: left;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 16px;
    padding: 18px 18px;
    border-radius: 20px;
    border: 1px solid ${C.line};
    background: rgba(255,255,255,0.02);
    transition: all 0.24s ease;
    cursor: pointer;
  }
  .fg-path-card:hover {
    transform: translateX(4px);
    border-color: rgba(201,168,76,0.28);
    background: rgba(255,255,255,0.03);
  }
  .fg-day-badge {
    width: 42px;
    height: 42px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(201,168,76,0.24);
    background: rgba(201,168,76,0.08);
    color: ${C.gold};
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 800;
    font-size: 14px;
  }
  .fg-day-badge.is-complete {
    background: rgba(201,168,76,0.16);
    border-color: rgba(201,168,76,0.45);
    color: ${C.goldBright};
  }
  .fg-nav {
    position: sticky;
    top: 0;
    z-index: 60;
    transition: all 0.32s ease;
  }
  .fg-nav-inner {
    width: min(1120px, calc(100% - 20px));
    margin: 14px auto 0;
    padding: 14px 18px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid transparent;
  }
  .fg-nav.is-scrolled .fg-nav-inner {
    backdrop-filter: blur(16px);
    background: rgba(6,5,10,0.78);
    border-color: rgba(255,255,255,0.08);
    box-shadow: 0 12px 36px rgba(0,0,0,0.22);
  }
  .fg-nav-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: rgba(250,248,245,0.42);
    text-decoration: none;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
  }
  .fg-nav-link:hover { color: ${C.gold}; }
  .fg-brand-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    padding: 8px 14px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.02);
    transition: all 0.24s ease;
  }
  .fg-brand-btn:hover {
    border-color: rgba(201,168,76,0.30);
    background: rgba(201,168,76,0.06);
  }
  .fg-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border-radius: 999px;
    background: ${C.goldDim};
    color: ${C.gold};
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
  }
  @media (max-width: 900px) {
    .fg-grid-2 { grid-template-columns: 1fr; }
    .fg-hero-panel { padding: 30px 22px 24px; }
  }
  @media (max-width: 720px) {
    .fg-page { width: min(100%, calc(100% - 20px)); padding-bottom: 72px; }
    .fg-read { width: 100%; }
    .fg-hero-block { padding-top: 52px; padding-bottom: 34px; }
    .fg-nav-inner { width: calc(100% - 12px); padding: 12px 14px; }
    .fg-hero-mark { width: 160px; height: 160px; right: -38px; top: -32px; }
  }
`;

function useScrollReveal(ref) {
  useEffect(() => {
    if (!ref.current) return undefined;
    const els = ref.current.querySelectorAll(".fg-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fg-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

function useCompletedDays() {
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setCompleted(parsed);
    } catch {
      // ignore storage failures
    }
  }, []);

  const markComplete = (day) => {
    setCompleted((prev) => {
      if (prev.includes(day)) return prev;
      const next = [...prev, day].sort((a, b) => a - b);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore storage failures
      }
      return next;
    });
  };

  return { completed, markComplete };
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function FGLabel({ children, color = C.gold, style = {} }) {
  return (
    <div
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: 11,
        letterSpacing: "0.42em",
        textTransform: "uppercase",
        color,
        fontWeight: 700,
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function FGHeading({ children, size = 72, style = {} }) {
  return (
    <h1 className="fg-heading" style={{ fontSize: size, ...style }}>
      {children}
    </h1>
  );
}

function GoldDivider({ mt = 32, mb = 32 }) {
  return <div className="fg-gold-line" style={{ margin: `${mt}px 0 ${mb}px` }} />;
}

function BrandLockup() {
  return (
    <div className="fg-brand-btn">
      <img
        src="/helmet.png"
        alt="Counter Formation"
        style={{ width: 24, height: 24, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.92 }}
      />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.ivory,
          }}
        >
          Counter
        </span>
        <span
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          Formation
        </span>
      </div>
    </div>
  );
}

function FGNav({ showBack }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fg-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="fg-nav-inner">
        <button onClick={() => navigate(BASE)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <BrandLockup />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {showBack ? (
            <button onClick={() => navigate(-1)} className="fg-nav-link">
              <ChevronLeft size={14} /> Back
            </button>
          ) : null}
          <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" className="fg-nav-link">
            Main Site <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <div style={{ marginTop: 58, borderTop: `1px solid ${C.line}`, paddingTop: 38, paddingBottom: 24 }}>
      <div className="fg-grid-2" style={{ alignItems: "start" }}>
        <div className="fg-stack">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BrandLockup />
          </div>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
            A disciplined life in the way of Christ, built one repeated rhythm at a time.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="fg-btn-sec">
            Shop the Gear
          </a>
          <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" className="fg-btn-ghost">
            Explore Main Site
          </a>
        </div>
      </div>
      <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(250,248,245,0.18)" }}>
          Ephesians 6:10–18
        </span>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: "rgba(250,248,245,0.18)" }}>
          Discipline · Presence · Formation
        </span>
      </div>
    </div>
  );
}

function HeroLinks() {
  return (
    <div style={{ display: "grid", gap: 10, maxWidth: 360 }}>
      <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
      <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
      <Link className="fg-btn-sec" to={`${BASE}/new`}>New Here?</Link>
    </div>
  );
}

function ReturnModule({ onSaveHome, onShare }) {
  return (
    <div className="fg-panel fg-return-card fg-reveal">
      <div className="fg-pill" style={{ marginBottom: 16 }}>Return Tomorrow</div>
      <h3 className="fg-heading" style={{ fontSize: 28, marginBottom: 12 }}>Make This Your First Click</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
        Return here tomorrow. Consistency matters more than intensity. Use the garment, the scan, and this page to build a new reflex.
      </p>
      <div style={{ display: "grid", gap: 10, marginTop: 20 }}>
        <button className="fg-btn-sec" onClick={onSaveHome}>
          <Home size={15} /> Save to Home Screen
        </button>
        <button className="fg-btn-ghost" onClick={onShare}>
          <Share2 size={15} /> Share This Rhythm
        </button>
      </div>
    </div>
  );
}

function useShareHelpers(day, title) {
  const saveToHome = () => {
    const isiPhone = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const msg = isiPhone
      ? "On iPhone: tap Share in Safari, then choose 'Add to Home Screen.'"
      : "On Android/Chrome: open the browser menu, then choose 'Add to Home screen' or 'Install app.'";
    window.alert(msg);
  };

  const shareRhythm = async () => {
    const text = day
      ? `Scripture Before Scroll — Day ${day}: ${title}`
      : "Scripture Before Scroll — Counter Formation";
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text: "Discipline before distraction.", url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      window.alert("Link copied. Post it to Stories or send it to someone walking the same rhythm.");
    } catch {
      window.alert(url);
    }
  };

  return { saveToHome, shareRhythm };
}

export function FGLanding() {
  useEffect(() => { scrollTop(); }, []);

  return (
    <div className="fg-shell">
      <FGNav showBack={false} />
      <div className="fg-page">
        <div className="fg-grid-2 fg-hero-block" style={{ alignItems: "start" }}>
          <div className="fg-read">
            <div className="fg-fade-up"><FGLabel>Field Guide · Scripture Before Scroll</FGLabel></div>
            <FGHeading style={{ marginBottom: 20 }}>
              <span className="fg-fade-up-1">Scripture</span><br />
              <span className="fg-fade-up-2" style={{ color: C.gold }}>Before</span><br />
              <span className="fg-fade-up-3">Scroll</span>
            </FGHeading>
            <p className="fg-fade-up-4" style={{ fontSize: 15, lineHeight: 1.9, color: C.muted, maxWidth: 520, marginBottom: 28 }}>
              Before the feed, before the noise, before the algorithm gets your first attention—begin here. This office is built to redirect the start of your day toward truth.
            </p>
            <div className="fg-fade-up-5" style={{ maxWidth: 380 }}>
              <Link className="fg-btn-prim" to={`${BASE}/today`}>
                Begin Today’s Office <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="fg-stack fg-fade-up-5">
            <div className="fg-panel fg-hero-panel">
              <div className="fg-hero-mark" />
              <div className="fg-pill" style={{ marginBottom: 18 }}>Rhythm 01</div>
              <h3 className="fg-heading" style={{ fontSize: 34, marginBottom: 12 }}>A Daily Interrupt</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
                Scan the garment. Enter the office. Return tomorrow. The point is not more content. The point is a repeated practice that begins to change your mornings.
              </p>
              <GoldDivider mt={22} mb={18} />
              <div style={{ display: "grid", gap: 14 }}>
                {[
                  "Stillness before stimulation",
                  "Scripture before distraction",
                  "Action before drift",
                ].map((line) => (
                  <div key={line} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: C.gold }} />
                    <span style={{ fontSize: 13, color: C.ivory, letterSpacing: "0.03em" }}>{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <HeroLinks />
          </div>
        </div>

        <div className="fg-reveal fg-panel" style={{ padding: 24, marginTop: 10 }}>
          <div className="fg-grid-2" style={{ alignItems: "center" }}>
            <div>
              <FGLabel style={{ marginBottom: 8 }}>Built For Repeat Use</FGLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.85, color: C.muted, maxWidth: 560 }}>
                Use the QR code like a daily doorway. Come back fast. Come back often. Over time, the scan itself becomes part of the habit.
              </p>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <Link className="fg-btn-sec" to={`${BASE}/today`}>Open Today’s Office</Link>
              <Link className="fg-btn-ghost" to={`${BASE}/new`}>Understand the System</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FGOffice() {
  const { day } = useParams();
  const navigate = useNavigate();
  const revealRef = useRef(null);
  useScrollReveal(revealRef);
  const { completed, markComplete } = useCompletedDays();

  useEffect(() => { scrollTop(); }, [day]);

  const dayNum = useMemo(() => {
    const parsed = Number.parseInt(day ?? "1", 10);
    return Number.isNaN(parsed) ? 1 : parsed;
  }, [day]);

  const office = OFFICES.find((entry) => entry.day === dayNum) || OFFICES[0];
  const next = OFFICES.find((entry) => entry.day === office.day + 1);
  const isComplete = completed.includes(office.day);
  const { saveToHome, shareRhythm } = useShareHelpers(office.day, office.title);

  return (
    <div className="fg-shell">
      <FGNav showBack />
      <div className="fg-page" ref={revealRef}>
        <div className="fg-grid-2 fg-hero-block" style={{ alignItems: "start" }}>
          <div className="fg-read">
            <div className="fg-fade-up"><FGLabel>Scripture Before Scroll · Day {office.day}</FGLabel></div>
            <FGHeading style={{ marginBottom: 14 }}>
              <span className="fg-fade-up-1">{office.title}</span>
            </FGHeading>
            <p className="fg-fade-up-2" style={{ margin: 0, maxWidth: 520, fontSize: 15, lineHeight: 1.85, color: C.muted }}>
              {office.micro}
            </p>
          </div>

          <div className="fg-stack fg-fade-up-3">
            <div className="fg-panel fg-mini-card">
              <FGLabel style={{ marginBottom: 8 }}>Progress</FGLabel>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {office.day} / 7
                </span>
                <span className="fg-pill">{isComplete ? "Completed" : "In Process"}</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ width: `${(office.day / 7) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.gold}, ${C.goldBright})` }} />
              </div>
            </div>

            <div className="fg-panel fg-mini-card">
              <FGLabel style={{ marginBottom: 8 }}>Move Through It</FGLabel>
              <div style={{ display: "grid", gap: 10 }}>
                <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
                <Link className="fg-btn-ghost" to={`${BASE}/why`}>Why This Matters</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="fg-grid-2" style={{ alignItems: "start" }}>
          <div className="fg-read fg-stack">
            <div className="fg-panel fg-section-card fg-reveal">
              <FGLabel>Stillness</FGLabel>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.9, color: C.muted }}>{office.stillness}</p>
            </div>

            <div className="fg-reveal">
              <FGLabel>Scripture · {office.ref}</FGLabel>
              <div className="fg-scripture-card">
                <p style={{ margin: 0, fontSize: 18, lineHeight: 1.9, color: C.ivory, fontStyle: "italic" }}>
                  “{office.scripture}”
                </p>
                <div style={{ marginTop: 16, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold }}>
                  {office.ref}
                </div>
              </div>
            </div>

            <div className="fg-panel fg-section-card fg-reveal">
              <FGLabel>Reflection</FGLabel>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.9, color: C.muted }}>{office.reflection}</p>
            </div>

            <div className="fg-panel fg-action-card fg-reveal">
              <FGLabel>Action</FGLabel>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.9, color: C.ivory }}>{office.action}</p>
            </div>

            <div className="fg-panel fg-section-card fg-reveal">
              <FGLabel>Closing</FGLabel>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.9, color: C.ivory, fontStyle: "italic" }}>{office.closing}</p>
            </div>
          </div>

          <div className="fg-stack">
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>Complete Today</FGLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
                Mark this office complete once you’ve actually practiced it—not just read it.
              </p>
              <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
                <button className="fg-btn-prim" onClick={() => markComplete(office.day)}>
                  <Check size={16} /> {isComplete ? "Marked Complete" : "Mark Today Complete"}
                </button>
                {next ? (
                  <button className="fg-btn-sec" onClick={() => navigate(`${BASE}/day-${next.day}`)}>
                    Day {next.day}: {next.title}
                  </button>
                ) : (
                  <button className="fg-btn-sec" onClick={() => navigate(`${BASE}/path`)}>
                    View Full Path
                  </button>
                )}
              </div>
            </div>

            <ReturnModule onSaveHome={saveToHome} onShare={shareRhythm} />
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

export function FGPath() {
  const navigate = useNavigate();
  const revealRef = useRef(null);
  useScrollReveal(revealRef);
  const { completed } = useCompletedDays();

  useEffect(() => { scrollTop(); }, []);

  return (
    <div className="fg-shell">
      <FGNav showBack />
      <div className="fg-page" ref={revealRef}>
        <div className="fg-grid-2 fg-hero-block" style={{ alignItems: "start" }}>
          <div className="fg-read">
            <div className="fg-fade-up"><FGLabel>Scripture Before Scroll</FGLabel></div>
            <FGHeading style={{ marginBottom: 14 }}>
              <span className="fg-fade-up-1">7-Day</span><br />
              <span className="fg-fade-up-2">Path</span>
            </FGHeading>
            <p className="fg-fade-up-3" style={{ margin: 0, maxWidth: 520, fontSize: 15, lineHeight: 1.9, color: C.muted }}>
              Start anywhere, but keep moving. Each office is short enough to return to quickly and strong enough to begin changing the architecture of your morning.
            </p>
          </div>
          <div className="fg-stack fg-fade-up-4">
            <div className="fg-panel fg-mini-card">
              <FGLabel style={{ marginBottom: 8 }}>Overview</FGLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
                Flexible by design. Structured enough to show progression. Repeat any day as often as you need.
              </p>
            </div>
            <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today’s Office</Link>
          </div>
        </div>

        <div className="fg-grid-2" style={{ alignItems: "start" }}>
          <div className="fg-read fg-stack fg-reveal">
            {OFFICES.map((office) => {
              const done = completed.includes(office.day);
              return (
                <button key={office.day} className="fg-path-card" onClick={() => navigate(`${BASE}/day-${office.day}`)}>
                  <span className={`fg-day-badge ${done ? "is-complete" : ""}`}>{done ? <Check size={15} /> : office.day}</span>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ivory, marginBottom: 4 }}>
                      {office.title}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.7, color: C.muted }}>{office.micro}</div>
                  </div>
                  <div style={{ color: C.gold }}><ArrowRight size={15} /></div>
                </button>
              );
            })}
          </div>

          <div className="fg-stack">
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>What Completion Means</FGLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
                Completion is not reading the page. Completion means you actually practiced the office and carried the action into your day.
              </p>
            </div>
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>Need Context?</FGLabel>
              <div style={{ display: "grid", gap: 10 }}>
                <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
                <Link className="fg-btn-ghost" to={`${BASE}/new`}>New Here?</Link>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

export function FGWhy() {
  const revealRef = useRef(null);
  useScrollReveal(revealRef);
  useEffect(() => { scrollTop(); }, []);

  return (
    <div className="fg-shell">
      <FGNav showBack />
      <div className="fg-page" ref={revealRef}>
        <div className="fg-grid-2 fg-hero-block" style={{ alignItems: "start" }}>
          <div className="fg-read">
            <div className="fg-fade-up"><FGLabel>The Foundation</FGLabel></div>
            <FGHeading style={{ marginBottom: 14 }}>
              <span className="fg-fade-up-1">Why This</span><br />
              <span className="fg-fade-up-2">Matters</span>
            </FGHeading>
            <p className="fg-fade-up-3" style={{ margin: 0, maxWidth: 520, fontSize: 15, lineHeight: 1.9, color: C.muted }}>
              Formation is not accidental. It is inevitable. The phone already comes with a rule of life built into it. This rhythm is a deliberate counter-pattern.
            </p>
          </div>
          <div className="fg-stack fg-fade-up-4">
            <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today’s Office</Link>
            <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
          </div>
        </div>

        <div className="fg-grid-2" style={{ alignItems: "start" }}>
          <div className="fg-read fg-stack">
            {WHY.map((sec) => (
              <div key={sec.title} className="fg-panel fg-section-card fg-reveal">
                <FGLabel>{sec.title}</FGLabel>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.9, color: C.muted }}>{sec.body}</p>
              </div>
            ))}
          </div>

          <div className="fg-stack">
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>Core Idea</FGLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
                The aim is not merely less scrolling. The aim is a person whose first attention belongs to God rather than the machine.
              </p>
            </div>
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>Go Deeper</FGLabel>
              <div style={{ display: "grid", gap: 10 }}>
                <Link className="fg-btn-sec" to={`${BASE}/today`}>Start the Practice</Link>
                <Link className="fg-btn-ghost" to={`${BASE}/new`}>Understand Counter Formation</Link>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

export function FGNewHere() {
  const revealRef = useRef(null);
  useScrollReveal(revealRef);
  useEffect(() => { scrollTop(); }, []);

  return (
    <div className="fg-shell">
      <FGNav showBack />
      <div className="fg-page" ref={revealRef}>
        <div className="fg-grid-2 fg-hero-block" style={{ alignItems: "start" }}>
          <div className="fg-read">
            <div className="fg-fade-up"><FGLabel>Orientation</FGLabel></div>
            <FGHeading style={{ marginBottom: 14 }}>
              <span className="fg-fade-up-1">New</span><br />
              <span className="fg-fade-up-2">Here?</span>
            </FGHeading>
            <p className="fg-fade-up-3" style={{ margin: 0, maxWidth: 520, fontSize: 15, lineHeight: 1.9, color: C.muted }}>
              Start here. This is the doorway into the system: a brand, a rule of life, and a growing set of practices designed to interrupt the default patterns forming us every day.
            </p>
          </div>
          <div className="fg-stack fg-fade-up-4">
            <Link className="fg-btn-prim" to={`${BASE}/today`}>Start Today’s Office</Link>
            <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
          </div>
        </div>

        <div className="fg-grid-2" style={{ alignItems: "start" }}>
          <div className="fg-read fg-stack">
            {NEW_SECTIONS.map((sec) => (
              <div key={sec.title} className="fg-panel fg-section-card fg-reveal">
                <FGLabel>{sec.title}</FGLabel>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.9, color: C.muted }}>{sec.body}</p>
              </div>
            ))}
          </div>

          <div className="fg-stack">
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>What To Do Next</FGLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: C.muted }}>
                The best way to understand Counter Formation is not by reading more about it. It is by entering the practice and returning tomorrow.
              </p>
            </div>
            <div className="fg-panel fg-mini-card fg-reveal">
              <FGLabel style={{ marginBottom: 8 }}>Next Steps</FGLabel>
              <div style={{ display: "grid", gap: 10 }}>
                <Link className="fg-btn-sec" to={`${BASE}/today`}>Begin Today’s Office</Link>
                <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
                <a className="fg-btn-ghost" href={MAIN_URL} target="_blank" rel="noopener noreferrer">Explore Main Site</a>
              </div>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

export function FieldGuideStyles() {
  return <style>{FG_CSS}</style>;
}
