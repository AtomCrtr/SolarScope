import { describe, expect, it } from 'vitest'
import { MISSION_IDS, type LocalProgress } from '../../src/lib/client/local-progress'
import { decodePassportCode, encodePassportCode, mergePassport } from '../../src/lib/client/passport-code'
import { ENGLISH_MISSION_CHECKS, MISSION_CHECKS } from '../../src/lib/content/mission-checks'
import { missionState, nextMission, passportRank, PASSPORT_MISSIONS } from '../../src/lib/content/passport'

const DAY = '2026-09-01T10:00:00.000Z'
const progress: LocalProgress = {
  completed: { soleil: DAY, mars: DAY, quiz: DAY },
  visited: { soleil: DAY, mars: DAY, iss: DAY, quiz: DAY },
  bestQuizScore: 80,
}

describe('passport transfer code', () => {
  it('round-trips stamps, visits and the quiz score in 9 characters', () => {
    const code = encodePassportCode(progress)
    expect(code).toMatch(/^[0-9A-Z]{3}-[0-9A-Z]{3}-[0-9A-Z]{3}$/)
    const decoded = decodePassportCode(code)
    expect(decoded && [...decoded.completed].sort()).toEqual(['mars', 'quiz', 'soleil'])
    expect(decoded && [...decoded.visited].sort()).toEqual(['iss', 'mars', 'quiz', 'soleil'])
    expect(decoded?.bestQuizScore).toBe(80)
  })

  it('handles an empty passport and a full one', () => {
    expect(decodePassportCode(encodePassportCode({ completed: {}, visited: {} }))).toEqual({ completed: new Set(), visited: new Set(), bestQuizScore: undefined })
    const full = Object.fromEntries(MISSION_IDS.map(id => [id, DAY]))
    expect(decodePassportCode(encodePassportCode({ completed: full, visited: full, bestQuizScore: 100 }))?.completed.size).toBe(14)
  })

  it('accepts lower case and spaces but rejects typing mistakes', () => {
    const code = encodePassportCode(progress)
    expect(decodePassportCode(code.toLowerCase().replace(/-/g, ' '))).not.toBeNull()
    const typo = code.slice(0, 2) + (code[2] === 'A' ? 'B' : 'A') + code.slice(3)
    expect(decodePassportCode(typo)).toBeNull()
    expect(decodePassportCode('hello')).toBeNull()
  })

  it('merges without losing what this device already has', () => {
    const here: LocalProgress = { completed: { ciel: DAY }, visited: { ciel: DAY }, bestQuizScore: 90 }
    const merged = mergePassport(here, decodePassportCode(encodePassportCode(progress))!, '2026-09-25T00:00:00.000Z')
    expect(Object.keys(merged.completed).sort()).toEqual(['ciel', 'mars', 'quiz', 'soleil'])
    expect(merged.completed.ciel).toBe(DAY)
    expect(merged.bestQuizScore).toBe(90)
  })
})

describe('passport content', () => {
  it('lists every mission once', () => {
    expect(PASSPORT_MISSIONS.map(mission => mission.id).sort()).toEqual([...MISSION_IDS].sort())
  })

  it('gives ranks by number of stamps', () => {
    expect(passportRank(0).rank.level).toBe(0)
    expect(passportRank(3).rank.level).toBe(1)
    expect(passportRank(13).rank.level).toBe(2)
    expect(passportRank(13).next?.from).toBe(14)
    expect(passportRank(14)).toEqual({ rank: expect.objectContaining({ level: 3 }), next: null })
  })

  it('suggests a started mission first, then a new one', () => {
    expect(missionState(progress, 'iss')).toBe('visited')
    expect(nextMission(progress)?.id).toBe('iss')
    expect(nextMission({ completed: {}, visited: {} })?.id).toBe('soleil')
  })

  it('asks one question per lesson in both languages', () => {
    for (const checks of [MISSION_CHECKS, ENGLISH_MISSION_CHECKS]) {
      expect(Object.keys(checks).sort()).toEqual(MISSION_IDS.filter(id => id !== 'quiz').sort())
      for (const check of Object.values(checks)) {
        expect(new Set(check.choices).size).toBe(3)
        expect(check.choices[check.answer]).toBeTruthy()
      }
    }
    // Same correct answer position in both languages, so a translation cannot silently change the answer.
    for (const [id, check] of Object.entries(MISSION_CHECKS)) {
      expect(ENGLISH_MISSION_CHECKS[id as keyof typeof MISSION_CHECKS].answer).toBe(check.answer)
    }
  })
})
