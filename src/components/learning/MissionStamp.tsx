'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { completeMission, useLocalProgress, type MissionId } from '@/lib/client/local-progress'
import { ENGLISH_MISSION_CHECKS, MISSION_CHECKS } from '@/lib/content/mission-checks'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import { frenchNonBreakingSpaces } from '@/lib/content/typography'

const COPY = {
  fr: { kicker: 'Gagne ton tampon', hint: 'Réponds à une question sur la leçon pour tamponner ton passeport.', right: 'Bravo, c’est la bonne réponse !', wrong: 'Pas tout à fait…', retry: 'Tu peux réessayer, sans rien perdre.', stamped: 'Tampon ajouté à mon passeport', open: 'Voir mon passeport' },
  en: { kicker: 'Earn your stamp', hint: 'Answer one question about the lesson to stamp your passport.', right: 'Well done, that’s right!', wrong: 'Not quite…', retry: 'You can try again, you lose nothing.', stamped: 'Mission stamp saved in my passport', open: 'Open my passport' },
}

function StampMark() {
  return (
    <svg className="mission-stamp-mark" width="52" height="52" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="32" cy="32" r="21" stroke="currentColor" strokeWidth="2" />
      <path d="M22 33l7 7 14-15" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** The stamp is earned by answering a question on the lesson: a wrong answer shows the explanation, then the child tries again. */
export default function MissionStamp({ mission }: { mission: Exclude<MissionId, 'quiz'> }) {
  const locale = useSiteLocale()
  const progress = useLocalProgress()
  const [wrongChoices, setWrongChoices] = useState<number[]>([])
  const [justStamped, setJustStamped] = useState(false)
  const titleId = useId()
  const copy = COPY[locale]
  const check = (locale === 'en' ? ENGLISH_MISSION_CHECKS : MISSION_CHECKS)[mission]
  const text = (value: string) => (locale === 'en' ? value : frenchNonBreakingSpaces(value))

  if (progress?.completed[mission]) {
    return (
      <div className="mission-check is-stamped" role={justStamped ? 'status' : undefined}>
        <StampMark />
        <div>
          <strong>{justStamped ? copy.right : copy.stamped}</strong>
          {justStamped && <span>{copy.stamped}</span>}
          <Link href="/passeport">{copy.open}</Link>
        </div>
      </div>
    )
  }

  const choose = (index: number) => {
    if (index === check.answer) {
      setJustStamped(true)
      completeMission(mission)
    } else if (!wrongChoices.includes(index)) {
      setWrongChoices([...wrongChoices, index])
    }
  }

  return (
    <section className="mission-check" aria-labelledby={titleId}>
      <span className="kids-note-title">{copy.kicker}</span>
      <p className="mission-check-hint">{copy.hint}</p>
      <h3 id={titleId}>{text(check.question)}</h3>
      <div className="mission-check-choices">
        {check.choices.map((choice, index) => (
          <button
            key={choice}
            type="button"
            className={wrongChoices.includes(index) ? 'is-wrong' : undefined}
            aria-disabled={wrongChoices.includes(index) || undefined}
            onClick={() => choose(index)}
          >
            {text(choice)}
          </button>
        ))}
      </div>
      {wrongChoices.length > 0 && (
        <p className="mission-check-feedback" role="status">
          <strong>{copy.wrong}</strong> {text(check.explanation)} {copy.retry}
        </p>
      )}
    </section>
  )
}
