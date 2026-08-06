import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

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

async function gotoSettled(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'load' })
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)
}

for (const route of routes) {
  test(`${route} has no serious automated accessibility violation`, async ({ page }) => {
    await gotoSettled(page, route)
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
  const diagnostics: string[] = []
  page.on('console', message => {
    if (message.type() === 'error' || message.type() === 'warning') diagnostics.push(`console ${message.type()}: ${message.text()}`)
  })
  page.on('requestfailed', request => diagnostics.push(`request failed: ${request.url()} (${request.failure()?.errorText ?? 'unknown error'})`))
  page.on('response', response => {
    if (/\/(?:models|draco)\//.test(response.url())) {
      diagnostics.push(`response ${response.status()}: ${response.url()}`)
    }
  })
  await page.goto('/mars', { waitUntil: 'domcontentloaded' })
  const mission = page.locator('[data-mars-mission]')
  await expect(mission).toBeVisible()
  await expect(mission.locator('.mars-mission-steps > li')).toHaveCount(3)
  await mission.getByRole('button', { name: /Perseverance/ }).click()
  await expect(mission.getByText('Chercher des traces d’une ancienne vie microbienne')).toBeVisible()
  try {
    await expect(page.getByText('Chargement modèle 3D…')).toBeHidden({ timeout: 15_000 })
  } catch (error) {
    console.error(`Mars 3D diagnostics:\n${diagnostics.join('\n')}`)
    throw error
  }
  await expect(page.getByRole('img', { name: /modèle interactif.*Perseverance/i })).toBeVisible()
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

test('the homepage keeps its learning paths visible in a short desktop viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1580, height: 850 })
  await gotoSettled(page, '/')

  const notebookLocator = page.locator('.home-featured-notebook')
  const missionActionLocator = page.locator('.home-featured-action')
  const routesLocator = page.locator('.home-routes-section')
  const firstPathLocator = page.locator('.home-path-card').first()
  await expect(notebookLocator).toBeVisible()
  await expect(missionActionLocator).toBeVisible()
  await expect(routesLocator).toBeVisible()
  await expect(firstPathLocator).toBeVisible()

  const notebook = await notebookLocator.boundingBox()
  const missionAction = await missionActionLocator.boundingBox()
  const routes = await routesLocator.boundingBox()
  const firstPath = await firstPathLocator.boundingBox()

  expect(notebook).not.toBeNull()
  expect(missionAction).not.toBeNull()
  expect(routes).not.toBeNull()
  expect(firstPath).not.toBeNull()
  if (notebook && missionAction && routes && firstPath) {
    expect(missionAction.y + missionAction.height).toBeLessThan(notebook.y + notebook.height - 24)
    expect(routes.y).toBeGreaterThanOrEqual(notebook.y + notebook.height - 1)
    expect(firstPath.y).toBeLessThan(850)
  }
})

test('the broken light theme cannot be restored from old browser storage', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('solarscope-theme', 'light'))
  await gotoSettled(page, '/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByTitle(/mode clair|mode sombre/i)).toHaveCount(0)
})

test('the sky journey uses an accessible external map instead of a broken iframe', async ({ page }) => {
  await gotoSettled(page, '/ciel')
  await expect(page.locator('iframe')).toHaveCount(0)
  const mapLink = page.getByRole('link', { name: /Ouvrir la carte dans Stellarium/ })
  await expect(mapLink).toBeVisible()
  await expect(mapLink).toHaveAttribute('target', '_blank')
})

test('footer links expose child-friendly touch targets on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await gotoSettled(page, '/sources')
  const heights = await page.locator('.site-footer a').evaluateAll(links => links.map(link => link.getBoundingClientRect().height))
  expect(Math.min(...heights)).toBeGreaterThanOrEqual(44)
})

test('the mission action remains inside the notebook at common viewport sizes', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 700 },
    { width: 768, height: 900 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport)
    await gotoSettled(page, '/')
    const notebookLocator = page.locator('.home-featured-notebook')
    const actionLocator = page.locator('.home-featured-action')
    await expect(notebookLocator).toBeVisible()
    await expect(actionLocator).toBeVisible()
    const notebook = await notebookLocator.boundingBox()
    const action = await actionLocator.boundingBox()
    expect(notebook, `${viewport.width}x${viewport.height}`).not.toBeNull()
    expect(action, `${viewport.width}x${viewport.height}`).not.toBeNull()
    if (notebook && action) {
      expect(action.x).toBeGreaterThanOrEqual(notebook.x)
      expect(action.y).toBeGreaterThanOrEqual(notebook.y)
      expect(action.x + action.width).toBeLessThanOrEqual(notebook.x + notebook.width)
      expect(action.y + action.height).toBeLessThanOrEqual(notebook.y + notebook.height)
    }
  }
})

test('English is presented as a complete home-page preview and a limited lesson translation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const english = page.getByRole('button', { name: 'EN preview' })
  await english.click()

  await expect(page.locator('.home-category-card').filter({ hasText: 'Solar System' })).toBeVisible()
  await expect(page.getByText(/Data sources/)).toBeVisible()

  await page.goto('/planetes', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('English preview', { exact: true })).toBeVisible()
  await expect(page.getByText('This detailed lesson is currently available in French.')).toBeVisible()
})

test('SolarBot displays the official sources returned with an answer', async ({ page }) => {
  await page.route('**/api/gemini', route => route.fulfill({ json: {
    text: 'Les étoiles produisent leur lumière grâce à la fusion nucléaire.',
    sources: [{ id: 'nasa-stars', label: 'NASA Science — Stars', href: 'https://science.nasa.gov/universe/stars/', organization: 'NASA' }],
  } }))
  await page.goto('/solarbot', { waitUntil: 'domcontentloaded' })
  await page.getByRole('textbox', { name: 'Question pour SolarBot' }).fill('Pourquoi les étoiles brillent-elles ?')
  await page.getByRole('button', { name: 'Envoyer la question' }).click()

  const source = page.getByRole('link', { name: /NASA Science — Stars/ })
  await expect(source).toBeVisible()
  await expect(source).toHaveAttribute('href', 'https://science.nasa.gov/universe/stars/')
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
  await gotoSettled(page, '/parents-enseignants')
  const cards = page.locator('.parent-guide')
  await expect(cards).toHaveCount(4)
  await expect(cards.first()).toBeVisible()

  for (let index = 0; index < await cards.count(); index += 1) {
    const badges = cards.nth(index).locator(':scope > div > span')
    await expect(badges).toHaveCount(2)
    await expect(badges.nth(0)).toBeVisible()
    await expect(badges.nth(1)).toBeVisible()
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
