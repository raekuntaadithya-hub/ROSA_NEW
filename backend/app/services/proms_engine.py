from typing import List, Dict, Any
from sqlalchemy.orm import Session
from backend.app.models.proms import PROMRecord

class PROMsEngine:
    """
    Patient-Reported Outcome Measures (PROMs) Scoring Engine.
    Processes Oxford Knee Score (OKS, 0-48) and Forgotten Joint Score (FJS-12, 0-100)
    codified from the ROSA iKA randomized trial protocol (Eijking et al. 2025).
    """

    @staticmethod
    def classify_oxford_knee_score(score: int) -> str:
        if score >= 40:
            return "EXCELLENT_FUNCTION"
        elif score >= 30:
            return "MILD_TO_MODERATE_FUNCTION"
        elif score >= 20:
            return "MODERATE_TO_SEVERE_IMPAIRMENT"
        else:
            return "SEVERE_OSTEOARTHRITIS"

    @classmethod
    def analyze_patient_trajectory(cls, db: Session, patient_id: str) -> Dict[str, Any]:
        """
        Computes the longitudinal recovery trajectory across surgical timepoints.
        """
        records = (
            db.query(PROMRecord)
            .filter(PROMRecord.patient_id == patient_id)
            .order_by(PROMRecord.recorded_at.asc())
            .all()
        )

        timepoints = [r.timepoint for r in records]
        oks_scores = [r.oxford_knee_score for r in records]
        fjs_scores = [r.forgotten_joint_score for r in records]

        # Calculate recovery delta (latest vs preop baseline)
        if len(oks_scores) >= 2:
            delta = oks_scores[-1] - oks_scores[0]
        else:
            delta = 0.0

        return {
            "patient_id": patient_id,
            "record_count": len(records),
            "timepoints": timepoints,
            "oxford_knee_scores": oks_scores,
            "forgotten_joint_scores": fjs_scores,
            "functional_recovery_delta": delta,
            "latest_oks_classification": (
                cls.classify_oxford_knee_score(oks_scores[-1]) if oks_scores else "NOT_RECORDED"
            )
        }
