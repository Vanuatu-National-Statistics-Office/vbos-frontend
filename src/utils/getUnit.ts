import { TabularData } from "@/types/api";

/**
 * Extracts the unit from tabular data.
 * The API returns the Unit field with whitespace, so we trim it.
 * Returns the first non-empty unit found in the dataset.
 *
 * @param data - Array of TabularData
 * @returns Trimmed unit string, or undefined if no unit found
 */
export function getUnit(data: TabularData[]): string | undefined {
  if (data.length === 0) return undefined;

  // Find the first item with a non-empty Unit field
  const itemWithUnit = data.find((item) => item.Unit && item.Unit.trim());

  return itemWithUnit?.Unit?.trim();
}
