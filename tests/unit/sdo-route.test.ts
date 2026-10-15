import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { checkDistributedRateLimit } from '@/lib/security/rate-limit'
import { GET } from '../../src/app/api/sdo/route'

vi.mock('@/lib/security/rate-limit', () => ({ checkDistributedRateLimit: vi.fn() }))

const allowed = { allowed: true, remaining: 29, retryAfter: 0, provider: 'upstash', unavailable: false } as const
const call = (target?: string) => {
  const url = new URL('https://example.test/api/sdo')
  if (target) url.searchParams.set('url', target)
  return GET(new NextRequest(url))
}
const GOOD = 'https://sdo.gsfc.nasa.gov/assets/img/latest/latest_512_0193.jpg'

describe('sdo proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(checkDistributedRateLimit).mockResolvedValue(allowed)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), { headers: { 'content-type': 'image/jpeg' } })))
  })

  it('proxies an allowed image', async () => {
    const response = await call(GOOD)
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('image/jpeg')
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ redirect: 'error' })
  })

  it.each([
    ['another host', 'https://evil.example/assets/img/latest/a.jpg'],
    ['a lookalike host', 'https://sdo.gsfc.nasa.gov.evil.example/assets/img/latest/a.jpg'],
    ['http', 'http://sdo.gsfc.nasa.gov/assets/img/latest/a.jpg'],
    ['another path', 'https://sdo.gsfc.nasa.gov/other/a.jpg'],
    ['path traversal', 'https://sdo.gsfc.nasa.gov/assets/img/latest/../../secret'],
    ['garbage', 'not a url'],
  ])('refuses %s', async (_label, target) => {
    expect((await call(target)).status).toBe(403)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('refuses to share one anonymous quota on Vercel without a client address', async () => {
    process.env.VERCEL = '1'
    try {
      expect((await call(GOOD)).status).toBe(503)
      expect(checkDistributedRateLimit).not.toHaveBeenCalled()
    } finally {
      delete process.env.VERCEL
    }
  })

  it('requires the url parameter', async () => {
    expect((await call()).status).toBe(400)
  })

  it('refuses a non-image response', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('<html>', { headers: { 'content-type': 'text/html' } }))
    expect((await call(GOOD)).status).toBe(502)
  })

  it('refuses an oversized image, declared or not', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response('x', { headers: { 'content-type': 'image/png', 'content-length': String(11 * 1024 * 1024) } }))
    expect((await call(GOOD)).status).toBe(413)
    vi.mocked(fetch).mockResolvedValueOnce(new Response(new Uint8Array(11 * 1024 * 1024), { headers: { 'content-type': 'image/png' } }))
    expect((await call(GOOD)).status).toBe(413)
  })

  it('fails closed when the limiter is unavailable and answers 429 when exceeded', async () => {
    vi.mocked(checkDistributedRateLimit).mockResolvedValueOnce({ ...allowed, allowed: false, unavailable: true })
    expect((await call(GOOD)).status).toBe(503)
    vi.mocked(checkDistributedRateLimit).mockResolvedValueOnce({ ...allowed, allowed: false, retryAfter: 12 })
    const limited = await call(GOOD)
    expect(limited.status).toBe(429)
    expect(limited.headers.get('retry-after')).toBe('12')
    expect(fetch).not.toHaveBeenCalled()
  })
})
