declare module "maplibre-gl-map-to-image" {
  import { Map } from "maplibre-gl";

  interface ToElementOptions {
    targetImageId: string;
    bbox?: [number, number, number, number];
    coverEdits?: boolean;
    hideAllControls?: boolean;
    hideControlsInCorner?: string[];
    hideMarkers?: boolean;
    hidePopups?: boolean;
    hideVisibleLayers?: string[];
    showHiddenLayers?: string[];
  }

  export function toElement(
    map: Map,
    options: ToElementOptions
  ): Promise<void>;
}
