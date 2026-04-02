import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

export const CHALLENGE_BASE = "/7-day-challenge";

const C = {
  heroBg: "#06050A",
  darkBg: "#0E0C0A",
  ruleBg: "#17140F",
  gold:   "#C9A84C",
  ivory:  "#FAF8F5",
};

/* ─── DATA ────────────────────────────────────────────────────────── */

const DAYS = [
  {
    n: 1,
    title:   "You Are Being Formed",
    theme:   "The Question",
    // Solitary figure in dim, dramatic light — identity, shaping
    img:     "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600&auto=format&fit=crop",
    opening: "You are not becoming who you are by accident.",
    body: [
      "You are being shaped. Right now. Today. In ways you probably haven't stopped to notice.",
      "Every habit is training you. Every pattern you repeat is forming the person you are becoming. Every hour you spend moving through the world — distracted, rushed, half-present — is quietly building something in you.",
      "Dallas Willard used to say that the human soul is like a garden. If you don't tend it, it doesn't stay empty. Things just grow on their own. Mostly weeds.",
      "The question has never been whether you will be formed. The question is what will do the forming.",
    ],
    teaching: [
      "Paul doesn't say \"be careful.\" He says <em>do not be conformed.</em> Because if you do nothing — you already are.",
      "The word he uses is <em>syschematizo</em> — to be pressed into the mold of something, shaped by external forces without resistance. The world around you is an extraordinarily effective formation system. It does not need your permission. It just needs your attention.",
      "Most of what you think, most of what you desire, most of what you instinctively reach for — it wasn't chosen. It was absorbed. Quietly. Repeatedly. Over time. And now it just feels like you.",
      "But Paul sets conformation against transformation — <em>metamorphosis</em>. Not just better behavior. Actual transformation — from the inside out — into the image and likeness of Christ.",
    ],
    scriptures: [
      { t: "Do not be conformed to this world, but be transformed by the renewal of your mind…", r: "Romans 12:2" },
      { t: "And we all… are being transformed into the same image from one degree of glory to another.", r: "2 Corinthians 3:18" },
    ],
    practice:   "Sit in silence — 15 minutes. No phone. No input. No background noise.\n\nAsk yourself honestly: What has been shaping me lately? What do I turn to without thinking? What has my attention — and what is that doing to me?\n\nWrite it down. Don't clean it up. Don't explain it. Just see it.",
    reflection: "Where do you see the world shaping you without resistance?",
    prayer:     "God,\n\nI've been formed in ways I haven't stopped to notice.\nSome of it I chose. Most of it I didn't.\n\nOpen my eyes. Show me what is shaping my life — and what needs to change.\n\nI don't want to drift. Renew my mind. Reform my life.\n\nAmen.",
  },
  {
    n: 2,
    title:   "Scripture Before the Algorithm",
    theme:   "The Morning",
    // Open Bible in warm morning window light — scripture, first hour
    img:     "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
    opening: "There's a version of your morning that looks something like this:",
    body: [
      "Alarm goes off. Phone in hand. Before your feet hit the floor, you've already absorbed a dozen notifications, a fragment of news, two or three things to worry about, and the ambient noise of everyone else's life.",
      "And then you wonder why it's hard to feel present with God.",
      "The architects of the attention economy are not neutral. They study what captures you. They iterate on what keeps you. They are professionals at formation — and they have a head start on your day.",
      "The ancient church called the first hour the <em>hora prima</em> — and it belonged to God. Not because the rest of the day didn't matter, but because they understood that the beginning shapes everything that follows.",
      "What you give your first attention to — you give your heart to.",
    ],
    teaching: [
      "Jesus, in the middle of the most demanding season of his public ministry, got up before dawn to be with his Father. Mark records it intentionally — immediately after a day of relentless ministry, before any of it resumed, Jesus withdrew.",
      "This is the pattern. Not a quiet time as religious performance. Not a box to check. But a deliberate reordering of the day — starting with the voice of the Father before the noise of the world.",
      "The algorithm will tell you what to be anxious about. Scripture will tell you who you are.",
    ],
    scriptures: [
      { t: "O Lord, in the morning you hear my voice; in the morning I prepare a sacrifice for you and watch.", r: "Psalm 5:3" },
      { t: "Very early in the morning, while it was still dark, Jesus got up, left the house and went off to a solitary place, where he prayed.", r: "Mark 1:35" },
    ],
    practice:   "Tomorrow morning — before anything else:\n\nDon't touch your phone for the first 30 minutes after waking.\n\nOpen Scripture instead. Read slowly. Psalm 23. Psalm 46. John 15. Don't rush it. Don't study it. Just sit with it.\n\nAsk: What is God saying to me in this?\n\nThen sit in silence for a few minutes before you move into the day.",
    reflection: "Who narrates your morning right now — and what is that forming in you?",
    prayer:     "God,\n\nI've been giving my first attention to everything but you.\nNot out of rebellion — mostly just out of habit.\n\nReorder my mornings. Give me ears to hear your voice before the noise gets in.\n\nLet me start in you.\n\nAmen.",
  },
  {
    n: 3,
    title:   "The Pace of Your Life",
    theme:   "The Speed",
    // Still misty mountain lake — solitude, unhurried, quiet
    img:     "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=600&auto=format&fit=crop",
    opening: "Most people don't think much about the pace of their life.",
    body: [
      "They think about how much they have to do. How full things feel. How many tabs are open — not just on their computer, but in their head.",
      "But underneath all of that, something else is happening.",
      "You are being formed by the speed at which you live. Not just externally. Internally. You can be sitting completely still and still be rushing — your mind already on the next thing, your attention already somewhere else.",
      "The philosopher Josef Pieper wrote that the inability to be still — what he called <em>acedia</em>, or restlessness — is not just a personality type. It's a spiritual condition. A soul that cannot be quiet cannot hear God. It cannot perceive beauty. It cannot love well.",
      "Hurry is not neutral. Hurry is a formation system.",
    ],
    teaching: [
      "Jesus' rebuke of Martha sounds like a critique of work. It's not. He's diagnosing a soul condition. <em>\"You are anxious and troubled about many things.\"</em> Martha isn't just busy. She is performing her love for Jesus rather than receiving from him.",
      "That's the thing about hurry. It doesn't just affect your schedule. It affects your capacity to perceive — to notice God, to be present with people, to recognize what's going on inside you.",
      "The cure isn't time management. It's ruthlessly eliminating hurry from your life. That starts with the willingness to be still. Not as a technique. As a posture of trust.",
    ],
    scriptures: [
      { t: "Be still, and know that I am God.", r: "Psalm 46:10" },
      { t: "Martha, Martha, you are anxious and troubled about many things, but one thing is necessary.", r: "Luke 10:41–42" },
    ],
    practice:   "Choose one simple moment today — eating, walking, sitting outside — and slow it down completely.\n\nNo phone. No multitasking. No input.\n\nPay attention to what you see, what you hear, what you feel.\n\nWhen your mind runs ahead — and it will — gently bring it back. That returning is the practice.",
    reflection: "Where do you feel the most rushed right now — even when nothing urgent is happening?",
    prayer:     "God,\n\nI've been moving fast for a long time. Even when I stop, my mind doesn't.\n\nSlow me down. Help me be present to what is right in front of me. Teach me to live at a different pace — the pace of someone who actually trusts you.\n\nAmen.",
  },
  {
    n: 4,
    title:   "What You Hold Onto",
    theme:   "The Grip",
    // Hands open, soft light — release, surrender, trust
    img:     "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=600&auto=format&fit=crop",
    opening: "There are things you're holding onto right now.",
    body: [
      "Some of them are obvious. Some are deeper down — beneath the plans and the preferences and the way you think things ought to go.",
      "Expectations. Outcomes. Control. The quiet insistence that certain things in your life stay exactly where you put them.",
      "Most of the time, it doesn't feel like a problem. Until something moves.",
      "Then you feel it — the tension that tells you how tightly you've been gripping.",
      "Formation moves through the open hand. But most of us are not practiced at opening it.",
    ],
    teaching: [
      "Surrender sounds simple — until it becomes specific. It's easy to say \"I trust God\" in the abstract. It's harder when things don't go the way you planned. When you don't understand what he's doing.",
      "Jesus doesn't frame discipleship as adding something onto your life. He frames it as laying something down. <em>\"Take up your cross daily.\"</em> That word <em>daily</em> is the whole point — a daily, sometimes hourly, choice to release what your hands want to grip.",
      "The early desert fathers had a phrase for this: <em>apatheia</em> — not apathy, but a settled quality of soul that can hold all things loosely because it has found its rest in God alone. That's not resignation. It's freedom.",
    ],
    scriptures: [
      { t: "Whoever wants to be my disciple must deny themselves and take up their cross daily and follow me.", r: "Luke 9:23" },
      { t: "Trust in the Lord with all your heart and lean not on your own understanding.", r: "Proverbs 3:5" },
    ],
    practice:   "Sit quietly and ask:\n\nWhat am I trying to control right now?\nWhat outcome am I gripping?\nWhat would happen inside me if this didn't go the way I want?\n\nBe specific. Name it.\n\nThen say it out loud: \"God, I'm holding onto this — and I'm choosing to give it to you.\"\n\nSit quietly afterward. Don't immediately fill the space.",
    reflection: "What would it actually look like to trust God with this — not just say that you do?",
    prayer:     "God,\n\nI hold onto things without even realizing it. Plans. Expectations. Outcomes I've already decided should happen.\n\nHelp me to open my hands. Not because I feel ready — but because I trust you.\n\nTeach me what daily surrender actually looks like in my life.\n\nAmen.",
  },
  {
    n: 5,
    title:   "What You Avoid",
    theme:   "The Interior",
    // Single shaft of light through dark forest — interior honesty, what's hidden
    img:     "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop",
    opening: "There are things happening inside of you that you don't spend much time with.",
    body: [
      "Not because they aren't there. You can feel them sometimes, at the edges — a low hum of anxiety, a flicker of resentment, a tiredness that doesn't seem to be about sleep.",
      "But it's easier to keep moving. To stay distracted. Because when things get quiet, stuff starts to come up.",
      "Blaise Pascal wrote that all of humanity's problems stem from man's inability to sit quietly in a room alone. He meant that we are practiced at avoiding ourselves — because when things get quiet, what surfaces is real.",
      "So we fill the space. With content. With noise. With productivity. With anything that keeps us from having to look at what's underneath.",
      "But whatever you don't face doesn't go away. It goes deeper.",
    ],
    teaching: [
      "You can manage your behavior very well and still be almost entirely disconnected from your interior life. Productive. Consistent. Outwardly composed. And still carrying unaddressed anxiety, unprocessed grief, a low-grade exhaustion you've named \"just being busy.\"",
      "David doesn't open Psalm 139 by asking God to fix what's visible. He asks God to search what is hidden. <em>\"Know my heart. Know my anxious thoughts.\"</em> That's where real change begins. Not at the surface. Underneath it.",
      "The Ignatian practice of <em>examen</em> is built on this premise: at the end of each day, you stop and ask where God was present and where you drifted. Not to generate guilt. To generate awareness. Because a soul that cannot examine itself cannot grow.",
    ],
    scriptures: [
      { t: "Search me, O God, and know my heart; test me and know my anxious thoughts.", r: "Psalm 139:23–24" },
      { t: "Above all else, guard your heart, for everything you do flows from it.", r: "Proverbs 4:23" },
    ],
    practice:   "Write honestly — without editing, without explaining:\n\nWhat have I been feeling lately that I haven't named?\nWhat's been sitting under the surface?\nWhat have I been reaching for to avoid sitting with myself?\n\nDon't try to fix it. Don't try to resolve it. Just see it.\n\nThen bring it to God. Not with explanations. Just with honesty.",
    reflection: "What have you been carrying that you haven't actually acknowledged?",
    prayer:     "God,\n\nI've been avoiding things in my own heart. Not because I don't care — but because I don't always know what to do with them.\n\nSearch me. Show me what is really going on inside of me. And meet me there.\n\nAmen.",
  },
  {
    n: 6,
    title:   "You Cannot Do This Alone",
    theme:   "The Community",
    // Two people sitting together, warm light — shared life, community
    img:     "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    opening: "It's easy to keep your life at the surface with people.",
    body: [
      "Talk about work. Kids. Weekend plans. How things are going — the version you're comfortable with. And never let anyone actually see what's underneath.",
      "Most of us have mastered the art of being known without being known.",
      "But formation — real formation — doesn't happen in isolation. It never has.",
      "The ancient practice of spiritual direction, the monastic tradition of communal life, the New Testament pattern of fellowship far more than a weekly gathering — all of it points to the same reality: we are formed by the people we are with.",
      "Which means the depth of your community is not a social preference. It's a formation question.",
    ],
    teaching: [
      "The early church did not treat community as an optional supplement to personal faith. It was the environment in which faith was practiced, tested, and deepened.",
      "The Greek word <em>koinonia</em> — usually translated \"fellowship\" — meant something far more substantive than gathering. Shared life. Common participation. Mutual belonging.",
      "You cannot become like Jesus alone, because Jesus himself did not live alone. He lived in close proximity to twelve people — eating with them, traveling with them, letting them see him tired, grieving, frustrated, praying. That proximity is what formed them.",
      "Genuine community requires the one thing most of us quietly resist: being seen as we actually are. Not the competent version. The real version. That vulnerability is not weakness. It is the door.",
    ],
    scriptures: [
      { t: "Let us consider how we may spur one another on toward love and good deeds, not giving up meeting together…", r: "Hebrews 10:24–25" },
      { t: "Confess your sins to each other and pray for each other so that you may be healed.", r: "James 5:16" },
    ],
    practice:   "Reach out to one person today. Not casually. Intentionally.\n\nShare one real thing — something you're working through, something God has been showing you this week, something that has been hard.\n\nThen ask them the same question.\n\nThis is how community is built. Not through events. Through honest conversation, repeated over time.",
    reflection: "What keeps you from letting people see what is actually going on in you?",
    prayer:     "God,\n\nI tend to keep things to myself. Not always intentionally — it's just easier.\n\nGive me the courage to be honest. And surround me with people who are willing to do the same.\n\nForm me through community, not just in spite of its difficulty.\n\nAmen.",
  },
  {
    n: 7,
    title:   "Build a Life That Forms You",
    theme:   "The Rule",
    // Ancient stone architecture, permanence, foundation — building, structure
    img:     "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=1400&auto=format&fit=crop",
    imgThumb:"https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=600&auto=format&fit=crop",
    opening: "Here's the honest truth about the end of a week like this:",
    body: [
      "The feeling fades.",
      "Insight without structure rarely becomes transformation. You can see things clearly, feel genuinely moved, want something different — and three weeks from now be right back in the same patterns, wondering what happened.",
      "This is not a character flaw. It's just how human formation works.",
      "You become what you repeatedly do — not what you occasionally feel.",
      "The ancient tradition of a <em>Rule of Life</em> is simply the decision to stop leaving your formation to chance. A chosen structure — rhythms, relationships, and practices that create the conditions in which transformation is actually possible.",
    ],
    teaching: [
      "Paul uses the language of training — <em>gymnazō</em> — the same word for an athlete in disciplined preparation. Not striving. Not earning. Training. An athlete doesn't train to earn approval. They train because they want to be capable of what they're called to do.",
      "Keep it simple. The Rule that lasts is not the most ambitious one. It's the one you'll actually keep — the small, consistent, daily choices that accumulate into a different kind of life.",
      "<em>What will anchor your day?</em> Scripture. Silence. Prayer. Even five minutes, taken seriously, compounds over time. <em>What will reset your week?</em> A Sabbath rhythm — one day where you stop and declare that God is in charge. <em>What will protect your attention?</em> A digital boundary. The greatest threat to your formation is not immorality. It's distraction.",
    ],
    scriptures: [
      { t: "Train yourself for godliness; for while bodily training is of some value, godliness is of value in every way.", r: "1 Timothy 4:7–8" },
      { t: "Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine.", r: "John 15:4" },
    ],
    practice:   "Write a simple Rule of Life. Three categories. Keep it short enough to actually remember.\n\nDaily: What will anchor you to God each morning?\n\nWeekly: Where will you rest, reset, and trust?\n\nDigital: What one boundary will protect your attention?\n\nThen — and this is the most important step — tell one person what you wrote. Not to perform it. To be held to it.",
    reflection: "What will you actually follow through on — not just what sounds right?",
    prayer:     "God,\n\nI don't want this to stay at the level of intention.\n\nHelp me build something real. Give me discipline where I've been inconsistent. Give me grace where I fail.\n\nShape my life through what I choose to practice. Form me over time.\n\nYou are the vine. I want to remain.\n\nAmen.",
  },
];


const DAY_META = {
  1: {
    line: "The world does not need your permission. It just needs your attention.",
    why: "If you never name what is shaping you, you will keep calling it normal. Awareness is the first break from drift.",
    change: "Today changes the posture. You stop assuming your life is neutral and start paying attention to what is actually training your mind and desires.",
  },
  2: {
    line: "What you give your first attention to — you give your heart to.",
    why: "Morning is not just a time slot. It is a direction-setting window. The first voice in has unusual power over the tone of the day.",
    change: "This shifts the first thirty minutes from reaction to intention. Scripture becomes the first framing voice instead of the algorithm.",
  },
  3: {
    line: "Hurry is not neutral. Hurry is a formation system.",
    why: "A rushed life trains a rushed soul. You lose the ability to notice God, receive people, and hear what is happening inside you.",
    change: "Today interrupts automatic speed. You begin practicing presence instead of living mentally ahead of your life.",
  },
  4: {
    line: "Formation moves through the open hand.",
    why: "What you grip begins to govern you. Surrender is not passive; it is the refusal to let anxiety and control become your operating system.",
    change: "This reframes trust as a real action. You name what you are clutching and practice release instead of management.",
  },
  5: {
    line: "Whatever you don't face doesn't go away. It goes deeper.",
    why: "An unexamined inner life still drives your outer life. Hidden fear, resentment, exhaustion, and grief all shape your reactions whether you name them or not.",
    change: "Today moves honesty to the center. You stop managing appearances and begin bringing what is real into the light before God.",
  },
  6: {
    line: "Most of us have mastered the art of being known without being known.",
    why: "Isolation preserves image but limits formation. Shared life is not an optional add-on to discipleship; it is one of the places discipleship actually happens.",
    change: "This pushes you beyond private spirituality. You practice honest presence with another person instead of staying surfaced and self-protected.",
  },
  7: {
    line: "You become what you repeatedly do — not what you occasionally feel.",
    why: "Insight without structure fades quickly. Real change needs practices, rhythms, and boundaries that can hold conviction when emotion wears off.",
    change: "Today turns reflection into architecture. You begin building a repeatable pattern of life instead of waiting for another meaningful moment."
  },
};


/* ─── STORAGE HELPERS ─────────────────────────────────────────────── */

function getProgress() {
  try { return JSON.parse(localStorage.getItem("cf7") || "{}"); }
  catch { return {}; }
}
function markComplete(n) {
  const p = getProgress();
  p[n] = 1;
  localStorage.setItem("cf7", JSON.stringify(p));
  window.dispatchEvent(new CustomEvent("cf7-progress"));
}
function isDone(n) { return !!getProgress()[n]; }
function getCompletionCount(progress = getProgress()) {
  return DAYS.reduce((acc, day) => acc + (progress[day.n] ? 1 : 0), 0);
}
function isUnlocked(n, progress = getProgress()) {
  if (n === 1) return true;
  return !!progress[n - 1];
}
function getCurrentDay(progress = getProgress()) {
  return DAYS.find((day) => !progress[day.n])?.n || DAYS[DAYS.length - 1].n;
}
function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, "");
}
function renderRichText(text, key) {
  return <p key={key} dangerouslySetInnerHTML={{ __html: text }} />;
}
function getCardState(n, progress = getProgress()) {
  const done = !!progress[n];
  const unlocked = isUnlocked(n, progress);
  const current = !done && unlocked && getCurrentDay(progress) === n;
  return { done, unlocked, current };
}

/* ─── SHARED STYLES (injected once) ──────────────────────────────── */

export function ChallengeStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      .cf7-wrap * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      .cf7-wrap { font-family: 'Barlow Condensed', sans-serif; background: #06050A; color: #FAF8F5; min-height: 100svh; overflow-x: hidden; }

      /* Corner nav */
      .cf7-corner-nav {
        position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
        z-index: 200; display: flex; align-items: center; gap: 10px;
        padding: 10px 20px 10px 14px; border-radius: 999px;
        background: rgba(14,12,10,0.85); backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.08);
        text-decoration: none; transition: border-color .25s;
      }
      .cf7-corner-nav:hover { border-color: rgba(201,168,76,0.35); }
      .cf7-shield-mark { position: fixed; top: 1.25rem; left: 1.5rem; z-index: 200; width: 192px; height: 192px; opacity: 0.32; pointer-events: none; }
      @media (max-width: 640px) { .cf7-shield-mark { width: 100px; height: 100px; top: 0.5rem; left: 0.5rem; } }
      .cf7-corner-nav img  { width: 28px; height: 28px; object-fit: contain; filter: invert(1) brightness(1.1); }
      .cf7-corner-nav span { font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.55); font-weight: 600; white-space: nowrap; }

      /* Progress bar */
      .cf7-prog-bar  { position: sticky; top: 0; z-index: 190; height: 2px; background: rgba(255,255,255,0.05); }
      .cf7-prog-fill { height: 100%; width: 0; background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35)); transition: width .15s linear; }

      /* ── LANDING ── */
      .cf7-hero {
        position: relative; min-height: 100svh; display: flex; flex-direction: column;
        align-items: center; justify-content: center; overflow: hidden;
        background: #06050A; padding: 2rem 1.5rem; text-align: center;
      }
      .cf7-hero-bg {
        position: absolute; inset: 0; pointer-events: none;
        background: radial-gradient(ellipse 70% 55% at 50% 28%, rgba(201,168,76,0.09), transparent 65%),
                    radial-gradient(circle at 20% 12%, rgba(171,122,68,0.10), transparent 28%);
      }
      .cf7-vbeam {
        position: absolute; left: 50%; top: 0; width: 1px; transform: translateX(-50%);
        background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.88) 35%, rgba(201,168,76,0.55) 65%, transparent);
        height: 0; opacity: 0; pointer-events: none;
        box-shadow: 0 0 18px rgba(255,255,255,0.22);
        transition: height 1.7s cubic-bezier(0.16,1,0.3,1), opacity .5s;
      }
      .cf7-bloom {
        position: absolute; left: 50%; top: 32%; transform: translate(-50%,-50%);
        width: min(520px,100vw); height: min(520px,100vw); border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(201,168,76,0.04) 30%, transparent 65%);
        filter: blur(44px); opacity: 0; pointer-events: none; transition: opacity 2s .5s;
      }
      .cf7-hero-mark {
        width: clamp(52px,11vw,72px); height: clamp(52px,11vw,72px);
        margin: 0 auto 1.5rem; display: block;
        filter: invert(1) brightness(1.1);
        opacity: 0; transform: translateY(12px);
        transition: opacity 1s .9s, transform 1s .9s cubic-bezier(0.16,1,0.3,1);
      }
      .cf7-hero-content {
        position: relative; z-index: 10; max-width: 540px;
        opacity: 0; transform: translateY(24px);
        transition: opacity 1.1s 1.3s, transform 1.1s 1.3s cubic-bezier(0.16,1,0.3,1);
      }
      .cf7-entry-label { display: block; font-size: 10px; letter-spacing: .45em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.75rem; }
      .cf7-h1 { font-size: clamp(64px,17vw,128px); font-weight: 700; text-transform: uppercase; letter-spacing: .05em; line-height: .84; color: #FAF8F5; margin-bottom: 1.25rem; }
      .cf7-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(17px,4vw,26px); color: rgba(250,248,245,0.28); margin-bottom: 1.5rem; }
      .cf7-sub { font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: rgba(250,248,245,0.4); line-height: 2; margin-bottom: 2.5rem; max-width: 300px; margin-left: auto; margin-right: auto; }
      .cf7-cta {
        display: inline-flex; align-items: center; gap: 10px; padding: 16px 36px;
        border-radius: 999px; background: #FAF8F5; color: #0A0A0A;
        border: 2px solid #C9A84C; cursor: pointer; text-decoration: none;
        font-family: 'Barlow Condensed', sans-serif; font-size: 10px;
        letter-spacing: .28em; text-transform: uppercase; font-weight: 700;
        box-shadow: 0 0 28px rgba(201,168,76,0.2); transition: background .25s;
      }
      .cf7-cta:hover { background: #C9A84C; }
      .cf7-scripture { margin-top: 2rem; font-size: 9px; letter-spacing: .4em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

      /* Challenge section */
      .cf7-challenge { background: #17140F; padding: 80px 0 70px; }
      .cf7-challenge-shell { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem 3rem; }
      .cf7-challenge-header { }
      .cf7-challenge-sidebar { }
      .cf7-cards-shell { max-width: 1100px; margin: 0 auto; padding: 0 1.25rem; }
      @media (min-width: 1024px) {
        .cf7-challenge-shell { display: grid; grid-template-columns: 1fr 300px; gap: 0 64px; align-items: start; padding: 0 48px 3rem; }
        .cf7-cards-shell { padding: 0 48px; }
        .cf7-challenge-sidebar { position: sticky; top: 80px; border-left: 1px solid rgba(255,255,255,0.06); padding-left: 40px; }
      }
      .cf7-eyebrow   { font-size: 10px; letter-spacing: .48em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1rem; }
      .cf7-section-h2 { font-size: clamp(40px,10vw,70px); font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #FAF8F5; line-height: .9; margin-bottom: .75rem; text-align: center; }
      .cf7-section-italic { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(15px,3.5vw,22px); color: rgba(250,248,245,0.22); margin-bottom: 1rem; text-align: center; }
      .cf7-section-copy { max-width: 620px; margin: 0 auto 2.5rem; text-align: center; font-size: 10px; line-height: 1.95; letter-spacing: .18em; text-transform: uppercase; color: rgba(250,248,245,0.38); }
      @media (min-width: 1024px) {
        .cf7-section-h2 { text-align: left; }
        .cf7-section-italic { text-align: left; }
        .cf7-section-copy { text-align: left; margin-left: 0; margin-right: 0; max-width: none; }
      }
      .cf7-divider { height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent); max-width: 560px; margin: 0 auto 2.5rem; }

      .cf7-band { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 2.75rem; }
      .cf7-band img  { width: 28px; height: 28px; opacity: .35; filter: invert(1); }
      .cf7-band-text { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(250,248,245,0.25); font-weight: 600; }
      .cf7-band-rule { flex: 1; max-width: 70px; height: 1px; background: rgba(255,255,255,0.08); }

      /* Tracker */
      .cf7-tracker { display: flex; justify-content: center; gap: 0; margin-bottom: 2rem; max-width: 400px; margin-left: auto; margin-right: auto; padding: 0 .5rem; }
      @media (min-width: 1024px) { .cf7-tracker { margin-left: 0; margin-right: 0; max-width: none; } }
      .cf7-tdot { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; cursor: pointer; position: relative; }
      .cf7-tdot::after { content: ''; position: absolute; top: 10px; left: 50%; width: 100%; height: 1px; background: rgba(255,255,255,0.08); z-index: 0; }
      .cf7-tdot:last-child::after { display: none; }
      .cf7-dot-circle { width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.18); background: transparent; position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700; color: rgba(255,255,255,0.3); transition: all .3s; font-family: 'Barlow Condensed', sans-serif; }
      .cf7-tdot.done .cf7-dot-circle { background: #C9A84C; border-color: #C9A84C; color: #0A0A0A; }
      .cf7-tdot.cur  .cf7-dot-circle { border-color: #C9A84C; color: #C9A84C; box-shadow: 0 0 10px rgba(201,168,76,0.35); }
      .cf7-dot-label { font-size: 7px; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
      .cf7-tdot.done .cf7-dot-label, .cf7-tdot.cur .cf7-dot-label { color: rgba(201,168,76,0.6); }
      .cf7-tdot.locked { cursor: default; opacity: .55; }
      .cf7-tdot.locked .cf7-dot-circle { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.16); }
      .cf7-tdot.locked .cf7-dot-label { color: rgba(255,255,255,0.15); }

      /* Day cards grid */
      .cf7-grid-wrap { position: relative; max-width: 1100px; margin: 0 auto 3.5rem; }
      .cf7-grid-wrap::before {
        content: ''; position: absolute; left: 0; right: 0; top: 18px; height: 1px;
        background: linear-gradient(to right, transparent, rgba(201,168,76,0.16), transparent);
        opacity: .55; pointer-events: none;
      }
      .cf7-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(148px,42vw), 1fr)); gap: 12px; max-width: 1100px; margin: 0 auto; }
      .cf7-card {
        position: relative; overflow: hidden; border-radius: 16px; cursor: pointer;
        border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04);
        aspect-ratio: 3/4; text-decoration: none; display: block;
        transition: border-color .3s, box-shadow .3s, transform .3s;
      }
      .cf7-card:hover { transform: translateY(-5px); border-color: rgba(201,168,76,0.4); box-shadow: 0 16px 40px rgba(0,0,0,0.45), 0 0 20px rgba(201,168,76,0.08); }
      .cf7-card:active { transform: scale(0.97); }
      .cf7-card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; filter: grayscale(1); opacity: .32; transition: opacity .5s, filter .5s; }
      .cf7-card:hover .cf7-card-bg { opacity: .68; filter: grayscale(0); }
      .cf7-card-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,5,10,0.96) 0%, rgba(6,5,10,0.42) 55%, rgba(6,5,10,0.08) 100%); }
      .cf7-card-body { position: absolute; inset: 0; padding: 12px 13px; display: flex; flex-direction: column; justify-content: flex-end; }
      .cf7-card-num   { font-size: 8px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; margin-bottom: 3px; }
      .cf7-card-title { font-size: clamp(11px,2.4vw,13px); font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: #FAF8F5; line-height: 1.2; }
      .cf7-card-theme { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 10px; color: rgba(250,248,245,0.38); margin-top: 3px; }
      .cf7-card-cta   { margin-top: 8px; display: inline-flex; align-items: center; gap: 5px; font-size: 7px; letter-spacing: .2em; text-transform: uppercase; color: #C9A84C; opacity: 0; transition: opacity .25s; }
      .cf7-card:hover .cf7-card-cta { opacity: 1; }
      .cf7-done-badge { position: absolute; top: 9px; left: 9px; z-index: 5; width: 22px; height: 22px; border-radius: 50%; background: #C9A84C; display: none; align-items: center; justify-content: center; }
      .cf7-card.done .cf7-done-badge { display: flex; }
      .cf7-card.locked { cursor: default; opacity: .58; }
      .cf7-card.locked .cf7-card-bg { opacity: .18 !important; filter: grayscale(1.1) blur(.5px); }
      .cf7-card.locked:hover { transform: none; border-color: rgba(255,255,255,0.08); box-shadow: none; }
      .cf7-card-state {
        position: absolute; top: 10px; right: 10px; z-index: 6;
        font-size: 7px; letter-spacing: .24em; text-transform: uppercase;
        color: rgba(250,248,245,0.86); padding: 7px 10px; border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12); background: rgba(6,5,10,0.5); backdrop-filter: blur(10px);
      }
      .cf7-card.locked .cf7-card-state { color: rgba(250,248,245,0.42); }
      .cf7-card.current .cf7-card-state {
        color: #0A0A0A; background: #C9A84C; border-color: #C9A84C;
        box-shadow: 0 0 18px rgba(201,168,76,0.18);
      }
      .cf7-card-lock {
        position: absolute; inset: 0; z-index: 4; display: flex; align-items: center; justify-content: center;
        background: linear-gradient(to top, rgba(6,5,10,0.82), rgba(6,5,10,0.52));
        text-align: center; padding: 18px; color: rgba(250,248,245,0.54);
        font-size: 8px; line-height: 1.8; letter-spacing: .26em; text-transform: uppercase;
      }

      /* Email form */
      .cf7-form-wrap  { max-width: 460px; margin: 0 auto; text-align: center; }
      .cf7-form-eyebrow { font-size: 10px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: .75rem; }
      .cf7-form-h { font-size: clamp(26px,6vw,38px); font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #FAF8F5; margin-bottom: 2rem; line-height: .9; }
      .cf7-form-row { display: flex; gap: 8px; margin-bottom: 1rem; }
      @media (max-width: 420px) { .cf7-form-row { flex-direction: column; } }
      .cf7-email-inp {
        flex: 1; padding: 14px 20px; border-radius: 999px;
        background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
        color: #FAF8F5; font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px; letter-spacing: .18em; text-transform: uppercase;
        outline: none; transition: border-color .3s; min-width: 0;
      }
      .cf7-email-inp::placeholder { color: rgba(250,248,245,0.2); }
      .cf7-email-inp:focus { border-color: rgba(201,168,76,0.55); }
      .cf7-begin-btn {
        padding: 14px 28px; border-radius: 999px; border: 2px solid #C9A84C;
        background: #C9A84C; color: #0A0A0A; cursor: pointer;
        font-family: 'Barlow Condensed', sans-serif; font-size: 10px;
        letter-spacing: .25em; text-transform: uppercase; font-weight: 700;
        display: flex; align-items: center; gap: 7px; white-space: nowrap;
        transition: background .25s, border-color .25s, color .25s;
      }
      .cf7-begin-btn:hover { background: #FAF8F5; border-color: #FAF8F5; }
      .cf7-form-note { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.2); }
      .cf7-intensity-line { max-width: 620px; margin: 0 auto 2.4rem; text-align: center; font-size: 9px; letter-spacing: .34em; text-transform: uppercase; color: rgba(201,168,76,0.68); line-height: 1.9; }
      @media (min-width: 1024px) { .cf7-intensity-line { text-align: left; margin-left: 0; margin-right: 0; max-width: none; } }
      .cf7-suc-msg   { display: none; font-size: 10px; letter-spacing: .35em; text-transform: uppercase; color: #C9A84C; padding: 20px; }
      .cf7-suc-sub   { display: block; color: rgba(255,255,255,0.3); font-size: 8px; margin-top: 6px; }

      /* ── DEVOTION PAGE ── */
      .cf7-dev-wrap { background: #0E0C0A; min-height: 100svh; }

      .cf7-dev-img-band {
        position: relative; overflow: hidden;
        min-height: clamp(240px,45vw,400px); display: flex; flex-direction: column; justify-content: flex-end;
      }
      .cf7-dev-img-bg  { position: absolute; inset: 0; background-size: cover; background-position: center; filter: grayscale(.2); }
      .cf7-dev-img-ov  { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,12,10,0.97) 0%, rgba(14,12,10,0.5) 55%, rgba(14,12,10,0.18) 100%); }
      .cf7-dev-img-inner { position: relative; z-index: 2; padding: 1.75rem 24px 2.25rem; max-width: 680px; margin: 0 auto; width: 100%; }
      .cf7-dev-img-logo  { width: 32px; height: 32px; filter: invert(1) brightness(.9); opacity: .5; margin-bottom: .9rem; display: block; }
      .cf7-dev-img-eye   { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.8); margin-bottom: .55rem; }
      .cf7-dev-img-h1    { font-size: clamp(30px,8vw,62px); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; line-height: .88; }

      .cf7-dev-content { max-width: 680px; margin: 0 auto; padding: 48px 24px 100px; }
      .cf7-dev-rule    { height: 1px; background: linear-gradient(to right, #C9A84C, transparent); opacity: .28; margin: 2.5rem 0; }
      .cf7-tracker-row { margin-bottom: 2rem; }
      .cf7-dev-two-col { display: flex; flex-direction: column; }
      .cf7-dev-sidebar { margin-top: 2rem; border-left: none; padding-left: 0; }
      .cf7-pull-quote {
        margin: 0 0 2.5rem; padding: 1.75rem 1.35rem 1.5rem; text-align: center;
        border-top: 1px solid rgba(201,168,76,0.28); border-bottom: 1px solid rgba(201,168,76,0.12);
        background: linear-gradient(to bottom, rgba(201,168,76,0.05), rgba(255,255,255,0.02));
      }
      .cf7-pull-quote p {
        font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(24px,5vw,34px);
        line-height: 1.25; color: rgba(250,248,245,0.9); margin: 0 auto; max-width: 560px;
      }
      .cf7-pull-quote span {
        display: block; margin-top: .85rem; font-size: 8px; letter-spacing: .32em; text-transform: uppercase;
        color: rgba(201,168,76,0.76);
      }

      .cf7-dev-sec     { margin-bottom: 2.75rem; }
      .cf7-dev-sec-lbl { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-bottom: 1.2rem; padding-bottom: .7rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .cf7-dev-body    { font-family: 'Cormorant Garamond', serif; font-size: clamp(17px,4vw,20px); line-height: 1.84; color: rgba(250,248,245,0.78); }
      .cf7-dev-body p  { margin-bottom: 1.2rem; }
      .cf7-dev-body em { font-style: italic; color: rgba(250,248,245,0.96); }

      .cf7-scripture-block { background: rgba(255,255,255,0.03); border-left: 2px solid #C9A84C; border-radius: 0 12px 12px 0; padding: 1.4rem 1.5rem; margin: 1.5rem 0; }
      .cf7-scripture-block p    { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(16px,4vw,19px); color: rgba(250,248,245,0.75); line-height: 1.7; margin-bottom: .7rem; }
      .cf7-scripture-block cite { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }

      .cf7-practice-block { background: rgba(201,168,76,0.05); border: 1px solid rgba(201,168,76,0.18); border-radius: 16px; padding: 1.75rem; }
      .cf7-practice-tag   { display: inline-block; font-size: 8px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.22); border-radius: 999px; padding: 5px 14px; margin-bottom: 1.2rem; }
      .cf7-practice-pre {
        font-size: 9px; letter-spacing: .26em; text-transform: uppercase; color: rgba(250,248,245,0.45);
        margin: 0 0 1rem;
      }
      .cf7-impact-block {
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px;
        padding: 1.5rem 1.4rem; margin-bottom: 2rem;
      }
      .cf7-impact-block.why { border-color: rgba(201,168,76,0.16); background: rgba(201,168,76,0.035); }
      .cf7-impact-block.change { border-color: rgba(255,255,255,0.08); background: rgba(255,255,255,0.025); }

      .cf7-reflection { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 2rem; margin-top: 2rem; }
      .cf7-prayer     { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 1.75rem; margin-top: 1.5rem; }
      .cf7-prayer .cf7-dev-body { font-size: clamp(15px,3.5vw,17px); color: rgba(250,248,245,0.52); }

      .cf7-brand-foot      { text-align: center; padding: 2.5rem 0 1rem; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 1rem; }
      .cf7-brand-foot img  { width: 26px; height: 26px; opacity: .2; filter: invert(1); margin: 0 auto .75rem; display: block; }
      .cf7-brand-foot p    { font-size: 8px; letter-spacing: .32em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

      /* Day nav */
      .cf7-day-nav     { display: flex; gap: 10px; margin-top: 2.5rem; }
      .cf7-nav-btn     { flex: 1; padding: 15px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); cursor: pointer; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: .18em; text-transform: uppercase; color: rgba(255,255,255,0.38); text-align: center; transition: border-color .25s, color .25s; text-decoration: none; display: block; }
      .cf7-nav-btn:hover { border-color: rgba(201,168,76,0.38); color: #C9A84C; }
      .cf7-nav-btn span  { display: block; font-size: 7px; opacity: .45; margin-bottom: 3px; }
      .cf7-complete-toast {
        position: fixed; right: 18px; bottom: 18px; z-index: 260; pointer-events: none;
        padding: 14px 16px 13px; border-radius: 16px; min-width: 220px;
        background: rgba(14,12,10,0.9); border: 1px solid rgba(201,168,76,0.25); backdrop-filter: blur(18px);
        box-shadow: 0 18px 40px rgba(0,0,0,0.35), 0 0 24px rgba(201,168,76,0.08);
        transform: translateY(18px); opacity: 0; transition: opacity .35s, transform .35s;
      }
      .cf7-complete-toast.show { opacity: 1; transform: translateY(0); }
      .cf7-complete-toast strong {
        display: block; font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: #C9A84C; margin-bottom: 6px;
      }
      .cf7-complete-toast span {
        display: block; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: rgba(250,248,245,0.6); line-height: 1.6;
      }
      .cf7-next-step {
        margin-top: 2.5rem; border: 1px solid rgba(201,168,76,0.18); border-radius: 20px; padding: 1.7rem;
        background: linear-gradient(to bottom right, rgba(201,168,76,0.06), rgba(255,255,255,0.02));
      }
      .cf7-next-step .cf7-dev-sec-lbl { border-bottom: none; padding-bottom: 0; margin-bottom: .85rem; }
      .cf7-next-step-cta { display: inline-flex; margin-top: 1rem; align-items: center; gap: 8px; text-decoration: none; color: #0A0A0A; background: #C9A84C; border: 1px solid #C9A84C; border-radius: 999px; padding: 12px 18px; font-size: 9px; letter-spacing: .24em; text-transform: uppercase; font-weight: 700; }
      .cf7-next-step-cta:hover { background: #FAF8F5; border-color: #FAF8F5; }

      /* Footer */
      .cf7-footer     { background: #06050A; border-top: 1px solid rgba(255,255,255,0.05); padding: 28px 1.5rem; text-align: center; }
      .cf7-footer img { width: 24px; height: 24px; opacity: .2; filter: invert(1); display: block; margin: 0 auto .75rem; }
      .cf7-footer p   { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

      /* Reading progress bar */
      .cf7-rbar  { position: sticky; top: 0; z-index: 100; height: 2px; background: rgba(255,255,255,0.05); }
      .cf7-rfill { height: 100%; width: 0; background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.3)); transition: width .12s linear; }

      /* Scroll indicator on hero */
      .cf7-scroll-hint { position: absolute; bottom: 1.5rem; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 6px; opacity: 0; transition: opacity 1s 2.6s; pointer-events: none; }
      .cf7-scroll-hint span { font-size: 8px; letter-spacing: .38em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
      @keyframes cf7sb { 0%,100%{ transform: translateY(0) } 50%{ transform: translateY(5px) } }
      .cf7-scroll-hint svg { animation: cf7sb 1.6s ease-in-out infinite; }

      /* Particles */
      #cf7-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
      .cf7-particle  { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.7); animation: cf7pdrift linear infinite; opacity: 0; }
      @keyframes cf7pdrift { 0%{ opacity:0; transform:translateY(0); } 15%{ opacity:.8; } 85%{ opacity:.4; } 100%{ opacity:0; transform:translateY(-60px); } }
    `}</style>
  );
}

/* ─── CORNER NAV (shared across all challenge pages) ─────────────── */

function CornerNav() {
  return (
    <>
      <img
        src="/shield-white.png"
        className="cf7-shield-mark"
        onError={e => { e.target.style.display = "none"; }}
        alt=""
      />
      <Link to="/" className="cf7-corner-nav">
        <img
          src="/helmet.png"
          onError={e => { e.target.style.display = "none"; }}
          alt="Counter Formation"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <span>Counter Formation</span>
      </Link>
    </>
  );
}

/* ─── TRACKER (shared) ───────────────────────────────────────────── */

function Tracker({ activeDayN, progress }) {
  const p = progress || getProgress();
  const currentDay = getCurrentDay(p);

  return (
    <div className="cf7-tracker">
      {DAYS.map((d) => {
        const done = !!p[d.n];
        const unlocked = isUnlocked(d.n, p);
        const cur = (activeDayN ? d.n === activeDayN : d.n === currentDay) && !done;
        return (
          <Link
            key={d.n}
            to={unlocked ? `${CHALLENGE_BASE}/day/${d.n}` : CHALLENGE_BASE}
            className={`cf7-tdot${done ? " done" : cur ? " cur" : ""}${!unlocked ? " locked" : ""}`}
            style={{ textDecoration: "none" }}
            aria-disabled={!unlocked}
          >
            <div className="cf7-dot-circle">
              {done ? "✓" : !unlocked ? "•" : d.n}
            </div>
            <span className="cf7-dot-label">{done ? "Done" : !unlocked ? "Locked" : `D${d.n}`}</span>
          </Link>
        );
      })}
    </div>
  );
}

/* ─── LANDING PAGE ────────────────────────────────────────────────── */

export function CFLanding() {
  const vbRef = useRef(null);
  const blRef = useRef(null);
  const markRef = useRef(null);
  const contRef = useRef(null);
  const shRef = useRef(null);
  const progRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(getProgress());

  const currentDay = useMemo(() => getCurrentDay(progress), [progress]);
  const completionCount = useMemo(() => getCompletionCount(progress), [progress]);

  useEffect(() => {
    const vb = vbRef.current, bl = blRef.current,
      mk = markRef.current, co = contRef.current, sh = shRef.current;
    setTimeout(() => { if (vb) { vb.style.opacity = "1"; vb.style.height = "78svh"; } }, 300);
    setTimeout(() => { if (bl) bl.style.opacity = "1"; }, 500);
    setTimeout(() => { if (mk) { mk.style.opacity = "1"; mk.style.transform = "none"; } }, 950);
    setTimeout(() => { if (co) { co.style.opacity = "1"; co.style.transform = "none"; } }, 1350);
    setTimeout(() => { if (sh) sh.style.opacity = "1"; }, 2700);
    setTimeout(() => {
      if (vb) {
        vb.style.transition = "opacity 2.5s ease";
        vb.style.opacity = "0";
      }
    }, 4300);

    const pc = document.getElementById("cf7-particles");
    if (pc && !pc.childElementCount) {
      for (let i = 0; i < 20; i++) {
        const p = document.createElement("div");
        p.className = "cf7-particle";
        const s = Math.random() * 1.6 + 0.4;
        p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;bottom:${Math.random()*45}%;animation-duration:${10+Math.random()*12}s;animation-delay:${Math.random()*14}s;`;
        pc.appendChild(p);
      }
    }

    const onScroll = () => {
      const d = document.documentElement;
      if (progRef.current) {
        progRef.current.style.width = (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + "%";
      }
    };
    const syncProgress = () => setProgress(getProgress());

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("cf7-progress", syncProgress);
    window.addEventListener("storage", syncProgress);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("cf7-progress", syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, []);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <div className="cf7-wrap">
      <CornerNav />
      <div className="cf7-prog-bar"><div className="cf7-prog-fill" ref={progRef} /></div>

      <section className="cf7-hero">
        <div className="cf7-hero-bg" />
        <div className="cf7-vbeam" ref={vbRef} />
        <div className="cf7-bloom" ref={blRef} />
        <div id="cf7-particles" />
        <div className="cf7-hero-content" ref={contRef}>
          <span className="cf7-entry-label">Counter Formation · The Entry Point</span>
          <h1 className="cf7-h1">7-Day<br />Formation<br />Challenge</h1>
          <p className="cf7-italic">You are already being formed.</p>
          <p className="cf7-sub">Interrupt the drift. Reorder your attention. Build a different pattern of life — one deliberate practice at a time.</p>
          <a
            className="cf7-cta"
            href="#challenge"
            onClick={e => { e.preventDefault(); document.getElementById("cf7-challenge").scrollIntoView({ behavior: "smooth" }); }}
          >
            {completionCount ? "Continue the Challenge" : "Begin the Challenge"}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 6.5h11M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </a>
          <p className="cf7-scripture"><ScriptureRef reference="Ephesians 6:10–18" /></p>
        </div>
        <div className="cf7-scroll-hint" ref={shRef}>
          <span>Scroll</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1L6 6L11 1" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      <section id="cf7-challenge" className="cf7-challenge">
        <div className="cf7-challenge-shell">
          <div className="cf7-challenge-header">
            <p className="cf7-eyebrow">Counter Formation</p>
            <h2 className="cf7-section-h2">The Seven Days</h2>
            <p className="cf7-section-italic">Formation is not optional. It is already happening.</p>
            <p className="cf7-section-copy">
              This is not a content library. It is a path. Seven days to interrupt drift, recover attention,
              and begin practicing a more deliberate life under Christ.
            </p>
          </div>
          <div className="cf7-challenge-sidebar">
            <Tracker activeDayN={null} progress={progress} />
            <p className="cf7-intensity-line">
              {completionCount === 0
                ? "Start with Day 1. Stay in order. Let the week build on itself."
                : completionCount === DAYS.length
                  ? "All seven complete. Go back through them slowly and keep the rhythm."
                  : `You are ${completionCount} day${completionCount === 1 ? "" : "s"} in. Continue with Day ${currentDay}.`}
            </p>
          </div>
        </div>

        <div className="cf7-cards-shell">
        <div className="cf7-grid-wrap">
          <div className="cf7-grid">
            {DAYS.map((d) => {
              const { done, unlocked, current } = getCardState(d.n, progress);
              const stateLabel = done ? "Completed" : current ? "Start Here" : unlocked ? "Continue" : "Locked";
              return (
                <Link
                  key={d.n}
                  to={unlocked ? `${CHALLENGE_BASE}/day/${d.n}` : CHALLENGE_BASE}
                  className={`cf7-card${done ? " done" : ""}${current ? " current" : ""}${!unlocked ? " locked" : ""}`}
                  aria-disabled={!unlocked}
                >
                  <div className="cf7-done-badge">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.5 7.5L8.5 2.5" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="cf7-card-state">{stateLabel}</span>
                  <div className="cf7-card-bg" style={{ backgroundImage: `url('${d.imgThumb}')` }} />
                  <div className="cf7-card-ov" />
                  {!unlocked && (
                    <div className="cf7-card-lock">
                      Complete Day {d.n - 1}
                      <br />
                      to continue
                    </div>
                  )}
                  <div className="cf7-card-body">
                    <p className="cf7-card-num">Day {d.n}</p>
                    <p className="cf7-card-title">{d.title}</p>
                    <p className="cf7-card-theme">{d.theme}</p>
                    <span className="cf7-card-cta">
                      {done ? "Read Again" : current ? "Begin Day" : "Read Devotion"}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1 5h8M5.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        </div>

        <div className="cf7-form-wrap">
          {!submitted ? (
            <>
              <p className="cf7-form-eyebrow">The Entry Point</p>
              <h3 className="cf7-form-h">
                {completionCount ? <>Stay in the<br />Pattern</> : <>Begin the<br />Challenge</>}
              </h3>
              <div className="cf7-form-row">
                <input
                  className="cf7-email-inp"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button className="cf7-begin-btn" onClick={handleSubmit}>
                  {completionCount ? "Continue" : "Begin"}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <p className="cf7-form-note">One practice per day. No noise. No drift.</p>
            </>
          ) : (
            <div className="cf7-suc-msg" style={{ display: "block" }}>
              You're in. Day {currentDay} begins now.
              <span className="cf7-suc-sub">Check your inbox. The formation has started.</span>
            </div>
          )}
        </div>
      </section>

      <footer className="cf7-footer">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
        <p>Counter Formation · Formed in Christ · Ephesians 6:10–18 · © 2026</p>
      </footer>
    </div>
  );
}

/* ─── DEVOTION PAGE ───────────────────────────────────────────────── */

export function CFDevotion() {
  const { day } = useParams();
  const navigate = useNavigate();
  const rfillRef = useRef(null);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(getProgress());
  const [showComplete, setShowComplete] = useState(false);

  const n = parseInt(day, 10);
  const d = DAYS.find(x => x.n === n);
  const meta = d ? DAY_META[d.n] : null;

  useEffect(() => {
    if (!d) navigate(CHALLENGE_BASE, { replace: true });
  }, [d, navigate]);

  useEffect(() => {
    setProgress(getProgress());
    window.scrollTo(0, 0);
  }, [n]);

  useEffect(() => {
    if (!d) return;

    let hasMarked = !!getProgress()[d.n];
    const el = contentRef.current?.closest(".cf7-dev-scroll") || window;

    const onScroll = () => {
      const scrollTop = el === window ? document.documentElement.scrollTop : el.scrollTop;
      const scrollHeight = el === window ? document.documentElement.scrollHeight : el.scrollHeight;
      const clientHeight = el === window ? window.innerHeight : el.clientHeight;
      const pct = scrollTop / (scrollHeight - clientHeight) || 0;
      if (rfillRef.current) rfillRef.current.style.width = (pct * 100) + "%";

      if (pct > 0.8 && !hasMarked) {
        markComplete(d.n);
        hasMarked = true;
        setProgress(getProgress());
        setShowComplete(true);
        window.setTimeout(() => setShowComplete(false), 2600);
      }
    };

    const syncProgress = () => setProgress(getProgress());

    if (el === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      el.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("cf7-progress", syncProgress);
    window.addEventListener("storage", syncProgress);

    return () => {
      if (el === window) {
        window.removeEventListener("scroll", onScroll);
      } else {
        el.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("cf7-progress", syncProgress);
      window.removeEventListener("storage", syncProgress);
    };
  }, [d]);

  if (!d) return null;

  const prev = DAYS.find(x => x.n === n - 1);
  const next = DAYS.find(x => x.n === n + 1);
  const practiceLines = d.practice.split("\n").map((l, i) => l ? <p key={i}>{l}</p> : <br key={i} />);
  const prayerLines = d.prayer.split("\n").map((l, i) => l ? <p key={i}>{l}</p> : <br key={i} />);
  const pullQuote = meta?.line || stripTags(d.teaching[0]);

  return (
    <div className="cf7-dev-wrap">
      <CornerNav />

      <div className="cf7-rbar"><div className="cf7-rfill" ref={rfillRef} /></div>

      <div className="cf7-dev-img-band">
        <div className="cf7-dev-img-bg" style={{ backgroundImage: `url('${d.img}')` }} />
        <div className="cf7-dev-img-ov" />
        <div className="cf7-dev-img-inner">
          <img
            className="cf7-dev-img-logo"
            src="/helmet.png"
            onError={e => { e.target.style.display = "none"; }}
            alt=""
          />
          <p className="cf7-dev-img-eye">Day {d.n} of 7 · {d.theme}</p>
          <h1 className="cf7-dev-img-h1">{d.title}</h1>
        </div>
      </div>

      <div className={`cf7-complete-toast${showComplete ? " show" : ""}`}>
        <strong>Day Complete</strong>
        <span>{next ? `Day ${d.n} is complete. Continue to Day ${next.n}.` : "All seven days complete. Keep the rhythm."}</span>
      </div>

      <div className="cf7-dev-content" ref={contentRef}>

        {/* Full-width — tracker + rule + pull quote */}
        <div className="cf7-tracker-row">
          <Tracker activeDayN={d.n} progress={progress} />
        </div>
        <div className="cf7-dev-rule" />
        <div className="cf7-pull-quote">
          <p>{pullQuote}</p>
          <span>Formation Line</span>
        </div>

        {/* Two-column zone — left content + sticky sidebar */}
        <div className="cf7-dev-two-col">
          <div className="cf7-dev-left">
            <Section label="Opening" className="cf7-dev-opening">
              <div className="cf7-dev-body">
                <p><em>{d.opening}</em></p>
                {d.body.map((p, i) => renderRichText(p, i))}
              </div>
            </Section>
            <Section label="Scripture" className="cf7-dev-scripture">
              {d.scriptures.map((s, i) => (
                <div className="cf7-scripture-block" key={i}>
                  <p>"{s.t}"</p>
                  <cite>— <ScriptureRef reference={s.r} text={s.t} /></cite>
                </div>
              ))}
            </Section>
            <Section label="Teaching" className="cf7-dev-teaching">
              <div className="cf7-dev-body">
                {d.teaching.map((p, i) => renderRichText(p, i))}
              </div>
            </Section>
          </div>

          <aside className="cf7-dev-sidebar">
            <div className="cf7-dev-sec">
              <p className="cf7-dev-sec-lbl">Reflection</p>
              <div style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.14)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(15px,3.5vw,18px)",
                color: "rgba(250,248,245,0.65)",
                lineHeight: 1.7,
              }}>
                {d.reflection}
              </div>
            </div>
            <div className="cf7-dev-sec" style={{ marginTop: "2rem" }}>
              <p className="cf7-dev-sec-lbl">Day {d.n} of 7</p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "16px",
                color: "rgba(250,248,245,0.38)",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}>
                {d.theme}
              </p>
              <Tracker activeDayN={d.n} progress={progress} />
            </div>
          </aside>
        </div>

        {/* Full-width sections — below the two-col zone, no overlap */}
        <Section label="Why This Matters" className="cf7-dev-why">
          <div className="cf7-impact-block why">
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.6vw,18px)" }}>
              <p>{meta?.why}</p>
            </div>
          </div>
        </Section>

        <Section className="cf7-dev-practice">
          <div className="cf7-practice-block">
            <span className="cf7-practice-tag">Practice · 15 Minutes</span>
            <p className="cf7-practice-pre">Do not rush this. This is where formation begins.</p>
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.5vw,17px)" }}>
              {practiceLines}
            </div>
          </div>
        </Section>

        <Section label="What This Changes" className="cf7-dev-change">
          <div className="cf7-impact-block change">
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.6vw,18px)" }}>
              <p>{meta?.change}</p>
            </div>
          </div>
        </Section>

        <Section label="Prayer" className="cf7-dev-prayer">
          <div className="cf7-prayer">
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.5vw,17px)", color: "rgba(250,248,245,0.52)" }}>
              {prayerLines}
            </div>
          </div>
        </Section>

        {d.n === 7 && (
          <div className="cf7-next-step">
            <p className="cf7-dev-sec-lbl">This Is Not The End</p>
            <div className="cf7-dev-body" style={{ fontSize: "clamp(15px,3.6vw,18px)" }}>
              <p>This week was not meant to be a spike of inspiration. It was meant to begin a different pattern.</p>
              <p>Keep the rule. Protect your attention. Stay in community. Return to these seven days when the pace picks up and the drift starts again.</p>
              <p>Counter Formation is not a moment. It is a way of living.</p>
            </div>
            <Link to={CHALLENGE_BASE} className="cf7-next-step-cta">
              Return to the Challenge
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
            <p style={{ marginTop: "1.75rem", fontSize: "clamp(13px,3.2vw,15px)", color: "rgba(250,248,245,0.55)", lineHeight: 1.7 }}>
              You've completed the 7-Day Challenge. Ready to go deeper? The Armor of God formation tracks take the disciplines you've started and build them into a daily practice.
            </p>
            <Link to="/identity" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "0.75rem", color: "#C9A84C", fontSize: "clamp(11px,2.8vw,13px)", letterSpacing: "0.08em", textDecoration: "none" }}>
              Begin the Armor of God →
            </Link>
          </div>
        )}

        <div className="cf7-brand-foot">
          <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
          <p>Counter Formation · Formed in Christ · Ephesians 6:10–18</p>
        </div>

        <div className="cf7-day-nav">
          {prev ? (
            <Link to={`${CHALLENGE_BASE}/day/${prev.n}`} className="cf7-nav-btn">
              <span>← Day {prev.n}</span>{prev.title}
            </Link>
          ) : (
            <Link to={CHALLENGE_BASE} className="cf7-nav-btn">
              <span>←</span>All Seven Days
            </Link>
          )}
          {next ? (
            <Link to={`${CHALLENGE_BASE}/day/${next.n}`} className="cf7-nav-btn">
              <span>Day {next.n} →</span>{next.title}
            </Link>
          ) : (
            <Link to={CHALLENGE_BASE} className="cf7-nav-btn">
              <span>Complete</span>Return to Challenge
            </Link>
          )}
        </div>
      </div>

      <footer className="cf7-footer">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
        <p>Counter Formation · Formed in Christ · Ephesians 6:10–18 · © 2026</p>
      </footer>
    </div>
  );
}

function Section({ label, children, className = "" }) {
  return (
    <div className={`cf7-dev-sec${className ? ` ${className}` : ""}`}>
      {label ? <p className="cf7-dev-sec-lbl">{label}</p> : null}
      {children}
    </div>
  );
}
