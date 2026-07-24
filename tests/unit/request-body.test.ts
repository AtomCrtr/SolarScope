import { describe, expect, it } from 'vitest'
import { readJsonBody } from '../../src/lib/request-body'

describe('readJsonBody', () => {
  it('refuses an oversized chunked body without Content-Length', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      body: JSON.stringify({ question: 'x'.repeat(40_000) }),
    })

    await expect(readJsonBody(request, 32_000)).resolves.toEqual({ kind: 'too-large' })
  })

  it('returns a valid JSON body', async () => {
    const request = new Request('https://example.test/api', {
      method: 'POST',
      body: JSON.stringify({ question: 'Pourquoi Mars est rouge ?' }),
    })

    await expect(readJsonBody(request, 32_000)).resolves.toEqual({
      kind: 'ok',
      value: { question: 'Pourquoi Mars est rouge ?' },
    })
  })
})
