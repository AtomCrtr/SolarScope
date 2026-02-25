"""
SolarScope — Ingestion DONKI (Événements solaires CME).
Récupération et insertion dans PostgreSQL.
"""

import psycopg2.extras
import requests
from datetime import datetime, timedelta

from config import NASA_API_KEY, NASA_DONKI_CME_URL
from database import get_connection


def get_donki_events(start_date, end_date):
    """Récupère les événements solaires CME depuis l'API DONKI."""
    params = {"api_key": NASA_API_KEY, "startDate": start_date, "endDate": end_date}
    try:
        response = requests.get(NASA_DONKI_CME_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API DONKI : {e}")
        return None


def insert_donki_events(events, conn):
    """Insère les événements DONKI dans la table events."""
    if not events:
        print("⚠ Aucun événement DONKI à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO events (start_time, details, source)
            VALUES %s
            ON CONFLICT DO NOTHING;
            """
            values = [
                (
                    event["startTime"],
                    event.get("note", "Aucun détail fourni"),
                    event.get("sourceLocation", "Non spécifié"),
                )
                for event in events
                if "startTime" in event
            ]
            if values:
                psycopg2.extras.execute_values(cursor, query, values)
                conn.commit()
                print(f"✅ {len(values)} événements DONKI insérés.")
            else:
                print("⚠ Pas de nouvelles données DONKI.")
    except psycopg2.Error as e:
        conn.rollback()
        print(f"❌ Erreur insertion DONKI : {e}")


def run():
    """Point d'entrée : récupère et insère les événements DONKI des 7 derniers jours."""
    conn = get_connection()
    if conn is None:
        return

    today = datetime.today().strftime("%Y-%m-%d")
    start = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")
    print(f"📡 Récupération événements DONKI de {start} à {today}...")

    events = get_donki_events(start, today)
    insert_donki_events(events, conn)
    conn.close()


if __name__ == "__main__":
    run()
