import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config/site'

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
  '/passeport',
  '/parents-enseignants',
  '/quiz',
  '/solarbot',
  '/soleil',
  '/sources',
  '/confidentialite',
]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
