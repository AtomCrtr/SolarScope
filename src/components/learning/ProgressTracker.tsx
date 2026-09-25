'use client'

import { usePagePath } from '@/components/layout/LanguageToggle'
import { useEffect } from 'react'
import { type MissionId, visitMission } from '@/lib/client/local-progress'

const PATH_TO_MISSION: Record<string, MissionId> = {
  '/soleil': 'soleil',
  '/planetes': 'planetes',
  '/mars': 'mars',
  '/asteroides': 'asteroides',
  '/meteorites': 'meteorites',
  '/iss': 'iss',
  '/missions': 'missions',
  '/jwst': 'jwst',
  '/ciel': 'ciel',
  '/photo-du-jour': 'photo-du-jour',
  '/exoplanetes': 'exoplanetes',
  '/actualites': 'actualites',
  '/quiz': 'quiz',
  '/solarbot': 'solarbot',
}

export default function ProgressTracker() {
  const pathname = usePagePath()

  useEffect(() => {
    const mission = PATH_TO_MISSION[pathname]
    if (mission) visitMission(mission)
  }, [pathname])

  return null
}
