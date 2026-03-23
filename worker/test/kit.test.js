import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { subscribeToForm, subscribeWithTag } from '../src/kit.js'

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
