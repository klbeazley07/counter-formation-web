/**
 * Cloudflare Pages Function — POST /api/generate
 * Proxies Gemini API calls server-side so the key never reaches the browser.
 *
 * Required secret: GEMINI_API_KEY
 * Set it in Cloudflare Pages → Settings → Environment Variables (Production).
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
You are a Spiritual Formation Strategist for Counterformation.
Your mission is to create a "Tactical Field Guide" for daily spiritual formation based on the following inputs:
Passage/Verse: ${passage || "Not provided"}
Theme: ${theme || "Not provided"}
Big Idea: ${bigIdea || "Not provided"}

IMPORTANT: If a specific Scripture Passage/Verse was not provided, you MUST select a relevant and meaningful Bible passage that fits the provided Theme or Big Idea.

Requirements:
- Tone: Disciplined, intentional, bold, and pastoral.
- Focus: Counter-cultural living, intentional formation in Christ, and resisting the "drift" of the world.
- Be faithful to the meaning of the passage.
- Do not invent Bible verses or citations.
- Total length: 700–1100 words.

Always include sections in this EXACT order:
1) Title (A bold, mission-oriented title)
2) The Objective (A 2-3 sentence summary of the formation goal for today)
3) Opening Prayer (4–6 sentences focusing on focus and surrender)
4) The Text (Reference + 1–2 sentence framing)
5) Intelligence (Context + 3–5 sharp observations about the passage)
6) The Counter (5 questions: 2 head, 2 heart, 1 hands - focusing on how this counters worldly drift)
7) Life Steps (3 concrete actions: immediate / short-term / habit)
8) Deep Formation (Choose ONE method: SOAP, Inductive, or Lectio Divina; guide it in 5–7 steps)
9) Study Questions (3–5 deeper questions for group or personal study)
10) Closing Prayer (4–6 sentences)
11) The Takeaway (One-line mission statement)

Use Markdown for formatting. Use ## for section headers (which will be styled as eyebrows).
    `.trim();

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 8192 },
      }),
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini error:", detail);
      return json({ error: "Generation failed. Please try again." }, 502);
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
