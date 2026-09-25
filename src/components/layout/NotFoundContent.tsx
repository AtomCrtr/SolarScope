'use client'

import Link from '@/components/ui/LocaleLink'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const COPY = {
  fr: { badge: 'Erreur 404', title: 'Objet céleste introuvable', text: 'La page demandée n’existe pas ou a changé d’orbite.', home: 'Retour à l’accueil' },
  en: { badge: 'Error 404', title: 'Celestial object not found', text: 'This page does not exist or has changed orbit.', home: 'Back to the home page' },
}

export default function NotFoundContent() {
  const copy = COPY[useSiteLocale()]
  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '8rem', textAlign: 'center' }}>
      <div className="card prose-card" style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="badge">{copy.badge}</p>
        <h1 className="section-title">{copy.title}</h1>
        <p>{copy.text}</p>
        <Link className="btn-primary" href="/">{copy.home}</Link>
      </div>
    </div>
  )
}
