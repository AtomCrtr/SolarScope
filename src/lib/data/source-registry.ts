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
  marsFacts: {
    id: 'nasa-mars-facts',
    label: 'NASA Science — Mars Facts',
    href: 'https://science.nasa.gov/mars/facts/',
    cadence: 'reference',
    checkedOn: '2026-07-26',
    childNote: 'Ces valeurs décrivent Mars en général : ce ne sont pas des mesures en direct.',
  },
  marsRovers: {
    id: 'nasa-mars-rovers',
    label: 'NASA Mars Exploration Program',
    href: 'https://science.nasa.gov/mars/',
    cadence: 'reference',
    checkedOn: '2026-07-26',
    childNote: 'Les missions évoluent. SolarScope indique la date de vérification à côté de leurs chiffres.',
  },
  marsSampleReturn: {
    id: 'nasa-mars-sample-return',
    label: 'NASA Mars Sample Return',
    href: 'https://science.nasa.gov/mission/mars-sample-return/',
    cadence: 'reference',
    checkedOn: '2026-07-26',
    childNote: 'Le projet est encore étudié : aucune date de retour des échantillons n’est affichée comme certaine.',
  },
  jwstFacts: {
    id: 'nasa-jwst-facts',
    label: 'NASA Science — James Webb Space Telescope',
    href: 'https://science.nasa.gov/mission/webb/',
    cadence: 'reference',
    checkedOn: '2026-08-06',
    childNote: 'Les images sont officielles ; leurs couleurs peuvent représenter des lumières invisibles à nos yeux.',
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
