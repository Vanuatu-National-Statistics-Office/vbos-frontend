import { TabularData } from "@/types/api";
import { Feature } from "geojson";

/**
 * Converts tabular data to CSV format
 */
export function convertToCSV(data: TabularData[]): string {
  if (data.length === 0) return "";

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header as keyof TabularData];
      // Escape values that contain commas, quotes, or newlines
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Converts vector features to GeoJSON format
 */
export function convertToGeoJSON(features: Feature[]): string {
  const geoJSON = {
    type: "FeatureCollection",
    features: features,
  };
  return JSON.stringify(geoJSON, null, 2);
}

/**
 * Triggers a file download in the browser
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Sanitizes filename by replacing spaces with underscores
 */
export function sanitizeFilename(name: string): string {
  return name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "");
}
