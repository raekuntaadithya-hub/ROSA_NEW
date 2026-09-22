import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class ImagingStudy(Base):
    __tablename__ = "imaging_studies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False, index=True)
    modality = Column(String(20), nullable=False)  # CT, XRAY, THERMAL
    file_path = Column(String(255), nullable=False)
    file_hash_sha256 = Column(String(64), nullable=False, index=True)  # H_img for audit ledger
    dicom_series_uid = Column(String(100), nullable=True)
    metadata_json = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="imaging_studies")
    segmentation_jobs = relationship("SegmentationJob", back_populates="study")
