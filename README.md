# 🔭 SolarScope

**SolarScope rend le Système solaire et l’exploration spatiale compréhensibles pour les enfants de 8 à 12 ans.**

Chaque parcours part d’une question simple, utilise une comparaison concrète, puis donne trois idées à retenir. Le français est la langue éditoriale de référence ; l’accueil et la navigation disposent aussi d’une entrée en anglais.

🌐 **Site en production :** [solar-scope.vercel.app](https://solar-scope.vercel.app)

## Aperçu

- Parcours sur le Soleil, les planètes, Mars, l’ISS, les missions, Webb, les astéroïdes et bien plus.
- Données spatiales issues de sources scientifiques identifiées : NASA, ESA, NOAA, IPAC et The Space Devs.
- Explications courtes adaptées aux enfants, lecture audio locale et quiz.
- Globe terrestre interactif et expériences 3D construites avec Three.js.
- SolarBot avec réponse de secours locale, protection de la vie privée et limitation des abus.
- Thème clair/sombre, navigation clavier, prise en charge de `prefers-reduced-motion` et métadonnées SEO/PWA.

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
├── components/   Interface, 3D, navigation et SolarBot
└── lib/          Données externes, cache, sécurité et quotas
public/           Textures, images et ressources statiques
tests/unit/       Tests de contenu, données et sécurité
```

Principales briques : Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Three.js, React Three Fiber, Upstash Redis et Vercel.

## Déploiement Vercel

1. Importez `AtomCrtr/SolarScope` dans Vercel.
2. Ajoutez `NEXT_PUBLIC_SITE_URL`, `NASA_API_KEY`, `GEMINI_API_KEY` (facultative) et `CRON_SECRET`.
3. Connectez l’intégration gratuite **Upstash for Redis** au projet : elle crée normalement `KV_REST_API_URL` et `KV_REST_API_TOKEN` pour Production et Preview.
4. Gardez `main` comme branche de production.

Chaque push sur `main` déclenche automatiquement un déploiement. Le cron défini dans `vercel.json` assure le rafraîchissement planifié.

## Pistes d’amélioration

1. Traduire les parcours prioritaires en anglais avec relecture pédagogique, en commençant par Planètes, Mars, ISS et Quiz.
2. Ajouter une vérification planifiée des liens YouTube et des sources externes, avec un rapport ouvrable avant qu’un lien mort soit affiché.
3. Ajouter des tests visuels de l’accueil aux largeurs 1280 px et 1920 px pour éviter le retour d’un titre ou d’un globe mal cadré.
4. Proposer un espace parent/enseignant : objectif de chaque parcours, durée, vocabulaire et prolongements hors écran.
5. Mesurer anonymement les parcours réellement terminés afin d’améliorer les explications les moins comprises, sans collecter de données enfant.

Consultez aussi la [politique de confidentialité](https://solar-scope.vercel.app/confidentialite).
