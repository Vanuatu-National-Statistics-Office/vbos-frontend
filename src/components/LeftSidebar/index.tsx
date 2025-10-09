import { useMemo } from "react";
import { Indicators } from "./Indicators";
import { Sidebar } from "../Sidebar";
import { useClusters, useDatasets } from "@/hooks/useClusterData";
import type { ClusterWithDatasets, Dataset } from "@/types/api";

const LeftSidebar = () => {
  const { data: clusters, isPending: clustersLoading, error: clustersError } = useClusters();
  const { data: datasets, isPending: datasetsLoading, error: datasetsError } = useDatasets();

  // Transform API data into the structure expected by Indicators
  const sections = useMemo(() => {
    if (clustersLoading || datasetsLoading || !clusters || !datasets) {
      return [];
    }

    // Group datasets by cluster name
    const clusterMap = new Map<string, ClusterWithDatasets>();

    clusters.forEach((cluster) => {
      clusterMap.set(cluster.name, {
        ...cluster,
        datasets: [],
      });
    });

    datasets.forEach((dataset) => {
      const cluster = clusterMap.get(dataset.cluster);
      if (cluster) {
        cluster.datasets.push(dataset);
      }
    });

    // Transform to Indicators format with grouping by type
    return Array.from(clusterMap.values()).map((cluster) => {
      // Group datasets by type within this cluster
      const typeMap = new Map<string, Dataset[]>();

      cluster.datasets.forEach((dataset) => {
        // Use the API's type field (baseline, estimated_damage, etc.)
        // not the dataType field (tabular/raster)
        const type = dataset.type || "uncategorized";
        if (!typeMap.has(type)) {
          typeMap.set(type, []);
        }
        typeMap.get(type)!.push(dataset);
      });

      // Convert type groups to items
      return {
        title: cluster.name,
        items: Array.from(typeMap.entries()).map(([type, datasetsInType]) => ({
          title: type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          description: cluster.description || "",
          datasets: datasetsInType.map((dataset) => ({
            name: dataset.name,
            datasetId: dataset.id.toString(),
            type: dataset.dataType,
          })),
        })),
      };
    });
  }, [clusters, datasets, clustersLoading, datasetsLoading]);

  if (clustersError || datasetsError) {
    console.error("Clusters error:", clustersError);
    console.error("Datasets error:", datasetsError);
    return (
      <Sidebar direction="left" title="Data Layers">
        <div>Error loading data: {String(clustersError || datasetsError)}</div>
      </Sidebar>
    );
  }

  if (clustersLoading || datasetsLoading) {
    return (
      <Sidebar direction="left" title="Data Layers">
        <div>Loading...</div>
      </Sidebar>
    );
  }

  return (
    <Sidebar direction="left" title="Data Layers">
      <Indicators sections={sections} />
    </Sidebar>
  );
};

export { LeftSidebar };
