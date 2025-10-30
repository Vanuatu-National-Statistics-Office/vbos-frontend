import * as HTTP from "./http";
import { convertToCSV, convertToGeoJSON } from "@/utils/downloadHelpers";
import { TabularData } from "@/types/api";
import { Feature } from "geojson";

export type DownloadFormat = "csv" | "geojson" | "json";

export interface DownloadResult {
  blob: Blob;
  extension: string;
  mimeType: string;
}

/**
 * Downloads dataset data in the appropriate format
 * @param dataType - The type of dataset (tabular, raster, vector)
 * @param id - The dataset ID
 * @param filters - Optional query parameters for filtering data
 * @returns Object containing blob, file extension, and MIME type
 */
export async function downloadDataset(
  dataType: "tabular" | "raster" | "vector",
  id: number,
  filters?: URLSearchParams,
): Promise<DownloadResult> {
  const queryString = filters ? new URLSearchParams(filters).toString() : "";
  const url = `/api/v1/${dataType}/${id}/data/?page_size=500${queryString ? `&${queryString}` : ""}`;

  let allData: any[] = [];
  let currentUrl: string | null = url;

  // Fetch all paginated data
  while (currentUrl) {
    const response = await HTTP.get(currentUrl);
    if (!response.ok)
      throw new Error(`Unable to fetch data from ${currentUrl}`);

    const data = await response.json();

    // Extract results based on data type
    if (dataType === "vector" && data.features) {
      allData.push(...data.features);
    } else if ((dataType === "tabular" || dataType === "raster") && data.results) {
      allData.push(...data.results);
    }

    // Extract relative path from next URL if it exists
    currentUrl = data.next
      ? new URL(data.next).pathname + new URL(data.next).search
      : null;
  }

  // Convert data to appropriate format based on dataType
  if (dataType === "tabular") {
    // Convert tabular data to CSV
    const csvString = convertToCSV(allData as TabularData[]);
    return {
      blob: new Blob([csvString], { type: "text/csv" }),
      extension: "csv",
      mimeType: "text/csv",
    };
  } else if (dataType === "vector") {
    // Convert vector data to GeoJSON
    const geoJSONString = convertToGeoJSON(allData as Feature[]);
    return {
      blob: new Blob([geoJSONString], { type: "application/geo+json" }),
      extension: "geojson",
      mimeType: "application/geo+json",
    };
  } else {
    // For raster, return as JSON (until we have direct TIFF access)
    const jsonString = JSON.stringify(allData, null, 2);
    return {
      blob: new Blob([jsonString], { type: "application/json" }),
      extension: "json",
      mimeType: "application/json",
    };
  }
}
