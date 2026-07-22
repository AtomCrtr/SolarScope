import type { Metadata } from 'next'
import Link from 'next/link'
import { createPageMetadata } from '@/lib/site'

export const metadata: Metadata = createPageMetadata(
  'Confidentialité',
  'Comment SolarScope utilise la géolocalisation, les services scientifiques externes et le stockage local.',
  '/confidentialite',
)

export default function PrivacyPage() {
  return (
    <div className="container prose-page">
      <header className="page-header">
        <div className="badge">CONFIDENTIALITÉ</div>
        <h1 className="page-title">Vos données restent sous votre contrôle</h1>
        <p className="page-subtitle">
          SolarScope ne crée pas de compte utilisateur et ne vend aucune donnée personnelle.
        </p>
      </header>

      <section className="card prose-card">
        <h2>Géolocalisation</h2>
        <p>
          La page « Ciel ce soir » demande votre autorisation avant d’accéder à votre position. Les coordonnées
          sont arrondies avant d’être transmises à Nominatim et Stellarium afin d’afficher une ville approximative
          et le ciel correspondant. Elles ne sont ni enregistrées par SolarScope ni associées à un profil.
        </p>

        <h2>Services externes</h2>
        <p>
          Certaines pages interrogent des services scientifiques de la NASA, de la NOAA, de l’ESA, de
          The Space Devs et de Where The ISS At. Ces fournisseurs peuvent recevoir les informations techniques
          habituelles d’une requête web, notamment l’adresse IP.
        </p>

        <h2>Stockage local et intelligence artificielle</h2>
        <p>
          Le thème clair ou sombre est mémorisé uniquement dans votre navigateur. Les questions adressées à
          SolarBot sont envoyées au service Gemini de Google pour produire une réponse, sans être conservées
          dans une base de données SolarScope.
        </p>

        <p><Link href="/">← Retour à l’accueil</Link></p>
      </section>
    </div>
  )
}
