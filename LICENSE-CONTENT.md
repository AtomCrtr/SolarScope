# Licences des contenus de SolarScope

SolarScope réunit trois types d’éléments, sous trois régimes différents.

## 1. Le code source : MIT

Tout le code (TypeScript, CSS, scripts, tests, configuration) est sous licence MIT. Voir [LICENSE](LICENSE).

## 2. Les textes pédagogiques : CC BY 4.0

Les textes écrits pour SolarScope sont sous licence [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/deed.fr) :

- les leçons des missions, en français et en anglais (`src/lib/content/learning-content.ts`, `learning-content.en.ts`) ;
- les questions de validation du passeport (`src/lib/content/mission-checks.ts`) ;
- les questions du quiz, les guides parents-enseignants et les textes explicatifs des pages.

Vous pouvez les copier, les adapter et les partager, y compris en classe ou dans un usage commercial, à condition de citer la source. Par exemple :

> D’après SolarScope (https://solar-scope.vercel.app), licence CC BY 4.0.

## 3. Ce qui n’est pas couvert par ces licences

Ces éléments gardent leurs propres conditions. SolarScope les utilise en les créditant ; il n’a pas le droit de les relicencier.

| Élément | Emplacement | Origine et conditions |
|:---|:---|:---|
| Photos et images de missions | `public/media/`, `public/smacs0723.png`, `public/rovers/` | NASA, ESA, CSA, STScI, JPL-Caltech : voir les conditions d’utilisation de chaque agence |
| Modèles 3D des rovers | `public/models/` | NASA 3D Resources |
| Textures de Jupiter, Saturne et Neptune | `public/textures/` | [Solar System Scope](https://www.solarsystemscope.com/textures/), CC BY 4.0, d’après des images de la NASA |
| Décodeur Draco | `public/draco/` | Google, licence Apache 2.0 |
| Écussons et logos de missions ou d’entreprises | `public/*.svg` concernés | Marques de leurs propriétaires |
| Données scientifiques affichées | lues à la demande | Conditions de chaque source listée sur la page [Sources](https://solar-scope.vercel.app/sources) |
| Nom « SolarScope », logo et mascotte Cosmo | `public/solarscope-icon*`, `public/mascot/` | Non couverts par les licences ci-dessus : merci de ne pas les réutiliser pour présenter un autre projet |

SolarScope est un projet éducatif indépendant. Il n’est pas un site officiel de la NASA, de l’ESA, du CNES ou de la NOAA, et l’utilisation de leurs images n’implique aucun soutien de leur part.
