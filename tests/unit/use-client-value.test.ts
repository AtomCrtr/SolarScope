import { describe, expect, it } from 'vitest'
import { daysSince } from '../../src/lib/client/use-client-value'

describe('daysSince', () => {
  it('counts whole elapsed days', () => {
    expect(daysSince('2021-02-18', Date.parse('2021-02-18T23:59:00Z'))).toBe(0)
    expect(daysSince('2021-02-18', Date.parse('2021-02-20T00:00:00Z'))).toBe(2)
  })
})
