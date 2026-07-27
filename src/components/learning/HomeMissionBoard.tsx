'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { MISSION_IDS, PROGRESS_EVENT, readLocalProgress, visitMission, type MissionId } from '@/lib/client/local-progress'

type Audience = 'kids' | 'teens'

type HomeMissionBoardProps = {
  locale: 'fr' | 'en'
}

type MissionLink = {
  title: string
  description: string
  href: string
  image: string
  imageAlt: string
  duration: string
  missionId?: MissionId
}

const CONTENT: Record<'fr' | 'en', Record<Audience, {
  age: string
  kicker: string
  title: string
  intro: string
  featured: MissionLink
  paths: MissionLink[]
  start: string
  progress: string
  passport: string
  routeTitle: string
  routeText: string
}>> = {
  fr: {
    kids: {
      age: '6–12 ans',
      kicker: 'MISSION DU JOUR',
      title: 'Pourquoi Mars est-elle rouge ?',
      intro: 'Pars sur la planète rouge, observe ses roches et découvre le secret de sa poussière.',
      featured: { title: 'Mission Mars', description: 'Une enquête courte avec Curiosity et Perseverance.', href: '/mars', image: '/textures/mars.jpg', imageAlt: 'Surface orange de Mars', duration: '6 min', missionId: 'mars' },
      paths: [
        { title: 'Le Système solaire', description: 'Soleil, planètes et lunes.', href: '/planetes', image: '/textures/saturn.jpg', imageAlt: 'Anneaux de Saturne', duration: '7 min', missionId: 'planetes' },
        { title: 'Le ciel de nuit', description: 'Repère les étoiles et les constellations.', href: '/ciel', image: '/textures/moon.jpg', imageAlt: 'La Lune dans l’espace', duration: '5 min' },
        { title: 'La vie dans l’ISS', description: 'Comprends pourquoi les astronautes flottent.', href: '/iss', image: '/textures/earth.jpg', imageAlt: 'La Terre vue depuis l’espace', duration: '6 min', missionId: 'iss' },
      ],
      start: 'Commencer la mission',
      progress: 'Ton passeport d’explorateur',
      passport: 'Voir mon passeport',
      routeTitle: 'Explorer nos parcours',
      routeText: 'Trois portes simples pour choisir ta prochaine découverte.',
    },
    teens: {
      age: '12+ ans',
      kicker: 'MISSION DU JOUR',
      title: 'Comment découvre-t-on une exoplanète ?',
      intro: 'Cherche des mondes lointains et comprends comment la lumière aide les scientifiques à les trouver.',
      featured: { title: 'Mission Exoplanètes', description: 'Une enquête guidée pour observer des mondes hors du Système solaire.', href: '/exoplanetes', image: '/textures/earth.jpg', imageAlt: 'La Terre dans l’espace', duration: '8 min' },
      paths: [
        { title: 'Le Système solaire', description: 'Compare les planètes et leurs orbites.', href: '/planetes', image: '/textures/saturn.jpg', imageAlt: 'Anneaux de Saturne', duration: '7 min', missionId: 'planetes' },
        { title: 'Observer le ciel', description: 'Prépare une vraie observation nocturne.', href: '/ciel', image: '/textures/moon.jpg', imageAlt: 'La Lune dans l’espace', duration: '7 min' },
        { title: 'Exploration martienne', description: 'Analyse les missions robotiques de Mars.', href: '/mars', image: '/rovers/perseverance.png', imageAlt: 'Rover Perseverance sur Mars', duration: '8 min', missionId: 'mars' },
      ],
      start: 'Lancer la mission',
      progress: 'Ton passeport d’explorateur',
      passport: 'Voir mon passeport',
      routeTitle: 'Explorer nos parcours',
      routeText: 'Trois parcours pour aller plus loin, à ton rythme.',
    },
  },
  en: {
    kids: {
      age: 'Ages 6–12',
      kicker: 'MISSION OF THE DAY',
      title: 'Why is Mars red?',
      intro: 'Travel to the red planet, look at its rocks and discover the secret of its dust.',
      featured: { title: 'Mars mission', description: 'A short investigation with Curiosity and Perseverance.', href: '/mars', image: '/textures/mars.jpg', imageAlt: 'Orange surface of Mars', duration: '6 min', missionId: 'mars' },
      paths: [
        { title: 'The Solar System', description: 'The Sun, planets and moons.', href: '/planetes', image: '/textures/saturn.jpg', imageAlt: 'Rings of Saturn', duration: '7 min', missionId: 'planetes' },
        { title: 'The night sky', description: 'Spot stars and constellations.', href: '/ciel', image: '/textures/moon.jpg', imageAlt: 'The Moon in space', duration: '5 min' },
        { title: 'Life on the ISS', description: 'Understand why astronauts float.', href: '/iss', image: '/textures/earth.jpg', imageAlt: 'Earth seen from space', duration: '6 min', missionId: 'iss' },
      ],
      start: 'Start the mission',
      progress: 'Your explorer passport',
      passport: 'Open my passport',
      routeTitle: 'Explore learning paths',
      routeText: 'Three simple doors to choose your next discovery.',
    },
    teens: {
      age: 'Ages 12+',
      kicker: 'MISSION OF THE DAY',
      title: 'How do we find an exoplanet?',
      intro: 'Search for distant worlds and learn how light helps scientists find them.',
      featured: { title: 'Exoplanet mission', description: 'A guided investigation into worlds beyond our Solar System.', href: '/exoplanetes', image: '/textures/earth.jpg', imageAlt: 'Earth in space', duration: '8 min' },
      paths: [
        { title: 'The Solar System', description: 'Compare planets and their orbits.', href: '/planetes', image: '/textures/saturn.jpg', imageAlt: 'Rings of Saturn', duration: '7 min', missionId: 'planetes' },
        { title: 'Observe the sky', description: 'Prepare a real night-sky observation.', href: '/ciel', image: '/textures/moon.jpg', imageAlt: 'The Moon in space', duration: '7 min' },
        { title: 'Mars exploration', description: 'Study robotic missions on Mars.', href: '/mars', image: '/rovers/perseverance.png', imageAlt: 'Perseverance rover on Mars', duration: '8 min', missionId: 'mars' },
      ],
      start: 'Launch the mission',
      progress: 'Your explorer passport',
      passport: 'Open my passport',
      routeTitle: 'Explore learning paths',
      routeText: 'Three paths to go further at your own pace.',
    },
  },
}

const AUDIENCE_STORAGE_KEY = 'solarscope-audience-v1'

export default function HomeMissionBoard({ locale }: HomeMissionBoardProps) {
  const [audience, setAudience] = useState<Audience>('kids')
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const restoreAudienceFrame = window.requestAnimationFrame(() => {
      const savedAudience = window.localStorage.getItem(AUDIENCE_STORAGE_KEY)
      if (savedAudience === 'kids' || savedAudience === 'teens') setAudience(savedAudience)
    })

    const updateProgress = () => setCompletedCount(Object.keys(readLocalProgress().completed).length)
    updateProgress()
    window.addEventListener(PROGRESS_EVENT, updateProgress)
    return () => {
      window.cancelAnimationFrame(restoreAudienceFrame)
      window.removeEventListener(PROGRESS_EVENT, updateProgress)
    }
  }, [])

  const copy = CONTENT[locale][audience]
  const percent = useMemo(() => Math.round((completedCount / MISSION_IDS.length) * 100), [completedCount])

  const selectAudience = (next: Audience) => {
    setAudience(next)
    window.localStorage.setItem(AUDIENCE_STORAGE_KEY, next)
  }

  const markVisited = (mission?: MissionId) => {
    if (mission) visitMission(mission)
  }

  return (
    <section className="home-mission-board" aria-labelledby="home-mission-title">
      <div className="home-audience-switch" role="group" aria-label={locale === 'fr' ? 'Choisir une tranche d’âge' : 'Choose an age group'}>
        {(['kids', 'teens'] as const).map(option => (
          <button key={option} type="button" aria-pressed={audience === option} onClick={() => selectAudience(option)}>
            {CONTENT[locale][option].age}
          </button>
        ))}
      </div>

      <div className="home-featured-mission">
        <div className="home-featured-copy">
          <span>{copy.kicker}</span>
          <h2 id="home-mission-title">{copy.title}</h2>
          <p>{copy.intro}</p>
          <div className="home-featured-meta">
            <span>{copy.featured.duration}</span>
            <span>{copy.age}</span>
          </div>
          <Link href={copy.featured.href} className="home-featured-action" onClick={() => markVisited(copy.featured.missionId)}>
            {copy.start}
          </Link>
        </div>
        <Image src={copy.featured.image} alt={copy.featured.imageAlt} width={960} height={720} priority className="home-featured-image" />
      </div>

      <div className="home-board-bottom">
        <div>
          <span className="home-board-kicker">{copy.routeTitle}</span>
          <p>{copy.routeText}</p>
        </div>
        <div className="home-path-grid">
          {copy.paths.map(path => (
            <Link key={path.href} href={path.href} className="home-path-card" onClick={() => markVisited(path.missionId)}>
              <Image src={path.image} alt={path.imageAlt} width={320} height={180} sizes="(max-width: 700px) 100vw, 240px" />
              <span>{path.duration}</span>
              <strong>{path.title}</strong>
              <small>{path.description}</small>
            </Link>
          ))}
        </div>
      </div>

      <aside className="home-passport-callout" aria-label={copy.progress}>
        <div>
          <span>{copy.progress}</span>
          <strong>{completedCount} / {MISSION_IDS.length}</strong>
        </div>
        <div className="home-progress-track" aria-hidden="true"><span style={{ width: `${percent}%` }} /></div>
        <Link href="/passeport">{copy.passport}</Link>
      </aside>
    </section>
  )
}
