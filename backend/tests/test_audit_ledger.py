import pytest
from backend.app.services.audit_ledger import AuditLedgerService

def test_sha256_audit_seal_reproducibility():
    """Verify deterministic SHA-256 seal computation."""
    img_h = "a" * 64
    mesh_h = "b" * 64
    s_id = "SURGEON-007"
    ts = "2026-09-22T19:00:00"
    nonce = "c" * 32

    seal1 = AuditLedgerService.generate_audit_seal(img_h, mesh_h, s_id, ts, nonce)
    seal2 = AuditLedgerService.generate_audit_seal(img_h, mesh_h, s_id, ts, nonce)
    assert seal1 == seal2
    assert len(seal1) == 64

def test_audit_seal_tamper_detection():
    """Verify that tampering with any input component alters the digest."""
    img_h = "a" * 64
    mesh_h = "b" * 64
    s_id = "SURGEON-007"
    ts = "2026-09-22T19:00:00"
    nonce = "c" * 32

    seal_original = AuditLedgerService.generate_audit_seal(img_h, mesh_h, s_id, ts, nonce)
    seal_tampered = AuditLedgerService.generate_audit_seal(img_h, "modified_mesh_hash", s_id, ts, nonce)
    assert seal_original != seal_tampered
