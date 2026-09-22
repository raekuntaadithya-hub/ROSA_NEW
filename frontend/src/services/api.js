// ============================================================================
// Clinical Atlas — API Service Layer
// All data access goes through this layer.
// Currently returns mock data; replace with fetch() calls for FastAPI backend.
// ============================================================================

import { mockPatients } from '@/data/mockPatients';
import {
  mockImagingStudies,
  mockSegmentationResults,
  mockReconstructions,
  mockMeasurements,
  mockSurgicalPlans,
  mockDashboardStats,
  mockActivities,
  mockSystemStatus,
} from '@/data/mockData';

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Patient API ---

export async function getPatients() {
  await delay(100);
  return mockPatients;
}

export async function getPatientById(id) {
  await delay(50);
  return mockPatients.find((p) => p.id === id);
}

// --- Imaging API ---

export async function getImagingStudy(patientId) {
  await delay(50);
  return mockImagingStudies[patientId];
}

// --- Segmentation API ---

export async function getSegmentationResult(patientId) {
  await delay(50);
  return mockSegmentationResults[patientId];
}

export async function runSegmentation(patientId) {
  await delay(200);
  return { jobId: `JOB-${Date.now()}` };
}

// --- Reconstruction API ---

export async function getReconstruction(patientId) {
  await delay(50);
  return mockReconstructions[patientId];
}

// --- Measurements API ---

export async function getMeasurements(patientId) {
  await delay(50);
  return mockMeasurements[patientId];
}

// --- Surgical Plan API ---

export async function getSurgicalPlan(patientId) {
  await delay(50);
  return mockSurgicalPlans[patientId];
}

export async function updatePlanStatus(patientId, status) {
  await delay(200);
  const plan = mockSurgicalPlans[patientId];
  if (plan) {
    plan.status = status;
    plan.updatedAt = new Date().toISOString();
  }
  return { success: true };
}

// --- Dashboard API ---

export async function getDashboardStats() {
  await delay(100);
  return mockDashboardStats;
}

export async function getRecentActivity() {
  await delay(100);
  return mockActivities;
}

// --- System API ---

export async function getSystemStatus() {
  await delay(50);
  return mockSystemStatus;
}
