# Email Backend Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire three email capture touch points (7-Day Challenge form, Join the Formation footer, Shopify post-purchase) into a single Kit (ConvertKit) subscriber list via a Cloudflare Worker API proxy.

**Architecture:** A Cloudflare Worker at `api.counterformed.com` acts as the sole backend. Two existing React form `handleSubmit` functions are upgraded from placeholders to async API calls. Shopify sends `orders/paid` webhooks directly to the Worker. All subscribers land on one Kit list, differentiated by source tags.

**Tech Stack:** Cloudflare Workers (Wrangler CLI), Kit (ConvertKit) v3 REST API, React/Vite (Cloudflare Pages), Vitest for Worker unit tests.

**Spec:** `docs/superpowers/specs/2026-03-23-email-backend-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `worker/src/index.js` | Create | Worker entry point — routing, CORS, request/response handling |
| `worker/src/kit.js` | Create | Kit API helpers — form subscribe, tag subscribe |
| `worker/src/shopify.js` | Create | Pure helpers — email validation, Shopify HMAC verification |
| `worker/test/kit.test.js` | Create | Unit tests for Kit API helpers |
| `worker/test/helpers.test.js` | Create | Unit tests for validateEmail + verifyShopifyHmac |
| `worker/test/index.test.js` | Create | Integration tests for Worker routes |
| `worker/wrangler.toml` | Create | Cloudflare Worker config — name, routes, custom domain |
| `worker/package.json` | Create | Worker project dependencies (wrangler, vitest) |
| `worker/vitest.config.js` | Create | Vitest config for ESM Worker code |
| `src/App.jsx` | Modify | Upgrade `ChallengeSection` and `Footer` handleSubmit to async API calls |

---

## Task 1: Kit Account Setup (Manual)

No code — gather the credentials the Worker will need.

- [ ] **Step 1: Create a Kit (ConvertKit) account**

  Go to https://kit.com and sign up for a free account (free up to 10,000 subscribers).

- [ ] **Step 2: Create a Form**

  In Kit dashboard: **Forms → New Form → Inline**. Name it `Counter Formation`. Save — you do not need to embed it anywhere.

  Note down the **Form ID** — it appears in the URL when editing the form: `app.kit.com/forms/**12345**/edit`.

- [ ] **Step 3: Create three Tags**

  In Kit dashboard: **Subscribers → Tags → Add a Tag**. Create these three tags exactly:
  - `7day_challenge`
  - `join_formation`
  - `shopify_buyer`

  To get each **Tag ID**: click the tag name — the ID is in the URL: `app.kit.com/tags/**67890**/subscribers`.

- [ ] **Step 4: Get your API Key**

  Kit dashboard: **Settings → Developer → API Secret**. Copy the secret key.

- [ ] **Step 5: Record all values**

  You'll need these when setting Worker secrets in Task 7:
  ```
  KIT_API_KEY     = <api secret>
  KIT_FORM_ID     = <form id>
  KIT_TAG_7DAY    = <7day_challenge tag id>
  KIT_TAG_JOIN    = <join_formation tag id>
  KIT_TAG_SHOPIFY = <shopify_buyer tag id>
  ```

---

## Task 2: Scaffold Worker Project

**Files:**
- Create: `worker/package.json`
- Create: `worker/wrangler.toml`
- Create: `worker/vitest.config.js`

- [ ] **Step 1: Create the worker directory and package.json**

  Create `worker/package.json`:
  ```json
  {
    "name": "counterformed-api",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "wrangler dev",
      "deploy": "wrangler deploy --env production",
      "test": "vitest run",
      "test:watch": "vitest"
    },
    "devDependencies": {
      "vitest": "^1.6.0",
      "wrangler": "^3.0.0"
    }
  }
  ```

- [ ] **Step 2: Install dependencies**

  ```bash
  cd worker
  npm install
  ```

  Expected: `node_modules/` created, no errors.

- [ ] **Step 3: Create wrangler.toml**

  Create `worker/wrangler.toml`:
  ```toml
  name = "counterformed-api"
  main = "src/index.js"
  compatibility_date = "2024-01-01"

  [env.production]
  routes = [{ pattern = "api.counterformed.com/*", custom_domain = true }]
  ```

- [ ] **Step 4: Create vitest.config.js**

  Create `worker/vitest.config.js`:
  ```js
  import { defineConfig } from 'vitest/config'

  export default defineConfig({
    test: {
      environment: 'node',
    },
  })
  ```

- [ ] **Step 5: Create placeholder source files**

  Create `worker/src/index.js`:
  ```js
  export default {
    async fetch(request, env) {
      return new Response('ok');
    },
  };
  ```

  Create `worker/src/kit.js`:
  ```js
  // Kit API helpers — implemented in Task 3
  ```

  Create `worker/src/shopify.js`:
  ```js
  // Validation + HMAC helpers — implemented in Task 4
  ```

- [ ] **Step 6: Verify wrangler dev starts**

  ```bash
  cd worker
  npm run dev
  ```

  Expected: `Ready on http://localhost:8787`. Stop with Ctrl+C.

- [ ] **Step 7: Commit**

  ```bash
  git add worker/
  git commit -m "feat: scaffold Cloudflare Worker project"
  ```

---

## Task 3: Kit API Helpers (TDD)

**Files:**
- Create: `worker/test/kit.test.js`
- Modify: `worker/src/kit.js`

- [ ] **Step 1: Write failing tests**

  Create `worker/test/kit.test.js`:
  ```js
  import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
  import { subscribeToForm, subscribeWithTag } from '../src/kit.js'

  const mockEnv = {
    KIT_API_KEY: 'test-api-key',
    KIT_FORM_ID: 'form123',
    KIT_TAG_7DAY: 'tag7day',
  }

  describe('subscribeToForm', () => {
    beforeEach(() => { vi.stubGlobal('fetch', vi.fn()) })
    afterEach(() => { vi.unstubAllGlobals() })

    it('posts to the Kit forms endpoint with correct payload', async () => {
      fetch.mockResolvedValue({ ok: true })
      await subscribeToForm('form123', 'user@example.com', 'test-api-key')
      expect(fetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/forms/form123/subscribe',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: 'test-api-key', email: 'user@example.com' }),
        })
      )
    })

    it('throws when Kit returns a non-ok response', async () => {
      fetch.mockResolvedValue({ ok: false, status: 500 })
      await expect(subscribeToForm('form123', 'user@example.com', 'test-api-key'))
        .rejects.toThrow('Kit form subscribe failed: 500')
    })
  })

  describe('subscribeWithTag', () => {
    beforeEach(() => { vi.stubGlobal('fetch', vi.fn()) })
    afterEach(() => { vi.unstubAllGlobals() })

    it('posts to the Kit tags endpoint with email and fields', async () => {
      fetch.mockResolvedValue({ ok: true })
      await subscribeWithTag('tag456', 'user@example.com', 'test-api-key', { first_name: 'Luke' })
      expect(fetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/tags/tag456/subscribe',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            api_key: 'test-api-key',
            email: 'user@example.com',
            fields: { first_name: 'Luke' },
          }),
        })
      )
    })

    it('posts with empty fields when none provided', async () => {
      fetch.mockResolvedValue({ ok: true })
      await subscribeWithTag('tag456', 'user@example.com', 'test-api-key')
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ api_key: 'test-api-key', email: 'user@example.com', fields: {} }),
        })
      )
    })

    it('throws when Kit returns a non-ok response', async () => {
      fetch.mockResolvedValue({ ok: false, status: 422 })
      await expect(subscribeWithTag('tag456', 'user@example.com', 'test-api-key'))
        .rejects.toThrow('Kit tag subscribe failed: 422')
    })
  })
  ```

- [ ] **Step 2: Run tests — verify they fail**

  ```bash
  cd worker && npm test
  ```

  Expected: FAIL — "subscribeToForm is not a function" (or similar).

- [ ] **Step 3: Implement kit.js**

  Replace `worker/src/kit.js` with:
  ```js
  const KIT_API = 'https://api.convertkit.com/v3';

  export async function subscribeToForm(formId, email, apiKey) {
    const res = await fetch(`${KIT_API}/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    });
    if (!res.ok) throw new Error(`Kit form subscribe failed: ${res.status}`);
  }

  export async function subscribeWithTag(tagId, email, apiKey, fields = {}) {
    const res = await fetch(`${KIT_API}/tags/${tagId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email, fields }),
    });
    if (!res.ok) throw new Error(`Kit tag subscribe failed: ${res.status}`);
  }
  ```

- [ ] **Step 4: Run tests — verify they pass**

  ```bash
  cd worker && npm test
  ```

  Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

  ```bash
  git add worker/src/kit.js worker/test/kit.test.js
  git commit -m "feat: add Kit API helpers with tests"
  ```

---

## Task 4: Email Validation + Shopify HMAC Helpers (TDD)

**Files:**
- Create: `worker/test/helpers.test.js`
- Modify: `worker/src/shopify.js`

Note: `verifyShopifyHmac` uses `globalThis.crypto.subtle` (Web Crypto API). This is available natively in Node.js 18+, which is what vitest runs on — no polyfill needed.

- [ ] **Step 1: Write failing tests**

  Create `worker/test/helpers.test.js`:
  ```js
  import { describe, it, expect } from 'vitest'
  import { createHmac } from 'crypto'
  import { validateEmail, verifyShopifyHmac } from '../src/shopify.js'

  // Helper: generate a valid Shopify-style HMAC using Node's crypto module
  function makeShopifyHmac(body, secret) {
    return createHmac('sha256', secret).update(body).digest('base64')
  }

  describe('validateEmail', () => {
    it('accepts a standard email', () => {
      expect(validateEmail('user@example.com')).toBe(true)
    })
    it('accepts a subdomain email', () => {
      expect(validateEmail('user@mail.example.com')).toBe(true)
    })
    it('rejects a string with no @', () => {
      expect(validateEmail('notanemail')).toBe(false)
    })
    it('rejects a string with no TLD', () => {
      expect(validateEmail('user@example')).toBe(false)
    })
    it('rejects an empty string', () => {
      expect(validateEmail('')).toBe(false)
    })
    it('rejects null', () => {
      expect(validateEmail(null)).toBe(false)
    })
    it('rejects undefined', () => {
      expect(validateEmail(undefined)).toBe(false)
    })
  })

  describe('verifyShopifyHmac', () => {
    const secret = 'my-webhook-secret'
    const body = JSON.stringify({ id: 1, customer: { email: 'buyer@example.com' } })

    it('returns true for a correct HMAC', async () => {
      const hmac = makeShopifyHmac(body, secret)
      expect(await verifyShopifyHmac(body, secret, hmac)).toBe(true)
    })

    it('returns false when body has been tampered with', async () => {
      const hmac = makeShopifyHmac(body, secret)
      expect(await verifyShopifyHmac('{"tampered":true}', secret, hmac)).toBe(false)
    })

    it('returns false when the secret is wrong', async () => {
      const hmac = makeShopifyHmac(body, 'wrong-secret')
      expect(await verifyShopifyHmac(body, secret, hmac)).toBe(false)
    })

    it('returns false when the header HMAC is an empty string', async () => {
      expect(await verifyShopifyHmac(body, secret, '')).toBe(false)
    })
  })
  ```

- [ ] **Step 2: Run tests — verify they fail**

  ```bash
  cd worker && npm test
  ```

  Expected: FAIL — "validateEmail is not a function".

- [ ] **Step 3: Implement shopify.js**

  Replace `worker/src/shopify.js` with:
  ```js
  export function validateEmail(email) {
    return typeof email === 'string' && /.+@.+\..+/.test(email);
  }

  export async function verifyShopifyHmac(rawBody, secret, headerHmac) {
    if (!headerHmac) return false;
    const encoder = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signature = await globalThis.crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(rawBody)
    );
    const computed = btoa(String.fromCharCode(...new Uint8Array(signature)));

    // Constant-time comparison to prevent timing attacks
    const a = encoder.encode(computed);
    const b = encoder.encode(headerHmac);
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    return diff === 0;
  }
  ```

- [ ] **Step 4: Run tests — verify they pass**

  ```bash
  cd worker && npm test
  ```

  Expected: all 11 tests PASS.

- [ ] **Step 5: Commit**

  ```bash
  git add worker/src/shopify.js worker/test/helpers.test.js
  git commit -m "feat: add email validation and Shopify HMAC helpers with tests"
  ```

---

## Task 5: Worker Entry Point + /subscribe Route (TDD)

**Files:**
- Create: `worker/test/index.test.js`
- Modify: `worker/src/index.js`

- [ ] **Step 1: Write failing tests for /subscribe**

  Create `worker/test/index.test.js`:
  ```js
  import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
  import worker from '../src/index.js'

  const mockEnv = {
    KIT_API_KEY: 'test-key',
    KIT_FORM_ID: 'form123',
    KIT_TAG_7DAY: 'tag7',
    KIT_TAG_JOIN: 'tagJ',
    KIT_TAG_SHOPIFY: 'tagS',
    SHOPIFY_WEBHOOK_SECRET: 'shopify-secret',
    ALLOWED_ORIGIN: 'https://counterformed.com',
  }

  function post(path, body, headers = {}) {
    return new Request(`https://api.counterformed.com${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
    })
  }

  describe('POST /subscribe', () => {
    beforeEach(() => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true })) })
    afterEach(() => { vi.unstubAllGlobals() })

    it('returns 200 and success for a valid 7day_challenge submission', async () => {
      const res = await worker.fetch(post('/subscribe', { email: 'a@b.com', source: '7day_challenge' }), mockEnv)
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })

    it('returns 200 and success for a valid join_formation submission', async () => {
      const res = await worker.fetch(post('/subscribe', { email: 'a@b.com', source: 'join_formation' }), mockEnv)
      expect(res.status).toBe(200)
    })

    it('returns 400 for a missing email', async () => {
      const res = await worker.fetch(post('/subscribe', { source: '7day_challenge' }), mockEnv)
      expect(res.status).toBe(400)
    })

    it('returns 400 for an invalid email', async () => {
      const res = await worker.fetch(post('/subscribe', { email: 'notanemail', source: '7day_challenge' }), mockEnv)
      expect(res.status).toBe(400)
    })

    it('returns 400 for an unknown source', async () => {
      const res = await worker.fetch(post('/subscribe', { email: 'a@b.com', source: 'unknown' }), mockEnv)
      expect(res.status).toBe(400)
    })

    it('returns 500 when the Kit API fails', async () => {
      fetch.mockResolvedValue({ ok: false, status: 500 })
      const res = await worker.fetch(post('/subscribe', { email: 'a@b.com', source: '7day_challenge' }), mockEnv)
      expect(res.status).toBe(500)
    })

    it('includes CORS header on 200 response', async () => {
      const res = await worker.fetch(post('/subscribe', { email: 'a@b.com', source: '7day_challenge' }), mockEnv)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://counterformed.com')
    })

    it('includes CORS header on 400 response', async () => {
      const res = await worker.fetch(post('/subscribe', { email: 'bad', source: '7day_challenge' }), mockEnv)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://counterformed.com')
    })

    it('responds to OPTIONS preflight with 204', async () => {
      const req = new Request('https://api.counterformed.com/subscribe', { method: 'OPTIONS' })
      const res = await worker.fetch(req, mockEnv)
      expect(res.status).toBe(204)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://counterformed.com')
    })

    it('calls Kit tag endpoint with correct tag ID for 7day_challenge', async () => {
      await worker.fetch(post('/subscribe', { email: 'a@b.com', source: '7day_challenge' }), mockEnv)
      expect(fetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/tags/tag7/subscribe',
        expect.any(Object)
      )
    })

    it('calls Kit form endpoint for list membership', async () => {
      await worker.fetch(post('/subscribe', { email: 'a@b.com', source: '7day_challenge' }), mockEnv)
      expect(fetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/forms/form123/subscribe',
        expect.any(Object)
      )
    })
  })
  ```

- [ ] **Step 2: Run tests — verify they fail**

  ```bash
  cd worker && npm test
  ```

  Expected: FAIL — tests fail because `index.js` just returns `'ok'`.

- [ ] **Step 3: Implement the Worker entry point with /subscribe**

  Replace `worker/src/index.js`:
  ```js
  import { subscribeToForm, subscribeWithTag } from './kit.js';
  import { validateEmail } from './shopify.js';

  function corsHeaders(origin) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
  }

  function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      const origin = env.ALLOWED_ORIGIN;

      // CORS preflight for /subscribe only
      if (request.method === 'OPTIONS' && url.pathname === '/subscribe') {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
      }

      if (request.method === 'POST' && url.pathname === '/subscribe') {
        const body = await request.json().catch(() => null);
        if (!body || !validateEmail(body.email)) {
          return json({ error: 'Invalid email' }, 400, corsHeaders(origin));
        }

        const tagMap = {
          '7day_challenge': env.KIT_TAG_7DAY,
          'join_formation': env.KIT_TAG_JOIN,
        };
        const tagId = tagMap[body.source];
        if (!tagId) {
          return json({ error: 'Invalid source' }, 400, corsHeaders(origin));
        }

        try {
          await Promise.all([
            subscribeWithTag(tagId, body.email, env.KIT_API_KEY),
            subscribeToForm(env.KIT_FORM_ID, body.email, env.KIT_API_KEY),
          ]);
          return json({ success: true }, 200, corsHeaders(origin));
        } catch {
          return json({ error: 'Server error' }, 500, corsHeaders(origin));
        }
      }

      return json({ error: 'Not found' }, 404);
    },
  };
  ```

- [ ] **Step 4: Run tests — verify they pass**

  ```bash
  cd worker && npm test
  ```

  Expected: all /subscribe tests PASS. The /shopify tests will be added next.

- [ ] **Step 5: Commit**

  ```bash
  git add worker/src/index.js worker/test/index.test.js
  git commit -m "feat: implement Worker /subscribe route with CORS and Kit integration"
  ```

---

## Task 6: Worker /shopify Route (TDD)

**Files:**
- Modify: `worker/test/index.test.js` (add /shopify tests)
- Modify: `worker/src/index.js` (add /shopify handler)

- [ ] **Step 1: Add /shopify tests**

  Add this block at the end of `worker/test/index.test.js` (after the closing `})` of the /subscribe describe block):

  ```js
  import { createHmac } from 'crypto'

  function makeHmac(body, secret) {
    return createHmac('sha256', secret).update(body).digest('base64')
  }

  describe('POST /shopify', () => {
    const secret = mockEnv.SHOPIFY_WEBHOOK_SECRET
    const orderWithConsent = JSON.stringify({
      customer: { email: 'buyer@example.com', first_name: 'Luke', accepts_marketing: true }
    })
    const orderWithoutConsent = JSON.stringify({
      customer: { email: 'buyer@example.com', first_name: 'Luke', accepts_marketing: false }
    })

    function shopifyPost(body, hmacOverride) {
      const hmac = hmacOverride ?? makeHmac(body, secret)
      return new Request('https://api.counterformed.com/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Hmac-SHA256': hmac,
        },
        body,
      })
    }

    beforeEach(() => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true })) })
    afterEach(() => { vi.unstubAllGlobals() })

    it('returns 200 and subscribes buyer when accepts_marketing is true', async () => {
      const res = await worker.fetch(shopifyPost(orderWithConsent), mockEnv)
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })

    it('calls Kit tag endpoint with shopify_buyer tag', async () => {
      await worker.fetch(shopifyPost(orderWithConsent), mockEnv)
      expect(fetch).toHaveBeenCalledWith(
        'https://api.convertkit.com/v3/tags/tagS/subscribe',
        expect.objectContaining({
          body: expect.stringContaining('buyer@example.com'),
        })
      )
    })

    it('passes first_name to Kit as a subscriber field', async () => {
      await worker.fetch(shopifyPost(orderWithConsent), mockEnv)
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('Luke'),
        })
      )
    })

    it('returns 200 but does NOT subscribe when accepts_marketing is false', async () => {
      const res = await worker.fetch(shopifyPost(orderWithoutConsent), mockEnv)
      expect(res.status).toBe(200)
      expect(fetch).not.toHaveBeenCalled()
    })

    it('returns 401 when HMAC signature is wrong', async () => {
      const res = await worker.fetch(shopifyPost(orderWithConsent, 'bad-signature'), mockEnv)
      expect(res.status).toBe(401)
    })

    it('returns 401 when HMAC header is missing', async () => {
      const req = new Request('https://api.counterformed.com/shopify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: orderWithConsent,
      })
      const res = await worker.fetch(req, mockEnv)
      expect(res.status).toBe(401)
    })

    it('does NOT send CORS headers (server-to-server endpoint)', async () => {
      const res = await worker.fetch(shopifyPost(orderWithConsent), mockEnv)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBeNull()
    })
  })
  ```

- [ ] **Step 2: Run tests — verify /shopify tests fail**

  ```bash
  cd worker && npm test
  ```

  Expected: /shopify tests FAIL, all previous tests still PASS.

- [ ] **Step 3: Add /shopify handler to index.js**

  Add the import at the top of `worker/src/index.js` (update the existing import line):
  ```js
  import { subscribeToForm, subscribeWithTag } from './kit.js';
  import { validateEmail, verifyShopifyHmac } from './shopify.js';
  ```

  Add this block inside the `fetch` handler, after the `/subscribe` block and before the final 404 return:
  ```js
      if (request.method === 'POST' && url.pathname === '/shopify') {
        const rawBody = await request.text();
        const headerHmac = request.headers.get('X-Shopify-Hmac-SHA256');
        const valid = await verifyShopifyHmac(rawBody, env.SHOPIFY_WEBHOOK_SECRET, headerHmac);
        if (!valid) return json({ error: 'Unauthorized' }, 401);

        const order = JSON.parse(rawBody);
        if (!order.customer?.accepts_marketing) {
          return json({ success: true }); // consent not given — no-op
        }

        try {
          await subscribeWithTag(
            env.KIT_TAG_SHOPIFY,
            order.customer.email,
            env.KIT_API_KEY,
            { first_name: order.customer.first_name }
          );
          return json({ success: true });
        } catch {
          return json({ error: 'Server error' }, 500);
        }
      }
  ```

- [ ] **Step 4: Run all tests — verify they all pass**

  ```bash
  cd worker && npm test
  ```

  Expected: all tests PASS (approximately 25 total).

- [ ] **Step 5: Commit**

  ```bash
  git add worker/src/index.js worker/test/index.test.js
  git commit -m "feat: implement Worker /shopify route with HMAC verification"
  ```

---

## Task 7: Deploy Worker + Set Secrets

- [ ] **Step 1: Authenticate with Cloudflare**

  ```bash
  cd worker
  npx wrangler login
  ```

  Expected: browser opens, log in with your Cloudflare account.

- [ ] **Step 2: Set all Worker secrets**

  Run each command and paste the value when prompted:
  ```bash
  npx wrangler secret put KIT_API_KEY --env production
  npx wrangler secret put KIT_FORM_ID --env production
  npx wrangler secret put KIT_TAG_7DAY --env production
  npx wrangler secret put KIT_TAG_JOIN --env production
  npx wrangler secret put KIT_TAG_SHOPIFY --env production
  npx wrangler secret put ALLOWED_ORIGIN --env production
  ```

  For `ALLOWED_ORIGIN`, enter: `https://counterformed.com`

  Note: Skip `SHOPIFY_WEBHOOK_SECRET` for now — you won't have this value until Task 11 Step 1 (Shopify shows it when you create the webhook). You'll set it in Task 11 Step 2.

- [ ] **Step 3: Deploy the Worker**

  ```bash
  cd worker
  npm run deploy
  ```

  Expected output includes: `Published counterformed-api` and the custom domain `api.counterformed.com`.

  If the custom domain isn't automatically activated: go to Cloudflare dashboard → Workers → counterformed-api → Triggers → Custom Domains → Add `api.counterformed.com`.

- [ ] **Step 4: Smoke test the live Worker**

  ```bash
  curl -X POST https://api.counterformed.com/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"test+smoke@example.com","source":"7day_challenge"}'
  ```

  Expected: `{"success":true}`

  Then check Kit dashboard → Subscribers — confirm `test+smoke@example.com` appears with the `7day_challenge` tag.

- [ ] **Step 5: Commit**

  ```bash
  git add worker/
  git commit -m "chore: deploy Worker to api.counterformed.com"
  ```

---

## Task 8: Wire ChallengeSection Frontend (TDD)

**Files:**
- Modify: `src/App.jsx:519-584` (ChallengeSection component)

- [ ] **Step 1: Create .env.local for local development**

  Create `.env.local` in the repo root (already gitignored by `*.local`):
  ```
  VITE_API_URL=http://localhost:8787
  ```

- [ ] **Step 2: Update ChallengeSection state and handleSubmit**

  In `src/App.jsx`, replace lines 521–528 (the `ChallengeSection` state and `handleSubmit`):

  **Replace:**
  ```js
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
  };
  ```

  **With:**
  ```js
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "7day_challenge" }),
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

- [ ] **Step 3: Update ChallengeSection button to show loading state**

  In `src/App.jsx`, update the Begin button (around line 563) to disable during loading:

  **Replace:**
  ```jsx
  <button onClick={handleSubmit}
    className="px-8 py-4 bg-[#C9A84C] text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#FAF8F5] transition-all whitespace-nowrap flex items-center gap-2 justify-center">
    Begin <ArrowRight size={13} />
  </button>
  ```

  **With:**
  ```jsx
  <button onClick={handleSubmit} disabled={loading}
    className="px-8 py-4 bg-[#C9A84C] text-black rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-[#FAF8F5] transition-all whitespace-nowrap flex items-center gap-2 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
    {loading ? "..." : <><span>Begin</span> <ArrowRight size={13} /></>}
  </button>
  ```

- [ ] **Step 4: Add error display to ChallengeSection**

  After the closing `</div>` of the input+button row (around line 567), add the error display:

  **After:**
  ```jsx
          </div>
        ) : (
  ```

  **Insert before the `) : (`:**
  ```jsx
          {error && (
            <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-red-400">{error}</p>
          )}
          </div>
        ) : (
  ```

  The full block after the input row should look like:
  ```jsx
          </div>
          {error && (
            <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-red-400">{error}</p>
          )}
        ) : (
  ```

- [ ] **Step 5: Manual test locally**

  Start the Wrangler dev server in one terminal:
  ```bash
  cd worker && npm run dev
  ```

  Start the Vite dev server in another:
  ```bash
  npm run dev
  ```

  Open `http://localhost:5173`, scroll to the 7-Day Challenge section, and:
  - Submit a valid email → expect success state with "Begin Now" link
  - Refresh and submit an invalid email → expect 400 response → error message shown

- [ ] **Step 6: Commit**

  ```bash
  git add src/App.jsx
  git commit -m "feat: wire ChallengeSection email form to /subscribe API"
  ```

---

## Task 9: Wire Footer / Join the Formation Frontend

**Files:**
- Modify: `src/App.jsx:794-843` (Footer component)

- [ ] **Step 1: Update Footer state and handleSubmit**

  In `src/App.jsx`, replace lines 795–801 (the `Footer` state and `handleSubmit`):

  **Replace:**
  ```js
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
  };
  ```

  **With:**
  ```js
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "join_formation" }),
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

- [ ] **Step 2: Update Footer Join button to show loading state**

  In `src/App.jsx`, update the Join button (around line 833):

  **Replace:**
  ```jsx
  <button onClick={handleSubmit}
    className="px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap border hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C]"
    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: C.ivory }}>
    Join
  </button>
  ```

  **With:**
  ```jsx
  <button onClick={handleSubmit} disabled={loading}
    className="px-8 py-4 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap border hover:bg-[#C9A84C] hover:text-black hover:border-[#C9A84C] disabled:opacity-50 disabled:cursor-not-allowed"
    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)", color: C.ivory }}>
    {loading ? "..." : "Join"}
  </button>
  ```

- [ ] **Step 3: Add error display to Footer**

  After the closing `</div>` of the input+button row in the Footer (around line 838), insert the error display:

  ```jsx
          </div>
          {error && (
            <p className="mt-3 text-[9px] uppercase tracking-[0.25em] text-red-400">{error}</p>
          )}
        ) : (
  ```

- [ ] **Step 4: Manual test locally**

  With both dev servers running (from Task 8), scroll to the footer "Join the Formation" section and:
  - Submit a valid email → success message: "You're in. Weekly field notes incoming."
  - Check Kit dashboard → subscriber appears with `join_formation` tag

- [ ] **Step 5: Commit**

  ```bash
  git add src/App.jsx
  git commit -m "feat: wire Footer Join the Formation form to /subscribe API"
  ```

---

## Task 10: Set Cloudflare Pages Env Var + Deploy Frontend

- [ ] **Step 1: Add VITE_API_URL to Cloudflare Pages**

  1. Go to Cloudflare dashboard → Pages → your counterformed.com project
  2. Settings → Environment Variables → Production → Add variable:
     - Name: `VITE_API_URL`
     - Value: `https://api.counterformed.com`
  3. Save

- [ ] **Step 2: Deploy the frontend**

  Trigger a new deployment (push to main or redeploy from dashboard):
  ```bash
  git push origin main
  ```

- [ ] **Step 3: Smoke test on production**

  Once deployed, open https://counterformed.com:
  - Submit an email in the 7-Day Challenge section → success state appears
  - Submit an email in the footer → success state appears
  - Check Kit dashboard → both subscribers appear with correct tags

---

## Task 11: Configure Shopify Post-Purchase Webhook

- [ ] **Step 1: Create the webhook in Shopify admin**

  1. Go to https://admin.shopify.com → your shop → Settings → Notifications → Webhooks
  2. Click **Create webhook**:
     - Event: `Order payment` (i.e. `orders/paid`)
     - Format: JSON
     - URL: `https://api.counterformed.com/shopify`
     - Webhook API version: latest stable
  3. Save — Shopify shows the **signing secret** on this screen
  4. Copy the signing secret immediately (shown once)

- [ ] **Step 2: Set the Shopify webhook secret on the Worker**

  ```bash
  cd worker
  npx wrangler secret put SHOPIFY_WEBHOOK_SECRET --env production
  ```

  Paste the signing secret from Step 1.

- [ ] **Step 3: Redeploy the Worker to pick up the new secret**

  ```bash
  cd worker && npm run deploy
  ```

- [ ] **Step 4: Test with a Shopify test order**

  In Shopify admin, place a test order (Shopify has a Bogus Gateway payment method for this). Ensure the test customer account has marketing emails opted in.

  After the order completes:
  - Check Kit dashboard → subscriber appears with `shopify_buyer` tag and `first_name` populated

---

## Task 12: Configure Cloudflare WAF Rate Limiting

No code changes — dashboard configuration only.

- [ ] **Step 1: Create a rate limiting rule**

  1. Cloudflare dashboard → your domain (`counterformed.com`) → Security → WAF → Rate Limiting Rules
  2. Click **Create rule**:
     - Name: `Email subscribe rate limit`
     - Field: `URI Path` equals `/subscribe` AND `Request Method` equals `POST`
     - Rate: **5 requests per 60 seconds** per IP
     - Action: **Block** (returns 429)
  3. Save and deploy

- [ ] **Step 2: Verify the rule is active**

  Check the rule shows as **Active** in the WAF dashboard. No code change or redeploy needed.

---

## Done

All three email capture touch points are live:
- ✅ 7-Day Challenge form → Kit `7day_challenge` tag
- ✅ Join the Formation footer → Kit `join_formation` tag
- ✅ Shopify post-purchase (accepts_marketing only) → Kit `shopify_buyer` tag
- ✅ Rate limiting on `/subscribe` endpoint
