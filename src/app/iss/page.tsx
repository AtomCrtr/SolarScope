'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import type { DashboardData, IssPosition } from '@/lib/space-data'
import KidsGuide from '@/components/KidsGuide'

const ISSGlobe = dynamic(() => import('@/components/ISSGlobe'), { ssr: false })

interface LaunchInfo {
    name: string
    net: string
    agency: string
    rocket: string
}

function formatLatLng(val: number, posLabel: string, negLabel: string) {
    return `${Math.abs(val).toFixed(4)}° ${val >= 0 ? posLabel : negLabel}`
}

function daysSince(dateStr: string) {
    return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
}

export default function ISSPage() {
    const [issPos, setIssPos] = useState<IssPosition | null>(null)
    const [positionLoading, setPositionLoading] = useState(true)
    const [positionError, setPositionError] = useState(false)
    const [astronauts, setAstronauts] = useState<DashboardData['crew']>([])
    const [crewLoading, setCrewLoading] = useState(true)
    const [crewError, setCrewError] = useState(false)
    const [nextLaunch, setNextLaunch] = useState<LaunchInfo | null>(null)

    // The browser calls our validated proxy to avoid cross-origin failures.
    useEffect(() => {
        const controller = new AbortController()
        async function fetchISS() {
            try {
                const r = await fetch('/api/iss-position', { signal: controller.signal, cache: 'no-store' })
                if (!r.ok) throw new Error('ISS position unavailable')
                const d: IssPosition = await r.json()
                setIssPos(d)
                setPositionError(false)
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') return
                setPositionError(true)
            } finally {
                if (!controller.signal.aborted) setPositionLoading(false)
            }
        }
        fetchISS()
        const id = setInterval(fetchISS, 5_000)
        return () => {
            controller.abort()
            clearInterval(id)
        }
    }, [])

    // ── Shared server-side data: crew + next launch ──
    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/dashboard', { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error('dashboard unavailable')
                return r.json() as Promise<DashboardData>
            })
            .then(data => {
                setAstronauts(data.crew)
                setCrewError(!data.sources.crew)
                if (data.nextLaunch) {
                    setNextLaunch({
                        name: data.nextLaunch.name,
                        net: data.nextLaunch.net,
                        agency: data.nextLaunch.agency,
                        rocket: data.nextLaunch.rocket,
                    })
                }
            })
            .catch(error => {
                if (error instanceof DOMException && error.name === 'AbortError') return
                setCrewError(true)
            })
            .finally(() => {
                if (!controller.signal.aborted) setCrewLoading(false)
            })
        return () => controller.abort()
    }, [])

    const issOnISS = astronauts.filter(a => a.station === 'ISS')
    const daysOnOrbit = daysSince('1998-11-20')
    const missingPosition = positionLoading ? '…' : 'Indisponible'

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', borderColor: 'rgba(59,130,246,0.25)' }}>
                    🛰️ STATION SPATIALE — POSITION EN DIRECT
                </div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #bfdbfe, #3b82f6, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    ISS Tracker
                </h1>
                <p className="page-subtitle">
                    La Station Spatiale Internationale se déplace à <strong style={{ color: '#60a5fa' }}>28 000 km/h</strong> — elle fait le tour de la Terre en 92 minutes !
                </p>
            </motion.div>

            <KidsGuide topic="iss" />

            {/* ISS Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '2rem' }} className="max-sm:grid-cols-2">
                {[
                    { icon: '📍', label: 'Latitude', val: issPos ? formatLatLng(issPos.latitude, 'N', 'S') : missingPosition },
                    { icon: '↔️', label: 'Longitude', val: issPos ? formatLatLng(issPos.longitude, 'E', 'O') : missingPosition },
                    { icon: '🚀', label: 'Altitude', val: issPos ? `${issPos.altitude.toFixed(1)} km` : missingPosition },
                    { icon: '⚡', label: 'Vitesse', val: issPos ? `${issPos.velocity.toFixed(0)} km/h` : missingPosition },
                ].map(s => (
                    <motion.div key={s.label} className="stat-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
                        <div className="stat-value" style={{ color: '#60a5fa', fontSize: '1rem', fontFamily: 'monospace' }}>{s.val}</div>
                        <div className="stat-label">{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Globe + crew side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="max-sm:grid-cols-1">

                {/* 3D Globe */}
                <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', height: 460 }}>
                    <ISSGlobe issPos={issPos} />
                    <div style={{
                        position: 'absolute', top: 12, left: 12,
                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(96,165,250,0.3)', borderRadius: 99,
                        padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        <span className="pulse-dot" style={{ width: 7, height: 7, background: issPos ? '#60a5fa' : '#f59e0b', boxShadow: `0 0 6px ${issPos ? '#60a5fa' : '#f59e0b'}` }} />
                        <span style={{ color: issPos ? '#60a5fa' : '#f59e0b', fontSize: '0.7rem', fontWeight: 700 }}>
                            {positionLoading ? 'Connexion à l’ISS…' : positionError && !issPos ? 'Position indisponible' : positionError ? 'Dernière position connue' : 'Position vérifiée toutes les 5 s'}
                        </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: 10, right: 12, color: '#334155', fontSize: '0.6rem' }}>🖱 Glisser pour pivoter</div>
                </div>

                {/* Crew Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1.25rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.3rem' }}>👨‍🚀</span>
                            <h2 style={{ color: '#e2e8f0', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
                                Équipage actuel
                            </h2>
                            <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 99, padding: '2px 8px', fontSize: '0.68rem', fontWeight: 700 }}>
                                {crewLoading ? '…' : crewError ? 'Indispo.' : `${issOnISS.length} pers.`}
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {issOnISS.slice(0, 10).map(a => (
                                <div key={`${a.name}-${a.craft}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)' }}>
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', flexShrink: 0 }}>
                                        {a.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ color: '#e2e8f0', fontSize: '0.78rem', fontWeight: 600 }}>{a.name}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.65rem' }}>{a.craft}</div>
                                    </div>
                                </div>
                            ))}
                            {!crewLoading && crewError && <p style={{ color: '#f59e0b', fontSize: '0.75rem' }}>Équipage temporairement indisponible.</p>}
                        </div>
                    </div>

                    {/* ISS Facts mini */}
                    <div className="card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {[
                                { icon: '📅', val: `${daysOnOrbit} j.`, label: 'En orbite' },
                                { icon: '🏗️', val: '420 t', label: 'Masse' },
                                { icon: '📐', val: '109 m', label: 'Envergure' },
                                { icon: '🔄', val: '16/j', label: 'Tours/jour' },
                            ].map(f => (
                                <div key={f.label} style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                                    <div style={{ fontSize: '1rem' }}>{f.icon}</div>
                                    <div style={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Outfit' }}>{f.val}</div>
                                    <div style={{ color: '#475569', fontSize: '0.62rem' }}>{f.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ISS Fun facts */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ color: '#60a5fa', fontSize: '1rem' }}>💡 Le savais-tu ?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {[
                        { icon: '🌅', fact: 'Les astronautes voient le Soleil se lever et se coucher 16 fois par jour en orbite !' },
                        { icon: '💧', fact: 'Sur l\'ISS, l\'eau (dont l\'urine !) est recyclée à 90%. Chaque goutte compte !' },
                        { icon: '👁️', fact: 'L\'ISS est visible à l\'œil nu depuis la Terre. Elle brille comme Vénus lors de ses passages !' },
                        { icon: '🔬', fact: '+3 000 expériences scientifiques ont été réalisées à bord depuis 2000.' },
                    ].map(f => (
                        <div key={f.icon} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.625rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{f.icon}</span>
                            <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: 1.6 }}>{f.fact}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next launch teaser */}
            {nextLaunch && (
                <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(59,130,246,0.06))', border: '1px solid rgba(99,102,241,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.5rem' }}>🚀</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Outfit' }}>Prochain lancement</div>
                            <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{nextLaunch.name}</div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{nextLaunch.agency} · {new Date(nextLaunch.net).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <a href="/missions" style={{ padding: '0.5rem 1rem', borderRadius: 99, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
                            Voir tous →
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}
