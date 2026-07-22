import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Le ciel ce soir', 'Apprends à reconnaître ce que tu peux observer dans le ciel ce soir.', '/ciel')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
