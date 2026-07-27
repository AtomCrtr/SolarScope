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

type AudienceContent = {
  age: string
  choiceLabel: string
  kicker: string
  title: string
  intro: string
  featured: MissionLink
  paths: MissionLink[]
  start: string
  progress: string
  progressText: string
  passport: string
  routeTitle: string
  routeText: string
  bannerTitle: string
  bannerText: string
  bannerAction: string
}

const SHARED_IMAGES = {
  solarSystem: '/home/solar-system.webp',
  constellation: '/home/constellation.webp',
  galaxy: '/smacs0723.png',
  mars: '/home/mars-rover.webp',
}

const CONTENT: Record<'fr' | 'en', Record<Audience, AudienceContent>> = {
  fr: {
    kids: {
      age: '6–12 ans',
      choiceLabel: 'Je choisis mon âge',
      kicker: 'MISSION DU JOUR',
      title: 'Pourquoi le ciel est-il bleu ?',
      intro: 'Une lumière, de l’air et tes yeux : mène l’enquête et comprends la couleur du ciel.',
      featured: {
        title: 'Mission ciel bleu',
        description: 'Observe la lumière depuis la Terre.',
        href: '/ciel',
        image: '/home/mission-notebook.webp',
        imageAlt: 'Carnet de mission avec une photographie de la Terre vue depuis l’espace',
        duration: '8 min',
      },
      paths: [
        { title: 'Le Système solaire', description: 'Découvre le Soleil, les planètes et leurs mondes.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'Le Soleil et les huit planètes', duration: '7 min', missionId: 'planetes' },
        { title: 'Le ciel de nuit', description: 'Repère les étoiles et les constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation dans un ciel étoilé', duration: '5 min' },
        { title: 'Galaxies et Univers', description: 'Voyage bien au-delà du Système solaire.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Amas de galaxies observé dans l’espace', duration: '8 min' },
        { title: 'Explorer Mars', description: 'Suis les rovers sur la planète rouge.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover explorant la surface de Mars', duration: '6 min', missionId: 'mars' },
      ],
      start: 'Commencer la mission',
      progress: 'Ton passeport explorateur',
      progressText: 'Collecte des étoiles et débloque de nouvelles missions.',
      passport: 'Voir mon passeport',
      routeTitle: 'Explorer nos parcours',
      routeText: 'Des aventures pour comprendre l’espace pas à pas.',
      bannerTitle: 'Ce soir, lève les yeux vers le ciel !',
      bannerText: 'Choisis un objet à observer et partage ta découverte.',
      bannerAction: 'Préparer mon observation',
    },
    teens: {
      age: '12+ ans',
      choiceLabel: 'Je choisis mon niveau',
      kicker: 'MISSION DU JOUR',
      title: 'Comment la lumière révèle-t-elle l’Univers ?',
      intro: 'Analyse les spectres, les transits et les images pour comprendre comment les scientifiques étudient les mondes lointains.',
      featured: {
        title: 'Mission lumière',
        description: 'Explore les méthodes des astronomes.',
        href: '/exoplanetes',
        image: '/home/mission-notebook.webp',
        imageAlt: 'Carnet de mission avec une photographie de la Terre vue depuis l’espace',
        duration: '12 min',
      },
      paths: [
        { title: 'Le Système solaire', description: 'Compare les planètes, leurs tailles et leurs orbites.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'Le Soleil et les huit planètes', duration: '10 min', missionId: 'planetes' },
        { title: 'Observer le ciel', description: 'Prépare une observation et reconnais les constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation dans un ciel étoilé', duration: '10 min' },
        { title: 'Univers profond', description: 'Décrypte les images de Webb et les galaxies lointaines.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Amas de galaxies observé dans l’espace', duration: '12 min' },
        { title: 'Exploration martienne', description: 'Analyse les instruments et les objectifs des rovers.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover explorant la surface de Mars', duration: '12 min', missionId: 'mars' },
      ],
      start: 'Lancer la mission',
      progress: 'Ton passeport explorateur',
      progressText: 'Retrouve tes missions et poursuis ta progression.',
      passport: 'Voir mon passeport',
      routeTitle: 'Choisir un parcours',
      routeText: 'Approfondis chaque sujet à ton rythme.',
      bannerTitle: 'Passe de l’observation à l’analyse.',
      bannerText: 'Choisis un phénomène puis vérifie ce que montrent les données.',
      bannerAction: 'Explorer les données',
    },
  },
  en: {
    kids: {
      age: 'Ages 6–12',
      choiceLabel: 'Choose my age',
      kicker: 'MISSION OF THE DAY',
      title: 'Why is the sky blue?',
      intro: 'Light, air and your eyes: investigate how they work together to colour the sky.',
      featured: {
        title: 'Blue-sky mission',
        description: 'Observe light from Earth.',
        href: '/ciel',
        image: '/home/mission-notebook.webp',
        imageAlt: 'Mission notebook with a photograph of Earth seen from space',
        duration: '8 min',
      },
      paths: [
        { title: 'The Solar System', description: 'Meet the Sun, planets and their worlds.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'The Sun and eight planets', duration: '7 min', missionId: 'planetes' },
        { title: 'The night sky', description: 'Find stars and constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation in a starry sky', duration: '5 min' },
        { title: 'Galaxies and beyond', description: 'Travel far beyond our Solar System.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Galaxy cluster observed in space', duration: '8 min' },
        { title: 'Explore Mars', description: 'Follow the rovers on the red planet.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover exploring the surface of Mars', duration: '6 min', missionId: 'mars' },
      ],
      start: 'Start the mission',
      progress: 'Your explorer passport',
      progressText: 'Collect stars and unlock new missions.',
      passport: 'Open my passport',
      routeTitle: 'Explore learning paths',
      routeText: 'Space adventures, one clear step at a time.',
      bannerTitle: 'Look up at the sky tonight!',
      bannerText: 'Choose something to observe and share your discovery.',
      bannerAction: 'Plan an observation',
    },
    teens: {
      age: 'Ages 12+',
      choiceLabel: 'Choose my level',
      kicker: 'MISSION OF THE DAY',
      title: 'How does light reveal the Universe?',
      intro: 'Use spectra, transits and images to learn how scientists investigate distant worlds.',
      featured: {
        title: 'Light mission',
        description: 'Explore astronomers’ methods.',
        href: '/exoplanetes',
        image: '/home/mission-notebook.webp',
        imageAlt: 'Mission notebook with a photograph of Earth seen from space',
        duration: '12 min',
      },
      paths: [
        { title: 'The Solar System', description: 'Compare planets, sizes and orbits.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'The Sun and eight planets', duration: '10 min', missionId: 'planetes' },
        { title: 'Observe the sky', description: 'Plan an observation and recognise constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation in a starry sky', duration: '10 min' },
        { title: 'Deep Universe', description: 'Read Webb images and distant galaxies.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Galaxy cluster observed in space', duration: '12 min' },
        { title: 'Mars exploration', description: 'Study rover instruments and objectives.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover exploring the surface of Mars', duration: '12 min', missionId: 'mars' },
      ],
      start: 'Launch the mission',
      progress: 'Your explorer passport',
      progressText: 'Find your missions and keep making progress.',
      passport: 'Open my passport',
      routeTitle: 'Choose a learning path',
      routeText: 'Take each subject further at your own pace.',
      bannerTitle: 'Move from observation to analysis.',
      bannerText: 'Choose a phenomenon, then check what the data shows.',
      bannerAction: 'Explore the data',
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
      <div className="home-audience-area">
        <span className="home-hand-note">{copy.choiceLabel}</span>
        <div className="home-audience-switch" role="group" aria-label={locale === 'fr' ? 'Choisir une tranche d’âge' : 'Choose an age group'}>
          {(['kids', 'teens'] as const).map(option => (
            <button key={option} type="button" aria-pressed={audience === option} onClick={() => selectAudience(option)}>
              {CONTENT[locale][option].age}
            </button>
          ))}
        </div>
      </div>

      <div className="home-featured-notebook">
        <Image
          src={copy.featured.image}
          alt={copy.featured.imageAlt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 860px"
          className="home-featured-notebook-image"
        />
        <div className="home-featured-copy">
          <span className="home-featured-kicker">{copy.kicker}</span>
          <h2 id="home-mission-title">{copy.title}</h2>
          <div className="home-featured-meta">
            <span>{copy.featured.duration}</span>
            <span>{copy.age}</span>
          </div>
          <p>{copy.intro}</p>
          <Link href={copy.featured.href} className="home-featured-action" onClick={() => markVisited(copy.featured.missionId)}>
            {copy.start}
          </Link>
        </div>
      </div>

      <div className="home-board-bottom">
        <div className="home-route-heading">
          <span className="home-board-kicker">{copy.routeTitle}</span>
          <p>{copy.routeText}</p>
        </div>
        <div className="home-path-grid">
          {copy.paths.map(path => (
            <Link key={path.href} href={path.href} className="home-path-card" onClick={() => markVisited(path.missionId)}>
              <Image src={path.image} alt={path.imageAlt} width={420} height={236} sizes="(max-width: 700px) 100vw, 280px" />
              <span>{path.duration}</span>
              <div>
                <strong>{path.title}</strong>
                <small>{path.description}</small>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <aside className="home-passport-callout" aria-label={copy.progress}>
        <span className="home-passport-title">{copy.progress}</span>
        <p>{copy.progressText}</p>
        <Image src="/home/passport.webp" alt="" width={320} height={320} className="home-passport-image" priority />
        <div className="home-passport-count"><strong>{completedCount}</strong><span>/ {MISSION_IDS.length} missions</span></div>
        <div className="home-progress-track" aria-hidden="true"><span style={{ width: `${percent}%` }} /></div>
        <Link href="/passeport">{copy.passport}</Link>
      </aside>

      <div className="home-discovery-banner">
        <div>
          <strong>{copy.bannerTitle}</strong>
          <span>{copy.bannerText}</span>
        </div>
        <Link href={audience === 'kids' ? '/ciel' : '/exoplanetes'}>{copy.bannerAction}</Link>
      </div>
    </section>
  )
}
