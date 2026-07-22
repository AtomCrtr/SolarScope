import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SolarScope — L’espace expliqué aux enfants',
    short_name: 'SolarScope',
    description: 'Des missions simples pour comprendre l’espace de 8 à 12 ans.',
    start_url: '/',
    display: 'standalone',
    background_color: '#060614',
    theme_color: '#060614',
    lang: 'fr',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  }
}
