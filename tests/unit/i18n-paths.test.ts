import { describe, expect, it } from 'vitest'
import { localeFromPath, localizedHref, stripLocale } from '../../src/lib/i18n/paths'

describe('language from the address', () => {
  it('reads the locale from the path', () => {
    expect(localeFromPath('/')).toBe('fr')
    expect(localeFromPath('/soleil')).toBe('fr')
    expect(localeFromPath('/en')).toBe('en')
    expect(localeFromPath('/en/soleil')).toBe('en')
    expect(localeFromPath('/english')).toBe('fr')
  })

  it('switches a link to the other language', () => {
    expect(localizedHref('/soleil', 'en')).toBe('/en/soleil')
    expect(localizedHref('/', 'en')).toBe('/en')
    expect(localizedHref('/#parcours', 'en')).toBe('/en#parcours')
    expect(localizedHref('/passeport#carnet', 'en')).toBe('/en/passeport#carnet')
    expect(localizedHref('/en/soleil', 'fr')).toBe('/soleil')
    expect(localizedHref('/en', 'fr')).toBe('/')
    expect(localizedHref('/api/news', 'en')).toBe('/api/news')
    expect(localizedHref('https://nasa.gov', 'en')).toBe('https://nasa.gov')
    expect(stripLocale('/en/ciel')).toBe('/ciel')
  })
})
