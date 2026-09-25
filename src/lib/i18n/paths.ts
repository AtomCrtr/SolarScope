export type SiteLocale = 'fr' | 'en'

// French lives at the root (/soleil), English under /en (/en/soleil).
export const ENGLISH_PREFIX = '/en'

export function localeFromPath(pathname: string | null | undefined): SiteLocale {
  return pathname === ENGLISH_PREFIX || pathname?.startsWith(`${ENGLISH_PREFIX}/`) ? 'en' : 'fr'
}

/** The same page without its language prefix: « /en/soleil » → « /soleil ». */
export function stripLocale(pathname: string): string {
  if (pathname === ENGLISH_PREFIX) return '/'
  return pathname.startsWith(`${ENGLISH_PREFIX}/`) ? pathname.slice(ENGLISH_PREFIX.length) : pathname
}

/** Internal link in the wanted language. External links, anchors and API routes are left untouched. */
export function localizedHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('/api/') || href.startsWith('/_next/')) return href
  const [path, suffix = ''] = splitSuffix(href)
  const base = stripLocale(path)
  if (locale === 'fr') return `${base}${suffix}`
  return `${base === '/' ? ENGLISH_PREFIX : `${ENGLISH_PREFIX}${base}`}${suffix}`
}

function splitSuffix(href: string): [string, string?] {
  const index = href.search(/[?#]/)
  return index === -1 ? [href] : [href.slice(0, index), href.slice(index)]
}
