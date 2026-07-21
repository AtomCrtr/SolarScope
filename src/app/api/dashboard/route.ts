import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/space-data'

export async function GET() {
  const data = await getDashboardData()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  })
}
