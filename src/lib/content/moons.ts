export type Moon = {
  name: string
  diameterKm: number
  fact: string
  /** Equirectangular texture for the 3D viewer, when one is available. */
  texture?: string
}

/**
 * Main moons of each planet, with a single child-friendly fact each.
 * Figures: NASA Science, « Moons » pages (science.nasa.gov/solar-system/moons/).
 */
export const PLANET_MOONS: Record<string, Moon[]> = {
  mercury: [],
  venus: [],
  earth: [
    { name: 'La Lune', diameterKm: 3_474, fact: 'Elle nous montre presque toujours la même face, et se trouve à environ 384 400 km.', texture: '/textures/moon.jpg' },
  ],
  mars: [
    { name: 'Phobos', diameterKm: 22, fact: 'Elle se rapproche lentement de Mars et finira par se briser, dans des dizaines de millions d’années.' },
    { name: 'Déimos', diameterKm: 12, fact: 'Une toute petite lune en forme de pomme de terre.' },
  ],
  jupiter: [
    { name: 'Io', diameterKm: 3_643, fact: 'Le monde le plus volcanique du Système solaire.' },
    { name: 'Europe', diameterKm: 3_122, fact: 'Un océan d’eau liquide se cache probablement sous sa glace.' },
    { name: 'Ganymède', diameterKm: 5_268, fact: 'La plus grande lune du Système solaire : elle est plus grande que Mercure !' },
    { name: 'Callisto', diameterKm: 4_821, fact: 'L’une des surfaces les plus couvertes de cratères.' },
  ],
  saturn: [
    { name: 'Titan', diameterKm: 5_150, fact: 'Elle a une atmosphère épaisse et des lacs de méthane. La sonde Huygens s’y est posée en 2005.' },
    { name: 'Encelade', diameterKm: 504, fact: 'Des geysers d’eau glacée jaillissent de son pôle Sud.' },
  ],
  uranus: [
    { name: 'Titania', diameterKm: 1_578, fact: 'La plus grande lune d’Uranus.' },
    { name: 'Miranda', diameterKm: 472, fact: 'Elle porte l’une des plus hautes falaises connues du Système solaire.' },
  ],
  neptune: [
    { name: 'Triton', diameterKm: 2_707, fact: 'Elle tourne autour de Neptune « à l’envers » et crache des geysers d’azote.' },
  ],
}
