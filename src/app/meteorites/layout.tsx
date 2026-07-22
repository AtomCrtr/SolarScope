import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Météorites', 'Comprends comment un morceau venu de l’espace devient une météorite sur Terre.', '/meteorites')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
