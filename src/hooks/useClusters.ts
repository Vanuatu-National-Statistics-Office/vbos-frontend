import { useQuery } from "@tanstack/react-query";
import API from "@/api";
import { useLayerStore } from "@/store/layer-store";
import { useEffect } from "react";

function useClusters() {
  const { isPending, error, data } = useQuery({
    queryKey: ["clusters"],
    queryFn: () => API.getClusters(),
  });

  return {
    isPending,
    error,
    data,
  };
}

function useClusterDatasets(cluster: string) {
  const { setAllDatasets } = useLayerStore();
  const { isPending, error, data } = useQuery({
    queryKey: ["datasets", cluster],
    queryFn: () => API.getDatasets(cluster),
  });

  useEffect(() => {
    if (data) {
      data.map((t) => setAllDatasets(t.datasets));
    }
  }, [data, setAllDatasets]);

  return {
    isPending,
    error,
    data,
  };
}

export { useClusters, useClusterDatasets };
