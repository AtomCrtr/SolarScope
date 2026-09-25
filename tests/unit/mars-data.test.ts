import { describe, expect, it } from 'vitest'
import { MARS_DATA_CHECKED_ON, MARS_FACTS, marsRoverMission } from '../../src/lib/content/mars-data'
import { SCIENTIFIC_SOURCES } from '../../src/lib/data/source-registry'

describe('mars data', () => {
  it('keeps child-facing Mars facts and rover mission records dated', () => {
    expect(MARS_FACTS).toHaveLength(8)
    expect(MARS_DATA_CHECKED_ON).toBe('2026-07-26')

    for (const locale of ['fr', 'en'] as const) {
      for (const id of ['curiosity', 'perseverance'] as const) {
        const rover = marsRoverMission(id, locale)
        expect(rover.verifiedOn).toBe(MARS_DATA_CHECKED_ON)
        expect(rover.challenge.length).toBeGreaterThan(20)
        expect(rover.answer.length).toBeGreaterThan(20)
      }
    }
    for (const fact of MARS_FACTS) expect(fact.label.fr && fact.label.en && fact.val.fr && fact.val.en).toBeTruthy()
  })

  it('uses separate NASA records for facts, rover status and sample return', () => {
    expect(SCIENTIFIC_SOURCES.marsFacts.label).toMatch(/Mars Facts/)
    expect(SCIENTIFIC_SOURCES.marsRovers.childNote).toMatch(/date de vérification/i)
    expect(SCIENTIFIC_SOURCES.marsSampleReturn.href).toContain('mars-sample-return')
  })
})
