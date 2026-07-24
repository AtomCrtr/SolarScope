import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Parents et enseignants', description: 'Repères pour accompagner les enfants dans SolarScope.' }

const GUIDES = [
  ['Planètes', '8–10 ans', '10 min', 'Comparer taille, distance et nombre de lunes.', 'Demande : quelle planète aimerais-tu visiter ?'],
  ['Mars', '8–12 ans', '15 min', 'Comprendre les rovers, l’eau ancienne et la prudence scientifique.', 'Demande : quel outil donnerais-tu à un rover ?'],
  ['ISS', '8–12 ans', '10 min', 'Expliquer l’orbite et l’impression de flottement.', 'Essaie la comparaison de l’ascenseur en chute libre.'],
  ['Quiz', '8–12 ans', '5–15 min', 'Réviser sans note ni classement public.', 'Lis ensemble l’explication après chaque réponse.'],
]

export default function ParentsTeachersPage() {
  return <div className="container prose-page parent-page"><header className="page-header"><div className="badge">👨‍👩‍👧‍👦 ACCOMPAGNER</div><h1 className="page-title gradient-text">Parents et enseignants</h1><p className="page-subtitle">Des repères simples pour explorer l’espace avec un enfant, sans compte et sans collecte de données personnelles.</p></header>
    <section className="parent-intro card"><h2>Comment utiliser SolarScope</h2><ol><li>Choisissez une mission courte plutôt que de tout parcourir.</li><li>Commencez par la question et l’analogie, puis ouvrez les détails seulement si l’enfant est curieux.</li><li>Terminez par le défi ou une discussion ; se tromper au quiz fait partie de l’apprentissage.</li></ol></section>
    <section aria-labelledby="guide-title"><h2 id="guide-title" className="parent-section-title">Fiches express</h2><div className="parent-guide-grid">{GUIDES.map(([title, age, duration, goal, prompt]) => <article className="card parent-guide" key={title}><div><span>{age}</span><span>{duration}</span></div><h3>{title}</h3><p><strong>Objectif :</strong> {goal}</p><p><strong>À demander :</strong> {prompt}</p></article>)}</div></section>
    <section className="parent-intro card"><h2>Données, publicité et sécurité</h2><p>Le passeport spatial est enregistré seulement dans le navigateur de l’appareil. SolarScope ne crée pas de profil enfant. Les données scientifiques viennent de sources affichées dans les pages ; leur fraîcheur peut varier et une valeur indisponible doit être comprise comme telle.</p><p>SolarBot rappelle de ne pas partager de nom, école, adresse, téléphone ou e-mail. Pour une information importante, vérifiez toujours la source scientifique liée.</p></section>
  </div>
}
