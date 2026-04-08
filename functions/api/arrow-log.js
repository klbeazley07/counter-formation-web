/**
 * Cloudflare Pages Function — POST /api/arrow-log
 * Accepts { lie } and returns { truth, verses } via Gemini.
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

    const { lie = "" } = await context.request.json();

    if (!lie.trim()) {
      return json({ error: "lie is required." }, 400);
    }

    const prompt = `You are a biblical counselor and spiritual director for Counter Formation — a community of people pursuing intentional formation in Christ.

The user believes this lie: "${lie.trim()}"

Respond with a gentle, pastoral biblical truth that directly counters it. Requirements:
- The "truth" should be 1–3 warm, affirming sentences the person can hold onto. Write it as a statement they can receive, not an instruction.
- Provide exactly 2 scripture references from the English Standard Version (ESV).
- Quote verses accurately and word-for-word. Do not fabricate or paraphrase.
- For Bible.com URLs use this format: https://www.bible.com/bible/59/[BOOK].[CHAPTER].ESV
  Examples: Romans 8 → https://www.bible.com/bible/59/ROM.8.ESV, Psalm 23 → https://www.bible.com/bible/59/PSA.23.ESV

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

    const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });

    if (!geminiRes.ok) {
      const detail = await geminiRes.text();
      console.error("Gemini error:", geminiRes.status, detail);
      // Parse detail for a cleaner message if available
      let reason = "";
      try { reason = JSON.parse(detail)?.error?.message ?? ""; } catch {}
      return json({ error: `Gemini ${geminiRes.status}${reason ? `: ${reason}` : ""}. Please try again.` }, 502);
    }

    const data = await geminiRes.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return json({ error: "Empty response from Gemini." }, 502);
    }

    // Strip markdown code fences if the model wraps the JSON anyway
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    try {
      return json(JSON.parse(text));
    } catch {
      console.error("Failed to parse Gemini response as JSON:", text);
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
