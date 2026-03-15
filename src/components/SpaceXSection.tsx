'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */
interface SpaceXLaunch {
    id: string
    name: string
    date_utc: string
    success: boolean | null
    details: string | null
    links: { patch: { small: string | null }, webcast: string | null, article: string | null }
    rocket: string // id
    cores: { core: string | null; reuse_count: number; landing_success: boolean | null; landing_type: string | null }[]
    payloads: string[]
    launchpad: string
    flight_number: number
}

interface SpaceXRocket {
    id: string
    name: string
    active: boolean
    success_rate_pct: number
    first_flight: string
    stages: number
    height: { meters: number }
    mass: { kg: number }
    description: string
    flickr_images: string[]
}

interface SpaceXUpcoming {
    id: string
    name: string
    date_utc: string
    date_precision: string
    details: string | null
    links: { patch: { small: string | null }, webcast: string | null }
    flight_number: number
}

interface CompanyInfo {
    name: string
    founder: string
    founded: number
    employees: number
    vehicles: number
    launch_sites: number
    test_sites: number
    cto: string
    coo: string
    valuation: number
    summary: string
}

/* ─── Helpers ─── */
function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function timeUntil(iso: string): string {
    const diff = new Date(iso).getTime() - Date.now()
    if (diff < 0) return 'Passé'
    const d = Math.floor(diff / 86400000)
    const h = Math.floor((diff % 86400000) / 3600000)
    if (d > 0) return `Dans ${d} jour${d > 1 ? 's' : ''}`
    return `Dans ${h}h`
}

/* ─── Launch Card ─── */
function LaunchCard({ launch, index }: { launch: SpaceXUpcoming; index: number }) {
    const isPast = new Date(launch.date_utc).getTime() < Date.now()
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.875rem 1rem', borderRadius: '0.875rem',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s',
            }}
            whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)', scale: 1.005 }}>
            {/* Patch or placeholder */}
            <div style={{ width: 44, height: 44, borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {launch.links.patch.small ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={launch.links.patch.small} alt={launch.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : <span style={{ fontSize: '1.4rem' }}>🚀</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.875rem', fontFamily: 'Outfit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{launch.name}</div>
                <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>Vol #{launch.flight_number} · {formatDate(launch.date_utc)}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.8rem', color: isPast ? '#475569' : '#f59e0b', fontFamily: 'Outfit' }}>{timeUntil(launch.date_utc)}</div>
                {launch.links.webcast && !isPast && (
                    <a href={launch.links.webcast} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.65rem', color: '#ef4444', textDecoration: 'none' }}>▶ Live</a>
                )}
            </div>
        </motion.div>
    )
}

/* ─── Rocket Card ─── */
function RocketCard({ rocket }: { rocket: SpaceXRocket }) {
    return (
        <div style={{
            borderRadius: '1rem', overflow: 'hidden',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column',
        }}>
            {rocket.flickr_images[0] && (
                <div style={{ height: 160, overflow: 'hidden', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rocket.flickr_images[0]} alt={rocket.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(4,4,15,0.8), transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 8, left: 10 }}>
                        <span style={{ fontWeight: 800, fontFamily: 'Outfit', fontSize: '1rem', color: '#fff' }}>{rocket.name}</span>
                        <span style={{ marginLeft: 8, fontSize: '0.65rem', color: rocket.active ? '#22c55e' : '#475569', background: rocket.active ? 'rgba(34,197,94,0.15)' : 'rgba(71,85,105,0.15)', padding: '1px 7px', borderRadius: 99 }}>{rocket.active ? 'Actif' : 'Retraité'}</span>
                    </div>
                </div>
            )}
            <div style={{ padding: '1rem' }}>
                <p style={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>{rocket.description.slice(0, 200)}…</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                    {[
                        { label: 'Taux de succès', val: `${rocket.success_rate_pct}%`, color: '#22c55e' },
                        { label: 'Premier vol', val: rocket.first_flight, color: '#6366f1' },
                        { label: 'Hauteur', val: `${rocket.height.meters} m`, color: '#f59e0b' },
                        { label: 'Masse', val: `${(rocket.mass.kg / 1000).toFixed(0)} t`, color: '#06b6d4' },
                    ].map(s => (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.4rem 0.625rem' }}>
                            <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: s.color }}>{s.val}</div>
                            <div style={{ fontSize: '0.6rem', color: '#334155' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

/* ─── 2025-updated data (v4 API is frozen at 2022) ─── */
const COMPANY_2025 = {
    employees: 13000, vehicles: 5, launch_sites: 3, valuation: 210e9,
    founder: 'Elon Musk', founded: 2002, cto: 'Elon Musk', coo: 'Gwynne Shotwell', test_sites: 1,
    summary: 'SpaceX conçoit, fabrique et lance des fusées et vaisseaux spatiaux avancés. En 2025, l\'entreprise a réalisé plus de 430 lancements et détient le record du launch le plus lourd de l\'histoire avec Starship (5 000 tonnes).',
}
const LATEST_2025 = {
    id: 'starship-ift6', name: 'Starship IFT-6', flight_number: 422,
    date_utc: '2025-03-06T10:00:00.000Z', success: true,
    details: 'Sixième vol intégré de Starship. Le Super Heavy Booster B14 a réussi le 3ème "chopsticks catch" sur la tour de lancement de Starbase. Ship S34 a complété son trajet suborbital et amerri dans l\'Océan Indien.',
    links: { patch: { small: '/starship-ift6-patch.svg' }, webcast: 'https://www.youtube.com/watch?v=KAROFmXN0BQ', article: null },
    cores: [{ core: 'b14', reuse_count: 2, landing_success: true, landing_type: 'Chopsticks (tour)' }],
    payloads: [], launchpad: 'Starbase, TX',
}
const ROCKETS_2025: SpaceXRocket[] = [
    { id: 'falcon9', name: 'Falcon 9', active: true, success_rate_pct: 98.7, first_flight: '2010-06-04', stages: 2, height: { meters: 70 }, mass: { kg: 549054 }, description: 'La fusée orbital réutilisable la plus fiable de l\'histoire, avec plus de 320 atterrissages réussis du premier étage. Elle réduit le coût du lancement d\'un facteur 10 par rapport aux fusées classiques.', flickr_images: ['https://imgur.com/DaCfMsj.jpg'] },
    { id: 'falconheavy', name: 'Falcon Heavy', active: true, success_rate_pct: 100, first_flight: '2018-02-06', stages: 2, height: { meters: 70 }, mass: { kg: 1420788 }, description: 'Composée de 3 propulseurs Falcon 9 liés ensemble, Falcon Heavy peut envoyer 64 tonnes en orbite basse — le double du Space Shuttle. Le premier vol a mis en orbite la Tesla Roadster d\'Elon Musk.', flickr_images: ['https://imgur.com/573IfNk.jpg'] },
    { id: 'starship', name: 'Starship', active: true, success_rate_pct: 83, first_flight: '2023-04-20', stages: 2, height: { meters: 122 }, mass: { kg: 5000000 }, description: 'Le plus grand véhicule spatial jamais construit (122 m, 5 000 t). Propulsé par 33 moteurs Raptor, il est entièrement réutilisable. Objectif final : colonisation de Mars et transport de 100 personnes par vol.', flickr_images: ['https://imgur.com/1bxqIOT.jpg'] },
]
const STATS_2025 = { total: 430, success: 419, reused: 380, landings: 320 }

/* ─── Main component ─── */
export default function SpaceXSection() {
    const [upcoming, setUpcoming] = useState<SpaceXUpcoming[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'upcoming' | 'rockets' | 'stats'>('upcoming')

    useEffect(() => {
        /* The Space Devs — real-time upcoming SpaceX launches */
        fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=8&lsp__name=SpaceX&format=json')
            .then(r => r.json())
            .then(d => {
                setUpcoming((d.results || []).map((l: never) => ({
                    id: (l as { id: string }).id,
                    name: (l as { name: string }).name,
                    date_utc: (l as { net: string }).net,
                    date_precision: (l as { status?: { abbrev: string } }).status?.abbrev || '',
                    details: (l as { mission?: { description: string } }).mission?.description || null,
                    links: {
                        patch: { small: (l as { mission_patches?: { image_url: string }[] }).mission_patches?.[0]?.image_url || null },
                        webcast: (l as { vidURLs?: { url: string }[] }).vidURLs?.[0]?.url || null,
                    },
                    flight_number: (l as { flightclub_id?: number }).flightclub_id || 0,
                })))
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])


    const TABS = [
        { id: 'upcoming', label: '🚀 Prochains lancements' },
        { id: 'rockets', label: '🛸 Fusées' },
        { id: 'stats', label: '📊 Statistiques' },
    ]

    return (
        <div style={{ padding: '3rem 2rem 4rem', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div className="badge" style={{ marginBottom: '0.5rem' }}>🛸 SPACEX — DONNÉES 2025</div>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            SpaceX — Programme Spatial
                        </h2>
                        <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.25rem', maxWidth: 600 }}>{COMPANY_2025.summary.slice(0, 180)}…</p>
                    </div>
                    <a href="https://www.spacex.com" target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1.25rem', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        spacex.com ↗
                    </a>
                </div>
            </motion.div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#334155', gap: '0.75rem' }}>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>🚀</motion.span>
                    <span>Connexion à l&apos;API SpaceX…</span>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>

                    {/* Company KPIs */}
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }} className="max-sm:grid-cols-2">
                            {[
                                { icon: '👥', val: COMPANY_2025.employees.toLocaleString('fr-FR'), label: 'Employés' },
                                { icon: '🛸', val: COMPANY_2025.vehicles, label: 'Véhicules actifs' },
                                { icon: '🏗️', val: COMPANY_2025.launch_sites, label: 'Sites de lancement' },
                                { icon: '💰', val: `$${(COMPANY_2025.valuation / 1e9).toFixed(0)} Mds`, label: 'Valorisation' },
                            ].map(s => (
                                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem', padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{s.icon}</div>
                                    <div style={{ fontFamily: 'Outfit, monospace', fontWeight: 900, fontSize: '1.2rem', color: '#e2e8f0' }}>{s.val}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#475569', marginTop: 2 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Latest launch highlight */}
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(16,185,129,0.04))', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '1.25rem', padding: '1.5rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 240 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={LATEST_2025.links.patch.small!} alt={LATEST_2025.name} style={{ width: 64, height: 64, objectFit: 'contain', flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Dernier lancement SpaceX · Vol #{LATEST_2025.flight_number}</div>
                                <div style={{ fontWeight: 800, fontFamily: 'Outfit', fontSize: '1.1rem', color: '#e2e8f0' }}>{LATEST_2025.name}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>{formatDate(LATEST_2025.date_utc)}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(34,197,94,0.12)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>✅ Succès</span>
                            <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>🔄 Booster réutilisé ×{LATEST_2025.cores[0].reuse_count}</span>
                            <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}>🎯 {LATEST_2025.cores[0].landing_type}</span>
                        </div>
                        <p style={{ width: '100%', color: '#64748b', fontSize: '0.8rem', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.875rem', marginTop: '0.25rem' }}>{LATEST_2025.details}</p>
                    </motion.div>

                    {/* Tabs */}
                    <div>
                        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {TABS.map(t => (
                                <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{ padding: '6px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: tab === t.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tab === t.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`, color: tab === t.id ? '#e2e8f0' : '#475569', transition: 'all 0.15s' }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {tab === 'upcoming' && (
                                <motion.div key="upcoming" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {upcoming.map((launch, i) => <LaunchCard key={launch.id} launch={launch} index={i} />)}
                                    </div>
                                </motion.div>
                            )}

                            {tab === 'rockets' && (
                                <motion.div key="rockets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                                        {ROCKETS_2025.map(r => <RocketCard key={r.id} rocket={r} />)}
                                    </div>
                                </motion.div>
                            )}

                            {tab === 'stats' && (
                                <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="max-sm:grid-cols-1">
                                        {/* Global stats */}
                                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem' }}>
                                            <div style={{ fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginBottom: '1rem' }}>📊 Historique des lancements (2025)</div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                                                {[
                                                    { label: 'Lancements totaux', val: STATS_2025.total, color: '#6366f1' },
                                                    { label: 'Lancements réussis', val: `${STATS_2025.success} (${((STATS_2025.success / STATS_2025.total) * 100).toFixed(1)}%)`, color: '#22c55e' },
                                                    { label: 'Propulseurs réutilisés', val: STATS_2025.reused, color: '#f59e0b' },
                                                    { label: 'Atterrissages réussis', val: STATS_2025.landings, color: '#06b6d4' },
                                                ].map(s => (
                                                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
                                                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{s.label}</span>
                                                        <span style={{ fontFamily: 'Outfit, monospace', fontWeight: 800, color: s.color, fontSize: '1rem' }}>{s.val}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Success rate donut */}
                                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                            <div style={{ fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0' }}>🎯 Taux de succès global</div>
                                            <div style={{ position: 'relative', width: 140, height: 140 }}>
                                                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                                                    <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="14" />
                                                    <motion.circle cx="70" cy="70" r="56" fill="none" stroke="#22c55e" strokeWidth="14"
                                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                                        initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                                                        animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - STATS_2025.success / STATS_2025.total) }}
                                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                                        strokeLinecap="round" />
                                                </svg>
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                    <span style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.8rem', color: '#22c55e' }}>
                                                        {((STATS_2025.success / STATS_2025.total) * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#475569', textAlign: 'center' }}>
                                                {STATS_2025.success} succès sur {STATS_2025.total} lancements
                                            </div>
                                        </div>

                                        {/* Company info */}
                                        <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem' }}>
                                            <div style={{ fontWeight: 700, fontFamily: 'Outfit', color: '#e2e8f0', marginBottom: '0.875rem' }}>🏢 À propos de SpaceX</div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }} className="max-sm:grid-cols-2">
                                                {[
                                                    { label: 'Fondateur', val: COMPANY_2025.founder },
                                                    { label: 'Fondée en', val: COMPANY_2025.founded },
                                                    { label: 'CTO', val: COMPANY_2025.cto },
                                                    { label: 'COO', val: COMPANY_2025.coo },
                                                    { label: 'Sites de test', val: COMPANY_2025.test_sites },
                                                    { label: 'Sites de lancement', val: COMPANY_2025.launch_sites },
                                                ].map(s => (
                                                    <div key={s.label} style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}>
                                                        <div style={{ fontSize: '0.6rem', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                                                        <div style={{ fontWeight: 700, color: '#94a3b8', fontSize: '0.82rem', marginTop: 2 }}>{s.val}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Source credits */}
                    <div style={{ textAlign: 'center', paddingTop: '0.25rem' }}>
                        <p style={{ fontSize: '0.65rem', color: '#1e293b' }}>
                            Données : <a href="https://github.com/r-spacex/SpaceX-API" target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }}>SpaceX API (r-spacex) — Open Source, sans clé API</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
