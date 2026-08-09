import type { SpaceWeatherHistoryPayload } from '@/lib/data/space-weather-history'

const CACHE_KEY = 'solarscope:space-weather-history:v2'
const MAX_CACHE_AGE = 24 * 60 * 60 * 1_000

type StoredHistory = {
  storedAt: string
  payload: SpaceWeatherHistoryPayload
}

export function readSpaceWeatherHistoryCache(): SpaceWeatherHistoryPayload | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw) as StoredHistory
    const storedAt = Date.parse(stored.storedAt)
    if (!Number.isFinite(storedAt) || Date.now() - storedAt > MAX_CACHE_AGE) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    if (!Array.isArray(stored.payload?.kp) || !Array.isArray(stored.payload?.plasma)) return null
    return stored.payload
  } catch {
    return null
  }
}

export function storeSpaceWeatherHistoryCache(payload: SpaceWeatherHistoryPayload) {
  if (!payload.kp.length && !payload.plasma.length) return
  try {
    const existing = readSpaceWeatherHistoryCache()
    const merged: SpaceWeatherHistoryPayload = {
      ...payload,
      kp: payload.kp.length ? payload.kp : existing?.kp ?? [],
      plasma: payload.plasma.length ? payload.plasma : existing?.plasma ?? [],
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify({ storedAt: new Date().toISOString(), payload: merged }))
  } catch {
    // Private browsing and storage policies may disable localStorage.
  }
}
