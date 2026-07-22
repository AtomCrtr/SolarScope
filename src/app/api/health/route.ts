import { NextResponse } from 'next/server'
import { getDashboardData, getIssPosition, getSpaceWeatherData } from '@/lib/space-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()
  try {
    const [dashboardResult, positionResult, weatherResult] = await Promise.allSettled([
      getDashboardData(),
      getIssPosition(),
      getSpaceWeatherData(),
    ])
    const dashboardSources = dashboardResult.status === 'fulfilled'
      ? dashboardResult.value.sources
      : { exoplanets: false, asteroids: false, crew: false, launches: false }
    const weatherSources = weatherResult.status === 'fulfilled'
      ? weatherResult.value.sources
      : { solarWind: false, xray: false }
    const sources = {
      ...dashboardSources,
      issPosition: positionResult.status === 'fulfilled',
      ...weatherSources,
    }
    const healthySources = Object.values(sources).filter(Boolean).length
    const healthy = healthySources >= 5

    return NextResponse.json(
      {
        status: healthy ? 'ok' : 'degraded',
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        sources,
      },
      {
        status: healthy ? 200 : 503,
        headers: { 'Cache-Control': 'no-store' },
      },
    )
  } catch {
    return NextResponse.json(
      { status: 'down', checkedAt: new Date().toISOString() },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
