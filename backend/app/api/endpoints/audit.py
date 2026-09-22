from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.patient import Patient
from backend.app.models.ika_plan import IKAPlan
from backend.app.models.audit_ledger import AuditRecord
from backend.app.schemas.audit_schemas import SurgeonSignoffRequest, AuditManifestResponse, HardExportGateStatus
from backend.app.services.audit_ledger import AuditLedgerService

router = APIRouter()

@router.post("/signoff", response_model=AuditManifestResponse, status_code=status.HTTP_201_CREATED)
def surgeon_case_signoff(signoff_in: SurgeonSignoffRequest, db: Session = Depends(get_db)):
    """
    Tier 5 Clinician-in-the-Loop Review Sign-off:
    Generates an immutable SHA-256 audit digest:
    R = SHA256(H_img || H_mesh || SurgeonID || Timestamp || Nonce)
    and unlocks the Hard Export Gate for robotic cut files.
    """
    patient = db.query(Patient).filter(Patient.id == signoff_in.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{signoff_in.patient_id}' not found."
        )

    plan = db.query(IKAPlan).filter(IKAPlan.id == signoff_in.plan_id).first()
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"iKA Plan with ID '{signoff_in.plan_id}' not found."
        )

    audit_entry = AuditLedgerService.sign_case(
        db=db,
        patient_id=signoff_in.patient_id,
        plan_id=signoff_in.plan_id,
        surgeon_id=signoff_in.surgeon_id,
        surgeon_name=signoff_in.surgeon_name,
        image_hash=signoff_in.image_hash,
        mesh_hash=signoff_in.mesh_hash,
        review_notes=signoff_in.review_notes
    )

    return audit_entry

@router.get("/gate-status/{patient_id}", response_model=HardExportGateStatus)
def check_hard_export_gate(patient_id: str, db: Session = Depends(get_db)):
    """
    Inspects the status of the Hard Export Gate for a patient.
    Confirms cryptographic seal integrity and zero unauthorized data leakage.
    """
    authorized, audit, message = AuditLedgerService.verify_hard_export_gate(db, patient_id)
    return HardExportGateStatus(
        patient_id=patient_id,
        export_authorized=authorized,
        audit_digest_sha256=audit.audit_digest_sha256 if audit else None,
        surgeon_signature_verified=authorized,
        status_message=message
    )

@router.get("/ledger/{patient_id}", response_model=List[AuditManifestResponse])
def get_patient_audit_ledger(patient_id: str, db: Session = Depends(get_db)):
    """View the immutable cryptographic audit ledger history for a patient."""
    return db.query(AuditRecord).filter(AuditRecord.patient_id == patient_id).order_by(AuditRecord.signoff_timestamp.desc()).all()
