/**
 * Cloudflare Pages Function — POST /api/subscribe-convertkit
 *
 * Subscribes an authenticated user to ConvertKit (now Kit) with a formation
 * tag and profile metadata. Called from ConvertKitOptIn.jsx after the user
 * accepts the post-auth opt-in question.
 *
 * Required secrets:
 *   KIT_API_KEY                -- ConvertKit/Kit v3 API key
 *   KIT_FORMATION_TAG_ID       -- numeric tag id for "formation-edge" subscribers
 *   KIT_FORM_ID                -- optional; numeric form id for double-opt-in (mirrors worker pattern)
 *
 * If KIT_FORMATION_TAG_ID is unset, the function logs a warning and returns
 * success without subscribing -- the user's opt-in is still persisted in
 * Supabase so we do not double-prompt.
 */

const KIT_API = "https://api.convertkit.com/v3";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function isValidEmail(email) {
  return typeof email === "string" && /.+@.+\..+/.test(email);
}

function buildFields(profile) {
  const fields = {};
  if (!profile || typeof profile !== "object") return fields;
  if (Array.isArray(profile.formationEdge) && profile.formationEdge.length) {
    fields.formation_edge = profile.formationEdge.join(",");
  }
  if (Array.isArray(profile.topGifts) && profile.topGifts.length) {
    fields.top_gifts = profile.topGifts.join(",");
  }
  if (typeof profile.hasFruitAssessment === "boolean") {
    fields.fruit_assessment_complete = profile.hasFruitAssessment ? "yes" : "no";
  }
  if (typeof profile.hasGiftsAssessment === "boolean") {
    fields.gifts_assessment_complete = profile.hasGiftsAssessment ? "yes" : "no";
  }
  return fields;
}

async function subscribeWithTag(env, email, fields) {
  const res = await fetch(`${KIT_API}/tags/${env.KIT_FORMATION_TAG_ID}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: env.KIT_API_KEY, email, fields }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Kit tag subscribe failed: ${res.status} ${detail}`);
  }
  const body = await res.json().catch(() => ({}));
  return body?.subscription?.subscriber?.id ?? null;
}

async function subscribeToForm(env, email) {
  if (!env.KIT_FORM_ID) return;
  const res = await fetch(`${KIT_API}/forms/${env.KIT_FORM_ID}/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: env.KIT_API_KEY, email }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Kit form subscribe failed: ${res.status} ${detail}`);
  }
}

export async function onRequestPost(context) {
  try {
    const { env } = context;

    if (!env.KIT_API_KEY) {
      console.warn("KIT_API_KEY not configured; skipping ConvertKit subscribe.");
      return json({ success: true, skipped: "no-api-key" });
    }
    if (!env.KIT_FORMATION_TAG_ID) {
      console.warn("KIT_FORMATION_TAG_ID not configured; skipping ConvertKit subscribe.");
      return json({ success: true, skipped: "no-tag-id" });
    }

    const body = await context.request.json().catch(() => null);
    if (!body) return json({ error: "Invalid JSON" }, 400);

    const { email, profile } = body;
    if (!isValidEmail(email)) return json({ error: "Invalid email" }, 400);

    const fields = buildFields(profile);

    let subscriberId = null;
    try {
      subscriberId = await subscribeWithTag(env, email, fields);
      await subscribeToForm(env, email);
    } catch (err) {
      console.error("ConvertKit subscribe error:", err);
      return json({ error: "Subscription failed" }, 502);
    }

    return json({ success: true, subscriberId });
  } catch (err) {
    console.error("subscribe-convertkit handler error:", err);
    return json({ error: "Internal server error" }, 500);
  }
}
