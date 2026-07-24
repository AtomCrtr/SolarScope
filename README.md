# 🔭 SolarScope

SolarScope explique le Système solaire et l’exploration spatiale aux enfants de 8 à 12 ans. Chaque parcours commence par une question simple, une comparaison concrète, trois idées à retenir et un niveau facultatif pour aller plus loin.

Production : [solar-scope.vercel.app](https://solar-scope.vercel.app)

## Fonctionnalités

- Quatorze parcours pédagogiques adaptés aux 8–12 ans, avec glossaire et petit défi.
- Lecture audio locale des explications essentielles depuis le navigateur.
- Deux niveaux de lecture : une synthèse simple, puis les données scientifiques détaillées.
- Système solaire et rovers en 3D avec Three.js.
- ISS, équipages et prochains lancements.
- Activité solaire NOAA et images NASA SDO/SOHO.
- Astéroïdes NeoWs, exoplanètes, APOD et actualités NASA.
- Galerie JWST, archive pédagogique des météorites et quiz.
- SolarBot avec consignes adaptées aux enfants, avertissement sur ses limites, limitation de débit et réponses locales de secours.
- Métadonnées par page, Open Graph, sitemap, robots et manifeste PWA.
- Mode clair/sombre, navigation clavier et prise en charge de `prefers-reduced-motion`.

## Sources et fraîcheur des données

Les routes serveur valident les réponses externes et conservent la dernière réponse en cache pendant une durée adaptée :

| Données | Source | Cache |
|---|---|---:|
| Tableau de bord et équipages | NASA/IPAC, NASA NeoWs, People in Space | 15 à 60 min |
| Position de l’ISS | Where The ISS At, via `/api/iss-position` | 5 s |
| Vent solaire, champ magnétique et rayons X | NOAA SWPC, via `/api/space-weather` | 60 s |
| Lancements | The Space Devs | 15 min |
| Actualités | Flux RSS NASA | 30 min |
| Astéroïdes et éruptions | NASA NeoWs / DONKI | 60 min |
| Photo du jour | NASA APOD | 60 min |

Les caches se renouvellent à la demande. Un cron Vercel quotidien appelle aussi `/api/refresh` afin de préchauffer les sources même sans visite. `/api/health` contrôle séparément les compteurs, les lancements, la position ISS, le vent solaire et les rayons X, sans révéler de secret. La page Météorites utilise un échantillon embarqué de l’ancienne archive NASA et l’indique explicitement.

## Développement local

Prérequis : Node.js 20.9 ou plus récent.

```bash
git clone https://github.com/AtomCrtr/SolarScope.git
cd SolarScope
npm install
cp .env.example .env.local
npm run dev
```

Variables disponibles :

```env
NEXT_PUBLIC_SITE_URL=https://solar-scope.vercel.app
NASA_API_KEY=DEMO_KEY
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash-lite
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
KV_REST_API_URL=
KV_REST_API_TOKEN=
CRON_SECRET=
```

`NASA_API_KEY=DEMO_KEY` convient au développement avec un quota réduit. Sans clé Gemini, SolarBot reste fonctionnel avec ses réponses éducatives locales. `CRON_SECRET` doit être une valeur longue et aléatoire ; Vercel l’envoie automatiquement au cron dans l’en-tête `Authorization`.

Les routes publiques Gemini et SDO utilisent Upstash Redis pour partager leurs quotas entre toutes les fonctions Vercel. Connecter l’intégration gratuite **Upstash for Redis** au projet Vercel, en région `fra1`. Elle ajoute généralement `KV_REST_API_URL` et `KV_REST_API_TOKEN` ; les noms Upstash standards sont aussi acceptés. Sans ces variables, les routes refusent les requêtes en production plutôt que d’utiliser un quota local contournable.

## Contrôles qualité

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:a11y
```

Les mêmes vérifications sont exécutées par GitHub Actions à chaque push et pull request. Dependabot regroupe les mises à jour hebdomadaires. Les tests d’accessibilité utilisent Playwright et axe sur toutes les pages pédagogiques, en vues ordinateur et mobile. Des tests éditoriaux vérifient aussi la longueur des résumés, la présence des trois idées à retenir et la simplicité des définitions.

## Déploiement Vercel

1. Importer `AtomCrtr/SolarScope` dans Vercel.
2. Déclarer `NEXT_PUBLIC_SITE_URL`, `NASA_API_KEY`, `GEMINI_API_KEY`, `CRON_SECRET` et l’intégration Upstash Redis pour l’environnement Production.
3. Conserver la branche de production sur `main`.

Chaque push sur `main` déclenche alors automatiquement un nouveau déploiement. `vercel.json` déclare le rafraîchissement planifié des données.

## Architecture

- Next.js 16 App Router, React 19 et TypeScript.
- CSS global/Tailwind CSS 4 et Framer Motion.
- Three.js 0.185, React Three Fiber et Drei.
- Routes serveur sécurisées pour les fournisseurs externes et Gemini.
- Vercel pour l’hébergement, les fonctions et le cron.

Les mentions de source restent affichées dans le pied de page. Consultez aussi la [politique de confidentialité](https://solar-scope.vercel.app/confidentialite).
