// stores/areaStore.ts
import { create } from "zustand";

interface AreaState {
  ac: string;
  setAc: (area: string) => void;
  province: string;
  setProvince: (province: string) => void;
  syncFromUrl: () => void;
  syncToUrl: () => void;
}

export const useAreaStore = create<AreaState>((set, get) => ({
  ac: "",
  province: "",

  setAc: (ac: string) => {
    set({ ac });
    get().syncToUrl();
  },
  setProvince: (province: string) => {
    set({ province });
    get().syncToUrl();
  },

  syncFromUrl: () => {
    const params = new URLSearchParams(window.location.search);
    const ac = params.get("ac");
    const province = params.get("province");
    if (ac) {
      set({ ac });
    }
    if (province) {
      set({ province });
    }
  },

  syncToUrl: () => {
    const { ac, province } = get();
    const params = new URLSearchParams(window.location.search);

    if (ac) {
      params.set("ac", ac);
    } else {
      params.delete("ac");
    }
    if (province) {
      params.delete("ac");
      params.set("province", province);
    } else {
      params.delete("province");
      params.delete("ac");
    }

    window.history.replaceState(null, "", `?${params.toString()}`);
  },
}));
