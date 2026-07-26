export type SourceCadence = 'reference' | 'live'

export type ScientificSource = {
  id: string
  label: string
  href: string
  cadence: SourceCadence
  checkedOn: string
  childNote: string
}

export const SCIENTIFIC_SOURCES = {
  planetaryFacts: {
    id: 'nasa-planetary-facts',
    label: 'NASA Planetary Fact Sheet',
    href: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/',
    cadence: 'reference',
    checkedOn: '2026-07-26',
    childNote: 'Ce sont des valeurs moyennes : ce n’est pas une météo en direct.',
  },
  planetMoons: {
    id: 'nasa-planetary-moons',
    label: 'NASA Science — Moons',
    href: 'https://science.nasa.gov/solar-system/moons/',
    cadence: 'reference',
    checkedOn: '2026-07-26',
    childNote: 'Le nombre de lunes peut changer lorsqu’une nouvelle lune est confirmée.',
  },
  spaceWeather: {
    id: 'noaa-space-weather',
    label: 'NOAA Space Weather Prediction Center',
    href: 'https://www.swpc.noaa.gov/',
    cadence: 'live',
    checkedOn: '2026-07-26',
    childNote: 'Cette donnée évolue : SolarScope indique lorsqu’elle est indisponible.',
  },
  issPosition: {
    id: 'iss-position',
    label: 'Where the ISS at',
    href: 'https://wheretheiss.at/',
    cadence: 'live',
    checkedOn: '2026-07-26',
    childNote: 'La position change en permanence : elle est affichée avec son heure de mise à jour.',
  },
} as const satisfies Record<string, ScientificSource>

export function formatCheckedOn(date: string, locale: 'fr' | 'en' = 'fr') {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00Z`))
}
