import { Observer } from 'astronomy-engine'
import {
  degreesToRadians,
  ecfToLookAngles,
  eciToEcf,
  gstime,
  jday,
  propagate,
  sunPos,
  twoline2satrec,
} from 'satellite.js'
import { compassDirection, type Compass } from './sky-words'
import { DARK_SUN_ALTITUDE, sunAltitude } from './tonight'

export type IssPass = {
  start: Date
  end: Date
  maxAltitude: number
  startDirection: Compass
  endDirection: Compass
}

const STEP_SECONDS = 20
const MIN_ALTITUDE = 10
const MIN_DURATION_SECONDS = 60
const EARTH_RADIUS_KM = 6_378

type Vector = { x: number; y: number; z: number }

function sunVector(time: Date): Vector {
  const [x, y, z] = sunPos(jday(time)).rsun
  return { x, y, z }
}

/** Cylindrical Earth shadow: good enough to know whether the station still reflects sunlight. */
export function isInEarthShadow(satelliteKm: Vector, sunDirection: Vector): boolean {
  const length = Math.hypot(sunDirection.x, sunDirection.y, sunDirection.z)
  const sun = { x: sunDirection.x / length, y: sunDirection.y / length, z: sunDirection.z / length }
  const along = satelliteKm.x * sun.x + satelliteKm.y * sun.y + satelliteKm.z * sun.z
  if (along > 0) return false
  const perpendicular = Math.hypot(satelliteKm.x - along * sun.x, satelliteKm.y - along * sun.y, satelliteKm.z - along * sun.z)
  return perpendicular < EARTH_RADIUS_KM
}

/**
 * Passes the ISS makes over the observer that can be seen with the naked eye:
 * above 10°, sky dark enough for the observer, and the station still in sunlight.
 */
export function findVisibleIssPasses(
  tleLine1: string,
  tleLine2: string,
  latitude: number,
  longitude: number,
  from: Date,
  hours = 72,
  limit = 3,
): IssPass[] {
  const satrec = twoline2satrec(tleLine1, tleLine2)
  const observerGeodetic = { latitude: degreesToRadians(latitude), longitude: degreesToRadians(longitude), height: 0.1 }
  const skyObserver = new Observer(latitude, longitude, 0)
  const passes: IssPass[] = []

  let current: { start: Date; end: Date; maxAltitude: number; startAzimuth: number; endAzimuth: number } | null = null
  const close = () => {
    if (current && (current.end.getTime() - current.start.getTime()) / 1_000 >= MIN_DURATION_SECONDS) {
      passes.push({
        start: current.start,
        end: current.end,
        maxAltitude: Math.round(current.maxAltitude),
        startDirection: compassDirection(current.startAzimuth),
        endDirection: compassDirection(current.endAzimuth),
      })
    }
    current = null
  }

  const steps = Math.floor((hours * 3_600) / STEP_SECONDS)
  for (let index = 0; index <= steps && passes.length < limit; index += 1) {
    const time = new Date(from.getTime() + index * STEP_SECONDS * 1_000)
    const position = propagate(satrec, time)?.position
    if (!position || typeof position === 'boolean') {
      close()
      continue
    }

    const look = ecfToLookAngles(observerGeodetic, eciToEcf(position, gstime(time)))
    const altitude = (look.elevation * 180) / Math.PI
    // Cheap test first: most of the time the station is below the horizon.
    const visible = altitude >= MIN_ALTITUDE
      && sunAltitude(time, skyObserver) < DARK_SUN_ALTITUDE
      && !isInEarthShadow(position, sunVector(time))

    if (!visible) {
      close()
      continue
    }

    const azimuth = (look.azimuth * 180) / Math.PI
    if (!current) {
      current = { start: time, end: time, maxAltitude: altitude, startAzimuth: azimuth, endAzimuth: azimuth }
    } else {
      current.end = time
      current.endAzimuth = azimuth
      current.maxAltitude = Math.max(current.maxAltitude, altitude)
    }
  }
  close()

  return passes
}
