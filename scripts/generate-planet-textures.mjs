// Generates illustrative equirectangular textures for the planets that have no photo
// map in public/textures (Mercury, Uranus). Deterministic: same output on every run.
// Usage: node scripts/generate-planet-textures.mjs
import sharp from 'sharp'

const WIDTH = 1024
const HEIGHT = 512

function random(seed) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

function valueNoise(seed, cells) {
  const rand = random(seed)
  const grid = Array.from({ length: (cells + 1) * (cells + 1) }, rand)
  const at = (x, y) => grid[(y % cells) * (cells + 1) + (x % cells)]
  const smooth = t => t * t * (3 - 2 * t)
  return (u, v) => {
    const x = u * cells
    const y = v * cells
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const tx = smooth(x - x0)
    const ty = smooth(y - y0)
    const top = at(x0, y0) * (1 - tx) + at(x0 + 1, y0) * tx
    const bottom = at(x0, y0 + 1) * (1 - tx) + at(x0 + 1, y0 + 1) * tx
    return top * (1 - ty) + bottom * ty
  }
}

function fbm(seed, octaves) {
  const layers = Array.from({ length: octaves }, (_, index) => valueNoise(seed + index * 97, 4 * 2 ** index))
  return (u, v) => layers.reduce((sum, layer, index) => sum + layer(u, v) / 2 ** index, 0) / (2 - 2 ** (1 - octaves))
}

async function mercury() {
  const noise = fbm(11, 7)
  const detail = fbm(29, 5)
  const rand = random(42)
  const craters = Array.from({ length: 300 }, () => ({
    x: rand() * WIDTH,
    y: HEIGHT * 0.06 + rand() * HEIGHT * 0.88,
    r: 1.5 + rand() ** 4 * 46,
  }))
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3)
  for (let y = 0; y < HEIGHT; y += 1) {
    for (let x = 0; x < WIDTH; x += 1) {
      const u = x / WIDTH
      const v = y / HEIGHT
      // Broad light and dark plains, plus fine grain.
      let shade = 0.2 + noise(u, v) * 0.5 + (detail(u * 3 % 1, v * 3 % 1) - 0.5) * 0.12
      for (const crater of craters) {
        let dx = x - crater.x
        if (dx > WIDTH / 2) dx -= WIDTH
        if (dx < -WIDTH / 2) dx += WIDTH
        const dy = y - crater.y
        if (Math.abs(dx) > crater.r * 1.3 || Math.abs(dy) > crater.r * 1.3) continue
        const distance = Math.hypot(dx, dy) / crater.r
        // Sunlight from the west: the inner west wall is in shadow, the east wall and west rim are lit.
        const side = dx / crater.r
        if (distance < 0.92) shade += 0.09 * side - 0.035
        else if (distance < 1.25) shade += -0.07 * (dx / (crater.r * distance)) * (1 - Math.abs(distance - 1.05) / 0.2)
      }
      const value = Math.max(0, Math.min(1, shade)) * 255
      const offset = (y * WIDTH + x) * 3
      pixels[offset] = Math.min(255, value * 1.03)
      pixels[offset + 1] = value * 0.99
      pixels[offset + 2] = value * 0.94
    }
  }
  await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } }).jpeg({ quality: 82 }).toFile('public/textures/mercury.jpg')
}

async function uranus() {
  const noise = fbm(7, 4)
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3)
  for (let y = 0; y < HEIGHT; y += 1) {
    const latitude = y / HEIGHT
    const band = Math.sin(latitude * Math.PI * 9) * 0.025 + Math.sin(latitude * Math.PI * 3.3) * 0.02
    const polarBrightening = Math.max(0, 0.35 - latitude) * 0.25
    for (let x = 0; x < WIDTH; x += 1) {
      const variation = band + polarBrightening + (noise(x / WIDTH, latitude * 0.35) - 0.5) * 0.03
      const offset = (y * WIDTH + x) * 3
      pixels[offset] = Math.min(255, (0.62 + variation) * 255)
      pixels[offset + 1] = Math.min(255, (0.84 + variation) * 255)
      pixels[offset + 2] = Math.min(255, (0.87 + variation) * 255)
    }
  }
  await sharp(pixels, { raw: { width: WIDTH, height: HEIGHT, channels: 3 } }).jpeg({ quality: 82 }).toFile('public/textures/uranus.jpg')
}

await mercury()
await uranus()
console.log('mercury.jpg and uranus.jpg written to public/textures')
