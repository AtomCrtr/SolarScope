import { describe, expect, it } from 'vitest'
import { LEARNING_TOPICS, type LearningTopicId } from '../../src/lib/content/learning-content'
import { ENGLISH_LEARNING_TOPICS } from '../../src/lib/content/learning-content.en'

describe('English lessons', () => {
  const topics = Object.keys(LEARNING_TOPICS) as LearningTopicId[]

  it('translate every French lesson with the same structure', () => {
    expect(Object.keys(ENGLISH_LEARNING_TOPICS).sort()).toEqual([...topics].sort())
    for (const topic of topics) {
      const french = LEARNING_TOPICS[topic]
      const english = ENGLISH_LEARNING_TOPICS[topic]
      expect(english.takeaways).toHaveLength(french.takeaways.length)
      expect(english.glossary).toHaveLength(french.glossary.length)
      for (const text of [english.question, english.summary, english.analogy, english.deepDive, english.challenge]) {
        expect(text.trim().length).toBeGreaterThan(10)
      }
    }
  })

  it('keeps French typography out of the English text', () => {
    const all = JSON.stringify(ENGLISH_LEARNING_TOPICS)
    expect(all).not.toMatch(/[«»]|\s[?!:;]/)
  })
})
