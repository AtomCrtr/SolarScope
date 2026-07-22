import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('SolarBot', 'Un assistant pédagogique pour poser vos questions sur l’espace.', '/solarbot')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
