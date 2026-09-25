import type { Metadata } from 'next'
import SourcesContent from '@/components/pages/SourcesContent'
import { pageMetadata } from '@/lib/config/site'

export const metadata: Metadata = pageMetadata('/sources', 'en')

export default function SourcesPage() {
  return <SourcesContent locale="en" />
}
