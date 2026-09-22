import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class SegmentationJob(Base):
    __tablename__ = "segmentation_jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False, index=True)
    study_id = Column(String(36), ForeignKey("imaging_studies.id"), nullable=True)
    status = Column(String(30), nullable=False, default="PENDING")  # PENDING, PROCESSING, COMPLETED, FAILED
    model_name = Column(String(50), nullable=False, default="nnU-Net v2 3D Fullres")
    femur_dice = Column(Float, nullable=True)
    tibia_dice = Column(Float, nullable=True)
    patella_dice = Column(Float, nullable=True)
    fibula_dice = Column(Float, nullable=True)
    mask_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="segmentation_jobs")
    study = relationship("ImagingStudy", back_populates="segmentation_jobs")
