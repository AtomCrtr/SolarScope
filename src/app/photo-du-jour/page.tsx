import Image from 'next/image'
import KidsGuide from '@/components/learning/KidsGuide'
import { getApodWithFallback, type ApodEntry } from '@/lib/data/apod'

export default async function ApodPage() {
    const { photos, source } = await getApodWithFallback()
    const hero = photos[photos.length - 1]
    const gallery = photos.slice(0, -1).filter(p => p.media_type === 'image').reverse()

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header">
                <div className="badge" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee', borderColor: 'rgba(6,182,212,0.25)' }}>
                    🌠 NASA APOD — CHAQUE JOUR
                </div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #a5f3fc, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Photo du Jour
                </h1>
                <p className="page-subtitle">Observe une image choisie par la NASA, puis découvre ce qu&apos;elle raconte.</p>
            </div>

            <KidsGuide topic="photo-du-jour" />

            {source === 'fallback' && (
                <div role="status" className="apod-fallback-note">
                    <strong>📡 NASA APOD ne répond pas actuellement.</strong>
                    <span>SolarScope affiche la dernière photo de référence conservée, datée du {new Date(hero.date).toLocaleDateString('fr-FR')}.</span>
                </div>
            )}

            {/* Hero image */}
            {hero && (
                <div className="card" style={{ overflow: 'hidden', padding: 0, marginBottom: '3rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', minHeight: 360 }} className="max-md:grid-cols-1">
                        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 320 }}>
                            {hero.media_type === 'image' ? (
                                <Image src={hero.url} alt={hero.title} fill priority sizes="(max-width: 768px) 100vw, 55vw" style={{ objectFit: 'cover', display: 'block' }} />
                            ) : (
                                <div className="apod-video-preview">
                                    {hero.thumbnail_url && <Image src={hero.thumbnail_url} alt="" fill priority sizes="(max-width: 768px) 100vw, 55vw" style={{ objectFit: 'cover' }} />}
                                    <div aria-hidden="true" className="apod-video-overlay">▶</div>
                                    <a href={hero.url} target="_blank" rel="noopener noreferrer">Voir la vidéo APOD sur son site d’origine ↗</a>
                                </div>
                            )}
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
                                    href={hero.media_type === 'video' ? hero.url : 'https://apod.nasa.gov/apod/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}
                                >
                                    {hero.media_type === 'video' ? '▶ Voir la vidéo' : '🚀 Voir sur NASA.gov'}
                                </a>
                                {hero.date && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>📅 {hero.date}</span>}
                                {hero.copyright && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>© {hero.copyright}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery */}
            <h2 className="section-title" style={{ color: '#e2e8f0' }}>📸 Galerie récente</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((p: ApodEntry, i: number) => (
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
