'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const SpaceXSection = dynamic(() => import('@/components/SpaceXSection'), { ssr: false })

const MISSIONS = [
    { name: 'Spoutnik 1', annee: 1957, pays: 'URSS', type: 'Satellite', statut: 'Terminée', emoji: '📡', color: '#94a3b8', description: "Le tout premier satellite artificiel ! Il a fait 'bip bip' pendant 21 jours autour de la Terre.", fun: "Spoutnik signifie 'compagnon de voyage' en russe." },
    { name: 'Vostok 1 (Gagarine)', annee: 1961, pays: 'URSS', type: 'Vol habité', statut: 'Terminée', emoji: '👨‍🚀', color: '#6366f1', description: "Youri Gagarine devient le premier humain dans l'espace ! Son vol a duré 108 minutes.", fun: "Gagarine a dit 'Поехали !' (C'est parti !) au décollage." },
    { name: 'Apollo 11', annee: 1969, pays: 'USA', type: 'Vol habité', statut: 'Terminée', emoji: '🌙', color: '#6366f1', description: "Neil Armstrong et Buzz Aldrin marchent sur la Lune. 'Un petit pas pour l'homme, un bond de géant pour l'humanité.'", fun: "Armstrong a failli ne pas atterrir : il restait 25 secondes de carburant !" },
    { name: 'Voyager 1', annee: 1977, pays: 'USA', type: 'Sonde', statut: 'Active', emoji: '🛸', color: '#f59e0b', description: "La sonde la plus lointaine de l'humanité. Elle est maintenant dans l'espace interstellaire, à plus de 24 milliards de km !", fun: "Voyager 1 emporte un disque d'or avec des sons de la Terre, au cas où des extraterrestres le trouveraient." },
    { name: 'Hubble', annee: 1990, pays: 'USA/ESA', type: 'Télescope', statut: 'Active', emoji: '🔭', color: '#10b981', description: "Le télescope spatial qui a révolutionné notre vision de l'Univers. Il a photographié des galaxies à 13 milliards d'années-lumière.", fun: "Hubble fait le tour de la Terre en 97 minutes, à 547 km d'altitude." },
    { name: 'ISS', annee: 1998, pays: 'International', type: 'Station', statut: 'Active', emoji: '🛰️', color: '#3b82f6', description: "Un laboratoire de la taille d'un terrain de football qui orbite à 400 km. Des astronautes y vivent en permanence depuis 2000.", fun: "L'ISS est visible à l'œil nu ! Elle ressemble à une étoile brillante qui se déplace." },
    { name: 'Curiosity (Mars)', annee: 2012, pays: 'USA', type: 'Rover', statut: 'Active', emoji: '🤖', color: '#ef4444', description: "Un rover de la taille d'une voiture qui explore le cratère Gale sur Mars. Il a découvert que Mars avait eu des conditions favorables à la vie.", fun: "Curiosity se chante 'Joyeux Anniversaire' chaque année, tout seul sur Mars !" },
    { name: 'Rosetta / Philae', annee: 2014, pays: 'ESA', type: 'Sonde', statut: 'Terminée', emoji: '☄️', color: '#f59e0b', description: "Première sonde à se mettre en orbite autour d'une comète et à y poser un atterrisseur (Philae).", fun: "Le voyage a duré 10 ans pour atteindre la comète Tchouri !" },
    { name: 'New Horizons', annee: 2015, pays: 'USA', type: 'Sonde', statut: 'Active', emoji: '🛸', color: '#f59e0b', description: "Première sonde à survoler Pluton ! Elle a révélé un monde avec des montagnes de glace et un cœur géant.", fun: "New Horizons contient une partie des cendres de Clyde Tombaugh, le découvreur de Pluton." },
    { name: 'James Webb (JWST)', annee: 2021, pays: 'USA/ESA/CSA', type: 'Télescope', statut: 'Active', emoji: '🔭', color: '#10b981', description: "Le plus puissant télescope spatial jamais construit. Il observe l'Univers en infrarouge et voit les premières galaxies nées après le Big Bang.", fun: "Son miroir fait 6.5 mètres de diamètre, mais si poli que la surface n'a que 25 nanomètres d'irrégularités." },
    { name: 'Perseverance (Mars)', annee: 2021, pays: 'USA', type: 'Rover', statut: 'Active', emoji: '🤖', color: '#ef4444', description: "Le dernier rover martien, accompagné d'Ingenuity, le premier hélicoptère à voler sur une autre planète !", fun: "Le nom 'Perseverance' a été choisi par un élève de 7ème lors d'un concours." },
    { name: 'Artemis I', annee: 2022, pays: 'USA', type: 'Vol habité', statut: 'Terminée', emoji: '🚀', color: '#6366f1', description: "Premier vol du programme Artemis. La capsule Orion a fait le tour de la Lune sans équipage.", fun: "Cette mission a validé le lanceur SLS et le vaisseau Orion avant le premier vol habité." },
    { name: 'JUICE', annee: 2023, pays: 'ESA', type: 'Sonde', statut: 'Active', emoji: '🛸', color: '#f59e0b', description: "Mission vers Jupiter et ses lunes glacées (Europe, Ganymède, Callisto) pour chercher des océans et de la vie.", fun: "JUICE arrivera près de Jupiter en 2031, après 8 ans de voyage !" },
    { name: 'Artemis II', annee: 2026, pays: 'USA/CSA', type: 'Vol habité', statut: 'Terminée', emoji: '🚀', color: '#6366f1', description: "Premier vol habité du programme Artemis. Orion a emmené quatre astronautes autour de la Lune du 1er au 10 avril 2026.", fun: "L'équipage a dépassé le record de distance d'Apollo 13 avant de revenir dans le Pacifique." },
]

interface UpcomingLaunch {
    id: string
    name: string
    net: string
    agency: string
    rocket: string
    status: string
    image: string | null
}

const TYPE_COLORS: Record<string, string> = {
    'Satellite': '#94a3b8', 'Vol habité': '#6366f1', 'Sonde': '#f59e0b', 'Télescope': '#10b981', 'Rover': '#ef4444', 'Station': '#3b82f6',
}

const ALL_TYPES = ['Satellite', 'Vol habité', 'Sonde', 'Télescope', 'Rover', 'Station']

export default function MissionsPage() {
    const [typeFilter, setTypeFilter] = useState<string[]>(ALL_TYPES)
    const [statutFilter, setStatutFilter] = useState<'Toutes' | 'Active' | 'Terminée'>('Toutes')
    const [launches, setLaunches] = useState<UpcomingLaunch[]>([])
    const [launchLoading, setLaunchLoading] = useState(true)

    useEffect(() => {
        fetch('/api/launches?limit=5')
            .then(r => {
                if (!r.ok) throw new Error('launch calendar unavailable')
                return r.json()
            })
            .then(d => {
                setLaunches(d.launches || [])
            })
            .catch(() => { })
            .finally(() => setLaunchLoading(false))
    }, [])

    const filtered = MISSIONS.filter(m =>
        typeFilter.includes(m.type) &&
        (statutFilter === 'Toutes' || m.statut === statutFilter)
    )

    const active = MISSIONS.filter(m => m.statut === 'Active').length

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge">🚀 EXPLORATION SPATIALE</div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #c7d2fe, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Missions Spatiales
                </h1>
                <p className="page-subtitle">De Spoutnik à Artemis : 70 ans d&apos;aventures humaines dans l&apos;espace !</p>
            </motion.div>

            {/* Intro */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#a5b4fc' }}>🌌 70 ans d&apos;exploration spatiale</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.875rem' }}>
                    Depuis le premier satellite <strong style={{ color: '#e2e8f0' }}>Spoutnik</strong> en 1957, l&apos;humanité n&apos;a jamais cessé d&apos;explorer l&apos;espace.
                    Des premiers pas sur la Lune aux rovers sur Mars, en passant par les télescopes qui voient les premières lumières de l&apos;Univers,
                    chaque mission repousse les limites de notre connaissance.
                </p>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Missions totales', val: `${MISSIONS.length}`, color: '#6366f1' },
                    { label: 'Actives', val: `${active}`, color: '#10b981' },
                    { label: 'Pays/Agences', val: '8', color: '#f59e0b' },
                    { label: 'Types de missions', val: `${ALL_TYPES.length}`, color: '#3b82f6' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: 900, background: s.color, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.val}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Upcoming Launches ── */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>🚀 Prochains lancements</h2>
                <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>Données en direct via The Space Devs</p>
                {launchLoading ? (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {[...Array(3)].map((_, i) => <div key={i} style={{ flexShrink: 0, width: 260, height: 120, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)' }} />)}
                    </div>
                ) : launches.length === 0 ? (
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: '#475569' }}>Aucun lancement disponible pour le moment.</div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                        {launches.map((l, i) => {
                            const d = new Date(l.net)
                            const daysUntil = Math.floor((d.getTime() - Date.now()) / 86400000)
                            return (
                                <motion.div key={l.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                    className="card" style={{ flexShrink: 0, width: 280, padding: '1.1rem', position: 'relative', overflow: 'hidden' }}>
                                    {l.image && <img src={l.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />}
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                {daysUntil <= 0 ? '🔴 Imminent' : `Dans ${daysUntil}j`}
                                            </span>
                                            {i === 0 && <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>Prochain</span>}
                                        </div>
                                        <h3 style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Outfit', marginBottom: '0.25rem', lineHeight: 1.3 }}>{l.name}</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.375rem' }}>{l.rocket}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#475569', fontSize: '0.68rem' }}>🏢 {l.agency.length > 28 ? l.agency.slice(0, 28) + '…' : l.agency}</span>
                                            <span style={{ color: '#475569', fontSize: '0.67rem' }}>{d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#e2e8f0' }}>📅 Timeline chronologique</h2>
                <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 700, position: 'relative' }}>
                        <div style={{ position: 'absolute', height: 2, background: 'rgba(255,255,255,0.1)', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 0 }} />
                        {MISSIONS.map((m, i) => (
                            <div key={m.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>{m.annee}</div>
                                <div title={m.name} style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: m.statut === 'Active' ? `linear-gradient(135deg, ${TYPE_COLORS[m.type]}, ${TYPE_COLORS[m.type]}80)` : 'rgba(255,255,255,0.1)',
                                    border: `2px solid ${TYPE_COLORS[m.type]}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem',
                                    boxShadow: m.statut === 'Active' ? `0 0 12px ${TYPE_COLORS[m.type]}60` : 'none',
                                    cursor: 'help',
                                }}>
                                    {m.emoji}
                                </div>
                                <div style={{ fontSize: '0.58rem', color: '#475569', marginTop: '0.25rem', textAlign: 'center', whiteSpace: 'nowrap', maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name.split(' ')[0]}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.875rem' }}>
                    {Object.entries(TYPE_COLORS).map(([t, c]) => (
                        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                            <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{t}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {ALL_TYPES.map(t => (
                        <button key={t} onClick={() => setTypeFilter(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])} style={{
                            padding: '0.35rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            background: typeFilter.includes(t) ? `${TYPE_COLORS[t]}15` : 'rgba(255,255,255,0.04)',
                            color: typeFilter.includes(t) ? TYPE_COLORS[t] : '#64748b',
                            border: `1px solid ${typeFilter.includes(t) ? TYPE_COLORS[t] + '40' : 'rgba(255,255,255,0.07)'}`,
                        }}>{t}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {(['Toutes', 'Active', 'Terminée'] as const).map(s => (
                        <button key={s} onClick={() => setStatutFilter(s)} style={{
                            padding: '0.35rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            background: statutFilter === s ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                            color: statutFilter === s ? '#a5b4fc' : '#64748b',
                            border: statutFilter === s ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                        }}>{s === 'Active' ? '🟢 Actives' : s === 'Terminée' ? '⚫ Terminées' : '📋 Toutes'}</button>
                    ))}
                </div>
            </div>

            {/* Mission cards */}
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1rem' }}>{filtered.length} mission{filtered.length > 1 ? 's' : ''}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map(m => (
                    <motion.div key={m.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${TYPE_COLORS[m.type]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <span style={{ fontSize: '1.3rem' }}>{m.emoji}</span>
                                <h3 style={{ color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1rem' }}>{m.name}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: `${TYPE_COLORS[m.type]}15`, color: TYPE_COLORS[m.type] }}>{m.type}</span>
                                {m.statut === 'Active' ? (
                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} /> Active
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(100,116,139,0.1)', color: '#64748b' }}>Terminée</span>
                                )}
                            </div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{m.annee} · {m.pays}</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>{m.description}</p>
                        <p style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.6 }}>💡 {m.fun}</p>
                    </motion.div>
                ))}
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(0.8)}}`}</style>

            {/* ─── SpaceX Section — appended below existing content ─── */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <SpaceXSection />
            </div>
        </div>
    )
}
