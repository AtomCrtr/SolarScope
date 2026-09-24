import { useSyncExternalStore } from 'react'

const subscribeNever = () => () => {}

/**
 * Returns `serverValue` during prerendering and hydration, then the browser value.
 * Use it for values that depend on the current date or on browser APIs: pages are
 * prerendered at build time, so computing them during render causes hydration errors.
 * `getClientValue` must return a primitive (or a stable reference) between calls.
 */
export function useClientValue<T>(getClientValue: () => T, serverValue: T): T {
  return useSyncExternalStore(subscribeNever, getClientValue, () => serverValue)
}

export function daysSince(isoDate: string, now = Date.now()): number {
  return Math.floor((now - Date.parse(isoDate)) / 86_400_000)
}

export function useDaysSince(isoDate: string): number | null {
  return useClientValue(() => daysSince(isoDate), null)
}
