export type Moon = {
  name: string
  nameEn: string
  diameterKm: number
  fact: string
  factEn: string
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
    { name: 'La Lune', nameEn: 'The Moon', diameterKm: 3_474, fact: 'Elle nous montre presque toujours la même face, et se trouve à environ 384 400 km.', factEn: 'It almost always shows us the same face, and it is about 384,400 km away.', texture: '/textures/moon.jpg' },
  ],
  mars: [
    { name: 'Phobos', nameEn: 'Phobos', diameterKm: 22, fact: 'Elle se rapproche lentement de Mars et finira par se briser, dans des dizaines de millions d’années.', factEn: 'It is slowly getting closer to Mars and will break apart in tens of millions of years.' },
    { name: 'Déimos', nameEn: 'Deimos', diameterKm: 12, fact: 'Une toute petite lune en forme de pomme de terre.', factEn: 'A tiny moon shaped like a potato.' },
  ],
  jupiter: [
    { name: 'Io', nameEn: 'Io', diameterKm: 3_643, fact: 'Le monde le plus volcanique du Système solaire.', factEn: 'The most volcanic world in the Solar System.' },
    { name: 'Europe', nameEn: 'Europa', diameterKm: 3_122, fact: 'Un océan d’eau liquide se cache probablement sous sa glace.', factEn: 'An ocean of liquid water probably hides under its ice.' },
    { name: 'Ganymède', nameEn: 'Ganymede', diameterKm: 5_268, fact: 'La plus grande lune du Système solaire : elle est plus grande que Mercure !', factEn: 'The biggest moon in the Solar System: it is bigger than Mercury!' },
    { name: 'Callisto', nameEn: 'Callisto', diameterKm: 4_821, fact: 'L’une des surfaces les plus couvertes de cratères.', factEn: 'One of the most crater-covered surfaces there is.' },
  ],
  saturn: [
    { name: 'Titan', nameEn: 'Titan', diameterKm: 5_150, fact: 'Elle a une atmosphère épaisse et des lacs de méthane. La sonde Huygens s’y est posée en 2005.', factEn: 'It has a thick atmosphere and lakes of methane. The Huygens probe landed there in 2005.' },
    { name: 'Encelade', nameEn: 'Enceladus', diameterKm: 504, fact: 'Des geysers d’eau glacée jaillissent de son pôle Sud.', factEn: 'Geysers of icy water shoot out of its south pole.' },
  ],
  uranus: [
    { name: 'Titania', nameEn: 'Titania', diameterKm: 1_578, fact: 'La plus grande lune d’Uranus.', factEn: 'The biggest moon of Uranus.' },
    { name: 'Miranda', nameEn: 'Miranda', diameterKm: 472, fact: 'Elle porte l’une des plus hautes falaises connues du Système solaire.', factEn: 'It has one of the tallest known cliffs in the Solar System.' },
  ],
  neptune: [
    { name: 'Triton', nameEn: 'Triton', diameterKm: 2_707, fact: 'Elle tourne autour de Neptune « à l’envers » et crache des geysers d’azote.', factEn: 'It goes around Neptune “backwards” and shoots out geysers of nitrogen.' },
  ],
}
