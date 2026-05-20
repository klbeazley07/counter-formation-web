import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ScriptureRef } from "./ScriptureRef";
import { useFormationProfile } from "./hooks/useFormationProfile";
import NextStep from "./components/NextStep";
import { getChallengeDays, getChallengeDayMeta } from "./content/loader";

/* ─── CONSTANTS ───────────────────────────────────────────────────── */

export const CHALLENGE_BASE = "/7-day-challenge";

/* ─── DATA ────────────────────────────────────────────────────────── */

const CHALLENGE_DAYS = getChallengeDays();
const CHALLENGE_DAY_META = getChallengeDayMeta();



/* ─── STORAGE HELPERS ─────────────────────────────────────────────── */

// Converts the profile's completedDays number[] into the legacy Record<string,1>
// shape that the pure-logic helpers below expect. No localStorage reads occur here.
function daysToProgressMap(completedDays) {
  const map = {};
  completedDays.forEach((n) => { map[n] = 1; });
  return map;
}

function getCompletionCount(progress) {
  return CHALLENGE_DAYS.reduce((acc, day) => acc + (progress[day.n] ? 1 : 0), 0);
}
function isUnlocked(n, progress) {
  if (n === 1) return true;
  return !!progress[n - 1];
}
function getCurrentDay(progress) {
  return CHALLENGE_DAYS.find((day) => !progress[day.n])?.n || CHALLENGE_DAYS[CHALLENGE_DAYS.length - 1].n;
}
function stripTags(value = "") {
  return value.replace(/<[^>]+>/g, "");
}
function renderRichText(text, key) {
  return <p key={key} dangerouslySetInnerHTML={{ __html: text }} />;
}
function getCardState(n, progress) {
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

      .cf7-shield-mark { position: fixed; top: 1.25rem; left: 1.5rem; z-index: 200; width: 192px; height: 192px; opacity: 0.32; pointer-events: none; }
      @media (max-width: 640px) { .cf7-shield-mark { width: 100px; height: 100px; top: 0.5rem; left: 0.5rem; } }

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
      @media (min-width: 900px) { .cf7-grid { grid-template-columns: repeat(7, 1fr); } }
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
      .cf7-dev-sec-lbl { font-size: 9px; letter-spacing: .42em; text-transform: uppercase; color: #C9A84C; margin-top: 2.5rem; margin-bottom: 1.25rem; padding-bottom: .7rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .cf7-dev-body    { font-family: 'Cormorant Garamond', serif; font-size: clamp(18px,4vw,20px); line-height: 1.85; color: rgba(250,248,245,0.78); max-width: 620px; }
      .cf7-dev-body p  { margin-bottom: 2rem; }
      .cf7-dev-body em { font-style: italic; color: rgba(250,248,245,0.96); }
      .cf7-dev-opening .cf7-dev-body > p:first-child { font-size: 20px; }

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
    </>
  );
}

/* ─── TRACKER (shared) ───────────────────────────────────────────── */

function Tracker({ activeDayN, progress }) {
  const p = progress || {};
  const currentDay = getCurrentDay(p);

  return (
    <div className="cf7-tracker">
      {CHALLENGE_DAYS.map((d) => {
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
  const { profile, isLoaded } = useFormationProfile();
  const vbRef = useRef(null);
  const blRef = useRef(null);
  const markRef = useRef(null);
  const contRef = useRef(null);
  const shRef = useRef(null);
  const progRef = useRef(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(
    () => daysToProgressMap(isLoaded ? profile.challenge.completedDays : []),
    [profile.challenge.completedDays, isLoaded]
  );

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

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "7day_challenge" }),
    }).catch(() => {});
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
                : completionCount === CHALLENGE_DAYS.length
                  ? "All seven complete. Go back through them slowly and keep the rhythm."
                  : `You are ${completionCount} day${completionCount === 1 ? "" : "s"} in. Continue with Day ${currentDay}.`}
            </p>
          </div>
        </div>

        <div className="cf7-cards-shell">
        <div className="cf7-grid-wrap">
          <div className="cf7-grid">
            {CHALLENGE_DAYS.map((d) => {
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

    </div>
  );
}

/* ─── DEVOTION PAGE ───────────────────────────────────────────────── */

export function CFDevotion() {
  const { profile, updateProfile, isLoaded } = useFormationProfile();
  const { day } = useParams();
  const navigate = useNavigate();
  const rfillRef = useRef(null);
  const contentRef = useRef(null);
  const [showComplete, setShowComplete] = useState(false);

  const n = parseInt(day, 10);
  const d = CHALLENGE_DAYS.find(x => x.n === n);
  const meta = d ? CHALLENGE_DAY_META[d.n] : null;

  const completedDays = isLoaded ? profile.challenge.completedDays : [];
  const progress = useMemo(() => daysToProgressMap(completedDays), [completedDays]);

  useEffect(() => {
    if (!d) navigate(CHALLENGE_BASE, { replace: true });
  }, [d, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [n]);

  useEffect(() => {
    if (!d || !isLoaded) return;

    let hasMarked = completedDays.includes(d.n);
    const el = contentRef.current?.closest(".cf7-dev-scroll") || window;

    const onScroll = () => {
      const scrollTop = el === window ? document.documentElement.scrollTop : el.scrollTop;
      const scrollHeight = el === window ? document.documentElement.scrollHeight : el.scrollHeight;
      const clientHeight = el === window ? window.innerHeight : el.clientHeight;
      const pct = scrollTop / (scrollHeight - clientHeight) || 0;
      if (rfillRef.current) rfillRef.current.style.width = (pct * 100) + "%";

      if (pct > 0.8 && !hasMarked) {
        const updatedDays = [...completedDays, d.n];
        updateProfile({ challenge: { completedDays: updatedDays } });
        hasMarked = true;
        setShowComplete(true);
        window.setTimeout(() => setShowComplete(false), 2600);
      }
    };

    if (el === window) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      el.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (el === window) {
        window.removeEventListener("scroll", onScroll);
      } else {
        el.removeEventListener("scroll", onScroll);
      }
    };
  }, [d, isLoaded]);

  if (!d) return null;

  const prev = CHALLENGE_DAYS.find(x => x.n === n - 1);
  const next = CHALLENGE_DAYS.find(x => x.n === n + 1);
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
          <NextStep context="challenge-complete" className="cf7-next-step" />
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
