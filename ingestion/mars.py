"""
SolarScope — Ingestion Photos Mars (Rover API).
Récupération et insertion dans PostgreSQL.
"""

import requests

from config import NASA_API_KEY, NASA_MARS_PHOTOS_URL
from database import get_connection


def get_mars_photos(rover="curiosity"):
    """Récupère les photos les plus récentes d'un rover martien."""
    url = NASA_MARS_PHOTOS_URL.format(rover=rover)
    params = {"api_key": NASA_API_KEY}
    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠ Erreur API Mars Photos : {e}")
        return None


def insert_mars_photos(photos_data, conn):
    """Insère les photos martiennes dans PostgreSQL."""
    if not photos_data or "latest_photos" not in photos_data:
        print("⚠ Aucune photo martienne à insérer.")
        return

    try:
        with conn.cursor() as cursor:
            query = """
            INSERT INTO mars_photos (photo_id, camera_name, rover_name, img_src, earth_date)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (photo_id) DO NOTHING;
            """
            count = 0
            for photo in photos_data["latest_photos"]:
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
                count += 1
            conn.commit()
            print(f"✅ {count} photos Mars insérées.")
    except Exception as e:
        conn.rollback()
        print(f"❌ Erreur insertion Mars Photos : {e}")


def run():
    """Point d'entrée : récupère et insère les photos Mars."""
    conn = get_connection()
    if conn is None:
        return

    print("📡 Récupération des photos Mars (Curiosity)...")
    photos = get_mars_photos("curiosity")
    insert_mars_photos(photos, conn)
    conn.close()


if __name__ == "__main__":
    run()
