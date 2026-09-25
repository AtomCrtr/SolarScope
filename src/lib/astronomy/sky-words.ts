// Plain-language wording for the sky, without any astronomy dependency so pages can
// import it without shipping the astronomy engine.
export type Compass = 'Nord' | 'Nord-Est' | 'Est' | 'Sud-Est' | 'Sud' | 'Sud-Ouest' | 'Ouest' | 'Nord-Ouest'

const COMPASS: Compass[] = ['Nord', 'Nord-Est', 'Est', 'Sud-Est', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest']


export function compassDirection(azimuthDegrees: number): Compass {
  const normalized = ((azimuthDegrees % 360) + 360) % 360
  return COMPASS[Math.round(normalized / 45) % 8]
}

/** « vers l’Est » but « vers le Sud-Ouest ». */
export function towards(direction: Compass): string {
  return /^(Est|Ouest)$/.test(direction) ? `vers l’${direction}` : `vers le ${direction}`
}

/** « de l’Ouest » but « du Nord-Est ». */
export function fromDirection(direction: Compass): string {
  return /^(Est|Ouest)$/.test(direction) ? `de l’${direction}` : `du ${direction}`
}

export function heightLabel(altitudeDegrees: number): string {
  if (altitudeDegrees < 20) return 'bas sur l’horizon'
  if (altitudeDegrees < 45) return 'à mi-hauteur'
  return 'haut dans le ciel'
}

/** Phase angle from astronomy-engine: 0° new moon, 90° first quarter, 180° full, 270° last quarter. */
export function moonPhaseName(phaseDegrees: number): string {
  const phase = ((phaseDegrees % 360) + 360) % 360
  if (phase < 22.5 || phase >= 337.5) return 'Nouvelle lune'
  if (phase < 67.5) return 'Premier croissant'
  if (phase < 112.5) return 'Premier quartier'
  if (phase < 157.5) return 'Gibbeuse croissante'
  if (phase < 202.5) return 'Pleine lune'
  if (phase < 247.5) return 'Gibbeuse décroissante'
  if (phase < 292.5) return 'Dernier quartier'
  return 'Dernier croissant'
}

// ── English wording, and a single entry point that picks the language ──

const COMPASS_EN: Record<Compass, string> = {
  Nord: 'north', 'Nord-Est': 'north-east', Est: 'east', 'Sud-Est': 'south-east',
  Sud: 'south', 'Sud-Ouest': 'south-west', Ouest: 'west', 'Nord-Ouest': 'north-west',
}

function moonPhaseNameEn(phaseDegrees: number): string {
  const phase = ((phaseDegrees % 360) + 360) % 360
  if (phase < 22.5 || phase >= 337.5) return 'New moon'
  if (phase < 67.5) return 'Waxing crescent'
  if (phase < 112.5) return 'First quarter'
  if (phase < 157.5) return 'Waxing gibbous'
  if (phase < 202.5) return 'Full moon'
  if (phase < 247.5) return 'Waning gibbous'
  if (phase < 292.5) return 'Last quarter'
  return 'Waning crescent'
}

export function brightnessLabel(magnitude: number, locale: 'fr' | 'en' = 'fr'): string {
  if (locale === 'en') {
    if (magnitude < -3) return 'very bright, impossible to miss'
    if (magnitude < -1) return 'very bright'
    if (magnitude < 1) return 'bright'
    return 'visible to the naked eye'
  }
  if (magnitude < -3) return 'très brillante, impossible à rater'
  if (magnitude < -1) return 'très brillante'
  if (magnitude < 1) return 'brillante'
  return 'visible à l’œil nu'
}

export function skyWords(locale: 'fr' | 'en') {
  if (locale === 'fr') return { towards, fromDirection, heightLabel, moonPhaseName, brightness: (magnitude: number) => brightnessLabel(magnitude, 'fr') }
  return {
    towards: (direction: Compass) => `towards the ${COMPASS_EN[direction]}`,
    fromDirection: (direction: Compass) => `from the ${COMPASS_EN[direction]}`,
    heightLabel: (altitudeDegrees: number) => (altitudeDegrees < 20 ? 'low on the horizon' : altitudeDegrees < 45 ? 'halfway up' : 'high in the sky'),
    moonPhaseName: moonPhaseNameEn,
    brightness: (magnitude: number) => brightnessLabel(magnitude, 'en'),
  }
}
