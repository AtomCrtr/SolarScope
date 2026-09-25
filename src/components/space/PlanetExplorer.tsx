'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { PLANET_FOCUS_ORDER, type PlanetFocus } from '@/lib/content/planet-explorer'
import { explorerPlanets } from '@/lib/content/planet-explorer.en'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { PLANET_MOONS } from '@/lib/content/moons'
import { formatDistance, travelTimes } from '@/lib/astronomy/travel'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

import { PlanetScene as Planet3D } from '@/components/space/LightScenes'

const FOCUS_ICONS: Record<PlanetFocus, SpaceIconName> = {
  identity: 'target',
  air: 'planet',
  moons: 'moon-stars',
  journey: 'rocket',
}

const PLANET_HASH = /^#planete-([a-z]+)$/

const COPY = {
  fr: {
    illustration: (name: string) => `Illustration de ${name}`,
    kicker: 'EXPLORATEUR INTERACTIF · 5 MIN', title: 'Choisis une planète, puis joue au détective.', intro: 'Tu peux tourner le globe, ouvrir une seule idée à la fois et finir par un mini-défi.',
    progress: '1 planète · 1 idée · 1 défi', choose: 'Choisir une planète', drag: 'Fais glisser le globe ou utilise les flèches du clavier.', restart: '↺ Recommencer',
    explore: (name: string) => `Explorer ${name}`, didYouKnow: 'Le savais-tu ?', compareOpen: 'Comparer avec la Terre', compareClose: 'Fermer la comparaison',
    compareTitle: (name: string) => `${name} comparée à la Terre`, radius: 'le rayon de la Terre', moons: (n: number) => `${n} lune${n > 1 ? 's' : ''} recensée${n > 1 ? 's' : ''}`,
    scaleNote: 'Les cercles sont simplifiés pour comparer facilement : les distances ne sont pas à l’échelle.',
    here: 'Tu es ici !', travelTo: (name: string) => `Voyage vers ${name}`, earthNote: 'La Terre est notre point de départ. Choisis une autre planète pour calculer le voyage depuis chez nous.',
    computing: 'Calcul de la distance du jour…', today: (name: string) => [`Aujourd’hui, ${name} est à `, ' de la Terre. Combien de temps faudrait-il pour y aller en ligne droite ?'],
    travelNote: 'Les planètes bougent : la distance change chaque jour. Les vraies sondes suivent une trajectoire courbe, plus longue.',
    mainMoons: 'Ses lunes principales', noMoon: 'Pas de lune', diameter: 'km de diamètre', back: (name: string) => `Revenir à ${name}`, see3d: (name: string) => `Voir ${name.toLowerCase()} en 3D`,
    noKnownMoon: (name: string) => `${name} n’a aucune lune connue.`, moonTotal: (n: number) => `${n} lune${n > 1 ? 's' : ''} recensée${n > 1 ? 's' : ''} au total · source : NASA Science.`,
    challenge: 'DÉFI EXPRESS', right: 'Bravo !', wrong: 'Presque !', numbers: 'fr-FR',
  },
  en: {
    illustration: (name: string) => `Illustration of ${name}`,
    kicker: 'INTERACTIVE EXPLORER · 5 MIN', title: 'Choose a planet, then play detective.', intro: 'You can spin the globe, open one idea at a time and finish with a mini challenge.',
    progress: '1 planet · 1 idea · 1 challenge', choose: 'Choose a planet', drag: 'Drag the globe or use the arrow keys.', restart: '↺ Start again',
    explore: (name: string) => `Explore ${name}`, didYouKnow: 'Did you know?', compareOpen: 'Compare with Earth', compareClose: 'Close the comparison',
    compareTitle: (name: string) => `${name} compared with Earth`, radius: 'Earth’s radius', moons: (n: number) => `${n} known moon${n === 1 ? '' : 's'}`,
    scaleNote: 'The circles are simplified to make comparing easy: distances are not to scale.',
    here: 'You are here!', travelTo: (name: string) => `Trip to ${name}`, earthNote: 'Earth is where we start. Choose another planet to work out the trip from home.',
    computing: 'Working out today’s distance…', today: (name: string) => [`Today, ${name} is `, ' from Earth. How long would it take to get there in a straight line?'],
    travelNote: 'Planets move: the distance changes every day. Real probes follow a curved, longer path.',
    mainMoons: 'Its main moons', noMoon: 'No moon', diameter: 'km across', back: (name: string) => `Back to ${name}`, see3d: (name: string) => `See ${name} in 3D`,
    noKnownMoon: (name: string) => `${name} has no known moon.`, moonTotal: (n: number) => `${n} known moon${n === 1 ? '' : 's'} in total · source: NASA Science.`,
    challenge: 'QUICK CHALLENGE', right: 'Well done!', wrong: 'Almost!', numbers: 'en-GB',
  },
}

function PlanetFallback({ emoji, color, label }: { emoji: string; color: string; label: string }) {
  return (
    <div className="planet-explorer-fallback" aria-label={label} role="img">
      <span style={{ filter: `drop-shadow(0 0 28px ${color})` }}>{emoji}</span>
    </div>
  )
}

export default function PlanetExplorer() {
  const locale = useSiteLocale()
  const t = COPY[locale]
  const PLANET_EXPLORER_PLANETS = useMemo(() => explorerPlanets(locale), [locale])
  const [selectedId, setSelectedId] = useState('earth')
  const [focus, setFocus] = useState<PlanetFocus>('identity')
  const [viewerKey, setViewerKey] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [moonTexture, setMoonTexture] = useState<{ planetId: string; texture: string; name: string } | null>(null)
  const [distance, setDistance] = useState<{ planetId: string; km: number } | null>(null)

  const planet = useMemo(
    () => PLANET_EXPLORER_PLANETS.find(item => item.id === selectedId) ?? PLANET_EXPLORER_PLANETS[2],
    [selectedId, PLANET_EXPLORER_PLANETS],
  )
  const earth = PLANET_EXPLORER_PLANETS.find(item => item.id === 'earth') ?? planet
  const ratio = planet.radiusKm / earth.radiusKm
  const relativeDiameter = Math.max(28, Math.min(132, 28 + Math.sqrt(ratio) * 38))
  const isCorrect = answer === planet.challenge.answer

  const selectPlanet = (id: string) => {
    setSelectedId(id)
    setFocus('identity')
    setViewerKey(value => value + 1)
    setAnswer(null)
    setMoonTexture(null)
  }

  // The solar-system map links to #planete-<id>: open that planet here.
  useEffect(() => {
    const openFromHash = () => {
      const id = window.location.hash.match(PLANET_HASH)?.[1]
      if (!id || !explorerPlanets('fr').some(item => item.id === id)) return
      setSelectedId(id)
      setFocus('identity')
      setViewerKey(value => value + 1)
      setAnswer(null)
      setMoonTexture(null)
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      document.getElementById('explorateur')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    }
    const frame = window.requestAnimationFrame(openFromHash)
    window.addEventListener('hashchange', openFromHash)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', openFromHash)
    }
  }, [])

  // Real Earth–planet distance for today; the astronomy code is loaded on demand.
  useEffect(() => {
    if (selectedId === 'earth') return
    let cancelled = false
    import('@/lib/astronomy/planet-distance').then(({ distanceFromEarthKm }) => {
      const km = distanceFromEarthKm(selectedId, new Date())
      if (!cancelled && km !== null) setDistance({ planetId: selectedId, km })
    })
    return () => { cancelled = true }
  }, [selectedId])

  const moons = PLANET_MOONS[planet.id] ?? []
  const viewerTexture = moonTexture?.planetId === planet.id ? moonTexture.texture : planet.texture
  const todayDistance = distance?.planetId === planet.id ? distance.km : null

  return (
    <section className="planet-explorer" id="explorateur" aria-labelledby="planet-explorer-title" data-planet-explorer>
      <div className="planet-explorer-heading">
        <div>
          <span className="planet-explorer-kicker">{t.kicker}</span>
          <h2 id="planet-explorer-title">{t.title}</h2>
          <p>{t.intro}</p>
        </div>
        <span className="planet-explorer-progress">{t.progress}</span>
      </div>

      <div className="planet-explorer-selector" aria-label={t.choose}>
        {PLANET_EXPLORER_PLANETS.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => selectPlanet(item.id)}
            aria-pressed={item.id === planet.id}
            className={item.id === planet.id ? 'is-selected' : undefined}
            style={{ '--planet-color': item.color } as CSSProperties}
          >
            <span aria-hidden="true">{item.emoji}</span>
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      <div className="planet-explorer-main">
        <div className="planet-explorer-viewer">
          <div className="planet-explorer-model" key={viewerKey}>
            {viewerTexture ? (
              <Planet3D
                textureUrl={viewerTexture}
                size={planet.hasRings && !moonTexture ? 1.55 : 1.9}
                hasRings={planet.hasRings && !moonTexture}
                atmosphereColor={moonTexture ? undefined : planet.atmosphereColor}
                rotationSpeed={0.0025}
                label={moonTexture?.planetId === planet.id ? moonTexture.name : planet.name}
              />
            ) : <PlanetFallback emoji={planet.emoji} color={planet.color} label={t.illustration(planet.name)} />}
          </div>
          <div className="planet-explorer-viewer-footer">
            <span>{t.drag}</span>
            <button type="button" onClick={() => setViewerKey(value => value + 1)}>{t.restart}</button>
          </div>
        </div>

        <article className="planet-explorer-story" aria-live="polite">
          <div className="planet-explorer-name">
            <span aria-hidden="true">{planet.emoji}</span>
            <div>
              <h3 style={{ color: planet.color }}>{planet.name}</h3>
              <p>{planet.kind}</p>
            </div>
          </div>
          <p className="planet-explorer-description">{planet.description}</p>

          <div className="planet-explorer-focuses" role="tablist" aria-label={t.explore(planet.name)}>
            {PLANET_FOCUS_ORDER.map(item => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={focus === item}
                onClick={() => setFocus(item)}
              >
                <SpaceIcon name={FOCUS_ICONS[item]} size={16} />
                {planet.focuses[item].label}
              </button>
            ))}
          </div>

          <div className="planet-explorer-focus-card" role="tabpanel">
            <SpaceIcon name={FOCUS_ICONS[focus]} size={22} />
            <p>{planet.focuses[focus].text}</p>
          </div>

          <div className="planet-explorer-fun-fact">
            <SpaceIcon name="bulb" size={22} />
            <p><strong>{t.didYouKnow}</strong> {planet.funFact}</p>
          </div>

          <button type="button" className="planet-explorer-compare-toggle" onClick={() => setShowComparison(value => !value)} aria-expanded={showComparison}>
            {showComparison ? t.compareClose : t.compareOpen}
          </button>
        </article>
      </div>

      {showComparison && (
        <div className="planet-explorer-comparison" aria-live="polite">
          <div className="planet-explorer-scale" aria-hidden="true">
            <span className="planet-explorer-earth" />
            <span className="planet-explorer-other" style={{ width: relativeDiameter, height: relativeDiameter, background: planet.color }} />
          </div>
          <div>
            <h3>{t.compareTitle(planet.name)}</h3>
            <p><strong>{ratio.toLocaleString(t.numbers, { maximumFractionDigits: 1 })}×</strong> {t.radius} · {t.moons(planet.moons)}.</p>
            <small>{t.scaleNote}</small>
          </div>
        </div>
      )}

      <div className="planet-explorer-extra">
        <section className="planet-explorer-panel" aria-labelledby="planet-travel-title">
          <h3 id="planet-travel-title"><SpaceIcon name="rocket" size={20} />{planet.id === 'earth' ? t.here : t.travelTo(planet.name)}</h3>
          {planet.id === 'earth' ? (
            <p>{t.earthNote}</p>
          ) : todayDistance === null ? (
            <p role="status">{t.computing}</p>
          ) : (
            <>
              <p>{t.today(planet.name)[0]}<strong>{formatDistance(todayDistance, locale)}</strong>{t.today(planet.name)[1]}</p>
              <ul className="planet-travel-list">
                {travelTimes(todayDistance, locale).map(mode => (
                  <li key={mode.id}><span>{mode.label}</span><strong>{mode.duration}</strong></li>
                ))}
              </ul>
              <small>{t.travelNote}</small>
            </>
          )}
        </section>

        <section className="planet-explorer-panel" aria-labelledby="planet-moons-title">
          <h3 id="planet-moons-title"><SpaceIcon name="moon-stars" size={20} />{moons.length ? t.mainMoons : t.noMoon}</h3>
          {moons.length ? (
            <ul className="planet-moon-list">
              {moons.map(moon => (
                <li key={moon.name}>
                  <strong>{locale === 'en' ? moon.nameEn : moon.name}</strong>
                  <span>{moon.diameterKm.toLocaleString(t.numbers)} {t.diameter} · {locale === 'en' ? moon.factEn : moon.fact}</span>
                  {moon.texture && (
                    moonTexture?.planetId === planet.id
                      ? <button type="button" onClick={() => { setMoonTexture(null); setViewerKey(value => value + 1) }}>{t.back(planet.name)}</button>
                      : <button type="button" onClick={() => { setMoonTexture({ planetId: planet.id, texture: moon.texture!, name: locale === 'en' ? moon.nameEn : moon.name }); setViewerKey(value => value + 1) }}>{t.see3d(locale === 'en' ? moon.nameEn : moon.name)}</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{t.noKnownMoon(planet.name)}</p>
          )}
          <small>{t.moonTotal(planet.moons)}</small>
        </section>
      </div>

      <div className="planet-explorer-challenge" aria-labelledby="planet-explorer-challenge-title">
        <div>
          <span className="planet-explorer-kicker">{t.challenge}</span>
          <h3 id="planet-explorer-challenge-title">{planet.challenge.question}</h3>
        </div>
        <div className="planet-explorer-choices">
          {planet.challenge.choices.map(choice => (
            <button
              key={choice}
              type="button"
              onClick={() => setAnswer(choice)}
              className={answer === choice ? (choice === planet.challenge.answer ? 'is-correct' : 'is-wrong') : undefined}
              disabled={answer !== null}
            >
              {choice}
            </button>
          ))}
        </div>
        {answer && (
          <p className={isCorrect ? 'is-correct' : 'is-wrong'}>
            <strong>{isCorrect ? t.right : t.wrong}</strong> {planet.challenge.explanation}
          </p>
        )}
      </div>
    </section>
  )
}
