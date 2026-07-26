'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { PLANET_EXPLORER_PLANETS, PLANET_FOCUS_ORDER, type PlanetFocus } from '@/lib/content/planet-explorer'

const Planet3D = dynamic(() => import('@/components/space/Planet3D'), {
  ssr: false,
  loading: () => <div className="planet-explorer-loading">Chargement du globe…</div>,
})

const FOCUS_ICONS: Record<PlanetFocus, string> = {
  identity: '🔎',
  air: '💨',
  moons: '🌙',
  journey: '🛰️',
}

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
  }

  return (
    <section className="planet-explorer" aria-labelledby="planet-explorer-title" data-planet-explorer>
      <div className="planet-explorer-heading">
        <div>
          <span className="planet-explorer-kicker">🧭 EXPLORATEUR INTERACTIF · 5 MIN</span>
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
            {planet.texture ? (
              <Planet3D
                textureUrl={planet.texture}
                size={planet.hasRings ? 1.55 : 1.9}
                hasRings={planet.hasRings}
                atmosphereColor={planet.atmosphereColor}
                rotationSpeed={0.0025}
                label={planet.name}
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
                <span aria-hidden="true">{FOCUS_ICONS[item]}</span>
                {planet.focuses[item].label}
              </button>
            ))}
          </div>

          <div className="planet-explorer-focus-card" role="tabpanel">
            <span aria-hidden="true">{FOCUS_ICONS[focus]}</span>
            <p>{planet.focuses[focus].text}</p>
          </div>

          <div className="planet-explorer-fun-fact">
            <span aria-hidden="true">💡</span>
            <p><strong>Le savais-tu ?</strong> {planet.funFact}</p>
          </div>

          <button type="button" className="planet-explorer-compare-toggle" onClick={() => setShowComparison(value => !value)} aria-expanded={showComparison}>
            ⚖️ {showComparison ? 'Fermer la comparaison' : 'Comparer avec la Terre'}
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

      <div className="planet-explorer-challenge" aria-labelledby="planet-explorer-challenge-title">
        <div>
          <span className="planet-explorer-kicker">🎯 DÉFI EXPRESS</span>
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
