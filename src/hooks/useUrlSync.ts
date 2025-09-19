import { useEffect } from "react";
import { useMapStore } from "@/store/map-store";
import { useAreaStore } from "@/store/area-store";

export const useUrlSync = () => {
  const { syncFromUrl } = useMapStore();
  const { syncFromUrl: syncAreaFromUrl } = useAreaStore();

  useEffect(() => {
    // Sync from URL on mount
    syncFromUrl();
    syncAreaFromUrl();

    // Listen for URL changes (browser back/forward)
    const handlePopState = () => {
      syncFromUrl();
      syncAreaFromUrl();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncFromUrl, syncAreaFromUrl]);
};
