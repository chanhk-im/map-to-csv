import { create } from "zustand";
import { DrawingState } from "../options/DrawingState";

interface IsFirstLoadStore {
  isFirstLoad: boolean;
  setIsFirstLoad: (isFirstLoad: boolean) => void;
}

interface IsDrawingStore {
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
}

interface DrawingStateStore {
  drawingState: DrawingState;
  setDrawingState: (drawingState: DrawingState) => void;
}

interface GridModeStore {
  gridInterval: number;
  setGridInterval: (gridInterval: number) => void;
}

export const useIsFirstLoadStore = create<IsFirstLoadStore>((set) => ({
  isFirstLoad: true,
  setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad }),
}));

export const useIsDrawingStore = create<IsDrawingStore>((set) => ({
  isDrawing: false,
  setIsDrawing: (isDrawing) => set({ isDrawing }),
}));

export const useDrawingStateStore = create<DrawingStateStore>((set) => ({
  drawingState: DrawingState.SELECTED,
  setDrawingState: (drawingState) => set({ drawingState }),
}));

export const useGridModeStore = create<GridModeStore>((set) => ({
  gridInterval: 100,
  setGridInterval: (gridInterval) => set({ gridInterval }),
}));
