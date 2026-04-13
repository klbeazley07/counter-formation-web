/**
 * Cloudflare Pages Function — POST /api/generate
 * Proxies Gemini API calls server-side so the key never reaches the browser.
 *
 * Required secret: GEMINI_API_KEY
 * Set it in Cloudflare Pages → Settings → Environment Variables (Production).
 */

const GEMINI_PRIMARY  = "gemini-2.5-pro";
const GEMINI_FALLBACK = "gemini-2.5-flash-lite";
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
      // Pause before retry — demand spikes on 2.5-flash can last a few seconds
      await new Promise(r => setTimeout(r, attempt * 1500));
    }
  }
  return lastRes;
}

async function callGeminiWithFallback(apiKey, body) {
  let res = await callGeminiWithRetry(apiKey, GEMINI_PRIMARY, body);
  if (!res.ok) {
    const status = res.status;
    // Surface client errors immediately; retry fallback on server errors
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

    const { passage = "", theme = "", bigIdea = "" } = await context.request.json();

    if (!passage && !theme && !bigIdea) {
      return json({ error: "At least one of passage, theme, or bigIdea is required." }, 400);
    }

    const prompt = `
You are a warm, pastoral spiritual director writing a daily devotional for Counter Formation — a community of people who want to be intentionally formed by Christ rather than shaped by the noise and drift of the world.

Write a devotional based on the following inputs:
Passage/Verse: ${passage || "Not provided"}
Theme: ${theme || "Not provided"}
Subject, Topic, or Question: ${bigIdea || "Not provided"}

IMPORTANT: If no Scripture passage was provided, select a meaningful Bible passage that fits the theme or topic given.

Tone and Style:
- Warm, pastoral, and encouraging — like a trusted spiritual director writing to a friend.
- Hopeful and grace-filled, not driven or demanding.
- Gently counter-cultural — inviting people toward Christ without pressure or shame.
- Rooted and grounded, not flashy. Speak to the heart.
- Do not invent Bible verses or citations. Be faithful to the actual meaning of the passage.
- Total length: 700–1100 words.

Always include these sections in this EXACT order:
1) Title (A warm, inviting, spiritually evocative title — not military or mission-driven)
2) The Objective (2–3 sentences describing the spiritual formation invitation for today)
3) Opening Prayer (4–6 sentences of honest, tender prayer — focus on openness and surrender)
4) The Text (Scripture reference + 1–2 sentences of gentle framing)
5) Insight (3–5 warm, pastoral observations about the passage and what it reveals about God and us)
6) Reflection (5 thoughtful questions: 2 for the mind, 2 for the heart, 1 for daily life)
7) Life Steps (3 grace-filled, practical actions: one for today / one for this week / one to build as a habit)
8) Deep Formation (Choose ONE: SOAP, Inductive, or Lectio Divina — guide it warmly in 5–7 steps)
9) Study Questions (3–5 deeper questions for personal journaling or group conversation)
10) Closing Prayer (4–6 sentences of grateful, hopeful prayer)
11) The Takeaway (One gentle, memorable sentence to carry through the day)

Use Markdown for formatting. Use ## for section headers.
    `.trim();

    const geminiRes = await callGeminiWithFallback(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 8192 },
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, detail);
      let reason = "";
      try { reason = JSON.parse(detail)?.error?.message ?? ""; } catch {}
      return json({ error: `Generation failed (${geminiRes.status}${reason ? `: ${reason}` : ""}). Please try again.` }, 502);
    }

    const data  = await geminiRes.json();
    const text  = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Gemini." }, 502);
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
