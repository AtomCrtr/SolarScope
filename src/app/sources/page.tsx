import type { Metadata } from 'next'
import Link from 'next/link'
import { SCIENTIFIC_SOURCES, formatCheckedOn } from '@/lib/data/source-registry'
import { createPageMetadata } from '@/lib/config/site'

export const metadata: Metadata = createPageMetadata(
  'Données et sources',
  'Les sources scientifiques, leur fraîcheur et les règles de présentation des données SolarScope.',
  '/sources',
)

export default function SourcesPage() {
  const sources = Object.values(SCIENTIFIC_SOURCES)

  return (
    <div className="container prose-page sources-page">
      <header className="page-header">
        <div className="badge">🔎 DONNÉES EXPLIQUÉES</div>
        <h1 className="page-title gradient-text">Comment savons-nous cela ?</h1>
        <p className="page-subtitle">Chaque chiffre important indique sa source, son type et sa dernière vérification.</p>
      </header>

      <section className="card prose-card">
        <h2>Deux sortes de données</h2>
        <p><strong>Les faits de référence</strong> — taille d’une planète, durée d’une année — changent rarement. Ils sont présentés comme des valeurs moyennes.</p>
        <p><strong>Les données en direct</strong> — position de l’ISS, météo solaire — peuvent changer en quelques minutes. SolarScope affiche alors une heure de mise à jour ou le mot « indisponible » si le service ne répond pas.</p>
      </section>

      <section aria-labelledby="source-list-title">
        <h2 id="source-list-title" className="parent-section-title">Sources suivies</h2>
        <div className="sources-grid">
          {sources.map(source => (
            <article className="card source-card" key={source.id}>
              <span className={source.cadence === 'live' ? 'source-kind is-live' : 'source-kind'}>
                {source.cadence === 'live' ? 'Mise à jour' : 'Référence'}
              </span>
              <h3>{source.label}</h3>
              <p>{source.childNote}</p>
              <p className="source-checked">Vérifiée le <time dateTime={source.checkedOn}>{formatCheckedOn(source.checkedOn)}</time></p>
              <a href={source.href} target="_blank" rel="noopener noreferrer">Voir la source ↗</a>
            </article>
          ))}
        </div>
      </section>

      <section className="card prose-card">
        <h2>Une donnée absente n’est pas inventée</h2>
        <p>Lorsqu’une source en direct est temporairement indisponible, SolarScope préfère l’indiquer clairement. Cela évite de faire passer une ancienne valeur ou une estimation pour une observation actuelle.</p>
        <p><Link href="/parents-enseignants">← Conseils pour les parents et enseignants</Link></p>
      </section>
    </div>
  )
}
