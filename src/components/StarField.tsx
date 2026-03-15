'use client'

import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    z: number
    size: number
    opacity: number
    speed: number
}

export default function StarField() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number
        const stars: Star[] = []
        const STAR_COUNT = 200

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        // Create stars
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random(),
                size: Math.random() * 2 + 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.3 + 0.05,
            })
        }

        // A few nebula-like colored blobs
        const blobs = [
            { x: 0.15, y: 0.2, r: 300, color: 'rgba(99,102,241,0.04)' },
            { x: 0.85, y: 0.75, r: 250, color: 'rgba(139,92,246,0.05)' },
            { x: 0.5, y: 0.5, r: 200, color: 'rgba(59,130,246,0.03)' },
        ]

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Nebula blobs
            blobs.forEach(b => {
                const grd = ctx.createRadialGradient(
                    b.x * canvas.width, b.y * canvas.height, 0,
                    b.x * canvas.width, b.y * canvas.height, b.r
                )
                grd.addColorStop(0, b.color)
                grd.addColorStop(1, 'transparent')
                ctx.fillStyle = grd
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            })

            // Stars
            stars.forEach(s => {
                s.y += s.speed
                if (s.y > canvas.height) {
                    s.y = 0
                    s.x = Math.random() * canvas.width
                }

                // Twinkle
                const twinkle = Math.sin(Date.now() * 0.001 * s.speed * 2 + s.x) * 0.3 + 0.7

                ctx.beginPath()
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`
                ctx.fill()
            })

            animId = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ background: 'linear-gradient(135deg, #060614 0%, #0d0d2b 50%, #060614 100%)' }}
        />
    )
}
