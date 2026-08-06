'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

export default function LanguageAvailabilityNotice() {
  const locale = useSiteLocale()
  const pathname = usePathname()

  if (locale !== 'en' || pathname === '/') return null

  return (
    <aside className="language-availability-notice" aria-label="English translation availability">
      <div>
        <strong>English preview</strong>
        <span>This detailed lesson is currently available in French. The English home page and navigation remain fully usable.</span>
      </div>
      <Link href="/">Back to the English home page</Link>
    </aside>
  )
}
