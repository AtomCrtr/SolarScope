'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import KidsGuide from '@/components/learning/KidsGuide'

export default function CielPage() {
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [city, setCity] = useState<string>('')
    const [geoLoading, setGeoLoading] = useState(true)
    const [geoError, setGeoError] = useState(false)
    const [observationTime] = useState(() => new Date().toISOString())

    useEffect(() => {
        if (!navigator.geolocation) {
            // Default to Paris
            queueMicrotask(() => {
                setLat(48.8566)
                setLng(2.3522)
                setCity('Paris (défaut)')
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
                    setCity(d.city || 'Votre position')
                } catch {
                    setCity('Votre position')
                }
                setGeoLoading(false)
            },
            () => {
                setLat(48.8566)
                setLng(2.3522)
                setCity('Paris (défaut — géolocalisation refusée)')
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

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge" style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', borderColor: 'rgba(14,165,233,0.25)' }}>
                    🌌 CIEL EN DIRECT
                </div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #bae6fd, #0ea5e9, #0369a1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Carte du Ciel
                </h1>
                <p className="page-subtitle">
                    Qu&apos;est-ce qu&apos;on voit <strong style={{ color: '#38bdf8' }}>ce soir</strong> depuis chez toi ? Explore les étoiles, planètes et constellations visibles en ce moment.
                </p>
            </motion.div>

            <KidsGuide topic="ciel" />

            {/* Location banner */}
            <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.25rem' }}>📍</span>
                <div style={{ flex: 1 }}>
                    {geoLoading ? (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Détection de ta position…</span>
                    ) : (
                        <>
                            <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>{city}</span>
                            {lat !== null && lng !== null && (
                                <span style={{ color: '#64748b', fontSize: '0.72rem', marginLeft: '0.5rem' }}>zone approximative · {approximateLat}°, {approximateLng}°</span>
                            )}
                        </>
                    )}
                </div>
                {lat !== null && lng !== null && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span className="pulse-dot" style={{ background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
                        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>Calculé maintenant</span>
                    </div>
                )}
                {geoError && (
                    <span style={{ color: '#fca5a5', fontSize: '0.75rem' }}>Position refusée : Paris est utilisé par défaut</span>
                )}
            </div>

            <section className="card sky-observation-launcher" aria-labelledby="sky-map-title">
                <div className="sky-observation-visual" aria-hidden="true">
                    <span className="sky-star sky-star-one">✦</span>
                    <span className="sky-star sky-star-two">·</span>
                    <span className="sky-star sky-star-three">✧</span>
                    <span className="sky-constellation-line" />
                    <span className="sky-compass">N</span>
                </div>
                <div>
                    <span className="section-kicker">CARTE INTERACTIVE EXTERNE</span>
                    <h2 id="sky-map-title">Ouvre le ciel correspondant à ta zone</h2>
                    <p>
                        Stellarium s’ouvre dans un nouvel onglet avec la date actuelle et une position arrondie.
                        SolarScope ne transmet jamais ta position exacte et ne l’enregistre pas.
                    </p>
                    {stellariumUrl ? (
                        <a href={stellariumUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                            Ouvrir la carte dans Stellarium <span aria-hidden="true">↗</span>
                        </a>
                    ) : (
                        <span role="status" className="sky-map-loading">Préparation de ta zone d’observation…</span>
                    )}
                    <small>Service externe : ses conditions d’accessibilité et de confidentialité s’appliquent.</small>
                </div>
            </section>

            <section className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>🪐 Que peut-on réellement voir ?</h2>
                <p style={{ color: 'var(--text-subtle)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    La carte proposée calcule le ciel à l’instant présent pour votre zone approximative. La visibilité
                    réelle dépend aussi de l’heure, de la météo et de la pollution lumineuse. SolarScope ne présente
                    plus de liste mensuelle figée comme une donnée « en direct ».
                </p>
                <a
                    href="https://science.nasa.gov/skywatching/whats-up/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                >
                    Consulter le guide mensuel officiel de la NASA ↗
                </a>
            </section>

            {/* Tips */}
            <div className="card" style={{ padding: '1.25rem' }}>
                <h3 className="section-title" style={{ color: '#38bdf8', fontSize: '1rem' }}>💡 Conseils pour observer le ciel</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { icon: '🌑', tip: 'Observe quand la Lune est absente ou en croissant — elle éclaire trop le ciel sinon.' },
                        { icon: '🏙️', tip: 'Éloigne-toi des lumières de la ville. 30 min de route changent tout pour voir la Voie lactée !' },
                        { icon: '👁️', tip: 'Laisse 20 minutes à tes yeux pour s\'adapter au noir. N\'allume pas de téléphone blanc.' },
                        { icon: '🔭', tip: 'Commence à l\'œil nu, puis avec des jumelles 10×50 — idéales pour débuter l\'observation.' },
                    ].map(t => (
                        <div key={t.icon} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.08)' }}>
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{t.icon}</span>
                            <p style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: 1.6 }}>{t.tip}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
