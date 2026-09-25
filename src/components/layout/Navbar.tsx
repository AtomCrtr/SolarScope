'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import LanguageToggle, { useSiteLocale } from '@/components/layout/LanguageToggle'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

/* ─────────────────────────────────────────────
   Navigation structure — 5 logical categories
───────────────────────────────────────────── */
type NavGroup = {
    id: string
    label: string
    color: string
    pages: Array<{ icon: SpaceIconName; title: string; href: string; desc: string }>
}

const NAV_GROUPS: NavGroup[] = [
    {
        id: 'systeme',
        label: 'Système solaire',
        color: '#ff8a3d',
        pages: [
            { icon: 'sun', title: 'Le Soleil', href: '/soleil', desc: 'Météo spatiale, éruptions, données SDO' },
            { icon: 'planet', title: 'Planètes', href: '/planetes', desc: 'Les 8 planètes en 3D + positions J2000' },
            { icon: 'mars', title: 'Mars', href: '/mars', desc: 'Photos rovers Curiosity & Perseverance' },
            { icon: 'asteroid', title: 'Astéroïdes', href: '/asteroides', desc: 'NEO qui frôlent la Terre — base NASA' },
            { icon: 'meteorite', title: 'Météorites', href: '/meteorites', desc: 'Catalogue historique sur carte interactive' },
        ],
    },
    {
        id: 'exploration',
        label: 'Exploration',
        color: '#8ec5ff',
        pages: [
            { icon: 'satellite', title: 'ISS Tracker', href: '/iss', desc: 'Position live de la Station Spatiale' },
            { icon: 'rocket', title: 'Missions', href: '/missions', desc: 'De Spoutnik à Artémis — 70 ans d\'histoire' },
        ],
    },
    {
        id: 'observation',
        label: 'Observation',
        color: '#c4b5fd',
        pages: [
            { icon: 'telescope', title: 'Télescope Webb', href: '/jwst', desc: 'Galerie des images JWST les plus épiques' },
            { icon: 'moon-stars', title: 'Ciel ce soir', href: '/ciel', desc: 'Carte du ciel selon ta géolocalisation' },
            { icon: 'camera', title: 'Photo du Jour', href: '/photo-du-jour', desc: 'APOD — image NASA choisie chaque jour' },
            { icon: 'exoplanet', title: 'Exoplanètes', href: '/exoplanetes', desc: 'Catalogue NASA des mondes confirmés' },
        ],
    },
    {
        id: 'decouverte',
        label: 'Découverte',
        color: '#5be3a4',
        pages: [
            { icon: 'news', title: 'Actualités', href: '/actualites', desc: 'Publications officielles NASA actualisées' },
            { icon: 'quiz', title: 'Quiz spatial', href: '/quiz', desc: 'Teste tes connaissances sur l\'Univers !' },
            { icon: 'passport', title: 'Passeport spatial', href: '/passeport', desc: 'Tes missions, sur cet appareil seulement' },
            { icon: 'family', title: 'Parents & enseignants', href: '/parents-enseignants', desc: 'Repères pour accompagner une mission' },
        ],
    },
]

const NAV_EN: Record<string, { label: string; pages: Record<string, { title: string; desc: string }> }> = {
    systeme: {
        label: 'Solar System',
        pages: {
            '/soleil': { title: 'The Sun', desc: 'Space weather, flares and SDO data' },
            '/planetes': { title: 'Planets', desc: 'The 8 planets in 3D + J2000 positions' },
            '/mars': { title: 'Mars', desc: 'Curiosity and Perseverance rover photos' },
            '/asteroides': { title: 'Asteroids', desc: 'Near-Earth objects — NASA database' },
            '/meteorites': { title: 'Meteorites', desc: 'Historic catalogue on an interactive map' },
        },
    },
    exploration: {
        label: 'Exploration',
        pages: {
            '/iss': { title: 'ISS Tracker', desc: 'Live position of the Space Station' },
            '/missions': { title: 'Missions', desc: 'From Sputnik to Artemis — 70 years of history' },
        },
    },
    observation: {
        label: 'Observation',
        pages: {
            '/jwst': { title: 'Webb Telescope', desc: 'A gallery of remarkable JWST images' },
            '/ciel': { title: 'Tonight’s sky', desc: 'A sky map for your location' },
            '/photo-du-jour': { title: 'Picture of the Day', desc: 'NASA’s image, selected every day' },
            '/exoplanetes': { title: 'Exoplanets', desc: 'NASA’s catalogue of confirmed worlds' },
        },
    },
    decouverte: {
        label: 'Discover',
        pages: {
            '/actualites': { title: 'News', desc: 'Updated official NASA stories' },
            '/quiz': { title: 'Space quiz', desc: 'Test what you know about the Universe!' },
            '/passeport': { title: 'Space passport', desc: 'Your missions, kept on this device only' },
            '/parents-enseignants': { title: 'Parents & teachers', desc: 'Helpful guides for every mission' },
        },
    },
}

export default function Navbar() {
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
        <header className={`${pathname === '/' ? 'site-header site-header-home' : 'site-header'} motion-enter`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 'var(--navbar-h)' }}>
            {/* Frosted glass bar */}
            <div className="site-navbar-surface" style={{
                height: '100%',
                background: scrolled ? 'rgba(2,2,14,0.88)' : 'rgba(2,2,14,0.65)',
                backdropFilter: 'saturate(180%) blur(36px)',
                WebkitBackdropFilter: 'saturate(180%) blur(36px)',
                borderBottom: scrolled ? '1px solid rgba(255,255,255,0.09)' : '1px solid rgba(255,255,255,0.04)',
                transition: 'background 0.4s, border-color 0.4s',
            }}>
                <div className="site-navbar-inner" style={{
                    height: '100%', maxWidth: 'var(--max-w)', margin: '0 auto',
                    padding: '0 2rem', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: '1.5rem',
                }}>

                    {/* Logo */}
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
                        <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                            <circle cx="18" cy="18" r="7" fill="#ff8a3d" />
                            <ellipse cx="18" cy="18" rx="16" ry="6.5" stroke="#8ec5ff" strokeWidth="2" transform="rotate(-24 18 18)" />
                            <circle cx="31" cy="11" r="2.4" fill="#eef1fa" />
                        </svg>
                        <span style={{
                            fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.3rem',
                            color: 'var(--text)', whiteSpace: 'nowrap',
                        }}>SolarScope</span>
                    </Link>

                    {/* ── Desktop nav — grouped dropdowns ── */}
                    <nav className="site-desktop-nav max-md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>

                        {/* Accueil pill */}
                        <Link href="/" style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            padding: '6px 11px', borderRadius: '10px', textDecoration: 'none',
                            fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap',
                            color: pathname === '/' ? 'var(--text)' : 'var(--text-subtle)',
                            background: pathname === '/' ? '#18214a' : 'transparent',
                            border: `1px solid ${pathname === '/' ? 'var(--orbit)' : 'transparent'}`,
                            transition: 'all 0.15s',
                        }}>
                            <SpaceIcon name="home" size={16} /><span>{locale === 'fr' ? 'Accueil' : 'Home'}</span>
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
                                        color: isActive || isOpen ? 'var(--text)' : 'var(--text-subtle)',
                                        background: isActive ? `${group.color}22` : isOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        border: `1px solid ${isActive ? `${group.color}44` : 'transparent'}`,
                                        transition: 'all 0.15s',
                                    }}>
                                        <span>{group.label}</span>
                                        <span className="nav-chevron" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : undefined }} aria-hidden="true">▼</span>
                                    </button>

                                    {/* Dropdown panel */}
                                    <>
                                        {isOpen && (
                                            <div className="motion-enter" onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current) }} onMouseLeave={handleMouseLeave} style={{
                                                    position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                                                    background: 'rgba(11,16,38,0.95)', backdropFilter: 'saturate(180%) blur(28px)',
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
                                                                color: isPageActive ? group.color : 'var(--text-subtle)',
                                                            }}><SpaceIcon name={page.icon} size={18} /></div>
                                                            <div>
                                                                <div style={{ color: isPageActive ? group.color : 'var(--text)', fontSize: '0.88rem', fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                                                                    {page.title}
                                                                </div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', lineHeight: 1.3, marginTop: 2 }}>
                                                                    {page.desc}
                                                                </div>
                                                            </div>
                                                            {isPageActive && (
                                                                <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                                                            )}
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </>
                                </div>
                            )
                        })}
                    </nav>

                    {/* ── Right slot: language + mobile hamburger ── */}
                    <div className="site-navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <LanguageToggle />
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
                                cursor: 'pointer', color: 'var(--text)', flexShrink: 0,
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', transition: 'all 0.2s',
                                // Do NOT set display here — let md:hidden do it
                            }}
                        >
                            <>
                                <span className="motion-enter" key={mobileOpen ? 'x' : 'h'}>
                                    {mobileOpen ? '✕' : '☰'}
                                </span>
                            </>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile menu — grouped accordion ── */}
            <>
                {mobileOpen && (
                    <div ref={mobileMenuRef} id="mobile-navigation" className="md:hidden motion-enter" style={{
                            position: 'absolute', top: 'var(--navbar-h)', left: 0, right: 0,
                            background: 'rgba(11,16,38,0.97)',
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
                                background: pathname === '/' ? '#18214a' : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${pathname === '/' ? 'var(--orbit)' : 'rgba(255,255,255,0.05)'}`,
                                color: pathname === '/' ? 'var(--text)' : 'var(--text-subtle)',
                                fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.375rem',
                            }}>
                                <SpaceIcon name="home" size={18} /> {locale === 'fr' ? 'Accueil' : 'Home'}
                            </Link>

                            {/* Category groups */}
                            {navGroups.map(group => {
                                const isGroupOpen = mobileGroup === group.id
                                const isActive = activeGroup === group.id
                                const mobileGroupPanelId = `mobile-navigation-group-${group.id}`
                                return (
                                    <div key={group.id} style={{ marginBottom: '0.375rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setMobileGroup(isGroupOpen ? null : group.id)}
                                            aria-expanded={isGroupOpen}
                                            aria-controls={mobileGroupPanelId}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '0.7rem 0.875rem', borderRadius: '10px', cursor: 'pointer',
                                                background: isActive ? `${group.color}12` : 'rgba(255,255,255,0.03)',
                                                border: `1px solid ${isActive ? `${group.color}28` : 'rgba(255,255,255,0.05)'}`,
                                            }}>
                                            <span style={{ color: isActive ? group.color : 'var(--text-subtle)', fontSize: '0.9rem', fontWeight: 700 }}>
                                                {group.label}
                                            </span>
                                            <span className="nav-chevron" style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'inline-block', transform: isGroupOpen ? 'rotate(180deg)' : undefined }} aria-hidden="true">▼</span>
                                        </button>
                                        <>
                                            {isGroupOpen && (
                                                <div className="motion-enter" id={mobileGroupPanelId} style={{ overflow: 'hidden', paddingLeft: '0.5rem', marginTop: '0.25rem' }}>
                                                    {group.pages.map(page => {
                                                        const active = pathname === page.href
                                                        return (
                                                            <Link key={page.href} href={page.href}
                                                                onClick={() => setMobileOpen(false)}
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                                                                    padding: '0.55rem 0.75rem', borderRadius: '9px', textDecoration: 'none',
                                                                    background: active ? `${group.color}12` : 'transparent',
                                                                    color: active ? group.color : 'var(--text-subtle)',
                                                                    fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem',
                                                                }}>
                                                                <SpaceIcon name={page.icon} size={18} />
                                                                <div>
                                                                    <div>{page.title}</div>
                                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 400 }}>{page.desc}</div>
                                                                </div>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </>
        </header>
    )
}
