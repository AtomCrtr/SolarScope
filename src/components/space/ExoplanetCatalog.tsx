'use client'

import { useEffect, useState } from 'react'
import type { ExoplanetCatalog as Catalog, ExoplanetSummary } from '@/lib/data/exoplanets'

type Tab = 'nearest' | 'earthLike'

const TABS: Array<{ id: Tab; label: string; intro: string }> = [
  { id: 'nearest', label: 'Les plus proches', intro: 'Les mondes connus autour des étoiles les plus proches du Soleil.' },
  { id: 'earthLike', label: 'Les plus semblables à la Terre', intro: 'Des planètes de taille proche de la Terre, ni trop chaudes ni trop froides pour de l’eau liquide… en théorie. Aucune vie n’y a été détectée.' },
]

function sizeLabel(earthRadii: number | null): string {
  if (earthRadii === null) return 'taille inconnue'
  const value = earthRadii.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
  return `${value} × la Terre`
}

function PlanetRow({ planet }: { planet: ExoplanetSummary }) {
  return (
    <li className="exo-row">
      <div>
        <strong>{planet.name}</strong>
        <span>Découverte en {planet.year ?? '—'} · {planet.method}</span>
      </div>
      <dl>
        <div><dt>Distance</dt><dd>{planet.lightYears.toLocaleString('fr-FR')} années-lumière</dd></div>
        <div><dt>Taille</dt><dd>{sizeLabel(planet.earthRadii)}</dd></div>
        {planet.temperatureC !== null && <div><dt>Température estimée</dt><dd>{planet.temperatureC} °C</dd></div>}
      </dl>
    </li>
  )
}

export default function ExoplanetCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [failed, setFailed] = useState(false)
  const [tab, setTab] = useState<Tab>('nearest')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/exoplanets', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('catalog unavailable')
        return response.json() as Promise<Catalog>
      })
      .then(setCatalog)
      .catch(error => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setFailed(true)
      })
    return () => controller.abort()
  }, [])

  const active = TABS.find(item => item.id === tab) ?? TABS[0]
  const maxMethod = catalog ? Math.max(...catalog.methods.map(item => item.count)) : 1

  return (
    <section className="card exo-catalog" aria-labelledby="exo-catalog-title">
      <div className="exo-catalog-heading">
        <div>
          <span className="section-kicker">CATALOGUE NASA · MIS À JOUR CHAQUE JOUR</span>
          <h2 id="exo-catalog-title" className="section-title">Explore les vraies exoplanètes</h2>
        </div>
        {catalog && <p><strong>{catalog.total.toLocaleString('fr-FR')}</strong> exoplanètes confirmées</p>}
      </div>

      {failed && <p className="space-data-empty is-unavailable" role="status">Le catalogue de la NASA ne répond pas pour le moment. Réessaie un peu plus tard.</p>}
      {!failed && !catalog && <p className="tonight-muted" role="status">Chargement du catalogue de la NASA…</p>}

      {catalog && (
        <>
          <div className="exo-tabs" role="tablist" aria-label="Choisir une liste d’exoplanètes">
            {TABS.map(item => (
              <button key={item.id} type="button" role="tab" id={`exo-tab-${item.id}`} aria-selected={tab === item.id} aria-controls="exo-tab-panel" onClick={() => setTab(item.id)}>
                {item.label}
              </button>
            ))}
          </div>
          <div id="exo-tab-panel" role="tabpanel" aria-labelledby={`exo-tab-${tab}`}>
            <p className="exo-intro">{active.intro}</p>
            <ul className="exo-list">
              {catalog[tab].map(planet => <PlanetRow key={planet.name} planet={planet} />)}
            </ul>
            <p className="exo-note">Pour les planètes trouvées par vitesse radiale, la taille est estimée à partir de la masse. Une année-lumière, c’est la distance parcourue par la lumière en un an : environ 9 500 milliards de km.</p>
          </div>

          <div className="exo-methods">
            <h3>Comment ont-elles été découvertes ?</h3>
            <ul>
              {catalog.methods.map(item => (
                <li key={item.method}>
                  <span>{item.method}</span>
                  <span className="exo-bar" aria-hidden="true"><span style={{ width: `${Math.max(2, (item.count / maxMethod) * 100)}%` }} /></span>
                  <strong>{item.count.toLocaleString('fr-FR')}</strong>
                </li>
              ))}
            </ul>
          </div>
          <p className="exo-note">
            Source : <a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noopener noreferrer">NASA Exoplanet Archive ↗</a>
          </p>
        </>
      )}
    </section>
  )
}
