'use client'

import { useState, useEffect } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

import KidsGuide from '@/components/learning/KidsGuide'
import TonightSky from '@/components/space/TonightSky'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

type Place = { kind: 'found'; name: string } | { kind: 'unknown' } | { kind: 'default' } | { kind: 'denied' }

const COPY = {
    fr: {
        badge: 'CIEL EN DIRECT', title: 'Carte du ciel', subtitle: ['Qu’est-ce qu’on voit ', 'ce soir', ' depuis chez toi ? La Lune, les planètes et les passages de la Station spatiale, calculés pour ta zone.'],
        detecting: 'Détection de ta position…', yourPosition: 'Ta position', parisDefault: 'Paris (par défaut)', parisDenied: 'Paris (par défaut, position refusée)',
        approx: (lat: number | null, lng: number | null) => `zone approximative · ${lat}°, ${lng}°`, now: 'Calculé maintenant', denied: 'Position refusée : Paris est utilisé par défaut', home: 'chez toi',
        moreKicker: 'POUR ALLER PLUS LOIN · CARTE EXTERNE', moreTitle: 'Explore toutes les étoiles et constellations',
        moreText: 'Stellarium s’ouvre dans un nouvel onglet avec la date actuelle et une position arrondie. SolarScope ne transmet jamais ta position exacte et ne l’enregistre pas.',
        open: 'Ouvrir la carte dans Stellarium', preparing: 'Préparation de ta zone d’observation…', external: 'Service externe : ses conditions d’accessibilité et de confidentialité s’appliquent.',
        tipsTitle: 'Conseils pour observer le ciel',
        tips: [
            { icon: 'moon-stars', tip: 'Observe quand la Lune est absente ou en fin croissant : sinon, elle éclaire trop le ciel.' },
            { icon: 'bulb', tip: 'Éloigne-toi des lumières de la ville. 30 min de route changent tout pour voir la Voie lactée !' },
            { icon: 'eye', tip: 'Laisse 20 minutes à tes yeux pour s’habituer au noir, sans regarder d’écran lumineux.' },
            { icon: 'telescope', tip: 'Commence à l’œil nu, puis avec des jumelles 10×50 : elles sont idéales pour débuter.' },
        ],
    },
    en: {
        badge: 'LIVE SKY', title: 'Sky map', subtitle: ['What can you see ', 'tonight', ' from where you are? The Moon, the planets and the Space Station passes, worked out for your area.'],
        detecting: 'Finding your position…', yourPosition: 'Your position', parisDefault: 'Paris (default)', parisDenied: 'Paris (default, position refused)',
        approx: (lat: number | null, lng: number | null) => `approximate area · ${lat}°, ${lng}°`, now: 'Worked out now', denied: 'Position refused: Paris is used instead', home: 'where you are',
        moreKicker: 'GOING FURTHER · EXTERNAL MAP', moreTitle: 'Explore every star and constellation',
        moreText: 'Stellarium opens in a new tab with the current date and a rounded position. SolarScope never shares your exact position and does not store it.',
        open: 'Open the map in Stellarium', preparing: 'Preparing your observing area…', external: 'External service: its own accessibility and privacy terms apply.',
        tipsTitle: 'Tips for stargazing',
        tips: [
            { icon: 'moon-stars', tip: 'Observe when the Moon is not there or is a thin crescent: otherwise it lights up the sky too much.' },
            { icon: 'bulb', tip: 'Get away from city lights. A 30-minute drive makes all the difference for seeing the Milky Way!' },
            { icon: 'eye', tip: 'Give your eyes 20 minutes to get used to the dark, without looking at a bright screen.' },
            { icon: 'telescope', tip: 'Start with the naked eye, then try 10×50 binoculars: they are ideal for beginners.' },
        ],
    },
}

export default function CielPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [place, setPlace] = useState<Place | null>(null)
    const [geoLoading, setGeoLoading] = useState(true)
    const [geoError, setGeoError] = useState(false)
    const [observationTime] = useState(() => new Date().toISOString())

    useEffect(() => {
        if (!navigator.geolocation) {
            // Default to Paris
            queueMicrotask(() => {
                setLat(48.8566)
                setLng(2.3522)
                setPlace({ kind: 'default' })
                setGeoLoading(false)
            })
            return
        }
        navigator.geolocation.getCurrentPosition(
            async pos => {
                const { latitude, longitude } = pos.coords
                const coarseLatitude = Number(latitude.toFixed(2))
                const coarseLongitude = Number(longitude.toFixed(2))
                setLat(coarseLatitude)
                setLng(coarseLongitude)
                // SolarScope's server proxy avoids exposing the browser directly
                // to the geocoding provider and validates the coarse coordinates.
                try {
                    const r = await fetch(`/api/geocode?lat=${coarseLatitude}&lon=${coarseLongitude}`)
                    const d = await r.json()
                    setPlace(d.city ? { kind: 'found', name: d.city } : { kind: 'unknown' })
                } catch {
                    setPlace({ kind: 'unknown' })
                }
                setGeoLoading(false)
            },
            () => {
                setLat(48.8566)
                setLng(2.3522)
                setPlace({ kind: 'denied' })
                setGeoLoading(false)
                setGeoError(true)
            },
            { timeout: 8000 }
        )
    }, [])

    // Two decimal places are sufficient for sky orientation and avoid sharing
    // the visitor's exact location with third-party services.
    const approximateLat = lat === null ? null : Number(lat.toFixed(2))
    const approximateLng = lng === null ? null : Number(lng.toFixed(2))

    // Stellarium is opened as an external tool instead of embedded. Its iframe
    // currently fails to load reliably and contains controls SolarScope cannot
    // make accessible. The coarse location remains explicit in the URL.
    const stellariumUrl = lat !== null && lng !== null
        ? `https://stellarium-web.org/?date=${encodeURIComponent(observationTime)}&lat=${approximateLat}&lng=${approximateLng}&fov=120`
        : null

    const placeLabel = place?.kind === 'found' ? place.name : place?.kind === 'default' || place?.kind === 'denied' ? 'Paris' : t.home
    const cityLabel = place?.kind === 'found' ? place.name : place?.kind === 'default' ? t.parisDefault : place?.kind === 'denied' ? t.parisDenied : t.yourPosition

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            <div className="page-header motion-enter">
                <div className="badge" style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', borderColor: 'rgba(14,165,233,0.25)' }}>
                    <SpaceIcon name="sparkle" size={18} className="inline-icon" /> {t.badge}
                </div>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-subtitle">
                    {t.subtitle[0]}<strong style={{ color: '#38bdf8' }}>{t.subtitle[1]}</strong>{t.subtitle[2]}
                </p>
            </div>

            <KidsGuide topic="ciel" />

            {/* Location banner */}
            <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.25rem' }}><SpaceIcon name="pin" size={18} className="inline-icon" /></span>
                <div style={{ flex: 1 }}>
                    {geoLoading ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.detecting}</span>
                    ) : (
                        <>
                            <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem' }}>{cityLabel}</span>
                            {lat !== null && lng !== null && (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>{t.approx(approximateLat, approximateLng)}</span>
                            )}
                        </>
                    )}
                </div>
                {lat !== null && lng !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span className="pulse-dot" style={{ background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>{t.now}</span>
                    </div>
                )}
                {geoError && (
                    <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>{t.denied}</span>
                )}
            </div>

            <TonightSky latitude={lat} longitude={lng} place={placeLabel} />

            <section className="card sky-observation-launcher" aria-labelledby="sky-map-title">
                <div className="sky-observation-visual" aria-hidden="true">
                    <span className="sky-star sky-star-one">✦</span>
                    <span className="sky-star sky-star-two">·</span>
                    <span className="sky-star sky-star-three">✧</span>
                    <span className="sky-constellation-line" />
                    <span className="sky-compass">N</span>
                </div>
                <div>
                    <span className="section-kicker">{t.moreKicker}</span>
                    <h2 id="sky-map-title">{t.moreTitle}</h2>
                    <p>{t.moreText}</p>
                    {stellariumUrl ? (
                        <a href={stellariumUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                            {t.open} <span aria-hidden="true">↗</span>
                        </a>
                    ) : (
                        <span role="status" className="sky-map-loading">{t.preparing}</span>
                    )}
                    <small>{t.external}</small>
                </div>
            </section>

            {/* Tips */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <h3 className="section-title" style={{ color: '#38bdf8', fontSize: '1rem' }}>{t.tipsTitle}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {t.tips.map(item => (
                        <div key={item.tip} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.08)' }}>
                            <span style={{ flexShrink: 0, color: '#7dd3fc' }}><SpaceIcon name={item.icon as SpaceIconName} size={20} /></span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: 1.6 }}>{item.tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
