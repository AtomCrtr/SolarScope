import { describe, expect, it } from 'vitest'
import { distanceKm, meteoritesNear, meteoriteSummary, parseMeteoriteCsv } from '../../src/lib/data/meteorites'

const CSV = `name,id,nametype,recclass,mass (g),fall,year,reclat,reclong,GeoLocation
Aachen,1,Valid,L5,21,Fell,1880,50.775000,6.083330,"(50.775, 6.08333)"
Ensisheim,10039,Valid,LL6,127000,Fell,1491,47.866670,7.350000,"(47.86667, 7.35)"
Hoba,11890,Valid,"Iron, IVB",60000000,Found,1920,-19.583330,17.916670,"(-19.58333, 17.91667)"
Unknown place,99,Valid,H5,10,Found,1999,0.000000,0.000000,"(0.0, 0.0)"
Future,98,Valid,H5,10,Found,2101,45.0,5.0,"(45.0, 5.0)"
Old relict,97,Relict,Relict iron,,Found,1950,40.0,3.0,"(40.0, 3.0)"
`

describe('NASA meteorite landings', () => {
  it('parses quoted fields and drops unknown places, relicts and impossible years', () => {
    const records = parseMeteoriteCsv(CSV, 2026)
    expect(records.map(record => record.name)).toEqual(['Aachen', 'Ensisheim', 'Hoba', 'Future'])
    expect(records.find(record => record.name === 'Hoba')?.recclass).toBe('Iron, IVB')
    expect(records.find(record => record.name === 'Future')?.year).toBeNull()
    expect(records.find(record => record.name === 'Ensisheim')?.fell).toBe(true)
  })

  it('finds the closest meteorites to Strasbourg', () => {
    const records = parseMeteoriteCsv(CSV, 2026)
    const near = meteoritesNear(records, 48.6, 7.8, 2)
    expect(near.nearest.map(item => item.name)).toEqual(['Ensisheim', 'Aachen'])
    expect(near.nearest[0].distanceKm).toBeLessThan(100)
    expect(near.within100Km).toBe(1)
    expect(near.nearest[0]).not.toHaveProperty('lat')
  })

  it('summarises the whole collection', () => {
    const summary = meteoriteSummary(parseMeteoriteCsv(CSV, 2026))
    expect(summary.total).toBe(4)
    expect(summary.seenFalling).toBe(2)
    expect(summary.heaviest[0].name).toBe('Hoba')
    expect(Math.round(distanceKm(48.8566, 2.3522, 51.5074, -0.1278))).toBe(344)
  })
})
