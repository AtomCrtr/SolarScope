import { NextRequest, NextResponse } from 'next/server'

const FALLBACK_CITY = 'Votre position'

function parseCoordinate(value: string | null, min: number, max: number) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null
  return Number(parsed.toFixed(2))
}

export async function GET(request: NextRequest) {
  const latitude = parseCoordinate(request.nextUrl.searchParams.get('lat'), -90, 90)
  const longitude = parseCoordinate(request.nextUrl.searchParams.get('lon'), -180, 180)

  if (latitude === null || longitude === null) {
    return NextResponse.json({ error: 'Coordonnées invalides.' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.search = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: 'jsonv2',
    zoom: '10',
    addressdetails: '1',
  }).toString()

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SolarScope educational astronomy site' },
      signal: AbortSignal.timeout(6_000),
      next: { revalidate: 86_400 },
    })
    if (!response.ok) throw new Error('Geocoding unavailable')

    const data = await response.json() as {
      address?: { city?: string; town?: string; village?: string; municipality?: string; county?: string }
    }
    const city = data.address?.city
      || data.address?.town
      || data.address?.village
      || data.address?.municipality
      || data.address?.county
      || FALLBACK_CITY

    return NextResponse.json(
      { city, latitude, longitude },
      { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
    )
  } catch {
    return NextResponse.json(
      { city: FALLBACK_CITY, latitude, longitude, degraded: true },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' } },
    )
  }
}
