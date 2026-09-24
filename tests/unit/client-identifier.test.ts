import { afterEach, describe, expect, it } from 'vitest'
import { getClientIdentifier } from '../../src/lib/security/client-identifier'

function request(headers: HeadersInit) {
  return new Request('https://example.test/', { headers })
}

describe('client identifier', () => {
  afterEach(() => {
    delete process.env.VERCEL
  })

  it('prefers the platform header on Vercel', () => {
    process.env.VERCEL = '1'
    expect(getClientIdentifier(request({
      'x-vercel-forwarded-for': '203.0.113.10',
      'x-forwarded-for': '198.51.100.20',
    }))).toBe('203.0.113.10')
  })

  it('ignores the Vercel header outside Vercel and keeps the first forwarded address', () => {
    expect(getClientIdentifier(request({
      'x-vercel-forwarded-for': '203.0.113.10',
      'x-forwarded-for': ' 198.51.100.20, 192.0.2.1',
    }))).toBe('198.51.100.20')
  })

  it('returns null when no network header is present', () => {
    expect(getClientIdentifier(request({}))).toBeNull()
  })
})
