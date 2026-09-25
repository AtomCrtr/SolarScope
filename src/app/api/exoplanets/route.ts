import { NextResponse } from 'next/server'
import { getExoplanetCatalog } from '@/lib/data/exoplanets'

export async function GET() {
  try {
    return NextResponse.json(await getExoplanetCatalog(), {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    })
  } catch {
    return NextResponse.json(
      { error: 'Le catalogue de la NASA est momentanément indisponible.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
