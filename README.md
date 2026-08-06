# 🔭 SolarScope — l’espace expliqué simplement

**SolarScope est un site éducatif gratuit pour découvrir l’Univers avec des mots simples, de vraies images et des missions courtes.**

Il s’adresse d’abord aux enfants de 6 à 12 ans, mais aussi aux adolescents, aux parents, aux enseignants et à toutes les personnes qui veulent comprendre l’espace sans se perdre dans des explications compliquées.

🌐 **Découvrir SolarScope : [solar-scope.vercel.app](https://solar-scope.vercel.app)**

![Aperçu de SolarScope](https://solar-scope.vercel.app/opengraph-image)

## Pourquoi SolarScope existe

L’espace fait rêver, mais il peut aussi sembler immense et difficile à comprendre. Entre les distances gigantesques, les mots scientifiques et les informations qui changent régulièrement, il n’est pas toujours facile de savoir par où commencer.

SolarScope transforme cette découverte en aventure. Chaque sujet part d’une question simple, présente quelques idées importantes, puis propose d’observer, de comparer ou de relever un petit défi.

L’objectif n’est pas de tout apprendre d’un coup. Il est de donner envie de regarder le ciel, de poser des questions et de comprendre progressivement ce que les scientifiques découvrent.

## Ce que l’on peut découvrir

Sur SolarScope, on peut notamment :

- comprendre le Soleil et explorer les huit planètes ;
- suivre les rovers sur Mars et observer Perseverance en 3D ;
- découvrir les astéroïdes, les météorites et les exoplanètes ;
- suivre l’ISS et les prochaines missions spatiales ;
- admirer les images du télescope James-Webb et la photo astronomique du jour ;
- préparer une observation du ciel ;
- répondre à des quiz et remplir un passeport d’explorateur ;
- poser une question à SolarBot et retrouver les sources utilisées.

## Une mission, comment ça marche ?

Chaque parcours est conçu pour être suivi en quelques étapes :

1. **Choisir une mission** selon son âge ou sa curiosité.
2. **Découvrir l’idée essentielle** avec une explication courte.
3. **Observer et manipuler** une image, une comparaison ou une visualisation.
4. **Relever un défi** pour vérifier ce que l’on a compris.
5. **Conserver sa progression** dans son passeport spatial.

On peut lire les missions dans l’ordre ou simplement choisir le sujet qui donne envie aujourd’hui.

## Des informations que l’on peut vérifier

SolarScope s’appuie sur des organismes scientifiques reconnus comme la **NASA**, l’**ESA**, le **CNES** et la **NOAA**.

Les chiffres qui évoluent — position de l’ISS, météo solaire, lancements ou découvertes — sont accompagnés de leur source. Lorsqu’une information en direct n’est pas disponible, le site préfère le dire clairement plutôt que d’afficher une estimation comme si elle était certaine.

La page [Données et sources](https://solar-scope.vercel.app/sources) permet de retrouver facilement l’origine des informations.

## Pensé pour les enfants et les familles

- Aucun compte enfant n’est nécessaire.
- Le passeport et la progression restent sur l’appareil utilisé.
- SolarBot rappelle de ne jamais partager son nom, son adresse, son école, son téléphone ou son e-mail.
- Les pages sont utilisables sur ordinateur, tablette et téléphone.
- La navigation est conçue pour rester accessible au clavier et avec les outils d’assistance.

Une page spéciale propose également des repères aux [parents et aux enseignants](https://solar-scope.vercel.app/parents-enseignants) pour accompagner une mission ou lancer une discussion.

## Et la version anglaise ?

Le français est la langue principale de SolarScope. Une présentation de l’accueil est disponible en anglais, mais les parcours pédagogiques détaillés restent actuellement en français.

Ce choix est volontaire : une bonne traduction pour les enfants doit préserver la simplicité des mots et l’exactitude scientifique, pas seulement traduire les phrases mot à mot.

## Liens utiles

- [Explorer SolarScope](https://solar-scope.vercel.app)
- [Commencer par les planètes](https://solar-scope.vercel.app/planetes)
- [Voir son passeport spatial](https://solar-scope.vercel.app/passeport)
- [Consulter les sources scientifiques](https://solar-scope.vercel.app/sources)
- [Lire la politique de confidentialité](https://solar-scope.vercel.app/confidentialite)

## Participer au projet

SolarScope est un projet ouvert aux idées et aux améliorations. Une contribution peut prendre plusieurs formes :

- signaler une explication difficile à comprendre ;
- proposer une nouvelle mission ou une activité ;
- corriger une information ou ajouter une meilleure source ;
- améliorer l’accessibilité ou l’affichage sur mobile ;
- aider à préparer une véritable version anglaise.

Vous pouvez ouvrir une *issue* sur GitHub pour partager une idée ou signaler un problème.

<details>
<summary><strong>Installer le projet pour contribuer</strong></summary>

SolarScope utilise Next.js et nécessite Node.js 20.9 ou une version plus récente.

```bash
git clone https://github.com/AtomCrtr/SolarScope.git
cd SolarScope
npm install
```

Copiez ensuite `.env.example` vers `.env.local`, puis lancez le site :

```bash
npm run dev
```

Le site sera disponible sur [http://localhost:3000](http://localhost:3000).

Avant de proposer une modification, lancez :

```bash
npm run check
npm run test:a11y
```

Les choix d’organisation du projet sont expliqués dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Les principes utilisés pour les contenus destinés aux enfants et les données scientifiques se trouvent dans [docs/LEARNING_AND_DATA.md](docs/LEARNING_AND_DATA.md).

</details>

---

**SolarScope invite chacun à lever les yeux, rester curieux et explorer l’Univers une question après l’autre.** 🚀
