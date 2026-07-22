import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import {
  getAsteroidFeed,
  getDashboardData,
  getNasaNews,
  getSolarFlares,
  getUpcomingLaunches,
} from '@/lib/space-data'

export const dynamic = 'force-dynamic'

const CACHE_TAGS = [
  'space-dashboard',
  'space-launches',
  'space-asteroids',
  'space-flares',
  'space-news',
]

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authorization = request.headers.get('authorization')

  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET non configuré' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: 'Non autorisé' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  CACHE_TAGS.forEach(tag => revalidateTag(tag, 'max'))

  const jobs = await Promise.allSettled([
    getDashboardData(),
    getUpcomingLaunches(),
    getAsteroidFeed(),
    getSolarFlares(),
    getNasaNews(),
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
