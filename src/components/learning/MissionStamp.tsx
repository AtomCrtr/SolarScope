'use client'

import { useSyncExternalStore } from 'react'
import { completeMission, PROGRESS_EVENT, readLocalProgress, type MissionId } from '@/lib/client/local-progress'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

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
      {completed && (
        <svg className="mission-stamp-mark" width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeDasharray="4 3" />
          <circle cx="32" cy="32" r="21" stroke="currentColor" strokeWidth="2" />
          <path d="M22 33l7 7 14-15" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      <span>
        {completed
          ? (locale === 'en' ? 'Mission stamp saved in my passport' : 'Tampon ajouté à mon passeport')
          : (locale === 'en' ? 'I finished this mission' : 'J’ai terminé cette mission')}
      </span>
    </button>
  )
}
