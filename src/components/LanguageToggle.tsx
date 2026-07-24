'use client'

import { useEffect, useState } from 'react'

export type SiteLocale = 'fr' | 'en'

const STORAGE_KEY = 'solarscope-locale'
const LOCALE_EVENT = 'solarscope-locale-change'

function readLocale(): SiteLocale {
  return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'fr'
}

export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>('fr')

  useEffect(() => {
    const update = () => setLocale(readLocale())
    update()
    window.addEventListener(LOCALE_EVENT, update)
    return () => window.removeEventListener(LOCALE_EVENT, update)
  }, [])

  return locale
}

export default function LanguageToggle() {
  const locale = useSiteLocale()

  const setLocale = (nextLocale: SiteLocale) => {
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
    document.documentElement.lang = nextLocale
    window.dispatchEvent(new Event(LOCALE_EVENT))
  }

  return (
    <div className="locale-switcher" aria-label="Choisir la langue / Choose language">
      <button type="button" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')} title="Français">
        FR
      </button>
      <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')} title="English">
        EN
      </button>
    </div>
  )
}
