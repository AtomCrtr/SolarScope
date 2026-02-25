"""
SolarScope -- Evenements naturels (EONET).
Glossaire, carte Pydeck, graphiques, catastrophes celebres, galerie NASA, videos, climat.
"""

import streamlit as st
import pandas as pd
import json
import requests
import plotly.express as px

PLOTLY_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Outfit, sans-serif", color="#94a3b8"),
)

CATEGORY_COLORS = {
    "Wildfires": [255, 100, 50],
    "Volcanoes": [220, 50, 50],
    "Severe Storms": [100, 100, 255],
    "Sea and Lake Ice": [100, 200, 255],
    "Floods": [50, 150, 255],
    "Earthquakes": [180, 100, 50],
    "Drought": [200, 150, 50],
    "Dust and Haze": [180, 180, 100],
    "Landslides": [120, 80, 40],
    "Snow": [200, 220, 255],
    "Temperature Extremes": [255, 80, 80],
    "Water Color": [50, 200, 150],
    "Manmade": [150, 150, 150],
}

GLOSSARY = {
    "Wildfires": ("Feux de foret", "De grands incendies qui se propagent dans les forets et les prairies. Ils peuvent etre naturels (foudre) ou provoques par l&#39;homme."),
    "Volcanoes": ("Volcans", "Des montagnes qui crachent de la lave, des cendres et des gaz depuis l&#39;interieur de la Terre. Il y en a aussi sur Mars !"),
    "Severe Storms": ("Tempetes violentes", "Des tempetes tres puissantes : cyclones, ouragans, typhons. Elles se forment au-dessus des oceans chauds."),
    "Sea and Lake Ice": ("Glace marine", "La banquise et la glace des lacs. Les satellites surveillent leur evolution pour etudier le rechauffement climatique."),
    "Floods": ("Inondations", "Quand l&#39;eau deborde des rivieres ou que la pluie est trop forte, les terres sont submergees."),
    "Earthquakes": ("Tremblements de terre", "La Terre tremble quand les plaques tectoniques bougent. Certains sont destructeurs."),
    "Drought": ("Secheresses", "Quand il ne pleut pas pendant tres longtemps, la terre s&#39;asseche. Cela affecte les cultures et l&#39;eau potable."),
    "Dust and Haze": ("Poussiere et brume", "De grands nuages de poussiere ou de sable souleves par le vent, visibles depuis l&#39;espace. Le Sahara en produit enormement !"),
    "Landslides": ("Glissements de terrain", "Quand une partie d&#39;une montagne s&#39;effondre. Souvent cause par la pluie ou les tremblements de terre."),
    "Snow": ("Neige", "Les chutes de neige exceptionnelles detectees par les satellites."),
    "Temperature Extremes": ("Temperatures extremes", "Des vagues de chaleur ou de froid anormales, de plus en plus frequentes avec le changement climatique."),
    "Water Color": ("Couleur de l&#39;eau", "Quand l&#39;eau des oceans ou des lacs change de couleur (algues, sediments, pollution)."),
    "Manmade": ("Origine humaine", "Des evenements provoques par l&#39;homme : marees noires, incendies industriels, etc."),
}

# Catastrophes naturelles celebres
FAMOUS_DISASTERS = [
    {
        "name": "Eruption du Krakatoa",
        "year": "1883",
        "type": "Volcan",
        "emoji": "🌋",
        "impact": "L&#39;explosion a ete entendue a 5 000 km ! Le tsunami a fait 36 000 victimes. Les cendres ont fait baisser la temperature mondiale de 1.2 degre C pendant un an.",
        "color": "#ef4444",
    },
    {
        "name": "Seisme de San Francisco",
        "year": "1906",
        "type": "Tremblement de terre",
        "emoji": "💥",
        "impact": "Magnitude 7.9 ! L&#39;incendie qui a suivi a detruit 80% de la ville. C&#39;est ce desastre qui a lance la sismologie moderne.",
        "color": "#f59e0b",
    },
    {
        "name": "Tsunami de l&#39;Ocean Indien",
        "year": "2004",
        "type": "Tsunami",
        "emoji": "🌊",
        "impact": "Seisme de magnitude 9.1, tsunami de 30 metres de haut. 14 pays touches, 230 000 victimes. Depuis, un systeme d&#39;alerte aux tsunamis couvre l&#39;Ocean Indien.",
        "color": "#3b82f6",
    },
    {
        "name": "Ouragan Katrina",
        "year": "2005",
        "type": "Ouragan",
        "emoji": "🌀",
        "impact": "Categorie 5, vents a 280 km/h. La Nouvelle-Orleans inondee a 80%. 1 800 victimes et 125 milliards de dollars de degats.",
        "color": "#6366f1",
    },
    {
        "name": "Seisme et tsunami du Japon",
        "year": "2011",
        "type": "Seisme + Tsunami",
        "emoji": "🏗️",
        "impact": "Magnitude 9.0, tsunami de 40 metres. A provoque la catastrophe nucleaire de Fukushima. Le Japon s&#39;est deplace de 2.4 metres !",
        "color": "#a78bfa",
    },
    {
        "name": "Feux d&#39;Australie (Black Summer)",
        "year": "2019-2020",
        "type": "Feux de foret",
        "emoji": "🔥",
        "impact": "18.6 millions d&#39;hectares brules (la taille de la Grece !). 3 milliards d&#39;animaux touches. La fumee a fait le tour du monde.",
        "color": "#f97316",
    },
]

VIDEOS = [
    {
        "title": "C&#39;est pas Sorcier - Les volcans",
        "url": "https://www.youtube.com/watch?v=0C-Gw-F7zkA",
        "description": "Fred et Jamy explorent les volcans et expliquent les eruptions.",
        "age": "7-14 ans",
    },
    {
        "title": "Les catastrophes naturelles expliquees",
        "url": "https://www.youtube.com/watch?v=AIjGaTpga7o",
        "description": "Tsunamis, tremblements de terre, ouragans : comprendre les forces de la nature.",
        "age": "8-14 ans",
    },
    {
        "title": "Le rechauffement climatique en 4 min",
        "url": "https://www.youtube.com/watch?v=CEwnBH4LBJE",
        "description": "Pourquoi la Terre se rechauffe et quelles sont les consequences.",
        "age": "10-14 ans",
    },
    {
        "title": "Satellites et observation de la Terre",
        "url": "https://www.youtube.com/watch?v=YSbaBz8QB88",
        "description": "Comment les satellites surveillent les catastrophes naturelles depuis l&#39;espace.",
        "age": "10-14 ans",
    },
]


def _search_nasa_images(query, count=8):
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
        "<h2 class='title-style'>Evenements Naturels</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        '<p class="subtitle">Surveillance en temps reel des phenomenes naturels depuis l&#39;espace (NASA EONET)</p>',
        unsafe_allow_html=True,
    )

    # === Explication educative ===
    st.markdown(
        '<div class="card">'
        "<h4>Observer la Terre depuis l&#39;espace</h4>"
        "<p>"
        "La NASA possede des satellites qui surveillent la Terre 24h/24. Ils detectent "
        "les <b>feux de foret</b>, les <b>eruptions volcaniques</b>, les <b>tempetes</b>, "
        "les <b>inondations</b>, les <b>seismes</b> et bien d&#39;autres phenomenes naturels. "
        "Ces informations aident les scientifiques et les secours a reagir rapidement."
        "</p>"
        "<p>"
        "Le systeme s&#39;appelle <b>EONET</b> (Earth Observatory Natural Event Tracker). "
        "Avec le <b>changement climatique</b>, les evenements extremes deviennent plus "
        "frequents et plus intenses : tempetes plus violentes, secheresses plus longues, "
        "incendies plus devastateurs."
        "</p>"
        "</div>",
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    try:
        df = pd.read_sql(
            "SELECT event_id, title, category, coordinates, date FROM natural_events "
            "ORDER BY date DESC NULLS LAST",
            conn,
        )
    except Exception as e:
        st.error(f"Erreur : {e}")
        return

    if df.empty:
        st.info("Pas de donnees. Lancez le pipeline d'ingestion.")
        return

    # KPIs
    total = len(df)
    cats = df["category"].nunique()
    top_cat = df["category"].value_counts().index[0] if not df["category"].empty else "N/A"
    top_cat_fr = GLOSSARY.get(top_cat, (top_cat, ""))[0]

    c1, c2, c3 = st.columns(3)
    for col, (label, val, color) in zip(
        [c1, c2, c3],
        [
            ("Total evenements", f'{total:,}'.replace(",", " "), "#6366f1"),
            ("Categories", f"{cats}", "#f59e0b"),
            ("Plus frequents", top_cat_fr, "#ef4444"),
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

    # === Glossaire ===
    with st.expander("Glossaire : comprendre les categories"):
        present_cats = df["category"].dropna().unique().tolist()
        cols = st.columns(2)
        for i, cat in enumerate(sorted(present_cats)):
            fr_name, fr_desc = GLOSSARY.get(cat, (cat, "Categorie non documentee."))
            with cols[i % 2]:
                st.markdown(
                    f'<div class="card" style="padding:0.8rem;">'
                    f'<b style="color:#a78bfa;">{fr_name}</b>'
                    f'<span style="color:#64748b;font-size:0.8rem;"> ({cat})</span><br>'
                    f'<span style="color:#cbd5e1;font-size:0.85rem;">{fr_desc}</span>'
                    f'</div>',
                    unsafe_allow_html=True,
                )

    # Filtre
    categories = ["Toutes"] + sorted(df["category"].dropna().unique().tolist())
    cat_labels = ["Toutes"] + [f"{GLOSSARY.get(c, (c,))[0]} ({c})" for c in sorted(df["category"].dropna().unique().tolist())]
    selected_idx = st.selectbox("Filtrer par categorie :", range(len(cat_labels)), format_func=lambda i: cat_labels[i])

    if selected_idx == 0:
        filtered = df
    else:
        selected_cat = categories[selected_idx]
        filtered = df[df["category"] == selected_cat]

    # Globe 3D interactif
    import plotly.graph_objects as go

    map_data = []
    for _, row in filtered.iterrows():
        if row["coordinates"]:
            try:
                coords = json.loads(row["coordinates"]) if isinstance(row["coordinates"], str) else row["coordinates"]
                if isinstance(coords, list) and len(coords) >= 2:
                    cat = row["category"]
                    rgb = CATEGORY_COLORS.get(cat, [100, 100, 200])
                    map_data.append({
                        "lat": coords[1], "lon": coords[0],
                        "title": row["title"], "category": cat,
                        "color": f"rgb({rgb[0]},{rgb[1]},{rgb[2]})",
                    })
            except (json.JSONDecodeError, TypeError):
                continue

    if map_data:
        map_df = pd.DataFrame(map_data)

        # Group by category for legend
        fig_globe = go.Figure()
        for cat in map_df["category"].unique():
            cat_df = map_df[map_df["category"] == cat]
            fr_name = GLOSSARY.get(cat, (cat,))[0]
            rgb = CATEGORY_COLORS.get(cat, [100, 100, 200])
            fig_globe.add_trace(go.Scattergeo(
                lat=cat_df["lat"],
                lon=cat_df["lon"],
                text=cat_df["title"],
                name=fr_name,
                marker=dict(
                    size=6, color=f"rgb({rgb[0]},{rgb[1]},{rgb[2]})",
                    opacity=0.8, line=dict(width=0.5, color="white"),
                ),
                hoverinfo="text+name",
            ))

        fig_globe.update_geos(
            projection_type="orthographic",
            showland=True, landcolor="rgb(30, 35, 50)",
            showocean=True, oceancolor="rgb(15, 20, 40)",
            showcoastlines=True, coastlinecolor="rgb(60, 70, 100)",
            showlakes=True, lakecolor="rgb(20, 25, 45)",
            showcountries=True, countrycolor="rgb(50, 60, 90)",
            bgcolor="rgba(0,0,0,0)",
            projection_rotation=dict(lon=10, lat=20),
        )
        fig_globe.update_layout(
            **PLOTLY_LAYOUT,
            title="Globe des evenements naturels",
            height=600,
            margin=dict(l=0, r=0, t=40, b=0),
            legend=dict(
                x=0.01, y=0.99, bgcolor="rgba(15,20,40,0.8)",
                bordercolor="rgba(100,100,200,0.3)", borderwidth=1,
                font=dict(size=11),
            ),
        )
        st.plotly_chart(fig_globe, use_container_width=True)
        st.caption("Fais glisser pour faire tourner le globe !")
    else:
        st.info("Aucun evenement avec coordonnees.")

    # Graphiques
    st.markdown("---")
    tab1, tab2 = st.tabs(["Repartition", "Donnees"])

    with tab1:
        cat_counts = filtered["category"].value_counts().reset_index()
        cat_counts.columns = ["Categorie", "Nombre"]
        cat_counts["Francais"] = cat_counts["Categorie"].map(lambda c: GLOSSARY.get(c, (c,))[0])
        fig = px.bar(
            cat_counts, x="Francais", y="Nombre", color="Nombre",
            color_continuous_scale=["#6366f1", "#a78bfa", "#f59e0b"],
            title="Evenements par categorie",
        )
        fig.update_layout(**PLOTLY_LAYOUT)
        st.plotly_chart(fig, use_container_width=True)

    with tab2:
        st.dataframe(
            filtered[["title", "category", "date"]].head(100),
            use_container_width=True, height=400,
        )

    # === Catastrophes naturelles celebres ===
    st.markdown("---")
    st.markdown("### Catastrophes naturelles celebres")
    st.markdown("*Les evenements qui ont marque l&#39;histoire*")

    for i in range(0, len(FAMOUS_DISASTERS), 2):
        cols = st.columns(2)
        for j, col in enumerate(cols):
            if i + j < len(FAMOUS_DISASTERS):
                d = FAMOUS_DISASTERS[i + j]
                with col:
                    html = (
                        f'<div class="card" style="border-left:4px solid {d["color"]};">'
                        f'<h4>{d["emoji"]} {d["name"]} <span style="color:#94a3b8;font-size:0.85rem;">({d["year"]})</span></h4>'
                        f'<p style="color:#8b5cf6;font-size:0.85rem;">{d["type"]}</p>'
                        f'<p>{d["impact"]}</p>'
                        f'</div>'
                    )
                    st.markdown(html, unsafe_allow_html=True)

    # === Changement climatique ===
    st.markdown("---")
    st.markdown("### Le changement climatique en chiffres")
    st.markdown(
        '<div class="card" style="border-left:4px solid #ef4444;">'
        "<h4>Pourquoi les catastrophes augmentent ?</h4>"
        "<p>"
        "Depuis 1980, le nombre de catastrophes naturelles a <b>triple</b>. "
        "Le rechauffement climatique rend les oceans plus chauds (tempetes plus violentes), "
        "les secheresses plus longues (incendies), et les glaciers fondent (inondations). "
        "Voici quelques chiffres cles :"
        "</p>"
        "</div>",
        unsafe_allow_html=True,
    )

    cc1, cc2, cc3, cc4 = st.columns(4)
    climate_kpis = [
        ("+1.2 degre C", "Rechauffement depuis 1900", "#ef4444"),
        ("x3", "Catastrophes depuis 1980", "#f59e0b"),
        ("+20 cm", "Montee des mers", "#3b82f6"),
        ("1 M km2", "Banquise perdue / decennie", "#67e8f9"),
    ]
    for col, (val, label, color) in zip([cc1, cc2, cc3, cc4], climate_kpis):
        with col:
            st.markdown(
                f'<div class="kpi-card">'
                f'<div class="kpi-value" style="background:{color};-webkit-background-clip:text;-webkit-text-fill-color:transparent;">{val}</div>'
                f'<div class="kpi-label">{label}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # === Galerie NASA ===
    st.markdown("---")
    st.markdown("### Galerie NASA - Evenements naturels vus de l&#39;espace")

    with st.form("nat_img_search"):
        query = st.text_input("Rechercher des images :", value="wildfire satellite Earth")
        search = st.form_submit_button("Rechercher")

    search_query = query if search else "wildfire satellite Earth"
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

    # === Liens utiles ===
    st.markdown("---")
    st.markdown("### En savoir plus")
    st.markdown(
        '<div class="card">'
        '<ul style="color:#cbd5e1;">'
        '<li><a href="https://eonet.gsfc.nasa.gov/" target="_blank" style="color:#a78bfa;">NASA EONET</a> - Suivi des evenements naturels en temps reel</li>'
        '<li><a href="https://firms.modaps.eosdis.nasa.gov/map/" target="_blank" style="color:#a78bfa;">FIRMS Fire Map</a> - Carte des incendies actifs dans le monde</li>'
        '<li><a href="https://earthquake.usgs.gov/earthquakes/map/" target="_blank" style="color:#a78bfa;">USGS Earthquake Map</a> - Seismes en temps reel</li>'
        '<li><a href="https://worldview.earthdata.nasa.gov/" target="_blank" style="color:#a78bfa;">NASA Worldview</a> - Images satellite en temps reel</li>'
        '<li><a href="https://climate.nasa.gov/" target="_blank" style="color:#a78bfa;">NASA Climate Change</a> - Donnees sur le changement climatique</li>'
        '<li><a href="https://www.windy.com/" target="_blank" style="color:#a78bfa;">Windy.com</a> - Meteo et tempetes en direct</li>'
        '</ul>'
        '</div>',
        unsafe_allow_html=True,
    )

    # Track page
    if "visited_pages" not in st.session_state:
        st.session_state.visited_pages = set()
    st.session_state.visited_pages.add("Evenements Naturels")
