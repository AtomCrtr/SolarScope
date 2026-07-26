'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

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
}

const VEHICLES = [
  {
    name: 'Falcon 9', status: 'Opérationnel', color: '#38bdf8',
    detail: 'Lanceur orbital à premier étage réutilisable, utilisé pour les satellites, Dragon et les missions scientifiques.',
  },
  {
    name: 'Falcon Heavy', status: 'Opérationnel', color: '#818cf8',
    detail: 'Architecture à trois corps dérivée de Falcon 9 pour les charges lourdes et les missions à haute énergie.',
  },
  {
    name: 'Starship', status: 'Développement', color: '#a78bfa',
    detail: 'Système super-lourd entièrement réutilisable en campagne d’essais. Les performances évoluent avec le programme.',
  },
]

export default function SpaceXSection() {
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
          <div className="badge" style={{ marginBottom: '0.75rem' }}>🛸 SPACEX · CALENDRIER LIVE</div>
          <h2 style={{ color: 'var(--text)', font: "800 clamp(1.8rem, 4vw, 2.8rem)/1 'Outfit', sans-serif", letterSpacing: '-0.035em' }}>
            Lancements à venir
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.55rem' }}>
            Calendrier fourni par Launch Library 2 · aucune statistique annuelle figée
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--text-muted)', fontSize: '0.68rem' }}>
          <span className={error ? 'live-orb is-loading' : 'live-orb'} />
          {updatedAt ? `Actualisé à ${new Date(updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'Connexion…'}
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {VEHICLES.map(vehicle => (
          <article key={vehicle.name} className="card" style={{ padding: '1.2rem', borderTop: `2px solid ${vehicle.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
              <h3 style={{ color: 'var(--text)', font: "750 1rem 'Outfit', sans-serif" }}>{vehicle.name}</h3>
              <span style={{ color: vehicle.color, fontSize: '0.62rem', fontWeight: 800 }}>{vehicle.status}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.74rem', lineHeight: 1.65, marginTop: '0.75rem' }}>{vehicle.detail}</p>
          </article>
        ))}
      </div>

      {loading && <div className="skeleton-card" style={{ height: 240 }} />}

      {!loading && error && (
        <div className="card" style={{ padding: '1.5rem', color: '#f59e0b', textAlign: 'center' }}>
          📡 Le calendrier SpaceX est temporairement indisponible.
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {launches.map((launch, index) => (
            <motion.article
              key={launch.id}
              className="card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', minHeight: 195 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                <time dateTime={launch.net} style={{ color: '#818cf8', fontSize: '0.68rem', fontWeight: 800 }}>
                  {new Date(launch.net).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
                <span style={{ color: launch.live ? '#34d399' : 'var(--text-muted)', fontSize: '0.6rem', fontWeight: 800 }}>
                  {launch.live ? '● LIVE' : launch.status.toUpperCase()}
                </span>
              </div>
              <h3 style={{ marginTop: '0.8rem', color: 'var(--text)', font: "730 0.92rem/1.45 'Outfit', sans-serif" }}>{launch.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem', lineHeight: 1.6, marginTop: '0.45rem' }}>{launch.rocket} · {launch.location}</p>
              <div style={{ marginTop: 'auto', paddingTop: '0.9rem', display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.65rem' }}>
                <span>{new Date(launch.net).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                {launch.webcast && <a href={launch.webcast} target="_blank" rel="noopener noreferrer" style={{ color: '#a5b4fc', textDecoration: 'none' }}>Diffusion ↗</a>}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <a href="https://www.spacex.com/vehicles/" target="_blank" rel="noopener noreferrer" style={{ color: '#64748b', fontSize: '0.68rem', textDecoration: 'none' }}>
          Caractéristiques officielles des véhicules ↗
        </a>
      </div>
    </section>
  )
}
