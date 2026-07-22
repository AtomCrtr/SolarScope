# 🔭 SolarScope

SolarScope est un observatoire spatial pédagogique en français : visualisations 3D, suivi de l’ISS, météo solaire, objets proches de la Terre, missions et publications scientifiques.

Production : [solar-scope.vercel.app](https://solar-scope.vercel.app)

## Fonctionnalités

- Système solaire et rovers en 3D avec Three.js.
- ISS, équipages et prochains lancements.
- Activité solaire NOAA, images NASA SDO/SOHO et indice Kp.
- Astéroïdes NeoWs, exoplanètes, APOD et actualités NASA.
- Galerie JWST, archive pédagogique des météorites et quiz.
- SolarBot avec Gemini 2.5 Flash Lite, limitation de débit et réponses locales de secours.
- Métadonnées par page, Open Graph, sitemap, robots et manifeste PWA.
- Mode clair/sombre, navigation clavier et prise en charge de `prefers-reduced-motion`.

## Sources et fraîcheur des données

Les routes serveur valident les réponses externes et conservent la dernière réponse en cache pendant une durée adaptée :

| Données | Source | Cache |
|---|---|---:|
| Tableau de bord et équipages | NASA/IPAC, NASA NeoWs, People in Space | 15 à 60 min |
| Lancements | The Space Devs | 15 min |
| Actualités | Flux RSS NASA | 30 min |
| Astéroïdes et éruptions | NASA NeoWs / DONKI | 60 min |
| Photo du jour | NASA APOD | 60 min |

Les caches se renouvellent à la demande. Un cron Vercel quotidien appelle aussi `/api/refresh` afin de préchauffer les sources même sans visite. `/api/health` expose leur état sans révéler de secret. La page Météorites utilise un échantillon embarqué de l’ancienne archive NASA et l’indique explicitement.

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
CRON_SECRET=
```

`NASA_API_KEY=DEMO_KEY` convient au développement avec un quota réduit. Sans clé Gemini, SolarBot reste fonctionnel avec ses réponses éducatives locales. `CRON_SECRET` doit être une valeur longue et aléatoire ; Vercel l’envoie automatiquement au cron dans l’en-tête `Authorization`.

## Contrôles qualité

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:a11y
```

Les mêmes vérifications sont exécutées par GitHub Actions à chaque push et pull request. Dependabot regroupe les mises à jour hebdomadaires. Les tests d’accessibilité utilisent Playwright et axe sur des vues ordinateur et mobile.

## Déploiement Vercel

1. Importer `AtomCrtr/SolarScope` dans Vercel.
2. Déclarer `NEXT_PUBLIC_SITE_URL`, `NASA_API_KEY`, `GEMINI_API_KEY` et `CRON_SECRET` pour l’environnement Production.
3. Conserver la branche de production sur `main`.

Chaque push sur `main` déclenche alors automatiquement un nouveau déploiement. `vercel.json` déclare le rafraîchissement planifié des données.

## Architecture

- Next.js 16 App Router, React 19 et TypeScript.
- CSS global/Tailwind CSS 4 et Framer Motion.
- Three.js 0.185, React Three Fiber et Drei.
- Routes serveur sécurisées pour les fournisseurs externes et Gemini.
- Vercel pour l’hébergement, les fonctions et le cron.

Les mentions de source restent affichées dans le pied de page. Consultez aussi la [politique de confidentialité](https://solar-scope.vercel.app/confidentialite).
