'use client'

import { useEffect, useState } from 'react'
import type { TonightSky as TonightSkyData } from '@/lib/astronomy/tonight'
import { fromDirection, towards } from '@/lib/astronomy/sky-words'
import type { IssPass } from '@/lib/astronomy/iss-passes'
import SpaceIcon from '@/components/ui/SpaceIcon'
import Link from 'next/link'
import { toggleObservation, useLocalProgress, type SkyObjectId } from '@/lib/client/local-progress'

type TonightSkyProps = {
  latitude: number | null
  longitude: number | null
  place: string
}

type IssState = { status: 'loading' } | { status: 'ready'; passes: IssPass[] } | { status: 'unavailable' }

const time = (date: Date) => date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ')

function dayLabel(date: Date, now: Date): string {
  const days = Math.round((new Date(date).setHours(0, 0, 0, 0) - new Date(now).setHours(0, 0, 0, 0)) / 86_400_000)
  if (days === 0) return 'Ce soir'
  if (days === 1) return 'Demain'
  return date.toLocaleDateString('fr-FR', { weekday: 'long' }).replace(/^./, letter => letter.toUpperCase())
}

/** The Moon drawn at its real phase: lit side on the right while it grows, on the left while it shrinks. */
function MoonPhaseIcon({ fraction, waxing }: { fraction: number; waxing: boolean }) {
  const c = 32
  const r = 28
  const rx = Math.abs(2 * fraction - 1) * r
  const crescent = fraction < 0.5
  const edgeSweep = waxing ? 1 : 0
  const terminatorSweep = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0)
  const lit = `M ${c} ${c - r} A ${r} ${r} 0 0 ${edgeSweep} ${c} ${c + r} A ${rx} ${r} 0 0 ${terminatorSweep} ${c} ${c - r} Z`
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx={c} cy={c} r={r} fill="#1b2550" stroke="#2a3566" strokeWidth="2" />
      {fraction > 0.02 && <path d={lit} fill="#eef1fa" />}
    </svg>
  )
}

/** « Je l'ai vu ! » : ticks the object in the passport's observation log. Nothing leaves the device. */
function SeenButton({ object, label }: { object: SkyObjectId; label: string }) {
  const progress = useLocalProgress()
  const seen = Boolean(progress?.observed?.[object])
  return (
    <button type="button" className="tonight-seen" aria-pressed={seen} onClick={() => toggleObservation(object)}>
      <SpaceIcon name={seen ? 'check' : 'eye'} size={16} />
      {seen ? `${label} : noté dans mon carnet` : `J’ai vu ${label}`}
    </button>
  )
}

export default function TonightSky({ latitude, longitude, place }: TonightSkyProps) {
  const [sky, setSky] = useState<TonightSkyData | null>(null)
  const [iss, setIss] = useState<IssState>({ status: 'loading' })
  const [now] = useState(() => new Date())

  useEffect(() => {
    if (latitude === null || longitude === null) return
    let cancelled = false

    // Loaded on demand: the astronomy code only ships with this page, once the place is known.
    import('@/lib/astronomy/tonight').then(({ computeTonight }) => {
      if (!cancelled) setSky(computeTonight(new Date(), latitude, longitude))
    })

    Promise.all([
      fetch('/api/iss-tle').then(response => {
        if (!response.ok) throw new Error('ISS TLE unavailable')
        return response.json() as Promise<{ line1: string; line2: string }>
      }),
      import('@/lib/astronomy/iss-passes'),
    ])
      .then(([tle, { findVisibleIssPasses }]) => {
        if (!cancelled) setIss({ status: 'ready', passes: findVisibleIssPasses(tle.line1, tle.line2, latitude, longitude, new Date()) })
      })
      .catch(() => {
        if (!cancelled) setIss({ status: 'unavailable' })
      })

    return () => { cancelled = true }
  }, [latitude, longitude])

  if (!sky) {
    return (
      <section className="card tonight-sky" aria-labelledby="tonight-title" aria-busy="true">
        <h2 id="tonight-title" className="section-title">Ce soir depuis chez toi</h2>
        <p className="tonight-muted" role="status">Calcul du ciel de ce soir…</p>
      </section>
    )
  }

  return (
    <section className="card tonight-sky" aria-labelledby="tonight-title">
      <header className="tonight-header">
        <div>
          <h2 id="tonight-title" className="section-title">Ce soir depuis {place}</h2>
          <p className="tonight-muted">
            {sky.isNow
              ? 'Il fait déjà nuit : voici le ciel en ce moment.'
              : `Le Soleil se couche vers ${sky.sunset ? time(sky.sunset) : '—'}. Le ciel est bien sombre vers ${time(sky.observedAt)}.`}
          </p>
        </div>
        <span className="tonight-privacy"><SpaceIcon name="compass" size={16} />Calculé sur ton appareil</span>
      </header>

      <div className="tonight-grid">
        <article className="tonight-block" aria-labelledby="tonight-moon">
          <div className="tonight-moon">
            <MoonPhaseIcon fraction={sky.moon.illuminatedPercent / 100} waxing={sky.moon.waxing} />
            <div>
              <h3 id="tonight-moon">La Lune</h3>
              <p className="tonight-strong">{sky.moon.phaseName}</p>
              <p className="tonight-muted">{sky.moon.illuminatedPercent} % éclairée</p>
            </div>
          </div>
          <p>
            {sky.moon.isUp
              ? `Regarde ${sky.moon.direction ? towards(sky.moon.direction) : ''}, ${sky.moon.height}.`
              : sky.moon.nextRise
                ? `Elle n’est pas encore levée : elle apparaît vers ${time(sky.moon.nextRise)}.`
                : 'Elle reste sous l’horizon cette nuit.'}
          </p>
          {sky.moon.illuminatedPercent > 70 && <p className="tonight-note">Très lumineuse, elle cache les étoiles les plus faibles.</p>}
          <SeenButton object="moon" label="la Lune" />
        </article>

        <article className="tonight-block" aria-labelledby="tonight-planets">
          <h3 id="tonight-planets">Planètes à l’œil nu</h3>
          {sky.planets.length ? (
            <ul className="tonight-list">
              {sky.planets.map(planet => (
                <li key={planet.id}>
                  <strong>{planet.name}</strong>
                  <span>{towards(planet.direction)}, {planet.height} · {planet.brightness}</span>
                  <small>{planet.tip}</small>
                  <SeenButton object={planet.id as SkyObjectId} label={planet.name} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="tonight-muted">Aucune planète brillante n’est bien placée ce soir. Profites-en pour chercher les constellations !</p>
          )}
        </article>

        <article className="tonight-block" aria-labelledby="tonight-iss">
          <h3 id="tonight-iss">Passages de l’ISS</h3>
          {iss.status === 'loading' && <p className="tonight-muted" role="status">Calcul de l’orbite…</p>}
          {iss.status === 'unavailable' && <p className="tonight-muted">L’orbite de l’ISS n’a pas pu être chargée. Réessaie plus tard.</p>}
          {iss.status === 'ready' && (iss.passes.length ? (
            <>
              <ul className="tonight-list">
                {iss.passes.map(pass => (
                  <li key={pass.start.toISOString()}>
                    <strong>{dayLabel(pass.start, now)} à {time(pass.start)}</strong>
                    <span>{fromDirection(pass.startDirection)} {towards(pass.endDirection)} · jusqu’à {pass.maxAltitude}° de hauteur</span>
                  </li>
                ))}
              </ul>
              <p className="tonight-note">Elle ressemble à une étoile très brillante qui avance sans clignoter.</p>
              <SeenButton object="iss" label="l’ISS" />
            </>
          ) : (
            <p className="tonight-muted">Pas de passage visible dans les trois prochains jours depuis ta zone.</p>
          ))}
        </article>
      </div>

      <p className="tonight-logbook">
        <SpaceIcon name="passport" size={18} />
        <span>Coche ce que tu as vraiment vu : ta première observation te fait gagner le tampon <strong>Observateur·rice du ciel</strong>. <Link href="/passeport#carnet">Voir mon carnet</Link></span>
      </p>

      <p className="tonight-footer">
        Calculs astronomiques faits dans ton navigateur (astronomy-engine, orbite CelesTrak). La météo et les lumières de la ville peuvent gêner l’observation.{' '}
        <a href="https://science.nasa.gov/skywatching/whats-up/" target="_blank" rel="noopener noreferrer">Guide du mois de la NASA ↗</a>
      </p>
    </section>
  )
}
