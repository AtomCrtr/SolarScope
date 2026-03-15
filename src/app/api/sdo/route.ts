import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_URLS = [
    'https://sdo.gsfc.nasa.gov/assets/img/latest/',
    'https://soho.nascom.nasa.gov/',
]

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')

    if (!url) {
        return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
    }

    // Sécurité : seulement les domaines NASA autorisés
    const isAllowed = ALLOWED_URLS.some(prefix => url.startsWith(prefix))
    if (!isAllowed) {
        return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
    }

    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SolarScope/1.0; +https://solar-scope.vercel.app)',
                'Referer': 'https://sdo.gsfc.nasa.gov/',
            },
            next: { revalidate: 900 }, // cache 15 min (SDO updates every 15 min)
        })

        if (!res.ok) {
            return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 })
        }

        const contentType = res.headers.get('content-type') ?? 'image/jpeg'
        const buffer = await res.arrayBuffer()

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (err) {
        console.error('[SDO proxy error]', err)
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
    }
}
