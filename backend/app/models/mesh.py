import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class MeshArtifact(Base):
    __tablename__ = "mesh_artifacts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False, index=True)
    anatomical_bone = Column(String(20), nullable=False)  # FEMUR, TIBIA, PATELLA, FIBULA
    file_path = Column(String(255), nullable=False)
    mesh_hash_sha256 = Column(String(64), nullable=False, index=True)  # H_mesh for audit ledger
    smoothing_method = Column(String(30), default="Taubin (lambda=0.5, mu=-0.53, N=20)")
    volume_cm3 = Column(Float, nullable=False)
    volume_drift_pct = Column(Float, nullable=False)  # Must be < 0.35%
    is_watertight = Column(Boolean, default=True)
    euler_characteristic = Column(Integer, default=2)
    non_manifold_edges = Column(Integer, default=0)
    qa_passed = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="meshes")
