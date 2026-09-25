import { describe, expect, it } from 'vitest'
import { groupMethods, methodLabel, parseExoplanetRows } from '../../src/lib/data/exoplanets'

describe('exoplanet catalogue', () => {
  it('sorts by distance itself (the archive applies TOP before ORDER BY) and converts units', () => {
    const planets = parseExoplanetRows([
      { pl_name: 'Barnard b', hostname: 'Barnard', sy_dist: 1.8266, pl_rade: 0.72, pl_eqt: 400, disc_year: 2024, discoverymethod: 'Radial Velocity' },
      { pl_name: 'Proxima Cen b', hostname: 'Proxima Cen', sy_dist: 1.30119, pl_rade: 1.02, pl_eqt: 218, disc_year: 2016, discoverymethod: 'Radial Velocity' },
      { pl_name: 'Broken', sy_dist: null },
    ])
    expect(planets.map(planet => planet.name)).toEqual(['Proxima Cen b', 'Barnard b'])
    expect(planets[0].lightYears).toBe(4.2)
    expect(planets[0].temperatureC).toBe(-55)
    expect(planets[0].method).toBe(methodLabel('Radial Velocity'))
  })

  it('groups rare discovery methods together', () => {
    const methods = groupMethods([
      { discoverymethod: 'Transit', n: 4708 },
      { discoverymethod: 'Pulsar Timing', n: 8 },
      { discoverymethod: 'Astrometry', n: 6 },
    ])
    expect(methods).toEqual([
      { method: methodLabel('Transit'), count: 4708 },
      { method: 'Autres méthodes', count: 14 },
    ])
  })
})
