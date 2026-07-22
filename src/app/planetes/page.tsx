'use client'

import { useState, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import KidsGuide from '@/components/KidsGuide'

const Planet3D = lazy(() => import('@/components/Planet3D'))
const SolarSystem2D = dynamic(() => import('@/components/SolarSystem2D'), { ssr: false })

const PLANETS = [
    { name: 'Mercure', emoji: '☿', texture: null, color: '#94a3b8', type: 'Rocheuse', gravity: 3.7, meanRadius: 2439.7, avgTemp: 440, density: 5.43, distSun: 57.9, moons: 0, orbit: 88, atmosphere: false, description: 'La plus petite et la plus proche du Soleil. Pas d\'atmosphère, températures extrêmes.', fun: 'Un jour sur Mercure dure 176 jours terrestres !' },
    { name: 'Vénus', emoji: '♀', texture: '/textures/venus.jpg', color: '#f59e0b', type: 'Rocheuse', gravity: 8.87, meanRadius: 6051.8, avgTemp: 737, density: 5.24, distSun: 108.2, moons: 0, orbit: 225, atmosphere: '#f59e0b', description: 'La plus chaude ! Son atmosphère de CO2 piège la chaleur. Le Soleil s\'y lève à l\'Ouest.', fun: 'Vénus tourne à l\'envers par rapport aux autres planètes !' },
    { name: 'Terre', emoji: '🌍', texture: '/textures/earth.jpg', color: '#3b82f6', type: 'Rocheuse', gravity: 9.81, meanRadius: 6371.0, avgTemp: 288, density: 5.51, distSun: 149.6, moons: 1, orbit: 365, atmosphere: '#3b82f6', description: 'Notre maison ! Seule planète connue à abriter la vie. 71% de sa surface est de l\'eau.', fun: 'La Terre est la seule planète non nommée d\'après un dieu romain.' },
    { name: 'Mars', emoji: '♂', texture: '/textures/mars.jpg', color: '#ef4444', type: 'Rocheuse', gravity: 3.72, meanRadius: 3389.5, avgTemp: 210, density: 3.93, distSun: 227.9, moons: 2, orbit: 687, atmosphere: '#ef444430', description: 'La planète rouge. Des rovers l\'explorent. Olympus Mons est le plus grand volcan du système solaire (21 km).', fun: 'Mars a le plus grand canyon du système solaire : Valles Marineris, 4 000 km de long !' },
    { name: 'Jupiter', emoji: '♃', texture: '/textures/jupiter.jpg', color: '#f97316', type: 'Géante gazeuse', gravity: 24.79, meanRadius: 69911, avgTemp: 165, density: 1.33, distSun: 778.5, moons: 101, orbit: 4333, atmosphere: '#f97316', description: 'La plus grande planète ! Sa Grande Tache Rouge est une immense tempête observée depuis très longtemps.', fun: 'La gravité de Jupiter peut éloigner certains petits objets, mais aussi modifier leur route vers l’intérieur du Système solaire.' },
    { name: 'Saturne', emoji: '♄', texture: '/textures/saturn.jpg', color: '#eab308', type: 'Géante gazeuse', gravity: 10.44, meanRadius: 58232, avgTemp: 134, density: 0.69, distSun: 1434, moons: 274, orbit: 10759, atmosphere: '#eab308', hasRings: true, description: 'Célèbre pour ses anneaux faits de milliards de morceaux de glace et de roche. C’est la planète qui possède le plus de lunes connues.', fun: 'Les anneaux s’étendent sur environ 282 000 km, mais ne mesurent souvent qu’une dizaine de mètres d’épaisseur !' },
    { name: 'Uranus', emoji: '♅', texture: null, color: '#67e8f9', type: 'Géante de glace', gravity: 8.69, meanRadius: 25362, avgTemp: 76, density: 1.27, distSun: 2871, moons: 28, orbit: 30687, atmosphere: '#67e8f9', description: 'La planète qui \'roule\' sur le côté. Découverte en 1781. Il y pleut peut-être des diamants.', fun: 'Uranus a une inclinaison de 98° — elle tourne sur le côté comme une toupie !' },
    { name: 'Neptune', emoji: '♆', texture: '/textures/neptune.jpg', color: '#6366f1', type: 'Géante de glace', gravity: 11.15, meanRadius: 24622, avgTemp: 72, density: 1.64, distSun: 4495, moons: 16, orbit: 60190, atmosphere: '#6366f1', description: 'La plus lointaine et la plus venteuse. Vents à 2 100 km/h ! Découverte en 1846 grâce aux maths.', fun: 'Neptune a été découverte mathématiquement avant même d\'être observée !' },
]

const maxRadius = Math.max(...PLANETS.map(p => p.meanRadius))

export default function PlanetesPage() {
    const [selected, setSelected] = useState(2)
    const [comp1, setComp1] = useState(2)
    const [comp2, setComp2] = useState(4)
    const p = PLANETS[selected]
    const pa = PLANETS[comp1]
    const pb = PLANETS[comp2]

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">🪐 SYSTÈME SOLAIRE</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #c7d2fe, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Planètes & Lunes
                </h1>
                <p className="page-subtitle">Observe, fais tourner et compare les huit mondes qui voyagent autour du Soleil.</p>
            </motion.div>

            <KidsGuide topic="planetes" />

            {/* Planet selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }} className="max-sm:grid-cols-2">
                {PLANETS.map((pl, i) => (
                    <button key={pl.name} onClick={() => setSelected(i)} style={{
                        padding: '0.75rem', borderRadius: '0.875rem', cursor: 'pointer', textAlign: 'center',
                        background: selected === i ? `${pl.color}15` : 'rgba(255,255,255,0.03)',
                        border: `2px solid ${selected === i ? pl.color : 'rgba(255,255,255,0.06)'}`,
                        color: selected === i ? pl.color : '#94a3b8', fontWeight: 700,
                        fontFamily: 'Outfit, sans-serif', transition: 'all 0.2s',
                        boxShadow: selected === i ? `0 0 20px ${pl.color}30` : 'none',
                    }}>
                        <div style={{ fontSize: '1.4rem', marginBottom: '0.2rem' }}>{pl.emoji}</div>
                        <div style={{ fontSize: '0.8rem' }}>{pl.name}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 1 }}>{pl.moons} lune{pl.moons !== 1 ? 's' : ''}</div>
                    </button>
                ))}
            </div>

            {/* 3D viewer + info panel */}
            <motion.div key={selected} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }} className="max-sm:grid-cols-1">
                    {/* 3D Globe */}
                    <div style={{ height: 280, borderRadius: '1rem', overflow: 'hidden', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)', position: 'relative' }}>
                        {p.texture ? (
                            <Suspense fallback={
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>{p.emoji}</div>
                            }>
                                <Planet3D
                                    textureUrl={p.texture}
                                    size={p.hasRings ? 1.6 : 2}
                                    rotationSpeed={0.003}
                                    hasRings={p.hasRings}
                                    atmosphereColor={typeof p.atmosphere === 'string' ? p.atmosphere : undefined}
                                />
                            </Suspense>
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ fontSize: '6rem', filter: `drop-shadow(0 0 30px ${p.color})` }}>{p.emoji}</div>
                                <span style={{ color: '#475569', fontSize: '0.72rem' }}>Texture non disponible</span>
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: '0.625rem', left: '50%', transform: 'translateX(-50%)', color: '#475569', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>🖱 Faire glisser pour tourner</div>
                    </div>

                    {/* Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
                            <h2 style={{ color: p.color, fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>{p.name}</h2>
                            <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: 999, background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}30` }}>{p.type}</span>
                        </div>
                        <p style={{ color: '#94a3b8', lineHeight: 1.75, marginBottom: '0.875rem', fontSize: '0.85rem' }}>{p.description}</p>
                        <div style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)', marginBottom: '1rem' }}>
                            <p style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.6 }}>💡 <strong>Le savais-tu ?</strong> {p.fun}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                            {[
                                { label: '⚖️ Gravité', val: `${p.gravity} m/s²` },
                                { label: '📏 Rayon', val: `${p.meanRadius.toLocaleString('fr-FR')} km` },
                                { label: '🌡️ Temp.', val: `${p.avgTemp} K` },
                                { label: '💎 Densité', val: `${p.density} g/cm³` },
                                { label: '☀️ Distance', val: `${p.distSun} M km` },
                                { label: '🔄 Orbite', val: `${p.orbit.toLocaleString('fr-FR')} j` },
                            ].map(s => (
                                <div key={s.label} style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ color: '#64748b', fontSize: '0.67rem', marginBottom: '0.1rem' }}>{s.label}</div>
                                    <div style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem' }}>{s.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Intro text */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#a5b4fc' }}>📘 Le système solaire</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem' }}>
                    Notre système solaire compte <strong style={{ color: '#e2e8f0' }}>8 planètes</strong>.
                    Les 4 premières sont des <strong style={{ color: '#f97316' }}>planètes rocheuses</strong> (Mercure, Vénus, Terre, Mars).
                    Les 4 suivantes sont des <strong style={{ color: '#6366f1' }}>géantes gazeuses ou de glace</strong> (Jupiter, Saturne, Uranus, Neptune).
                    Les modèles 3D utilisent les <strong style={{ color: '#e2e8f0' }}>textures officielles de la NASA</strong>.
                </p>
            </div>

            {/* Size comparison bars */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>📊 Comparaison des tailles</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {PLANETS.map(pl => (
                        <div key={pl.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setSelected(PLANETS.indexOf(pl))}>
                            <div style={{ width: 72, color: selected === PLANETS.indexOf(pl) ? pl.color : '#94a3b8', fontSize: '0.75rem', textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>{pl.emoji} {pl.name}</div>
                            <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 6, overflow: 'hidden', height: 18 }}>
                                <motion.div
                                    initial={{ width: 0 }} animate={{ width: `${(pl.meanRadius / maxRadius) * 100}%` }} transition={{ duration: 0.8 }}
                                    style={{ height: '100%', background: `linear-gradient(90deg, ${pl.color}70, ${pl.color})`, borderRadius: 6 }}
                                />
                            </div>
                            <div style={{ width: 84, color: '#64748b', fontSize: '0.68rem', flexShrink: 0 }}>{pl.meanRadius.toLocaleString('fr-FR')} km</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── TAILLE RELATIVE ── */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '0.25rem' }}>🔭 Taille des planètes comparée à la Terre</h2>
                <p style={{ color: '#475569', fontSize: '0.72rem', marginBottom: '1.25rem' }}>Chaque cercle est proportionnel au vrai rayon — Jupiter pourrait contenir 1 300 Terres !</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', padding: '1rem 0' }}>
                    {PLANETS.map((pl, i) => {
                        const maxPx = 76
                        const minPx = 6
                        const px = minPx + (pl.meanRadius / 69911) * (maxPx - minPx)
                        const xTimes = (pl.meanRadius / PLANETS[2].meanRadius).toFixed(1)
                        const isEarth = pl.name === 'Terre'
                        return (
                            <div key={pl.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}
                                onClick={() => setSelected(i)}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{
                                        width: px * 2, height: px * 2, borderRadius: '50%',
                                        background: `radial-gradient(circle at 35% 35%, ${pl.color}cc, ${pl.color}33)`,
                                        border: `2px solid ${selected === i ? pl.color : pl.color + '44'}`,
                                        boxShadow: selected === i ? `0 0 22px ${pl.color}55` : isEarth ? `0 0 10px ${pl.color}35` : 'none',
                                        transition: 'all 0.2s',
                                    }} />
                                    {isEarth && <div style={{ position: 'absolute', top: -5, right: -5, background: '#3b82f6', borderRadius: 99, padding: '1px 4px', fontSize: '0.48rem', color: '#fff', fontWeight: 700 }}>🌍 REF</div>}
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.65rem', color: pl.color, fontWeight: 700 }}>{pl.name}</div>
                                    <div style={{ fontSize: '0.55rem', color: '#475569' }}>×{xTimes} Terre</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.62rem', marginTop: '0.25rem' }}>Clique sur une planète pour l&apos;explorer · ×1.0 = Terre (rayon 6 371 km)</p>
            </div>

            {/* Comparator */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>⚖️ Comparateur</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }} className="max-sm:grid-cols-1">
                    {[{ v: comp1, set: setComp1 }, { v: comp2, set: setComp2 }].map((c, ci) => (
                        <div key={ci}>
                            <label htmlFor={`planet-compare-${ci}`} style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.3rem', display: 'block' }}>Planète {ci + 1}</label>
                            <select id={`planet-compare-${ci}`} value={c.v} onChange={e => c.set(parseInt(e.target.value))} style={{
                                width: '100%', padding: '0.5rem 0.75rem', borderRadius: 9, fontSize: '0.85rem',
                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                color: '#e2e8f0', outline: 'none',
                            }}>
                                {PLANETS.map((pl, i) => <option key={i} value={i} style={{ background: '#0f172a' }}>{pl.emoji} {pl.name}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                {/* Visual size duel */}
                {comp1 !== comp2 && (() => {
                    const bigger = pa.meanRadius > pb.meanRadius ? pa : pb
                    const smaller = pa.meanRadius > pb.meanRadius ? pb : pa
                    const ratio = (bigger.meanRadius / smaller.meanRadius).toFixed(1)
                    return (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', padding: '0.875rem', marginBottom: '1rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.2)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: 70, height: 70, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${bigger.color}cc, ${bigger.color}22)`, border: `2px solid ${bigger.color}55`, margin: '0 auto 0.25rem' }} />
                                <div style={{ color: bigger.color, fontSize: '0.7rem', fontWeight: 700 }}>{bigger.name}</div>
                            </div>
                            <div style={{ textAlign: 'center', color: '#475569' }}>
                                <div style={{ fontSize: '1.3rem', color: '#94a3b8', fontWeight: 900 }}>×{ratio}</div>
                                <div style={{ fontSize: '0.58rem' }}>plus grande</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ width: Math.max(10, 70 / parseFloat(ratio)), height: Math.max(10, 70 / parseFloat(ratio)), borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${smaller.color}cc, ${smaller.color}22)`, border: `2px solid ${smaller.color}55`, margin: '0 auto 0.25rem' }} />
                                <div style={{ color: smaller.color, fontSize: '0.7rem', fontWeight: 700 }}>{smaller.name}</div>
                            </div>
                        </div>
                    )
                })()}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="max-sm:grid-cols-1">
                    {[pa, pb].map((pl, ci) => (
                        <div key={ci} style={{ padding: '1.25rem', borderRadius: '0.875rem', background: `${pl.color}08`, border: `2px solid ${pl.color}25`, textAlign: 'center' }}>
                            {pl.texture ? (
                                <div style={{ height: 120, borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '0.75rem', background: 'rgba(0,0,0,0.5)' }}>
                                    <Suspense fallback={<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>{pl.emoji}</div>}>
                                        <Planet3D textureUrl={pl.texture} size={1.4} hasRings={pl.hasRings} atmosphereColor={typeof pl.atmosphere === 'string' ? pl.atmosphere : undefined} />
                                    </Suspense>
                                </div>
                            ) : (
                                <div style={{ fontSize: '3rem', marginBottom: '0.75rem', filter: `drop-shadow(0 0 15px ${pl.color})` }}>{pl.emoji}</div>
                            )}
                            <h3 style={{ color: pl.color, fontFamily: 'Outfit, sans-serif', fontWeight: 800, marginBottom: '0.625rem' }}>{pl.name}</h3>
                            {[
                                { l: 'Rayon', v: `${pl.meanRadius.toLocaleString('fr-FR')} km` },
                                { l: 'Gravité', v: `${pl.gravity} m/s²` },
                                { l: 'Température', v: `${pl.avgTemp} K (${(pl.avgTemp - 273).toFixed(0)}°C)` },
                                { l: 'Densité', v: `${pl.density} g/cm³` },
                                { l: 'Lunes', v: `${pl.moons}` },
                            ].map(s => (
                                <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem' }}>
                                    <span style={{ color: '#64748b' }}>{s.l}</span>
                                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{s.v}</span>
                                </div>
                            ))}
                            {comp1 !== comp2 && (
                                <div style={{ marginTop: '0.75rem', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(0,0,0,0.2)', fontSize: '0.75rem', color: '#94a3b8' }}>
                                    Si tu pèses 30 kg → <strong style={{ color: pl.color }}>{(30 * pl.gravity / 9.81).toFixed(1)} kg</strong> sur {pl.name}
                                </div>
                            )}
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: `${pl.color}08`, border: `1px solid ${pl.color}15`, fontSize: '0.68rem', color: '#94a3b8', lineHeight: 1.5, textAlign: 'left' }}>
                                💡 {pl.fun}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Full table */}
            <h2 className="section-title" style={{ color: '#e2e8f0' }}>📋 Tableau des planètes</h2>
            <div style={{ overflow: 'auto', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', minWidth: 700 }}>
                    <thead>
                        <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                            {['Planète', 'Type', 'Rayon (km)', 'Gravité', 'Temp (K)', 'Densité', 'Dist. ☀️', 'Lunes', 'Orbite'].map(h => (
                                <th key={h} style={{ padding: '0.675rem 0.875rem', textAlign: 'left', color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PLANETS.map((pl, i) => (
                            <tr key={pl.name} tabIndex={0} onClick={() => setSelected(i)} onKeyDown={event => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault()
                                    setSelected(i)
                                }
                            }} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selected === i ? `${pl.color}08` : 'transparent', transition: 'background 0.2s' }}>
                                <td style={{ padding: '0.625rem 0.875rem', whiteSpace: 'nowrap' }}><span style={{ color: pl.color, fontWeight: 700 }}>{pl.emoji} {pl.name}</span></td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#94a3b8' }}>{pl.type}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.meanRadius.toLocaleString('fr-FR')}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.gravity}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.avgTemp}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.density}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.distSun} M km</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.moons}</td>
                                <td style={{ padding: '0.625rem 0.875rem', color: '#e2e8f0' }}>{pl.orbit.toLocaleString('fr-FR')} j</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── SOLAR SYSTEM TODAY ── */}
            <div className="divider" />
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <Suspense fallback={<div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Chargement des positions…</div>}>
                    <SolarSystem2D />
                </Suspense>
            </div>
        </div>
    )
}
