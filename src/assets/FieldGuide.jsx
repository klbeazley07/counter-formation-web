import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";
const MAIN_URL    = "https://counterformed.com";

const C = {
  bg:       "#06050A",
  bgSurf:   "#0E0C0A",
  bgCard:   "#17140F",
  bgCard2:  "#1C1914",
  gold:     "#C9A84C",
  goldDim:  "rgba(201,168,76,0.12)",
  goldMid:  "rgba(201,168,76,0.35)",
  ivory:    "#FAF8F5",
  muted:    "rgba(250,248,245,0.50)",
  dim:      "rgba(250,248,245,0.22)",
  border:   "rgba(255,255,255,0.07)",
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
  { title: "The Problem",          body: "You are being formed right now. Every notification, every feed, every algorithmically optimized scroll — they are not neutral. They are actively shaping your desires, shortening your attention, training you to reach for stimulation before silence. This is not a technology problem. It is a formation problem." },
  { title: "Formation & Attention",body: "Attention is the currency of the soul. What you give your first attention to shapes what you love, fear, and pursue. Ancient spiritual directors understood this. That is why the Rule of St. Benedict structured every hour. They knew: unstructured time is not free time — it is time that something else will fill." },
  { title: "Scripture First",      body: "Scripture before scroll is not a productivity hack. It is a reordering of desire. When truth enters first, it sets the frame for everything else. When noise enters first, you spend the rest of the day recovering your center. The sequence matters." },
  { title: "Habit Formation",      body: "Habits are built by triggers, routines, and rewards. The phone has all three built in — by engineers paid to make it irresistible. Counter Formation uses the same mechanism: a physical trigger, a structured routine (the Office), and a real reward. You are not fighting technology with willpower. You are replacing a formation system with a better one." },
  { title: "Spiritual Impact",     body: "The Desert Fathers left cities not because cities were evil but because they understood that environment shapes the soul. You may not be able to leave the digital city. But you can build a practice that protects you inside it." },
  { title: "Rule of Life",         body: "This rhythm is one practice inside a larger framework. Counter Formation's Rule of Life includes presence, prayer, sabbath, and community — all designed to build a life that Christ is actually forming. Start here. Then go deeper." },
];

const NEW_SECTIONS = [
  { title: "What is Counter Formation?", body: "Counter Formation is a movement for people who want to be formed by Christ in a world designed to form them otherwise. It starts with apparel — but the garment is only the trigger. The real product is the life you build around it." },
  { title: "What is Formation?",         body: "Formation is the slow process by which a person becomes who they are. Every habit, every input, every repeated action is forming you — toward something. The question is not whether you are being formed. You are. The question is what is doing the forming." },
  { title: "Why Apparel Connects",       body: "The garment is a physical reminder in a world of invisible forces. When you put it on, you are making a choice. The QR code connects that physical moment to a digital practice — turning a piece of clothing into a daily ritual entry point." },
  { title: "What is the Field Guide?",   body: "The Field Guide is a library of structured formation experiences, each linked to an apparel release. Scripture Before Scroll is the first. More are coming." },
];

/* ─── INJECTED STYLES ─────────────────────────────────────────────── */

const FG_CSS = `
  .fg-wrap { max-width: 520px; margin: 0 auto; padding: 0 24px 80px; }
  .fg-fade-up   { animation: fgFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-1 { animation: fgFadeUp 0.7s 0.10s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-2 { animation: fgFadeUp 0.7s 0.20s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-3 { animation: fgFadeUp 0.7s 0.30s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-4 { animation: fgFadeUp 0.7s 0.40s cubic-bezier(0.16,1,0.3,1) both; }
  .fg-fade-up-5 { animation: fgFadeUp 0.7s 0.50s cubic-bezier(0.16,1,0.3,1) both; }

  @keyframes fgFadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fg-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1); }
  .fg-reveal.fg-visible { opacity: 1; transform: translateY(0); }

  .fg-btn-prim {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 16px 28px;
    background: #C9A84C; color: #000; border: none; border-radius: 100px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s ease; text-decoration: none;
  }
  .fg-btn-prim:hover { background: #FAF8F5; transform: translateY(-1px); }
  .fg-btn-prim:active { transform: scale(0.98); }

  .fg-btn-sec {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 15px 28px;
    background: transparent; color: rgba(250,248,245,0.75);
    border: 1px solid rgba(255,255,255,0.10); border-radius: 100px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 13px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; transition: all 0.25s ease; text-decoration: none;
  }
  .fg-btn-sec:hover { border-color: rgba(201,168,76,0.40); color: #C9A84C; transform: translateY(-1px); }

  .fg-btn-ghost {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 13px 24px;
    background: transparent; color: rgba(250,248,245,0.30); border: none; border-radius: 100px;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 12px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s ease;
  }
  .fg-btn-ghost:hover { color: rgba(250,248,245,0.60); }

  .fg-day-card {
    background: #17140F; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
    padding: 18px 20px; display: flex; align-items: center; gap: 16px;
    cursor: pointer; transition: all 0.3s cubic-bezier(0.16,1,0.3,1); text-align: left; width: 100%;
  }
  .fg-day-card:hover { border-color: rgba(201,168,76,0.30); background: #1C1914; transform: translateX(4px); }

  .fg-card-action {
    background: #1C1914; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
    padding: 22px 20px; position: relative; overflow: hidden;
  }
  .fg-card-action::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent);
  }

  .fg-scripture-card {
    border-left: 2px solid #C9A84C; border-radius: 0 14px 14px 0;
    background: rgba(201,168,76,0.05); padding: 24px 22px; position: relative; overflow: hidden;
  }
  .fg-scripture-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #C9A84C, transparent);
  }

  .fg-gold-line {
    height: 1px; width: 100%;
    background: linear-gradient(90deg, transparent, #C9A84C, transparent);
  }

  .fg-nav-link {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase;
    color: rgba(250,248,245,0.35); background: none; border: none; cursor: pointer;
    transition: color 0.2s; padding: 0; text-decoration: none;
  }
  .fg-nav-link:hover { color: #C9A84C; }

  .fg-brand-btn {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 16px; border: 1px solid rgba(255,255,255,0.07); border-radius: 100px;
    text-decoration: none; transition: all 0.25s ease; background: transparent;
    cursor: pointer;
  }
  .fg-brand-btn:hover { border-color: rgba(201,168,76,0.35); background: rgba(201,168,76,0.08); }
`;

/* ─── HOOKS ───────────────────────────────────────────────────────── */

function useScrollReveal(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".fg-reveal");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("fg-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/* ─── SHARED COMPONENTS ───────────────────────────────────────────── */

function FGLabel({ children, color = C.gold }) {
  return (
    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:"0.45em", textTransform:"uppercase", color, fontWeight:700, marginBottom:10 }}>
      {children}
    </div>
  );
}

function FGHeading({ children, style = {} }) {
  return (
    <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:52, fontWeight:900, letterSpacing:"0.08em", textTransform:"uppercase", lineHeight:0.92, color:C.ivory, margin:0, ...style }}>
      {children}
    </h1>
  );
}

function GoldDivider({ mt = 32, mb = 32 }) {
  return <div className="fg-gold-line" style={{ margin:`${mt}px 0 ${mb}px` }} />;
}

function BrandLockup() {
  return (
    <a href={MAIN_URL} target="_blank" rel="noopener noreferrer" className="fg-brand-btn">
      <img src="/helmet.png" alt="Counter Formation"
        style={{ width:24, height:24, objectFit:"contain", filter:"brightness(0) invert(1)", opacity:0.9 }} />
      <div style={{ display:"flex", flexDirection:"column", lineHeight:1 }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:C.ivory }}>Counter</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:500, letterSpacing:"0.32em", textTransform:"uppercase", color:C.gold }}>Formation</span>
      </div>
      <span style={{ fontSize:10, color:C.dim }}>↗</span>
    </a>
  );
}

function FGNav({ showBack }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100,
      backgroundColor: scrolled ? "rgba(6,5,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between",
      transition:"all 0.35s ease",
    }}>
      <button onClick={() => navigate("/field-guide/scripture-before-scroll")}
        style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
        <BrandLockup />
      </button>
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
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
    <div style={{ marginTop:56, borderTop:`1px solid ${C.border}`, paddingTop:40, paddingBottom:48, textAlign:"center" }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
        <BrandLockup />
      </div>
      <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, maxWidth:260, margin:"0 auto 24px" }}>
        This rhythm is one part of a larger mission.
      </p>
      <div style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:300, margin:"0 auto" }}>
        <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="fg-btn-sec">
          Shop the Gear
        </a>
      </div>
      <div style={{ marginTop:32 }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.38em", textTransform:"uppercase", color:"rgba(250,248,245,0.15)" }}>
          Ephesians 6:10–18
        </span>
      </div>
    </div>
  );
}

/* ─── PAGE: LANDING ───────────────────────────────────────────────── */

export function FGLanding() {
  const navigate = useNavigate();
  const BASE = "/field-guide/scripture-before-scroll";

  useEffect(() => { window.scrollTo(0,0); }, []);

  return (
    <div style={{ minHeight:"100vh", backgroundColor:C.bg, color:C.ivory }}>
      <FGNav showBack={false} />
      <div className="fg-wrap">
        <div style={{ paddingTop:64, paddingBottom:48 }}>
          <div className="fg-fade-up"><FGLabel>Field Guide · Scripture Before Scroll</FGLabel></div>
          <FGHeading style={{ marginBottom:24 }} >
            <span className="fg-fade-up-1">Scripture<br /></span>
            <span className="fg-fade-up-2" style={{ color:C.gold }}>Before<br /></span>
            <span className="fg-fade-up-3">Scroll</span>
          </FGHeading>
          <p className="fg-fade-up-4" style={{ fontSize:14, color:C.muted, lineHeight:1.75, maxWidth:340, marginBottom:40 }}>
            Before anything else. Begin here.
          </p>
          <div className="fg-fade-up-5" style={{ display:"flex", flexDirection:"column", gap:10, maxWidth:340 }}>
            <button className="fg-btn-prim" onClick={() => navigate(`${BASE}/today`)}>
              Begin Today's Office →
            </button>
          </div>
        </div>

        <GoldDivider mt={0} mb={32} />

        <div style={{ marginBottom:8 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.38em", textTransform:"uppercase", color:C.dim, marginBottom:14 }}>
            Also available
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["View 7-Day Path", `${BASE}/path`], ["Why This Matters", `${BASE}/why`], ["New Here?", `${BASE}/new`]].map(([label, path]) => (
              <button key={path} className="fg-btn-sec" onClick={() => navigate(path)}>{label}</button>
            ))}
          </div>
        </div>

        <GoldDivider mt={40} mb={32} />

        {/* Main site CTA card */}
        <div style={{ backgroundColor:C.bgCard, border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)` }} />
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <BrandLockup />
          </div>
          <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:0 }}>
            This rhythm is one part of a larger mission. Explore the full site.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE: OFFICE ────────────────────────────────────────────────── */

export function FGOffice() {
  const { day: dayParam } = useParams();
  const navigate = useNavigate();
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0,0); }, [dayParam]);

  const BASE = "/field-guide/scripture-before-scroll";
  const dayNum = dayParam === "today" ? 1 : parseInt(dayParam);
  const office = OFFICES.find(o => o.day === dayNum) || OFFICES[0];
  const next   = OFFICES.find(o => o.day === dayNum + 1);
  const { day, title, stillness, ref: sRef, scripture, reflection, action, closing } = office;

  return (
    <div style={{ minHeight:"100vh", backgroundColor:C.bg, color:C.ivory }}>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <div style={{ paddingTop:48, paddingBottom:40 }}>
          <div className="fg-fade-up"><FGLabel>Scripture Before Scroll · Day {day}</FGLabel></div>
          <FGHeading><span className="fg-fade-up-1">{title}</span></FGHeading>
        </div>

        <div className="fg-reveal" style={{ marginBottom:40 }}>
          <FGLabel>Stillness</FGLabel>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.8 }}>{stillness}</p>
        </div>

        <GoldDivider mt={0} mb={32} />

        <div className="fg-reveal" style={{ marginBottom:40 }}>
          <FGLabel>Scripture · {sRef}</FGLabel>
          <div className="fg-scripture-card">
            <p style={{ fontSize:16, color:C.ivory, fontStyle:"italic", lineHeight:1.85, marginBottom:14 }}>"{scripture}"</p>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.35em", textTransform:"uppercase", color:C.gold, fontWeight:700 }}>{sRef}</span>
          </div>
        </div>

        <GoldDivider mt={0} mb={32} />

        <div className="fg-reveal" style={{ marginBottom:40 }}>
          <FGLabel>Reflection</FGLabel>
          <p style={{ fontSize:15, color:C.muted, lineHeight:1.8 }}>{reflection}</p>
        </div>

        <GoldDivider mt={0} mb={32} />

        <div className="fg-reveal" style={{ marginBottom:40 }}>
          <FGLabel>Action</FGLabel>
          <div className="fg-card-action">
            <p style={{ fontSize:15, color:C.ivory, lineHeight:1.8, margin:0 }}>{action}</p>
          </div>
        </div>

        <GoldDivider mt={0} mb={32} />

        <div className="fg-reveal" style={{ marginBottom:48 }}>
          <FGLabel>Closing</FGLabel>
          <p style={{ fontSize:17, color:C.ivory, fontStyle:"italic", lineHeight:1.8, letterSpacing:"0.01em" }}>{closing}</p>
        </div>

        <GoldDivider mt={0} mb={32} />

        <div className="fg-reveal" style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {next
            ? <button className="fg-btn-prim" onClick={() => navigate(`${BASE}/day-${next.day}`)}>Day {next.day}: {next.title} →</button>
            : <button className="fg-btn-prim" style={{ background:"transparent", border:`1px solid ${C.gold}`, color:C.gold }} onClick={() => navigate(`${BASE}/path`)}>Complete — View Full Path →</button>
          }
          <button className="fg-btn-sec" onClick={() => navigate(`${BASE}/path`)}>View 7-Day Path</button>
          <button className="fg-btn-sec" onClick={() => navigate(`${BASE}/why`)}>Why This Matters</button>
        </div>

        <div className="fg-reveal" style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:8 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.38em", textTransform:"uppercase", color:C.dim, textAlign:"center", marginBottom:4 }}>
            Return tomorrow
          </div>
          <button className="fg-btn-ghost">⊕ Save to Home Screen</button>
          <button className="fg-btn-ghost">↗ Share This Rhythm</button>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/* ─── PAGE: 7-DAY PATH ────────────────────────────────────────────── */

export function FGPath() {
  const navigate = useNavigate();
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0,0); }, []);

  const BASE = "/field-guide/scripture-before-scroll";

  return (
    <div style={{ minHeight:"100vh", backgroundColor:C.bg, color:C.ivory }}>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <div style={{ paddingTop:48, paddingBottom:40 }}>
          <div className="fg-fade-up"><FGLabel>Scripture Before Scroll</FGLabel></div>
          <FGHeading style={{ marginBottom:16 }}>
            <span className="fg-fade-up-1">7-Day<br />Path</span>
          </FGHeading>
          <p className="fg-fade-up-2" style={{ fontSize:14, color:C.muted, lineHeight:1.75 }}>
            One practice per day. No noise. Start anywhere — but start.
          </p>
        </div>

        <div className="fg-reveal" style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:40 }}>
          {OFFICES.map(o => (
            <button key={o.day} className="fg-day-card" onClick={() => navigate(`${BASE}/day-${o.day}`)}>
              <div style={{ width:36, height:36, borderRadius:"50%", backgroundColor:"rgba(201,168,76,0.08)", border:`1px solid rgba(201,168,76,0.20)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:800, color:C.gold }}>{o.day}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:C.ivory, marginBottom:4 }}>{o.title}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:C.dim }}>{o.ref}</div>
              </div>
              <span style={{ color:C.gold, fontSize:16, opacity:0.6 }}>→</span>
            </button>
          ))}
        </div>

        <div className="fg-reveal">
          <button className="fg-btn-prim" onClick={() => navigate(`${BASE}/today`)}>Begin Today's Office →</button>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/* ─── PAGE: WHY ───────────────────────────────────────────────────── */

export function FGWhy() {
  const navigate = useNavigate();
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0,0); }, []);

  const BASE = "/field-guide/scripture-before-scroll";

  return (
    <div style={{ minHeight:"100vh", backgroundColor:C.bg, color:C.ivory }}>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <div style={{ paddingTop:48, paddingBottom:40 }}>
          <div className="fg-fade-up"><FGLabel>The Foundation</FGLabel></div>
          <FGHeading style={{ marginBottom:16 }}>
            <span className="fg-fade-up-1">Why This<br />Matters</span>
          </FGHeading>
          <p className="fg-fade-up-2" style={{ fontSize:14, color:C.muted, lineHeight:1.75 }}>
            Formation is not accidental. It is inevitable. The only question is what is doing the forming.
          </p>
        </div>

        {WHY.map((sec, i) => (
          <div key={i} className="fg-reveal" style={{ marginBottom:36 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14 }}>
              <div style={{ width:20, height:1, backgroundColor:C.gold }} />
              <FGLabel>{sec.title}</FGLabel>
            </div>
            <p style={{ fontSize:15, color:C.muted, lineHeight:1.8 }}>{sec.body}</p>
            {i < WHY.length - 1 && <GoldDivider mt={32} mb={0} />}
          </div>
        ))}

        <GoldDivider mt={16} mb={32} />

        <div className="fg-reveal" style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button className="fg-btn-prim" onClick={() => navigate(`${BASE}/today`)}>Begin Today's Office →</button>
          <button className="fg-btn-sec"  onClick={() => navigate(`${BASE}/path`)}>View 7-Day Path</button>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/* ─── PAGE: NEW HERE ──────────────────────────────────────────────── */

export function FGNewHere() {
  const navigate = useNavigate();
  const ref = useRef(null);
  useScrollReveal(ref);
  useEffect(() => { window.scrollTo(0,0); }, []);

  const BASE = "/field-guide/scripture-before-scroll";

  return (
    <div style={{ minHeight:"100vh", backgroundColor:C.bg, color:C.ivory }}>
      <FGNav showBack />
      <div className="fg-wrap" ref={ref}>
        <div style={{ paddingTop:48, paddingBottom:40 }}>
          <div className="fg-fade-up"><FGLabel>Orientation</FGLabel></div>
          <FGHeading style={{ marginBottom:16 }}>
            <span className="fg-fade-up-1">New<br />Here?</span>
          </FGHeading>
          <p className="fg-fade-up-2" style={{ fontSize:14, color:C.muted, lineHeight:1.75 }}>
            Start here. This will take three minutes. Then everything else will make sense.
          </p>
        </div>

        {NEW_SECTIONS.map((sec, i) => (
          <div key={i} className="fg-reveal" style={{ marginBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
              <div style={{ width:20, height:1, backgroundColor:C.gold }} />
              <FGLabel>{sec.title}</FGLabel>
            </div>
            <p style={{ fontSize:15, color:C.muted, lineHeight:1.8 }}>{sec.body}</p>
            {i < NEW_SECTIONS.length - 1 && <GoldDivider mt={28} mb={0} />}
          </div>
        ))}

        <GoldDivider mt={16} mb={28} />

        <div className="fg-reveal">
          <div style={{ display:"inline-block", padding:"5px 14px", borderRadius:100, fontSize:11, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif", backgroundColor:C.goldDim, color:C.gold, marginBottom:18 }}>
            Your Next Steps
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button className="fg-btn-prim" onClick={() => navigate(`${BASE}/today`)}>Start Today's Office →</button>
            <button className="fg-btn-sec"  onClick={() => navigate(`${BASE}/path`)}>View 7-Day Path</button>
            <button className="fg-btn-sec"  onClick={() => navigate(`${BASE}/why`)}>Why This Matters</button>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}

/* ─── STYLE INJECTOR ──────────────────────────────────────────────── */

export function FieldGuideStyles() {
  return <style>{FG_CSS}</style>;
}