# Architecture SolarScope

SolarScope utilise l’App Router de Next.js. Les dossiers de `src/app/` correspondent donc aux URLs publiques et ne doivent pas être déplacés sans prévoir de redirection.

## Code applicatif

```text
src/
├── app/                 # Pages, layouts et routes API Next.js
├── components/
│   ├── assistant/       # SolarBot et ses interactions
│   ├── layout/          # Navigation, pied de page, thème et décor global
│   ├── learning/        # Guides, missions, passeport et données pédagogiques
│   └── space/           # Visualisations 2D/3D et tableaux de bord spatiaux
└── lib/
    ├── client/          # État conservé uniquement dans le navigateur
    ├── config/          # Paramètres communs du site et métadonnées
    ├── content/         # Contenus pédagogiques et ressources associées
    ├── data/            # Données astronomiques normalisées
    └── security/        # Validation des requêtes, limitation et sûreté SolarBot
```

## Qualité et opérations

- `tests/unit/` : règles métier et normalisation des données.
- `tests/e2e/` : accessibilité, absence de débordement et garde-fous visuels.
- `scripts/` : contrôles de ressources externes.
- `.github/workflows/` : qualité à chaque push et vérification hebdomadaire des liens.
- `docs/` : décisions de conception et documentation de maintenance.

## Règles de rangement

1. Une nouvelle page reste dans `src/app/<route>/`.
2. Un composant est rangé selon son rôle, pas selon la page qui l’utilise.
3. Une donnée scientifique partagée reste dans `src/lib/data/` ou `src/lib/content/` et doit exposer sa source.
4. Les fichiers générés (`.next/`, `node_modules/`, résultats Playwright) ne sont jamais versionnés.
