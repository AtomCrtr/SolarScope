import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Missions spatiales', 'Découvre pourquoi les humains envoient des sondes, des robots et des astronautes.', '/missions')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
