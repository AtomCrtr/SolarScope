import { NextResponse } from 'next/server'
import { getNasaNews } from '@/lib/space-data'

export async function GET() {
  try {
    const data = await getNasaNews()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
      },
    })
  } catch {
    return NextResponse.json(
      {
        articles: [],
        updatedAt: new Date().toISOString(),
        error: 'Le flux NASA est temporairement indisponible.',
      },
      { status: 503 },
    )
  }
}
