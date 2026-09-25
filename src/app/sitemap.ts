import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config/site'
import { PAGE_PATHS } from '@/lib/i18n/pages'
import { localizedHref, type SiteLocale } from '@/lib/i18n/paths'

// Every page in both languages, each entry pointing to its translation (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string, locale: SiteLocale) => `${SITE_URL}${localizedHref(path, locale) === '/' ? '' : localizedHref(path, locale)}`
  return (['fr', 'en'] as const).flatMap(locale =>
    PAGE_PATHS.map(path => ({
      url: url(path, locale),
      changeFrequency: path === '/' ? 'daily' as const : 'weekly' as const,
      priority: path === '/' ? 1 : 0.8,
      alternates: { languages: { fr: url(path, 'fr'), en: url(path, 'en') } },
    })),
  )
}
