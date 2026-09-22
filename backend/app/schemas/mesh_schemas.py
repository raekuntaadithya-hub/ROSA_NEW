from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class MeshGenerateRequest(BaseModel):
    patient_id: str
    anatomical_bone: str = Field(..., pattern="^(FEMUR|TIBIA|PATELLA|FIBULA)$")
    smoothing_filter: str = Field("Taubin", pattern="^(Taubin|Laplacian|None)$")
    taubin_lambda: float = Field(0.50, description="Taubin positive scale parameter")
    taubin_mu: float = Field(-0.53, description="Taubin negative scale parameter")
    iterations: int = Field(20, description="Smoothing iterations")

class MeshQASidecar(BaseModel):
    anatomical_bone: str
    volume_cm3: float
    volume_drift_pct: float
    is_watertight: bool
    euler_characteristic: int
    non_manifold_edges: int
    curvature_noise_au: float
    coordinate_frame: str = "DICOM LPS (mm)"
    smoothing_parameters: Dict[str, Any]
    mesh_sha256: str
    qa_passed: bool
    qa_notes: str

class MeshArtifactResponse(BaseModel):
    id: str
    patient_id: str
    anatomical_bone: str
    file_path: str
    mesh_hash_sha256: str
    smoothing_method: str
    volume_cm3: float
    volume_drift_pct: float
    is_watertight: bool
    euler_characteristic: int
    non_manifold_edges: int
    qa_passed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
