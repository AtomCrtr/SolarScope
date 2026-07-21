import { NextResponse } from 'next/server'
import { getNasaApiKey } from '@/lib/space-data'

export async function GET() {
  const start = new Date()
  const end = new Date(start.getTime() + 7 * 86_400_000)
  const date = (value: Date) => value.toISOString().slice(0, 10)
  const url = new URL('https://api.nasa.gov/neo/rest/v1/feed')
  url.searchParams.set('start_date', date(start))
  url.searchParams.set('end_date', date(end))
  url.searchParams.set('api_key', getNasaApiKey())

  try {
    const response = await fetch(url, { next: { revalidate: 3_600 } })
    if (!response.ok) throw new Error(`NASA NeoWs ${response.status}`)

    const data = await response.json()
    return NextResponse.json(
      { ...data, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json(
      { near_earth_objects: {}, element_count: 0, error: 'Données NASA indisponibles.' },
      { status: 503 },
    )
  }
}
