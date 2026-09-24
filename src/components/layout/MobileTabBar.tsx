'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

const TABS: Array<{ href: string; icon: SpaceIconName; label: { fr: string; en: string } }> = [
  { href: '/', icon: 'home', label: { fr: 'Accueil', en: 'Home' } },
  { href: '/#parcours', icon: 'compass', label: { fr: 'Parcours', en: 'Paths' } },
  { href: '/passeport', icon: 'passport', label: { fr: 'Passeport', en: 'Passport' } },
  { href: '/quiz', icon: 'quiz', label: { fr: 'Quiz', en: 'Quiz' } },
]

/** Thumb-reachable navigation on phones; hidden from 721 px (see .mobile-tab-bar). */
export default function MobileTabBar() {
  const pathname = usePathname()
  const locale = useSiteLocale()

  return (
    <nav className="mobile-tab-bar" aria-label={locale === 'fr' ? 'Navigation rapide' : 'Quick navigation'}>
      {TABS.map(tab => {
        const active = tab.href === pathname
        return (
          <Link key={tab.href} href={tab.href} aria-current={active ? 'page' : undefined} className={active ? 'is-active' : undefined}>
            <SpaceIcon name={tab.icon} size={24} />
            <span>{tab.label[locale]}</span>
          </Link>
        )
      })}
    </nav>
  )
}
