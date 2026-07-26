# Apprentissage et données scientifiques

## Une séquence courte pour les enfants

SolarScope vise en priorité les 8–12 ans francophones. Chaque nouvelle activité doit pouvoir se comprendre selon cette progression :

1. une question ou une observation facile à formuler ;
2. une seule idée expliquée avec des mots simples ;
3. un geste, une comparaison ou un mini-défi qui permet de vérifier ce que l’enfant a compris.

Une mission express dure environ cinq minutes. Elle peut être utilisée à l’école, en famille ou de manière autonome. Les détails scientifiques viennent après l’idée principale et ne sont jamais indispensables pour réussir le défi.

## Explorer les planètes

L’explorateur de `/planetes` propose les huit planètes, pas une simulation à l’échelle. Il faut annoncer clairement les simplifications : les tailles et les distances servent à comparer, pas à mesurer. Le modèle est utilisable au toucher, à la souris et au clavier ; `Home` le remet à sa position de départ.

## Provenir des sources, sans faire semblant

Le registre `src/lib/data/source-registry.ts` classe chaque source :

- `reference` pour un fait stable ou une fiche scientifique vérifiée ;
- `live` pour une mesure ou une information qui varie dans le temps.

Chaque source affichable comporte une URL, une date de vérification et une note formulée pour les enfants. Les sources sont visibles sur `/sources`, ainsi que dans les pages qui utilisent une donnée clé.

Ne jamais :

- présenter une donnée dynamique comme un fait permanent ;
- masquer une erreur de flux sous un chiffre inventé ;
- écrire un nombre de lunes sans rappeler qu’il peut être révisé.

## Relecture recommandée

Avant une publication majeure :

1. vérifier les liens de sources et les vidéos ;
2. contrôler les textes avec un enfant et un adulte ;
3. tester le clavier, un mobile de 390 px et `prefers-reduced-motion` ;
4. ne traduire vers l’anglais qu’après validation de la version française destinée aux enfants.
