# Design QA — accueil « carnet spatial »

## Cible et preuves

- Source visuelle : `C:\Users\feild.LAPTOP-6K4PVO3F\AppData\Local\Temp\codex-clipboard-cc86b563-78f9-4990-a0eb-f0c42151e769.png`
- Implémentation desktop : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-notebook-desktop-production.png`
- Comparaison côte à côte : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-notebook-comparison-production.png`
- Implémentation mobile : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-notebook-mobile-production.png`
- Viewport desktop : 1487 × 1058 CSS px, DPR 1.
- Pixels source et implémentation : 1487 × 1058 px chacune. Aucune normalisation de densité n’a été nécessaire ; les deux vues ont été placées côte à côte à leur taille native.
- Viewport mobile : 393 × 851 CSS px, DPR 1.
- État : accueil FR, thème sombre, parcours `6–12 ans` actif sur desktop et mobile.

## Comparaison

La comparaison plein écran montre la même composition principale que la référence : introduction à gauche, choix d’âge centré, grand carnet de mission, quatre parcours illustrés, passeport latéral et bandeau d’observation. Les tailles des régions, leurs alignements et leur ordre de lecture sont désormais cohérents avec la cible.

Une comparaison focalisée supplémentaire n’était pas nécessaire : à 1487 × 1058 px, le titre, les contrôles, le contenu du carnet, les cartes et le passeport sont tous lisibles dans la vue combinée.

## Findings

- Aucun écart P0, P1 ou P2 ne reste actionnable.
- [P3 accepté] La référence ajoute Saturne et deux annotations manuscrites décoratives sur la droite. Leur absence ne change ni la hiérarchie, ni la compréhension, ni les interactions.
- [P3 accepté] L’en-tête conserve les commandes réelles FR/EN et thème du produit au lieu du bouton de connexion fictif de la référence.
- [P3 accepté] Les tranches d’âge sont `6–12 ans` et `12+ ans`, conformément au public demandé, au lieu de `8–10 ans` et `10–12 ans` dans la référence.

## Surfaces de fidélité

- **Typographie** : association d’une écriture manuscrite pour les notes et le carnet avec une fonte ronde, très lisible, pour les titres et contrôles. Aucun titre n’est tronqué.
- **Rythme et mise en page** : les grandes régions suivent la grille et la hauteur du premier écran de la référence ; les cartes, le passeport et le bandeau restent visibles sans superposition.
- **Couleurs** : fond bleu nuit, accents violet/rose, contrastes blancs et gris bleuté conformes à la direction artistique de la cible.
- **Images** : six ressources « carnet spatial » dédiées ont été générées, optimisées en WebP et utilisées avec un cadrage cohérent. Les photos spatiales restent nettes et les éléments décoratifs ne sont pas recréés avec de faux SVG ou des formes CSS.
- **Contenu** : français prioritaire, mission enfant compréhensible, quatre vrais parcours et progression locale reliée au passeport.

## Historique des itérations

1. [P1 résolu] La première version reprenait la structure mais restait visuellement trop éloignée de la référence.
   - Correction : remplacement par une composition complète « carnet spatial », ajout des six ressources dédiées et refonte de la grille.
   - Preuve post-fix : `solarscope-home-notebook-comparison-production.png`.
2. [P2 résolu] La première comparaison côte à côte plaçait le carnet et les cartes environ 120 px trop bas, ce qui masquait le bandeau inférieur.
   - Correction : suppression de la marge supérieure excessive, recalibrage du padding de la grille et de la position du passeport.
   - Preuve post-fix : les cartes commencent au même niveau que la cible et le bandeau est visible dans la capture finale.
3. [P2 résolu] Après ce recalage, l’introduction de gauche était environ 48 px trop haute.
   - Correction : décalage visuel via `top`, compatible avec l’animation Framer Motion qui définit sa propre propriété `transform`.
   - Preuve post-fix : la note, le titre et le carnet décoratif de gauche sont alignés avec la référence dans la comparaison finale.

## Interactions et contrôles

- Quatre cartes de parcours sont rendues.
- La bascule `12+ ans` change réellement la mission et reste active après rechargement.
- À 320 px, largeur du document = largeur du viewport (320 px) : aucun débordement horizontal.
- Build de production contrôlé dans un navigateur réel, sans overlay Next.js.
- Aucune erreur de console ni exception JavaScript. Les deux requêtes `/api/dashboard` annulées correspondent aux rechargements volontaires du test.

## Checklist

- [x] Reproduire la composition principale de la référence.
- [x] Conserver les parcours `6–12 ans` et `12+ ans`.
- [x] Relier les CTA aux vraies pages du site.
- [x] Préserver le passeport et la progression locale.
- [x] Vérifier desktop, mobile, persistance et absence de débordement.
- [x] Valider lint, TypeScript, tests unitaires et build de production.

**Final result: passed**
