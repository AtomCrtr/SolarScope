import { describe, expect, it } from 'vitest'
import { pageMetadata, SITE_URL } from '../../src/lib/config/site'
import { PAGES } from '../../src/lib/i18n/pages'

describe('site metadata', () => {
  it('uses the current production domain', () => {
    expect(SITE_URL).toBe('https://solar-scope.vercel.app')
  })

  it('creates a canonical URL and its translation for each language', () => {
    const french = pageMetadata('/mars')
    expect(french.alternates?.canonical).toBe('/mars')
    expect(french.alternates?.languages).toEqual({ fr: '/mars', en: '/en/mars', 'x-default': '/mars' })
    expect(french.openGraph).toMatchObject({ url: '/mars', title: 'Mars et ses rovers', locale: 'fr_FR' })

    const english = pageMetadata('/mars', 'en')
    expect(english.alternates?.canonical).toBe('/en/mars')
    expect(english.openGraph).toMatchObject({ url: '/en/mars', title: 'Mars and its rovers', locale: 'en_GB' })
    expect(pageMetadata('/', 'en').alternates?.canonical).toBe('/en')
  })

  it('has a title and description in both languages for every page', () => {
    for (const texts of Object.values(PAGES)) {
      expect(texts.fr.title && texts.fr.description && texts.en.title && texts.en.description).toBeTruthy()
    }
  })
})
