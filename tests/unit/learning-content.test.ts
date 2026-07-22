import { describe, expect, it } from 'vitest'
import { LEARNING_TOPICS } from '../../src/lib/learning-content'

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

describe('child-first learning content', () => {
  it('covers every public learning journey', () => {
    expect(Object.keys(LEARNING_TOPICS)).toHaveLength(14)
  })

  it('keeps the first reading short and predictable', () => {
    for (const lesson of Object.values(LEARNING_TOPICS)) {
      expect(lesson.question.endsWith('?')).toBe(true)
      expect(wordCount(lesson.summary)).toBeLessThanOrEqual(55)
      expect(lesson.takeaways).toHaveLength(3)
      lesson.takeaways.forEach(takeaway => expect(wordCount(takeaway)).toBeLessThanOrEqual(18))
    }
  })

  it('defines scientific vocabulary in child-sized explanations', () => {
    for (const lesson of Object.values(LEARNING_TOPICS)) {
      expect(lesson.glossary.length).toBeGreaterThan(0)
      lesson.glossary.forEach(item => {
        expect(item.term.length).toBeGreaterThan(1)
        expect(wordCount(item.definition)).toBeLessThanOrEqual(22)
      })
    }
  })
})
