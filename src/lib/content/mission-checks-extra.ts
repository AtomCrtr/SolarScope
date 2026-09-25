import type { MissionCheck } from './mission-checks'

type Extra = Record<string, [MissionCheck, MissionCheck]>

// Two more questions per lesson, so the stamp cannot be earned by remembering one answer.
// Keep the correct answer at the same position in both languages (a unit test checks it).
export const EXTRA_CHECKS: Extra = {
  soleil: [
    { question: 'Combien de temps met la lumière du Soleil pour arriver sur Terre ?', choices: ['Environ 8 minutes', 'Une seconde', 'Une journée'], answer: 0, explanation: 'Sa lumière met environ 8 minutes et 20 secondes pour parcourir les 150 millions de kilomètres qui nous séparent.' },
    { question: 'Que se passe-t-il au centre du Soleil ?', choices: ['Du bois brûle', 'Des noyaux d’hydrogène fusionnent', 'De l’eau se transforme en vapeur'], answer: 1, explanation: 'Au centre du Soleil, des noyaux d’hydrogène fusionnent et libèrent une énorme énergie, qui devient lumière et chaleur.' },
  ],
  planetes: [
    { question: 'Comment s’appelle le chemin d’une planète autour du Soleil ?', choices: ['Une galaxie', 'Une comète', 'Une orbite'], answer: 2, explanation: 'C’est une orbite : un chemin régulier, légèrement ovale, autour du Soleil.' },
    { question: 'Plus une planète est loin du Soleil, plus son année est…', choices: ['courte', 'longue', 'identique à la nôtre'], answer: 1, explanation: 'Son chemin autour du Soleil est plus long : Neptune met environ 165 ans à en faire le tour.' },
  ],
  mars: [
    { question: 'Comment s’appelle un robot à roues qui explore Mars ?', choices: ['Un rover', 'Une sonde solaire', 'Un satellite'], answer: 0, explanation: 'Un rover, comme Curiosity ou Perseverance, roule sur le sol pour étudier les roches.' },
    { question: 'De quoi est surtout faite l’atmosphère de Mars ?', choices: ['D’oxygène, comme sur Terre', 'De dioxyde de carbone', 'D’hélium'], answer: 1, explanation: 'L’atmosphère de Mars est très fine et surtout faite de dioxyde de carbone : on ne pourrait pas y respirer.' },
  ],
  asteroides: [
    { question: 'Où se trouvent la plupart des astéroïdes ?', choices: ['Entre Mars et Jupiter', 'Autour de la Lune', 'À l’intérieur du Soleil'], answer: 0, explanation: 'La plupart tournent autour du Soleil dans une zone située entre Mars et Jupiter.' },
    { question: 'Que mesure une « distance lunaire » ?', choices: ['La taille de la Lune', 'La distance jusqu’au Soleil', 'La distance entre la Terre et la Lune'], answer: 2, explanation: 'C’est la distance moyenne entre la Terre et la Lune : environ 384 400 km.' },
  ],
  meteorites: [
    { question: 'Comment s’appelle la traînée lumineuse d’une pierre qui traverse l’atmosphère ?', choices: ['Un météore', 'Une météorite', 'Un astéroïde'], answer: 0, explanation: 'La lumière visible dans le ciel est un météore. Le morceau retrouvé au sol, lui, est une météorite.' },
    { question: 'Pourquoi les scientifiques étudient-ils les météorites ?', choices: ['Pour fabriquer des bijoux', 'Pour comprendre la formation du Système solaire', 'Pour prévoir la météo'], answer: 1, explanation: 'Elles gardent la trace des matériaux présents il y a environ 4,6 milliards d’années.' },
  ],
  iss: [
    { question: 'En combien de temps l’ISS fait-elle le tour de la Terre ?', choices: ['Environ 90 minutes', 'Un jour', 'Un mois'], answer: 0, explanation: 'Elle file à près de 28 000 km/h et fait un tour en environ 90 minutes, soit environ 16 tours par jour.' },
    { question: 'À quelle altitude vole l’ISS ?', choices: ['Environ 40 km', 'Environ 400 km', 'Environ 400 000 km'], answer: 1, explanation: 'Environ 400 km : beaucoup plus près que la Lune, qui est à 384 400 km.' },
  ],
  missions: [
    { question: 'Par quoi commence chaque mission spatiale ?', choices: ['Une question scientifique', 'Un feu d’artifice', 'Un tirage au sort'], answer: 0, explanation: 'Chaque mission part d’une question : les ingénieurs choisissent ensuite les instruments pour y répondre.' },
    { question: 'Qu’est-ce qu’une sonde ?', choices: ['Un astronaute', 'Un engin sans équipage envoyé observer un monde', 'Une étoile filante'], answer: 1, explanation: 'Une sonde est un engin sans personne à bord, envoyé observer une planète, une lune ou l’espace.' },
  ],
  jwst: [
    { question: 'Pourquoi dit-on que Webb regarde dans le passé ?', choices: ['Il a une machine à remonter le temps', 'La lumière des galaxies lointaines est partie il y a très longtemps', 'Il photographie des dinosaures'], answer: 1, explanation: 'La lumière met du temps à voyager : Webb voit les galaxies lointaines telles qu’elles étaient il y a très longtemps.' },
    { question: 'Qu’est-ce qui protège Webb de la chaleur du Soleil ?', choices: ['Un grand pare-soleil', 'Un parapluie en tissu', 'La Lune'], answer: 0, explanation: 'Un grand bouclier à cinq couches garde ses instruments très froids.' },
  ],
  ciel: [
    { question: 'Qu’est-ce qu’une constellation ?', choices: ['Une planète géante', 'Un dessin imaginaire formé en reliant des étoiles', 'Un nuage de pluie'], answer: 1, explanation: 'C’est un dessin imaginaire. Ses étoiles semblent proches, mais elles peuvent être très éloignées les unes des autres.' },
    { question: 'Que faut-il pour voir les étoiles les moins lumineuses ?', choices: ['Un ciel bien sombre, loin des lumières', 'Une lampe de poche très forte', 'Regarder en plein midi'], answer: 0, explanation: 'Les lumières de la ville cachent les étoiles faibles : il faut un ciel sombre et laisser ses yeux s’habituer au noir.' },
  ],
  'photo-du-jour': [
    { question: 'Qu’est-ce qu’une « fausse couleur » ?', choices: ['Une erreur de l’appareil photo', 'Une couleur ajoutée pour rendre visible une mesure invisible', 'De la peinture sur la photo'], answer: 1, explanation: 'C’est une couleur choisie pour montrer une lumière que nos yeux ne voient pas, comme l’infrarouge.' },
    { question: 'Qu’est-ce qu’une belle image de l’espace peut aussi contenir ?', choices: ['Beaucoup d’informations scientifiques', 'Rien d’autre que des couleurs', 'Des messages secrets'], answer: 0, explanation: 'Chaque image vient de vraies mesures : elle aide les scientifiques à comprendre ce qu’ils observent.' },
  ],
  exoplanetes: [
    { question: 'Comment repère-t-on souvent une exoplanète ?', choices: ['Elle cache un peu de la lumière de son étoile en passant devant', 'On l’entend grâce à un micro', 'Elle clignote en couleurs'], answer: 0, explanation: 'Quand elle passe devant son étoile, elle bloque une toute petite partie de sa lumière : c’est un transit.' },
    { question: 'A-t-on déjà trouvé une preuve de vie sur une exoplanète ?', choices: ['Oui, plusieurs fois', 'Non, pas encore', 'Oui, sur toutes'], answer: 1, explanation: 'Aucune preuve de vie en dehors de la Terre n’a encore été trouvée. Les scientifiques continuent de chercher.' },
  ],
  actualites: [
    { question: 'D’où viennent les actualités de SolarScope ?', choices: ['De rumeurs', 'Des publications officielles de la NASA', 'De jeux vidéo'], answer: 1, explanation: 'Chaque actualité renvoie vers la publication d’origine de la NASA, avec sa date.' },
    { question: 'Que fait un article sérieux ?', choices: ['Il sépare les faits des suppositions', 'Il invente les chiffres', 'Il n’indique jamais la date'], answer: 0, explanation: 'Un bon article dit ce qui est confirmé, ce qui est probable et ce qui reste incertain.' },
  ],
  solarbot: [
    { question: 'SolarBot peut-il se tromper ?', choices: ['Non, jamais', 'Oui : il faut vérifier les faits importants', 'Seulement quand il pleut'], answer: 1, explanation: 'Une IA peut donner une réponse convaincante mais fausse. On vérifie avec une source fiable.' },
    { question: 'Comment obtenir une réponse plus simple de SolarBot ?', choices: ['Demander : « Explique-moi comme si j’avais 8 ans »', 'Écrire tout en majuscules', 'Poser dix questions à la fois'], answer: 0, explanation: 'Demande une seule chose à la fois et précise que tu veux une explication simple.' },
  ],
}

export const ENGLISH_EXTRA_CHECKS: Extra = {
  soleil: [
    { question: 'How long does sunlight take to reach Earth?', choices: ['About 8 minutes', 'One second', 'One day'], answer: 0, explanation: 'Its light takes about 8 minutes and 20 seconds to travel the 150 million kilometres between us.' },
    { question: 'What happens in the centre of the Sun?', choices: ['Wood is burning', 'Hydrogen nuclei join together', 'Water turns into steam'], answer: 1, explanation: 'In the centre of the Sun, hydrogen nuclei join together and release huge amounts of energy, which becomes light and heat.' },
  ],
  planetes: [
    { question: 'What is the path of a planet around the Sun called?', choices: ['A galaxy', 'A comet', 'An orbit'], answer: 2, explanation: 'It is an orbit: a regular, slightly oval path around the Sun.' },
    { question: 'The farther a planet is from the Sun, the… its year is.', choices: ['shorter', 'longer', 'same as ours'], answer: 1, explanation: 'Its path around the Sun is longer: Neptune takes about 165 years to go around it.' },
  ],
  mars: [
    { question: 'What do we call a wheeled robot that explores Mars?', choices: ['A rover', 'A solar probe', 'A satellite'], answer: 0, explanation: 'A rover, like Curiosity or Perseverance, drives on the ground to study rocks.' },
    { question: 'What is the air on Mars mostly made of?', choices: ['Oxygen, like on Earth', 'Carbon dioxide', 'Helium'], answer: 1, explanation: 'The Martian atmosphere is very thin and made mostly of carbon dioxide: we could not breathe there.' },
  ],
  asteroides: [
    { question: 'Where are most asteroids found?', choices: ['Between Mars and Jupiter', 'Around the Moon', 'Inside the Sun'], answer: 0, explanation: 'Most of them travel around the Sun in a zone between Mars and Jupiter.' },
    { question: 'What does a “lunar distance” measure?', choices: ['The size of the Moon', 'The distance to the Sun', 'The distance between Earth and the Moon'], answer: 2, explanation: 'It is the average distance between Earth and the Moon: about 384,400 km.' },
  ],
  meteorites: [
    { question: 'What do we call the bright streak of a rock crossing the atmosphere?', choices: ['A meteor', 'A meteorite', 'An asteroid'], answer: 0, explanation: 'The light we see in the sky is a meteor. The piece found on the ground is a meteorite.' },
    { question: 'Why do scientists study meteorites?', choices: ['To make jewellery', 'To understand how the Solar System formed', 'To forecast the weather'], answer: 1, explanation: 'They keep traces of the materials that were there about 4.6 billion years ago.' },
  ],
  iss: [
    { question: 'How long does the ISS take to go around Earth?', choices: ['About 90 minutes', 'One day', 'One month'], answer: 0, explanation: 'It travels at almost 28,000 km/h and goes around in about 90 minutes: about 16 times a day.' },
    { question: 'How high does the ISS fly?', choices: ['About 40 km', 'About 400 km', 'About 400,000 km'], answer: 1, explanation: 'About 400 km: much closer than the Moon, which is 384,400 km away.' },
  ],
  missions: [
    { question: 'How does every space mission start?', choices: ['With a science question', 'With fireworks', 'With a lucky draw'], answer: 0, explanation: 'Every mission starts with a question. Engineers then choose the instruments to answer it.' },
    { question: 'What is a probe?', choices: ['An astronaut', 'A spacecraft with no crew sent to observe a world', 'A shooting star'], answer: 1, explanation: 'A probe has nobody on board. It is sent to observe a planet, a moon or space.' },
  ],
  jwst: [
    { question: 'Why do we say Webb looks into the past?', choices: ['It has a time machine', 'Light from faraway galaxies left a very long time ago', 'It takes pictures of dinosaurs'], answer: 1, explanation: 'Light takes time to travel: Webb sees faraway galaxies as they were a very long time ago.' },
    { question: 'What protects Webb from the Sun’s heat?', choices: ['A large sunshield', 'A cloth umbrella', 'The Moon'], answer: 0, explanation: 'A large five-layer shield keeps its instruments very cold.' },
  ],
  ciel: [
    { question: 'What is a constellation?', choices: ['A giant planet', 'An imaginary picture made by joining stars', 'A rain cloud'], answer: 1, explanation: 'It is an imaginary picture. Its stars look close together, but they can be very far from each other.' },
    { question: 'What do you need to see the faintest stars?', choices: ['A very dark sky, away from lights', 'A very bright torch', 'To look at midday'], answer: 0, explanation: 'City lights hide faint stars: you need a dark sky and to let your eyes get used to the dark.' },
  ],
  'photo-du-jour': [
    { question: 'What is a “false colour”?', choices: ['A camera mistake', 'A colour added to show a measurement we cannot see', 'Paint on the picture'], answer: 1, explanation: 'It is a colour chosen to show light our eyes cannot see, such as infrared.' },
    { question: 'What else can a beautiful space picture hold?', choices: ['Lots of scientific information', 'Nothing but colours', 'Secret messages'], answer: 0, explanation: 'Each picture comes from real measurements: it helps scientists understand what they observe.' },
  ],
  exoplanetes: [
    { question: 'How do we often spot an exoplanet?', choices: ['It hides a little of its star’s light when passing in front', 'We hear it with a microphone', 'It flashes in colours'], answer: 0, explanation: 'When it passes in front of its star, it blocks a tiny part of the light: this is a transit.' },
    { question: 'Have we found evidence of life on an exoplanet?', choices: ['Yes, several times', 'No, not yet', 'Yes, on all of them'], answer: 1, explanation: 'No evidence of life beyond Earth has been found yet. Scientists keep looking.' },
  ],
  actualites: [
    { question: 'Where does SolarScope’s news come from?', choices: ['Rumours', 'NASA’s official articles', 'Video games'], answer: 1, explanation: 'Each news item links to NASA’s original article, with its date.' },
    { question: 'What does a serious article do?', choices: ['It keeps facts separate from guesses', 'It makes up numbers', 'It never gives the date'], answer: 0, explanation: 'A good article says what is confirmed, what is likely and what is still uncertain.' },
  ],
  solarbot: [
    { question: 'Can SolarBot make mistakes?', choices: ['No, never', 'Yes: check the important facts', 'Only when it rains'], answer: 1, explanation: 'An AI can give an answer that sounds right but is wrong. Check it with a reliable source.' },
    { question: 'How can you get a simpler answer from SolarBot?', choices: ['Ask: “Explain it as if I were 8 years old”', 'Write in capital letters', 'Ask ten questions at once'], answer: 0, explanation: 'Ask one thing at a time and say you want a simple explanation.' },
  ],
}
