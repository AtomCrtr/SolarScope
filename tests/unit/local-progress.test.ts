import { describe, expect, it } from 'vitest'
import { MISSION_IDS, sanitizeProgress } from '../../src/lib/client/local-progress'
import { LEARNING_TOPICS } from '../../src/lib/content/learning-content'

describe('mission progress catalogue', () => {
  it('tracks every public learning journey exactly once', () => {
    expect([...MISSION_IDS].sort()).toEqual(Object.keys(LEARNING_TOPICS).sort())
    expect(new Set(MISSION_IDS).size).toBe(MISSION_IDS.length)
  })
})

describe('sanitizeProgress', () => {
  it('keeps valid stamps and drops everything else', () => {
    expect(sanitizeProgress({
      visited: { soleil: '2026-01-01', unknown: 'x', mars: 5 },
      completed: 'oops',
      bestQuizScore: 250,
      observed: { moon: '2026-01-02', pluto: 'x' },
      skyStamp: 12,
    })).toEqual({
      visited: { soleil: '2026-01-01' },
      completed: {},
      bestQuizScore: 100,
      observed: { moon: '2026-01-02' },
      skyStamp: undefined,
    })
  })

  it.each([null, 5, 'x', [], { visited: 5, bestQuizScore: Number.NaN }])('survives %j', (value) => {
    const progress = sanitizeProgress(value)
    expect(progress.visited).toEqual({})
    expect(progress.completed).toEqual({})
    expect(progress.bestQuizScore).toBeUndefined()
  })
})
