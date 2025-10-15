import { useQuery } from "@tanstack/react-query";
import API from "@/api";

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
  const { isPending, error, data } = useQuery({
    queryKey: ["datasets", cluster],
    queryFn: () => API.getDatasets(cluster),
  });

  return {
    isPending,
    error,
    data,
  };
}

export { useClusters, useClusterDatasets };
