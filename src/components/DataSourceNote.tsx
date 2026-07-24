type DataSourceNoteProps = {
  source: string
  href: string
  refreshed?: string
}

export default function DataSourceNote({ source, href, refreshed = 'Source institutionnelle consultable' }: DataSourceNoteProps) {
  return (
    <aside className="source-note" aria-label="Source des données">
      <span aria-hidden="true">🔎</span>
      <p>
        <strong>Repère données :</strong> {refreshed}. Les chiffres de cette page viennent de{' '}
        <a href={href} target="_blank" rel="noopener noreferrer">{source}</a>.
      </p>
    </aside>
  )
}
