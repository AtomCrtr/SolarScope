'use client'

import { setDisplayChoice, useLightMode } from '@/lib/client/light-mode'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

/** Lets anyone switch the 3D scenes off (or back on), whatever the automatic detection decided. */
export default function LightModeToggle() {
  const locale = useSiteLocale()
  const mode = useLightMode()
  if (mode === null) return null
  const light = mode !== 'full'
  return (
    <button type="button" className="light-mode-toggle" aria-pressed={light} onClick={() => setDisplayChoice(light ? 'full' : 'light')}>
      {locale === 'en' ? `Light mode (no 3D): ${light ? 'on' : 'off'}` : `Mode léger (sans 3D) : ${light ? 'activé' : 'désactivé'}`}
    </button>
  )
}
