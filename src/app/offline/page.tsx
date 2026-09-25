import type { Metadata } from 'next'
import Link from '@/components/ui/LocaleLink'

export const metadata: Metadata = {
  title: 'Hors connexion · Offline',
  robots: { index: false, follow: false },
  alternates: { canonical: null },
}

// Served by the offline worker for both languages, so it speaks both.
export default function OfflinePage() {
  return (
    <div className="container prose-page">
      <section className="card prose-card" role="status">
        <div className="badge">MODE HORS CONNEXION</div>
        <h1 className="page-title">La liaison avec l’espace est interrompue.</h1>
        <p>
          Vérifie ta connexion puis réessaie. Les pages déjà visitées peuvent rester accessibles sur cet appareil.
        </p>
        <p><Link href="/" className="btn-primary">Réessayer depuis l’accueil</Link></p>
      </section>
      <section className="card prose-card" lang="en" style={{ marginTop: '1rem' }}>
        <h2>The link with space is down.</h2>
        <p>Check your connection and try again. Pages you already visited may still work on this device.</p>
        <p><a href="/en" className="btn-ghost">Try again from the home page</a></p>
      </section>
    </div>
  )
}
