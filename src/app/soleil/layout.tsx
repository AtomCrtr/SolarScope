import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Le Soleil et la météo spatiale', 'Images solaires et mesures de météo spatiale issues de la NASA et de la NOAA.', '/soleil')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
