'use client'

import { useEffect, useState } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { useSiteLocale } from '@/components/layout/LanguageToggle'


interface Launch {
  id: string
  name: string
  net: string
  agency: string
  rocket: string
  status: string
  image: string | null
  location: string
  webcast: string | null
  live: boolean
  url: string | null
}

const VEHICLES = [
  {
    name: 'Falcon 9', color: '#38bdf8', status: { fr: 'Opérationnel', en: 'Operational' },
    detail: { fr: 'Lanceur orbital dont le premier étage est réutilisable, utilisé pour les satellites, la capsule Dragon et des missions scientifiques.', en: 'An orbital rocket with a reusable first stage, used for satellites, the Dragon capsule and science missions.' },
  },
  {
    name: 'Falcon Heavy', color: '#818cf8', status: { fr: 'Opérationnel', en: 'Operational' },
    detail: { fr: 'Trois corps de Falcon 9 assemblés, pour les charges lourdes et les missions qui vont très loin.', en: 'Three Falcon 9 cores joined together, for heavy loads and missions that go very far.' },
  },
  {
    name: 'Starship', color: '#a78bfa', status: { fr: 'En développement', en: 'In development' },
    detail: { fr: 'Un très gros système entièrement réutilisable, encore en phase d’essais. Ses performances évoluent avec le programme.', en: 'A very large, fully reusable system still being tested. Its performance changes as the programme goes on.' },
  },
]

const COPY = {
  fr: { badge: 'SPACEX · CALENDRIER EN DIRECT', title: 'Lancements à venir', source: 'Calendrier fourni par Launch Library 2 · aucune statistique annuelle figée', updated: (time: string) => `Actualisé à ${time}`, connecting: 'Connexion…', down: 'Le calendrier SpaceX est temporairement indisponible.', details: 'Fiche ↗', detailsLabel: (name: string) => `Fiche du lancement ${name} (nouvel onglet)`, webcast: 'Diffusion ↗', vehicles: 'Caractéristiques officielles des véhicules ↗', date: 'fr-FR' },
  en: { badge: 'SPACEX · LIVE SCHEDULE', title: 'Upcoming launches', source: 'Schedule provided by Launch Library 2 · no fixed yearly statistics', updated: (time: string) => `Updated at ${time}`, connecting: 'Connecting…', down: 'The SpaceX schedule is temporarily unavailable.', details: 'Details ↗', detailsLabel: (name: string) => `Launch details for ${name} (new tab)`, webcast: 'Webcast ↗', vehicles: 'Official vehicle specifications ↗', date: 'en-GB' },
}

export default function SpaceXSection() {
  const locale = useSiteLocale()
  const t = COPY[locale]
  const [launches, setLaunches] = useState<Launch[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/launches?limit=8&provider=SpaceX', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('launches unavailable')
        return response.json() as Promise<{ launches: Launch[]; updatedAt: string }>
      })
      .then(data => {
        setLaunches(data.launches)
        setUpdatedAt(data.updatedAt)
      })
      .catch(fetchError => {
        if (fetchError instanceof DOMException && fetchError.name === 'AbortError') return
        setError(true)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  return (
    <section style={{ paddingTop: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div>
          <div className="badge" style={{ marginBottom: '0.75rem' }}><SpaceIcon name="satellite" size={18} className="inline-icon" /> {t.badge}</div>
          <h2 style={{ color: 'var(--text)', font: "800 clamp(1.8rem, 4vw, 2.8rem)/1 var(--font-display)", letterSpacing: '-0.035em' }}>
            {t.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.55rem' }}>
            {t.source}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--text-muted)', fontSize: '0.68rem' }}>
          <span className={error ? 'live-orb is-loading' : 'live-orb'} />
          {updatedAt ? t.updated(new Date(updatedAt).toLocaleTimeString(t.date, { hour: '2-digit', minute: '2-digit' })) : t.connecting}
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {VEHICLES.map(vehicle => (
          <article key={vehicle.name} className="card" style={{ padding: '1.2rem', borderTop: `2px solid ${vehicle.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--text)', font: "750 1rem var(--font-display)" }}>{vehicle.name}</h3>
              <span style={{ color: vehicle.color, fontSize: '0.62rem', fontWeight: 800 }}>{vehicle.status[locale]}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.74rem', lineHeight: 1.65, marginTop: '0.75rem' }}>{vehicle.detail[locale]}</p>
          </article>
        ))}
      </div>

      {loading && <div className="skeleton-card" style={{ height: 240 }} />}

      {!loading && error && (
        <div className="card" style={{ padding: '1.5rem', color: '#f59e0b', textAlign: 'center' }}>
          <SpaceIcon name="signal" size={18} className="inline-icon" /> {t.down}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {launches.map((launch, index) => (
            <article key={launch.id} className="card motion-enter" style={{ animationDelay: `${Math.min(index * 0.04, 0.6)}s`,  padding: '1.1rem', display: 'flex', flexDirection: 'column', minHeight: 195 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <time dateTime={launch.net} style={{ color: 'var(--nebula)', fontSize: '0.68rem', fontWeight: 800 }}>
                  {new Date(launch.net).toLocaleDateString(t.date, { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
                <span style={{ color: launch.live ? '#34d399' : 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 800 }}>
                  {launch.live ? '● LIVE' : launch.status.toUpperCase()}
                </span>
              </div>
              <h3 style={{ marginTop: '0.8rem', color: 'var(--text)', font: "730 0.92rem/1.45 var(--font-display)" }}>{launch.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', lineHeight: 1.6, marginTop: '0.45rem' }}>{launch.rocket} · {launch.location}</p>
              <div style={{ marginTop: 'auto', paddingTop: '0.9rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                <span>{new Date(launch.net).toLocaleTimeString(t.date, { hour: '2-digit', minute: '2-digit' })}</span>
                {launch.url && <a href={launch.url} target="_blank" rel="noopener noreferrer" className="touch-link touch-link-compact" style={{ color: 'var(--star)', textDecoration: 'none' }} aria-label={t.detailsLabel(launch.name)}>{t.details}</a>}
                {launch.webcast && <a href={launch.webcast} target="_blank" rel="noopener noreferrer" className="touch-link touch-link-compact" style={{ color: 'var(--nebula)', textDecoration: 'none' }}>{t.webcast}</a>}
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <a href="https://www.spacex.com/vehicles/" target="_blank" rel="noopener noreferrer" className="touch-link touch-link-compact" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {t.vehicles}
        </a>
      </div>
    </section>
  )
}
