import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('ISS Tracker', 'Position récente de la Station spatiale internationale et équipage présent dans l’espace.', '/iss')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
