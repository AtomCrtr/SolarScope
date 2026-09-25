'use client'

import Link from '@/components/ui/LocaleLink'
import { useEffect, useState, type ReactNode } from 'react'
import type { DashboardData } from '@/lib/data/space-data'
import HomeMissionBoard from '@/components/learning/HomeMissionBoard'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { useDaysSince } from '@/lib/client/use-client-value'

const HOME_COPY = {
  fr: {
    title: ['Bonjour explorateur !', 'Choisis ta mission', 'et décolle pour l’espace.'],
    bubble: 'Salut ! Je suis Cosmo, je t’accompagne dans chaque mission.',
    dataBandTitle: 'Le ciel en chiffres', dataBandText: 'Chaque chiffre affiche sa source. Si un service ne répond pas, on le dit.',
    intro: 'Apprends, observe et comprends l’Univers avec des missions courtes, des vraies images et des mots simples.',
    sourcesUnavailable: 'Sources momentanément indisponibles', sourcesConnected: 'flux connectés',
    missionKicker: 'COMMENCE ICI', missionTitle: 'Choisis ta première mission.', missionText: 'Chaque mission commence par une question, utilise une image ou une expérience, puis résume trois idées importantes.',
    exploreKicker: 'CARTE D’EXPLORATION', exploreTitle: 'Choisissez votre trajectoire.', exploreText: 'Quatre portes d’entrée, de notre voisinage planétaire jusqu’aux confins observables.',
    trustKicker: 'DONNÉES DE CONFIANCE', trustTitle: 'Pas de chiffres décoratifs.', trustText: 'Les indicateurs volatils sont récupérés côté serveur, mis en cache avec une durée explicite et accompagnés de leur source. Lorsqu’un service ne répond pas, SolarScope l’indique au lieu d’inventer une valeur de remplacement.', trustAction: 'Consulter les publications NASA',
    launch: 'PROCHAIN DÉPART',
    live: 'EN DIRECT', missionsLinkLabel: 'Voir les missions',
    kpis: { exoplanets: 'exoplanètes confirmées', asteroids: 'objets proches catalogués', crew: 'personnes à bord de l’ISS', perseverance: 'jours martiens de Perseverance', perseveranceSince: 'Depuis le 18 février 2021' },
  },
  en: {
    title: ['Hello explorer!', 'Choose a mission', 'and launch into space.'],
    bubble: 'Hi! I’m Cosmo, I’ll guide you on every mission.',
    dataBandTitle: 'The sky in numbers', dataBandText: 'Every number shows its source. If a service does not respond, we say so.',
    intro: 'Learn, observe and understand the Universe through short missions, real images and simple words.',
    sourcesUnavailable: 'Sources are temporarily unavailable', sourcesConnected: 'live sources connected',
    missionKicker: 'START HERE', missionTitle: 'Choose your first mission.', missionText: 'Each mission starts with a question, uses an image or an activity, then sums up three important ideas.',
    exploreKicker: 'EXPLORATION MAP', exploreTitle: 'Choose your route.', exploreText: 'Four ways in, from our planetary neighbourhood to the farthest observable space.',
    trustKicker: 'TRUSTED DATA', trustTitle: 'No decorative numbers.', trustText: 'Changing indicators are fetched on the server, cached for a clear duration, and shown with their source. If a service does not respond, SolarScope says so instead of inventing a replacement value.', trustAction: 'Browse NASA updates',
    launch: 'NEXT LAUNCH',
    live: 'LIVE', missionsLinkLabel: 'View missions',
    kpis: { exoplanets: 'confirmed exoplanets', asteroids: 'catalogued near-Earth objects', crew: 'people aboard the ISS', perseverance: 'Perseverance sols', perseveranceSince: 'Since February 18, 2021' },
  },
} as const

const CATEGORIES = [
  {
    number: '01', icon: 'sun', title: 'Système solaire',
    desc: 'Observer le Soleil, comparer les planètes et suivre les objets qui croisent notre voisinage.',
    color: '#FF8A3D',
    pages: [
      { title: 'Soleil', href: '/soleil' }, { title: 'Planètes', href: '/planetes' },
      { title: 'Mars', href: '/mars' }, { title: 'Astéroïdes', href: '/asteroides' },
      { title: 'Météorites', href: '/meteorites' },
    ],
  },
  {
    number: '02', icon: 'rocket', title: 'Exploration humaine',
    desc: 'Suivre l’ISS presque en temps réel et parcourir les missions qui façonnent l’exploration spatiale.',
    color: '#8EC5FF',
    pages: [{ title: 'ISS Tracker', href: '/iss' }, { title: 'Missions', href: '/missions' }],
  },
  {
    number: '03', icon: 'telescope', title: 'Univers profond',
    desc: 'Découvrir Webb, les exoplanètes et le ciel observable depuis votre position.',
    color: '#C4B5FD',
    pages: [
      { title: 'Webb', href: '/jwst' }, { title: 'Ciel ce soir', href: '/ciel' },
      { title: 'Photo du jour', href: '/photo-du-jour' }, { title: 'Exoplanètes', href: '/exoplanetes' },
    ],
  },
  {
    number: '04', icon: 'book', title: 'Apprendre',
    desc: 'Lire les publications officielles les plus récentes et tester ses connaissances.',
    color: '#5BE3A4',
    pages: [{ title: 'Actualités', href: '/actualites' }, { title: 'Quiz spatial', href: '/quiz' }],
  },
]

const CATEGORY_ICONS: Record<string, ReactNode> = {
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  rocket: <><path d="M12 15c-2-2-3-5-3-8a3 3 0 0 1 6 0c0 3-1 6-3 8z" /><path d="M9 12l-3 3 2 2M15 12l3 3-2 2M12 15v6" /></>,
  telescope: <><path d="M4 14l12-6 2 4-12 6z" /><path d="M10 17l-2 5M12 16l2 6M16 8l2-1 2 4-2 1" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5M9 8h6M9 12h4" /></>,
}

const CATEGORY_EN: Record<string, { title: string; desc: string; pages: Record<string, string> }> = {
  '01': {
    title: 'Solar System',
    desc: 'Observe the Sun, compare the planets and follow objects crossing our cosmic neighbourhood.',
    pages: { '/soleil': 'Sun', '/planetes': 'Planets', '/mars': 'Mars', '/asteroides': 'Asteroids', '/meteorites': 'Meteorites' },
  },
  '02': {
    title: 'Human exploration',
    desc: 'Follow the ISS almost live and explore the missions shaping space exploration.',
    pages: { '/iss': 'ISS Tracker', '/missions': 'Missions' },
  },
  '03': {
    title: 'Deep Universe',
    desc: 'Discover Webb, exoplanets and the sky visible from your location.',
    pages: { '/jwst': 'Webb', '/ciel': 'Tonight’s sky', '/photo-du-jour': 'Picture of the Day', '/exoplanetes': 'Exoplanets' },
  },
  '04': {
    title: 'Learn',
    desc: 'Read the latest official stories and test what you know.',
    pages: { '/actualites': 'News', '/quiz': 'Space quiz' },
  },
}

const EARTH_DAYS_PER_SOL = 1.02749125

function useCountdown(target: string | undefined) {
  const [remaining, setRemaining] = useState<number | null>(() => target ? Math.max(0, new Date(target).getTime() - Date.now()) : null)

  useEffect(() => {
    if (!target) return

    const targetTime = new Date(target).getTime()
    const tick = () => setRemaining(Math.max(0, targetTime - Date.now()))
    tick()
    const interval = setInterval(tick, 1_000)
    return () => clearInterval(interval)
  }, [target])

  return target ? remaining : null
}

function formatCountdown(ms: number | null, locale: 'fr' | 'en') {
  if (ms === null) return '—'
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  if (days > 0) return locale === 'fr' ? `${days} j ${hours} h ${minutes} min` : `${days}d ${hours}h ${minutes}m`
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function formatRemoteKpi(value: number | null | undefined, available: boolean | undefined, loading: boolean, locale: 'fr' | 'en') {
  if (loading) return '…'
  if (!available || value === null || value === undefined) return locale === 'fr' ? 'Indisponible' : 'Unavailable'
  return value.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')
}

export default function HomePage() {
  const locale = useSiteLocale()
  const copy = HOME_COPY[locale]
  const [data, setData] = useState<DashboardData | null>(null)
  const [dataError, setDataError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/dashboard', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('dashboard unavailable')
        return response.json() as Promise<DashboardData>
      })
      .then(payload => setData(payload))
      .catch(error => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setDataError(true)
      })
    return () => controller.abort()
  }, [])

  const countdown = useCountdown(data?.nextLaunch?.net)
  const dashboardLoading = data === null && !dataError
  const issCrew = data?.crew.filter(member => member.station === 'ISS').length ?? null
  const perseveranceDays = useDaysSince('2021-02-18')
  const categories = locale === 'en'
    ? CATEGORIES.map(category => ({
        ...category,
        title: CATEGORY_EN[category.number].title,
        desc: CATEGORY_EN[category.number].desc,
        pages: category.pages.map(page => ({ ...page, title: CATEGORY_EN[category.number].pages[page.href] })),
      }))
    : CATEGORIES

  const kpis = [
    {
      value: formatRemoteKpi(data?.exoplanetCount, data?.sources.exoplanets, dashboardLoading, locale),
      label: copy.kpis.exoplanets, source: 'NASA Exoplanet Archive', color: '#C4B5FD', live: data?.sources.exoplanets,
    },
    {
      value: formatRemoteKpi(data?.nearEarthObjectCount, data?.sources.asteroids, dashboardLoading, locale),
      label: copy.kpis.asteroids, source: 'NASA NeoWs', color: '#FFB27A', live: data?.sources.asteroids,
    },
    {
      value: formatRemoteKpi(issCrew, data?.sources.crew, dashboardLoading, locale),
      label: copy.kpis.crew, source: 'People in Space', color: '#8EC5FF', live: data?.sources.crew,
    },
    {
      value: perseveranceDays === null
        ? '…'
        : Math.floor(perseveranceDays / EARTH_DAYS_PER_SOL).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US'),
      label: copy.kpis.perseverance, source: copy.kpis.perseveranceSince, color: '#FF8A7A', live: false,
    },
  ]

  return (
    <>
      <HomeMissionBoard
        locale={locale}
        hero={{ greeting: copy.title[0], title: `${copy.title[1]} ${copy.title[2]}`, intro: copy.intro, bubble: copy.bubble }}
      />

      <section className="container home-data-band" aria-labelledby="home-data-title">
        <header className="home-data-heading">
          <h2 id="home-data-title">{copy.dataBandTitle}</h2>
          {!dataError && <span className="data-live"><span aria-hidden="true" />{copy.live}</span>}
          <p>{copy.dataBandText}</p>
        </header>
        <div className="home-kpi-grid">
          {kpis.map(kpi => (
            <article key={kpi.label} className="home-kpi">
              <strong className={kpi.value === 'Indisponible' || kpi.value === 'Unavailable' ? 'is-unavailable' : undefined} style={{ color: kpi.color }}>{kpi.value}</strong>
              <span className="home-kpi-label">{kpi.label}</span>
              <small>{kpi.source}</small>
            </article>
          ))}
        </div>
      </section>

      {data?.nextLaunch && (
        <section className="container launch-brief">
          <div className="launch-brief-label"><span>{copy.launch}</span><span className="live-orb" /></div>
          <div className="launch-brief-main">
            <div>
              <h2>{data.nextLaunch.name}</h2>
              <p>{data.nextLaunch.agency} · {data.nextLaunch.rocket}</p>
            </div>
            <div className="launch-countdown">
              <strong>{formatCountdown(countdown, locale)}</strong>
              <span>{new Date(data.nextLaunch.net).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <Link href="/missions" aria-label={copy.missionsLinkLabel}>→</Link>
          </div>
        </section>
      )}

      <section className="container home-explore">
        <header className="home-section-heading">
          <div>
            <span className="section-kicker">{copy.exploreKicker}</span>
            <h2>{copy.exploreTitle}</h2>
          </div>
          <p>{copy.exploreText}</p>
        </header>

        <div className="home-category-grid">
          {categories.map(category => (
            <article
              key={category.title}
              className="home-category-card"
              style={{ '--category-color': category.color } as React.CSSProperties}
            >
              <span className="category-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {CATEGORY_ICONS[category.icon]}
                </svg>
              </span>
              <h3>{category.title}</h3>
              <p>{category.desc}</p>
              <nav aria-label={category.title}>
                {category.pages.map(page => (
                  <Link key={page.href} href={page.href}>{page.title}</Link>
                ))}
              </nav>
            </article>
          ))}
        </div>
      </section>

      <section className="container data-manifesto">
        <div>
          <span className="section-kicker">{copy.trustKicker}</span>
          <h2>{copy.trustTitle}</h2>
        </div>
        <p>
          {copy.trustText}
        </p>
        <Link href="/actualites" className="touch-link">{copy.trustAction} <span aria-hidden="true">→</span></Link>
      </section>
    </>
  )
}
