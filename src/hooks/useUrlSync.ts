import { useEffect } from "react";
import { useMapStore } from "@/store/map-store";

export const useUrlSync = () => {
  const { syncFromUrl } = useMapStore();

  useEffect(() => {
    // Sync from URL on mount
    syncFromUrl();

    // Listen for URL changes (browser back/forward)
    const handlePopState = () => {
      syncFromUrl();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncFromUrl]);
};
