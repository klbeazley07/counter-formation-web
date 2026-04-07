/**
 * Cloudflare Pages Function — /api/share
 *
 * POST  /api/share        { text: string }  → { id: string }
 * GET   /api/share?id=xx                    → { text: string }
 *
 * Required KV binding: DEVOTIONALS
 * Set it in Cloudflare Pages → Settings → Functions → KV namespace bindings.
 * Variable name: DEVOTIONALS
 * TTL: 30 days (2592000 seconds)
 */

const TTL = 60 * 60 * 24 * 30; // 30 days
const MAX_LENGTH = 24000;       // generous ceiling for a full devotional

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }) {
  if (!env.DEVOTIONALS) {
    return json({ error: "KV namespace not configured." }, 503);
  }

  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return json({ error: "text is required." }, 400);
    }
    if (text.length > MAX_LENGTH) {
      return json({ error: "Content too long." }, 400);
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    await env.DEVOTIONALS.put(id, text, { expirationTtl: TTL });

    return json({ id });
  } catch (err) {
    console.error("share POST error:", err);
    return json({ error: "Failed to save." }, 500);
  }
}

export async function onRequestGet({ request, env }) {
  if (!env.DEVOTIONALS) {
    return json({ error: "KV namespace not configured." }, 503);
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return json({ error: "id is required." }, 400);
  }

  try {
    const text = await env.DEVOTIONALS.get(id);
    if (!text) {
      return json({ error: "This devotional has expired or could not be found." }, 404);
    }
    return json({ text });
  } catch (err) {
    console.error("share GET error:", err);
    return json({ error: "Failed to retrieve." }, 500);
  }
}
