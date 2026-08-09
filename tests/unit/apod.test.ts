import { describe, expect, it } from 'vitest'
import { normalizeApodPayload } from '../../src/lib/data/apod'

describe('NASA APOD normalization', () => {
  it('keeps image and video entries including the video thumbnail', () => {
    expect(normalizeApodPayload([
      { date: '2026-08-09', title: 'Video', explanation: 'A video.', media_type: 'video', url: 'https://example.test/video', thumbnail_url: 'https://example.test/thumb.jpg' },
      { date: '2026-08-08', title: 'Image', explanation: 'An image.', media_type: 'image', url: 'https://example.test/image.jpg' },
      { title: 'Invalid' },
    ])).toEqual([
      { date: '2026-08-08', title: 'Image', explanation: 'An image.', media_type: 'image', url: 'https://example.test/image.jpg', hdurl: undefined, thumbnail_url: undefined, copyright: undefined },
      { date: '2026-08-09', title: 'Video', explanation: 'A video.', media_type: 'video', url: 'https://example.test/video', hdurl: undefined, thumbnail_url: 'https://example.test/thumb.jpg', copyright: undefined },
    ])
  })
})
