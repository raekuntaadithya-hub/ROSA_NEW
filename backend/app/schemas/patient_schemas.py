from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class PatientBase(BaseModel):
    patient_mrn: str = Field(..., description="Unique Medical Record Number")
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=130)
    gender: str = Field(..., pattern="^(MALE|FEMALE|OTHER|M|F)$")
    affected_side: str = Field("RIGHT", pattern="^(LEFT|RIGHT|BILATERAL)$")

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    affected_side: Optional[str] = None
    kl_grade: Optional[int] = Field(None, ge=0, le=4)
    status: Optional[str] = None

class PatientResponse(PatientBase):
    id: str
    kl_grade: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
