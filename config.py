"""
SolarScope — Configuration centralisee.
Lit les secrets depuis st.secrets (Streamlit Cloud) ou le fichier .env (local).
"""

import os
from pathlib import Path

# Charger .env si present (local uniquement)
try:
    from dotenv import load_dotenv
    _env_path = Path(__file__).parent / ".env"
    load_dotenv(_env_path)
except ImportError:
    pass


def _get(key: str, default: str = "") -> str:
    """Lit une valeur depuis st.secrets (cloud) ou os.environ (.env local)."""
    try:
        import streamlit as st
        if key in st.secrets:
            return str(st.secrets[key])
    except Exception:
        pass
    return os.getenv(key, default)


# --- Cle API NASA ---
NASA_API_KEY = _get("NASA_API_KEY")

# --- Configuration PostgreSQL ---
DB_CONFIG = {
    "dbname":   _get("DB_NAME", "railway"),
    "user":     _get("DB_USER", "postgres"),
    "password": _get("DB_PASSWORD"),
    "host":     _get("DB_HOST", "localhost"),
    "port":     _get("DB_PORT", "5432"),
}

# --- URLs des APIs ---
NASA_APOD_URL = "https://api.nasa.gov/planetary/apod"
NASA_NEO_URL = "https://api.nasa.gov/neo/rest/v1/feed"
NASA_DONKI_CME_URL = "https://api.nasa.gov/DONKI/CME"
NASA_MARS_PHOTOS_URL = "https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/latest_photos"
EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events"
EXOPLANET_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

# --- Google Gemini API ---
GEMINI_API_KEY = _get("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-3-flash-preview"
