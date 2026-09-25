import type { Metadata } from 'next'
import SpacePassport from '@/components/learning/SpacePassport'
import { createPageMetadata } from '@/lib/config/site'

export const metadata: Metadata = createPageMetadata(
  'Mon passeport spatial',
  'Les missions découvertes sur SolarScope, enregistrées uniquement sur cet appareil.',
  '/passeport',
)

export default function PassportPage() {
  return <div className="container prose-page"><SpacePassport /></div>
}
