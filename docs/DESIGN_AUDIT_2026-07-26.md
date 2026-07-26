# Audit design — 26 juillet 2026

## Parcours contrôlés

1. Accueil desktop, 1600 × 900 : hiérarchie du héros, passage vers les missions et visibilité du modèle Terre.
2. Planètes mobile, Pixel 5 : lecture d’une leçon, actions d’aide et superpositions.
3. Parents et enseignants desktop : navigation, cartes de mission et actions.

Les captures de référence ont été enregistrées localement dans `C:\tmp` pendant l’audit. La capture Playwright des cartes Parents est aussi conservée par la CI après chaque exécution.

## Constats et corrections

### P1 — Le début de la section suivante semblait tronqué sur l’accueil

Le héros avait une hauteur maximale de 720 px, même sur un grand écran. Le titre « Choisis ta première mission » apparaissait partiellement en bas de la première vue.

**Correction :** le héros utilise maintenant toute la hauteur disponible du viewport desktop, sans faire apparaître un titre incomplet sous les actions.

### P1 — Le fil d’Ariane chevauchait la navigation fixe

Sur les pages internes, le fil d’Ariane se plaçait visuellement dans la barre de navigation.

**Correction :** il fait désormais partie du contenu principal, sous la barre fixe.

### P1 — SolarBot couvrait le texte des leçons sur mobile

La bulle d’invitation et le bouton flottant masquaient une zone de lecture importante.

**Correction :** sur écran étroit, l’invitation est masquée et le bouton devient plus compact, avec une marge qui respecte les zones sûres du téléphone.

### P2 — Le décor étoilé réduisait légèrement la concentration dans les leçons mobiles

**Correction :** le panneau pédagogique mobile possède maintenant un fond opaque, tout en conservant le décor spatial autour de lui.

## Points solides

- L’accueil a une hiérarchie claire : promesse, action principale, action secondaire et source des données.
- Les pages pédagogiques proposent une version 6–8 ans, l’écoute et des contenus progressifs.
- Les cartes Parents relient maintenant directement à une mission.

## Vérification après correction

- Les 48 scénarios Playwright (ordinateur et mobile) passent : accessibilité automatisée, débordement horizontal, cartes Parents et données KPI.
- Les liens intégrés aux sources sont maintenant soulignés et suffisamment distincts du texte courant.
- La vérification visuelle finale reste à compléter sur appareils réels, notamment avec des enfants de 6 à 8 ans.

## Suite recommandée

- Ajouter de vraies références visuelles Playwright (`toHaveScreenshot`) après validation d’un jeu de captures de référence.
- Tester le parcours mobile avec un enfant et un adulte : compréhension du mode 6–8 ans, emplacement de SolarBot et libellés des actions.
- Garder les descriptions courtes dans les cartes afin de préserver le rythme de lecture.
