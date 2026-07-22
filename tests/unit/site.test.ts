import { describe, expect, it } from 'vitest'
import { createPageMetadata, SITE_URL } from '../../src/lib/site'

describe('site metadata', () => {
  it('uses the current production domain', () => {
    expect(SITE_URL).toBe('https://solar-scope.vercel.app')
  })

  it('creates a route-specific canonical URL', () => {
    const metadata = createPageMetadata('Mars', 'Explorer Mars', '/mars')
    expect(metadata.alternates?.canonical).toBe('/mars')
    expect(metadata.openGraph).toMatchObject({ url: '/mars', title: 'Mars' })
  })
})
