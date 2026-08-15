export type ServiceHealthSources = {
  exoplanets: boolean
  asteroids: boolean
  crew: boolean
  launches: boolean
  issPosition: boolean
  solarWind: boolean
  xray: boolean
  gemini: boolean
}

const MINIMUM_HEALTHY_SCIENTIFIC_SOURCES = 5

export function summarizeServiceHealth(sources: ServiceHealthSources) {
  const { gemini, ...scientificSources } = sources
  const healthyScientificSources = Object.values(scientificSources).filter(Boolean).length
  const operational = healthyScientificSources >= MINIMUM_HEALTHY_SCIENTIFIC_SOURCES

  return {
    status: operational && gemini ? 'ok' as const : 'degraded' as const,
    httpStatus: operational ? 200 as const : 503 as const,
    healthyScientificSources,
  }
}
