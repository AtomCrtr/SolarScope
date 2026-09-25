// Travel comparisons, without any astronomy dependency (distances are computed elsewhere).
import type { SiteLocale } from '@/lib/i18n/paths'

export const KM_PER_AU = 149_597_870.7
const LIGHT_KM_PER_HOUR = 299_792.458 * 3_600

export type TravelMode = { id: string; label: string; labelEn: string; speedKmh: number }

export const TRAVEL_MODES: TravelMode[] = [
  { id: 'walk', label: 'À pied', labelEn: 'On foot', speedKmh: 5 },
  { id: 'car', label: 'En voiture sur l’autoroute', labelEn: 'By car on the motorway', speedKmh: 130 },
  { id: 'plane', label: 'En avion de ligne', labelEn: 'By airliner', speedKmh: 900 },
  // Typical cruising speed of a probe leaving Earth (New Horizons left at about 58 000 km/h).
  { id: 'probe', label: 'En sonde spatiale', labelEn: 'By space probe', speedKmh: 58_000 },
  { id: 'light', label: 'À la vitesse de la lumière', labelEn: 'At the speed of light', speedKmh: LIGHT_KM_PER_HOUR },
]

const UNITS = {
  fr: { hour: ['heure', 'heures'], day: ['jour', 'jours'], month: ['mois', 'mois'], year: ['an', 'ans'], numbers: 'fr-FR' },
  en: { hour: ['hour', 'hours'], day: ['day', 'days'], month: ['month', 'months'], year: ['year', 'years'], numbers: 'en-GB' },
}

/** « 3 min », « 12 heures », « 4 mois », « 1 200 ans »: rounded for children. */
export function formatDuration(hours: number, locale: SiteLocale = 'fr'): string {
  const units = UNITS[locale]
  const unit = (value: number, [one, many]: string[]) => `${Math.round(value).toLocaleString(units.numbers)} ${Math.round(value) > 1 ? many : one}`
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`
  if (hours < 48) return unit(hours, units.hour)
  const days = hours / 24
  if (days < 60) return unit(days, units.day)
  const years = days / 365.25
  if (years < 2) return unit(days / 30.44, units.month)
  return unit(years, units.year)
}

export function travelTimes(distanceKm: number, locale: SiteLocale = 'fr') {
  return TRAVEL_MODES.map(mode => ({ ...mode, label: locale === 'en' ? mode.labelEn : mode.label, duration: formatDuration(distanceKm / mode.speedKmh, locale) }))
}

/** « 78 millions de km », « 1,2 milliard de km » — « 78 million km », « 1.2 billion km ». */
export function formatDistance(distanceKm: number, locale: SiteLocale = 'fr'): string {
  if (locale === 'en') {
    if (distanceKm >= 1e9) return `${(distanceKm / 1e9).toLocaleString('en-GB', { maximumFractionDigits: 1 })} billion km`
    return `${Math.round(distanceKm / 1e6).toLocaleString('en-GB')} million km`
  }
  if (distanceKm >= 1e9) {
    const value = (distanceKm / 1e9).toLocaleString('fr-FR', { maximumFractionDigits: 1 })
    return `${value} milliard${distanceKm >= 2e9 ? 's' : ''} de km`
  }
  return `${Math.round(distanceKm / 1e6).toLocaleString('fr-FR')} millions de km`
}
