import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SolarScope — Explorer l’Univers',
    short_name: 'SolarScope',
    description: 'Exploration spatiale interactive et données scientifiques actualisées.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060614',
    theme_color: '#060614',
    lang: 'fr',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  }
}
