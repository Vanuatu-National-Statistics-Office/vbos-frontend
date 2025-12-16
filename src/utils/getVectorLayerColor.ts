/**
 * Utility to get a consistent color for a vector layer based on its ID and geometry type.
 *
 * This ensures that the same vector layer always gets the same color
 * in both the map rendering and the legend.
 */

import { mapColors } from "@/components/colors";

// Array of available colors for vector layers
const vectorColorPalette = [
  mapColors.blue,
  mapColors.orange,
  mapColors.green,
  mapColors.violet,
  mapColors.red,
  mapColors.teal,
  mapColors.gray,
  mapColors.blueLight,
  mapColors.yellow,
  mapColors.indigo,
  mapColors.mint,
  mapColors.brown,
  mapColors.black,
  mapColors.pink,
  mapColors.purple,
];

/**
 * Get a consistent color for a vector layer based on its ID.
 * Uses modulo to cycle through available colors if there are many layers.
 *
 * @param layerId - The numeric ID of the vector layer
 * @returns Hex color string
 */
export function getVectorLayerColor(layerId: number): string {
  return vectorColorPalette[layerId % vectorColorPalette.length];
}
