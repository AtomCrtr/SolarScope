import type { Metadata } from 'next'
import ParentsContent from '@/components/pages/ParentsContent'
import { pageMetadata } from '@/lib/config/site'

export const metadata: Metadata = pageMetadata('/parents-enseignants', 'en')

export default function ParentsTeachersPage() {
  return <ParentsContent locale="en" />
}
