'use client'

import { useEffect, useMemo, useState } from 'react'
import { LEARNING_TOPICS, type LearningTopic, type LearningTopicId } from '@/lib/learning-content'
import MissionStamp from '@/components/MissionStamp'
import { useSiteLocale } from '@/components/LanguageToggle'

type KidsGuideProps = {
  topic: LearningTopicId
}

const ENGLISH_GUIDES: Partial<Record<LearningTopicId, LearningTopic>> = {
  planetes: { label: 'PLANET MISSION', question: 'Why are the eight planets so different?', summary: 'The eight planets travel around the Sun. The four closest planets are mostly rocky. The four farthest ones are giant worlds made mainly of gas or ice.', analogy: 'Imagine a huge race track: every planet travels in its own lane around the Sun.', takeaways: ['Our Solar System has eight planets.', 'A planet follows a regular path around the Sun.', 'Earth is the only planet where we know life exists.'], glossary: [{ term: 'Orbit', definition: 'The path an object follows around another object in space.' }, { term: 'Rocky planet', definition: 'A planet with solid ground, like Earth or Mars.' }], deepDive: 'Planets are not lined up perfectly and their paths are slightly oval. The farther a planet is from the Sun, the longer it takes to travel around it.', challenge: 'Choose two planets. Compare their size, temperature and number of moons.' },
  mars: { label: 'MARS MISSION', question: 'Why is Mars red?', summary: 'Mars has lots of iron in its soil. The iron reacted with oxygen and made rust-coloured dust. Martian winds spread that dust over almost the whole planet.', analogy: 'Mars is red for the same reason an old iron bicycle can become rusty.', takeaways: ['Mars is a rocky, cold and desert-like planet.', 'Its colour mostly comes from rusty dust.', 'Robots explore it before a possible human journey.'], glossary: [{ term: 'Rover', definition: 'A wheeled robot sent to explore another world.' }, { term: 'Atmosphere', definition: 'The layer of gas around a planet.' }], deepDive: 'Mars has a very thin atmosphere made mostly of carbon dioxide. It has water ice, but no evidence of life living there today has been found.', challenge: 'Look at a rover. Can you find the tools it uses to see, drive and study rocks?' },
  iss: { label: 'ISS MISSION', question: 'Why do astronauts float inside the ISS?', summary: 'The International Space Station keeps falling around Earth without reaching the ground. The station and the astronauts fall together, so they feel as if they float.', analogy: 'Imagine an elevator falling at the same time as you: your feet would no longer press against the floor.', takeaways: ['The ISS is a laboratory travelling around Earth.', 'It makes one trip around Earth in about 90 minutes.', 'Astronauts float because they are always in free fall.'], glossary: [{ term: 'Space station', definition: 'A livable laboratory built to work in space.' }, { term: 'Free fall', definition: 'Motion where gravity is the only force pulling an object.' }], deepDive: 'The ISS is about 400 km above Earth and travels close to 28,000 km/h. Gravity is still strong there, but the station moves fast enough to keep missing the ground.', challenge: 'Follow the ISS position and find which continent it is above right now.' },
  quiz: { label: 'QUIZ MISSION', question: 'Ready to check what you understood?', summary: 'Pick a level that feels right for you. After every answer, read the explanation: mistakes help your brain learn and remember next time.', analogy: 'A quiz is like sports practice: every try can make the next answer easier.', takeaways: ['Start with a level that feels comfortable.', 'Always read the explanation, even after a correct answer.', 'You can try again without losing points or being judged.'], glossary: [{ term: 'Hypothesis', definition: 'An idea we suggest before checking it.' }], deepDive: 'Explaining an answer in your own words helps you remember more than simply recognising the correct option.', challenge: 'After the quiz, explain the answer that surprised you most to someone else.' },
}

export default function KidsGuide({ topic }: KidsGuideProps) {
  const locale = useSiteLocale()
  const lesson = locale === 'en' ? ENGLISH_GUIDES[topic] || LEARNING_TOPICS[topic] : LEARNING_TOPICS[topic]
  const [speaking, setSpeaking] = useState(false)
  const titleId = `kids-guide-${topic}`

  const spokenText = useMemo(() => [
    lesson.question,
    lesson.summary,
    `${locale === 'en' ? 'Imagine' : 'Imagine'}: ${lesson.analogy}`,
    locale === 'en' ? 'Remember this.' : 'À retenir.',
    ...lesson.takeaways,
  ].join(' '), [lesson, locale])

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
    <section className="kids-guide" aria-labelledby={titleId} data-learning-guide={topic}>
      <div className="kids-guide-heading">
        <div>
          <span className="kids-guide-label">🧭 {lesson.label} · {locale === 'en' ? 'AGES 8–12' : '8–12 ANS'}</span>
          <h2 id={titleId}>{lesson.question}</h2>
        </div>
        <button
          type="button"
          className="kids-listen-button"
          aria-pressed={speaking}
          onClick={toggleSpeech}
        >
          {speaking ? (locale === 'en' ? '■ Stop' : '■ Arrêter') : (locale === 'en' ? '🔊 Listen' : '🔊 Écouter')}
        </button>
      </div>

      <p className="kids-guide-summary">{lesson.summary}</p>

      <div className="kids-analogy">
        <span aria-hidden="true">💭</span>
        <p><strong>{locale === 'en' ? 'Imagine:' : 'Imagine :'}</strong> {lesson.analogy}</p>
      </div>

      <div className="kids-takeaways">
        <h3>{locale === 'en' ? '3 ideas to remember' : 'Les 3 idées à retenir'}</h3>
        <ol>
          {lesson.takeaways.map((takeaway, index) => (
            <li key={takeaway}><span>{index + 1}</span><p>{takeaway}</p></li>
          ))}
        </ol>
      </div>

      <div className="kids-glossary" aria-label={locale === 'en' ? 'Useful words' : 'Mots utiles'}>
        {lesson.glossary.map(item => (
          <div key={item.term}>
            <strong>{item.term}</strong>
            <span>{item.definition}</span>
          </div>
        ))}
      </div>

      <details className="kids-deep-dive">
        <summary>{locale === 'en' ? '🔭 I want to go further' : '🔭 Je veux aller plus loin'}</summary>
        <p>{lesson.deepDive}</p>
      </details>

      <div className="kids-challenge">
        <span aria-hidden="true">🎯</span>
        <p><strong>{locale === 'en' ? 'Your turn:' : 'À toi de jouer :'}</strong> {lesson.challenge}</p>
      </div>

      {(topic === 'planetes' || topic === 'mars' || topic === 'iss') && <MissionStamp mission={topic} />}
    </section>
  )
}
