'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clearLocalProgress, PROGRESS_EVENT, readLocalProgress, type LocalProgress, type MissionId } from '@/lib/client/local-progress'

const MISSIONS: Array<{ id: MissionId; emoji: string; title: string; href: string; text: string }> = [
  { id: 'soleil', emoji: '☀️', title: 'Soleil', href: '/soleil', text: 'Comprends notre étoile et la météo spatiale.' },
  { id: 'planetes', emoji: '🪐', title: 'Planètes', href: '/planetes', text: 'Compare les mondes autour du Soleil.' },
  { id: 'mars', emoji: '🔴', title: 'Mars', href: '/mars', text: 'Découvre les rovers et la planète rouge.' },
  { id: 'asteroides', emoji: '☄️', title: 'Astéroïdes', href: '/asteroides', text: 'Repère les petits mondes proches de la Terre.' },
  { id: 'meteorites', emoji: '🪨', title: 'Météorites', href: '/meteorites', text: 'Suis les roches venues de l’espace.' },
  { id: 'iss', emoji: '🛰️', title: 'ISS', href: '/iss', text: 'Suis le laboratoire qui tourne autour de la Terre.' },
  { id: 'missions', emoji: '🚀', title: 'Missions', href: '/missions', text: 'Parcours les grandes étapes de l’exploration.' },
  { id: 'jwst', emoji: '🔭', title: 'Webb', href: '/jwst', text: 'Décrypte les images du télescope Webb.' },
  { id: 'ciel', emoji: '🌌', title: 'Ciel', href: '/ciel', text: 'Prépare une observation depuis ta zone.' },
  { id: 'photo-du-jour', emoji: '🌠', title: 'Photo du jour', href: '/photo-du-jour', text: 'Lis une image scientifique de la NASA.' },
  { id: 'exoplanetes', emoji: '🌟', title: 'Exoplanètes', href: '/exoplanetes', text: 'Découvre comment trouver les mondes lointains.' },
  { id: 'actualites', emoji: '📰', title: 'Actualités', href: '/actualites', text: 'Apprends à vérifier une nouvelle spatiale.' },
  { id: 'quiz', emoji: '🎮', title: 'Quiz', href: '/quiz', text: 'Teste ce que tu as retenu.' },
  { id: 'solarbot', emoji: '🤖', title: 'SolarBot', href: '/solarbot', text: 'Pose une question et vérifie les sources.' },
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
        <div><span className="section-kicker">MON PASSEPORT SPATIAL</span><h2 id="passport-title">{completedCount}/{MISSIONS.length} missions validées</h2></div>
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
