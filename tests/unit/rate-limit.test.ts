import { beforeEach, describe, expect, it } from 'vitest'
import { checkRateLimit, resetRateLimitsForTests } from '../../src/lib/rate-limit'

describe('checkRateLimit', () => {
  beforeEach(resetRateLimitsForTests)

  it('accepts requests up to the configured limit', () => {
    expect(checkRateLimit('visitor', 2, 60_000, 1_000)).toMatchObject({ allowed: true, remaining: 1 })
    expect(checkRateLimit('visitor', 2, 60_000, 1_001)).toMatchObject({ allowed: true, remaining: 0 })
    expect(checkRateLimit('visitor', 2, 60_000, 1_002)).toMatchObject({ allowed: false, remaining: 0 })
  })

  it('opens a new window after expiration', () => {
    checkRateLimit('visitor', 1, 1_000, 1_000)
    expect(checkRateLimit('visitor', 1, 1_000, 2_001)).toMatchObject({ allowed: true })
  })
})
