export type PublicSolarBotSource = {
  id: string
  label: string
  href: string
  organization: 'NASA' | 'NOAA'
}

type SolarBotSource = PublicSolarBotSource & {
  fact: string
  keywords: string[]
}

const SOURCES: SolarBotSource[] = [
  {
    id: 'nasa-stars',
    label: 'NASA Science — Stars',
    href: 'https://science.nasa.gov/universe/stars/',
    organization: 'NASA',
    fact: 'Les étoiles produisent leur énergie par fusion nucléaire et évoluent différemment selon leur masse.',
    keywords: ['etoile', 'soleil', 'fusion', 'supernova', 'naissance', 'brillent'],
  },
  {
    id: 'nasa-black-holes',
    label: 'NASA Science — Black Holes',
    href: 'https://science.nasa.gov/universe/black-holes/',
    organization: 'NASA',
    fact: 'Un trou noir est une concentration de matière dont la gravité empêche la lumière de s’échapper au-delà de son horizon.',
    keywords: ['trou noir', 'horizon', 'singularite', 'spaghettification'],
  },
  {
    id: 'nasa-planets',
    label: 'NASA Science — Planets',
    href: 'https://science.nasa.gov/solar-system/planets/',
    organization: 'NASA',
    fact: 'Le Système solaire compte huit planètes reconnues, rocheuses près du Soleil et géantes plus loin.',
    keywords: ['planete', 'mercure', 'venus', 'terre', 'jupiter', 'saturne', 'uranus', 'neptune', 'systeme solaire'],
  },
  {
    id: 'nasa-mars',
    label: 'NASA Science — Mars Facts',
    href: 'https://science.nasa.gov/mars/facts/',
    organization: 'NASA',
    fact: 'Mars est une planète rocheuse froide dont les rovers étudient l’histoire géologique et l’habitabilité passée.',
    keywords: ['mars', 'perseverance', 'curiosity', 'rover', 'planete rouge'],
  },
  {
    id: 'nasa-moon',
    label: 'NASA Science — Moon Phases',
    href: 'https://science.nasa.gov/moon/moon-phases/',
    organization: 'NASA',
    fact: 'Les phases de la Lune viennent de la portion de sa moitié éclairée par le Soleil que nous voyons depuis la Terre.',
    keywords: ['lune', 'phase', 'croissant', 'pleine lune', 'apollo', 'armstrong'],
  },
  {
    id: 'nasa-sun',
    label: 'NASA Science — Sun Facts',
    href: 'https://science.nasa.gov/sun/facts/',
    organization: 'NASA',
    fact: 'Le Soleil est une étoile de 4,5 milliards d’années dont la gravité maintient le Système solaire ensemble.',
    keywords: ['soleil', 'solaire', 'heliophysique', 'eruption', 'vent solaire'],
  },
  {
    id: 'noaa-space-weather',
    label: 'NOAA — Space Weather Prediction Center',
    href: 'https://www.swpc.noaa.gov/',
    organization: 'NOAA',
    fact: 'La météo spatiale décrit les conditions variables produites par le Soleil dans l’espace proche de la Terre.',
    keywords: ['meteo spatiale', 'aurore', 'vent solaire', 'tempete solaire', 'indice kp'],
  },
  {
    id: 'nasa-galaxies',
    label: 'NASA Science — Galaxies',
    href: 'https://science.nasa.gov/universe/galaxies/',
    organization: 'NASA',
    fact: 'Une galaxie rassemble des étoiles, du gaz, de la poussière et de la matière noire liés par la gravité.',
    keywords: ['galaxie', 'voie lactee', 'andromede', 'univers'],
  },
  {
    id: 'nasa-exoplanets',
    label: 'NASA Science — Exoplanets',
    href: 'https://science.nasa.gov/exoplanets/',
    organization: 'NASA',
    fact: 'Une exoplanète est une planète qui tourne autour d’une étoile autre que le Soleil.',
    keywords: ['exoplanete', 'transit', 'monde lointain', 'vie extraterrestre', 'habitable'],
  },
  {
    id: 'nasa-iss',
    label: 'NASA — Station Facts',
    href: 'https://www.nasa.gov/international-space-station/space-station-facts-and-figures/',
    organization: 'NASA',
    fact: 'La Station spatiale internationale est un laboratoire habité qui fait environ seize orbites de la Terre par jour.',
    keywords: ['iss', 'station spatiale', 'astronaute', 'orbite terrestre', 'apesanteur'],
  },
  {
    id: 'nasa-light',
    label: 'NASA Science — Sensing the Universe',
    href: 'https://science.nasa.gov/universe/sensing-the-universe/',
    organization: 'NASA',
    fact: 'Les télescopes étudient plusieurs formes de lumière pour révéler des phénomènes invisibles à nos yeux.',
    keywords: ['lumiere', 'telescope', 'spectre', 'infrarouge', 'ultraviolet', 'rayon x', 'webb', 'hubble'],
  },
]

const DEFAULT_SOURCE_IDS = ['nasa-planets', 'nasa-stars']

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function selectSolarBotSources(question: string, limit = 3): SolarBotSource[] {
  const normalizedQuestion = normalize(question)
  const matches = SOURCES
    .map((source) => ({
      source,
      score: source.keywords.reduce((total, keyword) => total + (normalizedQuestion.includes(normalize(keyword)) ? 1 : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .map(({ source }) => source)

  const selected = matches.length > 0
    ? matches
    : DEFAULT_SOURCE_IDS.map(id => SOURCES.find(source => source.id === id)).filter((source): source is SolarBotSource => Boolean(source))

  return selected.slice(0, Math.max(1, Math.min(limit, 3)))
}

export function toPublicSolarBotSources(sources: SolarBotSource[]): PublicSolarBotSource[] {
  return sources.map(({ id, label, href, organization }) => ({ id, label, href, organization }))
}

export function formatSolarBotSourceContext(sources: SolarBotSource[]): string {
  return sources
    .map((source, index) => `[${index + 1}] ${source.label} (${source.organization})\nRepère vérifié : ${source.fact}\nURL : ${source.href}`)
    .join('\n\n')
}
