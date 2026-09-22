import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class PROMRecord(Base):
    __tablename__ = "prom_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False, index=True)
    timepoint = Column(String(20), nullable=False)  # PREOP, POSTOP_6W, POSTOP_3M, POSTOP_6M, POSTOP_1Y
    
    # Oxford Knee Score: 12 questions, each scored 0 to 4 (Total 0-48, 48 is best)
    oxford_knee_score = Column(Integer, nullable=False)
    
    # Forgotten Joint Score (FJS-12): 12 questions normalized to 0-100 (100 is best)
    forgotten_joint_score = Column(Float, nullable=False)
    
    recorded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="prom_records")
