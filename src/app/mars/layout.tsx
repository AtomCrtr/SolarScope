import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Mars et ses rovers', 'Explorez Mars, ses missions et les rovers Curiosity et Perseverance.', '/mars')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
