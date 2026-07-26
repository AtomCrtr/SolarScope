import { createPageMetadata } from '@/lib/config/site'

export const metadata = createPageMetadata('Exoplanètes', 'Découvre les planètes qui tournent autour d’autres étoiles que le Soleil.', '/exoplanetes')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
