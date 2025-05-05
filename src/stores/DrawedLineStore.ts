import { create } from "zustand";
import { DrawedLine } from "../models/DrawedLine";

interface DrawedLineStore {
  drawedLines: DrawedLine[];
  addDrawedLine: (drawedLine: DrawedLine) => void;
  removeDrawedLine: (id: number) => void;
  clearDrawedLines: () => void;
}

const useDrawedLineStore = create<DrawedLineStore>((set) => ({
  drawedLines: [] as DrawedLine[],
  addDrawedLine: (drawedLine: DrawedLine) =>
    set((state: { drawedLines: DrawedLine[] }) => ({
      drawedLines: [...state.drawedLines, drawedLine],
    })),
  removeDrawedLine: (id: number) =>
    set((state: { drawedLines: DrawedLine[] }) => ({
      drawedLines: state.drawedLines.filter((line) => line.id !== id),
    })),
  clearDrawedLines: () => set({ drawedLines: [] }),
}));

export { useDrawedLineStore };