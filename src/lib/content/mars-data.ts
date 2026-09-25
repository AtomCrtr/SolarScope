import type { SpaceIconName } from '@/components/ui/SpaceIcon'
import type { SiteLocale } from '@/lib/i18n/paths'

export const MARS_DATA_CHECKED_ON = '2026-07-26'

export type MarsRoverId = 'curiosity' | 'perseverance'

type MissionText = {
  area: string
  mission: string
  observation: string
  challenge: string
  answer: string
  distance: string
  sol: string
}

export type MarsRoverMission = MissionText & {
  id: MarsRoverId
  name: string
  color: string
  verifiedOn: string
}

const MISSIONS: Record<MarsRoverId, { name: string; color: string } & Record<SiteLocale, MissionText>> = {
  curiosity: {
    name: 'Curiosity',
    color: '#ef4444',
    fr: {
      area: 'Cratère Gale et mont Sharp',
      mission: 'Lire les couches de roches pour comprendre si Mars a autrefois pu être habitable.',
      observation: 'Curiosity étudie des roches qui gardent la trace d’anciens lacs et de leur eau.',
      challenge: 'Cherche dans sa fiche un instrument qui aide à étudier les roches.',
      answer: 'Curiosity utilise notamment son bras robotique et ses instruments de laboratoire pour analyser des échantillons.',
      distance: 'plus de 37 km',
      sol: 'sol 4 955',
    },
    en: {
      area: 'Gale Crater and Mount Sharp',
      mission: 'Read the layers of rock to find out whether Mars could once have been habitable.',
      observation: 'Curiosity studies rocks that keep traces of ancient lakes and their water.',
      challenge: 'Look in its fact file for an instrument that helps study rocks.',
      answer: 'Curiosity uses its robotic arm and its laboratory instruments, among others, to analyse samples.',
      distance: 'more than 37 km',
      sol: 'sol 4,955',
    },
  },
  perseverance: {
    name: 'Perseverance',
    color: '#8b5cf6',
    fr: {
      area: 'À l’ouest du cratère Jezero',
      mission: 'Chercher des traces d’une ancienne vie microbienne et prélever des roches.',
      observation: 'Perseverance explore d’anciens paysages où l’eau a laissé des dépôts de roches.',
      challenge: 'Explique pourquoi une roche peut raconter l’histoire de l’eau sur Mars.',
      answer: 'Certaines roches se forment dans l’eau ou gardent des minéraux qui permettent de retrouver son passage.',
      distance: '42,2 km',
      sol: 'sol 1 890',
    },
    en: {
      area: 'West of Jezero Crater',
      mission: 'Look for signs of ancient microbial life and collect rock samples.',
      observation: 'Perseverance explores ancient landscapes where water left rock deposits.',
      challenge: 'Explain why a rock can tell the story of water on Mars.',
      answer: 'Some rocks form in water, or keep minerals that show where water once flowed.',
      distance: '42.2 km',
      sol: 'sol 1,890',
    },
  },
}

export function marsRoverMission(id: MarsRoverId, locale: SiteLocale): MarsRoverMission {
  const mission = MISSIONS[id]
  return { id, name: mission.name, color: mission.color, verifiedOn: MARS_DATA_CHECKED_ON, ...mission[locale] }
}

export const MARS_FACTS: Array<{ icon: SpaceIconName; val: Record<SiteLocale, string>; label: Record<SiteLocale, string> }> = [
  { icon: 'thermometer', val: { fr: '-63 °C', en: '-63 °C' }, label: { fr: 'Température moyenne', en: 'Average temperature' } },
  { icon: 'ruler', val: { fr: '6 792 km', en: '6,792 km' }, label: { fr: 'Diamètre', en: 'Diameter' } },
  { icon: 'moon-stars', val: { fr: '2 lunes', en: '2 moons' }, label: { fr: 'Phobos et Déimos', en: 'Phobos and Deimos' } },
  { icon: 'calendar', val: { fr: '687 jours', en: '687 days' }, label: { fr: 'Une année sur Mars', en: 'A year on Mars' } },
  { icon: 'scale', val: { fr: '3,72 m/s²', en: '3.72 m/s²' }, label: { fr: 'Gravité', en: 'Gravity' } },
  { icon: 'mountain', val: { fr: '21 km', en: '21 km' }, label: { fr: 'Hauteur d’Olympus Mons', en: 'Height of Olympus Mons' } },
  { icon: 'clock', val: { fr: '24 h 37', en: '24 h 37 min' }, label: { fr: 'Une journée martienne', en: 'A day on Mars' } },
  { icon: 'sun', val: { fr: '227,9 millions de km', en: '227.9 million km' }, label: { fr: 'Distance moyenne au Soleil', en: 'Average distance from the Sun' } },
]

export const MARS_DATA_DISCLAIMER: Record<SiteLocale, string> = {
  fr: 'Données de référence et état des missions vérifiés le 26 juillet 2026 : ce n’est pas un suivi en direct.',
  en: 'Reference data and mission status checked on 26 July 2026: this is not live tracking.',
}
