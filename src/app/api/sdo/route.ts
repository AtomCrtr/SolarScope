import { NextRequest, NextResponse } from 'next/server'
import { checkDistributedRateLimit } from '@/lib/rate-limit'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const ALLOWED_SOURCES = [
    { origin: 'https://sdo.gsfc.nasa.gov', pathPrefix: '/assets/img/latest/' },
    { origin: 'https://soho.nascom.nasa.gov', pathPrefix: '/data/realtime/' },
]

function errorResponse(error: string, status: number, extraHeaders?: HeadersInit) {
    return NextResponse.json(
        { error },
        { status, headers: { 'Cache-Control': 'no-store', ...extraHeaders } },
    )
}

function parseAllowedUrl(value: string) {
    try {
        const target = new URL(value)
        const allowed = ALLOWED_SOURCES.some(
            source => target.origin === source.origin && target.pathname.startsWith(source.pathPrefix),
        )
        return allowed ? target : null
    } catch {
        return null
    }
}

export async function GET(req: NextRequest) {
    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    const clientId = forwardedFor || req.headers.get('x-real-ip') || 'unknown'
    const rate = await checkDistributedRateLimit(`sdo:${clientId}`, {
        namespace: 'sdo',
        limit: 30,
        windowSeconds: 60,
    })
    if (rate.unavailable) return errorResponse('Protection temporairement indisponible', 503)
    if (!rate.allowed) {
        return errorResponse('Trop de requêtes', 429, { 'Retry-After': String(rate.retryAfter) })
    }

    const value = req.nextUrl.searchParams.get('url')
    if (!value) return errorResponse('Paramètre url manquant', 400)

    const target = parseAllowedUrl(value)
    if (!target) return errorResponse('Source non autorisée', 403)

    try {
        const res = await fetch(target, {
            headers: {
                Accept: 'image/*',
                'User-Agent': 'SolarScope/2.0 (+https://solar-scope.vercel.app)',
            },
            redirect: 'error',
            signal: AbortSignal.timeout(12_000),
            next: { revalidate: 900 },
        })

        if (!res.ok) return errorResponse(`Source indisponible (${res.status})`, 502)

        const contentType = res.headers.get('content-type') ?? ''
        if (!contentType.startsWith('image/')) return errorResponse('Format de réponse invalide', 502)

        const declaredLength = Number(res.headers.get('content-length') || 0)
        if (declaredLength > MAX_IMAGE_BYTES) return errorResponse('Image trop volumineuse', 413)

        const buffer = await res.arrayBuffer()
        if (buffer.byteLength > MAX_IMAGE_BYTES) return errorResponse('Image trop volumineuse', 413)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
                'Content-Length': String(buffer.byteLength),
                'X-Content-Type-Options': 'nosniff',
            },
        })
    } catch {
        return errorResponse('Source temporairement indisponible', 502)
    }
}
