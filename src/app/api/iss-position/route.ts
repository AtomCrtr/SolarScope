import { NextResponse } from 'next/server'
import { getIssPosition } from '@/lib/space-data'

export async function GET() {
  try {
    return NextResponse.json(await getIssPosition(), {
      headers: { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30' },
    })
  } catch {
    return NextResponse.json(
      { error: 'Position ISS temporairement indisponible.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
