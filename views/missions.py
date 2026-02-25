"""
SolarScope -- Missions Spatiales.
Timeline interactive des grandes missions spatiales historiques et actuelles.
"""

import streamlit as st
import plotly.express as px
import pandas as pd


MISSIONS = [
    {"name": "Spoutnik 1", "annee": 1957, "pays": "URSS", "type": "Satellite", "statut": "Terminee",
     "description": "Le tout premier satellite artificiel ! Il a fait 'bip bip' pendant 21 jours autour de la Terre.",
     "fun": "Spoutnik signifie 'compagnon de voyage' en russe."},

    {"name": "Vostok 1 (Gagarine)", "annee": 1961, "pays": "URSS", "type": "Vol habite", "statut": "Terminee",
     "description": "Youri Gagarine devient le premier humain dans l'espace ! Son vol a dure 108 minutes.",
     "fun": "Gagarine a dit 'Poiekhali !' (C'est parti !) au decollage."},

    {"name": "Apollo 11", "annee": 1969, "pays": "USA", "type": "Vol habite", "statut": "Terminee",
     "description": "Neil Armstrong et Buzz Aldrin marchent sur la Lune. 'Un petit pas pour l'homme, un bond de geant pour l'humanite.'",
     "fun": "Armstrong a failli ne pas atterrir : il restait 25 secondes de carburant !"},

    {"name": "Voyager 1", "annee": 1977, "pays": "USA", "type": "Sonde", "statut": "Active",
     "description": "La sonde la plus lointaine de l'humanite. Elle est maintenant dans l'espace interstellaire, a plus de 24 milliards de km !",
     "fun": "Voyager 1 emporte un disque d'or avec des sons de la Terre, au cas ou des extraterrestres le trouveraient."},

    {"name": "Hubble", "annee": 1990, "pays": "USA/ESA", "type": "Telescope", "statut": "Active",
     "description": "Le telescope spatial qui a revolutionne notre vision de l'Univers. Il a photographie des galaxies a 13 milliards d'annees-lumiere.",
     "fun": "Hubble fait le tour de la Terre en 97 minutes, a 547 km d'altitude."},

    {"name": "Station Spatiale (ISS)", "annee": 1998, "pays": "International", "type": "Station", "statut": "Active",
     "description": "Un laboratoire de la taille d'un terrain de football qui orbite a 400 km. Des astronautes y vivent en permanence depuis 2000.",
     "fun": "L'ISS est visible a l'oeil nu ! Elle ressemble a une etoile brillante qui se deplace."},

    {"name": "Curiosity (Mars)", "annee": 2012, "pays": "USA", "type": "Rover", "statut": "Active",
     "description": "Un rover de la taille d'une voiture qui explore le cratere Gale sur Mars. Il a decouvert que Mars avait un jour des conditions favorables a la vie.",
     "fun": "Curiosity se chante 'Joyeux anniversaire' chaque annee, tout seul sur Mars !"},

    {"name": "Rosetta / Philae", "annee": 2014, "pays": "ESA", "type": "Sonde", "statut": "Terminee",
     "description": "Premiere sonde a se mettre en orbite autour d'une comete et a y poser un atterrisseur (Philae).",
     "fun": "Le voyage a dure 10 ans pour atteindre la comete Tchouri !"},

    {"name": "New Horizons (Pluton)", "annee": 2015, "pays": "USA", "type": "Sonde", "statut": "Active",
     "description": "Premiere sonde a survoler Pluton ! Elle a revele un monde avec des montagnes de glace et un coeur geant.",
     "fun": "New Horizons contient une partie des cendres de Clyde Tombaugh, le decouvreur de Pluton."},

    {"name": "James Webb (JWST)", "annee": 2021, "pays": "USA/ESA/CSA", "type": "Telescope", "statut": "Active",
     "description": "Le plus puissant telescope spatial jamais construit. Il observe l'Univers en infrarouge et voit les premieres galaxies nees apres le Big Bang.",
     "fun": "Son miroir fait 6.5 metres de diametre, mais il est si poli que la surface n'a que 25 nanometres d'irregularites."},

    {"name": "Perseverance (Mars)", "annee": 2021, "pays": "USA", "type": "Rover", "statut": "Active",
     "description": "Le dernier rover martien, accompagne d'Ingenuity, le premier helicoptere a voler sur une autre planete !",
     "fun": "Le nom 'Perseverance' a ete choisi par un eleve de 7eme annee lors d'un concours."},

    {"name": "Artemis I", "annee": 2022, "pays": "USA", "type": "Vol habite", "statut": "Terminee",
     "description": "Premier vol du programme Artemis. La capsule Orion a fait le tour de la Lune sans equipage.",
     "fun": "L'objectif d'Artemis : renvoyer des humains sur la Lune d'ici 2026, dont la premiere femme !"},

    {"name": "JUICE", "annee": 2023, "pays": "ESA", "type": "Sonde", "statut": "Active",
     "description": "Mission vers Jupiter et ses lunes glacees (Europe, Ganymede, Callisto) pour chercher des oceans et de la vie.",
     "fun": "JUICE arrivera pres de Jupiter en 2031, apres 8 ans de voyage !"},

    {"name": "Artemis II", "annee": 2025, "pays": "USA/CSA", "type": "Vol habite", "statut": "Active",
     "description": "Premier vol habite du programme Artemis. 4 astronautes feront le tour de la Lune.",
     "fun": "L'astronaute canadien Jeremy Hansen sera le premier non-Americain a survoler la Lune."},
]


def render(_conn):
    st.markdown(
        "<h2 class='title-style'>🚀 Missions Spatiales</h2>",
        unsafe_allow_html=True,
    )
    st.markdown(
        "<p class='subtitle'>De Spoutnik a Artemis : 70 ans d'aventures humaines dans l'espace !</p>",
        unsafe_allow_html=True,
    )

    # === Intro ===
    st.markdown(
        """
        <div class='card'>
            <h4>70 ans d'exploration spatiale</h4>
            <p>
                Depuis le premier satellite <b>Spoutnik</b> en 1957, l'humanite n'a jamais 
                cesse d'explorer l'espace. Des premiers pas sur la Lune aux rovers sur Mars, 
                en passant par les telescopes qui voient les premieres lumieres de l'Univers, 
                chaque mission repousse les limites de notre connaissance. 
                Voici les missions qui ont marque l'histoire !
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # === KPIs ===
    total = len(MISSIONS)
    active = sum(1 for m in MISSIONS if m["statut"] == "Active")
    pays_count = len(set(m["pays"] for m in MISSIONS))

    c1, c2, c3 = st.columns(3)
    for col, (label, val) in zip([c1, c2, c3], [
        ("Missions", f"{total}"), ("Actives", f"{active}"), ("Pays/Agences", f"{pays_count}")
    ]):
        with col:
            st.markdown(
                f"<div class='kpi-card'><div class='kpi-value'>{val}</div><div class='kpi-label'>{label}</div></div>",
                unsafe_allow_html=True,
            )

    st.markdown("<br>", unsafe_allow_html=True)

    # === Timeline Plotly ===
    df = pd.DataFrame(MISSIONS)
    type_colors = {
        "Satellite": "#94a3b8", "Vol habite": "#6366f1", "Sonde": "#f59e0b",
        "Telescope": "#10b981", "Rover": "#ef4444", "Station": "#3b82f6",
    }
    type_emojis = {
        "Satellite": "📡", "Vol habite": "👨‍🚀", "Sonde": "🛸",
        "Telescope": "🔭", "Rover": "🤖", "Station": "🛰️",
    }

    fig = px.scatter(
        df, x="annee", y="type", color="type", size=[20] * len(df),
        hover_name="name", hover_data={"annee": True, "pays": True, "statut": True, "type": False},
        title="Timeline des missions spatiales",
        labels={"annee": "Annee", "type": "Type de mission"},
        color_discrete_map=type_colors,
    )
    fig.update_layout(
        template="plotly_dark",
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="Outfit, sans-serif", color="#94a3b8"),
        showlegend=True,
        yaxis=dict(categoryorder="array", categoryarray=["Satellite", "Vol habite", "Sonde", "Telescope", "Station", "Rover"]),
        height=400,
    )
    fig.update_traces(marker=dict(size=18, line=dict(width=1, color="white")))
    st.plotly_chart(fig, use_container_width=True)

    # === Filtres ===
    st.markdown("---")
    col1, col2 = st.columns(2)
    with col1:
        type_filter = st.multiselect("Filtrer par type :", list(type_colors.keys()), default=list(type_colors.keys()))
    with col2:
        statut_filter = st.radio("Statut :", ["Toutes", "Actives", "Terminees"], horizontal=True)

    filtered = [m for m in MISSIONS if m["type"] in type_filter]
    if statut_filter == "Actives":
        filtered = [m for m in filtered if m["statut"] == "Active"]
    elif statut_filter == "Terminees":
        filtered = [m for m in filtered if m["statut"] == "Terminee"]

    # === Cartes des missions ===
    st.markdown(f"### {len(filtered)} mission{'s' if len(filtered) > 1 else ''}")

    for mission in filtered:
        status_color = "#10b981" if mission["statut"] == "Active" else "#64748b"
        type_color = type_colors.get(mission["type"], "#94a3b8")
        type_emoji = type_emojis.get(mission["type"], "🚀")
        # Badge animé pour missions actives
        if mission["statut"] == "Active":
            status_badge = (
                '<span style="display:inline-flex;align-items:center;gap:5px;'
                'font-size:0.75rem;padding:2px 8px;border-radius:12px;'
                f'background:#10b98120;color:#10b981;">'
                '<span style="width:7px;height:7px;background:#10b981;border-radius:50%;'
                'display:inline-block;animation:pulse 1.5s infinite;"></span> Active</span>'
            )
        else:
            status_badge = f'<span style="font-size:0.75rem;padding:2px 8px;border-radius:12px;background:#64748b20;color:#64748b;">Terminee</span>'

        st.markdown(
            f'<div class="card" style="border-left:4px solid {type_color};">'
            f'<div style="display:flex;justify-content:space-between;align-items:center;">'
            f'<h4 style="margin:0;">{type_emoji} {mission["name"]}</h4>'
            f'<div>'
            f'<span style="font-size:0.75rem;padding:2px 8px;border-radius:12px;'
            f'background:{type_color}20;color:{type_color};">{mission["type"]}</span> '
            f'{status_badge}'
            f'</div></div>'
            f'<p style="color:#8b5cf6;font-size:0.85rem;margin:0.3rem 0;">'
            f'{mission["annee"]} &middot; {mission["pays"]}</p>'
            f'<p style="color:#cbd5e1;">{mission["description"]}</p>'
            f'<p style="color:#f59e0b;font-size:0.9rem;">Le savais-tu ? {mission["fun"]}</p>'
            f'</div>',
            unsafe_allow_html=True,
        )
