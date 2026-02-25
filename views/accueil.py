"""
SolarScope -- Page d'accueil.
Hero, KPIs, recherche Wikipedia, alertes, badges explorateur, SolarBot.
"""

import streamlit as st
import pandas as pd
import requests

PLOTLY_LAYOUT = dict(
    template="plotly_dark",
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Outfit, sans-serif", color="#94a3b8"),
)

# Systeme de badges
BADGES = [
    {"name": "Debutant Spatial", "emoji": "🌱", "pages": 1, "color": "#94a3b8"},
    {"name": "Explorateur Curieux", "emoji": "🔭", "pages": 3, "color": "#6366f1"},
    {"name": "Navigateur Stellaire", "emoji": "🚀", "pages": 5, "color": "#f59e0b"},
    {"name": "Astronome Confirme", "emoji": "⭐", "pages": 8, "color": "#10b981"},
    {"name": "Expert de l'Espace", "emoji": "🏆", "pages": 11, "color": "#ef4444"},
]


def _track_page(page_name):
    """Enregistre une page visitee."""
    if "visited_pages" not in st.session_state:
        st.session_state.visited_pages = set()
    st.session_state.visited_pages.add(page_name)


def _get_badge():
    """Retourne le badge actuel de l'utilisateur."""
    visited = len(st.session_state.get("visited_pages", {"Accueil"}))
    current = BADGES[0]
    for badge in BADGES:
        if visited >= badge["pages"]:
            current = badge
    return current


def render(conn):
    _track_page("Accueil")

    # === HERO ===
    st.markdown(
        """
        <div class='hero'>
            <h1>SolarScope</h1>
            <p>Pars a la decouverte de l'espace et du systeme solaire</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # === Badge Explorateur ===
    badge = _get_badge()
    visited = st.session_state.get("visited_pages", {"🏠 Accueil"})
    total_pages = 11
    progress = len(visited) / total_pages

    st.markdown(
        f"""
        <div class='card' style='text-align: center; border-left: 4px solid {badge["color"]};'>
            <div style='display: flex; align-items: center; justify-content: center; gap: 1rem;'>
                <span style='font-size: 2rem;'>{badge["emoji"]}</span>
                <div>
                    <h4 style='margin: 0; color: {badge["color"]};'>{badge["name"]}</h4>
                    <p style='margin: 0; color: #94a3b8; font-size: 0.85rem;'>
                        {len(visited)}/{total_pages} pages explorees
                    </p>
                </div>
            </div>
            <div style='background: rgba(255,255,255,0.1); border-radius: 10px; height: 8px; margin-top: 0.5rem;'>
                <div style='background: {badge["color"]}; width: {progress*100:.0f}%; height: 100%; border-radius: 10px; transition: width 0.3s;'></div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("<br>", unsafe_allow_html=True)

    # === KPIs ===
    try:
        cur = conn.cursor()
        cur.execute("SELECT count(*) FROM asteroids")
        nb_ast = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM exoplanets")
        nb_exo = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM natural_events")
        nb_events = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM media")
        nb_apod = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM mars_photos")
        nb_mars = cur.fetchone()[0]
        cur.execute("SELECT count(*) FROM events")
        nb_solar = cur.fetchone()[0]
    except Exception:
        nb_ast = nb_exo = nb_events = nb_apod = nb_mars = nb_solar = "?"

    cols = st.columns(6)
    kpis = [
        ("🪨 Asteroides", nb_ast, "#6366f1"),
        ("🌟 Exoplanetes", nb_exo, "#a78bfa"),
        ("🌪️ Catastrophes", nb_events, "#10b981"),
        ("🌠 Photos NASA", nb_apod, "#f59e0b"),
        ("🔴 Photos Mars", nb_mars, "#ef4444"),
        ("☀️ Eruptions Sol.", nb_solar, "#3b82f6"),
    ]
    for col, (label, value, color) in zip(cols, kpis):
        with col:
            val_str = f"{value:,}".replace(",", " ") if isinstance(value, int) else str(value)
            st.markdown(
                f"""
                <div class='kpi-card'>
                    <div class='kpi-value' style='background: {color}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>{val_str}</div>
                    <div class='kpi-label'>{label}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

    st.markdown("<br>", unsafe_allow_html=True)

    # === Cartes de presentation ===
    col1, col2, col3 = st.columns(3)
    cards = [
        ("🔭 Explore l'espace", "Decouvre des images incroyables, des photos de Mars et des asteroides qui frolent la Terre !"),
        ("🌍 En direct du cosmos", "Suis les eruptions solaires, les volcans et les tempetes depuis l'espace en temps reel !"),
        ("🎮 Apprends en jouant", "Quiz, anecdotes, videos et un assistant IA pour devenir un expert du systeme solaire !"),
    ]
    for col, (title, desc) in zip([col1, col2, col3], cards):
        with col:
            st.markdown(
                f"<div class='card'><h3>{title}</h3><p>{desc}</p></div>",
                unsafe_allow_html=True,
            )

    st.markdown("---")

    # === Alertes spatiales ===
    st.markdown("### 🚨 Alertes spatiales")

    try:
        asteroid_alert = pd.read_sql(
            "SELECT name, approach_date, diameter_min FROM asteroids "
            "WHERE is_potentially_hazardous = true "
            "ORDER BY approach_date DESC LIMIT 5",
            conn,
        )
        if not asteroid_alert.empty:
            st.markdown(
                "<div class='card' style='border-left: 4px solid #ef4444;'>"
                "<h4 style='color: #ef4444;'>Asteroides potentiellement dangereux</h4>",
                unsafe_allow_html=True,
            )
            for _, row in asteroid_alert.iterrows():
                size = row['diameter_min']
                if size < 10:
                    size_ref = "un bus"
                elif size < 100:
                    size_ref = "un terrain de foot"
                elif size < 300:
                    size_ref = "un stade"
                else:
                    size_ref = "la Tour Eiffel"

                danger = "🔴" if size > 140 else "🟡"
                st.markdown(
                    f"  {danger} **{row['name']}** — {row['approach_date']} — "
                    f"{size:.0f} m (taille d'{size_ref})"
                )
            st.markdown("</div>", unsafe_allow_html=True)

        # NOAA quick check
        try:
            kp_r = requests.get(
                "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
                timeout=5,
            )
            if kp_r.status_code == 200:
                kp_data = kp_r.json()
                if len(kp_data) > 1:
                    kp_val = float(kp_data[-1][1])
                    if kp_val >= 5:
                        st.warning(f"**Tempete geomagnetique en cours !** Indice Kp = {kp_val:.1f}. Aurores boreales possibles !")
                    elif kp_val >= 3:
                        st.info(f"**Activite solaire moderee** (Kp = {kp_val:.1f}). Possibles aurores aux poles.")
                    else:
                        st.success(f"Meteo spatiale calme (Kp = {kp_val:.1f}). Tout va bien !")
        except Exception:
            pass

        if asteroid_alert.empty:
            st.success("Aucun asteroide dangereux detecte recemment !")

    except Exception as e:
        st.info(f"Alertes temporairement indisponibles : {e}")

    # === SolarBot IA (en bas de page) ===
    st.markdown("---")
    st.markdown(
        "<h3 style='text-align:center;'>🤖 SolarBot — Pose ta question !</h3>"
        "<p style='text-align:center;color:#94a3b8;'>Qu'est-ce qu'un trou noir ? C'est quoi une exoplanete ? SolarBot sait tout !</p>",
        unsafe_allow_html=True,
    )
    try:
        from gemini_ai import render_chat_widget
        render_chat_widget()
    except ImportError:
        st.info("SolarBot n'est pas disponible. Verifiez la cle API Gemini.")

