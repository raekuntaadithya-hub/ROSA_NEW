from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class ImagingStudyCreate(BaseModel):
    patient_id: str
    modality: str = Field(..., pattern="^(CT|XRAY|THERMAL)$")
    file_path: str
    file_hash_sha256: str
    dicom_series_uid: Optional[str] = None
    metadata_json: Optional[str] = None

class DiagnosticTriageRequest(BaseModel):
    patient_id: str
    modality: str = Field("XRAY", pattern="^(XRAY|THERMAL|DUAL)$")
    temperature_delta_celsius: Optional[float] = Field(None, description="Contralateral thermal differential delta T")
    joint_space_narrowing_mm: Optional[float] = Field(None, description="Measured medial joint space width in mm")
    osteophytes_present: Optional[bool] = False
    sclerosis_present: Optional[bool] = False

class DiagnosticTriageResponse(BaseModel):
    patient_id: str
    predicted_kl_grade: int = Field(..., ge=0, le=4)
    confidence: float
    grade_probabilities: Dict[str, float]
    biomarkers_detected: Dict[str, Any]
    surgical_candidate: bool
    explainability_gradcam_url: Optional[str] = None
    thermal_synovitis_detected: bool

class ImagingStudyResponse(BaseModel):
    id: str
    patient_id: str
    modality: str
    file_path: str
    file_hash_sha256: str
    dicom_series_uid: Optional[str] = None
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)
