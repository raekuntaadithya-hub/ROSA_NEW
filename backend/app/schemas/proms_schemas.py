from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class PROMCreate(BaseModel):
    patient_id: str
    timepoint: str = Field(..., pattern="^(PREOP|POSTOP_6W|POSTOP_3M|POSTOP_6M|POSTOP_1Y)$")
    oxford_knee_score: int = Field(..., ge=0, le=48, description="OKS Score (0-48, 48 is best outcome)")
    forgotten_joint_score: float = Field(..., ge=0.0, le=100.0, description="FJS-12 Score (0-100, 100 is best outcome)")

class PROMResponse(BaseModel):
    id: str
    patient_id: str
    timepoint: str
    oxford_knee_score: int
    forgotten_joint_score: float
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LongitudinalPROMTrajectory(BaseModel):
    patient_id: str
    timepoints: List[str]
    oxford_knee_scores: List[int]
    forgotten_joint_scores: List[float]
    functional_recovery_delta: float
