/**
 * Types for the Map Legend component system.
 *
 * The legend displays metadata about currently active layers on the map,
 * allowing users to understand what data is being visualized.
 */

/**
 * Base properties shared by all legend layer types.
 */
interface BaseLegendLayer {
  /** Unique identifier matching the dataset ID */
  id: number;
  /** Display name of the layer */
  name: string;
  /** Data type discriminator */
  dataType: "tabular" | "vector" | "raster";
  /** Unit of measurement (e.g., "people", "meters") */
  unit?: string | null;
  /** Data source description */
  source?: string | null;
}

/**
 * Legend entry for tabular (statistical) layers.
 * Tabular layers are visualized as choropleth maps on admin boundaries.
 */
export interface TabularLegendLayer extends BaseLegendLayer {
  dataType: "tabular";
  /** Color scheme used for choropleth visualization */
  colorScheme: "sequential" | "diverging" | "categorical";
  /** Optional min/max values for the current data range */
  dataRange?: {
    min: number;
    max: number;
  };
}

/**
 * Legend entry for vector (geometry) layers.
 * Vector layers display points, lines, or polygons loaded from GeoJSON.
 */
export interface VectorLegendLayer extends BaseLegendLayer {
  dataType: "vector";
  /** Primary geometry type in this layer */
  geometryType: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
  /** Color used to render this layer */
  color: string;
}

/**
 * Legend entry for raster (imagery/grid) layers.
 * Raster layers display continuous data like satellite imagery or elevation.
 */
export interface RasterLegendLayer extends BaseLegendLayer {
  dataType: "raster";
  /** Color scheme or palette description */
  colorScheme?: string;
  /** Optional opacity/transparency level */
  opacity?: number;
}

/**
 * Union type representing any type of legend layer.
 */
export type LegendLayer = TabularLegendLayer | VectorLegendLayer | RasterLegendLayer;

/**
 * Action types that can be performed on legend layers.
 */
export type LayerActionType = "toggle" | "remove";

/**
 * Details about a layer action event.
 */
export interface LayerActionDetails {
  /** The type of action performed */
  action: LayerActionType;
  /** The action payload */
  payload: {
    /** The layer that was acted upon */
    layer: LegendLayer;
  };
}

/**
 * Callback function type for handling layer actions.
 */
export type LayerActionHandler = (details: LayerActionDetails) => void;
