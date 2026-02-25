"""
SolarScope — Ingestion APOD (Astronomy Picture of the Day).
Récupération asynchrone + insertion PostgreSQL.
"""

import asyncio
import aiohttp
import psycopg2.extras
from datetime import datetime, timedelta

from config import NASA_API_KEY, NASA_APOD_URL
from database import get_connection


async def fetch_apod(session, date):
    """Récupère une image APOD pour une date donnée."""
    params = {"api_key": NASA_API_KEY, "date": date}
    try:
        async with session.get(NASA_APOD_URL, params=params) as response:
            if response.status == 200:
                data = await response.json()
                return {
                    "date": date,
                    "title": data.get("title"),
                    "url": data.get("url"),
                    "description": data.get("explanation"),
                }
            else:
                print(f"⚠ Erreur APOD pour {date}: HTTP {response.status}")
    except Exception as e:
        print(f"⚠ Erreur APOD pour {date}: {e}")
    return None


async def fetch_all_apod(start_date, end_date):
    """Récupère les APOD sur une plage de dates (async)."""
    async with aiohttp.ClientSession() as session:
        tasks = []
        current_date = start_date
        while current_date <= end_date:
            tasks.append(fetch_apod(session, current_date.strftime("%Y-%m-%d")))
            current_date += timedelta(days=1)

        results = await asyncio.gather(*tasks)
        return [r for r in results if r is not None and isinstance(r, dict)]


def insert_apod_data(apod_data, conn):
    """Insère les données APOD dans la table media."""
    if not apod_data:
        print("⚠ Aucune donnée APOD à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO media (title, description, url, date)
            VALUES %s
            ON CONFLICT (date) DO UPDATE
            SET title = EXCLUDED.title, description = EXCLUDED.description, url = EXCLUDED.url;
            """
            values = [
                (
                    item.get("title", "Titre inconnu"),
                    item.get("description", "Pas de description"),
                    item.get("url", ""),
                    item.get("date", ""),
                )
                for item in apod_data
                if isinstance(item, dict) and "date" in item
            ]
            if values:
                psycopg2.extras.execute_values(cursor, query, values)
                conn.commit()
                print(f"✅ {len(values)} images APOD insérées/mises à jour.")
            else:
                print("⚠ Pas de valeurs valides à insérer.")
    except psycopg2.Error as e:
        conn.rollback()
        print(f"❌ Erreur insertion APOD : {e}")


async def run():
    """Point d'entrée : récupère et insère les APOD des 7 derniers jours."""
    conn = get_connection()
    if conn is None:
        return

    start = datetime.today() - timedelta(days=7)
    end = datetime.today()
    print(f"📡 Récupération APOD de {start.date()} à {end.date()}...")

    apod_data = await fetch_all_apod(start, end)
    insert_apod_data(apod_data, conn)
    conn.close()


if __name__ == "__main__":
    asyncio.run(run())
