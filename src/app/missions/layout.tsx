import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Missions spatiales', 'Grandes missions historiques et prochains lancements actualisés.', '/missions')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
