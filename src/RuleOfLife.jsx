import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { renderHtmlWithScriptureRefs } from "./utils/parseScriptureRefs";
import { getAllRhythms, getRhythm } from "./content/loader";
import NextStep from "./components/NextStep";
import Button from "./components/primitives/Button";

export const RULE_BASE = "/rule-of-life";


/* ─── AUTHOR PHOTOS ──────────────────────────────────────────────── */

const AUTHORS = {
  "Brother Lawrence":       { photo: "/Brother_Lawrence.jpg",  bio: "A 17th-century Carmelite friar who spent his life in a monastery kitchen and became one of the most beloved voices in Christian spiritual formation." },
  "John Mark Comer":        { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/John_Mark_Comer_%282019%29.jpg/440px-John_Mark_Comer_%282019%29.jpg", bio: "Teacher, writer, and founder of Practicing the Way. New York Times bestselling author of The Ruthless Elimination of Hurry and Practicing the Way." },
  "Thomas Merton":          { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Thomas_Merton_OCSO.jpg/440px-Thomas_Merton_OCSO.jpg", bio: "A Trappist monk, writer, and mystic whose prolific output on contemplative prayer and social justice shaped a generation of Christians." },
  "Henri Nouwen":           { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Henri_Nouwen.jpg/440px-Henri_Nouwen.jpg", bio: "A Dutch Catholic priest and author of over 40 books on the spiritual life. Spent his final years as pastor at L'Arche Daybreak community in Canada." },
  "Eugene Peterson":        { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Eugene_Peterson_%282014%29.jpg/440px-Eugene_Peterson_%282014%29.jpg", bio: "Pastor, scholar, and author of The Message Bible translation. His books on spiritual theology shaped the modern conversation on pastoral ministry." },
  "Michael Casey":          { photo: "/Michael_Casey.jpg",     bio: "A Cistercian monk of Tarrawarra Abbey, Australia, and prolific writer on monastic spirituality and lectio divina." },
  "Scot McKnight":          { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Scot_McKnight.jpg/440px-Scot_McKnight.jpg", bio: "New Testament scholar and professor at Northern Seminary. Author of over 50 books on Jesus, Paul, and Christian community." },
  "Philip Yancey":          { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Philip_Yancey.jpg/440px-Philip_Yancey.jpg", bio: "One of the most widely read Christian authors of our time, known for his honest and probing explorations of faith, doubt, and grace." },
  "Paul Miller":            { photo: "/Paul_Miller.jpg",       bio: "Founder of seeJesus ministry and author of A Praying Life, one of the most practical and transformative books on prayer available." },
  "Bill Hybels":            { photo: "/Bill_Hybels.jpg",       bio: "Founding pastor of Willow Creek Community Church and author of numerous books on leadership, prayer, and the local church." },
  "Tyler Staton":           { photo: "https://images.squarespace-cdn.com/content/v1/62f4240b6378f20af35390c4/44388244-0fcd-424c-adcc-4943367d71ae/Tyler-Staton.jpg", bio: "Lead pastor of Bridgetown Church in Portland, Oregon, and National Director of 24-7 Prayer USA. Author and teacher on prayer, the Holy Spirit, and the contemplative life." },
  "Thomas Keating":         { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Thomas_Keating.jpg/440px-Thomas_Keating.jpg", bio: "Trappist monk and founder of the Centering Prayer movement, which has introduced thousands to the contemplative dimension of Christian life." },
  "Abraham Joshua Heschel": { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Abraham_Joshua_Heschel.jpg/440px-Abraham_Joshua_Heschel.jpg", bio: "One of the leading Jewish philosophers and theologians of the 20th century. His work on Sabbath, prayer, and prophetic consciousness remains essential." },
  "A.J. Swoboda":           { photo: "/AJ_Swoboda.jpg",        bio: "Pastor, author, and professor whose work on Sabbath, creation care, and spiritual formation has made him a fresh voice in the church." },
  "Rich Villodas":          { photo: "/Rich_Villodas.jpg",     bio: "Lead pastor of New Life Fellowship in Queens, NY — one of the most ethnically diverse churches in America. Author and speaker on spiritual formation and racial reconciliation." },
  "Peter Scazzero":         { photo: "/Peter_Scazzero.jpg",    bio: "Founder of New Life Fellowship and Emotionally Healthy Discipleship, a movement helping churches integrate emotional health and contemplative spirituality." },
  "Dietrich Bonhoeffer":    { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Dietrich_Bonhoeffer.jpg/440px-Dietrich_Bonhoeffer.jpg", bio: "German pastor, theologian, and anti-Nazi dissident who was executed in 1945. His writings on community, discipleship, and costly grace remain profoundly formative." },
  "Chuck Colson":           { photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Chuck_Colson.jpg/440px-Chuck_Colson.jpg", bio: "Former Nixon aide turned Christian author and activist, founder of Prison Fellowship. His later writing on the church as a countercultural community became prophetic." },
};

/* ─── RHYTHM DATA ─────────────────────────────────────────────────── */

export const RHYTHMS = getAllRhythms();

/* ─── INTERACTIVE: EXAMEN WALKTHROUGH (Presence) ─────────────────── */

function ExamenWalkthrough() {
  const STEPS = [
    {
      num: "01", title: "Gratitude", latin: "Gratitudo",
      prompt: "Pause and look back over the last 24 hours. What are you genuinely grateful for? Name one specific thing — not a category, but a moment, a person, a gift.",
      cue: "Begin in gratitude. Not because life is easy, but because God is present.",
    },
    {
      num: "02", title: "Presence", latin: "Conscientia",
      prompt: "Where did you feel most alive today? Where did you sense God near — in a conversation, a moment of beauty, a quiet awareness? Where did you feel most connected to what matters?",
      cue: "Notice where God was present — even where you weren't looking.",
    },
    {
      num: "03", title: "Sorrow", latin: "Contritio",
      prompt: "Where did you fall short today? Not to generate shame, but to see clearly. Where did you drift — in attention, in love, in obedience? Name it honestly before God.",
      cue: "Honesty is not self-punishment. It is the beginning of return.",
    },
    {
      num: "04", title: "Forgiveness", latin: "Remissio",
      prompt: "Bring what you named in sorrow to God. Receive his forgiveness — not as a feeling, but as a fact. Is there anyone you need to forgive, or anyone you need to seek forgiveness from?",
      cue: "You are not what you did today. You are who God says you are.",
    },
    {
      num: "05", title: "Resolve", latin: "Propositum",
      prompt: "What do you want to carry into tomorrow? One thing to do differently, one person to love better, one practice to protect. Make it specific. Tell God.",
      cue: "Tomorrow is not yet formed. You still get to choose what shapes it.",
    },
  ];

  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState(Array(STEPS.length).fill(""));
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => { if (isLast) setDone(true); else setStep(s => s + 1); };
  const handleBack = () => { if (step > 0) setStep(s => s - 1); };
  const handleRestart = () => { setStep(0); setNotes(Array(STEPS.length).fill("")); setDone(false); setStarted(false); };

  const base = { fontFamily: "'Barlow Condensed',sans-serif" };

  if (!started) return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", padding: "3rem 2rem", textAlign: "center" }}>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: "1.5rem" }}>The Daily Examen · Ignatian Practice</p>
      <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "20px", color: "rgba(250,248,245,0.75)", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 1.5rem" }}>
        "At the end of each day, take ten minutes to review it in God's presence."
      </p>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.3)", marginBottom: "2.5rem" }}>5 steps · ~10 minutes · Gratitude → Presence → Sorrow → Forgiveness → Resolve</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "2.5rem" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "rgba(201,168,76,0.6)", ...base }}>{s.num}</div>
            <span style={{ fontSize: "7px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.25)", ...base }}>{s.title}</span>
          </div>
        ))}
      </div>
      <Button variant="secondary" onClick={() => setStarted(true)}>
        Begin the Examen
      </Button>
    </div>
  );

  if (done) return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", padding: "3rem 2rem", textAlign: "center" }}>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", marginBottom: "1.5rem" }}>Examen Complete</p>
      <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "22px", color: "rgba(250,248,245,0.82)", lineHeight: 1.6, marginBottom: "1rem" }}>
        You have reviewed this day in God's presence.
      </p>
      <p style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "16px", color: "rgba(250,248,245,0.45)", lineHeight: 1.7, maxWidth: "420px", margin: "0 auto 2.5rem" }}>
        This is how formation happens — not by intensity, but by the daily, faithful act of return. Come back tomorrow.
      </p>
      <p style={{ ...base, fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)", marginBottom: "2rem" }}>— <ScriptureRef reference="Psalm 139:23–24" text="Search me, O God, and know my heart; test me and know my anxious thoughts. See if there is any offensive way in me, and lead me in the way everlasting." /></p>
      <Button variant="ghost" size="sm" onClick={handleRestart}>
        Begin Again
      </Button>
    </div>
  );

  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}>
        <div style={{ height: "100%", width: `${((step + 1) / STEPS.length) * 100}%`, background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.5))", transition: "width .4s ease" }} />
      </div>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {STEPS.map((s, i) => (
          <Button key={i} variant="tab" active={step === i} onClick={() => setStep(i)}
            style={{ flex: 1, ...(i < step ? { color: "rgba(201,168,76,0.5)" } : {}) }}>
            {s.title}
          </Button>
        ))}
      </div>
      <div style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "42px", color: "rgba(201,168,76,0.25)", lineHeight: 1 }}>{cur.num}</span>
          <div>
            <p style={{ ...base, fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5", lineHeight: 1 }}>{cur.title}</p>
            <p style={{ ...base, fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginTop: "3px" }}>{cur.latin}</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--cf-font-devotional)", fontStyle: "italic", fontSize: "16px", color: "rgba(250,248,245,0.45)", lineHeight: 1.7, marginBottom: "1.25rem", borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "1rem" }}>{cur.cue}</p>
        <p style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "18px", color: "rgba(250,248,245,0.78)", lineHeight: 1.82, marginBottom: "1.5rem" }}>{cur.prompt}</p>
        <textarea
          value={notes[step]}
          onChange={e => { const n = [...notes]; n[step] = e.target.value; setNotes(n); }}
          placeholder="Write your response here, or simply sit in silence..."
          rows={4}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "1rem", color: "rgba(250,248,245,0.7)", fontFamily: "var(--cf-font-devotional)", fontSize: "16px", lineHeight: 1.7, resize: "none", outline: "none", transition: "border-color .2s", boxSizing: "border-box" }}
          onFocus={e => { e.target.style.borderColor = "rgba(201,168,76,0.4)"; }}
          onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1.5rem" }}>
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={step === 0}>← Back</Button>
          <span style={{ ...base, fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)" }}>{step + 1} of {STEPS.length}</span>
          <Button variant="primary" size="sm" onClick={handleNext}>{isLast ? "Complete" : "Continue →"}</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: LECTIO DIVINA (Scripture) ─────────────────────── */

function LectioDivinaGuide() {
  const steps = [
    { num: "I", latin: "Lectio", eng: "Read", desc: "Read the passage slowly, aloud if possible. Read it again. A third time. You are not looking for information — you are listening for a word or phrase that seems to press against you." },
    { num: "II", latin: "Meditatio", eng: "Reflect", desc: "Take the word or phrase that caught you. Repeat it quietly. Turn it over. Let it interact with your memory, your imagination, your current situation. Don't analyze — ruminate, like an animal chewing cud." },
    { num: "III", latin: "Oratio", eng: "Respond", desc: "Let what has arisen in meditation move you to prayer. Speak to God — in gratitude, petition, confession, praise. This is not a structured prayer. It is a spontaneous response to what God has stirred in you." },
    { num: "IV", latin: "Contemplatio", eng: "Rest", desc: "Release all thoughts, words, and images. Simply rest in God's presence. You are not trying to achieve anything. You are resting in the love of the One who has spoken. Even five minutes of this silence is more valuable than it seems." },
  ];
  const [active, setActive] = useState(0);
  const cur = steps[active];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {steps.map((s, i) => (<Button key={i} variant="tab" active={active === i} onClick={() => setActive(i)} style={{ flex: 1 }}>{s.latin}</Button>))}
      </div>
      <div style={{ padding: "2.5rem 2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "1.25rem" }}>
          <span style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "36px", color: "rgba(201,168,76,0.4)" }}>{cur.num}</span>
          <div><p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5" }}>{cur.eng}</p><p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>{cur.latin}</p></div>
        </div>
        <p style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "18px", lineHeight: 1.82, color: "rgba(250,248,245,0.7)" }}>{cur.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
          <Button variant="ghost" size="sm" onClick={() => setActive(i => Math.max(0, i - 1))} disabled={active === 0}>← Prev</Button>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)", alignSelf: "center" }}>{active + 1} of {steps.length}</span>
          <Button variant="ghost" size="sm" onClick={() => setActive(i => Math.min(steps.length - 1, i + 1))} disabled={active === steps.length - 1}>Next →</Button>
        </div>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: PRAYER POSTURES (Prayer) ──────────────────────── */

function PrayerPostures() {
  const postures = [
    { name: "Kneeling",     desc: "The classic posture of humility and submission. Used in scripture for urgent petition, confession, and worship. It communicates to the body what the soul is trying to express: I am not in charge." },
    { name: "Standing",     desc: "The resurrection posture. The early church stood to pray on Sundays as a proclamation of the resurrection. Standing in prayer is an act of confidence — approaching God not as a cringing subject but as a beloved child." },
    { name: "Prostrate",    desc: "Face to the ground. The most extreme posture of surrender and awe, used in scripture at moments of overwhelming encounter with God. Moses, Joshua, Ezekiel, John. This posture is for the moments when words are not sufficient." },
    { name: "Hands raised", desc: "\"Lifting holy hands\" (1 Timothy 2:8) as an expression of openness, receptivity, and surrender. The physical act of opening the hands and lifting them changes something in the body's relationship to what is being prayed." },
    { name: "Walking",      desc: "Much of Jesus' prayer and conversation with the Father happened in movement. Walking prayer keeps the body engaged and can release thoughts and words that sitting prayer doesn't. Many find that movement unlocks honesty." },
  ];
  const [active, setActive] = useState(0);
  const cur = postures[active];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)", scrollbarWidth: "none" }}>
        {postures.map((p, i) => (<Button key={i} variant="tab" active={active === i} onClick={() => setActive(i)} style={{ flexShrink: 0, whiteSpace: "nowrap" }}>{p.name}</Button>))}
      </div>
      <div style={{ padding: "2.5rem 2rem" }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "24px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", color: "#FAF8F5", marginBottom: "1.25rem" }}>{cur.name}</p>
        <p style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "18px", lineHeight: 1.82, color: "rgba(250,248,245,0.7)" }}>{cur.desc}</p>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: SABBATH IDEAS (Sabbath) ───────────────────────── */

function SabbathIdeas() {
  const categories = [
    { label: "Rest",    ideas: ["Sleep in without guilt","Take a long nap in the afternoon","Lie in the grass and watch the sky","Turn off all notifications","Let the day be slow","Do nothing on purpose"] },
    { label: "Delight", ideas: ["Cook a meal you love","Take a long walk with no destination","Read a novel, not a growth book","Play with your kids","Tend a garden","Sit by water","Make something with your hands","Listen to music you love all the way through","Watch the sunset"] },
    { label: "Worship", ideas: ["Gather with your church","Sing — alone or together","Read a Psalm aloud","Take communion at home","Light candles and begin with prayer","Journal gratitude from the week","Pray the Lord's Prayer slowly"] },
    { label: "People",  ideas: ["Share a long, unhurried meal","Have people over with no agenda","Call someone you love","Visit someone who is lonely","Put the phones away at the table","Play a game together"] },
    { label: "Nature",  ideas: ["Hike somewhere beautiful","Swim in open water","Sit outside in the morning quiet","Watch birds","Walk barefoot","Find a place with no artificial noise"] },
    { label: "Rituals", ideas: ["Light two candles to begin","Pour wine or sparkling juice","Begin with a table blessing","End with evening prayer","Keep the same start time each week","Prepare the day before — clear the decks"] },
  ];
  const [active, setActive] = useState(0);
  const cur = categories[active];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", overflow: "hidden" }}>
      <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {categories.map((c, i) => (<Button key={i} variant="tab" active={active === i} onClick={() => setActive(i)}>{c.label}</Button>))}
      </div>
      <div style={{ padding: "2rem" }}>
        <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".38em", textTransform: "uppercase", color: "rgba(201,168,76,0.55)", marginBottom: "1.25rem" }}>{cur.label} · Sabbath Ideas</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(180px, 100%), 1fr))", gap: "8px" }}>
          {cur.ideas.map((idea, i) => (<div key={i} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", fontFamily: "var(--cf-font-devotional)", fontSize: "16px", color: "rgba(250,248,245,0.72)", lineHeight: 1.4 }}>{idea}</div>))}
        </div>
        <p style={{ marginTop: "1.5rem", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(250,248,245,0.2)" }}>Ask: is this restful or worshipful? If not, it can wait. — John Mark Comer</p>
      </div>
    </div>
  );
}

/* ─── INTERACTIVE: COMMUNITY DEPTHS (Community) ──────────────────── */

function CommunityDepths() {
  const levels = [
    { level: "01", label: "Acquaintance",  desc: "You know their name and face. Surface exchanges. This is the baseline — it is not community.", pct: 100 },
    { level: "02", label: "Familiarity",   desc: "You know their story at a high level. Comfortable conversation. Most people live here.", pct: 78 },
    { level: "03", label: "Friendship",    desc: "Shared experience and genuine care. You would notice if they disappeared. Deeper but often still guarded.", pct: 56 },
    { level: "04", label: "Vulnerability", desc: "They know your real struggles, fears, and failures. You have been honest and received grace. This is where formation begins.", pct: 36 },
    { level: "05", label: "Koinonia",      desc: "Shared life, shared formation, genuine accountability. This is the New Testament vision — rare, costly, and profoundly transforming.", pct: 18 },
  ];
  return (
    <div style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "24px", padding: "2.5rem 2rem" }}>
      <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.65)", marginBottom: "2rem" }}>The Depths of Community</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {levels.map((l, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".25em", textTransform: "uppercase", color: i === 4 ? "#C9A84C" : "rgba(250,248,245,0.55)", fontWeight: i === 4 ? 700 : 400 }}>{l.label}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "8px", letterSpacing: ".2em", color: "rgba(250,248,245,0.2)" }}>{l.level}</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden", marginBottom: "5px" }}>
              <div style={{ height: "100%", width: `${l.pct}%`, background: i === 4 ? "#C9A84C" : `rgba(201,168,76,${0.15 + i * 0.1})`, borderRadius: "2px" }} />
            </div>
            <p style={{ fontFamily: "var(--cf-font-devotional)", fontSize: "15px", color: "rgba(250,248,245,0.42)", lineHeight: 1.5 }}>{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── INTERACTIVES MAP ────────────────────────────────────────────── */

const INTERACTIVES = {
  presence:  ExamenWalkthrough,   // Daily Examen
  scripture: LectioDivinaGuide,   // Lectio Divina
  prayer:    PrayerPostures,       // Prayer Postures
  sabbath:   SabbathIdeas,         // Sabbath Ideas
  community: CommunityDepths,      // Depths of Community
};

/* ─── GO DEEPER — TABBED BOOKS / MEDIA ───────────────────────────── */

function GoDeeperSection({ data, rhythm }) {
  const [tab, setTab] = useState("books");
  const TYPE_COLORS = { Video: "#C9A84C", Podcast: "#8FAF8A", Article: "#A08CC8", Course: "#C87C5A" };

  return (
    <div className="rl-further rl-section">
      <div className="rl-sec-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "none", paddingBottom: 0, marginBottom: "1.25rem" }}>
        <span style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: ".75rem", display: "block", width: "100%", letterSpacing: ".5em", fontSize: "9px" }}>Go Deeper</span>
      </div>
      <div style={{ display: "flex", gap: "4px", padding: "4px", background: "rgba(255,255,255,0.04)", borderRadius: "999px", marginBottom: "1.5rem", gridColumn: "1 / -1", width: "fit-content" }}>
        {["books", "media"].map(t => (
          <Button key={t} variant="ghost" size="sm" onClick={() => setTab(t)}
            style={tab === t ? { background: "rgba(201,168,76,0.15)", color: "var(--cf-gold)", fontWeight: 700 } : {}}>
            {t === "books" ? "Books" : "Media"}
          </Button>
        ))}
      </div>
      {tab === "books" && data.further.map((b, i) => (
        <Link key={i} to={`${RULE_BASE}/${rhythm}/book/${i}`} className="rl-book">
          <img src={b.cover} alt={b.title} className="rl-book-img" onError={e => { e.target.style.background = "#17140F"; e.target.style.opacity = "0.4"; }} />
          <div className="rl-book-body">
            <div>
              <p className="rl-book-title">{b.title}</p>
              <p className="rl-book-author">{b.author}</p>
              <p className="rl-book-desc">{b.desc}</p>
            </div>
            <span className="rl-book-cta">Why we recommend it <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
          </div>
        </Link>
      ))}
      {tab === "media" && data.media.map((m, i) => (
        <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="rl-book" style={{ textDecoration: "none" }}>
          <div style={{ position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <img src={m.thumb} alt={m.title} className="rl-book-img" onError={e => { e.target.style.background = "#17140F"; e.target.style.opacity = "0.4"; }} />
            <div style={{ position: "absolute", top: "8px", left: "8px", padding: "3px 8px", borderRadius: "999px", background: "rgba(6,5,10,0.75)", backdropFilter: "blur(8px)", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "7px", letterSpacing: ".22em", textTransform: "uppercase", color: TYPE_COLORS[m.type] || "#C9A84C", border: `1px solid ${TYPE_COLORS[m.type] || "#C9A84C"}44` }}>{m.type}</div>
          </div>
          <div className="rl-book-body">
            <div>
              <p className="rl-book-title">{m.title}</p>
              <p className="rl-book-author">{m.source}</p>
            </div>
            <span className="rl-book-cta">Watch / Listen <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg></span>
          </div>
        </a>
      ))}
    </div>
  );
}

/* ─── BOOK PAGE ───────────────────────────────────────────────────── */

export function BookPage() {
  const { rhythm, bookIndex } = useParams();
  const navigate = useNavigate();
  const data   = getRhythm(rhythm);
  const book   = data?.further[parseInt(bookIndex, 10)];
  const author = book ? AUTHORS[book.author] : null;
  const coverUrl = book?.cover || null;

  useEffect(() => {
    if (!data || !book) navigate(`${RULE_BASE}/${rhythm}`, { replace: true });
    window.scrollTo(0, 0);
  }, [data, book]);

  if (!data || !book) return null;

  const S = {
    wrap:      { background: "#0E0C0A", minHeight: "100svh", fontFamily: "'Barlow Condensed',sans-serif", color: "#FAF8F5" },
    shell:     { maxWidth: "720px", margin: "0 auto", padding: "100px 24px 100px" },
    back:      { display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "9px", letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(201,168,76,0.7)", textDecoration: "none", marginBottom: "2.5rem" },
    hero:      { display: "grid", gridTemplateColumns: "180px 1fr", gap: "0", alignItems: "stretch", marginBottom: "2.75rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "22px", overflow: "hidden" },
    coverWrap: { position: "relative", background: "#17140F", minHeight: "260px", display: "flex", alignItems: "stretch" },
    cover:     { width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "260px" },
    coverFallback: { width: "100%", minHeight: "260px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", background: "linear-gradient(135deg,#1C1914,#0E0C0A)", textAlign: "center" },
    heroText:  { padding: "2rem 2rem 2rem 1.75rem", display: "flex", flexDirection: "column", justifyContent: "flex-end" },
    kicker:    { fontSize: "8px", letterSpacing: ".42em", textTransform: "uppercase", color: "rgba(201,168,76,0.65)", marginBottom: ".75rem" },
    title:     { fontFamily: "'Barlow Condensed',sans-serif", fontSize: "clamp(20px,3.5vw,30px)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "#FAF8F5", lineHeight: .92, marginBottom: "1.25rem" },
    authorRow: { display: "flex", alignItems: "center", gap: "10px" },
    authorPhoto: { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(201,168,76,0.3)", flexShrink: 0 },
    authorName:  { fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(201,168,76,0.8)", fontWeight: 700 },
    whyLabel:  { fontSize: "9px", letterSpacing: ".42em", textTransform: "uppercase", color: "#C9A84C", marginBottom: "1.1rem", paddingBottom: ".7rem", borderBottom: "1px solid rgba(255,255,255,0.06)" },
    desc:      { fontFamily: "var(--cf-font-devotional)", fontSize: "clamp(17px,3.5vw,20px)", lineHeight: 1.86, color: "rgba(250,248,245,0.76)", marginBottom: "2.5rem" },
    bioWrap:   { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "1.4rem 1.5rem", marginBottom: "2rem", display: "flex", alignItems: "flex-start", gap: "14px" },
    bioPhoto:  { width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(201,168,76,0.25)", flexShrink: 0 },
    bioName:   { fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(201,168,76,0.75)", fontWeight: 700, marginBottom: ".4rem" },
    bioPara:   { fontFamily: "var(--cf-font-devotional)", fontSize: "15px", lineHeight: 1.72, color: "rgba(250,248,245,0.5)" },
    cta:       { display: "inline-flex", alignItems: "center", gap: "10px", padding: "15px 28px", borderRadius: "12px", border: "2px solid #C9A84C", background: "#C9A84C", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".28em", textTransform: "uppercase", color: "#0A0A0A", fontWeight: 700, transition: "all .25s" },
    backBtn:   { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "1.25rem", padding: "16px", borderRadius: "14px", border: "none", background: "#E8E4DC", textDecoration: "none", fontFamily: "'Barlow Condensed',sans-serif", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "#0A0A0A", fontWeight: 700, transition: "all .25s" },
  };

  return (
    <div style={S.wrap}>
      <Link to="/" style={{ position: "fixed", top: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 200, display: "flex", alignItems: "center", gap: "10px", padding: "10px 20px 10px 14px", borderRadius: "999px", background: "rgba(14,12,10,0.88)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" role="presentation" style={{ width: "28px", height: "28px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
        <span style={{ fontSize: "9px", letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(250,248,245,0.55)", fontWeight: 600 }}>Counter Formation</span>
      </Link>
      <div style={S.shell}>
        <Link to={`${RULE_BASE}/${rhythm}`} style={S.back}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M12 6.5H1M6 2.5l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Back to {data.title}
        </Link>
        <div style={S.hero}>
          <div style={S.coverWrap}>
            {coverUrl && (<img src={coverUrl} alt={book.title} style={S.cover} onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />)}
            <div style={{ ...S.coverFallback, display: coverUrl ? "none" : "flex" }}>
              <p style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "#FAF8F5", lineHeight: 1.2, marginBottom: ".75rem" }}>{book.title}</p>
              <p style={{ fontSize: "9px", letterSpacing: ".25em", textTransform: "uppercase", color: "rgba(201,168,76,0.6)" }}>{book.author}</p>
            </div>
          </div>
          <div style={S.heroText}>
            <p style={S.kicker}>Recommended Reading</p>
            <h1 style={S.title}>{book.title}</h1>
            <div style={S.authorRow}>
              {author?.photo && (<img src={author.photo} alt={book.author} style={S.authorPhoto} onError={e => { e.target.style.display = "none"; }} />)}
              <span style={S.authorName}>{book.author}</span>
            </div>
          </div>
        </div>
        <p style={S.whyLabel}>Why We Recommend It</p>
        <p style={S.desc}>{book.desc}</p>
        {author?.bio && (
          <div style={S.bioWrap}>
            {author.photo && (<img src={author.photo} alt={book.author} style={S.bioPhoto} onError={e => { e.target.style.display = "none"; }} />)}
            <div><p style={S.bioName}>{book.author}</p><p style={S.bioPara}>{author.bio}</p></div>
          </div>
        )}
        <a href={book.amazon} target="_blank" rel="noopener noreferrer" style={S.cta}
          onMouseEnter={e => { e.currentTarget.style.background = "#FAF8F5"; e.currentTarget.style.borderColor = "#FAF8F5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.borderColor = "#C9A84C"; }}>
          Purchase on Amazon
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6.5 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </a>
        <Link to={`${RULE_BASE}/${rhythm}`} style={S.backBtn}
          onMouseEnter={e => { e.currentTarget.style.background = "#FAF8F5"; e.currentTarget.style.color = "#0A0A0A"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#E8E4DC"; e.currentTarget.style.color = "#0A0A0A"; }}>
          ← Return to {data.title}
        </Link>
      </div>
    </div>
  );
}

/* ─── SHARED STYLES ───────────────────────────────────────────────── */

export function RuleStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      .rl-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .rl-wrap   { font-family: 'Barlow Condensed',sans-serif; background: #0E0C0A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      .rl-shield-mark { position: fixed; top: 1.25rem; left: 1.5rem; z-index: 200; width: 192px; height: 192px; opacity: 0.32; pointer-events: none; }
      @media (max-width: 640px) { .rl-shield-mark { width: 100px; height: 100px; top: 0.5rem; left: 0.5rem; } }

      .rl-prog-bar  { position: sticky; top: 0; z-index: 190; height: 2px; background: rgba(255,255,255,0.05); }
      .rl-prog-fill { height: 100%; width: 0; background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35)); transition: width .12s linear; }

      .rl-hero-band { position: relative; overflow: hidden; min-height: clamp(520px,72vw,820px); display: flex; flex-direction: column; justify-content: flex-end; }
      .rl-hero-bg   { position: absolute; inset: 0; background-size: cover; background-position: center center; filter: grayscale(.15); }
      .rl-hero-ov   { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,12,10,0.96) 0%, rgba(14,12,10,0.35) 45%, rgba(14,12,10,0.08) 100%); }
      .rl-hero-in   { position: relative; z-index: 2; padding: 2rem 24px 2.5rem; max-width: 860px; margin: 0 auto; width: 100%; }
      .rl-hero-logo { width: 32px; height: 32px; filter: invert(1) brightness(.9); opacity: .45; margin-bottom: .9rem; display: block; }
      .rl-hero-eye  { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.75); margin-bottom: .5rem; }
      .rl-hero-h1   { font-size: clamp(44px,10vw,88px); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; line-height: .86; margin-bottom: 1rem; }
      .rl-hero-sub  { font-family: var(--cf-font-devotional); font-style: italic; font-size: clamp(16px,3.5vw,22px); color: rgba(250,248,245,0.35); }

      .rl-pullquote      { border-left: 2px solid #C9A84C; margin: 3rem 0; padding: 1.25rem 2rem; background: rgba(201,168,76,0.04); border-radius: 0 12px 12px 0; }
      .rl-pullquote p    { font-family: var(--cf-font-devotional); font-style: italic; font-size: clamp(20px,4.5vw,28px); color: rgba(250,248,245,0.82); line-height: 1.55; margin-bottom: .75rem; }
      .rl-pullquote cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      .rl-content { max-width: 740px; margin: 0 auto; padding: 52px 24px 120px; }
      .rl-sidebar { margin-bottom: 3rem; }

      .rl-rule      { height: 1px; background: linear-gradient(to right, #C9A84C, transparent); opacity: .25; margin: 2.5rem 0; }
      .rl-section   { margin-bottom: 3rem; }
      .rl-sec-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.25rem; padding-bottom: .75rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .rl-body      { font-family: var(--cf-font-devotional); font-size: clamp(17px,4vw,20px); line-height: 1.86; color: rgba(250,248,245,0.76); }
      .rl-body p    { margin-bottom: 1.25rem; }
      .rl-body em   { font-style: italic; color: rgba(250,248,245,0.95); }

      .rl-scripture      { background: rgba(255,255,255,0.03); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.4rem 1.5rem; margin: 1.25rem 0; }
      .rl-scripture p    { font-family: var(--cf-font-devotional); font-style: italic; font-size: clamp(15px,3.8vw,18px); color: rgba(250,248,245,0.72); line-height: 1.7; margin-bottom: .6rem; }
      .rl-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      .rl-steps      { display: flex; flex-direction: column; gap: 1.5rem; }
      .rl-step       { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.5rem; transition: border-color .3s; }
      .rl-step:hover { border-color: rgba(201,168,76,0.25); }
      .rl-step-head  { display: flex; align-items: baseline; gap: 14px; margin-bottom: .9rem; }
      .rl-step-num   { font-size: 10px; letter-spacing: .32em; text-transform: uppercase; color: rgba(201,168,76,0.55); flex-shrink: 0; }
      .rl-step-title { font-size: clamp(16px,3.5vw,20px); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; }
      .rl-step-body  { font-family: var(--cf-font-devotional); font-size: clamp(15px,3.5vw,17px); line-height: 1.82; color: rgba(250,248,245,0.65); }

      .rl-reflections { display: flex; flex-direction: column; gap: 1rem; }
      .rl-reflect-q   { background: rgba(201,168,76,0.04); border: 1px solid rgba(201,168,76,0.14); border-radius: 14px; padding: 1.25rem 1.5rem; font-family: var(--cf-font-devotional); font-style: italic; font-size: clamp(15px,3.5vw,18px); color: rgba(250,248,245,0.65); line-height: 1.7; }

      .rl-further      { display: flex; flex-direction: column; gap: 12px; }
      .rl-book         { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; transition: border-color .3s, transform .3s; text-decoration: none; display: grid; grid-template-columns: 120px 1fr; cursor: pointer; align-items: stretch; }
      .rl-book:hover   { border-color: rgba(201,168,76,0.45); transform: translateX(4px); }
      .rl-book-img     { width: 100%; height: 100%; min-height: 130px; object-fit: cover; display: block; filter: grayscale(.35); opacity: .8; transition: opacity .4s, filter .4s; align-self: stretch; }
      .rl-book:hover .rl-book-img { opacity: 1; filter: grayscale(0); }
      .rl-book-body    { padding: 1rem 1.25rem; display: flex; flex-direction: column; justify-content: space-between; min-height: 130px; }
      .rl-book-title   { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; margin-bottom: .25rem; line-height: 1.2; }
      .rl-book-author  { font-size: 9px; letter-spacing: .25em; text-transform: uppercase; color: rgba(201,168,76,0.65); margin-bottom: .5rem; }
      .rl-book-desc    { font-family: var(--cf-font-devotional); font-size: 13px; line-height: 1.6; color: rgba(250,248,245,0.45); margin-bottom: .75rem; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      .rl-book-cta     { display: inline-flex; align-items: center; gap: 6px; font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(201,168,76,0.7); transition: color .2s; flex-shrink: 0; }
      .rl-book:hover .rl-book-cta { color: #C9A84C; }

      .rl-rhythm-nav { display: flex; gap: 12px; margin-top: 3rem; }
      .rl-nav-btn { flex: 1; padding: 16px 24px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.04); text-decoration: none; display: flex; flex-direction: column; gap: 4px; transition: border-color .25s, background .25s; }
      .rl-nav-btn:hover { border-color: rgba(201,168,76,0.45); background: rgba(201,168,76,0.06); }
      .rl-nav-btn-dir   { font-size: 8px; letter-spacing: .38em; text-transform: uppercase; color: rgba(201,168,76,0.65); }
      .rl-nav-btn-title { font-size: clamp(14px,2vw,18px); font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #FAF8F5; line-height: 1; }
      .rl-nav-btn.next  { text-align: right; align-items: flex-end; }


      @media (min-width: 1024px) {
        .rl-hero-band { min-height: clamp(600px, 78vw, 900px); }
        .rl-hero-in   { max-width: 1100px; padding: 2.5rem 48px 3rem; }
        .rl-hero-h1   { font-size: clamp(60px, 9vw, 108px); }
        .rl-content {
          max-width: 1100px; padding: 60px 48px 140px;
          display: grid; grid-template-columns: 1fr 340px;
          column-gap: 64px; align-items: start;
          grid-template-areas:
            "pullquote   pullquote"
            "why-label   why-label"
            "why-body    sidebar"
            "theology    sidebar"
            "rule1       rule1"
            "interactive interactive"
            "rule2       rule2"
            "practice    practice"
            "further     further"
            "brand       brand"
            "nav         nav";
        }
        .rl-pullquote  { grid-area: pullquote; }
        .rl-why-label  { grid-area: why-label; }
        .rl-why-body   { grid-area: why-body; }
        .rl-sidebar    { grid-area: sidebar; position: sticky; top: 72px; margin-bottom: 0; align-self: start; border-left: 1px solid rgba(255,255,255,0.07); padding-left: 40px; display: flex; flex-direction: column; gap: 2rem; }
        .rl-sidebar .rl-section { margin-bottom: 0; }
        .rl-theology   { grid-area: theology; }
        .rl-rule:nth-of-type(1) { grid-area: rule1; }
        .rl-rule:nth-of-type(2) { grid-area: rule2; }
        .rl-interactive { grid-area: interactive; }
        .rl-practice    { grid-area: practice; }
        .rl-further     { grid-area: further; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: stretch; grid-auto-flow: row dense; }
        .rl-further .rl-sec-label { grid-column: 1 / -1; }
        .rl-further > div[style*="fit-content"] { grid-column: 1 / -1; }
        .rl-further .rl-book:last-child:nth-child(odd) { grid-column: 1 / -1; }
        .rl-further .rl-book:last-child:nth-child(even) { grid-column: auto; }
        .rl-rhythm-nav  { grid-area: nav; }
        .rl-pullquote p { font-size: clamp(22px, 2.8vw, 32px); }
        .rl-sec-label   { letter-spacing: .5em; }
      }

      @media (min-width: 1440px) {
        .rl-hero-in { max-width: 1320px; padding: 3rem 64px 3.5rem; }
        .rl-content { max-width: 1320px; grid-template-columns: 1fr 380px; column-gap: 80px; padding: 72px 64px 160px; }
        .rl-sidebar { padding-left: 52px; }
      }

      @media (max-width: 767px) {
        .rl-sec-label { font-size: 10px; letter-spacing: .3em; }
        .rl-book-title { font-size: 15px; }
        .rl-book-author { font-size: 11px; }
        .rl-book-cta { font-size: 10px; }
        .rl-nav-btn-dir { font-size: 10px; }
        .rl-examen-tab { font-size: 10px !important; }
      }
    `}</style>
  );
}

/* ─── CORNER NAV ──────────────────────────────────────────────────── */

function CornerNav() {
  return (
    <>
      <img
        src="/shield-white.png"
        className="rl-shield-mark"
        onError={e => { e.target.style.display = "none"; }}
        alt=""
        role="presentation"
      />
    </>
  );
}

/* ─── RHYTHM PAGE ─────────────────────────────────────────────────── */

export function RhythmPage() {
  const { rhythm }  = useParams();
  const navigate    = useNavigate();
  const rfillRef    = useRef(null);
  const data        = getRhythm(rhythm);

  useEffect(() => { if (!data) navigate("/", { replace: true }); }, [data, navigate]);
  useEffect(() => { window.scrollTo(0, 0); }, [rhythm]);
  useEffect(() => {
    if (!data) return;
    const onScroll = () => {
      const d = document.documentElement;
      const pct = d.scrollTop / (d.scrollHeight - d.clientHeight) || 0;
      if (rfillRef.current) rfillRef.current.style.width = (pct * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [data]);

  if (!data) return null;

  const allRhythms  = getAllRhythms();
  const idx         = allRhythms.findIndex(r => r.slug === rhythm);
  const prev        = allRhythms[idx - 1];
  const next        = allRhythms[idx + 1];
  const Interactive = INTERACTIVES[data.slug];

  return (
    <div className="rl-wrap">
      <CornerNav />
      <div className="rl-prog-bar"><div className="rl-prog-fill" ref={rfillRef} /></div>

      <div className="rl-hero-band">
        <div className="rl-hero-bg" style={{ backgroundImage: `url('${data.img}')` }} />
        <div className="rl-hero-ov" />
        <div className="rl-hero-in">
          <p className="rl-hero-eye">{data.rhythm} · Rule of Life</p>
          <h1 className="rl-hero-h1">{data.title}</h1>
          <p className="rl-hero-sub">{data.sub}</p>
        </div>
      </div>

      <div className="rl-content">
        <div className="rl-pullquote"><p>"{data.quote}"</p><cite>— <ScriptureRef reference={data.quoteRef} text={data.quote} /></cite></div>

        <div className="rl-why-label"><p className="rl-sec-label">Why This Rhythm</p></div>

        <div className="rl-why-body rl-section">
          {data.why.map((p, i) => (<p key={i} className="rl-body" dangerouslySetInnerHTML={{ __html: p }} />))}
        </div>

        <div className="rl-sidebar">
          <div className="rl-section">
            <p className="rl-sec-label">Key Scriptures</p>
            {data.scriptures.map((s, i) => (<div key={i} className="rl-scripture"><p>"{s.t}"</p><cite><ScriptureRef reference={s.r} text={s.t} /></cite></div>))}
          </div>
          <div className="rl-section">
            <p className="rl-sec-label">Reflection</p>
            <div className="rl-reflections">
              {data.reflection.map((q, i) => (<div key={i} className="rl-reflect-q">{q}</div>))}
            </div>
          </div>

          {/* ── Connected Armor Cross-Links ── */}
          {Array.isArray(data.connectedArmor) && data.connectedArmor.length > 0 && (
            <div className="rl-section">
              <p className="rl-sec-label">Connected Armor</p>
              {data.connectedArmor.map((piece, idx) => (
                <Link
                  key={piece.slug}
                  to={`/identity/${piece.slug}`}
                  className="rl-book"
                  style={{
                    gridTemplateColumns: "1fr",
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: idx < data.connectedArmor.length - 1 ? "0.75rem" : 0,
                  }}
                >
                  <div className="rl-book-body" style={{ minHeight: "auto" }}>
                    <div>
                      <p className="rl-book-author">Connected Armor</p>
                      <p className="rl-book-title">{piece.title}</p>
                      <p className="rl-book-desc">{piece.desc}</p>
                    </div>
                    <span className="rl-book-cta">
                      Explore
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rl-theology rl-section">
          {data.theology.map((p, i) => (<p key={i} className="rl-body">{renderHtmlWithScriptureRefs(p)}</p>))}
        </div>

        <div className="rl-rule" />

        <div className="rl-interactive rl-section">
          <p className="rl-sec-label">{data.interactiveLabel}</p>
          <Interactive />
        </div>

        <div className="rl-rule" />

        <div className="rl-practice rl-section">
          <p className="rl-sec-label">The Practice</p>
          <p className="rl-body" style={{ marginBottom: "1.5rem" }}><span dangerouslySetInnerHTML={{ __html: data.practice.intro }} /></p>
          <div className="rl-steps">
            {data.practice.steps.map((s, i) => (
              <div className="rl-step" key={i}>
                <div className="rl-step-head"><span className="rl-step-num">{s.num}</span><span className="rl-step-title">{s.title}</span></div>
                <p className="rl-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <GoDeeperSection data={data} rhythm={rhythm} />

        <div style={{ textAlign: "center", padding: "2rem 0 1rem", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "1rem" }}>
          <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" role="presentation" style={{ width: "26px", height: "26px", opacity: .2, filter: "invert(1)", margin: "0 auto .75rem", display: "block" }} />
          <p style={{ fontSize: "8px", letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(255,255,255,0.18)" }}>Counter Formation · Formed in Christ · Ephesians 6:10–18</p>
        </div>

        {!next && <NextStep context="rule-of-life-complete" />}

        <div className="rl-rhythm-nav">
          {prev ? (
            <Link to={`${RULE_BASE}/${prev.slug}`} className="rl-nav-btn">
              <span className="rl-nav-btn-dir">← {prev.rhythm}</span>
              <span className="rl-nav-btn-title">{prev.title}</span>
            </Link>
          ) : <div />}
          {next ? (
            <Link to={`${RULE_BASE}/${next.slug}`} className="rl-nav-btn next">
              <span className="rl-nav-btn-dir">{next.rhythm} →</span>
              <span className="rl-nav-btn-title">{next.title}</span>
            </Link>
          ) : <div />}
        </div>
      </div>


    </div>
  );
}
