import { describe, expect, it } from 'vitest'
import { summarizeServiceHealth, type ServiceHealthSources } from '../../src/lib/server/health-status'

const allSources: ServiceHealthSources = {
  exoplanets: true,
  asteroids: true,
  crew: true,
  launches: true,
  issPosition: true,
  solarWind: true,
  xray: true,
  gemini: true,
}

describe('service health summary', () => {
  it('keeps the application operational when optional Gemini uses its fallback', () => {
    expect(summarizeServiceHealth({ ...allSources, gemini: false })).toMatchObject({
      status: 'degraded',
      httpStatus: 200,
      healthyScientificSources: 7,
    })
  })

  it('returns an outage status when fewer than five scientific sources respond', () => {
    expect(summarizeServiceHealth({
      ...allSources,
      exoplanets: false,
      asteroids: false,
      crew: false,
    })).toMatchObject({
      status: 'degraded',
      httpStatus: 503,
      healthyScientificSources: 4,
    })
  })

  it('reports full health when scientific sources and Gemini respond', () => {
    expect(summarizeServiceHealth(allSources)).toMatchObject({ status: 'ok', httpStatus: 200 })
  })
})
