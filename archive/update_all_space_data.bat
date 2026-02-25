@echo off
echo [INFO] Début de l'actualisation NASA à %date% %time%

:: Aller dans le bon dossier
cd "C:\Users\feild.LAPTOP-6K4PVO3F\OneDrive\Documents\Emeline : personnel\Documents\Projet 3"

:: Lancer les scripts Python un par un
echo [INFO] Lancement de APIDonkiEvents.py
"C:\Users\feild\anaconda3\python.exe" "APIDonkiEvents.py"

echo [INFO] Lancement de APINaturalEvent.py
"C:\Users\feild\anaconda3\python.exe" "APINaturalEvent.py"

echo [INFO] Lancement de insertionrailway.py
"C:\Users\feild\anaconda3\python.exe" "insertionrailway.py"

echo [INFO] Mise à jour terminée à %time%
pause

