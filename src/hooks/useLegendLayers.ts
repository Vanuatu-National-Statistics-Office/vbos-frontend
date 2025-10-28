/**
 * Hook for preparing legend data from active map layers.
 *
 * This hook fetches metadata for each active layer individually using the
 * dataset detail endpoints (/api/v1/{type}/{id}/).
 *
 * Architecture:
 * - Reads active layer IDs from the layer store (URL-synced)
 * - Parses layer IDs to determine type (t1 = tabular, v2 = vector, r3 = raster)
 * - Fetches metadata for each layer using useQueries
 * - Enriches with visualization metadata (colors, data ranges, etc.)
 * - Returns array of LegendLayer objects ready for display
 */

import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useLayerStore } from "@/store/layer-store";
import { useDateStore } from "@/store/date-store";
import { useAreaStore } from "@/store/area-store";
import * as HTTP from "@/api/http";
import type {
  LegendLayer,
  TabularLegendLayer,
  VectorLegendLayer,
  RasterLegendLayer,
} from "@/components/Map/Legend/types";
import type { Dataset, PaginatedVectorData } from "@/types/api";

/**
 * Parses a layer ID string into its components.
 *
 * Layer ID format: {type}{id}
 * - v1, v2 = Vector layers
 * - t1, t2 = Tabular layers
 * - r1, r2 = Raster layers
 *
 * @param layerId - The layer ID string (e.g., "v1", "t2", "r3")
 * @returns Object with dataType and numeric id, or null if invalid
 */
function parseLayerId(layerId: string): {
  dataType: "vector" | "tabular" | "raster";
  id: number;
} | null {
  const match = layerId.match(/^([vtr])(\d+)$/);
  if (!match) return null;

  const typeMap = {
    v: "vector" as const,
    t: "tabular" as const,
    r: "raster" as const,
  };

  return {
    dataType: typeMap[match[1] as "v" | "t" | "r"],
    id: Number(match[2]),
  };
}

/**
 * Fetches metadata for a single dataset.
 */
async function fetchDatasetMetadata(
  dataType: "vector" | "tabular" | "raster",
  id: number,
): Promise<Dataset> {
  const response = await HTTP.get(`/api/v1/${dataType}/${id}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${dataType} dataset ${id}`);
  }
  const data = await response.json();
  return { ...data, dataType } as Dataset;
}

/**
 * Hook that provides legend layer data for all currently active map layers.
 *
 * @returns Array of LegendLayer objects, or empty array if no layers active
 *
 * @example
 * ```tsx
 * function MapComponent() {
 *   const legendLayers = useLegendLayers();
 *
 *   return (
 *     <Map>
 *       <Legend layers={legendLayers} />
 *     </Map>
 *   );
 * }
 * ```
 */
export function useLegendLayers(): LegendLayer[] {
  const { layers: layerString, tabularLayerData } = useLayerStore();
  const { year } = useDateStore();
  const { ac, province } = useAreaStore();
  const queryClient = useQueryClient();

  // Parse active layer IDs from the store
  const activeLayerIds = layerString
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const parsedLayers = activeLayerIds
    .map(parseLayerId)
    .filter((layer): layer is NonNullable<ReturnType<typeof parseLayerId>> => layer !== null);

  // Fetch metadata for each active layer
  const datasetQueries = useQueries({
    queries: parsedLayers.map((layer) => ({
      queryKey: ["dataset-metadata", layer.dataType, layer.id],
      queryFn: () => fetchDatasetMetadata(layer.dataType, layer.id),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    })),
  });

  // Build legend layers from loaded metadata (don't wait for all to complete)
  // This keeps the legend mounted even when switching layers
  const legendLayers: LegendLayer[] = [];

  datasetQueries.forEach((query, index) => {
    // Only include layers that have successfully loaded
    if (query.data && !query.isError) {
      const dataset = query.data;
      const parsedLayer = parsedLayers[index];

      if (dataset.dataType === "tabular") {
        legendLayers.push(createTabularLegendLayer(dataset, tabularLayerData, year));
      } else if (dataset.dataType === "vector") {
        // Try to get the vector data from the query cache to determine geometry type
        const filters = new URLSearchParams();
        if (ac) filters.set("area_council", ac);
        if (province) filters.set("province", province);

        const vectorDataQueryKey = [
          "dataset",
          "vector",
          parsedLayer.id,
          new URLSearchParams(filters).toString(),
        ];

        const vectorData = queryClient.getQueryData<PaginatedVectorData>(vectorDataQueryKey);

        legendLayers.push(createVectorLegendLayer(dataset, vectorData));
      } else if (dataset.dataType === "raster") {
        legendLayers.push(createRasterLegendLayer(dataset));
      }
    }
  });

  return legendLayers;
}

/**
 * Creates a TabularLegendLayer with data range information.
 */
function createTabularLegendLayer(
  dataset: Dataset,
  tabularData: any[],
  year: string,
): TabularLegendLayer {
  // Calculate min/max from current filtered data
  const filteredData = tabularData.filter((item) => item.date.startsWith(year));
  const values = filteredData.map((item) => item.value).filter((v) => typeof v === "number");

  let dataRange: { min: number; max: number } | undefined;
  if (values.length > 0) {
    dataRange = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  return {
    id: dataset.id,
    name: dataset.name,
    dataType: "tabular",
    unit: dataset.unit,
    source: dataset.source,
    colorScheme: "sequential", // Could be made configurable
    dataRange,
  };
}

/**
 * Creates a VectorLegendLayer with geometry type and color.
 *
 * Analyzes the GeoJSON data to determine the primary geometry type.
 * Falls back to LineString if data is not available.
 */
function createVectorLegendLayer(
  dataset: Dataset,
  vectorData?: PaginatedVectorData,
): VectorLegendLayer {
  // Colors from VectorLayers.tsx:
  // - Lines: #f09000 (orange)
  // - Points: #3d4aff (blue)

  let geometryType: VectorLegendLayer["geometryType"] = "LineString";
  let color = "#f09000"; // Default to line color

  // Detect geometry type from the actual data
  if (vectorData && vectorData.features && vectorData.features.length > 0) {
    const firstFeature = vectorData.features[0];
    if (firstFeature.geometry) {
      geometryType = firstFeature.geometry.type as VectorLegendLayer["geometryType"];

      // Use point color for point geometries
      if (geometryType.includes("Point")) {
        color = "#3d4aff"; // Blue for points
      }
    }
  }

  return {
    id: dataset.id,
    name: dataset.name,
    dataType: "vector",
    unit: dataset.unit,
    source: dataset.source,
    geometryType,
    color,
  };
}

/**
 * Creates a RasterLegendLayer.
 */
function createRasterLegendLayer(dataset: Dataset): RasterLegendLayer {
  return {
    id: dataset.id,
    name: dataset.name,
    dataType: "raster",
    unit: dataset.unit,
    source: dataset.source,
    opacity: 1.0,
  };
}
