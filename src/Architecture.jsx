import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const SHOPIFY_URL = "https://shop.counterformed.com/collections/the-gear";

/* ─── PILLAR DATA ─────────────────────────────────────────────────── */

const PILLARS = [
  {
    num: "I", slug: "identity", title: "Identity", route: "/identity",
    img: "/Identity_wide.png",
    challenge: "You are not your output.",

    manifesto: "The modern world measures you by what you produce, how you appear, and how many people are watching. Counter Formation begins by refusing that metric entirely — and anchoring identity in Christ before anything else gets to name you.",
    cta: "Enter Identity",
    heroLine: "The world has been forming your identity since you were old enough to scroll.",
    sections: [
      { eyebrow: "The Problem", headline: "You didn't choose most of what you believe about yourself.", body: "Platform metrics. Productivity output. Approval from people whose names you don't know. These are the identity systems of the digital age — and they run on you without your permission. You absorbed them quietly, and now they feel like truth." },
      { eyebrow: "The Counter", headline: "Identity anchored in Christ is not a feeling. It is a fact that precedes performance.", body: "Before you produced anything. Before anyone saw you. Before the algorithm had a chance to assess your worth — you were made in the image of God, named by Christ, and sealed by the Spirit. That is the only identity that cannot be taken by a bad quarter, a silent comment section, or a season of failure." },
      { eyebrow: "The Practice", headline: "Formation begins with what you believe about who you are.", body: "Counter Formation calls you to daily surrender — not as religious performance, but as the repeated act of releasing the identity metrics the world hands you and returning to the one God has already declared. This is the first pillar because nothing else holds without it." },
    ],
    pullQuote: "You are not what the algorithm says you are. You are who God says you are.",
    scripture: { t: "See what great love the Father has lavished on us, that we should be called children of God — and that is what we are.", r: "1 John 3:1" },
    connectedRhythm: "presence", connectedChallenge: 1,
  },
  {
    num: "II", slug: "practice", title: "Practice", route: "/practice",
    img: "/Practice_wide.png",
    challenge: "Intention without rhythm is just wishful thinking.",
    manifesto: "You do not drift into a formed life. You build one — through scripture before screen, through silence before noise, through sabbath before production. The practices are not the goal. They are the conditions under which formation becomes possible.",
    cta: "Enter Practice",
    heroLine: "You become what you repeatedly do — not what you occasionally decide.",
    sections: [
      { eyebrow: "The Problem", headline: "Modern life has a rhythm. You just didn't choose it.", body: "Wake. Check phone. Consume. Produce. Repeat. The rhythm of the digital age is relentless and it is forming you — training your attention span, shaping your desires, calibrating what you reach for under pressure. It does not need your consent. It just needs your habit." },
      { eyebrow: "The Counter", headline: "Spiritual disciplines are not religious obligations. They are training.", body: "Paul calls it gymnazō — the same word used for an athlete conditioning their body. You are not earning God's approval through practice. You are arranging your life so that you are present, available, and trainable by the One who actually transforms. The discipline creates the conditions. Grace does the work." },
      { eyebrow: "The Rule", headline: "A Rule of Life is simply the decision to stop leaving your formation to chance.", body: "Scripture before the algorithm. Silence before the meeting. Sabbath before the next sprint. These are not rigid legalisms — they are chosen rhythms that accumulate, over months and years, into a recognizably different kind of life. One that looks unhurried. One that looks formed." },
    ],
    pullQuote: "You don't drift into a formed life. You build one — one repeated practice at a time.",
    scripture: { t: "Train yourself for godliness; for while bodily training is of some value, godliness is of value in every way.", r: "1 Timothy 4:7–8" },
    connectedRhythm: "scripture", connectedChallenge: 2,
  },
  {
    num: "III", slug: "community", title: "Community", route: "/community",
    img: "/Community_wide.png",
    challenge: "You cannot become like Christ alone.",
    manifesto: "This is not a motivational claim. It is a structural one. Jesus did not form his disciples through content or curriculum — he lived with them. Proximity over time, through honesty and failure and shared rhythm, is the actual environment in which transformation happens.",
    cta: "Enter Community",
    heroLine: "We have more ways to connect than any generation in history — and we are more alone.",
    sections: [
      { eyebrow: "The Problem", headline: "Digital connection creates the sensation of community without its substance.", body: "You can be seen by thousands and known by no one. The feed gives you the dopamine hit of social belonging while insulating you from the cost of actual presence — vulnerability, accountability, inconvenience, and the slow work of being truly known. That insulation feels like freedom. It is actually a formation trap." },
      { eyebrow: "The Counter", headline: "The New Testament vision of community was never a weekly gathering. It was shared life.", body: "Koinonia — the Greek word translated 'fellowship' — meant something far more substantive than attendance. It meant common participation. Mutual bearing of burdens. The kind of proximity where people see you tired, failing, doubting, and keep showing up anyway. That environment is where formation actually happens." },
      { eyebrow: "The Commitment", headline: "Formation community is not found. It is built — through initiative, honesty, and sustained presence.", body: "Counter Formation calls you into small, intentional communities committed to shared rhythms of discipleship — not as a program, but as a posture. Four to eight people who have agreed, explicitly, to stop performing for one another and start being honest with one another. That is the container in which everything else grows." },
    ],
    pullQuote: "Most of us have mastered the art of being known without being known.",
    scripture: { t: "They devoted themselves to the apostles' teaching and to fellowship, to the breaking of bread and to prayer.", r: "Acts 2:42" },
    connectedRhythm: "community", connectedChallenge: 6,
  },
];

/* ─── STYLES ──────────────────────────────────────────────────────── */

export function ArchitectureStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

      /* ══════════════════════════════════════════
         SLIDER
      ══════════════════════════════════════════ */

      .arch-outer {
        position: relative;
        /* Tall enough that sticky holds while wheel handler runs.
           Extra 200svh = scroll buffer so native scroll doesn't
           immediately release the sticky container. */
        height: 300svh;
        background: #06050A;
      }

      .arch-sticky {
        position: sticky;
        top: 0;
        height: 100svh;
        overflow: hidden;
      }

      .arch-viewport {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      /* sliding track — 3 panels wide */
      .arch-track {
        display: flex;
        width: 300%;
        height: 100%;
        transition: transform .78s cubic-bezier(.76,0,.24,1);
        will-change: transform;
      }

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

      /* background image — less zoom, wide fit */
      .arch-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center 20%;
        transform: scale(1.03); /* subtle — just enough for Ken Burns */
        transition: transform 1.2s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-bg {
        transform: scale(1.0);
      }

      /* overlays */
      .arch-ov-bottom {
        position: absolute; inset: 0;
        background: linear-gradient(to top,
          rgba(6,5,10,0.96) 0%,
          rgba(6,5,10,0.62) 35%,
          rgba(6,5,10,0.22) 62%,
          rgba(6,5,10,0.06) 100%);
      }
      .arch-ov-top {
        position: absolute; inset: 0;
        background: linear-gradient(to bottom,
          rgba(6,5,10,0.48) 0%,
          transparent 28%);
      }

      /* panel content */
      .arch-content {
        position: relative;
        z-index: 10;
        padding: clamp(2rem,4vw,3.5rem) clamp(1.75rem,5vw,5rem) clamp(3rem,5.5vw,5rem);
        max-width: 820px;
      }

      /* eyebrow — gold, stronger contrast */
      .arch-eyebrow {
        display: flex;
        align-items: center;
        gap: 14px;
        font-family: 'Michroma', sans-serif;
        font-size: clamp(9px,1vw,11px);
        letter-spacing: .48em;
        text-transform: uppercase;
        color: #C9A84C;
        text-shadow: 0 1px 12px rgba(0,0,0,0.8), 0 0 24px rgba(0,0,0,0.6);
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
        background: #C9A84C;
        opacity: .7;
        flex-shrink: 0;
      }
      .arch-panel.is-active .arch-eyebrow { opacity: 1; transform: none; }

      .arch-headline {
        font-family: 'Michroma', sans-serif;
        font-size: clamp(32px,5.8vw,78px);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .03em;
        line-height: .9;
        color: #FAF8F5;
        text-shadow: 0 2px 20px rgba(0,0,0,0.7);
        margin-bottom: clamp(1rem,2vw,1.75rem);
        opacity: 0;
        transform: translateY(22px);
        transition: opacity .65s .2s, transform .65s .2s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-headline { opacity: 1; transform: none; }

      .arch-manifesto {
        font-family: 'Cormorant Garamond', serif;
        font-size: clamp(14px,1.6vw,19px);
        line-height: 1.82;
        color: rgba(250,248,245,0.55);
        max-width: 520px;
        margin-bottom: clamp(1.5rem,2.5vw,2.25rem);
        opacity: 0;
        transform: translateY(18px);
        transition: opacity .6s .32s, transform .6s .32s cubic-bezier(.16,1,.3,1);
      }
      .arch-panel.is-active .arch-manifesto { opacity: 1; transform: none; }

      .arch-cta-row {
        display: flex;
        align-items: center;
        gap: 14px;
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
        border: 1px solid rgba(201,168,76,0.65);
        color: #C9A84C;
        font-family: 'Michroma', sans-serif;
        font-size: clamp(8px,.9vw,10px);
        letter-spacing: .28em;
        text-transform: uppercase;
        font-weight: 700;
        text-decoration: none;
        transition: background .25s, color .25s, border-color .25s, transform .2s;
        white-space: nowrap;
        box-shadow: 0 0 20px rgba(0,0,0,0.4);
      }
      .arch-cta-enter:hover {
        background: #C9A84C;
        color: #0A0A0A;
        border-color: #C9A84C;
        transform: translateY(-2px);
      }

      /* ── RIGHT-SIDE INDICATOR ──
         Replaces arrows + bottom dots.
         Sits on the right edge: panel dots stacked + gold chevron below.
      ── */
      .arch-right-ui {
        position: absolute;
        right: clamp(1.5rem,2.5vw,2.5rem);
        top: 50%;
        transform: translateY(-50%);
        z-index: 30;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }

      /* panel dots — vertical stack */
      .arch-rdot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        border: none;
        padding: 0;
        cursor: pointer;
        transition: background .3s, height .3s, border-radius .3s;
        display: block;
      }
      .arch-rdot.active {
        background: #C9A84C;
        height: 20px;
        border-radius: 3px;
      }

      /* separator */
      .arch-right-sep {
        width: 1px;
        height: 20px;
        background: rgba(255,255,255,0.1);
        margin: 2px 0;
      }

      /* gold chevron — advances panel */
      .arch-right-next {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 6px;
        color: #C9A84C;
        opacity: .85;
        transition: opacity .25s, transform .2s;
      }
      .arch-right-next:hover { opacity: 1; transform: scale(1.1); }
      .arch-right-next:disabled { opacity: .2; cursor: default; transform: none; }
      .arch-right-next span {
        font-family: 'Michroma', sans-serif;
        font-size: 7px;
        letter-spacing: .32em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.3);
        writing-mode: vertical-rl;
        margin-bottom: 4px;
      }

      @keyframes archChevronPulse {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(4px); }
      }
      .arch-right-next svg {
        animation: archChevronPulse 2s ease-in-out infinite;
      }
      .arch-right-next:disabled svg { animation: none; }

      /* ── SCROLL PROGRESS BAR (thin, bottom) ── */
      .arch-prog {
        position: absolute;
        bottom: 0; left: 0; right: 0;
        height: 2px;
        background: rgba(255,255,255,0.06);
        z-index: 30;
      }
      .arch-prog-fill {
        height: 100%;
        background: linear-gradient(to right, #C9A84C, rgba(201,168,76,0.35));
        transition: width .5s cubic-bezier(.76,0,.24,1);
      }

      /* ── PANEL COUNTER (top left) ── */
      .arch-counter {
        position: absolute;
        top: clamp(1.5rem,2.5vw,2rem);
        left: clamp(1.75rem,3.5vw,3.5rem);
        z-index: 30;
        font-family: 'Michroma', sans-serif;
        font-size: 9px;
        letter-spacing: .38em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.22);
      }
      .arch-counter strong { color: rgba(255,255,255,0.5); }

      /* ── SCROLL HINT (top right) ── */
      .arch-scroll-hint {
        position: absolute;
        top: clamp(1.5rem,2.5vw,2rem);
        right: clamp(1.75rem,3.5vw,3.5rem);
        z-index: 30;
        display: flex;
        align-items: center;
        gap: 7px;
        opacity: 0;
        animation: archFadeIn .8s 1.6s forwards;
        pointer-events: none;
      }
      @keyframes archFadeIn { to { opacity: 1; } }
      .arch-scroll-hint span {
        font-family: 'Michroma', sans-serif;
        font-size: 8px;
        letter-spacing: .36em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.2);
      }

      /* ── CONTINUE (last panel) ── */
      .arch-continue {
        position: absolute;
        bottom: clamp(1.75rem,3vw,2.5rem);
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        z-index: 30;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 7px;
        opacity: 0;
        pointer-events: none;
        transition: opacity .5s, transform .5s cubic-bezier(.16,1,.3,1);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
      }
      .arch-continue.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }
      .arch-continue span {
        font-family: 'Michroma', sans-serif;
        font-size: 8px;
        letter-spacing: .42em;
        text-transform: uppercase;
        color: rgba(255,255,255,0.35);
      }
      @keyframes archBounce {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(5px); }
      }
      .arch-continue svg { animation: archBounce 1.8s ease-in-out infinite; }

      /* ── MOBILE ── */
      @media (max-width: 767px) {
        .arch-outer { height: auto; }
        .arch-sticky { position: relative; height: auto; }
        .arch-track {
          flex-direction: column;
          width: 100%;
          transition: none;
          transform: none !important;
        }
        .arch-panel { width: 100%; height: 100svh; }
        .arch-panel .arch-eyebrow,
        .arch-panel .arch-headline,
        .arch-panel .arch-manifesto,
        .arch-panel .arch-cta-row { opacity: 1; transform: none; }
        .arch-right-ui,
        .arch-continue,
        .arch-scroll-hint,
        .arch-counter,
        .arch-prog { display: none; }
        .arch-content { padding: 2rem 1.5rem 3rem; }
      }


      /* ══════════════════════════════════════════
         CAMPAIGN PAGES
      ══════════════════════════════════════════ */

      .camp-wrap {
        min-height: 100svh;
        background: #FAF8F5;
        color: #0E0C0A;
        font-family: 'Barlow Condensed', sans-serif;
        overflow-x: hidden;
      }
      .camp-nav {
        position: fixed; top: 1rem; left: 50%; transform: translateX(-50%);
        z-index: 200; display: flex; align-items: center; gap: 10px;
        padding: 10px 20px 10px 14px; border-radius: 999px;
        background: rgba(6,5,10,0.88); backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.08); text-decoration: none;
        transition: border-color .25s;
      }
      .camp-nav:hover { border-color: rgba(201,168,76,0.35); }
      .camp-nav img  { width: 28px; height: 28px; object-fit: contain; filter: brightness(0) invert(1); }
      .camp-nav span { font-size: 9px; letter-spacing: .28em; text-transform: uppercase; color: rgba(250,248,245,0.6); font-weight: 600; }

      .camp-hero {
        position: relative; height: 100svh; overflow: hidden;
        display: flex; flex-direction: column; justify-content: flex-end;
      }
      .camp-hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center 20%; }
      .camp-hero-ov {
        position: absolute; inset: 0;
        background: linear-gradient(to top, rgba(245,240,232,0.98) 0%, rgba(245,240,232,0.55) 40%, rgba(6,5,10,0.25) 100%);
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
        font-size: clamp(52px,9vw,120px); font-weight: 700;
        text-transform: uppercase; letter-spacing: .04em; line-height: .86;
        color: #0E0C0A; margin-bottom: 1.25rem;
      }
      .camp-hero-line {
        font-family: 'Cormorant Garamond', serif; font-style: italic;
        font-size: clamp(17px,2.2vw,24px); line-height: 1.65;
        color: rgba(14,12,10,0.52); max-width: 560px; margin-bottom: 2rem;
      }
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
        font-size: clamp(28px,5vw,58px); font-weight: 700;
        text-transform: uppercase; letter-spacing: .04em;
        line-height: .92; color: #FAF8F5;
      }
      .camp-banner-h em { font-style: normal; color: #C9A84C; }
      .camp-body { background: #FAF8F5; padding: clamp(3rem,6vw,6rem) clamp(1.5rem,5vw,5rem); }
      .camp-body-inner { max-width: 1100px; margin: 0 auto; }
      .camp-pull {
        padding: clamp(2rem,3.5vw,3rem) 0;
        border-top: 1px solid rgba(14,12,10,0.1);
        border-bottom: 1px solid rgba(14,12,10,0.1);
        margin-bottom: clamp(3rem,5vw,4.5rem);
      }
      .camp-pull p {
        font-family: 'Cormorant Garamond', serif; font-style: italic;
        font-size: clamp(22px,3.8vw,44px); line-height: 1.25;
        color: #0E0C0A; max-width: 780px;
      }
      .camp-scripture {
        border-left: 3px solid #C9A84C; padding: 1.4rem 1.75rem;
        background: rgba(201,168,76,0.06); border-radius: 0 16px 16px 0;
        margin-bottom: clamp(2.5rem,5vw,4rem);
      }
      .camp-scripture p {
        font-family: 'Cormorant Garamond', serif; font-style: italic;
        font-size: clamp(16px,2vw,21px); color: rgba(14,12,10,0.75);
        line-height: 1.7; margin-bottom: .6rem;
      }
      .camp-scripture cite { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; font-style: normal; }
      .camp-sections { display: flex; flex-direction: column; gap: clamp(2.5rem,5vw,4.5rem); margin-bottom: clamp(2.5rem,5vw,4rem); }
      .camp-sect { display: grid; grid-template-columns: 1fr; gap: 1rem; }
      @media (min-width: 768px) { .camp-sect { grid-template-columns: 160px 1fr; gap: 2.5rem; align-items: start; } }
      .camp-sect-eye { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; font-weight: 700; display: block; margin-bottom: .5rem; }
      .camp-sect-rule { width: 28px; height: 1px; background: rgba(14,12,10,0.16); }
      .camp-sect-h {
        font-family: 'Michroma', sans-serif; font-size: clamp(16px,2.2vw,24px);
        font-weight: 700; text-transform: uppercase; letter-spacing: .05em;
        line-height: 1.1; color: #0E0C0A; margin-bottom: .9rem;
      }
      .camp-sect-body {
        font-family: 'Cormorant Garamond', serif; font-size: clamp(16px,2vw,20px);
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
        background: #0E0C0A; color: #FAF8F5; border: 2px solid #0E0C0A;
        font-family: 'Barlow Condensed', sans-serif; font-size: 10px;
        letter-spacing: .26em; text-transform: uppercase; font-weight: 700;
        text-decoration: none; transition: background .25s, border-color .25s, color .25s;
      }
      .camp-btn-p:hover { background: #C9A84C; border-color: #C9A84C; color: #0A0A0A; }
      .camp-btn-s {
        display: inline-flex; align-items: center; gap: 9px;
        padding: 14px 30px; border-radius: 999px;
        background: transparent; color: rgba(14,12,10,0.5);
        border: 1px solid rgba(14,12,10,0.18);
        font-family: 'Barlow Condensed', sans-serif; font-size: 10px;
        letter-spacing: .26em; text-transform: uppercase; font-weight: 700;
        text-decoration: none; transition: border-color .25s, color .25s;
      }
      .camp-btn-s:hover { border-color: #C9A84C; color: #C9A84C; }
      .camp-others { background: #0E0C0A; padding: clamp(2.5rem,5vw,4.5rem) clamp(1.5rem,5vw,5rem); }
      .camp-others-inner { max-width: 1100px; margin: 0 auto; }
      .camp-others-label { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: rgba(201,168,76,0.6); margin-bottom: 1.5rem; font-weight: 700; }
      .camp-others-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(260px,100%),1fr)); gap: 12px; }
      .camp-other-card {
        position: relative; overflow: hidden; border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08); aspect-ratio: 4/3;
        text-decoration: none; display: block; transition: border-color .3s, transform .3s;
      }
      .camp-other-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); }
      .camp-other-bg { position: absolute; inset: 0; background-size: cover; background-position: center 20%; filter: grayscale(.3); opacity: .5; transition: opacity .5s, filter .5s; }
      .camp-other-card:hover .camp-other-bg { opacity: .82; filter: grayscale(0); }
      .camp-other-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,5,10,0.92), rgba(6,5,10,0.28) 60%, transparent); }
      .camp-other-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; z-index: 2; }
      .camp-other-num { font-size: 9px; letter-spacing: .32em; text-transform: uppercase; color: #C9A84C; margin-bottom: .3rem; }
      .camp-other-title { font-family: 'Michroma', sans-serif; font-size: clamp(15px,2.2vw,22px); font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #FAF8F5; }
      .camp-footer { background: #06050A; border-top: 1px solid rgba(255,255,255,0.05); padding: 28px 1.5rem; text-align: center; }
      .camp-footer img { width: 24px; height: 24px; opacity: .2; filter: invert(1); display: block; margin: 0 auto .75rem; }
      .camp-footer p { font-size: 8px; letter-spacing: .28em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
    `}</style>
  );
}

/* ─── ARCHITECTURE SLIDER ─────────────────────────────────────────── */

// How many wheel "ticks" to consume before advancing a panel or releasing
const TICKS_TO_ADVANCE = 8;   // ticks to move to next panel
const TICKS_TO_RELEASE = 12;  // extra ticks on last panel before exiting

export function ArchitectureSlider() {
  const outerRef    = useRef(null);
  const trackRef    = useRef(null);
  const [idx, setIdx] = useState(0);
  const TOTAL = PILLARS.length;

  // Accumulated wheel delta — use a ref so wheel handler closure stays fresh
  const accumRef    = useRef(0);
  const lockedRef   = useRef(false); // debounce between advances
  const exitAccRef  = useRef(0);     // extra ticks on last panel before release

  // ── Apply track translation whenever idx changes
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(-${idx * (100 / TOTAL)}%)`;

    // Update is-active class
    track.querySelectorAll(".arch-panel").forEach((p, i) => {
      p.classList.toggle("is-active", i === idx);
    });

    // Reset accumulators when panel changes
    accumRef.current = 0;
    exitAccRef.current = 0;
  }, [idx, TOTAL]);

  // ── Mark first panel active on mount
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const panels = track.querySelectorAll(".arch-panel");
    if (panels[0]) panels[0].classList.add("is-active");
  }, []);

  // ── Snap into viewport when section enters view
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer || window.innerWidth < 768) return;

    let snapped = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !snapped) {
            const rect = outer.getBoundingClientRect();
            // Only snap if the section top is within 80% of viewport height
            // — avoids snapping when scrolling back up past it
            if (rect.top > -window.innerHeight * 0.8 && rect.top < window.innerHeight * 0.8) {
              snapped = true;
              window.scrollTo({
                top: outer.offsetTop,
                behavior: "smooth",
              });
              // Reset snap lock after transition settles
              setTimeout(() => { snapped = false; }, 1200);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  // ── Wheel handler — intercepts scroll when section is pinned
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const onWheel = (e) => {
      // Only intercept on desktop
      if (window.innerWidth < 768) return;

      // Is the section currently sticky (i.e. top of viewport)?
      const rect = outer.getBoundingClientRect();
      const isStuck = rect.top <= 2 && rect.top >= -2;
      if (!isStuck) return;

      // Prevent native scroll while we're intercepting
      e.preventDefault();

      const dir = e.deltaY > 0 ? 1 : -1;

      // Going backward — always allow immediately
      if (dir < 0) {
        if (idx > 0) {
          setIdx(i => i - 1);
        }
        // else let scroll pass through naturally (already at top of section)
        return;
      }

      // Going forward
      if (lockedRef.current) return;

      accumRef.current += 1;

      // On last panel, require extra ticks before releasing
      if (idx === TOTAL - 1) {
        exitAccRef.current += 1;
        if (exitAccRef.current >= TICKS_TO_RELEASE) {
          // Release — stop intercepting so page scrolls naturally
          exitAccRef.current = 0;
          accumRef.current = 0;
          // Programmatically scroll past the section
          const target = outer.offsetTop + outer.offsetHeight + 2;
          window.scrollTo({ top: target, behavior: "smooth" });
        }
        // Don't advance — already on last panel
        return;
      }

      if (accumRef.current >= TICKS_TO_ADVANCE) {
        accumRef.current = 0;
        lockedRef.current = true;
        setIdx(i => Math.min(TOTAL - 1, i + 1));
        // Brief lock to prevent runaway advances on fast trackpads
        setTimeout(() => { lockedRef.current = false; }, 600);
      }
    };

    // Must be non-passive to call preventDefault
    outer.addEventListener("wheel", onWheel, { passive: false });
    return () => outer.removeEventListener("wheel", onWheel);
  }, [idx, TOTAL]);

  // ── Keyboard
  useEffect(() => {
    const onKey = (e) => {
      const outer = outerRef.current;
      if (!outer) return;
      const rect = outer.getBoundingClientRect();
      if (rect.top > 10 || rect.bottom < window.innerHeight - 10) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (idx < TOTAL - 1) setIdx(i => i + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        if (idx > 0) setIdx(i => i - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, TOTAL]);

  // ── Continue button (last panel)
  const handleContinue = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const target = outer.offsetTop + outer.offsetHeight + 2;
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const progPct = ((idx) / (TOTAL - 1)) * 100;

  return (
    <section ref={outerRef} id="architecture" className="arch-outer">
      <div className="arch-sticky">
        <div className="arch-viewport">

          {/* Counter */}
          <div className="arch-counter">
            <strong>{idx + 1}</strong> / {TOTAL}
          </div>

          {/* Scroll-past hint */}
          <div className="arch-scroll-hint">
            <span>Scroll to explore · scroll past to skip</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M2 7l4 4 4-4" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
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

          {/* Right-side UI: dots + gold chevron */}
          <div className="arch-right-ui">
            {PILLARS.map((p, i) => (
              <button
                key={p.slug}
                className={`arch-rdot${i === idx ? " active" : ""}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to ${p.title}`}
              />
            ))}

            <div className="arch-right-sep" />

            <button
              className="arch-right-next"
              onClick={() => idx < TOTAL - 1 ? setIdx(i => i + 1) : handleContinue()}
              disabled={false}
              aria-label="Next"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 7l5 5 5-5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Continue — last panel */}
          <button
            className={`arch-continue${idx === TOTAL - 1 ? " visible" : ""}`}
            onClick={handleContinue}
          >
            <span>Continue</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 1L8 8L15 1" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Progress bar */}
          <div className="arch-prog">
            <div className="arch-prog-fill" style={{ width: `${progPct}%` }} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── CAMPAIGN PAGE ───────────────────────────────────────────────── */

function CampaignPage({ pillar }) {
  const others = PILLARS.filter(p => p.slug !== pillar.slug);
  useEffect(() => { window.scrollTo(0, 0); }, [pillar.slug]);

  return (
    <div className="camp-wrap">
      <Link to="/" className="camp-nav">
        <img src="/helmet.png" onError={e => { e.target.style.display = "none"; }} alt="Counter Formation" />
        <span>Counter Formation</span>
      </Link>

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

      <div className="camp-body">
        <div className="camp-body-inner">
          <div className="camp-pull"><p>"{pillar.pullQuote}"</p></div>
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

export function IdentityPage()  { return <CampaignPage pillar={PILLARS[0]} />; }
export function PracticePage()  { return <CampaignPage pillar={PILLARS[1]} />; }
export function CommunityPage() { return <CampaignPage pillar={PILLARS[2]} />; }