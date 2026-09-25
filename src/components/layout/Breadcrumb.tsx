'use client'

import Link from '@/components/ui/LocaleLink'
import { usePagePath, useSiteLocale } from '@/components/layout/LanguageToggle'

type Text = { fr: string; en: string }

// Must mirror NAV_GROUPS (and NAV_EN) from Navbar
const GROUPS: Array<{ id: string; label: Text; pages: Array<{ href: string; title: Text }> }> = [
    {
        id: 'systeme', label: { fr: 'Système Solaire', en: 'Solar System' },
        pages: [
            { href: '/soleil', title: { fr: 'Soleil', en: 'The Sun' } },
            { href: '/planetes', title: { fr: 'Planètes', en: 'Planets' } },
            { href: '/mars', title: { fr: 'Mars', en: 'Mars' } },
            { href: '/asteroides', title: { fr: 'Astéroïdes', en: 'Asteroids' } },
            { href: '/meteorites', title: { fr: 'Météorites', en: 'Meteorites' } },
        ],
    },
    {
        id: 'exploration', label: { fr: 'Exploration', en: 'Exploration' },
        pages: [
            { href: '/iss', title: { fr: 'ISS Tracker', en: 'ISS Tracker' } },
            { href: '/missions', title: { fr: 'Missions', en: 'Missions' } },
        ],
    },
    {
        id: 'observation', label: { fr: 'Observation', en: 'Observation' },
        pages: [
            { href: '/jwst', title: { fr: 'Télescope Webb', en: 'Webb Telescope' } },
            { href: '/ciel', title: { fr: 'Ciel ce soir', en: 'Tonight’s sky' } },
            { href: '/photo-du-jour', title: { fr: 'Photo du Jour', en: 'Picture of the Day' } },
            { href: '/exoplanetes', title: { fr: 'Exoplanètes', en: 'Exoplanets' } },
        ],
    },
    {
        id: 'decouverte', label: { fr: 'Découverte', en: 'Discover' },
        pages: [
            { href: '/actualites', title: { fr: 'Actualités', en: 'News' } },
            { href: '/quiz', title: { fr: 'Quiz', en: 'Space quiz' } },
            { href: '/passeport', title: { fr: 'Passeport spatial', en: 'Space passport' } },
            { href: '/parents-enseignants', title: { fr: 'Parents & enseignants', en: 'Parents & teachers' } },
        ],
    },
]

export default function Breadcrumb() {
    const pathname = usePagePath()
    const locale = useSiteLocale()

    // Find which group and page the current path belongs to
    const group = GROUPS.find(g => g.pages.some(p => pathname.startsWith(p.href)))
    const page = group?.pages.find(p => pathname.startsWith(p.href))

    // Don't show on homepage
    if (!group || !page || pathname === '/') return null

    return (
        <nav className="breadcrumb" aria-label={locale === 'en' ? 'Breadcrumb' : 'Fil d’Ariane'} lang={locale === 'en' ? 'en' : undefined}>
            <Link href="/" className="breadcrumb-link">SolarScope</Link>
            <span className="breadcrumb-separator" aria-hidden="true">›</span>
            <span>{group.label[locale]}</span>
            <span className="breadcrumb-separator" aria-hidden="true">›</span>
            <span className="breadcrumb-current" aria-current="page">{page.title[locale]}</span>
        </nav>
    )
}
