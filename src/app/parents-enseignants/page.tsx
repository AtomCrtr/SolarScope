import type { Metadata } from 'next'
import Link from 'next/link'
import PrintableGuidesButton from '@/components/learning/PrintableGuidesButton'
import { createPageMetadata } from '@/lib/config/site'

export const metadata: Metadata = createPageMetadata(
  'Parents et enseignants',
  'Repères pour accompagner les enfants dans SolarScope.',
  '/parents-enseignants',
)

const GUIDES = [
  { title: 'Planètes', age: '8–10 ans', duration: '10 min', href: '/planetes', goal: 'Comparer taille, distance et nombre de lunes.', prompt: 'Demande : quelle planète aimerais-tu visiter ?' },
  { title: 'Mars', age: '8–12 ans', duration: '15 min', href: '/mars', goal: 'Comprendre les rovers, l’eau ancienne et la prudence scientifique.', prompt: 'Demande : quel outil donnerais-tu à un rover ?' },
  { title: 'ISS', age: '8–12 ans', duration: '10 min', href: '/iss', goal: 'Expliquer l’orbite et l’impression de flottement.', prompt: 'Essaie la comparaison de l’ascenseur en chute libre.' },
  { title: 'Quiz', age: '8–12 ans', duration: '5–15 min', href: '/quiz', goal: 'Réviser sans note ni classement public.', prompt: 'Lis ensemble l’explication après chaque réponse.' },
]

export default function ParentsTeachersPage() {
  return <div className="container prose-page parent-page"><header className="page-header"><div className="badge">👨‍👩‍👧‍👦 ACCOMPAGNER</div><h1 className="page-title gradient-text">Parents et enseignants</h1><p className="page-subtitle">Des repères simples pour explorer l’espace avec un enfant, sans compte et sans collecte de données personnelles.</p></header>
    <section className="parent-intro card"><h2>Comment utiliser SolarScope</h2><ol><li>Choisissez une mission courte plutôt que de tout parcourir.</li><li>Commencez par la question et l’analogie, puis ouvrez les détails seulement si l’enfant est curieux.</li><li>Terminez par le défi ou une discussion ; se tromper au quiz fait partie de l’apprentissage.</li></ol></section>
    <section aria-labelledby="guide-title"><div className="parent-guide-heading"><h2 id="guide-title" className="parent-section-title">Fiches express</h2><PrintableGuidesButton /></div><div className="parent-guide-grid">{GUIDES.map(({ title, age, duration, href, goal, prompt }) => <article className="card parent-guide" key={title}><div><span>{age}</span><span>{duration}</span></div><h3>{title}</h3><p><strong>Objectif :</strong> {goal}</p><p><strong>À demander :</strong> {prompt}</p><Link href={href} className="parent-guide-link">Ouvrir la mission <span aria-hidden="true">→</span></Link></article>)}</div></section>
    <section className="parent-intro card"><h2>Données, publicité et sécurité</h2><p>Le passeport spatial est enregistré seulement dans le navigateur de l’appareil. SolarScope ne crée pas de profil enfant. Les données scientifiques viennent de sources affichées dans les pages ; leur fraîcheur peut varier et une valeur indisponible doit être comprise comme telle.</p><p>SolarBot rappelle de ne pas partager de nom, école, adresse, téléphone ou e-mail. Pour une information importante, vérifiez toujours la source scientifique liée.</p></section>
  </div>
}
