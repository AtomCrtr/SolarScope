'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { DashboardData, IssPosition } from '@/lib/data/space-data'
import KidsGuide from '@/components/learning/KidsGuide'
import DataSourceNote from '@/components/learning/DataSourceNote'
import MetricGrid from '@/components/space/MetricGrid'

const ISSGlobe = dynamic(() => import('@/components/space/ISSGlobe'), { ssr: false })

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
            <DataSourceNote source="NASA / Human Spaceflight" href="https://www.nasa.gov/international-space-station/" refreshed="Position mise à jour par le site ; les repères restent affichés si le flux est indisponible" />

            <section className="iss-telemetry" aria-labelledby="iss-telemetry-title">
                <div className="iss-section-heading">
                    <div>
                        <span className="iss-kicker">TÉLÉMÉTRIE ORBITALE</span>
                        <h2 id="iss-telemetry-title">Où se trouve la station maintenant ?</h2>
                    </div>
                    <div className="iss-live-status" data-state={positionError ? 'warning' : 'live'}>
                        <span className="pulse-dot" aria-hidden="true" />
                        <span>{positionLoading ? 'Connexion en cours…' : positionError && !issPos ? 'Flux indisponible' : positionError ? 'Dernière position connue' : 'Actualisation toutes les 5 s'}</span>
                    </div>
                </div>

                <MetricGrid
                    animateOnView={false}
                    ariaLabel="Position et vitesse actuelles de l’ISS"
                    className="iss-live-metrics"
                    items={[
                        { icon: '📍', label: 'Latitude', value: issPos ? formatLatLng(issPos.latitude, 'N', 'S') : missingPosition, color: '#bfdbfe', monospace: true },
                        { icon: '↔️', label: 'Longitude', value: issPos ? formatLatLng(issPos.longitude, 'E', 'O') : missingPosition, color: '#bfdbfe', monospace: true },
                        { icon: '🚀', label: 'Altitude', value: issPos ? `${issPos.altitude.toFixed(1)} km` : missingPosition, color: '#bfdbfe', monospace: true },
                        { icon: '⚡', label: 'Vitesse', value: issPos ? `${issPos.velocity.toFixed(0)} km/h` : missingPosition, color: '#bfdbfe', monospace: true },
                    ]}
                />
            </section>

            <section className="iss-dashboard-grid" aria-label="Suivi orbital et équipage de l’ISS">
                <article className="card iss-orbit-card">
                    <header className="iss-panel-heading">
                        <div>
                            <span className="iss-panel-icon" aria-hidden="true">🌍</span>
                            <div>
                                <span className="iss-kicker">CARTE 3D</span>
                                <h2>Position orbitale</h2>
                            </div>
                        </div>
                        <span className="iss-orbit-badge">orbite basse</span>
                    </header>
                    <div className="iss-globe-stage">
                        <ISSGlobe issPos={issPos} />
                        <div className="iss-globe-overlay">
                            <span className="pulse-dot" aria-hidden="true" />
                            {issPos ? 'ISS localisée' : 'Recherche du signal'}
                        </div>
                        <div className="iss-globe-help">Glisser pour faire pivoter <span aria-hidden="true">↗</span></div>
                    </div>
                    <footer className="iss-orbit-context">
                        <div><span>Durée d’un tour</span><strong>≈ 92 min</strong></div>
                        <div><span>Tours par jour</span><strong>≈ 16</strong></div>
                        <div><span>Distance moyenne</span><strong>≈ 400 km</strong></div>
                    </footer>
                </article>

                <aside className="iss-side-stack">
                    <section className="card iss-crew-card" aria-labelledby="iss-crew-title">
                        <header className="iss-panel-heading">
                            <div>
                                <span className="iss-panel-icon" aria-hidden="true">👨‍🚀</span>
                                <div>
                                    <span className="iss-kicker">À BORD</span>
                                    <h2 id="iss-crew-title">Équipage actuel</h2>
                                </div>
                            </div>
                            <span className="iss-crew-count">{crewLoading ? '…' : crewError ? 'Indispo.' : `${issOnISS.length} personnes`}</span>
                        </header>
                        <ul className="iss-crew-list">
                            {issOnISS.slice(0, 10).map(a => (
                                <li key={`${a.name}-${a.craft}`}>
                                    <span className="iss-crew-avatar" aria-hidden="true">{a.name.charAt(0)}</span>
                                    <span><strong>{a.name}</strong><small>{a.craft}</small></span>
                                </li>
                            ))}
                        </ul>
                        {!crewLoading && crewError && <p className="iss-data-warning">Équipage temporairement indisponible.</p>}
                    </section>

                    <section className="card iss-facts-card" aria-labelledby="iss-facts-title">
                        <h2 id="iss-facts-title" className="sr-only">Repères sur la station</h2>
                        {[
                            { icon: '📅', val: `${daysOnOrbit} j.`, label: 'En orbite' },
                            { icon: '🏗️', val: '420 t', label: 'Masse' },
                            { icon: '📐', val: '109 m', label: 'Envergure' },
                            { icon: '🔄', val: '16/j', label: 'Tours/jour' },
                        ].map(f => (
                            <div key={f.label}>
                                <span aria-hidden="true">{f.icon}</span>
                                <strong>{f.val}</strong>
                                <small>{f.label}</small>
                            </div>
                        ))}
                    </section>
                </aside>
            </section>

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
                <div className="card iss-next-launch">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.5rem' }}>🚀</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Outfit' }}>Prochain lancement</div>
                            <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{nextLaunch.name}</div>
                            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{nextLaunch.agency} · {new Date(nextLaunch.net).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <Link href="/missions" className="touch-link">
                            Voir tous →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
