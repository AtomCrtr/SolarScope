import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="container prose-page">
      <section className="card prose-card" role="status">
        <div className="badge">MODE HORS CONNEXION</div>
        <h1 className="page-title gradient-text">La liaison avec l’espace est interrompue.</h1>
        <p>
          Vérifie ta connexion puis réessaie. Les pages déjà visitées peuvent rester accessibles sur cet appareil.
        </p>
        <p><Link href="/" className="btn-primary">Réessayer depuis l’accueil</Link></p>
      </section>
    </div>
  )
}
