from fastapi import APIRouter
from backend.app.api.endpoints import (
    patients,
    imaging,
    segmentation,
    mesh,
    ika_planner,
    audit,
    proms,
    analytics,
    models
)

api_router = APIRouter()

api_router.include_router(patients.router, prefix="/patients", tags=["1. Patients Registry"])
api_router.include_router(imaging.router, prefix="/imaging", tags=["2. Imaging & Triage (Tier 1)"])
api_router.include_router(segmentation.router, prefix="/segmentation", tags=["3. Bone Segmentation (Tier 2)"])
api_router.include_router(mesh.router, prefix="/mesh", tags=["4. 3D Mesh & Taubin QA (Tier 3)"])
api_router.include_router(ika_planner.router, prefix="/ika", tags=["5. 8-Step iKA Planner (Tier 4)"])
api_router.include_router(audit.router, prefix="/audit", tags=["6. Audit Ledger & Hard Gate (Tier 5)"])
api_router.include_router(proms.router, prefix="/proms", tags=["7. PROMs (OKS & FJS-12)"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["8. Clinical Analytics"])
api_router.include_router(models.router, prefix="/models", tags=["9. AI Models & Architecture Hub"])

