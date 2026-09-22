import pytest
from backend.app.services.ika_calculator import IKACalculator
from backend.app.core.config import settings

def test_standard_constitutional_varus():
    """
    Test a classic constitutional varus knee case:
    Native mLDFA = 88.5°, Native mMPTA = 86.5°
    Baseline aHKA = -2.0° (Constitutional varus)
    """
    plan = IKACalculator.calculate_plan(
        native_mldfa=88.5,
        native_mmpta=86.5,
        femur_cartilage_wear_mm=2.0,
        tibia_cartilage_wear_mm=2.0
    )

    assert plan["baseline_ahka"] == -2.0
    # Cuts should preserve native angles because they fall within safety envelopes
    assert plan["femur_distal_cut_deg"] == 88.5
    assert plan["tibia_cut_deg"] == 86.5

    # Resection depths: 9.0 mm - 2.0 mm = 7.0 mm
    assert plan["femur_distal_resection_mm"] == 7.0
    assert plan["tibia_resection_mm"] == 7.0

    # MCL strain should be physiological (<= 3.0%)
    assert plan["mcl_strain_percent"] <= settings.MAX_MCL_STRAIN_PERCENT

    # Postop projected aHKA = 86.5 - 88.5 = -2.0° (in [-3.0°, +3.0°])
    assert plan["postop_projected_ahka"] == -2.0
    assert settings.AHKA_MIN_DEG <= plan["postop_projected_ahka"] <= settings.AHKA_MAX_DEG
    assert plan["safety_boundaries_verified"] is True
    assert len(plan["steps_log"]) == 8

def test_severe_varus_outlier_clamping():
    """
    Test extreme varus outlier anatomy:
    Native mLDFA = 84.0° (below 87° min), Native mMPTA = 81.0° (below 85° min)
    Calculator MUST clamp angles into safety boundaries [87°, 93°] and [85°, 90°].
    """
    plan = IKACalculator.calculate_plan(
        native_mldfa=84.0,
        native_mmpta=81.0
    )

    # Clamped to safety boundary limits
    assert plan["femur_distal_cut_deg"] == 87.0
    assert plan["tibia_cut_deg"] == 85.0

    # Postop projected aHKA = 85.0 - 87.0 = -2.0° (safe window)
    assert plan["postop_projected_ahka"] == -2.0
    assert settings.AHKA_MIN_DEG <= plan["postop_projected_ahka"] <= settings.AHKA_MAX_DEG

def test_severe_valgus_outlier_clamping():
    """
    Test extreme valgus outlier anatomy:
    Native mLDFA = 96.0° (above 93° max), Native mMPTA = 93.0° (above 90° max)
    Calculator MUST clamp angles into safety boundaries.
    """
    plan = IKACalculator.calculate_plan(
        native_mldfa=96.0,
        native_mmpta=93.0
    )

    assert plan["femur_distal_cut_deg"] == 93.0
    assert plan["tibia_cut_deg"] == 90.0

    # Postop projected aHKA = 90.0 - 93.0 = -3.0° (boundary edge)
    assert plan["postop_projected_ahka"] == -3.0
    assert settings.AHKA_MIN_DEG <= plan["postop_projected_ahka"] <= settings.AHKA_MAX_DEG
