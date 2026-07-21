import { NextResponse } from 'next/server'
import { getNasaApiKey } from '@/lib/space-data'

export async function GET() {
  const end = new Date()
  const start = new Date(end.getTime() - 30 * 86_400_000)
  const date = (value: Date) => value.toISOString().slice(0, 10)
  const upstream = new URL('https://api.nasa.gov/DONKI/FLR')
  upstream.searchParams.set('startDate', date(start))
  upstream.searchParams.set('endDate', date(end))
  upstream.searchParams.set('api_key', getNasaApiKey())

  try {
    const response = await fetch(upstream, { next: { revalidate: 3_600 } })
    if (!response.ok) throw new Error(`NASA DONKI ${response.status}`)
    return NextResponse.json(await response.json(), {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json([], { status: 503 })
  }
}
