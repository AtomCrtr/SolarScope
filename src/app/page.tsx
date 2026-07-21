'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { DashboardData } from '@/lib/space-data'

const Earth3D = dynamic(() => import('@/components/Earth3D'), { ssr: false })

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

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
}

function martianSolsSince(date: string) {
  return Math.floor(daysSince(date) / 1.02749125)
}

function useCountdown(target: string | undefined) {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!target) {
      setRemaining(null)
      return
    }

    const targetTime = new Date(target).getTime()
    const tick = () => setRemaining(Math.max(0, targetTime - Date.now()))
    tick()
    const interval = setInterval(tick, 1_000)
    return () => clearInterval(interval)
  }, [target])

  return remaining
}

function formatCountdown(ms: number | null) {
  if (ms === null) return '—'
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  if (days > 0) return `${days} j ${hours} h ${minutes} min`
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function formatFreshness(value: string | undefined) {
  if (!value) return 'Connexion aux sources…'
  return `Actualisé à ${new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

export default function HomePage() {
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
  const issCrew = data?.crew.filter(member => member.craft.toUpperCase() === 'ISS').length ?? null

  const kpis = [
    {
      value: data?.exoplanetCount?.toLocaleString('fr-FR') ?? '—',
      label: 'exoplanètes confirmées', source: 'NASA Exoplanet Archive', color: '#c084fc', live: data?.sources.exoplanets,
    },
    {
      value: data?.nearEarthObjectCount?.toLocaleString('fr-FR') ?? '—',
      label: 'objets proches catalogués', source: 'NASA NeoWs', color: '#fb923c', live: data?.sources.asteroids,
    },
    {
      value: issCrew === null ? '—' : String(issCrew),
      label: 'personnes à bord de l’ISS', source: 'Open Notify', color: '#38bdf8', live: data?.sources.crew,
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
            Observatoire numérique · {formatFreshness(data?.updatedAt)}
          </div>
          <h1 className="home-title">
            L’espace,<br />
            <span>rendu lisible.</span>
          </h1>
          <p className="home-intro">
            Explorez l’Univers à partir de données scientifiques réelles, mises en contexte dans une interface
            claire, immersive et accessible à tous les curieux.
          </p>
          <div className="home-actions">
            <Link href="/planetes" className="btn-primary">Commencer l’exploration <span aria-hidden="true">→</span></Link>
            <Link href="/actualites" className="btn-ghost">Voir les dernières données</Link>
          </div>
          <div className="source-health" aria-live="polite">
            <span>{dataError ? 'Sources momentanément indisponibles' : `${activeSources}/4 flux connectés`}</span>
            <span className="source-health-line" />
            <span>NASA · NOAA · IPAC · Launch Library</span>
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
          <Earth3D height={560} />
          <div className="earth-caption">
            <span>TERRE · MODÈLE INTERACTIF</span>
            <span>Glissez pour explorer</span>
          </div>
        </motion.div>
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
            <strong style={{ color: kpi.color }}>{kpi.value}</strong>
            <span className="home-kpi-label">{kpi.label}</span>
            <small>{kpi.source}</small>
          </motion.article>
        ))}
      </section>

      {data?.nextLaunch && (
        <section className="container launch-brief">
          <div className="launch-brief-label"><span>PROCHAIN DÉPART</span><span className="live-orb" /></div>
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
            <span className="section-kicker">CARTE D’EXPLORATION</span>
            <h2>Choisissez votre trajectoire.</h2>
          </div>
          <p>Quatre portes d’entrée, de notre voisinage planétaire jusqu’aux confins observables.</p>
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
          <span className="section-kicker">DONNÉES DE CONFIANCE</span>
          <h2>Pas de chiffres décoratifs.</h2>
        </div>
        <p>
          Les indicateurs volatils sont désormais récupérés côté serveur, mis en cache avec une durée explicite
          et accompagnés de leur source. Lorsqu’un service ne répond pas, SolarScope l’indique au lieu d’inventer
          une valeur de remplacement.
        </p>
        <Link href="/actualites">Consulter les publications NASA <span aria-hidden="true">→</span></Link>
      </section>
    </>
  )
}
