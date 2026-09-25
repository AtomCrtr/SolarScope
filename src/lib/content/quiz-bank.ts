import type { SpaceIconName } from '@/components/ui/SpaceIcon'
import type { SiteLocale } from '@/lib/i18n/paths'

export type QuizQuestion = { question: string; options: string[]; answer: string; explanation: string; icon: SpaceIconName }
export type QuizLevelId = 'beginner' | 'explorer' | 'expert'

type Bank = Record<SiteLocale, QuizQuestion[]>

// Each question exists in both languages at the same index.
const BEGINNER: Bank = {
  fr: [
    { icon: 'planet', question: 'Quelle est la plus grande planète du Système solaire ?', options: ['Saturne', 'Jupiter', 'Neptune', 'Uranus'], answer: 'Jupiter', explanation: 'Jupiter est tellement grande qu’elle pourrait contenir environ 1 300 Terres !' },
    { icon: 'thermometer', question: 'Quelle planète est la plus chaude ?', options: ['Mercure', 'Vénus', 'Mars', 'Jupiter'], answer: 'Vénus', explanation: 'Son atmosphère épaisse piège la chaleur comme une serre géante !' },
    { icon: 'moon-stars', question: 'Combien de lunes a Mars ?', options: ['Zéro', 'Une', 'Deux', 'Cinq'], answer: 'Deux', explanation: 'Phobos (la peur) et Déimos (la terreur) : deux petites lunes rocheuses !' },
    { icon: 'planet', question: 'Quelle planète a les plus grands anneaux ?', options: ['Jupiter', 'Uranus', 'Saturne', 'Neptune'], answer: 'Saturne', explanation: 'Les anneaux de Saturne s’étendent sur environ 282 000 km, mais ils ne font souvent qu’une dizaine de mètres d’épaisseur !' },
    { icon: 'sun', question: 'Le Soleil est-il une étoile ?', options: ['Oui', 'Non', 'On ne sait pas'], answer: 'Oui', explanation: 'Le Soleil est une étoile de type « naine jaune », comme des milliards d’autres dans l’Univers !' },
    { icon: 'planet', question: 'Combien de planètes compte le Système solaire ?', options: ['7', '8', '9', '12'], answer: '8', explanation: 'Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus et Neptune !' },
  ],
  en: [
    { icon: 'planet', question: 'What is the biggest planet in the Solar System?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], answer: 'Jupiter', explanation: 'Jupiter is so big it could hold about 1,300 Earths!' },
    { icon: 'thermometer', question: 'Which planet is the hottest?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], answer: 'Venus', explanation: 'Its thick atmosphere traps heat like a giant greenhouse!' },
    { icon: 'moon-stars', question: 'How many moons does Mars have?', options: ['None', 'One', 'Two', 'Five'], answer: 'Two', explanation: 'Phobos (fear) and Deimos (dread): two small rocky moons!' },
    { icon: 'planet', question: 'Which planet has the biggest rings?', options: ['Jupiter', 'Uranus', 'Saturn', 'Neptune'], answer: 'Saturn', explanation: 'Saturn’s rings stretch over about 282,000 km, but they are often only about ten metres thick!' },
    { icon: 'sun', question: 'Is the Sun a star?', options: ['Yes', 'No', 'Nobody knows'], answer: 'Yes', explanation: 'The Sun is a “yellow dwarf” star, like billions of others in the Universe!' },
    { icon: 'planet', question: 'How many planets are there in the Solar System?', options: ['7', '8', '9', '12'], answer: '8', explanation: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune!' },
  ],
}

const EXPLORER: Bank = {
  fr: [
    { icon: 'meteorite', question: 'Qu’est-ce qu’une étoile filante ?', options: ['Une étoile qui tombe', 'Un petit objet qui chauffe dans l’air', 'Un satellite', 'Une planète lointaine'], answer: 'Un petit objet qui chauffe dans l’air', explanation: 'Un petit objet venu de l’espace chauffe en traversant l’atmosphère : la traînée lumineuse est un météore.' },
    { icon: 'sun', question: 'Combien de temps met la lumière du Soleil pour arriver sur Terre ?', options: ['8 secondes', '8 minutes', '8 heures', '8 jours'], answer: '8 minutes', explanation: 'La lumière voyage à 300 000 km/s et le Soleil est à 150 millions de km !' },
    { icon: 'mountain', question: 'Quel est le plus grand volcan du Système solaire ?', options: ['L’Etna', 'Olympus Mons', 'Le Mauna Kea', 'Le Vésuve'], answer: 'Olympus Mons', explanation: 'Olympus Mons, sur Mars, mesure environ 21 km de haut : à peu près 2,5 fois l’Everest !' },
    { icon: 'planet', question: 'De quoi sont faits les anneaux de Saturne ?', options: ['De gaz', 'De glace et de roche', 'De poussière', 'De métal'], answer: 'De glace et de roche', explanation: 'Des milliards de morceaux, du grain de sable à la taille d’une maison !' },
    { icon: 'mars', question: 'Quelle agence a envoyé Perseverance sur Mars ?', options: ['ESA', 'NASA', 'Roscosmos', 'CNSA'], answer: 'NASA', explanation: 'Perseverance s’est posé sur Mars en février 2021 avec son hélicoptère Ingenuity !' },
    { icon: 'bulb', question: 'Qu’est-ce qu’une année-lumière ?', options: ['Une durée', 'Une distance', 'La luminosité d’une étoile', 'Un type d’étoile'], answer: 'Une distance', explanation: 'C’est la distance que la lumière parcourt en un an : environ 9 460 milliards de km !' },
  ],
  en: [
    { icon: 'meteorite', question: 'What is a shooting star?', options: ['A falling star', 'A small object heating up in the air', 'A satellite', 'A faraway planet'], answer: 'A small object heating up in the air', explanation: 'A small object from space heats up as it crosses the atmosphere: the bright streak is a meteor.' },
    { icon: 'sun', question: 'How long does sunlight take to reach Earth?', options: ['8 seconds', '8 minutes', '8 hours', '8 days'], answer: '8 minutes', explanation: 'Light travels at 300,000 km/s and the Sun is 150 million km away!' },
    { icon: 'mountain', question: 'What is the biggest volcano in the Solar System?', options: ['Etna', 'Olympus Mons', 'Mauna Kea', 'Vesuvius'], answer: 'Olympus Mons', explanation: 'Olympus Mons, on Mars, is about 21 km high: roughly 2.5 times Everest!' },
    { icon: 'planet', question: 'What are Saturn’s rings made of?', options: ['Gas', 'Ice and rock', 'Dust', 'Metal'], answer: 'Ice and rock', explanation: 'Billions of pieces, from grains of sand to the size of a house!' },
    { icon: 'mars', question: 'Which agency sent Perseverance to Mars?', options: ['ESA', 'NASA', 'Roscosmos', 'CNSA'], answer: 'NASA', explanation: 'Perseverance landed on Mars in February 2021 with its Ingenuity helicopter!' },
    { icon: 'bulb', question: 'What is a light-year?', options: ['A length of time', 'A distance', 'How bright a star is', 'A kind of star'], answer: 'A distance', explanation: 'It is the distance light travels in one year: about 9.46 trillion km!' },
  ],
}

const EXPERT: Bank = {
  fr: [
    { icon: 'target', question: 'Dans nos modèles, que signale la singularité d’un trou noir ?', options: ['Une tempête', 'Une limite de nos équations', 'Une nouvelle étoile', 'Une explosion'], answer: 'Une limite de nos équations', explanation: 'La relativité générale y prédit des valeurs infinies. Cela montre surtout que notre modèle ne suffit plus à décrire cette région.' },
    { icon: 'sparkle', question: 'Qu’est-ce que le rayonnement de Hawking ?', options: ['Le fond diffus cosmologique', 'Un rayonnement prédit autour des trous noirs', 'Les rayons d’une supernova', 'La lumière de Mars'], answer: 'Un rayonnement prédit autour des trous noirs', explanation: 'Stephen Hawking a prédit que des effets quantiques permettent aux trous noirs de perdre très lentement de l’énergie.' },
    { icon: 'planet', question: 'Environ combien de temps sépare deux oppositions de Jupiter vues depuis la Terre ?', options: ['399 jours', '780 jours', '116 jours', '687 jours'], answer: '399 jours', explanation: 'C’est la période synodique de Jupiter. Une opposition a lieu quand Jupiter se trouve à l’opposé du Soleil dans notre ciel.' },
    { icon: 'sun', question: 'Quelle est la température au cœur du Soleil ?', options: ['6 000 °C', '150 000 °C', '15 millions °C', '1 milliard °C'], answer: '15 millions °C', explanation: 'La fusion nucléaire a besoin d’une température énorme : environ 15 millions de degrés au cœur !' },
    { icon: 'sparkle', question: 'Qu’est-ce que le décalage vers le rouge ?', options: ['La couleur de Mars', 'L’allongement de la lumière d’une source qui s’éloigne', 'L’énergie d’une supernova', 'La couleur des étoiles froides'], answer: 'L’allongement de la lumière d’une source qui s’éloigne', explanation: 'L’Univers est en expansion : plus une galaxie est loin, plus sa lumière est décalée vers le rouge (loi de Hubble-Lemaître).' },
  ],
  en: [
    { icon: 'target', question: 'In our models, what does a black hole’s singularity signal?', options: ['A storm', 'A limit of our equations', 'A new star', 'An explosion'], answer: 'A limit of our equations', explanation: 'General relativity predicts infinite values there. Above all, it shows our model is no longer enough to describe that region.' },
    { icon: 'sparkle', question: 'What is Hawking radiation?', options: ['The cosmic microwave background', 'Radiation predicted around black holes', 'The rays of a supernova', 'The light of Mars'], answer: 'Radiation predicted around black holes', explanation: 'Stephen Hawking predicted that quantum effects let black holes lose energy very slowly.' },
    { icon: 'planet', question: 'About how long is there between two oppositions of Jupiter seen from Earth?', options: ['399 days', '780 days', '116 days', '687 days'], answer: '399 days', explanation: 'This is Jupiter’s synodic period. An opposition happens when Jupiter sits opposite the Sun in our sky.' },
    { icon: 'sun', question: 'What is the temperature in the core of the Sun?', options: ['6,000 °C', '150,000 °C', '15 million °C', '1 billion °C'], answer: '15 million °C', explanation: 'Nuclear fusion needs a huge temperature: about 15 million degrees in the core!' },
    { icon: 'sparkle', question: 'What is redshift?', options: ['The colour of Mars', 'The stretching of light from a source moving away', 'The energy of a supernova', 'The colour of cool stars'], answer: 'The stretching of light from a source moving away', explanation: 'The Universe is expanding: the farther away a galaxy is, the more its light is shifted towards red (Hubble-Lemaître law).' },
  ],
}

export const QUIZ_LEVELS: Array<{ id: QuizLevelId; icon: SpaceIconName; label: Record<SiteLocale, string>; ages: Record<SiteLocale, string>; color: string; bank: Bank }> = [
  { id: 'beginner', icon: 'child', label: { fr: 'Débutant', en: 'Beginner' }, ages: { fr: '6 à 8 ans', en: 'Ages 6 to 8' }, color: '#34d399', bank: BEGINNER },
  { id: 'explorer', icon: 'compass', label: { fr: 'Explorateur', en: 'Explorer' }, ages: { fr: '9 à 11 ans', en: 'Ages 9 to 11' }, color: '#60a5fa', bank: EXPLORER },
  { id: 'expert', icon: 'telescope', label: { fr: 'Expert', en: 'Expert' }, ages: { fr: '12 ans et plus', en: 'Ages 12 and up' }, color: '#c084fc', bank: EXPERT },
]

export const ANECDOTES: Array<{ icon: SpaceIconName; title: Record<SiteLocale, string>; text: Record<SiteLocale, string> }> = [
  { icon: 'planet', title: { fr: 'Saturne est très légère', en: 'Saturn is very light' }, text: { fr: 'Sa densité moyenne est plus faible que celle de l’eau. Dans une piscine imaginaire assez grande, Saturne flotterait.', en: 'Its average density is lower than water’s. In a big enough imaginary pool, Saturn would float.' } },
  { icon: 'clock', title: { fr: 'Un jour sur Vénus', en: 'A day on Venus' }, text: { fr: 'Vénus tourne si lentement qu’une rotation dure plus longtemps que son année. Elle tourne aussi dans le sens opposé à la plupart des planètes.', en: 'Venus spins so slowly that one turn lasts longer than its year. It also spins the opposite way to most planets.' } },
  { icon: 'moon-stars', title: { fr: 'Des empreintes qui restent', en: 'Footprints that stay' }, text: { fr: 'Les empreintes des astronautes sur la Lune sont toujours là. Sans vent ni pluie, elles peuvent durer des millions d’années.', en: 'The astronauts’ footprints on the Moon are still there. With no wind or rain, they can last millions of years.' } },
  { icon: 'mountain', title: { fr: 'Le plus grand volcan', en: 'The biggest volcano' }, text: { fr: 'Olympus Mons, sur Mars, mesure environ 21 km de haut : à peu près 2,5 fois l’Everest !', en: 'Olympus Mons, on Mars, is about 21 km high: roughly 2.5 times Everest!' } },
  { icon: 'sparkle', title: { fr: 'Une pluie de diamants ?', en: 'Diamond rain?' }, text: { fr: 'Des expériences et des modèles suggèrent que du carbone pourrait former des diamants très loin sous les nuages de Neptune.', en: 'Experiments and models suggest that carbon could form diamonds deep below Neptune’s clouds.' } },
  { icon: 'drop', title: { fr: 'Un océan caché', en: 'A hidden ocean' }, text: { fr: 'Europe, une lune de Jupiter, cache un océan sous sa glace. Il contiendrait peut-être plus d’eau que tous les océans de la Terre !', en: 'Europa, a moon of Jupiter, hides an ocean under its ice. It may hold more water than all of Earth’s oceans!' } },
  { icon: 'mars', title: { fr: 'Mars avait de l’eau', en: 'Mars once had water' }, text: { fr: 'Il y a des milliards d’années, Mars avait des rivières et des lacs, et peut-être un océan.', en: 'Billions of years ago, Mars had rivers and lakes, and maybe an ocean.' } },
  { icon: 'scale', title: { fr: 'Le Soleil perd du poids', en: 'The Sun is losing weight' }, text: { fr: 'Le Soleil transforme environ 4 millions de tonnes de matière en énergie chaque seconde… et il lui reste de quoi briller environ 5 milliards d’années !', en: 'The Sun turns about 4 million tonnes of matter into energy every second… and it still has enough to shine for about 5 billion years!' } },
]

export function quizBank(level: QuizLevelId, locale: SiteLocale): QuizQuestion[] {
  return QUIZ_LEVELS.find(item => item.id === level)!.bank[locale]
}
