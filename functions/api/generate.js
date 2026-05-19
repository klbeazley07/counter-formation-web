/**
 * Cloudflare Pages Function -- POST /api/generate
 * Proxies Claude API calls server-side so the key never reaches the browser.
 *
 * Required secret: ANTHROPIC_API_KEY
 */

const ANTHROPIC_BASE = "https://api.anthropic.com/v1/messages";
const MODEL          = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are a warm, pastoral spiritual director writing daily devotionals for Counter Formation -- a community of people who want to be intentionally formed by Christ rather than shaped by the noise and drift of the world.

Tone and style:
- Warm, pastoral, and encouraging -- like a trusted spiritual director writing to a friend.
- Hopeful and grace-filled, not driven or demanding.
- Gently counter-cultural -- inviting people toward Christ without pressure or shame.
- Rooted and grounded, not flashy. Speak to the heart.
- Do not invent Bible verses or citations. Be faithful to the actual meaning of the passage.
- Total length: 700-1100 words.

Always include these sections in this EXACT order:
1) Title (A warm, inviting, spiritually evocative title -- not military or mission-driven)
2) The Objective (2-3 sentences describing the spiritual formation invitation for today)
3) Opening Prayer (4-6 sentences of honest, tender prayer -- focus on openness and surrender)
4) The Text (Scripture reference + 1-2 sentences of gentle framing)
5) Insight (3-5 warm, pastoral observations about the passage and what it reveals about God and us)
6) Reflection (5 thoughtful questions: 2 for the mind, 2 for the heart, 1 for daily life)
7) Life Steps (3 grace-filled, practical actions: one for today / one for this week / one to build as a habit)
8) Deep Formation (Choose ONE: SOAP, Inductive, or Lectio Divina -- guide it warmly in 5-7 steps)
9) Study Questions (3-5 deeper questions for personal journaling or group conversation)
10) Closing Prayer (4-6 sentences of grateful, hopeful prayer)
11) The Takeaway (One gentle, memorable sentence to carry through the day)

Use Markdown for formatting. Use ## for section headers.`;

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
    if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, attempt * 1500));
  }
  return lastRes;
}

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return json({ error: "ANTHROPIC_API_KEY not configured on this deployment." }, 500);
    }

    const { passage = "", theme = "", bigIdea = "", profile: ctx = {} } = await context.request.json();

    if (!passage && !theme && !bigIdea) {
      return json({ error: "At least one of passage, theme, or bigIdea is required." }, 400);
    }

    const ctxLines = [];
    if (Array.isArray(ctx.formationEdge) && ctx.formationEdge.length > 0) {
      ctxLines.push(`Fruit of the Spirit the reader is being shaped in: ${ctx.formationEdge.join(", ")}`);
    }
    if (Array.isArray(ctx.topGifts) && ctx.topGifts.length > 0) {
      ctxLines.push(`Spiritual gifts: ${ctx.topGifts.join(", ")}`);
    }
    if (ctx.currentArmorPiece) {
      const dayNote = ctx.currentArmorDay ? ` (day ${ctx.currentArmorDay})` : "";
      ctxLines.push(`Currently walking through the Armor of God: ${ctx.currentArmorPiece}${dayNote}`);
    }
    if (ctx.recentDeclaration) {
      ctxLines.push(`A personal declaration they have written: "${ctx.recentDeclaration}"`);
    }
    if (ctx.agentFocus) {
      ctxLines.push(`What is forming them right now (in their own words): "${ctx.agentFocus}"`);
    }
    const formationBlock = ctxLines.length > 0
      ? `\nFormation context for this reader (shape the devotion toward this without making it a report):\n${ctxLines.map((l) => `- ${l}`).join("\n")}\n`
      : "";

    const userMessage = `Write a devotional based on the following inputs:
Passage/Verse: ${passage || "Not provided"}
Theme: ${theme || "Not provided"}
Subject, Topic, or Question: ${bigIdea || "Not provided"}
${formationBlock}
If no Scripture passage was provided, select a meaningful Bible passage that fits the theme or topic given.`;

    const claudeRes = await callClaudeWithRetry(apiKey, {
      model:       MODEL,
      max_tokens:  4096,
      temperature: 0.85,
      system:      SYSTEM_PROMPT,
      messages:    [{ role: "user", content: userMessage }],
    });

    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error("Claude generate error:", claudeRes.status, detail);
      let reason = "";
      try { reason = JSON.parse(detail)?.error?.message ?? ""; } catch {}
      return json({ error: `Generation failed (${claudeRes.status}${reason ? `: ${reason}` : ""}). Please try again.` }, 502);
    }

    const data = await claudeRes.json();
    const text = data?.content?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Claude." }, 502);
    }

    return json({ text });
  } catch (err) {
    console.error("Pages Function error:", err);
    return json({ error: "Internal server error." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
