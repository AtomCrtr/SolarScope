import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

const sourceRoot = path.resolve('src/app')
const siteUrl = (process.env.SITE_URL || 'https://solar-scope.vercel.app').replace(/\/$/, '')

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(entries.map(entry => {
    const target = path.join(directory, entry.name)
    return entry.isDirectory() ? collectFiles(target) : entry.name.endsWith('.tsx') ? [target] : []
  }))
  return nested.flat()
}

const youtubeIds = new Set()
for (const file of await collectFiles(sourceRoot)) {
  const source = await readFile(file, 'utf8')
  for (const match of source.matchAll(/https:\/\/www\.youtube\.com\/watch\?v=([A-Za-z0-9_-]+)/g)) youtubeIds.add(match[1])
}

const failures = []
for (const id of youtubeIds) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    console.log(`YouTube OK  ${id}`)
  } catch (error) {
    failures.push(`YouTube ${id}: ${error instanceof Error ? error.message : 'unknown error'}`)
  }
}

try {
  const response = await fetch(`${siteUrl}/api/health`, { signal: AbortSignal.timeout(20_000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  console.log(`Health OK   ${siteUrl}/api/health`)
} catch (error) {
  failures.push(`Health endpoint: ${error instanceof Error ? error.message : 'unknown error'}`)
}

console.log(`Checked ${youtubeIds.size} unique YouTube resource(s).`)
if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
