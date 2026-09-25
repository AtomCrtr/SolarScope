// Draws the SolarScope banner in HTML (site fonts, colours and Cosmo), then captures it with Playwright:
//   docs/banner.png                 1280×640 — README and GitHub social preview
//   src/app/opengraph-image.png     1200×630 — link previews of the website
// Usage: npm run banner:generate (needs network access for Google Fonts).
import { readFile, writeFile } from 'node:fs/promises'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const cosmo = await readFile(new URL('../public/mascot/cosmonaute.svg', import.meta.url), 'utf8')

// Deterministic star field, so the image only changes when the design does.
function stars(width, height, count) {
  let seed = 7
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  return Array.from({ length: count }, () => {
    const r = random() < 0.85 ? 0.8 + random() : 1.6 + random() * 0.8
    return `<circle cx="${(random() * width).toFixed(1)}" cy="${(random() * height).toFixed(1)}" r="${r.toFixed(2)}" fill="#eef1fa" opacity="${(0.25 + random() * 0.6).toFixed(2)}"/>`
  }).join('')
}

function page(width, height) {
  const scale = height / 640
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Caveat:wght@700&family=Fredoka:wght@500;600&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: ${width}px; height: ${height}px; overflow: hidden; background: #0b1026; }
  .banner { position: relative; width: ${width}px; height: 640px; transform: scale(${scale}); transform-origin: 0 0; width: ${width / scale}px;
    background: radial-gradient(circle at 76% 42%, #22306a 0%, #111a3d 34%, #0b1026 62%, #070a1c 100%); color: #eef1fa; font-family: 'Atkinson Hyperlegible', sans-serif; }
  .sky { position: absolute; inset: 0; width: 100%; height: 100%; }
  .cosmo svg { display: block; width: 100%; height: auto; }
  .text { position: absolute; left: 72px; top: 64px; width: 660px; }
  .logo { display: flex; align-items: center; gap: 12px; font: 600 34px 'Fredoka', sans-serif; }
  .hello { margin-top: 58px; color: #ff8a3d; font: 700 40px 'Caveat', cursive; transform: rotate(-2deg); transform-origin: left; }
  h1 { margin-top: 6px; font: 600 80px/0.98 'Fredoka', sans-serif; letter-spacing: -1px; }
  h1 span { color: #ffc24b; }
  p { margin-top: 22px; max-width: 620px; color: #c9d3ee; font-size: 25px; line-height: 1.4; }
  .chips { display: flex; gap: 12px; margin-top: 30px; }
  .chip { padding: 9px 18px; border: 2px solid #2a3566; border-radius: 999px; background: #141d42; color: #eef1fa; font: 700 19px 'Atkinson Hyperlegible', sans-serif; }
  .chip b { color: #5be3a4; }
  .cosmo { position: absolute; right: 36px; top: 118px; width: 470px; filter: drop-shadow(0 18px 40px rgba(0,0,0,0.45)); }
  .bubble { position: absolute; right: 300px; top: 70px; padding: 12px 20px; border-radius: 22px 22px 22px 6px; background: #fbf6ec; color: #1c1b2e; font: 700 28px 'Caveat', cursive; transform: rotate(-3deg); }
</style></head>
<body><div class="banner">
  <svg class="sky" viewBox="0 0 1280 640" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
    ${stars(1280, 640, 170)}
    <ellipse cx="930" cy="360" rx="330" ry="120" transform="rotate(-16 930 360)" fill="none" stroke="#8ec5ff" stroke-width="2" stroke-dasharray="6 10" opacity="0.45"/>
    <circle cx="1175" cy="545" r="118" fill="#ff8a3d" opacity="0.95"/>
    <circle cx="1175" cy="545" r="118" fill="url(#shade)"/>
    <ellipse cx="1175" cy="545" rx="190" ry="36" transform="rotate(-18 1175 545)" fill="none" stroke="#ffc24b" stroke-width="7" opacity="0.9"/>
    <circle cx="640" cy="96" r="12" fill="#8ec5ff"/>
    <circle cx="1210" cy="92" r="9" fill="#c4b5fd"/>
    <defs><radialGradient id="shade" cx="0.35" cy="0.3" r="0.8"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#1c1b2e" stop-opacity="0.55"/></radialGradient></defs>
  </svg>
  <div class="text">
    <div class="logo">
      <svg width="46" height="46" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="7" fill="#ff8a3d"/><ellipse cx="18" cy="18" rx="16" ry="6.5" stroke="#8ec5ff" stroke-width="2" transform="rotate(-24 18 18)"/><circle cx="31" cy="11" r="2.4" fill="#eef1fa"/></svg>
      SolarScope
    </div>
    <div class="hello">Bonjour explorateur !</div>
    <h1>L’espace expliqué<br><span>aux enfants</span></h1>
    <p>Des missions courtes, les vraies données de la NASA, de l’ESA et de la NOAA, et un passeport à tamponner.</p>
    <div class="chips"><span class="chip">6 – 12 ans</span><span class="chip">Français · English</span><span class="chip"><b>Gratuit</b>, sans compte</span></div>
  </div>
  <div class="bubble">Salut, je suis Cosmo !</div>
  <div class="cosmo">${cosmo}</div>
</div></body></html>`
}

const browser = await chromium.launch()
for (const { width, height, file } of [
  { width: 1280, height: 640, file: 'docs/banner.png' },
  { width: 1200, height: 630, file: 'src/app/opengraph-image.png' },
]) {
  const tab = await browser.newPage({ viewport: { width, height } })
  await tab.setContent(page(width, height), { waitUntil: 'networkidle' })
  await tab.evaluate(() => document.fonts.ready)
  const capture = await tab.screenshot({ type: 'png' })
  await tab.close()
  // A 256-colour palette divides the size by about 5 with no visible difference on this flat design.
  const png = await sharp(capture).png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 }).toBuffer()
  await writeFile(file, png)
  console.log(`${file} (${width}×${height}, ${Math.round(png.length / 1024)} Ko)`)
}
await browser.close()
