import type { LocalProgress, MissionId } from '@/lib/client/local-progress'
import type { SpaceIconName } from '@/components/ui/SpaceIcon'

type Text = { fr: string; en: string }

export type PassportMission = { id: MissionId; icon: SpaceIconName; href: string; title: Text; text: Text }

/** Also the suggested order: « Prochaine mission conseillée » follows it. */
export const PASSPORT_MISSIONS: PassportMission[] = [
  { id: 'soleil', icon: 'sun', href: '/soleil', title: { fr: 'Soleil', en: 'Sun' }, text: { fr: 'Comprends notre étoile et la météo spatiale.', en: 'Understand our star and space weather.' } },
  { id: 'planetes', icon: 'planet', href: '/planetes', title: { fr: 'Planètes', en: 'Planets' }, text: { fr: 'Compare les mondes autour du Soleil.', en: 'Compare the worlds around the Sun.' } },
  { id: 'mars', icon: 'mars', href: '/mars', title: { fr: 'Mars', en: 'Mars' }, text: { fr: 'Découvre les rovers et la planète rouge.', en: 'Discover the rovers and the red planet.' } },
  { id: 'iss', icon: 'satellite', href: '/iss', title: { fr: 'ISS', en: 'ISS' }, text: { fr: 'Suis le laboratoire qui tourne autour de la Terre.', en: 'Follow the laboratory that travels around Earth.' } },
  { id: 'ciel', icon: 'moon-stars', href: '/ciel', title: { fr: 'Ciel', en: 'Sky' }, text: { fr: 'Prépare une observation depuis ta zone.', en: 'Plan a stargazing session from where you live.' } },
  { id: 'asteroides', icon: 'asteroid', href: '/asteroides', title: { fr: 'Astéroïdes', en: 'Asteroids' }, text: { fr: 'Repère les petits mondes proches de la Terre.', en: 'Spot the small worlds that pass near Earth.' } },
  { id: 'meteorites', icon: 'meteorite', href: '/meteorites', title: { fr: 'Météorites', en: 'Meteorites' }, text: { fr: 'Suis les roches venues de l’espace.', en: 'Track the rocks that came from space.' } },
  { id: 'missions', icon: 'rocket', href: '/missions', title: { fr: 'Missions', en: 'Missions' }, text: { fr: 'Parcours les grandes étapes de l’exploration.', en: 'Travel through the big steps of exploration.' } },
  { id: 'jwst', icon: 'telescope', href: '/jwst', title: { fr: 'Webb', en: 'Webb' }, text: { fr: 'Décrypte les images du télescope Webb.', en: 'Decode the Webb telescope’s pictures.' } },
  { id: 'photo-du-jour', icon: 'camera', href: '/photo-du-jour', title: { fr: 'Photo du jour', en: 'Picture of the day' }, text: { fr: 'Lis une image scientifique de la NASA.', en: 'Read a NASA science picture.' } },
  { id: 'exoplanetes', icon: 'exoplanet', href: '/exoplanetes', title: { fr: 'Exoplanètes', en: 'Exoplanets' }, text: { fr: 'Découvre comment trouver les mondes lointains.', en: 'Find out how we discover faraway worlds.' } },
  { id: 'actualites', icon: 'news', href: '/actualites', title: { fr: 'Actualités', en: 'News' }, text: { fr: 'Apprends à vérifier une nouvelle spatiale.', en: 'Learn to check a piece of space news.' } },
  { id: 'quiz', icon: 'quiz', href: '/quiz', title: { fr: 'Quiz', en: 'Quiz' }, text: { fr: 'Teste ce que tu as retenu.', en: 'Test what you remember.' } },
  { id: 'solarbot', icon: 'bulb', href: '/solarbot', title: { fr: 'SolarBot', en: 'SolarBot' }, text: { fr: 'Pose une question et vérifie les sources.', en: 'Ask a question and check the sources.' } },
]

export type MissionState = 'stamped' | 'visited' | 'new'

export function missionState(progress: LocalProgress, mission: MissionId): MissionState {
  if (progress.completed[mission]) return 'stamped'
  if (progress.visited[mission]) return 'visited'
  return 'new'
}

/** A mission already started comes first, then the next one never opened. */
export function nextMission(progress: LocalProgress): PassportMission | null {
  return PASSPORT_MISSIONS.find(mission => missionState(progress, mission.id) === 'visited')
    ?? PASSPORT_MISSIONS.find(mission => missionState(progress, mission.id) === 'new')
    ?? null
}

export type PassportRank = { level: 0 | 1 | 2 | 3; from: number; title: Text }

export const PASSPORT_RANKS: PassportRank[] = [
  { level: 0, from: 0, title: { fr: 'Cadet·te de l’espace', en: 'Space cadet' } },
  { level: 1, from: 3, title: { fr: 'Pilote', en: 'Pilot' } },
  { level: 2, from: 7, title: { fr: 'Commandant·e', en: 'Commander' } },
  { level: 3, from: 14, title: { fr: 'Explorateur·rice du Système solaire', en: 'Solar System explorer' } },
]

export function passportRank(stamps: number): { rank: PassportRank; next: PassportRank | null } {
  const index = PASSPORT_RANKS.filter(rank => stamps >= rank.from).length - 1
  return { rank: PASSPORT_RANKS[index], next: PASSPORT_RANKS[index + 1] ?? null }
}
