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

function useDatasets() {
  const { isPending, error, data } = useQuery({
    queryKey: ["datasets"],
    queryFn: () => API.getDatasets(),
  });

  return {
    isPending,
    error,
    data,
  };
}

export { useClusters, useDatasets };
