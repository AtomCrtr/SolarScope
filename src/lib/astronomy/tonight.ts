import { Body, Equator, Horizon, Illumination, MoonPhase, Observer, SearchRiseSet } from 'astronomy-engine'
import { compassDirection, heightLabel, moonPhaseName, type Compass } from './sky-words'

export { compassDirection, fromDirection, heightLabel, moonPhaseName, towards, type Compass } from './sky-words'

/** Civil twilight: below −6°, the brightest planets and stars are easy to see. */
export const DARK_SUN_ALTITUDE = -6
/** Objects lower than this are usually hidden by buildings, trees or haze. */
export const MIN_VISIBLE_ALTITUDE = 8

function brightnessLabel(magnitude: number): string {
  if (magnitude < -3) return 'très brillante, impossible à rater'
  if (magnitude < -1) return 'très brillante'
  if (magnitude < 1) return 'brillante'
  return 'visible à l’œil nu'
}

function horizontal(body: Body, date: Date, observer: Observer) {
  const equatorial = Equator(body, date, observer, true, true)
  const position = Horizon(date, observer, equatorial.ra, equatorial.dec, 'normal')
  return { altitude: position.altitude, azimuth: position.azimuth }
}

const NAKED_EYE_PLANETS: Array<{ id: string; body: Body; name: string; tip: string }> = [
  { id: 'mercury', body: Body.Mercury, name: 'Mercure', tip: 'Elle reste très basse, peu après le coucher du Soleil ou avant son lever.' },
  { id: 'venus', body: Body.Venus, name: 'Vénus', tip: 'On l’appelle « l’étoile du Berger », mais c’est une planète !' },
  { id: 'mars', body: Body.Mars, name: 'Mars', tip: 'Cherche un point orangé qui ne scintille presque pas.' },
  { id: 'jupiter', body: Body.Jupiter, name: 'Jupiter', tip: 'Avec des jumelles bien calées, tu peux voir ses quatre grandes lunes.' },
  { id: 'saturn', body: Body.Saturn, name: 'Saturne', tip: 'Avec un petit télescope, on devine ses anneaux.' },
]

export type VisiblePlanet = {
  id: string
  name: string
  altitude: number
  direction: Compass
  height: string
  magnitude: number
  brightness: string
  tip: string
}

export type TonightSky = {
  /** Moment used for the sky: now if it is already dark, otherwise 1 h 30 after sunset. */
  observedAt: Date
  isNow: boolean
  sunset: Date | null
  sunrise: Date | null
  moon: {
    phaseName: string
    illuminatedPercent: number
    /** Lit side grows (waxing) or shrinks (waning): decides which side is drawn lit. */
    waxing: boolean
    isUp: boolean
    direction: Compass | null
    height: string | null
    nextRise: Date | null
  }
  planets: VisiblePlanet[]
}

export function sunAltitude(date: Date, observer: Observer): number {
  return horizontal(Body.Sun, date, observer).altitude
}

export function computeTonight(now: Date, latitude: number, longitude: number): TonightSky {
  const observer = new Observer(latitude, longitude, 0)
  const alreadyDark = sunAltitude(now, observer) < DARK_SUN_ALTITUDE

  const sunsetTime = alreadyDark ? null : SearchRiseSet(Body.Sun, observer, -1, now, 1)?.date ?? null
  const observedAt = alreadyDark
    ? now
    : new Date((sunsetTime ?? new Date(now.getTime() + 3 * 3_600_000)).getTime() + 90 * 60_000)
  const sunrise = SearchRiseSet(Body.Sun, observer, +1, observedAt, 1)?.date ?? null

  const moonPosition = horizontal(Body.Moon, observedAt, observer)
  const moonUp = moonPosition.altitude > 0
  const phaseAngle = MoonPhase(observedAt)
  const moon = {
    phaseName: moonPhaseName(phaseAngle),
    waxing: phaseAngle < 180,
    illuminatedPercent: Math.round(Illumination(Body.Moon, observedAt).phase_fraction * 100),
    isUp: moonUp,
    direction: moonUp ? compassDirection(moonPosition.azimuth) : null,
    height: moonUp ? heightLabel(moonPosition.altitude) : null,
    nextRise: moonUp ? null : SearchRiseSet(Body.Moon, observer, +1, observedAt, 1)?.date ?? null,
  }

  const planets = NAKED_EYE_PLANETS
    .map(planet => {
      const position = horizontal(planet.body, observedAt, observer)
      const magnitude = Illumination(planet.body, observedAt).mag
      return {
        id: planet.id,
        name: planet.name,
        altitude: position.altitude,
        direction: compassDirection(position.azimuth),
        height: heightLabel(position.altitude),
        magnitude,
        brightness: brightnessLabel(magnitude),
        tip: planet.tip,
      }
    })
    .filter(planet => planet.altitude >= MIN_VISIBLE_ALTITUDE)
    .sort((a, b) => a.magnitude - b.magnitude)

  return { observedAt, isNow: alreadyDark, sunset: sunsetTime, sunrise, moon, planets }
}
