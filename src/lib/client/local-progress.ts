import { useSyncExternalStore } from 'react'
import { readStorage, removeStorage, writeStorage } from './safe-storage'

export const MISSION_IDS = [
  'soleil',
  'planetes',
  'mars',
  'asteroides',
  'meteorites',
  'iss',
  'missions',
  'jwst',
  'ciel',
  'photo-du-jour',
  'exoplanetes',
  'actualites',
  'quiz',
  'solarbot',
] as const
export type MissionId = (typeof MISSION_IDS)[number]

export const SKY_OBJECT_IDS = ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'iss'] as const
export type SkyObjectId = (typeof SKY_OBJECT_IDS)[number]

export type LocalProgress = {
  visited: Partial<Record<MissionId, string>>
  completed: Partial<Record<MissionId, string>>
  bestQuizScore?: number
  /** Observation log: what the child really saw in the sky, and when. */
  observed?: Partial<Record<SkyObjectId, string>>
  /** Special « sky observer » stamp, earned with the first observation. */
  skyStamp?: string
}

const STORAGE_KEY = 'solarscope-passport-v1'
export const PROGRESS_EVENT = 'solarscope-progress-change'

const emptyProgress = (): LocalProgress => ({ visited: {}, completed: {} })

export function readLocalProgress(): LocalProgress {
  if (typeof window === 'undefined') return emptyProgress()
  try {
    const saved = JSON.parse(readStorage(STORAGE_KEY) || '') as LocalProgress
    return { visited: saved.visited || {}, completed: saved.completed || {}, bestQuizScore: saved.bestQuizScore, observed: saved.observed || {}, skyStamp: saved.skyStamp }
  } catch {
    return emptyProgress()
  }
}

const EMPTY_PROGRESS: LocalProgress = emptyProgress()
let cachedRaw: string | null | undefined
let cachedProgress: LocalProgress = EMPTY_PROGRESS

// useSyncExternalStore needs the same object while storage has not changed.
function progressSnapshot(): LocalProgress {
  const raw = readStorage(STORAGE_KEY)
  if (raw !== cachedRaw) {
    cachedRaw = raw
    cachedProgress = readLocalProgress()
  }
  return cachedProgress
}

function subscribeToProgress(onChange: () => void) {
  window.addEventListener(PROGRESS_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(PROGRESS_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** Current passport, updated live. `null` while the page is prerendered or hydrating. */
export function useLocalProgress(): LocalProgress | null {
  return useSyncExternalStore<LocalProgress | null>(subscribeToProgress, progressSnapshot, () => null)
}

export function replaceLocalProgress(next: LocalProgress) {
  updateLocalProgress(() => next)
}

export function updateLocalProgress(update: (current: LocalProgress) => LocalProgress) {
  if (typeof window === 'undefined') return
  const next = update(readLocalProgress())
  writeStorage(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}

export function visitMission(mission: MissionId) {
  updateLocalProgress(current => ({ ...current, visited: { ...current.visited, [mission]: new Date().toISOString() } }))
}

export function completeMission(mission: MissionId) {
  updateLocalProgress(current => ({ ...current, completed: { ...current.completed, [mission]: new Date().toISOString() } }))
}

export function recordQuizScore(score: number) {
  updateLocalProgress(current => ({ ...current, bestQuizScore: Math.max(current.bestQuizScore || 0, score), completed: { ...current.completed, quiz: new Date().toISOString() } }))
}

/** Ticks or unticks an object in the observation log; the first tick earns the special stamp for good. */
export function toggleObservation(object: SkyObjectId) {
  updateLocalProgress(current => {
    const observed = { ...current.observed }
    const now = new Date().toISOString()
    if (observed[object]) delete observed[object]
    else observed[object] = now
    return { ...current, observed, skyStamp: current.skyStamp ?? (observed[object] ? now : undefined) }
  })
}

export function clearLocalProgress() {
  if (typeof window === 'undefined') return
  removeStorage(STORAGE_KEY)
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}
