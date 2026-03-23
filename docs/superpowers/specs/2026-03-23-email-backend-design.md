# Email Backend Infrastructure — Design Spec
**Date:** 2026-03-23
**Project:** counterformed.com
**Status:** Approved

---

## Overview

Wire up email collection for counterformed.com across three touch points — the 7-Day Challenge form, the Join the Formation footer form, and Shopify post-purchase — into a single unified Kit (ConvertKit) subscriber list, differentiated by source tags.

---

## Architecture

```
counterformed.com (React/Vite — Cloudflare Pages)
  ├── ChallengeSection       → POST /subscribe  (source: "7day_challenge")
  └── Footer / Join Form     → POST /subscribe  (source: "join_formation")
                   │
                   ▼
  Cloudflare Worker  (api.counterformed.com)
  ├── POST /subscribe        — web form submissions (CORS restricted to counterformed.com)
  └── POST /shopify          — Shopify order webhook, no CORS header needed
                   │
                   ▼
  Kit (ConvertKit) API
  └── Single list, subscribers tagged by source
```

---

## Components

### 1. Cloudflare Worker

**Project layout:**
```
worker/
  src/
    index.js        — main Worker entry point
  wrangler.toml     — Cloudflare Worker config
  package.json
```

**`wrangler.toml` required fields:**
```toml
name = "counterformed-api"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
routes = [{ pattern = "api.counterformed.com/*", custom_domain = true }]
```

**Secrets** — set via `wrangler secret put <NAME>`, never committed to code:

| Variable | Description |
|---|---|
| `KIT_API_KEY` | Kit secret API key |
| `KIT_FORM_ID` | Kit form ID (single form for all subscribers) |
| `KIT_TAG_7DAY` | Kit tag ID for `7day_challenge` source |
| `KIT_TAG_JOIN` | Kit tag ID for `join_formation` source |
| `KIT_TAG_SHOPIFY` | Kit tag ID for `shopify_buyer` source |
| `SHOPIFY_WEBHOOK_SECRET` | Used to verify Shopify HMAC signatures |
| `ALLOWED_ORIGIN` | `https://counterformed.com` |

---

#### Endpoint: `POST /subscribe`

Receives web form submissions from the React site.

**CORS:** Sends `Access-Control-Allow-Origin: <ALLOWED_ORIGIN>` header. Responds to preflight `OPTIONS` requests. This CORS restriction applies **only** to this endpoint — not to `/shopify` (which is called by Shopify's servers, not a browser).

**Request body:** `{ email: string, source: "7day_challenge" | "join_formation" }`

**Validation:** Returns `400` if email is missing or fails basic format check (`/.+@.+\..+/`).

**Kit API call:** Uses the tag-based subscribe endpoint to correctly apply source tags:
```
POST https://api.convertkit.com/v3/tags/:tagId/subscribe
Body: { api_key: KIT_API_KEY, email }
```
The tag ID is selected from env vars based on the `source` field (`KIT_TAG_7DAY` or `KIT_TAG_JOIN`). The subscriber is also added to the form via `POST /v3/forms/:formId/subscribe` to ensure they appear on the Kit list regardless of tag state.

**Response:** `200 { success: true }` on success, `500` on Kit API failure.

---

#### Endpoint: `POST /shopify`

Receives Shopify `orders/paid` webhooks. No CORS headers needed — called server-to-server.

**HMAC Verification (must happen before body parsing):**
1. Read the raw request body as bytes (do not call `request.json()` first — re-serialising changes byte order and breaks the signature)
2. Compute `HMAC-SHA256(rawBodyBytes, SHOPIFY_WEBHOOK_SECRET)`
3. Base64-encode the digest
4. Compare with the `X-Shopify-Hmac-SHA256` header using a constant-time comparison (use `crypto.subtle.timingSafeEqual` or equivalent)
5. Return `401` if the signature does not match

**Processing:**
- Parse the verified raw body as JSON
- If `customer.accepts_marketing !== true`, return `200` without subscribing (consent compliance)
- Extract `customer.email` and `customer.first_name`
- Call Kit tag-subscribe endpoint with `KIT_TAG_SHOPIFY` and pass `first_name` as a subscriber field

**Response:** `200 { success: true }`

---

### 2. Frontend Wiring (`src/App.jsx`)

Two existing placeholder `handleSubmit` functions — in `ChallengeSection` (line ~525) and `Footer` (line ~798) — are upgraded to async API calls. Changes are surgical: no new components, no structural changes, no `<form>` elements added (inputs remain wired to `onClick` and `onKeyDown` as they are today — do not wrap in `<form onSubmit>` as this would cause a page reload on Enter).

**State additions** (both components):
```js
const [loading, setLoading] = useState(false);
const [error, setError]     = useState(null);
```

**`handleSubmit` pattern:**
```js
const handleSubmit = async () => {
  if (!email) return;
  setLoading(true);
  setError(null);
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "7day_challenge" }), // or "join_formation"
    });
    if (!res.ok) throw new Error();
    setSubmitted(true); // ← only called here, inside try, after confirmed res.ok
  } catch {
    setError("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};
```

**Critical:** `setSubmitted(true)` must only be called inside the `try` block after `res.ok` is confirmed. It must not appear in `finally` or outside the try/catch. In `ChallengeSection` this matters because `submitted === true` renders the "Begin Now" link to `/7-day-challenge`.

**New Vite env variable:**
```
# .env.local (local dev — not committed)
VITE_API_URL=http://localhost:8787

# Cloudflare Pages environment variable (production)
VITE_API_URL=https://api.counterformed.com
```

Add `.env.local` to `.gitignore` if not already present.

**UI states to add** (alongside existing `submitted` state):
- Loading: disable button, show "..." or spinner
- Error: show inline error message below the form

**Double opt-in:** Double opt-in will be **disabled** in Kit for this list. The success message copy ("You're in." / "Weekly field notes incoming.") is accurate only when subscribers are confirmed immediately. If double opt-in is ever enabled in Kit, the success copy must change to "Check your inbox to confirm."

---

### 3. Shopify Post-Purchase Webhook

No React code changes needed. Configuration is entirely in Shopify admin.

**Setup:**
1. Shopify Admin → Settings → Notifications → Webhooks
2. Create webhook: event `orders/paid`, URL `https://api.counterformed.com/shopify`
3. Copy the webhook signing secret into the Worker as `wrangler secret put SHOPIFY_WEBHOOK_SECRET`

**Compliance:** The Worker only subscribes customers where `accepts_marketing: true`, satisfying CAN-SPAM and GDPR consent requirements.

---

## Data Flow

| Touch Point | Source Tag | Fields Captured |
|---|---|---|
| 7-Day Challenge form | `7day_challenge` (via `KIT_TAG_7DAY`) | email |
| Join the Formation footer | `join_formation` (via `KIT_TAG_JOIN`) | email |
| Shopify post-purchase | `shopify_buyer` (via `KIT_TAG_SHOPIFY`) | email, first_name |

All subscribers land on a single Kit list. Tags enable segmentation and targeted automations (e.g. separate welcome sequences for challenge signups vs. buyers).

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Empty email submitted | Client-side guard — `handleSubmit` returns early |
| Invalid email format | Worker returns `400`, frontend shows error state |
| Kit API unavailable | Worker returns `500`, frontend shows "Something went wrong. Try again." |
| Invalid Shopify HMAC | Worker returns `401`, request rejected |
| Customer `accepts_marketing: false` | Worker returns `200` but does not subscribe |

---

## Rate Limiting

Cloudflare rate limiting rules should be configured on the `POST /subscribe` endpoint to prevent list pollution and abuse. Recommended: max 5 requests per IP per minute. This is configured in the Cloudflare dashboard under Security → WAF → Rate Limiting, not in Worker code.

---

## Out of Scope

- Email template design (handled in Kit)
- Welcome sequence / automation flows (handled in Kit)
- Double opt-in (disabled — see Frontend Wiring section)
- Analytics / open rate tracking (Kit native)
