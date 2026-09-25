import type { LearningTopic, LearningTopicId } from '@/lib/content/learning-content'

// English lessons, translated from learning-content.ts.
// Awaiting human review: keep the same facts, sentence length and reading level as the French text.
export const ENGLISH_LEARNING_TOPICS: Record<LearningTopicId, LearningTopic> = {
  soleil: {
    label: 'SUN MISSION',
    question: 'Why is the Sun so important?',
    summary: 'The Sun is a star: a huge ball of very hot gas. It lights and warms the Earth. Without its energy, plants, animals and people could not live.',
    analogy: 'If the Sun were the size of a big beach ball, the Earth would be a small pea more than 20 metres away.',
    takeaways: [
      'The Sun is a star, not a planet.',
      'Its light takes about 8 minutes and 20 seconds to reach Earth.',
      'It gives almost all the energy used by life on Earth.',
    ],
    glossary: [
      { term: 'Star', definition: 'A ball of very hot gas that makes its own light.' },
      { term: 'Plasma', definition: 'A gas so hot that its tiny particles break apart.' },
    ],
    deepDive: 'In the centre of the Sun, hydrogen nuclei join together and release energy. This energy slowly travels through the Sun before leaving into space as light and heat.',
    challenge: 'Hold your hand 20 cm from a lamp that is switched off. Now imagine a lamp strong enough to light up eight planets!',
  },
  planetes: {
    label: 'PLANET MISSION',
    question: 'Why are the eight planets so different?',
    summary: 'The eight planets travel around the Sun. The four closest planets are mostly rocky. The four farthest ones are giant worlds made mainly of gas or ice.',
    analogy: 'Imagine a huge race track: every planet travels in its own lane around the Sun.',
    takeaways: [
      'Our Solar System has eight planets.',
      'A planet follows a regular path around the Sun.',
      'Earth is the only planet where we know life exists.',
    ],
    glossary: [
      { term: 'Orbit', definition: 'The path an object follows around another object in space.' },
      { term: 'Rocky planet', definition: 'A planet with solid ground, like Earth or Mars.' },
    ],
    deepDive: 'Planets are not lined up perfectly and their paths are slightly oval. The farther a planet is from the Sun, the longer it takes to travel around it.',
    challenge: 'Choose two planets. Compare their size, temperature and number of moons.',
  },
  mars: {
    label: 'MARS MISSION',
    question: 'Why is Mars red?',
    summary: 'Mars has lots of iron in its soil. The iron reacted with oxygen and made rust-coloured dust. Martian winds spread that dust over almost the whole planet.',
    analogy: 'Mars is red for the same reason an old iron bicycle can become rusty.',
    takeaways: [
      'Mars is a rocky, cold and desert-like planet.',
      'Its colour mostly comes from rusty dust.',
      'Robots explore it before a possible human journey.',
    ],
    glossary: [
      { term: 'Rover', definition: 'A wheeled robot sent to explore another world.' },
      { term: 'Atmosphere', definition: 'The layer of gas around a planet.' },
    ],
    deepDive: 'Mars has a very thin atmosphere made mostly of carbon dioxide. It has water ice, but no evidence of life living there today has been found.',
    challenge: 'Look at a rover. Can you find the tools it uses to see, drive and study rocks?',
  },
  asteroides: {
    label: 'ASTEROID MISSION',
    question: 'Is an asteroid close to Earth dangerous?',
    summary: 'An asteroid is a small rocky world that travels around the Sun. Some pass near Earth, but “near” can still mean several million kilometres away.',
    analogy: 'NASA watches asteroids like a playground helper watches bikes: knowing their path helps avoid surprises.',
    takeaways: [
      'Most asteroids are found between Mars and Jupiter.',
      'Passing near Earth does not mean hitting it.',
      'Scientists work out their path a long time in advance.',
    ],
    glossary: [
      { term: 'Trajectory', definition: 'The path an object follows while it moves.' },
      { term: 'Lunar distance', definition: 'The average distance between Earth and the Moon: about 384,400 km.' },
    ],
    deepDive: 'Objects near Earth are sorted by their size and by how close they come. A scientific alert means an object deserves to be followed, not that a collision is going to happen.',
    challenge: 'Compare an asteroid’s flyby with the distance to the Moon. Which one is farther away?',
  },
  meteorites: {
    label: 'METEORITE MISSION',
    question: 'How does a space rock reach Earth?',
    summary: 'A small piece of rock travels through space. When it enters our atmosphere, it heats up and makes a bright streak. If it reaches the ground, the piece that is left becomes a meteorite.',
    analogy: 'It is like an ice cube melting on a journey: it can get smaller before it arrives.',
    takeaways: [
      'In space, the small object is called a meteoroid.',
      'The light we see in the sky is called a meteor.',
      'The piece found on the ground is called a meteorite.',
    ],
    glossary: [
      { term: 'Atmosphere', definition: 'The layer of air that surrounds and protects the Earth.' },
      { term: 'Meteorite', definition: 'A piece of a space object that has reached the ground.' },
    ],
    deepDive: 'Scientists study what meteorites are made of to understand the materials that were there when the Solar System formed, about 4.6 billion years ago.',
    challenge: 'On the map, find a meteorite discovered near your country and look at its mass.',
  },
  iss: {
    label: 'ISS MISSION',
    question: 'Why do astronauts float inside the ISS?',
    summary: 'The International Space Station keeps falling around Earth without reaching the ground. The station and the astronauts fall together, so they feel as if they float.',
    analogy: 'Imagine an elevator falling at the same time as you: your feet would no longer press against the floor.',
    takeaways: [
      'The ISS is a laboratory travelling around Earth.',
      'It makes one trip around Earth in about 90 minutes.',
      'Astronauts float because they are always in free fall.',
    ],
    glossary: [
      { term: 'Space station', definition: 'A livable laboratory built to work in space.' },
      { term: 'Free fall', definition: 'Motion where gravity is the only force pulling an object.' },
    ],
    deepDive: 'The ISS is about 400 km above Earth and travels close to 28,000 km/h. Gravity is still strong there, but the station moves fast enough to keep missing the ground.',
    challenge: 'Follow the ISS position and find which continent it is above right now.',
  },
  missions: {
    label: 'EXPLORER MISSION',
    question: 'Why do we send robots into space?',
    summary: 'Robots can travel very far, survive dangerous places and work for years. They take pictures and measure their surroundings before humans can sometimes follow them.',
    analogy: 'A space robot is like a scout sent ahead of the group to check the path.',
    takeaways: [
      'Every mission starts with a science question.',
      'Probes, satellites and rovers each have a different job.',
      'A mission can take years to prepare.',
    ],
    glossary: [
      { term: 'Probe', definition: 'A spacecraft with no crew, sent to observe a world or space.' },
      { term: 'Satellite', definition: 'An object that travels around a planet or another body in space.' },
    ],
    deepDive: 'Engineers choose the instruments according to the question being studied. They also have to plan for power, communication, temperature and the time needed to reach the destination.',
    challenge: 'Choose a mission. Find its main question, its destination and one instrument it uses.',
  },
  jwst: {
    label: 'WEBB MISSION',
    question: 'How can Webb look into the past?',
    summary: 'Light takes time to travel. When Webb observes a very distant galaxy, it receives light that left a very long time ago. So it sees that galaxy as it was long ago.',
    analogy: 'Looking far into space is like receiving a very old postcard today.',
    takeaways: [
      'Webb is a space telescope protected by a large sunshield.',
      'It mainly observes an invisible light called infrared.',
      'It studies the first galaxies and faraway planets.',
    ],
    glossary: [
      { term: 'Infrared', definition: 'A light our eyes cannot see, often linked to heat.' },
      { term: 'Telescope', definition: 'An instrument that collects light from very distant objects.' },
    ],
    deepDive: 'As the Universe expands, it stretches the light of distant galaxies towards infrared. Webb’s mirror and its very cold instruments are built to detect this faint light.',
    challenge: 'Choose a Webb image. Look for what is near, far, hot or hidden by dust.',
  },
  ciel: {
    label: 'SKY MISSION',
    question: 'Why does the sky change during the night?',
    summary: 'The Earth spins. As the hours pass, we look towards different directions in space. The date and the place also change which stars and planets we can see.',
    analogy: 'Turn slowly in the middle of a room: the objects seem to move around you, even though they stay in place.',
    takeaways: [
      'The sky seems to move mainly because the Earth spins.',
      'Planets change position over the weeks.',
      'You need a dark sky to see the faintest objects.',
    ],
    glossary: [
      { term: 'Constellation', definition: 'An imaginary picture made by joining stars in the sky.' },
      { term: 'Horizon', definition: 'The line where the sky seems to meet the ground.' },
    ],
    deepDive: 'The map uses your position, the time and the known movements of objects in the sky. Stars in a constellation look close together, but they can be separated by huge distances.',
    challenge: 'Find north, then spot a constellation or a planet you can see tonight.',
  },
  'photo-du-jour': {
    label: 'IMAGE MISSION',
    question: 'Does a space picture always show what our eyes would see?',
    summary: 'Telescopes sometimes capture light we cannot see. Scientists then use colours to make the details visible. These images are still based on real measurements.',
    analogy: 'A thermal camera colours heat to help us see it, even though our eyes cannot see it directly.',
    takeaways: [
      'NASA chooses a picture and its explanation every day.',
      'Some colours stand for light we cannot see.',
      'A beautiful picture can also hold lots of scientific information.',
    ],
    glossary: [
      { term: 'Wavelength', definition: 'A way of telling the different kinds of light apart.' },
      { term: 'False colour', definition: 'A colour added so that an invisible measurement can be understood.' },
    ],
    deepDive: 'Instruments record how bright the light is through several filters. Teams then match these measurements to visible colours and explain how they did it.',
    challenge: 'Look at the picture before reading its title. Guess what it shows, then check with the explanation.',
  },
  exoplanetes: {
    label: 'OTHER WORLDS MISSION',
    question: 'How do we find a planet too far away to be seen?',
    summary: 'An exoplanet travels around a star other than the Sun. Scientists often spot one when it passes in front of its star and blocks a tiny part of its light.',
    analogy: 'A fly passing in front of a lamp hides a little light: a planet can do something similar in front of its star.',
    takeaways: [
      'An exoplanet is outside our Solar System.',
      'Most are found thanks to the effect they have on their star.',
      'No evidence of life beyond Earth has been found yet.',
    ],
    glossary: [
      { term: 'Transit', definition: 'When a planet passes in front of its star, as seen from Earth.' },
      { term: 'Light-year', definition: 'The distance light travels in one year.' },
    ],
    deepDive: 'How much light is blocked, and how often it happens, help estimate the size and orbit of the planet. Other methods measure the small wobble of a star caused by the pull of its planet.',
    challenge: 'Choose an exoplanet. Compare its size, its year and its star with those of the Earth.',
  },
  actualites: {
    label: 'NEWS MISSION',
    question: 'How can you tell if space news is reliable?',
    summary: 'Reliable information says who published it, when it was published and where the evidence comes from. On SolarScope, the news links to NASA’s official articles.',
    analogy: 'Good information is like a science experiment: you should be able to find out who did it and how.',
    takeaways: [
      'Read the headline, but also the date and the source.',
      'A discovery can be confirmed, likely or still uncertain.',
      'A serious article keeps facts separate from guesses.',
    ],
    glossary: [
      { term: 'Source', definition: 'The place where a piece of information was first published.' },
      { term: 'Evidence', definition: 'An observation or measurement that lets us check an idea.' },
    ],
    deepDive: 'An article from a space agency often sums up the work of a science team. To go further, you can look up the mission, the instruments and the study named in the original text.',
    challenge: 'Choose a news article. Find its date, its source and the main evidence it mentions.',
  },
  quiz: {
    label: 'QUIZ MISSION',
    question: 'Ready to check what you understood?',
    summary: 'Pick a level that feels right for you. After every answer, read the explanation: mistakes help your brain learn and remember next time.',
    analogy: 'A quiz is like sports practice: every try can make the next answer easier.',
    takeaways: [
      'Start with a level that feels comfortable.',
      'Always read the explanation, even after a correct answer.',
      'You can try again without losing points or being judged.',
    ],
    glossary: [
      { term: 'Hypothesis', definition: 'An idea we suggest before checking it.' },
    ],
    deepDive: 'Explaining an answer in your own words helps you remember more than simply recognising the correct option.',
    challenge: 'After the quiz, explain the answer that surprised you most to someone else.',
  },
  solarbot: {
    label: 'SOLARBOT MISSION',
    question: 'How do you ask SolarBot a good question?',
    summary: 'Ask one thing at a time and say if you want a very simple answer. SolarBot can make mistakes: never share personal information, and check important facts.',
    analogy: 'SolarBot is like a very fast research buddy, but sometimes it needs a human to check its work.',
    takeaways: [
      'You can ask: “Explain it as if I were 8 years old.”',
      'A made-up story must stay different from a scientific fact.',
      'Never give your full name, your address or your school.',
    ],
    glossary: [
      { term: 'Artificial intelligence', definition: 'A program that can write an answer by learning from lots of examples.' },
      { term: 'Check', definition: 'Compare a piece of information with a reliable source.' },
    ],
    deepDive: 'SolarBot is told to use short sentences and to say when it is unsure. But an AI does not understand the world the way a human does, and it can give an answer that sounds right but is wrong.',
    challenge: 'Ask a question, then ask SolarBot to sum up its answer in a single sentence.',
  },
}
