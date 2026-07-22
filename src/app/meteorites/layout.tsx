import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Archive des météorites', 'Un échantillon cartographié du catalogue historique NASA Meteorite Landings.', '/meteorites')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
