import { MISSION_IDS, type LocalProgress } from './local-progress'

// A passport fits in a 9-character code (« 4K7-2QD-9XA »): no account, nothing sent to a server.
// 40 bits = version (3) + stamped missions (14) + visited missions (14) + best quiz score (7) + sky stamp (1) + padding (1),
// followed by one check character that catches most typing mistakes.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford base 32: no I, L, O or U
const VERSION = 1
const NO_SCORE = 127

export type PassportCodeContent = {
  completed: Set<(typeof MISSION_IDS)[number]>
  visited: Set<(typeof MISSION_IDS)[number]>
  bestQuizScore?: number
  skyStamp: boolean
}

function checkCharacter(digits: number[]): number {
  return digits.reduce((sum, digit, index) => sum + digit * (index + 1), 0) % 32
}

const toBits = (value: number, width: number) => Array.from({ length: width }, (_, index) => (value >> (width - 1 - index)) & 1)
const fromBits = (bits: number[]) => bits.reduce((value, bit) => value * 2 + bit, 0)

export function encodePassportCode(progress: LocalProgress): string {
  const score = progress.bestQuizScore === undefined ? NO_SCORE : Math.max(0, Math.min(100, Math.round(progress.bestQuizScore)))
  const bits = [
    ...toBits(VERSION, 3),
    ...MISSION_IDS.map(mission => (progress.completed[mission] ? 1 : 0)),
    ...MISSION_IDS.map(mission => (progress.visited[mission] || progress.completed[mission] ? 1 : 0)),
    ...toBits(score, 7),
    progress.skyStamp ? 1 : 0,
    0,
  ]
  const digits = Array.from({ length: 8 }, (_, index) => fromBits(bits.slice(index * 5, index * 5 + 5)))
  digits.push(checkCharacter(digits))
  const text = digits.map(digit => ALPHABET[digit]).join('')
  return `${text.slice(0, 3)}-${text.slice(3, 6)}-${text.slice(6)}`
}

/** Accepts lower case, spaces and the usual look-alikes (O→0, I/L→1). Returns null for an invalid code. */
export function decodePassportCode(input: string): PassportCodeContent | null {
  const cleaned = input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1')
  if (cleaned.length !== 9) return null
  const digits = [...cleaned].map(character => ALPHABET.indexOf(character))
  if (digits.some(digit => digit < 0)) return null
  if (checkCharacter(digits.slice(0, 8)) !== digits[8]) return null

  const bits = digits.slice(0, 8).flatMap(digit => toBits(digit, 5))
  const count = MISSION_IDS.length
  if (fromBits(bits.slice(0, 3)) !== VERSION) return null
  const completedBits = bits.slice(3, 3 + count)
  const visitedBits = bits.slice(3 + count, 3 + 2 * count)
  const score = fromBits(bits.slice(3 + 2 * count, 10 + 2 * count))
  if (score !== NO_SCORE && score > 100) return null

  return {
    completed: new Set(MISSION_IDS.filter((_, index) => completedBits[index] === 1)),
    visited: new Set(MISSION_IDS.filter((_, index) => visitedBits[index] === 1)),
    bestQuizScore: score === NO_SCORE ? undefined : score,
    skyStamp: bits[10 + 2 * count] === 1,
  }
}

/** Adds an imported passport to this one: nothing already earned here is ever lost. */
export function mergePassport(current: LocalProgress, imported: PassportCodeContent, now = new Date().toISOString()): LocalProgress {
  const completed = { ...current.completed }
  const visited = { ...current.visited }
  for (const mission of imported.completed) completed[mission] ??= now
  for (const mission of imported.visited) visited[mission] ??= now
  const scores = [current.bestQuizScore, imported.bestQuizScore].filter((score): score is number => score !== undefined)
  return {
    completed,
    visited,
    bestQuizScore: scores.length ? Math.max(...scores) : undefined,
    observed: current.observed,
    skyStamp: current.skyStamp ?? (imported.skyStamp ? now : undefined),
  }
}
