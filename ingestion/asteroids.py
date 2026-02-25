"""
SolarScope — Ingestion Astéroïdes (NeoWs).
Récupération et insertion dans PostgreSQL.
"""

import psycopg2.extras
import requests
from datetime import datetime, timedelta

from config import NASA_API_KEY, NASA_NEO_URL
from database import get_connection


def get_asteroids(start_date, end_date):
    """Récupère les astéroïdes proches de la Terre entre deux dates."""
    params = {"api_key": NASA_API_KEY, "start_date": start_date, "end_date": end_date}
    try:
        response = requests.get(NASA_NEO_URL, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        if "near_earth_objects" not in data:
            print("⚠ Format inattendu de l'API Astéroïdes.")
            return {}
        return data
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API Astéroïdes : {e}")
        return {}


def insert_asteroids(asteroids_data, conn):
    """Insère les astéroïdes dans PostgreSQL (sans doublons)."""
    if not asteroids_data:
        print("⚠ Aucune donnée d'astéroïdes à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO asteroids (name, approach_date, diameter_min, is_potentially_hazardous)
            VALUES %s
            ON CONFLICT (name, approach_date) DO NOTHING;
            """
            seen = set()
            values = []
            for date, asteroids in asteroids_data.get("near_earth_objects", {}).items():
                for ast in asteroids:
                    name = ast.get("name")
                    diameter_min = (
                        ast.get("estimated_diameter", {})
                        .get("meters", {})
                        .get("estimated_diameter_min")
                    )
                    hazardous = ast.get("is_potentially_hazardous_asteroid", False)
                    key = (name, date)

                    if name and diameter_min is not None and key not in seen:
                        values.append((name, date, diameter_min, hazardous))
                        seen.add(key)

            if values:
                psycopg2.extras.execute_values(cursor, query, values)
                conn.commit()
                print(f"✅ {len(values)} astéroïdes insérés.")
            else:
                print("⚠ Pas de nouvelles données d'astéroïdes.")
    except psycopg2.Error as e:
        conn.rollback()
        print(f"❌ Erreur insertion Astéroïdes : {e}")


def run():
    """Point d'entrée : récupère et insère les astéroïdes des 7 derniers jours."""
    conn = get_connection()
    if conn is None:
        return

    today = datetime.today().strftime("%Y-%m-%d")
    start = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")
    print(f"📡 Récupération astéroïdes de {start} à {today}...")

    data = get_asteroids(start, today)
    insert_asteroids(data, conn)
    conn.close()


if __name__ == "__main__":
    run()
