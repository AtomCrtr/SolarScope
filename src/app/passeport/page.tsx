import type { Metadata } from 'next'
import SpacePassport from '@/components/learning/SpacePassport'
import { pageMetadata } from '@/lib/config/site'

export const metadata: Metadata = pageMetadata('/passeport')

export default function PassportPage() {
  return <div className="container prose-page"><SpacePassport /></div>
}
