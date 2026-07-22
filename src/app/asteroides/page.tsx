'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const FAMOUS_ASTEROIDS = [
    { name: 'Bennu', size: '490 m', danger: true, color: '#ef4444', description: "L'astéroïde le plus étudié. La sonde OSIRIS-REx en a ramené des échantillons sur Terre en 2023 ! Il a 1 chance sur 2 700 d'impacter la Terre en 2182.", fun: 'Bennu fait un tour sur lui-même en 4h 17min et projette des cailloux dans l\'espace comme un petit volcan !' },
    { name: 'Apophis', size: '370 m', danger: true, color: '#f59e0b', description: "En 2004, il a fait peur au monde entier avec 2.7% de chance d'impact en 2029. Le risque est écarté — il passera à seulement 31 000 km de la Terre le 13 avril 2029 !", fun: 'Il passera plus près que nos satellites géostationnaires. On pourra le voir à l\'œil nu !' },
    { name: 'Ryugu', size: '900 m', danger: false, color: '#6366f1', description: "La sonde japonaise Hayabusa2 a atterri dessus et ramené des échantillons en 2020. Il contient des acides aminés, les briques de la vie !", fun: 'Ryugu a la forme d\'une toupie et il est si poreux qu\'il est constitué à 50% de vide.' },
    { name: 'Dimorphos', size: '160 m', danger: false, color: '#10b981', description: "Premier astéroïde dont l'humanité a modifié l'orbite ! La mission DART de la NASA l'a percuté en 2022 pour tester notre défense planétaire.", fun: "L'impact a créé un nuage de débris de 10 000 km de long et a raccourci son orbite de 33 minutes." },
    { name: 'Cérès', size: '940 km', danger: false, color: '#3b82f6', description: "Le plus gros objet de la ceinture d'astéroïdes, classé comme 'planète naine'. La sonde Dawn l'a étudié de 2015 à 2018.", fun: 'Cérès contient plus d\'eau douce que toute la Terre ! Elle est cachée sous sa croûte rocheuse.' },
    { name: 'Vesta', size: '525 km', danger: false, color: '#a78bfa', description: "Le 2e plus gros astéroïde. Vesta a un énorme cratère d'impact (Rheasilvia) qui fait presque sa taille !", fun: 'Des morceaux de Vesta sont tombés sur Terre sous forme de météorites. On en a retrouvé en Antarctique !' },
]

const VIDEOS = [
    { title: 'DART : la NASA dévie un astéroïde', url: 'https://www.youtube.com/watch?v=4RA8Tfa6Sck', description: 'La mission historique DART qui a percuté l\'astéroïde Dimorphos en 2022.', age: '8-14 ans' },
    { title: "C'est pas Sorcier — Les météorites", url: 'https://www.youtube.com/watch?v=4nCMi4hiYTw', description: 'Fred et Jamy expliquent les astéroïdes, météorites et comètes.', age: '7-14 ans' },
    { title: 'L\'astéroïde qui a tué les dinosaures', url: 'https://www.youtube.com/watch?v=dFCbJmgeHmA', description: 'Il y a 66 millions d\'années, un astéroïde de 10 km a changé l\'histoire de la Terre.', age: '8-14 ans' },
    { title: 'OSIRIS-REx : rapporter un morceau d\'astéroïde', url: 'https://www.youtube.com/watch?v=bPUbaqxFnBg', description: 'Comment la sonde a collecté des échantillons de Bennu et les a ramenés sur Terre.', age: '10-14 ans' },
]

const SIZE_COMPARISONS = [
    { label: 'Personne (1.7m)', size: 1.7, color: '#10b981' },
    { label: 'Bus (12m)', size: 12, color: '#3b82f6' },
    { label: 'Terrain de foot (100m)', size: 100, color: '#6366f1' },
    { label: 'Dimorphos (160m)', size: 160, color: '#a78bfa' },
    { label: 'Tour Eiffel (330m)', size: 330, color: '#f59e0b' },
    { label: 'Apophis (370m)', size: 370, color: '#f59e0b' },
    { label: 'Bennu (490m)', size: 490, color: '#ef4444' },
    { label: 'Astéroïde dinosaures (10km)', size: 10000, color: '#dc2626' },
]

interface Asteroid { id: string; name: string; date: string; distKm: string; diamMin: number; dangerous: boolean }

export default function AsteroidsPage() {
    const [asteroids, setAsteroids] = useState<Asteroid[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [updatedAt, setUpdatedAt] = useState<string | null>(null)
    const maxSize = Math.max(...SIZE_COMPARISONS.map(s => s.size))

    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/asteroids', { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error('NASA NeoWs unavailable')
                return r.json()
            })
            .then(data => {
                const list = Array.isArray(data.asteroids) ? data.asteroids : []
                setAsteroids(list.slice(0, 20))
                setUpdatedAt(data.updatedAt || null)
                setLoading(false)
            }).catch(fetchError => {
                if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
                setError(true)
                setLoading(false)
            })
        return () => controller.abort()
    }, [])

    const total = asteroids.length
    const dangerous = asteroids.filter(a => a.dangerous).length

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">☄️ DÉFENSE PLANÉTAIRE</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Astéroïdes
                </h1>
                <p className="page-subtitle">Surveillance des objets géants croisant l&apos;orbite terrestre</p>
            </motion.div>

            {/* Explainer */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24' }}>🪨 C&apos;est quoi un astéroïde ?</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    Un astéroïde, c&apos;est un <strong style={{ color: '#e2e8f0' }}>gros rocher qui flotte dans l&apos;espace</strong> !
                    La plupart se trouvent entre Mars et Jupiter dans la &quot;ceinture d&apos;astéroïdes&quot;, mais certains passent parfois près de la Terre.
                    La NASA les surveille <strong style={{ color: '#e2e8f0' }}>24h/24</strong> avec des télescopes spéciaux.
                </p>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem', marginBottom: '0.875rem' }}>
                    Les scientifiques classent certains astéroïdes comme <strong style={{ color: '#ef4444' }}>&quot;potentiellement dangereux&quot;</strong> quand ils passent à moins de 7,5 millions de km de la Terre ET font plus de 140 mètres.
                    Pour comparer : la Tour Eiffel fait 330 mètres, et un terrain de foot fait 100 mètres.
                </p>
                <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p style={{ color: '#f59e0b', fontSize: '0.82rem' }}>
                        🛡️ <strong>Programme de défense planétaire :</strong> depuis la mission <strong>DART</strong> en 2022, l&apos;humanité sait dévier un astéroïde en le percutant avec une sonde. Première fois qu&apos;on modifie l&apos;orbite d&apos;un objet céleste !
                    </p>
                </div>
            </div>

            {/* Live KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Proches cette semaine', val: loading ? '...' : `${total}`, color: '#6366f1' },
                    { label: 'Potentiellement dangereux', val: loading ? '...' : `${dangerous}`, color: '#ef4444' },
                    { label: 'Fenêtre analysée', val: '7 jours', color: '#f59e0b' },
                    { label: 'Source', val: 'NeoWs', color: '#10b981' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.6rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Live close approaches table */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <h2 className="section-title" style={{ color: '#e2e8f0' }}>🔴 Passages proches cette semaine (NASA NeoWs)</h2>
                    {updatedAt && <span style={{ color: '#64748b', fontSize: '0.68rem' }}>Actualisé à {new Date(updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>}
                </div>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>⏳ Chargement des données NASA...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#f59e0b' }}>📡 Le service NASA NeoWs est temporairement indisponible.</div>
                ) : (
                    <div style={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', minWidth: 600 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                    {['Nom', 'Date approche', 'Distance (km)', 'Diamètre min (m)', 'Dangereux'].map(h => (
                                        <th key={h} style={{ padding: '0.625rem 0.875rem', textAlign: 'left', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {asteroids.map(a => (
                                    <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}>
                                        <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0', fontWeight: 600, whiteSpace: 'nowrap' }}>{a.name.replace(/[()]/g, '')}</td>
                                        <td style={{ padding: '0.625rem 0.875rem', color: '#94a3b8' }}>{a.date}</td>
                                        <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{parseInt(a.distKm).toLocaleString('fr-FR')}</td>
                                        <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{a.diamMin}</td>
                                        <td style={{ padding: '0.625rem 0.875rem' }}>
                                            {a.dangerous ? <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Oui</span> : <span style={{ color: '#10b981' }}>✅ Non</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Size comparisons */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>📏 Échelle de comparaison (échelle logarithmique)</h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Les barres utilisent une comparaison visuelle proportionnelle.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {SIZE_COMPARISONS.map(s => (
                        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 200, color: '#94a3b8', fontSize: '0.78rem', flexShrink: 0 }}>{s.label}</div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', height: 14 }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.log10(s.size + 1) / Math.log10(maxSize + 1) * 100}%` }}
                                    transition={{ duration: 0.8 }}
                                    style={{ height: '100%', background: `linear-gradient(90deg, ${s.color}80, ${s.color})`, borderRadius: 6 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Famous asteroids */}
            <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '1rem' }}>⭐ Astéroïdes célèbres</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {FAMOUS_ASTEROIDS.map(a => (
                    <div key={a.name} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${a.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <h3 style={{ color: a.color, fontFamily: 'Outfit, sans-serif', fontWeight: 800 }}>{a.name}</h3>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{a.size}</span>
                        </div>
                        {a.danger && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginBottom: '0.5rem' }}>⚠️ Potentiellement dangereux</div>}
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{a.description}</p>
                        <p style={{ color: '#f59e0b', fontSize: '0.8rem', lineHeight: 1.6 }}>💡 {a.fun}</p>
                    </div>
                ))}
            </div>

            {/* Videos */}
            <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '1rem' }}>🎬 Vidéos éducatives</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {VIDEOS.map(v => (
                    <div key={v.title} className="card" style={{ padding: '1.25rem' }}>
                        <h3 style={{ color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{v.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{v.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.72rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: 999 }}>{v.age}</span>
                            <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none', padding: '0.4rem 0.875rem', fontSize: '0.78rem' }}>
                                ▶ YouTube
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Links */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>🔗 En savoir plus</h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {[
                        { label: 'CNEOS Close Approach Data', url: 'https://cneos.jpl.nasa.gov/ca/', desc: 'Prochains passages d\'astéroïdes près de la Terre (NASA JPL)' },
                        { label: 'Asteroid Watch 3D', url: 'https://eyes.nasa.gov/apps/asteroids/', desc: 'Visualisation 3D des astéroïdes en temps réel' },
                        { label: 'Small-Body Database', url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html', desc: 'Base de données de tous les astéroïdes connus' },
                        { label: 'Mission DART', url: 'https://dart.jhuapl.edu/', desc: 'Le programme de défense planétaire' },
                    ].map(l => (
                        <li key={l.label}>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa' }}>{l.label}</a>
                            <span style={{ color: '#475569' }}> — {l.desc}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
