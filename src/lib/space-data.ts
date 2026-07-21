export interface CrewMember {
  name: string
  craft: string
}

export interface UpcomingLaunch {
  name: string
  net: string
  agency: string
  rocket: string
  url: string | null
}

export interface DashboardData {
  updatedAt: string
  exoplanetCount: number | null
  nearEarthObjectCount: number | null
  crew: CrewMember[]
  nextLaunch: UpcomingLaunch | null
  sources: {
    exoplanets: boolean
    asteroids: boolean
    crew: boolean
    launches: boolean
  }
}

export interface NewsArticle {
  title: string
  source: string
  url: string
  date: string
  summary: string
  category: string
}

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'
const DEFAULT_TIMEOUT = 8_000

async function fetchJson<T>(url: string, revalidate: number): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate },
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) throw new Error(`Upstream ${response.status}`)
    return (await response.json()) as T
  } finally {
    clearTimeout(timeout)
  }
}

function settledValue<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

export async function getDashboardData(): Promise<DashboardData> {
  const exoplanetsUrl =
    'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=' +
    encodeURIComponent('select count(*) as planet_count from ps where default_flag=1') +
    '&format=json'

  const [exoplanetsResult, asteroidResult, crewResult, launchResult] = await Promise.allSettled([
    fetchJson<Array<{ planet_count?: number | string }>>(exoplanetsUrl, 3_600),
    fetchJson<{ near_earth_object_count?: number }>(
      `https://api.nasa.gov/neo/rest/v1/stats?api_key=${encodeURIComponent(NASA_API_KEY)}`,
      3_600,
    ),
    fetchJson<{ people?: CrewMember[] }>('http://api.open-notify.org/astros.json', 900),
    fetchJson<{
      results?: Array<{
        name?: string
        net?: string
        url?: string
        launch_service_provider?: { name?: string }
        rocket?: { configuration?: { name?: string } }
      }>
    }>('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&format=json', 900),
  ])

  const exoplanets = settledValue(exoplanetsResult)
  const asteroids = settledValue(asteroidResult)
  const crewPayload = settledValue(crewResult)
  const launchPayload = settledValue(launchResult)
  const launch = launchPayload?.results?.[0]

  return {
    updatedAt: new Date().toISOString(),
    exoplanetCount: Number(exoplanets?.[0]?.planet_count) || null,
    nearEarthObjectCount: asteroids?.near_earth_object_count ?? null,
    crew: Array.isArray(crewPayload?.people) ? crewPayload.people : [],
    nextLaunch:
      launch?.name && launch.net
        ? {
            name: launch.name,
            net: launch.net,
            agency: launch.launch_service_provider?.name || 'Agence non renseignée',
            rocket: launch.rocket?.configuration?.name || 'Lanceur non renseigné',
            url: launch.url || null,
          }
        : null,
    sources: {
      exoplanets: exoplanets !== null,
      asteroids: asteroids !== null,
      crew: crewPayload !== null,
      launches: launchPayload !== null,
    },
  }
}

function decodeXml(value: string): string {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function xmlTag(item: string, tag: string): string {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return match ? decodeXml(match[1]) : ''
}

function classifyArticle(text: string): string {
  const value = text.toLowerCase()
  if (/mars|perseverance|curiosity|psyche/.test(value)) return 'Mars'
  if (/webb|hubble|telescope|black hole|galaxy|star system/.test(value)) return 'Univers'
  if (/asteroid|comet|meteor/.test(value)) return 'Astéroïdes'
  if (/artemis|moon|lunar|crew|space station|iss/.test(value)) return 'Exploration'
  if (/sun|solar|heliophys/.test(value)) return 'Soleil'
  if (/earth|climate|wildfire|hurricane/.test(value)) return 'Terre'
  return 'Sciences'
}

export async function getNasaNews(): Promise<{ articles: NewsArticle[]; updatedAt: string }> {
  const response = await fetch('https://www.nasa.gov/feed/', {
    next: { revalidate: 1_800 },
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  })

  if (!response.ok) throw new Error(`NASA RSS ${response.status}`)
  const xml = await response.text()
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || []

  const articles = items
    .map((item): NewsArticle | null => {
      const title = xmlTag(item, 'title')
      const url = xmlTag(item, 'link')
      const summary = xmlTag(item, 'description')
      const published = xmlTag(item, 'pubDate')
      if (!title || !url) return null

      const searchable = `${title} ${summary}`
      return {
        title,
        source: 'NASA',
        url,
        date: published ? new Date(published).toISOString() : new Date().toISOString(),
        summary: summary || 'Consultez l’article complet sur le site officiel de la NASA.',
        category: classifyArticle(searchable),
      }
    })
    .filter((article): article is NewsArticle => article !== null)
    .slice(0, 18)

  return { articles, updatedAt: new Date().toISOString() }
}

export function getNasaApiKey(): string {
  return NASA_API_KEY
}
