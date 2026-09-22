from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, Field, ConfigDict

class SegmentationDispatch(BaseModel):
    patient_id: str
    study_id: Optional[str] = None
    model_name: str = Field("nnU-Net v2 3D Fullres", description="Segmentation model architecture")

class SegmentationJobResponse(BaseModel):
    id: str
    patient_id: str
    study_id: Optional[str] = None
    status: str
    model_name: str
    femur_dice: Optional[float] = None
    tibia_dice: Optional[float] = None
    patella_dice: Optional[float] = None
    fibula_dice: Optional[float] = None
    mask_path: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
