import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Actualités spatiales', 'Les dernières publications de la NASA, actualisées régulièrement.', '/actualites')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
