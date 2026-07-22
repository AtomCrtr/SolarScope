import { describe, expect, it } from 'vitest'
import {
  parseCrew,
  parseLaunches,
  parseSolarWindPayload,
  parseXrayPayload,
  stationForCraft,
} from '../../src/lib/space-data'

describe('space data normalization', () => {
  it('maps crew vehicles to their current space station', () => {
    expect(stationForCraft('Crew-12 Dragon')).toBe('ISS')
    expect(stationForCraft('Soyuz MS-29')).toBe('ISS')
    expect(stationForCraft('Shenzhou 23')).toBe('Tiangong')

    expect(parseCrew({ people: [
      { name: 'Ada', spacecraft: 'Crew Dragon' },
      { name: 'Lin', spacecraft: 'Shenzhou 23' },
    ] })).toEqual([
      { name: 'Ada', craft: 'Crew Dragon', station: 'ISS' },
      { name: 'Lin', craft: 'Shenzhou 23', station: 'Tiangong' },
    ])
  })

  it('removes launches whose announced date is already past', () => {
    const payload = {
      results: [
        { id: 'past', name: 'Past launch', net: '2026-07-21T10:00:00Z' },
        { id: 'future', name: 'Future launch', net: '2026-07-24T10:00:00Z' },
      ],
    }

    expect(parseLaunches(payload, Date.parse('2026-07-22T10:00:00Z')).map(launch => launch.id)).toEqual(['future'])
  })

  it('reads NOAA columns by name so speed and density cannot be swapped', () => {
    const parsed = parseSolarWindPayload([
      ['time_tag', 'speed', 'density', 'temperature', 'bx', 'by', 'bz', 'bt', 'propagated_time_tag'],
      ['2026-07-22T19:58:00Z', 430, 8, 210_000, -3, 1, -1, 3.5, '2026-07-22T19:59:00Z'],
      ['2026-07-22T19:59:00Z', '', '', '', '', '', '', '', '2026-07-22T20:00:00Z'],
    ])

    expect(parsed?.wind).toEqual({ speed: 430, density: 8, temperature: 210_000 })
    expect(parsed?.magneticField.bz).toBe(-1)
    expect(parsed?.observedAt).toBe('2026-07-22T19:59:00Z')
  })

  it('keeps only the standard GOES 0.1–0.8 nm X-ray channel', () => {
    const parsed = parseXrayPayload([
      { time_tag: '2026-07-22T19:00:00Z', energy: '0.05-0.4nm', flux: 1e-8 },
      { time_tag: '2026-07-22T19:00:00Z', energy: '0.1-0.8nm', flux: 2e-7 },
      { time_tag: '2026-07-22T19:01:00Z', energy: '0.1-0.8nm', flux: 3e-7 },
    ])

    expect(parsed.history).toEqual([2e-7, 3e-7])
    expect(parsed.observedAt).toBe('2026-07-22T19:01:00Z')
  })
})
