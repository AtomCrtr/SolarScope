"""
SolarScope — Ingestion EONET (Événements naturels).
Récupération et insertion dans PostgreSQL.
"""

import json
import psycopg2.extras
import requests

from config import NASA_API_KEY, EONET_URL
from database import get_connection


def get_natural_events():
    """Récupère les événements naturels depuis l'API EONET."""
    params = {"api_key": NASA_API_KEY}
    try:
        response = requests.get(EONET_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API EONET : {e}")
        return None


def insert_natural_events(events_data, conn):
    """Insère les événements naturels dans PostgreSQL."""
    if not events_data or "events" not in events_data:
        print("⚠ Aucun événement naturel à insérer.")
        return

    query = """
    INSERT INTO natural_events (event_id, title, category, coordinates, date)
    VALUES %s
    ON CONFLICT (event_id) DO NOTHING;
    """
    values = []
    for event in events_data.get("events", []):
        event_id = event.get("id")
        title = event.get("title")
        category = (
            event["categories"][0]["title"]
            if event.get("categories")
            else "Inconnu"
        )
        coordinates = (
            json.dumps(event["geometry"][0]["coordinates"])
            if event.get("geometry") and event["geometry"]
            else None
        )
        date = (
            event["geometry"][0]["date"]
            if event.get("geometry") and event["geometry"]
            else None
        )
        if event_id and title:
            values.append((event_id, title, category, coordinates, date))

    if not values:
        print("⚠ Aucun événement valide à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            psycopg2.extras.execute_values(cursor, query, values)
        conn.commit()
        print(f"✅ {len(values)} événements naturels insérés.")
    except psycopg2.Error as e:
        conn.rollback()
        print(f"❌ Erreur insertion EONET : {e}")


def run():
    """Point d'entrée : récupère et insère les événements naturels."""
    conn = get_connection()
    if conn is None:
        return

    print("📡 Récupération des événements naturels EONET...")
    events = get_natural_events()
    insert_natural_events(events, conn)
    conn.close()


if __name__ == "__main__":
    run()
