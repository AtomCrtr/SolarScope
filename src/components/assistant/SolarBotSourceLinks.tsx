import type { PublicSolarBotSource } from '@/lib/content/solarbot-sources'

export default function SolarBotSourceLinks({ sources, compact = false }: { sources?: PublicSolarBotSource[]; compact?: boolean }) {
  if (!sources?.length) return null

  return (
    <aside className={compact ? 'solarbot-sources is-compact' : 'solarbot-sources'} aria-label="Repères officiels associés à la réponse">
      <strong>Repères officiels</strong>
      <ul>
        {sources.map((source, index) => (
          <li key={source.id}>
            <a href={source.href} target="_blank" rel="noopener noreferrer">
              [{index + 1}] {source.label}<span aria-hidden="true"> ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function SolarBotReliabilityNote({ degraded, compact = false }: { degraded?: boolean; compact?: boolean }) {
  if (!degraded) return null

  return (
    <p className={compact ? 'solarbot-reliability is-compact' : 'solarbot-reliability'} role="status">
      <span aria-hidden="true">⚠️ </span>
      Réponse de secours : vérifie les repères officiels ci-dessous.
    </p>
  )
}
