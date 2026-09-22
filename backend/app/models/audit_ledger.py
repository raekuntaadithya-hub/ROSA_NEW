import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False, index=True)
    plan_id = Column(String(36), ForeignKey("ika_plans.id"), nullable=False, index=True)
    
    surgeon_id = Column(String(50), nullable=False)
    surgeon_name = Column(String(100), nullable=False)
    
    image_hash = Column(String(64), nullable=False)  # H_img
    mesh_hash = Column(String(64), nullable=False)   # H_mesh
    nonce = Column(String(64), nullable=False)
    audit_digest_sha256 = Column(String(64), nullable=False, unique=True, index=True)  # Sealed manifest R
    
    signoff_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    export_authorized = Column(Boolean, default=True, nullable=False)
    export_timestamp = Column(DateTime, nullable=True)
    review_notes = Column(Text, nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="audit_records")
    plan = relationship("IKAPlan", back_populates="audit_records")
