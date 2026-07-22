import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Photo astronomique du jour', 'Observe une image choisie par la NASA et apprends à regarder les indices scientifiques.', '/photo-du-jour')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
