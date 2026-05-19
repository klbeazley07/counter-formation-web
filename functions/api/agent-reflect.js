/**
 * Cloudflare Pages Function -- POST /api/agent-reflect
 *
 * Accepts a kind (onboarding | nudge | reflection), the full profile, and an
 * optional shortAssessment. Returns a 3-4 sentence formation framing plus a
 * suggestedNextStep URL.
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

const ARMOR_LABELS = {
  "belt-of-truth":                "Belt of Truth",
  "breastplate-of-righteousness": "Breastplate of Righteousness",
  "gospel-of-peace":              "Gospel of Peace",
  "shield-of-faith":              "Shield of Faith",
  "helmet-of-salvation":          "Helmet of Salvation",
  "sword-of-the-spirit":          "Sword of the Spirit",
};

function buildDigest(profile = {}, shortAssessment = null) {
  const edges = Array.isArray(profile.assessment?.formationEdge)
    ? profile.assessment.formationEdge.slice(0, 3).map((f) => FRUIT_LABELS[f] || f)
    : [];

  const topGifts = Array.isArray(profile.gifts?.topGifts)
    ? profile.gifts.topGifts.slice(0, 3)
    : [];

  const armorProgress   = profile.armor?.progress || {};
  const completedPieces = profile.armor?.completedPieces || [];
  const activeArmorSlug = Object.keys(armorProgress).find((s) => !completedPieces.includes(s));
  const activeArmor     = activeArmorSlug ? ARMOR_LABELS[activeArmorSlug] || activeArmorSlug : null;

  const declarations = (profile.widgets?.declarations || []).filter(
    (d) => typeof d === "string" && d.trim().length > 0
  );

  return {
    displayName:         profile.identity?.displayName || null,
    formationEdge:       edges,
    topGifts,
    activeArmor,
    completedArmorCount: completedPieces.length,
    declarations:        declarations.slice(0, 2),
    challengeDay:        Array.isArray(profile.challenge?.completedDays)
                           ? profile.challenge.completedDays.length
                           : 0,
    shortAssessment,
  };
}

const SYSTEM_PROMPT = `You write in the voice of Counter Formation: earnest, direct, theologically grounded, Christ-centered, no AI tells.

Hard voice rules:
- Never use em dashes. Use periods or commas instead.
- Never use the pattern "It's not X, it's Y."
- Never open with "In this season," "In today's world," "Now more than ever," or "Let's."
- Never use these words: leverage, utilize, harness, unlock, unleash, empower, foster, optimize, streamline, seamless, robust, transformative, journey (as a noun for a process), ecosystem, paradigm, synergy, stakeholders, multifaceted, nuanced, innovative, vibrant, dynamic, impactful.
- Never use bullet points, headers, or markdown. Plain prose only.`;

function buildPrompt(kind, digest) {
  const lines = [];

  if (kind === "onboarding") {
    lines.push("This is a formation onboarding. The user just answered three honest questions about where they are right now.");
    lines.push("Read their answers and write 3-4 sentences of formation framing.");
    lines.push("Name one specific thing from their assessment or profile. Do not list their data back like a report.");
    lines.push("End with a single forward-oriented sentence that names what is possible, without commanding it.");
  } else if (kind === "nudge") {
    lines.push("This is a re-engagement nudge. The user has not engaged recently but has meaningful formation history.");
    lines.push("Write 2-3 sentences that acknowledge where they are and call them back, gently and directly.");
  } else {
    lines.push("This is a formation reflection. The user has taken a significant action.");
    lines.push("Write 2-3 sentences that name what they have done and gesture toward what is next.");
  }

  lines.push("");
  lines.push("Formation profile:");
  if (digest.displayName)             lines.push(`- Name: ${digest.displayName}`);
  if (digest.formationEdge.length)    lines.push(`- Formation edge: ${digest.formationEdge.join(", ")}`);
  if (digest.topGifts.length)         lines.push(`- Top gifts: ${digest.topGifts.join(", ")}`);
  if (digest.activeArmor)             lines.push(`- Currently walking through: ${digest.activeArmor}`);
  if (digest.completedArmorCount > 0) lines.push(`- Armor pieces completed: ${digest.completedArmorCount} of 6`);
  if (digest.declarations.length)     lines.push(`- Personal declarations: "${digest.declarations.join('"; "')}"`);
  if (digest.challengeDay > 0)        lines.push(`- 7-Day Challenge: day ${digest.challengeDay} of 7`);

  if (digest.shortAssessment) {
    lines.push("");
    lines.push("Short formation assessment (their own words):");
    if (digest.shortAssessment.formingRight) lines.push(`- What is forming them right now: "${digest.shortAssessment.formingRight}"`);
    if (digest.shortAssessment.resistance)   lines.push(`- Where they feel resistance: "${digest.shortAssessment.resistance}"`);
    if (digest.shortAssessment.next30)       lines.push(`- What they want the next 30 days to look like: "${digest.shortAssessment.next30}"`);
  }

  lines.push("");
  lines.push("Write the formation framing now. Plain prose. No preamble, no labels, no quotation marks around the output.");
  return lines.join("\n");
}

function suggestNextStep(kind, digest) {
  if (kind === "onboarding") {
    if (!digest.formationEdge.length && !digest.topGifts.length) {
      return "/field-guide/fruit-assessment";
    }
    if (digest.activeArmor) {
      return "/identity";
    }
    return "/field-guide/devotion-guide";
  }
  return null;
}

const BANNED_PHRASES = [
  /—/,
  /\bIt's not [^,]+, it's\b/i,
  /\bIn this season\b/i,
  /\bIn today's world\b/i,
  /\bNow more than ever\b/i,
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

function detectBannedPhrases(text) {
  if (!text) return [];
  return BANNED_PHRASES.filter((re) => re.test(text)).map((re) => re.source);
}

function scrubOutput(text) {
  if (!text) return text;
  let s = text.replace(/\s*—\s*/g, ". ").replace(/\s*–\s*/g, ", ");
  s = s.trim().replace(/^["'""]+|["'""]+$/g, "").trim();
  return s.replace(/\s{2,}/g, " ");
}

async function callClaude(apiKey, body) {
  return fetch(ANTHROPIC_BASE, {
    method:  "POST",
    headers: {
      "Content-Type":      "application/json",
      "x-api-key":         apiKey,
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
      return json({ error: "ANTHROPIC_API_KEY not configured." }, 500);
    }

    const { kind = "onboarding", profile = {}, shortAssessment = null } = await context.request.json();

    if (!["onboarding", "nudge", "reflection"].includes(kind)) {
      return json({ error: `Unknown kind: ${kind}` }, 400);
    }

    const digest = buildDigest(profile, shortAssessment);
    const prompt = buildPrompt(kind, digest);

    const claudeRes = await callClaudeWithRetry(apiKey, {
      model:       MODEL,
      max_tokens:  512,
      temperature: 0.78,
      system:      SYSTEM_PROMPT,
      messages:    [{ role: "user", content: prompt }],
    });

    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error("Claude agent-reflect error:", claudeRes.status, detail);
      return json({ error: `Reflection failed (${claudeRes.status}).` }, 502);
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
        model:       MODEL,
        max_tokens:  512,
        temperature: 0.7,
        system:      SYSTEM_PROMPT,
        messages:    [{ role: "user", content: retryPrompt }],
      });
      if (retry.ok) {
        const retryData = await retry.json();
        const retryText = scrubOutput(retryData?.content?.[0]?.text ?? "");
        if (retryText && detectBannedPhrases(retryText).length === 0) {
          return json({ text: retryText, suggestedNextStep: suggestNextStep(kind, digest), voiceGuardTriggered: true });
        }
      }
    }

    return json({ text, suggestedNextStep: suggestNextStep(kind, digest) });
  } catch (err) {
    console.error("agent-reflect error:", err);
    return json({ error: "Internal server error." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
