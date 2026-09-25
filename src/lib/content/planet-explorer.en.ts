import { PLANET_EXPLORER_PLANETS, type ExplorerPlanet } from './planet-explorer'
import type { SiteLocale } from '@/lib/i18n/paths'

type Translated = Pick<ExplorerPlanet, 'name' | 'kind' | 'description' | 'funFact' | 'focuses' | 'challenge'>

const labels = { identity: 'How to spot it', air: 'Around it', moons: 'Its moons', journey: 'Its journey' }

// English texts for the planet explorer; numbers, colours and textures come from planet-explorer.ts.
const ENGLISH: Record<string, Translated> = {
  mercury: {
    name: 'Mercury', kind: 'Rocky planet',
    description: 'The smallest planet and the closest to the Sun.',
    funFact: 'On Mercury, a day is longer than a year!',
    focuses: {
      identity: { label: labels.identity, text: 'Mercury is the first planet from the Sun.' },
      air: { label: labels.air, text: 'It has almost no atmosphere to keep the heat in.' },
      moons: { label: labels.moons, text: 'Mercury has no moon.' },
      journey: { label: labels.journey, text: 'It goes around the Sun in only 88 Earth days.' },
    },
    challenge: { question: 'Which planet is closest to the Sun?', choices: ['Mercury', 'Mars', 'Neptune'], answer: 'Mercury', explanation: 'Mercury is the first planet of the Solar System.' },
  },
  venus: {
    name: 'Venus', kind: 'Rocky planet',
    description: 'A very hot planet, wrapped in a thick atmosphere.',
    funFact: 'Venus spins the opposite way to most other planets.',
    focuses: {
      identity: { label: labels.identity, text: 'Venus is almost as big as Earth.' },
      air: { label: labels.air, text: 'Its very thick atmosphere holds in a lot of heat.' },
      moons: { label: labels.moons, text: 'Venus has no moon.' },
      journey: { label: labels.journey, text: 'A year on Venus lasts 225 Earth days.' },
    },
    challenge: { question: 'Which planet is the hottest?', choices: ['Venus', 'Mercury', 'Mars'], answer: 'Venus', explanation: 'Its thick atmosphere works like a huge warm blanket.' },
  },
  earth: {
    name: 'Earth', kind: 'Rocky planet',
    description: 'Our home: the only planet where we know life exists.',
    funFact: 'About 71% of Earth’s surface is covered with water.',
    focuses: {
      identity: { label: labels.identity, text: 'Earth is the third planet from the Sun.' },
      air: { label: labels.air, text: 'Its atmosphere holds the air we breathe and protects life.' },
      moons: { label: labels.moons, text: 'Earth has one moon: the Moon.' },
      journey: { label: labels.journey, text: 'Earth goes around the Sun in about 365 days.' },
    },
    challenge: { question: 'How many moons does Earth have?', choices: ['1', '2', '0'], answer: '1', explanation: 'Our planet has a single moon, called the Moon.' },
  },
  mars: {
    name: 'Mars', kind: 'Rocky planet',
    description: 'The red planet, explored by several robots.',
    funFact: 'Mars is home to Olympus Mons, the biggest known volcano in the Solar System.',
    focuses: {
      identity: { label: labels.identity, text: 'Mars is red because of iron-rich dust that looks like rust.' },
      air: { label: labels.air, text: 'Its atmosphere is very thin and made mostly of carbon dioxide.' },
      moons: { label: labels.moons, text: 'Mars has two small moons: Phobos and Deimos.' },
      journey: { label: labels.journey, text: 'A year on Mars lasts 687 Earth days.' },
    },
    challenge: { question: 'Why does Mars look red?', choices: ['Because of iron-rich dust', 'Because of its oceans', 'Because of its rings'], answer: 'Because of iron-rich dust', explanation: 'The iron in Martian dust gives the planet its orange-red colour.' },
  },
  jupiter: {
    name: 'Jupiter', kind: 'Gas giant',
    description: 'The biggest planet, made mostly of gas.',
    funFact: 'Its Great Red Spot is a huge storm that has been watched for a very long time.',
    focuses: {
      identity: { label: labels.identity, text: 'Jupiter is the biggest planet in the Solar System.' },
      air: { label: labels.air, text: 'Jupiter has no solid ground where you could land, as you can on Earth.' },
      moons: { label: labels.moons, text: 'Jupiter has 101 recognised moons; this number can change with new discoveries.' },
      journey: { label: labels.journey, text: 'Jupiter takes almost 12 Earth years to go around the Sun.' },
    },
    challenge: { question: 'Which planet is the biggest?', choices: ['Jupiter', 'Saturn', 'Earth'], answer: 'Jupiter', explanation: 'Jupiter is so big it could hold more than a thousand Earths.' },
  },
  saturn: {
    name: 'Saturn', kind: 'Gas giant',
    description: 'A gas giant famous for its large rings.',
    funFact: 'Its rings are made mostly of ice and rock.',
    focuses: {
      identity: { label: labels.identity, text: 'Saturn is easy to recognise thanks to its very visible rings.' },
      air: { label: labels.air, text: 'Like Jupiter, Saturn is made mostly of gas.' },
      moons: { label: labels.moons, text: 'Saturn has 274 confirmed moons; this number can change with new discoveries.' },
      journey: { label: labels.journey, text: 'A year on Saturn lasts about 29 Earth years.' },
    },
    challenge: { question: 'What are Saturn’s rings mostly made of?', choices: ['Ice and rock', 'Cotton', 'Solid light'], answer: 'Ice and rock', explanation: 'The rings gather countless pieces of ice and rock.' },
  },
  uranus: {
    name: 'Uranus', kind: 'Ice giant',
    description: 'A bluish planet that spins almost lying on its side.',
    funFact: 'Its axis is so tilted that it seems to roll around the Sun.',
    focuses: {
      identity: { label: labels.identity, text: 'Uranus is an ice giant, smaller than Jupiter and Saturn.' },
      air: { label: labels.air, text: 'Its atmosphere contains methane, which helps give it its blue colour.' },
      moons: { label: labels.moons, text: 'Uranus has 28 known moons, often named after characters from plays.' },
      journey: { label: labels.journey, text: 'A year on Uranus lasts 84 Earth years.' },
    },
    challenge: { question: 'Which planet seems to spin lying on its side?', choices: ['Uranus', 'Earth', 'Mercury'], answer: 'Uranus', explanation: 'Its axis is very tilted: Uranus seems to roll along its orbit.' },
  },
  neptune: {
    name: 'Neptune', kind: 'Ice giant',
    description: 'The farthest planet, known for its very fast winds.',
    funFact: 'Neptune was found with maths before anyone saw it.',
    focuses: {
      identity: { label: labels.identity, text: 'Neptune is the eighth and last planet of the Solar System.' },
      air: { label: labels.air, text: 'Its atmosphere is very cold and its winds can be extremely fast.' },
      moons: { label: labels.moons, text: 'Neptune has 16 known moons, including big Triton.' },
      journey: { label: labels.journey, text: 'A year on Neptune lasts almost 165 Earth years.' },
    },
    challenge: { question: 'Which planet is farthest from the Sun?', choices: ['Neptune', 'Uranus', 'Mars'], answer: 'Neptune', explanation: 'Neptune is the eighth planet, the farthest in our Solar System.' },
  },
}

export function explorerPlanets(locale: SiteLocale): ExplorerPlanet[] {
  return locale === 'en' ? PLANET_EXPLORER_PLANETS.map(planet => ({ ...planet, ...ENGLISH[planet.id] })) : PLANET_EXPLORER_PLANETS
}
