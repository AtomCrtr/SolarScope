# Design System: SolarScope
**Projet :** site éducatif sur l'espace (6–12 ans, parents, enseignants), Next.js, FR prioritaire.

## 1. Visual Theme & Atmosphere
« Carnet de bord » de mission spatiale, avec une couche « mission control » ludique : nuit profonde, accents orange soleil, détails de pupitre (LED de statut, coins HUD, chiffres en monospace). Chaleureux et lisible, jamais froid ni militaire. La mascotte Cosmo et l'écriture manuscrite apportent l'humain.

## 2. Color Palette & Roles
- **Nuit profonde (#0b1026)** : fond de page.
- **Carte indigo (#141d42)** : cartes et panneaux ; bordure **Orbite (#2a3566)**.
- **Orange soleil (#ff8a3d)** : action principale, coins HUD, sélection ; **Soleil doux (#ffb27a)** pour les textes d'accent.
- **Bleu étoile (#8ec5ff)** : liens, focus, données secondaires.
- **LED aurore (#5be3a4)** : statut « en direct », réussite.
- **Papier (#fbf6ec)** et **Encre (#1c1b2e)** : surfaces « carnet » et texte dessus.
- Texte : #eef1fa (principal), #a9b3d6 (atténué).

## 3. Typography Rules
- **Fredoka** 500–700 : titres, ronde et amicale.
- **Atkinson Hyperlegible** : texte courant, lisibilité maximale.
- **Caveat** : annotations manuscrites de Cosmo, une par écran au plus.
- **JetBrains Mono** 500–700, chiffres tabulaires : mesures, durées, compteurs, badges (la voix « pupitre »).

## 4. Component Stylings
* **Bouton principal :** orange, angles arrondis (14px), relief « touche » (liseré clair en haut, base rouille), s'enfonce de 2px au clic.
* **Cartes :** grands arrondis (1.25–1.75rem), fond indigo, bordure fine ; coin supérieur droit marqué d'un petit repère orange qui s'allume au survol.
* **Badges :** pilule translucide orange avec LED verte à gauche, texte monospace.
* **Focus :** anneau bleu/orange net de 2–3px, décalé ; sélection de texte orange ; curseur de saisie orange.

## 5. Layout Principles
Conteneur 1280px, gouttières fluides (1rem à 2.5rem), sections aérées, grilles de 4 colonnes qui passent en 1–2 sur mobile. Profondeur : ombres douces décalées, jamais de halo coloré. Les mouvements restent courts et coupés si `prefers-reduced-motion`.
