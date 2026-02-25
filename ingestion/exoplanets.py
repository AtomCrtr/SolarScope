"""
SolarScope — Ingestion Exoplanètes (NASA Exoplanet Archive).
Récupération et insertion dans PostgreSQL.
"""

import psycopg2.extras
import requests

from config import EXOPLANET_URL
from database import get_connection


def get_exoplanets():
    """Récupère les exoplanètes depuis le NASA Exoplanet Archive."""
    params = {"query": "SELECT pl_name, pl_rade FROM ps", "format": "json"}
    try:
        response = requests.get(EXOPLANET_URL, params=params, timeout=60)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API Exoplanètes : {e}")
        return []


def insert_exoplanets(exoplanets, conn):
    """Insère les exoplanètes dans PostgreSQL (sans doublons)."""
    if not exoplanets:
        print("⚠ Aucune donnée d'exoplanète à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO exoplanets (name, radius)
            VALUES %s
            ON CONFLICT (name) DO NOTHING;
            """
            seen = set()
            values = []
            for planet in exoplanets:
                name = planet.get("pl_name")
                radius = planet.get("pl_rade")
                if name and radius is not None and name not in seen:
                    values.append((name, radius))
                    seen.add(name)

            if values:
                psycopg2.extras.execute_values(cursor, query, values)
                conn.commit()
                print(f"✅ {len(values)} exoplanètes insérées (sans doublons).")
            else:
                print("⚠ Pas de nouvelles exoplanètes.")
    except psycopg2.Error as e:
        conn.rollback()
        print(f"❌ Erreur insertion Exoplanètes : {e}")


def run():
    """Point d'entrée : récupère et insère les exoplanètes."""
    conn = get_connection()
    if conn is None:
        return

    print("📡 Récupération des exoplanètes...")
    exoplanets = get_exoplanets()
    insert_exoplanets(exoplanets, conn)
    conn.close()


if __name__ == "__main__":
    run()
