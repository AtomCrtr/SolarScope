import type { PublicSolarBotSource } from '@/lib/content/solarbot-sources'

export default function SolarBotSourceLinks({ sources, compact = false }: { sources?: PublicSolarBotSource[]; compact?: boolean }) {
  if (!sources?.length) return null

  return (
    <aside className={compact ? 'solarbot-sources is-compact' : 'solarbot-sources'} aria-label="Sources officielles de la réponse">
      <strong>Sources officielles</strong>
      <ul>
        {sources.map(source => (
          <li key={source.id}>
            <a href={source.href} target="_blank" rel="noopener noreferrer">
              {source.label}<span aria-hidden="true"> ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
