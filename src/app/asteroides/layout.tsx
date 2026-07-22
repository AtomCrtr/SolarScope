import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Astéroïdes proches de la Terre', 'Suivez les objets géocroiseurs recensés par le service NASA NeoWs.', '/asteroides')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
