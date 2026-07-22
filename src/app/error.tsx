'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[SolarScope page error]', error.digest ?? error.message)
  }, [error])

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '8rem', textAlign: 'center' }}>
      <div className="card prose-card" style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="badge">Incident temporaire</p>
        <h1 className="section-title">Cette vue n’a pas pu être chargée</h1>
        <p>Une source scientifique peut être momentanément indisponible. Vous pouvez relancer la page sans perdre vos données.</p>
        <button className="btn-primary" type="button" onClick={reset}>Réessayer</button>
      </div>
    </div>
  )
}
