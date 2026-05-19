/**
 * Cloudflare Pages Function -- POST /api/arrow-log
 * Accepts { lie } and returns { truth, verses } via Claude.
 *
 * Required secret: ANTHROPIC_API_KEY
 */

const ANTHROPIC_BASE = "https://api.anthropic.com/v1/messages";
const MODEL          = "claude-haiku-4-5-20251001";

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

    const { lie = "" } = await context.request.json();

    if (!lie.trim()) {
      return json({ error: "lie is required." }, 400);
    }

    const prompt = `You are a biblical counselor and spiritual director for Counter Formation -- a community of people pursuing intentional formation in Christ.

The user believes this lie: "${lie.trim()}"

Respond with a gentle, pastoral biblical truth that directly counters it. Requirements:
- The "truth" should be 1-3 warm, affirming sentences the person can hold onto. Write it as a statement they can receive, not an instruction.
- Provide exactly 2 scripture references from the English Standard Version (ESV).
- Quote verses accurately and word-for-word. Do not fabricate or paraphrase.
- For Bible.com URLs use this format: https://www.bible.com/bible/59/[BOOK].[CHAPTER].ESV
  Examples: Romans 8 -> https://www.bible.com/bible/59/ROM.8.ESV, Psalm 23 -> https://www.bible.com/bible/59/PSA.23.ESV

Return ONLY a valid JSON object with no markdown formatting, no code fences, no extra text. Use this exact structure:
{
  "truth": "biblical truth here",
  "verses": [
    {
      "reference": "Book Chapter:Verse",
      "text": "word-for-word ESV verse text",
      "translation": "ESV",
      "bibleUrl": "https://www.bible.com/bible/59/..."
    },
    {
      "reference": "Book Chapter:Verse",
      "text": "word-for-word ESV verse text",
      "translation": "ESV",
      "bibleUrl": "https://www.bible.com/bible/59/..."
    }
  ]
}`;

    const claudeRes = await callClaudeWithRetry(apiKey, {
      model:       MODEL,
      max_tokens:  1024,
      temperature: 0.7,
      messages:    [{ role: "user", content: prompt }],
    });

    if (!claudeRes.ok) {
      const detail = await claudeRes.text();
      console.error("Claude arrow-log error:", claudeRes.status, detail);
      let reason = "";
      try { reason = JSON.parse(detail)?.error?.message ?? ""; } catch {}
      return json({ error: `Claude ${claudeRes.status}${reason ? `: ${reason}` : ""}. Please try again.` }, 502);
    }

    const data = await claudeRes.json();
    const text = data?.content?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Claude." }, 502);
    }

    try {
      return json(JSON.parse(text));
    } catch {
      console.error("Failed to parse Claude response as JSON:", text);
      return json({ error: "Malformed response from Claude. Please try again." }, 502);
    }
  } catch (err) {
    console.error("arrow-log function error:", err);
    return json({ error: "Internal server error." }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
