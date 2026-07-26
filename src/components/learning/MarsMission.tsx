'use client'

import { useState } from 'react'
import type { MarsRoverMission } from '@/lib/content/mars-data'

type MarsMissionProps = {
  rover: MarsRoverMission
  onChooseRover: (id: MarsRoverMission['id']) => void
}

export default function MarsMission({ rover, onChooseRover }: MarsMissionProps) {
  const [hintOpen, setHintOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)

  return (
    <section className="mars-mission" aria-labelledby="mars-mission-title" data-mars-mission>
      <div className="mars-mission-heading">
        <div>
          <span>MISSION ROVER · 4 MIN</span>
          <h2 id="mars-mission-title">Aide un rover à enquêter sur l’ancienne eau de Mars.</h2>
          <p>Choisis ton équipier, trouve son objectif, puis résous une question de scientifique.</p>
        </div>
        <p className="mars-mission-progress">1 rover · 1 indice · 1 réponse</p>
      </div>

      <div className="mars-mission-rovers" aria-label="Choisir un rover pour la mission">
        <button type="button" aria-pressed={rover.id === 'curiosity'} onClick={() => onChooseRover('curiosity')}>
          🤖 Curiosity
        </button>
        <button type="button" aria-pressed={rover.id === 'perseverance'} onClick={() => onChooseRover('perseverance')}>
          🚀 Perseverance
        </button>
      </div>

      <ol className="mars-mission-steps">
        <li>
          <strong>1. Son objectif</strong>
          <p>{rover.mission}</p>
        </li>
        <li>
          <strong>2. Son indice</strong>
          <p>{hintOpen ? rover.observation : 'Ouvre l’indice quand tu es prêt.'}</p>
          <button type="button" onClick={() => setHintOpen(value => !value)} aria-expanded={hintOpen}>
            {hintOpen ? 'Masquer l’indice' : 'Ouvrir l’indice'}
          </button>
        </li>
        <li>
          <strong>3. Ton défi</strong>
          <p>{rover.challenge}</p>
          <button type="button" onClick={() => setAnswerOpen(value => !value)} aria-expanded={answerOpen}>
            {answerOpen ? 'Masquer la réponse' : 'Vérifier ma réponse'}
          </button>
          {answerOpen && <p className="mars-mission-answer"><strong>Bravo, voici l’idée importante :</strong> {rover.answer}</p>}
        </li>
      </ol>
    </section>
  )
}
