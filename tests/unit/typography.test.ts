import { describe, expect, it } from 'vitest'
import { frenchNonBreakingSpaces } from '../../src/lib/content/typography'

describe('frenchNonBreakingSpaces', () => {
  it('keeps double punctuation attached to the previous word', () => {
    expect(frenchNonBreakingSpaces('Pourquoi Mars est-elle rouge ?')).toBe('Pourquoi Mars est-elle rouge ?')
    expect(frenchNonBreakingSpaces('À toi de jouer : observe !')).toBe('À toi de jouer : observe !')
    expect(frenchNonBreakingSpaces('« Cosmo »')).toBe('« Cosmo »')
  })

  it('leaves English text without spaces before punctuation unchanged', () => {
    expect(frenchNonBreakingSpaces('Why is the sky blue?')).toBe('Why is the sky blue?')
  })
})
