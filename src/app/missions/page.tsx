'use client'

import { useState, useEffect } from 'react'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import dynamic from 'next/dynamic'
import KidsGuide from '@/components/learning/KidsGuide'
import MetricGrid from '@/components/space/MetricGrid'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import type { SiteLocale } from '@/lib/i18n/paths'

const SpaceXSection = dynamic(() => import('@/components/space/SpaceXSection'), { ssr: false })

type Text = Record<SiteLocale, string>
type MissionType = 'satellite' | 'crewed' | 'probe' | 'telescope' | 'rover' | 'station'
type MissionStatus = 'active' | 'ended'

const MISSIONS: Array<{ name: Text; year: number; country: Text; type: MissionType; status: MissionStatus; icon: SpaceIconName; description: Text; fun: Text }> = [
    { name: { fr: 'Spoutnik 1', en: 'Sputnik 1' }, year: 1957, country: { fr: 'URSS', en: 'USSR' }, type: 'satellite', status: 'ended', icon: 'signal',
      description: { fr: 'Le tout premier satellite artificiel ! Il a émis ses « bip-bip » pendant 21 jours en tournant autour de la Terre.', en: 'The very first artificial satellite! It sent out its “beep-beep” for 21 days while circling Earth.' },
      fun: { fr: 'Spoutnik signifie « compagnon de voyage » en russe.', en: 'Sputnik means “travelling companion” in Russian.' } },
    { name: { fr: 'Vostok 1 (Gagarine)', en: 'Vostok 1 (Gagarin)' }, year: 1961, country: { fr: 'URSS', en: 'USSR' }, type: 'crewed', status: 'ended', icon: 'rocket',
      description: { fr: 'Youri Gagarine devient le premier humain dans l’espace ! Son vol a duré 108 minutes.', en: 'Yuri Gagarin becomes the first human in space! His flight lasted 108 minutes.' },
      fun: { fr: 'Au décollage, Gagarine a dit « Poyekhali ! » : « C’est parti ! »', en: 'At lift-off, Gagarin said “Poyekhali!”: “Let’s go!”' } },
    { name: { fr: 'Apollo 11', en: 'Apollo 11' }, year: 1969, country: { fr: 'USA', en: 'USA' }, type: 'crewed', status: 'ended', icon: 'moon-stars',
      description: { fr: 'Neil Armstrong et Buzz Aldrin deviennent les premiers humains à marcher sur la Lune.', en: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon.' },
      fun: { fr: 'Armstrong a piloté lui-même la fin de la descente pour éviter une zone couverte de rochers.', en: 'Armstrong flew the end of the landing himself to avoid an area covered in boulders.' } },
    { name: { fr: 'Voyager 1', en: 'Voyager 1' }, year: 1977, country: { fr: 'USA', en: 'USA' }, type: 'probe', status: 'active', icon: 'satellite',
      description: { fr: 'L’engin le plus lointain jamais envoyé par l’humanité. Il voyage dans l’espace interstellaire, à plus de 25 milliards de km !', en: 'The farthest spacecraft humans have ever sent. It travels through interstellar space, more than 25 billion km away!' },
      fun: { fr: 'Voyager 1 emporte un disque doré avec des sons de la Terre, au cas où quelqu’un le trouverait un jour.', en: 'Voyager 1 carries a golden record with sounds of Earth, in case someone finds it one day.' } },
    { name: { fr: 'Hubble', en: 'Hubble' }, year: 1990, country: { fr: 'USA/ESA', en: 'USA/ESA' }, type: 'telescope', status: 'active', icon: 'telescope',
      description: { fr: 'Le télescope spatial qui a transformé notre vision de l’Univers. Il observe des étoiles, des nébuleuses et des galaxies très lointaines.', en: 'The space telescope that changed how we see the Universe. It observes stars, nebulae and very distant galaxies.' },
      fun: { fr: 'Hubble fait le tour de la Terre en environ 95 minutes.', en: 'Hubble goes around Earth in about 95 minutes.' } },
    { name: { fr: 'ISS', en: 'ISS' }, year: 1998, country: { fr: 'International', en: 'International' }, type: 'station', status: 'active', icon: 'satellite',
      description: { fr: 'Un laboratoire grand comme un terrain de football, en orbite à 400 km. Des astronautes y vivent en permanence depuis 2000.', en: 'A laboratory as big as a football pitch, orbiting 400 km up. Astronauts have lived there without a break since 2000.' },
      fun: { fr: 'L’ISS est visible à l’œil nu ! Elle ressemble à une étoile brillante qui se déplace.', en: 'You can see the ISS with the naked eye! It looks like a bright moving star.' } },
    { name: { fr: 'Curiosity (Mars)', en: 'Curiosity (Mars)' }, year: 2012, country: { fr: 'USA', en: 'USA' }, type: 'rover', status: 'active', icon: 'robot',
      description: { fr: 'Un rover de la taille d’une voiture qui explore le cratère Gale sur Mars. Il a découvert que cet endroit avait autrefois pu convenir à de minuscules formes de vie.', en: 'A car-sized rover exploring Gale Crater on Mars. It found that this place could once have suited tiny forms of life.' },
      fun: { fr: 'Pour son premier anniversaire sur Mars, son instrument SAM a joué la mélodie de « Joyeux anniversaire ».', en: 'For its first birthday on Mars, its SAM instrument played the tune of “Happy Birthday”.' } },
    { name: { fr: 'Rosetta / Philae', en: 'Rosetta / Philae' }, year: 2014, country: { fr: 'ESA', en: 'ESA' }, type: 'probe', status: 'ended', icon: 'meteorite',
      description: { fr: 'La première sonde à tourner autour d’une comète et à y poser un atterrisseur (Philae).', en: 'The first probe to orbit a comet and put a lander (Philae) on it.' },
      fun: { fr: 'Il a fallu 10 ans de voyage pour atteindre la comète Tchouri !', en: 'It took a 10-year journey to reach comet Churi!' } },
    { name: { fr: 'New Horizons', en: 'New Horizons' }, year: 2015, country: { fr: 'USA', en: 'USA' }, type: 'probe', status: 'active', icon: 'satellite',
      description: { fr: 'La première sonde à survoler Pluton ! Elle a montré un monde avec des montagnes de glace et une grande zone en forme de cœur.', en: 'The first probe to fly past Pluto! It revealed a world with ice mountains and a large heart-shaped region.' },
      fun: { fr: 'New Horizons emporte une partie des cendres de Clyde Tombaugh, qui a découvert Pluton.', en: 'New Horizons carries some of the ashes of Clyde Tombaugh, who discovered Pluto.' } },
    { name: { fr: 'James Webb (JWST)', en: 'James Webb (JWST)' }, year: 2021, country: { fr: 'USA/ESA/CSA', en: 'USA/ESA/CSA' }, type: 'telescope', status: 'active', icon: 'telescope',
      description: { fr: 'Le plus puissant télescope spatial jamais construit. Il observe l’Univers en infrarouge et voit certaines des premières galaxies.', en: 'The most powerful space telescope ever built. It observes the Universe in infrared and sees some of the very first galaxies.' },
      fun: { fr: 'Son miroir mesure 6,5 mètres de large, et sa surface est polie avec une précision de quelques dizaines de nanomètres.', en: 'Its mirror is 6.5 metres wide, and its surface is polished to within a few tens of nanometres.' } },
    { name: { fr: 'Perseverance (Mars)', en: 'Perseverance (Mars)' }, year: 2021, country: { fr: 'USA', en: 'USA' }, type: 'rover', status: 'active', icon: 'robot',
      description: { fr: 'Le rover explore le cratère Jezero et garde des échantillons de roche. Il a emporté Ingenuity, le premier hélicoptère à voler sur une autre planète.', en: 'The rover explores Jezero Crater and keeps rock samples. It carried Ingenuity, the first helicopter to fly on another planet.' },
      fun: { fr: 'Ingenuity a terminé sa mission en 2024 après 72 vols, bien plus que les cinq prévus.', en: 'Ingenuity ended its mission in 2024 after 72 flights, far more than the five planned.' } },
    { name: { fr: 'Artemis I', en: 'Artemis I' }, year: 2022, country: { fr: 'USA', en: 'USA' }, type: 'crewed', status: 'ended', icon: 'rocket',
      description: { fr: 'Le premier vol du programme Artemis. La capsule Orion a fait le tour de la Lune sans équipage.', en: 'The first flight of the Artemis programme. The Orion capsule flew around the Moon with no crew.' },
      fun: { fr: 'Cette mission a testé la fusée SLS et le vaisseau Orion avant le premier vol avec des astronautes.', en: 'This mission tested the SLS rocket and the Orion spacecraft before the first flight with astronauts.' } },
    { name: { fr: 'JUICE', en: 'JUICE' }, year: 2023, country: { fr: 'ESA', en: 'ESA' }, type: 'probe', status: 'active', icon: 'planet',
      description: { fr: 'Une mission vers Jupiter et ses lunes glacées Europe, Ganymède et Callisto, pour étudier leurs océans possibles.', en: 'A mission to Jupiter and its icy moons Europa, Ganymede and Callisto, to study their possible oceans.' },
      fun: { fr: 'JUICE doit arriver près de Jupiter en 2031, après environ huit ans de voyage.', en: 'JUICE should reach Jupiter in 2031, after about eight years of travel.' } },
    { name: { fr: 'Artemis II', en: 'Artemis II' }, year: 2026, country: { fr: 'USA/CSA', en: 'USA/CSA' }, type: 'crewed', status: 'ended', icon: 'rocket',
      description: { fr: 'Le premier vol habité du programme Artemis. Orion a emmené quatre astronautes autour de la Lune du 1er au 10 avril 2026.', en: 'The first crewed flight of the Artemis programme. Orion took four astronauts around the Moon from 1 to 10 April 2026.' },
      fun: { fr: 'L’équipage a battu le record de distance d’Apollo 13 avant de revenir dans l’océan Pacifique.', en: 'The crew beat Apollo 13’s distance record before splashing down in the Pacific Ocean.' } },
]

interface UpcomingLaunch {
    id: string
    name: string
    net: string
    agency: string
    rocket: string
    status: string
    image: string | null
    url: string | null
}

const TYPE_COLORS: Record<MissionType, string> = {
    satellite: '#94a3b8', crewed: '#a5b4fc', probe: '#f59e0b', telescope: '#10b981', rover: '#f87171', station: '#60a5fa',
}

const TYPE_LABELS: Record<MissionType, Text> = {
    satellite: { fr: 'Satellite', en: 'Satellite' },
    crewed: { fr: 'Vol habité', en: 'Crewed flight' },
    probe: { fr: 'Sonde', en: 'Probe' },
    telescope: { fr: 'Télescope', en: 'Telescope' },
    rover: { fr: 'Rover', en: 'Rover' },
    station: { fr: 'Station', en: 'Station' },
}

const ALL_TYPES = Object.keys(TYPE_COLORS) as MissionType[]

const COPY = {
    fr: {
        badge: 'EXPLORATION SPATIALE', title: 'Missions spatiales', subtitle: 'De Spoutnik à Artemis : près de 70 ans d’aventures humaines dans l’espace !',
        introTitle: 'Près de 70 ans d’exploration spatiale',
        intro: ['Depuis le premier satellite ', 'Spoutnik', ' en 1957, l’humanité n’a jamais cessé d’explorer l’espace. Des premiers pas sur la Lune aux rovers sur Mars, en passant par les télescopes qui voient les premières lumières de l’Univers, chaque mission repousse les limites de nos connaissances.'],
        kpis: 'Chiffres clés des missions spatiales', total: 'Missions présentées', activeCount: 'Missions en cours', agencies: 'Pays et agences', types: 'Types de missions',
        launches: 'Prochains lancements', launchesSource: 'Données en direct fournies par The Space Devs', loadingLaunches: 'Chargement des prochains lancements', noLaunch: 'Aucun lancement disponible pour le moment.',
        launchList: 'Prochains lancements, liste défilante', imminent: 'Imminent', inDays: (n: number) => `Dans ${n} j`, next: 'Prochain', launchPage: 'Fiche du lancement ↗', launchLabel: (name: string) => `Fiche du lancement ${name} (nouvel onglet)`,
        timeline: 'Frise chronologique', timelineLabel: 'Frise chronologique défilante des missions spatiales',
        all: 'Toutes', active: 'En cours', ended: 'Terminées', activeTag: 'En cours', endedTag: 'Terminée', count: (n: number) => `${n} mission${n > 1 ? 's' : ''}`, date: 'fr-FR',
    },
    en: {
        badge: 'SPACE EXPLORATION', title: 'Space missions', subtitle: 'From Sputnik to Artemis: almost 70 years of human adventures in space!',
        introTitle: 'Almost 70 years of space exploration',
        intro: ['Since the first satellite, ', 'Sputnik', ', in 1957, humans have never stopped exploring space. From the first steps on the Moon to rovers on Mars and telescopes that see the Universe’s first light, every mission pushes back the limits of what we know.'],
        kpis: 'Key figures about space missions', total: 'Missions shown', activeCount: 'Ongoing missions', agencies: 'Countries and agencies', types: 'Kinds of missions',
        launches: 'Upcoming launches', launchesSource: 'Live data provided by The Space Devs', loadingLaunches: 'Loading upcoming launches', noLaunch: 'No launch available right now.',
        launchList: 'Upcoming launches, scrolling list', imminent: 'Imminent', inDays: (n: number) => `In ${n} day${n === 1 ? '' : 's'}`, next: 'Next', launchPage: 'Launch details ↗', launchLabel: (name: string) => `Launch details for ${name} (new tab)`,
        timeline: 'Timeline', timelineLabel: 'Scrolling timeline of space missions',
        all: 'All', active: 'Ongoing', ended: 'Ended', activeTag: 'Ongoing', endedTag: 'Ended', count: (n: number) => `${n} mission${n === 1 ? '' : 's'}`, date: 'en-GB',
    },
}

export default function MissionsPage() {
    const locale = useSiteLocale()
    const t = COPY[locale]
    const [renderedAt] = useState(() => Date.now())
    const [typeFilter, setTypeFilter] = useState<MissionType[]>(ALL_TYPES)
    const [statusFilter, setStatusFilter] = useState<'all' | MissionStatus>('all')
    const [launches, setLaunches] = useState<UpcomingLaunch[]>([])
    const [launchLoading, setLaunchLoading] = useState(true)

    useEffect(() => {
        fetch('/api/launches?limit=5')
            .then(r => {
                if (!r.ok) throw new Error('launch calendar unavailable')
                return r.json()
            })
            .then(d => {
                setLaunches(d.launches || [])
            })
            .catch(() => { })
            .finally(() => setLaunchLoading(false))
    }, [])

    const filtered = MISSIONS.filter(m => typeFilter.includes(m.type) && (statusFilter === 'all' || m.status === statusFilter))
    const active = MISSIONS.filter(m => m.status === 'active').length

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
            <div className="page-header motion-enter">
                <div className="badge"><SpaceIcon name="rocket" size={18} className="inline-icon" /> {t.badge}</div>
                <h1 className="page-title">{t.title}</h1>
                <p className="page-subtitle">{t.subtitle}</p>
            </div>

            <KidsGuide topic="missions" />

            {/* Intro */}
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--nebula)' }}>{t.introTitle}</h2>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.875rem' }}>
                    {t.intro[0]}<strong style={{ color: 'var(--text)' }}>{t.intro[1]}</strong>{t.intro[2]}
                </p>
            </div>

            {/* KPIs */}
            <MetricGrid
                ariaLabel={t.kpis}
                className="metric-grid-block"
                items={[
                    { label: t.total, value: MISSIONS.length, color: '#818cf8' },
                    { label: t.activeCount, value: active, color: '#34d399' },
                    { label: t.agencies, value: 8, color: '#fbbf24' },
                    { label: t.types, value: ALL_TYPES.length, color: '#60a5fa' },
                ]}
            />

            {/* ── Upcoming Launches ── */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.launches}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>{t.launchesSource}</p>
                {launchLoading ? (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }} tabIndex={0} role="region" aria-label={t.loadingLaunches}>
                        {[...Array(3)].map((_, i) => <div key={i} style={{ flexShrink: 0, width: 260, height: 120, borderRadius: '0.875rem', background: 'rgba(255,255,255,0.04)' }} />)}
                    </div>
                ) : launches.length === 0 ? (
                    <div className="card" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t.noLaunch}</div>
                ) : (
                    <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }} tabIndex={0} role="region" aria-label={t.launchList}>
                        {launches.map((l, i) => {
                            const d = new Date(l.net)
                            const daysUntil = Math.floor((d.getTime() - renderedAt) / 86400000)
                            return (
                                <div key={l.id} className="card motion-enter" style={{ animationDelay: `${Math.min(i * 0.08, 0.6)}s`, flexShrink: 0, width: 280, padding: '1.1rem', position: 'relative', overflow: 'hidden' }}>
                                    {/* External launch providers use changing image hosts; keep this decorative background unoptimized. */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    {l.image && <img src={l.image} alt="" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />}
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(99,102,241,0.15)', color: 'var(--nebula)', border: '1px solid rgba(99,102,241,0.2)' }}>
                                                {daysUntil <= 0 ? t.imminent : t.inDays(daysUntil)}
                                            </span>
                                            {i === 0 && <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>{t.next}</span>}
                                        </div>
                                        <h3 lang="en" style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{l.name}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.375rem' }}>{l.rocket}</p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{l.agency.length > 28 ? l.agency.slice(0, 28) + '…' : l.agency}</span>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.67rem' }}>{d.toLocaleDateString(t.date, { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        {l.url && <a href={l.url} target="_blank" rel="noopener noreferrer" className="touch-link touch-link-compact" style={{ display: 'inline-flex', marginTop: '0.35rem', color: 'var(--star)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }} aria-label={t.launchLabel(l.name)}>{t.launchPage}</a>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 className="section-title" style={{ color: 'var(--text)' }}>{t.timeline}</h2>
                <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }} tabIndex={0} role="region" aria-label={t.timelineLabel}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 700, position: 'relative' }}>
                        <div style={{ position: 'absolute', height: 2, background: 'rgba(255,255,255,0.1)', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', zIndex: 0 }} />
                        {MISSIONS.map(m => (
                            <div key={m.name.fr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem', whiteSpace: 'nowrap' }}>{m.year}</div>
                                <div title={m.name[locale]} style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: m.status === 'active' ? `linear-gradient(135deg, ${TYPE_COLORS[m.type]}, ${TYPE_COLORS[m.type]}80)` : 'rgba(255,255,255,0.1)',
                                    border: `2px solid ${TYPE_COLORS[m.type]}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)',
                                    boxShadow: m.status === 'active' ? `0 0 12px ${TYPE_COLORS[m.type]}60` : 'none',
                                    cursor: 'help',
                                }}>
                                    <SpaceIcon name={m.icon} size={16} />
                                </div>
                                <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.25rem', textAlign: 'center', whiteSpace: 'nowrap', maxWidth: 50, overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name[locale].split(' ')[0]}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.875rem' }}>
                    {ALL_TYPES.map(type => (
                        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: TYPE_COLORS[type] }} />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{TYPE_LABELS[type][locale]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                    {ALL_TYPES.map(type => (
                        <button key={type} aria-pressed={typeFilter.includes(type)} onClick={() => setTypeFilter(prev => prev.includes(type) ? prev.filter(x => x !== type) : [...prev, type])} style={{
                            padding: '0.35rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            background: typeFilter.includes(type) ? `${TYPE_COLORS[type]}15` : 'rgba(255,255,255,0.04)',
                            color: typeFilter.includes(type) ? 'var(--text)' : '#a8b3c7',
                            border: `1px solid ${typeFilter.includes(type) ? TYPE_COLORS[type] + '40' : 'rgba(255,255,255,0.07)'}`,
                        }}>{TYPE_LABELS[type][locale]}</button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                    {(['all', 'active', 'ended'] as const).map(s => (
                        <button key={s} aria-pressed={statusFilter === s} onClick={() => setStatusFilter(s)} style={{
                            padding: '0.35rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                            background: statusFilter === s ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
                            color: statusFilter === s ? '#c7d2fe' : '#a8b3c7',
                            border: statusFilter === s ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.07)',
                        }}>{t[s]}</button>
                    ))}
                </div>
            </div>

            {/* Mission cards */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>{t.count(filtered.length)}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filtered.map(m => (
                    <div key={m.name.fr} className="card motion-enter" style={{ padding: '1.25rem', borderLeft: `4px solid ${TYPE_COLORS[m.type]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <span style={{ color: TYPE_COLORS[m.type] }}><SpaceIcon name={m.icon} size={22} /></span>
                                <h3 style={{ color: 'var(--text)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem' }}>{m.name[locale]}</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: `${TYPE_COLORS[m.type]}15`, color: TYPE_COLORS[m.type] }}>{TYPE_LABELS[m.type][locale]}</span>
                                {m.status === 'active' ? (
                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <span className="anim-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} /> {t.activeTag}
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(100,116,139,0.1)', color: 'var(--text-muted)' }}>{t.endedTag}</span>
                                )}
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>{m.year} · {m.country[locale]}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>{m.description[locale]}</p>
                        <p style={{ color: '#f59e0b', fontSize: '0.78rem', lineHeight: 1.6 }}><SpaceIcon name="bulb" size={18} className="inline-icon" /> {m.fun[locale]}</p>
                    </div>
                ))}
            </div>

            {/* ─── SpaceX section ─── */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                <SpaceXSection />
            </div>
        </div>
    )
}
