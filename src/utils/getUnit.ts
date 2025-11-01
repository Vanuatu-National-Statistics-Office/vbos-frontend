import { TabularData } from "@/types/api";
import { abbreviateUnit } from "./abbreviateUnit";

/**
 * Extracts the unit from tabular data and abbreviates it.
 * The API returns the Unit field with whitespace, so we trim it.
 * Returns the first non-empty unit found in the dataset, abbreviated.
 *
 * @param data - Array of TabularData
 * @returns Abbreviated unit string, or undefined if no unit found
 *
 * @example
 * getUnit(data) // "kg" (from "kilogram")
 * getUnit(data) // "km" (from "kilometer")
 */
export function getUnit(data: TabularData[]): string | undefined {
  if (data.length === 0) return undefined;

  // Find the first item with a non-empty Unit field
  const itemWithUnit = data.find((item) => item.Unit && item.Unit.trim());

  const trimmedUnit = itemWithUnit?.Unit?.trim();
  return abbreviateUnit(trimmedUnit);
}
