/**
 * Hook for preparing legend data from active map layers.
 *
 * This hook reads metadata from the layer store
 * since the metadata is already loaded by the left sidebar.
 *
 * Architecture:
 * - Reads active layer IDs from the layer store (URL-synced)
 * - Gets metadata from the store's allDatasets
 * - Enriches with visualization metadata (colors, data ranges, etc.)
 * - Returns array of LegendLayer objects ready for display
 */

import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { useLayerStore } from "@/store/layer-store";
import { useAreaStore } from "@/store/area-store";
import { useDateStore } from "@/store/date-store";
import { useAdminAreaStats } from "@/hooks/useAdminAreaStats";
import useProvinces from "@/hooks/useProvinces";
import { featureCollection } from "@turf/helpers";
import type {
  LegendLayer,
  TabularLegendLayer,
  VectorLegendLayer,
  RasterLegendLayer,
} from "@/components/Map/Legend/types";
import type { Dataset, PaginatedVectorData } from "@/types/api";

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
  const { layers: layerString, getLayerMetadata, tabularLayerData } = useLayerStore();
  const { ac, province, acGeoJSON } = useAreaStore();
  const { year } = useDateStore();
  const { data: provincesGeojson } = useProvinces();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  // Get min/max values from the same source as the map rendering
  const { minValue, maxValue } = useAdminAreaStats(
    province ? acGeoJSON : provincesGeojson || featureCollection([]),
  );

  // Parse active layer IDs from the store
  const activeLayerIds = layerString
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  // Build legend layers from the store metadata
  const legendLayers: LegendLayer[] = [];

  activeLayerIds.forEach((layerId) => {
    // Get metadata from the store
    const dataset = getLayerMetadata(layerId);

    // Only include layers that have metadata loaded
    if (dataset) {
      if (dataset.dataType === "tabular") {
        // Check if we're currently fetching data for this dataset
        const filters = new URLSearchParams();
        if (ac) filters.set("area_council", ac);
        if (province) filters.set("province", province);

        const queryKey = [
          "dataset",
          "tabular",
          dataset.id,
          filters.toString(),
        ];

        // Check if this specific query is fetching
        const isPending = isFetching > 0 && queryClient.isFetching({ queryKey }) > 0;

        // Check if there's data for the current year
        const filteredData = tabularLayerData.filter((i) => i.date.startsWith(year));
        const hasData = filteredData.length > 0;

        legendLayers.push(createTabularLegendLayer(dataset, minValue, maxValue, isPending, hasData));
      } else if (dataset.dataType === "vector") {
        // Try to get the vector data from the query cache to determine geometry type
        const filters = new URLSearchParams();
        if (ac) filters.set("area_council", ac);
        if (province) filters.set("province", province);

        const vectorDataQueryKey = [
          "dataset",
          "vector",
          dataset.id,
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
 * Uses minValue and maxValue from useAdminAreaStats to match the actual rendered map values.
 */
function createTabularLegendLayer(
  dataset: Dataset,
  minValue: number,
  maxValue: number,
  isPending: boolean,
  hasData: boolean,
): TabularLegendLayer {
  // Use the same min/max values that are used for map rendering
  let dataRange: { min: number; max: number } | undefined;
  if (maxValue > 0) {
    dataRange = {
      min: minValue,
      max: maxValue,
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
    isPending,
    hasData,
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
