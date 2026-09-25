import type { SiteLocale } from './paths'

type PageText = { title: string; description: string }

/** Every public page, with its title and description in both languages (search engines and link previews). */
export const PAGES: Record<string, Record<SiteLocale, PageText>> = {
  '/': {
    fr: { title: 'SolarScope — L’espace expliqué aux enfants', description: 'SolarScope explique l’espace aux enfants de 6 à 12 ans et aux curieux de 12+ avec des missions, des images interactives et des données scientifiques vérifiées.' },
    en: { title: 'SolarScope — Space explained for kids', description: 'SolarScope explains space to children aged 6 to 12 and curious minds of 12+ with missions, interactive images and checked scientific data.' },
  },
  '/soleil': {
    fr: { title: 'Le Soleil et la météo spatiale', description: 'Comprends notre étoile et observe des images et mesures de la NASA et de la NOAA.' },
    en: { title: 'The Sun and space weather', description: 'Understand our star and look at pictures and measurements from NASA and NOAA.' },
  },
  '/planetes': {
    fr: { title: 'Planètes et lunes', description: 'Compare les huit planètes du Système solaire avec des mots simples et une vue en 3D.' },
    en: { title: 'Planets and moons', description: 'Compare the eight planets of the Solar System with simple words and a 3D view.' },
  },
  '/mars': {
    fr: { title: 'Mars et ses rovers', description: 'Pars sur Mars avec les rovers Curiosity et Perseverance et comprends leur mission.' },
    en: { title: 'Mars and its rovers', description: 'Travel to Mars with the Curiosity and Perseverance rovers and understand their mission.' },
  },
  '/asteroides': {
    fr: { title: 'Astéroïdes proches de la Terre', description: 'Comprends ce qu’est un astéroïde et observe ceux suivis par la NASA.' },
    en: { title: 'Near-Earth asteroids', description: 'Understand what an asteroid is and look at the ones NASA is tracking.' },
  },
  '/meteorites': {
    fr: { title: 'Météorites', description: 'Comprends comment un morceau venu de l’espace devient une météorite sur Terre.' },
    en: { title: 'Meteorites', description: 'Understand how a piece from space becomes a meteorite on Earth.' },
  },
  '/iss': {
    fr: { title: 'ISS Tracker', description: 'Comprends comment l’ISS tourne autour de la Terre et suis sa position récente.' },
    en: { title: 'ISS Tracker', description: 'Understand how the ISS travels around Earth and follow its latest position.' },
  },
  '/missions': {
    fr: { title: 'Missions spatiales', description: 'Découvre pourquoi les humains envoient des sondes, des robots et des astronautes.' },
    en: { title: 'Space missions', description: 'Find out why people send probes, robots and astronauts into space.' },
  },
  '/jwst': {
    fr: { title: 'Télescope spatial James Webb', description: 'Découvre comment le télescope Webb observe la lumière invisible à nos yeux.' },
    en: { title: 'James Webb Space Telescope', description: 'Find out how the Webb telescope observes light our eyes cannot see.' },
  },
  '/ciel': {
    fr: { title: 'Le ciel ce soir', description: 'Apprends à reconnaître ce que tu peux observer dans le ciel ce soir.' },
    en: { title: 'Tonight’s sky', description: 'Learn to recognise what you can see in the sky tonight.' },
  },
  '/photo-du-jour': {
    fr: { title: 'Photo astronomique du jour', description: 'Observe une image choisie par la NASA et apprends à regarder les indices scientifiques.' },
    en: { title: 'Astronomy Picture of the Day', description: 'Look at a picture chosen by NASA and learn to spot the scientific clues.' },
  },
  '/exoplanetes': {
    fr: { title: 'Exoplanètes', description: 'Découvre les planètes qui tournent autour d’autres étoiles que le Soleil.' },
    en: { title: 'Exoplanets', description: 'Discover the planets that travel around stars other than the Sun.' },
  },
  '/actualites': {
    fr: { title: 'Actualités spatiales', description: 'Apprends à lire les nouvelles de l’espace et retrouve leur source officielle.' },
    en: { title: 'Space news', description: 'Learn to read space news and find its official source.' },
  },
  '/quiz': {
    fr: { title: 'Quiz spatial', description: 'Teste ce que tu as compris grâce à des questions adaptées à ton niveau.' },
    en: { title: 'Space quiz', description: 'Test what you understood with questions suited to your level.' },
  },
  '/solarbot': {
    fr: { title: 'SolarBot', description: 'Pose une question sur l’espace et reçois une réponse courte avec les mots expliqués.' },
    en: { title: 'SolarBot', description: 'Ask a question about space and get a short answer with the words explained.' },
  },
  '/passeport': {
    fr: { title: 'Mon passeport spatial', description: 'Les missions découvertes sur SolarScope, enregistrées uniquement sur cet appareil.' },
    en: { title: 'My space passport', description: 'The missions you explored on SolarScope, saved on this device only.' },
  },
  '/parents-enseignants': {
    fr: { title: 'Parents et enseignants', description: 'Repères pour accompagner les enfants dans SolarScope.' },
    en: { title: 'Parents and teachers', description: 'Tips to guide children through SolarScope.' },
  },
  '/sources': {
    fr: { title: 'Données et sources', description: 'Les sources scientifiques, leur fraîcheur et les règles de présentation des données SolarScope.' },
    en: { title: 'Data and sources', description: 'The scientific sources, how fresh they are and the rules SolarScope follows to show data.' },
  },
  '/confidentialite': {
    fr: { title: 'Confidentialité', description: 'Comment SolarScope utilise la géolocalisation, les services scientifiques externes et le stockage local.' },
    en: { title: 'Privacy', description: 'How SolarScope uses location, external science services and local storage.' },
  },
}

export const PAGE_PATHS = Object.keys(PAGES)
