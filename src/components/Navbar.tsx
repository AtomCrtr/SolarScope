'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import LanguageToggle, { useSiteLocale } from '@/components/LanguageToggle'

/* ─────────────────────────────────────────────
   Navigation structure — 5 logical categories
───────────────────────────────────────────── */
const NAV_GROUPS = [
    {
        id: 'systeme',
        label: '🌞 Système Solaire',
        color: '#f59e0b',
        pages: [
            { icon: '☀️', title: 'Le Soleil', href: '/soleil', desc: 'Météo spatiale, éruptions, données SDO' },
            { icon: '🪐', title: 'Planètes', href: '/planetes', desc: 'Les 8 planètes en 3D + positions J2000' },
            { icon: '🔴', title: 'Mars', href: '/mars', desc: 'Photos rovers Curiosity & Perseverance' },
            { icon: '☄️', title: 'Astéroïdes', href: '/asteroides', desc: 'NEO qui frôlent la Terre — base NASA' },
            { icon: '🪨', title: 'Météorites', href: '/meteorites', desc: 'Catalogue historique sur carte interactive' },
        ],
    },
    {
        id: 'exploration',
        label: '🚀 Exploration',
        color: '#3b82f6',
        pages: [
            { icon: '🛰️', title: 'ISS Tracker', href: '/iss', desc: 'Position live de la Station Spatiale' },
            { icon: '🚀', title: 'Missions', href: '/missions', desc: 'De Spoutnik à Artémis — 70 ans d\'histoire' },
        ],
    },
    {
        id: 'observation',
        label: '🔭 Observation',
        color: '#a855f7',
        pages: [
            { icon: '🔭', title: 'Télescope Webb', href: '/jwst', desc: 'Galerie des images JWST les plus épiques' },
            { icon: '🌌', title: 'Ciel ce soir', href: '/ciel', desc: 'Carte du ciel selon ta géolocalisation' },
            { icon: '🌠', title: 'Photo du Jour', href: '/photo-du-jour', desc: 'APOD — image NASA choisie chaque jour' },
            { icon: '🌟', title: 'Exoplanètes', href: '/exoplanetes', desc: 'Catalogue NASA des mondes confirmés' },
        ],
    },
    {
        id: 'decouverte',
        label: '🎓 Découverte',
        color: '#10b981',
        pages: [
            { icon: '📰', title: 'Actualités', href: '/actualites', desc: 'Publications officielles NASA actualisées' },
            { icon: '🎮', title: 'Quiz spatial', href: '/quiz', desc: 'Teste tes connaissances sur l\'Univers !' },
        ],
    },
]

const NAV_EN: Record<string, { label: string; pages: Record<string, { title: string; desc: string }> }> = {
    systeme: {
        label: '🌞 Solar System',
        pages: {
            '/soleil': { title: 'The Sun', desc: 'Space weather, flares and SDO data' },
            '/planetes': { title: 'Planets', desc: 'The 8 planets in 3D + J2000 positions' },
            '/mars': { title: 'Mars', desc: 'Curiosity and Perseverance rover photos' },
            '/asteroides': { title: 'Asteroids', desc: 'Near-Earth objects — NASA database' },
            '/meteorites': { title: 'Meteorites', desc: 'Historic catalogue on an interactive map' },
        },
    },
    exploration: {
        label: '🚀 Exploration',
        pages: {
            '/iss': { title: 'ISS Tracker', desc: 'Live position of the Space Station' },
            '/missions': { title: 'Missions', desc: 'From Sputnik to Artemis — 70 years of history' },
        },
    },
    observation: {
        label: '🔭 Observation',
        pages: {
            '/jwst': { title: 'Webb Telescope', desc: 'A gallery of remarkable JWST images' },
            '/ciel': { title: 'Tonight’s sky', desc: 'A sky map for your location' },
            '/photo-du-jour': { title: 'Picture of the Day', desc: 'NASA’s image, selected every day' },
            '/exoplanetes': { title: 'Exoplanets', desc: 'NASA’s catalogue of confirmed worlds' },
        },
    },
    decouverte: {
        label: '🎓 Discover',
        pages: {
            '/actualites': { title: 'News', desc: 'Updated official NASA stories' },
            '/quiz': { title: 'Space quiz', desc: 'Test what you know about the Universe!' },
        },
    },
}

export default function Navbar({ themeToggle }: { themeToggle?: React.ReactNode }) {
    const pathname = usePathname()
    const locale = useSiteLocale()
    const [openGroup, setOpenGroup] = useState<string | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [mobileGroup, setMobileGroup] = useState<string | null>(null)
    const [scrolled, setScrolled] = useState(false)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
    const mobileButtonRef = useRef<HTMLButtonElement>(null)
    const mobileMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close dropdown when navigating
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setOpenGroup(null)
            setMobileOpen(false)
        })
        return () => cancelAnimationFrame(frame)
    }, [pathname])

    useEffect(() => {
        if (!mobileOpen) return
        const frame = requestAnimationFrame(() => mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a')?.focus())
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false)
                mobileButtonRef.current?.focus()
            }
        }
        document.addEventListener('keydown', onKeyDown)
        return () => {
            cancelAnimationFrame(frame)
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [mobileOpen])

    const handleMouseEnter = (id: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current)
        setOpenGroup(id)
    }
    const handleMouseLeave = () => {
        closeTimer.current = setTimeout(() => setOpenGroup(null), 160)
    }

    // Which group contains the current page?
    const navGroups = locale === 'en'
        ? NAV_GROUPS.map(group => ({
            ...group,
            label: NAV_EN[group.id].label,
            pages: group.pages.map(page => ({ ...page, ...NAV_EN[group.id].pages[page.href] })),
        }))
        : NAV_GROUPS
    const activeGroup = navGroups.find(g => g.pages.some(p => pathname.startsWith(p.href)))?.id

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 'var(--navbar-h)' }}
        >
            {/* Frosted glass bar */}
            <div style={{
                height: '100%',
                background: scrolled ? 'rgba(2,2,14,0.88)' : 'rgba(2,2,14,0.65)',
                backdropFilter: 'saturate(180%) blur(36px)',
                WebkitBackdropFilter: 'saturate(180%) blur(36px)',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.04)',
                transition: 'background 0.4s, border-color 0.4s',
            }}>
                <div style={{
                    height: '100%', maxWidth: 'var(--max-w)', margin: '0 auto',
                    padding: '0 2rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '1.5rem',
                }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 9,
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', boxShadow: '0 2px 14px rgba(139,92,246,0.5)',
                        }}>🔭</div>
                        <span style={{
                            fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.05rem',
                            letterSpacing: '-0.03em',
                            background: 'linear-gradient(135deg, #f1f5f9 30%, #c4b5fd 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            whiteSpace: 'nowrap',
                        }}>SolarScope</span>
                    </Link>

                    {/* ── Desktop nav — grouped dropdowns ── */}
                    <nav className="max-md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>

                        {/* Accueil pill */}
                        <Link href="/" style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            padding: '6px 11px', borderRadius: '10px', textDecoration: 'none',
                            fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap',
                            color: pathname === '/' ? '#fff' : '#6b7280',
                            background: pathname === '/' ? 'rgba(139,92,246,0.18)' : 'transparent',
                            border: `1px solid ${pathname === '/' ? 'rgba(139,92,246,0.3)' : 'transparent'}`,
                            transition: 'all 0.15s',
                        }}>
                            <span>🏠</span><span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
                        </Link>

                        {/* Category groups */}
                        {navGroups.map(group => {
                            const isOpen = openGroup === group.id
                            const isActive = activeGroup === group.id
                            return (
                                <div key={group.id} style={{ position: 'relative' }}
                                    onMouseEnter={() => handleMouseEnter(group.id)}
                                    onMouseLeave={handleMouseLeave}>

                                    {/* Group trigger button */}
                                    <button
                                        type="button"
                                        aria-expanded={isOpen}
                                        aria-haspopup="true"
                                        onClick={() => setOpenGroup(isOpen ? null : group.id)}
                                        style={{
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        padding: '6px 11px', borderRadius: '10px', cursor: 'pointer',
                                        fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap',
                                        color: isActive ? '#fff' : isOpen ? '#e2e8f0' : '#6b7280',
                                        background: isActive ? `${group.color}22` : isOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        border: `1px solid ${isActive ? `${group.color}44` : 'transparent'}`,
                                        transition: 'all 0.15s',
                                    }}>
                                        <span>{group.label}</span>
                                        <motion.span
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                            style={{ fontSize: '0.6rem', color: '#475569', display: 'inline-block' }}>▼</motion.span>
                                    </button>

                                    {/* Dropdown panel */}
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                                transition={{ duration: 0.16, ease: 'easeOut' }}
                                                onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }}
                                                onMouseLeave={handleMouseLeave}
                                                style={{
                                                    position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                                                    background: 'rgba(4,4,20,0.95)', backdropFilter: 'saturate(180%) blur(28px)',
                                                    WebkitBackdropFilter: 'saturate(180%) blur(28px)',
                                                    border: `1px solid ${group.color}22`,
                                                    borderRadius: '14px', padding: '0.5rem',
                                                    minWidth: 260, zIndex: 300,
                                                    boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px ${group.color}15`,
                                                }}>
                                                {/* Color accent line */}
                                                <div style={{ height: 2, background: `linear-gradient(90deg, ${group.color}60, transparent)`, borderRadius: 99, marginBottom: '0.5rem', marginLeft: '0.25rem', marginRight: '0.25rem' }} />

                                                {group.pages.map(page => {
                                                    const isPageActive = pathname === page.href
                                                    return (
                                                        <Link key={page.href} href={page.href}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                                padding: '0.6rem 0.75rem', borderRadius: '10px', textDecoration: 'none',
                                                                background: isPageActive ? `${group.color}15` : 'transparent',
                                                                border: `1px solid ${isPageActive ? `${group.color}30` : 'transparent'}`,
                                                                transition: 'all 0.15s',
                                                            }}
                                                            onMouseEnter={e => {
                                                                if (!isPageActive) {
                                                                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'
                                                                }
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (!isPageActive) {
                                                                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                                                                }
                                                            }}>
                                                            <div style={{
                                                                width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
                                                                background: isPageActive ? `${group.color}20` : 'rgba(255,255,255,0.05)',
                                                                border: `1px solid ${isPageActive ? `${group.color}35` : 'rgba(255,255,255,0.07)'}`,
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '1rem',
                                                            }}>{page.icon}</div>
                                                            <div>
                                                                <div style={{ color: isPageActive ? group.color : '#e2e8f0', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'Outfit', lineHeight: 1.2 }}>
                                                                    {page.title}
                                                                </div>
                                                                <div style={{ color: '#475569', fontSize: '0.68rem', lineHeight: 1.3, marginTop: 2 }}>
                                                                    {page.desc}
                                                                </div>
                                                            </div>
                                                            {isPageActive && (
                                                                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                                                            )}
                                                        </Link>
                                                    )
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </nav>

                    {/* ── Right slot: theme toggle (always) + mobile hamburger (hidden on desktop) ── */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <LanguageToggle />
                        {themeToggle}
                        {/* Mobile hamburger — Tailwind md:hidden hides it on ≥768px */}
                        <button
                            ref={mobileButtonRef}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-navigation"
                            type="button"
                            className="md:hidden"
                            style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: mobileOpen ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${mobileOpen ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                cursor: 'pointer', color: '#e2e8f0', flexShrink: 0,
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', transition: 'all 0.2s',
                                // Do NOT set display here — let md:hidden do it
                            }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.span key={mobileOpen ? 'x' : 'h'}
                                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    {mobileOpen ? '✕' : '☰'}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile menu — grouped accordion ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        id="mobile-navigation"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="md:hidden"
                        style={{
                            position: 'absolute', top: 'var(--navbar-h)', left: 0, right: 0,
                            background: 'rgba(2,2,14,0.97)',
                            backdropFilter: 'saturate(180%) blur(32px)',
                            WebkitBackdropFilter: 'saturate(180%) blur(32px)',
                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                            overflow: 'hidden', zIndex: 99,
                        }}>
                        <div style={{ padding: '0.75rem' }}>
                            {/* Accueil */}
                            <Link href="/" onClick={() => setMobileOpen(false)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                padding: '0.7rem 0.875rem', borderRadius: '10px', textDecoration: 'none',
                                background: pathname === '/' ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${pathname === '/' ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)'}`,
                                color: pathname === '/' ? '#c4b5fd' : '#94a3b8',
                                fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.375rem',
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>🏠</span> {locale === 'fr' ? 'Accueil' : 'Home'}
                            </Link>

                            {/* Category groups */}
                            {navGroups.map(group => {
                                const isGroupOpen = mobileGroup === group.id
                                const isActive = activeGroup === group.id
                                return (
                                    <div key={group.id} style={{ marginBottom: '0.375rem' }}>
                                        <button
                                            onClick={() => setMobileGroup(isGroupOpen ? null : group.id)}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '0.7rem 0.875rem', borderRadius: '10px', cursor: 'pointer',
                                                background: isActive ? `${group.color}12` : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${isActive ? `${group.color}28` : 'rgba(255,255,255,0.05)'}`,
                                            }}>
                                            <span style={{ color: isActive ? group.color : '#94a3b8', fontSize: '0.82rem', fontWeight: 700 }}>
                                                {group.label}
                                            </span>
                                            <motion.span animate={{ rotate: isGroupOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
                                                style={{ color: '#475569', fontSize: '0.65rem' }}>▼</motion.span>
                                        </button>
                                        <AnimatePresence>
                                            {isGroupOpen && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                                    style={{ overflow: 'hidden', paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                                                    {group.pages.map(page => {
                                                        const active = pathname === page.href
                                                        return (
                                                            <Link key={page.href} href={page.href}
                                                                onClick={() => setMobileOpen(false)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                                                                    padding: '0.55rem 0.75rem', borderRadius: '9px', textDecoration: 'none',
                                                                    background: active ? `${group.color}12` : 'transparent',
                                                                    color: active ? group.color : '#64748b',
                                                                    fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem',
                                                                }}>
                                                                <span>{page.icon}</span>
                                                                <div>
                                                                    <div>{page.title}</div>
                                                                    <div style={{ color: '#334155', fontSize: '0.65rem', fontWeight: 400 }}>{page.desc}</div>
                                                                </div>
                                                            </Link>
                                                        )
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    )
}
