import { NextRequest, NextResponse } from 'next/server'
import { loadMeteorites, meteoritesNear, meteoriteSummary } from '@/lib/data/meteorites'

export const maxDuration = 60

/** One decimal (about 10 km): enough to find nearby meteorites, better for privacy and caching. */
function coordinate(value: string | null, limit: number): number | null {
  if (value === null || value.trim() === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || Math.abs(parsed) > limit) return null
  return Math.round(parsed * 10) / 10
}

export async function GET(request: NextRequest) {
  const latParam = request.nextUrl.searchParams.get('lat')
  const lonParam = request.nextUrl.searchParams.get('lon')
  const lat = coordinate(latParam, 90)
  const lon = coordinate(lonParam, 180)
  if ((latParam !== null || lonParam !== null) && (lat === null || lon === null)) {
    return NextResponse.json({ error: 'Coordonnées invalides.' }, { status: 400 })
  }

  try {
    const records = await loadMeteorites()
    const body = {
      summary: meteoriteSummary(records),
      near: lat !== null && lon !== null ? { lat, lon, ...meteoritesNear(records, lat, lon) } : null,
      source: 'NASA Open Data — Meteorite Landings (Meteoritical Society)',
    }
    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    })
  } catch {
    return NextResponse.json(
      { error: 'La base de météorites de la NASA est momentanément indisponible.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
