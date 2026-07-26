import { describe, expect, it } from 'vitest'
import { PLANET_EXPLORER_PLANETS, PLANET_FOCUS_ORDER } from '../../src/lib/content/planet-explorer'
import { SCIENTIFIC_SOURCES, formatCheckedOn } from '../../src/lib/data/source-registry'

describe('planet explorer content', () => {
  it('keeps the eight planets, one source-backed challenge and four short exploration angles each', () => {
    expect(PLANET_EXPLORER_PLANETS).toHaveLength(8)
    expect(new Set(PLANET_EXPLORER_PLANETS.map(planet => planet.id)).size).toBe(8)

    for (const planet of PLANET_EXPLORER_PLANETS) {
      expect(planet.challenge.choices).toContain(planet.challenge.answer)
      expect(Object.keys(planet.focuses).sort()).toEqual([...PLANET_FOCUS_ORDER].sort())
      expect(planet.radiusKm).toBeGreaterThan(0)
      expect(planet.distanceMillionKm).toBeGreaterThan(0)
    }
  })

  it('marks changing moon counts and live data with an explicit provenance record', () => {
    expect(SCIENTIFIC_SOURCES.planetMoons.childNote).toMatch(/peut changer/i)
    expect(SCIENTIFIC_SOURCES.spaceWeather.cadence).toBe('live')
    expect(SCIENTIFIC_SOURCES.planetaryFacts.cadence).toBe('reference')
    expect(formatCheckedOn(SCIENTIFIC_SOURCES.planetaryFacts.checkedOn)).toMatch(/2026/)
  })
})
