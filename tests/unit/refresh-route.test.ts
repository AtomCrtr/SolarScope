import { afterEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }))
vi.mock('next/cache', () => ({ revalidateTag }))
vi.mock('@/lib/data/space-data', () => {
  const ok = vi.fn().mockResolvedValue({})
  return {
    SPACE_CACHE_TAGS: ['space-a', 'space-b'],
    getDashboardData: ok, getUpcomingLaunches: ok, getAsteroidFeed: ok, getSolarFlares: ok,
    getNasaNews: ok, getIssPosition: ok, getSpaceWeatherData: ok,
  }
})

import { GET } from '../../src/app/api/refresh/route'

const call = (authorization?: string) =>
  GET(new NextRequest('https://example.test/api/refresh', { headers: authorization ? { authorization } : {} }))

describe('refresh route authorization', () => {
  afterEach(() => {
    delete process.env.CRON_SECRET
    vi.clearAllMocks()
  })

  it('refuses to run when CRON_SECRET is missing', async () => {
    expect((await call('Bearer anything')).status).toBe(503)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it.each([undefined, 'Bearer wrong', 'secret', 'Bearer secretX', 'Bearer '])('rejects %s', async (header) => {
    process.env.CRON_SECRET = 'secret'
    expect((await call(header)).status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('refreshes every tag with the right secret', async () => {
    process.env.CRON_SECRET = 'secret'
    const response = await call('Bearer secret')
    expect(response.status).toBe(200)
    expect(revalidateTag).toHaveBeenCalledTimes(2)
    expect(await response.json()).toMatchObject({ status: 'ok', refreshed: 8, total: 8 })
  })
})
