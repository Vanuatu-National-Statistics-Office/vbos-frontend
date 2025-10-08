import { useQuery } from "@tanstack/react-query";
import API from "@/api";

function useAreaCouncils(province: string) {
  const { isPending, error, data } = useQuery({
    queryKey: ["observation", province],
    queryFn: () => API.getAreaCouncils(province),
  });

  return {
    isPending,
    error,
    data,
  };
}

export default useAreaCouncils;
