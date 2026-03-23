const KIT_API = "https://api.convertkit.com/v3";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function getAllowedOrigin(request, env) {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = [env.ALLOWED_ORIGIN, `https://www.${new URL(env.ALLOWED_ORIGIN).hostname}`];
  return allowed.includes(origin) ? origin : null;
}

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

async function subscribeToKit(env, tagId, email, fields = {}) {
  const tagRes = await fetch(`${KIT_API}/tags/${tagId}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: env.KIT_API_KEY, email, fields }),
  });
  if (!tagRes.ok) throw new Error(`Kit tag subscribe failed: ${tagRes.status}`);

  const formRes = await fetch(`${KIT_API}/forms/${env.KIT_FORM_ID}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: env.KIT_API_KEY, email }),
  });
  if (!formRes.ok) throw new Error(`Kit form subscribe failed: ${formRes.status}`);
}

async function verifyShopifyHmac(request, secret) {
  const signature = request.headers.get("X-Shopify-Hmac-SHA256");
  if (!signature) return { valid: false, rawBody: null };

  const rawBody = await request.arrayBuffer();
  const sigBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );

  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, rawBody);
  return { valid, rawBody };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── CORS preflight ──────────────────────────────────────────────
    if (request.method === "OPTIONS" && url.pathname === "/subscribe") {
      const origin = getAllowedOrigin(request, env);
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // ── POST /subscribe ─────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/subscribe") {
      const origin = getAllowedOrigin(request, env);
      const cors = origin ? corsHeaders(origin) : {};

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400, cors);
      }

      const { email, source } = body ?? {};

      if (!email || !/.+@.+\..+/.test(email)) {
        return json({ error: "Invalid email" }, 400, cors);
      }

      const tagId = source === "7day_challenge"
        ? env.KIT_TAG_7DAY
        : source === "join_formation"
          ? env.KIT_TAG_JOIN
          : null;

      if (!tagId) {
        return json({ error: "Invalid source" }, 400, cors);
      }

      try {
        await subscribeToKit(env, tagId, email);
        return json({ success: true }, 200, cors);
      } catch {
        return json({ error: "Subscription failed" }, 500, cors);
      }
    }

    // ── POST /shopify ────────────────────────────────────────────────
    if (request.method === "POST" && url.pathname === "/shopify") {
      const { valid, rawBody } = await verifyShopifyHmac(request, env.SHOPIFY_WEBHOOK_SECRET);

      if (!valid) {
        return json({ error: "Unauthorized" }, 401);
      }

      let order;
      try {
        order = JSON.parse(new TextDecoder().decode(rawBody));
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      if (order?.customer?.accepts_marketing !== true) {
        return json({ success: true });
      }

      const email = order.customer.email;
      const firstName = order.customer.first_name ?? "";

      try {
        await subscribeToKit(env, env.KIT_TAG_SHOPIFY, email, { first_name: firstName });
        return json({ success: true });
      } catch {
        return json({ error: "Subscription failed" }, 500);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
