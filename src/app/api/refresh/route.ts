import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { createHash, timingSafeEqual } from 'node:crypto'
import {
  getAsteroidFeed,
  getDashboardData,
  getIssPosition,
  getNasaNews,
  getSolarFlares,
  getSpaceWeatherData,
  getUpcomingLaunches,
  SPACE_CACHE_TAGS,
} from '@/lib/data/space-data'

export const dynamic = 'force-dynamic'

function isAuthorized(authorization: string | null, secret: string) {
  // Hashing gives both sides the same length, as timingSafeEqual requires.
  const digest = (value: string) => createHash('sha256').update(value).digest()
  return timingSafeEqual(digest(authorization ?? ''), digest(`Bearer ${secret}`))
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET non configuré' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (!isAuthorized(request.headers.get('authorization'), secret)) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  SPACE_CACHE_TAGS.forEach(tag => revalidateTag(tag, 'max'))

  const jobs = await Promise.allSettled([
    getDashboardData(),
    getUpcomingLaunches(),
    getUpcomingLaunches(8, 'SpaceX'),
    getAsteroidFeed(),
    getSolarFlares(),
    getNasaNews(),
    getIssPosition(),
    getSpaceWeatherData(),
  ])

  const refreshed = jobs.filter(job => job.status === 'fulfilled').length
  return NextResponse.json(
    {
      status: refreshed === jobs.length ? 'ok' : 'degraded',
      refreshed,
      total: jobs.length,
      refreshedAt: new Date().toISOString(),
    },
    {
      status: refreshed > 0 ? 200 : 502,
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}
