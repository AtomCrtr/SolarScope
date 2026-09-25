import { describe, expect, it } from 'vitest'
import { formatDistance, formatDuration, KM_PER_AU, travelTimes } from '../../src/lib/astronomy/travel'
import { distanceFromEarthKm } from '../../src/lib/astronomy/planet-distance'
import { PLANET_MOONS } from '../../src/lib/content/moons'
import { PLANET_EXPLORER_PLANETS } from '../../src/lib/content/planet-explorer'

describe('travel comparisons', () => {
  it('rounds durations the way a child would read them', () => {
    expect(formatDuration(0.2)).toBe('12 min')
    expect(formatDuration(5)).toBe('5 heures')
    expect(formatDuration(24 * 10)).toBe('10 jours')
    expect(formatDuration(24 * 365.25 * 150)).toBe('150 ans')
  })

  it('finds that sunlight needs about 8 minutes to reach the Earth', () => {
    const light = travelTimes(KM_PER_AU).find(mode => mode.id === 'light')
    expect(light?.duration).toBe('8 min')
  })

  it('formats distances in millions or billions of kilometres', () => {
    expect(formatDistance(78_340_000)).toBe('78 millions de km')
    expect(formatDistance(4_350_000_000)).toBe('4,4 milliards de km')
  })
})

describe('Earth–planet distance', () => {
  it('keeps Mars between its closest and farthest distances from the Earth', () => {
    for (const date of ['2025-01-12', '2026-09-25', '2027-02-19', '2028-06-01']) {
      const distance = distanceFromEarthKm('mars', new Date(`${date}T00:00:00Z`))!
      expect(distance).toBeGreaterThan(54e6)
      expect(distance).toBeLessThan(402e6)
    }
    expect(distanceFromEarthKm('earth', new Date())).toBeNull()
  })
})

describe('moons', () => {
  it('lists moons for every explorer planet', () => {
    for (const planet of PLANET_EXPLORER_PLANETS) expect(PLANET_MOONS[planet.id]).toBeDefined()
    expect(PLANET_MOONS.jupiter.map(moon => moon.name)).toContain('Ganymède')
  })
})
