import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_mrn = Column(String(50), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    affected_side = Column(String(20), nullable=False, default="RIGHT")  # LEFT, RIGHT, BILATERAL
    kl_grade = Column(Integer, nullable=True)  # Kellgren-Lawrence Grade 0-4
    status = Column(String(30), nullable=False, default="REGISTERED")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    imaging_studies = relationship("ImagingStudy", back_populates="patient", cascade="all, delete-orphan")
    segmentation_jobs = relationship("SegmentationJob", back_populates="patient", cascade="all, delete-orphan")
    meshes = relationship("MeshArtifact", back_populates="patient", cascade="all, delete-orphan")
    ika_plans = relationship("IKAPlan", back_populates="patient", cascade="all, delete-orphan")
    audit_records = relationship("AuditRecord", back_populates="patient", cascade="all, delete-orphan")
    prom_records = relationship("PROMRecord", back_populates="patient", cascade="all, delete-orphan")
