import { describe, expect, it } from 'vitest'
import { containsSensitivePersonalInformation, solarBotContentIsSafe } from '../../src/lib/solarbot-safety'

describe('solarbot privacy guard', () => {
  it.each([
    'Mon e-mail est luna@example.com',
    'Appelle-moi au 06 12 34 56 78',
    'J’habite 12 rue des Étoiles',
    "Je m'appelle Lina et mon école est ici",
  ])('recognises common personal information: %s', (value) => {
    expect(containsSensitivePersonalInformation(value)).toBe(true)
  })

  it('allows an astronomy question without personal information', () => {
    expect(solarBotContentIsSafe('Pourquoi la Lune change de forme ?', [])).toBe(true)
  })

  it('blocks personal information in the previous conversation too', () => {
    expect(solarBotContentIsSafe('Pourquoi Mars est rouge ?', [{ text: 'Mon adresse est 12 rue des Étoiles' }])).toBe(false)
  })
})
