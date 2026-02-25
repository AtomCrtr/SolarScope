"""
SolarScope — Point d'entree Streamlit.
Charge la configuration, le CSS, la sidebar, et dispatch vers les pages.

Lancer avec :
    streamlit run app.py
"""

import sys
import io

# --- Fix Windows cp1252 : forcer UTF-8 sur stdout/stderr ---
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import streamlit as st
from pathlib import Path
from database import get_connection

# --- Configuration de la page ---
st.set_page_config(
    page_title="SolarScope - Explorer l'espace",
    page_icon="🪐",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        "Get Help": "https://api.nasa.gov",
        "About": "SolarScope - Projet Data Analyst | Wild Code School 2025",
    },
)

# --- Chargement du CSS externe (UTF-8) ---
css_path = Path(__file__).parent / "styles.css"
if css_path.exists():
    css_content = css_path.read_text(encoding="utf-8")
    st.markdown(f"<style>{css_content}</style>", unsafe_allow_html=True)

# --- Connexion a la base de donnees (cachee par Streamlit) ---
from database import get_connection, ensure_connection

@st.cache_resource
def _get_conn():
    return get_connection()

# Recupère la connexion cachée et vérifie qu'elle est encore vivante
_conn_cached = _get_conn()
conn = ensure_connection(_conn_cached)

if conn is None:
    st.error("Impossible de se connecter a la base de donnees. Verifiez votre fichier `.env`.")
    st.stop()

# --- Sidebar : menu de navigation ---
from streamlit_option_menu import option_menu

with st.sidebar:
    # Branding
    st.markdown(
        """
        <div style='text-align:center; padding: 1rem 0 0.5rem 0;'>
            <h2 style='background: linear-gradient(135deg, #6366f1, #a78bfa);
                        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                        font-family: Space Grotesk, sans-serif; font-size: 1.8rem; margin:0;'>
                SolarScope
            </h2>
            <p style='color: #64748b; font-size: 0.85rem; margin-top: 0.2rem;'>
                Explorer l'espace
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    page = option_menu(
        None,
        [
            "🏠 Accueil",
            "☀️ Le Soleil",
            "🪐 Les Planetes",
            "🔴 Mars",
            "☄️ Asteroides",
            "🌍 Catastrophes Naturelles",
            "🌠 Photo du Jour",
            "🌟 Exoplanetes",
            "🚀 Missions Spatiales",
            "📰 Actualites",
            "🎮 Coin des Curieux",
        ],
        icons=[
            "house-fill", "sun-fill", "globe2", "camera-fill",
            "lightning-charge-fill", "geo-alt-fill", "image-fill",
            "stars", "rocket-takeoff", "newspaper", "book-half",
        ],
        menu_icon="rocket-takeoff-fill",
        default_index=0,
        styles={
            "container": {
                "padding": "8px",
                "background-color": "transparent",
            },
            "icon": {
                "font-size": "0px",  # emojis dans les labels
            },
            "nav-link": {
                "font-size": "14px",
                "font-family": "Outfit, sans-serif",
                "text-align": "left",
                "margin": "3px 0",
                "padding": "9px 14px",
                "border-radius": "12px",
                "color": "#94a3b8",
                "--hover-color": "rgba(99, 102, 241, 0.1)",
            },
            "nav-link-selected": {
                "background": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                "color": "white",
                "font-weight": "600",
                "box-shadow": "0 0 20px rgba(99, 102, 241, 0.3)",
            },
        },
    )

    # Légende du voyage
    st.markdown(
        """
        <div style='padding:0.5rem 0.8rem;margin-top:0.5rem;'>
            <p style='color:#475569;font-size:0.72rem;line-height:1.6;'>
                ☀️ Notre etoile &rarr; 🪐 Planetes &rarr; 🔴 Mars<br>
                ☄️ Asteroides &rarr; 🌠 Photo du Jour<br>
                🌟 Exoplanetes &rarr; 🚀 Missions<br>
                📰 Actualites &rarr; 🎮 Jeux
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

# --- Dispatch vers la page selectionnee ---
from views import (
    accueil,
    planetes,
    apod,
    asteroides,
    evenements_naturels,
    exoplanetes,
    mars_photos,
    evenements_solaires,
    missions,
    actualites,
    coin_curieux,
)

PAGE_MAP = {
    "🏠 Accueil": accueil,
    "☀️ Le Soleil": evenements_solaires,
    "🪐 Les Planetes": planetes,
    "🔴 Mars": mars_photos,
    "☄️ Asteroides": asteroides,
    "🌍 Catastrophes Naturelles": evenements_naturels,
    "🌠 Photo du Jour": apod,
    "🌟 Exoplanetes": exoplanetes,
    "🚀 Missions Spatiales": missions,
    "📰 Actualites": actualites,
    "🎮 Coin des Curieux": coin_curieux,
}

# Track visited pages for explorer badge
if "visited_pages" not in st.session_state:
    st.session_state.visited_pages = set()
st.session_state.visited_pages.add(page)

PAGE_MAP[page].render(conn)

# --- Footer ---
st.markdown(
    """
    <div class='footer'>
        <p>SolarScope &mdash; Projet Data Analyst | Wild Code School 2025</p>
        <p style='font-size: 0.75rem; color: #475569;'>
            Donnees : NASA &bull; EONET &bull; Wikipedia &bull; IA : Google Gemini
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

