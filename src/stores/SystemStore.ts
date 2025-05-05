import { create } from "zustand";

interface IsFirstLoadStore {
  isFirstLoad: boolean;
  setIsFirstLoad: (isFirstLoad: boolean) => void;
}

interface IsDrawingStore {
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
}

export const useIsFirstLoadStore = create<IsFirstLoadStore>((set) => ({
  isFirstLoad: true,
  setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad }),
}));

export const useIsDrawingStore = create<IsDrawingStore>((set) => ({
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
}));
