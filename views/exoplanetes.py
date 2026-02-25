"""
SolarScope -- Exoplanetes (NASA Exoplanet Archive).
Explication educative, catalogue, statistiques, exoplanetes celebres,
methodes de detection, galerie NASA, videos, liens utiles.
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

# Exoplanetes celebres
FAMOUS_EXOPLANETS = [
    {
        "name": "Proxima Centauri b",
        "distance": "4.2 annees-lumiere",
        "type": "Rocheuse",
        "habitable": True,
        "description": "L&#39;exoplanete la plus proche de nous ! Elle orbite notre voisine Proxima du Centaure, dans la zone habitable.",
        "fun": "Meme a la vitesse de la lumiere, il faudrait 4 ans pour y aller. Avec nos fusees actuelles : 73 000 ans !",
        "color": "#10b981",
    },
    {
        "name": "TRAPPIST-1e",
        "distance": "39 annees-lumiere",
        "type": "Rocheuse",
        "habitable": True,
        "description": "L&#39;une des 7 planetes du systeme TRAPPIST-1, decouverte par un telescope belge. Taille et temperature proches de la Terre.",
        "fun": "Les 7 planetes TRAPPIST sont si proches que depuis l&#39;une, on verrait les autres comme des Lunes geantes !",
        "color": "#3b82f6",
    },
    {
        "name": "Kepler-452b",
        "distance": "1 400 annees-lumiere",
        "type": "Super-Terre",
        "habitable": True,
        "description": "Surnommee la &laquo; cousine de la Terre &raquo;. Son annee dure 385 jours et son etoile ressemble au Soleil.",
        "fun": "Si la vie a emerge sur Kepler-452b, elle aurait eu 1.5 milliard d&#39;annees de plus que nous pour evoluer !",
        "color": "#6366f1",
    },
    {
        "name": "51 Pegasi b",
        "distance": "50 annees-lumiere",
        "type": "Jupiter chaud",
        "habitable": False,
        "description": "La toute premiere exoplanete decouverte autour d&#39;une etoile (1995) ! Prix Nobel de Physique 2019 pour Michel Mayor et Didier Queloz.",
        "fun": "Elle fait le tour de son etoile en seulement 4 jours ! Sa temperature depasse 1 000 degre C.",
        "color": "#f59e0b",
    },
    {
        "name": "HD 189733b",
        "distance": "63 annees-lumiere",
        "type": "Jupiter chaud",
        "habitable": False,
        "description": "Cette planete bleue ressemble a la Terre de loin, mais il y pleut... du verre fondu ! Vents a 8 700 km/h.",
        "fun": "Sa couleur bleue ne vient pas de l&#39;eau, mais de particules de silicate (verre) dans son atmosphere !",
        "color": "#67e8f9",
    },
    {
        "name": "WASP-12b",
        "distance": "1 400 annees-lumiere",
        "type": "Jupiter chaud",
        "habitable": False,
        "description": "Cette planete est en train d&#39;etre devoree par son etoile ! Elle a la forme d&#39;un oeuf a cause des marees gravitationnelles.",
        "fun": "WASP-12b est l&#39;une des planetes les plus noires connues : elle absorbe 94% de la lumiere !",
        "color": "#ef4444",
    },
]

# Methodes de detection
DETECTION_METHODS = [
    {
        "name": "Transit",
        "emoji": "🌑",
        "percent": "77%",
        "description": "Quand la planete passe devant son etoile, la luminosite baisse legerement. C&#39;est comme si une mouche passait devant un phare !",
        "color": "#6366f1",
    },
    {
        "name": "Vitesse radiale",
        "emoji": "🔄",
        "percent": "19%",
        "description": "La planete fait &laquo; trembler &raquo; son etoile en tournant autour. On mesure ce tremblement avec un spectrometre ultra-precis.",
        "color": "#f59e0b",
    },
    {
        "name": "Imagerie directe",
        "emoji": "📸",
        "percent": "2%",
        "description": "On photographie directement la planete ! Tres difficile car l&#39;etoile est des milliards de fois plus brillante.",
        "color": "#10b981",
    },
    {
        "name": "Microlentille",
        "emoji": "🔍",
        "percent": "2%",
        "description": "La gravite de l&#39;etoile et sa planete courbent la lumiere d&#39;une etoile lointaine, comme une loupe cosmique.",
        "color": "#ef4444",
    },
]

VIDEOS = [
    {
        "title": "TRAPPIST-1 : 7 planetes pour la vie ?",
        "url": "https://www.youtube.com/watch?v=bnKFaAS30X8",
        "description": "La decouverte historique du systeme TRAPPIST-1 par une equipe belge.",
        "age": "10-14 ans",
    },
    {
        "title": "Comment detecte-t-on les exoplanetes ?",
        "url": "https://www.youtube.com/watch?v=fH5_vOCuL2s",
        "description": "Les differentes methodes pour trouver des planetes autour d&#39;autres etoiles.",
        "age": "10-14 ans",
    },
    {
        "title": "Le James Webb observe des exoplanetes",
        "url": "https://www.youtube.com/watch?v=shPVQwGJyak",
        "description": "Premieres observations d&#39;atmospheres d&#39;exoplanetes par le JWST.",
        "age": "12+ ans",
    },
    {
        "title": "Y a-t-il de la vie ailleurs ?",
        "url": "https://www.youtube.com/watch?v=IOAI0IyaDWE",
        "description": "La grande question : sommes-nous seuls dans l&#39;Univers ?",
        "age": "8-14 ans",
    },
]


def _search_nasa_images(query, count=8):
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
                    results.append({"title": data.get("title", ""), "url": img_url})
            return results
    except Exception:
        pass
    return []


def render(conn):
    st.markdown(
        '<h2 class="title-style">Exoplanetes</h2>',
        unsafe_allow_html=True,
    )
    st.markdown(
        '<p class="subtitle">Catalogue des planetes decouvertes au-dela de notre systeme solaire</p>',
        unsafe_allow_html=True,
    )

    # === Explication educative ===
    st.markdown(
        '<div class="card">'
        "<h4>C&#39;est quoi une exoplanete ?</h4>"
        "<p>"
        "Une exoplanete, c&#39;est une planete qui tourne autour d&#39;une <b>autre etoile</b> "
        "que le Soleil ! On en a decouvert des milliers depuis 1995, grace a des telescopes "
        "comme <b>Kepler</b> et <b>James Webb</b>. Certaines sont rocheuses comme la Terre, "
        "d&#39;autres sont des geantes gazeuses comme Jupiter."
        "</p>"
        "<p>"
        'Les scientifiques cherchent surtout des exoplanetes dans la <b>"zone habitable"</b> &mdash; '
        "la distance parfaite de leur etoile pour que l&#39;eau puisse exister a l&#39;etat liquide. "
        "L&#39;eau liquide est un ingredient essentiel pour la vie telle qu&#39;on la connait !"
        "</p>"
        '<p style="color:#f59e0b;">'
        "<b>Le savais-tu ?</b> La premiere exoplanete a ete decouverte en 1995 par deux "
        "scientifiques suisses, Michel Mayor et Didier Queloz. Ils ont recu le Prix Nobel en 2019 !"
        "</p>"
        "</div>",
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    try:
        df = pd.read_sql("SELECT name, radius FROM exoplanets ORDER BY radius DESC NULLS LAST", conn)
    except Exception as e:
        st.error(f"Erreur : {e}")
        return

    if df.empty:
        st.info("Pas de donnees. Lancez le pipeline d'ingestion.")
        return

    # KPIs
    total = len(df)
    earth_like = len(df[(df["radius"] >= 0.8) & (df["radius"] <= 1.5)])
    super_earths = len(df[(df["radius"] > 1.5) & (df["radius"] <= 2.5)])
    giants = len(df[df["radius"] > 10])

    c1, c2, c3, c4 = st.columns(4)
    for col, (label, val, color) in zip(
        [c1, c2, c3, c4],
        [
            ("Total exoplanetes", f"{total:,}".replace(",", " "), "#6366f1"),
            ("Taille Terre", f"{earth_like}", "#10b981"),
            ("Super-Terres", f"{super_earths}", "#f59e0b"),
            ("Geantes gazeuses", f"{giants}", "#ef4444"),
        ],
    ):
        with col:
            st.markdown(
                f'<div class="kpi-card">'
                f'<div class="kpi-value" style="background:{color};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{val}</div>'
                f'<div class="kpi-label">{label}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )

    st.markdown("<br>", unsafe_allow_html=True)

    # Classification guide
    st.markdown(
        '<div class="card" style="padding:1rem;">'
        '<b style="color:#a78bfa;">Comment lire les graphiques :</b>'
        '<ul style="color:#cbd5e1;margin-top:0.5rem;">'
        '<li><b style="color:#10b981;">Taille Terre</b> (0.8 - 1.5 R) : taille similaire a la Terre, possiblement rocheuse</li>'
        '<li><b style="color:#f59e0b;">Super-Terre</b> (1.5 - 2.5 R) : plus grande que la Terre mais plus petite que Neptune</li>'
        '<li><b style="color:#3b82f6;">Mini-Neptune</b> (2.5 - 10 R) : planete gazeuse de taille moyenne</li>'
        '<li><b style="color:#ef4444;">Geante gazeuse</b> (&gt; 10 R) : tres grosse, comme Jupiter ou Saturne</li>'
        '</ul>'
        '</div>',
        unsafe_allow_html=True,
    )

    # Graphiques
    tab1, tab2, tab3 = st.tabs(["Distribution des rayons", "Top 20", "Par categorie"])

    with tab1:
        df_clean = df[df["radius"].notna() & (df["radius"] < 50)]
        fig = px.histogram(
            df_clean, x="radius", nbins=50,
            title="Distribution des rayons (en rayons terrestres)",
            labels={"radius": "Rayon (R-Terre)", "count": "Nombre"},
            color_discrete_sequence=["#8b5cf6"],
        )
        fig.add_vline(x=1, line_dash="dash", line_color="#10b981", annotation_text="Terre")
        fig.add_vline(x=1.5, line_dash="dot", line_color="#f59e0b", annotation_text="Super-Terre")
        fig.add_vline(x=11.2, line_dash="dash", line_color="#ef4444", annotation_text="Jupiter")
        fig.update_layout(**PLOTLY_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with tab2:
        top20 = df.dropna(subset=["radius"]).head(20)
        fig2 = px.bar(
            top20, x="name", y="radius",
            title="Top 20 des plus grandes exoplanetes",
            labels={"name": "Nom", "radius": "Rayon (R-Terre)"},
            color="radius", color_continuous_scale=["#6366f1", "#f59e0b", "#ef4444"],
        )
        fig2.update_layout(**PLOTLY_LAYOUT, xaxis_tickangle=45)
        st.plotly_chart(fig2, use_container_width=True)

    with tab3:
        def categorize(r):
            if pd.isna(r):
                return "Inconnu"
            if r <= 1.5:
                return "Taille Terre"
            elif r <= 2.5:
                return "Super-Terre"
            elif r <= 10:
                return "Mini-Neptune"
            else:
                return "Geante gazeuse"

        df_cat = df.copy()
        df_cat["Categorie"] = df_cat["radius"].apply(categorize)
        cat_counts = df_cat["Categorie"].value_counts().reset_index()
        cat_counts.columns = ["Categorie", "Nombre"]

        fig3 = px.pie(
            cat_counts, values="Nombre", names="Categorie",
            title="Repartition par type",
            color="Categorie",
            color_discrete_map={
                "Taille Terre": "#10b981", "Super-Terre": "#f59e0b",
                "Mini-Neptune": "#3b82f6", "Geante gazeuse": "#ef4444",
                "Inconnu": "#64748b",
            },
            hole=0.4,
        )
        fig3.update_layout(**PLOTLY_LAYOUT)
        st.plotly_chart(fig3, use_container_width=True)

    # === Methodes de detection ===
    st.markdown("---")
    st.markdown("### Comment trouve-t-on des exoplanetes ?")
    st.markdown("*Les telescopes ne voient presque jamais les exoplanetes directement. Voici les astuces des scientifiques :*")

    det_cols = st.columns(4)
    for i, method in enumerate(DETECTION_METHODS):
        with det_cols[i]:
            st.markdown(
                f'<div class="card" style="text-align:center;border-left:4px solid {method["color"]};">'
                f'<div style="font-size:2rem;">{method["emoji"]}</div>'
                f'<h4>{method["name"]}</h4>'
                f'<div style="font-size:1.5rem;color:{method["color"]};font-weight:700;">{method["percent"]}</div>'
                f'<p style="font-size:0.85rem;">{method["description"]}</p>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # === Exoplanetes celebres ===
    st.markdown("---")
    st.markdown("### Exoplanetes celebres")
    st.markdown("*Les mondes les plus fascinants decouverts au-dela du systeme solaire*")

    for i in range(0, len(FAMOUS_EXOPLANETS), 2):
        cols = st.columns(2)
        for j, col in enumerate(cols):
            if i + j < len(FAMOUS_EXOPLANETS):
                exo = FAMOUS_EXOPLANETS[i + j]
                with col:
                    hab_badge = ""
                    if exo["habitable"]:
                        hab_badge = '<p style="color:#10b981;font-size:0.8rem;">&#127758; Zone habitable</p>'

                    html = (
                        f'<div class="card" style="border-left:4px solid {exo["color"]};">'
                        f'<h4>{exo["name"]} <span style="color:#94a3b8;font-size:0.85rem;">({exo["distance"]})</span></h4>'
                        f'<p style="color:#8b5cf6;font-size:0.85rem;">{exo["type"]}</p>'
                        f'{hab_badge}'
                        f'<p>{exo["description"]}</p>'
                        f'<p style="color:#f59e0b;font-size:0.9rem;">Le savais-tu ? {exo["fun"]}</p>'
                        f'</div>'
                    )
                    st.markdown(html, unsafe_allow_html=True)

    # === Galerie NASA ===
    st.markdown("---")
    st.markdown("### Galerie NASA - Images d&#39;exoplanetes")

    with st.form("exo_img_search"):
        img_query = st.text_input("Rechercher des images :", value="exoplanet artist concept TRAPPIST")
        img_search = st.form_submit_button("Rechercher")

    search_q = img_query if img_search else "exoplanet artist concept TRAPPIST"
    with st.spinner("Chargement des images NASA..."):
        images = _search_nasa_images(search_q, count=8)

    if images:
        img_cols = st.columns(4)
        for i, img in enumerate(images):
            with img_cols[i % 4]:
                try:
                    st.image(img["url"], caption=img["title"][:50], use_column_width=True)
                except Exception:
                    pass

    # === Videos educatives ===
    st.markdown("---")
    st.markdown("### Videos educatives")
    st.markdown("*Clique pour regarder sur YouTube*")

    vid_cols = st.columns(2)
    for i, video in enumerate(VIDEOS):
        with vid_cols[i % 2]:
            st.markdown(
                f'<div class="card">'
                f'<h4>{video["title"]}</h4>'
                f'<p>{video["description"]}</p>'
                f'<p style="color:#8b5cf6;font-weight:500;">Age : {video["age"]}</p>'
                f'<a href="{video["url"]}" target="_blank" '
                f'style="display:inline-block;padding:0.5rem 1rem;'
                f'background:linear-gradient(135deg,#6366f1,#8b5cf6);'
                f'color:white;border-radius:8px;text-decoration:none;font-weight:600;">'
                f'Regarder sur YouTube</a>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # === Recherche ===
    st.markdown("---")
    st.markdown("### Rechercher une exoplanete")

    with st.form("exo_search"):
        search = st.text_input("Nom de l'exoplanete :", "")
        search_btn = st.form_submit_button("Rechercher")

    if search_btn and search:
        results = df[df["name"].str.contains(search, case=False, na=False)]
        if not results.empty:
            st.dataframe(results.head(20), use_container_width=True, hide_index=True)
        else:
            st.info("Aucun resultat.")

    # === Liens utiles ===
    st.markdown("---")
    st.markdown("### En savoir plus")
    st.markdown(
        '<div class="card">'
        '<ul style="color:#cbd5e1;">'
        '<li><a href="https://exoplanets.nasa.gov/" target="_blank" style="color:#a78bfa;">NASA Exoplanet Exploration</a> &mdash; Le portail officiel avec visualisations interactives</li>'
        '<li><a href="https://eyes.nasa.gov/apps/exo/" target="_blank" style="color:#a78bfa;">Eyes on Exoplanets 3D</a> &mdash; Voyage virtuel vers les exoplanetes (comme Google Earth !)</li>'
        '<li><a href="https://exoplanetarchive.ipac.caltech.edu/" target="_blank" style="color:#a78bfa;">NASA Exoplanet Archive</a> &mdash; Base de donnees complete de toutes les exoplanetes</li>'
        '<li><a href="https://www.eso.org/public/france/themes/exoplanets/" target="_blank" style="color:#a78bfa;">ESO Exoplanetes</a> &mdash; Le site de l&#39;Observatoire Europeen</li>'
        '<li><a href="https://planetarysociety.org/exoplanets" target="_blank" style="color:#a78bfa;">Planetary Society</a> &mdash; Actualites et educatif sur les exoplanetes</li>'
        '</ul>'
        '</div>',
        unsafe_allow_html=True,
    )

    # Track page
    if "visited_pages" not in st.session_state:
        st.session_state.visited_pages = set()
    st.session_state.visited_pages.add("Exoplanetes")
