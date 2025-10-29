import * as HTTP from "./http";
import {
  Dataset,
  BaseDataset,
  IListApiResponse,
  ClusterDatasets,
  PaginatedVectorData,
  TabularData,
} from "@/types/api";

async function fetchAllDatasets(url: string): Promise<BaseDataset[]> {
  const allResults: BaseDataset[] = [];
  let currentUrl: string | null = url;

  while (currentUrl) {
    const response = await HTTP.get(currentUrl);
    if (!response.ok) throw new Error(`Unable to fetch data from ${url}`);

    const data: IListApiResponse<BaseDataset> = await response.json();
    allResults.push(...data.results);

    // Extract relative path from next URL if it exists
    currentUrl = data.next
      ? new URL(data.next).pathname + new URL(data.next).search
      : null;
  }

  return allResults;
}

export async function getDatasets(cluster: string): Promise<ClusterDatasets[]> {
  // Fetch all pages for both tabular and raster datasets in parallel
  const [tabularData, rasterData, vectorData] = await Promise.all([
    fetchAllDatasets(`/api/v1/tabular/?cluster=${encodeURIComponent(cluster)}`),
    fetchAllDatasets(`/api/v1/raster/?cluster=${encodeURIComponent(cluster)}`),
    fetchAllDatasets(`/api/v1/vector/?cluster=${encodeURIComponent(cluster)}`),
  ]);

  // Add dataType discriminator
  const allDatasets: Dataset[] = [
    ...tabularData.map((d) => ({ ...d, dataType: "tabular" as const })),
    ...rasterData.map((d) => ({ ...d, dataType: "raster" as const })),
    ...vectorData.map((d) => ({ ...d, dataType: "vector" as const })),
  ];
  const groupedByType: ClusterDatasets[] = allDatasets.reduce(
    (acc: ClusterDatasets[], item: Dataset) => {
      const existingType: ClusterDatasets | undefined = acc.find(
        (group: ClusterDatasets) => group.type === item.type,
      );

      if (existingType) {
        existingType.datasets.push(item);
      } else {
        acc.push({
          type: item.type,
          datasets: [item],
        });
      }

      return acc;
    },
    [],
  );

  return groupedByType;
}

interface ListApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TabularData[];
}

/**
 * Fetches metadata for a single dataset.
 * This function should be used whenever you need dataset information (name, unit, source, etc.)
 * without fetching the actual data.
 */
export async function getLayerMetadata(
  dataType: "vector" | "tabular" | "raster",
  id: number,
): Promise<Dataset> {
  const response = await HTTP.get(`/api/v1/${dataType}/${id}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${dataType} dataset ${id}`);
  }
  const data = await response.json();
  return { ...data, dataType } as Dataset;
}

export async function getDatasetData(
  dataType: "tabular" | "vector",
  id: number,
  filters?: URLSearchParams,
) {
  let allResults: PaginatedVectorData | ListApiResponse | null = null;
  const queryString = filters ? new URLSearchParams(filters).toString() : "";
  const url = `/api/v1/${dataType}/${id}/data/?page_size=500${queryString ? `&${queryString}` : ""}`;

  let currentUrl: string | null = url;

  while (currentUrl) {
    const response = await HTTP.get(currentUrl);
    if (!response.ok)
      throw new Error(`Unable to fetch data from ${currentUrl}`);

    const data = await response.json();

    if (!allResults) {
      allResults = data;
    } else {
      if (dataType === "vector" && "features" in allResults) {
        (allResults as PaginatedVectorData).features.push(...data.features);
      }
      if (dataType === "tabular" && "results" in allResults) {
        (allResults as ListApiResponse).results.push(...data.results);
      }
    }

    // Extract relative path from next URL if it exists
    currentUrl = data.next
      ? new URL(data.next).pathname + new URL(data.next).search
      : null;
  }

  return allResults as PaginatedVectorData | ListApiResponse;
}
