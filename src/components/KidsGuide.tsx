'use client'

import { useEffect, useMemo, useState } from 'react'
import { LEARNING_TOPICS, type LearningTopicId } from '@/lib/learning-content'

type KidsGuideProps = {
  topic: LearningTopicId
}

export default function KidsGuide({ topic }: KidsGuideProps) {
  const lesson = LEARNING_TOPICS[topic]
  const [speaking, setSpeaking] = useState(false)
  const titleId = `kids-guide-${topic}`

  const spokenText = useMemo(() => [
    lesson.question,
    lesson.summary,
    `Imagine : ${lesson.analogy}`,
    'À retenir.',
    ...lesson.takeaways,
  ].join(' '), [lesson])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(spokenText)
    utterance.lang = 'fr-FR'
    utterance.rate = 0.9
    utterance.pitch = 1.05
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  return (
    <section className="kids-guide" aria-labelledby={titleId} data-learning-guide={topic}>
      <div className="kids-guide-heading">
        <div>
          <span className="kids-guide-label">🧭 {lesson.label} · 8–12 ANS</span>
          <h2 id={titleId}>{lesson.question}</h2>
        </div>
        <button
          type="button"
          className="kids-listen-button"
          aria-pressed={speaking}
          onClick={toggleSpeech}
        >
          {speaking ? '■ Arrêter' : '🔊 Écouter'}
        </button>
      </div>

      <p className="kids-guide-summary">{lesson.summary}</p>

      <div className="kids-analogy">
        <span aria-hidden="true">💭</span>
        <p><strong>Imagine :</strong> {lesson.analogy}</p>
      </div>

      <div className="kids-takeaways">
        <h3>Les 3 idées à retenir</h3>
        <ol>
          {lesson.takeaways.map((takeaway, index) => (
            <li key={takeaway}><span>{index + 1}</span><p>{takeaway}</p></li>
          ))}
        </ol>
      </div>

      <div className="kids-glossary" aria-label="Mots utiles">
        {lesson.glossary.map(item => (
          <div key={item.term}>
            <strong>{item.term}</strong>
            <span>{item.definition}</span>
          </div>
        ))}
      </div>

      <details className="kids-deep-dive">
        <summary>🔭 Je veux aller plus loin</summary>
        <p>{lesson.deepDive}</p>
      </details>

      <div className="kids-challenge">
        <span aria-hidden="true">🎯</span>
        <p><strong>À toi de jouer :</strong> {lesson.challenge}</p>
      </div>
    </section>
  )
}
