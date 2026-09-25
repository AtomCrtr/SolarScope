'use client'

import { formatCheckedOn, type SourceCadence } from '@/lib/data/source-registry'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

type DataSourceNoteProps = {
  source: string
  href: string
  refreshed?: string
  checkedOn?: string
  cadence?: SourceCadence
}

const COPY = {
  fr: { fallback: 'Source institutionnelle consultable', live: 'Donnée mise à jour', reference: 'Fait de référence', label: 'Source des données', from: 'Les chiffres de cette page viennent de', checked: 'vérifié le', colon: ' :' },
  en: { fallback: 'Official source you can check', live: 'Updated data', reference: 'Reference fact', label: 'Data source', from: 'The figures on this page come from', checked: 'checked on', colon: ':' },
}

export default function DataSourceNote({ source, href, refreshed, checkedOn, cadence = 'reference' }: DataSourceNoteProps) {
  const locale = useSiteLocale()
  const copy = COPY[locale]

  return (
    <aside className="source-note" aria-label={copy.label}>
      <span aria-hidden="true"><SpaceIcon name="search" size={18} className="inline-icon" /></span>
      <p>
        <strong>{cadence === 'live' ? copy.live : copy.reference}{copy.colon}</strong> {refreshed ?? copy.fallback}. {copy.from}{' '}
        <a href={href} target="_blank" rel="noopener noreferrer">{source}</a>
        {checkedOn && <> · {copy.checked} <time dateTime={checkedOn}>{formatCheckedOn(checkedOn, locale)}</time></>}.
      </p>
    </aside>
  )
}
