import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { checkDistributedRateLimit } from '@/lib/security/rate-limit'
import { POST } from '../../src/app/api/gemini/route'

vi.mock('@/lib/security/rate-limit', () => ({ checkDistributedRateLimit: vi.fn() }))

const allowed = { allowed: true, remaining: 7, retryAfter: 0, provider: 'upstash', unavailable: false } as const
const post = (body: unknown, headers: HeadersInit = {}) =>
  POST(new NextRequest('https://example.test/api/gemini', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body), headers }))

const geminiReply = (text: string) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] } }] }), { status: 200 })

describe('gemini route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.GEMINI_API_KEY
    vi.mocked(checkDistributedRateLimit).mockResolvedValue(allowed)
    vi.stubGlobal('fetch', vi.fn())
  })

  it('answers 503 when the limiter is unavailable and 429 when exceeded', async () => {
    vi.mocked(checkDistributedRateLimit).mockResolvedValueOnce({ ...allowed, allowed: false, unavailable: true })
    expect((await post({ question: 'Pourquoi ?' })).status).toBe(503)
    vi.mocked(checkDistributedRateLimit).mockResolvedValueOnce({ ...allowed, allowed: false, retryAfter: 30 })
    const limited = await post({ question: 'Pourquoi ?' })
    expect(limited.status).toBe(429)
    expect(limited.headers.get('retry-after')).toBe('30')
  })

  it.each([
    ['invalid JSON', '{nope', 400],
    ['an array body', [], 400],
    ['an empty question', { question: '   ' }, 400],
    ['a too long question', { question: 'a'.repeat(1001) }, 400],
    ['an oversized body', { question: 'ok', pad: 'x'.repeat(33_000) }, 413],
  ])('rejects %s', async (_label, body, status) => {
    expect((await post(body)).status).toBe(status)
  })

  it('blocks personal information before any call to Gemini', async () => {
    process.env.GEMINI_API_KEY = 'key'
    const response = await post({ question: 'Mon email est lea@example.com' })
    expect(response.status).toBe(400)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('also blocks personal information hidden in the history', async () => {
    process.env.GEMINI_API_KEY = 'key'
    const response = await post({ question: 'Et Mars ?', history: [{ role: 'user', text: 'je m’appelle Léa' }] })
    expect(response.status).toBe(400)
  })

  it('uses the local fallback without an API key', async () => {
    const response = await post({ question: 'Parle-moi du Soleil' })
    const data = await response.json()
    expect(response.headers.get('x-solarbot-mode')).toBe('fallback')
    expect(data.degraded).toBe(true)
    expect(data.text).toContain('Soleil')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('answers in English when asked to', async () => {
    const response = await post({ question: 'Tell me about the Moon' }, { 'x-solarscope-locale': 'en' })
    expect((await response.json()).text).toContain('Moon')
  })

  it('sends alternating turns starting with the user, and the key in a header', async () => {
    process.env.GEMINI_API_KEY = 'secret-key'
    vi.mocked(fetch).mockResolvedValue(geminiReply('Réponse [1]'))
    const response = await post({
      question: 'Et Mars ?',
      history: [
        { role: 'bot', text: 'orphan' },
        { role: 'user', text: 'Et le Soleil ?' },
        { role: 'bot', text: 'Une étoile.' },
        { role: 'user', text: 'dangling' },
      ],
    })
    const data = await response.json()
    expect(data).toMatchObject({ text: 'Réponse [1]', degraded: false })

    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(String(url)).not.toContain('secret-key')
    expect((init?.headers as Record<string, string>)['x-goog-api-key']).toBe('secret-key')
    const sent = JSON.parse(String(init?.body)) as { contents: Array<{ role: string }> }
    expect(sent.contents.map((turn) => turn.role)).toEqual(['user', 'model', 'user'])
  })

  it('falls back when Gemini fails', async () => {
    process.env.GEMINI_API_KEY = 'secret-key'
    vi.mocked(fetch).mockResolvedValue(new Response('boom', { status: 400 }))
    const response = await post({ question: 'Parle-moi de Mars' })
    expect(response.status).toBe(200)
    expect((await response.json()).degraded).toBe(true)
  })
})
