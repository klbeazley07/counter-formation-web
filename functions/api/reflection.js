/**
 * Cloudflare Pages Function -- POST /api/reflection
 * Accepts { fruitName, giftName } and returns { text } via Claude.
 * Generates a 100-150 word integrated reflection on how a spiritual gift
 * and a fruit of the Spirit function together in a believer's life.
 *
 * Required secret: ANTHROPIC_API_KEY
 */

const ANTHROPIC_BASE = "https://api.anthropic.com/v1/messages";
const MODEL          = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = `You are writing for Counter Formation, a Christian spiritual formation brand. Write in an earnest, convicted, warm tone -- never sarcastic, never detached.

Voice rules (follow without exception):
- No em dashes. Use double hyphens ( -- ) in casual writing; restructure with commas or sentence breaks otherwise.
- Oxford comma always.
- No banned words: leverage, utilize, harness, unlock, delve, journey (as metaphor), foster, optimize, seamless, transformative, tapestry, landscape, ecosystem, paradigm, groundbreaking.
- No "It's not X, it's Y" sentence pattern.
- No self-posed rhetorical questions answered immediately.
- Second person ("you", "your") for direct address.
- Avoid: "at the end of the day", "in conclusion", "let's dive in", "in today's world", "now more than ever".
- ESV scripture if quoted -- word for word.
- Christian language used naturally and unapologetically.`;

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
      return json({ error: "ANTHROPIC_API_KEY not configured on this deployment." }, 500);
    }

    const { fruitName = "", giftName = "" } = await context.request.json();

    if (!fruitName.trim() || !giftName.trim()) {
      return json({ error: "fruitName and giftName are required." }, 400);
    }

    const userMessage = `Write a 100-150 word reflection paragraph on how the gift of ${giftName.trim()} and the fruit of ${fruitName.trim()} function together in a believer's life.

Write the reflection paragraph only. No title, no preamble, no signature.`;

    const claudeRes = await callClaudeWithRetry(apiKey, {
      model:       MODEL,
      max_tokens:  512,
      temperature: 0.85,
      system:      SYSTEM_PROMPT,
      messages:    [{ role: "user", content: userMessage }],
    });

    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error("Claude reflection error:", claudeRes.status, detail);
      return json({ error: `Claude ${claudeRes.status}. Please try again.` }, 502);
    }

    const data = await claudeRes.json();
    const text = data?.content?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Claude." }, 502);
    }

    return json({ text: text.trim() });
  } catch (err) {
    console.error("reflection function error:", err);
    return json({ error: "Internal server error." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
