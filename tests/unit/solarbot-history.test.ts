import { describe, expect, it } from 'vitest'
import { normalizeHistory } from '../../src/lib/server/solarbot-history'

describe('normalizeHistory', () => {
  it('drops a leading bot reply', () => {
    expect(normalizeHistory([
      { role: 'model', text: 'a' },
      { role: 'user', text: 'b' },
      { role: 'model', text: 'c' },
    ])).toEqual([{ role: 'user', text: 'b' }, { role: 'model', text: 'c' }])
  })

  it('keeps the latest of two identical roles in a row', () => {
    expect(normalizeHistory([
      { role: 'user', text: 'a' },
      { role: 'user', text: 'b' },
      { role: 'model', text: 'c' },
    ])).toEqual([{ role: 'user', text: 'b' }, { role: 'model', text: 'c' }])
  })

  it('drops a trailing user turn, replaced by the new question', () => {
    expect(normalizeHistory([{ role: 'user', text: 'a' }])).toEqual([])
  })
})
