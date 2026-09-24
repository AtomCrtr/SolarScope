import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStorage, removeStorage, writeStorage } from '../../src/lib/client/safe-storage'
import { readLocalProgress, visitMission } from '../../src/lib/client/local-progress'

function stubBlockedStorage() {
  const denied = () => { throw new DOMException('The operation is insecure.', 'SecurityError') }
  vi.stubGlobal('window', {
    get localStorage(): Storage { return denied() },
    dispatchEvent: vi.fn(),
  })
}

describe('safe storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('never throws when the browser denies storage access', () => {
    stubBlockedStorage()

    expect(readStorage('key')).toBeNull()
    expect(writeStorage('key', 'value')).toBe(false)
    expect(() => removeStorage('key')).not.toThrow()
  })

  it('keeps passport progress usable when storage is blocked', () => {
    stubBlockedStorage()

    expect(() => visitMission('mars')).not.toThrow()
    expect(readLocalProgress()).toEqual({ visited: {}, completed: {}, bestQuizScore: undefined })
  })
})
