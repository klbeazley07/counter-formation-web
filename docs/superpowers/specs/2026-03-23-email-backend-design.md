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
  ├── POST /subscribe        — web form submissions
  └── POST /shopify          — Shopify order webhook (post-purchase)
                   │
                   ▼
  Kit (ConvertKit) API
  └── Single list, subscribers tagged by source
```

---

## Components

### 1. Cloudflare Worker (`worker.js`)

Deployed via Wrangler CLI to a subdomain `api.counterformed.com`.

#### Endpoints

**`POST /subscribe`**

Receives web form submissions from the React site.

- Request body: `{ email: string, source: "7day_challenge" | "join_formation" }`
- Validates email format; returns `400` if invalid
- Calls Kit API: `POST /v3/forms/:formId/subscribe` with `{ email, tags: [source] }`
- Returns `200 { success: true }` on success, `500` on Kit API failure
- CORS: only allows requests from `https://counterformed.com`

**`POST /shopify`**

Receives Shopify order webhooks.

- Verifies `X-Shopify-Hmac-SHA256` signature; returns `401` if invalid
- Only subscribes customers where `customer.accepts_marketing === true`
- Extracts `customer.email` and `customer.first_name`
- Calls Kit API with tag `shopify_buyer`
- Returns `200 { success: true }`

#### Environment Variables (Cloudflare Worker Secrets)

| Variable | Description |
|---|---|
| `KIT_API_KEY` | Kit secret API key |
| `KIT_FORM_ID` | Kit form ID (single form for all subscribers) |
| `SHOPIFY_WEBHOOK_SECRET` | Used to verify Shopify HMAC signatures |
| `ALLOWED_ORIGIN` | `https://counterformed.com` (CORS lockdown) |

---

### 2. Frontend Wiring (`src/App.jsx`)

Two existing placeholder `handleSubmit` functions — in `ChallengeSection` and `Footer` — get upgraded to real API calls. Changes are surgical: no new components, no structural changes.

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
    setSubmitted(true);
  } catch {
    setError("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};
```

**New Vite env variable:**
```
VITE_API_URL=https://api.counterformed.com
```

**UI states to add** (alongside existing `submitted` state):
- Loading: disable button, show spinner or "..." text
- Error: show inline error message below the form

---

### 3. Shopify Post-Purchase Webhook

No React code changes needed. Configuration is entirely in Shopify admin.

**Setup:**
1. Shopify Admin → Settings → Notifications → Webhooks
2. Create webhook: event `orders/paid`, URL `https://api.counterformed.com/shopify`
3. Copy the webhook signing secret into Cloudflare Worker secret `SHOPIFY_WEBHOOK_SECRET`

**Compliance:** The Worker only subscribes customers where `accepts_marketing: true`. This satisfies CAN-SPAM and GDPR consent requirements without additional work.

---

## Data Flow

| Touch Point | Source Tag | Fields Captured |
|---|---|---|
| 7-Day Challenge form | `7day_challenge` | email |
| Join the Formation footer | `join_formation` | email |
| Shopify post-purchase | `shopify_buyer` | email, first_name |

All subscribers land on a single Kit list. Tags enable segmentation and targeted automations (e.g. send different welcome sequences to challenge signups vs. buyers).

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Empty email submitted | Client-side guard — `handleSubmit` returns early |
| Invalid email format | Worker returns `400`, frontend shows error state |
| Kit API unavailable | Worker returns `500`, frontend shows "try again" message |
| Invalid Shopify HMAC | Worker returns `401`, request silently rejected |
| Customer `accepts_marketing: false` | Worker returns `200` but does not subscribe |

---

## Out of Scope

- Email template design (handled in Kit)
- Welcome sequence / automation flows (handled in Kit)
- Double opt-in configuration (configured in Kit per list settings)
- Analytics / open rate tracking (Kit native)
