import { NextResponse } from 'next/server'
import { getSpaceWeatherData } from '@/lib/space-data'

export async function GET() {
  const data = await getSpaceWeatherData()
  const availableSources = Object.values(data.sources).filter(Boolean).length

  return NextResponse.json(data, {
    status: availableSources > 0 ? 200 : 503,
    headers: {
      'Cache-Control': availableSources > 0
        ? 'public, s-maxage=60, stale-while-revalidate=300'
        : 'no-store',
    },
  })
}
