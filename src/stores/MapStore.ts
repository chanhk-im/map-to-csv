import { create } from "zustand";

interface MapStore {
  map: any | null;
  setMap: (map: any) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (map: any) => set({ map: map }),
}));
