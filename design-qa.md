# Design QA — accueil parcours par âge

## Cible de comparaison

- Source visuelle : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\generated_images\019f8618-38b1-7cb3-a318-1cee136d59b3\exec-69c86a93-38c6-4136-bf6f-3c840113a7d5.png`
- Implémentation desktop : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-redesign-desktop.png`
- Comparaison côte à côte : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-design-qa-comparison.png`
- Implémentation mobile : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-redesign-mobile.png`
- Viewport desktop : 1440 × 1024 CSS px, DPR 1 ; les deux vues ont été normalisées à 1440 × 1024 px avant comparaison.
- Viewport mobile : 393 × 851 CSS px, DPR 1 ; état `12+ ans` actif.

## État et interactions vérifiés

- Accueil FR, thème sombre, données de démonstration du tableau de bord.
- Bascule `6–12 ans` / `12+ ans`, mission mise en avant, cartes de parcours, passeport local.
- Le choix `12+ ans` survit à un rechargement de page.
- Mobile : largeur de contenu 393 px pour une largeur de viewport de 393 px (aucun débordement horizontal).

## Findings

- [P1 résolu] Le titre de l’introduction était tronqué sur grand écran.
  - Evidence : la première capture rendue coupait les fins de lignes à cause du `white-space: nowrap` hérité.
  - Fix : la règle spécifique à `.home-launchpad-copy .home-title span` autorise désormais le retour à la ligne ; la taille du titre est calibrée pour la colonne de gauche.
  - Preuve post-fix : capture desktop et comparaison côte à côte ci-dessus ; toutes les lignes sont lisibles.

- [Accepté] La cible illustre un carnet dessiné avec spirale, autocollants et typographie manuscrite. L’implémentation conserve son principe — choix d’âge, mission du jour, parcours et passeport visibles en une vue — dans le système visuel SolarScope existant et avec les vraies images déjà fournies par le projet. Ce n’est pas un écart actionnable : reproduire les ornements de la maquette avec du CSS ou des faux visuels dégraderait la qualité des ressources.

## Surfaces de fidélité

- **Typographie** : hiérarchie forte et lisible, avec Outfit cohérent avec SolarScope ; les retours à la ligne sont contrôlés sur desktop et mobile.
- **Rythme et mise en page** : une zone de lancement en deux colonnes, une carte de mission centrale, les parcours et la progression restent visibles au premier écran desktop. La pile mobile garde une lecture verticale sans débordement.
- **Couleurs** : fond spatial sombre, violet comme couleur d’action, contrastes clairs pour les CTA et les informations de progression.
- **Images** : Mars, Saturne, Lune, Terre et Perseverance sont des images réelles déjà versionnées dans le produit, recadrées avec `object-fit: cover`.
- **Contenu** : le français est la langue principale ; les libellés distinguent clairement `6–12 ans` et `12+ ans` et les missions changent réellement avec le choix.

## Checklist d’implémentation

- [x] Ajouter les deux parcours d’âge persistants.
- [x] Associer une mission et des parcours concrets à chaque âge.
- [x] Relier la progression au passeport local existant.
- [x] Corriger le titre tronqué desktop.
- [x] Vérifier l’absence de débordement mobile et la persistance du choix.

## Follow-up polish

- [P3] Si une future direction artistique illustrée est retenue, commander ou générer un jeu complet d’assets « carnet spatial » cohérent plutôt que de mélanger des éléments dessinés isolés.

**Final result: passed**
