from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.patient import Patient
from backend.app.models.imaging import ImagingStudy
from backend.app.schemas.imaging_schemas import (
    ImagingStudyCreate, ImagingStudyResponse,
    DiagnosticTriageRequest, DiagnosticTriageResponse
)
from backend.app.services.diagnostic_triage import DiagnosticTriageService

router = APIRouter()

@router.post("/upload", response_model=ImagingStudyResponse, status_code=status.HTTP_201_CREATED)
def record_imaging_study(study_in: ImagingStudyCreate, db: Session = Depends(get_db)):
    """Record an ingested radiographic or CT imaging study."""
    patient = db.query(Patient).filter(Patient.id == study_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{study_in.patient_id}' not found."
        )
    study = ImagingStudy(**study_in.model_dump())
    db.add(study)
    db.commit()
    db.refresh(study)
    return study

@router.post("/triage", response_model=DiagnosticTriageResponse)
def execute_diagnostic_triage(req: DiagnosticTriageRequest, db: Session = Depends(get_db)):
    """
    Tier 1 Diagnostic Triage:
    Executes automated Kellgren-Lawrence (KL grades 0-4) severity classification
    with dual-modality infrared synovitis assessment and Grad-CAM explainability hooks.
    """
    patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{req.patient_id}' not found."
        )

    triage_result = DiagnosticTriageService.evaluate_triage(
        patient_id=req.patient_id,
        modality=req.modality,
        temperature_delta_celsius=req.temperature_delta_celsius,
        joint_space_narrowing_mm=req.joint_space_narrowing_mm,
        osteophytes_present=req.osteophytes_present,
        sclerosis_present=req.sclerosis_present
    )

    # Persist the assigned KL grade
    patient.kl_grade = triage_result["predicted_kl_grade"]
    patient.status = "TRIAGED"
    db.commit()

    return DiagnosticTriageResponse(**triage_result)

@router.get("/studies/{patient_id}", response_model=List[ImagingStudyResponse])
def get_patient_studies(patient_id: str, db: Session = Depends(get_db)):
    """Retrieve all imaging studies registered for a patient."""
    return db.query(ImagingStudy).filter(ImagingStudy.patient_id == patient_id).all()
