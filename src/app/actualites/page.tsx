'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Article { title: string; source: string; url: string; date: string; summary: string; category: string }

const STATIC_ARTICLES: Article[] = [
    { title: "James Webb révèle les premières étoiles de l'Univers", source: 'NASA', url: 'https://www.nasa.gov/james-webb-space-telescope/', date: '2026-02-15', summary: "Le télescope spatial James Webb a détecté des étoiles de la première génération, nées juste après le Big Bang, ouvrant une fenêtre sur l'aube de l'Univers.", category: 'Télescope' },
    { title: 'Artemis II : les astronautes prêts pour le tour de la Lune', source: 'NASA', url: 'https://www.nasa.gov/artemis/', date: '2026-02-10', summary: "Quatre astronautes sont sélectionnés pour le vol Artemis II, le premier vol habité autour de la Lune depuis Apollo 17 en 1972.", category: 'Exploration' },
    { title: "Apophis 2029 : la Terre se prépare pour le grand rendez-vous", source: 'ESA', url: 'https://www.esa.int/', date: '2026-01-28', summary: "L'astéroïde Apophis passera à seulement 31 000 km de la Terre le 13 avril 2029. Les agences spatiales planifient des missions d'étude rapprochée.", category: 'Astéroïde' },
    { title: "Perseverance : découverte de molécules organiques sur Mars", source: 'NASA JPL', url: 'https://mars.nasa.gov/', date: '2026-01-20', summary: "Le rover Perseverance a détecté des molécules organiques complexes dans le cratère Jezero, renforçant l'hypothèse d'une vie passée sur Mars.", category: 'Mars' },
    { title: "JUICE : la sonde européenne se rapproche de Jupiter", source: 'ESA', url: 'https://www.esa.int/Science_Exploration/Space_Science/Juice', date: '2026-01-15', summary: "La mission JUICE (Jupiter Icy Moons Explorer) envoie ses premières images des lunes glacées de Jupiter, en route vers son insertion orbitale en 2031.", category: 'Sonde' },
    { title: "Etoile à neutrons : une nouvelle pulsation détectée par le FAST", source: 'CNRS', url: 'https://www.cnrs.fr/', date: '2026-01-05', summary: "Le radiotélescope chinois FAST a capté les signaux les plus précis d'une étoile à neutrons, permettant de tester la relativité générale avec une précision record.", category: 'Radio astronomie' },
    { title: 'SpaceX Starship : vol orbital réussi', source: 'SpaceX', url: 'https://www.spacex.com/', date: '2025-12-20', summary: "Starship a complété son premier vol orbital complet avec amerrissage réussi du vaisseau. Un pas historique vers Mars.", category: 'Lanceur' },
    { title: "Europa Clipper : la NASA en route vers la lune glacée de Jupiter", source: 'NASA JPL', url: 'https://europa.nasa.gov/', date: '2025-12-10', summary: "La sonde Europa Clipper a effectué son premier fly-by de la Lune pour gagner de l'élan. Elle atteindra Jupiter en 2030 pour chercher des signes de vie dans l'océan sous-glaciaire d'Europe.", category: 'Sonde' },
    { title: "Aurores boréales record en France en 2025", source: 'CNES', url: 'https://www.cnes.fr/', date: '2025-11-15', summary: "Suite à une tempête solaire majeure classe X9, des aurores boréales ont été visibles jusqu'en Provence. Le Soleil est au maximum de son cycle d'activité 25.", category: 'Météo spatiale' },
    { title: "Trou noir M87 : nouvelles images de l'Event Horizon Telescope", source: 'ESO', url: 'https://www.eso.org/', date: '2025-10-28', summary: "La collaboration Event Horizon Telescope publie des images haute résolution du trou noir supermassif de M87, révélant des structures en jet inédites.", category: 'Télescope' },
    { title: "TRAPPIST-1e : Webb détecte une atmosphère candidate", source: 'NASA/ESA JWST', url: 'https://www.nasa.gov/james-webb-space-telescope/', date: '2025-09-10', summary: "Le James Webb a détecté des signatures spectrales compatibles avec une atmosphère de dioxyde de carbone sur TRAPPIST-1e, dans la zone habitable de son étoile.", category: 'Exoplanètes' },
    { title: 'Ingenuity : 70 vols sur Mars avant la retraite', source: 'NASA JPL', url: 'https://mars.nasa.gov/technology/helicopter/', date: '2025-08-05', summary: "Le petit hélicoptère martien a accompli 70 vols, parcourant 17 km avant d'être officiellement mis à la retraite. Un succès au-delà de toutes les espérances initiales.", category: 'Mars' },
]

const ALL_CATEGORIES = ['Tous', 'Télescope', 'Exploration', 'Astéroïde', 'Mars', 'Sonde', 'Radio astronomie', 'Lanceur', 'Météo spatiale', 'Exoplanètes']

const CATEGORY_COLORS: Record<string, string> = {
    'Télescope': '#10b981', 'Exploration': '#6366f1', 'Astéroïde': '#f59e0b',
    'Mars': '#ef4444', 'Sonde': '#3b82f6', 'Radio astronomie': '#8b5cf6',
    'Lanceur': '#06b6d4', 'Météo spatiale': '#f97316', 'Exoplanètes': '#a855f7',
}


export default function ActualitesPage() {
    const [loaded, setLoaded] = useState(false)
    const [search, setSearch] = useState('')
    const [catFilter, setCatFilter] = useState('Tous')

    useEffect(() => { setTimeout(() => setLoaded(true), 500) }, [])

    const filtered = STATIC_ARTICLES.filter(a =>
        (catFilter === 'Tous' || a.category === catFilter) &&
        (a.title.toLowerCase().includes(search.toLowerCase()) ||
            a.summary.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">📰 ACTU SPATIALE</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #bfdbfe, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Actualités
                </h1>
                <p className="page-subtitle">Les dernières découvertes et missions de l&apos;exploration spatiale</p>
            </motion.div>

            {/* Search */}
            <div style={{ marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 Rechercher un article..."
                    style={{
                        width: '100%', padding: '0.75rem 1.25rem', borderRadius: '1rem', fontSize: '0.875rem',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#e2e8f0', outline: 'none', fontFamily: 'inherit',
                    }}
                />
            </div>

            {/* Category chips */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {ALL_CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCatFilter(cat)} style={{
                        padding: '0.3rem 0.875rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        background: catFilter === cat ? `${CATEGORY_COLORS[cat] || '#6366f1'}18` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${catFilter === cat ? (CATEGORY_COLORS[cat] || '#6366f1') + '40' : 'rgba(255,255,255,0.07)'}`,
                        color: catFilter === cat ? (CATEGORY_COLORS[cat] || '#a78bfa') : '#64748b',
                        transition: 'all 0.15s',
                    }}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* Live data sources */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>📡 Sources en direct :</span>
                {[
                    { label: 'NASA Actualités', url: 'https://www.nasa.gov/news/', color: '#3b82f6' },
                    { label: 'ESA News', url: 'https://www.esa.int/Newsroom', color: '#6366f1' },
                    { label: 'CNRS Astrophysique', url: 'https://www.cnrs.fr/fr/themes/univers', color: '#10b981' },
                    { label: 'SpaceWeather.com', url: 'https://spaceweather.com/', color: '#f59e0b' },
                ].map(s => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                        padding: '0.375rem 0.875rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600,
                        background: `${s.color}12`, color: s.color, border: `1px solid ${s.color}30`,
                        textDecoration: 'none', transition: 'all 0.2s',
                    }}>{s.label} ↗</a>
                ))}
            </div>

            {/* Article grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {(loaded ? filtered : STATIC_ARTICLES.slice(0, 3)).map((a, i) => (
                    <motion.a
                        key={a.title}
                        href={a.url} target="_blank" rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="card"
                        style={{ padding: '1.5rem', textDecoration: 'none', display: 'block', cursor: 'pointer' }}
                        whileHover={{ y: -4, borderColor: `${CATEGORY_COLORS[a.category] || '#6366f1'}50` }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                            <span style={{
                                fontSize: '0.7rem', padding: '2px 10px', borderRadius: 999, fontWeight: 700,
                                background: `${CATEGORY_COLORS[a.category] || '#6366f1'}15`,
                                color: CATEGORY_COLORS[a.category] || '#a78bfa',
                                border: `1px solid ${CATEGORY_COLORS[a.category] || '#6366f1'}30`,
                                whiteSpace: 'nowrap',
                            }}>{a.category}</span>
                            <span style={{ color: '#475569', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{new Date(a.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <h3 style={{ color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.625rem' }}>{a.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7, marginBottom: '0.875rem' }}>{a.summary}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#475569', fontSize: '0.72rem' }}>📰 {a.source}</span>
                            <span style={{ color: '#6366f1', fontSize: '0.78rem', fontWeight: 600 }}>Lire →</span>
                        </div>
                    </motion.a>
                ))}
                {!loaded && [...Array(3)].map((_, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', opacity: 0.4 }}>
                        <div style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.1)', marginBottom: '0.75rem', width: '40%' }} />
                        <div style={{ height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.08)', marginBottom: '0.5rem' }} />
                        <div style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: '0.25rem' }} />
                        <div style={{ height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.06)', width: '70%' }} />
                    </div>
                ))}
            </div>

            {/* External resources */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>🔗 Ressources astronomiques</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { icon: '🌍', label: 'NASA Worldview', url: 'https://worldview.earthdata.nasa.gov/', desc: 'Images satellite en temps réel' },
                        { icon: '🌤️', label: 'Space Weather', url: 'https://spaceweather.com/', desc: 'Météo spatiale & aurores boréales' },
                        { icon: '☄️', label: 'Asteroid Watch', url: 'https://cneos.jpl.nasa.gov/', desc: 'Surveillance des astéroïdes' },
                        { icon: '📡', label: 'NASA Live', url: 'https://www.nasa.gov/live', desc: 'Diffusion en direct de la NASA' },
                        { icon: '🔭', label: 'Heavens-Above', url: 'https://www.heavens-above.com/', desc: 'Passages ISS & satellites' },
                        { icon: '🌌', label: 'Stellarium', url: 'https://stellarium-web.org/', desc: 'Planétarium en ligne gratuit' },
                    ].map(r => (
                        <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" style={{
                            padding: '0.875rem 1rem', borderRadius: '0.75rem', textDecoration: 'none',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex', gap: '0.625rem', alignItems: 'flex-start',
                            transition: 'all 0.2s',
                        }}>
                            <span style={{ fontSize: '1.3rem' }}>{r.icon}</span>
                            <div>
                                <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.82rem' }}>{r.label}</div>
                                <div style={{ color: '#475569', fontSize: '0.72rem' }}>{r.desc}</div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}
