import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const learningRoutes = [
  '/soleil',
  '/planetes',
  '/mars',
  '/asteroides',
  '/meteorites',
  '/iss',
  '/missions',
  '/jwst',
  '/ciel',
  '/photo-du-jour',
  '/exoplanetes',
  '/actualites',
  '/quiz',
  '/solarbot',
]

const routes = ['/', ...learningRoutes, '/passeport', '/parents-enseignants', '/sources', '/confidentialite']

for (const route of routes) {
  test(`${route} has no serious automated accessibility violation`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])
  })
}

test('every learning route starts with the child-friendly guide', async ({ page }) => {
  for (const route of learningRoutes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const guide = page.locator('[data-learning-guide]')
    await expect(guide, `${route} should expose its learning guide`).toBeVisible()
    await expect(guide.locator('.kids-listen-button')).toBeVisible()
    await expect(guide.locator('.kids-takeaways li')).toHaveCount(3)
    await expect(guide.locator('[data-quick-mission] li')).toHaveCount(3)
  }
})

test('the planet explorer offers a short accessible interaction and a comparison', async ({ page }) => {
  await page.goto('/planetes', { waitUntil: 'domcontentloaded' })
  const explorer = page.locator('[data-planet-explorer]')
  await expect(explorer).toBeVisible()
  await expect(explorer.locator('.planet-explorer-selector button')).toHaveCount(8)

  await explorer.getByRole('button', { name: 'Jupiter' }).click()
  await expect(explorer.getByText('Jupiter', { exact: true }).first()).toBeVisible()
  await explorer.getByRole('button', { name: /Comparer avec la Terre/ }).click()
  await expect(explorer.getByText('Jupiter comparée à la Terre')).toBeVisible()
  await explorer.getByRole('button', { name: 'Jupiter', exact: true }).last().click()
  await expect(explorer.getByText('Bravo !')).toBeVisible()
})

test('the planet explorer stays inside a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 })
  await page.goto('/planetes', { waitUntil: 'domcontentloaded' })
  const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1)
})

test('the Mars mission exposes a short rover journey and keeps its gallery dialog keyboard-friendly', async ({ page }) => {
  await page.goto('/mars', { waitUntil: 'domcontentloaded' })
  const mission = page.locator('[data-mars-mission]')
  await expect(mission).toBeVisible()
  await expect(mission.locator('.mars-mission-steps > li')).toHaveCount(3)
  await mission.getByRole('button', { name: /Perseverance/ }).click()
  await expect(mission.getByText('Chercher des traces d’une ancienne vie microbienne')).toBeVisible()
  await mission.getByRole('button', { name: 'Ouvrir l’indice' }).click()
  await expect(mission.getByText('Perseverance explore d’anciens paysages')).toBeVisible()

  const galleryButton = page.getByRole('button', { name: /Agrandir/ }).first()
  await galleryButton.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(galleryButton).toBeFocused()
})

test('the homepage does not overflow on a 320 px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1)
})

test('the homepage remembers the 12+ route and shows its appropriate mission', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const board = page.locator('.home-mission-board')

  await expect(board.getByText('Pourquoi le ciel est-il bleu ?', { exact: true })).toBeVisible()
  await expect(board.locator('.home-path-card')).toHaveCount(4)
  const twelvePlus = board.getByRole('button', { name: '12+ ans', exact: true })
  await twelvePlus.click()
  await expect(twelvePlus).toHaveAttribute('aria-pressed', 'true')
  await expect(board.getByText('Comment la lumière révèle-t-elle l’Univers ?', { exact: true })).toBeVisible()

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.locator('.home-mission-board').getByText('Comment la lumière révèle-t-elle l’Univers ?', { exact: true })).toBeVisible()
})

test('parent guide badges keep their spacing and produce a visual artifact', async ({ page }, testInfo) => {
  await page.goto('/parents-enseignants', { waitUntil: 'domcontentloaded' })
  const cards = page.locator('.parent-guide')
  await expect(cards).toHaveCount(4)

  for (let index = 0; index < await cards.count(); index += 1) {
    const badges = cards.nth(index).locator(':scope > div > span')
    const first = await badges.nth(0).boundingBox()
    const second = await badges.nth(1).boundingBox()
    expect(first).not.toBeNull()
    expect(second).not.toBeNull()
    if (first && second && Math.abs(first.y - second.y) < 2) {
      expect(first.x + first.width + 2).toBeLessThanOrEqual(second.x)
    }
  }

  await page.screenshot({ path: testInfo.outputPath('parents-guide-layout.png'), fullPage: true })
})

const dashboardFixture = {
  updatedAt: '2026-07-22T20:00:00Z',
  exoplanetCount: 6324,
  nearEarthObjectCount: 62011,
  crew: [
    { name: 'Ada', craft: 'Crew Dragon', station: 'ISS' },
    { name: 'Alex', craft: 'Soyuz MS-29', station: 'ISS' },
    { name: 'Lin', craft: 'Shenzhou 23', station: 'Tiangong' },
  ],
  nextLaunch: { name: 'Future mission', net: '2026-08-01T10:00:00Z', agency: 'Agency', rocket: 'Rocket', url: null },
  sources: { exoplanets: true, asteroids: true, crew: true, launches: true },
}

test('homepage KPI counts ISS crew from their vehicles', async ({ page }) => {
  await page.route('**/api/dashboard', route => route.fulfill({ json: dashboardFixture }))
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const crewKpi = page.locator('.home-kpi', { hasText: 'personnes à bord de l’ISS' })
  await expect(crewKpi.locator('strong')).toHaveText('2')
})

test('ISS KPI use the validated server position feed', async ({ page }) => {
  await page.route('**/api/dashboard', route => route.fulfill({ json: dashboardFixture }))
  await page.route('**/api/iss-position', route => route.fulfill({ json: {
    latitude: 48.5,
    longitude: 2.2,
    altitude: 421.4,
    velocity: 27580,
    timestamp: 1784750400,
    updatedAt: '2026-07-22T20:00:00Z',
  } }))
  await page.goto('/iss', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.stat-card', { hasText: 'Altitude' }).locator('.stat-value')).toHaveText('421.4 km')
  await expect(page.getByText('2 pers.')).toBeVisible()
})

test('solar KPI render normalized NOAA data', async ({ page }) => {
  await page.route('**/api/space-weather', route => route.fulfill({ json: {
    wind: { speed: 440, density: 8.5, temperature: 220000 },
    magneticField: { bz: -2, bt: 4.6, lat: -25.8, lon: 166 },
    xrayHistory: [2e-7, 3e-7],
    observedAt: '2026-07-22T20:00:00Z',
    updatedAt: '2026-07-22T20:01:00Z',
    sources: { solarWind: true, xray: true },
  } }))
  await page.goto('/soleil', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('440 km/s', { exact: true })).toBeVisible()
  await expect(page.getByText('8.5 p/cm³', { exact: true })).toBeVisible()
  await expect(page.getByText('-2.0 nT', { exact: true })).toBeVisible()
})
