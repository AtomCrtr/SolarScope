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


# Récupérer une image APOD pour une date spécifique (ASYNC)
async def fetch_apod(session, date):
    url = "https://api.nasa.gov/planetary/apod"
    params = {"api_key": NASA_API_KEY, "date": date}
    async with session.get(url, params=params) as response:
        if response.status == 200:
            data = await response.json()
            return {
                "date": date,
                "title": data.get("title"),
                "url": data.get("url"),
                "description": data.get("explanation"),
            }
        else:
            print(f"⚠ Erreur API APOD pour la date {date}: {response.status}")
            return None


# 🔹 Récupérer toutes les images APOD sur une plage de dates (ASYNC)
async def fetch_all_apod(start_date, end_date):
    async with aiohttp.ClientSession() as session:
        tasks = []
        current_date = start_date
        while current_date <= end_date:
            tasks.append(fetch_apod(session, current_date.strftime("%Y-%m-%d")))
            current_date += timedelta(days=1)

        results = await asyncio.gather(*tasks)

        # 🔹 Filtrer les erreurs et éviter que None soit ajouté
        results = [res for res in results if res is not None and isinstance(res, dict)]

        if not results:
            print("⚠ Aucun APOD récupéré.")
            return []

        return results


# 🔹 Insérer les images APOD dans PostgreSQL
def insert_apod_data(apod_data, conn):
    if conn is None or not isinstance(apod_data, list) or not apod_data:
        print("⚠ Aucune donnée APOD valide à insérer.")
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

            if not values:
                print("⚠ Pas de valeurs valides à insérer.")
                return

            psycopg2.extras.execute_values(cursor, query, values)
            conn.commit()
            print(f"✅ {len(values)} images APOD insérées/mises à jour.")
    except psycopg2.Error as e:
        print(f"❌ Erreur insertion APOD : {e}")


# 🔹 Récupérer et insérer les APOD (ASYNCHRONOUS TASK)
async def fetch_and_insert_apod(conn):
    start_date = datetime.today() - timedelta(days=7)
    end_date = datetime.today()

    print(
        f"📡 Récupération des images APOD de {start_date.date()} à {end_date.date()}..."
    )
    apod_data = await fetch_all_apod(start_date, end_date)

    if apod_data:
        insert_apod_data(apod_data, conn)


# 🔹 Exécution principale
async def main():
    conn = get_connection()

    if conn:
        await fetch_and_insert_apod(conn)


# 🚀 Lancer le programme
if __name__ == "__main__":
    asyncio.run(main())


### 🌍 API APOD - Image du jour
def get_apod(api_key):
    url = "https://api.nasa.gov/planetary/apod"
    params = {"api_key": api_key, "date": today}
    return make_request(url, params)


def insert_single_apod(apod_data, conn):
    if conn is None or not isinstance(apod_data, dict):
        return
    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO media (title, description, url, date)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (date) DO UPDATE 
            SET title = EXCLUDED.title, description = EXCLUDED.description, url = EXCLUDED.url;
            """
            values = [
                (
                    apod_data.get("title", "Titre inconnu"),
                    apod_data.get("description", "Pas de description"),
                    apod_data.get("url", ""),
                    apod_data.get("date", ""),
                )
            ]
            psycopg2.extras.execute_values(cursor, query, values)
            conn.commit()
            print("✅ Image APOD du jour insérée/mise à jour.")
    except psycopg2.Error as e:
        print(f"❌ Erreur insertion APOD unique : {e}")


# 🚀 API Exoplanètes
# ==============================================


def get_exoplanets():
    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    params = {"query": "SELECT pl_name, pl_rade FROM ps", "format": "json"}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API Exoplanètes : {e}")
        return []


def insert_exoplanets_to_db(exoplanets, conn):
    if conn is None or not exoplanets:
        print("⚠ Aucune donnée Exoplanètes à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO exoplanets (name, radius)
            VALUES %s
            ON CONFLICT (name) DO NOTHING;  -- Ignore les doublons
            """

            # 🔹 Filtrage des doublons en Python AVANT l'insertion
            seen = set()
            values = []
            for planet in exoplanets:
                name = planet.get("pl_name")
                radius = planet.get("pl_rade")

                if name and radius is not None and name not in seen:
                    values.append((name, radius))
                    seen.add(name)

            if not values:
                print("⚠ Pas de nouvelles exoplanètes à insérer.")
                return

            # 🔹 Exécuter l'insertion en batch
            psycopg2.extras.execute_values(cursor, query, values)
            conn.commit()
            print(f"✅ {len(values)} exoplanètes insérées (sans doublons).")

    except psycopg2.Error as e:
        print(f"❌ Erreur insertion Exoplanètes : {e}")


### ☄ API Astéroides - Données des astéroïdes proches de la Terre
def get_asteroids(api_key, start_date, end_date):
    url = "https://api.nasa.gov/neo/rest/v1/feed"
    params = {"api_key": api_key, "start_date": start_date, "end_date": end_date}
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        asteroids_data = response.json()

        if "near_earth_objects" not in asteroids_data:
            print("⚠ Format inattendu de l'API Astéroïdes.")
            return {}

        return asteroids_data
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API Astéroïdes : {e}")
        return {}


# 🔹 Fonction pour insérer les astéroïdes dans PostgreSQL
def insert_asteroids_data(asteroids_data, conn):
    if conn is None or not asteroids_data:
        print("⚠ Aucune donnée d'astéroïdes à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO asteroids (name, approach_date, diameter_min, is_potentially_hazardous)
            VALUES %s
            ON CONFLICT (name, approach_date) DO NOTHING;  -- Ignore les doublons
            """

            # 🔹 Filtrer les doublons en Python AVANT l'insertion
            seen = set()
            values = []
            for date, asteroids in asteroids_data.get("near_earth_objects", {}).items():
                for asteroid in asteroids:
                    name = asteroid.get("name")
                    diameter_min = (
                        asteroid.get("estimated_diameter", {})
                        .get("meters", {})
                        .get("estimated_diameter_min")
                    )
                    hazardous = asteroid.get("is_potentially_hazardous_asteroid", False)

                    unique_key = (name, date)

                    if name and diameter_min is not None and unique_key not in seen:
                        values.append((name, date, diameter_min, hazardous))
                        seen.add(unique_key)  # Évite les doublons avant insertion

            if not values:
                print("⚠ Pas de nouvelles données d'astéroïdes à insérer.")
                return

            # 🔹 Exécuter l'insertion en batch
            psycopg2.extras.execute_values(cursor, query, values)
            conn.commit()
            print(f"✅ {len(values)} astéroïdes insérés/mis à jour.")

    except psycopg2.Error as e:
        print(f"❌ Erreur insertion Astéroïdes : {e}")


### 🚀 API Mars Photos - Photos des rovers martiens
def get_mars_photos(api_key, rover="curiosity"):
    """
    Récupérer les photos les plus récentes prises par un rover martien.
    """
    url = f"https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/latest_photos"
    params = {"api_key": api_key}
    return make_request(url, params)


def insert_mars_photos_data(mars_photos, conn):
    """
    Insérer les données des photos martiennes dans la base de données.
    """
    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO mars_photos (photo_id, camera_name, rover_name, img_src, earth_date)
            VALUES (%s, %s, %s, %s, %s)
            """
            for photo in mars_photos["latest_photos"]:
                cursor.execute(
                    query,
                    (
                        photo["id"],
                        photo["camera"]["full_name"],
                        photo["rover"]["name"],
                        photo["img_src"],
                        photo["earth_date"],
                    ),
                )
            conn.commit()
        print("Les données des photos martiennes ont été insérées avec succès.")
    except Exception as e:
        print(f"Erreur lors de l'insertion dans la base de données : {e}")


try:
    conn = psycopg2.connect(
        dbname="railway",
        user="postgres",
        password="AqwOUHRNNZxqCCgypHBKaORDqLNiKeEc",  # Mot de passe Railway
        host="autorack.proxy.rlwy.net",  # Hôte Railway
        port="39282",  # Port Railway
    )
    print("Connexion à la base de données réussie.")
except Exception as e:
    print(f"Erreur lors de la connexion à la base de données : {e}")
    conn = None

if conn:
    mars_photos = get_mars_photos(NASA_API_KEY)

    if mars_photos and "latest_photos" in mars_photos:
        insert_mars_photos_data(mars_photos, conn)
    else:
        print("Aucune donnée de photo martienne disponible.")

    conn.close()
else:
    print("Impossible de se connecter à la base de données.")

# API sur les événements naturels de la Terre

EONET_URL = "https://eonet.gsfc.nasa.gov/api/v3/events"  # URL de l'API EONET


def get_natural_events(api_key):
    """
    Récupère les événements naturels depuis l'API EONET.
    """
    url = EONET_URL
    params = {"api_key": api_key}
    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()


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
    for event in events["events"]:
        event_id = event["id"]
        title = event["title"]
        category = event["categories"][0]["title"]
        coordinates = event["geometry"][0]["coordinates"]  # Coordonnées en JSONB
        date = event["geometry"][0]["date"]
        values.append((event_id, title, category, coordinates, date))

    try:
        with conn.cursor() as cursor:
            execute_values(cursor, query, values)
        conn.commit()
        print("Données des événements naturels insérées avec succès.")
    except Exception as e:
        conn.rollback()
        print(f"Erreur d'insertion : {e}")


def connect_to_postgres():
    """
    Établit une connexion à la base de données PostgreSQL.
    """
    return psycopg2.connect(
        dbname="railway",
        user="postgres",
        password="AqwOUHRNNZxqCCgypHBKaORDqLNiKeEc",  # Mot de passe Railway
        host="autorack.proxy.rlwy.net",  # Hôte Railway
        port="39282",  # Port Railway
    )


def main():
    """
    Script principal pour récupérer et insérer les événements naturels.
    """
    conn = None
    try:
        conn = connect_to_postgres()
        print("Connexion à PostgreSQL établie.")
        events = get_natural_events(NASA_API_KEY)
        insert_natural_events(events, conn)
    except Exception as e:
        print(f"Erreur dans le script principal : {e}")


# 🚀 Exécution principale
# ==============================================


async def main():
    conn = get_connection()
    if conn is None:
        return

    print("📡 Début de l'importation des données...")

    # 🔹 APOD (Images du Jour)
    # pour 7 jours
    await fetch_and_insert_apod(conn)

    # pour le jour même
    apod_data = get_apod(NASA_API_KEY)
    if apod_data:
        insert_single_apod(apod_data, conn)

    # 🔹 Exoplanètes
    exoplanets = get_exoplanets()
    if exoplanets:
        insert_exoplanets_to_db(exoplanets, conn)

    # 🔹 Astéroïdes
    asteroids_data = get_asteroids(NASA_API_KEY, start_date, today)
    if asteroids_data:
        insert_asteroids_data(asteroids_data, conn)

    # Mars Photos
    mars_photos = get_mars_photos(NASA_API_KEY)
    if mars_photos and "latest_photos" in mars_photos:
        insert_mars_photos_data(mars_photos, conn)

    apod_data = get_apod(NASA_API_KEY)
    if apod_data:
        insert_apod_data(apod_data, conn)

    conn.close()
    print("✅ Connexion PostgreSQL fermée. Toutes les données sont à jour !")


# 🚀 Lancer le programme
if __name__ == "__main__":
    asyncio.run(main())
