/**
 * localStorage wrappers that never throw. Browsers can deny storage access entirely
 * (Safari with cookies blocked, some private modes) or reject writes (quota), and a
 * throw inside a layout component would take the whole page down.
 */
export function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string): boolean {
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}
