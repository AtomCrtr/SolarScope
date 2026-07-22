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

const routes = ['/', ...learningRoutes, '/confidentialite']

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
  }
})

test('the homepage does not overflow on a 320 px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1)
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
