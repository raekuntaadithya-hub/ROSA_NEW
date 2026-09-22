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
import type {
  Patient,
  ImagingStudy,
  SegmentationResult,
  Reconstruction,
  AnatomicalMeasurement,
  SurgicalPlan,
  DashboardStats,
  ActivityItem,
  SystemStatus,
} from '@/types';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Patient API ---

export async function getPatients(): Promise<Patient[]> {
  await delay(100);
  return mockPatients;
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  await delay(50);
  return mockPatients.find((p) => p.id === id);
}

// --- Imaging API ---

export async function getImagingStudy(patientId: string): Promise<ImagingStudy | undefined> {
  await delay(50);
  return mockImagingStudies[patientId];
}

// --- Segmentation API ---

export async function getSegmentationResult(patientId: string): Promise<SegmentationResult | undefined> {
  await delay(50);
  return mockSegmentationResults[patientId];
}

export async function runSegmentation(patientId: string): Promise<{ jobId: string }> {
  await delay(200);
  return { jobId: `JOB-${Date.now()}` };
}

// --- Reconstruction API ---

export async function getReconstruction(patientId: string): Promise<Reconstruction | undefined> {
  await delay(50);
  return mockReconstructions[patientId];
}

// --- Measurements API ---

export async function getMeasurements(patientId: string): Promise<AnatomicalMeasurement | undefined> {
  await delay(50);
  return mockMeasurements[patientId];
}

// --- Surgical Plan API ---

export async function getSurgicalPlan(patientId: string): Promise<SurgicalPlan | undefined> {
  await delay(50);
  return mockSurgicalPlans[patientId];
}

export async function updatePlanStatus(
  patientId: string,
  status: 'Draft' | 'Reviewed' | 'Approved'
): Promise<{ success: boolean }> {
  await delay(200);
  const plan = mockSurgicalPlans[patientId];
  if (plan) {
    plan.status = status;
    plan.updatedAt = new Date().toISOString();
  }
  return { success: true };
}

// --- Dashboard API ---

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay(100);
  return mockDashboardStats;
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  await delay(100);
  return mockActivities;
}

// --- System API ---

export async function getSystemStatus(): Promise<SystemStatus> {
  await delay(50);
  return mockSystemStatus;
}
