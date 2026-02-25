"""
SolarScope — Connexion centralisée à PostgreSQL.
Une seule implémentation utilisée par l'app Streamlit ET les scripts d'ingestion.
"""

import sys
import io
import psycopg2
from config import DB_CONFIG

# --- Fix Windows cp1252 : forcer UTF-8 sur stdout/stderr ---
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")


def get_connection():
    """
    Crée et retourne une nouvelle connexion PostgreSQL.
    Retourne None en cas d'erreur.
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except psycopg2.OperationalError as e:
        print(f"[ERREUR] Connexion PostgreSQL : {e}")
        return None


def ensure_connection(conn):
    """
    Vérifie qu'une connexion est encore active.
    Si elle est fermée ou invalide, en crée une nouvelle.
    """
    try:
        if conn is None or conn.closed:
            return get_connection()
        # Test rapide de la connexion
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
        return conn
    except (psycopg2.OperationalError, psycopg2.InterfaceError):
        return get_connection()
