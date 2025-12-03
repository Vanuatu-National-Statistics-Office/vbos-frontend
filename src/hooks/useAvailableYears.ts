/**
 * Hook to extract available years from loaded tabular dataset data.
 *
 * This hook analyzes the tabularLayerData in the layer store to determine
 * which years have data available. It extracts years from the date field
 * of all loaded tabular data rows before any year filtering is applied.
 *
 * @returns Array of unique years (as numbers) that have data available, sorted ascending
 *
 * @example
 * ```tsx
 * const availableYears = useAvailableYears();
 * // Returns: [2010, 2015, 2018, 2020, 2023]
 * ```
 */

import { useLayerStore } from "@/store/layer-store";

export function useAvailableYears(): number[] {
  const { tabularLayerData } = useLayerStore();

  // Extract unique years from tabular data
  const yearsSet = new Set<number>();

  tabularLayerData.forEach((row) => {
    // Extract year from date string (format: "YYYY-MM-DD")
    const year = parseInt(row.date.substring(0, 4), 10);
    if (!isNaN(year)) {
      yearsSet.add(year);
    }
  });

  // Convert to array and sort
  return Array.from(yearsSet).sort((a, b) => a - b);
}
