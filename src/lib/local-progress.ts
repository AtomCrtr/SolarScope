export const MISSION_IDS = ['planetes', 'mars', 'iss', 'quiz'] as const
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
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '') as LocalProgress
    return { visited: saved.visited || {}, completed: saved.completed || {}, bestQuizScore: saved.bestQuizScore }
  } catch {
    return emptyProgress()
  }
}

export function updateLocalProgress(update: (current: LocalProgress) => LocalProgress) {
  if (typeof window === 'undefined') return
  const next = update(readLocalProgress())
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
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
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event(PROGRESS_EVENT))
}
