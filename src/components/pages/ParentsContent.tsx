import Link from '@/components/ui/LocaleLink'
import SpaceIcon from '@/components/ui/SpaceIcon'
import PrintableGuidesButton from '@/components/learning/PrintableGuidesButton'
import type { SiteLocale } from '@/lib/i18n/paths'

const COPY = {
  fr: {
    badge: 'ACCOMPAGNER',
    title: 'Parents et enseignants',
    subtitle: 'Des repères simples pour explorer l’espace avec un enfant, sans compte et sans collecte de données personnelles.',
    howTitle: 'Comment utiliser SolarScope',
    how: [
      'Choisissez une mission courte plutôt que de tout parcourir.',
      'Commencez par la question et l’analogie, puis ouvrez les détails seulement si l’enfant est curieux.',
      'Terminez par les deux questions qui donnent le tampon, ou par une discussion ; se tromper fait partie de l’apprentissage.',
    ],
    guidesTitle: 'Fiches express',
    goal: 'Objectif',
    ask: 'À demander',
    open: 'Ouvrir la mission',
    guides: [
      { title: 'Planètes', age: '8–10 ans', duration: '10 min', href: '/planetes', goal: 'Comparer taille, distance et nombre de lunes.', prompt: 'Quelle planète aimerais-tu visiter ?' },
      { title: 'Mars', age: '8–12 ans', duration: '15 min', href: '/mars', goal: 'Comprendre les rovers, l’eau ancienne et la prudence scientifique.', prompt: 'Quel outil donnerais-tu à un rover ?' },
      { title: 'ISS', age: '8–12 ans', duration: '10 min', href: '/iss', goal: 'Expliquer l’orbite et l’impression de flottement.', prompt: 'Essaie la comparaison de l’ascenseur en chute libre.' },
      { title: 'Ciel ce soir', age: '6–12 ans', duration: '20 min, le soir', href: '/ciel', goal: 'Repérer la Lune, une planète ou l’ISS, puis les noter dans le carnet d’observation.', prompt: 'Qu’est-ce qui bouge dans le ciel, et qu’est-ce qui reste en place ?' },
      { title: 'Quiz', age: '8–12 ans', duration: '5–15 min', href: '/quiz', goal: 'Réviser sans note ni classement public.', prompt: 'Lis ensemble l’explication après chaque réponse.' },
    ],
    safetyTitle: 'Données, publicité et sécurité',
    safety: [
      'Le passeport spatial est enregistré seulement dans le navigateur de l’appareil. SolarScope ne crée pas de profil enfant. Pour continuer sur un autre appareil, un code de 9 caractères suffit, sans compte. Les données scientifiques viennent de sources affichées dans les pages ; leur fraîcheur peut varier et une valeur indisponible doit être comprise comme telle.',
      'SolarBot rappelle de ne pas partager de nom, école, adresse, téléphone ou e-mail. Pour une information importante, vérifiez toujours la source scientifique liée.',
    ],
  },
  en: {
    badge: 'GUIDANCE',
    title: 'Parents and teachers',
    subtitle: 'Simple tips to explore space with a child, with no account and no personal data collected.',
    howTitle: 'How to use SolarScope',
    how: [
      'Pick one short mission rather than going through everything.',
      'Start with the question and the comparison, then open the details only if the child is curious.',
      'Finish with the two questions that earn the stamp, or with a chat; making mistakes is part of learning.',
    ],
    guidesTitle: 'Quick guides',
    goal: 'Goal',
    ask: 'Ask',
    open: 'Open the mission',
    guides: [
      { title: 'Planets', age: 'Ages 8–10', duration: '10 min', href: '/planetes', goal: 'Compare size, distance and number of moons.', prompt: 'Which planet would you like to visit?' },
      { title: 'Mars', age: 'Ages 8–12', duration: '15 min', href: '/mars', goal: 'Understand rovers, ancient water and scientific caution.', prompt: 'Which tool would you give a rover?' },
      { title: 'ISS', age: 'Ages 8–12', duration: '10 min', href: '/iss', goal: 'Explain orbits and why astronauts seem to float.', prompt: 'Try the falling lift comparison.' },
      { title: 'Tonight’s sky', age: 'Ages 6–12', duration: '20 min, in the evening', href: '/ciel', goal: 'Spot the Moon, a planet or the ISS, then tick them in the stargazing logbook.', prompt: 'What moves in the sky, and what stays in place?' },
      { title: 'Quiz', age: 'Ages 8–12', duration: '5–15 min', href: '/quiz', goal: 'Revise with no marks and no public ranking.', prompt: 'Read the explanation together after each answer.' },
    ],
    safetyTitle: 'Data, advertising and safety',
    safety: [
      'The space passport is saved only in the device’s browser. SolarScope creates no child profile. To carry on on another device, a 9-character code is enough, with no account. Scientific data comes from the sources shown on each page; how fresh it is may vary, and an unavailable value should be understood as such.',
      'SolarBot reminds children not to share their name, school, address, phone number or email. For important information, always check the linked scientific source.',
    ],
  },
}

export default function ParentsContent({ locale }: { locale: SiteLocale }) {
  const copy = COPY[locale]
  return (
    <div className="container prose-page parent-page">
      <header className="page-header">
        <div className="badge"><SpaceIcon name="family" size={18} className="inline-icon" /> {copy.badge}</div>
        <h1 className="page-title">{copy.title}</h1>
        <p className="page-subtitle">{copy.subtitle}</p>
      </header>

      <section className="parent-intro card">
        <h2>{copy.howTitle}</h2>
        <ol>{copy.how.map(step => <li key={step}>{step}</li>)}</ol>
      </section>

      <section aria-labelledby="guide-title">
        <div className="parent-guide-heading">
          <h2 id="guide-title" className="parent-section-title">{copy.guidesTitle}</h2>
          <PrintableGuidesButton />
        </div>
        <div className="parent-guide-grid">
          {copy.guides.map(({ title, age, duration, href, goal, prompt }) => (
            <article className="card parent-guide" key={title}>
              <div className="parent-guide-meta"><span>{age}</span><span>{duration}</span></div>
              <h3>{title}</h3>
              <dl className="parent-guide-details">
                <div className="parent-guide-detail"><dt>{copy.goal}</dt><dd>{goal}</dd></div>
                <div className="parent-guide-detail"><dt>{copy.ask}</dt><dd>{prompt}</dd></div>
              </dl>
              <Link href={href} className="parent-guide-link">{copy.open} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="parent-intro card parent-safety">
        <h2>{copy.safetyTitle}</h2>
        {copy.safety.map(paragraph => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
      </section>
    </div>
  )
}
