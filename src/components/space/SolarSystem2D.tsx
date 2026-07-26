'use client'

import { useMemo } from 'react'

/* ── J2000 Keplerian orbital elements (simplified) ── */
const PLANET_ELEMENTS = [
    { name: 'Mercure', symbol: '☿', color: '#94a3b8', a: 0.387, L0: 252.2509, n: 4.092317, emoji: '☿', r: 5 },
    { name: 'Vénus', symbol: '♀', color: '#f59e0b', a: 0.723, L0: 181.9798, n: 1.602130, emoji: '♀', r: 7 },
    { name: 'Terre', symbol: '🌍', color: '#3b82f6', a: 1.000, L0: 100.4644, n: 0.985647, emoji: '🌍', r: 7 },
    { name: 'Mars', symbol: '♂', color: '#ef4444', a: 1.524, L0: 355.4330, n: 0.524039, emoji: '♂', r: 6 },
    { name: 'Jupiter', symbol: '♃', color: '#f97316', a: 5.203, L0: 34.3966, n: 0.083091, emoji: '♃', r: 11 },
    { name: 'Saturne', symbol: '♄', color: '#eab308', a: 9.537, L0: 50.0775, n: 0.033460, emoji: '♄', r: 9 },
    { name: 'Uranus', symbol: '♅', color: '#67e8f9', a: 19.19, L0: 314.0550, n: 0.011725, emoji: '♅', r: 8 },
    { name: 'Neptune', symbol: '♆', color: '#6366f1', a: 30.07, L0: 304.3487, n: 0.006020, emoji: '♆', r: 8 },
]

function julianDate(date: Date): number {
    const y = date.getUTCFullYear()
    const m = date.getUTCMonth() + 1
    const d = date.getUTCDate()
    const A = Math.floor((14 - m) / 12)
    const Y = y + 4800 - A
    const M = m + 12 * A - 3
    return d + Math.floor((153 * M + 2) / 5) + 365 * Y +
        Math.floor(Y / 4) - Math.floor(Y / 100) + Math.floor(Y / 400) - 32045 - 0.5
}

interface PlanetPos {
    name: string; symbol: string; color: string; emoji: string; r: number
    angle: number; x: number; y: number; a: number
}

function computePositions(svgW: number, svgH: number, scale: number): PlanetPos[] {
    const now = new Date()
    const jd = julianDate(now)
    const d = jd - 2451545.0 // days since J2000
    const cx = svgW / 2
    const cy = svgH / 2

    return PLANET_ELEMENTS.map(p => {
        const L = (p.L0 + p.n * d) % 360
        const angleRad = (L * Math.PI) / 180
        const dist = p.a * scale
        return {
            name: p.name, symbol: p.symbol, color: p.color, emoji: p.emoji, r: p.r,
            angle: L,
            a: p.a,
            x: cx + dist * Math.cos(angleRad),
            y: cy - dist * Math.sin(angleRad),
        }
    })
}

export default function SolarSystem2D() {
    const W = 680
    const H = 680
    const SCALE = 28 // px per AU for full diagram

    const today = new Date()
    const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    const cx = W / 2
    const cy = H / 2

    const planets = useMemo(() => computePositions(W, H, SCALE), [])
    const innerPlanets = useMemo(() => {
        // Inner system view: 0-2 AU
        const S2 = 145
        const now = new Date()
        const jd = julianDate(now)
        const d = jd - 2451545.0
        return PLANET_ELEMENTS.slice(0, 4).map(p => {
            const L = (p.L0 + p.n * d) % 360
            const angleRad = (L * Math.PI) / 180
            const dist = p.a * S2
            return { ...p, x: 200 + dist * Math.cos(angleRad), y: 200 - dist * Math.sin(angleRad), angle: L }
        })
    }, [])

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                    <h2 className="section-title" style={{ color: '#e2e8f0', marginBottom: '0.25rem' }}>🌌 Système Solaire — Aujourd&apos;hui</h2>
                    <p style={{ color: '#475569', fontSize: '0.75rem' }}>Positions calculées par éphémérides J2000 pour le {dateStr}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className="pulse-dot" />
                    <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}>Positions réelles</span>
                </div>
            </div>

            {/* Full solar system SVG */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Full view */}
                <div style={{ background: 'rgba(0,0,16,0.95)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, left: 12, color: '#334155', fontSize: '0.62rem' }}>Système complet</div>
                    <svg role="img" aria-label="Position calculée des planètes dans le système solaire" width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
                        {/* Stars BG */}
                        {Array.from({ length: 100 }, (_, i) => (
                            <circle key={i} cx={Math.sin(i * 137.5) * W / 2 + cx} cy={Math.cos(i * 137.5) * H / 2 + cy}
                                r={i % 10 < 3 ? 0.8 : 0.4} fill="white" opacity={0.3 + ((i * 37) % 50) / 100} />
                        ))}
                        {/* Orbits */}
                        {PLANET_ELEMENTS.map(p => (
                            <circle key={p.name} cx={cx} cy={cy} r={p.a * SCALE}
                                fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" strokeDasharray={p.a > 5 ? '3 4' : '2 3'} />
                        ))}
                        {/* Sun */}
                        <circle cx={cx} cy={cy} r={14} fill="url(#sunGrad)" />
                        <defs>
                            <radialGradient id="sunGrad">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="60%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.6" />
                            </radialGradient>
                        </defs>
                        <text x={cx} y={cy + 24} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">☀</text>
                        {/* Planets */}
                        {planets.map(p => (
                            <g key={p.name}>
                                {/* Connector line from orbit to planet */}
                                <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={p.color} strokeWidth="0.3" strokeOpacity="0.15" />
                                <circle cx={p.x} cy={p.y} r={p.r}
                                    fill={p.color} filter={`drop-shadow(0 0 ${p.r}px ${p.color})`} opacity={0.9} />
                                <text x={p.x} y={p.y - p.r - 3} textAnchor="middle" fill={p.color} fontSize="8.5" fontWeight="bold" opacity={0.9}>
                                    {p.name.slice(0, 3).toUpperCase()}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Inner planets zoom */}
                <div style={{ background: 'rgba(0,0,16,0.95)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 8, left: 12, color: '#334155', fontSize: '0.62rem' }}>Planètes intérieures (zoom)</div>
                    <svg role="img" aria-label="Position calculée des quatre planètes intérieures" width="100%" viewBox="0 0 400 400" style={{ display: 'block' }}>
                        {[0.387, 0.723, 1.0, 1.524].map((a, i) => (
                            <circle key={i} cx={200} cy={200} r={a * 145} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                        ))}
                        <circle cx={200} cy={200} r={10} fill="url(#sunGrad2)" />
                        <defs>
                            <radialGradient id="sunGrad2">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="100%" stopColor="#f97316" />
                            </radialGradient>
                        </defs>
                        <text x={200} y={220} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">☀</text>
                        {innerPlanets.map(p => (
                            <g key={p.name}>
                                <circle cx={p.x} cy={p.y} r={p.r + 2} fill={p.color} filter={`drop-shadow(0 0 ${p.r + 3}px ${p.color})`} />
                                <text x={p.x} y={p.y - p.r - 4} textAnchor="middle" fill={p.color} fontSize="9" fontWeight="bold">
                                    {p.name.slice(0, 3).toUpperCase()}
                                </text>
                                <line x1={200} y1={200} x2={p.x} y2={p.y} stroke={p.color} strokeWidth="0.4" strokeOpacity="0.2" />
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            {/* Planet angle table */}
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }} className="max-sm:grid-cols-2">
                {planets.map(p => (
                    <div key={p.name} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', border: `1px solid ${p.color}15` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                            <span style={{ fontSize: '0.85rem', color: p.color }}>{p.symbol}</span>
                            <span style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 700 }}>{p.name}</span>
                        </div>
                        <div style={{ color: '#475569', fontSize: '0.65rem', marginTop: 2 }}>
                            {p.angle.toFixed(1)}° écliptique · {p.a} UA
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
