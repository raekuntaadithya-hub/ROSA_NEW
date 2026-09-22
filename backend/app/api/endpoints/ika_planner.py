from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.patient import Patient
from backend.app.models.ika_plan import IKAPlan
from backend.app.schemas.ika_schemas import IKACalculationInput, IKAPlanResponse, StepDetail
from backend.app.services.ika_calculator import IKACalculator

router = APIRouter()

@router.post("/calculate", response_model=IKAPlanResponse, status_code=status.HTTP_201_CREATED)
def calculate_ika_plan(input_data: IKACalculationInput, db: Session = Depends(get_db)):
    """
    Tier 4 Closed-Form 8-Step iKA Planning Calculator:
    Computes patient-specific distal femoral and proximal tibial bone cuts,
    harmonizes flexion/extension gaps at 90° flexion, evaluates dynamic MCL strain <= 3%,
    and validates final coronal limb alignment within [-3.0°, +3.0°].
    """
    patient = db.query(Patient).filter(Patient.id == input_data.patient_id).first()
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID '{input_data.patient_id}' not found."
        )

    calc = IKACalculator.calculate_plan(
        native_mldfa=input_data.native_mldfa,
        native_mmpta=input_data.native_mmpta,
        femur_cartilage_wear_mm=input_data.femur_cartilage_wear_mm,
        tibia_cartilage_wear_mm=input_data.tibia_cartilage_wear_mm,
        femur_implant_thickness_mm=input_data.femur_implant_thickness_mm,
        tibia_implant_thickness_mm=input_data.tibia_implant_thickness_mm
    )

    plan = IKAPlan(
        patient_id=input_data.patient_id,
        native_mldfa=calc["native_mldfa"],
        native_mmpta=calc["native_mmpta"],
        baseline_ahka=calc["baseline_ahka"],
        femur_distal_cut_deg=calc["femur_distal_cut_deg"],
        femur_distal_resection_mm=calc["femur_distal_resection_mm"],
        tibia_cut_deg=calc["tibia_cut_deg"],
        tibia_resection_mm=calc["tibia_resection_mm"],
        extension_medial_gap_mm=calc["extension_medial_gap_mm"],
        extension_lateral_gap_mm=calc["extension_lateral_gap_mm"],
        femoral_rotation_deg=calc["femoral_rotation_deg"],
        flexion_medial_gap_mm=calc["flexion_medial_gap_mm"],
        flexion_lateral_gap_mm=calc["flexion_lateral_gap_mm"],
        femoral_size=calc["femoral_size"],
        tibial_size=calc["tibial_size"],
        anterior_notching_risk=calc["anterior_notching_risk"],
        mcl_strain_percent=calc["mcl_strain_percent"],
        postop_projected_ahka=calc["postop_projected_ahka"],
        safety_boundaries_verified=calc["safety_boundaries_verified"]
    )
    db.add(plan)
    
    # Update patient status
    patient.status = "PLANNED"
    db.commit()
    db.refresh(plan)

    step_details = [StepDetail(**s) for s in calc["steps_log"]]

    return IKAPlanResponse(
        id=plan.id,
        patient_id=plan.patient_id,
        native_mldfa=plan.native_mldfa,
        native_mmpta=plan.native_mmpta,
        baseline_ahka=plan.baseline_ahka,
        femur_distal_cut_deg=plan.femur_distal_cut_deg,
        femur_distal_resection_mm=plan.femur_distal_resection_mm,
        tibia_cut_deg=plan.tibia_cut_deg,
        tibia_resection_mm=plan.tibia_resection_mm,
        extension_medial_gap_mm=plan.extension_medial_gap_mm,
        extension_lateral_gap_mm=plan.extension_lateral_gap_mm,
        femoral_rotation_deg=plan.femoral_rotation_deg,
        flexion_medial_gap_mm=plan.flexion_medial_gap_mm,
        flexion_lateral_gap_mm=plan.flexion_lateral_gap_mm,
        femoral_size=plan.femoral_size,
        tibial_size=plan.tibial_size,
        anterior_notching_risk=plan.anterior_notching_risk,
        mcl_strain_percent=plan.mcl_strain_percent,
        postop_projected_ahka=plan.postop_projected_ahka,
        safety_boundaries_verified=plan.safety_boundaries_verified,
        step_by_step_breakdown=step_details,
        created_at=plan.created_at
    )

@router.get("/plans/{patient_id}", response_model=List[IKAPlanResponse])
def get_patient_plans(patient_id: str, db: Session = Depends(get_db)):
    """Retrieve all calculated iKA plans for a patient."""
    plans = db.query(IKAPlan).filter(IKAPlan.patient_id == patient_id).all()
    results = []
    for plan in plans:
        # Reconstruct step details from recorded plan
        calc = IKACalculator.calculate_plan(
            native_mldfa=plan.native_mldfa,
            native_mmpta=plan.native_mmpta
        )
        step_details = [StepDetail(**s) for s in calc["steps_log"]]
        results.append(
            IKAPlanResponse(
                id=plan.id,
                patient_id=plan.patient_id,
                native_mldfa=plan.native_mldfa,
                native_mmpta=plan.native_mmpta,
                baseline_ahka=plan.baseline_ahka,
                femur_distal_cut_deg=plan.femur_distal_cut_deg,
                femur_distal_resection_mm=plan.femur_distal_resection_mm,
                tibia_cut_deg=plan.tibia_cut_deg,
                tibia_resection_mm=plan.tibia_resection_mm,
                extension_medial_gap_mm=plan.extension_medial_gap_mm,
                extension_lateral_gap_mm=plan.extension_lateral_gap_mm,
                femoral_rotation_deg=plan.femoral_rotation_deg,
                flexion_medial_gap_mm=plan.flexion_medial_gap_mm,
                flexion_lateral_gap_mm=plan.flexion_lateral_gap_mm,
                femoral_size=plan.femoral_size,
                tibial_size=plan.tibial_size,
                anterior_notching_risk=plan.anterior_notching_risk,
                mcl_strain_percent=plan.mcl_strain_percent,
                postop_projected_ahka=plan.postop_projected_ahka,
                safety_boundaries_verified=plan.safety_boundaries_verified,
                step_by_step_breakdown=step_details,
                created_at=plan.created_at
            )
        )
    return results
