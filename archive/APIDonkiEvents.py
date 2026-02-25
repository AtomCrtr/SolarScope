import psycopg2
import psycopg2.extras
import requests
import json
import asyncio
import aiohttp
from datetime import datetime, timedelta

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


# 🔹 Fonction générique pour faire une requête à l'API NASA
def make_request(url, params):
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur lors de la requête API : {e}")
        return None


### 🛰 API DONKI - Événements météorologiques spatiaux
def check_rate_limits(response):
    """
    Vérifie les limites d'utilisation des requêtes via les en-têtes HTTP.
    """
    remaining = response.headers.get("X-RateLimit-Remaining")
    limit = response.headers.get("X-RateLimit-Limit")
    print(f"Requêtes restantes : {remaining} / {limit}")


def get_donki_events(api_key):
    """
    Récupère les événements météorologiques spatiaux récents.
    """
    url = "https://api.nasa.gov/DONKI/CME"
    params = {"api_key": api_key, "startDate": start_date, "endDate": today}
    response = requests.get(url, params=params)
    check_rate_limits(response)
    return response.json()


donki_events = get_donki_events(NASA_API_KEY)

print("\n=== Événements météorologiques spatiaux ===")
if donki_events:
    for event in donki_events[:5]:
        print(
            f"Date : {event['startTime']}, Détails : {event.get('note', 'Aucun détail fourni')}"
        )

conn = psycopg2.connect(
    dbname="railway",
    user="postgres",
    password="AqwOUHRNNZxqCCgypHBKaORDqLNiKeEc",  # Mot de passe Railway
    host="autorack.proxy.rlwy.net",  # Hôte Railway
    port="39282",  # Port Railway
)


def insert_event_data(events_data, conn):
    """
    Insère les données des événements météorologiques spatiaux dans la table events.
    """
    with conn.cursor() as cursor:
        for event in events_data:
            query = """
            INSERT INTO events (start_time, details, source)
            VALUES (%s, %s, %s)
            """
            cursor.execute(
                query,
                (
                    event["startTime"],
                    event.get("note", "Aucun détail fourni"),
                    event.get("sourceLocation", "Non spécifié"),
                ),
            )
        conn.commit()
        print("Les données des événements ont été insérées avec succès.")


async def main():
    conn = get_connection()
    if conn is None:
        return

    print("📡 Début de l'importation des données...")

    donki_events = get_donki_events(NASA_API_KEY)
    if donki_events:
        insert_event_data(donki_events, conn)

    conn.close()
    print("✅ Connexion PostgreSQL fermée. Toutes les données sont à jour !")


# 🚀 Lancer le programme
if __name__ == "__main__":
    asyncio.run(main())
