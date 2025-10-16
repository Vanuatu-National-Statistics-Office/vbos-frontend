import { create } from "zustand";

interface LayersState {
  layers: string;
  setLayers: (layers: string) => void;
  switchLayer: (layer: string) => void;
  syncFromUrl: () => void;
}

export const useLayerStore = create<LayersState>((set, get) => ({
  layers: "",

  setLayers: (layers: string) => {
    set({ layers });
    const params = new URLSearchParams(window.location.search);
    if (layers) {
      params.set("layers", layers);
    } else {
      params.delete("layers");
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  },

  switchLayer: (layer: string) => {
    const { layers } = get();
    let layerArray = layers ? layers.split(",") : [];
    if (layerArray.includes(layer)) {
      layerArray = layerArray.filter((l) => l !== layer);
    } else {
      layerArray.push(layer);
    }
    get().setLayers(layerArray.join());
  },

  syncFromUrl: () => {
    const params = new URLSearchParams(window.location.search);
    const layers = params.get("layers");
    if (layers) {
      set({ layers });
    }
  },
}));
