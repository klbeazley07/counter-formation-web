/**
 * Cloudflare Pages Function -- POST /api/reflection
 * Accepts { fruitName, giftName } and returns { text } via Gemini.
 * Generates a 100-150 word integrated reflection on how a spiritual gift
 * and a fruit of the Spirit function together in a believer's life.
 *
 * Required secret: GEMINI_API_KEY
 */

const GEMINI_PRIMARY  = "gemini-2.5-flash";
const GEMINI_FALLBACK = "gemini-1.5-flash";
const GEMINI_BASE     = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGemini(apiKey, model, body) {
  return fetch(`${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
}

async function callGeminiWithRetry(apiKey, model, body, maxAttempts = 3) {
  let lastRes;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    lastRes = await callGemini(apiKey, model, body);
    if (lastRes.ok || lastRes.status === 400 || lastRes.status === 401) break;
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
  return lastRes;
}

async function callGeminiWithFallback(apiKey, body) {
  let res = await callGeminiWithRetry(apiKey, GEMINI_PRIMARY, body);
  if (!res.ok) {
    const status = res.status;
    if (status !== 400 && status !== 401) {
      console.warn(`${GEMINI_PRIMARY} returned ${status}, falling back to ${GEMINI_FALLBACK}`);
      res = await callGeminiWithRetry(apiKey, GEMINI_FALLBACK, body);
    }
  }
  return res;
}

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json({ error: "GEMINI_API_KEY not configured on this deployment." }, 500);
    }

    const { fruitName = "", giftName = "" } = await context.request.json();

    if (!fruitName.trim() || !giftName.trim()) {
      return json({ error: "fruitName and giftName are required." }, 400);
    }

    const prompt = `You are writing for Counter Formation, a Christian spiritual formation brand. Write a 100-150 word reflection paragraph on how the gift of ${giftName.trim()} and the fruit of ${fruitName.trim()} function together in a believer's life.

VOICE RULES (follow without exception):
- No em dashes. Use double hyphens ( -- ) in casual writing; restructure with commas or sentence breaks otherwise.
- Oxford comma always.
- Earnest, convicted, warm tone -- never sarcastic, never detached.
- No banned words: leverage, utilize, harness, unlock, delve, journey (as metaphor), foster, optimize, seamless, transformative, tapestry, landscape, ecosystem, paradigm, groundbreaking.
- No "It's not X, it's Y" sentence pattern.
- No self-posed rhetorical questions answered immediately.
- Second person ("you", "your") for direct address.
- Avoid: "at the end of the day", "in conclusion", "let's dive in", "in today's world", "now more than ever".
- ESV scripture if quoted -- word for word.
- Christian language used naturally and unapologetically.

Write the reflection paragraph only. No title, no preamble, no signature.`;

    const geminiRes = await callGeminiWithFallback(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 512,
      },
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, detail);
      return json({ error: `Gemini ${geminiRes.status}. Please try again.` }, 502);
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Gemini." }, 502);
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
