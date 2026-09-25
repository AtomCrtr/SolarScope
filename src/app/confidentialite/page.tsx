import type { Metadata } from 'next'
import PrivacyContent from '@/components/pages/PrivacyContent'
import { pageMetadata } from '@/lib/config/site'

export const metadata: Metadata = pageMetadata('/confidentialite')

export default function PrivacyPage() {
  return <PrivacyContent locale="fr" />
}
