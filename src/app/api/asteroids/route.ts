import { NextResponse } from 'next/server'
import { getAsteroidFeed } from '@/lib/space-data'

export async function GET() {
  try {
    const data = await getAsteroidFeed()
    return NextResponse.json(
      data,
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json(
      { asteroids: [], updatedAt: new Date().toISOString(), error: 'Données NASA indisponibles.' },
      { status: 503 },
    )
  }
}
