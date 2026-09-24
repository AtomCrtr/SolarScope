import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { parseLaunchProvider } from '../../src/lib/data/space-data'
import { GET } from '../../src/app/api/launches/route'

function request(query: string) {
  return new NextRequest(`https://example.test/api/launches${query}`)
}

describe('launches route', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ results: [] }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
  })

  it('only accepts known providers, case-insensitively', () => {
    expect(parseLaunchProvider('SpaceX')).toBe('SpaceX')
    expect(parseLaunchProvider(' spacex ')).toBe('SpaceX')
    expect(parseLaunchProvider('audit123')).toBeNull()
    expect(parseLaunchProvider(null)).toBeNull()
  })

  it('rejects unknown providers without calling Launch Library', async () => {
    const response = await GET(request('?provider=audit123'))

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('requests the same upstream page whatever the limit, so the cache is shared', async () => {
    await GET(request('?limit=3'))
    await GET(request('?limit=8'))

    const urls = fetchMock.mock.calls.map(([url]) => String(url))
    expect(urls[0]).toBe(urls[1])
    expect(new URL(urls[0]).searchParams.get('limit')).toBe('12')
  })

  it('forwards the allowed provider name upstream', async () => {
    await GET(request('?provider=spacex'))

    const upstream = new URL(String(fetchMock.mock.calls[0][0]))
    expect(upstream.searchParams.get('lsp__name')).toBe('SpaceX')
  })
})
