'use client'

import Link from 'next/link'

const FOOTER_GROUPS = [
    {
        label: '🌞 Système Solaire',
        links: [
            { title: 'Le Soleil', href: '/soleil' },
            { title: 'Les Planètes', href: '/planetes' },
            { title: 'Mars', href: '/mars' },
            { title: 'Astéroïdes', href: '/asteroides' },
            { title: 'Météorites', href: '/meteorites' },
        ],
    },
    {
        label: '🚀 Exploration',
        links: [
            { title: 'ISS Tracker', href: '/iss' },
            { title: 'Missions spatiales', href: '/missions' },
        ],
    },
    {
        label: '🔭 Observation',
        links: [
            { title: 'Télescope Webb', href: '/jwst' },
            { title: 'Ciel ce soir', href: '/ciel' },
            { title: 'Photo du Jour', href: '/photo-du-jour' },
            { title: 'Exoplanètes', href: '/exoplanetes' },
        ],
    },
    {
        label: '🎓 Découverte',
        links: [
            { title: 'Actualités spatiales', href: '/actualites' },
            { title: 'Quiz spatial', href: '/quiz' },
        ],
    },
]

const SOURCES = [
    { name: 'NASA APIs', url: 'https://api.nasa.gov', desc: 'APOD, NeoWs, Mars Photos' },
    { name: 'NOAA SWPC', url: 'https://www.swpc.noaa.gov', desc: 'Météo spatiale & Kp index' },
    { name: 'NASA SDO', url: 'https://sdo.gsfc.nasa.gov', desc: 'Images solaires en direct' },
    { name: 'ESA / JWST', url: 'https://webbtelescope.org', desc: 'Images du télescope Webb' },
    { name: 'The Space Devs', url: 'https://thespacedevs.com', desc: 'Prochains lancements' },
    { name: 'NASA Open Data', url: 'https://data.nasa.gov', desc: 'Base météorites & plus' },
]

export default function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer style={{
            position: 'relative', zIndex: 10,
            background: 'rgba(2,2,14,0.96)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: '4rem',
        }}>
            {/* Top gradient accent */}
            <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(99,102,241,0.4), transparent)' }} />

            <div style={{ maxWidth: 'var(--max-w)', margin: '0 auto', padding: '3rem 2rem 1.5rem' }}>

                {/* Main footer grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr repeat(4, 1fr)', gap: '2rem', marginBottom: '2.5rem' }} className="max-md:grid-cols-2 max-sm:grid-cols-1">

                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 9,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1rem', boxShadow: '0 2px 14px rgba(139,92,246,0.45)',
                            }}>🔭</div>
                            <span style={{
                                fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #f1f5f9, #c4b5fd)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>SolarScope</span>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.7, maxWidth: 240, marginBottom: '1rem' }}>
                            Explorer l&apos;Univers avec des données scientifiques réelles. Conçu pour les curieux, les élèves et les passionnés d&apos;astronomie.
                        </p>
                        {/* Social / contact */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {[
                                { icon: '🌐', label: 'NASA', href: 'https://NASA.gov' },
                                { icon: '📡', label: 'ESA', href: 'https://esa.int' },
                                { icon: '🛸', label: 'CNES', href: 'https://cnes.fr' },
                            ].map(s => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                                    padding: '4px 10px', borderRadius: 99, textDecoration: 'none',
                                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                                    color: '#64748b', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.15s',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#c4b5fd'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,181,253,0.25)' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748b'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)' }}>
                                    {s.icon} {s.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation groups */}
                    {FOOTER_GROUPS.map(group => (
                        <div key={group.label}>
                            <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                                {group.label}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                {group.links.map(link => (
                                    <Link key={link.href} href={link.href} style={{
                                        color: '#475569', fontSize: '0.8rem', textDecoration: 'none',
                                        transition: 'color 0.15s',
                                    }}
                                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#c4b5fd')}
                                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#475569')}>
                                        {link.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Data sources */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{ color: '#334155', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                        📡 Sources de données
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {SOURCES.map(s => (
                            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                                display: 'flex', flexDirection: 'column', padding: '0.4rem 0.75rem',
                                borderRadius: '0.5rem', textDecoration: 'none',
                                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                                transition: 'all 0.15s',
                            }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.2)' }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)' }}>
                                <span style={{ color: '#64748b', fontSize: '0.72rem', fontWeight: 700 }}>{s.name}</span>
                                <span style={{ color: '#334155', fontSize: '0.62rem' }}>{s.desc}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <p style={{ color: '#1e293b', fontSize: '0.72rem' }}>
                        © {year} SolarScope · Données scientifiques NASA, ESA, NOAA · Éducatif & non commercial
                    </p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {['Confidentialité', 'À propos', 'Contact'].map(l => (
                            <span key={l} style={{ color: '#1e293b', fontSize: '0.72rem', cursor: 'pointer' }}>{l}</span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
