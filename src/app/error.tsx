'use client'

import { useEffect } from 'react'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const COPY = {
  fr: { badge: 'Incident temporaire', title: 'Cette vue n’a pas pu être chargée', text: 'Une source scientifique peut être momentanément indisponible. Vous pouvez relancer la page sans perdre vos données.', retry: 'Réessayer' },
  en: { badge: 'Temporary problem', title: 'This view could not be loaded', text: 'A science source may be briefly unavailable. You can reload the page without losing your data.', retry: 'Try again' },
}

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const copy = COPY[useSiteLocale()]

  useEffect(() => {
    console.error('[SolarScope page error]', error.digest ?? error.message)
  }, [error])

  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '8rem', textAlign: 'center' }}>
      <div className="card prose-card" style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="badge">{copy.badge}</p>
        <h1 className="section-title">{copy.title}</h1>
        <p>{copy.text}</p>
        <button className="btn-primary" type="button" onClick={reset}>{copy.retry}</button>
      </div>
    </div>
  )
}
