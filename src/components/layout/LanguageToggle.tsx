'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localeFromPath, localizedHref, stripLocale, type SiteLocale } from '@/lib/i18n/paths'

export type { SiteLocale }

/** The language comes from the address: /soleil is French, /en/soleil is English. Works during prerendering too. */
export function useSiteLocale(): SiteLocale {
  return localeFromPath(usePathname())
}

/** Current page without its language prefix, to compare with « /soleil » whatever the language. */
export function usePagePath(): string {
  return stripLocale(usePathname() ?? '/')
}

export default function LanguageToggle() {
  const pathname = usePathname() ?? '/'
  const locale = localeFromPath(pathname)

  return (
    <nav className="locale-switcher" aria-label={locale === 'en' ? 'Language' : 'Langue'}>
      <Link href={localizedHref(pathname, 'fr')} hrefLang="fr" lang="fr" aria-current={locale === 'fr' ? 'page' : undefined} title="Français">
        FR
      </Link>
      <Link href={localizedHref(pathname, 'en')} hrefLang="en" lang="en" aria-current={locale === 'en' ? 'page' : undefined} title="English">
        EN
      </Link>
    </nav>
  )
}
