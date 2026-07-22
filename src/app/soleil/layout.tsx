import { createPageMetadata } from '@/lib/site'

export const metadata = createPageMetadata('Le Soleil et la météo spatiale', 'Comprends notre étoile et observe des images et mesures de la NASA et de la NOAA.', '/soleil')
export default function Layout({ children }: { children: React.ReactNode }) { return children }
