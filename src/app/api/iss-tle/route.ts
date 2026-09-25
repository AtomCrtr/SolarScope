import { NextResponse } from 'next/server'
import { parseIssTle } from '@/lib/data/iss-tle'

const CELESTRAK_URL = 'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE'

// Orbital elements for the ISS. Visible passes are computed in the browser from
// these two lines, so the visitor's position never leaves their device.
export async function GET() {
  try {
    const response = await fetch(CELESTRAK_URL, {
      signal: AbortSignal.timeout(8_000),
      next: { revalidate: 21_600 },
      headers: { 'User-Agent': 'SolarScope/1.0 educational astronomy app' },
    })
    if (!response.ok) throw new Error(`CelesTrak ${response.status}`)
    const tle = parseIssTle(await response.text())
    if (!tle) throw new Error('Invalid ISS TLE')

    return NextResponse.json(
      { ...tle, source: 'CelesTrak', fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json(
      { error: 'Orbite de l’ISS temporairement indisponible.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
