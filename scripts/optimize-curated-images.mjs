import { mkdir, stat } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

const assets = [
  ['jwst/carina.webp', 'https://esawebb.org/media/archives/images/large/weic2205a.jpg'],
  ['jwst/pillars-of-creation.webp', 'https://stsci-opo.org/STScI-01GFNN3PWJMY4RQXKZ585BC4QH.png'],
  ['jwst/southern-ring.webp', 'https://stsci-opo.org/STScI-01G8GZQ3ZFJRD8YF8YZWMAXCE3.png'],
  ['jwst/stephans-quintet.webp', 'https://esawebb.org/media/archives/images/large/weic2208a.jpg'],
  ['jwst/tarantula.webp', 'https://esawebb.org/media/archives/images/large/weic2209a.jpg'],
  ['mars/ingenuity-first-flight.webp', 'https://images-assets.nasa.gov/image/PIA24430/PIA24430~orig.jpg'],
  ['mars/perseverance-jezero.webp', 'https://images-assets.nasa.gov/image/PIA24546/PIA24546~orig.jpg'],
  ['mars/perseverance-selfie.webp', 'https://images-assets.nasa.gov/image/PIA24542/PIA24542~orig.jpg'],
  ['mars/martian-sunset.webp', 'https://images-assets.nasa.gov/image/PIA19839/PIA19839~orig.jpg'],
  ['mars/dark-sand-dunes.webp', 'https://images-assets.nasa.gov/image/PIA24836/PIA24836~orig.jpg'],
]

const outputRoot = join(process.cwd(), 'public', 'media')

for (const [relativePath, url] of assets) {
  const outputPath = join(outputRoot, relativePath)
  await mkdir(dirname(outputPath), { recursive: true })

  const response = await fetch(url, { signal: AbortSignal.timeout(90_000) })
  if (!response.ok) throw new Error(`${response.status} while downloading ${url}`)

  const input = Buffer.from(await response.arrayBuffer())
  await sharp(input)
    .rotate()
    .resize({ width: 1600, height: 1100, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(outputPath)

  const result = await stat(outputPath)
  console.log(`${relativePath}: ${Math.round(result.size / 1024)} KiB`)
}
