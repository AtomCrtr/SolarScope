import { expect, test, type Page } from '@playwright/test'

const routes = [
  '/', '/soleil', '/planetes', '/mars', '/asteroides', '/meteorites', '/iss', '/missions', '/jwst',
  '/ciel', '/photo-du-jour', '/exoplanetes', '/actualites', '/quiz', '/solarbot', '/passeport',
  '/parents-enseignants', '/sources', '/confidentialite',
]

async function expectPageToFit(page: Page, route: string) {
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
  expect(response?.status(), `${route} should load`).toBeLessThan(400)
  await page.waitForTimeout(150)

  const state = await page.evaluate(() => ({
    hasContent: document.body.innerText.trim().length > 50,
    hasNextError: Boolean(document.querySelector('nextjs-portal')),
    overflows: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }))

  expect(state, `${route} should render without a layout failure`).toEqual({
    hasContent: true,
    hasNextError: false,
    overflows: false,
  })
}

test('every public page fits the configured phone or tablet', async ({ page }) => {
  for (const route of routes) await expectPageToFit(page, route)
})

test('public pages also fit in landscape on touch devices', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Desktop already exercises a wide landscape viewport')
  const viewport = page.viewportSize()
  test.skip(!viewport, 'This project has no fixed viewport')
  await page.setViewportSize({ width: viewport!.height, height: viewport!.width })
  for (const route of routes) await expectPageToFit(page, route)
})

test('standalone mobile links provide a usable touch surface', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'desktop', 'Touch target sizing is checked on touch projects')

  for (const route of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const undersized = await page.locator('.touch-link, .breadcrumb-link, .source-card a, .prose-card p > a:only-child').evaluateAll(elements => (
      elements
        .map(element => {
          const rect = element.getBoundingClientRect()
          return { text: element.textContent?.trim(), width: rect.width, height: rect.height }
        })
        .filter(target => target.width > 0 && target.height > 0 && (target.width < 24 || target.height < 24))
    ))
    expect(undersized, `${route} has an undersized standalone action`).toEqual([])
  }
})

test('the mobile menu remains usable', async ({ page }, testInfo) => {
  const viewport = page.viewportSize()
  test.skip(testInfo.project.name === 'desktop' || !viewport || viewport.width >= 768, 'This viewport uses the expanded navigation')
  await page.goto('/')
  const menuButton = page.getByRole('button', { name: 'Ouvrir le menu' })
  await menuButton.click()
  await expect(page.locator('#mobile-navigation')).toBeVisible()
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: /Accueil/ })).toBeVisible()

  const solarSystemButton = page.getByRole('button', { name: /Système Solaire/ })
  await expect(solarSystemButton).toHaveAttribute('aria-expanded', 'false')
  await expect(solarSystemButton).toHaveAttribute('aria-controls', 'mobile-navigation-group-systeme')
  await solarSystemButton.click()
  await expect(solarSystemButton).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#mobile-navigation-group-systeme')).toBeVisible()
})

test('the rover remains interactive in Safari-compatible WebKit', async ({ page }, testInfo) => {
  test.skip(!['iphone', 'ipad'].includes(testInfo.project.name), 'WebKit-specific 3D smoke test')
  const warnings: string[] = []
  page.on('console', message => {
    if (message.type() === 'warning') warnings.push(message.text())
  })
  await page.goto('/mars', { waitUntil: 'domcontentloaded' })
  await page.locator('[data-mars-mission]').getByRole('button', { name: /Perseverance/ }).click()
  const roverVisual = page.getByRole('img', { name: /interactif.*Perseverance/i })
  await expect(roverVisual).toBeVisible({ timeout: 20_000 })
  expect(warnings.filter(message => message.includes('THREE.Clock'))).toEqual([])
})

test('the install manifest and offline worker are published', async ({ request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'One browser is enough for static PWA assets')
  const manifestResponse = await request.get('/manifest.webmanifest')
  expect(manifestResponse.ok()).toBe(true)
  const manifest = await manifestResponse.json()
  expect(manifest.display).toBe('standalone')
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192' }),
    expect.objectContaining({ sizes: '512x512' }),
    expect.objectContaining({ purpose: 'maskable' }),
  ]))

  const workerResponse = await request.get('/sw.js')
  expect(workerResponse.ok()).toBe(true)
  expect(await workerResponse.text()).toContain("caches.match('/offline')")
})
