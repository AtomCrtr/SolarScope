# 🔭 SolarScope

**SolarScope est un site gratuit qui aide les enfants de 8 à 12 ans à comprendre l’espace, en français.**

🌐 **Essayer le site :** [solar-scope.vercel.app](https://solar-scope.vercel.app)

## Le projet en deux minutes

L’espace peut sembler immense et compliqué. SolarScope le rend plus simple : l’enfant choisit un sujet, découvre une idée importante avec des mots faciles, puis répond à une petite question ou réalise un défi.

Le site parle du Soleil, des planètes, de Mars, de l’ISS, des fusées, de Webb, des astéroïdes et du ciel. Les informations scientifiques viennent de sources reconnues, comme la NASA, l’ESA et la NOAA.

## Ce que l’on peut faire

- Explorer les huit planètes avec un globe à tourner, une comparaison avec la Terre et un mini-défi.
- Suivre des missions courtes : lire, observer, essayer et raconter ce que l’on a appris.
- Écouter les explications, répondre à des quiz et conserver ses progrès dans un passeport local.
- Consulter des fiches simples pour les parents et les enseignants, avec une version imprimable.
- Vérifier d’où viennent les chiffres grâce à la page [Données et sources](https://solar-scope.vercel.app/sources).

## Pour les enfants, avec les adultes

SolarScope ne demande pas de compte enfant et ne crée pas de profil. Le français est la langue principale ; une partie de la navigation et de l’accueil existe également en anglais. Les parents et les enseignants peuvent accompagner une mission, mais chaque activité est pensée pour rester simple à utiliser seul.

## En bref pour les personnes qui contribuent

Le projet est une application Next.js. Il privilégie des explications adaptées aux enfants, des données sourcées, la navigation au clavier et un affichage confortable sur mobile.

## Langues

| Zone | Français | English |
|---|---:|---:|
| Navigation | ✅ Référence | ✅ |
| Accueil | ✅ Référence | ✅ |
| Parcours pédagogiques détaillés | ✅ | En cours |

Le sélecteur **FR / EN** mémorise le choix dans le navigateur. La priorité éditoriale est volontairement donnée au français : une traduction complète doit préserver le niveau de langue enfant et l’exactitude scientifique, pas seulement traduire mot à mot.

## Démarrage rapide

**Pré-requis :** Node.js 20.9 ou plus récent et npm.

```bash
git clone https://github.com/AtomCrtr/SolarScope.git
cd SolarScope
npm install
```

Créez ensuite le fichier de configuration locale :

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000).

## Variables d’environnement

Copiez `.env.example` vers `.env.local`. Ne publiez jamais ce fichier ni une clé dans le navigateur.

| Variable | Requise en production | Rôle |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | Oui | URL publique canonique, sans slash final. |
| `NASA_API_KEY` | Recommandée | Quotas NASA plus confortables que `DEMO_KEY`. |
| `GEMINI_API_KEY` | Non | Active les réponses IA de SolarBot ; sans clé, le mode éducatif local reste disponible. |
| `GEMINI_MODEL` | Non | Modèle Gemini, par défaut `gemini-2.5-flash-lite`. |
| `CRON_SECRET` | Oui | Protège la route de rafraîchissement planifiée. |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Oui | Variables injectées par l’intégration Vercel Upstash Redis. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Alternative | Noms Upstash standards également pris en charge. |

`NASA_API_KEY=DEMO_KEY` suffit pour le développement, avec un quota réduit.

## Sécurité et protection des enfants

- Les routes Gemini et SDO utilisent un quota partagé Redis : il s’applique à toutes les fonctions Vercel, pas seulement à une instance.
- Sans Redis en production, les routes protégées refusent la requête plutôt que de laisser un quota local contournable.
- SolarBot limite la taille réelle du flux de requête, y compris lorsqu’il n’y a pas d’en-tête `Content-Length`.
- Les signaux usuels de données personnelles (e-mail, téléphone, adresse, école…) sont bloqués avant tout envoi vers Gemini.
- Une consigne visible rappelle aux enfants de ne pas partager leurs informations personnelles.

> La détection de données personnelles est une protection complémentaire ; elle ne remplace pas l’accompagnement d’un adulte.

## Données et fraîcheur

Les routes serveur valident les réponses externes et les mettent en cache.

Les chiffres de référence et les flux en direct sont distingués dans le registre `src/lib/data/source-registry.ts`. La page [/sources](/sources) indique la source, le type de donnée et la date de vérification. Une valeur indisponible reste signalée comme indisponible : SolarScope ne la remplace jamais par une estimation silencieuse.

| Données | Source | Cache indicatif |
|---|---|---:|
| Tableau de bord et équipages | NASA/IPAC, NASA NeoWs, People in Space | 15 à 60 min |
| Position de l’ISS | Where The ISS At, via `/api/iss-position` | 5 s |
| Météo spatiale | NOAA SWPC, via `/api/space-weather` | 60 s |
| Lancements | The Space Devs | 15 min |
| Actualités | Flux RSS NASA | 30 min |
| Astéroïdes et éruptions | NASA NeoWs / DONKI | 60 min |
| Photo du jour | NASA APOD | 60 min |

Un cron Vercel quotidien appelle `/api/refresh` pour préchauffer les données. `/api/health` permet de vérifier les principaux flux sans exposer de secret.

## Ressources vidéo

Les vidéos YouTube sont choisies en priorité chez NASA, ESA ou des créateurs éducatifs identifiés. Elles doivent être revues régulièrement : une vidéo peut devenir privée, supprimée ou géobloquée sans préavis.

Lors de la dernière vérification, les 10 liens YouTube uniques du projet étaient accessibles. Les liens sont déclarés dans les pages `asteroides`, `exoplanetes` et `quiz`.

## Commandes utiles

```bash
npm run dev        # développement local
npm run lint       # règles ESLint
npm run typecheck  # vérification TypeScript
npm test           # tests unitaires Vitest
npm run build      # build de production Next.js
npm run check      # lint + types + tests + build
npm run test:a11y  # audit Playwright + axe
```

Si Playwright n’a pas encore ses navigateurs localement :

```bash
npx playwright install
```

GitHub Actions exécute les contrôles essentiels à chaque push et pull request. Dependabot regroupe les mises à jour de dépendances.

## Architecture

```text
src/
├── app/          Pages App Router et routes API
├── components/
│   ├── assistant/ SolarBot
│   ├── layout/    Navigation, thème et décor global
│   ├── learning/  Guides, missions et passeport
│   └── space/     Visualisations 2D/3D et tableaux de bord
└── lib/          Données externes, cache, sécurité et quotas
public/           Textures, images et ressources statiques
tests/            Tests unitaires et parcours Playwright
scripts/          Contrôles de ressources externes
docs/             Architecture et décisions de conception
```

Les conventions de rangement et le détail des domaines sont dans [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). L’audit design le plus récent est disponible dans [docs/DESIGN_AUDIT_2026-07-26.md](docs/DESIGN_AUDIT_2026-07-26.md).
Les principes pour les contenus enfant et les données scientifiques sont documentés dans [docs/LEARNING_AND_DATA.md](docs/LEARNING_AND_DATA.md).

Principales briques : Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Three.js, React Three Fiber, Upstash Redis et Vercel.

## Déploiement Vercel

1. Importez `AtomCrtr/SolarScope` dans Vercel.
2. Ajoutez `NEXT_PUBLIC_SITE_URL`, `NASA_API_KEY`, `GEMINI_API_KEY` (facultative) et `CRON_SECRET`.
3. Connectez l’intégration gratuite **Upstash for Redis** au projet : elle crée normalement `KV_REST_API_URL` et `KV_REST_API_TOKEN` pour Production et Preview.
4. Gardez `main` comme branche de production.

Chaque push sur `main` déclenche automatiquement un déploiement. Le cron défini dans `vercel.json` assure le rafraîchissement planifié.

## Pistes d’amélioration

1. Ajouter des captures Playwright de référence à 1280 px, 1600 px et 390 px après validation humaine, afin de comparer automatiquement les futures interfaces.
2. Tester le parcours 6–8 ans avec des enfants et des adultes afin d’ajuster le vocabulaire, les boutons et l’emplacement de SolarBot.
3. Compléter la provenance de chaque statistique fixe par une date de vérification et un lien source.
4. Étendre progressivement la traduction anglaise avec une relecture pédagogique native.

Consultez aussi la [politique de confidentialité](https://solar-scope.vercel.app/confidentialite).
