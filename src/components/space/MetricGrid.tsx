'use client'

import { motion, useReducedMotion } from 'framer-motion'
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

export default function MetricGrid({ items, ariaLabel, className = '' }: MetricGridProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={`metric-grid ${className}`.trim()} role="group" aria-label={ariaLabel}>
      {items.map((item, index) => {
        const value = String(item.value)

        return (
          <motion.dl
            key={item.label}
            className={`card stat-card metric-card${item.icon ? ' has-icon' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : index * 0.05, ease: 'easeOut' }}
          >
            {item.icon && <dd className="metric-icon" aria-hidden="true">{item.icon}</dd>}
            <dt className="stat-label metric-label">{item.label}</dt>
            <dd
              className="stat-value metric-value"
              data-long-value={value.length > 12 || undefined}
              style={{ color: item.color, fontFamily: item.monospace ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined }}
            >
              {item.value}
            </dd>
          </motion.dl>
        )
      })}
    </div>
  )
}
