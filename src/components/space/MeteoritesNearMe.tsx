'use client'

import { useEffect, useState } from 'react'
import type { NearbyMeteorite } from '@/lib/data/meteorites'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

type Summary = {
  total: number
  seenFalling: number
  heaviest: Array<Omit<NearbyMeteorite, 'distanceKm'>>
}

type Near = { nearest: NearbyMeteorite[]; within100Km: number; within500Km: number }

type ApiResponse = { summary: Summary; near: Near | null }

const COPY = {
  fr: {
    numbers: 'fr-FR', unknownMass: 'masse inconnue', tonnes: 'tonnes',
    kicker: 'BASE COMPLÈTE DE LA NASA', title: 'Des météorites près de chez toi ?',
    located: 'Météorites localisées', seenFalling: 'Vues en train de tomber', heaviest: (name: string) => `La plus lourde : ${name}`,
    down: 'La base de la NASA ne répond pas pour le moment. La carte ci-dessous reste disponible.',
    intro: 'Utilise ta position pour découvrir les météorites trouvées autour de chez toi. Elle est arrondie à environ 10 km et n’est pas enregistrée.',
    locating: 'Recherche de ta position…', searching: 'Recherche des météorites…', find: 'Trouver les météorites près de moi',
    denied: 'Sans ta position, impossible de chercher autour de toi. Tu peux explorer la carte du monde plus bas.',
    error: 'La base de la NASA ne répond pas. Réessaie dans un moment.',
    within: (near: string, count: number, far: string) => [`${near}`, ` météorite${count > 1 ? 's' : ''} à moins de 100 km, `, far, ' à moins de 500 km. Les plus proches :'],
    fell: 'Vue en train de tomber', found: 'Trouvée au sol', inYear: (year: number) => ` en ${year}`, recclass: 'classe',
    distance: 'Distance', mass: 'Masse', source: 'Source :', sourceNote: '(données de la Meteoritical Society).',
  },
  en: {
    numbers: 'en-GB', unknownMass: 'unknown mass', tonnes: 'tonnes',
    kicker: 'FULL NASA DATABASE', title: 'Meteorites near you?',
    located: 'Located meteorites', seenFalling: 'Seen falling', heaviest: (name: string) => `The heaviest: ${name}`,
    down: 'The NASA database is not answering right now. The map below is still available.',
    intro: 'Use your position to find the meteorites discovered around where you live. It is rounded to about 10 km and not stored.',
    locating: 'Finding your position…', searching: 'Looking for meteorites…', find: 'Find meteorites near me',
    denied: 'Without your position, we cannot search around you. You can explore the world map further down.',
    error: 'The NASA database is not answering. Try again in a moment.',
    within: (near: string, count: number, far: string) => [`${near}`, ` meteorite${count === 1 ? '' : 's'} within 100 km, `, far, ' within 500 km. The closest ones:'],
    fell: 'Seen falling', found: 'Found on the ground', inYear: (year: number) => ` in ${year}`, recclass: 'class',
    distance: 'Distance', mass: 'Mass', source: 'Source:', sourceNote: '(data from the Meteoritical Society).',
  },
}

type Copy = (typeof COPY)['fr']

function massLabel(grams: number | null, copy: Copy): string {
  if (grams === null) return copy.unknownMass
  if (grams >= 1_000_000) return `${(grams / 1_000_000).toLocaleString(copy.numbers, { maximumFractionDigits: 1 })} ${copy.tonnes}`
  if (grams >= 1_000) return `${(grams / 1_000).toLocaleString(copy.numbers, { maximumFractionDigits: 1 })} kg`
  return `${grams.toLocaleString(copy.numbers, { maximumFractionDigits: 0 })} g`
}

export default function MeteoritesNearMe() {
  const copy = COPY[useSiteLocale()]
  const [summary, setSummary] = useState<Summary | null>(null)
  const [near, setNear] = useState<Near | null>(null)
  const [state, setState] = useState<'idle' | 'locating' | 'loading' | 'denied' | 'error'>('idle')
  const [summaryFailed, setSummaryFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/meteorites', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('unavailable')
        return response.json() as Promise<ApiResponse>
      })
      .then(data => setSummary(data.summary))
      .catch(error => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setSummaryFailed(true)
      })
    return () => controller.abort()
  }, [])

  // The position is only requested when the child presses the button, then rounded (~10 km) on the server.
  const findNearMe = () => {
    if (!navigator.geolocation) {
      setState('denied')
      return
    }
    setState('locating')
    navigator.geolocation.getCurrentPosition(
      position => {
        setState('loading')
        const lat = position.coords.latitude.toFixed(1)
        const lon = position.coords.longitude.toFixed(1)
        fetch(`/api/meteorites?lat=${lat}&lon=${lon}`)
          .then(response => {
            if (!response.ok) throw new Error('unavailable')
            return response.json() as Promise<ApiResponse>
          })
          .then(data => {
            setNear(data.near)
            setState('idle')
          })
          .catch(() => setState('error'))
      },
      () => setState('denied'),
      { timeout: 10_000, maximumAge: 600_000 },
    )
  }

  const within = near ? copy.within(near.within100Km.toLocaleString(copy.numbers), near.within100Km, near.within500Km.toLocaleString(copy.numbers)) : null

  return (
    <section className="card meteorite-near" aria-labelledby="meteorite-near-title">
      <div className="meteorite-near-heading">
        <div>
          <span className="section-kicker">{copy.kicker}</span>
          <h2 id="meteorite-near-title" className="section-title">{copy.title}</h2>
        </div>
        {summary && (
          <dl className="meteorite-near-stats">
            <div><dt>{copy.located}</dt><dd>{summary.total.toLocaleString(copy.numbers)}</dd></div>
            <div><dt>{copy.seenFalling}</dt><dd>{summary.seenFalling.toLocaleString(copy.numbers)}</dd></div>
            {summary.heaviest[0] && <div><dt>{copy.heaviest(summary.heaviest[0].name)}</dt><dd>{massLabel(summary.heaviest[0].massG, copy)}</dd></div>}
          </dl>
        )}
      </div>

      {summaryFailed && <p className="space-data-empty is-unavailable" role="status">{copy.down}</p>}

      {!near && (
        <div className="meteorite-near-cta">
          <p>{copy.intro}</p>
          <button type="button" className="btn-primary" onClick={findNearMe} disabled={state === 'locating' || state === 'loading'}>
            <SpaceIcon name="compass" size={18} />
            {state === 'locating' ? copy.locating : state === 'loading' ? copy.searching : copy.find}
          </button>
          {state === 'denied' && <p className="meteorite-near-error" role="status">{copy.denied}</p>}
          {state === 'error' && <p className="meteorite-near-error" role="status">{copy.error}</p>}
        </div>
      )}

      {near && within && (
        <div className="meteorite-near-results" aria-live="polite">
          <p>
            <strong>{within[0]}</strong>{within[1]}<strong>{within[2]}</strong>{within[3]}
          </p>
          <ul className="exo-list">
            {near.nearest.map(item => (
              <li key={`${item.name}-${item.distanceKm}`} className="exo-row">
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.fell ? copy.fell : copy.found}{item.year ? copy.inYear(item.year) : ''} · {copy.recclass} {item.recclass}</span>
                </div>
                <dl>
                  <div><dt>{copy.distance}</dt><dd>{item.distanceKm.toLocaleString(copy.numbers)} km</dd></div>
                  <div><dt>{copy.mass}</dt><dd>{massLabel(item.massG, copy)}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="exo-note">
        {copy.source} <a href="https://data.nasa.gov/dataset/meteorite-landings" target="_blank" rel="noopener noreferrer">NASA Open Data — Meteorite Landings ↗</a> {copy.sourceNote}
      </p>
    </section>
  )
}
