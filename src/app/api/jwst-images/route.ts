import { NextResponse } from 'next/server'

export async function GET() {
  const url = 'https://images-api.nasa.gov/search?q=james+webb+space+telescope+nebula&media_type=image&year_start=2022&page_size=20'

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 21_600 },
    })
    if (!response.ok) throw new Error('NASA image search unavailable')
    const data = await response.json() as {
      collection?: { items?: Array<{
        data?: Array<{ nasa_id?: string; title?: string; description?: string; date_created?: string }>
        links?: Array<{ href?: string }>
      }> }
    }

    const images = (data.collection?.items || []).slice(0, 12).flatMap((item) => {
      const detail = item.data?.[0]
      const thumbnail = item.links?.[0]?.href
      if (!detail?.nasa_id || !detail.title || !thumbnail?.startsWith('https://')) return []
      return [{
        nasa_id: detail.nasa_id,
        title: detail.title,
        description: `${detail.description?.slice(0, 180) || ''}${detail.description ? '…' : ''}`,
        date_created: detail.date_created?.slice(0, 10) || '',
        href: thumbnail,
        thumb: thumbnail,
      }]
    })

    return NextResponse.json(
      { images, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } },
    )
  } catch {
    return NextResponse.json(
      { error: 'Galerie NASA temporairement indisponible.', images: [] },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
