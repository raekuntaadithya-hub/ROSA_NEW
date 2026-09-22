from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.patient import Patient
from backend.app.models.segmentation import SegmentationJob
from backend.app.schemas.segmentation_schemas import SegmentationDispatch, SegmentationJobResponse
from backend.app.services.segmentation_runner import SegmentationRunnerService

router = APIRouter()

@router.post("/dispatch", response_model=SegmentationJobResponse, status_code=status.HTTP_201_CREATED)
def dispatch_segmentation(dispatch_in: SegmentationDispatch, db: Session = Depends(get_db)):
    """
    Tier 2 Volumetric Segmentation:
    Dispatches a 3D multiclass bone segmentation job (Femur, Tibia, Patella, Fibula)
    via nnU-Net v2 architecture.
    """
    patient = db.query(Patient).filter(Patient.id == dispatch_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{dispatch_in.patient_id}' not found."
        )

    job = SegmentationRunnerService.dispatch_job(
        db=db,
        patient_id=dispatch_in.patient_id,
        study_id=dispatch_in.study_id,
        model_name=dispatch_in.model_name
    )
    return job

@router.get("/jobs/{patient_id}", response_model=List[SegmentationJobResponse])
def get_segmentation_jobs(patient_id: str, db: Session = Depends(get_db)):
    """List all segmentation jobs and DSC performance metrics for a patient."""
    return db.query(SegmentationJob).filter(SegmentationJob.patient_id == patient_id).all()
