'use client'

import { useEffect, useRef, useState } from 'react'

interface KpiCardProps {
    emoji: string
    value: number
    label: string
    suffix?: string
    color?: string
}

export default function KpiCard({ emoji, value, label, suffix = '', color = '#8b5cf6' }: KpiCardProps) {
    const [count, setCount] = useState(0)
    const [visible, setVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!visible) return
        let start = 0
        const duration = 1800
        const step = Math.ceil(value / (duration / 16))
        const timer = setInterval(() => {
            start += step
            if (start >= value) {
                setCount(value)
                clearInterval(timer)
            } else {
                setCount(start)
            }
        }, 16)
        return () => clearInterval(timer)
    }, [visible, value])

    return (
        <div
            ref={ref}
            className="card p-5 text-center flex flex-col items-center gap-2"
            style={{ minWidth: 130 }}
        >
            <span style={{ fontSize: '2rem' }}>{emoji}</span>
            <span
                style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    fontFamily: 'Outfit, sans-serif',
                    background: `linear-gradient(135deg, #e2e8f0, ${color})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                {count.toLocaleString('fr-FR')}{suffix}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
                {label}
            </span>
        </div>
    )
}
