# Design QA — accueil « carnet spatial »

## Cible et preuves

- Source visuelle principale : `C:\Users\FEILD~1.LAP\AppData\Local\Temp\codex-clipboard-cc86b563-78f9-4990-a0eb-f0c42151e769.png`
- Signalement utilisateur avant correction : `C:\Users\FEILD~1.LAP\AppData\Local\Temp\codex-clipboard-ddce478b-f9cb-49e0-adfa-e4f9f81c2d10.png`
- Implémentation desktop finale : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-navbar-text-desktop-final.png`
- Comparaison avec la cible : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-navbar-text-target-comparison.png`
- Validation grande largeur : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-navbar-text-wide-final.png`
- Comparaison avant/après grande largeur : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-navbar-text-before-after.png`
- Validation mobile : `C:\Users\feild.LAPTOP-6K4PVO3F\.codex\visualizations\2026\07\21\019f8618-38b1-7cb3-a318-1cee136d59b3\solarscope-home-navbar-text-mobile-final.png`
- Viewports : 1487 × 1058, 2048 × 1174, 1280 × 900, 393 × 851 et 320 × 700 CSS px ; DPR 1 pour les captures finales.
- La cible et la capture desktop finale mesurent chacune 1487 × 1058 px. Elles ont été comparées à leur taille native, sans normalisation de densité.
- État : accueil FR, thème sombre, parcours `6–12 ans`.

## Findings

- [P1 résolu] La navigation principale avait été masquée sur l’accueil.
  - Preuve : la capture utilisateur ne montrait que le logo et les commandes FR/EN/thème.
  - Correction : suppression des trois règles spécifiques qui rendaient la barre transparente, étendaient son conteneur et forçaient `.site-desktop-nav` à `display: none`.
  - Résultat : Accueil, Système Solaire, Exploration, Observation et Découverte sont de nouveau visibles ; les menus déroulants fonctionnent.

- [P2 résolu] Le titre de gauche passait sur trois lignes à grande largeur.
  - Preuve : `et décolle` et `pour l’espace.` apparaissaient sur deux lignes distinctes dans la capture utilisateur.
  - Correction : plafond typographique ramené à `2.55rem`, sans modifier la taille aux viewports plus étroits.
  - Résultat : le titre tient sur deux lignes à 1487 px et 2048 px ; sa deuxième ligne mesure une seule hauteur de ligne.

- [P2 résolu] Le paragraphe de la mission s’approchait trop de la photo et de la spirale.
  - Correction : largeur maximale réduite de 305 px à 250 px.
  - Résultat : le texte reste entièrement dans la colonne gauche du carnet.

- [P3 accepté] La barre de navigation complète diffère de la maquette initiale, qui utilisait un simple bouton de connexion. Cette différence est volontaire et demandée par l’utilisateur afin de préserver l’accès aux pages du site.
- [P3 accepté] Les tranches d’âge restent `6–12 ans` et `12+ ans`, conformément au public demandé.

## Surfaces de fidélité

- **Typographie** : titre sur deux lignes, notes manuscrites conservées, aucun texte tronqué ou superposé.
- **Rythme et mise en page** : introduction, carnet, cartes et passeport restent alignés ; la navigation n’écrase pas le contenu.
- **Couleurs** : fond spatial sombre, accents violets et contrastes inchangés.
- **Images** : les ressources WebP dédiées restent nettes et correctement cadrées.
- **Contenu** : français prioritaire, mission enfant compréhensible, navigation vers les vraies pages conservée.

## Interactions et contrôles

- Menu déroulant `Système Solaire` ouvert au survol ; lien `Planètes` visible.
- Navigation desktop visible à 2048, 1487 et 1280 px.
- Menu mobile ouvrable ; le lien `Accueil` est visible dans le panneau.
- Bascule `12+ ans` fonctionnelle.
- Aucun débordement horizontal à 2048, 1280 et 320 px.
- Aucune erreur de console ni exception JavaScript dans le build de production.
- Lint, TypeScript, 23 tests unitaires et build Next.js validés.

## Historique des itérations

1. [P1] Refonte initiale structurellement correcte mais trop éloignée de la maquette.
   - Correction : composition complète « carnet spatial » et six ressources visuelles dédiées.
2. [P2] Contenu principal environ 120 px trop bas.
   - Correction : recalibrage de la grille et de ses espacements.
3. [P2] Introduction environ 48 px trop haute après le recalibrage.
   - Correction : positionnement via `top`, compatible avec Framer Motion.
4. [P1/P2] Navigation supprimée et titre sur trois lignes à grande largeur.
   - Correction : restauration de la barre complète, plafond typographique corrigé et paragraphe du carnet resserré.
   - Preuve post-fix : captures desktop, grande largeur et comparaison avant/après listées ci-dessus.

## Checklist

- [x] Restaurer la barre avec toutes les pages.
- [x] Vérifier les menus déroulants desktop et le menu mobile.
- [x] Replacer le titre sur deux lignes.
- [x] Éviter le chevauchement du texte de mission.
- [x] Vérifier desktop, grande largeur, tablette et mobile.
- [x] Valider tous les contrôles techniques.

**Final result: passed**
