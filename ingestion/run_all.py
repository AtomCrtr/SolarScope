"""
SolarScope — Script d'ingestion principal.
Remplace update_all_space_data.bat — exécute tous les pipelines de données.

Usage :
    python -m ingestion.run_all
    ou :
    python ingestion/run_all.py
"""

import asyncio
import sys
from pathlib import Path
from datetime import datetime

# Assurer que le répertoire racine est dans le path
sys.path.insert(0, str(Path(__file__).parent.parent))

from ingestion import apod, asteroids, donki, eonet, mars, exoplanets


async def main():
    print("=" * 60)
    print(f"🚀 SolarScope — Mise à jour des données")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # 1. APOD (async)
    print("\n📸 [1/6] Images APOD...")
    try:
        await apod.run()
    except Exception as e:
        print(f"❌ Erreur APOD : {e}")

    # 2. Astéroïdes
    print("\n☄️  [2/6] Astéroïdes...")
    try:
        asteroids.run()
    except Exception as e:
        print(f"❌ Erreur Astéroïdes : {e}")

    # 3. Événements solaires DONKI
    print("\n🔆 [3/6] Événements solaires DONKI...")
    try:
        donki.run()
    except Exception as e:
        print(f"❌ Erreur DONKI : {e}")

    # 4. Événements naturels EONET
    print("\n🌍 [4/6] Événements naturels EONET...")
    try:
        eonet.run()
    except Exception as e:
        print(f"❌ Erreur EONET : {e}")

    # 5. Photos Mars
    print("\n📷 [5/6] Photos Mars...")
    try:
        mars.run()
    except Exception as e:
        print(f"❌ Erreur Mars : {e}")

    # 6. Exoplanètes
    print("\n🪐 [6/6] Exoplanètes...")
    try:
        exoplanets.run()
    except Exception as e:
        print(f"❌ Erreur Exoplanètes : {e}")

    print("\n" + "=" * 60)
    print("✅ Mise à jour terminée !")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
