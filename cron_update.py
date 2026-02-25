#!/usr/bin/env python3
"""
SolarScope — Cron de mise a jour automatique.
A executer quotidiennement (via crontab, Railway Cron, ou Task Scheduler Windows).

Usage :
    python cron_update.py

Windows Task Scheduler :
    1. Ouvrir le Planificateur de taches
    2. Creer une tache de base
    3. Declencheur : tous les jours a 6h00
    4. Action : Demarrer un programme
       Programme : C:\\Users\\feild.LAPTOP-6K4PVO3F\\anaconda3\\python.exe
       Arguments : cron_update.py
       Repertoire : C:\\Users\\feild.LAPTOP-6K4PVO3F\\OneDrive\\Documents\\Projet 3

Linux/Railway crontab :
    0 6 * * * cd /app && python cron_update.py >> /var/log/solarscope-cron.log 2>&1
"""

import sys
import asyncio
from pathlib import Path
from datetime import datetime

# Chemin racine
sys.path.insert(0, str(Path(__file__).parent))


def main():
    print(f"\n{'='*60}")
    print(f"SolarScope — Cron automatique")
    print(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

    from ingestion import apod, asteroids, donki, eonet, mars, exoplanets

    # APOD (async)
    print("\n[1/6] APOD...")
    try:
        asyncio.run(apod.run())
    except Exception as e:
        print(f"  Erreur : {e}")

    # Asteroides
    print("\n[2/6] Asteroides...")
    try:
        asteroids.run()
    except Exception as e:
        print(f"  Erreur : {e}")

    # DONKI
    print("\n[3/6] DONKI...")
    try:
        donki.run()
    except Exception as e:
        print(f"  Erreur : {e}")

    # EONET
    print("\n[4/6] EONET...")
    try:
        eonet.run()
    except Exception as e:
        print(f"  Erreur : {e}")

    # Mars
    print("\n[5/6] Mars...")
    try:
        mars.run()
    except Exception as e:
        print(f"  Erreur : {e}")

    # Exoplanetes
    print("\n[6/6] Exoplanetes...")
    try:
        exoplanets.run()
    except Exception as e:
        print(f"  Erreur : {e}")

    print(f"\n{'='*60}")
    print("Mise a jour terminee !")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
