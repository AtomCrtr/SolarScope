import type { ReactNode } from 'react'

export interface MetricItem {
  label: string
  value: string | number
  icon?: ReactNode
  color?: string
  monospace?: boolean
}

interface MetricGridProps {
  items: MetricItem[]
  ariaLabel: string
  className?: string
}

// No entrance animation: key figures must be readable as soon as the page loads,
// including further down the page and before JavaScript runs.
export default function MetricGrid({ items, ariaLabel, className = '' }: MetricGridProps) {
  return (
    <div className={`metric-grid ${className}`.trim()} role="group" aria-label={ariaLabel}>
      {items.map(item => {
        const value = String(item.value)

        return (
          <dl key={item.label} className={`card stat-card metric-card${item.icon ? ' has-icon' : ''}`}>
            {item.icon && <dd className="metric-icon" aria-hidden="true">{item.icon}</dd>}
            <dt className="stat-label metric-label">{item.label}</dt>
            <dd
              className="stat-value metric-value"
              data-long-value={value.length > 12 || undefined}
              style={{ color: item.color, fontFamily: item.monospace ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined }}
            >
              {item.value}
            </dd>
          </dl>
        )
      })}
    </div>
  )
}
