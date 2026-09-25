// NASA « Meteorite Landings » (Meteoritical Society data, about 45 000 entries).
// Read at runtime and kept in memory: SolarScope stores no permanent copy.
const DATASET_URL = 'https://data.nasa.gov/docs/legacy/meteorite_landings/Meteorite_Landings.csv'
const CACHE_MS = 24 * 3_600_000
const EARTH_RADIUS_KM = 6_371

export type MeteoriteRecord = {
  name: string
  recclass: string
  massG: number | null
  fell: boolean
  year: number | null
  lat: number
  lon: number
}

/** Splits one CSV line, honouring double-quoted fields (« "(50.775, 6.08333)" »). */
function splitCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index]
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (character === ',' && !quoted) {
      fields.push(current)
      current = ''
    } else {
      current += character
    }
  }
  fields.push(current)
  return fields
}

export function parseMeteoriteCsv(csv: string, currentYear = new Date().getUTCFullYear()): MeteoriteRecord[] {
  const [header, ...lines] = csv.split(/\r?\n/)
  if (!header) return []
  const columns = splitCsvLine(header)
  const at = (name: string) => columns.indexOf(name)
  const index = {
    name: at('name'), nametype: at('nametype'), recclass: at('recclass'), mass: at('mass (g)'),
    fall: at('fall'), year: at('year'), lat: at('reclat'), lon: at('reclong'),
  }
  if (Object.values(index).some(position => position < 0)) return []

  const records: MeteoriteRecord[] = []
  for (const line of lines) {
    if (!line.trim()) continue
    const fields = splitCsvLine(line)
    if (fields[index.nametype] !== 'Valid') continue
    const lat = Number(fields[index.lat])
    const lon = Number(fields[index.lon])
    // 0,0 is used in the dataset for « unknown place ».
    if (!fields[index.lat] || !fields[index.lon] || !Number.isFinite(lat) || !Number.isFinite(lon) || (lat === 0 && lon === 0)) continue
    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) continue
    const mass = Number(fields[index.mass])
    const year = Math.trunc(Number(fields[index.year]))
    records.push({
      name: fields[index.name],
      recclass: fields[index.recclass],
      massG: fields[index.mass] && Number.isFinite(mass) ? mass : null,
      fell: fields[index.fall] === 'Fell',
      // The dataset contains a few impossible years (e.g. 2101).
      year: fields[index.year] && Number.isFinite(year) && year <= currentYear ? year : null,
      lat,
      lon,
    })
  }
  return records
}

export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLon = (lon2 - lon1) * rad
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a))
}

export type NearbyMeteorite = Omit<MeteoriteRecord, 'lat' | 'lon'> & { distanceKm: number }

/** Public shape: exact find coordinates are not needed by the pages. */
function withoutPosition(record: MeteoriteRecord): Omit<MeteoriteRecord, 'lat' | 'lon'> {
  return { name: record.name, recclass: record.recclass, massG: record.massG, fell: record.fell, year: record.year }
}

export function meteoritesNear(records: MeteoriteRecord[], lat: number, lon: number, limit = 8) {
  const withDistance = records.map(record => ({ record, km: distanceKm(lat, lon, record.lat, record.lon) }))
  const nearest: NearbyMeteorite[] = withDistance
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
    .map(({ record, km }) => ({ ...withoutPosition(record), distanceKm: Math.round(km) }))
  return {
    nearest,
    within100Km: withDistance.filter(item => item.km <= 100).length,
    within500Km: withDistance.filter(item => item.km <= 500).length,
  }
}

export function meteoriteSummary(records: MeteoriteRecord[]) {
  const heaviest = [...records]
    .filter(record => record.massG !== null)
    .sort((a, b) => (b.massG ?? 0) - (a.massG ?? 0))
    .slice(0, 5)
    .map(withoutPosition)
  return {
    total: records.length,
    seenFalling: records.filter(record => record.fell).length,
    heaviest,
  }
}

let cache: { records: MeteoriteRecord[]; loadedAt: number } | null = null
let loading: Promise<MeteoriteRecord[]> | null = null

async function download(): Promise<string> {
  let lastError: unknown
  // The dataset URL redirects to a signed storage link that occasionally fails once.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetch(DATASET_URL, { redirect: 'follow', cache: 'no-store', signal: AbortSignal.timeout(30_000) })
      if (!response.ok) throw new Error(`NASA meteorites ${response.status}`)
      return await response.text()
    } catch (error) {
      lastError = error
    }
  }
  throw lastError
}

export async function loadMeteorites(): Promise<MeteoriteRecord[]> {
  if (cache && Date.now() - cache.loadedAt < CACHE_MS) return cache.records
  loading ??= download()
    .then(csv => {
      const records = parseMeteoriteCsv(csv)
      if (records.length < 1_000) throw new Error('Unexpected meteorite dataset')
      cache = { records, loadedAt: Date.now() }
      return records
    })
    .finally(() => { loading = null })
  return loading
}
