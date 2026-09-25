'use client'

import { useEffect, useMemo, useState } from 'react'
import { LEARNING_TOPICS, type LearningTopicId } from '@/lib/content/learning-content'
import { ENGLISH_LEARNING_TOPICS } from '@/lib/content/learning-content.en'
import MissionStamp from '@/components/learning/MissionStamp'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import SpaceIcon, { type SpaceIconName } from '@/components/ui/SpaceIcon'
import { frenchNonBreakingSpaces } from '@/lib/content/typography'

type KidsGuideProps = {
  topic: LearningTopicId
}

type GuideSection = 'remember' | 'words' | 'challenge'

const GUIDE_SECTIONS: Array<{ id: GuideSection; fr: string; en: string; icon: SpaceIconName }> = [
  { id: 'remember', fr: 'À retenir', en: 'Remember', icon: 'bulb' },
  { id: 'words', fr: 'Mots utiles', en: 'Useful words', icon: 'book' },
  { id: 'challenge', fr: 'Défi express', en: 'Quick challenge', icon: 'target' },
]

export default function KidsGuide({ topic }: KidsGuideProps) {
  const locale = useSiteLocale()
  const lesson = locale === 'en' ? ENGLISH_LEARNING_TOPICS[topic] : LEARNING_TOPICS[topic]
  const [speaking, setSpeaking] = useState(false)
  const [juniorMode, setJuniorMode] = useState(false)
  const [activeSection, setActiveSection] = useState<GuideSection | null>('remember')
  const titleId = `kids-guide-${topic}`
  const visibleTakeaways = juniorMode ? lesson.takeaways.slice(0, 2) : lesson.takeaways
  const structuredData = useMemo(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.question,
    description: lesson.summary,
    inLanguage: locale === 'en' ? 'en' : 'fr',
    learningResourceType: locale === 'en' ? 'Interactive learning mission' : 'Mission éducative interactive',
    educationalLevel: locale === 'en' ? (juniorMode ? 'Ages 6–8' : 'Ages 9+') : (juniorMode ? '6–8 ans' : '9 ans et plus'),
    isAccessibleForFree: true,
  }).replace(/</g, '\\u003c'), [juniorMode, lesson, locale])

  const spokenText = useMemo(() => [
    lesson.question,
    lesson.summary,
    `${locale === 'en' ? 'Imagine' : 'Imagine'}: ${lesson.analogy}`,
    locale === 'en' ? 'Remember this.' : 'À retenir.',
    ...lesson.takeaways,
  ].join(' '), [lesson, locale])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`solarscope:guide:${topic}:section`)
      if (saved === 'closed') queueMicrotask(() => setActiveSection(null))
      if (GUIDE_SECTIONS.some(section => section.id === saved)) queueMicrotask(() => setActiveSection(saved as GuideSection))
    } catch {
      // Storage may be unavailable; the first step remains open.
    }
  }, [topic])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

  const selectSection = (section: GuideSection) => {
    const next = activeSection === section ? null : section
    setActiveSection(next)
    try {
      localStorage.setItem(`solarscope:guide:${topic}:section`, next ?? 'closed')
    } catch {
      // The guide still works when browser storage is disabled.
    }
  }

  const toggleJuniorMode = () => {
    setJuniorMode(value => !value)
    if (!juniorMode && activeSection === 'words') {
      setActiveSection('remember')
      try {
        localStorage.setItem(`solarscope:guide:${topic}:section`, 'remember')
      } catch {
        // The guide still works when browser storage is disabled.
      }
    }
  }

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) return
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(spokenText)
    utterance.lang = locale === 'en' ? 'en-US' : 'fr-FR'
    utterance.rate = 0.9
    utterance.pitch = 1.05
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  return (
    <section className="kids-guide" lang={locale === 'en' ? 'en' : undefined} aria-labelledby={titleId} data-learning-guide={topic}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <div className="kids-guide-heading">
        <div>
          <span className="kids-guide-label">{lesson.label} · {locale === 'en' ? (juniorMode ? 'AGES 6–8' : 'AGES 9+') : (juniorMode ? '6–8 ANS' : '9+ ANS')}</span>
          <h2 id={titleId}>{locale === 'en' ? lesson.question : frenchNonBreakingSpaces(lesson.question)}</h2>
        </div>
        <div className="kids-guide-actions">
          <button type="button" className="kids-mode-button" aria-pressed={juniorMode} onClick={toggleJuniorMode}>
            <SpaceIcon name={juniorMode ? 'rocket' : 'child'} size={18} />
            {juniorMode ? (locale === 'en' ? 'Full version' : 'Version complète') : (locale === 'en' ? 'Ages 6–8' : 'Mode 6–8 ans')}
          </button>
          <button type="button" className="kids-listen-button" aria-pressed={speaking} onClick={toggleSpeech}>
            <SpaceIcon name={speaking ? 'stop' : 'speaker'} size={18} />
            {speaking ? (locale === 'en' ? 'Stop' : 'Arrêter') : (locale === 'en' ? 'Listen' : 'Écouter')}
          </button>
        </div>
      </div>

      <p className="kids-guide-summary">{lesson.summary}</p>

      <nav className="kids-guide-toc" aria-label={locale === 'en' ? 'Mission steps' : 'Étapes de la mission'} data-guide-toc>
        <span>{locale === 'en' ? 'Mission path' : 'Parcours'}</span>
        <div>
          {GUIDE_SECTIONS.filter(section => !juniorMode || section.id !== 'words').map(section => (
            <button
              key={section.id}
              type="button"
              aria-controls={`${titleId}-${section.id}`}
              aria-expanded={activeSection === section.id}
              className={activeSection === section.id ? 'is-active' : undefined}
              onClick={() => selectSection(section.id)}
            >
              <SpaceIcon name={section.icon} size={18} />{locale === 'en' ? section.en : section.fr}
            </button>
          ))}
        </div>
      </nav>

      <div id={`${titleId}-remember`} className={`kids-progressive-panel${activeSection === 'remember' ? ' is-active' : ''}`} data-guide-section="remember">
        <div className="kids-analogy">
          <SpaceIcon name="bulb" size={28} className="kids-note-icon" />
          <div>
            <span className="kids-note-title">{locale === 'en' ? 'It’s like…' : 'C’est comme…'}</span>
            <p>{lesson.analogy}</p>
          </div>
        </div>

        <div className="kids-takeaways">
          <h3>{juniorMode ? (locale === 'en' ? '2 quick ideas' : '2 idées rapides') : (locale === 'en' ? '3 ideas to remember' : 'Les 3 idées à retenir')}</h3>
          <ol>
            {visibleTakeaways.map((takeaway, index) => (
              <li key={takeaway}><span>{index + 1}</span><p>{takeaway}</p></li>
            ))}
          </ol>
        </div>
      </div>

      {!juniorMode && <div id={`${titleId}-words`} className={`kids-progressive-panel${activeSection === 'words' ? ' is-active' : ''}`} data-guide-section="words">
        <div className="kids-glossary" aria-label={locale === 'en' ? 'Useful words' : 'Mots utiles'}>
          {lesson.glossary.map(item => (
            <div key={item.term}>
              <strong>{item.term}</strong>
              <span>{item.definition}</span>
            </div>
          ))}
        </div>

        <details className="kids-deep-dive">
          <summary><SpaceIcon name="telescope" size={18} />{locale === 'en' ? 'I want to go further' : 'Je veux aller plus loin'}</summary>
          <p>{lesson.deepDive}</p>
        </details>
      </div>}

      <div id={`${titleId}-challenge`} className={`kids-progressive-panel${activeSection === 'challenge' ? ' is-active' : ''}`} data-guide-section="challenge">
        <div className="kids-challenge">
          <SpaceIcon name="target" size={28} className="kids-note-icon" />
          <div>
            <span className="kids-note-title">{locale === 'en' ? 'Your challenge' : 'Ton défi'}</span>
            <p>{lesson.challenge}</p>
          </div>
        </div>

        <div className="kids-quick-mission" data-quick-mission>
          <div>
            <SpaceIcon name="clock" size={20} />
            <h3>{locale === 'en' ? '5-minute mission' : 'Mission express · 5 min'}</h3>
          </div>
          <ol>
            <li>{locale === 'en' ? 'Read the big question.' : 'Lis la grande question.'}</li>
            <li>{locale === 'en' ? 'Try one action or comparison.' : 'Essaie une action ou une comparaison.'}</li>
            <li>{locale === 'en' ? 'Tell someone one thing you discovered.' : 'Raconte une chose que tu as découverte.'}</li>
          </ol>
        </div>
      </div>

      {topic !== 'quiz' && <MissionStamp mission={topic} />}
    </section>
  )
}
