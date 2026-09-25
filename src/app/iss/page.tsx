'use client'

import { useState, useEffect } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

import Link from '@/components/ui/LocaleLink'
import type { DashboardData, IssPosition } from '@/lib/data/space-data'
import KidsGuide from '@/components/learning/KidsGuide'
import DataSourceNote from '@/components/learning/DataSourceNote'
import MetricGrid from '@/components/space/MetricGrid'
import { useDaysSince } from '@/lib/client/use-client-value'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const COPY = {
    fr: {
        unavailable: 'Indisponible', badge: 'STATION SPATIALE — POSITION EN DIRECT',
        subtitle: ['La Station spatiale internationale se déplace à ', '28 000 km/h', ' : elle fait le tour de la Terre en environ 92 minutes !'],
        sourceNote: 'Position mise à jour par le site ; les repères restent affichés si le flux est indisponible',
        telemetry: 'TÉLÉMÉTRIE ORBITALE', whereNow: 'Où se trouve la station maintenant ?',
        connecting: 'Connexion en cours…', feedDown: 'Flux indisponible', lastKnown: 'Dernière position connue', every5s: 'Actualisation toutes les 5 s',
        metrics: 'Position et vitesse actuelles de l’ISS', latitude: 'Latitude', longitude: 'Longitude', altitude: 'Altitude', speed: 'Vitesse', west: 'O',
        dashboard: 'Suivi orbital et équipage de l’ISS', map: 'CARTE', orbit: 'Position orbitale', lowOrbit: 'orbite basse', located: 'ISS localisée', searching: 'Recherche du signal', drag: 'Glisser pour faire pivoter',
        lap: 'Durée d’un tour', lapsPerDay: 'Tours par jour', height: 'Altitude moyenne',
        aboard: 'À BORD', crew: 'Équipage actuel', crewDown: 'Indispo.', people: (n: number) => `${n} personne${n > 1 ? 's' : ''}`, crewWarning: 'Équipage temporairement indisponible.',
        factsTitle: 'Repères sur la station', inOrbit: 'En orbite', days: (n: number) => `${n.toLocaleString('fr-FR')} j`, mass: 'Masse', span: 'Envergure', perDay: 'Tours/jour', perDayValue: '16/j',
        didYouKnow: 'Le savais-tu ?',
        facts: [
            { icon: 'sun', fact: 'Les astronautes voient le Soleil se lever et se coucher environ 16 fois par jour !' },
            { icon: 'drop', fact: 'Sur l’ISS, environ 98 % de l’eau (même l’urine !) est recyclée. Chaque goutte compte !' },
            { icon: 'eye', fact: 'L’ISS est visible à l’œil nu depuis la Terre. Elle peut briller presque autant que Vénus !' },
            { icon: 'search', fact: 'Plus de 3 000 expériences scientifiques ont été menées à bord depuis 2000.' },
        ],
        nextLaunch: 'Prochain lancement', seeAll: 'Voir tous →', date: 'fr-FR',
    },
    en: {
        unavailable: 'Unavailable', badge: 'SPACE STATION — LIVE POSITION',
        subtitle: ['The International Space Station travels at ', '28,000 km/h', ': it goes around Earth in about 92 minutes!'],
        sourceNote: 'Position updated by the site; the key figures stay on screen if the feed is unavailable',
        telemetry: 'ORBITAL TELEMETRY', whereNow: 'Where is the station right now?',
        connecting: 'Connecting…', feedDown: 'Feed unavailable', lastKnown: 'Last known position', every5s: 'Updated every 5 s',
        metrics: 'Current position and speed of the ISS', latitude: 'Latitude', longitude: 'Longitude', altitude: 'Altitude', speed: 'Speed', west: 'W',
        dashboard: 'ISS orbit tracking and crew', map: 'MAP', orbit: 'Orbital position', lowOrbit: 'low orbit', located: 'ISS located', searching: 'Looking for the signal', drag: 'Drag to turn',
        lap: 'One trip around', lapsPerDay: 'Trips per day', height: 'Average height',
        aboard: 'ON BOARD', crew: 'Current crew', crewDown: 'Unavailable', people: (n: number) => `${n} ${n === 1 ? 'person' : 'people'}`, crewWarning: 'Crew temporarily unavailable.',
        factsTitle: 'Station key figures', inOrbit: 'In orbit', days: (n: number) => `${n.toLocaleString('en-GB')} days`, mass: 'Mass', span: 'Width', perDay: 'Trips/day', perDayValue: '16/day',
        didYouKnow: 'Did you know?',
        facts: [
            { icon: 'sun', fact: 'Astronauts see the Sun rise and set about 16 times a day!' },
            { icon: 'drop', fact: 'On the ISS, about 98% of the water (even urine!) is recycled. Every drop counts!' },
            { icon: 'eye', fact: 'You can see the ISS from Earth with the naked eye. It can shine almost as brightly as Venus!' },
            { icon: 'search', fact: 'More than 3,000 science experiments have been carried out on board since 2000.' },
        ],
        nextLaunch: 'Next launch', seeAll: 'See them all →', date: 'en-GB',
    },
}

import { ISSGlobeScene as ISSGlobe } from '@/components/space/LightScenes'

interface LaunchInfo {
    name: string
    net: string
    agency: string
    rocket: string
}

function formatLatLng(val: number, posLabel: string, negLabel: string) {
    return `${Math.abs(val).toFixed(4)}° ${val >= 0 ? posLabel : negLabel}`
}

export default function ISSPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
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
    const daysOnOrbit = useDaysSince('1998-11-20')
    const missingPosition = positionLoading ? '…' : t.unavailable

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            {/* Header */}
            <div className="page-header motion-enter">
                <div className="badge" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', borderColor: 'rgba(59,130,246,0.25)' }}>
                    <SpaceIcon name="satellite" size={18} className="inline-icon" /> {t.badge}
                </div>
                <h1 className="page-title">ISS Tracker</h1>
                <p className="page-subtitle">
                    {t.subtitle[0]}<strong style={{ color: '#60a5fa' }}>{t.subtitle[1]}</strong>{t.subtitle[2]}
                </p>
            </div>

            <KidsGuide topic="iss" />
            <DataSourceNote source="NASA / Human Spaceflight" href="https://www.nasa.gov/international-space-station/" refreshed={t.sourceNote} />

            <section className="iss-telemetry" aria-labelledby="iss-telemetry-title">
                <div className="iss-section-heading">
                    <div>
                        <span className="iss-kicker">{t.telemetry}</span>
                        <h2 id="iss-telemetry-title">{t.whereNow}</h2>
                    </div>
                    <div className="iss-live-status" data-state={positionError ? 'warning' : 'live'}>
                        <span className="pulse-dot" aria-hidden="true" />
                        <span>{positionLoading ? t.connecting : positionError && !issPos ? t.feedDown : positionError ? t.lastKnown : t.every5s}</span>
                    </div>
                </div>

                <MetricGrid
                    ariaLabel={t.metrics}
                    className="iss-live-metrics"
                    items={[
                        { icon: 'pin', label: t.latitude, value: issPos ? formatLatLng(issPos.latitude, 'N', 'S') : missingPosition, color: '#bfdbfe', monospace: true },
                        { icon: 'compass', label: t.longitude, value: issPos ? formatLatLng(issPos.longitude, 'E', t.west) : missingPosition, color: '#bfdbfe', monospace: true },
                        { icon: 'rocket', label: t.altitude, value: issPos ? `${issPos.altitude.toLocaleString(t.date, { maximumFractionDigits: 1 })} km` : missingPosition, color: '#bfdbfe', monospace: true },
                        { icon: 'bolt', label: t.speed, value: issPos ? `${Math.round(issPos.velocity).toLocaleString(t.date)} km/h` : missingPosition, color: '#bfdbfe', monospace: true },
                    ]}
                />
            </section>

            <section className="iss-dashboard-grid" aria-label={t.dashboard}>
                <article className="card iss-orbit-card">
                    <header className="iss-panel-heading">
                        <div>
                            <span className="iss-panel-icon" aria-hidden="true"><SpaceIcon name="globe" size={18} className="inline-icon" /></span>
                            <div>
                                <span className="iss-kicker">{t.map}</span>
                                <h2>{t.orbit}</h2>
                            </div>
                        </div>
                        <span className="iss-orbit-badge">{t.lowOrbit}</span>
                    </header>
                    <div className="iss-globe-stage">
                        <ISSGlobe issPos={issPos} />
                        <div className="iss-globe-overlay">
                            <span className="pulse-dot" aria-hidden="true" />
                            {issPos ? t.located : t.searching}
                        </div>
                        <div className="iss-globe-help">{t.drag} <span aria-hidden="true">↗</span></div>
                    </div>
                    <footer className="iss-orbit-context">
                        <div><span>{t.lap}</span><strong>≈ 92 min</strong></div>
                        <div><span>{t.lapsPerDay}</span><strong>≈ 16</strong></div>
                        <div><span>{t.height}</span><strong>≈ 400 km</strong></div>
                    </footer>
                </article>

                <aside className="iss-side-stack">
                    <section className="card iss-crew-card" aria-labelledby="iss-crew-title">
                        <header className="iss-panel-heading">
                            <div>
                                <span className="iss-panel-icon" aria-hidden="true"><SpaceIcon name="family" size={18} className="inline-icon" /></span>
                                <div>
                                    <span className="iss-kicker">{t.aboard}</span>
                                    <h2 id="iss-crew-title">{t.crew}</h2>
                                </div>
                            </div>
                            <span className="iss-crew-count">{crewLoading ? '…' : crewError ? t.crewDown : t.people(issOnISS.length)}</span>
                        </header>
                        <ul className="iss-crew-list">
                            {issOnISS.slice(0, 10).map(a => (
                                <li key={`${a.name}-${a.craft}`}>
                                    <span className="iss-crew-avatar" aria-hidden="true">{a.name.charAt(0)}</span>
                                    <span><strong>{a.name}</strong><small>{a.craft}</small></span>
                                </li>
                            ))}
                        </ul>
                        {!crewLoading && crewError && <p className="iss-data-warning">{t.crewWarning}</p>}
                    </section>

                    <section className="card iss-facts-card" aria-labelledby="iss-facts-title">
                        <h2 id="iss-facts-title" className="sr-only">{t.factsTitle}</h2>
                        {[
                            { icon: 'calendar', val: daysOnOrbit === null ? '…' : t.days(daysOnOrbit), label: t.inOrbit },
                            { icon: 'scale', val: '420 t', label: t.mass },
                            { icon: 'ruler', val: '109 m', label: t.span },
                            { icon: 'refresh', val: t.perDayValue, label: t.perDay },
                        ].map(f => (
                            <div key={f.label}>
                                <SpaceIcon name={f.icon as SpaceIconName} size={20} />
                                <strong>{f.val}</strong>
                                <small>{f.label}</small>
                            </div>
                        ))}
                    </section>
                </aside>
            </section>

            {/* ISS Fun facts */}
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h2 className="section-title" style={{ color: '#60a5fa', fontSize: '1rem' }}>{t.didYouKnow}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {t.facts.map(f => (
                        <div key={f.fact} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderRadius: '0.625rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                            <span style={{ flexShrink: 0, color: '#93c5fd' }}><SpaceIcon name={f.icon as SpaceIconName} size={20} /></span>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{f.fact}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next launch teaser */}
            {nextLaunch && (
                <div className="card iss-next-launch">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.5rem' }}><SpaceIcon name="rocket" size={18} className="inline-icon" /></span>
                        <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--nebula)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>{t.nextLaunch}</div>
                            <div style={{ color: 'var(--text)', fontWeight: 600 }}>{nextLaunch.name}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{nextLaunch.agency} · {new Date(nextLaunch.net).toLocaleDateString(t.date, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                        </div>
                        <Link href="/missions" className="touch-link">
                            {t.seeAll}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
