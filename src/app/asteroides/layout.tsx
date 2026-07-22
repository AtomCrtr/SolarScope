import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Astéroïdes proches de la Terre', 'Comprends ce qu’est un astéroïde et observe ceux suivis par la NASA.', '/asteroides')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
