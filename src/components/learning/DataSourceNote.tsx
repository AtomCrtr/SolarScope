import { formatCheckedOn, type SourceCadence } from '@/lib/data/source-registry'

type DataSourceNoteProps = {
  source: string
  href: string
  refreshed?: string
  checkedOn?: string
  cadence?: SourceCadence
}

export default function DataSourceNote({
  source,
  href,
  refreshed = 'Source institutionnelle consultable',
  checkedOn,
  cadence = 'reference',
}: DataSourceNoteProps) {
  const dataLabel = cadence === 'live' ? 'Donnée mise à jour' : 'Fait de référence'

  return (
    <aside className="source-note" aria-label="Source des données">
      <span aria-hidden="true">🔎</span>
      <p>
        <strong>{dataLabel} :</strong> {refreshed}. Les chiffres de cette page viennent de{' '}
        <a href={href} target="_blank" rel="noopener noreferrer">{source}</a>
        {checkedOn && <> · vérifié le <time dateTime={checkedOn}>{formatCheckedOn(checkedOn)}</time></>}.
      </p>
    </aside>
  )
}
