import streamlit as st
import psycopg2
import pandas as pd
import os
import json
import wikipedia
from wikipedia.exceptions import PageError, DisambiguationError
import requests
import matplotlib.pyplot as plt


st.set_page_config(
    page_title="SolarScope - Explorer l'espace",
    page_icon="🪐",
    layout="wide",
    menu_items={
        "Get Help": "https://api.nasa.gov",
        "About": "SolarScope - Projet Data Analyst | Wild Code School 2025",
    },
)


@st.cache_resource
def get_conn():
    return psycopg2.connect(
        dbname="railway",
        user="postgres",
        password="AqwOUHRNNZxqCCgypHBKaORDqLNiKeEc",
        host="autorack.proxy.rlwy.net",
        port="39282",
    )


conn = get_conn()

st.markdown(
    """
    <style>
        .stApp {
            background-color: #eef3fa;
        }
        .centered {
            text-align: center;
        }
        .title-style {
            font-size: 38px;
            font-weight: bold;
            color: #1b4f72;
        }
        .subtitle {
            font-size: 20px;
            color: #3d3d3d;
            margin-bottom: 1rem;
        }
        .card {
            background-color: white;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }
        .dataframe-wrapper {
            display: flex;
            justify-content: center;
        }
    </style>
""",
    unsafe_allow_html=True,
)


from streamlit_option_menu import option_menu

with st.sidebar:
    page = option_menu(
        "Menu",
        [
            "Accueil",
            "Planètes et Lunes",
            "Images APOD",
            "Astéroïdes",
            "Événements Naturels",
            "Exoplanètes",
            "Photos de Mars",
            "Événements Solaires",
            "Actualités Spatiales",
            "Coin des Curieux",
        ],
        icons=[
            "house",
            "rocket",
            "image",
            "cloud-lightning",
            "globe",
            "star",
            "camera",
            "sun",
            "newspaper",
            "book",
        ],
        menu_icon="cast",
        default_index=0,
        styles={
            "container": {"padding": "5px", "background-color": "#f8f9fa"},
            "icon": {"color": "#6c757d", "font-size": "20px"},
            "nav-link": {
                "font-size": "16px",
                "text-align": "left",
                "margin": "5px",
                "--hover-color": "#eee",
            },
            "nav-link-selected": {"background-color": "#ff6961", "color": "white"},
        },
    )


### ACCUEIL
if page == "Accueil":
    st.markdown(
        """
        <div class='centered'>
            <h1 class='title-style'>🚀 Bienvenue dans SolarScope</h1>
            <p class='subtitle'>Tableau de bord interactif basé sur les données spatiales de la NASA</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # 🔹 Ligne des cartes
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(
            """
            <div class='card'>
                <h3>🌌 Exploration visuelle</h3>
                <p>Images APOD, photos martiennes, visualisation d'astéroïdes.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col2:
        st.markdown(
            """
            <div class='card'>
                <h3>📡 Données en direct</h3>
                <p>Événements solaires et naturels issus des APIs officielles.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col3:
        st.markdown(
            """
            <div class='card'>
                <h3>🗂️ Analyse scientifique</h3>
                <p>Études sur les exoplanètes et météorites potentiellement dangereuses.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # 🔹 Zone d’alerte & chatbot en dessous, centrée
    st.markdown("---")
    st.markdown("<div class='centered'>", unsafe_allow_html=True)

    # 🤖 Chatbot d'explication simplifiée (centré aussi)
    st.markdown("<div class='centered'>", unsafe_allow_html=True)
    with st.expander("🧠 Aide IA - Résumé scientifique (Wikipedia)"):

        choix = st.text_input(
            "Entrez un nom d'objet ou un phénomène astronomique :", "Soleil"
        )

        if st.button("Expliquer simplement"):

            query = choix.strip().capitalize()
            url = f"https://fr.wikipedia.org/api/rest_v1/page/summary/{query.replace(' ', '_')}"

            response = requests.get(url)

            if response.status_code == 200:
                data = response.json()
                st.success(data.get("extract", "Résumé non disponible."))
                if "content_urls" in data and "desktop" in data["content_urls"]:
                    st.markdown(
                        f"🔗 [En savoir plus]({data['content_urls']['desktop']['page']})"
                    )
            else:
                st.error("❌ Aucun résumé trouvé. Essayez un autre terme.")
                st.markdown("</div>", unsafe_allow_html=True)

    # 🔔 Alerte temps réel
    asteroid_alert = pd.read_sql(
        "SELECT * FROM asteroids WHERE is_potentially_hazardous = true", conn
    )
    event_alert = pd.read_sql(
        "SELECT * FROM events WHERE details ILIKE '%strong%' OR details ILIKE '%X-class%'",
        conn,
    )

    if not asteroid_alert.empty:
        st.error("🚨 Alerte : Astéroïde potentiellement dangereux détecté !")

    if not event_alert.empty:
        st.warning("⚠️ Météo spatiale : événement solaire extrême en cours !")

    st.markdown("</div>", unsafe_allow_html=True)


# --- Page Planètes et Lunes ---
elif page == "Planètes et Lunes":
    st.markdown("<h2>🪐 Planètes et leurs Lunes</h2>", unsafe_allow_html=True)

    df_planets = pd.read_sql("SELECT * FROM planets ORDER BY id", conn)
    df_moons = pd.read_sql("SELECT * FROM moons", conn)

    planet_names = df_planets["nom"].tolist()
    selected_planet = st.selectbox("Choisissez une planète :", planet_names)

    planet_data = df_planets[df_planets["nom"] == selected_planet].iloc[0]
    planet_id = planet_data["id"]

    # --- Texte vulgarisé pour tous les publics ---
    texte_explication_detaille = f"""
    La planète **{planet_data['nom']}**, connue internationalement sous le nom **{planet_data['nom_anglais']}**, fait partie de notre **Système solaire**. 
    C'est une **{planet_data['type_corps'].lower()}** qui gravite autour du **{planet_data['autour_de']}**, avec une orbite de forme légèrement ovale, appelée **ellipse**.

    🌞 **Distance au Soleil** : En moyenne, {planet_data['nom']} se situe à environ **{planet_data['axe_semi_majeur']:,} km** du Soleil. Lorsqu’elle est la plus proche, elle atteint **{planet_data['perihelie']:,} km**, et lorsqu’elle est la plus éloignée, elle s’éloigne jusqu’à **{planet_data['afelie']:,} km**.

    🌀 **Caractéristiques orbitales** :
    - **Excentricité** : {planet_data['excentricite']} (indique combien l’orbite est allongée).
    - **Inclinaison orbitale** : {planet_data['inclinaison']}°, ce qui influence la façon dont la planète tourne autour du Soleil.
    - **Inclinaison axiale** : {planet_data['inclinaison_axiale']}°, ce qui cause les saisons plus ou moins marquées.

    🌍 **Structure physique** :
    - **Densité** : {planet_data['densite']} g/cm³, ce qui nous renseigne sur sa composition interne.
    - **Gravité** : {planet_data['gravite']} m/s², ce qui détermine le poids des objets à sa surface.
    - **Rayons** : Moyenne : {planet_data['rayon_moyen']} km | Équatorial : {planet_data['rayon_equatorial']} km | Polaire : {planet_data['rayon_polaire']} km.
    - **Aplatissement** : {planet_data['aplatissement']} (différence entre l’équateur et les pôles).

    ⚖️ **Masse et volume** :
    - Sa masse est estimée à **{planet_data['masse_kg']:.2e} kg**, et son volume est d’environ **{planet_data['volume_m3']:.2e} m³**.

    🔥 **Climat et température** :
    - La température moyenne enregistrée est de **{planet_data['temperature_moyenne']} °C**, ce qui peut varier selon la position dans l’orbite.

    🚀 **Dynamique** :
    - La vitesse d’échappement (vitesse nécessaire pour quitter sa gravité) est de **{planet_data['vitesse_echappement']} m/s**.

    🌙 **Lunes** :
    - Cette planète possède **{planet_data['nombre_lunes']} lune(s)** connue(s), que nous allons explorer ci-dessous.

    🕵️‍♂️ **Découverte** :
    - Elle a été découverte par **{planet_data['decouverte_par'] or 'un astronome inconnu'}**, en **{planet_data['date_decouverte']}**, et elle porte aussi parfois le nom alternatif : **{planet_data['nom_alternatif'] or 'N/A'}**.
    """

    st.markdown(texte_explication_detaille)
    st.markdown("---")

    # --- Graphique ---
    st.markdown("### 📊 Nombre de lunes par planète")
    fig, ax = plt.subplots(figsize=(6, 3))  # Plus petit
    ax.bar(df_planets["nom"], df_planets["nombre_lunes"], color="skyblue")
    ax.set_xlabel("Planètes")
    ax.set_ylabel("Nombre de lunes")
    ax.set_title("Comparaison du nombre de lunes")
    st.pyplot(fig)

    st.markdown("---")

    # --- Lunes détaillées ---
    planet_moons = df_moons[df_moons["planet_id"] == planet_id]

    if not planet_moons.empty:
        st.write(f"🌙 Lunes connues : {len(planet_moons)}")
        for _, lune in planet_moons.iterrows():
            try:
                response = requests.get(lune["rel_url"])
                if response.status_code == 200:
                    lune_data = response.json()
                    st.markdown(
                        f"### 🌙 {lune_data['englishName']} ({lune_data['name']})"
                    )
                    st.write(
                        f"Distance moyenne à la planète : {lune_data.get('semimajorAxis', 'N/A')} km"
                    )
                    st.write(f"Gravité : {lune_data.get('gravity', 'N/A')} m/s²")
                    st.write(f"Rayon moyen : {lune_data.get('meanRadius', 'N/A')} km")
                    st.write(f"Densité : {lune_data.get('density', 'N/A')} g/cm³")
                    # Lien Wikipédia
                    st.markdown(
                        f"[🔗 Lien Wikipédia](https://fr.wikipedia.org/wiki/{lune_data['englishName'].replace(' ', '_')})"
                    )
                    st.markdown("---")
                else:
                    st.warning(f"Impossible de récupérer les données de {lune['nom']}.")
            except Exception as e:
                st.error(f"Erreur : {str(e)}")
    else:
        st.info("Cette planète n'a pas de lune connue.")


### 2EME PAGE
elif page == "Images APOD":
    st.markdown(
        "<h2 class='title-style'>📷 Astronomy Picture of the Day (APOD)</h2>",
        unsafe_allow_html=True,
    )
    query = "SELECT * FROM media ORDER BY date DESC LIMIT 10"
    df = pd.read_sql(query, conn)
    for _, row in df.iterrows():
        st.subheader(f"{row['title']} - {row['date']}")
        st.image(row["url"], use_column_width=True)
        st.markdown(f"{row['description']}")
        st.markdown("---")

### 3EME PAGE
elif page == "Astéroïdes":
    st.markdown(
        "<h2 class='title-style'>☄️ Astéroïdes proches de la Terre</h2>",
        unsafe_allow_html=True,
    )
    df = pd.read_sql(
        "SELECT * FROM asteroids ORDER BY approach_date DESC LIMIT 1000", conn
    )

    # Nettoyage si besoin
    df["approach_date"] = pd.to_datetime(df["approach_date"])
    df["diameter_min"] = pd.to_numeric(df["diameter_min"], errors="coerce")
    df["is_potentially_hazardous"] = df["is_potentially_hazardous"].astype(bool)

    # --- 🔢 KPIs ---
    col1, col2, col3 = st.columns(3)
    col1.metric(
        "🌍 Astéroïdes aujourd'hui",
        len(df[df["approach_date"] == pd.to_datetime("today").date()]),
    )
    col2.metric("☠️ Dangereux détectés", df["is_potentially_hazardous"].sum())
    col3.metric("📏 Max diamètre (m)", round(df["diameter_min"].max(), 2))

    st.markdown("---")

    # --- 🎛️ Filtres dynamiques ---
    st.subheader("🔎 Filtrage interactif")
    date_range = st.date_input("📅 Filtrer par date d’approche", [])
    min_diam = st.slider(
        "📏 Diamètre minimum (m)", 0, int(df["diameter_min"].max()), 10
    )
    hazard_only = st.checkbox("☠️ Afficher seulement les dangereux")

    df_filtered = df.copy()
    if date_range:
        if len(date_range) == 2:
            df_filtered = df_filtered[
                (df_filtered["approach_date"] >= pd.to_datetime(date_range[0]))
                & (df_filtered["approach_date"] <= pd.to_datetime(date_range[1]))
            ]
    if min_diam:
        df_filtered = df_filtered[df_filtered["diameter_min"] >= min_diam]
    if hazard_only:
        df_filtered = df_filtered[df_filtered["is_potentially_hazardous"]]

    st.dataframe(df_filtered)

    # --- 📈 Histogramme des approches ---
    st.subheader("📊 Approches d’astéroïdes par jour")
    st.bar_chart(df["approach_date"].value_counts().sort_index())

    # --- 📉 Analyse diamètre vs dangerosité ---
    import matplotlib.pyplot as plt

    st.subheader("🧪 Relation diamètre / dangerosité")

    fig, ax = plt.subplots(figsize=(6, 3))  # Taille du graphique en pouces
    ax.scatter(
        df["diameter_min"], df["is_potentially_hazardous"], alpha=0.6, color="#1f77b4"
    )
    ax.set_xlabel("Diamètre (m)")
    ax.set_ylabel("Potentiellement dangereux (0 ou 1)")
    ax.set_title("Dangerosité en fonction du diamètre", fontsize=14)
    ax.grid(True, linestyle="--", alpha=0.3)

    # Centrer ou rétrécir l'affichage
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.pyplot(fig)


### 4EME PAGE
elif page == "Événements Naturels":
    st.markdown(
        "<h2 class='title-style'>🌍 Événements Naturels (EONET)</h2>",
        unsafe_allow_html=True,
    )
    df = pd.read_sql("SELECT * FROM natural_events ORDER BY date DESC LIMIT 1000", conn)
    df["date"] = pd.to_datetime(df["date"])
    # 🔢 KPIs
    col1, col2, col3 = st.columns(3)
    col1.metric("📌 Total événements", len(df))
    col2.metric("🔥 Incendies", df[df["category"] == "Wildfires"].shape[0])
    col3.metric(
        "🌪️ Cyclones", df[df["category"].str.contains("Storm", na=False)].shape[0]
    )

    # 🔍 Filtrage interactif
    with st.expander("🎛️ Filtres"):
        # Catégories
        categories = df["category"].dropna().unique()
        selected_cat = st.multiselect(
            "Catégories", categories, default=list(categories)
        )

        # Date
        min_date, max_date = df["date"].min(), df["date"].max()
        date_range = st.date_input("Période", [min_date, max_date])

        # Recherche dans le titre
        keyword = st.text_input("🔎 Mot-clé dans le titre", "")

        # Filtrage final
        filtered = df[
            (df["category"].isin(selected_cat))
            & (df["date"] >= pd.to_datetime(date_range[0]))
            & (df["date"] <= pd.to_datetime(date_range[1]))
        ]
        if keyword:
            filtered = filtered[
                filtered["title"].str.contains(keyword, case=False, na=False)
            ]

    # 📄 Données filtrées
    st.markdown("### 📋 Résultats filtrés")
    st.dataframe(filtered)

    # 📍 Carte avec st.map
    st.markdown("### 🗺️ Carte des événements")
    try:
        coords = (
            filtered["coordinates"]
            .dropna()
            .apply(lambda x: json.loads(x) if isinstance(x, str) else x)
        )
        valid_df = filtered.loc[coords.index]
        coords_df = pd.DataFrame(coords.tolist(), columns=["lon", "lat"])
        coords_df["category"] = valid_df["category"].values
        coords_df["title"] = valid_df["title"].values

        st.map(coords_df)
    except Exception as e:
        st.warning("🌐 Impossible d'afficher la carte : " + str(e))

    # 📈 Évolution dans le temps
    st.markdown("### 📈 Évolution quotidienne")
    timeline = filtered.groupby(filtered["date"].dt.date).size()
    st.line_chart(timeline)


### 5EME PAGE
elif page == "Exoplanètes":
    st.markdown(
        "<h2 class='title-style'>🪐 Exoplanètes découvertes</h2>",
        unsafe_allow_html=True,
    )

    # 📥 Chargement des données
    df = pd.read_sql("SELECT * FROM exoplanets ORDER BY radius DESC LIMIT 500", conn)
    df["radius"] = pd.to_numeric(df["radius"], errors="coerce")

    # 📊 Métriques utiles
    col1, col2, col3 = st.columns(3)
    col1.metric("🌍 Nombre d'exoplanètes", len(df))
    col2.metric("📏 Rayon moyen", round(df["radius"].mean(), 2))
    col3.metric("📅 Dernière insertion", df["inserted_at"].max().strftime("%Y-%m-%d"))

    # 📋 Affichage du tableau
    st.dataframe(df)

    # 📈 Graphique du rayon
    st.markdown("### 📈 Taille des exoplanètes")
    st.line_chart(df.set_index("name")[["radius"]])

    # 📊 Histogramme des rayons
    st.markdown("### 🧪 Répartition des rayons")
    fig, ax = plt.subplots(figsize=(6, 3))  # 👈 Largeur 6 pouces, Hauteur 3 pouces
    ax.hist(df["radius"], bins=30, color="skyblue", edgecolor="black")
    ax.set_xlabel("Rayon")
    ax.set_ylabel("Nombre d'exoplanètes")
    st.pyplot(fig)

    # 🧭 Filtrage par nom
    name_query = st.text_input("🔍 Rechercher une exoplanète par nom :")
    if name_query:
        filtered = df[df["name"].str.contains(name_query, case=False, na=False)]
        st.dataframe(filtered)


### 6EME PAGE
elif page == "Photos de Mars":
    st.markdown(
        "<h2 class='title-style'>📸 Dernières photos des rovers martiens</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        """
    <style>
        .mars-card {
            background-color: white;
            padding: 15px;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            text-align: center;
        }
        .mars-image {
            border-radius: 10px;
        }
        .mars-caption {
            margin-top: 10px;
            font-size: 14px;
            color: #555;
        }
    </style>
    """,
        unsafe_allow_html=True,
    )
    df = pd.read_sql(
        "SELECT * FROM mars_photos ORDER BY earth_date DESC LIMIT 10", conn
    )

    for i in range(0, len(df), 2):
        cols = st.columns(2)
        for j in range(2):
            if i + j < len(df):
                row = df.iloc[i + j]
                with cols[j]:
                    st.markdown(
                        f"""
                        <div class="mars-card">
                            <img src="{row['img_src']}" width="100%" class="mars-image">
                            <div class="mars-caption">
                                <b>{row['rover_name']}</b><br>
                                {row['camera_name']}<br>
                                📅 {row['earth_date']}
                            </div>
                        </div>
                        """,
                        unsafe_allow_html=True,
                    )


### 7EME PAGE
elif page == "Événements Solaires":
    st.markdown(
        "<h2 class='title-style'>🔆 Événements Solaires (DONKI)</h2>",
        unsafe_allow_html=True,
    )
    df = pd.read_sql("SELECT * FROM events ORDER BY start_time DESC LIMIT 50", conn)
    st.dataframe(df)
    st.write("Derniers événements solaires recensés par la NASA")


### 8EME PAGE
elif page == "Actualités Spatiales":
    st.markdown(
        "<h2 class='title-style'>📰 Actualités Spatiales</h2>", unsafe_allow_html=True
    )
    try:
        import feedparser

        feed = feedparser.parse("https://www.nasa.gov/rss/dyn/breaking_news.rss")
        for entry in feed.entries[:5]:
            st.subheader(entry.title)
            st.write(entry.published)
            st.write(entry.summary)
            st.markdown(f"[En savoir plus]({entry.link})")
            st.markdown("---")
    except:
        st.error(
            "Impossible de charger les actualités. Assurez-vous que le module 'feedparser' est installé."
        )


### DERNIERE PAGE
elif page == "Coin des Curieux":
    st.markdown(
        "<h2 class='title-style'>🧠 Le Coin des Curieux</h2>", unsafe_allow_html=True
    )

    # 📺 Deux vidéos côte à côte (via HTML + flexbox)
    st.markdown(
        """
        <div style='display: flex; justify-content: left; gap: 30px; flex-wrap: wrap;'>
            <iframe width="500" height="400"
                src="https://youtu.be/ILf9UrkGEE0?si=e9ZYIwghQj6Ru2Mz"
                frameborder="0" allowfullscreen></iframe>
        </div>
        """,
        unsafe_allow_html=True,
    )
    # 📅 Événements à venir
    st.markdown("📅 **Prochains événements célestes :**")
    st.markdown(
        """
    - 🌕 Pleine lune : 23 avril 2025  
    - 🟣 Éclipse lunaire partielle : 7 septembre 2025  
    - 🌞 Éclipse solaire totale : 12 août 2026
    """
    )
