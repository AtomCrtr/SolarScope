import { NextResponse } from 'next/server'

type KpEntry = { time: string; kp: number }
type PlasmaEntry = { time: string; density: number; speed: number }

function finite(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export async function GET() {
  try {
    const [kpResponse, plasmaResponse] = await Promise.all([
      fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json', {
        signal: AbortSignal.timeout(8_000),
        next: { revalidate: 900 },
      }),
      fetch('https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json', {
        signal: AbortSignal.timeout(8_000),
        next: { revalidate: 900 },
      }),
    ])

    if (!kpResponse.ok || !plasmaResponse.ok) throw new Error('NOAA unavailable')
    const [rawKp, rawPlasma] = await Promise.all([
      kpResponse.json() as Promise<unknown>,
      plasmaResponse.json() as Promise<unknown>,
    ])

    const kp: KpEntry[] = Array.isArray(rawKp)
      ? rawKp.slice(1).flatMap((row) => {
          if (!Array.isArray(row) || typeof row[0] !== 'string') return []
          const value = finite(row[1])
          return value === null || value < 0 || value > 9 ? [] : [{ time: row[0], kp: value }]
        }).slice(-56)
      : []

    const plasma: PlasmaEntry[] = Array.isArray(rawPlasma)
      ? rawPlasma.flatMap((row) => {
          if (!Array.isArray(row) || typeof row[0] !== 'string' || row[0] === 'time_tag') return []
          const density = finite(row[1])
          const speed = finite(row[2])
          return density === null || speed === null || density < 0 || speed < 0
            ? []
            : [{ time: row[0], density, speed }]
        }).slice(-96)
      : []

    if (!kp.length || !plasma.length) throw new Error('NOAA returned invalid data')
    return NextResponse.json(
      { kp, plasma, updatedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600' } },
    )
  } catch {
    return NextResponse.json(
      { error: 'Historique NOAA temporairement indisponible.', kp: [], plasma: [] },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
