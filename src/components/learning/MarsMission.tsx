'use client'

import { useState } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import type { MarsRoverMission } from '@/lib/content/mars-data'

type MarsMissionProps = {
  rover: MarsRoverMission
  onChooseRover: (id: MarsRoverMission['id']) => void
}

const COPY = {
  fr: {
    kicker: 'MISSION ROVER · 4 MIN', title: 'Aide un rover à enquêter sur l’ancienne eau de Mars.', intro: 'Choisis ton équipier, trouve son objectif, puis résous une question de scientifique.',
    progress: '1 rover · 1 indice · 1 réponse', choose: 'Choisir un rover pour la mission',
    goal: '1. Son objectif', hint: '2. Son indice', hintClosed: 'Ouvre l’indice quand tu es prêt.', hintOpen: 'Ouvrir l’indice', hintHide: 'Masquer l’indice',
    challenge: '3. Ton défi', check: 'Vérifier ma réponse', hideAnswer: 'Masquer la réponse', answer: 'Bravo, voici l’idée importante :',
  },
  en: {
    kicker: 'ROVER MISSION · 4 MIN', title: 'Help a rover investigate the ancient water of Mars.', intro: 'Choose your teammate, find its goal, then solve a scientist’s question.',
    progress: '1 rover · 1 clue · 1 answer', choose: 'Choose a rover for the mission',
    goal: '1. Its goal', hint: '2. Its clue', hintClosed: 'Open the clue when you are ready.', hintOpen: 'Open the clue', hintHide: 'Hide the clue',
    challenge: '3. Your challenge', check: 'Check my answer', hideAnswer: 'Hide the answer', answer: 'Well done, here is the key idea:',
  },
}

export default function MarsMission({ rover, onChooseRover }: MarsMissionProps) {
  const copy = COPY[useSiteLocale()]
  const [hintOpen, setHintOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)

  return (
    <section className="mars-mission" aria-labelledby="mars-mission-title" data-mars-mission>
      <div className="mars-mission-heading">
        <div>
          <span>{copy.kicker}</span>
          <h2 id="mars-mission-title">{copy.title}</h2>
          <p>{copy.intro}</p>
        </div>
        <p className="mars-mission-progress">{copy.progress}</p>
      </div>

      <div className="mars-mission-rovers" aria-label={copy.choose}>
        <button type="button" aria-pressed={rover.id === 'curiosity'} onClick={() => onChooseRover('curiosity')}>
          <SpaceIcon name="robot" size={18} className="inline-icon" /> Curiosity
        </button>
        <button type="button" aria-pressed={rover.id === 'perseverance'} onClick={() => onChooseRover('perseverance')}>
          <SpaceIcon name="rocket" size={18} className="inline-icon" /> Perseverance
        </button>
      </div>

      <ol className="mars-mission-steps">
        <li>
          <strong>{copy.goal}</strong>
          <p>{rover.mission}</p>
        </li>
        <li>
          <strong>{copy.hint}</strong>
          <p>{hintOpen ? rover.observation : copy.hintClosed}</p>
          <button type="button" onClick={() => setHintOpen(value => !value)} aria-expanded={hintOpen}>
            {hintOpen ? copy.hintHide : copy.hintOpen}
          </button>
        </li>
        <li>
          <strong>{copy.challenge}</strong>
          <p>{rover.challenge}</p>
          <button type="button" onClick={() => setAnswerOpen(value => !value)} aria-expanded={answerOpen}>
            {answerOpen ? copy.hideAnswer : copy.check}
          </button>
          {answerOpen && <p className="mars-mission-answer"><strong>{copy.answer}</strong> {rover.answer}</p>}
        </li>
      </ol>
    </section>
  )
}
