/**
 * Cloudflare Pages Function — POST /api/arrow-log
 * Accepts { lie } and returns { truth, verses } via Gemini.
 *
 * Required secret: GEMINI_API_KEY
 * Set it in Cloudflare Pages → Settings → Environment Variables (Production).
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL   = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_INSTRUCTION = `You are a biblical counselor and spiritual director. When a user shares a lie they believe about themselves or the world, respond with a gentle, pastoral biblical truth that counters it directly.

Requirements:
1. Respond in a warm, affirming, and pastoral tone — like a trusted spiritual director writing to a friend.
2. The "truth" field should be 1–3 sentences of biblical truth that directly counters the lie. Write it as a statement the person can receive and hold onto.
3. Provide 2 specific scripture references that support the truth.
4. Use the English Standard Version (ESV) for all verse text.
5. Do not fabricate or paraphrase verses. Quote them accurately and word-for-word from the ESV.
6. For each verse, provide a direct link to the chapter on Bible.com (e.g., https://www.bible.com/bible/59/PSA.23.ESV).
7. Return the response in the exact JSON format specified.`;

export async function onRequestPost(context) {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return json({ error: "GEMINI_API_KEY not configured on this deployment." }, 500);
    }

    const { lie = "" } = await context.request.json();

    if (!lie.trim()) {
      return json({ error: "lie is required." }, 400);
    }

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [{
          parts: [{ text: `The user is believing this lie: "${lie.trim()}"\n\nCounter this with a specific biblical truth and 2 supporting ESV scripture verses.` }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              truth: {
                type: "STRING",
                description: "1–3 sentences of biblical truth that directly and gently counters the lie.",
              },
              verses: {
                type: "ARRAY",
                description: "2 ESV scripture verses that support the truth.",
                items: {
                  type: "OBJECT",
                  properties: {
                    reference: { type: "STRING", description: "e.g. Romans 8:38-39" },
                    text:      { type: "STRING", description: "Word-for-word ESV verse text." },
                    translation: { type: "STRING", description: "Always 'ESV'." },
                    bibleUrl:  { type: "STRING", description: "Direct Bible.com chapter link." },
                  },
                  required: ["reference", "text", "translation", "bibleUrl"],
                },
              },
            },
            required: ["truth", "verses"],
          },
        },
      }),
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, detail);
      return json({ error: `Generation failed (${geminiRes.status}). Please try again.` }, 502);
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Gemini." }, 502);
    }

    try {
      const parsed = JSON.parse(text);
      return json(parsed);
    } catch {
      console.error("Failed to parse Gemini JSON response:", text);
      return json({
        truth: "God loves you unconditionally and nothing can separate you from that love.",
        verses: [{
          reference: "Romans 8:38-39",
          text: "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers, nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord.",
          translation: "ESV",
          bibleUrl: "https://www.bible.com/bible/59/ROM.8.ESV",
        }],
      });
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
