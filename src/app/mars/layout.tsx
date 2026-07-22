import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Mars et ses rovers', 'Pars sur Mars avec les rovers Curiosity et Perseverance et comprends leur mission.', '/mars')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
