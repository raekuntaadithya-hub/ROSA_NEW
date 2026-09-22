import { create } from 'zustand';
import type { User, UserRole, Patient, ViewerSettings, BoneType, CameraPreset } from '@/types';

// --- Auth Store ---

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email: string, role: UserRole) => {
    const nameMap: Record<UserRole, string> = {
      surgeon: 'Dr. Sarah Mitchell',
      radiologist: 'Dr. James Parker',
      robotic_technician: 'Alex Rivera',
    };
    set({
      isAuthenticated: true,
      user: {
        id: 'USR-001',
        name: nameMap[role],
        email,
        role,
      },
    });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));

// --- Patient Store ---

interface PatientState {
  selectedPatientId: string | null;
  setSelectedPatient: (id: string | null) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  selectedPatientId: null,
  setSelectedPatient: (id) => set({ selectedPatientId: id }),
}));

// --- Viewer Store ---

interface ViewerState extends ViewerSettings {
  cameraPreset: CameraPreset | null;
  setShowFemur: (v: boolean) => void;
  setShowTibia: (v: boolean) => void;
  setShowPatella: (v: boolean) => void;
  setOpacity: (v: number) => void;
  setWireframe: (v: boolean) => void;
  setShowMechanicalAxis: (v: boolean) => void;
  setShowTEA: (v: boolean) => void;
  setShowJointLine: (v: boolean) => void;
  setSelectedBone: (b: BoneType | null) => void;
  setCameraPreset: (p: CameraPreset | null) => void;
  resetViewer: () => void;
}

const defaultViewerSettings: ViewerSettings = {
  showFemur: true,
  showTibia: true,
  showPatella: true,
  opacity: 1,
  wireframe: false,
  showMechanicalAxis: false,
  showTEA: false,
  showJointLine: false,
  selectedBone: null,
};

export const useViewerStore = create<ViewerState>((set) => ({
  ...defaultViewerSettings,
  cameraPreset: null,
  setShowFemur: (v) => set({ showFemur: v }),
  setShowTibia: (v) => set({ showTibia: v }),
  setShowPatella: (v) => set({ showPatella: v }),
  setOpacity: (v) => set({ opacity: v }),
  setWireframe: (v) => set({ wireframe: v }),
  setShowMechanicalAxis: (v) => set({ showMechanicalAxis: v }),
  setShowTEA: (v) => set({ showTEA: v }),
  setShowJointLine: (v) => set({ showJointLine: v }),
  setSelectedBone: (b) => set({ selectedBone: b }),
  setCameraPreset: (p) => set({ cameraPreset: p }),
  resetViewer: () => set({ ...defaultViewerSettings, cameraPreset: 'isometric' }),
}));

// --- Sidebar Store ---

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (v: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (v) => set({ collapsed: v }),
}));
