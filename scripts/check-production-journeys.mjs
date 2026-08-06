import { chromium } from '@playwright/test'

const baseUrl = (process.env.SITE_URL || 'https://solar-scope.vercel.app').replace(/\/$/, '')
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await context.newPage()

async function open(route) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60_000 })
  if (!response?.ok()) throw new Error(`${route} returned ${response?.status() || 'no response'}`)
}

await open('/ciel')
if (await page.locator('iframe').count()) throw new Error('/ciel still embeds an unreliable iframe')
await page.getByRole('link', { name: /Ouvrir la carte dans Stellarium/ }).waitFor({ state: 'visible' })

await open('/mars')
await page.locator('[data-mars-mission]').getByRole('button', { name: /Perseverance/ }).click()
await page.getByText('Chargement modèle 3D…').waitFor({ state: 'hidden', timeout: 20_000 })
await page.getByRole('img', { name: /modèle interactif.*Perseverance/i }).waitFor({ state: 'visible' })

await open('/jwst')
const jwstTransfer = await page.evaluate(() => performance.getEntriesByType('resource').reduce((total, entry) => total + entry.transferSize, 0))
if (jwstTransfer > 3_000_000) throw new Error(`/jwst transferred ${jwstTransfer} bytes (budget: 3 MB)`)

console.log(JSON.stringify({ ok: true, baseUrl, jwstTransfer }))
await browser.close()
