"""
SolarScope -- Activite Solaire.
DONKI data + NOAA Space Weather + contenu educatif riche.
"""

import streamlit as st
import pandas as pd
import requests
import plotly.express as px
from datetime import datetime

PLOTLY_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Outfit, sans-serif", color="#94a3b8"),
)

SOLAR_GLOSSARY = {
    "CME (Ejection de Masse Coronale)": "Une gigantesque bulle de plasma et de champ magnetique ejectee du Soleil. Elle peut atteindre la Terre en 1 a 3 jours.",
    "Eruption solaire (Flare)": "Un flash intense de lumiere et de rayonnement provenant de la surface du Soleil. Classe de A (faible) a X (extreme).",
    "Vent solaire": "Un flux continu de particules chargees expulsees du Soleil a 400-800 km/s.",
    "Aurore boreale/australe": "Des lumieres colorees dans le ciel, creees quand les particules solaires interagissent avec l'atmosphere terrestre.",
    "Tache solaire": "Une zone sombre et froide a la surface du Soleil, causee par des champs magnetiques intenses.",
    "Cycle solaire": "Le Soleil a un cycle d'activite de 11 ans. En 2026, nous sommes pres du maximum solaire !",
    "Magnetosphere": "Le bouclier magnetique de la Terre qui nous protege des particules solaires.",
}


def _get_noaa_data():
    """Recupere les donnees de meteo spatiale de la NOAA."""
    results = {}
    try:
        # Indices Kp (activite geomagnetique)
        r = requests.get(
            "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
            timeout=10,
        )
        if r.status_code == 200:
            data = r.json()
            if len(data) > 1:  # header + data
                results["kp"] = data[1:][-24:]  # dernières 24 entrées
    except Exception:
        pass

    try:
        # Flux solaire
        r = requests.get(
            "https://services.swpc.noaa.gov/json/f107_cm_flux.json",
            timeout=10,
        )
        if r.status_code == 200:
            results["flux"] = r.json()[:30]
    except Exception:
        pass

    try:
        # Alertes en cours
        r = requests.get(
            "https://services.swpc.noaa.gov/products/alerts.json",
            timeout=10,
        )
        if r.status_code == 200:
            results["alerts"] = r.json()[:5]
    except Exception:
        pass

    return results


def render(conn):
    st.markdown(
        "<h2 class='title-style'>Activite Solaire</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Meteo de l'espace en temps reel et eruptions solaires</p>",
        unsafe_allow_html=True,
    )

    # === Explication educative ===
    st.markdown(
        """
        <div class='card'>
            <h4>Le Soleil, une etoile agitee !</h4>
            <p>
                Le Soleil n'est pas une simple boule de lumiere tranquille. C'est un enorme 
                reacteur nucleaire qui produit des <b>explosions</b>, des <b>eruptions</b> 
                et des <b>tempetes magnetiques</b>. Ces evenements s'appellent la <b>meteo spatiale</b>.
            </p>
            <p>
                Quand le Soleil "eternue" (une <b>CME</b>), il envoie des milliards de tonnes 
                de particules vers la Terre a des millions de km/h. Heureusement, la <b>magnetosphere</b> 
                de la Terre nous protege ! Mais ces particules creent aussi les magnifiques 
                <b>aurores boreales</b>.
            </p>
            <p>
                Le Soleil a un <b>cycle de 11 ans</b>. En 2026, nous sommes pres du 
                <b>maximum solaire</b>, ce qui signifie plus d'eruptions et plus d'aurores boreales !
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # === Glossaire solaire ===
    with st.expander("Glossaire : comprendre la meteo spatiale"):
        cols = st.columns(2)
        for i, (terme, explication) in enumerate(SOLAR_GLOSSARY.items()):
            with cols[i % 2]:
                st.markdown(
                    f"""
                    <div class='card' style='padding: 0.8rem;'>
                        <b style='color: #f59e0b;'>{terme}</b><br>
                        <span style='color: #cbd5e1; font-size: 0.85rem;'>{explication}</span>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

    # === Donnees NOAA en temps reel ===
    st.markdown("---")
    st.markdown("### Meteo spatiale en direct (NOAA)")
    st.markdown("*Donnees du Space Weather Prediction Center — mises a jour toutes les heures*")

    noaa = _get_noaa_data()

    if noaa.get("kp"):
        # Indice Kp
        try:
            kp_data = []
            for entry in noaa["kp"]:
                kp_data.append({
                    "Date": entry[0],
                    "Kp": float(entry[1]),
                })
            kp_df = pd.DataFrame(kp_data)
            latest_kp = kp_df["Kp"].iloc[-1]

            # Interpretation
            if latest_kp < 3:
                kp_status = "Calme"
                kp_color = "#10b981"
            elif latest_kp < 5:
                kp_status = "Actif"
                kp_color = "#f59e0b"
            elif latest_kp < 7:
                kp_status = "Tempete !"
                kp_color = "#ef4444"
            else:
                kp_status = "Tempete severe !"
                kp_color = "#dc2626"

            c1, c2, c3 = st.columns(3)
            with c1:
                st.markdown(
                    f"""
                    <div class='kpi-card'>
                        <div class='kpi-value' style='color: {kp_color}; -webkit-text-fill-color: {kp_color};'>{latest_kp:.1f}</div>
                        <div class='kpi-label'>Indice Kp actuel</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
            with c2:
                st.markdown(
                    f"""
                    <div class='kpi-card'>
                        <div class='kpi-value' style='color: {kp_color}; -webkit-text-fill-color: {kp_color};'>{kp_status}</div>
                        <div class='kpi-label'>Niveau d'activite</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )
            with c3:
                st.markdown(
                    f"""
                    <div class='kpi-card'>
                        <div class='kpi-value'>{datetime.now().strftime('%H:%M')}</div>
                        <div class='kpi-label'>Derniere MAJ</div>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

            st.markdown("<br>", unsafe_allow_html=True)

            # Graphique Kp
            fig = px.bar(
                kp_df, x="Date", y="Kp",
                title="Indice Kp des dernieres heures (activite geomagnetique)",
                color="Kp",
                color_continuous_scale=["#10b981", "#f59e0b", "#ef4444"],
                labels={"Kp": "Indice Kp", "Date": "Date/Heure"},
            )
            fig.add_hline(y=5, line_dash="dash", line_color="#ef4444", annotation_text="Seuil tempete")
            fig.update_layout(**PLOTLY_LAYOUT)
            st.plotly_chart(fig, use_container_width=True)

            # Explication Kp
            st.markdown(
                """
                <div class='card' style='padding: 0.8rem;'>
                    <b style='color: #a78bfa;'>Comprendre l'indice Kp :</b>
                    <ul style='color: #cbd5e1; margin-top: 0.3rem;'>
                        <li><b style='color: #10b981;'>0-2</b> : Calme — rien de special</li>
                        <li><b style='color: #f59e0b;'>3-4</b> : Actif — aurores possibles aux poles</li>
                        <li><b style='color: #ef4444;'>5-6</b> : Tempete geomagnetique — aurores visibles plus au sud</li>
                        <li><b style='color: #dc2626;'>7-9</b> : Tempete severe — perturbations possibles des satellites et GPS</li>
                    </ul>
                </div>
                """,
                unsafe_allow_html=True,
            )
        except Exception:
            st.info("Donnees Kp temporairement indisponibles.")

    if noaa.get("alerts"):
        st.markdown("### Alertes en cours (NOAA)")
        for alert in noaa["alerts"][:3]:
            msg = alert.get("message", "")
            if msg:
                st.warning(msg[:500])

    # === Images du Soleil en direct (SDO) ===
    st.markdown("---")
    st.markdown("### Le Soleil en direct")
    st.markdown("*Images du Solar Dynamics Observatory (SDO) de la NASA — mises a jour en temps reel*")

    sdo_images = [
        {
            "label": "Lumiere visible (AIA 171)",
            "url": "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0171.jpg",
            "desc": "Couronne solaire en ultraviolet (Fe IX, 600 000 degres)",
        },
        {
            "label": "AIA 304 - Chromosphere",
            "url": "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0304.jpg",
            "desc": "Filaments et protuberances (He II, 50 000 degres)",
        },
        {
            "label": "AIA 193 - Corona chaude",
            "url": "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_0193.jpg",
            "desc": "Zones actives et eruptions (Fe XII, 1.2 million degres)",
        },
        {
            "label": "Magnetogramme (HMI)",
            "url": "https://sdo.gsfc.nasa.gov/assets/img/latest/latest_1024_HMIB.jpg",
            "desc": "Champ magnetique a la surface — blanc=nord, noir=sud",
        },
    ]

    sdo_cols = st.columns(4)
    for i, img in enumerate(sdo_images):
        with sdo_cols[i]:
            try:
                st.image(img["url"], caption=img["label"], use_column_width=True)
                st.markdown(
                    f'<p style="font-size:0.75rem;color:#64748b;text-align:center;">{img["desc"]}</p>',
                    unsafe_allow_html=True,
                )
            except Exception:
                st.markdown(f"[{img['label']}]({img['url']})")
    st.caption("Source : NASA Solar Dynamics Observatory — images mises a jour toutes les quelques minutes")

    # === Eruptions solaires celebres ===
    st.markdown("---")
    st.markdown("### Eruptions solaires celebres")

    famous_solar = [
        {
            "name": "Evenement Carrington",
            "year": "1859",
            "emoji": "⚡",
            "color": "#ef4444",
            "desc": "La plus grande tempete solaire jamais enregistree ! Les aurores etaient visibles jusqu'en Floride et a Cuba. Les telegraphes ont pris feu spontanement.",
            "fun": "Si un tel evenement se produisait aujourd'hui, il detruirait nos satellites, GPS et reseaux electriques. Cout estime : 10 000 milliards de dollars !",
        },
        {
            "name": "Tempetes d'Halloween",
            "year": "2003",
            "emoji": "🎃",
            "color": "#f97316",
            "desc": "Deux eruptions X17 et X28 en quelques jours. Les astronautes de l'ISS se sont refugies dans les capsules Soyuz. Plusieurs satellites ont ete endommages.",
            "fun": "L'eruption X28 etait si intense que les instruments de mesure ont sature ! On pense qu'elle etait probablement X40 ou plus.",
        },
        {
            "name": "Tempete solaire de mai 2024",
            "year": "2024",
            "emoji": "🌌",
            "color": "#8b5cf6",
            "desc": "La plus puissante depuis 2003 ! Des aurores boreales ont ete visibles en France, Espagne et meme en Afrique du Nord. Tempete Kp9 (niveau maximal).",
            "fun": "Des milliers d'Europeens ont pu voir des aurores pour la premiere fois de leur vie ! Les reseaux sociaux ont explose de photos spectaculaires.",
        },
        {
            "name": "Eruption X9.3",
            "year": "2017",
            "emoji": "🔥",
            "color": "#f59e0b",
            "desc": "La plus grande eruption du cycle solaire 24. Elle a perturbe les communications radio sur tout le cote ensoleille de la Terre pendant 1 heure.",
            "fun": "L'eruption provenait d'une tache solaire (AR 2673) si grande qu'on pouvait la voir a l'oeil nu avec un filtre solaire !",
        },
    ]

    for i in range(0, len(famous_solar), 2):
        cols = st.columns(2)
        for j, col in enumerate(cols):
            if i + j < len(famous_solar):
                ev = famous_solar[i + j]
                desc = ev["desc"].replace("'", "&#39;")
                fun = ev["fun"].replace("'", "&#39;")
                with col:
                    st.markdown(
                        f'<div class="card" style="border-left:4px solid {ev["color"]};">'
                        f'<h4>{ev["emoji"]} {ev["name"]} <span style="color:#94a3b8;font-size:0.85rem;">({ev["year"]})</span></h4>'
                        f'<p>{desc}</p>'
                        f'<p style="color:#f59e0b;font-size:0.9rem;">Le savais-tu ? {fun}</p>'
                        f'</div>',
                        unsafe_allow_html=True,
                    )

    # === Videos educatives ===
    st.markdown("---")
    st.markdown("### Videos educatives")

    solar_videos = [
        {
            "title": "Le Soleil explique aux enfants",
            "url": "https://www.youtube.com/watch?v=jjy-eqWM38g",
            "desc": "Comment fonctionne notre etoile, les eruptions et les aurores.",
            "age": "7-12 ans",
        },
        {
            "title": "La tempete solaire de mai 2024",
            "url": "https://www.youtube.com/watch?v=_3AJlBX3kZs",
            "desc": "Les aurores boreales historiques qui ont illumine l'Europe.",
            "age": "10+ ans",
        },
        {
            "title": "Les aurores boreales : comment ca marche ?",
            "url": "https://www.youtube.com/watch?v=GCm_F2Ztnc8",
            "desc": "Pourquoi le ciel devient vert, rouge et violet pres des poles.",
            "age": "8-14 ans",
        },
        {
            "title": "C'est pas Sorcier — Le Soleil",
            "url": "https://www.youtube.com/watch?v=HrA-1CSWTBA",
            "desc": "Fred et Jamy au coeur de notre etoile.",
            "age": "7-14 ans",
        },
    ]

    vid_cols = st.columns(2)
    for i, video in enumerate(solar_videos):
        with vid_cols[i % 2]:
            title = video["title"].replace("'", "&#39;")
            desc = video["desc"].replace("'", "&#39;")
            st.markdown(
                f'<div class="card">'
                f'<h4>{title}</h4>'
                f'<p>{desc}</p>'
                f'<p style="color:#8b5cf6;font-weight:500;">Age : {video["age"]}</p>'
                f'<a href="{video["url"]}" target="_blank" '
                f'style="display:inline-block;padding:0.5rem 1rem;'
                f'background:linear-gradient(135deg,#f59e0b,#ef4444);'
                f'color:white;border-radius:8px;text-decoration:none;font-weight:600;">'
                f'Regarder sur YouTube</a>'
                f'</div>',
                unsafe_allow_html=True,
            )

    # === Liens ===
    st.markdown("---")
    st.markdown("### En savoir plus")
    st.markdown(
        """
        <div class='card'>
            <ul style='color: #cbd5e1;'>
                <li><a href='https://www.spaceweatherlive.com/fr/' target='_blank' style='color: #f59e0b;'>SpaceWeatherLive.com</a> — Meteo spatiale en temps reel (en francais !)</li>
                <li><a href='https://www.swpc.noaa.gov/' target='_blank' style='color: #f59e0b;'>NOAA Space Weather</a> — Centre de prediction officiel</li>
                <li><a href='https://sdo.gsfc.nasa.gov/data/' target='_blank' style='color: #f59e0b;'>SDO (Solar Dynamics Observatory)</a> — Images du Soleil en direct</li>
                <li><a href='https://soho.nascom.nasa.gov/data/realtime-images.html' target='_blank' style='color: #f59e0b;'>SOHO</a> — Images du Soleil en temps reel</li>
            </ul>
        </div>
        """,
        unsafe_allow_html=True,
    )
