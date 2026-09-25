import Image from 'next/image'
import KidsGuide from '@/components/learning/KidsGuide'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { getApodWithFallback, type ApodEntry } from '@/lib/data/apod'
import type { SiteLocale } from '@/lib/i18n/paths'

const COPY = {
    fr: { badge: 'NASA APOD — CHAQUE JOUR', title: 'Photo du Jour', subtitle: 'Observe une image choisie par la NASA, puis découvre ce qu’elle raconte.', down: 'NASA APOD ne répond pas actuellement.', fallback: (date: string) => `SolarScope affiche la dernière photo de référence conservée, datée du ${date}.`, video: 'Voir la vidéo APOD sur son site d’origine ↗', today: 'IMAGE DU JOUR', watch: '▶ Voir la vidéo', open: 'Voir sur NASA.gov', gallery: 'Galerie récente', english: 'Texte de la NASA, en anglais.', dateLocale: 'fr-FR' },
    en: { badge: 'NASA APOD — EVERY DAY', title: 'Picture of the Day', subtitle: 'Look at a picture chosen by NASA, then find out what it tells us.', down: 'NASA APOD is not answering right now.', fallback: (date: string) => `SolarScope shows the last reference picture it kept, dated ${date}.`, video: 'Watch the APOD video on its original site ↗', today: 'PICTURE OF THE DAY', watch: '▶ Watch the video', open: 'See it on NASA.gov', gallery: 'Recent gallery', english: '', dateLocale: 'en-GB' },
}

export default async function ApodContent({ locale }: { locale: SiteLocale }) {
    const copy = COPY[locale]
    const { photos, source } = await getApodWithFallback()
    const hero = photos[photos.length - 1]
    const gallery = photos.slice(0, -1).filter(p => p.media_type === 'image').reverse()

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header">
                <div className="badge" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee', borderColor: 'rgba(6,182,212,0.25)' }}>
                    <SpaceIcon name="camera" size={18} className="inline-icon" /> {copy.badge}
                </div>
                <h1 className="page-title">{copy.title}</h1>
                <p className="page-subtitle">{copy.subtitle}</p>
            </div>

            <KidsGuide topic="photo-du-jour" />

            {source === 'fallback' && (
                <div role="status" className="apod-fallback-note">
                    <strong><SpaceIcon name="signal" size={18} className="inline-icon" /> {copy.down}</strong>
                    <span>{copy.fallback(new Date(hero.date).toLocaleDateString(copy.dateLocale))}</span>
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
                                    <a href={hero.url} target="_blank" rel="noopener noreferrer">{copy.video}</a>
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <div style={{ fontSize: '0.72rem', color: '#22d3ee', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.75rem' }}><SpaceIcon name="sparkle" size={18} className="inline-icon" /> {copy.today}</div>
                            <h2 lang="en" style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.3rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', lineHeight: 1.3 }}>
                                {hero.title}
                            </h2>
                            <p lang="en" style={{ color: 'var(--text-muted)', lineHeight: 1.75, fontSize: '0.875rem', marginBottom: copy.english ? '0.4rem' : '1.5rem' }}>
                                {hero.explanation?.slice(0, 450)}…
                            </p>
                            {copy.english && <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>{copy.english}</p>}
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <a
                                    href={hero.media_type === 'video' ? hero.url : 'https://apod.nasa.gov/apod/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{ fontSize: '0.85rem', padding: '0.65rem 1.5rem' }}
                                >
                                    {hero.media_type === 'video' ? copy.watch : copy.open}
                                </a>
                                {hero.date && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}><SpaceIcon name="calendar" size={18} className="inline-icon" /> {hero.date}</span>}
                                {hero.copyright && <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>© {hero.copyright}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery */}
            <h2 className="section-title" style={{ color: 'var(--text)' }}>{copy.gallery}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((p: ApodEntry, i: number) => (
                    <div key={i} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                        <Image src={p.url} alt={p.title} width={600} height={400} sizes="(max-width: 768px) 50vw, 25vw" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                        <div style={{ padding: '0.75rem' }}>
                            <p style={{ color: 'var(--text)', fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.4 }}>{p.title?.slice(0, 50)}{p.title?.length > 50 ? '…' : ''}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '0.3rem' }}><SpaceIcon name="calendar" size={18} className="inline-icon" /> {p.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
