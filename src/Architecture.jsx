import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

const C = {
  heroBg:  "#06050A",
  darkBg:  "#0E0C0A",
  gold:    "#C9A84C",
  ivory:   "#FAF8F5",
  cream:   "#F5F0E8",
  warm:    "#EDE8DF",
  warmDark:"#1C1812",
};

/* ─── PILLAR DATA ─────────────────────────────────────────────────── */

const PILLARS = [
  {
    num: "I",
    slug: "identity",
    title: "Identity",
    route: "/identity",
    img: "/Identity_8k.png",
    // Challenge: confronts performance culture
    challenge: "You are not your output.",
    manifesto: "The modern world measures you by what you produce, how you appear, and how many people are watching. Counter Formation begins by refusing that metric entirely — and anchoring identity in Christ before anything else gets to name you.",
    sub: "Before action comes being.",
    cta: "Enter Identity",
    // Campaign page content
    heroLine: "The world has been forming your identity since you were old enough to scroll.",
    sections: [
      {
        eyebrow: "The Problem",
        headline: "You didn't choose most of what you believe about yourself.",
        body: "Platform metrics. Productivity output. Approval from people whose names you don't know. These are the identity systems of the digital age — and they run on you without your permission. You absorbed them quietly, and now they feel like truth.",
      },
      {
        eyebrow: "The Counter",
        headline: "Identity anchored in Christ is not a feeling. It is a fact that precedes performance.",
        body: "Before you produced anything. Before anyone saw you. Before the algorithm had a chance to assess your worth — you were made in the image of God, named by Christ, and sealed by the Spirit. That is the only identity that cannot be taken by a bad quarter, a silent comment section, or a season of failure.",
      },
      {
        eyebrow: "The Practice",
        headline: "Formation begins with what you believe about who you are.",
        body: "Counter Formation calls you to daily surrender — not as religious performance, but as the repeated act of releasing the identity metrics the world hands you and returning to the one God has already declared. This is the first pillar because nothing else holds without it.",
      },
    ],
    pullQuote: "You are not what the algorithm says you are. You are who God says you are.",
    scripture: { t: "See what great love the Father has lavished on us, that we should be called children of God — and that is what we are.", r: "1 John 3:1" },
    connectedRhythm: "presence",
    connectedChallenge: 1,
  },
  {
    num: "II",
    slug: "practice",
    route: "/practice",
    title: "Practice",
    img: "/Practice_8k.png",
    challenge: "Intention without rhythm is just wishful thinking.",
    manifesto: "You do not drift into a formed life. You build one — through scripture before screen, through silence before noise, through sabbath before production. The practices are not the goal. They are the conditions under which formation becomes possible.",
    sub: "A life is built on rhythms.",
    cta: "Enter Practice",
    heroLine: "You become what you repeatedly do — not what you occasionally decide.",
    sections: [
      {
        eyebrow: "The Problem",
        headline: "Modern life has a rhythm. You just didn't choose it.",
        body: "Wake. Check phone. Consume. Produce. Repeat. The rhythm of the digital age is relentless and it is forming you — training your attention span, shaping your desires, calibrating what you reach for under pressure. It does not need your consent. It just needs your habit.",
      },
      {
        eyebrow: "The Counter",
        headline: "Spiritual disciplines are not religious obligations. They are training.",
        body: "Paul calls it gymnazō — the same word used for an athlete conditioning their body. You are not earning God's approval through practice. You are arranging your life so that you are present, available, and trainable by the One who actually transforms. The discipline creates the conditions. Grace does the work.",
      },
      {
        eyebrow: "The Rule",
        headline: "A Rule of Life is simply the decision to stop leaving your formation to chance.",
        body: "Scripture before the algorithm. Silence before the meeting. Sabbath before the next sprint. These are not rigid legalisms — they are chosen rhythms that accumulate, over months and years, into a recognizably different kind of life. One that looks unhurried. One that looks formed.",
      },
    ],
    pullQuote: "You don't drift into a formed life. You build one — one repeated practice at a time.",
    scripture: { t: "Train yourself for godliness; for while bodily training is of some value, godliness is of value in every way.", r: "1 Timothy 4:7–8" },
    connectedRhythm: "scripture",
    connectedChallenge: 2,
  },
  {
    num: "III",
    slug: "community",
    route: "/community",
    title: "Community",
    img: "/Community_8k.png",
    challenge: "You cannot become like Christ alone.",
    manifesto: "This is not a motivational claim. It is a structural one. Jesus did not form his disciples through content or curriculum — he lived with them. Proximity over time, through honesty and failure and shared rhythm, is the actual environment in which transformation happens.",
    sub: "Formation is a team sport.",
    cta: "Enter Community",
    heroLine: "We have more ways to connect than any generation in history — and we are more alone.",
    sections: [
      {
        eyebrow: "The Problem",
        headline: "Digital connection creates the sensation of community without its substance.",
        body: "You can be seen by thousands and known by no one. The feed gives you the dopamine hit of social belonging while insulating you from the cost of actual presence — vulnerability, accountability, inconvenience, and the slow work of being truly known. That insulation feels like freedom. It is actually a formation trap.",
      },
      {
        eyebrow: "The Counter",
        headline: "The New Testament vision of community was never a weekly gathering. It was shared life.",
        body: "Koinonia — the Greek word translated 'fellowship' — meant something far more substantive than attendance. It meant common participation. Mutual bearing of burdens. The kind of proximity where people see you tired, failing, doubting, and keep showing up anyway. That environment is where formation actually happens.",
      },
      {
        eyebrow: "The Commitment",
        headline: "Formation community is not found. It is built — through initiative, honesty, and sustained presence.",
        body: "Counter Formation calls you into small, intentional communities committed to shared rhythms of discipleship — not as a program, but as a posture. Four to eight people who have agreed, explicitly, to stop performing for one another and start being honest with one another. That is the container in which everything else grows.",
      },
    ],
    pullQuote: "Most of us have mastered the art of being known without being known.",
    scripture: { t: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.", r: "Acts 2:42" },
    connectedRhythm: "community",
    connectedChallenge: 6,
  },
];

/* ─── SHARED STYLES ───────────────────────────────────────────────── */

export function ArchitectureStyles() {
  return (
    <style>{`
      /* ── Slider section ── */
      .arch-section {
        position: relative;
        background: #06050A;
        overflow: hidden;
      }

      /* sticky container that pins while user scrolls through panels */
      .arch-sticky {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
      }

      /* horizontal track */
      .arch-track {
        display: flex;
        height: 100%;
        will-change: transform;
      }

      /* individual panel */
      .arch-panel {
        position: relative;
        flex-shrink: 0;
        width: 100vw;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .arch-panel-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        will-change: transform;
        transition: transform .1s linear;
      }

      /* dark overlay — gradient to bottom */
      .arch-panel-ov {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(6,5,10,0.96) 0%,
          rgba(6,5,10,0.62) 35%,
          rgba(6,5,10,0.22) 65%,
          rgba(6,5,10,0.08) 100%
        );
      }

      /* top tint for contrast */
      .arch-panel-top-tint {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(6,5,10,0.55) 0%,
          transparent 28%
        );
      }

      .arch-panel-content {
        position: relative;
        z-index: 10;
        padding: clamp(2rem,5vw,4rem) clamp(1.5rem,5vw,5rem) clamp(3rem,6vw,5rem);
        max-width: 900px;
      }

      /* pillar number */
      .arch-panel-num {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(10px,1.2vw,13px);
        letter-spacing: .48em;
        text-transform: uppercase;
        color: rgba(201,168,76,0.8);
        margin-bottom: clamp(.75rem,1.5vw,1.25rem);
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .arch-panel-num::before {
        content: '';
        display: block;
        width: 32px;
        height: 1px;
        background: rgba(201,168,76,0.55);
      }

      /* challenge headline */
      .arch-panel-challenge {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(36px,6.5vw,86px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .03em;
        line-height: .88;
        color: #FAF8F5;
        margin-bottom: clamp(1.25rem,2.5vw,2rem);
      }

      .arch-panel-manifesto {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(15px,1.8vw,20px);
        line-height: 1.8;
        color: rgba(250,248,245,0.55);
        max-width: 560px;
        margin-bottom: clamp(1.5rem,3vw,2.5rem);
      }

      /* CTA */
      .arch-panel-cta {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 32px;
        border-radius: 999px;
        background: transparent;
        border: 1px solid rgba(201,168,76,0.55);
        color: #C9A84C;
        font-family: 'Michroma', sans-serif;
        font-size: clamp(9px,1vw,11px);
        letter-spacing: .28em;
        text-transform: uppercase;
        font-weight: 700;
        text-decoration: none;
        transition: background .25s, color .25s, border-color .25s, transform .25s;
        cursor: pointer;
      }
      .arch-panel-cta:hover {
        background: #C9A84C;
        color: #0A0A0A;
        border-color: #C9A84C;
        transform: translateY(-2px);
      }

      /* pagination dots */
      .arch-dots {
        position: absolute;
        bottom: clamp(1.5rem,3vw,2.5rem);
        right: clamp(1.5rem,3vw,2.5rem);
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
      .arch-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255,255,255,0.22);
        transition: background .35s, transform .35s;
        cursor: pointer;
        border: none;
        padding: 0;
      }
      .arch-dot.active {
        background: #C9A84C;
        transform: scale(1.5);
      }

      /* progress bar at bottom */
      .arch-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: rgba(255,255,255,0.06);
        z-index: 20;
      }
      .arch-progress-fill {
        height: 100%;
        background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.4));
        transition: width .12s linear;
      }

      /* scroll cue */
      .arch-scroll-cue {
        position: absolute;
        bottom: clamp(1.5rem,3vw,2.5rem);
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        pointer-events: none;
      }
      .arch-scroll-cue span {
        font-family: 'Michroma', sans-serif;
        font-size: 8px;
        letter-spacing: .38em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.28);
      }
      @keyframes archScrollPulse {
        0%,100% { transform: translateX(-50%) translateY(0); opacity: .6; }
        50% { transform: translateX(-50%) translateY(5px); opacity: 1; }
      }
      .arch-scroll-cue { animation: archScrollPulse 2.2s ease-in-out infinite; }

      /* panel reveal animation */
      .arch-panel-content > * {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.in-view .arch-panel-content > * { opacity: 1; transform: none; }
      .arch-panel.in-view .arch-panel-content > *:nth-child(1) { transition-delay: .05s; }
      .arch-panel.in-view .arch-panel-content > *:nth-child(2) { transition-delay: .15s; }
      .arch-panel.in-view .arch-panel-content > *:nth-child(3) { transition-delay: .25s; }
      .arch-panel.in-view .arch-panel-content > *:nth-child(4) { transition-delay: .35s; }

      /* mobile: stack vertically instead of horizontal scroll */
      @media (max-width: 767px) {
        .arch-section { overflow: visible; }
        .arch-sticky { position: relative; height: auto; }
        .arch-track { flex-direction: column; transform: none !important; }
        .arch-panel { width: 100%; height: 100svh; flex-shrink: 0; }
        .arch-dots { display: none; }
        .arch-scroll-cue { display: none; }
        .arch-panel-challenge { font-size: clamp(32px,9vw,52px); }
      }

      /* ── Campaign pages ── */
      .camp-wrap {
        min-height: 100svh;
        background: #FAF8F5;
        color: #0E0C0A;
        font-family: 'Barlow Condensed', sans-serif;
        overflow-x: hidden;
      }

      /* corner nav on campaign pages */
      .camp-nav {
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 200;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px 10px 14px;
        border-radius: 999px;
        background: rgba(6,5,10,0.88);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.08);
        text-decoration: none;
        transition: border-color .25s;
      }
      .camp-nav:hover { border-color: rgba(201,168,76,0.35); }
      .camp-nav img  { width: 28px; height: 28px; object-fit: contain; filter: brightness(0) invert(1); }
      .camp-nav span { font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.6); font-weight: 600; }

      /* hero band */
      .camp-hero {
        position: relative;
        height: 100svh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      .camp-hero-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
      }
      .camp-hero-ov {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(245,240,232,0.98) 0%,
          rgba(245,240,232,0.55) 40%,
          rgba(6,5,10,0.25) 100%
        );
      }
      .camp-hero-in {
        position: relative;
        z-index: 2;
        padding: clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem);
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
      }

      .camp-pillar-tag {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 9px;
        letter-spacing: .42em;
        text-transform: uppercase;
        color: rgba(14,12,10,0.5);
        margin-bottom: 1.25rem;
      }
      .camp-pillar-tag-num {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid rgba(201,168,76,0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        color: #C9A84C;
        font-weight: 700;
      }

      .camp-hero-h1 {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(52px,9vw,120px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .04em;
        line-height: .86;
        color: #0E0C0A;
        margin-bottom: 1.25rem;
      }

      .camp-hero-line {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: clamp(18px,2.5vw,26px);
        line-height: 1.65;
        color: rgba(14,12,10,0.55);
        max-width: 580px;
        margin-bottom: 2rem;
      }

      /* challenge banner — dark strip */
      .camp-challenge-banner {
        background: #0E0C0A;
        padding: clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem);
      }
      .camp-challenge-inner {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: .75rem;
      }
      .camp-challenge-eyebrow {
        font-size: 9px;
        letter-spacing: .42em;
        text-transform: uppercase;
        color: rgba(201,168,76,0.7);
      }
      .camp-challenge-text {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(28px,5vw,56px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .05em;
        line-height: .92;
        color: #FAF8F5;
      }
      .camp-challenge-text em {
        font-style: normal;
        color: #C9A84C;
      }

      /* main content body */
      .camp-body {
        background: #FAF8F5;
        padding: clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,4rem);
      }
      .camp-body-inner {
        max-width: 1100px;
        margin: 0 auto;
      }

      /* pull quote */
      .camp-pull {
        padding: clamp(2rem,4vw,3.5rem) 0;
        border-top: 1px solid rgba(14,12,10,0.1);
        border-bottom: 1px solid rgba(14,12,10,0.1);
        margin-bottom: clamp(3rem,6vw,5rem);
      }
      .camp-pull p {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: clamp(24px,4vw,44px);
        line-height: 1.25;
        color: #0E0C0A;
        max-width: 780px;
      }
      .camp-pull cite {
        display: block;
        margin-top: 1rem;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        letter-spacing: .38em;
        text-transform: uppercase;
        color: #C9A84C;
        font-style: normal;
      }

      /* section blocks */
      .camp-sections {
        display: flex;
        flex-direction: column;
        gap: clamp(3rem,6vw,5rem);
        margin-bottom: clamp(3rem,6vw,5rem);
      }
      .camp-sect {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      @media (min-width: 768px) {
        .camp-sect {
          grid-template-columns: 180px 1fr;
          gap: 2.5rem;
          align-items: start;
        }
      }
      .camp-sect-left {
        display: flex;
        flex-direction: column;
        gap: .5rem;
      }
      .camp-sect-eyebrow {
        font-size: 9px;
        letter-spacing: .42em;
        text-transform: uppercase;
        color: #C9A84C;
        font-weight: 700;
      }
      .camp-sect-rule {
        width: 32px;
        height: 1px;
        background: rgba(14,12,10,0.18);
      }
      .camp-sect-right {}
      .camp-sect-h {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(18px,2.5vw,26px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .06em;
        line-height: 1.1;
        color: #0E0C0A;
        margin-bottom: 1rem;
      }
      .camp-sect-body {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(17px,2.2vw,21px);
        line-height: 1.82;
        color: rgba(14,12,10,0.62);
      }

      /* scripture block */
      .camp-scripture {
        border-left: 3px solid #C9A84C;
        padding: 1.5rem 1.75rem;
        background: rgba(201,168,76,0.06);
        border-radius: 0 16px 16px 0;
        margin-bottom: clamp(2.5rem,5vw,4rem);
      }
      .camp-scripture p {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: clamp(17px,2.2vw,22px);
        color: rgba(14,12,10,0.78);
        line-height: 1.7;
        margin-bottom: .6rem;
      }
      .camp-scripture cite {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 9px;
        letter-spacing: .32em;
        text-transform: uppercase;
        color: #C9A84C;
        font-style: normal;
      }

      /* CTAs row */
      .camp-ctas {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        padding-top: clamp(2rem,4vw,3rem);
        border-top: 1px solid rgba(14,12,10,0.1);
      }
      .camp-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 15px 32px;
        border-radius: 999px;
        background: #0E0C0A;
        color: #FAF8F5;
        border: 2px solid #0E0C0A;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px;
        letter-spacing: .26em;
        text-transform: uppercase;
        font-weight: 700;
        text-decoration: none;
        transition: background .25s, color .25s;
        cursor: pointer;
      }
      .camp-btn-primary:hover { background: #C9A84C; border-color: #C9A84C; color: #0A0A0A; }
      .camp-btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 15px 32px;
        border-radius: 999px;
        background: transparent;
        color: rgba(14,12,10,0.55);
        border: 1px solid rgba(14,12,10,0.2);
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px;
        letter-spacing: .26em;
        text-transform: uppercase;
        font-weight: 700;
        text-decoration: none;
        transition: border-color .25s, color .25s;
        cursor: pointer;
      }
      .camp-btn-secondary:hover { border-color: #C9A84C; color: #C9A84C; }

      /* other pillars nav */
      .camp-other-pillars {
        background: #0E0C0A;
        padding: clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem);
      }
      .camp-other-inner {
        max-width: 1100px;
        margin: 0 auto;
      }
      .camp-other-label {
        font-size: 9px;
        letter-spacing: .42em;
        text-transform: uppercase;
        color: rgba(201,168,76,0.65);
        margin-bottom: 1.5rem;
        font-weight: 700;
      }
      .camp-other-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
        gap: 12px;
      }
      .camp-other-card {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
        aspect-ratio: 4/3;
        text-decoration: none;
        display: block;
        transition: border-color .3s, transform .3s;
      }
      .camp-other-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); }
      .camp-other-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        filter: grayscale(.3);
        opacity: .5;
        transition: opacity .5s, filter .5s;
      }
      .camp-other-card:hover .camp-other-bg { opacity: .8; filter: grayscale(0); }
      .camp-other-ov {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(6,5,10,0.92), rgba(6,5,10,0.3) 60%, transparent);
      }
      .camp-other-body {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1.25rem;
        z-index: 2;
      }
      .camp-other-num { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; margin-bottom: .35rem; }
      .camp-other-title {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(16px,2.5vw,22px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .06em;
        color: #FAF8F5;
      }

      /* footer strip */
      .camp-footer {
        background: #06050A;
        border-top: 1px solid rgba(255,255,255,0.05);
        padding: 28px 1.5rem;
        text-align: center;
      }
      .camp-footer img { width: 24px; height: 24px; opacity: .2; filter: invert(1); display: block; margin: 0 auto .75rem; }
      .camp-footer p { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
    `}</style>
  );
}

/* ─── ARCHITECTURE SLIDER ─────────────────────────────────────────── */

export function ArchitectureSlider() {
  const sectionRef  = useRef(null);
  const trackRef    = useRef(null);
  const progressRef = useRef(null);
  const [activeIdx, setActiveIdx]   = useState(0);
  const [cueVisible, setCueVisible] = useState(true);

  const PANEL_COUNT = PILLARS.length;

  // Scroll-jacking: translate track horizontally as user scrolls
  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    const prog    = progressRef.current;
    if (!section || !track) return;

    // On mobile, skip the scroll-jack
    const isMobile = () => window.innerWidth < 768;

    const onScroll = () => {
      if (isMobile()) return;

      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const pct = Math.max(0, Math.min(1, scrolled / sectionH));

      // Translate
      const maxX = -(PANEL_COUNT - 1) * window.innerWidth;
      const tx = pct * maxX;
      track.style.transform = `translateX(${tx}px)`;

      // Active panel
      const idx = Math.round(pct * (PANEL_COUNT - 1));
      setActiveIdx(idx);

      // Progress bar
      if (prog) prog.style.width = `${pct * 100}%`;

      // Scroll cue
      if (scrolled > 40) setCueVisible(false);

      // Parallax on bg images
      const panels = track.querySelectorAll(".arch-panel");
      panels.forEach((panel, i) => {
        const panelPct = pct * (PANEL_COUNT - 1) - i;
        const clampedPct = Math.max(-1, Math.min(1, panelPct));
        const bg = panel.querySelector(".arch-panel-bg");
        if (bg) bg.style.transform = `translateX(${clampedPct * 6}%) scale(1.06)`;

        // in-view class
        const distFromCenter = Math.abs(pct * (PANEL_COUNT - 1) - i);
        if (distFromCenter < 0.5) panel.classList.add("in-view");
        else panel.classList.remove("in-view");
      });
    };

    // Mark first panel in-view on mount
    const panels = track.querySelectorAll(".arch-panel");
    if (panels[0]) panels[0].classList.add("in-view");

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToPanel = useCallback((idx) => {
    const section = sectionRef.current;
    if (!section || window.innerWidth < 768) return;
    const sectionH = section.offsetHeight - window.innerHeight;
    const targetPct = idx / (PANEL_COUNT - 1);
    const targetScroll = section.offsetTop + targetPct * sectionH;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, []);

  return (
    // Outer section height = sticky viewport + scroll space for each panel transition
    <section
      ref={sectionRef}
      id="architecture"
      className="arch-section"
      style={{ height: `calc(100svh + ${(PANEL_COUNT - 1) * 100}svh)` }}
    >
      <div className="arch-sticky">
        {/* Horizontal track */}
        <div ref={trackRef} className="arch-track">
          {PILLARS.map((p, i) => (
            <div key={p.slug} className="arch-panel">
              {/* Background image */}
              <div
                className="arch-panel-bg"
                style={{ backgroundImage: `url('${p.img}')` }}
              />
              <div className="arch-panel-top-tint" />
              <div className="arch-panel-ov" />

              {/* Content */}
              <div className="arch-panel-content">
                <div className="arch-panel-num">
                  Pillar {p.num} &nbsp;·&nbsp; Architecture of the Soul
                </div>
                <h2 className="arch-panel-challenge">{p.challenge}</h2>
                <p className="arch-panel-manifesto">{p.manifesto}</p>
                <Link to={p.route} className="arch-panel-cta">
                  {p.cta}
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="arch-dots">
          {PILLARS.map((p, i) => (
            <button
              key={p.slug}
              className={`arch-dot${i === activeIdx ? " active" : ""}`}
              onClick={() => scrollToPanel(i)}
              aria-label={`Go to ${p.title}`}
            />
          ))}
        </div>

        {/* Scroll cue */}
        {cueVisible && (
          <div className="arch-scroll-cue">
            <span>Scroll to explore</span>
            <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
              <path d="M1 1L7 7L13 1" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        )}

        {/* Progress bar */}
        <div className="arch-progress">
          <div ref={progressRef} className="arch-progress-fill" style={{ width: "0%" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── CAMPAIGN PAGE (shared layout) ──────────────────────────────── */

function CampaignPage({ pillar }) {
  const navigate = useNavigate();
  const others = PILLARS.filter(p => p.slug !== pillar.slug);

  useEffect(() => { window.scrollTo(0, 0); }, [pillar.slug]);

  return (
    <div className="camp-wrap">
      {/* Nav */}
      <Link to="/" className="camp-nav">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="Counter Formation" />
        <span>Counter Formation</span>
      </Link>

      {/* Hero */}
      <div className="camp-hero">
        <div className="camp-hero-bg" style={{ backgroundImage: `url('${pillar.img}')` }} />
        <div className="camp-hero-ov" />
        <div className="camp-hero-in">
          <div className="camp-pillar-tag">
            <div className="camp-pillar-tag-num">{pillar.num}</div>
            Architecture of the Soul &nbsp;·&nbsp; {pillar.title}
          </div>
          <h1 className="camp-hero-h1">{pillar.title}</h1>
          <p className="camp-hero-line">{pillar.heroLine}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              to={`/rule-of-life/${pillar.connectedRhythm}`}
              className="camp-btn-primary"
            >
              Enter the Rule of Life
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link
              to={`/7-day-challenge/day/${pillar.connectedChallenge}`}
              className="camp-btn-secondary"
            >
              Day {pillar.connectedChallenge} of the Challenge →
            </Link>
          </div>
        </div>
      </div>

      {/* Challenge banner */}
      <div className="camp-challenge-banner">
        <div className="camp-challenge-inner">
          <p className="camp-challenge-eyebrow">The Confrontation</p>
          <h2 className="camp-challenge-text">
            {pillar.challenge.split(" ").map((word, i, arr) => {
              // italicize last two words for rhythm
              if (i >= arr.length - 2) return <em key={i}>{word}{i < arr.length - 1 ? " " : ""}</em>;
              return <span key={i}>{word} </span>;
            })}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="camp-body">
        <div className="camp-body-inner">

          {/* Pull quote */}
          <div className="camp-pull">
            <p>"{pillar.pullQuote}"</p>
          </div>

          {/* Scripture */}
          <div className="camp-scripture">
            <p>"{pillar.scripture.t}"</p>
            <cite>— {pillar.scripture.r}</cite>
          </div>

          {/* Sections */}
          <div className="camp-sections">
            {pillar.sections.map((s, i) => (
              <div key={i} className="camp-sect">
                <div className="camp-sect-left">
                  <span className="camp-sect-eyebrow">{s.eyebrow}</span>
                  <div className="camp-sect-rule" />
                </div>
                <div className="camp-sect-right">
                  <h3 className="camp-sect-h">{s.headline}</h3>
                  <p className="camp-sect-body">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="camp-ctas">
            <Link to={`/rule-of-life/${pillar.connectedRhythm}`} className="camp-btn-primary">
              Explore the {pillar.title} Rhythm
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to={`/7-day-challenge/day/${pillar.connectedChallenge}`} className="camp-btn-secondary">
              Day {pillar.connectedChallenge} of the Formation Challenge →
            </Link>
            <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="camp-btn-secondary">
              Shop the Gear →
            </a>
          </div>
        </div>
      </div>

      {/* Other pillars */}
      <div className="camp-other-pillars">
        <div className="camp-other-inner">
          <p className="camp-other-label">The Other Pillars</p>
          <div className="camp-other-grid">
            {others.map(o => (
              <Link key={o.slug} to={o.route} className="camp-other-card">
                <div className="camp-other-bg" style={{ backgroundImage: `url('${o.img}')` }} />
                <div className="camp-other-ov" />
                <div className="camp-other-body">
                  <p className="camp-other-num">Pillar {o.num}</p>
                  <p className="camp-other-title">{o.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="camp-footer">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
        <p>Counter Formation · Architecture of the Soul · Ephesians 6:10–18 · © 2026</p>
      </footer>
    </div>
  );
}

/* ─── INDIVIDUAL CAMPAIGN PAGE EXPORTS ───────────────────────────── */

export function IdentityPage()   { return <CampaignPage pillar={PILLARS[0]} />; }
export function PracticePage()   { return <CampaignPage pillar={PILLARS[1]} />; }
export function CommunityPage()  { return <CampaignPage pillar={PILLARS[2]} />; }