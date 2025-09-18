import { create } from "zustand";
import { ViewState } from "react-map-gl/maplibre";

interface MapState {
  viewState: ViewState;
  setViewState: (viewState: Partial<ViewState>) => void;
  syncFromUrl: () => void;
  syncToUrl: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  viewState: {
    longitude: 168.014,
    latitude: -16.741,
    zoom: 7,
    pitch: 0,
    bearing: 0,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  },

  setViewState: (updates) => {
    set((state) => ({
      viewState: { ...state.viewState, ...updates },
    }));
    get().syncToUrl();
  },

  syncFromUrl: () => {
    const params = new URLSearchParams(window.location.search);

    const longitude = params.get("lng");
    const latitude = params.get("lat");
    const zoom = params.get("zoom");

    const updates: Partial<ViewState> = {};

    if (longitude && latitude) {
      updates.longitude = parseFloat(longitude);
      updates.latitude = parseFloat(latitude);
    }

    if (zoom) updates.zoom = parseFloat(zoom);

    if (Object.keys(updates).length > 0) {
      set((state) => ({
        viewState: { ...state.viewState, ...updates },
      }));
    }
  },

  syncToUrl: () => {
    const { viewState } = get();
    const params = new URLSearchParams();

    params.set("lng", Number(viewState.longitude).toFixed(4).toString());
    params.set("lat", Number(viewState.latitude).toFixed(4).toString());
    params.set("zoom", Number(viewState.zoom).toFixed(1).toString());

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  },
}));
