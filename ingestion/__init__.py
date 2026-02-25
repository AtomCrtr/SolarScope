# Ingestion package — Pipeline de données SolarScope
import sys
from pathlib import Path

# Permettre l'import de config/database depuis n'importe quel répertoire
sys.path.insert(0, str(Path(__file__).parent.parent))
