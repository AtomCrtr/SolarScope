import { useSyncExternalStore } from 'react'
import { readStorage, removeStorage, writeStorage } from './safe-storage'

const STORAGE_KEY = 'solarscope-display'
const EVENT = 'solarscope-display-change'

export type DisplayChoice = 'light' | 'full'

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }

/** Small phones and « save data » users get still images instead of WebGL scenes. */
export function deviceNeedsLightMode(): boolean {
  const hints = navigator as NavigatorHints
  if (hints.connection?.saveData) return true
  if (window.matchMedia?.('(prefers-reduced-data: reduce)').matches) return true
  if (hints.deviceMemory !== undefined && hints.deviceMemory <= 2) return true
  return navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2
}

export function readDisplayChoice(): DisplayChoice | null {
  const saved = readStorage(STORAGE_KEY)
  return saved === 'light' || saved === 'full' ? saved : null
}

type LightModeState = 'light-auto' | 'light-chosen' | 'full'

function snapshot(): LightModeState {
  const choice = readDisplayChoice()
  if (choice === 'light') return 'light-chosen'
  if (choice === 'full') return 'full'
  return deviceNeedsLightMode() ? 'light-auto' : 'full'
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** `null` while prerendering or hydrating: callers show the still image first, then the 3D scene if allowed. */
export function useLightMode(): LightModeState | null {
  return useSyncExternalStore<LightModeState | null>(subscribe, snapshot, () => null)
}

/** `null` goes back to automatic detection. */
export function setDisplayChoice(choice: DisplayChoice | null) {
  if (choice) writeStorage(STORAGE_KEY, choice)
  else removeStorage(STORAGE_KEY)
  window.dispatchEvent(new Event(EVENT))
}
