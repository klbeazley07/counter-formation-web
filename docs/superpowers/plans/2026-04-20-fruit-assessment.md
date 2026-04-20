# Fruit of the Spirit Assessment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Fruit of the Spirit Assessment — a five-screen, 27-question behavioral self-assessment — into the Counter Formation web app's Field Guide section.

**Architecture:** Single self-contained component (`FruitAssessment.jsx`) with all five screens managed via a `screen` state variable, a separate data file (`fruitAssessmentData.js`) holding all static content, and integration into `App.jsx` (route) and `FieldGuide.jsx` (landing card). No external chart or canvas libraries -- divs + CSS for the chart, native Canvas API for the shareable card.

**Tech Stack:** React 19, React Router v7, GSAP (available but used minimally), CSS keyframe animations injected via `<style>` tag, native Canvas API, localStorage.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/fruitAssessmentData.js` | CREATE | All static data: 27 questions, 9 fruits with formation output, scale options, constants |
| `src/FruitAssessment.jsx` | CREATE | All five screens + pre-intro + state management + scoring + canvas rendering + CSS injection |
| `src/App.jsx` | MODIFY | Import FruitAssessment + FAStyles, add route `/field-guide/fruit-assessment` |
| `src/FieldGuide.jsx` | MODIFY | Add Fruit Assessment tool card to `FGLanding` |

---

## Color + Font Reference

All inline styles use these constants (defined at top of FruitAssessment.jsx):

```javascript
const C = {
  bg:         "#06050A",
  bgSurf:     "#0E0C0A",
  bgCard:     "#17140F",
  gold:       "#C9A84C",
  goldSoft:   "rgba(201,168,76,0.45)",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldMid:    "rgba(201,168,76,0.08)",
  ivory:      "#FAF8F5",
  ivoryDim:   "rgba(250,248,245,0.62)",
  ivoryFaint: "rgba(250,248,245,0.28)",
  ivoryBar:   "rgba(250,248,245,0.45)",
};

const F = {
  brand:     "'Michroma', sans-serif",
  body:      "'Inter', sans-serif",
  serif:     "'Cormorant Garamond', serif",
};
```

---

## Task 1: Create fruitAssessmentData.js

**Files:**
- Create: `src/fruitAssessmentData.js`

- [ ] **Step 1: Create the file with all static data**

```javascript
// src/fruitAssessmentData.js

export const SCALE_OPTIONS = [
  { value: 1, label: "Rarely" },
  { value: 2, label: "Occasionally" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Usually" },
  { value: 6, label: "Almost Always" },
];

export const CLUSTER_THRESHOLD = 8;

export const FRUIT_ORDER = [
  "love","joy","peace","patience","kindness",
  "goodness","faithfulness","gentleness","self_control"
];

// 27 questions in exact interleaved assessment order. Fruit name is NOT shown to user.
// reverse: true means score = 7 - answer (higher answer = lower fruit score)
export const QUESTIONS = [
  { id: "love_1",           fruitKey: "love",         reverse: false, text: "When someone disappoints or wrongs me, my first instinct is to consider what they might be carrying rather than focus on how I have been affected." },
  { id: "joy_1",            fruitKey: "joy",          reverse: false, text: "My sense of contentment remains relatively stable across good and difficult seasons, rather than rising and falling with circumstances." },
  { id: "peace_1",          fruitKey: "peace",        reverse: false, text: "When outcomes are outside my control, I am able to release them without extended anxiety or mental rehearsal." },
  { id: "patience_1",       fruitKey: "patience",     reverse: false, text: "When people or processes move more slowly than I would like, I respond with steadiness rather than frustration." },
  { id: "kindness_1",       fruitKey: "kindness",     reverse: false, text: "I am attentive to the needs of people around me, even when I am preoccupied with my own concerns." },
  { id: "goodness_1",       fruitKey: "goodness",     reverse: false, text: "My private behavior and my public behavior are consistent. I live with similar integrity when no one is watching." },
  { id: "faithfulness_1",   fruitKey: "faithfulness", reverse: false, text: "I follow through on commitments even when my motivation has faded or circumstances have changed." },
  { id: "gentleness_1",     fruitKey: "gentleness",   reverse: false, text: "I am able to correct, confront, or disagree with someone without leaving them feeling diminished or attacked." },
  { id: "self_control_1",   fruitKey: "self_control", reverse: false, text: "When an appetite -- food, attention, entertainment, anger, lust -- pulls at me, I am generally able to pause before acting." },
  { id: "love_2",           fruitKey: "love",         reverse: true,  text: "I find myself keeping a mental ledger of how people have treated me and adjusting what I give them accordingly." },
  { id: "joy_2",            fruitKey: "joy",          reverse: true,  text: "When life feels flat or hard, I struggle to access any genuine sense of gladness." },
  { id: "peace_2",          fruitKey: "peace",        reverse: true,  text: "My mind tends to loop on worst-case scenarios, especially at night or in quiet moments." },
  { id: "patience_2",       fruitKey: "patience",     reverse: true,  text: "I find myself mentally rehearsing a frustrated response before I have even reacted outwardly." },
  { id: "kindness_2",       fruitKey: "kindness",     reverse: true,  text: "I tend to move past people I encounter in daily life without really noticing them." },
  { id: "goodness_2",       fruitKey: "goodness",     reverse: true,  text: "There are meaningful gaps between what I profess publicly and how I actually behave in private." },
  { id: "faithfulness_2",   fruitKey: "faithfulness", reverse: true,  text: "I tend to start commitments strong and let them quietly fade when they become inconvenient." },
  { id: "gentleness_2",     fruitKey: "gentleness",   reverse: true,  text: "When I am frustrated, my strength tends to come out as sharpness or force rather than restraint." },
  { id: "self_control_2",   fruitKey: "self_control", reverse: true,  text: "My actions are more often driven by what I feel in the moment than by what I have decided is true." },
  { id: "love_3",           fruitKey: "love",         reverse: false, text: "When a relationship requires sacrifice with no clear personal benefit, I tend to lean in rather than pull back." },
  { id: "joy_3",            fruitKey: "joy",          reverse: false, text: "I find genuine delight in ordinary moments, not just in milestones or achievements." },
  { id: "peace_3",          fruitKey: "peace",        reverse: false, text: "I bring a calming presence to tense or uncertain situations rather than adding to the friction." },
  { id: "patience_3",       fruitKey: "patience",     reverse: false, text: "When I am wronged or treated unfairly, I am able to wait and trust rather than retaliate or force resolution." },
  { id: "kindness_3",       fruitKey: "kindness",     reverse: false, text: "I find myself looking for practical ways to make things easier for the people in my life." },
  { id: "goodness_3",       fruitKey: "goodness",     reverse: false, text: "When I see an opportunity to do what is right, I act on it even when it is inconvenient or costly." },
  { id: "faithfulness_3",   fruitKey: "faithfulness", reverse: false, text: "I sustain spiritual rhythms and disciplines through dry seasons, not only when they feel rewarding." },
  { id: "gentleness_3",     fruitKey: "gentleness",   reverse: false, text: "My strength and conviction tend to express themselves with restraint and care rather than force." },
  { id: "self_control_3",   fruitKey: "self_control", reverse: false, text: "I have established rhythms and boundaries in my life that hold even when I do not feel like maintaining them." },
];

export const FRUITS = {
  love: {
    key: "love",
    label: "Love",
    greek: "Agape",
    formationStatement: "Love in the biblical sense is not a feeling. It is a decision made repeatedly in the direction of another person's good, often at personal cost. The places where love is difficult for you are the most honest map of where self-protection is still operating. The Spirit's invitation here is not to feel more warmly toward difficult people. It is to act rightly toward them before the feeling follows.",
    scripture: {
      text: "And walk in love, as Christ loved us and gave himself up for us.",
      reference: "Ephesians 5:2",
    },
    practice: "This week, identify one person it costs you something to love well, and make one concrete, unrequired gesture toward their good.",
    ruleOfLife: { rhythm: "Community", path: "/rule-of-life/community" },
  },
  joy: {
    key: "joy",
    label: "Joy",
    greek: "Chara",
    formationStatement: "The joy the Spirit produces is not an emotion dependent on circumstances. It is a settled conviction that God is good and sovereign, which holds even when nothing around you confirms it. If your joy rises and falls with what is happening to you, you are drawing from the wrong well. The Spirit's work here is not to make you feel better. It is to root you in something that cannot be taken.",
    scripture: {
      text: "Rejoice in the Lord always; again I will say, rejoice.",
      reference: "Philippians 4:4",
    },
    practice: "Each morning this week, before engaging any input or device, complete this sentence in writing: \"God is good because --\" and let that anchor the first hour.",
    ruleOfLife: { rhythm: "Presence", path: "/rule-of-life/presence" },
  },
  peace: {
    key: "peace",
    label: "Peace",
    greek: "Eirene",
    formationStatement: "The peace God offers is not the absence of difficulty. It is an interior settledness that coexists with difficulty. Anxiety is almost always a form of attempted sovereignty: the mind rehearsing outcomes it cannot control in hopes of managing them in advance. The Spirit's invitation here is not to stop thinking carefully. It is to release what was never yours to carry.",
    scripture: {
      text: "And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.",
      reference: "Philippians 4:7",
    },
    practice: "This week, when you notice anxiety rising about a specific outcome, name it aloud, and practice a 60-second release: \"This is not mine to control. I give it back.\"",
    ruleOfLife: { rhythm: "Prayer", path: "/rule-of-life/prayer" },
  },
  patience: {
    key: "patience",
    label: "Patience",
    greek: "Makrothumia",
    formationStatement: "Patience is not passive endurance. It is active trust. The places in your life where frustration surfaces most quickly are not character flaws to manage; they are invitations to a deeper surrender. The Spirit's work here is not to make you slow. It is to make you unshakeable.",
    scripture: {
      text: "Be completely humble and gentle; be patient, bearing with one another in love.",
      reference: "Ephesians 4:2",
    },
    practice: "Identify one recurring situation that consistently triggers impatience this week, and build a deliberate pause into your response pattern: 60 seconds before reacting, every time.",
    ruleOfLife: { rhythm: "Sabbath", path: "/rule-of-life/sabbath" },
  },
  kindness: {
    key: "kindness",
    label: "Kindness",
    greek: "Chrestotes",
    formationStatement: "Kindness as the Spirit produces it is not a temperament. It is an attentiveness to the people in front of you that refuses to be crowded out by your own preoccupations. The world forms us toward efficiency and self-focus; kindness is a structural act of resistance against both. The invitation here is not to be nicer. It is to actually see the people you are moving past.",
    scripture: {
      text: "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
      reference: "Ephesians 4:32",
    },
    practice: "This week, choose one person in your daily orbit who often goes unnoticed by you, and make one deliberate, unhurried gesture of consideration toward them each day.",
    ruleOfLife: { rhythm: "Community", path: "/rule-of-life/community" },
  },
  goodness: {
    key: "goodness",
    label: "Goodness",
    greek: "Agathosune",
    formationStatement: "Goodness in the biblical sense is not rule-following. It is moral integrity expressed in action, consistent whether or not anyone is watching. The gap between who you are in public and who you are in private is the most accurate measure of where this fruit is still forming. The Spirit's work here is not to improve your performance. It is to close the gap between the two.",
    scripture: {
      text: "For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.",
      reference: "Ephesians 2:10",
    },
    practice: "This week, identify one area where your private behavior is inconsistent with what you profess, and make one structural decision that brings them into alignment.",
    ruleOfLife: { rhythm: "Scripture", path: "/rule-of-life/scripture" },
  },
  faithfulness: {
    key: "faithfulness",
    label: "Faithfulness",
    greek: "Pistis",
    formationStatement: "Faithfulness is what love looks like over time. It is not a burst of commitment followed by drift. It is the quiet, unglamorous decision to follow through when motivation is gone, when no one is watching, and when the return is not immediately visible. This is where most formation actually happens: not in the inspired moments but in the ordinary ones that never get noticed.",
    scripture: {
      text: "His master said to him, 'Well done, good and faithful servant.'",
      reference: "Matthew 25:21",
    },
    practice: "Identify one commitment -- to a person, a practice, or a discipline -- that you have been inconsistent in, and recommit to it with one concrete structural change that removes the decision from your willpower.",
    ruleOfLife: { rhythm: "Sabbath", path: "/rule-of-life/sabbath" },
  },
  gentleness: {
    key: "gentleness",
    label: "Gentleness",
    greek: "Prautes",
    formationStatement: "Gentleness is not weakness. It is strength that has learned restraint. The Greek word carried the image of a wild horse brought under the control of its rider: all the power remains; what changes is who is directing it. The question this fruit raises is not whether you are strong. It is whether your strength is submitted to something larger than yourself.",
    scripture: {
      text: "But the meek shall inherit the earth and delight themselves in abundant peace.",
      reference: "Psalm 37:11",
    },
    practice: "This week, in one conversation where you hold power or advantage, practice using that position deliberately for the benefit of the other person -- not for efficiency or resolution, but for their good.",
    ruleOfLife: { rhythm: "Community", path: "/rule-of-life/community" },
  },
  self_control: {
    key: "self_control",
    label: "Self-Control",
    greek: "Egkrateia",
    formationStatement: "Self-control as the Spirit produces it is not white-knuckle willpower. It is a life so ordered around what is true and good that the appetites lose their command over you. The rhythms you build or fail to build are not incidental; they are the architecture of whether you are governed by your desires or by your convictions. Formation here is not about suppression. It is about building a life where you are not ruled.",
    scripture: {
      text: "But I discipline my body and keep it under control, lest after preaching to others I myself should be disqualified.",
      reference: "1 Corinthians 9:27",
    },
    practice: "Identify one specific appetite -- food, attention, entertainment, anger, lust -- that is currently governing your behavior more than your convictions are, and build one concrete boundary around it this week.",
    ruleOfLife: { rhythm: "Presence", path: "/rule-of-life/presence" },
  },
};
```

- [ ] **Step 2: Verify data integrity**

Open browser console and run:
```javascript
// Paste fruitAssessmentData.js contents, then:
console.log("Question count:", QUESTIONS.length); // Must be 27
console.log("Reverse count:", QUESTIONS.filter(q => q.reverse).length); // Must be 9
console.log("Fruit count:", Object.keys(FRUITS).length); // Must be 9
// Verify each fruit has exactly 3 questions:
FRUIT_ORDER.forEach(k => {
  const qs = QUESTIONS.filter(q => q.fruitKey === k);
  console.log(k, qs.length); // Each must be 3
});
```

- [ ] **Step 3: Commit**

```bash
git add src/fruitAssessmentData.js
git commit -m "feat: add fruit assessment data file (27 questions, 9 fruits)"
```

---

## Task 2: Component shell — state, CSS, scoring logic

**Files:**
- Create: `src/FruitAssessment.jsx` (skeleton only, no screens yet)

- [ ] **Step 1: Create the component skeleton**

```jsx
// src/FruitAssessment.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QUESTIONS, FRUITS, FRUIT_ORDER, CLUSTER_THRESHOLD, SCALE_OPTIONS } from "./fruitAssessmentData";

/* ─── CONSTANTS ──────────────────────────────────────────────────────── */

const C = {
  bg:         "#06050A",
  bgSurf:     "#0E0C0A",
  bgCard:     "#17140F",
  gold:       "#C9A84C",
  goldSoft:   "rgba(201,168,76,0.45)",
  goldFaint:  "rgba(201,168,76,0.15)",
  goldMid:    "rgba(201,168,76,0.08)",
  ivory:      "#FAF8F5",
  ivoryDim:   "rgba(250,248,245,0.62)",
  ivoryFaint: "rgba(250,248,245,0.28)",
  ivoryBar:   "rgba(250,248,245,0.45)",
};

const F = {
  brand: "'Michroma', sans-serif",
  body:  "'Inter', sans-serif",
  serif: "'Cormorant Garamond', serif",
};

const LS_KEY       = "cf-fruit-assessment";
const LS_DRAFT_KEY = "cf-fruit-assessment-draft";

/* ─── INJECTED STYLES ─────────────────────────────────────────────────── */

const FA_CSS = `
  .fa-shell {
    min-height: 100vh;
    background: #06050A;
    color: #FAF8F5;
    position: relative;
    overflow-x: hidden;
  }
  /* Mount fade-up animations (staggered) */
  .fa-up-0 { animation: faUp .65s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-1 { animation: faUp .65s .10s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-2 { animation: faUp .65s .20s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-3 { animation: faUp .65s .30s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-4 { animation: faUp .65s .40s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-5 { animation: faUp .65s .50s cubic-bezier(.16,1,.3,1) both; }
  .fa-up-6 { animation: faUp .65s .60s cubic-bezier(.16,1,.3,1) both; }
  @keyframes faUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Question transition */
  .fa-q-exit-left  { opacity: 0 !important; transform: translateX(-20px) !important; }
  .fa-q-exit-right { opacity: 0 !important; transform: translateX(20px) !important; }
  .fa-q-enter-from-right { animation: faEnterRight .20s ease forwards; }
  .fa-q-enter-from-left  { animation: faEnterLeft .20s ease forwards; }
  @keyframes faEnterRight {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes faEnterLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  /* Progress bar */
  .fa-progress-track {
    height: 2px;
    background: rgba(201,168,76,0.15);
    width: 100%;
    position: relative;
  }
  .fa-progress-fill {
    position: absolute;
    top: 0; left: 0;
    height: 100%;
    background: #C9A84C;
    transition: width 600ms ease-in-out;
  }
  /* Chart bar */
  .fa-bar-track {
    height: 4px;
    background: rgba(250,248,245,0.08);
    border-radius: 2px;
    overflow: hidden;
    flex: 1;
  }
  .fa-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 800ms ease-out;
  }
  /* Helmet pulse (processing screen) */
  @keyframes faPulse {
    0%, 100% { transform: scale(1);    opacity: 0.4; }
    50%       { transform: scale(1.08); opacity: 0.7; }
  }
  .fa-helmet-pulse { animation: faPulse 2.4s ease-in-out infinite; }
`;

export function FAStyles() {
  return <style dangerouslySetInnerHTML={{ __html: FA_CSS }} />;
}

/* ─── SCORING ─────────────────────────────────────────────────────────── */

export function calculateScores(answers) {
  const totals = {};
  FRUIT_ORDER.forEach(k => { totals[k] = 0; });

  QUESTIONS.forEach((q, i) => {
    const raw = answers[i] ?? 3; // default to midpoint if somehow null
    const effective = q.reverse ? (7 - raw) : raw;
    totals[q.fruitKey] += effective;
  });

  // Normalize: rawScore range 3–18 → 0–100
  const normalized = {};
  FRUIT_ORDER.forEach(k => {
    normalized[k] = Math.round(((totals[k] - 3) / 15) * 100);
  });
  return normalized;
}

export function identifyFormationArea(scores) {
  const entries = Object.entries(scores);
  const lowest = Math.min(...entries.map(([, s]) => s));
  // Tie-break: alphabetical by key
  const primary = entries
    .filter(([, s]) => s === lowest)
    .sort(([a], [b]) => a.localeCompare(b))[0][0];
  const cluster = entries
    .filter(([k, s]) => s <= lowest + CLUSTER_THRESHOLD && k !== primary)
    .map(([k]) => k);
  return { primaryFruit: primary, cluster };
}

function formatDate(isoString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
  }).format(new Date(isoString));
}

function daysAgo(isoString) {
  return Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24));
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────── */

export default function FruitAssessment() {
  // Screen state
  const [screen, setScreen]               = useState("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers]             = useState(Array(27).fill(null));
  const [scores, setScores]               = useState(null);
  const [primaryFruit, setPrimaryFruit]   = useState(null);
  const [cluster, setCluster]             = useState([]);
  const [previousResult, setPreviousResult] = useState(null);
  const [isDeltaMode, setIsDeltaMode]     = useState(false);
  const [shareOpen, setShareOpen]         = useState(false);
  const [shareFormat, setShareFormat]     = useState("square");
  // Question transition state
  const [qExitClass, setQExitClass]       = useState("");
  const [qEnterClass, setQEnterClass]     = useState("");
  const [qTransitioning, setQTransitioning] = useState(false);

  useEffect(() => { document.title = "Fruit of the Spirit Assessment · Counter Formation"; }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.current) {
          setPreviousResult(parsed.current);
          setScreen("pre-intro");
        }
      }
      // Clear any stale draft (v1: no resume)
      localStorage.removeItem(LS_DRAFT_KEY);
    } catch {}
  }, []);

  // Save draft on answer changes
  useEffect(() => {
    if (screen !== "questions") return;
    if (!answers.some(a => a !== null)) return;
    try {
      localStorage.setItem(LS_DRAFT_KEY, JSON.stringify({ answers, currentQuestion }));
    } catch {}
  }, [answers, currentQuestion, screen]);

  function completeAssessment(finalAnswers) {
    const sc = calculateScores(finalAnswers);
    const { primaryFruit: pf, cluster: cl } = identifyFormationArea(sc);
    const newResult = {
      completedAt: new Date().toISOString(),
      answers: finalAnswers,
      scores: sc,
      primaryFruit: pf,
      cluster: cl,
    };
    try {
      const existing = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      localStorage.setItem(LS_KEY, JSON.stringify({
        current: newResult,
        previous: existing.current || null,
      }));
      localStorage.removeItem(LS_DRAFT_KEY);
    } catch {}
    setScores(sc);
    setPrimaryFruit(pf);
    setCluster(cl);
    setScreen("processing");
  }

  function goNext() {
    if (qTransitioning) return;
    const q = currentQuestion;
    setQExitClass("fa-q-exit-left");
    setQTransitioning(true);
    setTimeout(() => {
      if (q < 26) {
        setCurrentQuestion(q + 1);
        setQExitClass("");
        setQEnterClass("fa-q-enter-from-right");
        setQTransitioning(false);
        setTimeout(() => setQEnterClass(""), 220);
      } else {
        completeAssessment(answers);
      }
    }, 210);
  }

  function goBack() {
    if (qTransitioning || currentQuestion === 0) return;
    setQExitClass("fa-q-exit-right");
    setQTransitioning(true);
    setTimeout(() => {
      setCurrentQuestion(q => q - 1);
      setQExitClass("");
      setQEnterClass("fa-q-enter-from-left");
      setQTransitioning(false);
      setTimeout(() => setQEnterClass(""), 220);
    }, 210);
  }

  function selectAnswer(value) {
    setAnswers(prev => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
  }

  // Keyboard support
  useEffect(() => {
    if (screen !== "questions") return;
    function onKey(e) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 6) { selectAnswer(n); return; }
      if ((e.key === "Enter" || e.key === "ArrowRight") && answers[currentQuestion] !== null) goNext();
      if (e.key === "ArrowLeft") goBack();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, currentQuestion, answers, qTransitioning]);

  const qProps = { qExitClass, qEnterClass, answers, currentQuestion, selectAnswer, goNext, goBack, qTransitioning };
  const rProps = { scores, primaryFruit, cluster, previousResult, isDeltaMode, setShareOpen };

  return (
    <div className="fa-shell">
      {screen === "pre-intro"  && <PreIntroScreen previous={previousResult} onView={() => {
          setScores(previousResult.scores);
          setPrimaryFruit(previousResult.primaryFruit);
          setCluster(previousResult.cluster || []);
          setScreen("results");
        }} onRetake={() => {
          setAnswers(Array(27).fill(null));
          setCurrentQuestion(0);
          setIsDeltaMode(false);
          setScreen("intro");
        }} onDelta={() => {
          setAnswers(Array(27).fill(null));
          setCurrentQuestion(0);
          setIsDeltaMode(true);
          setScreen("intro");
        }} />}
      {screen === "intro"      && <IntroScreen onBegin={() => setScreen("questions")} />}
      {screen === "questions"  && <QuestionScreen {...qProps} />}
      {screen === "processing" && <ProcessingScreen onDone={() => setScreen("results")} />}
      {screen === "results"    && <ResultsScreen {...rProps} />}
      {shareOpen && <ShareModal fruit={primaryFruit ? FRUITS[primaryFruit] : null} format={shareFormat} setFormat={setShareFormat} onClose={() => setShareOpen(false)} />}
    </div>
  );
}

/* ─── SCREEN PLACEHOLDERS (to be filled in subsequent tasks) ─────────── */

function PreIntroScreen()  { return <div style={{ color: "#FAF8F5", padding: 40 }}>Pre-Intro</div>; }
function IntroScreen()     { return <div style={{ color: "#FAF8F5", padding: 40 }}>Intro</div>; }
function QuestionScreen()  { return <div style={{ color: "#FAF8F5", padding: 40 }}>Questions</div>; }
function ProcessingScreen(){ return <div style={{ color: "#FAF8F5", padding: 40 }}>Processing</div>; }
function ResultsScreen()   { return <div style={{ color: "#FAF8F5", padding: 40 }}>Results</div>; }
function ShareModal()      { return null; }
```

- [ ] **Step 2: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add FruitAssessment component shell with state and scoring"
```

---

## Task 3: Wire App.jsx (route) — do this now so screens are testable in browser

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import at the top of App.jsx** (after existing imports, around line 30)

```jsx
import FruitAssessment, { FAStyles } from "./FruitAssessment";
```

- [ ] **Step 2: Add `<FAStyles />` to the App return** (immediately after `<FieldGuideStyles />`, around line 1812)

```jsx
<FieldGuideStyles />
<FAStyles />
```

- [ ] **Step 3: Add route** (after the Field Guide devotion-guide route, around line 1829)

```jsx
<Route path="/field-guide/devotion-guide" element={<DevotionGuide />} />
<Route path="/field-guide/fruit-assessment" element={<FruitAssessment />} />
```

- [ ] **Step 4: Verify in browser**

Navigate to `http://localhost:5173/field-guide/fruit-assessment`. You should see a dark page with placeholder text "Intro" (since no previous result exists in localStorage).

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: register /field-guide/fruit-assessment route"
```

---

## Task 4: Pre-Intro screen (Screen 0)

**Files:**
- Modify: `src/FruitAssessment.jsx` — replace `PreIntroScreen` placeholder

- [ ] **Step 1: Replace the PreIntroScreen placeholder function**

Find and replace:
```jsx
function PreIntroScreen()  { return <div style={{ color: "#FAF8F5", padding: 40 }}>Pre-Intro</div>; }
```

With:
```jsx
function PreIntroScreen({ previous, onView, onRetake, onDelta }) {
  const isPast14Days = daysAgo(previous.completedAt) >= 14;
  const fruit = FRUITS[previous.primaryFruit];
  const Btn = ({ onClick, soft, children }) => (
    <button onClick={onClick} style={{
      display: "block", width: "100%", padding: "14px 24px",
      border: `1px solid ${soft ? C.goldSoft : C.gold}`,
      background: "transparent", color: soft ? C.ivoryDim : C.gold,
      fontFamily: F.brand, fontSize: 12, letterSpacing: "0.28em",
      textTransform: "uppercase", cursor: "pointer",
      transition: "background 0.2s ease",
    }} onMouseEnter={e => e.currentTarget.style.background = C.goldMid}
       onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      {children}
    </button>
  );
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: 520, width: "100%", textAlign: "center" }}>
        <div className="fa-up-0" style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 24 }}>
          Welcome Back
        </div>
        <h1 className="fa-up-1" style={{ fontFamily: F.brand, fontSize: 28, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginBottom: 32, lineHeight: 1.3 }}>
          Your Formation Continues
        </h1>
        <p className="fa-up-2" style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: C.ivoryDim, lineHeight: 1.7, marginBottom: 40 }}>
          You completed this assessment on {formatDate(previous.completedAt)}. Your current area of formation was {fruit ? fruit.label : previous.primaryFruit}. The Spirit is still at work. You can revisit your last results, retake the assessment fresh, or see how you have moved.
        </p>
        <div className="fa-up-3" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Btn onClick={onView}>View Previous Results</Btn>
          <Btn onClick={onRetake} soft>Retake the Assessment</Btn>
          {isPast14Days && (
            <Btn onClick={onDelta} soft>See How I Have Moved</Btn>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Test in browser**

Set localStorage manually to trigger the pre-intro:
```javascript
localStorage.setItem("cf-fruit-assessment", JSON.stringify({
  current: {
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    answers: Array(27).fill(4),
    scores: { love:72, joy:45, peace:38, patience:51, kindness:66, goodness:58, faithfulness:43, gentleness:60, self_control:35 },
    primaryFruit: "self_control",
    cluster: ["peace","faithfulness"]
  },
  previous: null
}));
```

Reload. You should see the pre-intro screen with all three buttons (since the date is 20 days ago).

- [ ] **Step 3: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add pre-intro retake-aware screen"
```

---

## Task 5: Introduction screen (Screen 1)

**Files:**
- Modify: `src/FruitAssessment.jsx` — replace `IntroScreen` placeholder

- [ ] **Step 1: Replace IntroScreen placeholder**

Find and replace:
```jsx
function IntroScreen()     { return <div style={{ color: "#FAF8F5", padding: 40 }}>Intro</div>; }
```

With:
```jsx
function IntroScreen({ onBegin }) {
  const FRUIT_NAMES = ["LOVE","JOY","PEACE","PATIENCE","KINDNESS","GOODNESS","FAITHFULNESS","GENTLENESS","SELF-CONTROL"];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 24px", position: "relative", overflow: "hidden" }}>
      {/* Background fruit name texture — desktop only */}
      <div style={{
        position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", gap: 16, opacity: 0.05,
        pointerEvents: "none",
      }}>
        {FRUIT_NAMES.map(n => (
          <span key={n} style={{ fontFamily: F.brand, fontSize: 13, letterSpacing: "0.4em", textTransform: "uppercase", color: C.ivory, whiteSpace: "nowrap" }}>{n}</span>
        ))}
      </div>

      <div style={{ maxWidth: 640, width: "100%", position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <div className="fa-up-0" style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 20 }}>
          Field Guide &middot; Fruit of the Spirit
        </div>

        {/* Heading */}
        <h1 className="fa-up-1" style={{ fontFamily: F.brand, fontSize: "clamp(28px,5vw,36px)", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, lineHeight: 1.3, marginBottom: 32 }}>
          Where Is the Spirit Working in You?
        </h1>

        {/* Gold rule */}
        <div className="fa-up-2" style={{ width: 48, height: 1, background: C.goldFaint, marginBottom: 32 }} />

        {/* First paragraph */}
        <p className="fa-up-2" style={{ fontFamily: F.body, fontWeight: 300, fontSize: 17, color: C.ivory, lineHeight: 1.8, marginBottom: 24 }}>
          Paul wrote about the fruit of the Spirit in the singular. Not fruits. One fruit, with nine qualities, growing in proportion to abiding in Christ. Where you find deficiency in any of them, you are not discovering a fixed trait. You are finding an area where the Spirit has more room to work right now.
        </p>

        {/* Second paragraph */}
        <p className="fa-up-3" style={{ fontFamily: F.body, fontWeight: 300, fontSize: 17, color: C.ivory, lineHeight: 1.8, marginBottom: 40 }}>
          This is not a personality quiz. It is 27 behavioral questions designed for honest self-report, not self-idealization. The goal is not to categorize you. The goal is to show you where formation is most needed -- and to give you one concrete practice for the week ahead.
        </p>

        {/* Scripture block */}
        <div className="fa-up-4" style={{ maxWidth: 520, margin: "0 auto 40px", textAlign: "center" }}>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: C.ivory, lineHeight: 1.6, margin: "0 0 16px" }}>
            &ldquo;But the fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control.&rdquo;
          </p>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase" }}>
            Galatians 5:22&ndash;23
          </div>
        </div>

        {/* CTA */}
        <div className="fa-up-5" style={{ textAlign: "center" }}>
          <button onClick={onBegin} style={{
            padding: "18px 40px", border: `1px solid ${C.gold}`, background: "transparent",
            color: C.gold, fontFamily: F.brand, fontSize: 13, letterSpacing: "0.28em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.goldMid}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Begin Assessment
          </button>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, marginTop: 16 }}>
            27 questions &middot; approximately 6 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Clear localStorage, navigate to `/field-guide/fruit-assessment`. You should see the intro screen with the eyebrow, heading, both paragraphs, scripture, CTA button, and metadata. The background fruit name texture should be barely visible on wider screens.

- [ ] **Step 3: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add assessment introduction screen"
```

---

## Task 6: Question flow (Screen 2)

**Files:**
- Modify: `src/FruitAssessment.jsx` — replace `QuestionScreen` placeholder

- [ ] **Step 1: Replace QuestionScreen placeholder**

Find and replace:
```jsx
function QuestionScreen()  { return <div style={{ color: "#FAF8F5", padding: 40 }}>Questions</div>; }
```

With:
```jsx
function QuestionScreen({ qExitClass, qEnterClass, answers, currentQuestion, selectAnswer, goNext, goBack, qTransitioning }) {
  const q = QUESTIONS[currentQuestion];
  const selected = answers[currentQuestion];
  const progress = ((currentQuestion + 1) / 27) * 100;
  const isLast = currentQuestion === 26;
  const canAdvance = selected !== null && !qTransitioning;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", padding: "32px 24px" }}>
      {/* Progress zone */}
      <div style={{ maxWidth: 640, width: "100%", margin: "0 auto 48px" }}>
        <div className="fa-progress-track">
          <div className="fa-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivoryDim, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 12 }}>
          Question {currentQuestion + 1} of 27
        </div>
      </div>

      {/* Question + answers zone */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 640, width: "100%", margin: "0 auto" }}>
        <div
          className={`${qExitClass} ${qEnterClass}`}
          style={{ transition: "opacity 0.21s ease, transform 0.21s ease" }}
        >
          {/* Question text */}
          <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: "clamp(19px,2.5vw,22px)", color: C.ivory, lineHeight: 1.55, marginBottom: 48 }}>
            {q.text}
          </p>

          {/* Answer options */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SCALE_OPTIONS.map(opt => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => selectAnswer(opt.value)}
                  style={{
                    width: "100%", maxWidth: 640,
                    padding: "20px 24px", textAlign: "left",
                    border: `1px solid ${isSelected ? C.gold : C.goldFaint}`,
                    background: isSelected ? C.goldMid : "transparent",
                    color: C.ivory, fontFamily: F.body, fontWeight: 400, fontSize: 15,
                    cursor: "pointer", transition: "border-color 0.2s ease, background 0.2s ease",
                  }}
                  onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.goldSoft; e.currentTarget.style.background = "rgba(201,168,76,0.04)"; } }}
                  onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = C.goldFaint; e.currentTarget.style.background = "transparent"; } }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation zone */}
      <div style={{ maxWidth: 640, width: "100%", margin: "32px auto 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {currentQuestion > 0 ? (
          <button onClick={goBack} style={{
            background: "none", border: "none", color: C.ivoryDim, fontFamily: F.body,
            fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", padding: "8px 0",
          }}>
            &larr; Back
          </button>
        ) : <span />}

        <button
          onClick={goNext}
          disabled={!canAdvance}
          style={{
            padding: "16px 36px", border: `1px solid ${C.gold}`, background: "transparent",
            color: C.gold, fontFamily: F.brand, fontSize: 13, letterSpacing: "0.28em",
            textTransform: "uppercase", cursor: canAdvance ? "pointer" : "not-allowed",
            opacity: canAdvance ? 1 : 0.4, transition: "background 0.2s ease, opacity 0.2s ease",
          }}
          onMouseEnter={e => { if (canAdvance) e.currentTarget.style.background = C.goldMid; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          {isLast ? "Complete Assessment \u2192" : "Next \u2192"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Click "Begin Assessment." You should see:
- Progress bar at ~4% width (question 1 of 27)
- Question 1 text (Love)
- Six answer options, vertically stacked
- "Next" button disabled (no border glow when option not selected)
- Select an answer: button highlights with gold border and faint gold background
- "Next" button becomes active
- Click Next: smooth slide-left exit, new question fades in from right
- "Back" appears on question 2, navigates backwards with reversed slide direction
- Number keys 1-6 select answers
- Enter key advances when answer selected

- [ ] **Step 3: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add question flow screen with transitions and keyboard support"
```

---

## Task 7: Processing screen (Screen 3)

**Files:**
- Modify: `src/FruitAssessment.jsx` — replace `ProcessingScreen` placeholder

- [ ] **Step 1: Replace ProcessingScreen placeholder**

Find and replace:
```jsx
function ProcessingScreen(){ return <div style={{ color: "#FAF8F5", padding: 40 }}>Processing</div>; }
```

With:
```jsx
function ProcessingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px",
    }}>
      <img
        src="/helmet.png"
        alt=""
        className="fa-helmet-pulse"
        style={{ width: 48, height: 48, filter: "invert(1) grayscale(1)", opacity: 0.4, marginBottom: 40 }}
      />
      <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: C.ivory, textAlign: "center", maxWidth: 440, lineHeight: 1.6, margin: "0 0 16px" }}>
        &ldquo;Be still, and know that I am God.&rdquo;
      </p>
      <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase" }}>
        Psalm 46:10
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Complete a full run of 27 questions (click through quickly). The processing screen should appear with the pulsing helmet mark, the scripture, and then auto-advance to the results placeholder after 3 seconds.

- [ ] **Step 3: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add processing screen with 3s auto-advance"
```

---

## Task 8: Results screen — header + profile chart

**Files:**
- Modify: `src/FruitAssessment.jsx` — replace `ResultsScreen` placeholder (first half)

The results screen is the most complex. Build it in two steps.

- [ ] **Step 1: Replace ResultsScreen placeholder with header + chart + primary fruit block**

Find and replace:
```jsx
function ResultsScreen()   { return <div style={{ color: "#FAF8F5", padding: 40 }}>Results</div>; }
```

With:
```jsx
function ResultsScreen({ scores, primaryFruit, cluster, previousResult, isDeltaMode, setShareOpen }) {
  const [barsVisible, setBarsVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setBarsVisible(true), 100); return () => clearTimeout(t); }, []);

  if (!scores || !primaryFruit) return null;
  const fruit = FRUITS[primaryFruit];

  // Sort fruits high to low for chart
  const sorted = [...Object.entries(scores)].sort(([, a], [, b]) => b - a);
  const lowest = Math.min(...Object.values(scores));

  const has7Day = (() => { try { return !!localStorage.getItem("cf-challenge-progress"); } catch { return false; } })();

  const Divider = ({ mt = 80, mb = 80 }) => (
    <div style={{ display: "flex", justifyContent: "center", margin: `${mt}px 0 ${mb}px` }}>
      <div style={{ width: 64, height: 1, background: C.goldFaint }} />
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: "96px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Section A — Header */}
        <div className="fa-up-0" style={{ marginBottom: 56, textAlign: "center" }}>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
            Your Formation Profile
          </div>
          <h1 style={{ fontFamily: F.brand, fontSize: "clamp(26px,4vw,32px)", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginTop: 16, marginBottom: 20 }}>
            Where the Spirit Is at Work
          </h1>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 16, color: C.ivoryDim, lineHeight: 1.7, maxWidth: 520, margin: "0 auto" }}>
            This is where the Spirit is at work in you -- and where He has the most room.
          </p>
        </div>

        {/* Section B — Profile chart */}
        <div className="fa-up-1" style={{ marginBottom: 80 }}>
          {sorted.map(([key, score], i) => {
            const isPrimary = key === primaryFruit;
            const isCluster = cluster.includes(key);
            const barColor = (isPrimary || isCluster) ? C.gold : C.ivoryBar;
            return (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 16, height: 40, marginBottom: 4 }}>
                <div style={{ width: 120, textAlign: "right", fontFamily: F.body, fontWeight: 400, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: isPrimary ? C.ivory : C.ivoryDim, flexShrink: 0 }}>
                  {FRUITS[key].label}
                </div>
                <div className="fa-bar-track" style={{ flex: 1 }}>
                  <div
                    className="fa-bar-fill"
                    style={{
                      width: barsVisible ? `${score}%` : "0%",
                      background: barColor,
                      transitionDelay: `${i * 80}ms`,
                    }}
                  />
                </div>
                <div style={{ width: 40, fontFamily: F.body, fontWeight: 300, fontSize: 13, color: isPrimary ? C.ivory : C.ivoryDim, flexShrink: 0 }}>
                  {score}
                </div>
              </div>
            );
          })}
        </div>

        <Divider mt={0} mb={80} />

        {/* Section D — Primary Fruit Block */}
        <div className="fa-up-2" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase" }}>
            Your Current Area of Formation
          </div>
          <h2 style={{ fontFamily: F.brand, fontSize: "clamp(32px,5vw,42px)", letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginTop: 20, marginBottom: 8 }}>
            {fruit.label}
          </h2>
          <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 18, color: C.ivoryDim, margin: "0 0 40px" }}>
            {fruit.greek}
          </p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 17, color: C.ivory, lineHeight: 1.85, maxWidth: 560, margin: "0 auto 40px", textAlign: "center" }}>
            {fruit.formationStatement}
          </p>
          {/* Scripture */}
          <div style={{ maxWidth: 520, margin: "0 auto 40px", textAlign: "center" }}>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 22, color: C.ivory, lineHeight: 1.6, margin: "0 0 12px" }}>
              &ldquo;{fruit.scripture.text}&rdquo;
            </p>
            <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.gold, textTransform: "uppercase" }}>
              {fruit.scripture.reference}
            </div>
          </div>
          {/* Practice */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 16 }}>
              This Week
            </div>
            <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 16, color: C.ivory, lineHeight: 1.7, maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
              {fruit.practice}
            </p>
          </div>
        </div>

        {/* Section E — Cluster block (conditional) */}
        {cluster.length > 0 && (
          <div className="fa-up-3" style={{ marginTop: 56, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ width: 48, height: 1, background: C.goldFaint }} />
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.goldSoft, textTransform: "uppercase" }}>
              Close Behind
            </div>
            <div style={{ fontFamily: F.brand, fontSize: 18, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivoryDim, marginTop: 12 }}>
              {cluster.map(k => FRUITS[k].label).join(" \u00B7 ")}
            </div>
            <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 15, color: C.ivoryDim, lineHeight: 1.75, maxWidth: 500, margin: "20px auto 0", textAlign: "center" }}>
              These fruits scored close to your primary area of formation. They likely share a common root -- working on the primary often moves all of them together.
            </p>
          </div>
        )}

        {/* Section F — Delta block (conditional) */}
        {isDeltaMode && previousResult && (() => {
          const prev = previousResult.scores;
          const dayCount = daysAgo(previousResult.completedAt);
          const primaryChanged = previousResult.primaryFruit !== primaryFruit;
          return (
            <div className="fa-up-4" style={{ marginTop: 56, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
                <div style={{ width: 48, height: 1, background: C.goldFaint }} />
              </div>
              <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.28em", color: C.goldSoft, textTransform: "uppercase" }}>
                Since Your Last Assessment
              </div>
              <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, marginTop: 8 }}>
                {dayCount} days ago
              </div>
              <div style={{ marginTop: 32 }}>
                {FRUIT_ORDER.map(k => {
                  const diff = scores[k] - (prev[k] || 0);
                  const big = Math.abs(diff) >= 5;
                  const arrow = diff >= 5 ? "\u2197" : diff <= -5 ? "\u2198" : "\u2192";
                  const arrowColor = diff >= 5 ? C.gold : C.ivoryFaint;
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                      <div style={{ width: 120, textAlign: "right", fontFamily: F.body, fontWeight: 400, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.12em", color: C.ivoryDim }}>{FRUITS[k].label}</div>
                      <div style={{ width: 40, textAlign: "right", fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivoryFaint }}>{prev[k] || "--"}</div>
                      <div style={{ width: 20, textAlign: "center", fontSize: 14, color: arrowColor }}>{arrow}</div>
                      <div style={{ width: 40, fontFamily: F.body, fontWeight: 300, fontSize: 12, color: C.ivory }}>{scores[k]}</div>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: primaryChanged ? C.ivory : C.ivoryDim, maxWidth: 480, margin: "32px auto 0", textAlign: "center", lineHeight: 1.7 }}>
                {primaryChanged
                  ? `Your area of formation has shifted from ${FRUITS[previousResult.primaryFruit]?.label || previousResult.primaryFruit} to ${fruit.label}.`
                  : `Your area of formation is still ${fruit.label}.`}
              </p>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, marginTop: 8, textAlign: "center" }}>
                {primaryChanged ? "This is what abiding looks like over time. Keep going." : "Formation is slow work. The Spirit is not in a hurry."}
              </p>
            </div>
          );
        })()}

        {/* Section G — Navigation CTAs */}
        <div className="fa-up-5" style={{ marginTop: 64, display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          <button onClick={() => setShareOpen(true)} style={{
            padding: "16px 28px", border: `1px solid ${C.gold}`, background: "transparent",
            color: C.gold, fontFamily: F.brand, fontSize: 12, letterSpacing: "0.28em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.goldMid}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Share This
          </button>
          {!has7Day && (
            <Link to="/7-day-challenge" style={{
              padding: "16px 28px", border: "none", background: "transparent",
              color: C.ivoryDim, fontFamily: F.body, fontSize: 13, letterSpacing: "0.16em",
              textTransform: "uppercase", textDecoration: "underline", cursor: "pointer",
              display: "inline-flex", alignItems: "center",
            }}>
              Begin the 7-Day Challenge &rarr;
            </Link>
          )}
        </div>

        {/* Section H — Rule of Life crosslink */}
        <div className="fa-up-6" style={{ marginTop: 48, textAlign: "center" }}>
          <Link to={fruit.ruleOfLife.path} style={{
            fontFamily: F.body, fontWeight: 300, fontSize: 13, color: C.ivoryDim, textDecoration: "none",
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.gold}
          onMouseLeave={e => e.currentTarget.style.color = C.ivoryDim}>
            This connects to the <span style={{ color: C.gold }}>{fruit.ruleOfLife.rhythm}</span> rhythm in your Rule of Life &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

Complete the assessment (or use the mock localStorage from Task 4 and click "View Previous Results"). Verify:
- Chart bars animate in staggered sequence (0% to score width over 800ms)
- Primary fruit bar is gold, others ivory
- Cluster bar(s) are also gold
- Formation statement, scripture, and practice are correct for the primary fruit
- Cluster block appears only when cluster array is non-empty
- Rule of Life crosslink shows correct rhythm and navigates correctly

- [ ] **Step 3: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add results screen with chart and formation output"
```

---

## Task 9: Shareable card (Screen 5 — modal + canvas)

**Files:**
- Modify: `src/FruitAssessment.jsx` — replace `ShareModal` placeholder

- [ ] **Step 1: Replace ShareModal placeholder**

Find and replace:
```jsx
function ShareModal()      { return null; }
```

With:
```jsx
function ShareModal({ fruit, format, setFormat, onClose }) {
  const canvasRef = useRef(null);
  const [rendering, setRendering] = useState(false);
  const [shareError, setShareError] = useState("");

  useEffect(() => {
    if (fruit) renderCard();
  }, [fruit, format]);

  async function renderCard() {
    if (!canvasRef.current || !fruit) return;
    setRendering(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const dims = format === "square" ? { w: 1080, h: 1080 } : { w: 1080, h: 1920 };

    canvas.width  = dims.w * dpr;
    canvas.height = dims.h * dpr;
    canvas.style.width  = `${dims.w / 2}px`;
    canvas.style.height = `${dims.h / 2}px`;
    ctx.scale(dpr, dpr);

    // Load fonts before drawing
    try {
      await Promise.all([
        document.fonts.load(`italic 700 72px 'Cormorant Garamond'`),
        document.fonts.load(`400 20px 'Michroma'`),
        document.fonts.load(`300 18px 'Inter'`),
      ]);
    } catch {}

    const W = dims.w, H = dims.h;
    const isStory = format === "story";
    const padTop = isStory ? 200 : 88;
    const padBot = isStory ? 160 : 64;
    const fruitFontSize = isStory ? 88 : 72;

    // Background
    ctx.fillStyle = "#06050A";
    ctx.fillRect(0, 0, W, H);

    // Eyebrow
    ctx.fillStyle = "#C9A84C";
    ctx.font = `400 20px 'Michroma', sans-serif`;
    ctx.textAlign = "center";
    ctx.letterSpacing = "0.44em";
    ctx.fillText("COUNTER FORMATION  ·  FRUIT OF THE SPIRIT", W / 2, padTop);

    // Gold rule
    ctx.strokeStyle = "#C9A84C";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 40, padTop + 40);
    ctx.lineTo(W / 2 + 40, padTop + 40);
    ctx.stroke();

    // Middle content — vertically centered
    const midY = isStory ? H / 2 - 120 : H / 2 - 80;

    // "I am cultivating" — Cormorant Garamond italic
    ctx.fillStyle = "#FAF8F5";
    ctx.font = `italic 400 48px 'Cormorant Garamond', serif`;
    ctx.fillText("I am cultivating", W / 2, midY);

    // Fruit name — gold, larger
    ctx.fillStyle = "#C9A84C";
    ctx.font = `italic 700 ${fruitFontSize}px 'Cormorant Garamond', serif`;
    ctx.fillText(fruit.label, W / 2, midY + fruitFontSize + 12);

    // Sub-copy
    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = `300 18px 'Inter', sans-serif`;
    ctx.fillText("Not as a personality type. As an act of surrender.", W / 2, midY + fruitFontSize + 76);

    // Scripture (wrap at ~720px)
    const scriptY = midY + fruitFontSize + 140;
    ctx.fillStyle = "rgba(250,248,245,0.62)";
    ctx.font = `italic 400 22px 'Cormorant Garamond', serif`;
    const scriptText = `"${fruit.scripture.text}"`;
    wrapText(ctx, scriptText, W / 2, scriptY, 720, 34);

    // Scripture reference
    const refY = scriptY + Math.ceil(scriptText.length / 60) * 34 + 20;
    ctx.fillStyle = "#C9A84C";
    ctx.font = `400 14px 'Michroma', sans-serif`;
    ctx.fillText(fruit.scripture.reference.toUpperCase(), W / 2, refY);

    // Bottom — helmet + domain
    try {
      const helmetImg = new Image();
      helmetImg.src = "/helmet.png";
      await new Promise((res, rej) => { helmetImg.onload = res; helmetImg.onerror = rej; });
      // Draw inverted (white) helmet
      const hSize = 40;
      const hX = W / 2 - hSize / 2;
      const hY = H - padBot - hSize - 24;
      const off = document.createElement("canvas");
      off.width = helmetImg.width; off.height = helmetImg.height;
      const offCtx = off.getContext("2d");
      offCtx.filter = "invert(1)";
      offCtx.drawImage(helmetImg, 0, 0);
      ctx.drawImage(off, hX, hY, hSize, hSize);

      ctx.fillStyle = "rgba(250,248,245,0.62)";
      ctx.font = `300 14px 'Inter', sans-serif`;
      ctx.letterSpacing = "0.24em";
      ctx.fillText("COUNTERFORMED.COM", W / 2, H - padBot);
    } catch {}

    setRendering(false);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let lineY = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + " ";
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, lineY);
        line = words[i] + " ";
        lineY += lineHeight;
      } else {
        line = test;
      }
    }
    ctx.fillText(line.trim(), x, lineY);
  }

  async function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `cf-fruit-${fruit?.key || "formation"}.png`;
    a.click();
  }

  async function handleShare() {
    if (!canvasRef.current) return;
    setShareError("");
    const url = canvasRef.current.toDataURL("image/png");
    const blob = await (await fetch(url)).blob();
    const file = new File([blob], `cf-fruit-${fruit?.key || "formation"}.png`, { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Counter Formation" });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setShareError("Image copied to clipboard.");
      }
    } catch {
      setShareError("Right-click the image above to save it.");
    }
  }

  const Pill = ({ label, active, onClick }) => (
    <button onClick={onClick} style={{
      padding: "6px 16px", border: `1px solid ${active ? C.gold : C.goldFaint}`,
      background: "transparent", color: active ? C.gold : C.ivoryDim,
      fontFamily: F.brand, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
      cursor: "pointer", transition: "all 0.2s ease", borderRadius: 999,
    }}>
      {label}
    </button>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(6,5,10,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "24px",
    }}>
      <div style={{
        maxWidth: 520, width: "100%", background: C.bgCard,
        border: `1px solid ${C.goldFaint}`, padding: "32px 24px",
        position: "relative", maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: 16, right: 16, background: "none", border: "none",
          color: C.ivoryDim, fontSize: 24, cursor: "pointer", padding: 8, lineHeight: 1,
        }}>
          &times;
        </button>

        {/* Header */}
        <div style={{ fontFamily: F.brand, fontSize: 11, letterSpacing: "0.32em", color: C.gold, textTransform: "uppercase", marginBottom: 8 }}>
          Share Your Formation
        </div>
        <h2 style={{ fontFamily: F.brand, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: C.ivory, marginBottom: 24 }}>
          Generate Your Card
        </h2>

        {/* Canvas preview */}
        <div style={{ textAlign: "center", marginBottom: 24, overflowX: "auto" }}>
          <canvas ref={canvasRef} style={{ display: "block", margin: "0 auto", maxWidth: "100%", height: "auto" }} />
        </div>

        {/* Format toggle */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          <Pill label="Square" active={format === "square"} onClick={() => setFormat("square")} />
          <Pill label="Story"  active={format === "story"}  onClick={() => setFormat("story")}  />
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
          <button onClick={handleDownload} style={{
            padding: "14px 24px", border: `1px solid ${C.gold}`, background: "transparent",
            color: C.gold, fontFamily: F.brand, fontSize: 12, letterSpacing: "0.28em",
            textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = C.goldMid}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Download PNG
          </button>
          <button onClick={handleShare} style={{
            padding: "14px 24px", border: "none", background: "transparent",
            color: C.ivory, fontFamily: F.body, fontSize: 13, cursor: "pointer",
          }}>
            Share
          </button>
        </div>
        {shareError && (
          <p style={{ fontFamily: F.body, fontSize: 13, color: C.ivoryDim, textAlign: "center", marginTop: 12 }}>
            {shareError}
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify in browser**

On the results screen, click "Share This." Verify:
- Modal opens with dark backdrop
- Canvas renders the card at ~540px wide preview (1080 / 2)
- Fruit name appears in gold italic
- Scripture text renders
- Square/Story toggle re-renders the canvas in different aspect ratio
- Download PNG saves a file
- Close button dismisses modal

- [ ] **Step 3: Commit**

```bash
git add src/FruitAssessment.jsx
git commit -m "feat: add shareable card canvas modal with download and Web Share API"
```

---

## Task 10: FieldGuide.jsx — add Fruit Assessment landing card

**Files:**
- Modify: `src/FieldGuide.jsx` — add tool card to `FGLanding`

- [ ] **Step 1: Add import for Link (already imported) and add a tools section to FGLanding**

In `FieldGuide.jsx`, find the closing of `FGLanding` (just before `</div></PageShell>`):

Find:
```jsx
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

      </div>
    </PageShell>
```

Replace with:
```jsx
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

        <GoldDivider mt={48} mb={48} />

        {/* Field Guide Tools — two-card grid */}
        <div className="fg-meta-grid fg-reveal">
          {/* Card 1: Scripture Before Scroll */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.goldDim}`, padding: 48, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>
              Field Guide
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ivory, marginBottom: 16 }}>
              Scripture Before Scroll
            </div>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
              A 7-day formation sequence for reordering your first attention -- before the algorithm gets it.
            </p>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 24, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              7 Days &middot; 5 Min Daily
            </div>
            <Link to={`${BASE}/today`} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, textDecoration: "none" }}>
              Begin Today&apos;s Office &rarr;
            </Link>
          </div>

          {/* Card 2: Fruit Assessment */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.goldDim}`, padding: 48, display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>
              Field Guide
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase", color: C.ivory, marginBottom: 16 }}>
              Fruit of the Spirit Assessment
            </div>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>
              A 27-question diagnostic that reveals where the Spirit has the most room to work in you right now. Built for honest self-report, not self-idealization.
            </p>
            <div style={{ fontSize: 13, color: C.dim, marginBottom: 24, fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              9 Fruits &middot; 27 Questions &middot; ~6 Min
            </div>
            <Link to="/field-guide/fruit-assessment" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: C.gold, textDecoration: "none" }}>
              Begin Assessment &rarr;
            </Link>
          </div>
        </div>

      </div>
    </PageShell>
```

- [ ] **Step 2: Verify in browser**

Navigate to `/field-guide/scripture-before-scroll`. Scroll to the bottom of the landing page. You should see two equal-width cards side by side on desktop (stacked on mobile): Scripture Before Scroll and Fruit of the Spirit Assessment. The Fruit Assessment card links to `/field-guide/fruit-assessment`.

- [ ] **Step 3: Commit**

```bash
git add src/FieldGuide.jsx
git commit -m "feat: add fruit assessment tool card to field guide landing"
```

---

## Task 11: End-to-end verification

Work through the checklist below. Each item is binary.

- [ ] **Functional checks**
  - Route `/field-guide/fruit-assessment` loads the intro screen
  - All 27 questions render in exact order from spec (spot-check Q1 = Love, Q9 = Self-Control, Q10 = Love reverse, Q27 = Self-Control)
  - Fruit name is NOT visible on the question screen
  - Six options render: Rarely → Almost Always
  - Selecting answer enables Next button; unselected = disabled
  - Progress bar fills proportionally (Q1 ≈ 4%, Q14 ≈ 52%, Q27 = 100%)
  - Back button hidden on Q1, visible Q2+
  - Keyboard: keys 1-6 select, Enter advances, ArrowLeft goes back
  - Q27 Next button reads "Complete Assessment"
  - Processing screen holds 3 seconds
  - Results chart has 9 bars in descending order
  - Primary fruit bar is gold; cluster bar(s) gold; others ivory
  - Formation statement, scripture, and practice match the data file verbatim
  - Cluster block shows/hides correctly (set answers so one fruit scores very close to lowest)
  - Share modal opens, canvas renders, Download PNG works
  - After completing: reload page -- pre-intro screen appears
  - Pre-intro "View Previous Results" jumps to results without retaking
  - Pre-intro "Retake" starts fresh
  - Pre-intro "See How I Have Moved" only appears if >14 days (test by setting `completedAt` 15+ days ago)
  - Delta block appears on results only in delta mode
  - Field Guide landing shows both tool cards

- [ ] **Scoring verification**

Open browser console at `/field-guide/fruit-assessment`. Complete the assessment clicking "Rarely" (1) for every answer. In console:
```javascript
const stored = JSON.parse(localStorage.getItem("cf-fruit-assessment"));
console.log("Scores:", stored.current.scores);
// All scores should be low. For a reverse-scored question, "Rarely" (1) → effective = 7-1 = 6,
// so fruits with reverse questions will score HIGHER than fruits without.
// Verify: no single fruit should score 100 when all answers are 1 (because reverse items prevent it).
```

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete Fruit of the Spirit Assessment component"
```

---

## Spec Self-Review Notes

After writing this plan, reviewed all sections of the master spec:

- **Part 3 theological framing**: All copy uses "where the Spirit has the most room to work" language. "Your current area of formation" used throughout. No "your fruit is X" language anywhere.
- **Part 4 methodology**: 6-point scale confirmed. Reverse scoring implemented in `calculateScores`. Cluster logic in `identifyFormationArea` with `CLUSTER_THRESHOLD = 8`. Delta block conditional on `isDeltaMode && previousResult`.
- **Part 5 questions**: All 27 in exact order. Reverse flags match spec. No fruit labels visible on question screen.
- **Part 6 UX flow**: All six states present (pre-intro, intro, questions, processing, results, share). Button behaviors match spec. Date formatted with `Intl.DateTimeFormat`. 14-day check for "See How I Have Moved."
- **Part 7 formation output**: All nine fruits included verbatim. No em dashes in copy (replaced with ` -- `).
- **Part 8 architecture**: File layout matches spec exactly. State shape matches spec. Core functions implemented as specified.
- **No em dashes**: Verified -- all copy uses ` -- ` or omits them entirely.
- **No html2canvas**: Native Canvas API used throughout.
- **No chart library**: Bar chart built with divs and CSS transitions.
- **Helmet mark**: `/helmet.png` loaded and inverted to white for canvas.
- **react-helmet-async**: Not installed -- replaced with `document.title` in `useEffect`.
