from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.patient import Patient
from backend.app.models.proms import PROMRecord
from backend.app.schemas.proms_schemas import PROMCreate, PROMResponse, LongitudinalPROMTrajectory
from backend.app.services.proms_engine import PROMsEngine

router = APIRouter()

@router.post("/", response_model=PROMResponse, status_code=status.HTTP_201_CREATED)
def record_prom_score(prom_in: PROMCreate, db: Session = Depends(get_db)):
    """
    Records an Oxford Knee Score (OKS, 0-48) and Forgotten Joint Score (FJS-12, 0-100)
    for a longitudinal trial timepoint (e.g. PREOP, POSTOP_6W, POSTOP_6M, POSTOP_1Y).
    """
    patient = db.query(Patient).filter(Patient.id == prom_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{prom_in.patient_id}' not found."
        )

    record = PROMRecord(**prom_in.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/trajectory/{patient_id}", response_model=LongitudinalPROMTrajectory)
def get_prom_trajectory(patient_id: str, db: Session = Depends(get_db)):
    """Computes the longitudinal functional recovery trajectory for a patient."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{patient_id}' not found."
        )

    trajectory = PROMsEngine.analyze_patient_trajectory(db, patient_id)
    return LongitudinalPROMTrajectory(
        patient_id=patient_id,
        timepoints=trajectory["timepoints"],
        oxford_knee_scores=trajectory["oxford_knee_scores"],
        forgotten_joint_scores=trajectory["forgotten_joint_scores"],
        functional_recovery_delta=trajectory["functional_recovery_delta"]
    )

@router.get("/list/{patient_id}", response_model=List[PROMResponse])
def list_patient_proms(patient_id: str, db: Session = Depends(get_db)):
    """List all recorded PROMs assessments for a patient."""
    return db.query(PROMRecord).filter(PROMRecord.patient_id == patient_id).order_by(PROMRecord.recorded_at.asc()).all()
