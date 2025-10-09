import { useState, useEffect } from "react";
import type { Cluster } from "@/types/api";

export const useClusters = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1/cluster/");
        if (!response.ok) {
          throw new Error(`Failed to fetch clusters: ${response.statusText}`);
        }
        const data = await response.json();
        // Handle both array and paginated response formats
        setClusters(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  return { clusters, loading, error };
};
