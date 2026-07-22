import type { Metadata } from 'next'

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL = (
  configuredUrl ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'https://solar-scope.vercel.app')
).replace(/\/$/, '')

export const SITE_NAME = 'SolarScope'
export const DEFAULT_DESCRIPTION =
  "SolarScope explique l’espace aux enfants de 8 à 12 ans avec des missions, des images interactives et des données scientifiques vérifiées."

export function createPageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  const canonical = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
