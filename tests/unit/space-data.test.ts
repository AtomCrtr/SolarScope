import { describe, expect, it } from 'vitest'
import {
  parseCrew,
  parseLaunches,
  parseNasaNewsFeed,
  parseSolarWindPayload,
  parseXrayPayload,
  stationForCraft,
} from '../../src/lib/data/space-data'
import { parseKpHistory, parsePlasmaHistory } from '../../src/lib/data/space-weather-history'

describe('space data normalization', () => {
  it('reads the current NOAA Kp object format and the former tabular format', () => {
    expect(parseKpHistory([
      { time_tag: '2026-08-09T18:00:00Z', Kp: 3.67 },
      { time_tag: '2026-08-09T21:00:00Z', Kp: 4 },
    ])).toEqual([
      { time: '2026-08-09T18:00:00Z', kp: 3.67 },
      { time: '2026-08-09T21:00:00Z', kp: 4 },
    ])

    expect(parseKpHistory([
      ['time_tag', 'Kp'],
      ['2026-08-09T18:00:00Z', 3],
    ])).toEqual([{ time: '2026-08-09T18:00:00Z', kp: 3 }])
  })

  it('reads speed and density from the replacement NOAA propagated wind feed', () => {
    expect(parsePlasmaHistory([
      ['time_tag', 'speed', 'density', 'temperature', 'bx'],
      ['2026-08-09T19:06:00Z', 436, 5.28, 175639, 3.42],
    ])).toEqual([{ time: '2026-08-09T19:06:00Z', speed: 436, density: 5.28 }])
  })

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

  it('does not invent a publication date when NASA RSS omits or corrupts it', () => {
    const articles = parseNasaNewsFeed(`
      <rss><channel>
        <item><title>No date</title><link>https://www.nasa.gov/no-date</link><description>Summary</description></item>
        <item><title>Bad date</title><link>https://www.nasa.gov/bad-date</link><description>Summary</description><pubDate>not-a-date</pubDate></item>
      </channel></rss>
    `)

    expect(articles.map(article => article.date)).toEqual([null, null])
  })
})
