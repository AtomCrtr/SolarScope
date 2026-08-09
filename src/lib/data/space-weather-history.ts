export type KpEntry = { time: string; kp: number }
export type PlasmaEntry = { time: string; density: number; speed: number }
export type HistorySourceState = 'live' | 'cached' | 'unavailable'

export type SpaceWeatherHistoryPayload = {
  kp: KpEntry[]
  plasma: PlasmaEntry[]
  updatedAt: string
  cachedAt?: string
  status: 'live' | 'partial' | 'cached'
  sources: {
    kp: HistorySourceState
    plasma: HistorySourceState
  }
  warning?: string
}

function finite(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null
}

export function parseKpHistory(payload: unknown): KpEntry[] {
  if (!Array.isArray(payload)) return []

  return payload.flatMap((row, index) => {
    const item = record(row)
    if (item) {
      const time = typeof item.time_tag === 'string' ? item.time_tag : null
      const kp = finite(item.Kp ?? item.kp)
      return time && kp !== null && kp >= 0 && kp <= 9 ? [{ time, kp }] : []
    }

    if (!Array.isArray(row)) return []
    const header = Array.isArray(payload[0]) ? payload[0].map(value => String(value).toLowerCase()) : []
    const timeIndex = Math.max(0, header.findIndex(value => value === 'time_tag' || value === 'time'))
    const kpIndex = header.findIndex(value => value === 'kp')
    if (index === 0 && header.some(value => value === 'kp')) return []
    const time = typeof row[timeIndex] === 'string' ? row[timeIndex] : null
    const kp = finite(row[kpIndex >= 0 ? kpIndex : 1])
    return time && kp !== null && kp >= 0 && kp <= 9 ? [{ time, kp }] : []
  }).slice(-56)
}

export function parsePlasmaHistory(payload: unknown): PlasmaEntry[] {
  if (!Array.isArray(payload)) return []
  const header = Array.isArray(payload[0]) ? payload[0].map(value => String(value).toLowerCase()) : []
  const timeIndex = Math.max(0, header.findIndex(value => value === 'time_tag' || value === 'time'))
  const speedIndex = header.findIndex(value => value === 'speed')
  const densityIndex = header.findIndex(value => value === 'density')

  return payload.flatMap((row, index) => {
    const item = record(row)
    if (item) {
      const time = typeof item.time_tag === 'string' ? item.time_tag : null
      const speed = finite(item.speed ?? item.proton_speed)
      const density = finite(item.density)
      return time && speed !== null && density !== null && speed >= 0 && density >= 0
        ? [{ time, speed, density }]
        : []
    }

    if (!Array.isArray(row) || index === 0) return []
    const time = typeof row[timeIndex] === 'string' ? row[timeIndex] : null
    const speed = finite(row[speedIndex >= 0 ? speedIndex : 1])
    const density = finite(row[densityIndex >= 0 ? densityIndex : 2])
    return time && speed !== null && density !== null && speed >= 0 && density >= 0
      ? [{ time, speed, density }]
      : []
  }).slice(-96)
}
