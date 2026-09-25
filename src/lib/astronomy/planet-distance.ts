import { Body, GeoVector } from 'astronomy-engine'
import { KM_PER_AU } from './travel'

const BODIES: Record<string, Body> = {
  mercury: Body.Mercury,
  venus: Body.Venus,
  mars: Body.Mars,
  jupiter: Body.Jupiter,
  saturn: Body.Saturn,
  uranus: Body.Uranus,
  neptune: Body.Neptune,
}

/** Real Earth–planet distance on a given date (km), or null for the Earth itself. */
export function distanceFromEarthKm(planetId: string, date: Date): number | null {
  const body = BODIES[planetId]
  if (!body) return null
  return GeoVector(body, date, false).Length() * KM_PER_AU
}
