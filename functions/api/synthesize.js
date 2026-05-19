/**
 * Cloudflare Pages Function — POST /api/synthesize
 *
 * Returns a 2-4 sentence formation reflection in the Counter Formation voice,
 * grounded in the user's formation profile. The browser caches the result
 * keyed to a profile signature + date so synthesis regenerates daily or on
 * meaningful profile updates, not every render.
 *
 * Required secret: ANTHROPIC_API_KEY
 */

const ANTHROPIC_BASE = "https://api.anthropic.com/v1/messages";
const MODEL          = "claude-haiku-4-5-20251001";

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
  "belt-of-truth":                "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace":              "Gospel of Peace",
  "shield-of-faith":              "Shield of Faith",
  "helmet-of-salvation":          "Helmet of Salvation",
  "sword-of-the-spirit":          "Sword of the Spirit",
};

function buildProfileDigest(profile = {}) {
  const edges = Array.isArray(profile.assessment?.formationEdge)
    ? profile.assessment.formationEdge.slice(0, 3).map((f) => FRUIT_LABELS[f] || f)
    : [];

  const topGifts = Array.isArray(profile.gifts?.topGifts)
    ? profile.gifts.topGifts.slice(0, 3).map((g) => GIFT_LABELS[g] || g)
    : [];

  const armorProgress    = profile.armor?.progress || {};
  const completedPieces  = profile.armor?.completedPieces || [];
  const activeArmorSlug  = Object.keys(armorProgress).find((slug) => !completedPieces.includes(slug));
  const activeArmor      = activeArmorSlug ? ARMOR_LABELS[activeArmorSlug] || activeArmorSlug : null;

  const declarations  = (profile.widgets?.declarations || []).filter((d) => typeof d === "string" && d.trim().length > 0);
  const challengeDay  = Array.isArray(profile.challenge?.completedDays) ? profile.challenge.completedDays.length : 0;
  const recentDevotion = Array.isArray(profile.widgets?.devotions) && profile.widgets.devotions[0]
    ? profile.widgets.devotions[0]
    : null;

  return {
    displayName:          profile.identity?.displayName || null,
    formationEdge:        edges,
    topGifts,
    activeArmor,
    completedArmorPieces: completedPieces.map((slug) => ARMOR_LABELS[slug] || slug),
    declarations:         declarations.slice(0, 2),
    challengeDay,
    recentDevotion: recentDevotion
      ? { theme: recentDevotion.theme || recentDevotion.passage || null }
      : null,
  };
}

const SYSTEM_PROMPT = `You write in the voice of Counter Formation: earnest, direct, theologically grounded, Christ-centered, no AI tells.

Hard voice rules:
- Never use em dashes. Use periods or commas instead.
- Never use the pattern "It's not X, it's Y."
- Never open with "In this season," "In today's world," "Now more than ever," or "Let's."
- Never use these words: leverage, utilize, harness, unlock, unleash, empower, foster, optimize, streamline, seamless, robust, transformative, journey (as a noun for a process), ecosystem, paradigm, synergy, stakeholders, multifaceted, nuanced, innovative, vibrant, dynamic, impactful.
- Never use bullet points, headers, or markdown. Plain prose only.
- Total length: 2 to 4 sentences. No more.`;

function buildPrompt(digest) {
  const lines = [];
  lines.push("Read the formation profile below and write 2 to 4 sentences that name where the person is right now.");
  lines.push("Speak TO them, not about them. Do not list their data back like a report.");
  lines.push("Reference one or two specific things from their profile -- a formation edge, a current armor piece, a recent declaration, a top gift.");
  lines.push("End with a sentence that gestures toward what is next without commanding it.");
  lines.push("");
  lines.push("Formation profile:");
  if (digest.displayName)              lines.push(`- Name: ${digest.displayName}`);
  if (digest.formationEdge.length)     lines.push(`- Formation edge: ${digest.formationEdge.join(", ")}`);
  if (digest.topGifts.length)          lines.push(`- Top spiritual gifts: ${digest.topGifts.join(", ")}`);
  if (digest.activeArmor)              lines.push(`- Currently walking through: ${digest.activeArmor}`);
  if (digest.completedArmorPieces.length) lines.push(`- Armor pieces completed: ${digest.completedArmorPieces.join(", ")}`);
  if (digest.declarations.length)      lines.push(`- Personal declarations: "${digest.declarations.join('"; "')}"`);
  if (digest.challengeDay > 0)         lines.push(`- 7-Day Challenge progress: day ${digest.challengeDay} of 7`);
  if (digest.recentDevotion?.theme)    lines.push(`- Most recent devotion theme: ${digest.recentDevotion.theme}`);
  lines.push("");
  lines.push("Write the 2-4 sentence reflection now. Plain prose. No preamble, no labels, no quotation marks around the output.");
  return lines.join("\n");
}

const BANNED_PHRASES = [
  /—/,
  /\bIt's not [^,]+, it's\b/i,
  /\bIts not [^,]+, its\b/i,
  /\bIn this season\b/i,
  /\bIn today's world\b/i,
  /\bNow more than ever\b/i,
  /\bLet's dive\b/i,
  /\bleverage\b/i,
  /\butilize\b/i,
  /\bharness\b/i,
  /\bunlock\b/i,
  /\bunleash\b/i,
  /\bempower\b/i,
  /\bfoster\b/i,
  /\boptimize\b/i,
  /\bstreamline\b/i,
  /\bseamless\b/i,
  /\brobust\b/i,
  /\btransformative\b/i,
  /\becosystem\b/i,
  /\bparadigm\b/i,
  /\bsynergy\b/i,
  /\bstakeholders\b/i,
  /\bmultifaceted\b/i,
  /\bvibrant\b/i,
  /\bimpactful\b/i,
];

function scrubOutput(text) {
  if (!text) return text;
  let scrubbed = text.replace(/\s*—\s*/g, ". ").replace(/\s*–\s*/g, ", ");
  scrubbed = scrubbed.trim().replace(/^["'""]+|["'""]+$/g, "").trim();
  return scrubbed.replace(/\s{2,}/g, " ");
}

function detectBannedPhrases(text) {
  if (!text) return [];
  return BANNED_PHRASES.filter((re) => re.test(text)).map((re) => re.source);
}

async function callClaude(apiKey, body) {
  return fetch(ANTHROPIC_BASE, {
    method:  "POST",
    headers: {
      "Content-Type":    "application/json",
      "x-api-key":       apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });
}

async function callClaudeWithRetry(apiKey, body, maxAttempts = 2) {
  let lastRes;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    lastRes = await callClaude(apiKey, body);
    if (lastRes.ok || lastRes.status === 400 || lastRes.status === 401) break;
    if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, attempt * 1000));
  }
  return lastRes;
}

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return json({ error: "ANTHROPIC_API_KEY not configured on this deployment." }, 500);
    }

    const { profile = {} } = await context.request.json();
    const digest = buildProfileDigest(profile);

    const hasAnySignal =
      digest.formationEdge.length > 0 ||
      digest.topGifts.length > 0 ||
      digest.activeArmor ||
      digest.completedArmorPieces.length > 0 ||
      digest.declarations.length > 0 ||
      digest.challengeDay > 0;

    if (!hasAnySignal) {
      return json({ error: "Profile has no formation signals yet.", code: "no-signal" }, 400);
    }

    const prompt = buildPrompt(digest);

    const claudeRes = await callClaudeWithRetry(apiKey, {
      model:      MODEL,
      max_tokens: 512,
      temperature: 0.78,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: "user", content: prompt }],
    });

    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error("Claude synthesize error:", claudeRes.status, detail);
      return json({ error: `Synthesis failed (${claudeRes.status}).` }, 502);
    }

    const data = await claudeRes.json();
    const raw  = data?.content?.[0]?.text ?? "";
    const text = scrubOutput(raw);

    if (!text) {
      return json({ error: "Empty response from Claude." }, 502);
    }

    const banned = detectBannedPhrases(text);
    if (banned.length > 0) {
      const retryPrompt = prompt + `\n\nIMPORTANT: your previous draft used banned language matching: ${banned.join(", ")}. Rewrite without those words or patterns.`;
      const retry = await callClaudeWithRetry(apiKey, {
        model:      MODEL,
        max_tokens: 512,
        temperature: 0.7,
        system:     SYSTEM_PROMPT,
        messages:   [{ role: "user", content: retryPrompt }],
      });
      if (retry.ok) {
        const retryData = await retry.json();
        const retryText = scrubOutput(retryData?.content?.[0]?.text ?? "");
        if (retryText && detectBannedPhrases(retryText).length === 0) {
          return json({ text: retryText, voiceGuardTriggered: true });
        }
      }
    }

    return json({ text });
  } catch (err) {
    console.error("Synthesize function error:", err);
    return json({ error: "Internal server error." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
