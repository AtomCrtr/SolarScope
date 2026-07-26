export type LearningTopicId =
  | 'soleil'
  | 'planetes'
  | 'mars'
  | 'asteroides'
  | 'meteorites'
  | 'iss'
  | 'missions'
  | 'jwst'
  | 'ciel'
  | 'photo-du-jour'
  | 'exoplanetes'
  | 'actualites'
  | 'quiz'
  | 'solarbot'

export type LearningTopic = {
  label: string
  question: string
  summary: string
  analogy: string
  takeaways: [string, string, string]
  glossary: Array<{ term: string; definition: string }>
  deepDive: string
  challenge: string
}
export const LEARNING_TOPICS: Record<LearningTopicId, LearningTopic> = {
  soleil: {
    label: 'MISSION SOLEIL',
    question: 'Pourquoi le Soleil est-il si important ?',
    summary: 'Le Soleil est une étoile : une immense boule de gaz très chaud. Il éclaire et réchauffe la Terre. Sans son énergie, les plantes, les animaux et les humains ne pourraient pas vivre.',
    analogy: 'Si le Soleil avait la taille d’un gros ballon, la Terre serait un petit pois placé à plus de 20 mètres.',
    takeaways: [
      'Le Soleil est une étoile, pas une planète.',
      'Sa lumière met environ 8 minutes et 20 secondes pour arriver sur Terre.',
      'Il fournit presque toute l’énergie utilisée par la vie terrestre.',
    ],
    glossary: [
      { term: 'Étoile', definition: 'Une boule de gaz très chaud qui fabrique sa propre lumière.' },
      { term: 'Plasma', definition: 'Un gaz tellement chaud que ses minuscules particules se séparent.' },
    ],
    deepDive: 'Au centre du Soleil, des noyaux d’hydrogène fusionnent et libèrent de l’énergie. Cette énergie traverse lentement le Soleil avant de partir dans l’espace sous forme de lumière et de chaleur.',
    challenge: 'Place ta main à 20 cm d’une lampe éteinte. Imagine maintenant une lampe assez puissante pour éclairer huit planètes !',
  },
  planetes: {
    label: 'MISSION PLANÈTES',
    question: 'Pourquoi les huit planètes sont-elles différentes ?',
    summary: 'Les huit planètes tournent autour du Soleil. Les quatre plus proches sont surtout rocheuses. Les quatre plus éloignées sont des géantes faites principalement de gaz ou de glaces.',
    analogy: 'Imagine une grande piste de course : chaque planète avance sur sa propre voie autour du Soleil.',
    takeaways: [
      'Le Système solaire compte huit planètes.',
      'Une planète suit un chemin régulier autour du Soleil.',
      'La Terre est la seule planète où nous connaissons la vie.',
    ],
    glossary: [
      { term: 'Orbite', definition: 'Le chemin suivi par un objet autour d’un autre objet dans l’espace.' },
      { term: 'Planète rocheuse', definition: 'Une planète avec un sol solide, comme la Terre ou Mars.' },
    ],
    deepDive: 'Les planètes ne sont pas parfaitement alignées et leurs orbites sont légèrement ovales. Plus une planète est loin du Soleil, plus elle met de temps à en faire le tour.',
    challenge: 'Choisis deux planètes et compare leur taille, leur température et le nombre de leurs lunes.',
  },
  mars: {
    label: 'MISSION MARS',
    question: 'Pourquoi Mars est-elle rouge ?',
    summary: 'Le sol de Mars contient beaucoup de fer. Ce fer a réagi avec l’oxygène et a formé une poussière couleur rouille. Les vents martiens répandent cette poussière sur presque toute la planète.',
    analogy: 'Mars est rouge pour la même raison qu’un vieux vélo en fer peut devenir rouillé sous la pluie.',
    takeaways: [
      'Mars est une planète rocheuse, froide et désertique.',
      'Sa couleur vient surtout de la rouille présente dans sa poussière.',
      'Des robots l’explorent avant un possible voyage humain.',
    ],
    glossary: [
      { term: 'Rover', definition: 'Un robot à roues envoyé pour explorer le sol d’un autre monde.' },
      { term: 'Atmosphère', definition: 'La couche de gaz qui entoure une planète.' },
    ],
    deepDive: 'L’atmosphère de Mars est très fine et composée surtout de dioxyde de carbone. Mars possède de la glace d’eau, mais aucune preuve de vie actuelle n’y a encore été découverte.',
    challenge: 'Observe un rover et trouve les outils qui lui servent à voir, rouler et étudier les roches.',
  },
  asteroides: {
    label: 'MISSION ASTÉROÏDES',
    question: 'Un astéroïde proche de la Terre est-il dangereux ?',
    summary: 'Un astéroïde est un petit monde rocheux qui tourne autour du Soleil. Certains passent près de la Terre, mais « proche » peut encore vouloir dire plusieurs millions de kilomètres.',
    analogy: 'La NASA surveille les astéroïdes comme un gardien suit les vélos autour d’une cour : connaître leur chemin permet d’éviter les surprises.',
    takeaways: [
      'La plupart des astéroïdes se trouvent entre Mars et Jupiter.',
      'Passer près de la Terre ne signifie pas forcément la frapper.',
      'Les scientifiques calculent leur trajectoire longtemps à l’avance.',
    ],
    glossary: [
      { term: 'Trajectoire', definition: 'Le chemin qu’un objet suit pendant son déplacement.' },
      { term: 'Distance lunaire', definition: 'La distance moyenne entre la Terre et la Lune : environ 384 400 km.' },
    ],
    deepDive: 'Les objets proches de la Terre sont classés selon leur taille et leur distance minimale. Une alerte scientifique indique qu’un objet mérite d’être suivi, pas qu’une collision va se produire.',
    challenge: 'Compare le passage d’un astéroïde à la distance de la Lune. Lequel passe le plus loin ?',
  },
  meteorites: {
    label: 'MISSION MÉTÉORITES',
    question: 'Comment une pierre de l’espace arrive-t-elle sur Terre ?',
    summary: 'Un petit morceau de roche voyage dans l’espace. En entrant dans notre atmosphère, il chauffe et produit une traînée lumineuse. S’il touche le sol, le morceau restant devient une météorite.',
    analogy: 'C’est comme un glaçon qui fond pendant un trajet : il peut devenir plus petit avant d’arriver.',
    takeaways: [
      'Dans l’espace, le petit objet s’appelle un météoroïde.',
      'La lumière visible dans le ciel s’appelle un météore.',
      'Le morceau retrouvé au sol s’appelle une météorite.',
    ],
    glossary: [
      { term: 'Atmosphère', definition: 'La couche d’air qui protège et entoure la Terre.' },
      { term: 'Météorite', definition: 'Le morceau d’un objet spatial qui a atteint le sol.' },
    ],
    deepDive: 'Les scientifiques étudient la composition des météorites pour comprendre les matériaux présents lors de la formation du Système solaire, il y a environ 4,6 milliards d’années.',
    challenge: 'Retrouve sur la carte une météorite découverte près de ton pays et observe sa masse.',
  },
  iss: {
    label: 'MISSION ISS',
    question: 'Pourquoi les astronautes flottent-ils dans l’ISS ?',
    summary: 'La Station spatiale internationale tombe sans cesse autour de la Terre, sans toucher le sol. La station et les astronautes tombent ensemble : ils ont donc l’impression de flotter.',
    analogy: 'Imagine un ascenseur qui descendrait en même temps que toi : pendant la chute, tes pieds ne pousseraient plus sur le sol.',
    takeaways: [
      'L’ISS est un laboratoire qui tourne autour de la Terre.',
      'Elle fait environ un tour en 90 minutes.',
      'Les astronautes flottent parce qu’ils sont en chute libre permanente.',
    ],
    glossary: [
      { term: 'Station spatiale', definition: 'Un laboratoire habitable construit pour fonctionner dans l’espace.' },
      { term: 'Chute libre', definition: 'Un mouvement pendant lequel seule la gravité attire l’objet.' },
    ],
    deepDive: 'L’ISS se trouve à environ 400 km d’altitude et avance à près de 28 000 km/h. La gravité y est encore forte, mais sa vitesse l’empêche de retomber directement sur Terre.',
    challenge: 'Suis la position de l’ISS et cherche au-dessus de quel continent elle passe maintenant.',
  },
  missions: {
    label: 'MISSION EXPLORATEURS',
    question: 'Pourquoi envoie-t-on des robots dans l’espace ?',
    summary: 'Les robots peuvent voyager très loin, supporter des endroits dangereux et travailler pendant des années. Ils prennent des images et mesurent leur environnement avant que des humains puissent parfois les rejoindre.',
    analogy: 'Un robot spatial ressemble à un éclaireur envoyé devant le groupe pour vérifier le chemin.',
    takeaways: [
      'Chaque mission commence par une question scientifique.',
      'Les sondes, satellites et rovers ont des rôles différents.',
      'Une mission peut demander des années de préparation.',
    ],
    glossary: [
      { term: 'Sonde', definition: 'Un engin sans équipage envoyé pour observer un monde ou l’espace.' },
      { term: 'Satellite', definition: 'Un objet qui tourne autour d’une planète ou d’un autre astre.' },
    ],
    deepDive: 'Les ingénieurs choisissent les instruments selon la question étudiée. Ils doivent aussi prévoir l’énergie, les communications, la température et le temps nécessaire pour atteindre la destination.',
    challenge: 'Choisis une mission et retrouve sa question principale, sa destination et l’instrument qu’elle utilise.',
  },
  jwst: {
    label: 'MISSION WEBB',
    question: 'Comment Webb peut-il regarder dans le passé ?',
    summary: 'La lumière met du temps à voyager. Quand Webb observe une galaxie très lointaine, il reçoit une lumière partie il y a très longtemps. Il voit donc cette galaxie telle qu’elle était autrefois.',
    analogy: 'Regarder loin dans l’espace, c’est comme recevoir aujourd’hui une très vieille carte postale.',
    takeaways: [
      'Webb est un télescope spatial protégé par un grand bouclier.',
      'Il observe surtout une lumière invisible appelée infrarouge.',
      'Il étudie les premières galaxies et des planètes lointaines.',
    ],
    glossary: [
      { term: 'Infrarouge', definition: 'Une lumière invisible pour nos yeux, souvent liée à la chaleur.' },
      { term: 'Télescope', definition: 'Un instrument qui collecte la lumière d’objets très éloignés.' },
    ],
    deepDive: 'L’Univers en expansion étire la lumière des galaxies lointaines vers l’infrarouge. Le miroir de Webb et ses instruments très froids sont conçus pour détecter cette faible lumière.',
    challenge: 'Choisis une image de Webb et cherche ce qui est proche, lointain, chaud ou caché par la poussière.',
  },
  ciel: {
    label: 'MISSION CIEL',
    question: 'Pourquoi le ciel change-t-il pendant la nuit ?',
    summary: 'La Terre tourne sur elle-même. Au fil des heures, nous regardons donc dans différentes directions de l’espace. La date et le lieu changent aussi les étoiles et les planètes visibles.',
    analogy: 'Tourne lentement au milieu d’une pièce : les objets semblent se déplacer autour de toi, même s’ils restent à leur place.',
    takeaways: [
      'Le mouvement apparent du ciel vient surtout de la rotation terrestre.',
      'Les planètes changent de position au fil des semaines.',
      'Il faut un ciel sombre pour voir les objets les moins lumineux.',
    ],
    glossary: [
      { term: 'Constellation', definition: 'Un dessin imaginaire formé en reliant des étoiles dans le ciel.' },
      { term: 'Horizon', definition: 'La limite apparente entre le ciel et le sol.' },
    ],
    deepDive: 'La carte utilise la position, l’heure et les mouvements connus des astres. Les constellations semblent proches les unes des autres, mais leurs étoiles peuvent être séparées par d’immenses distances.',
    challenge: 'Trouve le nord, puis repère une constellation ou une planète visible ce soir.',
  },
  'photo-du-jour': {
    label: 'MISSION IMAGE',
    question: 'Une image de l’espace montre-t-elle toujours ce que verraient nos yeux ?',
    summary: 'Les télescopes captent parfois des lumières invisibles. Les scientifiques utilisent alors des couleurs pour rendre les détails visibles. Ces images restent fondées sur de vraies mesures.',
    analogy: 'Une caméra thermique colore la chaleur pour nous aider à la voir, même si nos yeux ne la voient pas directement.',
    takeaways: [
      'La NASA choisit chaque jour une image et son explication.',
      'Certaines couleurs représentent une lumière invisible.',
      'Une belle image peut aussi contenir beaucoup d’informations scientifiques.',
    ],
    glossary: [
      { term: 'Longueur d’onde', definition: 'Une façon de distinguer les différents types de lumière.' },
      { term: 'Fausse couleur', definition: 'Une couleur ajoutée pour rendre une mesure invisible compréhensible.' },
    ],
    deepDive: 'Les instruments enregistrent des intensités lumineuses dans plusieurs filtres. Les équipes associent ensuite ces mesures à des couleurs visibles, en expliquant le procédé utilisé.',
    challenge: 'Observe l’image avant de lire son titre. Devine ce qu’elle montre, puis vérifie avec l’explication.',
  },
  exoplanetes: {
    label: 'MISSION AUTRES MONDES',
    question: 'Comment découvrir une planète trop lointaine pour être vue ?',
    summary: 'Une exoplanète tourne autour d’une autre étoile que le Soleil. Souvent, les scientifiques la repèrent quand elle passe devant son étoile et bloque une toute petite partie de sa lumière.',
    analogy: 'Une mouche passant devant une lampe cache un peu de lumière : une planète peut produire un effet semblable devant son étoile.',
    takeaways: [
      'Une exoplanète se trouve en dehors de notre Système solaire.',
      'La plupart sont détectées grâce à l’effet produit sur leur étoile.',
      'Aucune preuve de vie extraterrestre n’a encore été trouvée.',
    ],
    glossary: [
      { term: 'Transit', definition: 'Le passage d’une planète devant son étoile, vu depuis la Terre.' },
      { term: 'Année-lumière', definition: 'La distance parcourue par la lumière en une année.' },
    ],
    deepDive: 'La profondeur et la répétition d’un transit permettent d’estimer la taille et l’orbite de la planète. D’autres méthodes mesurent le petit mouvement de l’étoile causé par la gravité de sa planète.',
    challenge: 'Choisis une exoplanète et compare sa taille, son année et son étoile avec celles de la Terre.',
  },
  actualites: {
    label: 'MISSION INFO',
    question: 'Comment savoir si une actualité spatiale est fiable ?',
    summary: 'Une information fiable indique qui l’a publiée, quand elle a été publiée et d’où viennent les preuves. Sur SolarScope, les actualités renvoient vers les publications officielles de la NASA.',
    analogy: 'Une bonne information ressemble à une expérience de science : on doit pouvoir retrouver qui l’a faite et comment.',
    takeaways: [
      'Lis le titre, mais aussi la date et la source.',
      'Une découverte peut être confirmée, probable ou encore incertaine.',
      'Un article sérieux sépare les faits des suppositions.',
    ],
    glossary: [
      { term: 'Source', definition: 'L’endroit où une information a été publiée pour la première fois.' },
      { term: 'Preuve', definition: 'Une observation ou une mesure qui permet de vérifier une idée.' },
    ],
    deepDive: 'Une publication d’agence résume souvent le travail d’une équipe scientifique. Pour aller plus loin, on peut rechercher la mission, les instruments et l’étude mentionnés dans le texte original.',
    challenge: 'Choisis une actualité et retrouve sa date, sa source et la preuve principale annoncée.',
  },
  quiz: {
    label: 'MISSION QUIZ',
    question: 'Prêt à vérifier ce que tu as compris ?',
    summary: 'Choisis le niveau qui te convient. Après chaque réponse, lis l’explication : se tromper aide aussi ton cerveau à apprendre et à mieux retenir la prochaine fois.',
    analogy: 'Un quiz est comme un entraînement de sport : chaque essai rend la prochaine réponse plus facile.',
    takeaways: [
      'Commence par le niveau qui te semble confortable.',
      'Lis toujours l’explication, même après une bonne réponse.',
      'Tu peux recommencer sans perdre de point ni être jugé.',
    ],
    glossary: [
      { term: 'Hypothèse', definition: 'Une idée que l’on propose avant de la vérifier.' },
    ],
    deepDive: 'Expliquer une réponse avec ses propres mots aide davantage à mémoriser que reconnaître simplement la bonne option.',
    challenge: 'Après le quiz, explique à quelqu’un la réponse qui t’a le plus surpris.',
  },
  solarbot: {
    label: 'MISSION SOLARBOT',
    question: 'Comment poser une bonne question à SolarBot ?',
    summary: 'Demande une seule chose à la fois et précise si tu veux une réponse très simple. SolarBot peut se tromper : ne partage aucune information personnelle et vérifie les faits importants.',
    analogy: 'SolarBot est comme un compagnon de recherche très rapide, mais il a parfois besoin qu’un humain vérifie son travail.',
    takeaways: [
      'Tu peux demander : « Explique-moi comme si j’avais 8 ans. »',
      'Une histoire inventée doit rester différente d’un fait scientifique.',
      'Ne donne jamais ton nom complet, ton adresse ou ton école.',
    ],
    glossary: [
      { term: 'Intelligence artificielle', definition: 'Un programme capable de produire une réponse à partir de nombreux exemples.' },
      { term: 'Vérifier', definition: 'Comparer une information avec une source fiable.' },
    ],
    deepDive: 'SolarBot reçoit une consigne pour employer des phrases courtes et signaler les incertitudes. Une IA ne comprend toutefois pas le monde comme un humain et peut produire une réponse convaincante mais fausse.',
    challenge: 'Pose une question, puis demande à SolarBot de résumer sa réponse en une seule phrase.',
  },
}
