export type PlanetFocus = 'identity' | 'air' | 'moons' | 'journey'

export type ExplorerPlanet = {
  id: string
  name: string
  emoji: string
  color: string
  texture: string | null
  atmosphereColor?: string
  hasRings?: boolean
  kind: string
  radiusKm: number
  distanceMillionKm: number
  moons: number
  description: string
  funFact: string
  focuses: Record<PlanetFocus, { label: string; text: string }>
  challenge: {
    question: string
    choices: string[]
    answer: string
    explanation: string
  }
}

export const PLANET_EXPLORER_PLANETS: ExplorerPlanet[] = [
  {
    id: 'mercury', name: 'Mercure', emoji: '☿', color: '#a8b3c7', texture: null, kind: 'Planète rocheuse', radiusKm: 2439.7, distanceMillionKm: 57.9, moons: 0,
    description: 'La plus petite planète et la plus proche du Soleil.',
    funFact: 'Sur Mercure, un jour est plus long qu’une année !',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Mercure est la première planète en partant du Soleil.' },
      air: { label: 'Autour d’elle', text: 'Elle n’a presque pas d’atmosphère pour garder la chaleur.' },
      moons: { label: 'Ses lunes', text: 'Mercure n’a aucune lune.' },
      journey: { label: 'Son voyage', text: 'Elle fait le tour du Soleil en seulement 88 jours terrestres.' },
    },
    challenge: { question: 'Quelle planète est la plus proche du Soleil ?', choices: ['Mercure', 'Mars', 'Neptune'], answer: 'Mercure', explanation: 'Mercure est la première planète du Système solaire.' },
  },
  {
    id: 'venus', name: 'Vénus', emoji: '♀', color: '#f59e0b', texture: '/textures/venus.jpg', atmosphereColor: '#f59e0b', kind: 'Planète rocheuse', radiusKm: 6051.8, distanceMillionKm: 108.2, moons: 0,
    description: 'Une planète très chaude, enveloppée par une épaisse atmosphère.',
    funFact: 'Vénus tourne dans le sens opposé à la plupart des autres planètes.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Vénus est presque aussi grande que la Terre.' },
      air: { label: 'Autour d’elle', text: 'Son atmosphère très épaisse retient beaucoup de chaleur.' },
      moons: { label: 'Ses lunes', text: 'Vénus n’a aucune lune.' },
      journey: { label: 'Son voyage', text: 'Une année sur Vénus dure 225 jours terrestres.' },
    },
    challenge: { question: 'Quelle planète est la plus chaude ?', choices: ['Vénus', 'Mercure', 'Mars'], answer: 'Vénus', explanation: 'Son épaisse atmosphère agit comme une très grande couverture chaude.' },
  },
  {
    id: 'earth', name: 'Terre', emoji: '🌍', color: '#38bdf8', texture: '/textures/earth.jpg', atmosphereColor: '#38bdf8', kind: 'Planète rocheuse', radiusKm: 6371, distanceMillionKm: 149.6, moons: 1,
    description: 'Notre maison : la seule planète où la vie est connue.',
    funFact: 'Environ 71 % de la surface terrestre est recouverte d’eau.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'La Terre est la troisième planète en partant du Soleil.' },
      air: { label: 'Autour d’elle', text: 'Son atmosphère contient l’air que nous respirons et protège la vie.' },
      moons: { label: 'Ses lunes', text: 'La Terre a une lune : la Lune.' },
      journey: { label: 'Son voyage', text: 'La Terre fait le tour du Soleil en environ 365 jours.' },
    },
    challenge: { question: 'Combien de lunes accompagne la Terre ?', choices: ['1', '2', '0'], answer: '1', explanation: 'Notre planète est accompagnée par une seule lune, appelée la Lune.' },
  },
  {
    id: 'mars', name: 'Mars', emoji: '♂', color: '#f87171', texture: '/textures/mars.jpg', atmosphereColor: '#ef4444', kind: 'Planète rocheuse', radiusKm: 3389.5, distanceMillionKm: 227.9, moons: 2,
    description: 'La planète rouge, explorée par plusieurs robots.',
    funFact: 'Mars abrite Olympus Mons, le plus grand volcan connu du Système solaire.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Mars est rouge à cause de la poussière riche en fer qui ressemble à de la rouille.' },
      air: { label: 'Autour d’elle', text: 'Son atmosphère est très fine : elle est surtout faite de dioxyde de carbone.' },
      moons: { label: 'Ses lunes', text: 'Mars a deux petites lunes : Phobos et Deimos.' },
      journey: { label: 'Son voyage', text: 'Une année sur Mars dure 687 jours terrestres.' },
    },
    challenge: { question: 'Pourquoi Mars paraît-elle rouge ?', choices: ['À cause de la poussière riche en fer', 'À cause de ses océans', 'À cause de ses anneaux'], answer: 'À cause de la poussière riche en fer', explanation: 'Le fer contenu dans la poussière de Mars donne sa couleur rouge-orangé.' },
  },
  {
    id: 'jupiter', name: 'Jupiter', emoji: '♃', color: '#fb923c', texture: '/textures/jupiter.jpg', atmosphereColor: '#f97316', kind: 'Géante gazeuse', radiusKm: 69911, distanceMillionKm: 778.5, moons: 101,
    description: 'La plus grande planète, faite surtout de gaz.',
    funFact: 'Sa Grande Tache Rouge est une immense tempête observée depuis très longtemps.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Jupiter est la plus grande planète du Système solaire.' },
      air: { label: 'Autour d’elle', text: 'Jupiter n’a pas de sol solide où l’on pourrait se poser comme sur la Terre.' },
      moons: { label: 'Ses lunes', text: 'Jupiter compte 101 lunes reconnues ; ce nombre peut évoluer avec de nouvelles découvertes.' },
      journey: { label: 'Son voyage', text: 'Jupiter met presque 12 années terrestres à faire le tour du Soleil.' },
    },
    challenge: { question: 'Quelle planète est la plus grande ?', choices: ['Jupiter', 'Saturne', 'Terre'], answer: 'Jupiter', explanation: 'Jupiter est tellement grande qu’elle pourrait contenir plus de mille Terres.' },
  },
  {
    id: 'saturn', name: 'Saturne', emoji: '♄', color: '#facc15', texture: '/textures/saturn.jpg', atmosphereColor: '#eab308', hasRings: true, kind: 'Géante gazeuse', radiusKm: 58232, distanceMillionKm: 1434, moons: 274,
    description: 'Une géante gazeuse célèbre pour ses grands anneaux.',
    funFact: 'Ses anneaux sont surtout faits de glace et de roche.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Saturne est facile à reconnaître grâce à ses anneaux très visibles.' },
      air: { label: 'Autour d’elle', text: 'Comme Jupiter, Saturne est faite surtout de gaz.' },
      moons: { label: 'Ses lunes', text: 'Saturne compte 274 lunes confirmées ; ce nombre peut évoluer avec de nouvelles découvertes.' },
      journey: { label: 'Son voyage', text: 'Une année sur Saturne dure environ 29 années terrestres.' },
    },
    challenge: { question: 'De quoi sont surtout faits les anneaux de Saturne ?', choices: ['De glace et de roche', 'De coton', 'De lumière solide'], answer: 'De glace et de roche', explanation: 'Les anneaux regroupent d’innombrables morceaux de glace et de roche.' },
  },
  {
    id: 'uranus', name: 'Uranus', emoji: '♅', color: '#67e8f9', texture: null, kind: 'Géante de glace', radiusKm: 25362, distanceMillionKm: 2871, moons: 28,
    description: 'Une planète bleutée qui tourne presque couchée sur le côté.',
    funFact: 'Son axe est tellement incliné qu’elle semble rouler autour du Soleil.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Uranus est une géante de glace, plus petite que Jupiter et Saturne.' },
      air: { label: 'Autour d’elle', text: 'Son atmosphère contient notamment du méthane, qui contribue à sa couleur bleue.' },
      moons: { label: 'Ses lunes', text: 'Uranus a 28 lunes connues, souvent nommées d’après des personnages de théâtre.' },
      journey: { label: 'Son voyage', text: 'Une année sur Uranus dure 84 années terrestres.' },
    },
    challenge: { question: 'Quelle planète semble tourner couchée sur le côté ?', choices: ['Uranus', 'Terre', 'Mercure'], answer: 'Uranus', explanation: 'Son axe est très incliné : Uranus semble rouler sur son orbite.' },
  },
  {
    id: 'neptune', name: 'Neptune', emoji: '♆', color: '#818cf8', texture: '/textures/neptune.jpg', atmosphereColor: '#6366f1', kind: 'Géante de glace', radiusKm: 24622, distanceMillionKm: 4495, moons: 16,
    description: 'La planète la plus lointaine, connue pour ses vents très rapides.',
    funFact: 'Neptune a été trouvée grâce aux mathématiques avant d’être observée.',
    focuses: {
      identity: { label: 'À reconnaître', text: 'Neptune est la huitième et dernière planète du Système solaire.' },
      air: { label: 'Autour d’elle', text: 'Son atmosphère est très froide et ses vents peuvent être extrêmement rapides.' },
      moons: { label: 'Ses lunes', text: 'Neptune a 16 lunes connues, dont la grande Triton.' },
      journey: { label: 'Son voyage', text: 'Une année sur Neptune dure presque 165 années terrestres.' },
    },
    challenge: { question: 'Quelle planète est la plus loin du Soleil ?', choices: ['Neptune', 'Uranus', 'Mars'], answer: 'Neptune', explanation: 'Neptune est la huitième planète, la plus lointaine de notre Système solaire.' },
  },
]

export const PLANET_FOCUS_ORDER: PlanetFocus[] = ['identity', 'air', 'moons', 'journey']
