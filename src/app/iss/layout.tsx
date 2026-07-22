import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('ISS Tracker', 'Comprends comment l’ISS tourne autour de la Terre et suis sa position récente.', '/iss')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
