import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clinical Atlas Medical Backend"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "Open, auditable backend for patient-specific 3D knee modeling, "
        "8-step inverse kinematic alignment (iKA) robotic planning, "
        "and SHA-256 cryptographic audit ledger."
    )
    API_V1_STR: str = "/api/v1"
    
    # Paths
    BASE_DIR: Path = BASE_DIR
    DATA_DIR: Path = BASE_DIR / "data"
    UPLOAD_DIR: Path = BASE_DIR / "data" / "uploads"
    MESH_DIR: Path = BASE_DIR / "data" / "meshes"
    
    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'data' / 'clinical_atlas.db'}"
    
    # Security & Cryptography
    SECRET_KEY: str = "clinical-atlas-in-silico-surgical-secret-key-sha256"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]
    
    # Clinical iKA Safety Thresholds (from Eijking et al. 2025 / IEEE Paper)
    MLDFA_MIN_DEG: float = 87.0
    MLDFA_MAX_DEG: float = 93.0
    MMPTA_MIN_DEG: float = 85.0
    MMPTA_MAX_DEG: float = 90.0
    AHKA_MIN_DEG: float = -3.0
    AHKA_MAX_DEG: float = 3.0
    MAX_MCL_STRAIN_PERCENT: float = 3.0
    MAX_GAP_IMBALANCE_MM: float = 1.5
    
    # Taubin Smoothing Default Parameters
    TAUBIN_LAMBDA: float = 0.50
    TAUBIN_MU: float = -0.53
    TAUBIN_ITERATIONS: int = 20
    MAX_ALLOWED_VOLUME_DRIFT_PERCENT: float = 0.35

    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()

# Ensure directories exist
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.MESH_DIR, exist_ok=True)
