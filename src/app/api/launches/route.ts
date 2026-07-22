import { NextRequest, NextResponse } from 'next/server'
import { getUpcomingLaunches } from '@/lib/space-data'

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit') || 8)
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 12)
    : 8
  const provider = request.nextUrl.searchParams.get('provider')?.trim()
  try {
    const launches = await getUpcomingLaunches(limit, provider)

    return NextResponse.json(
      { launches, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    )
  } catch {
    return NextResponse.json(
      { launches: [], updatedAt: new Date().toISOString(), error: 'Calendrier indisponible.' },
      { status: 503 },
    )
  }
}
