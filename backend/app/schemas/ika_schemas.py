from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field, ConfigDict

class IKACalculationInput(BaseModel):
    patient_id: str
    native_mldfa: float = Field(..., description="Native Mechanical Lateral Distal Femoral Angle (deg)")
    native_mmpta: float = Field(..., description="Native Medial Proximal Tibial Angle (deg)")
    femur_cartilage_wear_mm: float = Field(2.0, ge=0.0, le=6.0, description="Distal femoral cartilage erosion in mm")
    tibia_cartilage_wear_mm: float = Field(2.0, ge=0.0, le=6.0, description="Proximal tibial cartilage erosion in mm")
    femur_implant_thickness_mm: float = Field(9.0, description="Nominal distal femoral implant thickness")
    tibia_implant_thickness_mm: float = Field(9.0, description="Nominal tibial component plus insert thickness")

class StepDetail(BaseModel):
    step_number: int
    step_name: str
    clinical_objective: str
    mathematical_formula: str
    computed_value: Any
    safety_status: str

class IKAPlanResponse(BaseModel):
    id: str
    patient_id: str
    native_mldfa: float
    native_mmpta: float
    baseline_ahka: float
    femur_distal_cut_deg: float
    femur_distal_resection_mm: float
    tibia_cut_deg: float
    tibia_resection_mm: float
    extension_medial_gap_mm: float
    extension_lateral_gap_mm: float
    femoral_rotation_deg: float
    flexion_medial_gap_mm: float
    flexion_lateral_gap_mm: float
    femoral_size: str
    tibial_size: str
    anterior_notching_risk: bool
    mcl_strain_percent: float
    postop_projected_ahka: float
    safety_boundaries_verified: bool
    step_by_step_breakdown: List[StepDetail]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
