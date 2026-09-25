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
