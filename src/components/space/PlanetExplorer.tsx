'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { PLANET_EXPLORER_PLANETS, PLANET_FOCUS_ORDER, type PlanetFocus } from '@/lib/content/planet-explorer'
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

function PlanetFallback({ emoji, color, name }: { emoji: string; color: string; name: string }) {
  return (
    <div className="planet-explorer-fallback" aria-label={`Illustration de ${name}`} role="img">
      <span style={{ filter: `drop-shadow(0 0 28px ${color})` }}>{emoji}</span>
    </div>
  )
}

export default function PlanetExplorer() {
  const [selectedId, setSelectedId] = useState('earth')
  const [focus, setFocus] = useState<PlanetFocus>('identity')
  const [viewerKey, setViewerKey] = useState(0)
  const [showComparison, setShowComparison] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [moonTexture, setMoonTexture] = useState<{ planetId: string; texture: string; name: string } | null>(null)
  const [distance, setDistance] = useState<{ planetId: string; km: number } | null>(null)

  const planet = useMemo(
    () => PLANET_EXPLORER_PLANETS.find(item => item.id === selectedId) ?? PLANET_EXPLORER_PLANETS[2],
    [selectedId],
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
      if (!id || !PLANET_EXPLORER_PLANETS.some(item => item.id === id)) return
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
          <span className="planet-explorer-kicker">EXPLORATEUR INTERACTIF · 5 MIN</span>
          <h2 id="planet-explorer-title">Choisis une planète, puis joue au détective.</h2>
          <p>Tu peux tourner le globe, ouvrir une seule idée à la fois et finir par un mini-défi.</p>
        </div>
        <span className="planet-explorer-progress">1 planète · 1 idée · 1 défi</span>
      </div>

      <div className="planet-explorer-selector" aria-label="Choisir une planète">
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
            ) : <PlanetFallback emoji={planet.emoji} color={planet.color} name={planet.name} />}
          </div>
          <div className="planet-explorer-viewer-footer">
            <span>Fais glisser le globe ou utilise les flèches du clavier.</span>
            <button type="button" onClick={() => setViewerKey(value => value + 1)}>↺ Recommencer</button>
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

          <div className="planet-explorer-focuses" role="tablist" aria-label={`Explorer ${planet.name}`}>
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
            <p><strong>Le savais-tu ?</strong> {planet.funFact}</p>
          </div>

          <button type="button" className="planet-explorer-compare-toggle" onClick={() => setShowComparison(value => !value)} aria-expanded={showComparison}>
            {showComparison ? 'Fermer la comparaison' : 'Comparer avec la Terre'}
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
            <h3>{planet.name} comparée à la Terre</h3>
            <p><strong>{ratio.toLocaleString('fr-FR', { maximumFractionDigits: 1 })}×</strong> le rayon de la Terre · {planet.moons} lune{planet.moons > 1 ? 's' : ''} recensée{planet.moons > 1 ? 's' : ''}.</p>
            <small>Les cercles sont simplifiés pour comparer facilement : les distances ne sont pas à l’échelle.</small>
          </div>
        </div>
      )}

      <div className="planet-explorer-extra">
        <section className="planet-explorer-panel" aria-labelledby="planet-travel-title">
          <h3 id="planet-travel-title"><SpaceIcon name="rocket" size={20} />{planet.id === 'earth' ? 'Tu es ici !' : `Voyage vers ${planet.name}`}</h3>
          {planet.id === 'earth' ? (
            <p>La Terre est notre point de départ. Choisis une autre planète pour calculer le voyage depuis chez nous.</p>
          ) : todayDistance === null ? (
            <p role="status">Calcul de la distance du jour…</p>
          ) : (
            <>
              <p>Aujourd’hui, {planet.name} est à <strong>{formatDistance(todayDistance)}</strong> de la Terre. Combien de temps faudrait-il pour y aller en ligne droite ?</p>
              <ul className="planet-travel-list">
                {travelTimes(todayDistance).map(mode => (
                  <li key={mode.id}><span>{mode.label}</span><strong>{mode.duration}</strong></li>
                ))}
              </ul>
              <small>Les planètes bougent : la distance change chaque jour. Les vraies sondes suivent une trajectoire courbe, plus longue.</small>
            </>
          )}
        </section>

        <section className="planet-explorer-panel" aria-labelledby="planet-moons-title">
          <h3 id="planet-moons-title"><SpaceIcon name="moon-stars" size={20} />{moons.length ? `Ses lunes principales` : 'Pas de lune'}</h3>
          {moons.length ? (
            <ul className="planet-moon-list">
              {moons.map(moon => (
                <li key={moon.name}>
                  <strong>{moon.name}</strong>
                  <span>{moon.diameterKm.toLocaleString('fr-FR')} km de diamètre · {moon.fact}</span>
                  {moon.texture && (
                    moonTexture?.planetId === planet.id
                      ? <button type="button" onClick={() => { setMoonTexture(null); setViewerKey(value => value + 1) }}>Revenir à {planet.name}</button>
                      : <button type="button" onClick={() => { setMoonTexture({ planetId: planet.id, texture: moon.texture!, name: moon.name }); setViewerKey(value => value + 1) }}>Voir {moon.name.toLowerCase()} en 3D</button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>{planet.name} n’a aucune lune connue.</p>
          )}
          <small>{planet.moons} lune{planet.moons > 1 ? 's' : ''} recensée{planet.moons > 1 ? 's' : ''} au total · source : NASA Science.</small>
        </section>
      </div>

      <div className="planet-explorer-challenge" aria-labelledby="planet-explorer-challenge-title">
        <div>
          <span className="planet-explorer-kicker">DÉFI EXPRESS</span>
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
            <strong>{isCorrect ? 'Bravo !' : 'Presque !'}</strong> {planet.challenge.explanation}
          </p>
        )}
      </div>
    </section>
  )
}
