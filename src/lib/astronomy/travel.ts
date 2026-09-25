// Travel comparisons, without any astronomy dependency (distances are computed elsewhere).

export const KM_PER_AU = 149_597_870.7
const LIGHT_KM_PER_HOUR = 299_792.458 * 3_600

export type TravelMode = { id: string; label: string; speedKmh: number }

export const TRAVEL_MODES: TravelMode[] = [
  { id: 'walk', label: 'À pied', speedKmh: 5 },
  { id: 'car', label: 'En voiture sur l’autoroute', speedKmh: 130 },
  { id: 'plane', label: 'En avion de ligne', speedKmh: 900 },
  // Typical cruising speed of a probe leaving Earth (New Horizons left at about 58 000 km/h).
  { id: 'probe', label: 'En sonde spatiale', speedKmh: 58_000 },
  { id: 'light', label: 'À la vitesse de la lumière', speedKmh: LIGHT_KM_PER_HOUR },
]

/** « 3 min », « 12 heures », « 4 mois », « 1 200 ans »: rounded for children. */
export function formatDuration(hours: number): string {
  const format = (value: number) => Math.round(value).toLocaleString('fr-FR')
  const plural = (value: number, word: string) => `${format(value)} ${word}${Math.round(value) > 1 ? 's' : ''}`
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`
  if (hours < 48) return plural(hours, 'heure')
  const days = hours / 24
  if (days < 60) return plural(days, 'jour')
  const years = days / 365.25
  if (years < 2) return `${format(days / 30.44)} mois`
  return plural(years, 'an')
}

export function travelTimes(distanceKm: number) {
  return TRAVEL_MODES.map(mode => ({ ...mode, duration: formatDuration(distanceKm / mode.speedKmh) }))
}

/** « 78 millions de km », « 1,2 milliard de km ». */
export function formatDistance(distanceKm: number): string {
  if (distanceKm >= 1e9) {
    const value = (distanceKm / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
    return `${value} milliard${distanceKm >= 2e9 ? 's' : ''} de km`
  }
  return `${Math.round(distanceKm / 1e6).toLocaleString('fr-FR')} millions de km`
}
