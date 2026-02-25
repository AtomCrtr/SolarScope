"""
SolarScope -- Exploration de Mars.
NASA Image Library, Mars Trek 3D, contenu educatif, photos existantes.
"""

import streamlit as st
import pandas as pd
import requests


MARS_FACTS = [
    ("Surnom", "La planete rouge (a cause de l'oxyde de fer a sa surface)"),
    ("Diametre", "6 779 km (environ la moitie de la Terre)"),
    ("Gravite", "3.72 m/s2 (38% de celle de la Terre)"),
    ("Temperature", "-63C en moyenne (-140C a +20C)"),
    ("Atmosphere", "95% de CO2, tres fine (1% de la pression terrestre)"),
    ("Journee", "24h 37min (presque comme sur Terre !)"),
    ("Annee", "687 jours terrestres"),
    ("Lunes", "2 : Phobos et Deimos"),
    ("Plus haut sommet", "Olympus Mons (21 km, 3x l'Everest)"),
    ("Plus grand canyon", "Valles Marineris (4 000 km de long, 7 km de profondeur)"),
]

ROVERS = [
    {
        "name": "Perseverance",
        "launched": "30 juillet 2020",
        "landed": "18 fevrier 2021",
        "status": "Actif",
        "mission": "Chercher des traces de vie ancienne, collecter des echantillons de roche pour un retour futur sur Terre.",
        "fun": "Perseverance transporte Ingenuity, le premier helicoptere a voler sur une autre planete !",
    },
    {
        "name": "Curiosity",
        "launched": "26 novembre 2011",
        "landed": "6 aout 2012",
        "status": "Actif",
        "mission": "Explorer le cratere Gale et determiner si Mars a un jour pu accueillir la vie.",
        "fun": "Curiosity se chante 'Joyeux anniversaire' chaque annee, tout seul sur Mars !",
    },
    {
        "name": "Opportunity",
        "launched": "7 juillet 2003",
        "landed": "25 janvier 2004",
        "status": "Fin de mission (2018)",
        "mission": "Explorer les plaines de Meridiani, chercher des preuves d'eau.",
        "fun": "Prevu pour 90 jours, il a tenu 15 ans ! Son dernier message : 'Ma batterie est faible et il fait nuit.'",
    },
    {
        "name": "Spirit",
        "launched": "10 juin 2003",
        "landed": "4 janvier 2004",
        "status": "Fin de mission (2010)",
        "mission": "Explorer le cratere Gusev, analyser les roches martiennes.",
        "fun": "Spirit a decouvert de la silice, une preuve que Mars avait de l'eau chaude autrefois !",
    },
]


def _search_nasa_images(query, count=8):
    """Cherche des images via la NASA Image Library API."""
    try:
        url = "https://images-api.nasa.gov/search"
        params = {"q": query, "media_type": "image", "page_size": count}
        r = requests.get(url, params=params, timeout=10)
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
                        "description": data.get("description", "")[:200],
                        "date": data.get("date_created", "")[:10],
                        "url": img_url,
                    })
            return results
    except Exception:
        pass
    return []


def render(conn):
    st.markdown(
        "<h2 class='title-style'>🔴 Mars — La Planete Rouge</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Rovers, volcans geants, canyons infinis... Exploration en direct depuis la surface martienne</p>",
        unsafe_allow_html=True,
    )

    # === Intro educative ===
    st.markdown(
        """
        <div class='card'>
            <h4>Pourquoi Mars nous fascine ?</h4>
            <p>
                Mars est la planete la plus etudiee apres la Terre. Elle est <b>rouge</b> 
                a cause de l'oxyde de fer (la rouille !) a sa surface. Depuis des decennies, 
                on y envoie des robots pour repondre a LA grande question : 
                <b>la vie a-t-elle un jour existe sur Mars ?</b>
            </p>
            <p>
                Aujourd'hui, deux rovers sont encore actifs sur Mars : <b>Curiosity</b> (depuis 2012) 
                et <b>Perseverance</b> (depuis 2021). Ils prennent des photos, analysent les roches 
                et cherchent des traces d'eau et de vie ancienne.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # === Mars en chiffres ===
    st.markdown("### Mars en chiffres")
    col1, col2 = st.columns(2)
    for i, (label, value) in enumerate(MARS_FACTS):
        with [col1, col2][i % 2]:
            st.markdown(
                f"""
                <div class='card' style='padding: 0.8rem;'>
                    <b style='color: #ef4444;'>{label}</b><br>
                    <span style='color: #cbd5e1;'>{value}</span>
                </div>
                """,
                unsafe_allow_html=True,
            )

    # === Rovers ===
    st.markdown("---")
    st.markdown("### Les rovers martiens")

    for rover in ROVERS:
        status_color = "#10b981" if rover["status"] == "Actif" else "#64748b"
        st.markdown(
            f"""
            <div class='card' style='border-left: 4px solid {status_color};'>
                <h4>{rover['name']} 
                    <span style='font-size: 0.8rem; padding: 2px 8px; border-radius: 12px; 
                                 background: {status_color}20; color: {status_color};'>
                        {rover['status']}
                    </span>
                </h4>
                <p><b>Lancement :</b> {rover['launched']} | <b>Atterrissage :</b> {rover['landed']}</p>
                <p>{rover['mission']}</p>
                <p style='color: #f59e0b;'>Le savais-tu ? {rover['fun']}</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # === Mars Trek 3D ===
    st.markdown("---")
    st.markdown("### Explore Mars en 3D")
    st.markdown(
        """
        <div class='card'>
            <h4>Mars Trek — La carte 3D de la NASA</h4>
            <p>
                Comme Google Earth mais pour Mars ! Explore les crateres, les volcans 
                et les sites d'atterrissage des rovers en 3D.
            </p>
            <a href='https://trek.nasa.gov/mars/' target='_blank'
               style='display: inline-block; padding: 0.6rem 1.2rem;
                      background: linear-gradient(135deg, #ef4444, #f97316);
                      color: white; border-radius: 8px; text-decoration: none;
                      font-weight: 600; margin-top: 0.5rem;'>
                Ouvrir Mars Trek 3D
            </a>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # === Photos de la base de donnees ===
    st.markdown("---")
    try:
        df = pd.read_sql(
            "SELECT photo_id, camera_name, rover_name, img_src, earth_date "
            "FROM mars_photos ORDER BY earth_date DESC LIMIT 12",
            conn,
        )
        if not df.empty:
            st.markdown(f"### Photos des rovers ({len(df)} dernieres)")
            st.info("Ces photos datent d'avril 2025. L'API Mars Rover est temporairement indisponible.")
            cols = st.columns(4)
            for i, (_, row) in enumerate(df.iterrows()):
                with cols[i % 4]:
                    st.image(row["img_src"], caption=f"{row['camera_name']} | {row['earth_date']}", use_column_width=True)
    except Exception:
        pass

    # === NASA Image Library — recherche ===
    st.markdown("---")
    st.markdown("### Galerie NASA — Images de Mars")
    st.markdown("*Images de la NASA Image Library (toujours disponible !)*")

    with st.form("mars_search"):
        query = st.text_input("Rechercher des images :", value="Mars rover Perseverance")
        search = st.form_submit_button("Rechercher")

    if search and query:
        with st.spinner("Recherche dans la NASA Image Library..."):
            images = _search_nasa_images(query, count=12)

        if images:
            st.markdown(f"**{len(images)}** images trouvees")
            cols = st.columns(4)
            for i, img in enumerate(images):
                with cols[i % 4]:
                    try:
                        st.image(img["url"], caption=img["title"][:60], use_column_width=True)
                    except Exception:
                        st.markdown(f"[{img['title']}]({img['url']})")
        else:
            st.info("Aucune image trouvee. Essaie un autre terme !")
    elif not search:
        # Charger des images par defaut
        with st.spinner("Chargement de la galerie..."):
            images = _search_nasa_images("Mars landscape rover", count=8)
        if images:
            cols = st.columns(4)
            for i, img in enumerate(images):
                with cols[i % 4]:
                    try:
                        st.image(img["url"], caption=img["title"][:60], use_column_width=True)
                    except Exception:
                        pass

    # === Liens utiles ===
    st.markdown("---")
    st.markdown("### En savoir plus")
    st.markdown(
        """
        <div class='card'>
            <ul style='color: #cbd5e1;'>
                <li><a href='https://mars.nasa.gov/' target='_blank' style='color: #a78bfa;'>mars.nasa.gov</a> — Le site officiel de la NASA sur Mars</li>
                <li><a href='https://trek.nasa.gov/mars/' target='_blank' style='color: #a78bfa;'>Mars Trek 3D</a> — Carte interactive en 3D</li>
                <li><a href='https://mars.nasa.gov/mars2020/multimedia/raw-images/' target='_blank' style='color: #a78bfa;'>Raw Images Perseverance</a> — Les toutes dernieres photos</li>
                <li><a href='https://www.youtube.com/watch?v=gwinFP8_qjI' target='_blank' style='color: #a78bfa;'>L'atterrissage de Perseverance</a> — Video officielle NASA (YouTube)</li>
            </ul>
        </div>
        """,
        unsafe_allow_html=True,
    )
