import { describe, expect, it } from 'vitest'
import { MISSION_IDS } from '../../src/lib/client/local-progress'
import { LEARNING_TOPICS } from '../../src/lib/content/learning-content'

describe('mission progress catalogue', () => {
  it('tracks every public learning journey exactly once', () => {
    expect([...MISSION_IDS].sort()).toEqual(Object.keys(LEARNING_TOPICS).sort())
    expect(new Set(MISSION_IDS).size).toBe(MISSION_IDS.length)
  })
})
