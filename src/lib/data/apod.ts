import { unstable_cache } from 'next/cache'
import { getNasaApiKey } from './space-data'

export type ApodEntry = {
  date: string
  title: string
  explanation: string
  media_type: 'image' | 'video'
  url: string
  hdurl?: string
  thumbnail_url?: string
  copyright?: string
}

export type ApodResult = {
  photos: ApodEntry[]
  source: 'nasa' | 'fallback'
}

const FALLBACK_APOD: ApodEntry[] = [{
  date: '2022-07-13',
  title: 'Le premier champ profond du télescope Webb',
  explanation: 'Cette image montre l’amas de galaxies SMACS 0723. La gravité de l’amas agit comme une loupe et révèle des galaxies beaucoup plus lointaines. Elle fait partie des premières images scientifiques publiées par le télescope spatial James Webb.',
  media_type: 'image',
  url: '/smacs0723.png',
  copyright: 'NASA, ESA, CSA et STScI',
}]

let lastKnownApod: ApodEntry[] = FALLBACK_APOD

function normalizeEntry(value: unknown): ApodEntry | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const item = value as Record<string, unknown>
  if (
    typeof item.date !== 'string'
    || typeof item.title !== 'string'
    || typeof item.explanation !== 'string'
    || (item.media_type !== 'image' && item.media_type !== 'video')
    || typeof item.url !== 'string'
  ) return null

  return {
    date: item.date,
    title: item.title,
    explanation: item.explanation,
    media_type: item.media_type,
    url: item.url,
    hdurl: typeof item.hdurl === 'string' ? item.hdurl : undefined,
    thumbnail_url: typeof item.thumbnail_url === 'string' ? item.thumbnail_url : undefined,
    copyright: typeof item.copyright === 'string' ? item.copyright : undefined,
  }
}

export function normalizeApodPayload(payload: unknown): ApodEntry[] {
  if (!Array.isArray(payload)) return []
  return payload
    .map(normalizeEntry)
    .filter((entry): entry is ApodEntry => Boolean(entry))
    .sort((a, b) => a.date.localeCompare(b.date))
}

const getCachedNasaApod = unstable_cache(async () => {
  const end = new Date()
  const start = new Date(end.getTime() - 12 * 86_400_000)
  const url = new URL('https://api.nasa.gov/planetary/apod')
  url.searchParams.set('api_key', getNasaApiKey())
  url.searchParams.set('start_date', start.toISOString().slice(0, 10))
  url.searchParams.set('end_date', end.toISOString().slice(0, 10))
  url.searchParams.set('thumbs', 'true')

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
    headers: { 'User-Agent': 'SolarScope/1.0 educational astronomy app' },
  })
  if (!response.ok) throw new Error(`NASA APOD ${response.status}`)
  const photos = normalizeApodPayload(await response.json())
  if (!photos.length) throw new Error('NASA APOD returned no usable content')
  return photos
}, ['nasa-apod-recent-v2'], { revalidate: 3600 })

export async function getApodWithFallback(): Promise<ApodResult> {
  try {
    const photos = await getCachedNasaApod()
    lastKnownApod = photos
    return { photos, source: 'nasa' }
  } catch {
    return { photos: lastKnownApod, source: 'fallback' }
  }
}
