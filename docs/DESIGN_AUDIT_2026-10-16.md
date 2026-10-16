# Audit design — 16 octobre 2026

Méthode : captures réelles (Chromium, 1440 × 900 et 390 × 844), axe-core WCAG 2.1 A/AA sur 9 pages en bureau et mobile, mesure des tailles de texte et des cibles tactiles, lecture des critères `design:design-critique` et `design:accessibility-review`.

## Résultats

- **axe-core : 0 violation** sur les 18 vues contrôlées, aucun débordement horizontal.
- Points solides : hiérarchie claire de l'accueil, mascotte et illustrations cohérentes, contraste élevé du thème sombre, barre d'onglets mobile lisible, source des données toujours visible.

## Corrigé

### P1 — Texte trop petit pour un public de 6 à 12 ans

Environ 200 déclarations descendaient à 8–11,5 px (fil d’Ariane, pied de page, étiquettes de statistiques, frise de Mars, puces, légendes).

**Correction :** plancher de `0.75rem` (12 px) pour tous les textes en `rem`. Les étiquettes internes des schémas SVG gardent l’échelle de leur `viewBox`.

### P1 — Carte du ciel indisponible tant que la permission de position reste sans réponse

Le délai de `getCurrentPosition` ne démarre qu’après la réponse à la demande de permission. Un enfant qui ignorait la demande ne voyait jamais le lien vers Stellarium.

**Correction :** après 4 s, la page propose Paris par défaut. La vraie position la remplace si elle arrive ensuite.

### P2 — Titre de l’accueil trop grand sur téléphone

52 px sur 390 px de large : quatre lignes, sélecteur d’âge et mission du jour repoussés sous la ligne de flottaison.

**Correction :** environ 37 px, soit deux lignes.

### P2 — Bouton de menu mobile de 36 × 36 px

**Correction :** 44 × 44 px (WCAG 2.5.5).

## Restant

- Navigation desktop à 33–34 px de haut : suffisant au pointeur (critère AA 2.5.8 : 24 px), à surveiller sur tablette.
- Étiquettes des schémas SVG de `/planetes` (7,7–10 px à l’échelle) : à revoir avec les schémas eux-mêmes.
