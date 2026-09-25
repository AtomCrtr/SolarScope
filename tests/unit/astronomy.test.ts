import { describe, expect, it } from 'vitest'
import { Observer } from 'astronomy-engine'
import { compassDirection, computeTonight, fromDirection, towards, heightLabel, MIN_VISIBLE_ALTITUDE, moonPhaseName, sunAltitude } from '../../src/lib/astronomy/tonight'
import { findVisibleIssPasses } from '../../src/lib/astronomy/iss-passes'

const PARIS = { latitude: 48.86, longitude: 2.35 }

describe('tonight sky helpers', () => {
  it('turns an azimuth into a compass direction children can use', () => {
    expect(compassDirection(0)).toBe('Nord')
    expect(compassDirection(95)).toBe('Est')
    expect(compassDirection(225)).toBe('Sud-Ouest')
    expect(compassDirection(-10)).toBe('Nord')
    expect(heightLabel(12)).toBe('bas sur l’horizon')
    expect(heightLabel(60)).toBe('haut dans le ciel')
    expect(towards('Est')).toBe('vers l’Est')
    expect(towards('Sud-Ouest')).toBe('vers le Sud-Ouest')
    expect(fromDirection('Ouest')).toBe('de l’Ouest')
    expect(fromDirection('Nord')).toBe('du Nord')
  })

  it('names the Moon phase', () => {
    expect(moonPhaseName(3)).toBe('Nouvelle lune')
    expect(moonPhaseName(90)).toBe('Premier quartier')
    expect(moonPhaseName(180)).toBe('Pleine lune')
    expect(moonPhaseName(300)).toBe('Dernier croissant')
  })

  it('finds a new moon during the 8 April 2024 eclipse and a full moon on 23 April 2024', () => {
    const eclipse = computeTonight(new Date('2024-04-08T21:00:00Z'), PARIS.latitude, PARIS.longitude)
    expect(eclipse.moon.phaseName).toBe('Nouvelle lune')
    expect(eclipse.moon.illuminatedPercent).toBeLessThan(5)

    const fullMoon = computeTonight(new Date('2024-04-23T21:00:00Z'), PARIS.latitude, PARIS.longitude)
    expect(fullMoon.moon.phaseName).toBe('Pleine lune')
    expect(fullMoon.moon.illuminatedPercent).toBeGreaterThan(95)
  })

  it('observes after sunset during the day, and lists only planets above the horizon, brightest first', () => {
    const sky = computeTonight(new Date('2026-09-24T10:00:00Z'), PARIS.latitude, PARIS.longitude)
    expect(sky.isNow).toBe(false)
    expect(sky.sunset).not.toBeNull()
    expect(sky.observedAt.getTime()).toBeGreaterThan(sky.sunset!.getTime())
    for (const planet of sky.planets) expect(planet.altitude).toBeGreaterThanOrEqual(MIN_VISIBLE_ALTITUDE)
    const magnitudes = sky.planets.map(planet => planet.magnitude)
    expect(magnitudes).toEqual([...magnitudes].sort((a, b) => a - b))
  })
})

describe('visible ISS passes', () => {
  const TLE_1 = '1 25544U 98067A   26267.14191496  .00009634  00000+0  18116-3 0  9999'
  const TLE_2 = '2 25544  51.6318 170.3464 0004691 174.6338 185.4701 15.49258637587098'

  it('only returns passes above 10° while the observer is in the dark', () => {
    const passes = findVisibleIssPasses(TLE_1, TLE_2, PARIS.latitude, PARIS.longitude, new Date('2026-09-24T00:00:00Z'), 72, 5)
    const observer = new Observer(PARIS.latitude, PARIS.longitude, 0)
    for (const pass of passes) {
      expect(pass.end.getTime()).toBeGreaterThan(pass.start.getTime())
      expect(pass.maxAltitude).toBeGreaterThanOrEqual(10)
      expect(sunAltitude(pass.start, observer)).toBeLessThan(-6)
    }
  })
})

describe('ISS orbital elements', () => {
  it('accepts the CelesTrak answer and rejects corrupted lines', async () => {
    const { parseIssTle } = await import('../../src/lib/data/iss-tle')
    const text = 'ISS (ZARYA)\n1 25544U 98067A   26267.14191496  .00009634  00000+0  18116-3 0  9999\n2 25544  51.6318 170.3464 0004691 174.6338 185.4701 15.49258637587098\n'
    expect(parseIssTle(text)?.line1.startsWith('1 25544')).toBe(true)
    expect(parseIssTle(text.replace('51.6318', '51.6319'))).toBeNull()
    expect(parseIssTle('<html>error</html>')).toBeNull()
  })
})
