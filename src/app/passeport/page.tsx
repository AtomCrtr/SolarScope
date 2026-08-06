import type { Metadata } from 'next'
import SpacePassport from '@/components/learning/SpacePassport'
import { createPageMetadata } from '@/lib/config/site'

export const metadata: Metadata = createPageMetadata(
  'Mon passeport spatial',
  'Les missions découvertes sur SolarScope, enregistrées uniquement sur cet appareil.',
  '/passeport',
)

export default function PassportPage() {
  return <div className="container prose-page"><header className="page-header"><div className="badge">🚀 MON ESPACE</div><h1 className="page-title gradient-text">Mon passeport spatial</h1><p className="page-subtitle">Garde la trace de tes missions sans créer de compte.</p></header><SpacePassport /></div>
}
