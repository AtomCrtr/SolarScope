import psycopg2
import psycopg2.extras
import requests
import json
import asyncio
import aiohttp
from datetime import datetime, timedelta
from psycopg2.extras import execute_values  # Import manquant

# 🔹 Paramètres de connexion à Railway PostgreSQL
DB_CONFIG = {
    "dbname": "railway",
    "user": "postgres",
    "password": "AqwOUHRNNZxqCCgypHBKaORDqLNiKeEc",  # Mot de passe Railway
    "host": "autorack.proxy.rlwy.net",  # Hôte Railway
    "port": "39282",  # Port Railway
}

# 🔹 API Key NASA
NASA_API_KEY = "IHw7IhcJlPiOxAbnYUanXuc3XJiiFuH46wGayM77"

# 🔹 Date actuelle et période de recherche
today = datetime.today().strftime("%Y-%m-%d")
start_date = (datetime.today() - timedelta(days=7)).strftime("%Y-%m-%d")


# 🔹 Fonction de connexion unique à PostgreSQL
def get_connection():
    try:
        return psycopg2.connect(**DB_CONFIG)
    except psycopg2.OperationalError as e:
        print(f"❌ Erreur de connexion PostgreSQL : {e}")
        return None


# 🔹 API sur les événements naturels de la Terre
EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events"


def get_natural_events(api_key):
    """
    Récupère les événements naturels depuis l'API EONET.
    """
    url = EONET_URL
    params = {"api_key": api_key}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur lors de la requête API : {e}")
        return None


def insert_natural_events(events, conn):
    """
    Insère les événements naturels dans la base de données PostgreSQL.
    """
    query = """
    INSERT INTO natural_events (event_id, title, category, coordinates, date)
    VALUES %s
    ON CONFLICT (event_id) DO NOTHING;
    """
    values = []
    for event in events.get("events", []):  # Sécurisation si events est None
        event_id = event["id"]
        title = event["title"]
        category = (
            event["categories"][0]["title"] if event.get("categories") else "Inconnu"
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
        values.append((event_id, title, category, coordinates, date))

    if not values:
        print("⚠ Aucun événement à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            execute_values(cursor, query, values)
        conn.commit()
        print("✅ Données des événements naturels insérées avec succès.")
    except Exception as e:
        conn.rollback()
        print(f"❌ Erreur d'insertion : {e}")


async def main_async():
    """
    Script principal pour récupérer et insérer les événements naturels.
    """
    conn = get_connection()
    if conn is None:
        return

    print("📡 Début de l'importation des données...")

    natural_events = get_natural_events(NASA_API_KEY)
    if natural_events:
        insert_natural_events(natural_events, conn)  # 🔹 Correction ici

    conn.close()
    print("✅ Connexion PostgreSQL fermée. Toutes les données sont à jour !")


# 🚀 Lancer le programme
if __name__ == "__main__":
    asyncio.run(main_async())
