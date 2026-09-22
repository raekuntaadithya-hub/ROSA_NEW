import os
import pytest
from backend.app.services.mesh_engine import MeshEngine
from backend.app.core.config import settings

def test_mesh_generation_and_taubin_qa(tmp_path):
    """Verify Taubin smoothing parameters and mesh_qa.json sidecar generation."""
    patient_id = "test-pt-mesh-01"
    mesh_path, mesh_hash, qa = MeshEngine.generate_anatomical_mesh_stl(
        patient_id=patient_id,
        bone_type="FEMUR",
        smoothing="Taubin"
    )

    assert os.path.exists(mesh_path)
    assert len(mesh_hash) == 64
    assert qa["anatomical_bone"] == "FEMUR"
    assert qa["smoothing_parameters"]["algorithm"] == "Taubin"
    assert qa["smoothing_parameters"]["lambda"] == 0.50
    assert qa["smoothing_parameters"]["mu"] == -0.53
    assert qa["metrics"]["volume_drift_pct"] == -0.33
    assert abs(qa["metrics"]["volume_drift_pct"]) <= settings.MAX_ALLOWED_VOLUME_DRIFT_PERCENT
    assert qa["metrics"]["euler_characteristic"] == 2
    assert qa["metrics"]["non_manifold_edges"] == 0
    assert qa["qa_passed"] is True
