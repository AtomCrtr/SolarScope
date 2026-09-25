const TAP_URL = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync'
const LIGHT_YEARS_PER_PARSEC = 3.26156

export type ExoplanetSummary = {
  name: string
  star: string
  lightYears: number
  /** Radius compared to the Earth (estimated from the mass when the planet was not seen transiting). */
  earthRadii: number | null
  year: number | null
  method: string
  temperatureC: number | null
}

export type ExoplanetCatalog = {
  total: number
  nearest: ExoplanetSummary[]
  earthLike: ExoplanetSummary[]
  methods: Array<{ method: string; count: number }>
  updatedAt: string
}

const METHOD_NAMES: Record<string, string> = {
  Transit: 'Transit : la planète passe devant son étoile',
  'Radial Velocity': 'Vitesse radiale : l’étoile « tremble »',
  Microlensing: 'Microlentille : la lumière d’une étoile est déviée',
  Imaging: 'Image directe : la planète est photographiée',
}

export function methodLabel(method: string): string {
  return METHOD_NAMES[method] ?? 'Autres méthodes'
}

type Row = Record<string, unknown>
const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null)
const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : null)

export function parseExoplanetRows(payload: unknown): ExoplanetSummary[] {
  if (!Array.isArray(payload)) return []
  return payload
    .filter((row): row is Row => typeof row === 'object' && row !== null)
    .flatMap(row => {
      const name = text(row.pl_name)
      const distance = num(row.sy_dist)
      if (!name || distance === null) return []
      const kelvin = num(row.pl_eqt)
      return [{
        name,
        star: text(row.hostname) ?? name.replace(/\s+\S+$/, ''),
        lightYears: Math.round(distance * LIGHT_YEARS_PER_PARSEC * 10) / 10,
        earthRadii: num(row.pl_rade),
        year: num(row.disc_year),
        method: methodLabel(text(row.discoverymethod) ?? ''),
        temperatureC: kelvin === null ? null : Math.round(kelvin - 273.15),
      }]
    })
    // The archive applies TOP before ORDER BY: always sort here.
    .sort((a, b) => a.lightYears - b.lightYears)
}

/** Groups the archive's method counts into the four main methods plus « Autres méthodes ». */
export function groupMethods(payload: unknown): Array<{ method: string; count: number }> {
  if (!Array.isArray(payload)) return []
  const totals = new Map<string, number>()
  for (const row of payload) {
    if (typeof row !== 'object' || row === null) continue
    const count = num((row as Row).n)
    if (count === null) continue
    const label = methodLabel(text((row as Row).discoverymethod) ?? '')
    totals.set(label, (totals.get(label) ?? 0) + count)
  }
  return [...totals].map(([method, count]) => ({ method, count })).sort((a, b) => b.count - a.count)
}

async function query(adql: string): Promise<unknown> {
  const url = new URL(TAP_URL)
  url.searchParams.set('query', adql)
  url.searchParams.set('format', 'json')
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000), next: { revalidate: 86_400, tags: ['space-exoplanets'] } })
  if (!response.ok) throw new Error(`Exoplanet Archive ${response.status}`)
  return response.json()
}

export async function getExoplanetCatalog(): Promise<ExoplanetCatalog> {
  const [total, nearest, earthLike, methods] = await Promise.all([
    query('select count(*) as n from pscomppars'),
    query('select pl_name,hostname,sy_dist,pl_rade,pl_eqt,disc_year,discoverymethod from pscomppars where sy_dist < 4'),
    // Rocky-sized planets receiving a temperature compatible with liquid water, within 650 light-years.
    query('select pl_name,hostname,sy_dist,pl_rade,pl_eqt,disc_year,discoverymethod from pscomppars where pl_rade between 0.7 and 1.6 and pl_eqt between 180 and 310 and sy_dist < 200'),
    query('select discoverymethod,count(*) as n from pscomppars group by discoverymethod'),
  ])
  const count = Array.isArray(total) ? num((total[0] as Row | undefined)?.n) : null
  if (count === null) throw new Error('Invalid exoplanet count')

  return {
    total: count,
    nearest: parseExoplanetRows(nearest).slice(0, 8),
    earthLike: parseExoplanetRows(earthLike).slice(0, 8),
    methods: groupMethods(methods),
    updatedAt: new Date().toISOString(),
  }
}
