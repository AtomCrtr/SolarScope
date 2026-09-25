import type { MissionId } from '@/lib/client/local-progress'
import { ENGLISH_EXTRA_CHECKS, EXTRA_CHECKS } from './mission-checks-extra'

export type MissionCheck = {
  question: string
  choices: [string, string, string]
  answer: 0 | 1 | 2
  /** Shown after a wrong answer, so the child learns before trying again. */
  explanation: string
}

export type CheckedMission = Exclude<MissionId, 'quiz'>
type Checks = Record<CheckedMission, MissionCheck>

// Questions answered with what the lesson card says. The quiz mission is stamped by the quiz itself.
const FIRST_CHECKS: Checks = {
  soleil: {
    question: 'Qu’est-ce que le Soleil ?',
    choices: ['Une planète très chaude', 'Une étoile', 'Une lune géante'],
    answer: 1,
    explanation: 'Le Soleil est une étoile : une immense boule de gaz très chaud qui fabrique sa propre lumière.',
  },
  planetes: {
    question: 'Combien de planètes tournent autour du Soleil ?',
    choices: ['Huit', 'Neuf', 'Douze'],
    answer: 0,
    explanation: 'Il y en a huit : quatre rocheuses près du Soleil et quatre géantes plus loin. Pluton est une planète naine.',
  },
  mars: {
    question: 'Pourquoi Mars est-elle rouge ?',
    choices: ['Elle est brûlante', 'Elle reflète le coucher du Soleil', 'Sa poussière contient de la rouille'],
    answer: 2,
    explanation: 'Le fer du sol martien a réagi avec l’oxygène et formé une poussière couleur rouille.',
  },
  asteroides: {
    question: 'Un astéroïde « proche de la Terre » va-t-il forcément la frapper ?',
    choices: ['Oui, toujours', 'Non : il peut passer à des millions de kilomètres', 'Oui, s’il est très gros'],
    answer: 1,
    explanation: '« Proche » peut vouloir dire plusieurs millions de kilomètres. Les scientifiques calculent les trajectoires longtemps à l’avance.',
  },
  meteorites: {
    question: 'Comment s’appelle une pierre de l’espace retrouvée au sol ?',
    choices: ['Un météore', 'Une comète', 'Une météorite'],
    answer: 2,
    explanation: 'Dans l’espace, c’est un météoroïde ; la traînée lumineuse est un météore ; le morceau retrouvé au sol est une météorite.',
  },
  iss: {
    question: 'Pourquoi les astronautes flottent-ils dans l’ISS ?',
    choices: ['Ils tombent en même temps que la station', 'Il n’y a pas de gravité là-haut', 'La station est remplie d’eau'],
    answer: 0,
    explanation: 'La gravité est encore forte à 400 km d’altitude. La station et les astronautes tombent ensemble autour de la Terre : ils ont l’impression de flotter.',
  },
  missions: {
    question: 'Pourquoi envoie-t-on souvent des robots dans l’espace ?',
    choices: ['Ils coûtent toujours plus cher que les humains', 'Ils voyagent loin et supportent les endroits dangereux', 'Les humains n’ont pas le droit de quitter la Terre'],
    answer: 1,
    explanation: 'Les robots peuvent voyager très loin, travailler des années et supporter le froid, la chaleur ou les radiations.',
  },
  jwst: {
    question: 'Quelle lumière le télescope Webb observe-t-il surtout ?',
    choices: ['L’infrarouge', 'Les rayons X', 'La lumière des lampadaires'],
    answer: 0,
    explanation: 'Webb observe surtout l’infrarouge, une lumière invisible pour nos yeux, souvent liée à la chaleur.',
  },
  ciel: {
    question: 'Pourquoi les étoiles semblent-elles bouger pendant la nuit ?',
    choices: ['Parce que les étoiles tombent', 'Parce que la Lune les pousse', 'Parce que la Terre tourne sur elle-même'],
    answer: 2,
    explanation: 'C’est la Terre qui tourne : au fil des heures, nous regardons dans d’autres directions de l’espace.',
  },
  'photo-du-jour': {
    question: 'Les couleurs d’une image de télescope sont-elles toujours celles que verraient nos yeux ?',
    choices: ['Oui, toujours', 'Non : certaines représentent une lumière invisible', 'Non : elles sont choisies au hasard'],
    answer: 1,
    explanation: 'Les télescopes captent parfois des lumières invisibles. Les scientifiques leur donnent des couleurs, en expliquant leur méthode.',
  },
  exoplanetes: {
    question: 'Qu’est-ce qu’une exoplanète ?',
    choices: ['Une planète qui a explosé', 'Une planète sans atmosphère', 'Une planète qui tourne autour d’une autre étoile que le Soleil'],
    answer: 2,
    explanation: 'Une exoplanète se trouve en dehors de notre Système solaire, autour d’une autre étoile.',
  },
  actualites: {
    question: 'Qu’est-ce qui rend une actualité spatiale fiable ?',
    choices: ['Une source, une date et des preuves', 'Un titre très impressionnant', 'Beaucoup de partages'],
    answer: 0,
    explanation: 'Une information fiable dit qui l’a publiée, quand, et d’où viennent les preuves.',
  },
  solarbot: {
    question: 'Quelle information ne faut-il jamais donner à SolarBot ?',
    choices: ['Ta planète préférée', 'Ton adresse', 'Ta question sur Mars'],
    answer: 1,
    explanation: 'Ne donne jamais ton nom complet, ton adresse ou ton école. SolarBot n’en a pas besoin pour te répondre.',
  },
}

const ENGLISH_FIRST_CHECKS: Checks = {
  soleil: {
    question: 'What is the Sun?',
    choices: ['A very hot planet', 'A star', 'A giant moon'],
    answer: 1,
    explanation: 'The Sun is a star: a huge ball of very hot gas that makes its own light.',
  },
  planetes: {
    question: 'How many planets travel around the Sun?',
    choices: ['Eight', 'Nine', 'Twelve'],
    answer: 0,
    explanation: 'There are eight: four rocky ones near the Sun and four giants farther away. Pluto is a dwarf planet.',
  },
  mars: {
    question: 'Why is Mars red?',
    choices: ['It is burning hot', 'It reflects the sunset', 'Its dust contains rust'],
    answer: 2,
    explanation: 'The iron in the Martian soil reacted with oxygen and made rust-coloured dust.',
  },
  asteroides: {
    question: 'Will an asteroid “near Earth” always hit it?',
    choices: ['Yes, always', 'No: it can pass millions of kilometres away', 'Yes, if it is very big'],
    answer: 1,
    explanation: '“Near” can mean several million kilometres. Scientists work out asteroid paths long in advance.',
  },
  meteorites: {
    question: 'What do we call a space rock found on the ground?',
    choices: ['A meteor', 'A comet', 'A meteorite'],
    answer: 2,
    explanation: 'In space it is a meteoroid; the bright streak is a meteor; the piece found on the ground is a meteorite.',
  },
  iss: {
    question: 'Why do astronauts float inside the ISS?',
    choices: ['They fall together with the station', 'There is no gravity up there', 'The station is full of water'],
    answer: 0,
    explanation: 'Gravity is still strong 400 km up. The station and the astronauts fall around Earth together, so they feel as if they float.',
  },
  missions: {
    question: 'Why do we often send robots into space?',
    choices: ['They always cost more than people', 'They travel far and survive dangerous places', 'People are not allowed to leave Earth'],
    answer: 1,
    explanation: 'Robots can travel very far, work for years and survive cold, heat or radiation.',
  },
  jwst: {
    question: 'Which light does the Webb telescope mainly observe?',
    choices: ['Infrared', 'X-rays', 'Street-lamp light'],
    answer: 0,
    explanation: 'Webb mainly observes infrared, a light our eyes cannot see, often linked to heat.',
  },
  ciel: {
    question: 'Why do the stars seem to move during the night?',
    choices: ['Because the stars are falling', 'Because the Moon pushes them', 'Because the Earth spins'],
    answer: 2,
    explanation: 'The Earth spins: as the hours pass, we look towards different directions in space.',
  },
  'photo-du-jour': {
    question: 'Do the colours of a telescope picture always show what our eyes would see?',
    choices: ['Yes, always', 'No: some stand for light we cannot see', 'No: they are chosen at random'],
    answer: 1,
    explanation: 'Telescopes sometimes capture invisible light. Scientists give it colours and explain how they did it.',
  },
  exoplanetes: {
    question: 'What is an exoplanet?',
    choices: ['A planet that exploded', 'A planet with no atmosphere', 'A planet that travels around a star other than the Sun'],
    answer: 2,
    explanation: 'An exoplanet is outside our Solar System, around another star.',
  },
  actualites: {
    question: 'What makes space news reliable?',
    choices: ['A source, a date and evidence', 'A very exciting headline', 'Lots of shares'],
    answer: 0,
    explanation: 'Reliable information says who published it, when, and where the evidence comes from.',
  },
  solarbot: {
    question: 'Which information should you never give SolarBot?',
    choices: ['Your favourite planet', 'Your address', 'Your question about Mars'],
    answer: 1,
    explanation: 'Never give your full name, your address or your school. SolarBot does not need them to answer you.',
  },
}

function combine(first: Checks, extra: Record<string, MissionCheck[]>): Record<CheckedMission, MissionCheck[]> {
  return Object.fromEntries(
    (Object.keys(first) as CheckedMission[]).map(mission => [mission, [first[mission], ...extra[mission]]]),
  ) as Record<CheckedMission, MissionCheck[]>
}

/** Three questions per lesson; the stamp needs two of them, drawn at random. */
export const MISSION_CHECKS = combine(FIRST_CHECKS, EXTRA_CHECKS)
export const ENGLISH_MISSION_CHECKS = combine(ENGLISH_FIRST_CHECKS, ENGLISH_EXTRA_CHECKS)
export const QUESTIONS_PER_STAMP = 2
