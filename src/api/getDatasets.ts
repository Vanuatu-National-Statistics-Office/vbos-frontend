import * as HTTP from "./http";
import {
  Dataset,
  BaseDataset,
  IListApiReponse,
  ClusterDatasets,
} from "@/types/api";

async function fetchAllDatasets(url: string): Promise<BaseDataset[]> {
  const allResults: BaseDataset[] = [];
  let currentUrl: string | null = url;

  while (currentUrl) {
    const response = await HTTP.get(currentUrl);
    if (!response.ok) throw new Error(`Unable to fetch data from ${url}`);

    const data: IListApiReponse<BaseDataset> = await response.json();
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
