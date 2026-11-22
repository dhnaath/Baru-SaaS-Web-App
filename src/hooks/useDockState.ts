import { create } from "zustand";

interface DockStore {
  isMinimized: boolean;
  setIsMinimized: (val: boolean) => void;
  toggleMinimized: () => void;
  sidebarShift: boolean;
  setSidebarShift: (val: boolean) => void;
}

export const useDockStore = create<DockStore>((set) => ({
  isMinimized: false,
  setIsMinimized: (val) => set({ isMinimized: val }),
  toggleMinimized: () => set((state) => ({ isMinimized: !state.isMinimized })),
  sidebarShift: false,
  setSidebarShift: (val) =>
    set((state) => (state.sidebarShift === val ? state : { sidebarShift: val })),
}));
