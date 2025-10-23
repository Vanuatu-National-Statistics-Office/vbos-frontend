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
      // We can only have one tabular layer and one raster layer enabled at once.
      // So, we need to remove other enabled tabular/raster layers, before adding a new one.
      const isTabularLayer = layer.startsWith("t");
      const isRasterLayer = layer.startsWith("r");
      if (isTabularLayer) {
        layerArray = layerArray.filter((l) => !l.startsWith("t"));
      }
      if (isRasterLayer) {
        layerArray = layerArray.filter((l) => !l.startsWith("r"));
      }
      // Add new enabled layer
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
