import { useState, useEffect } from "react";
import type { Dataset } from "@/types/api";

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

// Helper function to fetch all pages
const fetchAllPages = async (url: string): Promise<any[]> => {
  const allResults: any[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data: PaginatedResponse = await response.json();
    allResults.push(...data.results);
    nextUrl = data.next;
  }

  return allResults;
};

export const useDatasets = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);

        // Fetch all pages for both tabular and raster datasets in parallel
        const [tabularArray, rasterArray] = await Promise.all([
          fetchAllPages("/api/v1/tabular/"),
          fetchAllPages("/api/v1/raster/"),
        ]);

        // Combine and type the datasets
        const allDatasets: Dataset[] = [
          ...tabularArray.map((d: any) => ({ ...d, dataType: "tabular" as const })),
          ...rasterArray.map((d: any) => ({ ...d, dataType: "raster" as const })),
        ];

        setDatasets(allDatasets);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, []);

  return { datasets, loading, error };
};
