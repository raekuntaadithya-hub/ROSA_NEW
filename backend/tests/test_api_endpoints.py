import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.database import Base, engine

Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_system_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_full_patient_clinical_pipeline_and_hard_export_gate():
    """
    End-to-end workflow test:
    1. Register Patient
    2. Execute Diagnostic Triage (KL Grade estimation)
    3. Dispatch 3D nnU-Net Volumetric Segmentation
    4. Generate 3D Bone Mesh with Taubin QA sidecar
    5. Verify Hard Export Gate blocks export (HTTP 403) before signoff
    6. Calculate 8-step iKA surgical plan
    7. Perform Surgeon Cryptographic Sign-Off (SHA-256 seal)
    8. Verify Hard Export Gate allows export (HTTP 200) after signoff
    9. Record longitudinal PROMs (OKS and FJS-12)
    10. Inspect Cohort Analytics
    """
    # 1. Register Patient
    import uuid
    pt_payload = {
        "patient_mrn": f"MRN-TEST-{uuid.uuid4().hex[:8]}",
        "name": "Marcus Aurelius",
        "age": 58,
        "gender": "MALE",
        "affected_side": "RIGHT"
    }
    pt_res = client.post("/api/v1/patients/", json=pt_payload)
    assert pt_res.status_code == 201
    pt_data = pt_res.json()
    patient_id = pt_data["id"]

    # 2. Diagnostic Triage
    triage_res = client.post("/api/v1/imaging/triage", json={
        "patient_id": patient_id,
        "modality": "XRAY",
        "temperature_delta_celsius": 2.2,
        "joint_space_narrowing_mm": 1.1,
        "osteophytes_present": True,
        "sclerosis_present": True
    })
    assert triage_res.status_code == 200
    triage_data = triage_res.json()
    assert triage_data["predicted_kl_grade"] == 4
    assert triage_data["surgical_candidate"] is True
    assert triage_data["thermal_synovitis_detected"] is True

    # 3. Dispatch Segmentation
    seg_res = client.post("/api/v1/segmentation/dispatch", json={
        "patient_id": patient_id
    })
    assert seg_res.status_code == 201
    seg_data = seg_res.json()
    assert seg_data["femur_dice"] == 0.984
    assert seg_data["tibia_dice"] == 0.981

    # 4. Generate 3D Mesh
    mesh_res = client.post("/api/v1/mesh/generate", json={
        "patient_id": patient_id,
        "anatomical_bone": "FEMUR",
        "smoothing_filter": "Taubin",
        "taubin_lambda": 0.50,
        "taubin_mu": -0.53,
        "iterations": 20
    })
    assert mesh_res.status_code == 201
    mesh_data = mesh_res.json()
    assert mesh_data["qa_passed"] is True
    assert mesh_data["volume_drift_pct"] == -0.33

    # 5. HARD EXPORT GATE VERIFICATION: Must fail before surgeon sign-off!
    unauthorized_export = client.get(f"/api/v1/mesh/export/{patient_id}/FEMUR")
    assert unauthorized_export.status_code == 403
    assert unauthorized_export.json()["detail"]["error"] == "HardExportGateViolation"

    # 6. Calculate 8-Step iKA Plan
    ika_res = client.post("/api/v1/ika/calculate", json={
        "patient_id": patient_id,
        "native_mldfa": 88.0,
        "native_mmpta": 86.0
    })
    assert ika_res.status_code == 201
    ika_data = ika_res.json()
    plan_id = ika_data["id"]
    assert len(ika_data["step_by_step_breakdown"]) == 8
    assert ika_data["safety_boundaries_verified"] is True

    # 7. Surgeon Cryptographic Sign-off
    signoff_res = client.post("/api/v1/audit/signoff", json={
        "patient_id": patient_id,
        "plan_id": plan_id,
        "surgeon_id": "DR-ORTHO-101",
        "surgeon_name": "Dr. Sarah Lin, MD, FRCSC",
        "review_notes": "Multiplanar CT cross-validation approved. iKA cuts verified."
    })
    assert signoff_res.status_code == 201
    audit_data = signoff_res.json()
    assert len(audit_data["audit_digest_sha256"]) == 64
    assert audit_data["export_authorized"] is True

    # Check Gate Status
    gate_status = client.get(f"/api/v1/audit/gate-status/{patient_id}")
    assert gate_status.status_code == 200
    assert gate_status.json()["export_authorized"] is True

    # 8. HARD EXPORT GATE VERIFICATION: Must SUCCEED after surgeon sign-off!
    authorized_export = client.get(f"/api/v1/mesh/export/{patient_id}/FEMUR")
    assert authorized_export.status_code == 200
    assert authorized_export.headers["X-Hard-Export-Gate"] == "VERIFIED_AUTHORIZED"
    assert authorized_export.headers["X-Surgeon-ID"] == "DR-ORTHO-101"

    # 9. Record Longitudinal PROMs
    prom_res = client.post("/api/v1/proms/", json={
        "patient_id": patient_id,
        "timepoint": "PREOP",
        "oxford_knee_score": 14,
        "forgotten_joint_score": 18.5
    })
    assert prom_res.status_code == 201

    prom_res2 = client.post("/api/v1/proms/", json={
        "patient_id": patient_id,
        "timepoint": "POSTOP_6M",
        "oxford_knee_score": 42,
        "forgotten_joint_score": 82.0
    })
    assert prom_res2.status_code == 201

    trajectory_res = client.get(f"/api/v1/proms/trajectory/{patient_id}")
    assert trajectory_res.status_code == 200
    traj_data = trajectory_res.json()
    assert traj_data["functional_recovery_delta"] == 28.0  # 42 - 14

    # 10. Cohort Analytics
    cohort_res = client.get("/api/v1/analytics/cohort")
    assert cohort_res.status_code == 200
    assert cohort_res.json()["cohort_overview"]["total_registered_patients"] >= 1
