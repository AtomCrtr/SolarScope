<div align="center">
  <h1>🔭 SolarScope</h1>
  <p><strong>Explore l'Univers avec la NASA — Application web spatiale interactive</strong></p>

  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
  ![Three.js](https://img.shields.io/badge/Three.js-0.183-black?logo=three.js)
  ![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)

  ### 🌐 [solar-scope.vercel.app](https://solar-scope.vercel.app)
</div>

---

## ✨ Fonctionnalités

| Page | Description |
|------|-------------|
| 🌍 **Système Solaire** | Visualiseur 3D interactif des planètes (positions réelles J2000) |
| 🔴 **Mars** | Globe 3D + infos rovers Curiosity & Perseverance |
| ☀️ **Soleil** | Météo spatiale en direct (NOAA), éruptions solaires, indice Kp |
| 🛸 **ISS Tracker** | Position en temps réel de la Station Spatiale + équipage |
| 🔭 **JWST** | Les 6 images iconiques du James Webb Space Telescope |
| 🌠 **Astéroïdes** | Données NASA NeoWs — astéroïdes proches de la Terre |
| 🌌 **Exoplanètes** | Catalogue des planètes au-delà du Système Solaire |
| ☄️ **Météorites** | Base de données NASA des météorites tombées |
| 📸 **Photo du Jour** | APOD — Astronomy Picture of the Day (NASA) |
| 🗞️ **Actualités** | Flux RSS actualités spatiales en temps réel |
| 🎮 **Quiz** | Quiz astronomie 3 niveaux (Débutant → Expert) |
| 🤖 **SolarBot** | Assistant IA propulsé par Google Gemini |

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- **3D** : [Three.js](https://threejs.org) + [@react-three/fiber](https://r3f.docs.pmnd.rs) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Styling** : CSS Modules (design system maison, dark/light mode)
- **IA** : Google Gemini API (`gemini-2.0-flash-lite`) via API Route sécurisée
- **Déploiement** : [Vercel](https://vercel.com)

---

## 🚀 Lancer en local

### Prérequis
- Node.js 18+
- Une clé NASA API (gratuite sur [api.nasa.gov](https://api.nasa.gov))
- Une clé Google Gemini (gratuite sur [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
# Cloner le repo
git clone https://github.com/AtomCrtr/SolarScope.git
cd SolarScope

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec vos clés API

# Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) 🚀

---

## 🔑 Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# NASA API (https://api.nasa.gov)
NASA_API_KEY=your_nasa_api_key

# Google Gemini — côté serveur uniquement (NE PAS préfixer NEXT_PUBLIC_)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📦 Déployer sur Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AtomCrtr/SolarScope)

1. Cliquer le bouton ci-dessus
2. Ajouter `NASA_API_KEY` et `GEMINI_API_KEY` dans les **Environment Variables**
3. Déployer 🎉

---

## 📁 Structure du projet

```
├── src/
│   ├── app/
│   │   ├── api/gemini/     # API Route sécurisée (SolarBot)
│   │   ├── planetes/       # Système Solaire 3D
│   │   ├── mars/           # Globe Mars 3D
│   │   ├── soleil/         # Météo spatiale
│   │   ├── iss/            # ISS Tracker
│   │   ├── jwst/           # James Webb
│   │   ├── asteroides/     # Astéroïdes NASA
│   │   ├── exoplanetes/    # Exoplanètes
│   │   ├── meteorites/     # Météorites
│   │   ├── photo-du-jour/  # APOD NASA
│   │   ├── actualites/     # Actualités spatiales
│   │   ├── quiz/           # Quiz astronomie
│   │   └── solarbot/       # SolarBot IA
│   └── components/
│       ├── Navbar.tsx
│       ├── StarField.tsx
│       ├── Earth3D.tsx
│       ├── Planet3D.tsx
│       ├── Sun3D.tsx
│       ├── ISSGlobe.tsx
│       ├── SolarBotWidget.tsx
│       └── ...
├── public/
├── .env.example
└── next.config.ts
```

---

## 📜 Licence

MIT — Utilise librement, données NASA en Open Data.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/AtomCrtr">AtomCrtr</a> · Données fournies par la <a href="https://api.nasa.gov">NASA</a> & <a href="https://ai.google.dev">Google Gemini</a>
</div>
