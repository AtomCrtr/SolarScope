import { describe, expect, it } from 'vitest'
import { selectSolarBotSources, toPublicSolarBotSources } from '../../src/lib/content/solarbot-sources'

describe('SolarBot official sources', () => {
  it('selects a precise NASA source for a black-hole question', () => {
    const sources = selectSolarBotSources('Comment fonctionne un trou noir ?')
    expect(sources[0].id).toBe('nasa-black-holes')
  })

  it('matches accented French astronomy terms', () => {
    const sources = selectSolarBotSources('Pourquoi les étoiles brillent-elles ?')
    expect(sources.some(source => source.id === 'nasa-stars')).toBe(true)
  })

  it('returns a small safe default set for an unknown topic', () => {
    const sources = toPublicSolarBotSources(selectSolarBotSources('Explique-moi ce mystère spatial'))
    expect(sources).toHaveLength(2)
    expect(sources.every(source => source.href.startsWith('https://'))).toBe(true)
    expect(sources.every(source => ['NASA', 'NOAA'].includes(source.organization))).toBe(true)
  })
})
