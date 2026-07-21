import { NextRequest, NextResponse } from 'next/server'

interface LaunchLibraryItem {
  id: string
  name: string
  net: string
  image?: string | null
  webcast_live?: boolean
  launch_service_provider?: { name?: string }
  rocket?: { configuration?: { name?: string } }
  status?: { name?: string; abbrev?: string }
  pad?: { name?: string; location?: { name?: string } }
  vidURLs?: string[]
}

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get('limit') || 8)
  const limit = Math.min(Math.max(requestedLimit, 1), 12)
  const provider = request.nextUrl.searchParams.get('provider')?.trim()
  const upstream = new URL('https://ll.thespacedevs.com/2.2.0/launch/upcoming/')
  upstream.searchParams.set('limit', String(limit))
  upstream.searchParams.set('format', 'json')
  if (provider) upstream.searchParams.set('lsp__name', provider.slice(0, 40))

  try {
    const response = await fetch(upstream, { next: { revalidate: 900 } })
    if (!response.ok) throw new Error(`Launch Library ${response.status}`)
    const payload = (await response.json()) as { results?: LaunchLibraryItem[] }
    const launches = (payload.results || []).map(launch => ({
      id: launch.id,
      name: launch.name,
      net: launch.net,
      agency: launch.launch_service_provider?.name || 'Agence non renseignée',
      rocket: launch.rocket?.configuration?.name || 'Lanceur non renseigné',
      status: launch.status?.name || launch.status?.abbrev || 'Planifié',
      image: launch.image || null,
      location: launch.pad?.location?.name || launch.pad?.name || 'Site non renseigné',
      webcast: launch.vidURLs?.[0] || null,
      live: Boolean(launch.webcast_live),
    }))

    return NextResponse.json(
      { launches, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    )
  } catch {
    return NextResponse.json(
      { launches: [], updatedAt: new Date().toISOString(), error: 'Calendrier indisponible.' },
      { status: 503 },
    )
  }
}
