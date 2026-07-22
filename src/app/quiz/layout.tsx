import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Quiz spatial', 'Testez vos connaissances en astronomie avec trois niveaux.', '/quiz')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
