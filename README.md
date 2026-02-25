# 🔭 SolarScope

> **Application interactive pour explorer l'espace**, construite avec Streamlit et des données réelles de la NASA et d'une base PostgreSQL hébergée sur Railway.

🎯 **Conçu pour les enfants** — langage simple, visuels immersifs, quiz et anecdotes !

---

## 🌌 Pages de l'application

Organisées comme un **voyage de découverte** — du Soleil jusqu'aux confins de l'Univers :

| Page | Description |
|------|-------------|
| 🏠 **Accueil** | KPIs en direct, alertes astéroïdes/solaires, SolarBot IA |
| ☀️ **Le Soleil** | Images SDO en direct, éruptions solaires, vidéos éducatives |
| 🪐 **Les Planètes** | Fiches détaillées, graphiques, données lunaires |
| 🔴 **Mars** | Galerie des rovers Curiosity & Perseverance |
| ☄️ **Astéroïdes** | Filtres interactifs, KPIs, carte des astéroïdes dangereux |
| 🌍 **Catastrophes Naturelles** | Globe 3D, timeline des événements EONET |
| 🌠 **Photo du Jour** | Image astronomique du jour (NASA APOD) |
| 🌟 **Exoplanètes** | Catalogue et analyse des exoplanètes confirmées |
| 🚀 **Missions Spatiales** | Timeline de Spoutnik à Artemis |
| 📰 **Actualités** | Flux RSS de sources françaises (Science & Vie, Le Monde...) |
| 🎮 **Coin des Curieux** | Quiz interactif, vidéos, anecdotes, histoires IA |

---

## 🛠️ Technologies

- **Frontend** : Streamlit, Plotly, Pydeck
- **Backend** : Python 3.11+, PostgreSQL (Railway)
- **IA** : Google Gemini (SolarBot, histoires spatiales)
- **APIs** : NASA (APOD, NeoWs, EONET, Mars Rover, Exoplanets), NOAA, SDO, RSS

---

## 🚀 Lancer en local

```bash
# 1. Cloner le repo
git clone https://github.com/AtomCrtr/SolarScope.git
cd SolarScope

# 2. Créer un environnement virtuel
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Configurer les secrets
copy .env.example .env
# Remplir .env avec tes propres valeurs

# 5. Lancer l'app
streamlit run app.py
```

---

## ☁️ Déploiement Streamlit Cloud

1. Aller sur [share.streamlit.io](https://share.streamlit.io)
2. Connecter ton compte GitHub
3. Sélectionner le repo `AtomCrtr/SolarScope`, branche `main`, fichier `app.py`
4. Dans **Settings → Secrets**, coller :

```toml
DB_NAME = "..."
DB_USER = "..."
DB_PASSWORD = "..."
DB_HOST = "..."
DB_PORT = "5432"
NASA_API_KEY = "..."
GEMINI_API_KEY = "..."
```

---

## 📁 Structure du projet

```
SolarScope/
├── app.py                  # Point d'entrée Streamlit
├── config.py               # Chargement des secrets
├── database.py             # Connexion PostgreSQL
├── gemini_ai.py            # Intégration Google Gemini
├── styles.css              # Design CSS (dark mode)
├── requirements.txt        # Dépendances Python
├── .env.example            # Template de configuration
├── views/                  # Pages (1 fichier = 1 page)
│   ├── accueil.py
│   ├── evenements_solaires.py
│   ├── planetes.py
│   ├── mars_photos.py
│   ├── asteroides.py
│   ├── evenements_naturels.py
│   ├── apod.py
│   ├── exoplanetes.py
│   ├── missions.py
│   ├── actualites.py
│   └── coin_curieux.py
└── ingestion/              # Pipelines de données NASA
    ├── run_all.py
    ├── apod.py
    ├── asteroids.py
    ├── mars.py
    ├── eonet.py
    └── exoplanets.py
```

---

## 📡 Sources de données

| Source | Données |
|--------|---------|
| [NASA APOD](https://api.nasa.gov/) | Image du jour |
| [NASA NeoWs](https://api.nasa.gov/) | Astéroïdes proches |
| [NASA EONET](https://eonet.gsfc.nasa.gov/) | Événements naturels |
| [NASA Mars Rover](https://api.nasa.gov/) | Photos martiennes |
| [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/) | Exoplanètes |
| [NOAA SWPC](https://www.swpc.noaa.gov/) | Météo spatiale |
| [SDO NASA](https://sdo.gsfc.nasa.gov/) | Images solaires en direct |
| [Science & Vie RSS](https://www.science-et-vie.com/feed) | Actualités FR |
| [Google Gemini](https://ai.google.dev/) | IA SolarBot |

---

## 👥 Auteurs

Projet réalisé dans le cadre de la **Wild Code School 2025** — Data Analyst.
