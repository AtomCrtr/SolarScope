export interface CrewMember {
  name: string
  craft: string
  station: 'ISS' | 'Tiangong' | 'Other'
}

export interface IssPosition {
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: number
  updatedAt: string
}

export interface SolarWind {
  speed: number
  density: number
  temperature: number
}

export interface MagneticField {
  bz: number
  bt: number
  lat: number
  lon: number
}

export interface SpaceWeatherData {
  wind: SolarWind | null
  magneticField: MagneticField | null
  xrayHistory: number[]
  observedAt: string | null
  updatedAt: string
  sources: {
    solarWind: boolean
    xray: boolean
  }
}

export interface UpcomingLaunch {
  name: string
  net: string
  agency: string
  rocket: string
  url: string | null
}

export interface LaunchDetails extends UpcomingLaunch {
  id: string
  status: string
  image: string | null
  location: string
  webcast: string | null
  live: boolean
}

export interface AsteroidApproach {
  id: string
  name: string
  date: string
  distKm: string
  diamMin: number
  dangerous: boolean
}

export interface SolarFlare {
  beginTime: string
  peakTime: string
  endTime?: string
  classType: string
  sourceLocation?: string
  linkedEvents?: unknown[]
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
  date: string | null
  summary: string
  category: string
}

export const SPACE_CACHE_TAGS = [
  'space-dashboard',
  'space-news',
  'space-asteroids',
  'space-launches',
  'space-flares',
  'space-iss',
  'space-weather',
] as const

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY'
const DEFAULT_TIMEOUT = 8_000

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function numberValue(value: unknown): number | null {
  const normalized = typeof value === 'string' ? value.trim() : value
  if (normalized === '') return null
  const parsed = typeof normalized === 'number' ? normalized : typeof normalized === 'string' ? Number(normalized) : Number.NaN
  return Number.isFinite(parsed) ? parsed : null
}

function recordArray(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : []
}

async function fetchWithTimeout(
  url: string | URL,
  revalidate: number,
  tag: (typeof SPACE_CACHE_TAGS)[number],
  accept: string,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate, tags: [tag] },
      headers: { Accept: accept },
    })
    if (!response.ok) throw new Error(`Upstream ${response.status}`)
    return response
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchJson(
  url: string | URL,
  revalidate: number,
  tag: (typeof SPACE_CACHE_TAGS)[number],
): Promise<unknown> {
  const response = await fetchWithTimeout(url, revalidate, tag, 'application/json')
  return response.json()
}

export function stationForCraft(craft: string): CrewMember['station'] {
  const normalized = craft.toLowerCase()
  if (/shenzhou|tiangong/.test(normalized)) return 'Tiangong'
  if (/\biss\b|soyuz|dragon|starliner/.test(normalized)) return 'ISS'
  return 'Other'
}

export function parseCrew(payload: unknown): CrewMember[] {
  if (!isRecord(payload)) return []
  return recordArray(payload.people)
    .map((person) => {
      const name = stringValue(person.name)
      const craft = stringValue(person.spacecraft) || stringValue(person.craft)
      return name && craft ? { name, craft, station: stationForCraft(craft) } : null
    })
    .filter((member): member is CrewMember => member !== null)
}

export function parseLaunches(payload: unknown, now = Date.now()): LaunchDetails[] {
  if (!isRecord(payload)) return []

  return recordArray(payload.results)
    .map((launch): LaunchDetails | null => {
      const id = stringValue(launch.id)
      const name = stringValue(launch.name)
      const net = stringValue(launch.net)
      if (!id || !name || !net || Number.isNaN(Date.parse(net))) return null

      const provider = isRecord(launch.launch_service_provider) ? launch.launch_service_provider : null
      const rocket = isRecord(launch.rocket) ? launch.rocket : null
      const configuration = rocket && isRecord(rocket.configuration) ? rocket.configuration : null
      const status = isRecord(launch.status) ? launch.status : null
      const pad = isRecord(launch.pad) ? launch.pad : null
      const location = pad && isRecord(pad.location) ? pad.location : null
      // Launch Library 2.3 returns `image` as an object and videos as { url } objects.
      const image = isRecord(launch.image) ? stringValue(launch.image.image_url) : stringValue(launch.image)
      const videos = Array.isArray(launch.vid_urls) ? launch.vid_urls : Array.isArray(launch.vidURLs) ? launch.vidURLs : []
      const firstVideo = videos[0]
      const webcast = isRecord(firstVideo) ? stringValue(firstVideo.url) : stringValue(firstVideo)
      // Readable launch page (Space Launch Now, by the Launch Library team) instead of the JSON API URL.
      const slug = stringValue(launch.slug)
      const infoUrl = slug && /^[a-z0-9-]+$/.test(slug) ? `https://spacelaunchnow.app/launch/${slug}/` : null

      return {
        id,
        name,
        net,
        agency: stringValue(provider?.name) || 'Agence non renseignée',
        rocket: stringValue(configuration?.name) || 'Lanceur non renseigné',
        status: stringValue(status?.name) || stringValue(status?.abbrev) || 'Planifié',
        image: image?.startsWith('https://') ? image : null,
        location: stringValue(location?.name) || stringValue(pad?.name) || 'Site non renseigné',
        webcast: webcast?.startsWith('https://') ? webcast : null,
        live: launch.webcast_live === true,
        url: infoUrl,
      }
    })
    .filter((launch): launch is LaunchDetails => launch !== null && Date.parse(launch.net) > now)
}

// Launch Library 2 allows ~15 free requests per hour. Only these providers may be
// requested, and the upstream page size is fixed, so each provider maps to one cache entry.
export const LAUNCH_PROVIDERS = ['SpaceX'] as const
export type LaunchProvider = (typeof LAUNCH_PROVIDERS)[number]
const LAUNCH_UPSTREAM_PAGE_SIZE = 12

export function parseLaunchProvider(value: string | null | undefined): LaunchProvider | null {
  const normalized = value?.trim().toLowerCase()
  return LAUNCH_PROVIDERS.find(provider => provider.toLowerCase() === normalized) ?? null
}

export async function getUpcomingLaunches(limit = 8, provider?: LaunchProvider): Promise<LaunchDetails[]> {
  const requestedLimit = Number.isFinite(limit) ? Math.trunc(limit) : 8
  const safeLimit = Math.min(Math.max(requestedLimit, 1), LAUNCH_UPSTREAM_PAGE_SIZE)
  const upstream = new URL('https://ll.thespacedevs.com/2.3.0/launches/upcoming/')
  upstream.searchParams.set('limit', String(LAUNCH_UPSTREAM_PAGE_SIZE))
  upstream.searchParams.set('format', 'json')
  if (provider) upstream.searchParams.set('lsp__name', provider)

  return parseLaunches(await fetchJson(upstream, 900, 'space-launches')).slice(0, safeLimit)
}

type ParsedSolarWind = {
  wind: SolarWind
  magneticField: MagneticField
  observedAt: string
}

export function parseSolarWindPayload(payload: unknown): ParsedSolarWind | null {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return null
  const header = payload[0].map(value => String(value))
  const column = (name: string) => header.indexOf(name)
  const required = ['time_tag', 'speed', 'density', 'temperature', 'bx', 'by', 'bz', 'bt']
  const indexes = Object.fromEntries(required.map(name => [name, column(name)])) as Record<string, number>
  const propagatedTimeIndex = column('propagated_time_tag')
  if (Object.values(indexes).some(index => index < 0)) return null

  for (let index = payload.length - 1; index >= 1; index -= 1) {
    const row = payload[index]
    if (!Array.isArray(row)) continue
    const observedAt = stringValue(row[propagatedTimeIndex]) || stringValue(row[indexes.time_tag])
    const speed = numberValue(row[indexes.speed])
    const density = numberValue(row[indexes.density])
    const temperature = numberValue(row[indexes.temperature])
    const bx = numberValue(row[indexes.bx])
    const by = numberValue(row[indexes.by])
    const bz = numberValue(row[indexes.bz])
    const bt = numberValue(row[indexes.bt])
    if (!observedAt || Number.isNaN(Date.parse(observedAt)) || [speed, density, temperature, bx, by, bz, bt].some(value => value === null)) continue

    const horizontal = Math.sqrt((bx as number) ** 2 + (by as number) ** 2)
    return {
      wind: { speed: speed as number, density: density as number, temperature: temperature as number },
      magneticField: {
        bz: bz as number,
        bt: bt as number,
        lat: Math.atan2(bz as number, horizontal) * 180 / Math.PI,
        lon: Math.atan2(by as number, bx as number) * 180 / Math.PI,
      },
      observedAt,
    }
  }

  return null
}

export function parseXrayPayload(payload: unknown): { history: number[]; observedAt: string | null } {
  const points = recordArray(payload)
    .filter(point => stringValue(point.energy) === '0.1-0.8nm')
    .map(point => ({
      time: stringValue(point.time_tag),
      flux: numberValue(point.flux),
    }))
    .filter(point => point.time && !Number.isNaN(Date.parse(point.time)) && point.flux !== null && point.flux > 0)

  const step = Math.max(1, Math.ceil(points.length / 90))
  const sampled = points.filter((_, index) => index % step === 0)
  const last = points.at(-1)
  if (last && sampled.at(-1) !== last) sampled.push(last)

  return {
    history: sampled.map(point => point.flux as number),
    observedAt: last?.time ?? null,
  }
}

export async function getIssPosition(): Promise<IssPosition> {
  const payload = await fetchJson(
    'https://api.wheretheiss.at/v1/satellites/25544',
    5,
    'space-iss',
  )
  if (!isRecord(payload)) throw new Error('Invalid ISS position payload')

  const latitude = numberValue(payload.latitude)
  const longitude = numberValue(payload.longitude)
  const altitude = numberValue(payload.altitude)
  const velocity = numberValue(payload.velocity)
  const timestamp = numberValue(payload.timestamp)
  const valid = latitude !== null && latitude >= -90 && latitude <= 90
    && longitude !== null && longitude >= -180 && longitude <= 180
    && altitude !== null && altitude > 300 && altitude < 500
    && velocity !== null && velocity > 25_000 && velocity < 30_000
    && timestamp !== null && timestamp > 0
  if (!valid) throw new Error('Invalid ISS position values')

  return {
    latitude,
    longitude,
    altitude,
    velocity,
    timestamp,
    updatedAt: new Date(timestamp * 1_000).toISOString(),
  }
}

export async function getSpaceWeatherData(): Promise<SpaceWeatherData> {
  const [solarWindResult, xrayResult] = await Promise.allSettled([
    fetchJson(
      'https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind-1-hour.json',
      60,
      'space-weather',
    ),
    fetchJson(
      'https://services.swpc.noaa.gov/json/goes/primary/xrays-6-hour.json',
      60,
      'space-weather',
    ),
  ])

  const solarWind = solarWindResult.status === 'fulfilled' ? parseSolarWindPayload(solarWindResult.value) : null
  const xray = xrayResult.status === 'fulfilled' ? parseXrayPayload(xrayResult.value) : { history: [], observedAt: null }
  const observationTimes = [solarWind?.observedAt, xray.observedAt]
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => Date.parse(b) - Date.parse(a))

  return {
    wind: solarWind?.wind ?? null,
    magneticField: solarWind?.magneticField ?? null,
    xrayHistory: xray.history,
    observedAt: observationTimes[0] ?? null,
    updatedAt: new Date().toISOString(),
    sources: {
      solarWind: solarWind !== null,
      xray: xray.history.length > 0,
    },
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const exoplanetsUrl =
    'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=' +
    encodeURIComponent('select count(*) as planet_count from ps where default_flag=1') +
    '&format=json'

  const [exoplanetsResult, asteroidResult, crewResult, launchResult] = await Promise.allSettled([
    fetchJson(exoplanetsUrl, 3_600, 'space-dashboard'),
    fetchJson(
      `https://api.nasa.gov/neo/rest/v1/stats?api_key=${encodeURIComponent(NASA_API_KEY)}`,
      3_600,
      'space-dashboard',
    ),
    fetchJson(
      'https://corquaid.github.io/international-space-station-APIs/JSON/people-in-space.json',
      900,
      'space-dashboard',
    ),
    getUpcomingLaunches(5),
  ])

  const exoplanetsPayload = exoplanetsResult.status === 'fulfilled' ? exoplanetsResult.value : null
  const asteroidPayload = asteroidResult.status === 'fulfilled' ? asteroidResult.value : null
  const crewPayload = crewResult.status === 'fulfilled' ? crewResult.value : null
  const launches = launchResult.status === 'fulfilled' ? launchResult.value : []
  const exoplanetRecord = Array.isArray(exoplanetsPayload) && isRecord(exoplanetsPayload[0]) ? exoplanetsPayload[0] : null
  const asteroidRecord = isRecord(asteroidPayload) ? asteroidPayload : null
  const firstLaunch = launches[0]
  const exoplanetCount = numberValue(exoplanetRecord?.planet_count)
  const nearEarthObjectCount = numberValue(asteroidRecord?.near_earth_object_count)
  const crew = parseCrew(crewPayload)

  return {
    updatedAt: new Date().toISOString(),
    exoplanetCount,
    nearEarthObjectCount,
    crew,
    nextLaunch: firstLaunch
      ? {
          name: firstLaunch.name,
          net: firstLaunch.net,
          agency: firstLaunch.agency,
          rocket: firstLaunch.rocket,
          url: firstLaunch.url,
        }
      : null,
    sources: {
      exoplanets: exoplanetCount !== null && exoplanetCount > 0,
      asteroids: nearEarthObjectCount !== null && nearEarthObjectCount > 0,
      crew: crew.length > 0,
      launches: firstLaunch !== undefined,
    },
  }
}

export async function getAsteroidFeed(): Promise<{ asteroids: AsteroidApproach[]; updatedAt: string }> {
  const start = new Date()
  const end = new Date(start.getTime() + 7 * 86_400_000)
  const date = (value: Date) => value.toISOString().slice(0, 10)
  const url = new URL('https://api.nasa.gov/neo/rest/v1/feed')
  url.searchParams.set('start_date', date(start))
  url.searchParams.set('end_date', date(end))
  url.searchParams.set('api_key', NASA_API_KEY)

  const payload = await fetchJson(url, 3_600, 'space-asteroids')
  if (!isRecord(payload) || !isRecord(payload.near_earth_objects)) throw new Error('Invalid NASA NeoWs payload')

  const asteroids = Object.values(payload.near_earth_objects)
    .flatMap(recordArray)
    .map((neo): AsteroidApproach | null => {
      const approaches = recordArray(neo.close_approach_data)
      const approach = approaches[0]
      const missDistance = approach && isRecord(approach.miss_distance) ? approach.miss_distance : null
      const diameter = isRecord(neo.estimated_diameter) ? neo.estimated_diameter : null
      const meters = diameter && isRecord(diameter.meters) ? diameter.meters : null
      const id = stringValue(neo.id)
      const name = stringValue(neo.name)
      const dateValue = stringValue(approach?.close_approach_date)
      const distance = numberValue(missDistance?.kilometers)
      const diameterMin = numberValue(meters?.estimated_diameter_min)
      if (!id || !name || !dateValue || distance === null || diameterMin === null) return null

      return {
        id,
        name,
        date: dateValue,
        distKm: Math.round(distance).toString(),
        diamMin: Math.round(diameterMin),
        dangerous: neo.is_potentially_hazardous_asteroid === true,
      }
    })
    .filter((asteroid): asteroid is AsteroidApproach => asteroid !== null)
    .sort((a, b) => Number(a.distKm) - Number(b.distKm))

  return { asteroids, updatedAt: new Date().toISOString() }
}

export async function getSolarFlares(): Promise<SolarFlare[]> {
  const end = new Date()
  const start = new Date(end.getTime() - 30 * 86_400_000)
  const date = (value: Date) => value.toISOString().slice(0, 10)
  const upstream = new URL('https://api.nasa.gov/DONKI/FLR')
  upstream.searchParams.set('startDate', date(start))
  upstream.searchParams.set('endDate', date(end))
  upstream.searchParams.set('api_key', NASA_API_KEY)

  const payload = await fetchJson(upstream, 3_600, 'space-flares')
  return recordArray(payload)
    .map((flare): SolarFlare | null => {
      const beginTime = stringValue(flare.beginTime)
      const peakTime = stringValue(flare.peakTime)
      const classType = stringValue(flare.classType)
      if (!beginTime || !peakTime || !classType) return null
      return {
        beginTime,
        peakTime,
        classType,
        endTime: stringValue(flare.endTime) || undefined,
        sourceLocation: stringValue(flare.sourceLocation) || undefined,
        linkedEvents: Array.isArray(flare.linkedEvents) ? flare.linkedEvents : undefined,
      }
    })
    .filter((flare): flare is SolarFlare => flare !== null)
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  ndash: '–',
  mdash: '—',
}

// Single pass, so "&amp;lt;" becomes "&lt;" and is not decoded twice.
function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith('#')) {
      const codePoint = entity[1].toLowerCase() === 'x'
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10)
      return codePoint > 0 && codePoint <= 0x10ffff ? String.fromCodePoint(codePoint) : match
    }
    return NAMED_ENTITIES[entity.toLowerCase()] ?? match
  })
}

function decodeXml(value: string): string {
  const text = value.trim().replace(/^<!\[CDATA\[|\]\]>$/g, '')
  return decodeEntities(text.replace(/<[^>]+>/g, ' '))
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

// Topic feeds: the general nasa.gov feed mixes stories with internal pages (travel,
// procurement, technology transfer…). Each topic feed also gives a reliable category.
export const NASA_NEWS_FEEDS: ReadonlyArray<{ url: string; category: string }> = [
  { url: 'https://www.nasa.gov/solar-system/feed/', category: 'Système solaire' },
  { url: 'https://www.nasa.gov/missions/mars-2020-perseverance/feed/', category: 'Mars' },
  { url: 'https://www.nasa.gov/universe/feed/', category: 'Univers' },
  { url: 'https://www.nasa.gov/missions/webb/feed/', category: 'Univers' },
  { url: 'https://www.nasa.gov/missions/hubble/feed/', category: 'Univers' },
  { url: 'https://www.nasa.gov/missions/artemis/feed/', category: 'Exploration' },
  { url: 'https://www.nasa.gov/missions/station/feed/', category: 'Exploration' },
  { url: 'https://www.nasa.gov/earth/feed/', category: 'Terre' },
]

const NOT_FOR_YOUNG_READERS = /\/(centers-and-facilities|directorates|organizations|technology|careers|nssc|budgets?|procurement)\//i

export function isSuitableArticle(article: Pick<NewsArticle, 'title' | 'url'>): boolean {
  return article.url.startsWith('https://') && !NOT_FOR_YOUNG_READERS.test(article.url) && article.title.trim().toLowerCase() !== 'travel'
}

export function parseNasaNewsFeed(xml: string, category?: string): NewsArticle[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || []

  return items
    .map((item): NewsArticle | null => {
      const title = xmlTag(item, 'title')
      const url = xmlTag(item, 'link')
      const summary = xmlTag(item, 'description')
      const published = xmlTag(item, 'pubDate')
      if (!title || !url) return null

      const parsedDate = published ? new Date(published) : null
      return {
        title,
        source: 'NASA',
        url,
        date: parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : null,
        summary: summary || 'Consultez l’article complet sur le site officiel de la NASA.',
        category: category ?? classifyArticle(`${title} ${summary}`),
      }
    })
    .filter((article): article is NewsArticle => article !== null && isSuitableArticle(article))
    .slice(0, 18)
}

/** Merges topic feeds: one entry per URL, newest first. */
export function mergeNewsArticles(groups: NewsArticle[][], limit = 24): NewsArticle[] {
  const byUrl = new Map<string, NewsArticle>()
  for (const article of groups.flat()) {
    if (!byUrl.has(article.url)) byUrl.set(article.url, article)
  }
  return [...byUrl.values()]
    .sort((a, b) => (b.date ? Date.parse(b.date) : 0) - (a.date ? Date.parse(a.date) : 0))
    .slice(0, limit)
}

export async function getNasaNews(): Promise<{ articles: NewsArticle[]; updatedAt: string }> {
  const results = await Promise.allSettled(NASA_NEWS_FEEDS.map(async feed => {
    const response = await fetchWithTimeout(feed.url, 1_800, 'space-news', 'application/rss+xml, application/xml, text/xml')
    return parseNasaNewsFeed(await response.text(), feed.category)
  }))
  const groups = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : [])
  if (!groups.length) throw new Error('NASA news feeds unavailable')
  return { articles: mergeNewsArticles(groups), updatedAt: new Date().toISOString() }
}

export function getNasaApiKey(): string {
  return NASA_API_KEY
}
