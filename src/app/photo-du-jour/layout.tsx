import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Photo astronomique du jour', 'La sélection Astronomy Picture of the Day de la NASA.', '/photo-du-jour')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
