import type { Metadata } from 'next'

const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL

export const SITE_URL = (
  configuredUrl ||
  (vercelProductionUrl ? `https://${vercelProductionUrl}` : 'https://solar-scope.vercel.app')
).replace(/\/$/, '')

export const SITE_NAME = 'SolarScope'
export const DEFAULT_DESCRIPTION =
  "Explore l’espace avec des visualisations interactives et des données issues de la NASA, de la NOAA et de partenaires scientifiques reconnus."

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
