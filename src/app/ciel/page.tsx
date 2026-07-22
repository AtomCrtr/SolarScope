'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function CielPage() {
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [city, setCity] = useState<string>('')
    const [geoLoading, setGeoLoading] = useState(true)
    const [geoError, setGeoError] = useState(false)

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
                // Reverse geocoding via free API
                try {
                    const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coarseLatitude}&lon=${coarseLongitude}&format=json`)
                    const d = await r.json()
                    setCity(d.address?.city || d.address?.town || d.address?.village || 'Votre position')
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

    // Build Stellarium URL with coarse coordinates and the current instant.
    const stellariumUrl = lat !== null && lng !== null
        ? `https://stellarium-web.org/?date=${encodeURIComponent(new Date().toISOString())}&lat=${approximateLat}&lng=${approximateLng}&fov=120`
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
                        <span style={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 600 }}>Ciel temps réel</span>
                    </div>
                )}
                {geoError && (
                    <span style={{ color: '#f87171', fontSize: '0.72rem' }}>⚠️ Accorde la géolocalisation pour ta position exacte</span>
                )}
            </div>

            {/* Stellarium Embed */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(14,165,233,0.06)', borderBottom: '1px solid rgba(14,165,233,0.15)', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <span style={{ fontSize: '1rem' }}>🔭</span>
                    <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.88rem' }}>Stellarium — Planetarium interactif</span>
                    <span style={{ marginLeft: 'auto', color: '#475569', fontSize: '0.72rem' }}>Zoom · Cliquer sur une étoile pour les infos</span>
                </div>
                {stellariumUrl ? (
                    <iframe
                        src={stellariumUrl}
                        style={{ width: '100%', height: 580, border: 'none', display: 'block', background: '#000' }}
                        title="Carte du ciel Stellarium"
                        referrerPolicy="strict-origin-when-cross-origin"
                        sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups"
                    />
                ) : (
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌌</div>
                            <p>Chargement du planétarium…</p>
                        </div>
                    </div>
                )}
            </div>

            <section className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>🪐 Que peut-on réellement voir ?</h2>
                <p style={{ color: 'var(--text-subtle)', lineHeight: 1.7, marginBottom: '1rem' }}>
                    La carte ci-dessus calcule le ciel à l’instant présent pour votre zone approximative. La visibilité
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
