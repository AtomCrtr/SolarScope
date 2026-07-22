import Link from 'next/link'
import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata(
  'Page introuvable',
  'Cette destination ne fait pas partie de la carte de SolarScope.',
  '/404',
)

export default function NotFound() {
  return (
    <div className="container" style={{ paddingTop: '5rem', paddingBottom: '8rem', textAlign: 'center' }}>
      <div className="card prose-card" style={{ maxWidth: 620, margin: '0 auto' }}>
        <p className="badge">Erreur 404</p>
        <h1 className="section-title">Objet céleste introuvable</h1>
        <p>La page demandée n’existe pas ou a changé d’orbite.</p>
        <Link className="btn-primary" href="/">Retour à l’accueil</Link>
      </div>
    </div>
  )
}
