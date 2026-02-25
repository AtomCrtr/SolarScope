"""
SolarScope -- Planetes et Lunes du Systeme Solaire.
Affiche toutes les planetes en grille, puis details au clic.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go


def _hex_to_rgba(hex_color, alpha=0.2):
    """Convertit un hex (#rrggbb) en rgba(r,g,b,a) pour Plotly."""
    h = hex_color.lstrip('#')
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f'rgba({r},{g},{b},{alpha})'

PLOTLY_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Outfit, sans-serif", color="#94a3b8"),
)

PLANETS = [
    {"name": "Mercure", "emoji": "☿", "englishName": "Mercury", "gravity": 3.7, "meanRadius": 2439.7, "avgTemp": 440, "density": 5.43, "distSun": 57.9, "moons": 0, "orbit_days": 88, "description": "La plus petite et la plus proche du Soleil. Pas d'atmosphere, temperatures extremes de -180 C la nuit a 430 C le jour.", "color": "#94a3b8"},
    {"name": "Venus", "emoji": "♀", "englishName": "Venus", "gravity": 8.87, "meanRadius": 6051.8, "avgTemp": 737, "density": 5.24, "distSun": 108.2, "moons": 0, "orbit_days": 225, "description": "La plus chaude ! Son atmosphere epaisse de CO2 piege la chaleur. Le Soleil s'y leve a l'Ouest car elle tourne a l'envers.", "color": "#f59e0b"},
    {"name": "Terre", "emoji": "🌍", "englishName": "Earth", "gravity": 9.81, "meanRadius": 6371.0, "avgTemp": 288, "density": 5.51, "distSun": 149.6, "moons": 1, "orbit_days": 365, "description": "Notre maison ! La seule planete connue a abriter la vie. 71% de sa surface est couverte d'eau.", "color": "#3b82f6"},
    {"name": "Mars", "emoji": "♂", "englishName": "Mars", "gravity": 3.72, "meanRadius": 3389.5, "avgTemp": 210, "density": 3.93, "distSun": 227.9, "moons": 2, "orbit_days": 687, "description": "La planete rouge. Des rovers l'explorent pour chercher des traces de vie. Olympus Mons est le plus grand volcan du systeme solaire (21 km).", "color": "#ef4444"},
    {"name": "Jupiter", "emoji": "♃", "englishName": "Jupiter", "gravity": 24.79, "meanRadius": 69911, "avgTemp": 165, "density": 1.33, "distSun": 778.5, "moons": 95, "orbit_days": 4333, "description": "La geante gazeuse ! Sa Grande Tache Rouge est une tempete plus grande que la Terre qui dure depuis 350 ans.", "color": "#f97316"},
    {"name": "Saturne", "emoji": "♄", "englishName": "Saturn", "gravity": 10.44, "meanRadius": 58232, "avgTemp": 134, "density": 0.69, "distSun": 1434, "moons": 146, "orbit_days": 10759, "description": "Celebre pour ses anneaux magnifiques faits de milliards de morceaux de glace et de roche. Si legere qu'elle flotterait sur l'eau !", "color": "#eab308"},
    {"name": "Uranus", "emoji": "♅", "englishName": "Uranus", "gravity": 8.69, "meanRadius": 25362, "avgTemp": 76, "density": 1.27, "distSun": 2871, "moons": 28, "orbit_days": 30687, "description": "La planete qui 'roule' sur le cote ! Decouverte en 1781 au telescope. Il y pleut peut-etre des diamants.", "color": "#67e8f9"},
    {"name": "Neptune", "emoji": "♆", "englishName": "Neptune", "gravity": 11.15, "meanRadius": 24622, "avgTemp": 72, "density": 1.64, "distSun": 4495, "moons": 16, "orbit_days": 60190, "description": "La plus lointaine et la plus venteuse. Vents a 2 100 km/h ! Decouverte en 1846 grace aux mathematiques.", "color": "#6366f1"},
]

FACTS = {
    "Mercure": "Mercure n'a pas d'atmosphere. En une journee, il fait 430 C le jour et -180 C la nuit !",
    "Venus": "Venus tourne dans le sens inverse des autres planetes. Un jour sur Venus dure plus longtemps qu'une annee !",
    "Terre": "La Terre est la seule planete qui n'est pas nommee d'apres un dieu romain.",
    "Mars": "Mars a le plus grand canyon du systeme solaire : Valles Marineris, 4 000 km de long !",
    "Jupiter": "Jupiter protege la Terre en attirant les asteroides grace a sa gravite enorme.",
    "Saturne": "Les anneaux de Saturne sont immenses mais tres fins : seulement 10 metres d'epaisseur !",
    "Uranus": "Uranus a ete la premiere planete decouverte avec un telescope, par William Herschel en 1781.",
    "Neptune": "Neptune a un satellite, Triton, qui tourne a l'envers. Il pourrait un jour se briser et former des anneaux.",
}


def render(_conn):
    st.markdown(
        "<h2 class='title-style'>Planetes et Lunes</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>Explorez les 8 planetes du systeme solaire</p>",
        unsafe_allow_html=True,
    )

    # === Introduction educative ===
    st.markdown(
        """
        <div class='card'>
            <h4>Le systeme solaire en bref</h4>
            <p>
                Notre systeme solaire est compose de 8 planetes qui tournent autour du Soleil.
                Les 4 premieres (Mercure, Venus, Terre, Mars) sont des <b>planetes rocheuses</b>,
                petites et solides. Les 4 suivantes (Jupiter, Saturne, Uranus, Neptune) sont des 
                <b>planetes gazeuses</b> (ou de glace), beaucoup plus grandes mais sans surface solide.
                Clique sur une planete pour en savoir plus !
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # === Grille des 8 planetes (cliquables) ===
    if "selected_planet" not in st.session_state:
        st.session_state.selected_planet = "Terre"

    row1 = st.columns(4)
    row2 = st.columns(4)
    all_cols = row1 + row2

    for i, p in enumerate(PLANETS):
        with all_cols[i]:
            is_selected = st.session_state.selected_planet == p["name"]
            border = f"border: 2px solid {p['color']};" if is_selected else f"border-color: {p['color']}40;"
            if st.button(f"{p['emoji']} {p['name']}", key=f"btn_{p['name']}", use_container_width=True):
                st.session_state.selected_planet = p["name"]
                st.rerun()
            st.markdown(
                f"<p style='text-align:center; font-size:0.8rem; color:#94a3b8; margin-top:-0.5rem;'>"
                f"{p['meanRadius']:,.0f} km &middot; {p['moons']} lune{'s' if p['moons'] != 1 else ''}</p>",
                unsafe_allow_html=True,
            )

    # === Details de la planete selectionnee ===
    st.markdown("---")
    selected_name = st.session_state.selected_planet
    planet = next(p for p in PLANETS if p["name"] == selected_name)
    st.markdown(f"### {planet['emoji']} {planet['name']}")

    col1, col2 = st.columns([1, 2])

    with col1:
        st.markdown(
            f"""
            <div class='card' style='border-left: 4px solid {planet["color"]};'>
                <div style='font-size: 3rem; text-align: center;'>{planet["emoji"]}</div>
                <h3 style='text-align: center;'>{planet["name"]}</h3>
                <p>{planet["description"]}</p>
                <hr style='border-color: rgba(255,255,255,0.1);'>
                <p><b>Gravite :</b> {planet["gravity"]} m/s2</p>
                <p><b>Rayon :</b> {planet["meanRadius"]:,.0f} km</p>
                <p><b>Temperature :</b> {planet["avgTemp"]} K</p>
                <p><b>Densite :</b> {planet["density"]} g/cm3</p>
                <p><b>Distance au Soleil :</b> {planet["distSun"]} M km</p>
                <p><b>Orbite :</b> {planet["orbit_days"]:,} jours</p>
                <p><b>Lunes :</b> {planet["moons"]}</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col2:
        tab1, tab2, tab3 = st.tabs(["Rayons", "Gravite", "Temperature"])

        df = pd.DataFrame(PLANETS)

        with tab1:
            fig = px.bar(
                df, x="name", y="meanRadius", color="meanRadius",
                color_continuous_scale=["#6366f1", "#a78bfa", "#f59e0b"],
                title="Rayon moyen (km)",
                labels={"name": "Planete", "meanRadius": "Rayon (km)"},
            )
            fig.update_layout(**PLOTLY_LAYOUT)
            st.plotly_chart(fig, use_container_width=True)

        with tab2:
            fig2 = px.bar(
                df, x="name", y="gravity", color="gravity",
                color_continuous_scale=["#10b981", "#3b82f6", "#ef4444"],
                title="Gravite de surface (m/s2)",
                labels={"name": "Planete", "gravity": "Gravite (m/s2)"},
            )
            fig2.update_layout(**PLOTLY_LAYOUT)
            st.plotly_chart(fig2, use_container_width=True)

        with tab3:
            fig3 = px.bar(
                df, x="name", y="avgTemp", color="avgTemp",
                color_continuous_scale=["#3b82f6", "#f59e0b", "#ef4444"],
                title="Temperature moyenne (K)",
                labels={"name": "Planete", "avgTemp": "Temperature (K)"},
            )
            fig3.update_layout(**PLOTLY_LAYOUT)
            st.plotly_chart(fig3, use_container_width=True)

    # Le savais-tu ?
    if selected_name in FACTS:
        st.markdown(
            f"""
            <div class='card' style='border-left: 4px solid {planet["color"]};'>
                <h4>Le savais-tu ?</h4>
                <p>{FACTS[selected_name]}</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    # Tableau comparatif
    st.markdown("---")
    st.markdown("### Tableau comparatif")
    display_df = df[["name", "meanRadius", "gravity", "avgTemp", "density", "distSun", "moons", "orbit_days"]]
    display_df.columns = ["Planete", "Rayon (km)", "Gravite (m/s2)", "Temp (K)", "Densite", "Dist. Soleil (M km)", "Lunes", "Orbite (jours)"]
    st.dataframe(display_df, use_container_width=True, hide_index=True)

    # === Comparateur interactif ===
    st.markdown("---")
    st.markdown("### Comparateur de planetes")
    st.markdown("*Selectionne deux planetes pour les comparer cote a cote !*")

    comp1, comp2 = st.columns(2)
    with comp1:
        p1_name = st.selectbox("Planete 1 :", [p["name"] for p in PLANETS], index=2, key="comp1")
    with comp2:
        p2_name = st.selectbox("Planete 2 :", [p["name"] for p in PLANETS], index=4, key="comp2")

    p1 = next(p for p in PLANETS if p["name"] == p1_name)
    p2 = next(p for p in PLANETS if p["name"] == p2_name)

    if p1_name != p2_name:
        col_a, col_b = st.columns(2)

        for col, p in [(col_a, p1), (col_b, p2)]:
            with col:
                st.markdown(
                    f"""
                    <div class='card' style='text-align: center; border-left: 4px solid {p["color"]};'>
                        <div style='font-size: 3rem;'>{p["emoji"]}</div>
                        <h3>{p["name"]}</h3>
                        <p><b>Rayon :</b> {p["meanRadius"]:,.0f} km</p>
                        <p><b>Gravite :</b> {p["gravity"]} m/s2</p>
                        <p><b>Temperature :</b> {p["avgTemp"]} K</p>
                        <p><b>Densite :</b> {p["density"]} g/cm3</p>
                        <p><b>Distance Soleil :</b> {p["distSun"]} M km</p>
                        <p><b>Lunes :</b> {p["moons"]}</p>
                        <p><b>Orbite :</b> {p["orbit_days"]:,} jours</p>
                    </div>
                    """,
                    unsafe_allow_html=True,
                )

        # Radar chart comparison

        # Normalize values for radar (0-1 scale)
        all_vals = {
            "Gravite": [p["gravity"] for p in PLANETS],
            "Rayon": [p["meanRadius"] for p in PLANETS],
            "Temperature": [p["avgTemp"] for p in PLANETS],
            "Densite": [p["density"] for p in PLANETS],
            "Lunes": [p["moons"] for p in PLANETS],
        }

        categories = list(all_vals.keys())

        def norm(val, key):
            vals = all_vals[key]
            mx = max(vals) if max(vals) > 0 else 1
            return val / mx

        r1 = [norm(p1["gravity"], "Gravite"), norm(p1["meanRadius"], "Rayon"),
              norm(p1["avgTemp"], "Temperature"), norm(p1["density"], "Densite"),
              norm(p1["moons"], "Lunes")]
        r2 = [norm(p2["gravity"], "Gravite"), norm(p2["meanRadius"], "Rayon"),
              norm(p2["avgTemp"], "Temperature"), norm(p2["density"], "Densite"),
              norm(p2["moons"], "Lunes")]

        fig_radar = go.Figure()
        fig_radar.add_trace(go.Scatterpolar(
            r=r1 + [r1[0]], theta=categories + [categories[0]],
            fill='toself', name=p1["name"],
            line_color=p1["color"], fillcolor=_hex_to_rgba(p1["color"], 0.2),
        ))
        fig_radar.add_trace(go.Scatterpolar(
            r=r2 + [r2[0]], theta=categories + [categories[0]],
            fill='toself', name=p2["name"],
            line_color=p2["color"], fillcolor=_hex_to_rgba(p2["color"], 0.2),
        ))
        fig_radar.update_layout(
            **PLOTLY_LAYOUT,
            title=f"{p1['name']} vs {p2['name']}",
            polar=dict(
                bgcolor="rgba(0,0,0,0)",
                radialaxis=dict(visible=True, range=[0, 1], gridcolor="rgba(148,163,184,0.2)"),
                angularaxis=dict(gridcolor="rgba(148,163,184,0.2)"),
            ),
            showlegend=True,
        )
        st.plotly_chart(fig_radar, use_container_width=True)

        # Fun comparison text
        heavier = p1["name"] if p1["gravity"] > p2["gravity"] else p2["name"]
        weight_ratio = max(p1["gravity"], p2["gravity"]) / max(min(p1["gravity"], p2["gravity"]), 0.01)
        st.markdown(
            f"""
            <div class='card'>
                <h4>Le savais-tu ?</h4>
                <p>Si tu peses 30 kg sur Terre, tu peserais <b>{30 * p1['gravity'] / 9.81:.1f} kg</b> sur {p1['name']} 
                et <b>{30 * p2['gravity'] / 9.81:.1f} kg</b> sur {p2['name']} !</p>
                <p>La gravite est <b>{weight_ratio:.1f}x plus forte</b> sur {heavier}.</p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    else:
        st.info("Selectionne deux planetes differentes pour les comparer !")
