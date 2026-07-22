import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = ['/', '/mars', '/iss', '/jwst', '/meteorites', '/planetes', '/solarbot', '/confidentialite']

for (const route of routes) {
  test(`${route} has no serious automated accessibility violation`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' })
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations.filter(violation => ['serious', 'critical'].includes(violation.impact ?? ''))).toEqual([])
  })
}

test('the homepage does not overflow on a 320 px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  const widths = await page.evaluate(() => ({ client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }))
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1)
})
