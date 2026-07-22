import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Le ciel ce soir', 'Explorez le ciel visible depuis votre position avec Stellarium et les guides NASA.', '/ciel')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
