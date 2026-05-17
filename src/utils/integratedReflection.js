// Integrated reflection generator for the Formation Picture.
// Fetches a Gemini-generated paragraph via /api/reflection and caches to localStorage.
// Regenerates only when the top fruit or top gift key changes.

const CACHE_KEY = "cf-formation-reflection";

/**
 * Get (or generate) the integrated reflection paragraph.
 *
 * @param {string} fruitKey - key of the top formation fruit (e.g. "love")
 * @param {string} fruitName - display name (e.g. "Love")
 * @param {string} giftKey - key of the top active gift (e.g. "teaching")
 * @param {string} giftName - display name (e.g. "Teaching")
 * @returns {Promise<string|null>} reflection text, or null on failure
 */
export async function getIntegratedReflection(fruitKey, fruitName, giftKey, giftName) {
  // Return cached result if the fruit/gift pair matches
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached?.fruitKey === fruitKey && cached?.giftKey === giftKey && cached?.text) {
        return cached.text;
      }
    }
  } catch {
    // Corrupt cache -- fall through to regenerate
  }

  try {
    const res = await fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fruitName, giftName }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.text) return null;

    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          fruitKey,
          giftKey,
          text: data.text,
          generatedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Quota or private mode -- silently fail on cache write
    }

    return data.text;
  } catch {
    return null;
  }
}
