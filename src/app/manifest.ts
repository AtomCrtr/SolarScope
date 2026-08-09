import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SolarScope — L’espace expliqué aux enfants',
    short_name: 'SolarScope',
    description: 'Des missions simples pour comprendre l’espace de 8 à 12 ans.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#060614',
    theme_color: '#060614',
    lang: 'fr',
    categories: ['education', 'kids'],
    icons: [
      { src: '/solarscope-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/solarscope-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/solarscope-icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
