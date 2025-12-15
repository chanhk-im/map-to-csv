import { create } from "zustand";
import { DrawedLine } from "../models/DrawedLine";

interface DrawedLineStore {
  drawedLines: DrawedLine[];
  addDrawedLine: (drawedLine: DrawedLine) => void;
  removeDrawedLine: (index: number) => void;
  removeLastDrawedLine: () => void;
  clearDrawedLines: () => void;
}

const useDrawedLineStore = create<DrawedLineStore>((set) => ({
  drawedLines: [] as DrawedLine[],
  addDrawedLine: (drawedLine: DrawedLine) =>
    set((state: { drawedLines: DrawedLine[] }) => ({
      drawedLines: [...state.drawedLines, drawedLine],
    })),
  removeDrawedLine: (index: number) =>
    set((state: { drawedLines: DrawedLine[] }) => ({
      drawedLines: state.drawedLines.filter((line, i) => i !== index),
    })),
  removeLastDrawedLine: () =>
    set((state: { drawedLines: DrawedLine[] }) => ({
      drawedLines: state.drawedLines.slice(0, -1),
    })),
  clearDrawedLines: () => set({ drawedLines: [] }),
}));

export { useDrawedLineStore };