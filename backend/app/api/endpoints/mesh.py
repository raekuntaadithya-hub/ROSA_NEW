import os
import json
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.patient import Patient
from backend.app.models.mesh import MeshArtifact
from backend.app.schemas.mesh_schemas import MeshGenerateRequest, MeshArtifactResponse, MeshQASidecar
from backend.app.services.mesh_engine import MeshEngine
from backend.app.services.audit_ledger import AuditLedgerService
from backend.app.core.config import settings

router = APIRouter()

@router.post("/generate", response_model=MeshArtifactResponse, status_code=status.HTTP_201_CREATED)
def generate_mesh(req: MeshGenerateRequest, db: Session = Depends(get_db)):
    """
    Tier 3 Coordinate-Preserving Mesh Generation:
    Reconstructs 3D bone isosurface in physical DICOM LPS millimetric space,
    applies volume-preserving Taubin smoothing (lambda=0.5, mu=-0.53, N=20),
    and generates automated mesh_qa.json provenance sidecar.
    """
    patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{req.patient_id}' not found."
        )

    mesh_path, mesh_hash, qa_sidecar = MeshEngine.generate_anatomical_mesh_stl(
        patient_id=req.patient_id,
        bone_type=req.anatomical_bone,
        smoothing=req.smoothing_filter
    )

    artifact = MeshArtifact(
        patient_id=req.patient_id,
        anatomical_bone=req.anatomical_bone.upper(),
        file_path=mesh_path,
        mesh_hash_sha256=mesh_hash,
        smoothing_method=f"{req.smoothing_filter} (lambda={req.taubin_lambda}, mu={req.taubin_mu})",
        volume_cm3=qa_sidecar["metrics"]["smoothed_volume_cm3"],
        volume_drift_pct=qa_sidecar["metrics"]["volume_drift_pct"],
        is_watertight=qa_sidecar["metrics"]["is_watertight"],
        euler_characteristic=qa_sidecar["metrics"]["euler_characteristic"],
        non_manifold_edges=qa_sidecar["metrics"]["non_manifold_edges"],
        qa_passed=qa_sidecar["qa_passed"]
    )
    db.add(artifact)
    db.commit()
    db.refresh(artifact)
    return artifact

@router.get("/qa/{patient_id}/{bone}", response_model=MeshQASidecar)
def get_mesh_qa_sidecar(patient_id: str, bone: str, db: Session = Depends(get_db)):
    """Retrieve the automated mesh_qa.json provenance sidecar for clinical inspection."""
    sidecar_path = settings.MESH_DIR / f"{patient_id}_{bone.upper()}_mesh_qa.json"
    if not os.path.exists(sidecar_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"QA sidecar for {bone} of patient {patient_id} not found."
        )
    with open(sidecar_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return MeshQASidecar(
        anatomical_bone=data["anatomical_bone"],
        volume_cm3=data["metrics"]["smoothed_volume_cm3"],
        volume_drift_pct=data["metrics"]["volume_drift_pct"],
        is_watertight=data["metrics"]["is_watertight"],
        euler_characteristic=data["metrics"]["euler_characteristic"],
        non_manifold_edges=data["metrics"]["non_manifold_edges"],
        curvature_noise_au=data["metrics"]["curvature_noise_au"],
        coordinate_frame=data["coordinate_frame"],
        smoothing_parameters=data["smoothing_parameters"],
        mesh_sha256=data["mesh_sha256"],
        qa_passed=data["qa_passed"],
        qa_notes=data["qa_notes"]
    )

@router.get("/export/{patient_id}/{bone}")
def export_surgical_mesh(patient_id: str, bone: str, db: Session = Depends(get_db)):
    """
    Tier 5 HARD EXPORT GATE:
    Enforces zero unauthorized leakage. Blocks any STL/OBJ mesh download unless
    an authentic, immutable SHA-256 cryptographic surgeon approval manifest exists.
    """
    # Verify cryptographic hard export gate
    audit = AuditLedgerService.enforce_gate_or_raise(db, patient_id)

    mesh_path = settings.MESH_DIR / f"{patient_id}_{bone.upper()}.stl"
    if not os.path.exists(mesh_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mesh file for {bone} not found on disk."
        )

    headers = {
        "X-Hard-Export-Gate": "VERIFIED_AUTHORIZED",
        "X-Surgeon-ID": audit.surgeon_id,
        "X-Audit-Digest-SHA256": audit.audit_digest_sha256,
        "X-Signoff-Timestamp": audit.signoff_timestamp.isoformat(),
        "Content-Disposition": f'attachment; filename="ClinicalAtlas_{patient_id}_{bone.upper()}.stl"'
    }

    return FileResponse(
        path=mesh_path,
        media_type="model/stl",
        filename=f"ClinicalAtlas_{patient_id}_{bone.upper()}.stl",
        headers=headers
    )
