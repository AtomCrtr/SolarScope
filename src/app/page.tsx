'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { DashboardData } from '@/lib/space-data'
import { useSiteLocale } from '@/components/LanguageToggle'

const Earth3D = dynamic(() => import('@/components/Earth3D'), { ssr: false })

const HOME_COPY = {
  fr: {
    title: ['L’espace,', 'enfin facile', 'à comprendre.'],
    intro: 'Choisis une mission, observe de vrais phénomènes spatiaux et découvre leur explication avec des mots simples. Tu peux écouter les leçons et ouvrir les détails seulement quand tu en as envie.',
    chooseMission: 'Choisir ma mission', testKnowledge: 'Tester mes connaissances', sourcesUnavailable: 'Sources momentanément indisponibles', sourcesConnected: 'flux connectés',
    missionKicker: 'COMMENCE ICI', missionTitle: 'Choisis ta première mission.', missionText: 'Chaque mission commence par une question, utilise une image ou une expérience, puis résume trois idées importantes.',
    exploreKicker: 'CARTE D’EXPLORATION', exploreTitle: 'Choisissez votre trajectoire.', exploreText: 'Quatre portes d’entrée, de notre voisinage planétaire jusqu’aux confins observables.',
    trustKicker: 'DONNÉES DE CONFIANCE', trustTitle: 'Pas de chiffres décoratifs.', trustText: 'Les indicateurs volatils sont récupérés côté serveur, mis en cache avec une durée explicite et accompagnés de leur source. Lorsqu’un service ne répond pas, SolarScope l’indique au lieu d’inventer une valeur de remplacement.', trustAction: 'Consulter les publications NASA',
    launch: 'PROCHAIN DÉPART', earthCaption: 'TERRE · MODÈLE INTERACTIF', earthAction: 'Glissez pour explorer',
  },
  en: {
    title: ['Space,', 'made easy', 'to understand.'],
    intro: 'Choose a mission, watch real space phenomena, and discover simple explanations. You can listen to lessons and open the details only when you want to.',
    chooseMission: 'Choose a mission', testKnowledge: 'Test my knowledge', sourcesUnavailable: 'Sources are temporarily unavailable', sourcesConnected: 'live sources connected',
    missionKicker: 'START HERE', missionTitle: 'Choose your first mission.', missionText: 'Each mission starts with a question, uses an image or an activity, then sums up three important ideas.',
    exploreKicker: 'EXPLORATION MAP', exploreTitle: 'Choose your route.', exploreText: 'Four ways in, from our planetary neighbourhood to the farthest observable space.',
    trustKicker: 'TRUSTED DATA', trustTitle: 'No decorative numbers.', trustText: 'Changing indicators are fetched on the server, cached for a clear duration, and shown with their source. If a service does not respond, SolarScope says so instead of inventing a replacement value.', trustAction: 'Browse NASA updates',
    launch: 'NEXT LAUNCH', earthCaption: 'EARTH · INTERACTIVE MODEL', earthAction: 'Drag to explore',
  },
} as const

const CATEGORIES = [
  {
    number: '01', icon: '☀️', title: 'Système solaire',
    desc: 'Observer le Soleil, comparer les planètes et suivre les objets qui croisent notre voisinage.',
    color: '#f59e0b',
    pages: [
      { title: 'Soleil', href: '/soleil' }, { title: 'Planètes', href: '/planetes' },
      { title: 'Mars', href: '/mars' }, { title: 'Astéroïdes', href: '/asteroides' },
      { title: 'Météorites', href: '/meteorites' },
    ],
  },
  {
    number: '02', icon: '🚀', title: 'Exploration humaine',
    desc: 'Suivre l’ISS presque en temps réel et parcourir les missions qui façonnent l’exploration spatiale.',
    color: '#38bdf8',
    pages: [{ title: 'ISS Tracker', href: '/iss' }, { title: 'Missions', href: '/missions' }],
  },
  {
    number: '03', icon: '🔭', title: 'Univers profond',
    desc: 'Découvrir Webb, les exoplanètes et le ciel observable depuis votre position.',
    color: '#a78bfa',
    pages: [
      { title: 'Webb', href: '/jwst' }, { title: 'Ciel ce soir', href: '/ciel' },
      { title: 'Photo du jour', href: '/photo-du-jour' }, { title: 'Exoplanètes', href: '/exoplanetes' },
    ],
  },
  {
    number: '04', icon: '✦', title: 'Apprendre',
    desc: 'Lire les publications officielles les plus récentes et tester ses connaissances.',
    color: '#34d399',
    pages: [{ title: 'Actualités', href: '/actualites' }, { title: 'Quiz spatial', href: '/quiz' }],
  },
]

const KIDS_MISSIONS = [
  { emoji: '🪐', title: 'Rencontre les 8 planètes', question: 'Pourquoi sont-elles si différentes ?', href: '/planetes', duration: '7 min', color: '#818cf8' },
  { emoji: '🔴', title: 'Enquête sur Mars', question: 'D’où vient sa couleur rouge ?', href: '/mars', duration: '6 min', color: '#f87171' },
  { emoji: '☄️', title: 'Surveille les astéroïdes', question: 'Sont-ils vraiment dangereux ?', href: '/asteroides', duration: '8 min', color: '#fb923c' },
  { emoji: '🛰️', title: 'Rejoins l’ISS', question: 'Pourquoi les astronautes flottent-ils ?', href: '/iss', duration: '6 min', color: '#38bdf8' },
]

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
}

function martianSolsSince(date: string) {
  return Math.floor(daysSince(date) / 1.02749125)
}

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

function formatCountdown(ms: number | null) {
  if (ms === null) return '—'
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  if (days > 0) return `${days} j ${hours} h ${minutes} min`
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function formatFreshness(value: string | undefined, locale: 'fr' | 'en') {
  if (!value) return locale === 'fr' ? 'Connexion aux sources…' : 'Connecting to sources…'
  const time = new Date(value).toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })
  return locale === 'fr' ? `Sources vérifiées à ${time}` : `Sources checked at ${time}`
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
  const activeSources = useMemo(
    () => data ? Object.values(data.sources).filter(Boolean).length : 0,
    [data],
  )
  const dashboardLoading = data === null && !dataError
  const issCrew = data?.crew.filter(member => member.station === 'ISS').length ?? null

  const kpis = [
    {
      value: formatRemoteKpi(data?.exoplanetCount, data?.sources.exoplanets, dashboardLoading, locale),
      label: 'exoplanètes confirmées', source: 'NASA Exoplanet Archive', color: '#c084fc', live: data?.sources.exoplanets,
    },
    {
      value: formatRemoteKpi(data?.nearEarthObjectCount, data?.sources.asteroids, dashboardLoading, locale),
      label: 'objets proches catalogués', source: 'NASA NeoWs', color: '#fb923c', live: data?.sources.asteroids,
    },
    {
      value: formatRemoteKpi(issCrew, data?.sources.crew, dashboardLoading, locale),
      label: 'personnes à bord de l’ISS', source: 'People in Space', color: '#38bdf8', live: data?.sources.crew,
    },
    {
      value: martianSolsSince('2021-02-18').toLocaleString('fr-FR'),
      label: 'sols de Perseverance', source: 'Depuis le 18 février 2021', color: '#f87171', live: false,
    },
  ]

  return (
    <>
      <section className="home-hero container">
        <motion.div
          className="home-hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="home-eyebrow">
            <span className={activeSources > 0 ? 'live-orb' : 'live-orb is-loading'} />
            {locale === 'fr' ? 'POUR LES 8–12 ANS' : 'FOR AGES 8–12'} · {formatFreshness(data?.updatedAt, locale)}
          </div>
          <h1 className="home-title">
            <span className="home-title-lead">{copy.title[0]}</span>
            <span>{copy.title[1]}</span>
            <span>{copy.title[2]}</span>
          </h1>
          <p className="home-intro">
            {copy.intro}
          </p>
          <div className="home-actions">
            <a href="#missions-enfants" className="btn-primary">{copy.chooseMission} <span aria-hidden="true">→</span></a>
            <Link href="/quiz" className="btn-ghost">{copy.testKnowledge}</Link>
          </div>
          <div className="source-health" aria-live="polite">
            <span>{dataError ? copy.sourcesUnavailable : `${activeSources}/4 ${copy.sourcesConnected}`}</span>
            <span className="source-health-line" />
            <span>NASA · IPAC · People in Space · The Space Devs</span>
          </div>
        </motion.div>

        <motion.div
          className="home-earth"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="earth-orbit earth-orbit-one" />
          <div className="earth-orbit earth-orbit-two" />
          <Earth3D height="100%" />
          <div className="earth-caption">
            <span>{copy.earthCaption}</span>
            <span>{copy.earthAction}</span>
          </div>
        </motion.div>
      </section>

      <section id="missions-enfants" className="container kids-missions" aria-labelledby="kids-missions-title">
        <header className="kids-missions-heading">
          <div>
            <span className="section-kicker">{copy.missionKicker}</span>
            <h2 id="kids-missions-title">{copy.missionTitle}</h2>
          </div>
          <p>{copy.missionText}</p>
        </header>
        <div className="kids-mission-grid">
          {KIDS_MISSIONS.map((mission, index) => (
            <motion.article
              key={mission.href}
              className="kids-mission-card"
              style={{ '--mission-color': mission.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.06 }}
            >
              <div className="kids-mission-meta"><span>{mission.emoji}</span><span>⏱ {mission.duration}</span></div>
              <h3>{mission.title}</h3>
              <p>{mission.question}</p>
              <Link href={mission.href} aria-label={`Commencer : ${mission.title}`}>
                Commencer <span aria-hidden="true">→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="container home-data-band" aria-label="Indicateurs spatiaux">
        {kpis.map((kpi, index) => (
          <motion.article
            key={kpi.label}
            className="home-kpi"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.06 }}
          >
            <div className="home-kpi-topline">
              <span>0{index + 1}</span>
              {kpi.live && <span className="data-live">EN DIRECT</span>}
            </div>
            <strong className={kpi.value === 'Indisponible' ? 'is-unavailable' : undefined} style={{ color: kpi.color }}>{kpi.value}</strong>
            <span className="home-kpi-label">{kpi.label}</span>
            <small>{kpi.source}</small>
          </motion.article>
        ))}
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
              <strong>{formatCountdown(countdown)}</strong>
              <span>{new Date(data.nextLaunch.net).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <Link href="/missions" aria-label="Voir les missions">→</Link>
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
          {CATEGORIES.map((category, index) => (
            <motion.article
              key={category.title}
              className="home-category-card"
              style={{ '--category-color': category.color } as React.CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.07 }}
            >
              <div className="category-card-head">
                <span>{category.number}</span>
                <span aria-hidden="true">{category.icon}</span>
              </div>
              <h3>{category.title}</h3>
              <p>{category.desc}</p>
              <nav aria-label={category.title}>
                {category.pages.map(page => (
                  <Link key={page.href} href={page.href}>{page.title}<span aria-hidden="true">↗</span></Link>
                ))}
              </nav>
            </motion.article>
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
        <Link href="/actualites">{copy.trustAction} <span aria-hidden="true">→</span></Link>
      </section>
    </>
  )
}
