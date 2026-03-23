import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

/* ─── PILLAR DATA ─────────────────────────────────────────────────── */

const PILLARS = [
  {
    num: "I",
    slug: "identity",
    title: "Identity",
    route: "/identity",
    img: "/Identity_wide.png",
    challenge: "You are not your output.",
    manifesto: "The modern world measures you by what you produce, how you appear, and how many people are watching. Counter Formation begins by refusing that metric entirely — and anchoring identity in Christ before anything else gets to name you.",
    sub: "Before action comes being.",
    cta: "Enter Identity",
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

/* ─── STYLES ──────────────────────────────────────────────────────── */

export function ArchitectureStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      /* ════════════════════════════════════════════════════
         SLIDER
      ════════════════════════════════════════════════════ */

      .arch-outer {
        position: relative;
        /* tall enough for scroll-past escape hatch */
        height: 400svh;
        background: #06050A;
      }

      .arch-sticky {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
      }

      /* viewport frame */
      .arch-viewport {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      /* sliding track */
      .arch-track {
        display: flex;
        width: 300%; /* 3 panels */
        height: 100%;
        transition: transform .72s cubic-bezier(.76,0,.24,1);
        will-change: transform;
      }

      /* single panel */
      .arch-panel {
        position: relative;
        width: calc(100% / 3);
        height: 100%;
        flex-shrink: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }

      .arch-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        transform: scale(1.08);
        transition: transform 1.1s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-bg {
        transform: scale(1.0);
      }

      /* layered overlays */
      .arch-ov-bottom {
        position: absolute; inset: 0;
        background: linear-gradient(to top,
          rgba(6,5,10,0.97) 0%,
          rgba(6,5,10,0.68) 38%,
          rgba(6,5,10,0.28) 65%,
          rgba(6,5,10,0.08) 100%);
      }
      .arch-ov-top {
        position: absolute; inset: 0;
        background: linear-gradient(to bottom,
          rgba(6,5,10,0.52) 0%,
          transparent 30%);
      }

      /* panel content */
      .arch-content {
        position: relative;
        z-index: 10;
        padding: clamp(2rem,4vw,3.5rem) clamp(1.75rem,5vw,5rem) clamp(2.5rem,5vw,4.5rem);
        max-width: 860px;
      }

      /* eyebrow */
      .arch-eyebrow {
        display: flex;
        align-items: center;
        gap: 14px;
        font-family: 'Michroma', sans-serif;
        font-size: clamp(11px,1.2vw,13px);
        letter-spacing: .48em;
        text-transform: uppercase;
        color: rgba(201,168,76,1);
        font-weight: 700;
        margin-bottom: clamp(.75rem,1.5vw,1.25rem);
        opacity: 0;
        transform: translateY(16px);
        transition: opacity .6s .1s, transform .6s .1s cubic-bezier(.16,1,.3,1);
      }
      .arch-eyebrow::before {
        content: '';
        display: block;
        width: 28px;
        height: 1px;
        background: rgba(201,168,76,0.5);
        flex-shrink: 0;
      }
      .arch-panel.is-active .arch-eyebrow { opacity: 1; transform: none; }

      /* headline */
      .arch-headline {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(32px,5.8vw,78px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .03em;
        line-height: .9;
        color: #FAF8F5;
        margin-bottom: clamp(1rem,2vw,1.75rem);
        opacity: 0;
        transform: translateY(22px);
        transition: opacity .65s .2s, transform .65s .2s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-headline { opacity: 1; transform: none; }

      /* manifesto */
      .arch-manifesto {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(16px,1.8vw,22px);
        line-height: 1.82;
        color: rgba(250,248,245,0.72);
        max-width: 520px;
        margin-bottom: clamp(1.5rem,2.5vw,2.25rem);
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .6s .32s, transform .6s .32s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-manifesto { opacity: 1; transform: none; }

      /* CTA row */
      .arch-cta-row {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        opacity: 0;
        transform: translateY(14px);
        transition: opacity .6s .42s, transform .6s .42s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-cta-row { opacity: 1; transform: none; }

      .arch-cta-enter {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 13px 28px;
        border-radius: 999px;
        background: transparent;
        border: 1px solid rgba(201,168,76,0.55);
        color: #C9A84C;
        font-family: 'Michroma', sans-serif;
        font-size: clamp(8px,.9vw,10px);
        letter-spacing: .28em;
        text-transform: uppercase;
        font-weight: 700;
        text-decoration: none;
        transition: background .25s, color .25s, border-color .25s, transform .2s;
        cursor: pointer;
        white-space: nowrap;
      }
      .arch-cta-enter:hover {
        background: #C9A84C;
        color: #0A0A0A;
        border-color: #C9A84C;
        transform: translateY(-2px);
      }

      /* ── NAVIGATION ARROWS ── */
      .arch-arrows {
        position: absolute;
        bottom: clamp(1.75rem,3.5vw,3rem);
        right: clamp(1.75rem,3.5vw,3.5rem);
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .arch-arrow {
        width: clamp(44px,4vw,54px);
        height: clamp(44px,4vw,54px);
        border-radius: 50%;
        border: 1px solid rgba(255,255,255,0.15);
        background: rgba(6,5,10,0.55);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: border-color .25s, background .25s, transform .2s;
        color: rgba(250,248,245,0.7);
      }
      .arch-arrow:hover:not(:disabled) {
        border-color: rgba(201,168,76,0.55);
        background: rgba(201,168,76,0.12);
        color: #C9A84C;
        transform: scale(1.06);
      }
      .arch-arrow:disabled {
        opacity: .28;
        cursor: default;
      }

      /* ── CONTINUE BUTTON (appears on last panel) ── */
      .arch-continue {
        position: absolute;
        bottom: clamp(1.75rem,3.5vw,3rem);
        left: 50%;
        transform: translateX(-50%) translateY(12px);
        z-index: 30;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        opacity: 0;
        pointer-events: none;
        transition: opacity .5s, transform .5s cubic-bezier(.16,1,.3,1);
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
      }
      .arch-continue.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }
      .arch-continue span {
        font-family: 'Michroma', sans-serif;
        font-size: 9px;
        letter-spacing: .42em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.4);
      }
      @keyframes archBounce {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(5px); }
      }
      .arch-continue svg { animation: archBounce 1.8s ease-in-out infinite; }

      /* ── DOTS ── */
      .arch-dots {
        position: absolute;
        bottom: clamp(1.75rem,3.5vw,3rem);
        left: clamp(1.75rem,3.5vw,3.5rem);
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .arch-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background .3s, transform .3s, width .3s;
      }
      .arch-dot.active {
        background: #C9A84C;
        width: 22px;
        border-radius: 4px;
      }

      /* ── SCROLL-PAST HINT (first panel only) ── */
      .arch-scroll-hint {
        position: absolute;
        top: clamp(1.5rem,2.5vw,2rem);
        right: clamp(1.75rem,3.5vw,3.5rem);
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 8px;
        opacity: 0;
        animation: archFadeIn 1s 1.5s forwards;
        pointer-events: none;
      }
      @keyframes archFadeIn { to { opacity: 1; } }
      .arch-scroll-hint span {
        font-family: 'Michroma', sans-serif;
        font-size: 8px;
        letter-spacing: .38em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.22);
      }

      /* ── PANEL COUNTER ── */
      .arch-counter {
        position: absolute;
        top: clamp(1.5rem,2.5vw,2rem);
        left: clamp(1.75rem,3.5vw,3.5rem);
        z-index: 30;
        font-family: 'Michroma', sans-serif;
        font-size: 9px;
        letter-spacing: .38em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.25);
      }
      .arch-counter strong { color: rgba(255,255,255,0.55); }

      /* ── MOBILE: stack panels vertically ── */
      @media (max-width: 767px) {
        .arch-outer { height: auto; }
        .arch-sticky { position: relative; height: auto; }
        .arch-track {
          flex-direction: column;
          width: 100%;
          transition: none;
          transform: none !important;
        }
        .arch-panel {
          width: 100%;
          height: 100svh;
          flex-shrink: 0;
        }
        /* all panels visible on mobile — no is-active needed */
        .arch-panel .arch-eyebrow,
        .arch-panel .arch-headline,
        .arch-panel .arch-manifesto,
        .arch-panel .arch-cta-row {
          opacity: 1;
          transform: none;
        }
        .arch-arrows,
        .arch-dots,
        .arch-continue,
        .arch-scroll-hint,
        .arch-counter { display: none; }
        .arch-content { padding: 2rem 1.5rem 3rem; }
      }


      /* ════════════════════════════════════════════════════
         CAMPAIGN PAGES
      ════════════════════════════════════════════════════ */

      .camp-wrap {
        min-height: 100svh;
        background: #FAF8F5;
        color: #0E0C0A;
        font-family: 'Barlow Condensed', sans-serif;
        overflow-x: hidden;
      }

      .camp-nav {
        position: fixed;
        top: 1rem; left: 50%;
        transform: translateX(-50%);
        z-index: 200;
        display: flex; align-items: center; gap: 10px;
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

      .camp-hero {
        position: relative;
        height: 100svh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      .camp-hero-bg {
        position: absolute; inset: 0;
        background-size: cover;
        background-position: center;
      }
      .camp-hero-ov {
        position: absolute; inset: 0;
        background: linear-gradient(
          to top,
          rgba(245,240,232,0.98) 0%,
          rgba(245,240,232,0.55) 40%,
          rgba(6,5,10,0.25) 100%
        );
      }
      .camp-hero-in {
        position: relative; z-index: 2;
        padding: clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,5rem);
        max-width: 1200px; margin: 0 auto; width: 100%;
      }
      .camp-pillar-tag {
        display: inline-flex; align-items: center; gap: 10px;
        font-size: 9px; letter-spacing: .42em; text-transform: uppercase;
        color: rgba(14,12,10,0.45); margin-bottom: 1.25rem;
      }
      .camp-pillar-num {
        width: 24px; height: 24px; border-radius: 50%;
        border: 1px solid rgba(201,168,76,0.55);
        display: flex; align-items: center; justify-content: center;
        font-size: 8px; color: #C9A84C; font-weight: 700;
      }
      .camp-hero-h1 {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(52px,9vw,120px);
        font-weight: 700; text-transform: uppercase;
        letter-spacing: .04em; line-height: .86;
        color: #0E0C0A; margin-bottom: 1.25rem;
      }
      .camp-hero-line {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: clamp(17px,2.2vw,24px);
        line-height: 1.65; color: rgba(14,12,10,0.52);
        max-width: 560px; margin-bottom: 2rem;
      }

      /* dark challenge banner */
      .camp-banner {
        background: #0E0C0A;
        padding: clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,5vw,5rem);
      }
      .camp-banner-inner { max-width: 1100px; margin: 0 auto; }
      .camp-banner-eye {
        font-size: 9px; letter-spacing: .44em; text-transform: uppercase;
        color: rgba(201,168,76,0.65); margin-bottom: .85rem; display: block;
      }
      .camp-banner-h {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(28px,5vw,58px);
        font-weight: 700; text-transform: uppercase;
        letter-spacing: .04em; line-height: .92; color: #FAF8F5;
      }
      .camp-banner-h em { font-style: normal; color: #C9A84C; }

      /* body */
      .camp-body {
        background: #FAF8F5;
        padding: clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem);
      }
      .camp-body-inner { max-width: 1100px; margin: 0 auto; }

      .camp-pull {
        padding: clamp(2rem,3.5vw,3rem) 0;
        border-top: 1px solid rgba(14,12,10,0.1);
        border-bottom: 1px solid rgba(14,12,10,0.1);
        margin-bottom: clamp(3rem,5vw,4.5rem);
      }
      .camp-pull p {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: clamp(22px,3.8vw,44px);
        line-height: 1.25; color: #0E0C0A;
        max-width: 780px;
      }

      .camp-scripture {
        border-left: 3px solid #C9A84C;
        padding: 1.4rem 1.75rem;
        background: rgba(201,168,76,0.06);
        border-radius: 0 16px 16px 0;
        margin-bottom: clamp(2.5rem,5vw,4rem);
      }
      .camp-scripture p {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        font-size: clamp(16px,2vw,21px);
        color: rgba(14,12,10,0.75);
        line-height: 1.7; margin-bottom: .6rem;
      }
      .camp-scripture cite {
        font-size: 9px; letter-spacing: .32em;
        text-transform: uppercase; color: #C9A84C; font-style: normal;
      }

      .camp-sections {
        display: flex; flex-direction: column;
        gap: clamp(2.5rem,5vw,4.5rem);
        margin-bottom: clamp(2.5rem,5vw,4rem);
      }
      .camp-sect {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      @media (min-width: 768px) {
        .camp-sect { grid-template-columns: 160px 1fr; gap: 2.5rem; align-items: start; }
      }
      .camp-sect-eye {
        font-size: 9px; letter-spacing: .42em; text-transform: uppercase;
        color: #C9A84C; font-weight: 700; display: block; margin-bottom: .5rem;
      }
      .camp-sect-rule { width: 28px; height: 1px; background: rgba(14,12,10,0.16); }
      .camp-sect-h {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(16px,2.2vw,24px);
        font-weight: 700; text-transform: uppercase;
        letter-spacing: .05em; line-height: 1.1;
        color: #0E0C0A; margin-bottom: .9rem;
      }
      .camp-sect-body {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(16px,2vw,20px);
        line-height: 1.84; color: rgba(14,12,10,0.58);
      }

      .camp-ctas {
        display: flex; flex-wrap: wrap; gap: 12px;
        padding-top: clamp(2rem,3.5vw,3rem);
        border-top: 1px solid rgba(14,12,10,0.1);
      }
      .camp-btn-p {
        display: inline-flex; align-items: center; gap: 9px;
        padding: 14px 30px; border-radius: 999px;
        background: #0E0C0A; color: #FAF8F5;
        border: 2px solid #0E0C0A;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px; letter-spacing: .26em;
        text-transform: uppercase; font-weight: 700;
        text-decoration: none;
        transition: background .25s, border-color .25s, color .25s;
      }
      .camp-btn-p:hover { background: #C9A84C; border-color: #C9A84C; color: #0A0A0A; }
      .camp-btn-s {
        display: inline-flex; align-items: center; gap: 9px;
        padding: 14px 30px; border-radius: 999px;
        background: transparent; color: rgba(14,12,10,0.5);
        border: 1px solid rgba(14,12,10,0.18);
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 10px; letter-spacing: .26em;
        text-transform: uppercase; font-weight: 700;
        text-decoration: none;
        transition: border-color .25s, color .25s;
      }
      .camp-btn-s:hover { border-color: #C9A84C; color: #C9A84C; }

      /* other pillars */
      .camp-others {
        background: #0E0C0A;
        padding: clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,5vw,5rem);
      }
      .camp-others-inner { max-width: 1100px; margin: 0 auto; }
      .camp-others-label {
        font-size: 9px; letter-spacing: .42em; text-transform: uppercase;
        color: rgba(201,168,76,0.6); margin-bottom: 1.5rem; font-weight: 700;
      }
      .camp-others-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(260px,100%),1fr));
        gap: 12px;
      }
      .camp-other-card {
        position: relative; overflow: hidden;
        border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
        aspect-ratio: 4/3; text-decoration: none; display: block;
        transition: border-color .3s, transform .3s;
      }
      .camp-other-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); }
      .camp-other-bg {
        position: absolute; inset: 0;
        background-size: cover; background-position: center;
        filter: grayscale(.3); opacity: .5;
        transition: opacity .5s, filter .5s;
      }
      .camp-other-card:hover .camp-other-bg { opacity: .82; filter: grayscale(0); }
      .camp-other-ov {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(6,5,10,0.92), rgba(6,5,10,0.28) 60%, transparent);
      }
      .camp-other-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; z-index: 2; }
      .camp-other-num { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; margin-bottom: .3rem; }
      .camp-other-title {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(15px,2.2vw,22px);
        font-weight: 700; text-transform: uppercase;
        letter-spacing: .06em; color: #FAF8F5;
      }

      .camp-footer {
        background: #06050A;
        border-top: 1px solid rgba(255,255,255,0.05);
        padding: 28px 1.5rem; text-align: center;
      }
      .camp-footer img { width: 24px; height: 24px; opacity: .2; filter: invert(1); display: block; margin: 0 auto .75rem; }
      .camp-footer p   { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
    `}</style>
  );
}

/* ─── ARCHITECTURE SLIDER ─────────────────────────────────────────── */

export function ArchitectureSlider() {
  const outerRef    = useRef(null);
  const trackRef    = useRef(null);
  const [idx, setIdx] = useState(0);
  const TOTAL = PILLARS.length;

  // ── Advance / retreat
  const goTo = useCallback((next) => {
    setIdx(Math.max(0, Math.min(TOTAL - 1, next)));
  }, [TOTAL]);

  // ── Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      // Only hijack arrow keys when section is in view
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      const inView = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inView) return;
      if (e.key === "ArrowRight") goTo(idx + 1);
      if (e.key === "ArrowLeft")  goTo(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, goTo]);

  // ── Scroll-past escape hatch:
  //    When user scrolls deeply into the "exit zone" (bottom 25% of scroll space),
  //    we allow the sticky to naturally release — no JS needed, just CSS height.
  //    The 400svh outer gives plenty of scroll room; sticky releases at 300svh mark.

  // ── Apply translation to track
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(-${idx * (100 / TOTAL)}%)`;
  }, [idx, TOTAL]);

  // ── Mark active panel
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.querySelectorAll(".arch-panel").forEach((p, i) => {
      p.classList.toggle("is-active", i === idx);
    });
  }, [idx]);

  // ── Mark first panel active on mount
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = track.querySelectorAll(".arch-panel");
    if (panels[0]) panels[0].classList.add("is-active");
  }, []);

  // ── Scroll the page past the section when Continue is clicked
  const handleContinue = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;
    // Scroll to just below the section
    const target = outer.offsetTop + outer.offsetHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  return (
    <section ref={outerRef} id="architecture" className="arch-outer">
      <div className="arch-sticky">
        <div className="arch-viewport">

          {/* Panel counter */}
          <div className="arch-counter">
            <strong>{idx + 1}</strong> / {TOTAL}
          </div>

          {/* Scroll-past hint */}
          <div className="arch-scroll-hint">
            <span>Or scroll to skip</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M3 9l4 4 4-4" stroke="rgba(255,255,255,0.22)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Track */}
          <div ref={trackRef} className="arch-track">
            {PILLARS.map((p, i) => (
              <div key={p.slug} className={`arch-panel${i === 0 ? " is-active" : ""}`}>
                <div className="arch-bg" style={{ backgroundImage: `url('${p.img}')` }} />
                <div className="arch-ov-bottom" />
                <div className="arch-ov-top" />

                <div className="arch-content">
                  <div className="arch-eyebrow">
                    Pillar {p.num}&nbsp;&nbsp;·&nbsp;&nbsp;Architecture of the Soul
                  </div>
                  <h2 className="arch-headline">{p.challenge}</h2>
                  <p className="arch-manifesto">{p.manifesto}</p>
                  <div className="arch-cta-row">
                    <Link to={p.route} className="arch-cta-enter">
                      {p.cta}
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="arch-dots">
            {PILLARS.map((p, i) => (
              <button
                key={p.slug}
                className={`arch-dot${i === idx ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to ${p.title}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="arch-arrows">
            <button
              className="arch-arrow"
              onClick={() => goTo(idx - 1)}
              disabled={idx === 0}
              aria-label="Previous pillar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="arch-arrow"
              onClick={() => idx < TOTAL - 1 ? goTo(idx + 1) : handleContinue()}
              aria-label={idx < TOTAL - 1 ? "Next pillar" : "Continue"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Continue — visible on last panel */}
          <button
            className={`arch-continue${idx === TOTAL - 1 ? " visible" : ""}`}
            onClick={handleContinue}
            aria-label="Continue scrolling"
          >
            <span>Continue</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 1L8 8L15 1" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

        </div>
      </div>
    </section>
  );
}

/* ─── CAMPAIGN PAGE (shared layout) ──────────────────────────────── */

function CampaignPage({ pillar }) {
  const others = PILLARS.filter(p => p.slug !== pillar.slug);
  useEffect(() => { window.scrollTo(0, 0); }, [pillar.slug]);

  return (
    <div className="camp-wrap">
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
            <div className="camp-pillar-num">{pillar.num}</div>
            Architecture of the Soul &nbsp;·&nbsp; {pillar.title}
          </div>
          <h1 className="camp-hero-h1">{pillar.title}</h1>
          <p className="camp-hero-line">{pillar.heroLine}</p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link to={`/rule-of-life/${pillar.connectedRhythm}`} className="camp-btn-p">
              Explore the Rule of Life
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to={`/7-day-challenge/day/${pillar.connectedChallenge}`} className="camp-btn-s">
              Day {pillar.connectedChallenge} of the Challenge →
            </Link>
          </div>
        </div>
      </div>

      {/* Challenge banner */}
      <div className="camp-banner">
        <div className="camp-banner-inner">
          <span className="camp-banner-eye">The Confrontation</span>
          <h2 className="camp-banner-h">
            {pillar.challenge.split(" ").map((word, i, arr) => (
              i >= arr.length - 2
                ? <em key={i}>{word}{i < arr.length - 1 ? " " : ""}</em>
                : <span key={i}>{word} </span>
            ))}
          </h2>
        </div>
      </div>

      {/* Body */}
      <div className="camp-body">
        <div className="camp-body-inner">
          <div className="camp-pull">
            <p>"{pillar.pullQuote}"</p>
          </div>

          <div className="camp-scripture">
            <p>"{pillar.scripture.t}"</p>
            <cite>— {pillar.scripture.r}</cite>
          </div>

          <div className="camp-sections">
            {pillar.sections.map((s, i) => (
              <div key={i} className="camp-sect">
                <div>
                  <span className="camp-sect-eye">{s.eyebrow}</span>
                  <div className="camp-sect-rule" />
                </div>
                <div>
                  <h3 className="camp-sect-h">{s.headline}</h3>
                  <p className="camp-sect-body">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="camp-ctas">
            <Link to={`/rule-of-life/${pillar.connectedRhythm}`} className="camp-btn-p">
              Explore the {pillar.title} Rhythm
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 6h10M6.5 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link to={`/7-day-challenge/day/${pillar.connectedChallenge}`} className="camp-btn-s">
              Day {pillar.connectedChallenge} of the Challenge →
            </Link>
            <a href={SHOPIFY_URL} target="_blank" rel="noopener noreferrer" className="camp-btn-s">
              Shop the Gear →
            </a>
          </div>
        </div>
      </div>

      {/* Other pillars */}
      <div className="camp-others">
        <div className="camp-others-inner">
          <p className="camp-others-label">The Other Pillars</p>
          <div className="camp-others-grid">
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

      <footer className="camp-footer">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="" />
        <p>Counter Formation · Architecture of the Soul · Ephesians 6:10–18 · © 2026</p>
      </footer>
    </div>
  );
}

/* ─── EXPORTS ─────────────────────────────────────────────────────── */

export function IdentityPage()  { return <CampaignPage pillar={PILLARS[0]} />; }
export function PracticePage()  { return <CampaignPage pillar={PILLARS[1]} />; }
export function CommunityPage() { return <CampaignPage pillar={PILLARS[2]} />; }