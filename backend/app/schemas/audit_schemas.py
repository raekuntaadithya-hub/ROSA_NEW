from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class SurgeonSignoffRequest(BaseModel):
    patient_id: str
    plan_id: str
    surgeon_id: str = Field(..., description="Unique Orthopedic Surgeon ID")
    surgeon_name: str = Field(..., description="Full Name of the Operating Surgeon")
    image_hash: Optional[str] = Field(None, description="SHA-256 hash of radiological image volume (H_img)")
    mesh_hash: Optional[str] = Field(None, description="SHA-256 hash of reconstructed 3D mesh package (H_mesh)")
    review_notes: Optional[str] = Field(None, description="Clinical multiplanar review verification notes")

class AuditManifestResponse(BaseModel):
    id: str
    patient_id: str
    plan_id: str
    surgeon_id: str
    surgeon_name: str
    image_hash: str
    mesh_hash: str
    nonce: str
    audit_digest_sha256: str
    signoff_timestamp: datetime
    export_authorized: bool
    review_notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class HardExportGateStatus(BaseModel):
    patient_id: str
    export_authorized: bool
    audit_digest_sha256: Optional[str] = None
    surgeon_signature_verified: bool
    status_message: str
