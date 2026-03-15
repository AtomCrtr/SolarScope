'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('solarscope-theme') as 'dark' | 'light' | null
        const preferred = saved || 'dark'
        setTheme(preferred)
        document.documentElement.setAttribute('data-theme', preferred)
    }, [])

    const toggle = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark'
        setTheme(next)
        localStorage.setItem('solarscope-theme', next)
        document.documentElement.setAttribute('data-theme', next)
    }, [theme])

    if (!mounted) return null

    return (
        <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.9 }}
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            style={{
                width: 36, height: 36, borderRadius: 10, cursor: 'pointer', flexShrink: 0,
                background: theme === 'light' ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${theme === 'light' ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', transition: 'all 0.2s',
                color: '#e2e8f0',
            }}>
            <AnimatePresence mode="wait">
                <motion.span key={theme}
                    initial={{ rotate: -45, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 45, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </motion.span>
            </AnimatePresence>
        </motion.button>
    )
}
