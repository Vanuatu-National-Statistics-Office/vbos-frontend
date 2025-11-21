import { useEffect, useState } from "react";

// It checks if the raster layer is available for a specific year
export function useCheckRasterLayer(dataset_url_id: string, year: string) {
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(false);
  const url = `${import.meta.env.VITE_TITILER_API}/dataset/${dataset_url_id}/years/${year || "2024"}/tiles?f=json`;

  useEffect(() => {
    setIsloading(true);
    fetch(url)
      .then((res) => {
        if (res.ok) {
          setError(false);
          setIsloading(false);
        } else {
          setError(true);
          setIsloading(false);
        }
      })
      .catch(() => {
        setError(true);
        setIsloading(false);
      });
  }, [url]);

  return { error, isLoading };
}
