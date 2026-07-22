import { getNasaApiKey } from '@/lib/space-data'
import Image from 'next/image'

async function getApod() {
    try {
        const end = new Date()
        const start = new Date(end.getTime() - 12 * 86_400_000)
        const url = new URL('https://api.nasa.gov/planetary/apod')
        url.searchParams.set('api_key', getNasaApiKey())
        url.searchParams.set('start_date', start.toISOString().slice(0, 10))
        url.searchParams.set('end_date', end.toISOString().slice(0, 10))
        url.searchParams.set('thumbs', 'true')

        const res = await fetch(url, { next: { revalidate: 3600 } })
        if (!res.ok) throw new Error(`NASA APOD ${res.status}`)
        const photos = await res.json()
        return Array.isArray(photos)
            ? photos.sort((a: Record<string, string>, b: Record<string, string>) => a.date.localeCompare(b.date))
            : []
    } catch {
        return []
    }
}

export default async function ApodPage() {
    const photos = await getApod()
    const hero = photos[photos.length - 1]
    const gallery = photos.slice(0, -1).filter((p: Record<string, string>) => p.media_type === 'image').reverse()

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header">
                <div className="badge" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee', borderColor: 'rgba(6,182,212,0.25)' }}>
                    🌠 NASA APOD — CHAQUE JOUR
                </div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #a5f3fc, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Photo du Jour
                </h1>
                <p className="page-subtitle">Chaque jour la NASA choisit l&apos;image astronomique la plus spectaculaire</p>
            </div>

            {/* Hero image */}
            {hero && (
                <div className="card" style={{ overflow: 'hidden', padding: 0, marginBottom: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: 360 }} className="max-md:grid-cols-1">
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 320 }}>
                            {hero.media_type === 'image'
                                ? <Image src={hero.url} alt={hero.title} fill priority sizes="(max-width: 768px) 100vw, 55vw" style={{ objectFit: 'cover', display: 'block' }} />
                                : <div style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 320, fontSize: '2rem' }}>🎬 Vidéo</div>
                            }
                        </div>
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '0.72rem', color: '#22d3ee', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>✨ IMAGE DU JOUR</div>
                            <h2 style={{ color: '#e2e8f0', fontWeight: 800, fontSize: '1.3rem', fontFamily: 'Outfit, sans-serif', marginBottom: '1rem', lineHeight: 1.3 }}>
                                {hero.title}
                            </h2>
                            <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                {hero.explanation?.slice(0, 450)}…
                            </p>
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <a
                                    href="https://apod.nasa.gov/apod/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}
                                >
                                    🚀 NASA.gov
                                </a>
                                {hero.date && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>📅 {hero.date}</span>}
                                {hero.copyright && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>© {hero.copyright}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!hero && (
                <div className="card" style={{ padding: '2rem', marginBottom: '3rem', textAlign: 'center', color: '#f59e0b' }}>
                    📡 Le service NASA APOD est temporairement indisponible.
                </div>
            )}

            {/* Gallery */}
            <h2 className="section-title" style={{ color: '#e2e8f0' }}>📸 Galerie récente</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((p: Record<string, string>, i: number) => (
                    <div key={i} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                        <Image src={p.url} alt={p.title} width={600} height={400} sizes="(max-width: 768px) 50vw, 25vw" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <div style={{ padding: '0.75rem' }}>
                            <p style={{ color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.4 }}>{p.title?.slice(0, 50)}{p.title?.length > 50 ? '…' : ''}</p>
                            <p style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '0.3rem' }}>📅 {p.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
