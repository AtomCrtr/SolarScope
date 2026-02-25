"""
SolarScope -- Asteroides (NeoWs).
Explication educative, KPIs, filtres, graphiques, galerie NASA, videos, asteroides celebres.
"""

import streamlit as st
import pandas as pd
import requests
import plotly.express as px
import plotly.graph_objects as go

PLOTLY_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Outfit, sans-serif", color="#94a3b8"),
)

# Asteroides celebres
FAMOUS_ASTEROIDS = [
    {
        "name": "Bennu",
        "size": "490 m",
        "danger": True,
        "description": "L'asteroide le plus etudie. La sonde OSIRIS-REx en a ramene des echantillons sur Terre en 2023 ! Il a 1 chance sur 2 700 d'impacter la Terre en 2182.",
        "fun": "Bennu fait un tour sur lui-meme en 4h 17min et projette des cailloux dans l'espace comme un petit volcan !",
        "color": "#ef4444",
    },
    {
        "name": "Apophis",
        "size": "370 m",
        "danger": True,
        "description": "En 2004, il a fait peur au monde entier avec 2.7% de chance d'impact en 2029. Le risque est ecarte, mais il passera a seulement 31 000 km de la Terre le 13 avril 2029 !",
        "fun": "Il passera plus pres que nos satellites geostationnaires. On pourra le voir a l'oeil nu !",
        "color": "#f59e0b",
    },
    {
        "name": "Ryugu",
        "size": "900 m",
        "danger": False,
        "description": "La sonde japonaise Hayabusa2 a atterri dessus et ramene des echantillons en 2020. Il contient des acides amines, les briques de la vie !",
        "fun": "Ryugu a la forme d'une toupie et il est si poreux qu'il est constitue a 50% de vide.",
        "color": "#6366f1",
    },
    {
        "name": "Dimorphos",
        "size": "160 m",
        "danger": False,
        "description": "Premiere asteroide dont l'humanite a modifie l'orbite ! La mission DART de la NASA l'a percute en 2022 pour tester notre defense planetaire.",
        "fun": "L'impact a cree un nuage de debris de 10 000 km de long et a raccourci son orbite de 33 minutes.",
        "color": "#10b981",
    },
    {
        "name": "Ceres",
        "size": "940 km",
        "danger": False,
        "description": "Le plus gros objet de la ceinture d'asteroides, classe comme 'planete naine'. La sonde Dawn l'a etudie de 2015 a 2018.",
        "fun": "Ceres contient plus d'eau douce que toute la Terre ! Elle est cachee sous sa croute rocheuse.",
        "color": "#3b82f6",
    },
    {
        "name": "Vesta",
        "size": "525 km",
        "danger": False,
        "description": "Le 2e plus gros asteroide. Vesta a un enorme cratere d'impact (Rheasilvia) qui fait presque sa taille !",
        "fun": "Des morceaux de Vesta sont tombes sur Terre sous forme de meteorites. On en a retrouve en Antarctique !",
        "color": "#a78bfa",
    },
]

VIDEOS = [
    {
        "title": "DART : la NASA devie un asteroide",
        "url": "https://www.youtube.com/watch?v=4RA8Tfa6Sck",
        "description": "La mission historique DART qui a percute l'asteroide Dimorphos en 2022.",
        "age": "8-14 ans",
    },
    {
        "title": "C'est pas Sorcier — Les meteorites",
        "url": "https://www.youtube.com/watch?v=4nCMi4hiYTw",
        "description": "Fred et Jamy expliquent les asteroides, meteorites et cometes.",
        "age": "7-14 ans",
    },
    {
        "title": "L'asteroide qui a tue les dinosaures",
        "url": "https://www.youtube.com/watch?v=dFCbJmgeHmA",
        "description": "Il y a 66 millions d'annees, un asteroide de 10 km a change l'histoire de la Terre.",
        "age": "8-14 ans",
    },
    {
        "title": "OSIRIS-REx : rapporter un morceau d'asteroide",
        "url": "https://www.youtube.com/watch?v=bPUbaqxFnBg",
        "description": "Comment la sonde a collecte des echantillons de Bennu et les a ramenes sur Terre.",
        "age": "10-14 ans",
    },
]


def _search_nasa_images(query="asteroid", count=8):
    """Cherche des images via la NASA Image Library."""
    try:
        r = requests.get(
            "https://images-api.nasa.gov/search",
            params={"q": query, "media_type": "image", "page_size": count},
            timeout=10,
        )
        if r.status_code == 200:
            items = r.json().get("collection", {}).get("items", [])
            results = []
            for item in items:
                data = item.get("data", [{}])[0]
                links = item.get("links", [{}])
                img_url = links[0].get("href", "") if links else ""
                if img_url:
                    results.append({
                        "title": data.get("title", "Sans titre"),
                        "url": img_url,
                    })
            return results
    except Exception:
        pass
    return []


def render(conn):
    st.markdown(
        "<h2 class='title-style'>Asteroides proches de la Terre</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Surveillance des objets geants croisant l'orbite terrestre</p>",
        unsafe_allow_html=True,
    )

    # === Explication educative ===
    st.markdown(
        """
        <div class='card'>
            <h4>C'est quoi un asteroide ?</h4>
            <p>
                Un asteroide, c'est un <b>gros rocher qui flotte dans l'espace</b> ! 
                La plupart se trouvent entre Mars et Jupiter dans la "ceinture d'asteroides", 
                mais certains passent parfois pres de la Terre. Pas de panique : la NASA 
                les surveille <b>24h/24</b> avec des telescopes speciaux !
            </p>
            <p>
                Les scientifiques classent certains asteroides comme <b>"potentiellement dangereux"</b> 
                quand ils passent a moins de 7,5 millions de km de la Terre ET font plus de 140 metres. 
                Pour comparer : la Tour Eiffel fait 330 metres, et un terrain de foot fait 100 metres.
            </p>
            <p style='color: #f59e0b;'>
                <b>Le programme de defense planetaire</b> : depuis la mission <b>DART</b> en 2022, 
                l'humanite sait devier un asteroide en le percutant avec une sonde. C'est la premiere 
                fois qu'on modifie l'orbite d'un objet celeste !
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # === Donnees ===
    try:
        df = pd.read_sql(
            "SELECT name, approach_date, diameter_min, is_potentially_hazardous "
            "FROM asteroids ORDER BY approach_date DESC",
            conn,
        )
    except Exception as e:
        st.error(f"Erreur : {e}")
        return

    if df.empty:
        st.info("Pas de donnees. Lancez le pipeline d'ingestion.")
        return

    st.markdown(
        f"<div class='update-badge'>Derniere donnee : {df['approach_date'].iloc[0]}</div>",
        unsafe_allow_html=True,
    )

    # KPIs
    total = len(df)
    hazardous = int(df["is_potentially_hazardous"].sum())
    safe = total - hazardous
    avg_diameter = df["diameter_min"].mean()
    max_diameter = df["diameter_min"].max()
    biggest_name = df.loc[df["diameter_min"].idxmax(), "name"]

    c1, c2, c3, c4 = st.columns(4)
    for col, (label, val, color) in zip(
        [c1, c2, c3, c4],
        [
            ("Total detectes", f"{total}", "#6366f1"),
            ("Dangereux", f"{hazardous}", "#ef4444"),
            ("Diametre moyen", f"{avg_diameter:.0f} m", "#f59e0b"),
            ("Plus gros", f"{max_diameter:.0f} m", "#10b981"),
        ],
    ):
        with col:
            st.markdown(
                f"""
                <div class='kpi-card'>
                    <div class='kpi-value' style='background: {color}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>{val}</div>
                    <div class='kpi-label'>{label}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.markdown("<br>", unsafe_allow_html=True)

    # Filtres
    st.markdown("### Filtres")
    col1, col2, col3 = st.columns(3)
    with col1:
        hazardous_only = st.checkbox("Uniquement les dangereux", False)
    with col2:
        min_diameter = st.slider("Diametre minimum (m)", 0, int(max_diameter), 0)
    with col3:
        sort_by = st.selectbox("Trier par", ["Date (recent)", "Diametre (grand)", "Nom"])

    filtered = df.copy()
    if hazardous_only:
        filtered = filtered[filtered["is_potentially_hazardous"] == True]
    filtered = filtered[filtered["diameter_min"] >= min_diameter]

    if sort_by == "Diametre (grand)":
        filtered = filtered.sort_values("diameter_min", ascending=False)
    elif sort_by == "Nom":
        filtered = filtered.sort_values("name")

    st.markdown(f"**{len(filtered)}** asteroides correspondent aux filtres")

    # Graphiques
    tab1, tab2, tab3, tab4 = st.tabs(["Distribution", "Timeline", "Dangereux vs Safe", "Comparaison tailles"])

    with tab1:
        fig = px.histogram(
            filtered, x="diameter_min", nbins=30,
            color="is_potentially_hazardous",
            color_discrete_map={True: "#ef4444", False: "#6366f1"},
            labels={"diameter_min": "Diametre (m)", "count": "Nombre", "is_potentially_hazardous": "Dangereux"},
            title="Distribution des diametres",
        )
        fig.update_layout(**PLOTLY_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with tab2:
        daily = filtered.groupby("approach_date").agg(
            count=("name", "size"), max_diameter=("diameter_min", "max"),
        ).reset_index()
        fig2 = px.scatter(
            daily, x="approach_date", y="count", size="max_diameter",
            color="max_diameter", color_continuous_scale=["#6366f1", "#f59e0b", "#ef4444"],
            title="Asteroides par jour (taille = diametre max)",
            labels={"approach_date": "Date", "count": "Nombre", "max_diameter": "Diametre max"},
        )
        fig2.update_layout(**PLOTLY_LAYOUT)
        st.plotly_chart(fig2, use_container_width=True)

    with tab3:
        fig3 = go.Figure(data=[
            go.Pie(labels=["Dangereux", "Non dangereux"], values=[hazardous, safe],
                   hole=0.5, marker_colors=["#ef4444", "#6366f1"],
                   textinfo="label+percent", textfont_size=14)
        ])
        fig3.update_layout(**PLOTLY_LAYOUT, title="Repartition dangereux vs non dangereux", showlegend=False)
        st.plotly_chart(fig3, use_container_width=True)

    with tab4:
        comparisons = pd.DataFrame([
            {"Objet": "Personne (1.7m)", "Taille": 1.7},
            {"Objet": "Bus (12m)", "Taille": 12},
            {"Objet": "Terrain foot (100m)", "Taille": 100},
            {"Objet": "Tour Eiffel (330m)", "Taille": 330},
            {"Objet": "Asteroide tueur dinosaures (10km)", "Taille": 10000},
            {"Objet": f"Plus gros detecte ({biggest_name})", "Taille": max_diameter},
        ])
        fig4 = px.bar(
            comparisons, x="Objet", y="Taille", color="Taille",
            color_continuous_scale=["#10b981", "#f59e0b", "#ef4444"],
            title="Echelle de comparaison", labels={"Taille": "Taille (m)"}, log_y=True,
        )
        fig4.update_layout(**PLOTLY_LAYOUT)
        st.plotly_chart(fig4, use_container_width=True)

    # === Asteroides celebres ===
    st.markdown("---")
    st.markdown("### Asteroides celebres")
    st.markdown("*Les asteroides qui ont marque l'histoire ou la science*")

    for i in range(0, len(FAMOUS_ASTEROIDS), 2):
        cols = st.columns(2)
        for j, col in enumerate(cols):
            if i + j < len(FAMOUS_ASTEROIDS):
                ast = FAMOUS_ASTEROIDS[i + j]
                with col:
                    # Build HTML without conflicting quotes
                    badge_html = ""
                    if ast["danger"]:
                        badge_html = '<p style="color:#ef4444; font-size:0.8rem;">⚠ Potentiellement dangereux</p>'

                    desc = ast["description"].replace("'", "&#39;")
                    fun = ast["fun"].replace("'", "&#39;")

                    html = (
                        f'<div class="card" style="border-left: 4px solid {ast["color"]};">'
                        f'<h4>{ast["name"]} <span style="color: #94a3b8; font-size: 0.85rem;">({ast["size"]})</span></h4>'
                        f'{badge_html}'
                        f'<p>{desc}</p>'
                        f'<p style="color: #f59e0b; font-size: 0.9rem;">Le savais-tu ? {fun}</p>'
                        f'</div>'
                    )
                    st.markdown(html, unsafe_allow_html=True)

    # === Videos educatives ===
    st.markdown("---")
    st.markdown("### Videos educatives")
    st.markdown("*Clique pour regarder sur YouTube*")

    vid_cols = st.columns(2)
    for i, video in enumerate(VIDEOS):
        with vid_cols[i % 2]:
            st.markdown(
                f"""
                <div class='card'>
                    <h4>{video['title']}</h4>
                    <p>{video['description']}</p>
                    <p style='color: #8b5cf6; font-weight: 500;'>Age : {video['age']}</p>
                    <a href='{video["url"]}' target='_blank' 
                       style='display: inline-block; padding: 0.5rem 1rem; 
                              background: linear-gradient(135deg, #6366f1, #8b5cf6); 
                              color: white; border-radius: 8px; text-decoration: none;
                              font-weight: 600;'>
                        Regarder sur YouTube
                    </a>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # === Galerie NASA ===
    st.markdown("---")
    st.markdown("### Galerie NASA — Images d'asteroides")

    with st.form("ast_search"):
        query = st.text_input("Rechercher des images :", value="asteroid bennu OSIRIS-REx")
        search = st.form_submit_button("Rechercher")

    search_query = query if search else "asteroid bennu OSIRIS-REx"
    with st.spinner("Chargement des images NASA..."):
        images = _search_nasa_images(search_query, count=8)

    if images:
        img_cols = st.columns(4)
        for i, img in enumerate(images):
            with img_cols[i % 4]:
                try:
                    st.image(img["url"], caption=img["title"][:50], use_column_width=True)
                except Exception:
                    pass

    # === Top 10 ===
    st.markdown("---")
    st.markdown("### Top 10 des plus gros asteroides detectes")
    top10 = df.nlargest(10, "diameter_min")[["name", "approach_date", "diameter_min", "is_potentially_hazardous"]]
    top10.columns = ["Nom", "Date d'approche", "Diametre (m)", "Dangereux"]
    top10["Dangereux"] = top10["Dangereux"].map({True: "Oui ⚠", False: "Non"})
    st.dataframe(top10, use_container_width=True, hide_index=True)

    # === Liens utiles ===
    st.markdown("---")
    st.markdown("### En savoir plus")
    st.markdown(
        """
        <div class='card'>
            <ul style='color: #cbd5e1;'>
                <li><a href='https://cneos.jpl.nasa.gov/ca/' target='_blank' style='color: #a78bfa;'>CNEOS Close Approach Data</a> — Prochains passages d'asteroides pres de la Terre (NASA JPL)</li>
                <li><a href='https://eyes.nasa.gov/apps/asteroids/' target='_blank' style='color: #a78bfa;'>Asteroid Watch 3D</a> — Visualisation 3D des asteroides en temps reel (comme Google Earth !)</li>
                <li><a href='https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html' target='_blank' style='color: #a78bfa;'>Small-Body Database</a> — Base de donnees de tous les asteroides connus</li>
                <li><a href='https://dart.jhuapl.edu/' target='_blank' style='color: #a78bfa;'>Mission DART</a> — Le programme de defense planetaire</li>
                <li><a href='https://www.asteroidday.org/' target='_blank' style='color: #a78bfa;'>Asteroid Day</a> — Journee mondiale des asteroides (30 juin)</li>
            </ul>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Donnees detaillees
    with st.expander("Donnees detaillees (tableau complet)"):
        st.dataframe(
            filtered.head(50).style.format({"diameter_min": "{:.1f}"}),
            use_container_width=True, height=400,
        )
