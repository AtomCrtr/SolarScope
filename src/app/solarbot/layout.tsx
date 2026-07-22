import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('SolarBot', 'Pose une question sur l’espace et reçois une réponse courte avec les mots expliqués.', '/solarbot')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
