import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";
const MAIN_URL = "https://counterformed.com";
const BASE = "/field-guide/scripture-before-scroll";

const C = {
  bg: "#06050A",
  bgSurf: "#0E0C0A",
  bgCard: "#17140F",
  bgCard2: "#1C1914",
  gold: "#C9A84C",
  goldDim: "rgba(201,168,76,0.12)",
  goldMid: "rgba(201,168,76,0.30)",
  ivory: "#FAF8F5",
  muted: "rgba(250,248,245,0.58)",
  dim: "rgba(250,248,245,0.24)",
  border: "rgba(255,255,255,0.08)",
  shadow: "0 24px 80px rgba(0,0,0,0.34)",
};

/* ─── OFFICE DATA ─────────────────────────────────────────────────── */

export const OFFICES = [
  {
    day: 1, title: "Awareness",
    stillness: "Before you read, pause. Notice the pull. Your hand already wants your phone. That impulse is the data. Sit with it for thirty seconds.",
    ref: "Psalm 5:3",
    scripture: "In the morning, Lord, you hear my voice; in the morning I lay my requests before you and wait expectantly.",
    reflection: "What was the first thing you reached for this morning — and what were you hoping it would give you?",
    action: "Before you open any app today, read one chapter of scripture. Set a physical Bible beside your bed tonight so it is the first object you see tomorrow.",
    closing: "Lord, train my first attention toward you.",
  },
  {
    day: 2, title: "Resistance",
    stillness: "You will feel resistance to this practice. That is not a sign it is failing. It is a sign it is working. The soul fights formation before it welcomes it.",
    ref: "Romans 7:18–19",
    scripture: "For I know that good itself does not dwell in me, that is, in my sinful nature. For I have the desire to do what is good, but I cannot carry it out.",
    reflection: "Where do you feel the most resistance to this practice — and what does that resistance tell you about what has been forming you?",
    action: "When you feel the pull to scroll today, name it out loud: 'That is a craving.' Do not shame it. Just name it. Do this every time.",
    closing: "I acknowledge the war inside me. I choose, again, to yield to you.",
  },
  {
    day: 3, title: "Attention",
    stillness: "Attention is not neutral. It is a resource. Every system around you is designed to extract it. Today you practice giving it deliberately.",
    ref: "Proverbs 4:23",
    scripture: "Above all else, guard your heart, for everything you do flows from it.",
    reflection: "What has been receiving most of your attention this week — and is that what you actually want to be formed by?",
    action: "For the next 24 hours, track every time you pick up your phone unconsciously. No judgment. Just count. Write the number down tonight.",
    closing: "What I behold, I become. Let me behold you.",
  },
  {
    day: 4, title: "Discipline",
    stillness: "Discipline is not punishment. It is the structure that makes freedom possible. An undisciplined musician cannot play freely. An undisciplined soul cannot love freely.",
    ref: "1 Corinthians 9:27",
    scripture: "No, I strike a blow to my body and make it my slave so that after I have preached to others, I myself will not be disqualified for the prize.",
    reflection: "What does a disciplined morning look like for you — and what would have to be true for you to build it this week?",
    action: "Design your morning sequence in writing. Three steps. Scripture first. Post it somewhere visible.",
    closing: "Make me a disciplined person — not for performance, but for presence.",
  },
  {
    day: 5, title: "Surrender",
    stillness: "You cannot control your formation. You can only choose your inputs. Today is not about trying harder. It is about letting go of the inputs that are forming you away from Christ.",
    ref: "Matthew 16:24",
    scripture: "Whoever wants to be my disciple must deny themselves and take up their cross and follow me.",
    reflection: "What would you have to surrender to make this practice consistent — and are you willing?",
    action: "Delete one app from your phone today. Not permanently if that feels too large. For 48 hours. Notice what you feel.",
    closing: "I release what I have been holding onto. Take what you want of me.",
  },
  {
    day: 6, title: "Consistency",
    stillness: "One day of practice changes nothing. One thousand days of practice changes everything. The goal is not intensity. The goal is return.",
    ref: "Luke 9:23",
    scripture: "Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.",
    reflection: "What makes consistency hard for you — and what one environmental change could make it easier?",
    action: "Tell one person what you are practicing and why. Accountability is not weakness. It is wisdom.",
    closing: "Not a moment of fire. A life of faithfulness. Make me that.",
  },
  {
    day: 7, title: "Identity",
    stillness: "You are not trying to become someone new. You are returning to who you already are — made in the image of Christ, formed for obedience, built for presence. This is not self-improvement. This is homecoming.",
    ref: "2 Corinthians 3:18",
    scripture: "And we all, who with unveiled faces contemplate the Lord's glory, are being transformed into his image with ever-increasing glory, which comes from the Lord, who is the Spirit.",
    reflection: "Who are you becoming through what you have been practicing — and who do you want to be in one year if you kept going?",
    action: "Write a one-sentence identity statement. Begin with: 'I am a person who...' Post it where you will see it every morning.",
    closing: "I am not who the algorithm says I am. I am who you say I am. Form me.",
  },
];

const WHY = [
  { title: "The Problem", body: "You are being formed right now. Every notification, every feed, every algorithmically optimized scroll — they are not neutral. They are actively shaping your desires, shortening your attention, training you to reach for stimulation before silence. This is not a technology problem. It is a formation problem." },
  { title: "Formation & Attention", body: "Attention is the currency of the soul. What you give your first attention to shapes what you love, fear, and pursue. Ancient spiritual directors understood this. That is why the Rule of St. Benedict structured every hour. They knew: unstructured time is not free time — it is time that something else will fill." },
  { title: "Scripture First", body: "Scripture before scroll is not a productivity hack. It is a reordering of desire. When truth enters first, it sets the frame for everything else. When noise enters first, you spend the rest of the day recovering your center. The sequence matters." },
  { title: "Habit Formation", body: "Habits are built by triggers, routines, and rewards. The phone has all three built in — by engineers paid to make it irresistible. Counter Formation uses the same mechanism: a physical trigger, a structured routine (the Office), and a real reward. You are not fighting technology with willpower. You are replacing a formation system with a better one." },
  { title: "Spiritual Impact", body: "The Desert Fathers left cities not because cities were evil but because they understood that environment shapes the soul. You may not be able to leave the digital city. But you can build a practice that protects you inside it." },
  { title: "Rule of Life", body: "This rhythm is one practice inside a larger framework. Counter Formation's Rule of Life includes presence, prayer, sabbath, and community — all designed to build a life that Christ is actually forming. Start here. Then go deeper." },
];

const NEW_SECTIONS = [
  { title: "What is Counter Formation?", body: "Counter Formation is a movement for people who want to be formed by Christ in a world designed to form them otherwise. It starts with apparel — but the garment is only the trigger. The real product is the life you build around it." },
  { title: "What is Formation?", body: "Formation is the slow process by which a person becomes who they are. Every habit, every input, every repeated action is forming you — toward something. The question is not whether you are being formed. You are. The question is what is doing the forming." },
  { title: "Why Apparel Connects", body: "The garment is a physical reminder in a world of invisible forces. When you put it on, you are making a choice. The QR code connects that physical moment to a digital practice — turning a piece of clothing into a daily ritual entry point." },
  { title: "What is the Field Guide?", body: "The Field Guide is a library of structured formation experiences, each linked to an apparel release. Scripture Before Scroll is the first. More are coming." },
];

/* ─── INJECTED STYLES ─────────────────────────────────────────────── */

const FG_CSS = `
  .fg-shell {
    position: relative;
    min-height: 100vh;
    background:
      radial-gradient(circle at 50% 12%, rgba(201,168,76,0.12) 0%, transparent 28%),
      radial-gradient(circle at 20% 22%, rgba(80,72,52,0.10) 0%, transparent 26%),
      linear-gradient(to bottom, #06050A 0%, #0A090C 46%, #06050A 100%);
    color: #FAF8F5;
    overflow: hidden;
  }
  .fg-shell::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(to bottom, rgba(255,255,255,0.02), transparent 12%, transparent 88%, rgba(255,255,255,0.02)),
      radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05), transparent 24%);
    pointer-events: none;
  }
  .fg-gridlines {
    position: absolute;
    inset: 0;
    opacity: 0.045;
    pointer-events: none;
    background-image:
      linear-gradient(to right, transparent 0%, transparent 15%, rgba(255,255,255,0.65) 15.1%, transparent 15.2%, transparent 84.8%, rgba(255,255,255,0.65) 84.9%, transparent 85%, transparent 100%);
  }

  .fg-wrap {
    position: relative;
    z-index: 2;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 24px 92px;
  }

  .fg-narrow { max-width: 610px; }
  .fg-fade-up { animation: fgFadeUp .72s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-1 { animation: fgFadeUp .72s .08s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-2 { animation: fgFadeUp .72s .16s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-3 { animation: fgFadeUp .72s .24s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-4 { animation: fgFadeUp .72s .32s cubic-bezier(.16,1,.3,1) both; }
  .fg-fade-up-5 { animation: fgFadeUp .72s .40s cubic-bezier(.16,1,.3,1) both; }

  @keyframes fgFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fg-reveal { opacity: 0; transform: translateY(20px); transition: opacity .65s ease, transform .65s cubic-bezier(.16,1,.3,1); }
  .fg-reveal.fg-visible { opacity: 1; transform: translateY(0); }

  .fg-hero-panel,
  .fg-panel,
  .fg-card,
  .fg-day-card,
  .fg-return-panel {
    background: linear-gradient(to bottom, rgba(28,25,20,0.92), rgba(18,16,12,0.95));
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 24px 80px rgba(0,0,0,0.30);
    position: relative;
    overflow: hidden;
  }
  .fg-hero-panel::before,
  .fg-panel::before,
  .fg-card::before,
  .fg-return-panel::before {
    content: "";
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.48), transparent);
  }

  .fg-hero-panel {
    border-radius: 32px;
    padding: 42px 28px;
  }

  .fg-btn-prim,
  .fg-btn-sec,
  .fg-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    border-radius: 999px;
    text-decoration: none;
    cursor: pointer;
    transition: all .24s ease;
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
  }

  .fg-btn-prim {
    padding: 16px 28px;
    background: #C9A84C;
    color: #000;
    border: none;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: .22em;
  }
  .fg-btn-prim:hover { background: #FAF8F5; transform: translateY(-1px); }

  .fg-btn-sec {
    padding: 15px 28px;
    background: rgba(255,255,255,0.02);
    color: rgba(250,248,245,0.82);
    border: 1px solid rgba(255,255,255,0.10);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: .22em;
  }
  .fg-btn-sec:hover { border-color: rgba(201,168,76,0.42); color: #C9A84C; transform: translateY(-1px); }

  .fg-btn-ghost {
    padding: 13px 22px;
    background: transparent;
    color: rgba(250,248,245,0.42);
    border: none;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .22em;
  }
  .fg-btn-ghost:hover { color: rgba(250,248,245,0.72); }

  .fg-nav-link {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: .35em;
    text-transform: uppercase;
    color: rgba(250,248,245,0.35);
    background: none;
    border: none;
    cursor: pointer;
    transition: color .2s;
    padding: 0;
    text-decoration: none;
  }
  .fg-nav-link:hover { color: #C9A84C; }

  .fg-brand-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 999px;
    text-decoration: none;
    transition: all .25s ease;
    background: rgba(255,255,255,0.02);
    cursor: pointer;
  }
  .fg-brand-btn:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.08); }

  .fg-gold-line {
    height: 1px;
    width: 100%;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  }

  .fg-section-kicker {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px;
    letter-spacing: .45em;
    text-transform: uppercase;
    color: rgba(201,168,76,.95);
    font-weight: 700;
  }

  .fg-scripture-card {
    border-left: 2px solid #C9A84C;
    border-radius: 0 20px 20px 0;
    background: linear-gradient(to bottom, rgba(201,168,76,0.08), rgba(201,168,76,0.03));
    padding: 28px 24px;
    position: relative;
    overflow: hidden;
  }
  .fg-scripture-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(201,168,76,0.9), transparent);
  }

  .fg-card { border-radius: 24px; padding: 26px 24px; }
  .fg-panel { border-radius: 28px; padding: 28px 26px; }
  .fg-return-panel { border-radius: 28px; padding: 28px 24px; text-align: center; }

  .fg-day-card {
    width: 100%;
    border-radius: 18px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all .3s cubic-bezier(.16,1,.3,1);
    text-align: left;
  }
  .fg-day-card:hover { border-color: rgba(201,168,76,0.32); transform: translateX(4px); background: linear-gradient(to bottom, rgba(33,29,22,0.96), rgba(22,19,15,0.98)); }

  .fg-ritual-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .fg-progress {
    height: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.06);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.04);
  }
  .fg-progress > span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, rgba(201,168,76,0.55), rgba(201,168,76,0.95));
    border-radius: 999px;
  }

  .fg-meta-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  @media (min-width: 900px) {
    .fg-wrap { padding: 0 48px 112px; }
    .fg-hero-panel { padding: 56px 48px; }
    .fg-hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, .8fr);
      gap: 32px;
      align-items: end;
    }
    .fg-ritual-grid {
      grid-template-columns: 1.05fr .95fr;
      gap: 22px;
    }
    .fg-meta-grid { grid-template-columns: 1fr 1fr; }
  }

  @media (max-width: 699px) {
    .fg-wrap { padding: 0 20px 80px; }
    .fg-hero-panel { border-radius: 24px; padding: 30px 20px; }
  }

  @media (min-width: 1280px) {
    .fg-wrap { padding: 0 64px 140px; }
    .fg-hero-panel { padding: 72px 64px; }
    .fg-meta-grid  { grid-template-columns: 1fr 1fr; gap: 20px; }
  }
`;

/* ─── HOOKS ───────────────────────────────────────────────────────── */

function useScrollReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fg-reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("fg-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

function useProgress(day) {
  const key = "cf-sbs-progress";
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      if (!existing.includes(day)) {
        localStorage.setItem(key, JSON.stringify([...existing, day].sort((a, b) => a - b)));
      }
    } catch {}
  }, [day]);

  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

/* ─── SHARED COMPONENTS ───────────────────────────────────────────── */

function FGLabel({ children, color = C.gold }) {
  return (
    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.45em", textTransform: "uppercase", color, fontWeight: 700, marginBottom: 10 }}>
      {children}
    </div>
  );
}

function FGHeading({ children, style = {} }) {
  return (
    <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 56, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 0.92, color: C.ivory, margin: 0, ...style }}>
      {children}
    </h1>
  );
}

function GoldDivider({ mt = 32, mb = 32 }) {
  return <div className="fg-gold-line" style={{ margin: `${mt}px 0 ${mb}px` }} />;
}

function BrandLockup() {
  return (
    <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" className="fg-brand-btn">
      <img src="/helmet.png" alt="Counter Formation" style={{ width: 24, height: 24, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: C.ivory }}>Counter</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: C.gold }}>Formation</span>
      </div>
      <span style={{ fontSize: 10, color: C.dim }}>↗</span>
    </a>
  );
}

function PageShell({ children }) {
  return (
    <div className="fg-shell">
      <div className="fg-gridlines" />
      {children}
    </div>
  );
}

function FGNav({ showBack }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "rgba(6,5,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
        boxShadow: scrolled ? "0 12px 30px rgba(0,0,0,0.28)" : "none",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.35s ease",
      }}
    >
      <button onClick={() => navigate(BASE)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <BrandLockup />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {showBack && (
          <button onClick={() => navigate(-1)} className="fg-nav-link">← Back</button>
        )}
        <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" className="fg-nav-link">
          Main Site ↗
        </a>
      </div>
    </nav>
  );
}

function SiteFooter() {
  return (
    <div style={{ marginTop: 64, borderTop: `1px solid ${C.border}`, paddingTop: 40, paddingBottom: 48, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <BrandLockup />
      </div>
      <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, maxWidth: 300, margin: "0 auto 24px" }}>
        This rhythm is one part of a larger mission. Wear the reminder. Return to the practice.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
        <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="fg-btn-sec">
          Shop the Gear
        </a>
      </div>
      <div style={{ marginTop: 32 }}>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(250,248,245,0.15)" }}>
          Ephesians 6:10–18
        </span>
      </div>
    </div>
  );
}

function SectionIntro({ label, title, body, children }) {
  return (
    <div style={{ paddingTop: 52, paddingBottom: 36 }}>
      <div className="fg-fade-up"><FGLabel>{label}</FGLabel></div>
      <FGHeading style={{ marginBottom: 16 }}>
        <span className="fg-fade-up-1">{title}</span>
      </FGHeading>
      {body && (
        <p className="fg-fade-up-2 fg-narrow" style={{ fontSize: 15, color: C.muted, lineHeight: 1.8 }}>
          {body}
        </p>
      )}
      {children}
    </div>
  );
}

/* ─── PAGE: LANDING ───────────────────────────────────────────────── */

export function FGLanding() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageShell>
      <FGNav showBack={false} />
      <div className="fg-wrap">
        <div className="fg-hero-panel" style={{ marginTop: 36 }}>
          <div className="fg-hero-grid">
            <div className="fg-narrow">
              <div className="fg-fade-up"><FGLabel>Field Guide · Scripture Before Scroll</FGLabel></div>
              <FGHeading style={{ marginBottom: 22 }}>
                <span className="fg-fade-up-1">Scripture<br /></span>
                <span className="fg-fade-up-2" style={{ color: C.gold }}>Before<br /></span>
                <span className="fg-fade-up-3">Scroll</span>
              </FGHeading>
              <p className="fg-fade-up-4" style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, maxWidth: 420, marginBottom: 28 }}>
                Before anything else. Begin here. This is not content to consume. It is a discipline to re-enter.
              </p>
              <div className="fg-fade-up-5" style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 360 }}>
                <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today&apos;s Office →</Link>
                <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
              </div>
            </div>

            <div className="fg-panel fg-fade-up-4" style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="fg-section-kicker" style={{ marginBottom: 14 }}>The Rhythm</div>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: C.ivory, margin: 0 }}>
                  Begin the day with stillness, scripture, reflection, and one concrete act of resistance against drift.
                </p>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.dim, marginBottom: 12 }}>
                  Also available
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
                  <Link className="fg-btn-sec" to={`${BASE}/new`}>New Here?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <GoldDivider mt={34} mb={34} />

        <div className="fg-meta-grid">
          <div className="fg-card fg-reveal">
            <div className="fg-section-kicker" style={{ marginBottom: 12 }}>How it works</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>
              Scan. Enter the office. Return tomorrow. Let repetition do what inspiration never can.
            </p>
          </div>
          <div className="fg-card fg-reveal">
            <div className="fg-section-kicker" style={{ marginBottom: 12 }}>Built for return</div>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>
              Save this page to your home screen, rescan from the garment, or carry the rhythm forward through the 7-day path.
            </p>
          </div>
        </div>

        <SiteFooter />
      </div>
    </PageShell>
  );
}

/* ─── PAGE: OFFICE ────────────────────────────────────────────────── */

export function FGOffice() {
  const { day: dayParam } = useParams();
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, [dayParam]);

  const dayNum = dayParam === "today" || !dayParam ? 1 : parseInt(dayParam, 10);
  const office = OFFICES.find(o => o.day === dayNum) || OFFICES[0];
  const next = OFFICES.find(o => o.day === dayNum + 1);
  const progress = useProgress(dayNum);
  const percent = Math.max((dayNum / OFFICES.length) * 100, 14);

  return (
    <PageShell>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label={`Scripture Before Scroll · Day ${office.day}`}
          title={office.title}
          body="A short office for ordering your first attention before the day orders you."
        >
          <div className="fg-fade-up-3 fg-narrow" style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.dim }}>
              <span>Progress</span>
              <span>{office.day} / {OFFICES.length}</span>
            </div>
            <div className="fg-progress"><span style={{ width: `${percent}%` }} /></div>
          </div>
        </SectionIntro>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-ritual-grid">
            <div className="fg-card">
              <FGLabel>Stillness</FGLabel>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{office.stillness}</p>
            </div>

            <div className="fg-card">
              <FGLabel>Reflection</FGLabel>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{office.reflection}</p>
            </div>
          </div>
        </div>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-scripture-card">
            <FGLabel>Scripture · {office.ref}</FGLabel>
            <p style={{ fontSize: 18, color: C.ivory, fontStyle: "italic", lineHeight: 1.9, marginBottom: 16 }}>
              &ldquo;{office.scripture}&rdquo;
            </p>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold, fontWeight: 700 }}>{office.ref}</span>
          </div>
        </div>

        <div className="fg-reveal" style={{ marginBottom: 22 }}>
          <div className="fg-ritual-grid">
            <div className="fg-card">
              <FGLabel>Action</FGLabel>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.34em", textTransform: "uppercase", color: C.gold, marginBottom: 10 }}>Today</div>
              <p style={{ fontSize: 16, color: C.ivory, lineHeight: 1.82, margin: 0 }}>{office.action}</p>
            </div>

            <div className="fg-card">
              <FGLabel>Closing</FGLabel>
              <p style={{ fontSize: 18, color: C.ivory, fontStyle: "italic", lineHeight: 1.82, margin: 0 }}>{office.closing}</p>
            </div>
          </div>
        </div>

        <div className="fg-return-panel fg-reveal" style={{ marginTop: 30 }}>
          <div className="fg-section-kicker" style={{ marginBottom: 10 }}>Daily Rhythm</div>
          <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.75, maxWidth: 520, margin: "0 auto 18px" }}>
            Return here tomorrow. This is how formation happens — not by intensity, but by repetition.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420, margin: "0 auto 14px" }}>
            {next ? (
              <Link className="fg-btn-prim" to={`${BASE}/day/${next.day}`}>Day {next.day}: {next.title} →</Link>
            ) : (
              <Link className="fg-btn-prim" to={`${BASE}/path`}>Complete — View Full Path →</Link>
            )}
            <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
            <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 420, margin: "0 auto" }}>
            <button className="fg-btn-ghost" onClick={() => alert("Add the Field Guide to your home screen from your browser menu.")}>⊕ Save to Home Screen</button>
            <button className="fg-btn-ghost" onClick={() => navigator.share ? navigator.share({ title: "Scripture Before Scroll", text: "Discipline before distraction.", url: window.location.href }) : navigator.clipboard?.writeText(window.location.href)}>↗ Share This Rhythm</button>
          </div>

          <div style={{ marginTop: 16, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.30em", textTransform: "uppercase", color: C.dim }}>
            Completed days: {progress.length ? progress.join(" · ") : "1"}
          </div>
        </div>

        <SiteFooter />
      </div>
    </PageShell>
  );
}

/* ─── PAGE: 7-DAY PATH ────────────────────────────────────────────── */

export function FGPath() {
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const progress = useProgress(1);

  return (
    <PageShell>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label="Scripture Before Scroll"
          title={<>7-Day<br />Path</>}
          body="One practice per day. Flexible to enter. Structured enough to progress."
        />

        <div className="fg-panel fg-reveal" style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="fg-section-kicker">Your progression</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: C.dim }}>
              {progress.length} complete
            </div>
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, margin: 0 }}>
            Start anywhere, but don’t stay random. Let the path teach your mornings how to return.
          </p>
        </div>

        <div className="fg-reveal" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {OFFICES.map(o => {
            const complete = progress.includes(o.day);
            return (
              <Link key={o.day} className="fg-day-card" to={`${BASE}/day/${o.day}`}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: complete ? "rgba(201,168,76,0.16)" : "rgba(201,168,76,0.08)", border: `1px solid ${complete ? "rgba(201,168,76,0.46)" : "rgba(201,168,76,0.20)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 800, color: C.gold }}>{o.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.ivory, marginBottom: 4 }}>{o.title}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: C.dim }}>{o.ref}</div>
                    {o.day === 1 && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: C.gold }}>Start here</span>}
                    {complete && <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)" }}>Complete</span>}
                  </div>
                </div>
                <span style={{ color: C.gold, fontSize: 16, opacity: 0.65 }}>→</span>
              </Link>
            );
          })}
        </div>

        <div className="fg-reveal" style={{ maxWidth: 420 }}>
          <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today&apos;s Office →</Link>
        </div>

        <SiteFooter />
      </div>
    </PageShell>
  );
}

/* ─── PAGE: WHY ───────────────────────────────────────────────────── */

export function FGWhy() {
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageShell>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label="The Foundation"
          title={<>Why This<br />Matters</>}
          body="Formation is not accidental. It is inevitable. The only question is what is doing the forming."
        />

        <div className="fg-meta-grid">
          {WHY.map((sec, i) => (
            <div key={i} className="fg-card fg-reveal">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 22, height: 1, backgroundColor: C.gold }} />
                <FGLabel>{sec.title}</FGLabel>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{sec.body}</p>
            </div>
          ))}
        </div>

        <GoldDivider mt={30} mb={30} />

        <div className="fg-reveal" style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 10 }}>
          <Link className="fg-btn-prim" to={`${BASE}/today`}>Begin Today&apos;s Office →</Link>
          <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
        </div>

        <SiteFooter />
      </div>
    </PageShell>
  );
}

/* ─── PAGE: NEW HERE ──────────────────────────────────────────────── */

export function FGNewHere() {
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageShell>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <SectionIntro
          label="Orientation"
          title={<>New<br />Here?</>}
          body="Start here. This will take three minutes. Then the rest of the system makes sense."
        />

        <div className="fg-meta-grid">
          {NEW_SECTIONS.map((sec, i) => (
            <div key={i} className="fg-card fg-reveal">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 20, height: 1, backgroundColor: C.gold }} />
                <FGLabel>{sec.title}</FGLabel>
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.82, margin: 0 }}>{sec.body}</p>
            </div>
          ))}
        </div>

        <GoldDivider mt={30} mb={28} />

        <div className="fg-panel fg-reveal" style={{ maxWidth: 520 }}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "'Barlow Condensed',sans-serif", backgroundColor: C.goldDim, color: C.gold, marginBottom: 18 }}>
            Your Next Steps
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link className="fg-btn-prim" to={`${BASE}/today`}>Start Today&apos;s Office →</Link>
            <Link className="fg-btn-sec" to={`${BASE}/path`}>View 7-Day Path</Link>
            <Link className="fg-btn-sec" to={`${BASE}/why`}>Why This Matters</Link>
          </div>
        </div>

        <SiteFooter />
      </div>
    </PageShell>
  );
}

/* ─── STYLE INJECTOR ──────────────────────────────────────────────── */

export function FieldGuideStyles() {
  return <style>{FG_CSS}</style>;
}
