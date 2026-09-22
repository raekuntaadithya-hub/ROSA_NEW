// ============================================================================
// Clinical Atlas — TypeScript Type Definitions
// ============================================================================

// --- Authentication & Users ---

export type UserRole = 'surgeon' | 'radiologist' | 'robotic_technician';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// --- Patient ---

export type KneeSide = 'Left' | 'Right' | 'Bilateral';
export type Gender = 'Male' | 'Female' | 'Other';
export type Urgency = 'Routine' | 'Urgent' | 'Emergency';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  kneeSide: KneeSide;
  urgency: Urgency;
  imagingDate: string;
  lastUpdated: string;
  imagingStatus: WorkflowStatus;
  segmentationStatus: WorkflowStatus;
  reconstructionStatus: WorkflowStatus;
  reviewStatus: ReviewStatus;
  studyId: string;
  notes?: string;
}

// --- Workflow ---

export type WorkflowStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';
export type ReviewStatus = 'Not Started' | 'Pending Review' | 'Reviewed' | 'Approved' | 'Requires Review';

export type WorkflowStep = 'imaging' | 'segmentation' | 'reconstruction' | 'planning' | 'review';

export interface WorkflowProgress {
  imaging: WorkflowStatus;
  segmentation: WorkflowStatus;
  reconstruction: WorkflowStatus;
  planning: WorkflowStatus;
  review: ReviewStatus;
}

// --- Imaging ---

export type ViewPlane = 'axial' | 'coronal' | 'sagittal';

export interface ImagingStudy {
  id: string;
  patientId: string;
  studyDate: string;
  modality: string;
  description: string;
  sliceCount: number;
  sliceThickness: number;
  pixelSpacing: [number, number];
  imageSize: [number, number];
  status: WorkflowStatus;
}

// --- Segmentation ---

export type BoneType = 'Femur' | 'Tibia' | 'Patella' | 'Fibula';

export interface BoneSegmentation {
  boneType: BoneType;
  status: WorkflowStatus;
  dice: number;
  assd: number;
  hd95: number;
  confidence: number;
  volume: number; // cm³
  color: string;
}

export interface SegmentationResult {
  id: string;
  patientId: string;
  studyId: string;
  modelName: string;
  modelVersion: string;
  status: WorkflowStatus;
  startedAt?: string;
  completedAt?: string;
  processingTime?: number; // seconds
  bones: BoneSegmentation[];
}

// --- 3D Reconstruction ---

export interface Reconstruction {
  id: string;
  patientId: string;
  segmentationId: string;
  status: WorkflowStatus;
  method: string;
  meshQuality: 'Low' | 'Medium' | 'High';
  totalVertices: number;
  totalFaces: number;
  completedAt?: string;
  bones: ReconstructedBone[];
}

export interface ReconstructedBone {
  boneType: BoneType;
  vertices: number;
  faces: number;
  volume: number;
  surfaceArea: number;
  color: string;
  modelPath?: string; // future: path to .glb/.stl
}

// --- Anatomical Measurements ---

export interface AnatomicalMeasurement {
  id: string;
  patientId: string;
  mechanicalAxisAngle: number; // degrees
  anatomicalAxisAngle: number;
  femoralDimensionAP: number; // mm
  femoralDimensionML: number;
  tibialDimensionAP: number;
  tibialDimensionML: number;
  tibialSlope: number; // degrees
  jointLineOrientation: number;
  transEpicondylarAxisLength: number;
  femoralOffset: number;
  hipKneeAnkleAngle: number;
}

// --- Surgical Planning ---

export type PlanStatus = 'Draft' | 'Reviewed' | 'Approved';

export interface ResectionParameters {
  distalFemoralResection: number; // mm
  posteriorFemoralResection: number;
  tibialResection: number;
  tibialSlopeTarget: number; // degrees
}

export interface AlignmentParameters {
  mechanicalAxisTarget: number;
  femoralValgus: number;
  tibialVarus: number;
  femoralRotation: number;
}

export interface GapBalance {
  medialGapExtension: number; // mm
  lateralGapExtension: number;
  medialGapFlexion: number;
  lateralGapFlexion: number;
}

export interface SurgicalPlan {
  id: string;
  patientId: string;
  status: PlanStatus;
  createdAt: string;
  updatedAt: string;
  resection: ResectionParameters;
  alignment: AlignmentParameters;
  gapBalance: GapBalance;
  implantSize?: string;
  notes?: string;
  reviewedBy?: string;
  approvedBy?: string;
}

// --- Reports ---

export interface ClinicalReport {
  id: string;
  patientId: string;
  generatedAt: string;
  generatedBy: string;
  sections: ReportSection[];
  status: 'Draft' | 'Final';
}

export interface ReportSection {
  title: string;
  content: string;
  data?: Record<string, string | number>;
}

// --- System ---

export type ServiceStatus = 'Online' | 'Offline' | 'Degraded';

export interface SystemStatus {
  frontend: ServiceStatus;
  backend: ServiceStatus;
  aiService: ServiceStatus;
  lastChecked: string;
}

// --- Dashboard ---

export interface DashboardStats {
  totalPatients: number;
  pendingSegmentation: number;
  completedReconstructions: number;
  pendingReviews: number;
}

export interface ActivityItem {
  id: string;
  type: 'segmentation' | 'reconstruction' | 'review' | 'planning' | 'imaging';
  description: string;
  timestamp: string;
  patientId: string;
  patientName: string;
}

// --- 3D Viewer State ---

export interface ViewerSettings {
  showFemur: boolean;
  showTibia: boolean;
  showPatella: boolean;
  opacity: number;
  wireframe: boolean;
  showMechanicalAxis: boolean;
  showTEA: boolean;
  showJointLine: boolean;
  selectedBone: BoneType | null;
}

export type CameraPreset = 'anterior' | 'posterior' | 'medial' | 'lateral' | 'superior' | 'inferior' | 'isometric';
