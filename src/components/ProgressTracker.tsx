'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { type MissionId, visitMission } from '@/lib/local-progress'

const PATH_TO_MISSION: Record<string, MissionId> = {
  '/planetes': 'planetes',
  '/mars': 'mars',
  '/iss': 'iss',
  '/quiz': 'quiz',
}

export default function ProgressTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const mission = PATH_TO_MISSION[pathname]
    if (mission) visitMission(mission)
  }, [pathname])

  return null
}
