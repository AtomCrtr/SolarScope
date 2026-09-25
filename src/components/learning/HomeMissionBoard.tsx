'use client'

import Image from 'next/image'
import Link from '@/components/ui/LocaleLink'
import { useEffect, useMemo, useState } from 'react'
import { MISSION_IDS, PROGRESS_EVENT, readLocalProgress, visitMission, type LocalProgress, type MissionId } from '@/lib/client/local-progress'
import { readStorage, writeStorage } from '@/lib/client/safe-storage'
import Cosmo from '@/components/learning/Cosmo'
import { SkyScatterArt, TransitArt } from '@/components/learning/MissionArt'
import { frenchNonBreakingSpaces } from '@/lib/content/typography'

type Audience = 'kids' | 'teens'

export type HomeHeroCopy = {
  greeting: string
  title: string
  intro: string
  bubble: string
}

type HomeMissionBoardProps = {
  locale: 'fr' | 'en'
  hero: HomeHeroCopy
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

type FeaturedMission = {
  href: string
  duration: string
  missionId: MissionId
  art: 'sky' | 'transit'
  artLabel: string
}

type AudienceContent = {
  age: string
  choiceLabel: string
  kicker: string
  title: string
  intro: string
  featured: FeaturedMission
  paths: MissionLink[]
  start: string
  passport: string
  routeTitle: string
  routeText: string
  bannerKicker: string
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
      age: '6–11 ans',
      choiceLabel: 'Je choisis mon âge',
      kicker: 'MISSION DU JOUR',
      title: 'Pourquoi le ciel est-il bleu ?',
      intro: 'Une lumière, de l’air et tes yeux : mène l’enquête et comprends la couleur du ciel.',
      featured: {
        href: '/ciel',
        duration: '8 min',
        missionId: 'ciel',
        art: 'sky',
        artLabel: 'La lumière du Soleil traverse l’air et le bleu se disperse dans tout le ciel',
      },
      paths: [
        { title: 'Le Système solaire', description: 'Découvre le Soleil, les planètes et leurs mondes.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'Le Soleil et les huit planètes', duration: '7 min', missionId: 'planetes' },
        { title: 'Le ciel de nuit', description: 'Repère les étoiles et les constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation dans un ciel étoilé', duration: '5 min', missionId: 'ciel' },
        { title: 'Galaxies et Univers', description: 'Voyage bien au-delà du Système solaire.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Amas de galaxies observé dans l’espace', duration: '8 min', missionId: 'jwst' },
        { title: 'Explorer Mars', description: 'Suis les rovers sur la planète rouge.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover explorant la surface de Mars', duration: '6 min', missionId: 'mars' },
      ],
      start: 'Commencer la mission',
      passport: 'Voir mon passeport',
      routeTitle: 'Explorer nos parcours',
      routeText: 'Des aventures pour comprendre l’espace pas à pas.',
      bannerKicker: 'Défi du soir',
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
        href: '/exoplanetes',
        duration: '12 min',
        missionId: 'exoplanetes',
        art: 'transit',
        artLabel: 'Une planète passe devant son étoile et la lumière mesurée baisse un instant',
      },
      paths: [
        { title: 'Le Système solaire', description: 'Compare les planètes, leurs tailles et leurs orbites.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'Le Soleil et les huit planètes', duration: '10 min', missionId: 'planetes' },
        { title: 'Observer le ciel', description: 'Prépare une observation et reconnais les constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation dans un ciel étoilé', duration: '10 min', missionId: 'ciel' },
        { title: 'Univers profond', description: 'Décrypte les images de Webb et les galaxies lointaines.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Amas de galaxies observé dans l’espace', duration: '12 min', missionId: 'jwst' },
        { title: 'Exploration martienne', description: 'Analyse les instruments et les objectifs des rovers.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover explorant la surface de Mars', duration: '12 min', missionId: 'mars' },
      ],
      start: 'Lancer la mission',
      passport: 'Voir mon passeport',
      routeTitle: 'Choisir un parcours',
      routeText: 'Approfondis chaque sujet à ton rythme.',
      bannerKicker: 'Pour aller plus loin',
      bannerTitle: 'Passe de l’observation à l’analyse.',
      bannerText: 'Choisis un phénomène puis vérifie ce que montrent les données.',
      bannerAction: 'Explorer les données',
    },
  },
  en: {
    kids: {
      age: 'Ages 6–11',
      choiceLabel: 'Choose my age',
      kicker: 'MISSION OF THE DAY',
      title: 'Why is the sky blue?',
      intro: 'Light, air and your eyes: investigate how they work together to colour the sky.',
      featured: {
        href: '/ciel',
        duration: '8 min',
        missionId: 'ciel',
        art: 'sky',
        artLabel: 'Sunlight crosses the air and blue light scatters across the whole sky',
      },
      paths: [
        { title: 'The Solar System', description: 'Meet the Sun, planets and their worlds.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'The Sun and eight planets', duration: '7 min', missionId: 'planetes' },
        { title: 'The night sky', description: 'Find stars and constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation in a starry sky', duration: '5 min', missionId: 'ciel' },
        { title: 'Galaxies and beyond', description: 'Travel far beyond our Solar System.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Galaxy cluster observed in space', duration: '8 min', missionId: 'jwst' },
        { title: 'Explore Mars', description: 'Follow the rovers on the red planet.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover exploring the surface of Mars', duration: '6 min', missionId: 'mars' },
      ],
      start: 'Start the mission',
      passport: 'Open my passport',
      routeTitle: 'Explore learning paths',
      routeText: 'Space adventures, one clear step at a time.',
      bannerKicker: 'Tonight’s challenge',
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
        href: '/exoplanetes',
        duration: '12 min',
        missionId: 'exoplanetes',
        art: 'transit',
        artLabel: 'A planet passes in front of its star and the measured light dips for a moment',
      },
      paths: [
        { title: 'The Solar System', description: 'Compare planets, sizes and orbits.', href: '/planetes', image: SHARED_IMAGES.solarSystem, imageAlt: 'The Sun and eight planets', duration: '10 min', missionId: 'planetes' },
        { title: 'Observe the sky', description: 'Plan an observation and recognise constellations.', href: '/ciel', image: SHARED_IMAGES.constellation, imageAlt: 'Constellation in a starry sky', duration: '10 min', missionId: 'ciel' },
        { title: 'Deep Universe', description: 'Read Webb images and distant galaxies.', href: '/jwst', image: SHARED_IMAGES.galaxy, imageAlt: 'Galaxy cluster observed in space', duration: '12 min', missionId: 'jwst' },
        { title: 'Mars exploration', description: 'Study rover instruments and objectives.', href: '/mars', image: SHARED_IMAGES.mars, imageAlt: 'Rover exploring the surface of Mars', duration: '12 min', missionId: 'mars' },
      ],
      start: 'Launch the mission',
      passport: 'Open my passport',
      routeTitle: 'Choose a learning path',
      routeText: 'Take each subject further at your own pace.',
      bannerKicker: 'Go further',
      bannerTitle: 'Move from observation to analysis.',
      bannerText: 'Choose a phenomenon, then check what the data shows.',
      bannerAction: 'Explore the data',
    },
  },
}

const AUDIENCE_STORAGE_KEY = 'solarscope-audience-v1'

const STEPS: Record<'fr' | 'en', [string, string, string]> = {
  fr: ['Découvre', 'Observe', 'Relève le défi'],
  en: ['Discover', 'Observe', 'Take the challenge'],
}

const PATH_STATUS = {
  fr: { done: 'Terminé', started: 'Commencé', todo: 'À découvrir' },
  en: { done: 'Completed', started: 'Started', todo: 'To discover' },
}

function pathProgress(progress: LocalProgress, mission?: MissionId) {
  if (mission && progress.completed[mission]) return { key: 'done' as const, percent: 100 }
  if (mission && progress.visited[mission]) return { key: 'started' as const, percent: 50 }
  return { key: 'todo' as const, percent: 0 }
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function HomeMissionBoard({ locale, hero }: HomeMissionBoardProps) {
  const [audience, setAudience] = useState<Audience>('kids')
  const [progress, setProgress] = useState<LocalProgress>({ visited: {}, completed: {} })

  useEffect(() => {
    const restoreAudienceFrame = window.requestAnimationFrame(() => {
      const savedAudience = readStorage(AUDIENCE_STORAGE_KEY)
      if (savedAudience === 'kids' || savedAudience === 'teens') setAudience(savedAudience)
    })

    const updateProgress = () => setProgress(readLocalProgress())
    updateProgress()
    window.addEventListener(PROGRESS_EVENT, updateProgress)
    return () => {
      window.cancelAnimationFrame(restoreAudienceFrame)
      window.removeEventListener(PROGRESS_EVENT, updateProgress)
    }
  }, [])

  const copy = CONTENT[locale][audience]
  const completedCount = useMemo(() => Object.keys(progress.completed).length, [progress])
  const statusLabels = PATH_STATUS[locale]

  const selectAudience = (next: Audience) => {
    setAudience(next)
    writeStorage(AUDIENCE_STORAGE_KEY, next)
  }

  const markVisited = (mission?: MissionId) => {
    if (mission) visitMission(mission)
  }

  return (
    <section className="home-mission-board container" aria-labelledby="home-mission-title">
      <div className="home-hero">
        <div className="home-hero-copy">
          <p className="home-greeting">{hero.greeting}</p>
          <h1 className="home-title">{hero.title}</h1>
          <p className="home-intro">{hero.intro}</p>
          <div className="home-audience-area">
            <span className="home-audience-label" id="home-audience-label">{copy.choiceLabel}</span>
            <div className="home-audience-row">
              <div className="home-audience-switch" role="group" aria-labelledby="home-audience-label">
                {(['kids', 'teens'] as const).map(option => (
                  <button key={option} type="button" aria-pressed={audience === option} onClick={() => selectAudience(option)}>
                    {CONTENT[locale][option].age}
                  </button>
                ))}
              </div>
              <Link href="/passeport" className="home-passport-link">
                <StarIcon />
                {copy.passport}
                <span className="home-passport-count">{completedCount}/{MISSION_IDS.length}</span>
              </Link>
            </div>
          </div>
        </div>
        <figure className="home-hero-mascot">
          <Cosmo className="home-cosmo" />
          <figcaption className="home-cosmo-bubble">{hero.bubble}</figcaption>
        </figure>
      </div>

      <article className="home-featured-notebook">
        <div className={`home-featured-art is-${copy.featured.art}`}>
          {copy.featured.art === 'sky'
            ? <SkyScatterArt label={copy.featured.artLabel} />
            : <TransitArt label={copy.featured.artLabel} />}
        </div>
        <div className="home-featured-copy">
          <div className="home-featured-meta">
            <span className="home-featured-kicker">{copy.kicker}</span>
            <span className="home-featured-duration"><ClockIcon />{copy.featured.duration}</span>
          </div>
          <h2 id="home-mission-title">{frenchNonBreakingSpaces(copy.title)}</h2>
          <p>{copy.intro}</p>
          <div className="home-featured-actions">
            <Link href={copy.featured.href} className="home-featured-action" onClick={() => markVisited(copy.featured.missionId)}>
              {copy.start}
              <ArrowIcon />
            </Link>
            <ol className="home-mission-steps" aria-label={locale === 'fr' ? 'Étapes de la mission' : 'Mission steps'}>
              {STEPS[locale].map((step, index) => (
                <li key={step}><span aria-hidden="true">{index + 1}</span>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </article>

      <section className="home-routes-section" id="parcours" aria-labelledby="home-routes-title">
        <div className="home-route-heading">
          <h2 id="home-routes-title">{copy.routeTitle}</h2>
          <p>{copy.routeText}</p>
        </div>
        <div className="home-path-grid">
          {copy.paths.map(path => {
            const status = pathProgress(progress, path.missionId)
            return (
              <Link key={path.href} href={path.href} className="home-path-card" onClick={() => markVisited(path.missionId)}>
                <Image src={path.image} alt={path.imageAlt} width={420} height={236} sizes="(max-width: 700px) 40vw, 300px" />
                <div>
                  <span className="home-path-duration"><ClockIcon />{path.duration}</span>
                  <strong>{path.title}</strong>
                  <small>{path.description}</small>
                  <span className="home-path-status">
                    <span className="home-path-track" aria-hidden="true"><span style={{ width: `${status.percent}%` }} /></span>
                    {statusLabels[status.key]}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="home-discovery-banner">
          <Image src={SHARED_IMAGES.constellation} alt="" width={640} height={360} sizes="(max-width: 700px) 100vw, 50vw" />
          <div>
            <span className="home-discovery-kicker">{copy.bannerKicker}</span>
            <strong>{frenchNonBreakingSpaces(copy.bannerTitle)}</strong>
            <span>{copy.bannerText}</span>
            <Link href={audience === 'kids' ? '/ciel' : '/exoplanetes'}>{copy.bannerAction}</Link>
          </div>
        </div>
      </section>
    </section>
  )
}
