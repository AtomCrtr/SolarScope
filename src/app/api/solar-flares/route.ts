import { NextResponse } from 'next/server'
import { getSolarFlares } from '@/lib/space-data'

export async function GET() {
  try {
    return NextResponse.json(await getSolarFlares(), {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch {
    return NextResponse.json([], { status: 503 })
  }
}
