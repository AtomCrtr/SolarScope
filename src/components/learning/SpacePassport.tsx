'use client'

import Link from 'next/link'
import { useState } from 'react'
import { clearLocalProgress, useLocalProgress, type LocalProgress, type MissionId } from '@/lib/client/local-progress'
import { SITE_URL } from '@/lib/config/site'
import { missionState, nextMission, passportRank, PASSPORT_MISSIONS, type MissionState } from '@/lib/content/passport'
import Cosmo from '@/components/learning/Cosmo'
import PassportTransfer from '@/components/learning/PassportTransfer'
import { useSiteLocale } from '@/components/layout/LanguageToggle'
import SpaceIcon from '@/components/ui/SpaceIcon'

const EMPTY: LocalProgress = { visited: {}, completed: {} }

const COPY = {
  fr: {
    badge: 'MON ESPACE',
    title: 'Mon passeport spatial',
    subtitle: 'Garde la trace de tes missions sans créer de compte.',
    kicker: 'MON PASSEPORT SPATIAL',
    stamps: (count: number, total: number) => `${count}/${total} tampon${count > 1 ? 's' : ''}`,
    rank: 'Ton grade',
    toNext: (missing: number, title: string) => `Encore ${missing} tampon${missing > 1 ? 's' : ''} pour devenir ${title}.`,
    maxRank: 'Tu as tamponné toutes les missions. Bravo !',
    privacy: 'Ce passeport reste uniquement sur cet appareil. Aucun compte, nom ou résultat n’est envoyé à SolarScope.',
    next: 'Prochaine mission conseillée',
    allDone: 'Toutes les missions sont tamponnées !',
    gridLabel: 'Tampons des missions',
    states: { stamped: 'Tamponnée', visited: 'Visitée', new: 'À découvrir' } as Record<MissionState, string>,
    stampedOn: (date: string) => `Tamponnée le ${date}`,
    visitedHint: 'Réponds à la question en bas de la leçon pour obtenir le tampon.',
    go: 'Aller à la mission',
    quizScore: (score: number) => `Meilleur score au quiz : ${score} %`,
    print: 'Imprimer mon passeport',
    share: 'Partager ma progression',
    shareTitle: 'Mon passeport spatial',
    shareText: (count: number, total: number) => `J’ai ${count} tampon${count > 1 ? 's' : ''} sur ${total} dans mon passeport spatial SolarScope !`,
    copied: 'Message copié : tu peux le coller où tu veux.',
    noShare: 'Le partage n’est pas disponible sur cet appareil.',
    reset: 'Effacer mon passeport de cet appareil',
    confirm: 'Tout effacer ? Tes tampons disparaîtront de cet appareil. Pense à noter ton code de transfert avant.',
    confirmYes: 'Oui, tout effacer',
    cancel: 'Annuler',
    printName: 'Nom de l’explorateur ou de l’exploratrice : ______________________________',
    dateLocale: 'fr-FR',
  },
  en: {
    badge: 'MY SPACE',
    title: 'My space passport',
    subtitle: 'Keep track of your missions without creating an account.',
    kicker: 'MY SPACE PASSPORT',
    stamps: (count: number, total: number) => `${count}/${total} stamp${count === 1 ? '' : 's'}`,
    rank: 'Your rank',
    toNext: (missing: number, title: string) => `${missing} more stamp${missing === 1 ? '' : 's'} to become ${title}.`,
    maxRank: 'You stamped every mission. Well done!',
    privacy: 'This passport stays on this device only. No account, name or result is sent to SolarScope.',
    next: 'Suggested next mission',
    allDone: 'Every mission is stamped!',
    gridLabel: 'Mission stamps',
    states: { stamped: 'Stamped', visited: 'Visited', new: 'To discover' } as Record<MissionState, string>,
    stampedOn: (date: string) => `Stamped on ${date}`,
    visitedHint: 'Answer the question at the end of the lesson to get the stamp.',
    go: 'Go to the mission',
    quizScore: (score: number) => `Best quiz score: ${score}%`,
    print: 'Print my passport',
    share: 'Share my progress',
    shareTitle: 'My space passport',
    shareText: (count: number, total: number) => `I have ${count} stamp${count === 1 ? '' : 's'} out of ${total} in my SolarScope space passport!`,
    copied: 'Message copied: you can paste it anywhere.',
    noShare: 'Sharing is not available on this device.',
    reset: 'Erase my passport from this device',
    confirm: 'Erase everything? Your stamps will disappear from this device. Write down your transfer code first.',
    confirmYes: 'Yes, erase everything',
    cancel: 'Cancel',
    printName: 'Explorer’s name: ______________________________',
    dateLocale: 'en-GB',
  },
}

function StampMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="passport-stamp" width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="32" cy="32" r="21" stroke="currentColor" strokeWidth="2" />
      <path d="M22 33l7 7 14-15" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SpacePassport() {
  const locale = useSiteLocale()
  const copy = COPY[locale]
  const stored = useLocalProgress()
  const progress = stored ?? EMPTY
  const ready = stored !== null
  const [selected, setSelected] = useState<MissionId | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const total = PASSPORT_MISSIONS.length
  const stampCount = PASSPORT_MISSIONS.filter(mission => progress.completed[mission.id]).length
  const { rank, next: nextRank } = passportRank(stampCount)
  const suggestion = nextMission(progress)
  const selectedMission = PASSPORT_MISSIONS.find(mission => mission.id === selected)
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString(copy.dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })

  // Only the number of stamps is shared: no name, no date, no device data.
  const share = async () => {
    const text = copy.shareText(stampCount, total)
    try {
      if (navigator.share) {
        await navigator.share({ title: copy.shareTitle, text, url: SITE_URL })
        return
      }
      await navigator.clipboard.writeText(`${text} ${SITE_URL}`)
      setShareStatus(copy.copied)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) setShareStatus(copy.noShare)
    }
  }

  return (
    <div lang={locale === 'en' ? 'en' : undefined}>
      <header className="page-header">
        <div className="badge"><SpaceIcon name="passport" size={16} className="inline-icon" /> {copy.badge}</div>
        <h1 className="page-title">{copy.title}</h1>
        <p className="page-subtitle">{copy.subtitle}</p>
      </header>

      <section className="passport card" aria-labelledby="passport-title">
        <div className="passport-print-header" aria-hidden="true">
          <strong>{copy.title} · SolarScope</strong>
          <span>{copy.printName}</span>
        </div>

        <div className="passport-heading">
          <div>
            <span className="section-kicker">{copy.kicker}</span>
            <h2 id="passport-title">{ready ? copy.stamps(stampCount, total) : `…/${total}`}</h2>
            <p className="passport-rank">
              <span>{copy.rank}</span>
              <strong>{ready ? rank.title[locale] : '…'}</strong>
            </p>
            {ready && <div className="passport-rank-bar" role="progressbar" aria-label={copy.rank} aria-valuemin={0} aria-valuemax={total} aria-valuenow={stampCount}><span style={{ width: `${(stampCount / total) * 100}%` }} /></div>}
            {ready && <p className="passport-rank-next">{nextRank ? copy.toNext(nextRank.from - stampCount, nextRank.title[locale]) : copy.maxRank}</p>}
          </div>
          <Cosmo className="passport-cosmo" rank={ready ? rank.level : 0} />
        </div>

        <p className="passport-privacy">{copy.privacy}</p>

        {ready && (
          suggestion
            ? <Link href={suggestion.href} className="passport-next">
                <span className="passport-mission-icon"><SpaceIcon name={suggestion.icon} size={24} /></span>
                <span><small>{copy.next}</small><strong>{suggestion.title[locale]}</strong></span>
                <span aria-hidden="true" className="passport-next-arrow">→</span>
              </Link>
            : <p className="passport-next is-done"><StampMark size={32} /> {copy.allDone}</p>
        )}

        <ul className="passport-grid" aria-label={copy.gridLabel}>
          {PASSPORT_MISSIONS.map(mission => {
            const state = missionState(progress, mission.id)
            const isOpen = selected === mission.id
            return (
              <li key={mission.id}>
                <button
                  type="button"
                  className={`passport-tile is-${state}`}
                  aria-expanded={isOpen}
                  aria-controls="passport-detail"
                  onClick={() => {
                    setSelected(isOpen ? null : mission.id)
                    // On a phone the detail sits below the grid: bring it into view.
                    requestAnimationFrame(() => document.getElementById('passport-detail')?.scrollIntoView({ block: 'nearest' }))
                  }}
                >
                  {state === 'stamped' ? <StampMark /> : <span className="passport-mission-icon"><SpaceIcon name={mission.icon} size={24} /></span>}
                  <strong>{mission.title[locale]}</strong>
                  <small>{copy.states[state]}</small>
                </button>
              </li>
            )
          })}
        </ul>

        <div id="passport-detail" className="passport-detail" aria-live="polite">
          {selectedMission && (() => {
            const state = missionState(progress, selectedMission.id)
            const stampedAt = progress.completed[selectedMission.id]
            return (
              <>
                <div>
                  <strong>{selectedMission.title[locale]}</strong>
                  <span className={`passport-state is-${state}`}>{stampedAt ? copy.stampedOn(formatDate(stampedAt)) : copy.states[state]}</span>
                </div>
                <p>{selectedMission.text[locale]}{state === 'visited' && selectedMission.id !== 'quiz' ? ` ${copy.visitedHint}` : ''}</p>
                <Link href={selectedMission.href} className="btn-ghost">{copy.go}</Link>
              </>
            )
          })()}
        </div>

        {progress.bestQuizScore !== undefined && <p className="passport-score">{copy.quizScore(progress.bestQuizScore)}</p>}

        <div className="passport-actions">
          <button type="button" className="btn-primary" onClick={() => window.print()}>{copy.print}</button>
          <button type="button" className="btn-ghost" onClick={share}>{copy.share}</button>
        </div>
        {shareStatus && <p className="passport-share-status" role="status">{shareStatus}</p>}

        {ready && <PassportTransfer progress={progress} />}

        {confirmingReset
          ? (
            <div className="passport-reset-confirm" role="alertdialog" aria-labelledby="passport-reset-question">
              <p id="passport-reset-question">{copy.confirm}</p>
              <div>
                <button type="button" className="passport-reset-yes" onClick={() => { clearLocalProgress(); setConfirmingReset(false); setSelected(null) }}>{copy.confirmYes}</button>
                <button type="button" className="btn-ghost" autoFocus onClick={() => setConfirmingReset(false)}>{copy.cancel}</button>
              </div>
            </div>
          )
          : <button type="button" className="passport-reset" onClick={() => setConfirmingReset(true)}>{copy.reset}</button>}
      </section>
    </div>
  )
}
