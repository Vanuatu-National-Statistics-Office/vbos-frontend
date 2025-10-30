import { useMemo } from "react";
import { useLayerStore } from "@/store/layer-store";
import { Dataset } from "@/types/api";

/**
 * Hook to count how many active layers belong to a given set of datasets.
 *
 * @param datasets - Array of datasets to check against active layers
 * @returns Object containing count of active layers and boolean if any are active
 *
 * @example
 * // For a cluster with multiple datasets
 * const { count, hasActive } = useActiveLayerCount(allDatasetsInCluster);
 *
 * @example
 * // For a dataset section
 * const { hasActive } = useActiveLayerCount(datasetsInSection);
 */
export function useActiveLayerCount(datasets: Dataset[] | undefined) {
  const { layers } = useLayerStore();

  const result = useMemo(() => {
    if (!datasets || datasets.length === 0 || !layers) {
      return { count: 0, hasActive: false };
    }

    // Get all dataset IDs from the provided datasets
    const datasetIds = new Set<number>();
    datasets.forEach((dataset) => {
      datasetIds.add(dataset.id);
    });

    // Parse active layer IDs from the store
    const activeLayerIds = layers
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    // Count how many active layers belong to these datasets
    let count = 0;
    activeLayerIds.forEach((layerId) => {
      // Extract numeric ID from layer string (e.g., "t1" -> 1)
      const numericId = Number(layerId.slice(1));
      if (datasetIds.has(numericId)) {
        count++;
      }
    });

    return {
      count,
      hasActive: count > 0,
    };
  }, [datasets, layers]);

  return result;
}
