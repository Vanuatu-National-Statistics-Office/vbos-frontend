import * as HTTP from "./http";
import { PaginatedVectorData } from "@/types/api";

export interface DownloadResult {
  blob: Blob;
  extension: string;
  mimeType: string;
}

/**
 * Downloads tabular dataset as XLSX file using the dedicated endpoint
 * @param id - The dataset ID
 * @param filters - Optional query parameters for filtering data
 * @returns Object containing blob, file extension, and MIME type
 */
export async function downloadTabularDataset(
  id: number,
  filters?: URLSearchParams,
): Promise<DownloadResult> {
  const queryString = filters ? new URLSearchParams(filters).toString() : "";
  const url = `/api/v1/tabular/${id}/data/xlsx/${queryString ? `?${queryString}` : ""}`;

  const response = await HTTP.get(url);
  if (!response.ok) throw new Error(`Unable to fetch data from ${url}`);

  const blob = await response.blob();
  return {
    blob,
    extension: "xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
}

/**
 * Downloads vector dataset from cached query data as GeoJSON
 * @param cachedData - The cached vector data from queryClient
 * @returns Object containing blob, file extension, and MIME type
 */
export function downloadVectorDatasetFromCache(
  cachedData: PaginatedVectorData,
): DownloadResult {
  // Convert to GeoJSON FeatureCollection
  const geoJSON = {
    type: "FeatureCollection" as const,
    features: cachedData.features,
  };

  const geoJSONString = JSON.stringify(geoJSON, null, 2);
  return {
    blob: new Blob([geoJSONString], { type: "application/geo+json" }),
    extension: "geojson",
    mimeType: "application/geo+json",
  };
}

/**
 * Note: Raster datasets should be downloaded directly from their source file URLs.
 * The backend stores raster data as TIFF files which should be linked directly.
 * There is no conversion from TIFF to other formats client-side.
 */
