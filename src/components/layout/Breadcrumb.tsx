'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

// Must mirror NAV_GROUPS from Navbar exactly
const GROUPS = [
    {
        id: 'systeme', label: 'Système Solaire', href: null,
        pages: [
            { href: '/soleil', title: 'Soleil' }, { href: '/planetes', title: 'Planètes' },
            { href: '/mars', title: 'Mars' }, { href: '/asteroides', title: 'Astéroïdes' },
            { href: '/meteorites', title: 'Météorites' },
        ],
    },
    {
        id: 'exploration', label: 'Exploration', href: null,
        pages: [{ href: '/iss', title: 'ISS Tracker' }, { href: '/missions', title: 'Missions' }],
    },
    {
        id: 'observation', label: 'Observation', href: null,
        pages: [
            { href: '/jwst', title: 'Télescope Webb' }, { href: '/ciel', title: 'Ciel ce soir' },
            { href: '/photo-du-jour', title: 'Photo du Jour' }, { href: '/exoplanetes', title: 'Exoplanètes' },
        ],
    },
    {
        id: 'decouverte', label: 'Découverte', href: null,
        pages: [
            { href: '/actualites', title: 'Actualités' }, { href: '/quiz', title: 'Quiz' },
            { href: '/passeport', title: 'Passeport spatial' }, { href: '/parents-enseignants', title: 'Parents & enseignants' },
        ],
    },
]

export default function Breadcrumb() {
    const pathname = usePathname()

    // Find which group and page the current path belongs to
    const group = GROUPS.find(g => g.pages.some(p => pathname.startsWith(p.href)))
    const page = group?.pages.find(p => pathname.startsWith(p.href))

    // Don't show on homepage
    if (!group || !page || pathname === '/') return null

    return (
        <nav style={{
            display: 'flex', alignItems: 'center', gap: '0.375rem',
            fontSize: '0.72rem', color: '#334155', marginBottom: '0.5rem',
            fontWeight: 500,
        }} aria-label="Fil d'Ariane">
            <Link href="/" style={{ color: '#334155', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#64748b')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#334155')}>
                SolarScope
            </Link>
            <span style={{ color: '#1e293b' }}>›</span>
            <span style={{ color: '#475569' }}>{group.label}</span>
            <span style={{ color: '#1e293b' }}>›</span>
            <span style={{ color: '#6366f1', fontWeight: 600 }}>{page.title}</span>
        </nav>
    )
}
