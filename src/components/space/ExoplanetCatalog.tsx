'use client'

import { useEffect, useState } from 'react'
import { methodLabelFor, type ExoplanetCatalog as Catalog, type ExoplanetSummary } from '@/lib/data/exoplanets'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import type { SiteLocale } from '@/lib/i18n/paths'

type Tab = 'nearest' | 'earthLike'

const COPY = {
  fr: {
    numbers: 'fr-FR',
    tabs: {
      nearest: { label: 'Les plus proches', intro: 'Les mondes connus autour des étoiles les plus proches du Soleil.' },
      earthLike: { label: 'Les plus semblables à la Terre', intro: 'Des planètes de taille proche de la Terre, ni trop chaudes ni trop froides pour de l’eau liquide… en théorie. Aucune vie n’y a été détectée.' },
    },
    unknownSize: 'taille inconnue', size: (value: string) => `${value} × la Terre`, found: (year: string) => `Découverte en ${year}`,
    distance: 'Distance', lightYears: 'années-lumière', sizeLabel: 'Taille', temperature: 'Température estimée',
    kicker: 'CATALOGUE NASA · MIS À JOUR CHAQUE JOUR', title: 'Explore les vraies exoplanètes', confirmed: 'exoplanètes confirmées',
    down: 'Le catalogue de la NASA ne répond pas pour le moment. Réessaie un peu plus tard.', loading: 'Chargement du catalogue de la NASA…', choose: 'Choisir une liste d’exoplanètes',
    note: 'Pour les planètes trouvées par vitesse radiale, la taille est estimée à partir de la masse. Une année-lumière, c’est la distance parcourue par la lumière en un an : environ 9 500 milliards de km.',
    how: 'Comment ont-elles été découvertes ?', source: 'Source :',
  },
  en: {
    numbers: 'en-GB',
    tabs: {
      nearest: { label: 'The closest', intro: 'Known worlds around the stars closest to the Sun.' },
      earthLike: { label: 'The most Earth-like', intro: 'Planets close to Earth’s size, neither too hot nor too cold for liquid water… in theory. No life has been detected there.' },
    },
    unknownSize: 'size unknown', size: (value: string) => `${value} × Earth`, found: (year: string) => `Discovered in ${year}`,
    distance: 'Distance', lightYears: 'light-years', sizeLabel: 'Size', temperature: 'Estimated temperature',
    kicker: 'NASA CATALOGUE · UPDATED EVERY DAY', title: 'Explore real exoplanets', confirmed: 'confirmed exoplanets',
    down: 'NASA’s catalogue is not answering right now. Try again a little later.', loading: 'Loading NASA’s catalogue…', choose: 'Choose a list of exoplanets',
    note: 'For planets found by radial velocity, the size is estimated from the mass. A light-year is the distance light travels in one year: about 9.5 trillion km.',
    how: 'How were they discovered?', source: 'Source:',
  },
}

type Copy = (typeof COPY)['fr']

function sizeLabel(earthRadii: number | null, copy: Copy): string {
  if (earthRadii === null) return copy.unknownSize
  return copy.size(earthRadii.toLocaleString(copy.numbers, { maximumFractionDigits: 1 }))
}

function PlanetRow({ planet, copy, locale }: { planet: ExoplanetSummary; copy: Copy; locale: SiteLocale }) {
  return (
    <li className="exo-row">
      <div>
        <strong>{planet.name}</strong>
        <span>{copy.found(planet.year ? String(planet.year) : '—')} · {methodLabelFor(planet.method, locale)}</span>
      </div>
      <dl>
        <div><dt>{copy.distance}</dt><dd>{planet.lightYears.toLocaleString(copy.numbers)} {copy.lightYears}</dd></div>
        <div><dt>{copy.sizeLabel}</dt><dd>{sizeLabel(planet.earthRadii, copy)}</dd></div>
        {planet.temperatureC !== null && <div><dt>{copy.temperature}</dt><dd>{planet.temperatureC} °C</dd></div>}
      </dl>
    </li>
  )
}

export default function ExoplanetCatalog() {
  const locale = useSiteLocale()
  const copy = COPY[locale]
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

  const maxMethod = catalog ? Math.max(...catalog.methods.map(item => item.count)) : 1

  return (
    <section className="card exo-catalog" aria-labelledby="exo-catalog-title">
      <div className="exo-catalog-heading">
        <div>
          <span className="section-kicker">{copy.kicker}</span>
          <h2 id="exo-catalog-title" className="section-title">{copy.title}</h2>
        </div>
        {catalog && <p><strong>{catalog.total.toLocaleString(copy.numbers)}</strong> {copy.confirmed}</p>}
      </div>

      {failed && <p className="space-data-empty is-unavailable" role="status">{copy.down}</p>}
      {!failed && !catalog && <p className="tonight-muted" role="status">{copy.loading}</p>}

      {catalog && (
        <>
          <div className="exo-tabs" role="tablist" aria-label={copy.choose}>
            {(['nearest', 'earthLike'] as const).map(id => (
              <button key={id} type="button" role="tab" id={`exo-tab-${id}`} aria-selected={tab === id} aria-controls="exo-tab-panel" onClick={() => setTab(id)}>
                {copy.tabs[id].label}
              </button>
            ))}
          </div>
          <div id="exo-tab-panel" role="tabpanel" aria-labelledby={`exo-tab-${tab}`}>
            <p className="exo-intro">{copy.tabs[tab].intro}</p>
            <ul className="exo-list">
              {catalog[tab].map(planet => <PlanetRow key={planet.name} planet={planet} copy={copy} locale={locale} />)}
            </ul>
            <p className="exo-note">{copy.note}</p>
          </div>

          <div className="exo-methods">
            <h3>{copy.how}</h3>
            <ul>
              {catalog.methods.map(item => (
                <li key={item.method}>
                  <span>{methodLabelFor(item.method, locale)}</span>
                  <span className="exo-bar" aria-hidden="true"><span style={{ width: `${Math.max(2, (item.count / maxMethod) * 100)}%` }} /></span>
                  <strong>{item.count.toLocaleString(copy.numbers)}</strong>
                </li>
              ))}
            </ul>
          </div>
          <p className="exo-note">
            {copy.source} <a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" rel="noopener noreferrer">NASA Exoplanet Archive ↗</a>
          </p>
        </>
      )}
    </section>
  )
}
