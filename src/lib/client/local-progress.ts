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

export type LocalProgress = {
  visited: Partial<Record<MissionId, string>>
  completed: Partial<Record<MissionId, string>>
  bestQuizScore?: number
}

const STORAGE_KEY = 'solarscope-passport-v1'
export const PROGRESS_EVENT = 'solarscope-progress-change'

const emptyProgress = (): LocalProgress => ({ visited: {}, completed: {} })

export function readLocalProgress(): LocalProgress {
  if (typeof window === 'undefined') return emptyProgress()
  try {
    const saved = JSON.parse(readStorage(STORAGE_KEY) || '') as LocalProgress
    return { visited: saved.visited || {}, completed: saved.completed || {}, bestQuizScore: saved.bestQuizScore }
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

export function clearLocalProgress() {
  if (typeof window === 'undefined') return
  removeStorage(STORAGE_KEY)
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}
