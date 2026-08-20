import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { checkDistributedRateLimit } from '@/lib/security/rate-limit'
import { GET } from '../../src/app/api/geocode/route'

vi.mock('@/lib/security/rate-limit', () => ({
  checkDistributedRateLimit: vi.fn(),
}))

const mockedRateLimit = vi.mocked(checkDistributedRateLimit)

function request(headers?: HeadersInit) {
  return new NextRequest('https://example.test/api/geocode?lat=48.86&lon=2.35', { headers })
}

describe('geocode route rate limiting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.VERCEL
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ address: { city: 'Paris' } }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })))
  })

  it('fails closed when the distributed limiter is unavailable', async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 60, provider: 'upstash', unavailable: true })

    const response = await GET(request())

    expect(response.status).toBe(503)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('prioritizes the Vercel client header over other forwarding headers', async () => {
    process.env.VERCEL = '1'
    mockedRateLimit.mockResolvedValue({ allowed: true, remaining: 19, retryAfter: 0, provider: 'upstash', unavailable: false })

    const response = await GET(request({
      'x-vercel-forwarded-for': '203.0.113.10',
      'x-forwarded-for': '198.51.100.20',
      'x-real-ip': '192.0.2.30',
    }))

    expect(response.status).toBe(200)
    expect(mockedRateLimit).toHaveBeenCalledWith('geocode:203.0.113.10', {
      namespace: 'geocode',
      limit: 20,
      windowSeconds: 60,
    })
  })

  it('normalizes a forwarded IP list to its first entry', async () => {
    process.env.VERCEL = '1'
    mockedRateLimit.mockResolvedValue({ allowed: true, remaining: 19, retryAfter: 0, provider: 'upstash', unavailable: false })

    await GET(request({ 'x-vercel-forwarded-for': ' 203.0.113.11, 198.51.100.21 ' }))

    expect(mockedRateLimit).toHaveBeenCalledWith('geocode:203.0.113.11', expect.any(Object))
  })

  it('uses x-forwarded-for on Vercel when the Vercel-specific header is absent', async () => {
    process.env.VERCEL = '1'
    mockedRateLimit.mockResolvedValue({ allowed: true, remaining: 19, retryAfter: 0, provider: 'upstash', unavailable: false })

    await GET(request({ 'x-forwarded-for': '203.0.113.12, 198.51.100.22' }))

    expect(mockedRateLimit).toHaveBeenCalledWith('geocode:203.0.113.12', expect.any(Object))
  })

  it('fails closed on Vercel when no network identifier is available', async () => {
    process.env.VERCEL = '1'

    const response = await GET(request())

    expect(response.status).toBe(503)
    expect(mockedRateLimit).not.toHaveBeenCalled()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('uses the explicit local fallback outside Vercel', async () => {
    mockedRateLimit.mockResolvedValue({ allowed: true, remaining: 19, retryAfter: 0, provider: 'local', unavailable: false })

    const response = await GET(request())

    expect(response.status).toBe(200)
    expect(mockedRateLimit).toHaveBeenCalledWith('geocode:local-anonymous', {
      namespace: 'geocode',
      limit: 20,
      windowSeconds: 60,
    })
  })

  it('returns 429 when the geocode quota is exhausted', async () => {
    mockedRateLimit.mockResolvedValue({ allowed: false, remaining: 0, retryAfter: 17, provider: 'upstash', unavailable: false })

    const response = await GET(request())

    expect(response.status).toBe(429)
    expect(response.headers.get('retry-after')).toBe('17')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('keeps valid requests working under the configured quota', async () => {
    mockedRateLimit.mockResolvedValue({ allowed: true, remaining: 19, retryAfter: 0, provider: 'local', unavailable: false })

    const response = await GET(request())

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ city: 'Paris', latitude: 48.86, longitude: 2.35 })
    expect(mockedRateLimit).toHaveBeenCalledWith(expect.any(String), {
      namespace: 'geocode',
      limit: 20,
      windowSeconds: 60,
    })
  })
})