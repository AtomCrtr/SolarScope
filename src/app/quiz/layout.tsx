import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Quiz spatial', 'Teste ce que tu as compris grâce à des questions adaptées à ton niveau.', '/quiz')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
