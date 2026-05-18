/*
 * SynthesisCard -- short personal note that names where the user is.
 *
 * Phase 3: fetches an AI-generated 2-4 sentence reflection from
 * /api/synthesize, keyed by a profile signature + today's date so a given
 * signature regenerates at most once per day. Falls back gracefully to the
 * rule-based copy on network error or when the profile has no signal yet.
 */

import { useEffect, useRef, useState } from "react";
import EyebrowLabel from "../primitives/EyebrowLabel";
import { synthesisCacheKey } from "../../utils/profileSignature";

const FRUIT_LABELS = {
  love: "love", joy: "joy", peace: "peace", patience: "patience",
  kindness: "kindness", goodness: "goodness", faithfulness: "faithfulness",
  gentleness: "gentleness", self_control: "self-control",
};

const GIFT_LABELS = {
  prophecy: "prophecy", teaching: "teaching", exhortation: "exhortation",
  giving: "giving", leadership: "leadership", mercy: "mercy", serving: "serving",
  evangelism: "evangelism", shepherding: "shepherding", apostleship: "apostleship",
  wisdom: "wisdom", knowledge: "knowledge", faith: "faith", healing: "healing",
  miracles: "miracles", discernment: "discernment", administration: "administration",
  hospitality: "hospitality",
};

const ARMOR_LABELS = {
  "belt-of-truth": "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace": "Gospel of Peace",
  "shield-of-faith": "Shield of Faith",
  "helmet-of-salvation": "Helmet of Salvation",
  "sword-of-the-spirit": "Sword of the Spirit",
};

function joinFruits(edges) {
  const labels = edges.slice(0, 3).map((f) => FRUIT_LABELS[f]).filter(Boolean);
  if (labels.length === 0) return null;
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels[0]}, ${labels[1]}, and ${labels[2]}`;
}

function buildFallbackSynthesis(profile) {
  if (!profile) return null;
  const edge = profile.assessment?.formationEdge || [];
  const topGifts = profile.gifts?.topGifts || [];
  const armorProgress = profile.armor?.progress || {};
  const completedPieces = profile.armor?.completedPieces || [];
  const activeArmor = Object.keys(armorProgress).find((slug) => !completedPieces.includes(slug));

  const fruitsLine = joinFruits(edge);
  const topGiftLabel = topGifts[0] ? GIFT_LABELS[topGifts[0]] : null;
  const armorLabel = activeArmor ? ARMOR_LABELS[activeArmor] : null;

  if (!fruitsLine && !topGiftLabel && !armorLabel) {
    return "Your formation profile is still gathering. The Fruit Assessment is the first step, and the rest of the picture forms from there.";
  }

  const sentences = [];
  if (fruitsLine) {
    sentences.push(`You're forming around ${fruitsLine} right now.`);
  }
  if (topGiftLabel) {
    sentences.push(`${capitalize(topGiftLabel)} is sitting at the top of your gifts. Worth asking who in your circle has named that in you.`);
  }
  if (armorLabel) {
    sentences.push(`The ${armorLabel} is shaping how you walk in this season. Keep returning to it.`);
  }
  if (sentences.length < 2) {
    sentences.push("What's next is the work below.");
  }
  return sentences.join(" ");
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function hasAnySignal(profile) {
  if (!profile) return false;
  const edge = profile.assessment?.formationEdge || [];
  const topGifts = profile.gifts?.topGifts || [];
  const armorProgress = profile.armor?.progress || {};
  const completedPieces = profile.armor?.completedPieces || [];
  const declarations = (profile.widgets?.declarations || []).filter((d) => typeof d === "string" && d.trim());
  const challengeDays = (profile.challenge?.completedDays || []).length;
  return (
    edge.length > 0 ||
    topGifts.length > 0 ||
    Object.keys(armorProgress).length > 0 ||
    completedPieces.length > 0 ||
    declarations.length > 0 ||
    challengeDays > 0
  );
}

function readCachedSynthesis(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.text === "string") return parsed.text;
  } catch {
    return null;
  }
  return null;
}

function writeCachedSynthesis(key, text) {
  try {
    localStorage.setItem(key, JSON.stringify({ text, savedAt: new Date().toISOString() }));
  } catch {
    // localStorage full or disabled. Surface gracefully.
  }
}

const STYLES = `
  .cf-synth {
    width: 100%;
  }
  .cf-synth__card {
    background: var(--cf-obsidian);
    border: 1px solid var(--cf-gold-soft);
    border-radius: var(--cf-radius-card);
    padding: 20px 22px 22px;
    position: relative;
    overflow: hidden;
  }
  .cf-synth__card::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--cf-gold-mid), transparent);
  }
  .cf-synth__eyebrow { margin-bottom: 12px !important; }
  .cf-synth__body {
    font-family: var(--cf-font-devotional);
    font-style: italic;
    font-size: 16px;
    line-height: 1.6;
    color: var(--cf-ivory-82);
    margin: 0;
    min-height: 64px;
  }
  .cf-synth__body--loading {
    color: var(--cf-ivory-42);
  }
  .cf-synth__pulse {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--cf-gold);
    margin-right: 8px;
    vertical-align: middle;
    animation: cf-synth-pulse 1.2s ease-in-out infinite;
  }
  @keyframes cf-synth-pulse {
    0%, 100% { opacity: 0.3; }
    50%      { opacity: 0.9; }
  }
  @media (max-width: 600px) {
    .cf-synth__body { font-size: 16px; line-height: 1.65; }
  }
`;

export default function SynthesisCard({ profile }) {
  const fallback = buildFallbackSynthesis(profile);
  const signalPresent = hasAnySignal(profile);
  const cacheKey = profile ? synthesisCacheKey(profile) : null;

  const initialCached = cacheKey ? readCachedSynthesis(cacheKey) : null;
  const [body, setBody] = useState(initialCached || fallback);
  const [loading, setLoading] = useState(signalPresent && !initialCached);
  const lastFetchedKey = useRef(initialCached ? cacheKey : null);

  useEffect(() => {
    if (!signalPresent || !cacheKey) {
      setBody(fallback);
      setLoading(false);
      return;
    }

    const cached = readCachedSynthesis(cacheKey);
    if (cached) {
      setBody(cached);
      setLoading(false);
      lastFetchedKey.current = cacheKey;
      return;
    }

    if (lastFetchedKey.current === cacheKey) {
      // Already attempted this signature today (and likely failed). Don't refetch.
      return;
    }

    let cancelled = false;
    setLoading(true);
    lastFetchedKey.current = cacheKey;

    (async () => {
      try {
        const res = await fetch("/api/synthesize", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ profile }),
        });
        if (!res.ok) {
          if (!cancelled) {
            setBody(fallback);
            setLoading(false);
          }
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        if (data?.text) {
          writeCachedSynthesis(cacheKey, data.text);
          setBody(data.text);
        } else {
          setBody(fallback);
        }
      } catch {
        if (!cancelled) setBody(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  // cacheKey is the only meaningful dependency; fallback derives from profile.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, signalPresent]);

  if (!body) return null;

  return (
    <>
      <style>{STYLES}</style>
      <div className="cf-synth">
        <div className="cf-synth__card">
          <EyebrowLabel size="sm" color="gold" className="cf-synth__eyebrow">
            Where you are
          </EyebrowLabel>
          <p className={`cf-synth__body${loading ? " cf-synth__body--loading" : ""}`}>
            {loading && <span className="cf-synth__pulse" aria-hidden="true" />}
            {body}
          </p>
        </div>
      </div>
    </>
  );
}
