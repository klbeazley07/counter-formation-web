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
