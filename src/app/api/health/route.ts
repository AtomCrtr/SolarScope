import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/space-data'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()
  try {
    const dashboard = await getDashboardData()
    const healthySources = Object.values(dashboard.sources).filter(Boolean).length
    const healthy = healthySources >= 3

    return NextResponse.json(
      {
        status: healthy ? 'ok' : 'degraded',
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - startedAt,
        sources: dashboard.sources,
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
