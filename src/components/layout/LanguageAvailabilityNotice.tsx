'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const FULLY_TRANSLATED = new Set(['/', '/passeport'])

export default function LanguageAvailabilityNotice() {
  const locale = useSiteLocale()
  const pathname = usePathname()

  // These pages are fully translated; elsewhere only the lesson card is.
  const fullyTranslated = FULLY_TRANSLATED.has(pathname)

  useEffect(() => {
    document.documentElement.lang = locale === 'en' && fullyTranslated ? 'en' : 'fr'
  }, [locale, fullyTranslated])

  if (locale !== 'en' || fullyTranslated) return null

  return (
    <aside className="language-availability-notice" aria-label="English translation availability">
      <div>
        <strong>English preview</strong>
        <span>The lesson card on this page is in English. The rest of the page (data, maps and activities) is still in French while the translation is being reviewed.</span>
      </div>
      <Link href="/">Back to the English home page</Link>
    </aside>
  )
}
