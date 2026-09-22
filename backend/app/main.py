from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.api.api_router import api_router
from backend.app.models.patient import Patient
from backend.app.models.ika_plan import IKAPlan
from backend.app.services.ika_calculator import IKACalculator

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database schema tables
    Base.metadata.create_all(bind=engine)
    
    # Seed initial demo patient if empty
    db = SessionLocal()
    try:
        count = db.query(Patient).count()
        if count == 0:
            demo_patient = Patient(
                id="demo-patient-001",
                patient_mrn="MRN-ROSA-0568",
                name="Eleanor Vance",
                age=64,
                gender="FEMALE",
                affected_side="RIGHT",
                kl_grade=3,  # Surgical candidate
                status="PLANNED"
            )
            db.add(demo_patient)
            db.commit()

            # Pre-compute an initial 8-step iKA plan for Eleanor
            calc = IKACalculator.calculate_plan(
                native_mldfa=88.5,  # Constitutional varus
                native_mmpta=86.5
            )
            demo_plan = IKAPlan(
                id="demo-plan-001",
                patient_id=demo_patient.id,
                native_mldfa=calc["native_mldfa"],
                native_mmpta=calc["native_mmpta"],
                baseline_ahka=calc["baseline_ahka"],
                femur_distal_cut_deg=calc["femur_distal_cut_deg"],
                femur_distal_resection_mm=calc["femur_distal_resection_mm"],
                tibia_cut_deg=calc["tibia_cut_deg"],
                tibia_resection_mm=calc["tibia_resection_mm"],
                extension_medial_gap_mm=calc["extension_medial_gap_mm"],
                extension_lateral_gap_mm=calc["extension_lateral_gap_mm"],
                femoral_rotation_deg=calc["femoral_rotation_deg"],
                flexion_medial_gap_mm=calc["flexion_medial_gap_mm"],
                flexion_lateral_gap_mm=calc["flexion_lateral_gap_mm"],
                femoral_size=calc["femoral_size"],
                tibial_size=calc["tibial_size"],
                anterior_notching_risk=calc["anterior_notching_risk"],
                mcl_strain_percent=calc["mcl_strain_percent"],
                postop_projected_ahka=calc["postop_projected_ahka"],
                safety_boundaries_verified=calc["safety_boundaries_verified"]
            )
            db.add(demo_plan)
            db.commit()
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

# Mount models assets if available
models_dir = Path(__file__).resolve().parent.parent.parent / "models"
if models_dir.exists():
    resnet_out = models_dir / "resnet" / "outputs"
    unet_out = models_dir / "attention-unet" / "outputs"
    if resnet_out.exists():
        app.mount("/models/resnet", StaticFiles(directory=str(resnet_out)), name="resnet_models")
    if unet_out.exists():
        app.mount("/models/attention-unet", StaticFiles(directory=str(unet_out)), name="unet_models")

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["System Health"])
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "OPERATIONAL",
        "docs_url": f"{settings.API_V1_STR}/docs",
        "clinical_trial_reference": "Eijking et al. (2025), Trials 26:89 (ROSA iKA study, NCT05685693)",
        "hard_export_gate": "ACTIVE"
    }

@app.get("/health", tags=["System Health"])
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "cryptographic_ledger": "ready",
        "ika_planner": "ready"
    }
