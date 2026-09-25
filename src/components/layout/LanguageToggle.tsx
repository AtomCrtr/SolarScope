'use client'

import { useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { readStorage, writeStorage } from '@/lib/client/safe-storage'

export type SiteLocale = 'fr' | 'en'

const STORAGE_KEY = 'solarscope-locale'
const LOCALE_EVENT = 'solarscope-locale-change'

function readLocale(): SiteLocale {
  return readStorage(STORAGE_KEY) === 'en' ? 'en' : 'fr'
}

function subscribeToLocale(onChange: () => void) {
  window.addEventListener(LOCALE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(LOCALE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function useSiteLocale(): SiteLocale {
  return useSyncExternalStore(subscribeToLocale, readLocale, () => 'fr')
}

export default function LanguageToggle() {
  const locale = useSiteLocale()
  const pathname = usePathname()

  const setLocale = (nextLocale: SiteLocale) => {
    writeStorage(STORAGE_KEY, nextLocale)
    document.documentElement.lang = nextLocale === 'en' && pathname === '/' ? 'en' : 'fr'
    window.dispatchEvent(new Event(LOCALE_EVENT))
  }

  return (
    <div className="locale-switcher" aria-label="Choisir la langue / Choose language">
      <button type="button" aria-pressed={locale === 'fr'} onClick={() => setLocale('fr')} title="Français">
        FR
      </button>
      <button type="button" aria-pressed={locale === 'en'} onClick={() => setLocale('en')} title="English preview — lessons are translated, page data is still in French">
        <span>EN</span><span className="locale-preview-mark" aria-hidden="true">β</span><span className="sr-only"> preview</span>
      </button>
    </div>
  )
}
