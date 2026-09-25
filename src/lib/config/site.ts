import type { Metadata } from 'next'
import { PAGES } from '@/lib/i18n/pages'
import { localizedHref, type SiteLocale } from '@/lib/i18n/paths'

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL = (
  configuredUrl ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'https://solar-scope.vercel.app')
).replace(/\/$/, '')

export const SITE_NAME = 'SolarScope'
export const DEFAULT_DESCRIPTION =
  "SolarScope explique l’espace aux enfants de 6 à 12 ans et aux curieux de 12+ avec des missions, des images interactives et des données scientifiques vérifiées."

/** Title, description, canonical address and the matching page in the other language (hreflang). */
export function pageMetadata(pathname: string, locale: SiteLocale = 'fr'): Metadata {
  const text = PAGES[pathname]?.[locale] ?? PAGES['/'][locale]
  const canonical = localizedHref(pathname, locale)
  const title = pathname === '/' ? { absolute: text.title } : text.title

  return {
    title,
    description: text.description,
    alternates: {
      canonical,
      languages: { fr: localizedHref(pathname, 'fr'), en: localizedHref(pathname, 'en'), 'x-default': localizedHref(pathname, 'fr') },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_GB' : 'fr_FR',
      alternateLocale: locale === 'en' ? 'fr_FR' : 'en_GB',
      url: canonical,
      siteName: SITE_NAME,
      title: text.title,
      description: text.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: text.title,
      description: text.description,
    },
  }
}
