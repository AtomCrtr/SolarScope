'use client'

import { useSyncExternalStore } from 'react'
import { completeMission, PROGRESS_EVENT, readLocalProgress, type MissionId } from '@/lib/local-progress'
import { useSiteLocale } from '@/components/LanguageToggle'

export default function MissionStamp({ mission }: { mission: MissionId }) {
  const locale = useSiteLocale()
  const completed = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(PROGRESS_EVENT, onStoreChange)
      return () => window.removeEventListener(PROGRESS_EVENT, onStoreChange)
    },
    () => Boolean(readLocalProgress().completed[mission]),
    () => false,
  )

  const markCompleted = () => {
    completeMission(mission)
  }

  return (
    <button type="button" className="mission-stamp" aria-pressed={completed} onClick={markCompleted}>
      {completed
        ? (locale === 'en' ? '✅ Mission saved in my passport' : '✅ Mission validée dans mon passeport')
        : (locale === 'en' ? '🏁 I finished this mission' : '🏁 J’ai terminé cette mission')}
    </button>
  )
}
