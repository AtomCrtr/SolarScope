export const MARS_DATA_CHECKED_ON = '2026-07-26'

export type MarsRoverId = 'curiosity' | 'perseverance'

export type MarsRoverMission = {
  id: MarsRoverId
  name: string
  emoji: string
  color: string
  area: string
  mission: string
  observation: string
  challenge: string
  answer: string
  distance: string
  sol: string
  verifiedOn: string
}

export const MARS_ROVER_MISSIONS: Record<MarsRoverId, MarsRoverMission> = {
  curiosity: {
    id: 'curiosity',
    name: 'Curiosity',
    emoji: '🤖',
    color: '#ef4444',
    area: 'Cratère Gale et mont Sharp',
    mission: 'Lire les couches de roches pour comprendre si Mars a autrefois pu être habitable.',
    observation: 'Curiosity étudie des roches qui gardent la trace d’anciens lacs et de leur eau.',
    challenge: 'Cherche dans sa fiche un instrument qui aide à étudier les roches.',
    answer: 'Curiosity utilise notamment son bras robotique et ses instruments de laboratoire pour analyser des échantillons.',
    distance: 'plus de 37 km',
    sol: 'sol 4 955',
    verifiedOn: MARS_DATA_CHECKED_ON,
  },
  perseverance: {
    id: 'perseverance',
    name: 'Perseverance',
    emoji: '🚀',
    color: '#8b5cf6',
    area: 'À l’ouest du cratère Jezero',
    mission: 'Chercher des traces d’une ancienne vie microbienne et prélever des roches.',
    observation: 'Perseverance explore d’anciens paysages où l’eau a laissé des dépôts de roches.',
    challenge: 'Explique pourquoi une roche peut raconter l’histoire de l’eau sur Mars.',
    answer: 'Certaines roches se forment dans l’eau ou gardent des minéraux qui permettent de retrouver son passage.',
    distance: '42,2 km',
    sol: 'sol 1 890',
    verifiedOn: MARS_DATA_CHECKED_ON,
  },
}

export const MARS_FACTS = [
  { emoji: '🌡️', val: '-63°C', label: 'Température moyenne' },
  { emoji: '📏', val: '6 792 km', label: 'Diamètre' },
  { emoji: '🌙', val: '2 lunes', label: 'Phobos et Deimos' },
  { emoji: '📅', val: '687 jours', label: 'Une année sur Mars' },
  { emoji: '⚖️', val: '3,72 m/s²', label: 'Gravité' },
  { emoji: '🏔️', val: '21 km', label: 'Olympus Mons' },
  { emoji: '🕐', val: '24 h 37', label: 'Une journée martienne' },
  { emoji: '☀️', val: '227,9 Mkm', label: 'Distance moyenne au Soleil' },
] as const

export const MARS_DATA_DISCLAIMER = 'Données de référence et état des missions vérifiés le 26 juillet 2026 : ce n’est pas un suivi en direct.'
