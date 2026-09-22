import { create } from 'zustand';

// --- Auth Store ---

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  login: (email, role) => {
    const nameMap = {
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

export const usePatientStore = create((set) => ({
  selectedPatientId: null,
  setSelectedPatient: (id) => set({ selectedPatientId: id }),
}));

// --- Viewer Store ---

const defaultViewerSettings = {
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

export const useViewerStore = create((set) => ({
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

export const useSidebarStore = create((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
  setCollapsed: (v) => set({ collapsed: v }),
}));
