import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Actualités spatiales', 'Apprends à lire les nouvelles de l’espace et retrouve leur source officielle.', '/actualites')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
