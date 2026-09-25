'use client'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

export default function PrintableGuidesButton() {
  const locale = useSiteLocale()
  return (
    <button
      type="button"
      className="parent-print-button"
      onClick={() => window.print()}
      data-printable-guides
    >
      <SpaceIcon name="print" size={18} className="inline-icon" /> {locale === 'en' ? 'Print the quick guides' : 'Imprimer les fiches express'}
    </button>
  )
}
