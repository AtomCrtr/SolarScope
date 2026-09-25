'use client'

import { useState, useEffect, useRef } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import type { MagneticField, SolarWind, SpaceWeatherData } from '@/lib/data/space-data'

/* ─── Helpers ─── */
function getFlareClass(flux: number, en = false): { label: string; color: string; bg: string; danger: string } {
    if (flux >= 1e-4) return { label: 'X', color: '#f87171', bg: 'rgba(239,68,68,0.12)', danger: en ? 'Extreme flare — worldwide radio blackout' : 'Éruption extrême — blackout radio mondial' }
    if (flux >= 1e-5) return { label: 'M', color: '#f97316', bg: 'rgba(249,115,22,0.12)', danger: en ? 'Major flare — GPS disruption' : 'Éruption majeure — perturbations GPS' }
    if (flux >= 1e-6) return { label: 'C', color: '#eab308', bg: 'rgba(234,179,8,0.12)', danger: en ? 'Moderate flare — minor disruption' : 'Éruption modérée — légères perturbations' }
    if (flux >= 1e-7) return { label: 'B', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', danger: en ? 'Weak flare — no effect' : 'Éruption faible — sans conséquence' }
    return { label: 'A', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', danger: en ? 'Minimal activity — quiet' : 'Activité minimale — calme' }
}

function getBzStatus(bz: number, en = false): { color: string; label: string; risk: string } {
    if (bz < -20) return { color: '#f87171', label: en ? 'CRITICAL' : 'CRITIQUE', risk: en ? 'Maximum magnetic coupling — severe geomagnetic storm' : 'Couplage magnétique maximal — tempête géomagnétique sévère' }
    if (bz < -10) return { color: '#f97316', label: en ? 'HIGH' : 'ÉLEVÉ', risk: en ? 'Earth’s magnetic field strongly disturbed' : 'Champ magnétique terrestre fortement perturbé' }
    if (bz < -5) return { color: '#eab308', label: en ? 'MODERATE' : 'MODÉRÉ', risk: en ? 'Possible aurora activity at high latitudes' : 'Possible activité aurore boréale aux hautes latitudes' }
    if (bz < 0) return { color: '#84cc16', label: en ? 'LOW' : 'FAIBLE', risk: en ? 'Slight interaction with the magnetosphere' : 'Légère interaction avec la magnétosphère' }
    return { color: '#06b6d4', label: en ? 'NEUTRAL' : 'NEUTRE', risk: en ? 'Northward field — the magnetosphere protects Earth' : 'Champ orienté nord — magnétosphère protège la Terre' }
}

function getWindStatus(speed: number, en = false): { color: string; label: string } {
    if (speed > 700) return { color: '#f87171', label: en ? 'Solar storm' : 'Tempête solaire' }
    if (speed > 500) return { color: '#f97316', label: en ? 'Fast wind' : 'Vent rapide' }
    if (speed > 350) return { color: '#eab308', label: en ? 'Moderate wind' : 'Vent modéré' }
    return { color: '#22c55e', label: en ? 'Calm wind' : 'Vent calme' }
}

/* ─── Gauge component ─── */
function Gauge({ value, min, max, color, unit, label }: { value: number; min: number; max: number; color: string; unit: string; label: string }) {
    const pct = Math.min(1, Math.max(0, (value - min) / (max - min)))
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ position: 'relative', width: 88, height: 88 }}>
                <svg aria-hidden="true" width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle cx="44" cy="44" r="36" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={2 * Math.PI * 36 * (1 - pct)} strokeLinecap="round" className="gauge-arc" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color }}>{Math.round(value)}</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{unit}</span>
                </div>
            </div>
        </div>
    )
}

/* ─── Bz Bar ─── */
function BzBar({ bz, bt, en }: { bz: number; bt: number; en: boolean }) {
    const status = getBzStatus(bz, en)
    // Center at 0, range -30 to +30
    const pct = (bz + 30) / 60
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{en ? 'Bz (IMF magnetic field)' : 'Bz (champ magnétique IMF)'}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: status.color }}>{status.label}</span>
            </div>
            {/* Track */}
            <div style={{ position: 'relative', height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.4rem' }}>
                {/* Gradient background */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #22c55e, #06b6d4)', opacity: 0.3 }} />
                {/* Center marker */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                {/* Indicator */}
                <div className="gauge-slide" style={{ position: 'absolute', top: 1, bottom: 1, width: 8, borderRadius: 99, background: status.color, boxShadow: `0 0 8px ${status.color}`, left: `calc(${Math.min(95, Math.max(5, pct * 100))}% - 4px)` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{en ? '-30 nT (south)' : '-30 nT (sud)'}</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: status.color }}>{bz > 0 ? '+' : ''}{bz.toFixed(1)} nT</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{en ? '+30 nT (north)' : '+30 nT (nord)'}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '0.3rem', lineHeight: 1.5 }}>{status.risk}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{en ? 'Total Bt:' : 'Bt total :'} <strong style={{ color: 'var(--text-muted)' }}>{bt.toFixed(1)} nT</strong></span>
            </div>
        </div>
    )
}

/* ─── X-ray chart sparkline ─── */
function XraySparkline({ history, en }: { history: number[]; en: boolean }) {
    if (!history.length) return null
    const max = Math.max(...history, 1e-8)
    const w = 320, h = 60
    const points = history.map((v, i) => {
        const x = (i / (history.length - 1)) * w
        const logV = Math.log10(Math.max(v, 1e-9))
        const logMin = Math.log10(1e-9)
        const logMax = Math.log10(Math.max(max, 1e-4))
        const y = h - ((logV - logMin) / (logMax - logMin)) * h
        return `${x},${y}`
    }).join(' ')

    const currentFlare = getFlareClass(history[history.length - 1] || 1e-9, en)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{en ? 'GOES X-rays (6h)' : 'Rayons X GOES (6h)'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.2rem', color: currentFlare.color }}>{currentFlare.label}</span>
                    <span style={{ fontSize: '0.65rem', color: currentFlare.color, background: currentFlare.bg, padding: '1px 7px', borderRadius: 99, border: `1px solid ${currentFlare.color}30` }}>{en ? 'Flare class' : 'Classe d’éruption'}</span>
                </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', padding: '0.5rem', overflow: 'hidden' }}>
                <svg role="img" aria-label={en ? 'Solar X-rays over the last six hours' : 'Évolution des rayons X solaires sur six heures'} width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', height: 60 }}>
                    {/* Grid lines */}
                    {[1e-8, 1e-7, 1e-6, 1e-5, 1e-4].map((v, i) => {
                        const logV = Math.log10(v)
                        const logMin = Math.log10(1e-9)
                        const logMax = Math.log10(Math.max(max, 1e-4))
                        const y = h - ((logV - logMin) / (logMax - logMin)) * h
                        const cls = ['A', 'B', 'C', 'M', 'X'][i]
                        const clr = ['#06b6d4', '#22c55e', '#eab308', '#f97316', '#f87171'][i]
                        return (
                            <g key={v}>
                                <line x1={0} y1={y} x2={w} y2={y} stroke={clr} strokeOpacity={0.15} strokeDasharray="3 3" />
                                <text x={w - 2} y={y - 2} fontSize={7} fill={clr} textAnchor="end" opacity={0.5}>{cls}</text>
                            </g>
                        )
                    })}
                    {/* Fill */}
                    <polyline points={`0,${h} ${points} ${w},${h}`} fill={`${currentFlare.color}18`} />
                    {/* Line */}
                    <polyline points={points} fill="none" stroke={currentFlare.color} strokeWidth={1.5} />
                </svg>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: '0.35rem' }}>{currentFlare.danger}</p>
        </div>
    )
}

/* ─── SOHO Coronagraph ─── */
function SOHOPanel({ en }: { en: boolean }) {
    const [imgErr, setImgErr] = useState(false)
    // SOHO LASCO C2 and C3 latest images
    const SOHO_LASCO_C3 = 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg'
    const SOHO_C2 = 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg'
    const [src, setSrc] = useState(SOHO_LASCO_C3)

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}><SpaceIcon name="satellite" size={18} className="inline-icon" /> {en ? 'Live SOHO coronagraph' : 'SOHO Coronagraphe en direct'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{en ? 'Solar and Heliospheric Observatory satellite — NASA/ESA' : 'Satellite Solar and Heliospheric Observatory — NASA/ESA'}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[{ label: 'LASCO C3', img: SOHO_LASCO_C3 }, { label: 'LASCO C2', img: SOHO_C2 }].map(b => (
                        <button key={b.label} onClick={() => { setSrc(b.img); setImgErr(false) }} style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', background: src === b.img ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${src === b.img ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.06)'}`, color: src === b.img ? '#f59e0b' : 'var(--text-muted)' }}>
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>
            {imgErr ? (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}><SpaceIcon name="satellite" size={18} className="inline-icon" /></span>
                    <span>{en ? 'SOHO image temporarily unavailable' : 'Image SOHO temporairement indisponible'}</span>
                    <a href="https://soho.nascom.nasa.gov/data/realtime-images.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontSize: '0.72rem' }}>{en ? 'View on soho.nascom.nasa.gov →' : 'Voir sur soho.nascom.nasa.gov →'}</a>
                </div>
            ) : (
                <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', background: '#000' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="SOHO Coronagraph LASCO" onError={() => setImgErr(true)}
                        style={{ width: '100%', display: 'block', borderRadius: '0.75rem' }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 99, padding: '2px 10px', fontSize: '0.65rem', color: '#f59e0b' }}>
                        {en ? 'Updated every 15 min · NASA/ESA SOHO' : 'Mis à jour toutes les 15min · NASA/ESA SOHO'}
                    </div>
                </div>
            )}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                {en
                    ? 'The coronagraph blocks the Sun’s disc to observe the corona and spot coronal mass ejections (CMEs) heading towards Earth.'
                    : 'Le coronagraphe bloque le disque solaire pour observer la couronne et détecter les éjections de masse coronale (CME) qui se dirigent vers la Terre.'}
            </p>
        </div>
    )
}

function DataUnavailable({ label, en }: { label: string; en: boolean }) {
    return (
        <div role="status" style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.07)', color: '#fbbf24', fontSize: '0.8rem', textAlign: 'center' }}>
            <SpaceIcon name="signal" size={18} className="inline-icon" /> {label} {en ? 'temporarily unavailable.' : 'temporairement indisponible.'}
        </div>
    )
}

/* ─── Main Dashboard ─── */
export default function SpaceWeatherDashboard() {
    const en = useSiteLocale() === 'en'
    const [wind, setWind] = useState<SolarWind | null>(null)
    const [mag, setMag] = useState<MagneticField | null>(null)
    const [xrayHistory, setXrayHistory] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const [observedAt, setObservedAt] = useState<string | null>(null)
    const [sources, setSources] = useState<SpaceWeatherData['sources']>({ solarWind: false, xray: false })
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchAll = async () => {
        try {
            const response = await fetch('/api/space-weather', { cache: 'no-store' })
            const payload = await response.json() as SpaceWeatherData
            setWind(payload.wind)
            setMag(payload.magneticField)
            setXrayHistory(payload.xrayHistory)
            setSources(payload.sources)
            if (payload.observedAt) setObservedAt(payload.observedAt)
        } catch {
            setWind(null)
            setMag(null)
            setXrayHistory([])
            setSources({ solarWind: false, xray: false })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const initialFetch = window.setTimeout(fetchAll, 0)
        intervalRef.current = setInterval(fetchAll, 60_000) // refresh every minute
        return () => {
            clearTimeout(initialFetch)
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    const lastUpdate = observedAt ? new Date(observedAt).toLocaleTimeString(en ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''
    const windStatus = wind ? getWindStatus(wind.speed, en) : null
    const availableSources = Object.values(sources).filter(Boolean).length
    const statusColor = availableSources === 2 ? '#22c55e' : availableSources === 1 ? '#f59e0b' : '#f87171'

    return (
        <div style={{ padding: '3rem 2rem 4rem', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                        <div className="badge" style={{ marginBottom: '0.5rem' }}><SpaceIcon name="bolt" size={18} className="inline-icon" /> {en ? 'NOAA SWPC — LIVE' : 'NOAA SWPC — EN DIRECT'}</div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            {en ? 'Space weather dashboard' : 'Dashboard Météo Spatiale'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            {en
                                ? 'Real-time data on the solar wind, the interplanetary magnetic field and GOES X-rays'
                                : 'Données en temps réel du vent solaire, du champ magnétique interplanétaire et des rayons X GOES'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="anim-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {en
                                ? loading ? 'Loading…' : availableSources === 0 ? 'Data unavailable' : `Observed at ${lastUpdate || 'now'}`
                                : loading ? 'Chargement…' : availableSources === 0 ? 'Données indisponibles' : `Observations de ${lastUpdate || 'maintenant'}`}
                        </span>
                        <button onClick={fetchAll} style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            ↺ {en ? 'Refresh' : 'Actualiser'}
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)', gap: '0.75rem' }}>
                    <span className="anim-spin" style={{ display: 'inline-block' }} aria-hidden="true"><SpaceIcon name="refresh" size={18} className="inline-icon" /></span>
                    <span>{en ? 'Connecting to NOAA satellites…' : 'Connexion aux satellites NOAA…'}</span>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>

                    {/* Row 1 — Solar Wind Gauges */}
                    <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '1.2rem' }}><SpaceIcon name="wind" size={18} className="inline-icon" /></span>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{en ? 'Solar wind' : 'Vent Solaire'}</div>
                                {windStatus && <div style={{ fontSize: '0.7rem', color: windStatus.color, fontWeight: 600 }}>{windStatus.label}</div>}
                            </div>
                            <div style={{ marginLeft: 'auto', fontSize: '0.65rem', color: 'var(--text-muted)' }}>{en ? 'Source: NOAA SWPC · wind propagated to Earth' : 'Source : NOAA SWPC · vent propagé vers la Terre'}</div>
                        </div>
                        {!wind && <DataUnavailable en={en} label={en ? 'Solar wind data' : 'Vent solaire'} />}
                        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
                            {wind && <>
                                <Gauge value={wind.speed} min={200} max={900} color={windStatus?.color || '#f59e0b'} unit="km/s" label={en ? 'Speed' : 'Vitesse'} />
                                <Gauge value={wind.density} min={0} max={30} color="#06b6d4" unit="p/cm³" label={en ? 'Density' : 'Densité'} />
                                <Gauge value={Math.log10(Math.max(wind.temperature, 1))} min={3} max={7} color="#a855f7" unit="log K" label={en ? 'Temperature' : 'Température'} />
                            </>}
                        </div>
                        {wind && (
                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', textAlign: 'center' }}>
                                {[
                                    { label: en ? 'Speed' : 'Vitesse', val: `${Math.round(wind.speed)} km/s`, note: wind.speed > 500 ? (en ? 'Fast' : 'Rapide') : 'Normal' },
                                    { label: en ? 'Density' : 'Densité', val: `${wind.density.toFixed(1)} p/cm³`, note: wind.density > 15 ? (en ? 'High' : 'Élevée') : 'Normal' },
                                    { label: 'Temp.', val: `${(wind.temperature / 1e6).toFixed(1)} M K`, note: 'Plasma' },
                                ].map(s => (
                                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', padding: '0.6rem' }}>
                                        <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#f59e0b' }}>{s.val}</div>
                                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.note}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Row 2 — Bz + X-rays */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="max-md:grid-cols-1">

                        {/* Bz magnetic field */}
                        <div style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '1.2rem' }}><SpaceIcon name="magnet" size={18} className="inline-icon" /></span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{en ? 'IMF magnetic field' : 'Champ Magnétique IMF'}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Interplanetary Magnetic Field</div>
                                </div>
                            </div>
                            {!mag && <DataUnavailable en={en} label={en ? 'Magnetic field data' : 'Champ magnétique'} />}
                            {mag && <BzBar bz={mag.bz} bt={mag.bt} en={en} />}
                            {mag && (
                                <div style={{ marginTop: '0.875rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    {[
                                        { label: 'Latitude GSM', val: `${mag.lat.toFixed(1)}°` },
                                        { label: 'Longitude GSM', val: `${mag.lon.toFixed(1)}°` },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.5rem', textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: 'var(--nebula)' }}>{s.val}</div>
                                            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ marginTop: '0.875rem', padding: '0.625rem', background: 'rgba(99,102,241,0.06)', borderRadius: '0.625rem', border: '1px solid rgba(99,102,241,0.12)' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                                    <SpaceIcon name="bulb" size={18} className="inline-icon" /> {en
                                        ? <><strong style={{ color: 'var(--text-muted)' }}>Negative Bz</strong> = the solar magnetic field points south. It can connect with Earth’s field and let in the charged particles that cause auroras.</>
                                        : <><strong style={{ color: 'var(--text-muted)' }}>Bz négatif</strong> = le champ magnétique solaire pointe vers le sud. Il peut se reconnecter avec le champ terrestre et favoriser l’arrivée de particules chargées à l’origine des aurores.</>}
                                </div>
                            </div>
                        </div>

                        {/* X-ray flux */}
                        <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '1.2rem' }}><SpaceIcon name="alert" size={18} className="inline-icon" /></span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{en ? 'Solar X-rays' : 'Rayons X Solaires'}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{en ? 'GOES satellite (NOAA) — 1–8 Å channel' : 'Satellite GOES (NOAA) — canal 1–8 Å'}</div>
                                </div>
                            </div>
                            {!xrayHistory.length && <DataUnavailable en={en} label={en ? 'Solar X-ray data' : 'Rayons X solaires'} />}
                            <XraySparkline history={xrayHistory} en={en} />
                            <div style={{ marginTop: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem' }}>
                                {[
                                    { cls: 'A', color: '#06b6d4', flux: '< B' },
                                    { cls: 'B', color: '#22c55e', flux: '≥ 10⁻⁷' },
                                    { cls: 'C', color: '#eab308', flux: '≥ 10⁻⁶' },
                                    { cls: 'M', color: '#f97316', flux: '≥ 10⁻⁵' },
                                    { cls: 'X', color: '#f87171', flux: '≥ 10⁻⁴' },
                                ].map(c => (
                                    <div key={c.cls} style={{ textAlign: 'center', padding: '0.3rem', background: `${c.color}0a`, borderRadius: '0.4rem', border: `1px solid ${c.color}20` }}>
                                        <div style={{ fontWeight: 900, fontSize: '1rem', color: c.color, fontFamily: 'var(--font-display)' }}>{c.cls}</div>
                                        <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{c.flux}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Row 3 — SOHO Coronagraph */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                        <SOHOPanel en={en} />
                    </div>

                    {/* Alert banner if conditions bad */}
                    <>
                        {mag && mag.bz < -10 && (
                            <div className="motion-enter" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.08))', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <span className="anim-pulse" style={{ fontSize: '1.5rem' }} aria-hidden="true"><SpaceIcon name="alert" size={18} className="inline-icon" /></span>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#f87171', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>{en ? 'Space weather alert' : 'Alerte Météo Spatiale'}</div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Bz = {mag.bz.toFixed(1)} nT — {en ? 'Good conditions for auroras. Look north tonight if the sky is clear!' : 'Conditions favorables aux aurores boréales. Regardez vers le nord ce soir si le ciel est dégagé !'}</div>
                                </div>
                            </div>
                        )}
                    </>

                    {/* Source credits */}
                    <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {en ? 'Data:' : 'Données :'} <a href="https://www.swpc.noaa.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-subtle)' }}>NOAA Space Weather Prediction Center</a> ·
                            Satellite <a href="https://www.spaceweather.gov/products/solar-wind" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-subtle)' }}>DSCOVR (L1)</a> ·
                            <a href="https://soho.nascom.nasa.gov" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-subtle)' }}>SOHO (NASA/ESA)</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
