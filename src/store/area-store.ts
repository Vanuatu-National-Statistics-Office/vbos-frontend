// stores/areaStore.ts
import { create } from "zustand";

interface AreaState {
  area: string;
  setArea: (area: string) => void;
  syncFromUrl: () => void;
  syncToUrl: () => void;
}

export const useAreaStore = create<AreaState>((set, get) => ({
  area: "",

  setArea: (area: string) => {
    set({ area });
    get().syncToUrl();
  },

  syncFromUrl: () => {
    const params = new URLSearchParams(window.location.search);
    const area = params.get("area");
    if (area) {
      set({ area });
    }
  },

  syncToUrl: () => {
    const { area } = get();
    const params = new URLSearchParams(window.location.search);

    if (area) {
      params.set("area", area);
    } else {
      params.delete("area");
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
  },
}));
