'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clearLocalProgress, PROGRESS_EVENT, readLocalProgress, type LocalProgress, type MissionId } from '@/lib/local-progress'

const MISSIONS: Array<{ id: MissionId; emoji: string; title: string; href: string; text: string }> = [
  { id: 'planetes', emoji: '🪐', title: 'Planètes', href: '/planetes', text: 'Compare les mondes autour du Soleil.' },
  { id: 'mars', emoji: '🔴', title: 'Mars', href: '/mars', text: 'Découvre les rovers et la planète rouge.' },
  { id: 'iss', emoji: '🛰️', title: 'ISS', href: '/iss', text: 'Suis le laboratoire qui tourne autour de la Terre.' },
  { id: 'quiz', emoji: '🎮', title: 'Quiz', href: '/quiz', text: 'Teste ce que tu as retenu.' },
]

export default function SpacePassport() {
  const [progress, setProgress] = useState<LocalProgress>({ visited: {}, completed: {} })

  useEffect(() => {
    const refresh = () => setProgress(readLocalProgress())
    refresh()
    window.addEventListener(PROGRESS_EVENT, refresh)
    return () => window.removeEventListener(PROGRESS_EVENT, refresh)
  }, [])

  const completedCount = MISSIONS.filter(mission => progress.completed[mission.id]).length

  return (
    <section className="passport card" aria-labelledby="passport-title">
      <div className="passport-heading">
        <div><span className="section-kicker">MON PASSEPORT SPATIAL</span><h2 id="passport-title">{completedCount}/4 missions validées</h2></div>
        <span aria-hidden="true" className="passport-badge">🚀</span>
      </div>
      <p>Ce passeport reste uniquement sur cet appareil. Aucun compte, nom ou résultat n’est envoyé à SolarScope.</p>
      <div className="passport-grid">
        {MISSIONS.map(mission => {
          const complete = Boolean(progress.completed[mission.id])
          return <Link key={mission.id} href={mission.href} className={complete ? 'passport-mission is-complete' : 'passport-mission'}>
            <span>{complete ? '✅' : mission.emoji}</span><div><strong>{mission.title}</strong><small>{complete ? 'Badge gagné !' : mission.text}</small></div>
          </Link>
        })}
      </div>
      {progress.bestQuizScore !== undefined && <p className="passport-score">Meilleur score au quiz : {progress.bestQuizScore}%</p>}
      <button type="button" className="passport-reset" onClick={() => { clearLocalProgress(); setProgress({ visited: {}, completed: {} }) }}>Effacer mon passeport de cet appareil</button>
    </section>
  )
}
