'use client'

import { useEffect, useState, useRef } from 'react'

interface KpEntry {
    time: string
    kp: number
}

function getKpColor(kp: number): string {
    if (kp >= 8) return '#ef4444'
    if (kp >= 6) return '#f97316'
    if (kp >= 5) return '#f59e0b'
    if (kp >= 4) return '#eab308'
    if (kp >= 3) return '#84cc16'
    if (kp >= 2) return '#22c55e'
    return '#10b981'
}

function getKpLabel(kp: number): string {
    if (kp >= 8) return 'Tempête G4-G5 — Sévère'
    if (kp >= 6) return 'Tempête G3 — Forte'
    if (kp >= 5) return 'Tempête G1-G2 — Modérée'
    if (kp >= 4) return 'Active — Aurores possibles'
    if (kp >= 3) return 'Légèrement perturbé'
    return 'Calme'
}

export default function KpChart() {
    const [data, setData] = useState<KpEntry[]>([])
    const [current, setCurrent] = useState<KpEntry | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json')
            .then(r => r.json())
            .then((raw: string[][]) => {
                // raw[0] is header, rest are data rows [time, kp, ...]
                const parsed: KpEntry[] = raw.slice(1).map(row => ({
                    time: row[0],
                    kp: parseFloat(row[1]) || 0,
                }))
                // Last 28 entries = 7 days (3h intervals)
                const recent = parsed.slice(-28)
                setData(recent)
                setCurrent(recent[recent.length - 1])
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }, [])

    // Draw chart when data changes
    useEffect(() => {
        if (!data.length || !canvasRef.current) return
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const W = canvas.width
        const H = canvas.height
        const pad = { top: 20, right: 20, bottom: 40, left: 40 }
        const chartW = W - pad.left - pad.right
        const chartH = H - pad.top - pad.bottom
        const maxKp = 9

        ctx.clearRect(0, 0, W, H)

        // Grid lines & Y labels
        for (let i = 0; i <= maxKp; i += 3) {
            const y = pad.top + chartH - (i / maxKp) * chartH
            ctx.beginPath()
            ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'
            ctx.lineWidth = 1
            ctx.setLineDash([4, 4])
            ctx.moveTo(pad.left, y)
            ctx.lineTo(pad.left + chartW, y)
            ctx.stroke()
            ctx.setLineDash([])
            ctx.fillStyle = '#64748b'
            ctx.font = '11px Inter, sans-serif'
            ctx.textAlign = 'right'
            ctx.fillText(`Kp${i}`, pad.left - 6, y + 4)
        }

        // Storm threshold lines
        const thresholds = [{ v: 5, label: 'G1', color: '#f59e0b' }, { v: 7, label: 'G3', color: '#ef4444' }]
        for (const t of thresholds) {
            const y = pad.top + chartH - (t.v / maxKp) * chartH
            ctx.beginPath()
            ctx.strokeStyle = t.color + '60'
            ctx.lineWidth = 1
            ctx.setLineDash([3, 3])
            ctx.moveTo(pad.left, y)
            ctx.lineTo(pad.left + chartW, y)
            ctx.stroke()
            ctx.setLineDash([])
            ctx.fillStyle = t.color
            ctx.font = 'bold 10px Inter, sans-serif'
            ctx.textAlign = 'left'
            ctx.fillText(t.label, pad.left + chartW + 3, y + 4)
        }

        // Bars
        const barW = (chartW / data.length) * 0.7
        const gap = (chartW / data.length) * 0.3

        data.forEach((entry, i) => {
            const x = pad.left + i * (chartW / data.length) + gap / 2
            const barH = (entry.kp / maxKp) * chartH
            const y = pad.top + chartH - barH
            const color = getKpColor(entry.kp)

            // Gradient fill
            const grad = ctx.createLinearGradient(x, y, x, y + barH)
            grad.addColorStop(0, color)
            grad.addColorStop(1, color + '44')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0])
            ctx.fill()

            // Glow on high values
            if (entry.kp >= 5) {
                ctx.shadowColor = color
                ctx.shadowBlur = 8
                ctx.fillStyle = color + '88'
                ctx.beginPath()
                ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0])
                ctx.fill()
                ctx.shadowBlur = 0
            }
        })

        // X labels (every 4th bar = 12h)
        ctx.fillStyle = '#64748b'
        ctx.font = '10px Inter, sans-serif'
        ctx.textAlign = 'center'
        data.forEach((entry, i) => {
            if (i % 4 === 0) {
                const x = pad.left + i * (chartW / data.length) + barW / 2
                const t = entry.time.slice(5, 13).replace(' ', '\n')
                const parts = t.split('\n')
                parts.forEach((p, pi) => {
                    ctx.fillText(p, x, pad.top + chartH + 14 + pi * 11)
                })
            }
        })
    }, [data])

    if (loading) {
        return (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>⏳ Chargement des données Kp NOAA...</div>
            </div>
        )
    }

    if (error || !current) {
        return (
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>📡 Données Kp temporairement indisponibles</div>
            </div>
        )
    }

    const kpColor = getKpColor(current.kp)

    return (
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                    <h2 className="section-title" style={{ color: '#fbbf24', marginBottom: '0.25rem' }}>
                        ⚡ Indice Kp — Météo Spatiale en Direct
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Source : NOAA SWPC — mis à jour toutes les 3h</p>
                </div>
                {/* Current Kp gauge */}
                <div style={{
                    textAlign: 'center', padding: '0.875rem 1.5rem',
                    background: `${kpColor}12`, border: `2px solid ${kpColor}40`,
                    borderRadius: '1rem', minWidth: 120,
                }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '0.25rem' }}>KP ACTUEL</div>
                    <div style={{ color: kpColor, fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2.8rem', lineHeight: 1, textShadow: `0 0 20px ${kpColor}` }}>{current.kp.toFixed(1)}</div>
                    <div style={{ color: kpColor, fontSize: '0.72rem', fontWeight: 600, marginTop: '0.3rem' }}>{getKpLabel(current.kp)}</div>
                </div>
            </div>

            {/* Chart Scale Legend */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {[
                    { label: 'Kp 0-2 Calme', color: '#10b981' },
                    { label: 'Kp 3-4 Actif', color: '#eab308' },
                    { label: 'Kp 5-6 G1-G2', color: '#f97316' },
                    { label: 'Kp 7+ G3+', color: '#ef4444' },
                ].map(s => (
                    <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: s.color, fontWeight: 600 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color, display: 'inline-block' }} />
                        {s.label}
                    </span>
                ))}
            </div>

            {/* Canvas chart */}
            <div style={{ width: '100%', overflow: 'hidden', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem' }}>
                <canvas
                    ref={canvasRef}
                    width={760}
                    height={200}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.75rem', textAlign: 'right' }}>
                📅 7 derniers jours · Données NOAA/SWPC · {current.time.slice(0, 16)} UTC
            </p>
        </div>
    )
}
