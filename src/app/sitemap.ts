import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

const routes = [
  '',
  '/actualites',
  '/asteroides',
  '/ciel',
  '/exoplanetes',
  '/iss',
  '/jwst',
  '/mars',
  '/meteorites',
  '/missions',
  '/photo-du-jour',
  '/planetes',
  '/quiz',
  '/solarbot',
  '/soleil',
  '/confidentialite',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
