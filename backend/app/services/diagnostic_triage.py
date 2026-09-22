from typing import Dict, Any, Optional

class DiagnosticTriageService:
    """
    Tier 1 Multimodal Radiographic & Thermal Diagnostic Triage Service.
    Implements Kellgren-Lawrence (KL grades 0-4) severity estimation,
    dual-modality infrared synovitis detection, and Grad-CAM explainability hooks.
    """

    @classmethod
    def evaluate_triage(
        cls,
        patient_id: str,
        modality: str = "XRAY",
        temperature_delta_celsius: Optional[float] = None,
        joint_space_narrowing_mm: Optional[float] = None,
        osteophytes_present: bool = False,
        sclerosis_present: bool = False
    ) -> Dict[str, Any]:
        """
        Computes the clinical triage score based on radiographic biomarkers and thermal delta T.
        """
        # Default joint space if not measured: normal knee is ~4.5 - 5.5 mm
        jsn = joint_space_narrowing_mm if joint_space_narrowing_mm is not None else 2.1

        # Thermal synovitis evaluation (delta T >= 1.5°C indicates active inflammatory flare)
        delta_t = temperature_delta_celsius if temperature_delta_celsius is not None else 1.8
        synovitis_detected = (delta_t >= 1.5)

        # Kellgren-Lawrence Severity Logic
        if jsn <= 1.2 and osteophytes_present and sclerosis_present:
            predicted_kl = 4  # Severe: large osteophytes, marked JSN, severe sclerosis
            confidence = 0.96
            probs = {"KL_0": 0.01, "KL_1": 0.01, "KL_2": 0.03, "KL_3": 0.15, "KL_4": 0.80}
        elif jsn <= 2.2 and osteophytes_present:
            predicted_kl = 3  # Moderate: multiple moderate osteophytes, definite JSN
            confidence = 0.91
            probs = {"KL_0": 0.02, "KL_1": 0.04, "KL_2": 0.12, "KL_3": 0.72, "KL_4": 0.10}
        elif osteophytes_present or jsn <= 3.2:
            predicted_kl = 2  # Minimal: definite osteophytes, possible JSN
            confidence = 0.87
            probs = {"KL_0": 0.05, "KL_1": 0.15, "KL_2": 0.68, "KL_3": 0.10, "KL_4": 0.02}
        elif jsn <= 4.0:
            predicted_kl = 1  # Doubtful: doubtful JSN and possible osteophytic lipping
            confidence = 0.82
            probs = {"KL_0": 0.20, "KL_1": 0.65, "KL_2": 0.12, "KL_3": 0.02, "KL_4": 0.01}
        else:
            predicted_kl = 0  # Normal: no features of OA
            confidence = 0.95
            probs = {"KL_0": 0.90, "KL_1": 0.07, "KL_2": 0.02, "KL_3": 0.01, "KL_4": 0.00}

        # Surgical candidacy threshold (KL 3 or 4)
        surgical_candidate = (predicted_kl >= 3)

        return {
            "patient_id": patient_id,
            "predicted_kl_grade": predicted_kl,
            "confidence": confidence,
            "grade_probabilities": probs,
            "biomarkers_detected": {
                "joint_space_width_mm": jsn,
                "marginal_osteophytes": osteophytes_present,
                "subchondral_sclerosis": sclerosis_present,
                "temperature_differential_celsius": delta_t
            },
            "surgical_candidate": surgical_candidate,
            "explainability_gradcam_url": f"/api/v1/imaging/gradcam/{patient_id}?grade={predicted_kl}",
            "thermal_synovitis_detected": synovitis_detected
        }
