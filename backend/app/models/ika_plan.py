import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class IKAPlan(Base):
    __tablename__ = "ika_plans"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id"), nullable=False, index=True)

    # Step 1: Preoperative Morphological Baseline
    native_mldfa = Column(Float, nullable=False)  # Native Mechanical Lateral Distal Femoral Angle
    native_mmpta = Column(Float, nullable=False)  # Native Medial Proximal Tibial Angle
    baseline_ahka = Column(Float, nullable=False)  # mMPTA - mLDFA

    # Step 2: Distal Femoral Resection (mLDFA in [87, 93])
    femur_distal_cut_deg = Column(Float, nullable=False)
    femur_distal_resection_mm = Column(Float, nullable=False)

    # Step 3: Proximal Tibial Resection (mMPTA in [85, 90], varus <= 5)
    tibia_cut_deg = Column(Float, nullable=False)
    tibia_resection_mm = Column(Float, nullable=False)

    # Step 4: Extension Gap Balancing
    extension_medial_gap_mm = Column(Float, nullable=False)
    extension_lateral_gap_mm = Column(Float, nullable=False)

    # Step 5: Flexion Gap Harmonization
    femoral_rotation_deg = Column(Float, nullable=False)
    flexion_medial_gap_mm = Column(Float, nullable=False)
    flexion_lateral_gap_mm = Column(Float, nullable=False)

    # Step 6: Chamfer Sizing
    femoral_size = Column(String(10), nullable=False)
    tibial_size = Column(String(10), nullable=False)
    anterior_notching_risk = Column(Boolean, default=False)

    # Step 7: Dynamic Ligamentous Strain Verification
    mcl_strain_percent = Column(Float, nullable=False)  # <= +3.0%

    # Step 8: Final Coronal Verification
    postop_projected_ahka = Column(Float, nullable=False)  # in [-3.0, +3.0]
    safety_boundaries_verified = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    patient = relationship("Patient", back_populates="ika_plans")
    audit_records = relationship("AuditRecord", back_populates="plan")
