import { NextResponse } from 'next/server'
import {
  parseKpHistory,
  parsePlasmaHistory,
  type KpEntry,
  type PlasmaEntry,
  type SpaceWeatherHistoryPayload,
} from '@/lib/data/space-weather-history'

const KP_URL = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
const PLASMA_URL = 'https://services.swpc.noaa.gov/products/geospace/propagated-solar-wind-1-hour.json'

let lastKnown: { kp: KpEntry[]; plasma: PlasmaEntry[]; cachedAt: string } | null = null

async function fetchJson(url: string) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8_000),
    next: { revalidate: 900 },
    headers: { 'User-Agent': 'SolarScope/1.0 educational astronomy app' },
  })
  if (!response.ok) throw new Error(`NOAA ${response.status}`)
  return response.json() as Promise<unknown>
}

export async function GET() {
  const [kpResult, plasmaResult] = await Promise.allSettled([fetchJson(KP_URL), fetchJson(PLASMA_URL)])
  const liveKp = kpResult.status === 'fulfilled' ? parseKpHistory(kpResult.value) : []
  const livePlasma = plasmaResult.status === 'fulfilled' ? parsePlasmaHistory(plasmaResult.value) : []
  const now = new Date().toISOString()

  const kp = liveKp.length ? liveKp : lastKnown?.kp ?? []
  const plasma = livePlasma.length ? livePlasma : lastKnown?.plasma ?? []
  if (!kp.length && !plasma.length) {
    return NextResponse.json(
      {
        error: 'Historique NOAA temporairement indisponible.',
        kp: [],
        plasma: [],
        updatedAt: now,
        status: 'cached',
        sources: { kp: 'unavailable', plasma: 'unavailable' },
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  if (liveKp.length || livePlasma.length) {
    lastKnown = {
      kp: liveKp.length ? liveKp : lastKnown?.kp ?? [],
      plasma: livePlasma.length ? livePlasma : lastKnown?.plasma ?? [],
      cachedAt: now,
    }
  }

  const kpState = liveKp.length ? 'live' : kp.length ? 'cached' : 'unavailable'
  const plasmaState = livePlasma.length ? 'live' : plasma.length ? 'cached' : 'unavailable'
  const status: SpaceWeatherHistoryPayload['status'] = kpState === 'live' && plasmaState === 'live'
    ? 'live'
    : kpState === 'cached' && plasmaState === 'cached'
      ? 'cached'
      : 'partial'
  const payload: SpaceWeatherHistoryPayload = {
    kp,
    plasma,
    updatedAt: now,
    cachedAt: status === 'live' ? undefined : lastKnown?.cachedAt,
    status,
    sources: { kp: kpState, plasma: plasmaState },
    warning: status === 'live' ? undefined : 'Une dernière série connue est affichée pour le flux indisponible.',
  }

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=86400' },
  })
}
