'use client'

import { useEffect, type ReactNode } from 'react'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

const SKIP_LINK = { fr: 'Aller au contenu principal', en: 'Skip to main content' }

/**
 * The root layout is shared by both languages, so <html lang> is prerendered as « fr ».
 * This wrapper gives the right lang to everything on the page from the first render, and fixes <html> once loaded.
 */
export default function LanguageScope({ children }: { children: ReactNode }) {
  const locale = useSiteLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <div lang={locale} style={{ display: 'contents' }}>
      <a href="#main-content" className="skip-link">{SKIP_LINK[locale]}</a>
      {children}
    </div>
  )
}
