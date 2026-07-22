'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Types ─── */
interface SolarWind {
    speed: number       // km/s
    density: number     // p/cm³
    temperature: number // K
}

interface MagneticField {
    bz: number     // nT — negative = southward = dangerous
    bt: number     // nT — total
    lat: number
    lon: number
}

/* ─── Helpers ─── */
function getFlareClass(flux: number): { label: string; color: string; bg: string; danger: string } {
    if (flux >= 1e-4) return { label: 'X', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', danger: 'Éruption extrême — blackout radio mondial' }
    if (flux >= 1e-5) return { label: 'M', color: '#f97316', bg: 'rgba(249,115,22,0.12)', danger: 'Éruption majeure — perturbations GPS' }
    if (flux >= 1e-6) return { label: 'C', color: '#eab308', bg: 'rgba(234,179,8,0.12)', danger: 'Éruption modérée — légères perturbations' }
    if (flux >= 1e-7) return { label: 'B', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', danger: 'Éruption faible — sans conséquence' }
    return { label: 'A', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', danger: 'Activité minimale — calme' }
}

function getBzStatus(bz: number): { color: string; label: string; risk: string } {
    if (bz < -20) return { color: '#ef4444', label: 'CRITIQUE', risk: 'Couplage magnétique maximal — tempête géomagnétique sévère' }
    if (bz < -10) return { color: '#f97316', label: 'ÉLEVÉ', risk: 'Champ magnétique terrestre fortement perturbé' }
    if (bz < -5) return { color: '#eab308', label: 'MODÉRÉ', risk: 'Possible activité aurore boréale aux hautes latitudes' }
    if (bz < 0) return { color: '#84cc16', label: 'FAIBLE', risk: 'Légère interaction avec la magnétosphère' }
    return { color: '#06b6d4', label: 'NEUTRE', risk: 'Champ orienté nord — magnétosphère protège la Terre' }
}

function getWindStatus(speed: number): { color: string; label: string } {
    if (speed > 700) return { color: '#ef4444', label: 'Tempête solaire' }
    if (speed > 500) return { color: '#f97316', label: 'Vent rapide' }
    if (speed > 350) return { color: '#eab308', label: 'Vent modéré' }
    return { color: '#22c55e', label: 'Vent calme' }
}

/* ─── Gauge component ─── */
function Gauge({ value, min, max, color, unit, label }: { value: number; min: number; max: number; color: string; unit: string; label: string }) {
    const pct = Math.min(1, Math.max(0, (value - min) / (max - min)))
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ position: 'relative', width: 88, height: 88 }}>
                <svg aria-hidden="true" width="88" height="88" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <motion.circle cx="44" cy="44" r="36" fill="none" stroke={color} strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - pct) }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Outfit, monospace', fontWeight: 800, fontSize: '1.05rem', color }}>{Math.round(value)}</span>
                    <span style={{ fontSize: '0.6rem', color: '#334155' }}>{unit}</span>
                </div>
            </div>
        </div>
    )
}

/* ─── Bz Bar ─── */
function BzBar({ bz, bt }: { bz: number; bt: number }) {
    const status = getBzStatus(bz)
    // Center at 0, range -30 to +30
    const pct = (bz + 30) / 60
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bz (champ magnétique IMF)</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: status.color }}>{status.label}</span>
            </div>
            {/* Track */}
            <div style={{ position: 'relative', height: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.4rem' }}>
                {/* Gradient background */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #22c55e, #06b6d4)', opacity: 0.3 }} />
                {/* Center marker */}
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                {/* Indicator */}
                <motion.div style={{ position: 'absolute', top: 1, bottom: 1, width: 8, borderRadius: 99, background: status.color, boxShadow: `0 0 8px ${status.color}` }}
                    initial={{ left: '50%' }}
                    animate={{ left: `calc(${Math.min(95, Math.max(5, pct * 100))}% - 4px)` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.6rem', color: '#334155' }}>-30 nT (sud)</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', fontWeight: 700, color: status.color }}>{bz > 0 ? '+' : ''}{bz.toFixed(1)} nT</span>
                <span style={{ fontSize: '0.6rem', color: '#334155' }}>+30 nT (nord)</span>
            </div>
            <p style={{ color: '#334155', fontSize: '0.65rem', marginTop: '0.3rem', lineHeight: 1.5 }}>{status.risk}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ fontSize: '0.65rem', color: '#475569' }}>Bt total : <strong style={{ color: '#94a3b8' }}>{bt.toFixed(1)} nT</strong></span>
            </div>
        </div>
    )
}

/* ─── X-ray chart sparkline ─── */
function XraySparkline({ history }: { history: number[] }) {
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

    const currentFlare = getFlareClass(history[history.length - 1] || 1e-9)

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rayons X GOES (6h)</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontFamily: 'Outfit, monospace', fontWeight: 900, fontSize: '1.2rem', color: currentFlare.color }}>{currentFlare.label}</span>
                    <span style={{ fontSize: '0.65rem', color: currentFlare.color, background: currentFlare.bg, padding: '1px 7px', borderRadius: 99, border: `1px solid ${currentFlare.color}30` }}>Classe d&apos;éruption</span>
                </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', padding: '0.5rem', overflow: 'hidden' }}>
                <svg role="img" aria-label="Évolution des rayons X solaires sur six heures" width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', height: 60 }}>
                    {/* Grid lines */}
                    {[1e-8, 1e-7, 1e-6, 1e-5, 1e-4].map((v, i) => {
                        const logV = Math.log10(v)
                        const logMin = Math.log10(1e-9)
                        const logMax = Math.log10(Math.max(max, 1e-4))
                        const y = h - ((logV - logMin) / (logMax - logMin)) * h
                        const cls = ['A', 'B', 'C', 'M', 'X'][i]
                        const clr = ['#06b6d4', '#22c55e', '#eab308', '#f97316', '#ef4444'][i]
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
            <p style={{ color: '#475569', fontSize: '0.65rem', marginTop: '0.35rem' }}>{currentFlare.danger}</p>
        </div>
    )
}

/* ─── SOHO Coronagraph ─── */
function SOHOPanel() {
    const [imgErr, setImgErr] = useState(false)
    // SOHO LASCO C2 and C3 latest images
    const SOHO_LASCO_C3 = 'https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg'
    const SOHO_C2 = 'https://soho.nascom.nasa.gov/data/realtime/c2/512/latest.jpg'
    const [src, setSrc] = useState(SOHO_LASCO_C3)

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e2e8f0', fontFamily: 'Outfit' }}>🛰️ SOHO Coronagraphe en direct</div>
                    <div style={{ color: '#475569', fontSize: '0.72rem' }}>Satellite Solar and Heliospheric Observatory — NASA/ESA</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[{ label: 'LASCO C3', img: SOHO_LASCO_C3 }, { label: 'LASCO C2', img: SOHO_C2 }].map(b => (
                        <button key={b.label} onClick={() => { setSrc(b.img); setImgErr(false) }} style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 600, cursor: 'pointer', background: src === b.img ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${src === b.img ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.06)'}`, color: src === b.img ? '#f59e0b' : '#475569' }}>
                            {b.label}
                        </button>
                    ))}
                </div>
            </div>
            {imgErr ? (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', color: '#334155', fontSize: '0.8rem', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2rem' }}>🛰️</span>
                    <span>Image SOHO temporairement indisponible</span>
                    <a href="https://soho.nascom.nasa.gov/data/realtime-images.html" target="_blank" rel="noopener noreferrer" style={{ color: '#f59e0b', fontSize: '0.72rem' }}>Voir sur soho.nascom.nasa.gov →</a>
                </div>
            ) : (
                <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', background: '#000' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="SOHO Coronagraph LASCO" onError={() => setImgErr(true)}
                        style={{ width: '100%', display: 'block', borderRadius: '0.75rem' }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 99, padding: '2px 10px', fontSize: '0.65rem', color: '#f59e0b' }}>
                        Mis à jour toutes les 15min · NASA/ESA SOHO
                    </div>
                </div>
            )}
            <p style={{ color: '#334155', fontSize: '0.68rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Le coronagraphe bloque le disque solaire pour observer la couronne et détecter les éjections de masse coronale (CME) qui se dirigent vers la Terre.
            </p>
        </div>
    )
}

/* ─── Main Dashboard ─── */
export default function SpaceWeatherDashboard() {
    const [wind, setWind] = useState<SolarWind | null>(null)
    const [mag, setMag] = useState<MagneticField | null>(null)
    const [xrayHistory, setXrayHistory] = useState<number[]>([])
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState<string>('')
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchAll = async () => {
        try {
            // 1. Solar wind plasma (speed, density, temp)
            const plasmaRes = await fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json')
            const plasmaData: [string, string, string, string][] = await plasmaRes.json()
            const lastPlasma = plasmaData[plasmaData.length - 1]
            if (lastPlasma) {
                setWind({
                    speed: parseFloat(lastPlasma[1]) || 0,
                    density: parseFloat(lastPlasma[2]) || 0,
                    temperature: parseFloat(lastPlasma[3]) || 0,
                })
            }

            // 2. Magnetic field (Bz, Bt)
            const magRes = await fetch('https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json')
            const magData: [string, string, string, string, string, string, string][] = await magRes.json()
            const lastMag = magData[magData.length - 1]
            if (lastMag) {
                setMag({
                    bz: parseFloat(lastMag[3]) || 0,
                    bt: parseFloat(lastMag[6]) || 0,
                    lat: parseFloat(lastMag[4]) || 0,
                    lon: parseFloat(lastMag[5]) || 0,
                })
            }

            // 3. X-ray flux (6h history)
            const xrayRes = await fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json')
            const xrayData: { time_tag: string; flux: number }[] = await xrayRes.json()
            // Take every 4th point (1 per minute → 1 per 4min for 6h = ~90 points)
            const sampled = xrayData.filter((_, i) => i % 4 === 0)
            const fluxHistory = sampled.map(d => d.flux)
            setXrayHistory(fluxHistory)

            setLastUpdate(new Date().toLocaleTimeString('fr-FR'))
            setLoading(false)
        } catch (e) {
            console.error('Space weather fetch error:', e)
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

    const windStatus = wind ? getWindStatus(wind.speed) : null

    return (
        <div style={{ padding: '3rem 2rem 4rem', maxWidth: 'var(--max-w)', margin: '0 auto' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div>
                        <div className="badge" style={{ marginBottom: '0.5rem' }}>⚡ NOAA SWPC — EN DIRECT</div>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Dashboard Météo Spatiale
                        </h2>
                        <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            Données en temps réel du vent solaire, du champ magnétique interplanétaire et des rayons X GOES
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                        <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                            {loading ? 'Chargement…' : `Mis à jour ${lastUpdate}`}
                        </span>
                        <button onClick={fetchAll} style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.68rem', fontWeight: 600, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b', cursor: 'pointer' }}>
                            ↺ Actualiser
                        </button>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#334155', gap: '0.75rem' }}>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ display: 'inline-block' }}>⚙️</motion.span>
                    <span>Connexion aux satellites NOAA…</span>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>

                    {/* Row 1 — Solar Wind Gauges */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>💨</span>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', fontFamily: 'Outfit' }}>Vent Solaire</div>
                                {windStatus && <div style={{ fontSize: '0.7rem', color: windStatus.color, fontWeight: 600 }}>{windStatus.label}</div>}
                            </div>
                            <div style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#334155' }}>Source : NOAA ACE/DSCOVR satellite L1</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
                            {wind && <>
                                <Gauge value={wind.speed} min={200} max={900} color={windStatus?.color || '#f59e0b'} unit="km/s" label="Vitesse" />
                                <Gauge value={wind.density} min={0} max={30} color="#06b6d4" unit="p/cm³" label="Densité" />
                                <Gauge value={Math.log10(Math.max(wind.temperature, 1))} min={3} max={7} color="#a855f7" unit="log K" label="Température" />
                            </>}
                        </div>
                        {wind && (
                            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.625rem', textAlign: 'center' }}>
                                {[
                                    { label: 'Vitesse', val: `${Math.round(wind.speed)} km/s`, note: wind.speed > 500 ? '⚠️ Rapide' : '✅ Normal' },
                                    { label: 'Densité', val: `${wind.density.toFixed(1)} p/cm³`, note: wind.density > 15 ? '⚠️ Élevée' : '✅ Normal' },
                                    { label: 'Temp.', val: `${(wind.temperature / 1e6).toFixed(1)} M K`, note: '🌡️ Plasma' },
                                ].map(s => (
                                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', padding: '0.6rem' }}>
                                        <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1rem', color: '#f59e0b' }}>{s.val}</div>
                                        <div style={{ fontSize: '0.62rem', color: '#475569', marginTop: 2 }}>{s.label}</div>
                                        <div style={{ fontSize: '0.6rem', color: '#334155', marginTop: 2 }}>{s.note}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Row 2 — Bz + X-rays */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="max-md:grid-cols-1">

                        {/* Bz magnetic field */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            style={{ background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>🧲</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', fontFamily: 'Outfit' }}>Champ Magnétique IMF</div>
                                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>Interplanetary Magnetic Field</div>
                                </div>
                            </div>
                            {mag && <BzBar bz={mag.bz} bt={mag.bt} />}
                            {mag && (
                                <div style={{ marginTop: '0.875rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    {[
                                        { label: 'Latitude GSM', val: `${mag.lat.toFixed(1)}°` },
                                        { label: 'Longitude GSM', val: `${mag.lon.toFixed(1)}°` },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.5rem', textAlign: 'center' }}>
                                            <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem', color: '#6366f1' }}>{s.val}</div>
                                            <div style={{ fontSize: '0.6rem', color: '#334155' }}>{s.label}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div style={{ marginTop: '0.875rem', padding: '0.625rem', background: 'rgba(99,102,241,0.06)', borderRadius: '0.625rem', border: '1px solid rgba(99,102,241,0.12)' }}>
                                <div style={{ fontSize: '0.65rem', color: '#475569', lineHeight: 1.6 }}>
                                    💡 <strong style={{ color: '#94a3b8' }}>Bz négatif</strong> = le champ magnétique solaire pointe vers le sud. Il se reconnecter avec le champ terrestre et laisse passer les particules chargées — ce sont les aurores boréales.
                                </div>
                            </div>
                        </motion.div>

                        {/* X-ray flux */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                            style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>☢️</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#e2e8f0', fontFamily: 'Outfit' }}>Rayons X Solaires</div>
                                    <div style={{ fontSize: '0.7rem', color: '#475569' }}>Satellite GOES (NOAA) — canal 1–8 Å</div>
                                </div>
                            </div>
                            <XraySparkline history={xrayHistory} />
                            <div style={{ marginTop: '0.875rem', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.3rem' }}>
                                {[
                                    { cls: 'A', color: '#06b6d4', flux: '< B' },
                                    { cls: 'B', color: '#22c55e', flux: '≥ 10⁻⁷' },
                                    { cls: 'C', color: '#eab308', flux: '≥ 10⁻⁶' },
                                    { cls: 'M', color: '#f97316', flux: '≥ 10⁻⁵' },
                                    { cls: 'X', color: '#ef4444', flux: '≥ 10⁻⁴' },
                                ].map(c => (
                                    <div key={c.cls} style={{ textAlign: 'center', padding: '0.3rem', background: `${c.color}0a`, borderRadius: '0.4rem', border: `1px solid ${c.color}20` }}>
                                        <div style={{ fontWeight: 900, fontSize: '1rem', color: c.color, fontFamily: 'Outfit' }}>{c.cls}</div>
                                        <div style={{ fontSize: '0.55rem', color: '#334155' }}>{c.flux}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Row 3 — SOHO Coronagraph */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1.25rem', padding: '1.5rem' }}>
                        <SOHOPanel />
                    </motion.div>

                    {/* Alert banner if conditions bad */}
                    <AnimatePresence>
                        {mag && mag.bz < -10 && (
                            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(249,115,22,0.08))', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: '1.5rem' }}>🚨</motion.span>
                                <div>
                                    <div style={{ fontWeight: 700, color: '#ef4444', fontFamily: 'Outfit', fontSize: '0.95rem' }}>Alerte Météo Spatiale</div>
                                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Bz = {mag.bz.toFixed(1)} nT — Conditions favorables aux aurores boréales. Regardez vers le nord ce soir si le ciel est dégagé !</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Source credits */}
                    <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
                        <p style={{ fontSize: '0.65rem', color: '#1e293b' }}>
                            Données : <a href="https://www.swpc.noaa.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }}>NOAA Space Weather Prediction Center</a> ·
                            Satellite <a href="https://www.swpc.noaa.gov/products/real-time-solar-wind" target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }}>DSCOVR (L1)</a> ·
                            <a href="https://soho.nascom.nasa.gov" target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }}>SOHO (NASA/ESA)</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
