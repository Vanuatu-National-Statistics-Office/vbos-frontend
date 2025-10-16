import { useEffect } from "react";
import { useMapStore } from "@/store/map-store";
import { useAreaStore } from "@/store/area-store";
import { useLayerStore } from "@/store/layer-store";

export const useUrlSync = () => {
  const { syncFromUrl } = useMapStore();
  const { syncFromUrl: syncAreaFromUrl } = useAreaStore();
  const { syncFromUrl: syncLayersFromUrl } = useLayerStore();

  useEffect(() => {
    // Sync from URL on mount
    syncFromUrl();
    syncAreaFromUrl();
    syncLayersFromUrl();

    // Listen for URL changes (browser back/forward)
    const handlePopState = () => {
      syncFromUrl();
      syncAreaFromUrl();
      syncLayersFromUrl();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [syncFromUrl, syncAreaFromUrl, syncLayersFromUrl]);
};
