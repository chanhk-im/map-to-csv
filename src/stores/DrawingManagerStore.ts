import { create } from "zustand";

interface DrawingManagerStore {
  drawingManager: any | null;
  setDrawingManager: (manager: any) => void;
}

export const useDrawingManagerStore = create<DrawingManagerStore>((set) => ({
  drawingManager: null,
  setDrawingManager: (manager) => set({ drawingManager: manager }),
}));
