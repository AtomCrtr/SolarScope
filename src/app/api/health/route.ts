import { NextResponse } from 'next/server'
import { getDashboardData, getIssPosition, getSpaceWeatherData } from '@/lib/data/space-data'
import { checkGeminiAvailability } from '@/lib/server/gemini-health'
import { summarizeServiceHealth } from '@/lib/server/health-status'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()
  try {
    const [dashboardResult, positionResult, weatherResult, geminiResult] = await Promise.allSettled([
      getDashboardData(),
      getIssPosition(),
      getSpaceWeatherData(),
      checkGeminiAvailability(),
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
      gemini: geminiResult.status === 'fulfilled' && geminiResult.value,
    }
    const health = summarizeServiceHealth(sources)

    return NextResponse.json(
      {
        status: health.status,
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        sources,
        features: { solarBot: sources.gemini ? 'gemini' : 'fallback' },
      },
      {
        status: health.httpStatus,
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
