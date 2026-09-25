'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { clearLocalProgress, PROGRESS_EVENT, readLocalProgress, type LocalProgress, type MissionId } from '@/lib/client/local-progress'
import { SITE_URL } from '@/lib/config/site'
import Cosmo from '@/components/learning/Cosmo'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'

const MISSIONS: Array<{ id: MissionId; icon: SpaceIconName; title: string; href: string; text: string }> = [
  { id: 'soleil', icon: 'sun', title: 'Soleil', href: '/soleil', text: 'Comprends notre étoile et la météo spatiale.' },
  { id: 'planetes', icon: 'planet', title: 'Planètes', href: '/planetes', text: 'Compare les mondes autour du Soleil.' },
  { id: 'mars', icon: 'mars', title: 'Mars', href: '/mars', text: 'Découvre les rovers et la planète rouge.' },
  { id: 'asteroides', icon: 'asteroid', title: 'Astéroïdes', href: '/asteroides', text: 'Repère les petits mondes proches de la Terre.' },
  { id: 'meteorites', icon: 'meteorite', title: 'Météorites', href: '/meteorites', text: 'Suis les roches venues de l’espace.' },
  { id: 'iss', icon: 'satellite', title: 'ISS', href: '/iss', text: 'Suis le laboratoire qui tourne autour de la Terre.' },
  { id: 'missions', icon: 'rocket', title: 'Missions', href: '/missions', text: 'Parcours les grandes étapes de l’exploration.' },
  { id: 'jwst', icon: 'telescope', title: 'Webb', href: '/jwst', text: 'Décrypte les images du télescope Webb.' },
  { id: 'ciel', icon: 'moon-stars', title: 'Ciel', href: '/ciel', text: 'Prépare une observation depuis ta zone.' },
  { id: 'photo-du-jour', icon: 'camera', title: 'Photo du jour', href: '/photo-du-jour', text: 'Lis une image scientifique de la NASA.' },
  { id: 'exoplanetes', icon: 'exoplanet', title: 'Exoplanètes', href: '/exoplanetes', text: 'Découvre comment trouver les mondes lointains.' },
  { id: 'actualites', icon: 'news', title: 'Actualités', href: '/actualites', text: 'Apprends à vérifier une nouvelle spatiale.' },
  { id: 'quiz', icon: 'quiz', title: 'Quiz', href: '/quiz', text: 'Teste ce que tu as retenu.' },
  { id: 'solarbot', icon: 'bulb', title: 'SolarBot', href: '/solarbot', text: 'Pose une question et vérifie les sources.' },
]

function StampMark() {
  return (
    <svg className="passport-stamp" width="40" height="40" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="32" cy="32" r="21" stroke="currentColor" strokeWidth="2" />
      <path d="M22 33l7 7 14-15" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const completedOn = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export default function SpacePassport() {
  const [progress, setProgress] = useState<LocalProgress>({ visited: {}, completed: {} })
  const [shareStatus, setShareStatus] = useState<string | null>(null)

  useEffect(() => {
    const refresh = () => setProgress(readLocalProgress())
    refresh()
    window.addEventListener(PROGRESS_EVENT, refresh)
    return () => window.removeEventListener(PROGRESS_EVENT, refresh)
  }, [])

  const completedCount = MISSIONS.filter(mission => progress.completed[mission.id]).length

  // Only the number of missions is shared: no name, no date, no device data.
  const share = async () => {
    const text = `J’ai validé ${completedCount} mission${completedCount > 1 ? 's' : ''} sur ${MISSIONS.length} dans mon passeport spatial SolarScope !`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mon passeport spatial', text, url: SITE_URL })
        return
      }
      await navigator.clipboard.writeText(`${text} ${SITE_URL}`)
      setShareStatus('Message copié : tu peux le coller où tu veux.')
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setShareStatus('Le partage n’est pas disponible sur cet appareil.')
    }
  }

  return (
    <section className="passport card" aria-labelledby="passport-title">
      <div className="passport-print-header" aria-hidden="true">
        <strong>Passeport spatial SolarScope</strong>
        <span>Nom de l’explorateur ou de l’exploratrice : ______________________________</span>
      </div>
      <div className="passport-heading">
        <div><span className="section-kicker">MON PASSEPORT SPATIAL</span><h2 id="passport-title">{completedCount}/{MISSIONS.length} missions validées</h2></div>
        <Cosmo className="passport-cosmo" />
      </div>
      <p>Ce passeport reste uniquement sur cet appareil. Aucun compte, nom ou résultat n’est envoyé à SolarScope.</p>
      <div className="passport-grid">
        {MISSIONS.map(mission => {
          const completedAt = progress.completed[mission.id]
          return <Link key={mission.id} href={mission.href} className={completedAt ? 'passport-mission is-complete' : 'passport-mission'}>
            {completedAt ? <StampMark /> : <span className="passport-mission-icon"><SpaceIcon name={mission.icon} size={24} /></span>}
            <div>
              <strong>{mission.title}</strong>
              <small>{completedAt ? `Tampon obtenu le ${completedOn(completedAt)}` : mission.text}</small>
            </div>
          </Link>
        })}
      </div>
      {progress.bestQuizScore !== undefined && <p className="passport-score">Meilleur score au quiz : {progress.bestQuizScore}%</p>}
      <div className="passport-actions">
        <button type="button" className="btn-primary" onClick={() => window.print()}>Imprimer mon passeport</button>
        <button type="button" className="btn-ghost" onClick={share}>Partager ma progression</button>
      </div>
      {shareStatus && <p className="passport-share-status" role="status">{shareStatus}</p>}
      <button type="button" className="passport-reset" onClick={() => { clearLocalProgress(); setProgress({ visited: {}, completed: {} }) }}>Effacer mon passeport de cet appareil</button>
    </section>
  )
}
