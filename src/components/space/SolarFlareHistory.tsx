'use client'

import { useEffect, useState } from 'react'

interface SolarFlare {
    beginTime: string
    peakTime: string
    endTime?: string
    classType: string
    sourceLocation?: string
    linkedEvents?: unknown[]
}

interface SolarWindEntry {
    time: string
    speed: number
    density: number
    bz: number
}

function getFlareColor(cls: string): string {
    if (cls.startsWith('X')) return '#ef4444'
    if (cls.startsWith('M')) return '#f97316'
    if (cls.startsWith('C')) return '#f59e0b'
    return '#64748b'
}

function getFlareDesc(cls: string): string {
    if (cls.startsWith('X')) return 'Majeure — radio blackout possible'
    if (cls.startsWith('M')) return 'Modérée — perturbations radio'
    if (cls.startsWith('C')) return 'Faible — effet mineur'
    return 'Minimale'
}

export default function SolarFlareHistory() {
    const [flares, setFlares] = useState<SolarFlare[]>([])
    const [wind, setWind] = useState<SolarWindEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Solar flare history (NOAA SWPC)
        fetch('/api/solar-flares')
            .then(r => r.json())
            .then((data: SolarFlare[]) => {
                setFlares(Array.isArray(data) ? data.slice(-20).reverse() : [])
            })
            .catch(() => setFlares([]))

        // Solar wind data (NOAA real-time)
        fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json')
            .then(r => r.json())
            .then((raw: string[][]) => {
                // cols: time(0), density(1), speed(2), temperature(3)
                const recent = raw.slice(-48).filter(row => row[0] !== 'time_tag').map(row => ({
                    time: row[0],
                    density: parseFloat(row[1]) || 0,
                    speed: parseFloat(row[2]) || 0,
                    bz: 0,
                }))
                setWind(recent)
            })
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const latestWind = wind[wind.length - 1]

    // Compute a simple bar chart for solar wind speed using SVG
    const maxSpeed = Math.max(...wind.map(w => w.speed), 700)
    const windChart = wind.slice(-24)

    return (
        <>
            {/* Solar Wind */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h2 className="section-title" style={{ color: '#60a5fa', marginBottom: '0.25rem' }}>
                            🌬️ Vent Solaire — Données ACE/DSCOVR
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Mesures en temps réel à 1,5 million km de la Terre (L1)</p>
                    </div>
                    {latestWind && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ textAlign: 'center', padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '0.75rem' }}>
                                <div style={{ color: '#60a5fa', fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>{Math.round(latestWind.speed)}</div>
                                <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>km/s</div>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.75rem 1rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '0.75rem' }}>
                                <div style={{ color: '#22d3ee', fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem' }}>{latestWind.density.toFixed(1)}</div>
                                <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 600 }}>p/cm³</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SVG wind speed chart */}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem', overflow: 'hidden', padding: '0.5rem' }}>
                    <svg role="img" aria-label="Historique de la vitesse du vent solaire" width="100%" viewBox={`0 0 ${windChart.length * 14} 80`} preserveAspectRatio="none" style={{ display: 'block', height: 80 }}>
                        {/* Fill area */}
                        <defs>
                            <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>
                        {windChart.length > 1 && (
                            <polyline
                                fill="url(#windGrad)"
                                stroke="#3b82f6"
                                strokeWidth="1.5"
                                points={windChart.map((w, i) => {
                                    const x = i * 14 + 7
                                    const y = 75 - (w.speed / maxSpeed) * 65
                                    return `${x},${y}`
                                }).join(' ') + ` ${(windChart.length - 1) * 14 + 7},75 7,75`}
                            />
                        )}
                        {/* Threshold line 500 km/s */}
                        <line
                            x1="0" y1={75 - (500 / maxSpeed) * 65}
                            x2={windChart.length * 14} y2={75 - (500 / maxSpeed) * 65}
                            stroke="#f97316" strokeWidth="1" strokeDasharray="3,3" opacity="0.6"
                        />
                    </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.7rem', color: '#64748b' }}>
                    <span>Il y a 12h</span>
                    <span style={{ color: '#f97316' }}>— seuil 500 km/s</span>
                    <span>Maintenant</span>
                </div>
            </div>

            {/* Flare history */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: '#fbbf24', marginBottom: '1.25rem' }}>
                    🔥 Historique Éruptions Solaires — 30 derniers jours
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                    Source : NASA DONKI (Database Of Notifications, Knowledge, Information) · Actualisé chaque heure
                </p>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>⏳ Chargement des éruptions...</div>
                ) : flares.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☀️</div>
                        Aucune éruption significative ces 30 derniers jours — période calme !
                    </div>
                ) : (
                    <>
                        {/* Class summary badges */}
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                            {(['X', 'M', 'C', 'B'] as const).map(cls => {
                                const count = flares.filter(f => f.classType?.startsWith(cls)).length
                                if (!count) return null
                                const color = getFlareColor(cls)
                                return (
                                    <div key={cls} style={{ padding: '0.5rem 1rem', borderRadius: '0.625rem', background: `${color}12`, border: `1px solid ${color}30`, textAlign: 'center' }}>
                                        <div style={{ color, fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', lineHeight: 1 }}>{count}</div>
                                        <div style={{ color, fontSize: '0.72rem', fontWeight: 700 }}>Classe {cls}</div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Flare table */}
                        <div style={{ overflow: 'hidden', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}>
                                        {['Classe', 'Début (UTC)', 'Pic', 'Fin', 'Région', 'Impact'].map(h => (
                                            <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.03em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {flares.slice(0, 15).map((f, i) => {
                                        const color = getFlareColor(f.classType || '')
                                        return (
                                            <tr key={i} style={{ borderBottom: i < flares.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                                                <td style={{ padding: '0.7rem 1rem' }}>
                                                    <span style={{
                                                        color, fontWeight: 800, fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem',
                                                        padding: '2px 10px', borderRadius: 999,
                                                        background: `${color}12`, border: `1px solid ${color}30`,
                                                    }}>{f.classType || '—'}</span>
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem', color: '#e2e8f0', fontVariantNumeric: 'tabular-nums', fontSize: '0.78rem' }}>
                                                    {f.beginTime?.slice(0, 16).replace('T', ' ') || '—'}
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums', fontSize: '0.78rem' }}>
                                                    {f.peakTime?.slice(11, 16) || '—'}
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem', color: '#64748b', fontVariantNumeric: 'tabular-nums', fontSize: '0.78rem' }}>
                                                    {f.endTime?.slice(11, 16) || '—'}
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem', color: '#94a3b8', fontSize: '0.78rem' }}>
                                                    {f.sourceLocation || '—'}
                                                </td>
                                                <td style={{ padding: '0.7rem 1rem' }}>
                                                    <span style={{ color, fontSize: '0.72rem', fontWeight: 500 }}>{getFlareDesc(f.classType || '')}</span>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}
