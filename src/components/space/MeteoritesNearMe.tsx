'use client'

import { useEffect, useState } from 'react'
import type { NearbyMeteorite } from '@/lib/data/meteorites'
import SpaceIcon from '@/components/ui/SpaceIcon'

type Summary = {
  total: number
  seenFalling: number
  heaviest: Array<Omit<NearbyMeteorite, 'distanceKm'>>
}

type Near = { nearest: NearbyMeteorite[]; within100Km: number; within500Km: number }

type ApiResponse = { summary: Summary; near: Near | null }

function massLabel(grams: number | null): string {
  if (grams === null) return 'masse inconnue'
  if (grams >= 1_000_000) return `${(grams / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} tonnes`
  if (grams >= 1_000) return `${(grams / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} kg`
  return `${grams.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} g`
}

export default function MeteoritesNearMe() {
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

  return (
    <section className="card meteorite-near" aria-labelledby="meteorite-near-title">
      <div className="meteorite-near-heading">
        <div>
          <span className="section-kicker">BASE COMPLÈTE DE LA NASA</span>
          <h2 id="meteorite-near-title" className="section-title">Des météorites près de chez toi ?</h2>
        </div>
        {summary && (
          <dl className="meteorite-near-stats">
            <div><dt>Météorites localisées</dt><dd>{summary.total.toLocaleString('fr-FR')}</dd></div>
            <div><dt>Vues en train de tomber</dt><dd>{summary.seenFalling.toLocaleString('fr-FR')}</dd></div>
            {summary.heaviest[0] && <div><dt>La plus lourde : {summary.heaviest[0].name}</dt><dd>{massLabel(summary.heaviest[0].massG)}</dd></div>}
          </dl>
        )}
      </div>

      {summaryFailed && <p className="space-data-empty is-unavailable" role="status">La base de la NASA ne répond pas pour le moment. La carte ci-dessous reste disponible.</p>}

      {!near && (
        <div className="meteorite-near-cta">
          <p>Utilise ta position pour découvrir les météorites trouvées autour de chez toi. Elle est arrondie à environ 10 km et n’est pas enregistrée.</p>
          <button type="button" className="btn-primary" onClick={findNearMe} disabled={state === 'locating' || state === 'loading'}>
            <SpaceIcon name="compass" size={18} />
            {state === 'locating' ? 'Recherche de ta position…' : state === 'loading' ? 'Recherche des météorites…' : 'Trouver les météorites près de moi'}
          </button>
          {state === 'denied' && <p className="meteorite-near-error" role="status">Sans ta position, impossible de chercher autour de toi. Tu peux explorer la carte du monde plus bas.</p>}
          {state === 'error' && <p className="meteorite-near-error" role="status">La base de la NASA ne répond pas. Réessaie dans un moment.</p>}
        </div>
      )}

      {near && (
        <div className="meteorite-near-results" aria-live="polite">
          <p>
            <strong>{near.within100Km.toLocaleString('fr-FR')}</strong> météorite{near.within100Km > 1 ? 's' : ''} à moins de 100 km,{' '}
            <strong>{near.within500Km.toLocaleString('fr-FR')}</strong> à moins de 500 km. Les plus proches :
          </p>
          <ul className="exo-list">
            {near.nearest.map(item => (
              <li key={`${item.name}-${item.distanceKm}`} className="exo-row">
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.fell ? 'Vue en train de tomber' : 'Trouvée au sol'}{item.year ? ` en ${item.year}` : ''} · classe {item.recclass}</span>
                </div>
                <dl>
                  <div><dt>Distance</dt><dd>{item.distanceKm.toLocaleString('fr-FR')} km</dd></div>
                  <div><dt>Masse</dt><dd>{massLabel(item.massG)}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="exo-note">
        Source : <a href="https://data.nasa.gov/dataset/meteorite-landings" target="_blank" rel="noopener noreferrer">NASA Open Data — Meteorite Landings ↗</a> (données de la Meteoritical Society).
      </p>
    </section>
  )
}
